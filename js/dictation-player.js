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
      localStorage.setItem(draftKey(), JSON.stringify({ dictation: S.item.id, n: N(), studentId: S.ctx.studentId || '', k: S.k, recs: S.recs,
        typed: box && !S.busy ? box.value : '', activeMs: ms, at: new Date().toISOString() }));
    } catch (e) { /* private window or full: the dictation goes on */ }
  }
  function readDraft() { try { return JSON.parse(localStorage.getItem(draftKey()) || 'null'); } catch (e) { return null; } }
  function clearDraft() { try { localStorage.removeItem(draftKey()); } catch (e) { /* private window */ } }
  const sameId = (a, b) => (window.taIdKey ? window.taIdKey(a) === window.taIdKey(b) : String(a || '').trim() === String(b || '').trim());
  let saveSoon = null;
  const saveLater = () => { clearTimeout(saveSoon); saveSoon = setTimeout(save, 400); };

  /* ---------- audio: one file per sentence, on the website (never Firebase) ---------- */
  const STAMP = (() => {
    const s = document.querySelector('script[src*="dictation-player.js"]');
    const m = s && /[?&]v=([^&#]+)/.exec(s.getAttribute('src') || '');
    return m ? m[1] : '';
  })();
  const srcFor = k => 'audio/dictation/' + S.item.id + '-s' + (k + 1) + '.mp3' + (STAMP ? '?v=' + STAMP : '');
  let audio = null, audioSrc = '';
  function audioNote(kind) {
    const el = S && S.root.querySelector('#dcAudioNote');
    if (!el) return;
    el.hidden = !kind;
    el.textContent = kind === 'blocked' ? '🔈 Press ▶ Play again to hear the sentence.'
      : kind ? '📶 The sentence didn\'t play — check the internet and press ▶ Play again. You can still write it and check.' : '';
  }
  function playing(on) {
    const b = S && S.root.querySelector('#dcPlay');
    if (b) b.classList.toggle('playing', !!on);
  }
  function play(rate) {
    if (!S) return;
    rate = rate || 1;
    const k = S.k, src = srcFor(k);
    audioNote('');
    if (window.__dcAudioFails) { audioNote('error'); return; }
    if (window.__dcNoAudio) { (window.__dcPlayed = window.__dcPlayed || []).push({ sentence: k + 1, rate, src }); return; }
    try {
      if (!audio) {
        audio = new Audio();
        audio.preload = 'auto';
        audio.addEventListener('error', () => { if (audio.getAttribute('src')) { playing(false); audioNote('error'); } });
        audio.addEventListener('playing', () => playing(true));
        ['pause', 'ended'].forEach(ev => audio.addEventListener(ev, () => playing(false)));
      }
      audio.pause();
      if (audioSrc !== src) { audioSrc = src; audio.src = src; } else audio.currentTime = 0;
      audio.defaultPlaybackRate = rate;
      audio.playbackRate = rate;
      const p = audio.play();
      if (p && p.catch) p.catch(e => { if (e && e.name === 'NotAllowedError') audioNote('blocked'); else if (!e || e.name !== 'AbortError') audioNote('error'); });
    } catch (e) { audioNote('error'); }
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
    const room = Math.max(260, Math.min(h, fullH * 0.6) - 8);
    document.documentElement.style.setProperty('--dc-room', Math.round(room) + 'px');
    if (window.innerWidth > 760) return;
    const box = boxEl();
    if (!box || document.activeElement !== box) return;
    const r = card.getBoundingClientRect();
    if (r.top < top - 1 || r.bottom > top + h + 1) window.scrollTo(0, Math.max(0, window.scrollY + r.top - top - 6));
  }

  /* ---------- the sentence screen ---------- */
  const title = () => `Dictation ${S.item.no} · ${S.item.title}`;
  function show(html) {
    stopAudio();
    S.root.innerHTML = (S.ctx.header || '') + html;
    window.scrollTo(0, 0);
  }
  function marksHtml(parts) {
    return parts.map(p => {
      if (p.state === 'wrong') return `<span class="dc-word wrong"><span class="dc-typed">${esc(p.text)}</span> <span class="dc-want" title="The right word">${esc(p.want)}</span></span>`;
      if (p.state === 'missing') return `<span class="dc-word missing" title="A word you missed">${esc(p.text)}</span>`;
      if (p.state === 'extra') return `<span class="dc-word extra" title="Not in the sentence">${esc(p.text)}</span>`;
      return `<span class="dc-word ok">${esc(p.text)}</span>`;
    }).join(' ');
  }
  const skips = () => S.recs.filter(r => r && r.skipped).length;
  function countHtml() {
    const s = skips();
    return `Sentence ${Math.min(S.k + 1, N())} / ${N()}${s ? ` <span class="dc-skips">· ${s} skipped</span>` : ''}`;
  }

  function showWork(typed, lastHtml) {
    show(`<section class="sk-card dc-card dc-work" data-k="${S.k}">
      <div class="dc-top">
        <p class="dc-count" id="dcCount">${countHtml()}</p>
        ${S.mode === 'again' ? '<span class="dc-practice">Practice — not sent</span>' : ''}
      </div>
      <div class="dc-play">
        <button type="button" class="sk-btn sk-btn-small dc-playbtn" id="dcPlay">▶ Play again</button>
        <button type="button" class="sk-btn sk-btn-small" id="dcSlow">🐢 Play slower</button>
      </div>
      <p class="dc-audio-note" id="dcAudioNote" role="status" hidden></p>
      <textarea id="dcBox" class="dc-box" rows="2" maxlength="1200" aria-label="Write the sentence you hear" placeholder="Write the sentence you hear"
        autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" enterkeyhint="done"></textarea>
      <div class="dc-btns">
        <button type="button" class="sk-btn sk-btn-main" id="dcCheck">✔️ Check</button>
        <button type="button" class="sk-btn sk-btn-ghost" id="dcSkip" title="Show the right sentence and go on">⏭ Skip</button>
      </div>
      <div class="dc-feedback" id="dcFeedback" role="status" aria-live="polite">${lastHtml || ''}</div>
    </section>`);
    const box = boxEl();
    box.value = typed || '';
    grow();
    box.addEventListener('input', () => { grow(); if (!S.busy) saveLater(); });
    box.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); check(); } });
    box.addEventListener('focus', () => setTimeout(fit, 60));
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
    if (!typed) { fb.innerHTML = '<p class="dc-msg">✍️ Write the sentence first, then press Check.</p>'; box.focus(); return; }
    const want = S.item.sentences[S.k];
    const res = window.dcCheck ? window.dcCheck(want, typed) : { ok: typed === want, parts: [{ text: typed, state: typed === want ? 'ok' : 'wrong', want }], note: '' };
    const r = rec();
    if (!r.tries && !r.skipped) r.first = typed;
    r.tries++;
    if (r.tries === 1 && res.ok) r.ok = true;
    const note = res.note ? `<p class="dc-note">✏️ ${esc(res.note)}</p>` : '';
    if (res.ok) {
      advance(`<p class="dc-msg dc-right">✅ Right! <span class="dc-said">${esc(want)}</span></p>${note}`,
        `<p class="dc-last">✅ ${S.k + 1}. ${esc(want)}</p>${note}`);
      return;
    }
    fb.innerHTML = `<p class="dc-msg dc-no">❌ Fix the marked words and check again.</p><p class="dc-marks">${marksHtml(res.parts)}</p>${note}`;
    save();
    fit();
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
  function advance(msg, last) {
    S.busy = true;
    const box = boxEl(), fb = S.root.querySelector('#dcFeedback');
    fb.innerHTML = msg;
    box.readOnly = true;
    S.k++;
    save();
    fit();
    setTimeout(() => {
      if (!S || boxEl() !== box) return;
      S.busy = false;
      if (S.k >= N()) { finish(); return; }
      box.readOnly = false;
      box.value = '';
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
      if (S.ctx.preview) { setSend('preview'); return; }
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
      if (d.n === item.sentences.length && Array.isArray(d.recs)) {   // other sentences (the teacher's text changed) → from sentence 1
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

  window.DC = { start, activeMs, formatTime, save };
})();
