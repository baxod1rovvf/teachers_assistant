/* ================= DICTATION JOURNEY — the teacher's side (2026-11-19) =================
   Spec: docs/superpowers/specs/2026-11-19-dictation-journey-design.md ("Teacher side"). A section on the Course page, under the
   Grammar Journey: 5 levels of 20 dictations (TA_DICTATION, js/dictation-data.js). A level opens its 20 dictations, each with
   ▶ Play (the whole passage, audio/dictation/<dN>.mp3 — for the class), 📄 Transcript, 🔗 Copy link and ▶️ Try; a dictation opens its
   page: a group filter (All · each group), the results table (a row opens what the student wrote, sentence by sentence, marked
   against the right sentence with dcCheck), "🚫 Not finished" per group and "❓ Not on your Students list".
   - One link per dictation for every group: skill.html?s=dictation&dl=<dN>&c=<code> (taDictationLink in common.js).
   - ta_dictation_links { <dN>: { code, sentAt, rosterSig } } (synced, in the backup): the code is made at the first Copy link and
     never changes; firebase.js loads its results. The class lists follow the Students list by themselves (dcRefreshLists — the
     Grammar Journey's refresher, jrMakeRefresher in grammar.js: waits for sync, never two at once, retries, never an empty list
     over a full one).
   - Results (type 'Dictation course', js/dictation-player.js): only a student's first run counts (the earliest by date); the
     group is the student's group on the Students list now.
   The view lives in dcView ({ level, item } or null = the levels) — renderDictationJourney draws it. Its own page since 2026-11-23:
   dictationjourney.html (#dictationWrap).
   Shares jrFirstTries / jrMissing / jrUnlisted / jrDoneCount / jrFilterHtml / jrMissingHtml / jrUnlistedHtml / jrCopyText with
   the Grammar Journey — in js/pages/journey-shared.js (loaded first). */
const DC_LINKS_KEY = 'ta_dictation_links';
let dcView = null;   // the open level / dictation (not remembered)
let dcFilter = 'all';   // the dictation page's group filter: 'all' or a group id (not remembered)

function dcLevels() { return (window.TA_DICTATION && TA_DICTATION.levels) || []; }
function dcLevel(id) { return dcLevels().find(l => l.id === id) || null; }
function dcItem(id) {
  for (const lv of dcLevels()) { const d = (lv.items || []).find(x => x.id === id); if (d) return d; }
  return null;
}
function dcLevelOf(itemId) { return dcLevels().find(lv => (lv.items || []).some(d => d.id === itemId)) || null; }
function dcTitle(d) { return 'Dictation ' + d.no + ' · ' + d.title; }

/* ---- the kept links ---- */
function dcLinks() {
  try { const v = JSON.parse(localStorage.getItem(DC_LINKS_KEY) || 'null'); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; } catch (e) { return {}; }
}
function dcSaveLinks(v) {
  try { localStorage.setItem(DC_LINKS_KEY, JSON.stringify(v || {})); return true; } catch (e) { return false; }
}
function dcCode(itemId, links) { const e = (links || dcLinks())[itemId]; return e && typeof e === 'object' && e.code ? String(e.code) : ''; }
/* The dictation's code: made at the first Copy link, the same one after that (a sent link must keep working). Never one this
   teacher already uses (grUsedCodes: skills links, grammar lessons, dictations, My Exercises). */
function dcEnsureCode(itemId) {
  const d = dcItem(itemId);
  if (!d) return '';
  const links = dcLinks(), kept = dcCode(d.id, links);
  if (kept) return kept;
  const used = grUsedCodes();
  let code = generateClassCode();
  for (let i = 0; i < 50 && used.has(code); i++) code = generateClassCode();
  links[d.id] = { code: code, sentAt: new Date().toISOString() };
  if (!dcSaveLinks(links)) showToast('⚠️ Couldn\'t save — the browser\'s storage is full.');
  // a new code: load its results (firebase.js reads the codes from ta_dictation_links)
  if (window.startPlainCompletionsSync) { clearTimeout(window.__taResyncTimer); window.__taResyncTimer = setTimeout(window.startPlainCompletionsSync, 1500); }
  return code;
}

/* ---- the class lists follow the Students list (like the Grammar Journey's) ---- */
const dcRefresher = jrMakeRefresher({ links: dcLinks, save: dcSaveLinks, msVar: '__dcRefreshMs', retryVar: '__dcRetryMs' });
function dcRefreshLists() { dcRefresher(); }
window.addEventListener('storage', e => { if (e.key && /ta_points_roster|ta_student_groups/.test(e.key)) dcRefreshLists(); });

/* ---- results ---- */
function dcResults(itemId, links, map) {
  const code = dcCode(itemId, links);
  return code ? ((map || skResultsMap([code]))[code] || []) : [];
}
/* the table: each student's first run (earliest date), with their group now; ranked by sentences right the first time, then
   fewer skips, then the shorter time */
function dcTableRows(itemId, groupId) {
  const d = dcItem(itemId), groups = {};
  if (!d) return [];
  getStudentGroups().forEach(g => { groups[g.id] = g.name; });
  const rows = jrFirstTries(dcResults(itemId), groupId).map(({ st, r }) => {
    const sents = Array.isArray(r.sentences) ? r.sentences : [];
    const total = grNum(r.total) > 0 ? grNum(r.total) : (sents.length || d.sentences.length);
    const correct = Math.max(0, Math.min(total, grNum(r.correctFirst) !== null ? grNum(r.correctFirst) : sents.filter(s => s && s.ok).length));
    const skips = Math.max(0, grNum(r.skips) !== null ? grNum(r.skips) : sents.filter(s => s && s.skipped).length);
    return { name: st.name, studentId: st.id, group: groups[st.group] || '', groupId: st.group || '', correct: correct, total: total,
      score: Math.round(correct / total * 100), skips: skips, timeSeconds: grNum(r.timeSeconds), date: String(r.date || ''), r: r };
  });
  const t = r => (r.timeSeconds > 0 ? r.timeSeconds : Infinity);
  rows.sort((a, b) => (b.correct - a.correct) || (a.skips - b.skips) || (t(a) - t(b)) || a.name.localeCompare(b.name));
  return jrPlaces(rows, (a, b) => a.correct > b.correct || (a.correct === b.correct && (a.skips < b.skips || (a.skips === b.skips && t(a) < t(b)))));
}
function dcMissingRows(itemId, groupId) { return jrMissing(dcResults(itemId), groupId); }
function dcUnlistedRows(itemId) { return jrUnlisted(dcResults(itemId)); }

/* ---- ▶ the whole passage (one audio at a time; a file not recorded yet says so) ---- */
let dcAudio = null, dcAudioId = '';
function dcPlayLabel(id) { return dcAudioId === id ? '⏸ Stop' : '▶ Play'; }
function dcPlayBtn(d) {
  return '<button type="button" class="mini-btn dct-play" data-dc-play="' + escapeForHtml(d.id) + '" title="Play the whole dictation for the class" onclick="dcPlay(' + jsAttr(d.id) + ')">' + dcPlayLabel(d.id) + '</button>';
}
function dcPlayShow() { document.querySelectorAll('[data-dc-play]').forEach(b => { b.textContent = dcPlayLabel(b.dataset.dcPlay); }); }
function dcStop() {
  const a = dcAudio;
  dcAudio = null; dcAudioId = '';
  if (a) { try { a.pause(); a.removeAttribute('src'); a.load(); } catch (e) { /* ignore */ } }
  dcPlayShow();
}
function dcPlay(id) {
  const d = dcItem(id);
  if (!d) return;
  if (dcAudioId === id) { dcStop(); return; }
  dcStop();
  const a = new Audio();
  let failed = false;
  const fail = () => {
    if (failed || dcAudio !== a) return;
    failed = true;
    dcStop();
    showToast('🔇 This audio isn\'t ready yet — it is still being recorded. Try again later.');
  };
  a.addEventListener('error', fail);
  a.addEventListener('ended', () => { if (dcAudio === a) dcStop(); });
  dcAudio = a; dcAudioId = id;
  const sc = document.querySelector('script[src*="pages/dictation.js"]'), vm = sc && /[?&]v=([^&#]+)/.exec(sc.getAttribute('src') || '');
  a.src = 'audio/dictation/' + encodeURIComponent(d.id) + '.mp3' + (vm ? '?v=' + vm[1] : '');
  dcPlayShow();
  const p = a.play();
  if (p && p.catch) p.catch(e => { if (!e || e.name !== 'AbortError') fail(); });
}
/* the teacher's audio stops when they leave the Course page (another section, back/forward, closing the tab) */
window.addEventListener('pagehide', dcStop);
window.addEventListener('popstate', dcStop);
if (typeof window.taNavigate === 'function') {
  const dcNav = window.taNavigate;
  window.taNavigate = function () { dcStop(); return dcNav.apply(this, arguments); };
}
/* 📄 the full text, big enough to show the class */
function dcTranscript(id) {
  const d = dcItem(id);
  if (!d) return;
  taModal('📄 ' + dcTitle(d), '<p class="dct-transcript" translate="no">' + escapeForHtml(d.text) + '</p>' +
    '<p class="dct-transcript-note">' + d.sentences.length + ' sentences · students hear them one at a time.</p>', { wide: true });
}

function dcPageHtml() {
  const v = dcView || {};
  const d = v.item ? dcItem(v.item) : null;
  if (d) return dcItemHtml(d);
  const lv = dcLevel(v.level);
  return lv && (lv.items || []).length ? dcLevelHtml(lv) : '';
}
function dcItemBtns(d) {
  if (d.recorded === false) return '<span class="dct-recording" style="opacity:.6">🎙 Recording…</span>' +
    '<button type="button" class="mini-btn" onclick="dcTranscript(' + jsAttr(d.id) + ')">📄 Transcript</button>';
  return dcPlayBtn(d) +
    '<button type="button" class="mini-btn" onclick="dcTranscript(' + jsAttr(d.id) + ')">📄 Transcript</button>' +
    '<button type="button" class="mini-btn" onclick="dcTry(' + jsAttr(d.id) + ')">▶️ Try</button>' +
    '<button type="button" class="mini-btn solid" onclick="dcCopyLink(' + jsAttr(d.id) + ')">🔗 Copy link</button>';
}
function dcLevelHtml(lv) {
  const links = dcLinks(), map = skResultsMap(lv.items.map(d => dcCode(d.id, links)));   // one reading for every row
  return '<button type="button" class="back-to-picker-btn" onclick="taNavigate(\'course.html\')">← Course</button>' +
    '<div class="gr-page-head"><h3>✍️ Dictation Journey · ' + escapeForHtml(lv.name) + '</h3>' +
    '<p class="sk-hint">Press a dictation to see its results. ▶ Play and 📄 Transcript are for the class; 🔗 Copy link gives one link that works for every group.</p></div>' +
    '<ol class="gr-lessons dct-items">' + lv.items.map(d => {
      const sent = !!dcCode(d.id, links);
      return '<li class="dct-item' + (sent ? ' sent' : '') + '" data-item="' + escapeForHtml(d.id) + '">' +
        '<button type="button" class="gr-lesson-open" onclick="dcOpenItem(' + jsAttr(d.id) + ')"><span class="gr-lesson-no">' + d.no + '</span><span translate="no">' + escapeForHtml(d.title) + '</span></button>' +
        '<span class="gr-done">' + (sent ? '✅ ' + jrDoneCount(dcResults(d.id, links, map)) + ' done' : 'Not sent yet') + '</span>' +
        '<span class="gr-lesson-btns">' + dcItemBtns(d) + '</span></li>';
    }).join('') + '</ol>';
}
function dcItemHtml(d) {
  const lv = dcLevelOf(d.id), sent = !!dcCode(d.id), groups = getStudentGroups();
  if (dcFilter !== 'all' && !groups.some(g => g.id === dcFilter)) dcFilter = 'all';
  const head = '<button type="button" class="back-to-picker-btn" onclick="dcOpenItem(\'\')">← ' + escapeForHtml(lv ? lv.name : 'Dictation Journey') + '</button>' +
    '<div class="gr-page-head"><h3 translate="no">' + escapeForHtml(dcTitle(d)) + '</h3>' +
    '<p class="sk-hint">' + escapeForHtml(lv ? lv.name : '') + ' · ' + d.sentences.length + ' sentences, one at a time. Only each student\'s first run counts here.</p>' +
    '<div class="sk-tile-btns dct-btns">' + dcItemBtns(d) + '</div></div>';
  if (!sent) {
    return '<section class="dct-page">' + head + '<div class="sk-results-empty"><span class="sk-results-empty-emoji">📮</span><div><b>Not sent yet</b>' +
      '<span>Press 🔗 Copy link and send it to your groups. What they write shows here.</span></div></div></section>';
  }
  const rows = dcTableRows(d.id, dcFilter);
  const g = groups.find(x => x.id === dcFilter) || null;
  const table = rows.length ? dcTableHtml(d, rows)
    : '<div class="sk-results-empty"><span class="sk-results-empty-emoji">🌱</span><div><b>No results yet</b><span>When ' +
      (g ? 'students in <span translate="no">' + escapeForHtml(g.name) + '</span>' : 'students') + ' finish the dictation, what they wrote shows here.</span></div></div>';
  const missingGroups = g ? [g] : groups.filter(x => getPointsRoster().some(s => s.group === x.id));
  return '<section class="dct-page">' + head + jrFilterHtml(dcFilter, 'dcSetFilter') +
    '<section class="sk-results" aria-label="Results"><div class="sk-results-head"><h3>🏆 Results' + (g ? ' — <span translate="no">' + escapeForHtml(g.name) + '</span>' : '') + '</h3></div>' + table +
    '</section>' +
    missingGroups.map(x => jrMissingHtml(dcMissingRows(d.id, x.id), x, 'dcCopyMissing', 'has done this dictation.')).join('') +
    jrUnlistedHtml(dcUnlistedRows(d.id)) + '</section>';
}
function dcTableHtml(d, rows) {
  const esc = escapeForHtml;
  return '<div class="gr-table dct-table" role="table" aria-label="Results">' +
    '<div class="gr-thead" role="row"><span role="columnheader">#</span><span role="columnheader">Student</span><span role="columnheader">Group</span>' +
    '<span role="columnheader">Right</span><span role="columnheader">Skips</span><span role="columnheader">Time</span><span role="columnheader">Date</span></div>' +
    rows.map(r => '<div class="gr-trow dct-row" role="row">' +
      '<span class="gr-place' + (r.place <= 3 ? ' medal' : '') + '" role="cell" aria-label="Place ' + r.place + '">' + skPlaceText(r.place) + '</span>' +
      '<span class="gr-name" role="cell"><span class="res-avatar" style="background:' + avatarColorForName(r.name) + ';">' + esc(initialsForName(r.name)) + '</span>' +
        '<button type="button" class="dct-open" title="See what they wrote" onclick="dcViewResult(' + jsAttr(d.id) + ',' + jsAttr(r.studentId) + ')"><b translate="no">' + esc(r.name) + '</b></button></span>' +
      '<span class="gr-group" role="cell" translate="no">' + esc(r.group || '—') + '</span>' +
      '<span class="gr-score ' + (r.score >= 80 ? 'b-good' : r.score >= 50 ? 'b-mid' : 'b-low') + '" role="cell" title="Sentences right the first time"><b>' + r.correct + '/' + r.total + '</b><small>' + r.score + '%</small></span>' +
      '<span class="dct-skips-cell" role="cell" title="Sentences skipped"><span class="dct-skips-icon" aria-hidden="true">⏭</span><span class="dct-skips">' + r.skips + '</span></span>' +
      '<span class="gr-time" role="cell">' + grTimeText(r.timeSeconds) + '</span>' +
      '<span class="gr-date" role="cell">' + esc(skShortDate(r.date)) + '</span>' +
    '</div>').join('') +
    '<p class="gr-tfoot">Right = sentences right on the first Check. Ranked by that, then fewer skips, then the shorter time. Press a name to see what the student wrote.</p></div>';
}

/* ---- what a student wrote: each sentence's first try, marked against the right sentence ---- */
function dcMarkedHtml(expected, typed) {
  const esc = escapeForHtml;
  if (!String(typed || '').trim()) return '<span class="dct-nothing">— nothing written</span>';
  const res = typeof window.dcCheck === 'function' ? window.dcCheck(expected, typed) : null;
  if (!res) return esc(typed);
  return res.parts.map(p => p.state === 'wrong'
    ? '<span class="dct-mark wrong" title="Wrong word">' + esc(p.text) + '</span> <span class="dct-want" title="The right word">' + esc(p.want) + '</span>'
    : p.state === 'missing' ? '<span class="dct-mark missing" title="A word they missed">' + esc(p.text) + '</span>'
    : p.state === 'extra' ? '<span class="dct-mark extra" title="Not in the sentence">' + esc(p.text) + '</span>'
    : '<span class="dct-mark ok">' + esc(p.text) + '</span>').join(' ');
}
function dcViewResult(itemId, studentId) {
  const d = dcItem(itemId);
  if (!d) return;
  const row = dcTableRows(itemId, 'all').find(x => String(x.studentId) === String(studentId));
  if (!row) return;
  const esc = escapeForHtml, sents = Array.isArray(row.r.sentences) ? row.r.sentences : [];
  const n = Math.max(d.sentences.length, sents.length);
  const tries = k => k + (k === 1 ? ' try' : ' tries');
  const items = [];
  for (let i = 0; i < n; i++) {
    const none = !sents[i];
    const s = sents[i] || {}, want = d.sentences[i] || '', t = Math.max(0, grNum(s.tries) || 0);
    const cls = none ? 'none' : s.ok ? 'ok' : s.skipped ? 'skipped' : 'wrong';
    const state = none ? '— no answer' : s.ok ? '✅ Right the first time'
      : s.skipped ? '⏭ Skipped' + (t ? ' after ' + tries(t) : ' without trying')
      : '✏️ Right after ' + tries(Math.max(2, t));
    items.push('<li class="dct-sent ' + cls + '"><div class="dct-sent-head"><span class="dct-sent-no">' + (i + 1) + '</span><span class="dct-sent-state">' + state + '</span></div>' +
      (none ? '<p class="dct-right" translate="no"><small>Right</small>' + esc(want) + '</p>'
        : s.ok ? '<p class="dct-right" translate="no">' + esc(want) + '</p>'
        : '<p class="dct-first" translate="no"><small>First try</small>' + dcMarkedHtml(want, s.first) + '</p>' +
          '<p class="dct-right" translate="no"><small>Right</small>' + esc(want) + '</p>') + '</li>');
  }
  const head = '<p class="dct-view-sum"><b>' + row.correct + '/' + row.total + '</b> right the first time · ⏭ ' + row.skips + ' skipped · ⏱ ' + grTimeText(row.timeSeconds) +
    (row.date ? ' · ' + esc(skShortDate(row.date)) : '') + '</p>' +
    '<p class="dct-view-key"><span class="dct-mark wrong">wrong</span> <span class="dct-want">right word</span> · <span class="dct-mark missing">missed</span> · <span class="dct-mark extra">extra</span></p>';
  taModal(row.name + ' — ' + dcTitle(d), '<div class="dct-view">' + head + '<ol class="dct-sents">' + items.join('') + '</ol></div>', { wide: true });
}

/* ---- buttons ---- */
function dcCopyMissing(groupId) {
  const d = dcItem((dcView || {}).item), g = getStudentGroups().find(x => x.id === groupId);
  if (!d || !g) return;
  jrCopyMissing(dcTitle(d), g, dcMissingRows(d.id, g.id));
}
function dcTry(itemId) {
  const w = window.open(taDictationLink(itemId, dcCode(itemId)) + '&preview=1', '_blank');
  if (!w) showToast('⚠️ The browser blocked the new tab. Allow pop-ups for this site and press again.');
}
/* 🔗 Copy link: the dictation's one link (every group), and its class list online — every student with a group, each with their
   own group's name ("Bu sizmi?" shows it). rosterSig is kept once the list is online. */
function dcCopyLink(itemId) {
  const d = dcItem(itemId);
  if (!d) return;
  const code = dcEnsureCode(d.id);
  if (!code) return;
  const url = taDictationLink(d.id, code);
  const students = grClassStudents(), sig = grRosterSig();
  const kept = dcLinks()[d.id];
  if (!students.length && kept && kept.rosterSig) {   // an empty list must never replace a full one online
    showToast('Your Students list hasn\'t loaded yet — try again in a moment.');
    return;
  }
  if (typeof window.taPublishClassList === 'function') {
    window.taPublishClassList(code, students).then(ok => {
      if (!ok) { showToast('⚠️ The class list couldn\'t go online — students can still start without an ID check. Press Copy link again later.'); return; }
      const links = dcLinks();
      if (links[d.id] && links[d.id].code === code) { links[d.id].rosterSig = sig; dcSaveLinks(links); }
    });
  }
  jrCopyText(url, '🔗 Link copied — send it to every group. It always works.', '🔗 The link for ' + dcTitle(d));
  renderDictationJourney();
}
function dcOpenLevel(id) {
  if (!id || !dcLevel(id)) { taNavigate('course.html'); return; }
  dcView = { level: id, item: '' };
  renderDictationJourney();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function dcOpenItem(id) {
  const cur = dcView || {}, d = id ? dcItem(id) : null;
  const lv = d ? dcLevelOf(d.id) : dcLevel(cur.level);
  dcView = lv ? { level: lv.id, item: d ? d.id : '' } : null;
  renderDictationJourney();
  if (!d && cur.item) setTimeout(() => skCourseShownScroll('.dct-item[data-item="' + cur.item + '"]'), 60);
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
function dcSetFilter(id) {
  dcFilter = id && id !== 'all' && getStudentGroups().some(g => g.id === id) ? id : 'all';
  renderDictationJourney();
}
Object.assign(window, { dcLinks, dcSaveLinks, dcCopyLink, dcRefreshLists, dcTableRows, dcMissingRows, dcUnlistedRows, dcCopyMissing,
  dcTry, dcPlay, dcStop, dcTranscript, dcViewResult, dcOpenLevel, dcOpenItem, dcSetFilter, dcPageHtml, dcEnsureCode });
/* ---- the page (dictationjourney.html) ---- */
function renderDictationJourney() {
  const wrap = document.getElementById('dictationWrap');
  if (!wrap) return;
  dcRefreshLists();   // the class lists follow the Students list
  if (!dcView || !dcLevel(dcView.level)) { const lv = dcLevels()[0]; dcView = lv ? { level: lv.id, item: '' } : null; }
  wrap.innerHTML = dcPageHtml();
}
/* the Course page's Dictation card opens dictationjourney.html?level=<id> (2026-11-24 — this page has no "all levels" view any more) */
function dcShowPage() {
  let want = '';
  try { want = new URLSearchParams(location.search).get('level') || ''; } catch (e) { want = ''; }
  if (want && dcLevel(want)) dcView = { level: want, item: '' };
  renderDictationJourney();
}
jrOnResultsChanged(() => { if (jrShown('dictationWrap')) renderDictationJourney(); });
window.addEventListener('storage', e => { if (e.key && /ta_dictation_links|ta_student_groups|ta_points_roster/.test(e.key) && jrShown('dictationWrap')) renderDictationJourney(); });
window.renderDictationJourney = renderDictationJourney;
dcRefreshLists();   // loaded on any page (opened, or in the background): stale class lists go online again
taOnTab('dictationjourney', dcShowPage);
taStartPage('dictationjourney');
