// Loom AI helper — a Cloudflare Worker (free plan: 100 000 requests a day) that lets the robot ask Google Gemini
// (teacher, 2026-11-08: "use option 2" — Gemini's free plan). It keeps the Gemini API key secret: the key is saved in
// Cloudflare as the secret GEMINI_API_KEY, never in this repo or the website. Only pages on the teacher's site may use it
// (ALLOWED_ORIGINS), answers are kept short, and each visitor is limited to a few questions a minute.
//
// Set up (once): Google AI Studio (aistudio.google.com) → Get API key → Create API key. Cloudflare dashboard → Workers & Pages →
// Create → "Hello World" worker named loom-ai → Edit code → paste this file → Deploy. Then Settings → Variables and Secrets →
// Add → Secret, name GEMINI_API_KEY, value = the key. Copy the worker's address (https://loom-ai.<name>.workers.dev) into
// TA_AI_URL in js/common.js. Optional: a plain variable GEMINI_MODEL picks another model (default below).
// Free plan: Google may use the questions to improve its products — don't type students' private details into the robot.

const ALLOWED_ORIGINS = ['https://baxod1rovvf.github.io'];
const DEFAULT_MODEL = 'gemini-flash-latest';   // Google's current fast model on the free plan
const PER_MINUTE = 8;                          // questions per visitor (IP) per minute, kept in this worker's memory
const seen = new Map();

function cors(origin) {
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
}
function reply(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: Object.assign({ 'Content-Type': 'application/json' }, cors(origin)) });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)) return new Response('Not allowed', { status: 403 });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== 'POST') return reply({ error: 'POST only' }, 405, origin);

    const ip = request.headers.get('CF-Connecting-IP') || 'x', now = Date.now();
    const times = (seen.get(ip) || []).filter(t => now - t < 60000);
    if (times.length >= PER_MINUTE) return reply({ error: 'Too many questions — wait a minute.' }, 429, origin);
    times.push(now); seen.set(ip, times);

    let q;
    try { q = await request.json(); } catch (e) { return reply({ error: 'Bad request' }, 400, origin); }
    const question = String(q.question || '').slice(0, 1000).trim();
    if (!question) return reply({ error: 'No question' }, 400, origin);
    const lang = { uz: 'Uzbek (Latin script)', ru: 'Russian' }[q.lang] || 'English';
    const knowledge = String(q.knowledge || '').slice(0, 30000);
    // the chat so far, in Gemini's shape (it calls the assistant "model")
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

    const model = env.GEMINI_MODEL || DEFAULT_MODEL;
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent', {
      method: 'POST',
      headers: { 'x-goog-api-key': env.GEMINI_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: history.concat([{ role: 'user', parts: [{ text: question }] }]),
        generationConfig: { maxOutputTokens: 2048, temperature: 0.6 }
      })
    });
    if (!res.ok) return reply({ error: 'The AI is busy (' + res.status + ')' }, 502, origin);
    const data = await res.json();
    const parts = (((data.candidates || [])[0] || {}).content || {}).parts || [];
    const answer = parts.filter(p => typeof p.text === 'string' && !p.thought).map(p => p.text).join('').trim();
    return reply({ answer }, 200, origin);
  }
};
