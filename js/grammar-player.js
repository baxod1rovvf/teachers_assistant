/* Grammar Journey — the student's lesson (skill.html?s=grammar&gl=<lesson id>&c=<code>, 2026-11-16).
   Spec: docs/superpowers/specs/2026-11-16-grammar-journey-design.md ("Student page", "Total time").
   Each part: a Learn card (rule, table, examples, a short Uzbek note) → Practise (5 questions, one at a time; a wrong answer shows the
   rule again with a hint and the student must get it right to go on; never sent). After the last part: a 20-question revision test on
   one page. Only the FIRST Submit is sent (kept on the phone until saved — ctx.keep / ctx.send, skill-player.js); "Try the test again"
   shuffles questions + options and sends nothing. Progress is kept on the phone (ta_grammar_draft|<code>) so a reload continues;
   cleared once the first result is saved. Only active time counts: page visible and touched in the last 5 minutes.
   A classic script: skill-player.js (a module) calls GR.start(lesson, root, ctx). Tests: window.__grFast, __grClock, __grSeed. */
(function () {
  'use strict';
  const IDLE_MS = 5 * 60 * 1000, SAVE_EVERY_MS = 15000;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const now = () => { const c = window.__grClock; return typeof c === 'function' ? c() : typeof c === 'number' ? c : Date.now(); };
  const norm = s => (window.skNorm ? window.skNorm(s) : String(s || '').toLowerCase().trim());
  const noEnd = s => String(s || '').trim().replace(/[.?!]+$/, '');

  /* ---------- active time ---------- */
  const T = { ms: 0, lastTick: 0, lastTouch: 0, vis: true, on: false, savedAt: 0 };
  function tick() {
    const t = now();
    if (T.on && T.vis) T.ms += Math.max(0, Math.min(t, T.lastTouch + IDLE_MS) - T.lastTick);
    T.lastTick = t;
  }
  function touch() { tick(); T.lastTouch = now(); }
  let listening = false, timer = null;
  function listen() {
    if (listening) return;
    listening = true;
    ['pointerdown', 'keydown', 'touchstart', 'input', 'click'].forEach(ev => document.addEventListener(ev, touch, { passive: true, capture: true }));
    window.addEventListener('scroll', touch, { passive: true });
    document.addEventListener('visibilitychange', () => {
      tick();
      T.vis = document.visibilityState !== 'hidden';
      if (T.vis) T.lastTouch = now(); else save();   // coming back counts as a touch; going away keeps the progress
    });
    window.addEventListener('pagehide', save);
  }
  function startClock(ms) {
    T.ms = ms || 0; T.lastTick = T.lastTouch = now(); T.vis = document.visibilityState !== 'hidden'; T.on = true; T.savedAt = T.ms;
    listen();
    clearInterval(timer);
    timer = setInterval(() => { tick(); if (T.ms - T.savedAt >= SAVE_EVERY_MS) save(); }, window.__grFast ? 50 : 1000);
  }
  function stopClock() { tick(); T.on = false; clearInterval(timer); }
  function activeMs() { tick(); return Math.round(T.ms); }
  function formatTime(seconds) {
    const s = Math.max(0, Number(seconds) || 0);
    const m = s > 0 ? Math.max(1, Math.round(s / 60)) : 0;
    return m >= 60 ? Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min' : m + ' min';
  }

  /* ---------- the lesson's state ---------- */
  let S = null;   // { lesson, root, ctx, mode: 'first' | 'again', chunk, stage, q, answers[], order[], submitted, first, firstSent, round }
  const draftKey = () => 'ta_grammar_draft|' + S.ctx.code;
  const keeping = () => S && S.mode === 'first' && !S.submitted && !S.ctx.preview && S.ctx.code;
  function save() {
    if (!keeping()) return;
    const ms = activeMs();
    T.savedAt = ms;
    try {
      localStorage.setItem(draftKey(), JSON.stringify({ v: S.lesson.v, lesson: S.lesson.id, studentId: S.ctx.studentId || '', chunk: S.chunk,
        stage: S.stage, q: S.q, answers: S.answers, activeMs: ms, at: new Date().toISOString() }));
    } catch (e) { /* private window or full: the lesson goes on */ }
  }
  function readDraft() { try { return JSON.parse(localStorage.getItem(draftKey()) || 'null'); } catch (e) { return null; } }
  function clearDraft() { try { localStorage.removeItem(draftKey()); } catch (e) { /* private window */ } }
  const sameId = (a, b) => (window.taIdKey ? window.taIdKey(a) === window.taIdKey(b) : String(a || '').trim() === String(b || '').trim());

  /* ---------- seeded shuffle (a retake; __grSeed in tests) ---------- */
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function shuffled(list, rand) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }

  /* ---------- questions ---------- */
  function isRight(q, given) {
    if (q.type === 'gap') return window.skMark ? window.skMark(given, q.a) : q.a.some(a => norm(a) === norm(given));
    if (q.type === 'order') return !!noEnd(given) && q.a.some(a => norm(noEnd(a)) === norm(noEnd(given)));
    return !!given && q.a.some(a => norm(a) === norm(given));
  }
  function chipsFor(q, rand) {
    const right = w => q.a.some(a => norm(noEnd(a)) === norm(w.join(' ')));
    let words = shuffled(q.words, rand);
    for (let i = 0; i < 6 && right(words) && q.words.length > 1; i++) words = shuffled(q.words, rand);
    return words;
  }
  // the question's text and its answer controls (options for choose/fix, a box for gap, word chips for order)
  function bodyHtml(q, rand, shuffleOpts) {
    if (q.type === 'gap') {
      const parts = String(q.q).split(/_{2,}/);
      const box = '<input type="text" class="sk-gap gr-gap" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer">';
      return `<div class="gr-qtext">${parts.length > 1 ? esc(parts[0]) + box + esc(parts.slice(1).join('___')) : esc(q.q) + ' ' + box}</div>`;
    }
    if (q.type === 'order') {
      return `<div class="gr-qtext">${esc(q.q || 'Put the words in order.')}</div>
        <div class="gr-line" aria-label="Your sentence"></div>
        <div class="gr-bank">${chipsFor(q, rand).map(w => `<button type="button" class="gr-chip">${esc(w)}</button>`).join('')}</div>`;
    }
    const opts = shuffleOpts ? shuffled(q.options || [], rand) : (q.options || []);
    const text = q.type === 'fix' ? (q.q || 'Which sentence is correct?') : q.q;
    return `<div class="gr-qtext">${esc(text)}</div><div class="sk-opts gr-opts${q.type === 'fix' ? ' gr-opts-col' : ''}" role="group" aria-label="Choose one">` +
      opts.map(o => `<button type="button" class="sk-opt gr-opt" aria-pressed="false" data-val="${esc(o)}">${esc(o)}</button>`).join('') + '</div>';
  }
  function givenIn(box) {
    const inp = box.querySelector('.gr-gap');
    if (inp) return inp.value.trim();
    const line = box.querySelector('.gr-line');
    if (line) return [...line.querySelectorAll('.gr-chip')].map(c => c.textContent).join(' ');
    const on = box.querySelector('.gr-opt.on');
    return on ? on.dataset.val : '';
  }
  function putGiven(box, given) {
    if (!given) return;
    const inp = box.querySelector('.gr-gap');
    if (inp) { inp.value = given; return; }
    const line = box.querySelector('.gr-line');
    if (line) {
      given.split(' ').forEach(w => { const c = [...box.querySelectorAll('.gr-bank .gr-chip')].find(b => b.textContent === w); if (c) line.appendChild(c); });
      return;
    }
    box.querySelectorAll('.gr-opt').forEach(b => { const on = b.dataset.val === given; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  }
  // taps: an option is chosen; a word chip moves into the sentence and back (tap it again)
  function wire(box, onChange) {
    box.addEventListener('click', e => {
      const chip = e.target.closest('.gr-chip');
      if (chip && !chip.disabled) {
        const line = box.querySelector('.gr-line'), bank = box.querySelector('.gr-bank');
        (chip.parentNode === line ? bank : line).appendChild(chip);
        onChange('chip');
        return;
      }
      const opt = e.target.closest('.gr-opt');
      if (opt && !opt.disabled) {
        box.querySelectorAll('.gr-opt').forEach(b => { b.classList.toggle('on', b === opt); b.setAttribute('aria-pressed', b === opt ? 'true' : 'false'); });
        onChange('opt');
      }
    });
    const inp = box.querySelector('.gr-gap');
    if (inp) {
      inp.addEventListener('input', () => onChange('input'));
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); onChange('enter'); } });
    }
  }

  /* ---------- screens ---------- */
  const lessonTitle = () => `Lesson ${S.lesson.no} · ${S.lesson.title}`;
  function show(html) {
    S.root.innerHTML = (S.ctx.header || '') + html;
    window.scrollTo(0, 0);
  }
  const partLine = what => `<p class="gr-step">Part ${S.chunk + 1} of ${S.lesson.chunks.length} · ${what}</p>`;

  function showLearn() {
    S.stage = 'learn'; S.q = 0; save();
    const L = S.lesson.chunks[S.chunk].learn;
    const table = L.table && L.table.length ? `<div class="gr-table-wrap"><table class="gr-table"><thead><tr>${L.table[0].map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${L.table.slice(1).map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '';
    show(`<section class="sk-card gr-card gr-learn" data-chunk="${S.chunk}">${partLine('Learn')}
      <h2>${esc(L.title)}</h2>
      <p class="gr-rule">${esc(L.rule)}</p>
      ${table}
      <h3 class="sk-sub">Examples</h3>
      <ul class="gr-examples">${(L.examples || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      ${L.uz ? `<p class="gr-uz" lang="uz" translate="no"><span aria-hidden="true">💬</span> ${esc(L.uz)}</p>` : ''}
      <div class="sk-actions"><button type="button" class="sk-btn sk-btn-main" id="grPractise">✏️ Practise</button></div>
    </section>`);
    S.root.querySelector('#grPractise').addEventListener('click', () => showPractise());
  }

  function showPractise() {
    S.stage = 'practise'; save();
    const chunk = S.lesson.chunks[S.chunk], q = chunk.practise[S.q];
    const lastQ = S.q === chunk.practise.length - 1, lastChunk = S.chunk === S.lesson.chunks.length - 1;
    const next = !lastQ ? 'Next question →' : lastChunk ? '🏁 Go to the revision test' : 'Next part →';
    const typed = q.type === 'gap' || q.type === 'order';
    show(`<section class="sk-card gr-card gr-practise" data-chunk="${S.chunk}">${partLine(`Practise · Question ${S.q + 1} of ${chunk.practise.length}`)}
      <div class="gr-pq" data-chunk="${S.chunk}" data-q="${S.q}" data-type="${q.type}">${bodyHtml(q, Math.random, false)}</div>
      <div class="gr-feedback" role="status"></div>
      <div class="gr-hint" hidden><p class="gr-hint-t">📘 Read the rule again</p><p>${esc(chunk.learn.rule)}</p>${q.hint ? `<p class="gr-hint-tip">💡 ${esc(q.hint)}</p>` : ''}</div>
      <div class="sk-actions">${typed ? '<button type="button" class="sk-btn sk-btn-ghost" id="grCheck">✔️ Check my answer</button>' : ''}
        <button type="button" class="sk-btn sk-btn-main" id="grNext" disabled>${next}</button></div>
    </section>`);
    const box = S.root.querySelector('.gr-pq'), fb = S.root.querySelector('.gr-feedback'), hint = S.root.querySelector('.gr-hint');
    const nextBtn = S.root.querySelector('#grNext'), checkBtn = S.root.querySelector('#grCheck');
    let solved = false;
    const check = () => {
      if (solved) return;
      const given = givenIn(box);
      if (!given) { fb.textContent = q.type === 'order' ? 'Tap the words to make the sentence.' : 'Write your answer first.'; return; }
      if (isRight(q, given)) {
        solved = true;
        fb.innerHTML = '<span class="gr-ok">✅ Right!</span>';
        hint.hidden = true;
        box.classList.add('right'); box.classList.remove('wrong');
        box.querySelectorAll('button, input').forEach(x => { x.disabled = true; });
        if (checkBtn) checkBtn.hidden = true;
        nextBtn.disabled = false;
        nextBtn.focus();
      } else {
        fb.innerHTML = '<span class="gr-no">❌ Not quite. Read the rule and try again.</span>';
        hint.hidden = false;
        box.classList.add('wrong');
        const on = box.querySelector('.gr-opt.on');
        if (on) { on.classList.remove('on'); on.classList.add('gr-tried'); on.disabled = true; }
      }
    };
    wire(box, kind => { if (kind === 'opt' || kind === 'enter') check(); else if (!solved) fb.textContent = ''; });
    if (checkBtn) checkBtn.addEventListener('click', check);
    nextBtn.addEventListener('click', () => {
      if (!lastQ) { S.q++; showPractise(); return; }
      if (!lastChunk) { S.chunk++; showLearn(); return; }
      showTest();
    });
  }

  function showTest() {
    const test = S.lesson.test, again = S.mode === 'again';
    S.round++;
    const rand = again ? rng(window.__grSeed != null ? Number(window.__grSeed) + S.round : Math.floor(Math.random() * 1e9)) : Math.random;
    let order = test.map((_, i) => i);
    if (again) {
      order = shuffled(order, rand);
      if (order[0] === 0 && order.length > 1) { const j = 1 + Math.floor(rand() * (order.length - 1)); [order[0], order[j]] = [order[j], order[0]]; }
    } else { S.stage = 'test'; save(); }
    S.order = order;
    const answers = again ? [] : S.answers;
    show(`<section class="sk-card gr-card gr-test">
      <h2>🏁 Revision test</h2>
      <p class="sk-intro">${again ? 'Practice only — this try is not sent.' : `${test.length} questions. Answer them all, then press Submit. Only this first try is sent to your teacher.`}</p>
      <ol class="gr-tqs">${order.map((qi, n) => `<li class="sk-q gr-tq" data-q="${qi}" data-type="${test[qi].type}"><span class="sk-num">${n + 1}</span>
        <div class="sk-qbody gr-qbody">${bodyHtml(test[qi], rand, again)}<div class="sk-fix" hidden></div></div></li>`).join('')}</ol>
      <div class="sk-actions" id="grActions"><p class="gr-warn" role="alert" hidden></p>
        <button type="button" class="sk-btn sk-btn-main" id="grSubmit">${again ? '✔️ Check my answers' : '📤 Submit my answers'}</button></div>
    </section><div id="grAfter"></div>`);
    S.root.querySelectorAll('.gr-tq').forEach(li => {
      const qi = +li.dataset.q;
      if (answers[qi]) putGiven(li, answers[qi]);
      wire(li, () => { if (!again) { S.answers[qi] = givenIn(li); save(); } });
    });
    let warned = false;
    S.root.querySelector('#grSubmit').addEventListener('click', () => {
      const blank = [...S.root.querySelectorAll('.gr-tq')].filter(li => !givenIn(li));
      if (blank.length && !warned) {
        warned = true;
        const w = S.root.querySelector('.gr-warn');
        w.hidden = false;
        w.textContent = `⚠️ ${blank.length === 1 ? '1 question has' : blank.length + ' questions have'} no answer. Answer ${blank.length === 1 ? 'it' : 'them'}, or press the button again to finish as it is.`;
        blank[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      submitTest();
    });
  }

  function markTest() {
    const test = S.lesson.test, out = [];
    S.root.querySelectorAll('.gr-tq').forEach(li => {
      const qi = +li.dataset.q, q = test[qi], given = givenIn(li), ok = isRight(q, given);
      out[qi] = { given, right: q.a[0], ok };
      li.classList.add(ok ? 'right' : 'wrong');
      li.querySelectorAll('button, input').forEach(x => { x.disabled = true; });
      li.querySelectorAll('.gr-opt').forEach(b => { if (q.a.some(a => norm(a) === norm(b.dataset.val))) b.classList.add('is-answer'); });
      const fix = li.querySelector('.sk-fix');
      fix.hidden = false;
      fix.innerHTML = ok ? '✅ Right!' : `❌ ${given ? 'Not quite.' : 'No answer.'} The answer: <b>${esc(q.a[0])}</b>`;
    });
    return out;
  }

  function submitTest() {
    const first = S.mode === 'first' && !S.submitted;
    if (first) stopClock();
    const answers = markTest();
    const correct = answers.filter(a => a && a.ok).length, total = S.lesson.test.length;
    const pct = correct / total;
    const cheer = pct >= 0.8 ? '🌟 Excellent work!' : pct >= 0.6 ? '👏 Well done!' : pct >= 0.4 ? '💪 Good try — keep going!' : '🌱 Keep practising — you can do it!';
    S.root.querySelector('#grActions').innerHTML = `<div class="sk-result">
      <div class="sk-score gr-score"><span class="sk-score-n">${correct}/${total}</span><span class="sk-score-t">${cheer}</span></div>
      ${first || (S.first && !S.firstSent) ? '<div class="sk-send" id="grSend" role="status"></div>' : ''}
      ${!first ? '<p class="gr-note">Practice only — this try was not sent.</p>' : ''}
      <div class="sk-actions gr-again"><button type="button" class="sk-btn sk-btn-ghost" id="grRetake">🔁 Try the test again</button>
        <button type="button" class="sk-btn sk-btn-ghost" id="grReread">📘 Read the lessons again</button></div>
    </div>`;
    S.root.querySelector('#grRetake').addEventListener('click', () => { S.mode = 'again'; showTest(); });
    S.root.querySelector('#grReread').addEventListener('click', reread);
    if (first) {
      S.submitted = true;
      const secs = Math.max(1, Math.ceil(T.ms / 1000));
      const date = new Date().toISOString();
      S.first = { v: 1, type: 'Grammar course', code: S.ctx.code, name: S.ctx.name || '', studentId: S.ctx.studentId || '', skill: 'grammar',
        lesson: S.lesson.id, lessonNo: S.lesson.no, level: S.ctx.levelId || 'beginner', title: lessonTitle() + ' — Grammar', correct, total,
        score: Math.round(pct * 100), timeSeconds: secs, timeDisplay: formatTime(secs), answers, date, builtAt: date };
      if (S.ctx.preview) { setSend('preview'); return; }
      if (S.ctx.keep) S.ctx.keep(S.first);   // kept on this phone until the save is confirmed
      sendFirst();
    } else if (S.first && !S.firstSent) setSend(S.sending ? 'sending' : 'failed');
  }

  function setSend(state) {
    const box = S.root.querySelector('#grSend');
    if (!box) return;
    box.classList.toggle('bad', state === 'failed');
    if (state === 'preview') box.innerHTML = '<span class="sk-send-note">👀 Preview — nothing was sent.</span>';
    else if (state === 'sending') box.innerHTML = '<span class="sk-send-note">📤 Sending your answers to your teacher…</span>';
    else if (state === 'ok') box.innerHTML = '<span class="sk-send-ok">Saved ✅ Your teacher has your answers.</span>';
    else {
      box.innerHTML = '<span class="sk-send-bad">Not sent yet — check the internet</span> <button type="button" class="sk-btn sk-btn-small" id="grSendAgain">📤 Send my answers</button>';
      box.querySelector('#grSendAgain').addEventListener('click', sendFirst);
    }
  }
  async function sendFirst() {
    if (!S.first || S.firstSent || S.sending) return;
    S.sending = true;
    setSend('sending');
    let state = 'failed';
    try { state = await S.ctx.send(S.first); } catch (e) { state = 'failed'; }
    S.sending = false;
    if (state === 'ok') { S.firstSent = true; clearDraft(); }
    setSend(state);
  }

  function reread() { S.mode = 'again'; S.chunk = 0; S.q = 0; showLearn(); }

  function showDone(done) {
    clearDraft();
    S.mode = 'again';
    const score = typeof done.correct === 'number' && typeof done.total === 'number' ? `${done.correct}/${done.total}` : (done.summary || '').replace(/\s/g, '');
    show(`<section class="sk-card sk-center gr-card gr-done">
      <div class="sk-big-emoji" aria-hidden="true">✅</div>
      <h2>You've done this lesson${score ? ' — ' + esc(score) : ''}</h2>
      ${S.ctx.name || S.ctx.studentId ? `<p class="sk-done-who">👤 <b>${esc(S.ctx.name)}</b>${S.ctx.studentId ? ' · ID ' + esc(S.ctx.studentId) : ''}</p>` : ''}
      <p>Your teacher already has your answers. You can try the test again or read the lessons — nothing more is sent.</p>
      <div class="sk-actions gr-again"><button type="button" class="sk-btn sk-btn-main" id="grRetake">🔁 Try the test again</button>
        <button type="button" class="sk-btn sk-btn-ghost" id="grReread">📘 Read the lessons again</button></div>
      ${S.ctx.notMe ? '<div class="sk-actions"><button type="button" class="sk-btn sk-btn-small" id="grNotMe">Not you? Write your own ID</button></div>' : ''}
    </section>`);
    S.root.querySelector('#grRetake').addEventListener('click', () => showTest());
    S.root.querySelector('#grReread').addEventListener('click', reread);
    const nm = S.root.querySelector('#grNotMe');
    if (nm) nm.addEventListener('click', S.ctx.notMe);
  }

  /* GR.start(lesson, root, ctx): ctx = { preview, code, name, studentId, levelId, header, send(payload) → Promise<'ok'|'failed'>,
     keep(payload), done ({ correct, total, summary } when the database already has this student's result), notMe } */
  function start(lesson, root, ctx) {
    clearInterval(timer);
    T.on = false;
    S = { lesson, root, ctx: ctx || {}, mode: 'first', chunk: 0, stage: 'learn', q: 0, answers: [], order: [], submitted: false,
      first: null, firstSent: false, sending: false, round: 0 };
    if (S.ctx.done) { showDone(S.ctx.done); return; }
    let ms = 0;
    const d = !S.ctx.preview && S.ctx.code ? readDraft() : null;
    if (d && d.lesson === lesson.id && sameId(d.studentId, S.ctx.studentId)) {
      ms = Number(d.activeMs) || 0;   // the time always carries on
      if (d.v === lesson.v) {         // other content (the teacher fixed the lesson) → start again from Part 1
        const nc = lesson.chunks.length;
        S.chunk = Math.min(Math.max(0, d.chunk | 0), nc - 1);
        S.q = Math.min(Math.max(0, d.q | 0), lesson.chunks[S.chunk].practise.length - 1);
        S.stage = ['learn', 'practise', 'test'].includes(d.stage) ? d.stage : 'learn';
        S.answers = Array.isArray(d.answers) ? d.answers.slice(0, lesson.test.length) : [];
      }
    }
    startClock(ms);
    if (S.stage === 'test') showTest(); else if (S.stage === 'practise') showPractise(); else showLearn();
  }

  window.GR = { start, activeMs, formatTime, save };
})();
