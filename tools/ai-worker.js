// Loom AI helper — a Cloudflare Worker (free plan: 100 000 requests a day) that lets Loom ask Google Gemini (free plan).
// Jobs:
//   - the robot's chat (default): { question, lang, section, teacher, history, knowledge } → { answer }
//   - job "writing" (the Writing Journey's AI check, 2026-11-09): { job: 'writing', text, topic, instruction, minWords,
//     maxWords, words: [asked words] } → { result: { scores {grammar, vocabulary, structure, task}, praise [2–3], mistakes
//     [{wrong, right, why}] (≤ 5), better [{word, instead, why}], tips [3], betterVersion } }. Marked generously (2026-11-13).
//     Loom itself counts the words, checks the asked words and works out the final score — the AI only gives the four
//     part scores and the feedback.
//   - the waiting list (2026-11-12, needs a KV storage bound as LOOM_KV): a student's writing is put on it ("queue"),
//     a timer (Cron Trigger every 5 minutes → `scheduled`) checks the 5 oldest that are due, "feedback" says what is ready,
//     "check" checks one now (the teacher's button). The check never fails a student: a writing that couldn't be checked
//     stays waiting, and tries again later and later (5 min × 2^tries, at most 6 h), so a few broken ones never block the rest.
//     "queue" and "check" read the writing itself from the database (Firestore REST, `results/<id>`, must be a
//     'Writing course') and use ITS text, word limits and asked words — the request's copy is never trusted.
// It keeps the Gemini API key secret: the key is saved in Cloudflare as the secret GEMINI_API_KEY, never in the repo or the
// website. ALLOWED_ORIGINS only stops other websites' pages from using it inside a browser — it is NOT protection (any script
// can send any Origin), which is why the writing is read from the database and each visitor (IP) is limited per minute
// (8 chat questions, 40 old-style writing checks, 30 queue, 60 feedback, 10 check). Answers are kept short.
//
// Set up (once): Google AI Studio (aistudio.google.com) → Get API key → Create API key. Cloudflare dashboard → Workers & Pages →
// Create → "Hello World" worker named loom-ai → Edit code → paste this file → Deploy. Then Settings → Variables and Secrets →
// Add → Secret, name GEMINI_API_KEY, value = the key. Its address goes into TA_AI_URL (js/common.js) and SK_AI_URL
// (js/skill-player.js). Check: https://loom-ai.<name>.workers.dev/status. Optional: a plain variable GEMINI_MODEL.
// Free plan: Google may use what is sent to improve its products — no students' private details.

const ALLOWED_ORIGINS = ['https://baxod1rovvf.github.io'];
const VERSION = '2026-11-13b';
const DEFAULT_MODEL = 'gemini-flash-lite-latest';   // Google's fastest model on the free plan (answers in a few seconds)
const PER_MODEL_SECONDS = 18, TOTAL_SECONDS = 40;   // Loom waits 60 s, so the helper always answers before that
const PER_MINUTE = { chat: 8, writing: 40, queue: 30, feedback: 60, check: 10 };          // per visitor (IP) per minute, kept in this worker's memory
const seen = new Map();

function cors(origin) {
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
}
function reply(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: Object.assign({ 'Content-Type': 'application/json' }, cors(origin)) });
}
function tooMany(ip, job) {
  const key = job + '|' + ip, now = Date.now();
  const times = (seen.get(key) || []).filter(t => now - t < 60000);
  if (times.length >= PER_MINUTE[job]) return true;
  times.push(now); seen.set(key, times);
  return false;
}

// Google's answer means the key itself is refused (401/403, or a 400 that says so — "API key not valid"): no writing's fault.
function keyRefused(status, why) { return status === 401 || status === 403 || (status === 400 && /api[ _]?key/i.test(why || '')); }

// Asks Gemini: the first model that answers wins (a 404 = no such model here → the next; a slow one gives way to the next).
// → { ok: true, text } or { ok: false, status, error, googleStatus } (googleStatus = Google's own HTTP status, when it answered)
async function askGemini(env, system, contents, config) {
  const models = [env.GEMINI_MODEL, DEFAULT_MODEL, 'gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-flash-latest', 'gemini-2.5-flash']
    .filter((m, i, a) => m && a.indexOf(m) === i);
  const started = Date.now();
  let res = null, why = '';
  for (const model of models) {
    const left = TOTAL_SECONDS * 1000 - (Date.now() - started);
    if (left < 3000) { why = why || 'Google took too long'; res = null; break; }
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), Math.min(PER_MODEL_SECONDS * 1000, left));
    try {
      res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent', {
        method: 'POST', signal: ctrl.signal,
        headers: { 'x-goog-api-key': env.GEMINI_API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: config })
      });
    } catch (e) { clearTimeout(timer); res = null; why = model + ' took too long'; continue; }
    clearTimeout(timer);
    if (res.ok) break;
    try { why = ((await res.json()).error || {}).message || ''; } catch (e) { why = ''; }
    if (res.status !== 404) break;
  }
  if (!res) return { ok: false, status: 504, error: 'Google took too long (' + why + ')' };
  if (!res.ok) {
    const plain = res.status === 400 || res.status === 403 ? 'Google refused the key' : res.status === 429 ? "today's free limit is used up" : 'Google is busy';
    return { ok: false, status: 502, googleStatus: res.status, error: plain + ' (' + res.status + (why ? ': ' + why.slice(0, 160) : '') + ')' };
  }
  const data = await res.json();
  const parts = (((data.candidates || [])[0] || {}).content || {}).parts || [];
  return { ok: true, text: parts.filter(p => typeof p.text === 'string' && !p.thought).map(p => p.text).join('').trim() };
}

// ---------- the robot's chat ----------
async function chat(q, env, origin) {
  const question = String(q.question || '').slice(0, 1000).trim();
  if (!question) return reply({ error: 'No question' }, 400, origin);
  const lang = { uz: 'Uzbek (Latin script)', ru: 'Russian' }[q.lang] || 'English';
  const knowledge = String(q.knowledge || '').slice(0, 16000);
  const history = (Array.isArray(q.history) ? q.history : []).slice(-8)
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
    .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text.slice(0, 2000) }] }));
  while (history.length && history[0].role !== 'user') history.shift();
  const system =
    'You are Loom AI, the assistant inside Loom — a web app an English teacher uses to build interactive exercises, run a ' +
    'skills course, follow students\' results and points. The teacher (' + String(q.teacher || 'the teacher').slice(0, 60) + ') ' +
    'is not a developer: answer in plain, friendly words, short (a few sentences or a short list), and use the real button names. ' +
    'You can also help with teaching itself: warm-up questions, gap-fill sentences, word lists, lesson ideas, checking a ' +
    'student\'s sentence. Answer in ' + lang + '. The teacher is now in the "' + String(q.section || '').slice(0, 40) + '" section. ' +
    'For questions about how Loom works, rely only on the notes below; if they don\'t cover it, say you are not sure and suggest ' +
    'writing to Toxirjon on Telegram. Never invent buttons or features.\n\nNOTES ABOUT LOOM:\n' + knowledge;
  const r = await askGemini(env, system, history.concat([{ role: 'user', parts: [{ text: question }] }]), { maxOutputTokens: 1500, temperature: 0.6 });
  if (!r.ok) return reply({ error: r.error }, r.status, origin);
  return reply({ answer: r.text }, 200, origin);
}

// ---------- the Writing Journey's AI check ----------
const clip = (v, n) => String(v == null ? '' : v).slice(0, n);
const ID_RE = /^sk_[A-Za-z0-9_-]{1,140}$/;

// Loom's band from the four part scores: −0.5 only when under the minimum, kept to 1–9, nearest 0.5.
// Must stay the same as skWritingAiBand in js/skill-bands.js.
function aiBand(scores, words, minWords) {
  const part = (v, max) => { v = Number(v); return isFinite(v) ? Math.max(0, Math.min(max, v)) : 0; };
  const s = scores || {};
  let total = part(s.grammar, 3) + part(s.vocabulary, 2) + part(s.structure, 2) + part(s.task, 2);
  if (minWords > 0 && words < minWords) total -= 0.5;
  return Math.max(1, Math.min(9, Math.round(total * 2) / 2));
}

// Does the work: asks Gemini and checks the shape. → { result } or { error, status } (no Response, so the timer can use it too)
async function checkWriting(q, env) {
  const text = clip(q.text, 6000).trim();
  if (!text) return { error: 'No text', status: 400 };
  const asked = (Array.isArray(q.words) ? q.words : []).slice(0, 12).map(w => clip(w, 40));
  // A generous examiner (teacher, 2026-11-13: the check was too strict — students should feel motivated). The rules and the
  // score guide are the teacher's ("Generous Examiner"); the four parts add up to the score, so the guide decides the band.
  const system =
    'You are a GENEROUS, encouraging English examiner checking a short writing by an A1+–A2 student (a teenager learning English). ' +
    'Your aim is to motivate the student. Mark with this 9-point system: grammar accuracy 0–3, vocabulary usage 0–2 (including how ' +
    'the asked words are used), sentence structure and coherence 0–2, task completion 0–2 (does it answer the topic and instruction?). ' +
    'Use halves (e.g. 2.5). FIRST decide the overall score with this guide, THEN give part scores that add up to it: ' +
    'excellent, almost no mistakes = 9; good, a few minor mistakes = 8–8.5; understandable, some grammar mistakes = 7–7.5; ' +
    'several mistakes but the task is completed = 6–6.5; difficult to understand or incomplete = 5 or below. ' +
    'Rules: grade generously and positively; never hunt for mistakes; never take marks off twice for the same mistake; meaning ' +
    'matters more than perfect accuracy; simple English is fine — simple but correct sentences are NOT mistakes; small spelling, ' +
    'punctuation and capital-letter slips barely count; when you are not sure something is a mistake, do not deduct and do not list it. ' +
    'Never invent mistakes or correct natural English. List only the most important mistakes, at most 5: for each give the ' +
    'student\'s whole sentence as it is, the corrected sentence, and a very simple, kind explanation (tenses, articles, ' +
    'prepositions, subject-verb agreement, word order, sentence structure; ignore extra spaces and names). ' +
    'Give 2–3 short, specific things the student did well ("praise"). Suggest a few better words only where a word is too basic, ' +
    'repeated or unnatural (e.g. "very good" → "excellent", "very tired" → "exhausted"), at A2 level, with a short reason — these ' +
    'are optional and not mistakes. Give exactly three short, encouraging tips for the next writing. Write "betterVersion": the ' +
    'student\'s own writing rewritten a little better — keep their ideas, order and length, keep it at their level (A2), fix the ' +
    'mistakes and improve a few words; do not add new ideas. Write all explanations in simple, friendly English. ' +
    'Reply with JSON only, exactly: {"scores":{"grammar":0,"vocabulary":0,"structure":0,"task":0},"praise":["",""],' +
    '"mistakes":[{"wrong":"","right":"","why":""}],"better":[{"word":"","instead":"","why":""}],"tips":["","",""],"betterVersion":""}';
  const prompt = 'Topic: ' + clip(q.topic, 120) + '\nInstruction: ' + clip(q.instruction, 400) +
    '\nWord limit: ' + (Number(q.minWords) || 0) + '–' + (Number(q.maxWords) || 0) + ' words' +
    '\nAsked words (the student must use them): ' + asked.join(', ') +
    '\n\nThe student\'s writing:\n"""\n' + text + '\n"""';
  const r = await askGemini(env, system, [{ role: 'user', parts: [{ text: prompt }] }],
    { maxOutputTokens: 4000, temperature: 0.2, responseMimeType: 'application/json' });
  if (!r.ok) return { error: r.error, status: r.status, googleStatus: r.googleStatus };
  let out;
  try { out = JSON.parse(r.text.replace(/^```(?:json)?\s*|\s*```$/g, '')); } catch (e) { return { error: 'The AI did not answer in the right shape', status: 502 }; }
  const num = (v, max) => { v = Number(v); return isFinite(v) ? Math.max(0, Math.min(max, Math.round(v * 2) / 2)) : 0; };
  const s = out.scores || {};
  const list = (a, n) => (Array.isArray(a) ? a : []).slice(0, n);
  const result = {
    scores: { grammar: num(s.grammar, 3), vocabulary: num(s.vocabulary, 2), structure: num(s.structure, 2), task: num(s.task, 2) },
    praise: list(out.praise, 3).map(t => clip(t, 200)).filter(Boolean),
    mistakes: list(out.mistakes, 5).map(m => ({ wrong: clip(m && m.wrong, 400), right: clip(m && m.right, 400), why: clip(m && m.why, 300) }))
      .filter(m => m.wrong && m.right && m.wrong.trim() !== m.right.trim()),
    better: list(out.better, 8).map(b => ({ word: clip(b && b.word, 60), instead: clip(b && b.instead, 60), why: clip(b && b.why, 200) })).filter(b => b.word && b.instead),
    tips: list(out.tips, 3).map(t => clip(t, 200)).filter(Boolean),
    betterVersion: clip(out.betterVersion, 3000).trim()
  };
  result.words = text.split(/\s+/).length;
  result.band = aiBand(result.scores, result.words, Number(q.minWords) || 0);
  return { result };
}
// the old job, kept for pages still open in a browser
async function writing(q, env, origin) {
  const r = await checkWriting(q, env);
  return r.error ? reply({ error: r.error }, r.status, origin) : reply({ result: r.result }, 200, origin);
}

// ---------- the waiting list (KV: q:<id> = waiting writing, f:<id> = its feedback) ----------
// The writing is read from the database itself, so nobody can have a made-up text checked under a student's id. The key is
// the public one the students' pages and play.html use (the database can be read by anyone; the rules only lock writes).
const FS_DOC = 'https://firestore.googleapis.com/v1/projects/teachers-assistant-app-ccd1a/databases/(default)/documents/results/';
const FS_KEY = 'AIzaSyCefg2YghdSneABh0ZOUu3-snO4soVw0lA';
function fsPlain(v) {   // a Firestore REST value → plain JS
  if (!v || typeof v !== 'object') return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('arrayValue' in v) return ((v.arrayValue || {}).values || []).map(fsPlain);
  if ('mapValue' in v) { const o = {}, f = (v.mapValue || {}).fields || {}; for (const k of Object.keys(f)) o[k] = fsPlain(f[k]); return o; }
  return null;
}
// → { writing: { text, minWords, maxWords, words } } | { missing: true } (no such record, or not a writing) | { error } (couldn't ask)
async function readWriting(id) {
  let res;
  const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 10000);
  try { res = await fetch(FS_DOC + encodeURIComponent(id) + '?key=' + FS_KEY, { signal: ctrl.signal }); }
  catch (e) { clearTimeout(timer); return { error: 'The database could not be reached' }; }
  clearTimeout(timer);
  if (res.status === 404) return { missing: true };
  if (!res.ok) return { error: 'The database answered ' + res.status };
  let doc;
  try { doc = await res.json(); } catch (e) { return { error: 'The database answered in a strange way' }; }
  const f = fsPlain({ mapValue: { fields: (doc && doc.fields) || {} } });
  if (f.type !== 'Writing course') return { missing: true };
  const asked = f.asked && typeof f.asked === 'object' ? f.asked : {};
  return { writing: { text: String(f.text || ''), minWords: Number(f.minWords) || 0, maxWords: Number(f.maxWords) || 0,
    words: [].concat(Array.isArray(asked.used) ? asked.used : [], Array.isArray(asked.missing) ? asked.missing : []).map(String) } };
}
// What is kept of a writing sent for checking (text ≤ 6 000 characters).
function cleanWriting(q) {
  return { id: q.id, text: clip(q.text, 6000), topic: clip(q.topic, 120), instruction: clip(q.instruction, 400),
    minWords: Number(q.minWords) || 0, maxWords: Number(q.maxWords) || 0,
    words: (Array.isArray(q.words) ? q.words : []).slice(0, 12).map(w => clip(w, 40)) };
}
// the request's topic/instruction + the database's text, word limits and asked words
const withStored = (q, stored) => Object.assign({}, q, stored);
async function saveFeedback(env, id, result) {
  await env.LOOM_KV.put('f:' + id, JSON.stringify(Object.assign({}, result, { checkedAt: new Date().toISOString() })));
  await env.LOOM_KV.delete('q:' + id);
}
// how long a writing waits after its n-th failed try: 5 min, 10, 20, … never more than 6 hours
const RETRY_MS = 5 * 60000, RETRY_MAX_MS = 6 * 3600000;
const retryAfter = tries => Math.min(RETRY_MAX_MS, RETRY_MS * Math.pow(2, Math.max(0, tries - 1)));
async function queueJob(q, env, origin) {
  if (!ID_RE.test(String(q.id || ''))) return reply({ error: 'Bad id' }, 400, origin);
  if (await env.LOOM_KV.get('f:' + q.id)) return reply({ done: true }, 200, origin);
  if (await env.LOOM_KV.get('q:' + q.id)) return reply({ queued: true }, 200, origin);   // already waiting: never overwritten
  const rec = await readWriting(q.id);
  if (rec.missing) return reply({ error: 'No writing with this id' }, 404, origin);
  // the database can't be reached: keep the request's copy, marked — the timer reads the record before checking it
  const w = rec.writing ? withStored(cleanWriting(q), rec.writing) : Object.assign(cleanWriting(q), { unverified: true });
  if (!String(w.text || '').trim()) return reply({ error: 'No text' }, 400, origin);
  if (String(w.text).length > 6000) return reply({ error: 'The text is too long' }, 400, origin);
  w.words = w.words.slice(0, 12).map(x => clip(x, 40));
  const at = new Date().toISOString();
  // metadata lets the timer sort the waiting list from one list() call, without reading every writing (no `next` = due now)
  await env.LOOM_KV.put('q:' + q.id, JSON.stringify(Object.assign(w, { at, tries: 0, lastError: '' })), { metadata: { at, tries: 0 } });
  return reply({ queued: true }, 200, origin);
}
async function feedbackJob(q, env, origin) {
  const ids = (Array.isArray(q.ids) ? q.ids : []).slice(0, 60).filter(id => ID_RE.test(String(id)));
  const states = {};
  for (const id of ids) {
    const f = await env.LOOM_KV.get('f:' + id, 'json');
    if (f) { states[id] = { state: 'done', result: f }; continue; }
    const w = await env.LOOM_KV.get('q:' + id, 'json');
    states[id] = w ? { state: 'waiting', tries: w.tries || 0, lastError: w.lastError || '' } : { state: 'unknown' };
  }
  return reply({ states }, 200, origin);
}
// The teacher's "Check now": checks one writing at once (the database's copy). A failure leaves it waiting.
async function checkJob(q, env, origin) {
  if (!ID_RE.test(String(q.id || ''))) return reply({ error: 'Bad id' }, 400, origin);
  const rec = await readWriting(q.id);
  if (rec.missing) return reply({ error: 'No writing with this id' }, 404, origin);
  if (rec.error) return reply({ error: rec.error + ' — try again in a minute' }, 502, origin);
  const r = await checkWriting(withStored(cleanWriting(q), rec.writing), env);
  if (r.error) return reply({ error: r.error }, r.status, origin);
  await saveFeedback(env, q.id, r.result);
  return reply({ result: r.result }, 200, origin);
}

// The timer: one list() (the free plan allows only ~1 000 a day), the `max` oldest writings that are due (`next` passed or
// none) checked one after another. Google's daily limit (429) or a refused key stops the run at once, and that writing
// is not counted as a try (not its fault; nothing is written — KV writes are limited too). Any other failure keeps the
// writing with tries + 1, the reason and a later `next`.
async function runQueue(env, max = 5) {
  const out = { checked: 0, failed: 0, stopped: false };
  if (!env.LOOM_KV || !env.GEMINI_API_KEY) return out;
  const now = Date.now();
  const listed = await env.LOOM_KV.list({ prefix: 'q:', limit: 1000 });
  const due = k => { const n = Date.parse((k.metadata || {}).next || ''); return !(n > now); };
  const keys = listed.keys.filter(due)
    .sort((a, b) => String((a.metadata || {}).at || '').localeCompare(String((b.metadata || {}).at || ''))).slice(0, max);
  for (const k of keys) {
    const q = await env.LOOM_KV.get(k.name, 'json');
    if (!q) continue;
    let r;
    if (q.unverified) {   // queued while the database couldn't be reached: read the real writing first
      const rec = await readWriting(q.id);
      if (rec.missing) { await env.LOOM_KV.delete(k.name); continue; }   // not a writing after all: dropped
      if (rec.writing) { Object.assign(q, rec.writing); q.words = q.words.slice(0, 12).map(x => clip(x, 40)); delete q.unverified; }
      else r = { error: rec.error };
    }
    if (!r) r = await checkWriting(q, env);
    if (r.result) { await saveFeedback(env, q.id, r.result); out.checked++; continue; }
    if (r.googleStatus === 429 || keyRefused(r.googleStatus, r.error)) { out.stopped = true; break; }
    out.failed++;
    q.tries = (q.tries || 0) + 1; q.lastError = clip(r.error, 200);
    const next = new Date(Date.now() + retryAfter(q.tries)).toISOString();
    await env.LOOM_KV.put(k.name, JSON.stringify(q), { metadata: { at: q.at, tries: q.tries, next } });
  }
  return out;
}

// /status is a page anyone can open: the waiting count (a KV list, ~1 000 a day on the free plan) is kept for 60 s
let statusCache = null;
async function waitingCount(kv) {
  if (statusCache && statusCache.kv === kv && Date.now() - statusCache.at < 60000) return statusCache.waiting;
  let waiting;
  try { waiting = (await kv.list({ prefix: 'q:' })).keys.length; } catch (e) { return null; }
  statusCache = { kv, at: Date.now(), waiting };
  return waiting;
}

const JOBS = ['chat', 'writing', 'queue', 'feedback', 'check'];
export { aiBand, checkWriting, runQueue };
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    // a check page anyone can open: https://loom-ai.<name>.workers.dev/status (says whether the key is saved, never the key)
    if (request.method === 'GET' && new URL(request.url).pathname === '/status') {
      const info = { running: true, version: VERSION, keySaved: !!env.GEMINI_API_KEY, kv: !!env.LOOM_KV, jobs: JOBS };
      if (env.LOOM_KV) info.waiting = await waitingCount(env.LOOM_KV);
      return new Response(JSON.stringify(info), { headers: { 'Content-Type': 'application/json' } });
    }
    if (!ALLOWED_ORIGINS.includes(origin)) return new Response('Not allowed', { status: 403 });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== 'POST') return reply({ error: 'POST only' }, 405, origin);
    let q;
    try { q = await request.json(); } catch (e) { return reply({ error: 'Bad request' }, 400, origin); }
    const job = q && JOBS.includes(q.job) ? q.job : 'chat';
    if (tooMany(request.headers.get('CF-Connecting-IP') || 'x', job)) return reply({ error: 'Too many requests — wait a minute.' }, 429, origin);
    if (job === 'queue' || job === 'feedback' || job === 'check') {
      if (!env.LOOM_KV) return reply({ error: 'The helper has no LOOM_KV storage yet' }, 500, origin);
      if (job === 'feedback') return feedbackJob(q, env, origin);
      if (!env.GEMINI_API_KEY && job === 'check') return reply({ error: 'The helper has no GEMINI_API_KEY secret yet' }, 500, origin);
      return job === 'queue' ? queueJob(q, env, origin) : checkJob(q, env, origin);
    }
    if (!env.GEMINI_API_KEY) return reply({ error: 'The helper has no GEMINI_API_KEY secret yet' }, 500, origin);
    return job === 'writing' ? writing(q, env, origin) : chat(q, env, origin);
  },
  // Cloudflare Cron Trigger (*/5 * * * *)
  async scheduled(event, env, ctx) { ctx.waitUntil(runQueue(env)); }
};
