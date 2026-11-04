// Skills course — the student page (skill.html?s=<skill>&lv=<level>&c=<code>, 2026-11-04).
// A student opens a level from the teacher's link, writes name + ID on the start card, does the Listening or
// Reading level, presses Submit: every answer is marked ✅ / ❌, the score shows, then 10 useful words and
// "Analyze >" (the transcript / text with the answers highlighted). One result goes to Firestore `results`
// in the student-record shape exercises use (so the database lock lets it through), 3 tries, then "Send again".
// Preview (&preview=1, the teacher's ▶️ Try): no start card, nothing imported from Firebase, nothing written.
// Writing and Speaking views come later (they show "Coming soon" here for now).

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

const params = new URLSearchParams(location.search);
const SK = window.SK = {
  skill: (params.get('s') || '').toLowerCase(),
  level: parseInt(params.get('lv'), 10) || 0,
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
  return String(s == null ? '' : s).toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').trim().replace(/\.+$/, '').trim();
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
    return given === want;
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

/* ---------- the page ---------- */
const root = () => $('#skApp');

function levelData() {
  const levels = (window.TA_SKILLS && TA_SKILLS.elementary && TA_SKILLS.elementary.levels) || [];
  return levels.find(l => l.no === SK.level) || null;
}

function headerHtml(level) {
  const info = SKILL_INFO[SK.skill];
  return `<header class="sk-head">
    <span class="sk-brand">🧶 loom</span>
    <span class="sk-chip sk-chip-skill">${info.emoji} ${info.name}</span>
    <span class="sk-chip">${esc(level.emoji)} Level ${level.no} · ${esc(level.theme)}</span>
    ${SK.preview ? '<span class="sk-chip sk-preview" title="Nothing is sent from a preview">👀 Preview</span>' : ''}
  </header>`;
}

function showMissing() {
  document.title = 'Level not found — Loom';
  root().innerHTML = `<div class="sk-card sk-center sk-missing">
    <div class="sk-big-emoji" aria-hidden="true">🧭</div>
    <h1>This level doesn't exist</h1>
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
        <h2>${esc(content.title)}</h2>
        <div class="ta-login-type">${info.name} · Level ${level.no}</div>
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
  $('#skStartForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#studentNameInput').value.trim().replace(/\s+/g, ' ');
    const id = $('#skIdInput').value.trim();
    if (!name || !id) {
      $('#skStartErr').textContent = !name ? 'Write your name to start.' : 'Write your ID to start (your teacher gave it to you).';
      (!name ? $('#studentNameInput') : $('#skIdInput')).focus();
      return;
    }
    SK.name = name; SK.studentId = id;
    try { localStorage.setItem(NAME_KEY, JSON.stringify({ name, id })); } catch (err) { /* private window */ }
    loadFirestore().catch(() => {});   // get the database ready while the student works
    showExercise(level);
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
  if (kind === 'tfng' || kind === 'choose') {
    const opts = kind === 'tfng' ? ['True', 'False', 'Not given'] : q.opts;
    body = `<div class="sk-qtext">${esc(q.q)}</div><div class="sk-opts" role="group" aria-label="Answer ${n}">` +
      opts.map((o, i) => `<button type="button" class="sk-opt" aria-pressed="false" data-val="${esc(o)}">${kind === 'choose' ? `<b>${'abc'[i]}</b> ` : ''}${esc(o)}</button>`).join('') +
      '</div>';
  } else {
    body = `<div class="sk-qtext">${gapHtml(q, n)}</div>`;
  }
  return `<li class="sk-q" data-n="${n}" data-kind="${kind}"><span class="sk-num">${n}</span><div class="sk-qbody">${body}<div class="sk-fix" hidden></div></div></li>`;
}
const SECTION_TITLES = {
  tfng: 'True, False or Not given?',
  gap: 'Complete the sentences with a word from the text.',
  choose: 'Choose a, b or c.'
};
function questionsHtml(questions, isReading) {
  let html = '', kind = null, n = 0;
  questions.forEach(q => {
    n++;
    const k = isReading ? q.type : 'gap';
    if (isReading && k !== kind) {
      if (kind) html += '</ol>';
      html += `<h3 class="sk-sub">${SECTION_TITLES[k] || ''}</h3><ol class="sk-qs">`;
      kind = k;
    } else if (!isReading && n === 1) html += '<ol class="sk-qs">';
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
    html += `<span class="sk-sent" data-line="${i++}">${esc(b)}</span>`;
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
      <p class="sk-intro">Read the text, then answer the 15 questions below.</p>
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
  if (li.dataset.kind === 'gap') return li.querySelector('.sk-gap').value;
  const on = li.querySelector('.sk-opt.on');
  return on ? on.dataset.val : '';
}

function submit(level, content, info) {
  const items = [...root().querySelectorAll('.sk-q')];
  const answers = content.questions.map((q, i) => {
    const li = items[i];
    const given = givenFor(li).trim();
    const right = skMark(given, q.a);
    li.classList.add(right ? 'right' : 'wrong');
    li.querySelectorAll('input, .sk-opt').forEach(x => { x.disabled = true; });
    if (li.dataset.kind !== 'gap') li.querySelectorAll('.sk-opt').forEach(b => { if (b.dataset.val === q.a[0]) b.classList.add('is-answer'); });
    const fix = li.querySelector('.sk-fix');
    fix.hidden = false;
    fix.innerHTML = right ? '✅ Right!' : `❌ ${given ? 'Not quite.' : 'No answer.'} The answer: <b>${esc(q.a[0])}</b>`;
    return { q: q.q, given, right };
  });
  const correct = answers.filter(a => a.right).length;
  const total = answers.length;
  const secs = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
  const pad = n => String(n).padStart(2, '0');
  lastPayload = {
    v: 1, code: SK.code, type: info.type, title: `Level ${level.no} · ${level.theme} — ${info.name}`, level: level.no, skill: SK.skill,
    name: SK.name, studentId: SK.studentId, correct, total, score: Math.round(correct / total * 100), band: skBand(correct, total),
    answers, timeSeconds: secs, timeDisplay: pad(Math.floor(secs / 60)) + ':' + pad(secs % 60), date: new Date().toISOString()
  };
  lastPayload.__id = skResultId(lastPayload);   // the same record on every try and on "Send again"
  const pct = correct / total;
  const cheer = pct >= 0.8 ? '🌟 Excellent work!' : pct >= 0.6 ? '👏 Well done!' : pct >= 0.4 ? '💪 Good try — keep going!' : '🌱 Keep practising — you can do it!';
  $('#skActions').innerHTML = `<div class="sk-result">
      <div class="sk-score"><span class="sk-score-n">${correct} / ${total}</span><span class="sk-score-t">${cheer}</span></div>
      <div class="sk-send" id="skSend" role="status"></div>
    </div>`;
  const words = content.words || [];
  const isReading = SK.skill === 'reading';
  $('#skAfter').innerHTML = `<section class="sk-card sk-words-card"><h2>💡 ${words.length} useful words</h2>
      <ul class="sk-words">${words.map(w => `<li><b>${esc(w.w)}</b><span class="sk-m">${esc(w.m)}</span><i>${esc(w.ex)}</i></li>`).join('')}</ul>
      <div class="sk-actions"><button type="button" class="sk-btn sk-btn-main" id="skAnalyze">Analyze ></button></div>
    </section>
    <div id="skAnalysis"></div>`;
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
  setSend(await skSendResult(lastPayload));
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
      return `<li class="sk-line${nums.length ? ' hl' : ''}"><span class="sk-who sk-who-${t.who === 'Man' ? 'm' : 'w'}">${t.who === 'Man' ? '👨' : '👩'} ${esc(t.who)}</span>
        <span class="sk-said">${nums.map(n => `<span class="sk-qno">Q${n}</span>`).join('')}${esc(t.text)}</span></li>`;
    }).join('')}</ol></section>`;
  $('#skAnalysis').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- start ---------- */
function boot() {
  const level = levelData();
  const info = SKILL_INFO[SK.skill];
  if (!level || !info) { showMissing(); return; }
  document.title = `${info.name} · Level ${level.no} — Loom`;
  if (!SK.preview && SK.skill !== 'speaking' && SK.code.length !== 6) { showNoCode(); return; }
  if (SK.skill === 'writing' || SK.skill === 'speaking') {
    showComingSoon(level, `${info.name} for Level ${level.no} is coming soon in this page. Ask your teacher for the Listening or Reading link for now.`);
    return;
  }
  const content = level[SK.skill];
  if (!content) { showComingSoon(level, `Level ${level.no} (${level.theme}) is still being made. Ask your teacher which level to do now.`); return; }
  if (SK.preview) { SK.name = 'Preview'; SK.studentId = ''; showExercise(level); return; }
  showStart(level, content);
}
boot();
