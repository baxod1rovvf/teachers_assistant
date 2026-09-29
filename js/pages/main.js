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

/* ================= MAIN DASHBOARD: top active students =================
   Students are ranked by how well they did, not by how many exercises they
   finished. Each result becomes a 0–100 score that is fair for its type:
   - Dictation (and Test, Word Order, Spelling, Make a Word, Pronunciation…):
     the result's own score.
   - Flashcard: speed, compared only with the other students on the same
     flashcard set (a hard set takes everyone longer).
   - Bidirectional Language / English Content: notes written and time spent,
     compared only with the others on the same exercise (more is better).
   - Sentences: the teacher's 1–5 star rating (not counted until rated).
   - IELTS tests are separate and never count.
   A student's rating is the average of their scores, pulled a little toward
   the middle when they have only a few results, so one lucky exercise
   doesn't outrank steady good work. */
function getAllScoredResultsCombined() {
  const combined = getStoredResults().concat(window.__liveResults || [], window.__allResults || []);
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

// Among the results for one exercise: best = 100, worst = 50, alone = 75.
function relativeScores(list, valueOf, higherIsBetter) {
  const vals = list.map(valueOf);
  const n = list.length;
  return vals.map(v => {
    if (n < 2) return 75;
    const better = vals.filter(x => higherIsBetter ? x > v : x < v).length;
    const same = vals.filter(x => x === v).length - 1;
    return 100 - 50 * (better + same / 2) / (n - 1);
  });
}
function notesWordCount(r) {
  if (typeof r.notesWordCount === 'number') return r.notesWordCount;
  return String(r.notes || '').trim().split(/\s+/).filter(Boolean).length;
}

// Every result that counts, as { r, score 0–100 }.
function performanceScores(results) {
  const out = [];
  const byCode = {};
  results.forEach(r => {
    const type = String(r.type || '');
    if (/^IELTS/i.test(type)) return;
    if (type === 'Flashcard' || type === 'BilingualReader' || type === 'EnglishContent') {
      (byCode[type + '|' + r.code] = byCode[type + '|' + r.code] || []).push(r);
    } else if (type === 'Sentences') {
      const stars = sentenceRatingFor(r);
      if (stars) out.push({ r: r, score: stars * 20 });
    } else if (typeof r.score === 'number') {
      out.push({ r: r, score: Math.max(0, Math.min(100, r.score)) });
    }
  });
  Object.keys(byCode).forEach(k => {
    const list = byCode[k];
    if (k.indexOf('Flashcard|') === 0) {
      const withTime = list.filter(r => typeof r.timeSeconds === 'number' && r.timeSeconds > 0);
      relativeScores(withTime, r => r.timeSeconds, false).forEach((sc, i) => out.push({ r: withTime[i], score: sc }));
    } else {
      const notes = relativeScores(list, notesWordCount, true);
      const time = relativeScores(list, r => r.timeSeconds || 0, true);
      list.forEach((r, i) => out.push({ r: r, score: (notes[i] + time[i]) / 2 }));
    }
  });
  return out;
}

function getTopActiveStudents(limit) {
  const byId = {};
  const rosterIdx = taRosterIndex();
  // compare everyone who did an exercise, but only rank students from the Students list
  performanceScores(getAllScoredResultsCombined()).forEach(({ r, score }) => {
    const st = rosterStudentForResult(r, rosterIdx);
    if (!st) return;
    const key = String(st.id).trim().toLowerCase();
    if (!byId[key]) byId[key] = { name: st.name, total: 0, count: 0 };
    byId[key].total += score;
    byId[key].count += 1;
  });
  const PRIOR = 60, WEIGHT = 2; // a few results count a little less than many
  const arr = Object.keys(byId).map(k => {
    const s = byId[k];
    return { name: s.name, avg: (s.total + PRIOR * WEIGHT) / (s.count + WEIGHT), plain: s.total / s.count, count: s.count };
  });
  arr.sort((a, b) => (b.avg - a.avg) || (b.count - a.count));
  return arr.slice(0, limit);
}
const RANK_ICONS = ['images/icons/rank/rank-1.png', 'images/icons/rank/rank-2.png', 'images/icons/rank/rank-3.png'];
function renderTopActiveStudents() {
  const wrap = document.getElementById('mainTopStudentsList');
  if (!wrap) return;
  const top = getTopActiveStudents(5);
  if (!top.length) { wrap.innerHTML = '<div class="empty-results">No results from your students yet. Only students who enter with their ID appear here; Sentences count once you rate them in Results.</div>'; return; }
  wrap.innerHTML = top.map((s, i) => {
    const initials = initialsForName(s.name);
    const avatarColor = avatarColorForName(s.name);
    const rankIcon = RANK_ICONS[i]
      ? '<img class="top-student-rank-img" src="' + RANK_ICONS[i] + '" alt="#' + (i + 1) + '">'
      : '#' + (i + 1);
    const pct = Math.round(s.avg);
    const scoreColor = pct >= 80 ? 'var(--success)' : (pct >= 50 ? 'var(--warning)' : 'var(--danger)');
    return '<div class="top-student-row">' +
      '<span class="top-student-rank">' + rankIcon + '</span>' +
      '<span class="res-avatar" style="background:' + avatarColor + ';">' + escapeForHtml(initials) + '</span>' +
      '<div class="top-student-name"><span translate="no">' + escapeForHtml(s.name) + '</span><span class="top-student-count">' + s.count + ' result' + (s.count === 1 ? '' : 's') + '</span></div>' +
      '<div class="top-student-score" style="color:' + scoreColor + ';" title="Average of how well they did in each exercise">' + pct + '%</div>' +
    '</div>';
  }).join('');
}
window.renderTopActiveStudents = renderTopActiveStudents;

/* ================= DASHBOARD: stat tiles ================= */
function renderDashboardStats() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('dashStatStudents', String(getPointsRoster().length));
  // Every lesson taught so far, since each weekly lesson was added to the schedule.
  set('dashStatLessons', String(getLessonsTaughtTotal()));
  set('dashStatExercises', String(getRecentExercises().length));
  // Average score of results from students on the Students list (same rule as Top Active Students).
  const rosterIdx = taRosterIndex();
  const scores = performanceScores(getAllScoredResultsCombined())
    .filter(x => rosterStudentForResult(x.r, rosterIdx))
    .map(x => x.score);
  set('dashStatResults', scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) + '%' : '—');
}

// Same animation as the sidebar's Create entry.
function initQuickCreateAnim() {
  const el = document.getElementById('quickCreateAnim');
  if (!el || el.dataset.ready || typeof lottie === 'undefined') return;
  try {
    el.innerHTML = '';
    lottie.loadAnimation({ container: el, renderer: 'svg', loop: true, autoplay: true, animationData: REPORT_GEN_ANIM });
    el.dataset.ready = '1';
  } catch (e) { /* decorative — fail silently */ }
}

/* ================= PAGE START ================= */
taOnTab('main', function () {
  renderMainGreeting();
  renderDashboardStats();
  initQuickCreateAnim();
  renderNextLessons();
  renderTopActiveStudents();
  initRobotHiAnim();
});
taStartPage('main');
