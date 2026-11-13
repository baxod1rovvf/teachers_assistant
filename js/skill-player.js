// Skills course — the student page (skill.html?s=<skill>&st=<step id>&c=<code>, 2026-11-04; steps since 2026-11-05).
// An old link (before 2026-11-05) says lv=<N> instead of st: it opens step e<N> (old Level N = Step 10+N).
// A student opens a step from the teacher's link, writes name + ID on the start card, does the Listening or
// Reading part, presses Submit: every answer is marked ✅ / ❌, the score shows, then 10 useful words and
// "Analyze >" (the transcript / text with the answers highlighted). One result goes to Firestore `results`
// in the student-record shape exercises use (so the database lock lets it through), 3 tries, then "Send again".
// Preview (&preview=1, the teacher's ▶️ Try): no start card, nothing imported from Firebase, nothing written.
// Writing: a topic with 3 points, a timer (submits by itself at 0), a live word counter; Submit → one result is saved
// (no band, no check here) and, once saved, put on the AI helper's waiting list; the student sees only "sent" (2026-11-12).
// Speaking: practice only — words, then the questions one by one, then a Part 2 talk with a timer. No start card, no
// microphone, nothing recorded, sent or scored (it is the student's own wish to speak).

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCefg2YghdSneABh0ZOUu3-snO4soVw0lA",
  authDomain: "teachers-assistant-app-ccd1a.firebaseapp.com",
  projectId: "teachers-assistant-app-ccd1a",
  storageBucket: "teachers-assistant-app-ccd1a.firebasestorage.app",
  messagingSenderId: "185909682129",
  appId: "1:185909682129:web:21fd63e09809eac82d8af0",
  measurementId: "G-7P60GBSYEM"
};
const SKILL_INFO = {
  listening: { name: 'Listening', emoji: '🎧', type: 'Listening course' },
  reading: { name: 'Reading', emoji: '📖', type: 'Reading course' },
  writing: { name: 'Writing', emoji: '✍️', type: 'Writing course' },
  speaking: { name: 'Speaking', emoji: '🗣️', type: 'Speaking course' }
};
const NAME_KEY = 'ta_skill_student';   // the student's name + ID on this device (not one of the app's keys)
// A writing in progress: { text, startedAt, id } under ta_skill_draft|<code>|<step id> (this page's own key, like NAME_KEY).
// Phones often reload a tab that was in the background: the text comes back and the clock goes on from the first start.
// Cleared once the writing is sent. A preview keeps nothing.
const draftKey = () => 'ta_skill_draft|' + SK.code + '|' + SK.step;

const params = new URLSearchParams(location.search);
// the step's id: st=<b1…b10 | e1…e10>, or an old link's lv=<N> → e<N>
function stepIdFrom(p) {
  const st = String(p.get('st') || '').trim().toLowerCase();
  if (st) return /^[be]\d+$/.test(st) ? st : '';
  const lv = parseInt(p.get('lv'), 10);
  return lv > 0 ? 'e' + lv : '';
}
const SK = window.SK = {
  skill: (params.get('s') || '').toLowerCase(),
  step: stepIdFrom(params),
  code: (params.get('c') || '').trim(),
  preview: params.get('preview') === '1',
  name: '',
  studentId: ''
};
let startedAt = Date.now();
let lastPayload = null;

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = sel => document.querySelector(sel);

/* ---------- marking ---------- */
function skNorm(s) {
  return String(s == null ? '' : s).toLowerCase().replace(/[’‘`]/g, "'").replace(/[−–]/g, '-').replace(/[$£]/g, '')
    .replace(/\s+/g, ' ').trim().replace(/\.+$/, '').trim();
}
// true when `answer` matches one of the accepted answers: case, extra spaces and a final full stop don't matter.
// When the student wrote only digits (spaces, dashes and one leading "+" allowed) and an accepted answer is digits
// too, only the digits are compared ("07700 900123" = "07700 900 123"); "no 12" or "1a2" are compared as text.
function skMark(answer, accepted) {
  const given = skNorm(answer);
  if (!given) return false;
  const givenPlain = given.replace(/[\s-]/g, '');
  const givenDigits = /^\+?\d+$/.test(givenPlain) ? givenPlain.replace(/\D/g, '') : null;
  return (accepted || []).some(a => {
    const want = skNorm(a);
    const wantDigits = want.replace(/[\s-]/g, '');
    if (givenDigits !== null && /^\d+$/.test(wantDigits)) return givenDigits === wantDigits;
    if (given === want) return true;
    // a name spelled out letter by letter counts too: "G-R-E-E-N", "g r e e n", "S-I-L-V-E-R L-A-K-E" (Listening Journey)
    const letters = x => x.replace(/[\s.-]/g, '');
    return /^[a-z]+$/.test(letters(want)) && /^[a-z](?:[\s.-]+[a-z])+$/.test(given.replace(/\s{2,}/g, ' ')) && letters(given) === letters(want);
  });
}
window.skMark = skMark;

/* ---------- sending ---------- */
let fsReady = null;
function loadFirestore() {
  if (SK.preview) return Promise.reject(new Error('preview'));
  if (!fsReady) {
    fsReady = Promise.all([
      import('./vendor/firebase-10.12.5/firebase-app.js'),
      import('./vendor/firebase-10.12.5/firebase-firestore.js')
    ]).then(([app, fs]) => ({ fs, db: fs.getFirestore(app.initializeApp(FIREBASE_CONFIG)) }))
      .catch(e => { fsReady = null; throw e; });
  }
  return fsReady;
}
const wait = ms => new Promise(r => setTimeout(r, ms));
// Offline, Firestore doesn't refuse a write — it waits (and sends it later). Each step gives up after a while.
const sendTimeout = () => window.__skSendTimeoutMs || 12000;
function within(promise, ms) {
  return Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('timeout'), { code: 'timeout' })), ms))]);
}
// One record id per Submit (sk_<code>_<ID>_<time>): every try — and "Send again" — writes the same record, so a late
// write that was waiting offline, or a reply lost after reaching the server, can never make a copy. Changing a record
// is refused by the rules, so a refused try asks the server whether the record is already there (like a Homework set).
function skResultId(payload) {
  const clean = s => String(s || '').replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 40);
  return 'sk_' + clean(payload.code) + '_' + clean(payload.studentId || payload.name) + '_' + String(payload.date || Date.now()).replace(/[^0-9]/g, '');
}
// One result → `results/<id>` (setDoc), up to 3 tries. Never in preview (resolves 'ok' without writing).
async function skSendResult(payload) {
  if (SK.preview) return 'ok';
  const id = payload.__id || skResultId(payload);
  const data = Object.assign({}, payload);
  delete data.__id;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await wait(600 * attempt);
    let fs, db;
    try { ({ fs, db } = await within(loadFirestore(), sendTimeout())); } catch (e) { console.warn('Skills course: database not ready', e); continue; }
    const ref = fs.doc(db, 'results', id);
    try {
      await within(fs.setDoc(ref, Object.assign({}, data, { submittedAt: fs.serverTimestamp() })), sendTimeout());
      return 'ok';
    } catch (e) {
      console.warn('Skills course: sending failed', e);
      try { const snap = await within(fs.getDocFromServer(ref), sendTimeout()); if (snap.exists()) return 'ok'; } catch (e2) { /* still not there */ }
    }
  }
  return 'failed';
}
window.skSendResult = skSendResult;

/* ---------- one try per exercise (teacher, 2026-11-09: "once they finish and get a score, they can't open this exercise again") ----------
   Finished = Submit pressed. This device remembers it at once (ta_skill_done, the page's own key: "<code>|id:<id>" and
   "<code>|name:<name>"), and on Start the database is asked whether this code already has a result with the same ID or the
   same name (2 small reads). If the check can't run (no internet), the student is let in — never blocked by an error. */
const DONE_KEY = 'ta_skill_done';
const doneKeys = (code, name, id) => [code + '|id:' + String(id || '').trim().toLowerCase(), code + '|name:' + String(name || '').trim().toLowerCase().replace(/\s+/g, ' ')]
  .filter(k => !/:$/.test(k));
function doneSummary(r) {
  if (!r) return '';
  if (r.skill === 'writing' || /^Writing/.test(r.type || '')) return (typeof r.words === 'number' ? r.words + ' words' : '');
  return typeof r.correct === 'number' && typeof r.total === 'number' ? r.correct + ' / ' + r.total : '';
}
function markDone(payload) {
  if (SK.preview || !payload) return;
  try {
    const all = JSON.parse(localStorage.getItem(DONE_KEY) || '{}') || {};
    const info = { at: payload.date, summary: doneSummary(payload) };
    doneKeys(payload.code, payload.name, payload.studentId).forEach(k => { all[k] = info; });
    localStorage.setItem(DONE_KEY, JSON.stringify(all));
  } catch (e) { /* private window */ }
}
/* Answers that haven't reached the teacher yet (2026-11-13: students had a score to screenshot, but the save had failed or the
   page was closed while sending — Loom had nothing, and the next part said "Oldingi … tugatilmagan"). Every Submit keeps its
   answers on this phone (ta_skill_unsent, the page's own key: { <record id>: payload }) until the save is confirmed; whenever a
   course link is opened they are sent again (skSendKept), so the teacher gets them and the next part opens. Kept 30 days. */
const KEPT_KEY = 'ta_skill_unsent', KEPT_DAYS = 30;
function keptAll() { try { return JSON.parse(localStorage.getItem(KEPT_KEY) || '{}') || {}; } catch (e) { return {}; } }
function keptWrite(all) { try { if (Object.keys(all).length) localStorage.setItem(KEPT_KEY, JSON.stringify(all)); else localStorage.removeItem(KEPT_KEY); } catch (e) { /* private window */ } }
function keepUnsent(p) {
  if (SK.preview || !p || !p.__id) return;
  const all = keptAll();
  all[p.__id] = p;
  keptWrite(all);
}
function forgetUnsent(id) { const all = keptAll(); if (all[id]) { delete all[id]; keptWrite(all); } }
function keptFor(code, name, id) {
  const k = taIdKey(id), nm = String(name || '').trim().toLowerCase();
  return Object.values(keptAll()).find(p => p && p.code === code &&
    ((p.studentId && taIdKey(p.studentId) === k) || String(p.name || '').trim().toLowerCase() === nm)) || null;
}
async function skSendKept() {
  if (SK.preview) return;
  const all = keptAll(), old = Date.now() - KEPT_DAYS * 864e5;
  for (const id of Object.keys(all)) {
    const p = all[id];
    if (!p || !(Date.parse(p.date) > old)) { forgetUnsent(id); continue; }
    if ((await skSendResult(p)) === 'ok') forgetUnsent(id);
  }
}
window.skSendKept = skSendKept;
let keptSending = null;   // started when the page opens; Start waits for it (a little) before the checks

/* Finished = the teacher has the answers. Kept answers from this phone are sent first; then the database is asked. A "done"
   note on this phone alone no longer blocks when the database answers that it has nothing (those answers never arrived —
   2026-11-13); it is used only when the database can't be asked (no internet). */
async function skAlreadyDone(name, id) {
  if (SK.preview) return null;
  const kept = keptFor(SK.code, name, id);
  if (kept) {
    const state = await skSendResult(kept);
    if (state === 'ok') forgetUnsent(kept.__id);
    return { at: kept.date, summary: doneSummary(kept), unsent: state === 'ok' ? undefined : kept };
  }
  let local = null;
  try {
    const all = JSON.parse(localStorage.getItem(DONE_KEY) || '{}') || {};
    local = doneKeys(SK.code, name, id).map(k => all[k]).find(Boolean) || null;
  } catch (e) { /* ignore */ }
  try {
    const { fs, db } = await within(loadFirestore(), 8000);
    const col = fs.collection(db, 'results');
    const ask = (field, value) => within(fs.getDocsFromServer(fs.query(col, fs.where('code', '==', SK.code), fs.where(field, '==', value))), 8000);
    // the name as typed, and with capitals ("alice test" → "Alice Test") — the database compares letters exactly
    const title = name.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (m, a, c) => a + c.toUpperCase());
    const names = Array.from(new Set([name, title, name.toLowerCase()]));
    const snaps = await Promise.all([ask('studentId', id), within(fs.getDocsFromServer(fs.query(col, fs.where('code', '==', SK.code), fs.where('name', 'in', names))), 8000)]);
    for (const snap of snaps) {
      const doc = (snap.docs || []).map(d => d.data()).find(r => r && (r.skill === SK.skill || /course$/.test(r.type || '')));
      if (doc) return { at: doc.date, summary: doneSummary(doc) };
    }
    return null;   // the database has nothing from this student: free to do it (a note on this phone alone doesn't count)
  } catch (e) { console.warn('Skills course: could not check for an earlier try', e); }
  return local;   // couldn't ask the database: trust this phone
}
window.skAlreadyDone = skAlreadyDone;

/* Only the group's students (teacher, 2026-11-09: "student can only enter exercise with ID, if they wrong ID or name, they
   cannot enter"): Copy link puts the group's list online as `class-<code>` (IDs scrambled, skClassHash). The typed ID must be
   on it and the typed name must fit that student's name (skNameFits — first name or surname is enough); the result then
   carries the name from the list. No list (a link copied before this, or a group without students) or no internet → let in. */
async function skCheckStudent(name, id) {
  try {
    const { fs, db } = await within(loadFirestore(), 8000);
    const snap = await within(fs.getDocFromServer(fs.doc(db, 'results', 'class-' + SK.code)), 8000);
    if (!snap.exists()) return {};
    let list = [];
    try { list = JSON.parse(snap.data().data || '[]'); } catch (e) { list = []; }
    if (!Array.isArray(list) || !list.length) return {};
    const h = await skClassHash(SK.code, id);
    if (!h) return {};
    const st = list.find(s => s && s.h === h);
    if (!st) return { refuse: 'This ID is not on your teacher\'s list. Check your ID and try again.', field: 'id' };
    if (!skNameFits(name, st.n)) return { refuse: 'This ID belongs to another student. Write your own name and ID.', field: 'name' };
    let prev = null;
    try { prev = snap.data().prev ? JSON.parse(snap.data().prev) : null; } catch (e) { prev = null; }
    return { name: st.n, prev: prev && Array.isArray(prev.codes) && prev.codes.length ? prev : null };
  } catch (e) { console.warn('Skills course: could not check the class list', e); return {}; }
}
window.skCheckStudent = skCheckStudent;
/* One after another (teacher, 2026-11-12): the part the group does before this one (the class list's `prev`) must be done —
   a result of one of its codes from this student (by ID, else the listed name). true = done, false = not done, null = couldn't
   check (no internet …) → let in. */
async function skPrevDone(prev, name, id) {
  if (!prev || !Array.isArray(prev.codes) || !prev.codes.length) return true;
  try {
    const { fs, db } = await within(loadFirestore(), 8000);
    const snap = await within(fs.getDocsFromServer(fs.query(fs.collection(db, 'results'), fs.where('code', 'in', prev.codes.slice(0, 10)))), 8000);
    const want = taIdKey(id), nm = String(name || '').trim().toLowerCase();
    return (snap.docs || []).map(d => d.data()).some(r => r && (/ course$/.test(r.type || '')) &&
      ((r.studentId && taIdKey(r.studentId) === want) || String(r.name || '').trim().toLowerCase() === nm));
  } catch (e) { console.warn('Skills course: could not check the part before', e); return null; }
}
window.skPrevDone = skPrevDone;
const SK_SKILL_UZ = { listening: 'Listening', reading: 'Reading', writing: 'Writing' };
function skPrevWarning(prev) {
  const k = SK_SKILL_UZ[prev.skill] || 'oldingi';
  return '⚠️ Oldingi ' + k + ' mashq tugatilmagan. Avval Step ' + prev.stepNo + ' · ' + k + ' mashqini tugating.';
}
function showAlreadyDone(level, done) {
  const info = SKILL_INFO[SK.skill];
  root().innerHTML = `${headerHtml(level)}<section class="sk-card sk-center sk-done-card">
    <div class="sk-big-emoji" aria-hidden="true">✅</div>
    <h2>You have already done this ${esc(info.name.toLowerCase())}</h2>
    ${done.summary ? `<p class="sk-done-score">Your result: <b>${esc(done.summary)}</b></p>` : ''}
    ${done.unsent ? `<p>Your answers are saved on this phone, but they haven't reached your teacher yet. Check the internet and press Send.</p>
      <div class="sk-send bad" id="skSend" role="status"><button type="button" class="sk-btn sk-btn-small" id="skSendKept">📤 Send my answers</button></div>`
      : '<p>Each exercise can be done only once. Your teacher already has your answers.</p>'}
  </section>`;
  if (!done.unsent) return;
  const sendKept = async () => {
    const box = $('#skSend');
    box.innerHTML = '<span class="sk-send-note">📤 Sending your answers to your teacher…</span>';
    if ((await skSendResult(done.unsent)) === 'ok') { forgetUnsent(done.unsent.__id); showAlreadyDone(level, { at: done.at, summary: done.summary }); return; }
    box.innerHTML = '<span class="sk-send-bad">Not sent yet — check the internet</span> <button type="button" class="sk-btn sk-btn-small" id="skSendKept">📤 Send my answers</button>';
    $('#skSendKept').addEventListener('click', sendKept);
  };
  $('#skSendKept').addEventListener('click', sendKept);
}

/* ---------- the page ---------- */
const root = () => $('#skApp');

function stepData() {
  const steps = (window.TA_SKILLS && TA_SKILLS.steps) || [];
  return SK.step ? steps.find(l => l.id === SK.step) || null : null;
}

function headerHtml(level) {
  const info = SKILL_INFO[SK.skill];
  return `<header class="sk-head">
    <span class="sk-brand">🧶 loom</span>
    <span class="sk-chip sk-chip-skill">${info.emoji} ${info.name}</span>
    <span class="sk-chip">${esc(level.emoji)} Step ${level.no} · ${esc(level.theme)}</span>
    ${SK.preview ? '<span class="sk-chip sk-preview" title="Nothing is sent from a preview">👀 Preview</span>' : ''}
  </header>`;
}

function showMissing() {
  document.title = 'Step not found — Loom';
  root().innerHTML = `<div class="sk-card sk-center sk-missing">
    <div class="sk-big-emoji" aria-hidden="true">🧭</div>
    <h1>This step doesn't exist</h1>
    <p>The link may be cut short or mistyped. Ask your teacher to send it again.</p>
    <a class="sk-btn sk-btn-ghost" href="index.html">🏠 Go to Loom's home page</a>
  </div>`;
}

function showNoCode() {
  document.title = 'Link without its code — Loom';
  root().innerHTML = `<div class="sk-card sk-center sk-missing">
    <div class="sk-big-emoji" aria-hidden="true">🔗</div>
    <h1>This link is missing its code</h1>
    <p>This link is missing its code — ask your teacher for the link again.</p>
  </div>`;
}

function showComingSoon(level, text) {
  root().innerHTML = headerHtml(level) + `<div class="sk-card sk-center">
    <div class="sk-big-emoji" aria-hidden="true">🚧</div>
    <h1>Coming soon</h1>
    <p>${esc(text)}</p>
  </div>`;
}

function showStart(level, content) {
  const info = SKILL_INFO[SK.skill];
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(NAME_KEY) || '{}') || {}; } catch (e) { saved = {}; }
  root().innerHTML = `<div class="ta-login-card sk-start-card">
    <div class="ta-login-stage ta-login-narrow">
      <div class="ta-login-anim" aria-hidden="true">${info.emoji}</div>
      <form class="ta-login-form" id="skStartForm" novalidate>
        <h2>${esc(content.title || content.topic)}</h2>
        <div class="ta-login-type">${info.name} · Step ${level.no}</div>
        <div class="ta-underline"></div>
        <p>${esc(level.emoji)} ${esc(level.theme)}. Write your name and your ID to begin.</p>
        <label class="sk-label" for="studentNameInput">Your name</label>
        <input type="text" id="studentNameInput" autocomplete="name" maxlength="80" placeholder="e.g. Anna Smith" value="${esc(saved.name || '')}">
        <label class="sk-label" for="skIdInput">Your ID</label>
        <input type="text" id="skIdInput" autocomplete="off" inputmode="numeric" maxlength="30" placeholder="e.g. 10001" value="${esc(saved.id || '')}">
        <div class="sk-start-err" id="skStartErr" role="alert"></div>
        <button type="submit" class="start-btn">Start ${info.name.toLowerCase()} ▶</button>
      </form>
    </div>
  </div>`;
  $('#skStartForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#studentNameInput').value.trim().replace(/\s+/g, ' ');
    const id = $('#skIdInput').value.trim();
    if (!name || !id) {
      $('#skStartErr').textContent = !name ? 'Write your name to start.' : 'Write your ID to start (your teacher gave it to you).';
      (!name ? $('#studentNameInput') : $('#skIdInput')).focus();
      return;
    }
    const btn = $('#skStartForm .start-btn');
    if (btn.disabled) return;
    btn.disabled = true;
    const label = btn.textContent;
    btn.textContent = 'Checking…';
    // only the teacher's students: the ID must be on the group's list and the name must fit it (2026-11-09)
    const who = await skCheckStudent(name, id);
    if (who.refuse) {
      btn.textContent = label; btn.disabled = false;
      $('#skStartErr').textContent = who.refuse;
      (who.field === 'name' ? $('#studentNameInput') : $('#skIdInput')).focus();
      return;
    }
    SK.name = who.name || name; SK.studentId = id;
    try { localStorage.setItem(NAME_KEY, JSON.stringify({ name, id })); } catch (err) { /* private window */ }
    // answers this phone still holds (a save that failed) go first, so the part before counts (2026-11-13)
    if (keptSending) await within(keptSending, 15000).catch(() => {});
    const done = await skAlreadyDone(SK.name, id);   // one try per exercise (2026-11-09)
    if (done) { showAlreadyDone(level, done); return; }
    if (who.prev && (await skPrevDone(who.prev, SK.name, id)) === false) {   // the part before isn't done (2026-11-12)
      btn.textContent = label; btn.disabled = false;
      $('#skStartErr').textContent = skPrevWarning(who.prev);
      return;
    }
    btn.textContent = label; btn.disabled = false;
    if (SK.skill === 'writing') showWriting(level); else showExercise(level);
  });
}

/* ---------- questions ---------- */
function gapHtml(q, n) {
  const parts = String(q.q).split('_____');
  const input = `<input type="text" class="sk-gap" data-n="${n}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Answer ${n}">`;
  return parts.length > 1 ? esc(parts[0]) + input + esc(parts.slice(1).join('_____')) : esc(q.q) + ' ' + input;
}
function questionHtml(q, n, kind) {
  let body;
  if (kind === 'tfng' || kind === 'tf' || kind === 'choose') {
    const opts = kind === 'tfng' ? ['True', 'False', 'Not given'] : kind === 'tf' ? ['True', 'False'] : q.opts;
    body = `<div class="sk-qtext">${esc(q.q)}</div><div class="sk-opts" role="group" aria-label="Answer ${n}">` +
      opts.map((o, i) => `<button type="button" class="sk-opt" aria-pressed="false" data-val="${esc(o)}">${kind === 'choose' ? `<b>${'abcdef'[i]}</b> ` : ''}${esc(o)}</button>`).join('') +
      '</div>';
  } else if (kind === 'open') {
    // a WH-question: the student writes a short answer (Reading Journey, 2026-11-09)
    body = `<div class="sk-qtext">${esc(q.q)}</div><input type="text" class="sk-gap sk-open" data-n="${n}" autocomplete="off" maxlength="200" aria-label="Answer ${n}" placeholder="Write your answer">`;
  } else {
    body = `<div class="sk-qtext">${gapHtml(q, n)}</div>`;
  }
  return `<li class="sk-q" data-n="${n}" data-kind="${kind}"><span class="sk-num">${n}</span><div class="sk-qbody">${body}<div class="sk-fix" hidden></div></div></li>`;
}
const SECTION_TITLES = {
  tfng: 'True, False or Not given?',
  tf: 'True or False?',
  gap: 'Complete the sentences with a word from the text.',
  choose: 'Choose a, b or c.',
  open: 'Answer the questions.'
};
function questionsHtml(questions, isReading) {
  let html = '', group = null, n = 0;
  const typed = isReading || questions.some(q => q.type);   // the old listenings: gaps only, no headings
  questions.forEach(q => {
    n++;
    const k = typed ? (q.type || 'gap') : 'gap';
    const g = q.sec || k;
    if (typed && g !== group) {
      if (group) html += '</ol>';
      html += `<h3 class="sk-sub">${esc(q.sec || SECTION_TITLES[k] || '')}</h3><ol class="sk-qs">`;
      group = g;
    } else if (!typed && n === 1) html += '<ol class="sk-qs">';
    html += questionHtml(q, n, k);
  });
  return html + '</ol>';
}

function readingTextHtml(text) {
  // sentence i here = text.trim().split(/(?<=[.!?])\s+/)[i] (the data's `line`); a blank line starts a paragraph
  const bits = text.trim().split(/(?<=[.!?])(\s+)/);
  let html = '<p>', i = 0;
  bits.forEach((b, k) => {
    if (k % 2) { html += /\n\s*\n/.test(b) ? '</p><p>' : ' '; return; }
    // a sentence that ends in a quote mark and then a new paragraph ('… we thought."' + blank line) still breaks the paragraph:
    // the sentence's two pieces keep the same line number
    const line = i++;
    html += b.split(/\n\s*\n/).map(part => `<span class="sk-sent" data-line="${line}">${esc(part)}</span>`).join('</p><p>');
  });
  return html + '</p>';
}

function showExercise(level) {
  const isReading = SK.skill === 'reading';
  const content = level[SK.skill];
  const info = SKILL_INFO[SK.skill];
  startedAt = Date.now();
  let top;
  if (isReading) {
    top = `<section class="sk-card sk-text-card"><h2>📖 ${esc(content.title)}</h2>
      <p class="sk-intro">Read the text, then answer the ${content.questions.length} questions below.</p>
      <div class="sk-text" id="skText">${readingTextHtml(content.text)}</div></section>`;
  } else {
    top = `<section class="sk-card sk-audio-card"><h2>🎧 ${esc(content.title)}</h2>
      <p class="sk-intro">${esc(content.intro)}</p>
      <audio controls preload="metadata" src="${esc(content.src)}"></audio>
      <p class="sk-audio-err" id="skAudioErr" hidden>The recording couldn't load — check the internet and press ▶️ again.</p></section>`;
  }
  root().innerHTML = headerHtml(level) + top + `
    <section class="sk-card sk-questions"><h2>✏️ Questions</h2>${questionsHtml(content.questions, isReading)}
      <div class="sk-actions" id="skActions"><button type="button" class="sk-btn sk-btn-main" id="skSubmit">📤 Submit my answers</button></div>
    </section>
    <div id="skAfter"></div>`;
  const audio = root().querySelector('audio');
  if (audio) {
    audio.addEventListener('error', () => { $('#skAudioErr').hidden = false; });
    audio.addEventListener('playing', () => { $('#skAudioErr').hidden = true; });
  }
  root().querySelectorAll('.sk-opts').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('.sk-opt');
    if (!b || b.disabled) return;
    g.querySelectorAll('.sk-opt').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
  }));
  // Enter in a box goes to the next one
  root().querySelectorAll('.sk-gap').forEach((inp, i, all) => inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); if (all[i + 1]) all[i + 1].focus(); }
  }));
  $('#skSubmit').addEventListener('click', () => submit(level, content, info));
  window.scrollTo(0, 0);
}

function givenFor(li) {
  if (li.dataset.kind === 'gap' || li.dataset.kind === 'open') return li.querySelector('.sk-gap').value;
  const on = li.querySelector('.sk-opt.on');
  return on ? on.dataset.val : '';
}

function submit(level, content, info) {
  const items = [...root().querySelectorAll('.sk-q')];
  const answers = content.questions.map((q, i) => {
    const li = items[i];
    const given = givenFor(li).trim();
    const right = q.type === 'open' ? skOpenRight(given, q.keys) : skMark(given, q.a);
    li.classList.add(right ? 'right' : 'wrong');
    li.querySelectorAll('input, .sk-opt').forEach(x => { x.disabled = true; });
    if (li.dataset.kind !== 'gap' && li.dataset.kind !== 'open') li.querySelectorAll('.sk-opt').forEach(b => { if (b.dataset.val === q.a[0]) b.classList.add('is-answer'); });
    const fix = li.querySelector('.sk-fix');
    fix.hidden = false;
    fix.innerHTML = right ? '✅ Right!' : q.type === 'open'
      ? `❌ ${given ? 'Not quite.' : 'No answer.'} A good answer has: <b>${esc((q.keys || [])[0] || '')}</b> — ${SK.skill === 'reading' ? 'look at the text again' : 'press Analyze to see where it is'}.`
      : `❌ ${given ? 'Not quite.' : 'No answer.'} The answer: <b>${esc(q.a[0])}</b>`;
    return { q: q.q, given, right };
  });
  const correct = answers.filter(a => a.right).length;
  const total = answers.length;
  const secs = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
  const pad = n => String(n).padStart(2, '0');
  lastPayload = {
    v: 1, code: SK.code, type: info.type, title: `Step ${level.no} · ${level.theme} — ${info.name}`, step: level.id, stepNo: level.no, skill: SK.skill,
    name: SK.name, studentId: SK.studentId, correct, total, score: Math.round(correct / total * 100), band: skBand(correct, total),
    answers, timeSeconds: secs, timeDisplay: pad(Math.floor(secs / 60)) + ':' + pad(secs % 60), date: new Date().toISOString()
  };
  lastPayload.builtAt = lastPayload.date;   // see submitWriting
  lastPayload.__id = skResultId(lastPayload);   // the same record on every try and on "Send again"
  markDone(lastPayload);   // finished: this device won't open it again (one try per exercise)
  keepUnsent(lastPayload);   // kept on this phone until the save is confirmed (2026-11-13)
  const pct = correct / total;
  const cheer = pct >= 0.8 ? '🌟 Excellent work!' : pct >= 0.6 ? '👏 Well done!' : pct >= 0.4 ? '💪 Good try — keep going!' : '🌱 Keep practising — you can do it!';
  $('#skActions').innerHTML = `<div class="sk-result">
      <div class="sk-score"><span class="sk-score-n">${correct} / ${total}</span><span class="sk-score-t">${cheer}</span></div>
      <div class="sk-send" id="skSend" role="status"></div>
    </div>`;
  const words = content.words || [];
  const isReading = SK.skill === 'reading';
  $('#skAfter').innerHTML = (words.length ? `<section class="sk-card sk-words-card"><h2>💡 ${words.length} useful words</h2>
      <ul class="sk-words">${words.map(w => `<li>${w.emoji ? `<span class="sk-wemoji" aria-hidden="true">${esc(w.emoji)}</span>` : ''}<b>${esc(w.w)}</b>${w.uz ? `<span class="sk-m sk-uz" lang="uz" translate="no">${esc(w.uz)}</span>` : `<span class="sk-m">${esc(w.m)}</span>`}<i>${esc(w.ex)}</i></li>`).join('')}</ul>
      <div class="sk-actions"><button type="button" class="sk-btn sk-btn-main" id="skAnalyze">Analyze ></button></div>
    </section>` : `<section class="sk-card sk-words-card"><h2>🔍 Check your answers</h2>
      <p class="sk-intro">See what the speakers said and where each answer is.</p>
      <div class="sk-actions"><button type="button" class="sk-btn sk-btn-main" id="skAnalyze">Analyze ></button></div>
    </section>`) + `
    <div id="skAnalysis"></div>
    ${isReading && content.retell ? `<section class="sk-card sk-retell-card"><h2>🗣️ Retelling</h2>
      <p>${esc(content.retell)}</p><p class="sk-retell-goal"><b>Try to use at least 5 vocabulary items from the text.</b></p></section>` : ''}`;
  $('#skAnalyze').addEventListener('click', () => analyze(content, isReading));
  sendNow();
}

function setSend(state) {
  const box = $('#skSend');
  if (!box) return;
  if (state === 'preview') box.innerHTML = '<span class="sk-send-note">👀 Preview — nothing was sent.</span>';
  else if (state === 'sending') box.innerHTML = '<span class="sk-send-note">📤 Sending your answers to your teacher…</span>';
  else if (state === 'ok') box.innerHTML = '<span class="sk-send-ok">Saved ✅ Your teacher has your answers.</span>';
  else {
    box.innerHTML = '<span class="sk-send-bad">Not sent yet — press Send again</span> <button type="button" class="sk-btn sk-btn-small" id="skSendAgain">📤 Send again</button>';
    $('#skSendAgain').addEventListener('click', sendNow);
  }
  box.classList.toggle('bad', state === 'failed');
}

async function sendNow() {
  if (!lastPayload) return;
  if (SK.preview) { setSend('preview'); return; }
  setSend('sending');
  const state = await skSendResult(lastPayload);
  if (state === 'ok') forgetUnsent(lastPayload.__id);   // the teacher has it
  if (state === 'ok' && lastPayload.skill === 'writing') clearDraft();   // the teacher has it: a reload starts afresh
  setSend(state);
  // once the writing is saved, it goes on the AI helper's waiting list (the helper reads the saved record, so not before);
  // never waited for — a failure is fine, Loom puts it on the list later (taWritingAiSync)
  if (state === 'ok' && lastPayload.skill === 'writing' && queueW && queuedId !== lastPayload.__id) { queuedId = lastPayload.__id; skQueueWriting(lastPayload, queueW); }
  // a writing's "sent" card shows only once the save is confirmed (also after "Send again")
  if (state === 'ok' && lastPayload.skill === 'writing' && !$('.sk-sent-card')) {
    const res = $('#skActions .sk-result');
    if (res) res.insertAdjacentHTML('afterbegin', '<div class="sk-sent-card" role="status">✅ Your writing was sent. Your teacher will share your results.</div>');
  }
}

function analyze(content, isReading) {
  const btn = $('#skAnalyze');
  if (btn) btn.closest('.sk-actions').remove();
  if (isReading) {
    const byLine = {};
    content.questions.forEach((q, i) => { (byLine[q.line] = byLine[q.line] || []).push(i + 1); });
    root().querySelectorAll('#skText .sk-sent').forEach(s => {
      const nums = byLine[s.dataset.line];
      if (!nums) return;
      s.classList.add('hl');
      s.insertAdjacentHTML('afterbegin', nums.map(n => `<span class="sk-qno">Q${n}</span>`).join(''));
    });
    $('#skAnalysis').innerHTML = `<section class="sk-card sk-analysis"><h2>🔍 Where the answers are</h2>
      <p class="sk-intro">The highlighted sentences in the text above hold the answers. The tag shows the question number.</p></section>`;
    $('#skText').closest('.sk-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  $('#skAnalysis').innerHTML = `<section class="sk-card sk-analysis"><h2>🔍 What they said</h2>
    <p class="sk-intro">The highlighted lines hold the answers. The tag shows the question number.</p>
    <ol class="sk-transcript">${content.transcript.map(t => {
      const nums = t.answers || [];
      const man = t.man != null ? t.man : t.who === 'Man';
      return `<li class="sk-line${nums.length ? ' hl' : ''}"><span class="sk-who sk-who-${man ? 'm' : 'w'}">${man ? '👨' : '👩'} ${esc(t.who)}</span>
        <span class="sk-said">${nums.map(n => `<span class="sk-qno">Q${n}</span>`).join('')}${esc(t.text)}</span></li>`;
    }).join('')}</ol></section>`;
  $('#skAnalysis').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- writing ---------- */
// Words = pieces between spaces that hold a letter or a digit ("&" or "-" on its own isn't a word).
function skCountWords(text) {
  return String(text || '').split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
}
window.skCountWords = skCountWords;

const fmtClock = secs => { const s = Math.max(0, Math.ceil(secs)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };

let writeTimer = null;
function readDraft() {
  if (SK.preview) return null;
  moveOldDraft();
  try {
    const d = JSON.parse(localStorage.getItem(draftKey()) || 'null');
    if (!d || typeof d !== 'object' || typeof d.startedAt !== 'number' || d.startedAt > Date.now()) return null;
    if (d.id && String(d.id) !== String(SK.studentId)) return null;   // another student on this device
    return { text: typeof d.text === 'string' ? d.text : '', startedAt: d.startedAt };
  } catch (e) { return null; }
}
// Before 2026-11-05 the key ended in the level number (ta_skill_draft|<code>|<N>): opened from an old lv=<N> link,
// a writing begun before the update comes back — moved to the new key.
function moveOldDraft() {
  const lv = parseInt(params.get('lv'), 10);
  if (!(lv > 0) || params.get('st')) return;
  try {
    const oldKey = 'ta_skill_draft|' + SK.code + '|' + lv, old = localStorage.getItem(oldKey);
    if (old === null) return;
    if (localStorage.getItem(draftKey()) === null) localStorage.setItem(draftKey(), old);
    localStorage.removeItem(oldKey);
  } catch (e) { /* ignore */ }
}
function saveDraft(text) {
  if (SK.preview) return;
  try { localStorage.setItem(draftKey(), JSON.stringify({ text, startedAt, id: SK.studentId })); } catch (e) { /* private window / full */ }
}
function clearDraft() {
  if (SK.preview) return;
  try { localStorage.removeItem(draftKey()); } catch (e) { /* ignore */ }
}

function showWriting(level) {
  const W = level.writing;
  const draft = readDraft();
  startedAt = draft ? draft.startedAt : Date.now();
  const secondsPerMinute = window.__skFast ? 1 : 60;   // tests: a minute lasts one second
  const totalMs = W.minutes * secondsPerMinute * 1000;
  root().innerHTML = headerHtml(level) + `
    <section class="sk-card sk-task-card"><h2 class="sk-topic">✍️ ${esc(W.topic)}</h2>
      ${W.instruction ? `<p class="sk-intro sk-instruction">${esc(W.instruction)}</p>` : ''}
      ${W.task ? `<p class="sk-intro">${esc(W.task)}</p>` : ''}
      ${W.points && W.points.length ? `<p class="sk-points-t">Write about:</p><ul class="sk-points">${W.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      ${W.words && W.words.length ? `<p class="sk-points-t">Use all of these words <span class="sk-asked-count" id="skAskedCount">0 / ${W.words.length}</span></p>
      <ul class="sk-asked" id="skAsked">${W.words.map(w => `<li class="sk-ask" data-w="${esc(w.w)}"><b>${esc(w.w)}</b>${w.uz ? `<small class="sk-uz" lang="uz" translate="no">${esc(w.uz)}</small>` : ''}</li>`).join('')}</ul>` : ''}
      <p class="sk-intro sk-target">Write ${W.minWords}–${W.maxWords} words. You have ${W.minutes} minutes.</p>
    </section>
    <section class="sk-card sk-write-card">
      <div class="sk-write-bar">
        <span class="sk-timer" id="skTimer" role="timer" aria-label="Time left">⏳ <b>${fmtClock(W.minutes * 60)}</b></span>
        <span class="sk-count" id="skCount" aria-live="polite">0 / ${W.minWords}–${W.maxWords} words</span>
      </div>
      <label class="sk-label sk-write-label" for="skWriteBox">Your writing</label>
      <textarea id="skWriteBox" class="sk-write" rows="11" maxlength="4000" spellcheck="false" autocapitalize="sentences"
        placeholder="Hello! My name is …"></textarea>
      <div class="sk-actions" id="skActions"><button type="button" class="sk-btn sk-btn-main" id="skSubmit">📤 Submit my writing</button></div>
    </section>
    <div id="skAfter"></div>`;
  const box = $('#skWriteBox');
  const count = $('#skCount');
  if (draft) box.value = draft.text;
  else saveDraft('');   // the clock's start is kept even before the first word
  const updateCount = () => {
    const n = skCountWords(box.value);
    count.textContent = `${n} / ${W.minWords}–${W.maxWords} words`;
    count.classList.toggle('ok', n >= W.minWords);   // more than asked is fine — it even adds a little (2026-11-09)
    count.classList.toggle('over', false);
    // the asked words tick as the student uses them (other forms count: use → used)
    if (W.words && W.words.length) {
      const got = skAskedWords(box.value, W.words);
      root().querySelectorAll('.sk-ask').forEach(li => li.classList.toggle('used', got.used.indexOf(li.dataset.w) !== -1));
      const c = $('#skAskedCount');
      if (c) { c.textContent = got.used.length + ' / ' + W.words.length; c.classList.toggle('ok', !got.missing.length); }
    }
  };
  box.addEventListener('input', () => { updateCount(); if (!done) saveDraft(box.value); });
  updateCount();
  let done = false;
  const finish = timeUp => {
    if (done) return;
    done = true;
    clearInterval(writeTimer);
    submitWriting(level, W, timeUp);
  };
  $('#skSubmit').addEventListener('click', () => finish(false));
  const tick = () => {
    const left = totalMs - (Date.now() - startedAt);
    const shown = left / 1000 * (60 / secondsPerMinute);   // what the clock says (in real minutes)
    const t = $('#skTimer');
    if (t) { t.querySelector('b').textContent = fmtClock(shown); t.classList.toggle('low', shown <= 60); }
    if (left <= 0) finish(true);
  };
  clearInterval(writeTimer);
  writeTimer = setInterval(tick, secondsPerMinute === 1 ? 100 : 500);
  tick();   // a kept clock may already be at 0: then it is sent now, as the timer would
  // leaving the page before Submit loses the text: ask first
  window.addEventListener('beforeunload', e => { if (!done && box.value.trim()) { e.preventDefault(); e.returnValue = ''; } });
  window.scrollTo(0, 0);
}

/* ---------- Submit: the writing goes to the AI's waiting list (teacher, 2026-11-12) ----------
   The student sees only "sent". The AI checks it later (the helper's timer, tools/ai-worker.js job "queue"); the teacher
   shares the results. No band, no grammar check, no feedback here. */
const SK_AI_URL = 'https://loom-ai.toxiraxii010.workers.dev';
let queueW = null, queuedId = '';   // the writing task being sent, and the result id already put on the waiting list
function skAiUrl() { try { return localStorage.getItem('ta_ai_url') || SK_AI_URL; } catch (e) { return SK_AI_URL; } }
// → true when the helper took it ({ queued } or { done }); false on any error (the writing is saved anyway)
async function skQueueWriting(payload, W) {
  if (SK.preview) return false;   // the teacher's Try sends nothing
  try {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(() => { if (ctrl) ctrl.abort(); }, window.__skAiTimeoutMs || 15000);
    const res = await fetch(skAiUrl(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl ? ctrl.signal : undefined,
      body: JSON.stringify({ job: 'queue', id: payload.__id, text: String(payload.text || '').slice(0, 6000), topic: W.topic, instruction: W.instruction || '',
        minWords: W.minWords, maxWords: W.maxWords, words: (W.words || []).map(w => w.w) }) });
    clearTimeout(timer);
    let data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    return !!(res.ok && data && (data.queued || data.done));
  } catch (e) { return false; }
}
window.skQueueWriting = skQueueWriting;

async function submitWriting(level, W, timeUp) {
  const info = SKILL_INFO.writing;
  const box = $('#skWriteBox');
  box.readOnly = true;
  box.classList.add('locked');
  const text = box.value;
  const words = skCountWords(text);
  const secs = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
  $('#skActions').innerHTML = `<div class="sk-result">
      ${timeUp ? '<div class="sk-timeup">⏰ Time\'s up! Your writing goes to your teacher now.</div>' : ''}
      <div class="sk-send" id="skSend" role="status"><span class="sk-send-note">📤 Sending your writing…</span></div>
    </div>`;
  const asked = W.words && W.words.length ? skAskedWords(text, W.words) : null;
  lastPayload = {
    v: 1, code: SK.code, type: info.type, title: `Step ${level.no} · ${level.theme} — ${info.name}`, step: level.id, stepNo: level.no, skill: 'writing',
    name: SK.name, studentId: SK.studentId, text, words, minWords: W.minWords, maxWords: W.maxWords,
    timeSeconds: secs, timeDisplay: fmtClock(secs), date: new Date().toISOString()
  };
  if (asked) lastPayload.asked = asked;
  // builtAt = the Submit time (= date): Loom hides results "built" before a "Delete all results" (isExpiredResult in common.js);
  // a page opened before a reset and sent after it is a new result, in Results and the Course's results table alike.
  lastPayload.builtAt = lastPayload.date;
  lastPayload.__id = skResultId(lastPayload);
  markDone(lastPayload);   // finished: this device won't open it again (one try per exercise)
  keepUnsent(lastPayload);   // kept on this phone until the save is confirmed (2026-11-13)
  $('#skAfter').innerHTML = '';
  queueW = W;   // sendNow puts it on the waiting list once it is saved
  sendNow();
}

/* ---------- speaking (practice only: nothing recorded, sent or scored) ---------- */
let speakTimer = null;
const fmtMinSec = secs => { const s = Math.max(0, Math.ceil(secs)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
function skCanSpeak() { return 'speechSynthesis' in window && !!window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined'; }
function skSay(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB'; u.rate = 0.85;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (e) { /* no voice: nothing to do */ }
}
function showSpeaking(level) {
  const S = level.speaking;
  const canSpeak = skCanSpeak();
  const stepsHtml = n => `<ol class="sk-steps" aria-label="Steps">${['Words', 'Questions', 'Talk'].map((t, i) =>
    `<li class="${i + 1 === n ? 'on' : i + 1 < n ? 'done' : ''}"${i + 1 === n ? ' aria-current="step"' : ''}><span>${i + 1}</span> ${t}</li>`).join('')}</ol>`;
  const shell = (n, inner) => { clearInterval(speakTimer); root().innerHTML = headerHtml(level) + stepsHtml(n) + inner; window.scrollTo(0, 0); };

  const stepWords = () => {
    shell(1, `<section class="sk-card"><h2>🗣️ ${S.topic ? esc(S.topic) + ' — words' : 'Words to help you speak'}</h2>
      <p class="sk-intro">Read the words. Say each example out loud.</p>
      <ul class="sk-wordgrid">${S.words.map((w, i) => `<li class="sk-word"><span class="sk-word-emoji" aria-hidden="true">${esc(w.emoji)}</span>
        <div class="sk-word-body"><b>${esc(w.w)}</b>${w.uz ? `<small class="sk-uz" lang="uz" translate="no">${esc(w.uz)}</small>` : ''}<span>${esc(w.ex)}</span></div>
        ${canSpeak ? `<button type="button" class="sk-say" data-i="${i}" title="Listen" aria-label="Listen to ${esc(w.w)}">🔊</button>` : ''}</li>`).join('')}</ul>
      <div class="sk-actions"><button type="button" class="sk-btn sk-btn-main" id="skNext">Next →</button></div></section>`);
    root().querySelectorAll('.sk-say').forEach(b => b.addEventListener('click', () => { const w = S.words[+b.dataset.i]; skSay(w.w + '. ' + w.ex); }));
    $('#skNext').addEventListener('click', () => stepQuestion(0));
  };
  const stepQuestion = i => {
    const q = S.questions[i];
    shell(2, `<section class="sk-card"><p class="sk-qcount">Question ${i + 1} of ${S.questions.length}</p>
      <h2 class="sk-sq">${esc(q.q)}</h2>
      <p class="sk-use"><b>Words you can use:</b> ${(q.use || []).map(u => `<span class="sk-use-chip">${esc(u)}</span>`).join(' ')}</p>
      <p class="sk-intro">Answer out loud, in a full sentence.</p>
      <div class="sk-actions sk-actions-2"><button type="button" class="sk-btn sk-btn-ghost" id="skBack">← Back</button>
      <button type="button" class="sk-btn sk-btn-main" id="skNext">Next →</button></div></section>`);
    $('#skBack').addEventListener('click', () => i ? stepQuestion(i - 1) : stepWords());
    $('#skNext').addEventListener('click', () => i + 1 < S.questions.length ? stepQuestion(i + 1) : stepTalk());
  };
  const stepTalk = () => {
    const P = S.part2;
    const sec = window.__skFast ? 0.02 : 1;   // tests: one second lasts 20 ms
    shell(3, `<section class="sk-card"><h2 class="sk-topic">🎤 ${esc(P.topic)}</h2>
      <p class="sk-points-t">Talk about:</p>
      <ul class="sk-points">${P.hints.map(h => `<li>${esc(h)}</li>`).join('')}</ul>
      <p class="sk-intro">You can talk for ${P.seconds} seconds. It is up to you: nothing is recorded or sent.</p>
      <div class="sk-speak-timer" id="skSpeakTimer" role="timer" aria-live="off">${fmtMinSec(P.seconds)}</div>
      <p class="sk-well" id="skWell" hidden>Well done! 🎉</p>
      <div class="sk-actions sk-actions-2" id="skTalkActions"></div>
      <div class="sk-actions"><button type="button" class="sk-btn sk-btn-ghost" id="skBack">← Back to the questions</button></div></section>`);
    const box = $('#skSpeakTimer'), acts = $('#skTalkActions'), well = $('#skWell');
    const idle = () => {
      clearInterval(speakTimer);
      box.textContent = fmtMinSec(P.seconds); box.className = 'sk-speak-timer'; well.hidden = true;
      acts.innerHTML = `<button type="button" class="sk-btn sk-btn-ghost" id="skReady">⏳ Get ready (30 s)</button>
        <button type="button" class="sk-btn sk-btn-main" id="skGo">🎤 Start speaking</button>`;
      $('#skReady').addEventListener('click', () => run(30, 'ready', () => idle()));
      $('#skGo').addEventListener('click', () => run(P.seconds, 'talk', finished));
    };
    const finished = () => {
      box.textContent = fmtMinSec(0); box.className = 'sk-speak-timer done'; well.hidden = false;
      acts.innerHTML = '<button type="button" class="sk-btn sk-btn-main" id="skAgain">🔁 Start again</button>';
      $('#skAgain').addEventListener('click', idle);
    };
    const run = (secs, mode, onEnd) => {
      clearInterval(speakTimer);
      well.hidden = true;
      const t0 = Date.now();
      box.className = 'sk-speak-timer ' + mode;
      acts.innerHTML = `<button type="button" class="sk-btn sk-btn-ghost" id="skStop">⏹ Stop</button>`;
      $('#skStop').addEventListener('click', idle);
      const tick = () => {
        const left = secs - (Date.now() - t0) / 1000 / sec;
        box.textContent = fmtMinSec(left);
        if (left <= 0) { clearInterval(speakTimer); onEnd(); }
      };
      tick();
      speakTimer = setInterval(tick, window.__skFast ? 5 : 250);
    };
    $('#skBack').addEventListener('click', () => stepQuestion(S.questions.length - 1));
    idle();
  };
  stepWords();
}

/* ---------- start ---------- */
function boot() {
  const level = stepData();
  const info = SKILL_INFO[SK.skill];
  if (!level || !info) { showMissing(); return; }
  document.title = `${info.name} · Step ${level.no} — Loom`;
  if (!SK.preview && SK.skill !== 'speaking' && SK.code.length !== 6) { showNoCode(); return; }
  // any course link: answers this phone still holds (a save that failed) are sent again (2026-11-13)
  if (!SK.preview && Object.keys(keptAll()).length) keptSending = skSendKept();
  if (SK.skill === 'speaking') {
    if (level.speaking) showSpeaking(level);
    else showComingSoon(level, `Step ${level.no} (${level.theme}) is still being made. Ask your teacher which step to do now.`);
    return;
  }
  const content = level[SK.skill];
  if (!content) { showComingSoon(level, `Step ${level.no} (${level.theme}) is still being made. Ask your teacher which step to do now.`); return; }
  if (SK.preview) { SK.name = 'Preview'; SK.studentId = ''; if (SK.skill === 'writing') showWriting(level); else showExercise(level); return; }
  showStart(level, content);
}
boot();
