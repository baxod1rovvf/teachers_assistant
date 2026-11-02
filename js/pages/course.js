/* ================= COURSE (2026-11-02) =================
   The course map (js/course-data.js) and each group's journey through it.
   - ta_course_progress  { groupId: { lessonId: ISO date taught } }   (synced, in the backup)
   - ta_course_edits     { lessonId: { slideIndex: { title, body } } } (the teacher's own slide text; synced, in the backup)
   - ta_course_tests     { "groupId|lessonId": exercise uid }          (the revision test made for that group; synced, in the backup)
   - ta_course_group     the group picked on this device (not synced)
   A lesson: warm-up games, slides (present / change the text), a printable handout,
   a 20-question revision test (a Test exercise in My Exercises; its link is copied from here). */
const LS_COURSE_PROGRESS = 'ta_course_progress';
const LS_COURSE_EDITS = 'ta_course_edits';
const LS_COURSE_TESTS = 'ta_course_tests';
const LS_COURSE_GROUP = 'ta_course_group';

function courseRead(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v && typeof v === 'object' ? v : fallback; } catch (e) { return fallback; }
}
function courseWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { showToast('⚠️ Couldn\'t save — the browser\'s storage is full.'); }
}
function courseGroupId() {
  let id = '';
  try { id = localStorage.getItem(LS_COURSE_GROUP) || ''; } catch (e) { /* ignore */ }
  const groups = getStudentGroups();
  return groups.some(g => g.id === id) ? id : (groups[0] ? groups[0].id : '');
}
function courseGroup() { return getStudentGroups().find(g => g.id === courseGroupId()) || null; }

/* Every stop of a course in order: 5 lessons, review, exam — per block */
function courseStops(course) {
  const out = [];
  course.blocks.forEach((b, bi) => {
    b.lessons.forEach((l, li) => out.push({ kind: 'lesson', block: b, blockNo: bi + 1, no: li + 1, lesson: l, id: l.id }));
    out.push({ kind: 'review', block: b, blockNo: bi + 1, id: b.id + 'review', lesson: { title: 'Review lesson', emoji: '🔁' } });
    out.push({ kind: 'exam', block: b, blockNo: bi + 1, id: b.id + 'exam', lesson: { title: 'Block exam', emoji: '🏁' } });
  });
  return out;
}
function courseFindStop(id) {
  for (const c of TA_COURSES) { const s = courseStops(c).find(x => x.id === id); if (s) return Object.assign({ course: c }, s); }
  return null;
}
function courseTaught(groupId) { return (courseRead(LS_COURSE_PROGRESS, {})[groupId]) || {}; }

let courseOpenStop = null;   // the lesson open on the page (null = the map)

function renderCourse() {
  const wrap = document.getElementById('courseWrap');
  if (!wrap) return;
  if (courseOpenStop) { renderCourseLesson(wrap, courseFindStop(courseOpenStop)); return; }
  const groups = getStudentGroups();
  const gid = courseGroupId();
  const taught = gid ? courseTaught(gid) : {};
  let html = '<div class="course-groups"><span class="course-groups-label">👥 Whose journey?</span>' +
    (groups.length
      ? groups.map(g => '<button type="button" class="myex-type-chip' + (g.id === gid ? ' active' : '') + '" onclick="coursePickGroup(' + jsAttr(g.id) + ')" translate="no">' + escapeForHtml(g.name) + '</button>').join('')
      : '<span class="course-hint">Add a group on the Students page to follow its journey.</span>') + '</div>';
  TA_COURSES.forEach(course => {
    const stops = courseStops(course);
    const done = stops.filter(s => taught[s.id]).length;
    const next = stops.find(s => !taught[s.id]);
    html += '<div class="course-head"><span class="course-emoji">' + course.emoji + '</span><div><h3>' + escapeForHtml(course.title) + '</h3>' +
      '<div class="course-sub">' + course.blocks.length + ' blocks · ' + stops.length + ' meetings' +
      (gid ? ' · <b>' + done + ' of ' + stops.length + ' done</b>' + (next ? ' · next: ' + escapeForHtml(next.kind === 'lesson' ? 'Block ' + next.blockNo + ', Lesson ' + next.no : 'Block ' + next.blockNo + ' ' + next.lesson.title.toLowerCase()) : ' · 🎉 finished!') : '') +
      '</div></div></div>';
    if (gid) html += '<div class="course-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + stops.length + '" aria-valuenow="' + done + '"><span style="width:' + Math.round(done / stops.length * 100) + '%"></span></div>';
    html += '<div class="course-blocks">';
    course.blocks.forEach((b, bi) => {
      const skills = Object.keys(COURSE_SKILLS).filter(k => b.lessons.some(l => (l.skills || []).indexOf(k) !== -1));
      html += '<section class="course-block" style="--bc:' + b.color + '">' +
        '<div class="course-block-head"><span class="course-block-emoji">' + b.emoji + '</span><div><div class="course-block-no">Block ' + (bi + 1) + '</div>' +
        '<h4>' + escapeForHtml(b.title) + '</h4></div>' +
        '<div class="course-skills">' + skills.map(k => '<span title="' + COURSE_SKILLS[k].label + '">' + COURSE_SKILLS[k].emoji + '</span>').join('') + '</div></div>' +
        '<ol class="course-path">' +
        stops.filter(s => s.block === b).map(s => {
          const ready = s.kind === 'lesson' && s.lesson.slides;
          const cls = ['course-stop', 'k-' + s.kind, ready ? 'ready' : 'soon', taught[s.id] ? 'done' : '', next === s && gid ? 'next' : ''].filter(Boolean).join(' ');
          const badge = s.kind === 'lesson' ? String(s.no) : s.lesson.emoji;
          return '<li><button type="button" class="' + cls + '" data-stop="' + s.id + '" onclick="courseOpen(' + jsAttr(s.id) + ')" title="' + escapeForHtml(s.lesson.title) + '">' +
            '<span class="course-dot">' + (taught[s.id] ? '✓' : badge) + '</span>' +
            '<span class="course-stop-title">' + (s.kind === 'lesson' ? s.lesson.emoji + ' ' : '') + escapeForHtml(s.lesson.title) + '</span>' +
            (ready ? '<span class="course-ready-tag">Ready</span>' : '') + '</button></li>';
        }).join('') + '</ol></section>';
    });
    html += '</div>';
  });
  wrap.innerHTML = html;
}

function coursePickGroup(id) {
  try { localStorage.setItem(LS_COURSE_GROUP, id); } catch (e) { /* ignore */ }
  renderCourse();
}
function courseOpen(id) {
  courseOpenStop = id;
  renderCourse();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function courseBackToMap() {
  courseOpenStop = null;
  renderCourse();
}

/* ---------- one lesson ---------- */
function renderCourseLesson(wrap, stop) {
  if (!stop) { courseOpenStop = null; renderCourse(); return; }
  const l = stop.lesson, g = courseGroup();
  const taughtAt = g ? courseTaught(g.id)[stop.id] : null;
  const where = 'Block ' + stop.blockNo + ' · ' + (stop.kind === 'lesson' ? 'Lesson ' + stop.no : l.title);
  let html = '<button type="button" class="back-to-picker-btn" onclick="courseBackToMap()">← Back to the course map</button>' +
    '<div class="course-lesson-head" style="--bc:' + stop.block.color + '"><span class="course-lesson-emoji">' + l.emoji + '</span><div>' +
    '<div class="course-block-no">' + escapeForHtml(where) + ' · ' + escapeForHtml(stop.block.title) + '</div>' +
    '<h3>' + escapeForHtml(l.title) + '</h3>' +
    (l.skills ? '<div class="course-skill-chips">' + l.skills.map(k => '<span>' + COURSE_SKILLS[k].emoji + ' ' + COURSE_SKILLS[k].label + '</span>').join('') + '</div>' : '') +
    '</div>' +
    (g ? '<button type="button" class="mini-btn course-taught-btn' + (taughtAt ? ' solid' : '') + '" onclick="courseToggleTaught(' + jsAttr(stop.id) + ')">' +
      (taughtAt ? '✅ Taught with ' + escapeForHtml(g.name) + ' · ' + new Date(taughtAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '☑️ Mark as taught with ' + escapeForHtml(g.name)) + '</button>' : '') +
    '</div>';
  if (!(stop.kind === 'lesson' && l.slides)) {
    const what = stop.kind === 'review' ? 'A review of the block\'s five lessons — games and practice for all four skills before the exam.'
      : stop.kind === 'exam' ? 'The block exam: listening, reading, writing and speaking, on the block\'s five lessons.'
      : 'Warm-up games, slides, a handout and a 20-question revision test.';
    wrap.innerHTML = html + '<div class="card course-soon"><div class="course-soon-emoji">🛠️</div><p><b>Coming soon.</b> ' + what + '</p></div>';
    return;
  }
  if (l.goals) html += '<div class="card course-goals"><b>🎯 By the end of the lesson students can:</b><ul>' + l.goals.map(x => '<li>' + escapeForHtml(x) + '</li>').join('') + '</ul></div>';
  html += '<div class="course-materials">';
  // warm-up games
  html += '<div class="card course-mat" style="--mc:var(--c-orange)"><div class="course-mat-head"><span class="course-mat-emoji">🎲</span><h4>Warm-up &amp; pair work</h4></div>' +
    (l.warmups || []).map(w => '<div class="course-game"><b>' + w.emoji + ' ' + escapeForHtml(w.title) + '</b> <span class="course-time">' + escapeForHtml(w.time || '') + '</span><p>' + escapeForHtml(w.how) + '</p></div>').join('') + '</div>';
  // slides
  const edited = Object.keys((courseRead(LS_COURSE_EDITS, {})[stop.id]) || {}).length;
  html += '<div class="card course-mat" style="--mc:var(--c-blue)"><div class="course-mat-head"><span class="course-mat-emoji">🖥️</span><h4>Slides</h4></div>' +
    '<p>' + l.slides.length + ' slides' + (edited ? ' · ✏️ ' + edited + ' changed by you' : '') + '. Show them on the board; you can change any slide\'s text.</p>' +
    '<div class="course-actions"><button type="button" class="create-btn course-present" onclick="courseShowSlides(' + jsAttr(stop.id) + ', 0, false)">Present</button>' +
    '<button type="button" class="mini-btn" onclick="courseShowSlides(' + jsAttr(stop.id) + ', 0, true)">✏️ Change the text</button></div></div>';
  // handout
  html += '<div class="card course-mat" style="--mc:var(--c-green)"><div class="course-mat-head"><span class="course-mat-emoji">📄</span><h4>Exercises handout</h4></div>' +
    '<p>' + l.handout.sections.map(s => COURSE_SKILLS[s.skill].emoji).filter((e, i, a) => a.indexOf(e) === i).join(' ') + ' ' + l.handout.sections.length + ' exercises to print, with your listening script and the answers on a separate page.</p>' +
    '<div class="course-actions"><button type="button" class="mini-btn solid" onclick="coursePrintHandout(' + jsAttr(stop.id) + ')">🖨️ Open &amp; print</button></div></div>';
  // revision test
  const testUid = g ? courseRead(LS_COURSE_TESTS, {})[g.id + '|' + stop.id] : '';
  const testItem = testUid ? getRecentExercises().find(e => e.uid === testUid) : null;
  html += '<div class="card course-mat" style="--mc:var(--c-pink)"><div class="course-mat-head"><span class="course-mat-emoji">📝</span><h4>Revision test</h4></div>' +
    '<p>' + l.test.length + ' questions. Students open the link, enter their ID and do it — their results come to Results like any exercise.</p>' +
    (g ? '<div class="course-actions"><button type="button" class="mini-btn solid" onclick="courseCopyTestLink(' + jsAttr(stop.id) + ')">🔗 Copy the link for ' + escapeForHtml(g.name) + '</button>' +
      (testItem ? '<button type="button" class="mini-btn" onclick="taNavigate(\'results.html?exercise=' + encodeURIComponent(testItem.uid) + '\')">📊 View Results</button>' : '') + '</div>'
      : '<p class="course-hint">Add a group on the Students page first — each group gets its own test link.</p>') + '</div>';
  html += '</div>';
  wrap.innerHTML = html;
}

function courseToggleTaught(stopId) {
  const g = courseGroup();
  if (!g) return;
  const all = courseRead(LS_COURSE_PROGRESS, {});
  const mine = all[g.id] || (all[g.id] = {});
  if (mine[stopId]) delete mine[stopId]; else mine[stopId] = new Date().toISOString();
  courseWrite(LS_COURSE_PROGRESS, all);
  if (mine[stopId] && typeof taConfettiBurst === 'function') try { taConfettiBurst(window.innerWidth / 2, window.innerHeight / 3, 40); } catch (e) { /* ignore */ }
  renderCourse();
}

/* ---------- slides: present, and change the text ---------- */
function courseSlide(stopId, i) {
  const stop = courseFindStop(stopId), base = stop.lesson.slides[i];
  const edit = ((courseRead(LS_COURSE_EDITS, {})[stopId]) || {})[i];
  return { emoji: base.emoji, title: edit && typeof edit.title === 'string' ? edit.title : base.title, body: edit && typeof edit.body === 'string' ? edit.body : base.body, changed: !!edit };
}
let courseSlideState = null;
function courseShowSlides(stopId, i, editing) {
  const stop = courseFindStop(stopId);
  if (!stop || !stop.lesson.slides) return;
  let el = document.getElementById('courseSlides');
  if (!el) {
    el = document.createElement('div');
    el.id = 'courseSlides';
    el.className = 'course-slides';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Slides');
    document.body.appendChild(el);
    document.addEventListener('keydown', courseSlideKey);
  }
  courseSlideState = { stopId: stopId, i: Math.max(0, Math.min(i, stop.lesson.slides.length - 1)), editing: !!editing };
  drawCourseSlide();
}
function drawCourseSlide() {
  const el = document.getElementById('courseSlides');
  if (!el || !courseSlideState) return;
  const st = courseSlideState, stop = courseFindStop(st.stopId), n = stop.lesson.slides.length, s = courseSlide(st.stopId, st.i);
  const ed = st.editing ? ' contenteditable="plaintext-only" spellcheck="false"' : '';
  el.classList.toggle('editing', st.editing);
  el.innerHTML =
    '<div class="course-slide-bar"><span class="course-slide-count">' + (st.i + 1) + ' / ' + n + '</span>' +
      (st.editing ? '<span class="course-edit-note">✏️ Click the text to change it — it saves by itself.</span>' : '') +
      '<span class="course-slide-tools">' +
        (st.editing && s.changed ? '<button type="button" class="mini-btn" onclick="courseResetSlide()">↩️ Original text</button>' : '') +
        '<button type="button" class="mini-btn" onclick="courseToggleEdit()">' + (st.editing ? '✅ Done changing' : '✏️ Change the text') + '</button>' +
        '<button type="button" class="mini-btn" onclick="courseFullScreen()" title="Full screen">⛶</button>' +
        '<button type="button" class="mini-btn" onclick="courseCloseSlides()" title="Close" aria-label="Close">✕</button>' +
      '</span></div>' +
    '<div class="course-slide" style="--bc:' + stop.block.color + '">' +
      '<div class="course-slide-emoji">' + s.emoji + '</div>' +
      '<h2 class="course-slide-title" data-f="title"' + ed + '>' + escapeForHtml(s.title) + '</h2>' +
      '<div class="course-slide-body" data-f="body"' + ed + '>' + escapeForHtml(s.body) + '</div>' +
    '</div>' +
    '<div class="course-slide-nav">' +
      '<button type="button" class="mini-btn" onclick="courseSlideGo(-1)"' + (st.i === 0 ? ' disabled' : '') + '>← Back</button>' +
      '<div class="course-slide-dots">' + stop.lesson.slides.map((x, k) => '<button type="button" class="' + (k === st.i ? 'on' : '') + '" onclick="courseSlideTo(' + k + ')" aria-label="Slide ' + (k + 1) + '"></button>').join('') + '</div>' +
      '<button type="button" class="mini-btn solid" onclick="courseSlideGo(1)"' + (st.i === n - 1 ? ' disabled' : '') + '>Next →</button>' +
    '</div>';
  if (st.editing) el.querySelectorAll('[data-f]').forEach(f => f.addEventListener('input', () => courseSaveSlideField(f.dataset.f, f.innerText)));
}
function courseSaveSlideField(field, value) {
  const st = courseSlideState;
  const all = courseRead(LS_COURSE_EDITS, {});
  const lesson = all[st.stopId] || (all[st.stopId] = {});
  const cur = courseSlide(st.stopId, st.i);
  lesson[st.i] = { title: field === 'title' ? value : cur.title, body: field === 'body' ? value.replace(/\n$/, '') : cur.body };
  courseWrite(LS_COURSE_EDITS, all);
}
function courseResetSlide() {
  const st = courseSlideState;
  const all = courseRead(LS_COURSE_EDITS, {});
  if (all[st.stopId]) { delete all[st.stopId][st.i]; if (!Object.keys(all[st.stopId]).length) delete all[st.stopId]; }
  courseWrite(LS_COURSE_EDITS, all);
  drawCourseSlide();
}
function courseToggleEdit() { courseSlideState.editing = !courseSlideState.editing; drawCourseSlide(); }
function courseSlideGo(d) { courseSlideTo(courseSlideState.i + d); }
function courseSlideTo(i) {
  const n = courseFindStop(courseSlideState.stopId).lesson.slides.length;
  courseSlideState.i = Math.max(0, Math.min(n - 1, i));
  drawCourseSlide();
}
function courseFullScreen() {
  const el = document.getElementById('courseSlides');
  if (!el) return;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
}
function courseCloseSlides() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  const el = document.getElementById('courseSlides');
  if (el) el.remove();
  document.removeEventListener('keydown', courseSlideKey);
  courseSlideState = null;
  renderCourse();   // "N changed by you"
}
function courseSlideKey(e) {
  if (!courseSlideState) return;
  if (courseSlideState.editing && e.target && e.target.isContentEditable) { if (e.key === 'Escape') e.target.blur(); return; }
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); courseSlideGo(1); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); courseSlideGo(-1); }
  else if (e.key === 'Escape' && !document.fullscreenElement) courseCloseSlides();
}

/* ---------- the handout: a printable page ---------- */
function courseHandoutHtml(stop) {
  const h = stop.lesson.handout, esc = escapeForHtml;
  const lines = t => esc(t).replace(/\n/g, '<br>');
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>' + esc(h.title) + ' — handout</title>' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@600;700&display=swap">' +
    '<style>body{font-family:Nunito,system-ui,sans-serif;color:#2B2140;max-width:760px;margin:24px auto;padding:0 20px;line-height:1.55}' +
    'h1,h2{font-family:Fredoka,Nunito,sans-serif;margin:0}h1{font-size:1.7rem}header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #2B2140;padding-bottom:10px;margin-bottom:18px}' +
    '.who{font-size:.95rem}.ex{border:2.5px solid #2B2140;border-radius:16px;padding:12px 16px;margin:0 0 14px;break-inside:avoid}h2{font-size:1.05rem;margin-bottom:6px}' +
    '.skill{display:inline-block;font-size:.75rem;font-weight:700;border:2px solid #2B2140;border-radius:999px;padding:1px 10px;margin-bottom:6px;background:#FFF0D4}' +
    '.box{background:#FFF7E8;border-radius:10px;padding:8px 12px;margin:6px 0;font-weight:700}.items{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px 18px}' +
    '.teacher{break-before:page;border-top:3px dashed #2B2140;margin-top:28px;padding-top:14px}.noprint{text-align:center;margin:20px}' +
    '.noprint button{font:700 1rem Nunito,sans-serif;padding:10px 22px;border:2.5px solid #2B2140;border-radius:14px;background:#FFD23F;box-shadow:0 4px 0 #2B2140;cursor:pointer}' +
    '@media print{.noprint{display:none}body{margin:0 auto}}</style></head><body>' +
    '<div class="noprint"><button onclick="print()">🖨️ Print</button></div>' +
    '<header><div><div class="who">' + esc(stop.course.title) + ' · Block ' + stop.blockNo + ' · Lesson ' + stop.no + '</div><h1>' + stop.lesson.emoji + ' ' + esc(h.title) + '</h1></div>' +
    '<div class="who">Name: ____________________<br>Date: ____________________</div></header>' +
    h.sections.map((s, i) => '<section class="ex"><span class="skill">' + COURSE_SKILLS[s.skill].emoji + ' ' + COURSE_SKILLS[s.skill].label + '</span>' +
      '<h2>' + (i + 1) + '. ' + esc(s.title) + '</h2>' + (s.text ? '<div class="box">' + lines(s.text) + '</div>' : '') +
      (s.items ? '<div class="items">' + s.items.map(x => '<div>' + esc(x) + '</div>').join('') + '</div>' : '') + '</section>').join('') +
    '<section class="teacher"><h2>👩‍🏫 For the teacher</h2><p><b>Listening script</b></p>' + h.teacherScript.map(x => '<p>' + esc(x) + '</p>').join('') +
    '<p><b>Answers</b></p>' + h.answers.map(x => '<p>' + esc(x) + '</p>').join('') + '</section></body></html>';
}
function coursePrintHandout(stopId) {
  const stop = courseFindStop(stopId);
  if (!stop || !stop.lesson.handout) return;
  const w = window.open('', '_blank');
  if (!w) { showToast('⚠️ The browser blocked the new tab. Allow pop-ups for this site and press again.'); return; }
  w.document.open();
  w.document.write(courseHandoutHtml(stop));
  w.document.close();
}

/* ---------- the revision test: a Test exercise per group, shared by link ---------- */
function courseBuildTest(stop, group) {
  const items = stop.lesson.test.map(t => {
    const options = t.wrong.concat([t.a]);
    for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const x = options[i]; options[i] = options[j]; options[j] = x; }
    return { prompt: t.q, full: t.q.replace('_____', t.a), word: t.a, options: options, answer: options.indexOf(t.a) };
  });
  for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const x = items[i]; items[i] = items[j]; items[j] = x; }
  const title = 'Revision test — ' + stop.lesson.title + ' (' + group.name + ')';
  const code = generateClassCode();
  const classCode = setActiveClassCode(code);
  const uid = generateExerciseUid();
  const fill = {
    EXERCISE_TITLE: escapeForTemplateText(title), TYPE_LABEL: 'Test', QUIZ_MODE: 'gap', ITEM_COUNT: String(items.length),
    ITEMS_JSON: JSON.stringify(items), HAS_MATCHING_ROUND: 'false', TIME_LIMIT_MINUTES: '0', SPEECH_LANG: 'en-US', DEFAULT_VOICE: 'female',
    EXERCISE_CODE: classCode, FILE_BUILT_AT: new Date().toISOString(), ACCESS_MODE: 'nocode', ACCESS_ID_MODE: 'unified', REQUIRED_CODE: '',
    POINTS_AWARD: '0', EXERCISE_UID: uid, BOARD_CODE: getPointsBoardCode(), ROSTER_JSON: JSON.stringify(getPointsRoster()), POINTS_TYPE_LABEL: 'Test'
  };
  let html = QUIZ_TEMPLATE;
  Object.keys(fill).forEach(k => { html = html.split('__' + k + '__').join(fill[k]); });
  pushRecentExercise({ title: title, typeLabel: 'Test', code: classCode, uid: uid, html: html, groupId: group.id, contentSummary: items.map(it => it.full).join('\n') });
  const tests = courseRead(LS_COURSE_TESTS, {});
  tests[group.id + '|' + stop.id] = uid;
  courseWrite(LS_COURSE_TESTS, tests);
  return getRecentExercises().find(e => e.uid === uid);
}
async function courseCopyTestLink(stopId, fresh) {
  const stop = courseFindStop(stopId), g = courseGroup();
  if (!stop || !g) return;
  const uid = courseRead(LS_COURSE_TESTS, {})[g.id + '|' + stopId];
  let item = !fresh && uid ? getRecentExercises().find(e => e.uid === uid) : null;
  if (item && taLinkExpired(item)) {
    const m = taModal('⌛ This test\'s link has expired',
      '<p class="ta-modal-text">Links work for ' + TA_PLAY_DAYS + ' days. Make a new copy of the test for ' + escapeForHtml(g.name) + ' with a new link? The old results stay in Results.</p>' +
      '<div class="ta-modal-btns"><button type="button" class="mini-btn solid" data-act="new">📝 Make a new copy</button><button type="button" class="mini-btn" data-act="no">Keep it</button></div>');
    m.body.querySelector('[data-act="new"]').onclick = () => { m.close(); courseCopyTestLink(stopId, true); };
    m.body.querySelector('[data-act="no"]').onclick = () => m.close();
    return;
  }
  if (!item) item = courseBuildTest(stop, g);
  if (!item) return;
  if (!item.linkAt) {
    showToast('⏳ Putting the test online…', 'ok');
    const html = getCachedExerciseHtml(item.uid);
    if (!html || !(await taPublishPlayable(item.uid, html))) { showToast('Couldn\'t put the test online — check the internet and try again. It\'s saved in My Exercises.'); renderCourse(); return; }
    const list = getRecentExercises();
    const saved = list.find(e => e.uid === item.uid);
    if (saved) { saved.linkAt = saved.playAt; saveRecentExercises(list); }
  }
  const url = taPlayUrl(item.uid);
  const fresh2 = getRecentExercises().find(e => e.uid === item.uid) || item;
  const until = taLinkUntil(fresh2);
  const msg = '🔗 Link copied — send it to ' + g.name + (until ? '. It works until ' + until.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '') + '.';
  if (window.taCopyText) window.taCopyText(url, msg);
  else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => showToast(msg, 'ok'), () => taModal('🔗 The test link', '<input type="text" class="ta-input" readonly value="' + escapeForHtml(url) + '">'));
  renderCourse();
}

/* ================= PAGE START ================= */
window.addEventListener('storage', e => { if (e.key && /ta_course_|ta_student_groups/.test(e.key)) renderCourse(); });
taOnTab('course', renderCourse);
taStartPage('course');
