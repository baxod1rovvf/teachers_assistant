/* ================= MAIN DASHBOARD: greeting ================= */
function renderMainGreeting() {
  const nameEl = document.getElementById('mainGreetingName');
  const titleEl = document.getElementById('mainGreetingTitle');
  const heroName = document.getElementById('heroAccountName');
  const name = getTeacherName();
  if (nameEl) nameEl.textContent = name;
  if (heroName) heroName.textContent = name;
  const hour = new Date().getHours();
  let greeting;
  if (hour < 5) { greeting = 'Good night'; }
  else if (hour < 12) { greeting = 'Good morning'; }
  else if (hour < 18) { greeting = 'Good afternoon'; }
  else { greeting = 'Good evening'; }
  if (titleEl) {
    const firstChild = titleEl.firstChild;
    if (firstChild && firstChild.nodeType === 3) firstChild.textContent = greeting + ', ';
  }
}
window.renderMainGreeting = renderMainGreeting;

/* ================= MAIN DASHBOARD: top active students ================= */
function getAllScoredResultsCombined() {
  const combined = getStoredResults().concat(window.__liveResults || []);
  const seen = new Set();
  const out = [];
  combined.forEach(r => {
    if (!r || isResetMarker(r)) return;
    const sig = resultSignature(r);
    if (seen.has(sig)) return;
    seen.add(sig);
    out.push(r);
  });
  return out;
}
function getTopActiveStudents(limit) {
  const all = getAllScoredResultsCombined();
  const byName = {};
  const rosterIdx = taRosterIndex();
  all.forEach(r => {
    if (!r || typeof r.score !== 'number') return;
    // Only students who entered with an ID from the Students list.
    const st = rosterStudentForResult(r, rosterIdx);
    if (!st) return;
    const key = String(st.id).trim().toLowerCase();
    if (!byName[key]) byName[key] = { name: st.name, total: 0, count: 0 };
    byName[key].total += r.score;
    byName[key].count += 1;
  });
  const arr = Object.keys(byName).map(function (k) {
    const s = byName[k];
    return { name: s.name, avg: s.total / s.count, count: s.count };
  });
  arr.sort((a, b) => (b.avg - a.avg) || (b.count - a.count));
  return arr.slice(0, limit);
}
const RANK_ICONS = ['🥇', '🥈', '🥉'];
function renderTopActiveStudents() {
  const wrap = document.getElementById('mainTopStudentsList');
  if (!wrap) return;
  const top = getTopActiveStudents(5);
  if (!top.length) { wrap.innerHTML = '<div class="empty-results">No scored results from your students yet. Only students who enter with their ID appear here.</div>'; return; }
  wrap.innerHTML = top.map((s, i) => {
    const initials = initialsForName(s.name);
    const avatarColor = avatarColorForName(s.name);
    const rankIcon = RANK_ICONS[i] || ('#' + (i + 1));
    const pct = Math.round(s.avg);
    const scoreColor = pct >= 80 ? 'var(--success)' : (pct >= 50 ? 'var(--warning)' : 'var(--danger)');
    return '<div class="top-student-row">' +
      '<span class="top-student-rank">' + rankIcon + '</span>' +
      '<span class="res-avatar" style="background:' + avatarColor + ';">' + escapeForHtml(initials) + '</span>' +
      '<div class="top-student-name">' + escapeForHtml(s.name) + '</div>' +
      '<div class="top-student-score" style="color:' + scoreColor + ';">' + pct + '%</div>' +
    '</div>';
  }).join('');
}
window.renderTopActiveStudents = renderTopActiveStudents;

/* ================= DASHBOARD: stat tiles ================= */
function renderDashboardStats() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('dashStatStudents', String(getPointsRoster().length));
  // Every weekly schedule entry happens once a week.
  set('dashStatLessons', String(getWeeklySchedule().length));
  set('dashStatExercises', String(getRecentExercises().length));
  // Average score of results from students on the Students list (same rule as Top Active Students).
  const rosterIdx = taRosterIndex();
  const scores = getAllScoredResultsCombined()
    .filter(r => typeof r.score === 'number' && rosterStudentForResult(r, rosterIdx))
    .map(r => r.score);
  set('dashStatResults', scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) + '%' : '—');
}

/* ================= PAGE START ================= */
taOnTab('main', function () {
  renderMainGreeting();
  renderDashboardStats();
  renderNextLessons();
  renderTopActiveStudents();
  initRobotHiAnim();
});
taStartPage('main');
