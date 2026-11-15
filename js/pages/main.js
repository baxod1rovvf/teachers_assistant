/* ================= MAIN DASHBOARD: greeting ================= */
function renderMainGreeting() {
  const nameEl = document.getElementById('mainGreetingName');
  const titleEl = document.getElementById('mainGreetingTitle');
  const name = getTeacherName();
  if (nameEl) nameEl.textContent = name;
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
  // "SATURDAY, NOVEMBER 7, 2026 • EVENING SESSION" over the greeting (2026-11-07)
  const eb = document.getElementById('heroEyebrow');
  if (eb) {
    const now = new Date();
    const part = hour < 12 ? 'Morning session' : hour < 18 ? 'Afternoon session' : 'Evening session';
    eb.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + ' • ' + part;
  }
  renderHeroNext();
}
// The next lesson in the greeting card: "Next class on schedule — 17:30 • Apex" (2026-11-07)
function renderHeroNext() {
  const el = document.getElementById('heroNext');
  if (!el || typeof getNextLessonOccurrences !== 'function') return;
  const o = getNextLessonOccurrences(1)[0];
  if (!o) { el.hidden = true; return; }
  const day = o.date.toDateString() === new Date().toDateString() ? '' : SCHEDULE_DAY_SHORT[o.date.getDay()] + ' ';
  el.innerHTML = '<span class="hero-next-ic" aria-hidden="true"><i class="lc lc-clock"></i></span><span><small>Next class on schedule</small>' +
    '<b>' + escapeForHtml(day + formatTimeDisplay(o.entry.time)) + ' • <span translate="no">' + escapeForHtml(o.entry.group || 'Lesson') + '</span></b></span>';
  el.hidden = false;
}
window.renderHeroNext = renderHeroNext;
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
   A student's rating is the average over the exercises given to their group
   (an exercise's group, chosen when it was made or in My Exercises): one
   score per exercise (their best try), and an exercise they haven't done
   counts as 0 — so doing one exercise well doesn't beat doing four.
   Exercises they did that weren't given to their group count too.
   A Homework/Class set counts each of its rounds. Exercises without results
   of their own (Jungle, Bamboozle) and IELTS don't count; a Sentences answer
   that isn't rated yet is left out until it is. */
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
  const ratings = getSentenceRatings();
  results.forEach(r => {
    const type = String(r.type || '');
    if (/^IELTS/i.test(type)) return;
    if (type === 'Flashcard' || type === 'BilingualReader' || type === 'EnglishContent') {
      (byCode[type + '|' + r.code] = byCode[type + '|' + r.code] || []).push(r);
    } else if (type === 'Sentences') {
      const stars = ratings[resultSignature(r)] || 0;
      if (stars) out.push({ r: r, score: stars * 20 });
    } else {
      const sc = taResultScore(r);
      if (typeof sc === 'number') out.push({ r: r, score: Math.max(0, Math.min(100, sc)) });
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

/* ================= DASHBOARD: stat tiles ================= */
function renderDashboardStats() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('dashStatStudents', String(getPointsRoster().length));
  // Every lesson taught so far, since each weekly lesson was added to the schedule.
  set('dashStatLessons', String(getLessonsTaughtTotal()));
  set('dashStatExercises', String(getRecentExercises().filter(e => !taIsSkillCourseItem(e)).length));
  // Average score of results from students on the Students list.
  const rosterIdx = taRosterIndex();
  const scores = performanceScores(getAllScoredResultsCombined())
    .filter(x => rosterStudentForResult(x.r, rosterIdx))
    .map(x => x.score);
  set('dashStatResults', scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) + '%' : '—');
}
window.renderDashboardStats = renderDashboardStats;

/* ================= PAGE START ================= */
taOnTab('main', function () {
  renderMainGreeting();
  renderDashboardStats();
  renderNextLessons();
  initRobotHiAnim();
});
taStartPage('main');
