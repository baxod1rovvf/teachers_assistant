/* ================= GRAMMAR JOURNEY — the teacher's side (2026-11-16) =================
   Its own page since 2026-11-23: grammarjourney.html (#grammarWrap; shared helpers in js/pages/journey-shared.js): 7 levels (TA_GRAMMAR, js/grammar-data.js — Beginner, Elementary and
   Pre-Intermediate have lessons now, the others say "Coming soon"). A level opens its lessons; a lesson opens its page: ▶️ Try, 🔗 Copy link, a group
   filter (All · each group), the results table and "🚫 Not finished".
   - One link per lesson for every group: skill.html?s=grammar&gl=<lesson id>&c=<code> (taGrammarLink in common.js).
   - ta_grammar_links { <lesson id>: { code, sentAt, rosterSig } } (synced, in the backup): the code is made at the first
     Copy link and never changes; firebase.js loads its results. rosterSig = the Students list (grRosterSig) when the class
     list last went online — the list holds every student with a group, each with their own group's name (g).
   - Results (type 'Grammar course'): only a student's first try counts (the earliest by date). A result's group is the
     student's group on the Students list now (matched by ID — taIdKey); a result from an ID that isn't on the list is shown
     under "❓ Not on your Students list".
   The view lives in grView ({ level, lesson }) — renderGrammarJourney draws it. Since 2026-11-24 the Course page lists the levels
   (grammarjourney.html?level=<id>) and this page has no "all levels" view: no level asked → the last one opened here, else Beginner. */
const GR_LINKS_KEY = 'ta_grammar_links';
let grView = null;   // the open level / lesson (not remembered)
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


const grRefresher = jrMakeRefresher({ links: grLinks, save: grSaveLinks, msVar: '__grRefreshMs', retryVar: '__grRetryMs' });
function grRefreshLists() { grRefresher(); }
window.addEventListener('storage', e => { if (e.key && /ta_points_roster|ta_student_groups/.test(e.key)) grRefreshLists(); });

/* ---- results ---- */
function grResults(lessonId, links, map) {
  const code = grCode(lessonId, links);
  return code ? ((map || skResultsMap([code]))[code] || []) : [];
}

/* the table: each student's first try (earliest date), with their group now; ranked by correct, then the shorter time */
function grTableRows(lessonId, groupId) {
  const groups = {};
  getStudentGroups().forEach(g => { groups[g.id] = g.name; });
  const rows = jrFirstTries(grResults(lessonId), groupId).map(({ st, r }) => {
    const total = grNum(r.total) > 0 ? grNum(r.total) : 20;
    const correct = Math.max(0, Math.min(total, grNum(r.correct) || 0));
    return { name: st.name, studentId: st.id, group: groups[st.group] || '', groupId: st.group || '', correct: correct, total: total,
      score: Math.round(correct / total * 100), timeSeconds: grNum(r.timeSeconds), date: String(r.date || '') };
  });
  const t = r => (r.timeSeconds > 0 ? r.timeSeconds : Infinity);
  rows.sort((a, b) => (b.correct - a.correct) || (t(a) - t(b)) || a.name.localeCompare(b.name));
  return jrPlaces(rows, (a, b) => a.correct > b.correct || (a.correct === b.correct && t(a) < t(b)));
}
function grMissingRows(lessonId, groupId) { return jrMissing(grResults(lessonId), groupId); }
function grUnlistedRows(lessonId) { return jrUnlisted(grResults(lessonId)); }
function grDoneCount(lessonId, links, map) { return jrDoneCount(grResults(lessonId, links, map)); }

function grPageHtml() {
  const v = grView || {};
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
  return '<button type="button" class="back-to-picker-btn" onclick="taNavigate(\'course.html\')">← Course</button>' +
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
  const head = '<button type="button" class="back-to-picker-btn" onclick="grOpenLesson(\'\')">← ' + escapeForHtml(lv ? lv.name : 'Grammar Journey') + '</button>' +
    '<div class="gr-page-head"><h3>' + escapeForHtml(grTitle(l)) + '</h3>' +
    '<p class="sk-hint">' + escapeForHtml(lv ? lv.name : '') + ' · ' + (l.chunks || []).length + ' rules to learn, then a 20-question test. Only the first test counts here.</p>' +
    '<div class="sk-tile-btns">' + grLessonBtns(l) + '</div></div>';
  if (!sent) {
    return '<section class="gr-lesson-page">' + head + '<div class="sk-results-empty"><span class="sk-results-empty-emoji">📮</span><div><b>Not sent yet</b>' +
      '<span>Press 🔗 Copy link and send it to your groups. Their first test scores show here.</span></div></div></section>';
  }
  const rows = grTableRows(l.id, grFilter);
  const g = groups.find(x => x.id === grFilter) || null;
  const filter = jrFilterHtml(grFilter, 'grSetFilter');
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
function grMissingHtml(l, g) { return jrMissingHtml(grMissingRows(l.id, g.id), g, 'grCopyMissing', 'has done this lesson\'s test.'); }
function grUnlistedHtml(l) { return jrUnlistedHtml(grUnlistedRows(l.id)); }

/* ---- buttons ---- */
/* 📋 Copy list: "Lesson 1 · To Be … — Apex / Not finished yet: / 1. Name" */
function grCopyMissing(groupId) {
  const l = grLesson((grView || {}).lesson), g = getStudentGroups().find(x => x.id === groupId);
  if (!l || !g) return;
  jrCopyMissing(grTitle(l), g, grMissingRows(l.id, g.id));
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
  const kept = grLinks()[l.id];
  if (!students.length && kept && kept.rosterSig) {   // an empty list must never replace a full one online
    showToast('Your Students list hasn\'t loaded yet — try again in a moment.');
    return;
  }
  if (typeof window.taPublishClassList === 'function') {
    window.taPublishClassList(code, students).then(ok => {
      if (!ok) { showToast('⚠️ The class list couldn\'t go online — students can still start without an ID check. Press Copy link again later.'); return; }
      const links = grLinks();
      if (links[l.id] && links[l.id].code === code) { links[l.id].rosterSig = sig; grSaveLinks(links); }
    });
  }
  jrCopyText(url, '🔗 Link copied — send it to every group. It always works.', '🔗 The link for ' + grTitle(l));
  renderGrammarJourney();
}
function grOpenLevel(id) {
  if (!id || !grLevel(id)) { taNavigate('course.html'); return; }
  grView = { level: id, lesson: '' };
  renderGrammarJourney();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function grOpenLesson(id) {
  const cur = grView || {}, l = id ? grLesson(id) : null;
  const lv = l ? grLevelOf(l.id) : grLevel(cur.level);
  grView = lv ? { level: lv.id, lesson: l ? l.id : '' } : null;
  renderGrammarJourney();
  if (!l && cur.lesson) setTimeout(() => skCourseShownScroll('.gr-lesson[data-lesson="' + cur.lesson + '"]'), 60);
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
function grSetFilter(id) {
  grFilter = id && id !== 'all' && getStudentGroups().some(g => g.id === id) ? id : 'all';
  renderGrammarJourney();
}
/* ---- the page (grammarjourney.html) ---- */
function renderGrammarJourney() {
  const wrap = document.getElementById('grammarWrap');
  if (!wrap) return;
  grRefreshLists();   // the class lists follow the Students list
  if (!grView || !grLevel(grView.level)) grView = { level: grDefaultLevel(), lesson: '' };
  wrap.innerHTML = grPageHtml() || (jrBackToCourseHtml() + '<div class="sk-results-empty"><span class="sk-results-empty-emoji">🛠️</span><div><b>Coming soon</b><span>This level has no lessons yet.</span></div></div>');
}
/* the first level with lessons (no level asked for and none opened yet) */
function grDefaultLevel() { const lv = grLevels().find(l => (l.lessons || []).length); return lv ? lv.id : ''; }
/* the Course page's Grammar card opens grammarjourney.html?level=<id> */
function grShowPage() {
  let want = '';
  try { want = new URLSearchParams(location.search).get('level') || ''; } catch (e) { want = ''; }
  if (want && grLevel(want)) grView = { level: want, lesson: '' };
  renderGrammarJourney();
}
jrOnResultsChanged(() => { if (jrShown('grammarWrap')) renderGrammarJourney(); });
window.addEventListener('storage', e => { if (e.key && /ta_grammar_links|ta_student_groups|ta_points_roster/.test(e.key) && jrShown('grammarWrap')) renderGrammarJourney(); });
grRefreshLists();   // loaded on any page (opened, or in the background): stale class lists go online again
taOnTab('grammarjourney', grShowPage);
taStartPage('grammarjourney');

Object.assign(window, { renderGrammarJourney, grLinks, grSaveLinks, grRosterSig, grClassStudents, grCopyLink, grOpenLevel, grOpenLesson, grSetFilter,
  grTableRows, grMissingRows, grUnlistedRows, grCopyMissing, grTry, grEnsureCode, grRefreshLists });
