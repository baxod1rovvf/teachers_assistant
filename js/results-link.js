/* Results link (results-link.html?r=<token>): a step's table for one group, shared by the teacher (course.js skShareResults).
   Reads the record results/share-<token> over REST (like play.html). Places, Overall and CEFR are worked out here, live
   (skOverall / skCefr), so a late writing band moves them. Writings the AI hasn't checked yet show ⏳; the page asks the helper
   (job `feedback`) every __rlPollMs (60 s) until none waits. Tapping a writing band opens its feedback. All text is escaped. */
(function () {
  var app = document.getElementById('rlApp');
  var BASE = 'https://firestore.googleapis.com/v1/projects/teachers-assistant-app-ccd1a/databases/(default)/documents/results/';
  var KEY = '?key=AIzaSyCefg2YghdSneABh0ZOUu3-snO4soVw0lA';
  var MEDALS = ['🥇', '🥈', '🥉'];
  var data = null, fb = {}, pollTimer = 0;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function say(emoji, text) { app.innerHTML = '<div class="sk-center"><div class="sk-big-emoji">' + emoji + '</div><p>' + esc(text) + '</p></div>'; }
  function helperUrl() {
    var u = '';
    try { u = localStorage.getItem('ta_ai_url') || ''; } catch (e) { u = ''; }
    return u || 'https://loom-ai.toxiraxii010.workers.dev';
  }
  function initials(n) { return String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join(''); }
  function colour(n) {
    var cols = ['#4D9BFF', '#22C3D6', '#A97BFF', '#FF9F43', '#FF7AC6', '#2ED3A0', '#FF6B6B', '#FFD23F'], h = 0, s = String(n || '');
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return cols[h % cols.length];
  }

  /* a writing's band: the teacher's mark, else the AI's (from its scores), else the band the teacher's page had; null = ⏳ */
  function aiOf(w) { var s = w && fb[w.id]; return s && s.state === 'done' && s.result && s.result.scores ? s.result : null; }
  function bandOf(w) {
    if (!w) return null;
    if (typeof w.mark === 'number') return w.mark;
    var ai = aiOf(w);
    if (ai) return skWritingAiBand(ai.scores, w.words || 0, w.minWords || 0);
    return typeof w.band === 'number' ? w.band : null;
  }
  function pending(w) { return !!w && !!String(w.text || '').trim() && bandOf(w) === null; }
  function rowsOut() {
    var rows = data.rows.map(function (r) {
      var wb = bandOf(r.writing);
      var o = skOverall([r.listening ? r.listening.band : null, r.reading ? r.reading.band : null, wb]);
      return { r: r, wb: wb, overall: o, cefr: o === null ? '' : skCefr(o) };
    });
    rows.sort(function (a, b) { return ((b.overall || 0) - (a.overall || 0)) || String(a.r.name).localeCompare(String(b.r.name)); });
    rows.forEach(function (x) { x.place = 1 + rows.filter(function (o) { return (o.overall || 0) > (x.overall || 0); }).length; });
    return rows;
  }
  function cell(v) {
    return v ? '<div class="sk-rt-cell ' + skBandColour(v.band) + '"><b>' + esc(v.band) + '</b><small>' + esc(v.raw) + '</small></div>' : '<div class="sk-rt-cell none">—</div>';
  }
  function render() {
    var rows = rowsOut(), waiting = rows.some(function (x) { return pending(x.r.writing); });
    var avg = skOverall(rows.map(function (x) { return x.overall; }));
    var date = new Date(data.sharedAt || Date.now());
    var head = '<div class="sk-rt-head"><div class="sk-rt-brand" translate="no">🧶 loom</div>' +
      '<div class="sk-rt-title">🏆 Step ' + esc(data.stepNo) + ' · ' + esc(data.theme) + '</div>' +
      '<div class="sk-rt-meta"><span translate="no">👥 ' + esc(data.group) + '</span>' + (isNaN(date) ? '' : '<span>📅 ' + esc(date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })) + '</span>') + '</div>' +
      '<div class="sk-rt-chips"><span class="sk-rt-chip sk-rt-listening">🎧 Listening</span><span class="sk-rt-chip sk-rt-reading">📖 Reading</span><span class="sk-rt-chip sk-rt-writing">✍️ Writing</span></div></div>';
    var body = rows.map(function (x, i) {
      var w = x.r.writing, wc;
      if (w && w.id) {
        var p = pending(w);
        wc = '<button type="button" class="sk-rt-cell sk-rt-wbtn ' + (p ? 'pending' : skBandColour(x.wb)) + '" data-i="' + i + '" aria-label="Open ' + esc(x.r.name) + '\'s writing"><b>' + (p ? '⏳' : esc(x.wb)) + '</b><small>' + esc(w.raw) + '</small></button>';
      } else wc = '<div class="sk-rt-cell none">—</div>';
      return '<div class="sk-rt-row">' +
        '<span class="sk-rt-place' + (x.place <= 3 ? ' medal' : '') + '" aria-label="Place ' + x.place + '">' + (MEDALS[x.place - 1] || x.place) + '</span>' +
        '<span class="res-avatar" style="background:' + colour(x.r.name) + ';">' + esc(initials(x.r.name)) + '</span>' +
        '<span class="sk-rt-name" translate="no">' + esc(x.r.name) + '</span>' + cell(x.r.listening) + cell(x.r.reading) + wc +
        (x.overall === null ? '<div class="sk-rt-overall none">—</div>' : '<div class="sk-rt-overall ' + skBandColour(x.overall) + '"><b>' + esc(x.overall) + '</b><small>' + x.cefr + '</small></div>') + '</div>';
    }).join('');
    app.innerHTML = (waiting ? '<div class="rl-wait">⏳ Checking…<small>Some writings are still being checked by the AI. Their bands appear by themselves.</small></div>' : '') +
      '<div class="sk-rt">' + head + '<div class="sk-rt-scroll"><div class="sk-rt-grid"><div class="sk-rt-cols"><span>#</span><span></span><span>Student</span><span>🎧 Listening</span><span>📖 Reading</span><span>✍️ Writing</span><span>Overall</span></div>' + body + '</div></div>' +
      '<div class="sk-rt-foot"><span>Group average: <b>' + (avg === null ? '—' : avg) + '</b></span><span>' + rows.length + (rows.length === 1 ? ' student' : ' students') + '</span></div></div>' +
      '<p class="sk-hint rl-hint">Tap a ✍️ Writing band to read the feedback.</p>';
    app.querySelectorAll('.sk-rt-wbtn').forEach(function (b) { b.addEventListener('click', function () { openWriting(rows[+b.getAttribute('data-i')].r.writing); }); });
  }

  /* the text with each AI mistake's `wrong` sentence underlined where it is found (the first free place, then ignoring case) */
  function markedText(text, mistakes) {
    var ranges = [], lower = text.toLowerCase();
    (mistakes || []).forEach(function (m) {
      var wr = String(m && m.wrong || '');
      if (!wr.trim()) return;
      [text, lower].some(function (hay, k) {
        var needle = k ? wr.toLowerCase() : wr, from = 0, at;
        while ((at = hay.indexOf(needle, from)) !== -1) {
          var end = at + needle.length;
          if (!ranges.some(function (r) { return at < r[1] && end > r[0]; })) { ranges.push([at, end]); return true; }
          from = at + 1;
        }
        return false;
      });
    });
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var out = '', pos = 0;
    ranges.forEach(function (r) { out += esc(text.slice(pos, r[0])) + '<mark>' + esc(text.slice(r[0], r[1])) + '</mark>'; pos = r[1]; });
    return out + esc(text.slice(pos));
  }
  function feedbackHtml(w, ai) {
    var s = ai.scores || {}, band = bandOf(w);
    var asked = w.asked && (w.asked.used || w.asked.missing) ? w.asked : null;
    return '<div class="rl-score"><b>' + esc(band) + '</b><span>/ 9</span></div>' +
      '<div class="sk-wv-parts">🤖 Grammar ' + esc(s.grammar) + '/3 · Vocabulary ' + esc(s.vocabulary) + '/2 · Structure ' + esc(s.structure) + '/2 · Task ' + esc(s.task) + '/2' +
        (w.minWords && w.words < w.minWords ? ' · −0.5 (too short)' : '') + '</div>' +
      '<div class="sk-wv-text">' + markedText(String(w.text || ''), ai.mistakes) + '</div>' +
      (ai.mistakes && ai.mistakes.length ? '<ol class="sk-wv-mistakes">' + ai.mistakes.map(function (m) { return '<li><span class="sk-wv-bad">' + esc(m.wrong) + '</span> → <span class="sk-wv-fix">' + esc(m.right) + '</span>' + (m.why ? '<small>' + esc(m.why) + '</small>' : '') + '</li>'; }).join('') + '</ol>' : '<p>No grammar mistakes found.</p>') +
      (ai.better && ai.better.length ? '<p class="sk-wv-sub">💡 Better words</p><ul class="sk-wv-better">' + ai.better.map(function (b) { return '<li><b>' + esc(b.word) + '</b> → ' + esc(b.instead) + (b.why ? ' <small>— ' + esc(b.why) + '</small>' : '') + '</li>'; }).join('') + '</ul>' : '') +
      (asked ? '<p class="sk-wv-sub">📝 Asked words</p><p class="sk-wv-asked">' + (asked.used || []).map(function (x) { return '✅ ' + esc(x); }).concat((asked.missing || []).map(function (x) { return '❌ ' + esc(x); })).join(' · ') + '</p>' : '') +
      (ai.tips && ai.tips.length ? '<p class="sk-wv-sub">🚀 Tips</p><ol class="sk-wv-tips">' + ai.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>' : '');
  }
  var openId = '', openEl = null;
  function closeModal() { if (openEl) { openEl.remove(); openEl = null; openId = ''; document.removeEventListener('keydown', onKey); } }
  function onKey(e) { if (e.key === 'Escape') closeModal(); }
  function openWriting(w) {
    closeModal();
    var ai = aiOf(w), name = '';
    data.rows.forEach(function (r) { if (r.writing === w) name = r.name; });
    var inner;
    if (ai) inner = feedbackHtml(w, ai);
    else {
      inner = '<div class="rl-score"><b>' + (bandOf(w) === null ? '⏳' : esc(bandOf(w))) + '</b><span>' + (bandOf(w) === null ? '' : '/ 9') + '</span></div>' +
        '<p class="sk-wv-wait">⏳ This writing is still being checked. The feedback appears here by itself.</p><div class="sk-wv-text">' + esc(w.text) + '</div>';
    }
    openEl = document.createElement('div');
    openEl.className = 'rl-modal';
    openEl.innerHTML = '<div class="rl-modal-card" role="dialog" aria-modal="true"><button type="button" class="rl-close" aria-label="Close">✕</button>' +
      '<div class="sk-wv"><div class="sk-wv-who"><b translate="no">' + esc(name) + '</b><span>✍️ Writing — ' + esc(w.words) + ' words</span></div>' + inner + '</div></div>';
    openEl.addEventListener('click', function (e) { if (e.target === openEl) closeModal(); });
    openEl.querySelector('.rl-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(openEl);
    openId = w.id;
    openEl.querySelector('.rl-close').focus();
  }

  /* ask the helper about writings: all at the start (to open their feedback), then only the ones still waiting */
  function ask(ids) {
    if (!ids.length) return Promise.resolve();
    return fetch(helperUrl(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ job: 'feedback', ids: ids.slice(0, 60) }) })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.states) Object.keys(j.states).forEach(function (id) { fb[id] = j.states[id]; }); })
      .catch(function () { /* the next poll tries again */ });
  }
  function waitingIds() { return data.rows.map(function (r) { return r.writing; }).filter(pending).map(function (w) { return w.id; }).filter(Boolean); }
  function refreshModal() {
    if (!openEl) return;
    var w = null;
    data.rows.forEach(function (r) { if (r.writing && r.writing.id === openId) w = r.writing; });
    if (w && aiOf(w)) openWriting(w);
  }
  function poll() {
    pollTimer = 0;
    var ids = waitingIds();
    if (!ids.length) return;
    pollTimer = setTimeout(function () {
      ask(waitingIds()).then(function () { render(); refreshModal(); poll(); });
    }, window.__rlPollMs || 60000);
  }

  var token = new URLSearchParams(location.search).get('r') || '';
  if (!/^[0-9a-f]{16}$/.test(token)) { say('🔍', 'This results link doesn\'t exist — ask your teacher for it again.'); return; }
  fetch(BASE + 'share-' + token + KEY).then(function (r) {
    if (r.status === 404) throw new Error('missing');
    if (!r.ok) throw new Error('http ' + r.status);
    return r.json();
  }).then(function (d) {
    var f = d && d.fields;
    if (!f || !f.type || f.type.stringValue !== 'TA_SYNC:SHARE' || !f.data) throw new Error('missing');
    data = JSON.parse(f.data.stringValue);
    if (!data || !Array.isArray(data.rows)) throw new Error('missing');
    document.title = 'Step ' + data.stepNo + ' results — Loom';
    render();
    var ids = data.rows.map(function (r) { return r.writing && r.writing.id; }).filter(Boolean);
    return ask(ids).then(function () { render(); poll(); });
  }).catch(function (e) {
    if (e && e.message === 'missing') say('🔍', 'This results link doesn\'t exist — ask your teacher for it again.');
    else if (!data) say('📡', 'Couldn\'t load the results — check the internet and open the link again.');
  });
})();
