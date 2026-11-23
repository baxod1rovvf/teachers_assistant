/* ================= COURSE — the three journeys (2026-11-23) =================
   The teacher: "Course is a html file including three journeys. It is too big so separate every journey." course.html is now only
   three cards; each journey is its own page with its own script and stylesheet:
   - 🎯 IELTS Journey      ieltsjourney.html      js/pages/ielts-journey.js (+ telegram.js)   css/ielts-journey.css
   - 📚 Grammar Journey    grammarjourney.html    js/pages/grammar.js                         css/grammar-journey.css
   - ✍️ Dictation Journey  dictationjourney.html  js/pages/dictation.js                       css/dictation-journey.css
   What the journeys share: js/pages/journey-shared.js and css/journeys.css. The card's line counts what is kept on this device. */
const TA_JOURNEYS = [
  { tab: 'ieltsjourney', href: 'ieltsjourney.html', emoji: '🎯', name: 'IELTS Journey', color: '--c-blue',
    about: 'Listening, Reading, Writing and Speaking in 20 steps — each group on its own path.' },
  { tab: 'grammarjourney', href: 'grammarjourney.html', emoji: '📚', name: 'Grammar Journey', color: '--c-green',
    about: 'Grammar lessons: learn, practise, then a 20-question test. One link for every group.' },
  { tab: 'dictationjourney', href: 'dictationjourney.html', emoji: '✍️', name: 'Dictation Journey', color: '--c-orange',
    about: 'Students hear one sentence at a time, write it and fix their mistakes. One link for every group.' }
];
function crSentCount(key) {
  try { const v = JSON.parse(localStorage.getItem(key) || '{}'); return v && typeof v === 'object' ? Object.values(v).filter(e => e && e.code).length : 0; } catch (e) { return 0; }
}
function crCardLine(tab) {
  if (tab === 'ieltsjourney') { const n = getStudentGroups().length; return n + (n === 1 ? ' group' : ' groups'); }
  if (tab === 'grammarjourney') { const n = crSentCount('ta_grammar_links'); return n + (n === 1 ? ' lesson sent' : ' lessons sent'); }
  const n = crSentCount('ta_dictation_links'); return n + (n === 1 ? ' dictation sent' : ' dictations sent');
}
function renderCourseHub() {
  const wrap = document.getElementById('courseHub');
  if (!wrap) return;
  wrap.innerHTML = '<div class="cr-cards">' + TA_JOURNEYS.map(j =>
    '<a class="cr-card" href="' + j.href + '" data-journey="' + j.tab + '" style="--gc:var(' + j.color + ')" onclick="if(!event.ctrlKey&&!event.metaKey&&!event.shiftKey){event.preventDefault();taNavigate(\'' + j.href + '\');}">' +
      '<span class="cr-emoji" aria-hidden="true">' + j.emoji + '</span>' +
      '<b class="cr-name">' + j.name + '</b>' +
      '<span class="cr-about">' + j.about + '</span>' +
      '<span class="cr-foot"><span class="cr-line">' + crCardLine(j.tab) + '</span><span class="cr-open">Open →</span></span>' +
    '</a>').join('') + '</div>';
}
window.renderCourseHub = renderCourseHub;
taOnTab('course', renderCourseHub);
taStartPage('course');
