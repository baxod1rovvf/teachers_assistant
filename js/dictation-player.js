/* Dictation Journey — the student's dictation (skill.html?s=dictation&dl=<dN>&c=<code>, 2026-11-19).
   Spec: docs/superpowers/specs/2026-11-19-dictation-journey-design.md ("Student screen", "Result").
   One sentence at a time: it plays by itself (audio/dictation/dN-s<k>.mp3), ▶ Play again / 🐢 Play slower (0.75×) as often as
   wanted; the student writes it and presses Check (dcCheck, js/dictation-check.js). Wrong → the words are marked and the box keeps
   the text, the student fixes it and checks again — or presses Skip (shows the right sentence, counts a skip). Right → ✅ and the
   next sentence plays. After the last one: score (right the first time), skips, minutes. Only the FIRST full run is sent (kept on
   the phone until saved — ctx.keep / ctx.send, skill-player.js); "Do it again" is practice and sends nothing. Progress is kept on
   the phone (ta_dictation_draft|<code>) so a reload continues; cleared once the first result is saved. Only active time counts
   (page visible and touched in the last 5 minutes), like Grammar. On a phone the work card stays above the keyboard (visualViewport).
   A classic script: skill-player.js (a module) calls DC.start(item, root, ctx).
   Tests: window.__dcFast, __dcClock, __dcNoAudio (play records { sentence, rate, src } in __dcPlayed), __dcAudioFails. */
(function () {
  'use strict';
  const IDLE_MS = 5 * 60 * 1000, SAVE_EVERY_MS = 15000, SLOW = 0.75;
  /* The teacher is deciding whether a wrong word shows the right one next to it. true: wrong words show the right word, missed words
     show themselves. false: a wrong word is only struck, a missed word is a blank of its length, and the right words show after the
     2nd wrong Check of a sentence. (window.__dcShowAnswer overrides it in tests.) */
  const DC_SHOW_ANSWER = true;
  const showAnswer = () => (window.__dcShowAnswer != null ? !!window.__dcShowAnswer : DC_SHOW_ANSWER);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const now = () => { const c = window.__dcClock; return typeof c === 'function' ? c() : typeof c === 'number' ? c : Date.now(); };
  const pause = () => (window.__dcFast ? 40 : 1100);   // ✅ / the skipped sentence shows this long before the next one plays

  /* ---------- active time (as in grammar-player.js) ---------- */
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
      if (T.vis) T.lastTouch = now(); else save();
    });
    window.addEventListener('pagehide', save);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', fit);
      window.visualViewport.addEventListener('scroll', fit);
    }
    window.addEventListener('resize', fit);
  }
  function startClock(ms) {
    T.ms = ms || 0; T.lastTick = T.lastTouch = now(); T.vis = document.visibilityState !== 'hidden'; T.on = true; T.savedAt = T.ms;
    listen();
    clearInterval(timer);
    timer = setInterval(() => { tick(); if (T.ms - T.savedAt >= SAVE_EVERY_MS) save(); }, window.__dcFast ? 50 : 1000);
  }
  function stopClock() { tick(); T.on = false; clearInterval(timer); }
  function activeMs() { tick(); return Math.round(T.ms); }
  function formatTime(seconds) {
    const s = Math.max(0, Number(seconds) || 0);
    const m = s > 0 ? Math.max(1, Math.round(s / 60)) : 0;
    return m >= 60 ? Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min' : m + ' min';
  }

  /* ---------- state ---------- */
  // S = { item, root, ctx, mode: 'first' | 'again', k, recs[{ first, tries, skipped, ok }], busy, submitted, first, firstSent, sending }
  let S = null;
  const N = () => S.item.sentences.length;
  const draftKey = () => 'ta_dictation_draft|' + S.ctx.code;
  const keeping = () => S && S.mode === 'first' && !S.submitted && !S.ctx.preview && S.ctx.code;
  const boxEl = () => S && S.root.querySelector('#dcBox');
  function save() {
    if (!keeping()) return;
    const ms = activeMs();
    T.savedAt = ms;
    const box = boxEl();
    try {
      localStorage.setItem(draftKey(), JSON.stringify({ dictation: S.item.id, h: contentHash(S.item), studentId: S.ctx.studentId || '', k: S.k,
        recs: S.recs, typed: box && !S.busy ? box.value : '', activeMs: ms, at: new Date().toISOString() }));
    } catch (e) { /* private window or full: the dictation goes on */ }
  }
  function readDraft() { try { return JSON.parse(localStorage.getItem(draftKey()) || 'null'); } catch (e) { return null; } }
  function clearDraft() { try { localStorage.removeItem(draftKey()); } catch (e) { /* private window */ } }
  // the dictation's content version: a draft made for other sentences (the teacher changed the text) starts again from sentence 1
  function contentHash(item) {
    let h = 5381;
    const str = (item.sentences || []).join('\n');
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  const sameId = (a, b) => (window.taIdKey ? window.taIdKey(a) === window.taIdKey(b) : String(a || '').trim() === String(b || '').trim());
  let saveSoon = null;
  const saveLater = () => { clearTimeout(saveSoon); saveSoon = setTimeout(save, 400); };

  /* ---------- audio: one file per sentence, on the website (never Firebase) ---------- */
  const STAMP = (() => {
    const s = document.querySelector('script[src*="dictation-player.js"]');
    const m = s && /[?&]v=([^&#]+)/.exec(s.getAttribute('src') || '');
    return m ? m[1] : '';
  })();
  const srcFor = (k, item) => 'audio/dictation/' + (item || S.item).id + '-s' + (k + 1) + '.mp3' + (STAMP ? '?v=' + STAMP : '');
  let audio = null, audioSrc = '', playToken = 0, nextAudio = null;
  function audioNote(kind) {
    const el = S && S.root.querySelector('#dcAudioNote');
    if (!el) return;
    el.hidden = !kind;
    el.textContent = kind === 'blocked' ? '🔈 Press ▶ to hear the sentence.'
      : kind ? '📶 The sentence didn\'t play — check the internet and press ▶ Play again. You can still write it and check.' : '';
  }
  function playing(on) {
    const b = S && S.root.querySelector('#dcPlay');
    if (b) b.classList.toggle('playing', !!on);
  }
  function theAudio() {
    if (!audio) {
      audio = new Audio();
      audio.preload = 'auto';
      audio.addEventListener('error', () => { if (audio.getAttribute('src') && !audio.muted) { playing(false); audioNote('error'); } });
      audio.addEventListener('playing', () => { if (!audio.muted) playing(true); });
      ['pause', 'ended'].forEach(ev => audio.addEventListener(ev, () => playing(false)));
    }
    return audio;
  }
  /* iPhones play sound only from a tap: after "Ha" the page asks the database first, so the first sentence would be refused.
     DC.prime(item) runs inside the tap (skill-player.js calls it before any await): a silent start + stop unlocks the audio
     element, and the later play(1) is allowed. */
  function prime(item) {
    if (window.__dcNoAudio || window.__dcAudioFails) { window.__dcPrimed = (window.__dcPrimed || 0) + 1; return; }
    try {
      const a = theAudio(), token = playToken, src = srcFor(0, item);
      if (audioSrc !== src) { audioSrc = src; a.src = src; }
      a.muted = true;
      const p = a.play();
      const done = () => { if (token === playToken) { a.pause(); a.muted = false; } };
      if (p && p.then) p.then(done, done); else done();
    } catch (e) { /* the sentence plays later, or ▶ does it */ }
  }
  // the next sentence is fetched while this one is worked on, so it starts at once after ✅
  function preloadNext() {
    const k = S.k + 1;
    if (k >= N()) return;
    const src = srcFor(k);
    if (window.__dcNoAudio || window.__dcAudioFails) { (window.__dcPreloaded = window.__dcPreloaded || []).push(src); return; }
    try {
      if (!nextAudio) { nextAudio = new Audio(); nextAudio.preload = 'auto'; nextAudio.muted = true; }
      if (nextAudio.getAttribute('src') !== src) nextAudio.src = src;
    } catch (e) { /* only a speed-up */ }
  }
  function play(rate) {
    if (!S) return;
    rate = rate || 1;
    const k = S.k, src = srcFor(k);
    playToken++;
    audioNote('');
    if (window.__dcAudioFails) { audioNote('error'); return; }
    if (window.__dcNoAudio) { (window.__dcPlayed = window.__dcPlayed || []).push({ sentence: k + 1, rate, src }); preloadNext(); return; }
    try {
      const a = theAudio();
      a.pause();
      a.muted = false;
      if (audioSrc !== src) { audioSrc = src; a.src = src; } else a.currentTime = 0;
      a.defaultPlaybackRate = rate;
      a.playbackRate = rate;
      const p = a.play();
      if (p && p.catch) p.catch(e => { if (e && e.name === 'NotAllowedError') audioNote('blocked'); else if (!e || e.name !== 'AbortError') audioNote('error'); });
    } catch (e) { audioNote('error'); }
    preloadNext();
  }
  function stopAudio() { try { if (audio) audio.pause(); } catch (e) { /* nothing playing */ } }

  /* ---------- a phone: the work card stays above the keyboard, in the top part of the screen ---------- */
  let fullH = 0;
  function fit() {
    if (!S) return;
    const card = S.root.querySelector('.dc-work');
    if (!card) return;
    const vv = window.visualViewport, h = vv ? vv.height : window.innerHeight, top = vv ? vv.offsetTop : 0;
    fullH = Math.max(fullH, window.innerHeight || 0, h);
    // the room the card may take: what's visible above the keyboard, and at most 60 % of the whole screen
    const room = Math.max(260, Math.min(h, fullH * 0.6) - 4);
    document.documentElement.style.setProperty('--dc-room', Math.round(room) + 'px');
    if (window.innerWidth > 760) return;
    const box = boxEl();
    if (!box || document.activeElement !== box) return;
    const r = card.getBoundingClientRect();
    if (r.top < top - 1 || r.bottom > top + h + 1) window.scrollTo(0, Math.max(0, window.scrollY + r.top - top - 2));
  }
  // after a wrong Check: the card's own content is scrolled so the marked words are in view
  function marksInView() {
    const card = S.root.querySelector('.dc-work'), m = S.root.querySelector('.dc-marks');
    if (!card || !m) return;
    const c = card.getBoundingClientRect(), r = m.getBoundingClientRect();
    if (r.bottom > c.bottom) card.scrollTop += Math.min(r.bottom - c.bottom + 4, r.top - c.top - 4);
  }

  /* ---------- the sentence screen ---------- */
  const title = () => `Dictation ${S.item.no} · ${S.item.title}`;
  function show(html) {
    stopAudio();
    S.root.innerHTML = (S.ctx.header || '') + html;
    window.scrollTo(0, 0);
  }
  function marksHtml(parts, reveal) {
    return parts.map(p => {
      if (p.state === 'wrong') {
        return `<span class="dc-word wrong"><span class="dc-typed">${esc(p.text)}</span>${reveal ? ` <span class="dc-want" title="The right word">${esc(p.want)}</span>` : ''}</span>`;
      }
      if (p.state === 'missing') {
        return reveal ? `<span class="dc-word missing" title="A word you missed">${esc(p.text)}</span>`
          : `<span class="dc-word missing dc-blank" title="A word you missed" aria-label="a missing word">${'_'.repeat(Math.max(2, Math.min(14, [...p.text].length)))}</span>`;
      }
      if (p.state === 'extra') return `<span class="dc-word extra" title="Not in the sentence">${esc(p.text)}</span>`;
      return `<span class="dc-word ok">${esc(p.text)}</span>`;
    }).join(' ');
  }
  const skips = () => S.recs.filter(r => r && r.skipped).length;
  function countHtml() {
    const s = skips();
    // "Sentence 1 of 7" + a dot per sentence (teacher, 2026-11-20 — a mock-up): done ones filled, this one bigger, orange
    const at = Math.min(S.k, N() - 1);
    const dots = `<span class="dc-dots" aria-hidden="true">${Array.from({ length: N() }, (_, i) => `<i class="dc-dot${i < at ? ' done' : i === at ? ' on' : ''}"></i>`).join('')}</span>`;
    return `<span class="dc-w">Sentence</span> <span class="dc-n">${Math.min(S.k + 1, N())} of ${N()}</span>${dots}${s ? ` <span class="dc-skips">· <span class="dc-l">${s} skipped</span><span class="dc-s" aria-hidden="true">⏭ ${s}</span></span>` : ''}` +
      (S.mode === 'again' ? ' <span class="dc-practice">· Practice, not sent</span>' : '');
  }

  function showWork(typed, lastHtml) {
    show(`<section class="sk-card dc-card dc-work" data-k="${S.k}">
      <div class="dc-top">
        <p class="dc-count" id="dcCount">${countHtml()}</p>
        <div class="dc-play">
          <button type="button" class="sk-btn sk-btn-small dc-playbtn" id="dcPlay" title="Play the sentence again">▶ <span class="dc-l">Play again</span><span class="dc-s">Play</span></button>
          <button type="button" class="sk-btn sk-btn-small" id="dcSlow" title="Play the sentence slower">🐢 <span class="dc-l">Play slower</span><span class="dc-s">Slower</span></button>
        </div>
      </div>
      <p class="dc-audio-note" id="dcAudioNote" role="status" hidden></p>
      <textarea id="dcBox" class="dc-box" rows="2" maxlength="1200" aria-label="Write the sentence you hear" placeholder="Write the sentence you hear"
        autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" enterkeyhint="done"></textarea>
      <div class="dc-btns">
        <button type="button" class="sk-btn sk-btn-main" id="dcCheck"><svg class="dc-ck" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.5l5 5L19.5 7"/></svg>Check</button>
        <button type="button" class="sk-btn sk-btn-ghost" id="dcSkip" title="Show the right sentence and go on">⏭ Skip</button>
      </div>
      <div class="dc-feedback" id="dcFeedback" role="status" aria-live="polite">${lastHtml || ''}</div>
    </section>`);
    const box = boxEl();
    box.value = typed || '';
    grow();
    // Enter checks — the keyboard's key on a computer, and a phone's Enter/Done (which may send only an input with a line break)
    box.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); check(); } });
    box.addEventListener('beforeinput', e => { if (e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph') { if (!e.cancelable) return; e.preventDefault(); check(); } });   // not cancelable → the input handler below checks once
    box.addEventListener('input', () => {
      if (/[\r\n]/.test(box.value)) { box.value = box.value.replace(/[\r\n]+/g, ' ').replace(/\s+$/, ''); grow(); check(); return; }
      grow();
      if (!S.busy) saveLater();
    });
    box.addEventListener('focus', () => setTimeout(fit, 60));
    // a tap on a button doesn't take the focus from the box, so a phone's keyboard stays open
    S.root.querySelectorAll('.dc-work button').forEach(b => ['pointerdown', 'mousedown'].forEach(ev =>
      b.addEventListener(ev, e => { if (document.activeElement === box) e.preventDefault(); })));
    S.root.querySelector('#dcPlay').addEventListener('click', () => play(1));
    S.root.querySelector('#dcSlow').addEventListener('click', () => play(SLOW));
    S.root.querySelector('#dcCheck').addEventListener('click', check);
    S.root.querySelector('#dcSkip').addEventListener('click', skip);
    fit();
    if (window.innerWidth > 760) { try { box.focus({ preventScroll: true }); } catch (e) { /* old browser */ } }
    play(1);
  }
  function grow() {
    const box = boxEl();
    if (!box) return;
    box.style.height = 'auto';
    box.style.height = box.scrollHeight + 2 + 'px';
  }
  const rec = () => (S.recs[S.k] = S.recs[S.k] || { first: '', tries: 0, skipped: false, ok: false });

  function check() {
    if (S.busy) return;
    const box = boxEl(), fb = S.root.querySelector('#dcFeedback');
    const typed = box.value.trim();
    if (!typed) {   // any marks stay; the line goes above them
      const old = fb.querySelector('.dc-empty');
      if (old) old.remove();
      fb.insertAdjacentHTML('afterbegin', '<p class="dc-msg dc-empty">✍️ Write the sentence first.</p>');
      box.focus();
      return;
    }
    const want = S.item.sentences[S.k];
    const res = window.dcCheck ? window.dcCheck(want, typed) : { ok: typed === want, parts: [{ text: typed, state: typed === want ? 'ok' : 'wrong', want }], note: '' };
    const r = rec();
    if (!r.tries && !r.skipped) r.first = typed;
    r.tries++;
    if (r.tries === 1 && res.ok) r.ok = true;
    const note = res.note ? `<p class="dc-note">✏️ ${esc(res.note)}</p>` : '';
    if (res.ok) {
      // a right sentence stands out (teacher, 2026-11-20): a green banner with a round ✓ and the sentence (no "Right!" text — the teacher's mock-up)
      advance(`<p class="dc-msg dc-right" role="status"><span class="dc-tick" role="img" aria-label="Right"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12.5l4 4L18 8.5"/></svg></span><span class="dc-said">${esc(want)}</span></p>${note}`,
        `<p class="dc-last">✅ ${S.k + 1}. ${esc(want)}</p>${note}`, true);
      return;
    }
    fb.innerHTML = `<p class="dc-msg dc-no">❌ Fix the marked words.</p><p class="dc-marks">${marksHtml(res.parts, showAnswer() || r.tries >= 2)}</p>${note}`;
    S.root.querySelector('.dc-work').classList.add('dc-marked');   // the box shrinks to 2 lines so the marks fit above a phone's keyboard
    grow();
    save();
    fit();
    marksInView();
  }
  function skip() {
    if (S.busy) return;
    const r = rec();
    r.skipped = true;
    const want = S.item.sentences[S.k];
    const msg = `<p class="dc-msg dc-skipped">⏭ The sentence was: <b class="dc-said">${esc(want)}</b></p>`;
    advance(msg, msg);
  }
  // ✅ or the skipped sentence shows for a moment, then the next sentence (the box keeps its focus — the phone's keyboard stays)
  function advance(msg, last, good) {
    S.busy = true;
    const box = boxEl(), fb = S.root.querySelector('#dcFeedback');
    fb.innerHTML = msg;
    S.root.querySelector('.dc-work').classList.remove('dc-marked');
    S.root.querySelector('.dc-work').classList.toggle('dc-good', !!good);
    const checked = box.value;   // the box keeps its focus (no readOnly: that can close a phone's keyboard)
    S.k++;
    save();
    fit();
    setTimeout(() => {
      if (!S || boxEl() !== box) return;
      S.busy = false;
      const work = S.root.querySelector('.dc-work');
      if (work) work.classList.remove('dc-good');
      if (S.k >= N()) { finish(); return; }
      // anything typed during the pause after the checked text is kept
      box.value = box.value.startsWith(checked) ? box.value.slice(checked.length).replace(/^\s+/, '') : '';
      grow();
      S.root.querySelector('.dc-work').dataset.k = S.k;
      S.root.querySelector('#dcCount').innerHTML = countHtml();
      fb.innerHTML = last;   // the sentence just done stays in view while the next one is written
      save();
      fit();
      play(1);
    }, pause());
  }

  /* ---------- the end ---------- */
  function summary(recs) {
    const total = N(), correctFirst = recs.filter(r => r && r.ok).length, sk = recs.filter(r => r && r.skipped).length;
    return { total, correctFirst, skips: sk, score: Math.round(correctFirst / total * 100) };
  }
  function reviewHtml(recs) {
    return `<ol class="dc-review">${S.item.sentences.map((s, i) => {
      const r = recs[i] || {};
      const icon = r.ok ? '✅' : r.skipped ? '⏭' : '✔️';
      const how = r.ok ? 'right the first time' : r.skipped ? 'skipped' : `right after ${r.tries} tries`;
      const first = !r.ok && r.first ? `<span class="dc-first">Your first try: ${esc(r.first)}</span>` : '';
      return `<li class="dc-rev ${r.ok ? 'ok' : r.skipped ? 'skip' : 'fixed'}"><span class="dc-rev-i" aria-hidden="true">${icon}</span>
        <span class="dc-rev-t"><span class="dc-rev-s">${esc(s)}</span><span class="dc-rev-how">${how}</span>${first}</span></li>`;
    }).join('')}</ol>`;
  }
  function finish() {
    const first = S.mode === 'first' && !S.submitted;
    if (first) stopClock();
    const sm = summary(S.recs), pct = sm.correctFirst / sm.total;
    const cheer = pct >= 0.8 ? '🌟 Excellent listening!' : pct >= 0.6 ? '👏 Well done!' : pct >= 0.4 ? '💪 Good try — keep going!' : '🌱 Keep practising — you can do it!';
    const secs = first ? Math.max(1, Math.ceil(T.ms / 1000)) : 0;
    show(`<section class="sk-card dc-card dc-end">
      <h2>🏁 You finished the dictation</h2>
      <div class="sk-result">
        <div class="sk-score dc-score"><span class="sk-score-n">${sm.correctFirst}/${sm.total}</span><span class="sk-score-t">right the first time</span><span class="sk-score-t dc-cheer">${cheer}</span></div>
        <p class="dc-stats">⏭ ${sm.skips} skipped${first ? ` · ⏱ ${formatTime(secs)}` : ''}</p>
        ${first || (S.first && !S.firstSent) ? '<div class="sk-send" id="dcSend" role="status"></div>' : ''}
        ${!first ? '<p class="dc-practice-note">Practice only — this try was not sent.</p>' : ''}
      </div>
      ${reviewHtml(S.recs)}
      <div class="sk-actions dc-again"><button type="button" class="sk-btn sk-btn-ghost" id="dcAgain">🔁 Do it again</button></div>
    </section>`);
    S.root.querySelector('#dcAgain').addEventListener('click', again);
    if (first) {
      S.submitted = true;
      const date = new Date().toISOString();
      S.first = { v: 1, type: 'Dictation course', code: S.ctx.code, name: S.ctx.name || '', studentId: S.ctx.studentId || '', skill: 'dictation',
        dictation: S.item.id, dictationNo: S.item.no, level: S.ctx.levelId || 'beginner', title: title(),
        sentences: S.item.sentences.map((_, i) => { const r = S.recs[i] || {}; return { first: r.first || '', tries: r.tries || 0, skipped: !!r.skipped, ok: !!r.ok }; }),
        total: sm.total, correctFirst: sm.correctFirst, score: sm.score, skips: sm.skips, timeSeconds: secs, timeDisplay: formatTime(secs), date, builtAt: date };
      if (S.ctx.preview) { S.firstSent = true; setSend('preview'); return; }
      if (S.ctx.keep) S.ctx.keep(S.first);   // kept on this phone until the save is confirmed
      sendFirst();
    } else if (S.first && !S.firstSent) setSend(S.sending ? 'sending' : 'failed');
  }
  function setSend(state) {
    const box = S.root.querySelector('#dcSend');
    if (!box) return;
    box.classList.toggle('bad', state === 'failed');
    if (state === 'preview') box.innerHTML = '<span class="sk-send-note">👀 Preview — nothing was sent.</span>';
    else if (state === 'sending') box.innerHTML = '<span class="sk-send-note">📤 Sending your answers to your teacher…</span>';
    else if (state === 'ok') box.innerHTML = '<span class="sk-send-ok">Saved ✅ Your teacher has your answers.</span>';
    else {
      box.innerHTML = '<span class="sk-send-bad">Not sent yet — check the internet</span> <button type="button" class="sk-btn sk-btn-small" id="dcSendAgain">📤 Send my answers</button>';
      box.querySelector('#dcSendAgain').addEventListener('click', sendFirst);
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
  // practice: the same sentences again, nothing sent or kept
  function again() { S.mode = 'again'; S.k = 0; S.recs = []; S.busy = false; showWork('', ''); }

  function showDone(done) {
    clearDraft();
    S.mode = 'again';
    show(`<section class="sk-card sk-center dc-card dc-done">
      <div class="sk-big-emoji" aria-hidden="true">✅</div>
      <h2>You've done this dictation</h2>
      ${done.summary ? `<p class="sk-done-score">Your result: <b>${esc(done.summary)}</b></p>` : ''}
      ${S.ctx.name || S.ctx.studentId ? `<p class="sk-done-who">👤 <b>${esc(S.ctx.name)}</b>${S.ctx.studentId ? ' · ID ' + esc(S.ctx.studentId) : ''}</p>` : ''}
      <p>Your teacher already has your answers. You can do it again for practice — nothing more is sent.</p>
      <div class="sk-actions"><button type="button" class="sk-btn sk-btn-main" id="dcAgain">🔁 Do it again</button></div>
      ${S.ctx.notMe ? '<div class="sk-actions"><button type="button" class="sk-btn sk-btn-small" id="dcNotMe">Not you? Write your own ID</button></div>' : ''}
    </section>`);
    S.root.querySelector('#dcAgain').addEventListener('click', again);
    const nm = S.root.querySelector('#dcNotMe');
    if (nm) nm.addEventListener('click', S.ctx.notMe);
  }

  /* DC.start(item, root, ctx): ctx = { preview, code, name, studentId, levelId, header, send(payload) → Promise<'ok'|'failed'>,
     keep(payload), done ({ summary } when the database already has this student's result), notMe } */
  function start(item, root, ctx) {
    clearInterval(timer);
    T.on = false;
    stopAudio();
    S = { item, root, ctx: ctx || {}, mode: 'first', k: 0, recs: [], busy: false, submitted: false, first: null, firstSent: false, sending: false };
    if (S.ctx.done) { showDone(S.ctx.done); return; }
    let ms = 0, typed = '';
    const d = !S.ctx.preview && S.ctx.code ? readDraft() : null;
    if (d && d.dictation === item.id && sameId(d.studentId, S.ctx.studentId)) {
      ms = Number(d.activeMs) || 0;   // the time always carries on
      if (d.h === contentHash(item) && Array.isArray(d.recs)) {   // other sentences (the teacher's text changed) → from sentence 1
        S.k = Math.min(Math.max(0, d.k | 0), item.sentences.length);
        S.recs = d.recs.slice(0, item.sentences.length).map(r => r && typeof r === 'object'
          ? { first: String(r.first || ''), tries: Number(r.tries) || 0, skipped: !!r.skipped, ok: !!r.ok } : null);
        typed = typeof d.typed === 'string' ? d.typed : '';
      }
    }
    startClock(ms);
    if (S.k >= N()) { finish(); return; }   // the page closed while the last sentence was being marked
    showWork(typed, '');
  }

  window.DC = { start, prime, activeMs, formatTime, save };
})();
