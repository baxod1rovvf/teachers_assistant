/* ================= COURSE — the three journeys (2026-11-23; lists inside the cards 2026-11-24) =================
   The teacher: "Course is a html file including three journeys. It is too big so separate every journey." course.html is only
   three cards; each journey is its own page with its own script and stylesheet:
   - IELTS Journey      ieltsjourney.html      js/pages/ielts-journey.js (+ telegram.js)   css/ielts-journey.css
   - Grammar Journey    grammarjourney.html    js/pages/grammar.js                         css/grammar-journey.css
   - Dictation Journey  dictationjourney.html  js/pages/dictation.js                       css/dictation-journey.css
   What the journeys share: js/pages/journey-shared.js and css/journeys.css.
   2026-11-24 (teacher: "delete the texts below titles, use icons not emojis; IELTS journey should include the groups below the
   title, if I click one Loom brings me to this group's journey … Grammar and dictation the same, with levels"): each card is an
   icon + title + a list — IELTS: the Students page's groups → ieltsjourney.html?group=<id>; Grammar / Dictation: their levels →
   grammarjourney.html?level=<id> / dictationjourney.html?level=<id>. The journeys' own "all groups" / "all levels" views are gone.
   The level lists are written here (the journeys' data files are 150–400 KB — too heavy for this page); tests/pages.spec.js checks
   they match TA_GRAMMAR / TA_DICTATION. A Grammar level with no lessons yet shows "Soon" and doesn't open. */
const CR_GRAMMAR_LEVELS = [['beginner', 'Beginner', true], ['elementary', 'Elementary', true], ['preintermediate', 'Pre-Intermediate', true],
  ['intermediate', 'Intermediate', false], ['upperintermediate', 'Upper-Intermediate', false], ['advanced', 'Advanced', false], ['intensive', 'Intensive', false]];
const CR_DICTATION_LEVELS = [['beginner', 'Beginner'], ['elementary', 'Elementary'], ['preintermediate', 'Pre-intermediate'],
  ['intermediate', 'Intermediate'], ['advanced', 'Upper-intermediate & Advanced']];
function crItem(href, label, soon) {
  if (soon) return '<li><span class="cr-item soon" aria-disabled="true"><span class="cr-item-name">' + escapeForHtml(label) + '</span><span class="cr-soon">Soon</span></span></li>';
  return '<li><a class="cr-item" href="' + escapeForHtml(href) + '" onclick="return crGo(event, this)"><span class="cr-item-name" translate="no">' + escapeForHtml(label) + '</span>' +
    '<i class="lc lc-arrow-right" aria-hidden="true"></i></a></li>';
}
/* a list item opens its journey in place (Ctrl/⌘-click still opens a new tab) */
function crGo(e, a) {
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.button > 0) return true;
  e.preventDefault();
  taNavigate(a.getAttribute('href'));
  return false;
}
function crCard(key, icon, color, name, items) {
  return '<section class="cr-card" data-journey="' + key + '" style="--gc:var(' + color + ')">' +
    '<div class="cr-head"><span class="cr-icon" aria-hidden="true"><i class="lc lc-' + icon + '"></i></span><h3 class="cr-name">' + name + '</h3></div>' +
    '<ul class="cr-list">' + items + '</ul></section>';
}
function renderCourseHub() {
  const wrap = document.getElementById('courseHub');
  if (!wrap) return;
  const groups = getStudentGroups();
  const ielts = groups.length ? groups.map(g => crItem('ieltsjourney.html?group=' + encodeURIComponent(g.id), g.name)).join('')
    : '<li><a class="cr-item cr-empty" href="students.html" onclick="return crGo(event, this)"><span class="cr-item-name">Add a group on the Students page</span><i class="lc lc-arrow-right" aria-hidden="true"></i></a></li>';
  wrap.innerHTML = '<div class="cr-cards">' +
    crCard('ieltsjourney', 'target', '--c-blue', 'IELTS Journey', ielts) +
    crCard('grammarjourney', 'book-open', '--c-green', 'Grammar Journey', CR_GRAMMAR_LEVELS.map(([id, n, ready]) => crItem('grammarjourney.html?level=' + id, n, !ready)).join('')) +
    crCard('dictationjourney', 'pen-line', '--c-orange', 'Dictation Journey', CR_DICTATION_LEVELS.map(([id, n]) => crItem('dictationjourney.html?level=' + id, n)).join('')) +
  '</div>';
}
window.addEventListener('storage', e => { if (e.key && /ta_student_groups/.test(e.key) && document.getElementById('courseHub') && document.getElementById('courseHub').getClientRects().length) renderCourseHub(); });
Object.assign(window, { renderCourseHub, crGo, CR_GRAMMAR_LEVELS, CR_DICTATION_LEVELS });
taOnTab('course', renderCourseHub);
taStartPage('course');
