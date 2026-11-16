/* ================= GRAMMAR JOURNEY — the teacher's side (2026-11-16) =================
   A section on the Course page, under the group cards: 7 levels (TA_GRAMMAR, js/grammar-data.js — only Beginner has lessons
   now, the others say "Coming soon"). A level opens its lessons; a lesson opens its page: ▶️ Try, 🔗 Copy link, a group
   filter (All · each group), the results table and "🚫 Not finished".
   - One link per lesson for every group: skill.html?s=grammar&gl=<lesson id>&c=<code> (taGrammarLink in common.js).
   - ta_grammar_links { <lesson id>: { code, sentAt, rosterSig } } (synced, in the backup): the code is made at the first
     Copy link and never changes; firebase.js loads its results. rosterSig = the Students list (grRosterSig) when the class
     list last went online — the list holds every student with a group, each with their own group's name (g).
   - Results (type 'Grammar course'): only a student's first try counts (the earliest by date). A result's group is the
     student's group on the Students list now (matched by ID — taIdKey); a result from an ID that isn't on the list is shown
     under "❓ Not on your Students list".
   The view lives in skView.grammar ({ level, lesson }) — course.js's renderCourse draws it instead of the cards. */
const GR_LINKS_KEY = 'ta_grammar_links';
let grFilter = 'all';   // the lesson page's group filter: 'all' or a group id (not remembered)

function grLevels() { return (window.TA_GRAMMAR && TA_GRAMMAR.levels) || []; }
function grLevel(id) { return grLevels().find(l => l.id === id) || null; }
function grLesson(id) {
  for (const lv of grLevels()) { const l = (lv.lessons || []).find(x => x.id === id); if (l) return l; }
  return null;
}
function grLevelOf(lessonId) { return grLevels().find(lv => (lv.lessons || []).some(l => l.id === lessonId)) || null; }
function grTitle(l) { return 'Lesson ' + l.no + ' · ' + l.title; }

/* ---- the kept links ---- */
function grLinks() {
  try { const v = JSON.parse(localStorage.getItem(GR_LINKS_KEY) || 'null'); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; } catch (e) { return {}; }
}
function grSaveLinks(v) {
  try { localStorage.setItem(GR_LINKS_KEY, JSON.stringify(v || {})); return true; } catch (e) { return false; }
}
function grCode(lessonId, links) { const e = (links || grLinks())[lessonId]; return e && typeof e === 'object' && e.code ? String(e.code) : ''; }
/* every code this teacher already uses — a new lesson code is never one of them (skills links, lessons, My Exercises) */
function grUsedCodes() {
  const used = new Set();
  const add = v => { if (v && typeof v === 'object') [v.code].concat(Array.isArray(v.alsoCodes) ? v.alsoCodes : []).forEach(c => { if (c) used.add(String(c)); }); };
  try { Object.values(taSkillsLinks()).forEach(add); } catch (e) { /* ignore */ }
  try { Object.values(JSON.parse(localStorage.getItem('ta_skills_links') || '{}') || {}).forEach(add); } catch (e) { /* ignore */ }
  Object.values(grLinks()).forEach(add);
  try { (getRecentExercises() || []).forEach(add); } catch (e) { /* ignore */ }
  return used;
}
/* The lesson's code: made at the first Copy link, the same one after that (a sent link must keep working). */
function grEnsureCode(lessonId) {
  const l = grLesson(lessonId);
  if (!l) return '';
  const links = grLinks(), kept = grCode(l.id, links);
  if (kept) return kept;
  const used = grUsedCodes();
  let code = generateClassCode();
  for (let i = 0; i < 50 && used.has(code); i++) code = generateClassCode();
  links[l.id] = { code: code, sentAt: new Date().toISOString() };
  if (!grSaveLinks(links)) showToast('⚠️ Couldn\'t save — the browser\'s storage is full.');
  // a new code: load its results (firebase.js reads the codes from ta_grammar_links)
  if (window.startPlainCompletionsSync) { clearTimeout(window.__taResyncTimer); window.__taResyncTimer = setTimeout(window.startPlainCompletionsSync, 1500); }
  return code;
}

/* ---- the class list: every student who is in a group, with the group's name ---- */
function grClassStudents() {
  const names = {};
  getStudentGroups().forEach(g => { names[g.id] = g.name; });
  return getPointsRoster().filter(s => s && names[s.group] !== undefined)
    .map(s => ({ id: s.id, name: s.name, groupName: names[s.group] }));
}
/* the Students list as it goes online (IDs, names, groups) — when it changes, the lists must be put online again */
function grRosterSig() {
  return grClassStudents().map(s => taIdKey(s.id) + '|' + String(s.name || '').trim() + '|' + s.groupName).sort().join('\n');
}

/* ---- the class lists follow the Students list (2026-11-16): a student added (or renamed, or moved) after Copy link can start
   without pressing Copy link again. Runs when the Course page draws and when sync/another tab changes the roster or groups.
   At most one run per 5 s (window.__grRefreshMs in tests), never two at once; a failed publish keeps the old rosterSig, so the next run retries. ---- */
let grRefreshBusy = false, grRefreshAgain = false, grRefreshLast = 0, grRefreshTimer = 0;
function grRefreshLists() {
  if (typeof window.taPublishClassList !== 'function') return;   // Firebase is still loading — the next draw tries again
  if (grRefreshBusy) { grRefreshAgain = true; return; }
  const wait = (window.__grRefreshMs !== undefined ? window.__grRefreshMs : 5000) - (Date.now() - grRefreshLast);
  if (wait > 0) { if (!grRefreshTimer) grRefreshTimer = setTimeout(() => { grRefreshTimer = 0; grRefreshLists(); }, wait); return; }
  const sig = grRosterSig();
  const stale = Object.keys(grLinks()).filter(id => { const e = grLinks()[id]; return e && typeof e === 'object' && e.code && e.rosterSig !== sig; });
  if (!stale.length) return;
  grRefreshBusy = true; grRefreshLast = Date.now();
  const students = grClassStudents();
  (async () => {
    for (const id of stale) {
      const code = grCode(id);
      let ok = false;
      try { ok = await window.taPublishClassList(code, students); } catch (e) { ok = false; }
      if (!ok) continue;
      const links = grLinks();   // read again: sync may have changed it while we waited
      if (links[id] && links[id].code === code) { links[id].rosterSig = sig; grSaveLinks(links); }
    }
  })().catch(() => {}).then(() => {
    grRefreshBusy = false;
    if (grRefreshAgain) { grRefreshAgain = false; grRefreshLists(); }
  });
}
window.addEventListener('storage', e => { if (e.key && /ta_points_roster|ta_student_groups/.test(e.key)) grRefreshLists(); });

/* ---- results ---- */
function grResults(lessonId, links, map) {
  const code = grCode(lessonId, links);
  return code ? ((map || skResultsMap([code]))[code] || []) : [];
}
function grStudentKey(st) { return String(st.id).trim().toLowerCase(); }
function grNum(v) { const n = Number(v); return isFinite(n) ? n : null; }
/* the table: each student's first try (earliest date), with their group now; ranked by correct, then the shorter time */
function grTableRows(lessonId, groupId) {
  const idx = taRosterIndex(), groups = {}, first = {};
  getStudentGroups().forEach(g => { groups[g.id] = g.name; });
  grResults(lessonId).forEach(r => {
    const st = rosterStudentForResult(r, idx);
    if (!st) return;
    if (groupId && groupId !== 'all' && st.group !== groupId) return;
    const key = grStudentKey(st), cur = first[key];
    if (!cur || String(r.date || '') < String(cur.r.date || '')) first[key] = { st: st, r: r };
  });
  const rows = Object.values(first).map(({ st, r }) => {
    const total = grNum(r.total) > 0 ? grNum(r.total) : 20;
    const correct = Math.max(0, Math.min(total, grNum(r.correct) || 0));
    return { name: st.name, studentId: st.id, group: groups[st.group] || '', groupId: st.group || '', correct: correct, total: total,
      score: Math.round(correct / total * 100), timeSeconds: grNum(r.timeSeconds), date: String(r.date || '') };
  });
  const t = r => (r.timeSeconds > 0 ? r.timeSeconds : Infinity);
  const better = (a, b) => a.correct > b.correct || (a.correct === b.correct && t(a) < t(b));
  rows.sort((a, b) => (b.correct - a.correct) || (t(a) - t(b)) || a.name.localeCompare(b.name));
  rows.forEach(row => { row.place = 1 + rows.filter(o => better(o, row)).length; });
  return rows;
}
/* the group's students (Students list) with no result for the lesson; 'all' → everyone in a group */
function grMissingRows(lessonId, groupId) {
  const idx = taRosterIndex(), done = new Set();
  grResults(lessonId).forEach(r => { const st = rosterStudentForResult(r, idx); if (st) done.add(grStudentKey(st)); });
  const names = {};
  getStudentGroups().forEach(g => { names[g.id] = g.name; });
  return getPointsRoster().filter(s => s && names[s.group] !== undefined && (!groupId || groupId === 'all' || s.group === groupId) && !done.has(grStudentKey(s)))
    .map(s => ({ name: s.name, id: s.id, group: names[s.group], groupId: s.group }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
/* answers from an ID that isn't on the Students list — one row per typed ID (else name) */
function grUnlistedRows(lessonId) {
  const idx = taRosterIndex(), by = {}, list = grResults(lessonId), fixed = new Set();
  list.forEach(r => { if (r && r.correctedFrom) fixed.add(r.correctedFrom); });
  list.forEach(r => {
    if (rosterStudentForResult(r, idx) || fixed.has(r.__id)) return;
    const key = taIdKey(r.studentId) || 'name:' + String(r.name || '').trim().toLowerCase();
    if (key === 'name:' || by[key]) return;
    by[key] = { name: String(r.name || '').trim(), id: String(r.studentId || '').trim() };
  });
  return Object.values(by).sort((a, b) => a.name.localeCompare(b.name));
}
/* how many students have done it (anyone with a result, on the list or not) */
function grDoneCount(lessonId, links, map) {
  const seen = new Set();
  grResults(lessonId, links, map).forEach(r => { const k = taIdKey(r.studentId) || String(r.name || '').trim().toLowerCase(); if (k) seen.add(k); });
  return seen.size;
}
function grTimeText(seconds) {
  const s = Number(seconds);
  if (!(s > 0)) return '—';
  const m = Math.max(1, Math.round(s / 60));
  return m >= 60 ? Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min' : m + ' min';
}

/* ---- the section under the group cards ---- */
function grJourneyHtml() {
  const links = grLinks();
  const cards = grLevels().map((lv, i) => {
    const lessons = lv.lessons || [];
    const color = ['--c-blue', '--c-green', '--c-orange', '--c-purple', '--c-pink', '--c-teal', '--c-red'][i % 7];
    if (!lessons.length) {
      return '<article class="gr-level soon" data-level="' + escapeForHtml(lv.id) + '" style="--gc:var(' + color + ')">' +
        '<b class="gr-level-name">' + escapeForHtml(lv.name) + '</b><span class="sk-soon-tag">🛠️ Coming soon</span></article>';
    }
    const sent = lessons.filter(l => grCode(l.id, links)).length;
    return '<article class="gr-level" data-level="' + escapeForHtml(lv.id) + '" style="--gc:var(' + color + ')">' +
      '<button type="button" class="gr-level-open gr-level-name" onclick="grOpenLevel(' + jsAttr(lv.id) + ')">' + escapeForHtml(lv.name) + '</button>' +
      '<span class="gr-level-sub">' + lessons.length + ' lessons · ' + sent + ' sent</span></article>';
  }).join('');
  return '<section class="gr-journey" aria-label="Grammar Journey">' +
    '<div class="sk-results-head"><h3>📚 Grammar Journey</h3></div>' +
    '<p class="sk-hint">One link per lesson — send the same link to every group. Students learn, practise, then take a 20-question test.</p>' +
    '<div class="gr-levels">' + cards + '</div></section>';
}
function grPageHtml() {
  const v = skView.grammar || {};
  const l = v.lesson ? grLesson(v.lesson) : null;
  if (l) return grLessonHtml(l);
  const lv = grLevel(v.level);
  return lv && (lv.lessons || []).length ? grLevelHtml(lv) : '';
}
function grLessonBtns(l) {
  return '<button type="button" class="mini-btn" onclick="grTry(' + jsAttr(l.id) + ')">▶️ Try</button>' +
    '<button type="button" class="mini-btn solid" onclick="grCopyLink(' + jsAttr(l.id) + ')">🔗 Copy link</button>';
}
function grLevelHtml(lv) {
  const links = grLinks(), map = skResultsMap(lv.lessons.map(l => grCode(l.id, links)));   // one reading for every row
  return '<button type="button" class="back-to-picker-btn" onclick="grOpenLevel(\'\')">← Course</button>' +
    '<div class="gr-page-head"><h3>📚 Grammar Journey · ' + escapeForHtml(lv.name) + '</h3>' +
    '<p class="sk-hint">Press a lesson to see its results. 🔗 Copy link gives one link that works for every group.</p></div>' +
    '<ol class="gr-lessons">' + lv.lessons.map(l => {
      const sent = !!grCode(l.id, links);
      return '<li class="gr-lesson' + (sent ? ' sent' : '') + '" data-lesson="' + escapeForHtml(l.id) + '">' +
        '<button type="button" class="gr-lesson-open" onclick="grOpenLesson(' + jsAttr(l.id) + ')"><span class="gr-lesson-no">' + l.no + '</span>' + escapeForHtml(l.title) + '</button>' +
        '<span class="gr-done">' + (sent ? '✅ ' + grDoneCount(l.id, links, map) + ' done' : 'Not sent yet') + '</span>' +
        '<span class="gr-lesson-btns">' + grLessonBtns(l) + '</span></li>';
    }).join('') + '</ol>';
}
function grLessonHtml(l) {
  const lv = grLevelOf(l.id), links = grLinks(), sent = !!grCode(l.id, links), groups = getStudentGroups();
  if (grFilter !== 'all' && !groups.some(g => g.id === grFilter)) grFilter = 'all';
  const chip = (id, label) => '<button type="button" class="gr-chip' + (grFilter === id ? ' active' : '') + '" aria-pressed="' + (grFilter === id) + '" onclick="grSetFilter(' + jsAttr(id) + ')"' + (id === 'all' ? '' : ' translate="no"') + '>' + escapeForHtml(label) + '</button>';
  const head = '<button type="button" class="back-to-picker-btn" onclick="grOpenLesson(\'\')">← Grammar Journey</button>' +
    '<div class="gr-page-head"><h3>' + escapeForHtml(grTitle(l)) + '</h3>' +
    '<p class="sk-hint">' + escapeForHtml(lv ? lv.name : '') + ' · ' + (l.chunks || []).length + ' rules to learn, then a 20-question test. Only the first test counts here.</p>' +
    '<div class="sk-tile-btns">' + grLessonBtns(l) + '</div></div>';
  if (!sent) {
    return '<section class="gr-lesson-page">' + head + '<div class="sk-results-empty"><span class="sk-results-empty-emoji">📮</span><div><b>Not sent yet</b>' +
      '<span>Press 🔗 Copy link and send it to your groups. Their first test scores show here.</span></div></div></section>';
  }
  const rows = grTableRows(l.id, grFilter);
  const g = groups.find(x => x.id === grFilter) || null;
  const filter = '<div class="gr-filter" role="group" aria-label="Show a group">' + chip('all', 'All') + groups.map(x => chip(x.id, x.name)).join('') + '</div>';
  const table = rows.length ? grTableHtml(rows)
    : '<div class="sk-results-empty"><span class="sk-results-empty-emoji">🌱</span><div><b>No results yet</b><span>When ' +
      (g ? 'students in <span translate="no">' + escapeForHtml(g.name) + '</span>' : 'students') + ' finish the test, their first score shows here.</span></div></div>';
  const missingGroups = g ? [g] : groups.filter(x => getPointsRoster().some(s => s.group === x.id));
  return '<section class="gr-lesson-page">' + head + filter +
    '<section class="sk-results" aria-label="Results"><div class="sk-results-head"><h3>🏆 Results' + (g ? ' — <span translate="no">' + escapeForHtml(g.name) + '</span>' : '') + '</h3></div>' + table +
    '</section>' +
    missingGroups.map(x => grMissingHtml(l, x)).join('') + grUnlistedHtml(l) + '</section>';
}
function grTableHtml(rows) {
  const esc = escapeForHtml;
  return '<div class="gr-table" role="table" aria-label="Results">' +
    '<div class="gr-thead" role="row"><span role="columnheader">#</span><span role="columnheader">Student</span><span role="columnheader">Group</span>' +
    '<span role="columnheader">Test</span><span role="columnheader">Time</span><span role="columnheader">Date</span></div>' +
    rows.map(r => '<div class="gr-trow" role="row">' +
      '<span class="gr-place' + (r.place <= 3 ? ' medal' : '') + '" role="cell" aria-label="Place ' + r.place + '">' + skPlaceText(r.place) + '</span>' +
      '<span class="gr-name" role="cell"><span class="res-avatar" style="background:' + avatarColorForName(r.name) + ';">' + esc(initialsForName(r.name)) + '</span><b translate="no">' + esc(r.name) + '</b></span>' +
      '<span class="gr-group" role="cell" translate="no">' + esc(r.group || '—') + '</span>' +
      '<span class="gr-score ' + (r.score >= 80 ? 'b-good' : r.score >= 50 ? 'b-mid' : 'b-low') + '" role="cell"><b>' + r.correct + '/' + r.total + '</b><small>' + r.score + '%</small></span>' +
      '<span class="gr-time" role="cell">' + grTimeText(r.timeSeconds) + '</span>' +
      '<span class="gr-date" role="cell">' + esc(skShortDate(r.date)) + '</span>' +
    '</div>').join('') +
    '<p class="gr-tfoot">Ranked by score, then by the shorter time. Time = the whole lesson (learning, practice and test), only while the student was working.</p></div>';
}
function grMissingHtml(l, g) {
  const rows = grMissingRows(l.id, g.id), gName = '<span translate="no">' + escapeForHtml(g.name) + '</span>';
  return '<section class="sk-missing gr-missing" data-group="' + escapeForHtml(g.id) + '" aria-label="Not finished — ' + escapeForHtml(g.name) + '">' +
    '<div class="sk-results-head"><h3>🚫 Not finished — ' + gName + ' (' + rows.length + ')</h3>' +
    (rows.length ? '<button type="button" class="mini-btn solid" onclick="grCopyMissing(' + jsAttr(g.id) + ')">📋 Copy list</button>' : '') + '</div>' +
    (rows.length ? '<ol class="sk-missing-list">' + rows.map(r => '<li><b translate="no">' + escapeForHtml(r.name) + '</b></li>').join('') + '</ol>'
      : '<div class="sk-results-empty"><span class="sk-results-empty-emoji">🎉</span><div><b>Everyone has finished</b><span>Every student in ' + gName + ' has done this lesson\'s test.</span></div></div>') +
    '</section>';
}
function grUnlistedHtml(l) {
  const odd = grUnlistedRows(l.id);
  if (!odd.length) return '';
  return '<section class="sk-unlisted gr-unlisted" aria-label="Not on your Students list">' +
    '<div class="sk-results-head"><h3>❓ Not on your Students list (' + odd.length + ')</h3></div>' +
    '<ol class="sk-missing-list">' + odd.map(r => '<li><b translate="no">' + escapeForHtml(r.name || '—') + '</b> <small>ID ' + escapeForHtml(r.id || '—') + '</small></li>').join('') + '</ol>' +
    '<p class="sk-hint sk-results-note">These answers came with an ID that isn\'t on the Students list, so they count for nobody. A new student: add them to their group with this ID. ' +
    'A wrong ID: change the student\'s ID on the Students page, or tell them their right ID.</p></section>';
}

/* ---- buttons ---- */
/* 📋 Copy list: "Lesson 1 · To Be … — Apex / Not finished yet: / 1. Name" */
function grCopyMissing(groupId) {
  const l = grLesson((skView.grammar || {}).lesson), g = getStudentGroups().find(x => x.id === groupId);
  if (!l || !g) return;
  const rows = grMissingRows(l.id, g.id);
  if (!rows.length) { showToast('🎉 Everyone has finished — nothing to copy.'); return; }
  const text = [grTitle(l) + ' — ' + g.name, 'Not finished yet:'].concat(rows.map((r, i) => (i + 1) + '. ' + r.name)).join('\n');
  const msg = '📋 Copied — ' + rows.length + (rows.length === 1 ? ' student' : ' students') + '. Paste it into ' + g.name + '\'s chat.';
  const show = () => taModal('📋 Not finished — ' + g.name, '<textarea class="ta-input" readonly rows="' + Math.min(14, rows.length + 3) + '" aria-label="The list">' + escapeForHtml(text) + '</textarea>');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => showToast(msg, 'ok'), show);
  else show();
}
function grTry(lessonId) {
  const w = window.open(taGrammarLink(lessonId, grCode(lessonId)) + '&preview=1', '_blank');
  if (!w) showToast('⚠️ The browser blocked the new tab. Allow pop-ups for this site and press again.');
}
/* 🔗 Copy link: the lesson's one link (every group), and its class list online — every student with a group, each with their
   own group's name, so "Bu sizmi?" shows the student's group. rosterSig is kept once the list is online. */
function grCopyLink(lessonId) {
  const l = grLesson(lessonId);
  if (!l) return;
  const code = grEnsureCode(l.id);
  if (!code) return;
  const url = taGrammarLink(l.id, code);
  const students = grClassStudents(), sig = grRosterSig();
  if (typeof window.taPublishClassList === 'function') {
    window.taPublishClassList(code, students).then(ok => {
      if (!ok) { showToast('⚠️ The class list couldn\'t go online — students can still start without an ID check. Press Copy link again later.'); return; }
      const links = grLinks();
      if (links[l.id] && links[l.id].code === code) { links[l.id].rosterSig = sig; grSaveLinks(links); }
    });
  }
  const msg = '🔗 Link copied — send it to every group. It always works.';
  const show = () => taModal('🔗 The link for ' + grTitle(l), '<input type="text" class="ta-input" readonly value="' + escapeForHtml(url) + '" aria-label="The link">');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => showToast(msg, 'ok'), show);
  else show();
  renderCourse();
}
function grOpenLevel(id) {
  skView = { group: '', tab: 'journey', step: '', grammar: id && grLevel(id) ? { level: id, lesson: '' } : null };
  renderCourse();
  if (id) window.scrollTo({ top: 0, behavior: 'smooth' });
  else setTimeout(() => skCourseShownScroll('.gr-journey'), 60);   // back where the teacher was
}
function grOpenLesson(id) {
  const cur = skView.grammar || {}, l = id ? grLesson(id) : null;
  const lv = l ? grLevelOf(l.id) : grLevel(cur.level);
  skView = { group: '', tab: 'journey', step: '', grammar: lv ? { level: lv.id, lesson: l ? l.id : '' } : null };
  renderCourse();
  if (!l && cur.lesson) setTimeout(() => skCourseShownScroll('.gr-lesson[data-lesson="' + cur.lesson + '"]'), 60);
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
function grSetFilter(id) {
  grFilter = id && id !== 'all' && getStudentGroups().some(g => g.id === id) ? id : 'all';
  renderCourse();
}
Object.assign(window, { grLinks, grSaveLinks, grRosterSig, grClassStudents, grCopyLink, grOpenLevel, grOpenLesson, grSetFilter,
  grTableRows, grMissingRows, grUnlistedRows, grCopyMissing, grTry, grJourneyHtml, grEnsureCode, grRefreshLists });
