/* ================= COURSE — the skills course (2026-11-04; a path since 2026-11-05; 20 steps since 2026-11-05) =================
   20 steps (Beginner b1…b10 = Steps 1–10, Elementary e1…e10 = Steps 11–20), each with up to four parts: Listening,
   Reading, Writing, Speaking (content: js/skills-data.js, TA_SKILLS.steps). Steps are known by their id (b1, e3…);
   the number shown is the step's place (`no`).
   The students' page is skill.html?s=<skill>&st=<id>&c=<code> (speaking: no code — nothing is sent).
   - ta_skills_links  { "<groupId>|<skill>|<stepId>": { code } }  (synced, in the backup) — made at the first "Copy link"
                      for that step + part + group; the code is kept so a sent link always works and its results are
                      loaded (firebase.js reads the codes from here). No My Exercises item since 2026-11-05 (entries made
                      before have a uid too; their "… course" items are hidden in My Exercises). Old keys ended in the
                      level number: taSkillsLinks() (common.js) reads them as e<N>, and the next save writes them anew.
                      Speaking: { sentAt } — when its link was first copied for the group (its dot on the path).
   - ta_skills_marks  the teacher's writing marks { "<code>|<studentId>": band } (common.js skWritingBandFor; synced, in the backup)
   - ta_course_group  the group last opened on this device (not synced) */
const LS_COURSE_GROUP = 'ta_course_group';
const SK_SKILLS = [
  { key: 'listening', label: 'Listening', emoji: '🎧', color: 'var(--c-blue)', about: 'A recording and questions to answer while you listen.', results: true },
  { key: 'reading', label: 'Reading', emoji: '📖', color: 'var(--c-green)', about: 'A text to read and questions about it.', results: true },
  { key: 'writing', label: 'Writing', emoji: '✍️', color: 'var(--c-orange)', about: 'A short text, checked for mistakes, with a band.', results: true },
  { key: 'speaking', label: 'Speaking', emoji: '🗣️', color: 'var(--c-pink)', about: 'Words, questions and a short talk. Nothing is recorded.', results: false }
];

function skSkill(key) { return SK_SKILLS.find(s => s.key === key) || null; }
function skSteps() { return (window.TA_SKILLS && TA_SKILLS.steps) || []; }
/* a step by its id ('e3'); an old level number (3) means e3 */
function skStep(id) { const want = taSkillStepId(id); return want ? skSteps().find(l => l.id === want) || null : null; }
function skWriteLinks(v) {
  if (!taSaveSkillsLinks(v)) showToast('⚠️ Couldn\'t save — the browser\'s storage is full.');
  // a new code: load its results (firebase.js reads the codes from ta_skills_links)
  if (window.startPlainCompletionsSync) { clearTimeout(window.__taResyncTimer); window.__taResyncTimer = setTimeout(window.startPlainCompletionsSync, 1500); }
}
function skGroupId() {
  if (typeof skView !== 'undefined' && skView.group) return skView.group;   // the group whose page is open
  let id = '';
  try { id = localStorage.getItem(LS_COURSE_GROUP) || ''; } catch (e) { /* ignore */ }
  const groups = getStudentGroups();
  return groups.some(g => g.id === id) ? id : (groups[0] ? groups[0].id : '');
}
function skGroup(g) {
  if (g && typeof g === 'object') return g;
  const id = g || skGroupId();
  return getStudentGroups().find(x => x.id === id) || null;
}
function skLinkKey(skill, step, group) { return taSkillLinkKey(group.id, skill, step); }
/* { code } kept for a step + part + group (an entry made before 2026-11-04's fix was just the My Exercises item's uid).
   links = taSkillsLinks() read once by the caller (a drawing reads them once — skPathCtx's ctx.links). */
function skLinkEntry(skill, step, g, links) {
  const v = (links || taSkillsLinks())[skLinkKey(skill, step, g)];
  if (!v) return null;
  if (typeof v === 'object') return v.code ? v : null;
  const code = skLegacyCode(v, links);
  return code ? { uid: v, code: code } : null;
}
/* a legacy uid entry's code — the My Exercises items are read once per links object (not once per dot) */
function skLegacyCode(uid, links) {
  if (!links) return taSkillsLegacyCode(uid);
  if (!links.__uidCodes) {
    const m = {};
    getRecentExercises().forEach(e => { if (e && e.uid && e.code) m[e.uid] = e.code; });
    Object.defineProperty(links, '__uidCodes', { value: m });
  }
  return links.__uidCodes[uid] || '';
}
/* The code of a step + part + group: made at the first call, the same one after that (a sent link must keep working).
   No My Exercises item (teacher, 2026-11-05). */
function skEnsureCode(skill, step, group) {
  const g = skGroup(group), st = skStep(step);
  if (!g || !st || !skSkill(skill) || skill === 'speaking') return '';
  const key = skLinkKey(skill, st.id, g), links = taSkillsLinks(), kept = skLinkEntry(skill, st.id, g, links);
  if (kept) {
    if (typeof links[key] !== 'object' || links[key].code !== kept.code) { links[key] = Object.assign({}, kept); skWriteLinks(links); }
    return kept.code;
  }
  const code = generateClassCode();
  links[key] = { code: code, sentAt: new Date().toISOString() };   // sentAt: the 🐢 rule counts a part as missed 2 days after
  skWriteLinks(links);
  return code;
}
/* The students' link. Listening/Reading/Writing carry the group's code. */
function skLinkFor(skill, step, group) {
  const st = skStep(step);
  if (!st) return '';
  if (skill === 'speaking') return taSkillLink(skill, st.id);
  const code = skEnsureCode(skill, st.id, group);
  return code ? taSkillLink(skill, st.id, code) : '';
}
window.skLinkFor = skLinkFor;
window.skEnsureCode = skEnsureCode;

/* ================= GROUPS → JOURNEY / PROGRESS (teacher, 2026-11-05) =================
   The page opens on one card per group (Students page): its level, a square per step (green done, red outline the
   step the group is on, grey skipped, empty not yet), ⭐ the students' average band, 🐢 how many are behind, and
   "▶ Teach STEP N". A group's page has two tabs:
   - Journey: the path Step 1 → Step 20 with a plain dot per part (no skill icons — a step's first part isn't always
     Listening). A dot is done for the group when (skDotState):
     · Listening / Reading / Writing: at least half of the group's students (Students list, matched by ID) have a result
       for that step + part (a group with no students: one result is enough);
     · Speaking (nothing is sent): the teacher has pressed 🔗 Copy link for it ({ sentAt } in ta_skills_links).
     A slot's results are those of its code and of any old code kept with it (alsoCodes — skCodesFor).
     A step is done when all its dots are. The step the group is on (first ready step not done, from its start) is
     singled out: bigger, a ring, "Teach this step".
   - Progress: a row per student — ⭐ average band, "N of M steps done", a square per step coloured by their band there.
     Behind (🐢, listed first): missed 2+ parts sent to the group at least 2 days ago (SK_MISSED_AFTER_DAYS; the link's
     sentAt — entries without one were sent long ago), or an average band below 5.
   Where a group starts: level Beginner (or none) → Step 1; any other level → Step 11; steps before that are skipped
   (grey, still open). A step opens the step page: its parts (Try, Copy link), then its results table. */
let skView = { group: '', tab: 'journey', step: '' };   // not remembered (only the group: ta_course_group)
const SK_MISSED_AFTER_DAYS = 2;   // a part sent to the group counts as missed only this many days after its link was first copied
function skReady(st) { return !!st && SK_SKILLS.some(s => st[s.key]); }
function skGroupRoster(g) { return g ? getPointsRoster().filter(s => s.group === g.id) : []; }
function skShortDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
/* The group's level: set on the Students page (✏️ on a group) — kept on the group itself (since 2026-11-05), and on its
   lessons (ta_weekly_schedule; groups saved before only have it there) */
function skGroupLevel(g) {
  if (!g) return '';
  if (g.level) return String(g.level);
  const name = String(g.name || '').trim().toLowerCase();
  const e = (typeof getWeeklySchedule === 'function' ? getWeeklySchedule() : []).find(x => x && x.level && String(x.group || '').trim().toLowerCase() === name);
  return e ? String(e.level) : '';
}
/* The first step of a group: the teacher's choice on the group page (courseStart, 2026-11-07), else Beginner (or no level) → 1,
   any other level → 11 */
function skStartNo(g) {
  const n = g && parseInt(g.courseStart, 10), max = (TA_SKILLS.steps || []).length || 20;
  if (n >= 1 && n <= max) return n;
  const lv = skGroupLevel(g).trim().toLowerCase(); return !lv || lv === 'beginner' ? 1 : 11;
}
function skSetStart(id, no) {
  const list = getStudentGroups(), g = list.find(x => x.id === id);
  if (!g) return;
  g.courseStart = parseInt(no, 10) || 1;
  saveStudentGroups(list);
  renderCourse();
}
function skStartPickHtml(g) {
  const cur = skStartNo(g);
  return '<label class="sk-start-pick">Starts at <select onchange="skSetStart(' + jsAttr(g.id) + ', this.value)">' +
    (TA_SKILLS.steps || []).map(x => '<option value="' + x.no + '"' + (x.no === cur ? ' selected' : '') + '>Step ' + x.no + '</option>').join('') +
    '</select></label>';
}
/* { done, text } of one dot. ctx = { map, idx, roster } — one reading of the kept results per drawing. */
function skDotState(skill, step, g, ctx) {
  if (!g) return { done: false, text: 'Add a group first' };
  if (skill === 'speaking') {
    const v = (ctx.links || taSkillsLinks())[skLinkKey('speaking', step, g)];
    const at = v && typeof v === 'object' && v.sentAt;
    return at ? { done: true, text: 'Link sent ' + skShortDate(at) } : { done: false, text: 'Link not sent yet' };
  }
  const seen = new Set();
  let any = 0;
  skSlotResults(ctx.map, skCodesFor(skill, step, g, ctx.links)).forEach(r => {
    any++;
    const st = rosterStudentForResult(r, ctx.idx);
    if (st && st.group === g.id) seen.add(String(st.id).trim().toLowerCase());
  });
  const total = ctx.roster.length;
  if (!total) return { done: any > 0, text: any ? any + (any === 1 ? ' result' : ' results') : 'No results yet' };
  return { done: seen.size * 2 >= total, text: seen.size + ' of ' + total + ' students done' };
}
function skGroupCodes(g, steps, links) { return g ? [].concat(...steps.map(st => [].concat(...SK_TABLE_SKILLS.map(k => skCodesFor(k, st.id, g, links))))) : []; }
/* one drawing's reading: { map, idx, roster, links } — the kept links are read once here and passed down */
function skPathCtx(g, steps, map, idx, links) {
  links = links || taSkillsLinks();
  return { map: map || skResultsMap(skGroupCodes(g, steps, links)), idx: idx || taRosterIndex(), roster: skGroupRoster(g), links: links };
}
/* Everything the card, the Journey and Progress show for one group (from one results map). */
function skGroupStats(g, ctx) {
  const start = skStartNo(g), links = ctx.links || taSkillsLinks();
  const steps = skSteps().map(st => {
    const ready = skReady(st), parts = SK_SKILLS.filter(s => st[s.key]);
    const dots = ready ? parts.map(s => Object.assign({ skill: s }, skDotState(s.key, st.id, g, ctx))) : [];
    return { st: st, ready: ready, skipped: st.no < start, dots: dots, done: ready && dots.every(d => d.done),
      graded: SK_TABLE_SKILLS.filter(k => st[k]) };
  });
  const onStep = steps.find(x => x.st.no >= start && x.ready && !x.done) || null;
  // each roster student's best band per step + part (a result without a band still counts as done)
  const students = ctx.roster.map(s => ({ name: s.name, id: s.id, key: String(s.id).trim().toLowerCase(), steps: {} }));
  const byKey = {};
  students.forEach(s => { byKey[s.key] = s; });
  steps.forEach(x => {
    if (!x.ready) return;
    x.graded.forEach(k => {
      skSlotResults(ctx.map, skCodesFor(k, x.st.id, g, links)).forEach(r => {
        const rs = rosterStudentForResult(r, ctx.idx);
        const s = rs && rs.group === g.id && byKey[String(rs.id).trim().toLowerCase()];
        if (!s) return;
        const cell = s.steps[x.st.id] || (s.steps[x.st.id] = {});
        const band = skResultBand(k, r), cur = cell[k];
        if (cur === undefined || (typeof band === 'number' && (cur === null || band > cur))) cell[k] = typeof band === 'number' ? band : null;
      });
    });
  });
  const counted = steps.filter(x => x.ready && !x.skipped && x.graded.length);
  // the graded parts whose link was copied for this group at least SK_MISSED_AFTER_DAYS ago (right after a lesson
  // nobody is behind yet); an entry without sentAt was made before 2026-11-05 — sent long ago
  const sent = [], due = Date.now() - SK_MISSED_AFTER_DAYS * 864e5;
  steps.forEach(x => {
    if (!x.ready) return;
    x.graded.forEach(k => {
      const v = links[skLinkKey(k, x.st.id, g)];
      if (!v) return;
      const at = v && typeof v === 'object' && v.sentAt ? Date.parse(v.sentAt) : NaN;
      if (isNaN(at) || at <= due) sent.push([x.st.id, k]);
    });
  });
  students.forEach(s => {
    s.bands = {};
    Object.keys(s.steps).forEach(id => { s.bands[id] = skOverall(SK_TABLE_SKILLS.map(k => s.steps[id][k])); });
    const have = Object.keys(s.bands).map(id => s.bands[id]).filter(b => typeof b === 'number');
    s.avg = skOverall(have);
    s.did = counted.filter(x => s.steps[x.st.id] && x.graded.every(k => k in s.steps[x.st.id])).length;
    s.missed = sent.filter(([id, k]) => !(s.steps[id] && k in s.steps[id])).length;
    const why = [];
    if (s.missed >= 2) why.push('Missed ' + s.missed + ' parts');
    if (s.avg !== null && s.avg < 5) why.push('Average ' + s.avg);
    s.behind = why.length > 0;
    s.why = why.join(' · ');
  });
  students.sort((a, b) => (b.behind - a.behind) || a.name.localeCompare(b.name));
  const allDone = steps.every(x => x.skipped || (x.ready && x.done));
  return { g: g, level: skGroupLevel(g), start: start, steps: steps, on: onStep, allDone: allDone, students: students, total: counted.length,
    avg: skOverall(students.map(s => s.avg)), behind: students.filter(s => s.behind).length };
}
window.skGroupStats = skGroupStats;

function skCourseShownScroll(sel) {
  const el = document.querySelector(sel);
  if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
function renderCourse() {
  const wrap = document.getElementById('courseWrap');
  if (!wrap) return;
  const groups = getStudentGroups();
  if (skView.group && !groups.some(g => g.id === skView.group)) skView = { group: '', tab: 'journey', step: '' };
  if (!skView.group) { wrap.innerHTML = skCardsHtml(groups); return; }
  const g = skGroup(skView.group);
  const st = skView.step ? skStep(skView.step) : null;
  if (skView.step && !skReady(st)) skView.step = '';
  if (skView.step) { wrap.innerHTML = skStepPageHtml(st, g); return; }
  const stats = skGroupStats(g, skPathCtx(g, skSteps().filter(skReady)));
  wrap.innerHTML = skGroupPageHtml(stats);
}
/* ---- the group cards ---- */
function skStatsHtml(s) {
  return '<span class="sk-stat" title="The students\' average band">⭐ <b>' + (s.avg === null ? '—' : s.avg) + '</b></span>' +
    '<span class="sk-stat' + (s.behind ? ' sk-stat-behind' : '') + '" title="' + (s.behind ? 'Missed 2 or more parts sent 2+ days ago, or an average band below 5' : 'Nobody is behind') + '">' +
    (s.behind ? '🐢 <b>' + s.behind + '</b> behind' : '🙂 Nobody behind') + '</span>';
}
function skGroupSquaresHtml(s) {
  return '<div class="sk-squares" aria-label="Steps">' + s.steps.map(x => {
    const on = s.on === x, cls = x.done ? 'done' : on ? 'on' : x.skipped ? 'skipped' : x.ready ? '' : 'soon';
    const what = x.done ? 'done' : on ? 'teach next' : x.skipped ? 'skipped' : x.ready ? 'not yet' : 'coming soon';
    return '<span class="sk-stepbox' + (cls ? ' ' + cls : '') + '" data-step="' + x.st.id + '" title="Step ' + x.st.no + ' · ' + escapeForHtml(x.st.theme) + ' — ' + what + '"></span>';
  }).join('') + '</div>';
}
function skTeachLabel(s) { return s.on ? '▶ Teach STEP ' + s.on.st.no : s.allDone ? '🎉 All steps done' : '🎉 All ready steps done'; }
function skCardsHtml(groups) {
  if (!groups.length) {
    return '<div class="sk-results-empty sk-nogroups"><span class="sk-results-empty-emoji">👥</span><div><b>Add a group on the Students page</b>' +
      '<span>Each group gets its own links and its own place on the 20 steps.</span>' +
      '<button type="button" class="mini-btn solid" onclick="taNavigate(\'students.html\')">🧑‍🎓 Open Students</button></div></div>';
  }
  const steps = skSteps().filter(skReady), idx = taRosterIndex(), links = taSkillsLinks();
  const map = skResultsMap([].concat(...groups.map(g => skGroupCodes(g, steps, links))));   // one reading for every card
  return '<div class="sk-cards">' + groups.map((g, i) => {
    const s = skGroupStats(g, skPathCtx(g, steps, map, idx, links));
    return '<article class="sk-gcard" data-group="' + escapeForHtml(g.id) + '" style="--gc:var(' + ['--c-blue', '--c-pink', '--c-green', '--c-orange', '--c-purple', '--c-teal'][i % 6] + ')">' +
      '<div class="sk-gcard-top"><button type="button" class="sk-gcard-open" onclick="skOpenGroup(' + jsAttr(g.id) + ')" translate="no">' + escapeForHtml(g.name) + '</button>' +
      '<span class="sk-level-chip">' + escapeForHtml(s.level || '—') + '</span></div>' +
      skGroupSquaresHtml(s) +
      '<div class="sk-gcard-stats">' + skStatsHtml(s) + '</div>' +
      '<button type="button" class="sk-teach" onclick="skTeach(' + jsAttr(g.id) + ')">' + skTeachLabel(s) + '</button>' +
    '</article>';
  }).join('') + '</div>';
}
/* ---- a group's page ---- */
function skGroupPageHtml(s) {
  const g = s.g, tab = skView.tab === 'progress' ? 'progress' : 'journey';
  const tabBtn = (k, label) => '<button type="button" role="tab" class="sk-tab' + (tab === k ? ' active' : '') + '" aria-selected="' + (tab === k) + '" data-tab="' + k + '" onclick="skShowTab(' + jsAttr(k) + ')">' + label + '</button>';
  return '<button type="button" class="back-to-picker-btn" onclick="skOpenGroup(\'\')">← All groups</button>' +
    '<div class="sk-ghead"><div class="sk-ghead-name"><h3 translate="no">' + escapeForHtml(g.name) + '</h3><span class="sk-level-chip">' + escapeForHtml(s.level || '—') + '</span>' + skStartPickHtml(g) + '</div>' +
    '<div class="sk-gcard-stats">' + skStatsHtml(s) + '</div></div>' +
    '<div class="sk-tabs" role="tablist" aria-label="' + escapeForHtml(g.name) + '">' + tabBtn('journey', '🧭 Journey') + tabBtn('progress', '📈 Progress') + '</div>' +
    '<div class="sk-tabpanel" role="tabpanel">' + (tab === 'progress' ? skProgressHtml(s) : skPathHtml(s)) + '</div>';
}
function skPathHtml(s) {
  const g = s.g, steps = s.steps;
  const rows = steps.map((x, i) => {
    const lv = x.st, ready = x.ready, complete = x.done, focus = s.on === x, last = i === steps.length - 1;
    const node = ready
      ? '<button type="button" class="sk-node' + (complete ? ' done' : '') + '" data-step="' + lv.id + '" onclick="skOpenStep(' + jsAttr(lv.id) + ')" title="Open Step ' + lv.no + '">'
      : '<div class="sk-node soon" data-step="' + lv.id + '" aria-disabled="true">';
    const tag = !ready ? '<small class="sk-node-tag">🛠️ Coming soon</small>'
      : complete ? '<small class="sk-node-tag done">✓ All done</small>'
      : x.skipped ? '<small class="sk-node-tag">⏭️ Skipped</small>' : '';
    let html = '<div class="sk-row' + (i % 2 ? ' rev' : '') + (complete ? ' complete' : '') + (ready ? '' : ' soon') + (x.skipped ? ' skipped' : '') + (focus ? ' focus' : '') + '" data-step="' + lv.id + '">' +
      '<div class="sk-node-wrap">' + (focus ? '<span class="sk-teach-tag">👉 Teach this step</span>' : '') + node +
      '<span class="sk-node-emoji">' + lv.emoji + '</span><span class="sk-node-text"><b>Step ' + lv.no + '</b><span>' + escapeForHtml(lv.theme) + '</span>' + tag + '</span>' +
      (complete ? '<span class="sk-node-check" aria-label="Done">✓</span>' : '') + (ready ? '</button>' : '</div>') + '</div>' +
      '<div class="sk-track">';
    // plain dots, one per part the step has (teacher, 2026-11-05: no 🎧📖✍️🗣️ — a step's first part isn't always Listening)
    const dots = ready ? x.dots : [0, 1, 2, 3].map(() => null);
    dots.forEach(d => {
      html += '<span class="sk-seg' + (d && d.done ? ' on' : '') + '"></span>';
      if (!d) { html += '<span class="sk-dot soon" title="Coming soon"></span>'; return; }
      const tip = d.skill.label + ' — ' + d.text;
      html += '<button type="button" class="sk-dot' + (d.done ? ' done' : '') + '" data-skill="' + d.skill.key + '" title="' + escapeForHtml(tip) + '" aria-label="Step ' + lv.no + ' ' + escapeForHtml(tip) + '" onclick="skOpenStep(' + jsAttr(lv.id) + ')">' +
        (d.done ? '<span class="sk-dot-check" aria-hidden="true">✓</span>' : '') + '</button>';
    });
    html += last ? '<span class="sk-seg sk-seg-end' + (complete ? ' on' : '') + '"></span><span class="sk-flag" aria-hidden="true">🏁</span>'
      : '<span class="sk-seg sk-seg-out' + (complete ? ' on' : '') + '"></span>';
    return html + '</div></div>';
  }).join('');
  return '<p class="sk-hint sk-path-hint">A dot is a part of the step (Listening, Reading, Writing, Speaking). It turns green when half of ' +
    '<span translate="no">' + escapeForHtml(g.name) + '</span> has done it (Speaking: when you copy its link).' +
    (s.start > 1 ? ' Steps 1–' + (s.start - 1) + ' are skipped for a ' + escapeForHtml(s.level) + ' group — you can still open them.' : '') + '</p>' +
    '<div class="sk-path">' + rows + '</div>';
}
function skProgressHtml(s) {
  if (!s.students.length) {
    return '<div class="sk-results-empty"><span class="sk-results-empty-emoji">🧑‍🎓</span><div><b>No students in <span translate="no">' + escapeForHtml(s.g.name) + '</span> yet</b>' +
      '<span>Add them with their IDs on the Students page — their bands show here.</span></div></div>';
  }
  const legend = '<div class="sk-legend"><span><i class="sk-stepbox b-good"></i>6.5 or more</span><span><i class="sk-stepbox b-mid"></i>5.5–6</span><span><i class="sk-stepbox b-low"></i>5 or less</span>' +
    '<span><i class="sk-stepbox"></i>Not done</span><span><i class="sk-stepbox skipped"></i>Skipped</span></div>';
  const rows = s.students.map(st => {
    const squares = s.steps.map(x => {
      const b = st.bands[x.st.id], has = x.st.id in st.bands;
      const cls = typeof b === 'number' ? 'b-' + skBandColour(b) : has ? 'b-none' : x.skipped ? 'skipped' : x.ready ? '' : 'soon';
      const tip = 'Step ' + x.st.no + ' — ' + (typeof b === 'number' ? 'band ' + b : has ? 'done' : x.skipped ? 'skipped' : x.ready ? 'not done' : 'coming soon');
      return '<span class="sk-stepbox' + (cls ? ' ' + cls : '') + '" data-step="' + x.st.id + '" title="' + tip + '"></span>';
    }).join('');
    return '<div class="sk-prow' + (st.behind ? ' behind' : '') + '" data-student="' + escapeForHtml(st.id) + '">' +
      '<div class="sk-prow-who"><span class="res-avatar" style="background:' + avatarColorForName(st.name) + ';">' + escapeForHtml(initialsForName(st.name)) + '</span>' +
      '<div class="sk-prow-text"><b translate="no">' + escapeForHtml(st.name) + '</b>' +
      '<span><span class="sk-prow-avg">⭐ ' + (st.avg === null ? '—' : st.avg) + '</span> · <span class="sk-prow-did">' + st.did + ' of ' + s.total + ' steps done</span></span></div>' +
      (st.behind ? '<span class="sk-turtle" title="' + escapeForHtml(st.why) + '" aria-label="Behind: ' + escapeForHtml(st.why) + '">🐢</span>' : '') + '</div>' +
      '<div class="sk-squares">' + squares + '</div></div>';
  }).join('');
  return '<p class="sk-hint sk-path-hint">Each square is a step, coloured by the student\'s band in it. 🐢 = behind: missed 2 or more parts you sent at least 2 days ago, or an average band below 5 (they come first).</p>' +
    legend + '<div class="sk-prog">' + rows + '</div>';
}
function skStepPageHtml(lv, g) {
  const ctx = skPathCtx(g, [lv]);
  const rows = g ? skTableRows(lv.id, g.id, ctx.map, ctx.links) : [];
  skWritingRes = rows.map(r => r.writing ? r.writing.res : null);
  const meta = skTableMeta(lv.id, g);
  const results = '<section class="sk-results" aria-label="Results">' +
    '<div class="sk-results-head"><h3>🏆 Results' + (g ? ' — <span translate="no">' + escapeForHtml(g.name) + '</span>' : '') + '</h3>' +
    (rows.length ? '<button type="button" class="mini-btn solid" onclick="skDownloadTable()">⬇️ Download picture</button>' +
      '<button type="button" class="mini-btn solid" onclick="skShareResults()">🔗 Share results link</button>' : '') + '</div>' +
    (rows.length ? skTableHtml(rows, meta, { writingLinks: true }) + '<p class="sk-hint sk-results-note">Ranked by Overall. Press a ✍️ Writing band to read the text or change the band.</p>'
      : '<div class="sk-results-empty"><span class="sk-results-empty-emoji">🌱</span><div><b>No results yet</b><span>' +
        (g ? 'When students in <span translate="no">' + escapeForHtml(g.name) + '</span> finish this step\'s Listening, Reading or Writing, their bands show here, ranked.'
          : 'Add a group on the Students page first, then send it the links below.') + '</span></div></div>') +
    '</section>';
  const cards = SK_SKILLS.map(s => {
    const c = lv[s.key];
    if (!c) return '<div class="sk-part soon" data-skill="' + s.key + '" style="--skc:' + s.color + '"><div class="sk-part-top"><span class="sk-part-emoji">' + s.emoji + '</span><div class="sk-part-name"><b>' + s.label + '</b></div></div><span class="sk-soon-tag">🛠️ Coming soon</span></div>';
    const st = skDotState(s.key, lv.id, g, ctx);
    return '<div class="sk-part' + (st.done ? ' done' : '') + '" data-skill="' + s.key + '" style="--skc:' + s.color + '">' +
      '<div class="sk-part-top"><span class="sk-part-emoji">' + s.emoji + '</span><div class="sk-part-name"><b>' + s.label + '</b>' +
      (skTileSub(c) ? '<span>' + escapeForHtml(skTileSub(c)) + '</span>' : '') + '</div></div>' +
      '<span class="sk-part-state' + (st.done ? ' done' : '') + '">' + (st.done ? '✅ ' : '⏳ ') + escapeForHtml(st.text) + '</span>' +
      '<div class="sk-tile-btns"><button type="button" class="mini-btn" onclick="skTry(' + jsAttr(s.key) + ', ' + jsAttr(lv.id) + ')">▶️ Try</button>' +
      (g ? '<button type="button" class="mini-btn solid" onclick="skCopyLink(' + jsAttr(s.key) + ', ' + jsAttr(lv.id) + ')">🔗 Copy link for ' + escapeForHtml(g.name) + '</button>' : '') + '</div>' +
      (g ? '' : '<p class="sk-hint">Add a group on the Students page first.</p>') + '</div>';
  }).join('');
  return '<button type="button" class="back-to-picker-btn" onclick="skOpenStep(\'\')">← ' + (g ? '<span translate="no">' + escapeForHtml(g.name) + '</span> · ' : '') + 'Journey</button>' +
    '<div class="sk-level-head"><span class="sk-node-emoji">' + lv.emoji + '</span><div><h3>Step ' + lv.no + ' · ' + escapeForHtml(lv.theme) + '</h3>' +
    '<div class="sk-hint">' + escapeForHtml(lv.stage || '') + ' · ' + SK_SKILLS.filter(s => lv[s.key]).map(s => s.label).join(', ') + '</div></div></div>' +
    '<div class="sk-parts">' + cards + '</div>' + results;   // the exercises first, their results below (teacher, 2026-11-05)
}
function skTileSub(c) { return c.title || c.topic || (c.part2 && (c.part2.topic || c.part2.title)) || ''; }

/* ---- moving around (the group is remembered on this device: ta_course_group) ---- */
function skOpenGroup(id) {
  skView = { group: id || '', tab: 'journey', step: '' };
  if (id) { try { localStorage.setItem(LS_COURSE_GROUP, id); } catch (e) { /* ignore */ } }
  renderCourse();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
/* ▶ Teach STEP N: the Journey, scrolled to the step the group is on (singled out) */
function skTeach(id) {
  skOpenGroup(id);
  setTimeout(() => skCourseShownScroll('.sk-row.focus'), 60);
}
function skShowTab(tab) {
  skView.tab = tab === 'progress' ? 'progress' : 'journey';
  renderCourse();
}
function skOpenStep(id) {
  const back = skView.step;
  skView.step = (skStep(id) || {}).id || '';
  renderCourse();
  if (!skView.step && back) setTimeout(() => skCourseShownScroll('.sk-row[data-step="' + back + '"]'), 60);   // back where the teacher was
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
function skTry(skill, step) {
  const w = window.open(taSkillLink(skill, step) + '&preview=1', '_blank');
  if (!w) showToast('⚠️ The browser blocked the new tab. Allow pop-ups for this site and press again.');
}
/* Speaking sends nothing, so its dot is done once its link was copied for the group (no My Exercises item). */
function skMarkSpeakingSent(step, g) {
  const links = taSkillsLinks(), key = skLinkKey('speaking', step, g), v = links[key];
  if (v && typeof v === 'object' && v.sentAt) return;
  links[key] = Object.assign({}, v && typeof v === 'object' ? v : {}, { sentAt: new Date().toISOString() });
  skWriteLinks(links);
}
/* One after another (teacher, 2026-11-12: a student who opens an exercise before finishing the one before it is warned "Oldingi
   Listening mashq tugatilmagan"): the group's parts in order — from the group's start, step by step, Listening → Reading → Writing
   (Speaking sends nothing). The part before one = the nearest earlier part whose link was copied for this group. */
const SK_ORDER = ['listening', 'reading', 'writing'];
function skPartsInOrder(g) {
  const start = skStartNo(g), seq = [];
  skSteps().forEach(st => { if (st.no >= start) SK_ORDER.forEach(k => { if (st[k]) seq.push({ skill: k, step: st }); }); });
  return seq;
}
function skPrevPart(skill, stepId, g, links) {
  const seq = skPartsInOrder(g), st = skStep(stepId);
  const i = st ? seq.findIndex(x => x.skill === skill && x.step.id === st.id) : -1;
  for (let j = i - 1; j >= 0; j--) {
    const codes = skCodesFor(seq[j].skill, seq[j].step.id, g, links);
    if (codes.length) return { skill: seq[j].skill, stepNo: seq[j].step.no, codes: codes };
  }
  return null;
}
function skNextPart(skill, stepId, g, links) {
  const seq = skPartsInOrder(g), st = skStep(stepId);
  const i = st ? seq.findIndex(x => x.skill === skill && x.step.id === st.id) : -1;
  if (i < 0) return null;
  for (let j = i + 1; j < seq.length; j++) {
    const e = skLinkEntry(seq[j].skill, seq[j].step.id, g, links);
    if (e && e.code) return { skill: seq[j].skill, step: seq[j].step.id, code: e.code };
  }
  return null;
}
/* The group's list goes online for this link's code, IDs scrambled (taPublishClassList in firebase.js), so the student page
   lets in only the group's students — with the part before it (`prev`), so a student who hasn't done that one is stopped.
   On every Copy link — a student added later is let in after the next copy. The part after it (already sent) is put online
   again too, so it knows this one comes before it. */
function skPutClassOnline(url, g, skill, step) {
  let code = '';
  try { code = new URL(url, location.href).searchParams.get('c') || ''; } catch (e) { code = ''; }
  const students = skGroupRoster(g);
  if (!code || typeof window.taPublishClassList !== 'function') return;
  const links = taSkillsLinks();
  window.taPublishClassList(code, students, skPrevPart(skill, step, g, links)).then(ok => {
    if (!ok) showToast('⚠️ The class list couldn\'t go online — students can still start without an ID check. Press Copy link again later.');
  });
  const next = skNextPart(skill, step, g, links);
  if (next) window.taPublishClassList(next.code, students, skPrevPart(next.skill, next.step, g, links));
}
function skCopyLink(skill, step) {
  const g = skGroup();
  if (!g) { showToast('Add a group on the Students page first.'); return; }
  taSkillsLinksMigrate();   // old keys ("<g>|<skill>|<level number>") are written anew
  const url = skLinkFor(skill, step, g);
  if (!url) return;
  if (skill === 'speaking') skMarkSpeakingSent(step, g);
  else skPutClassOnline(url, g, skill, (skStep(step) || {}).id || step);   // only the group's students, and in order (2026-11-09, 11-12)
  const msg = '🔗 Link copied — send it to ' + g.name + '. It always works.';
  // taModal sets the title as text: the group's name goes in as typed
  const show = () => taModal('🔗 The link for ' + g.name, '<input type="text" class="ta-input" readonly value="' + escapeForHtml(url) + '" aria-label="The link">');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => showToast(msg, 'ok'), show);
  else show();
  renderCourse();
}

/* ================= RESULTS TABLE (per step + group) =================
   The group's students who did any of the step's Listening / Reading / Writing, ranked by Overall
   (equal Overall → the same place: 1, 2, 2, 2, 5). Each skill: the best try (highest band); a writing's band
   is the teacher's mark (ta_skills_marks) if given, else the page's estimate. Overall = skOverall of the bands
   that exist, with its CEFR. The same table is drawn on a canvas for "⬇️ Download picture" (the teacher posts
   it to the group's chat). */
const SK_TABLE_SKILLS = ['listening', 'reading', 'writing'];
const SK_MEDALS = ['🥇', '🥈', '🥉'];
/* The results of some codes (kept on this device): { code: [results] }, without those cleared by "Delete all results"
   — decided by isExpiredResult, the same rule Results uses. The kept results are read once for all the codes
   (a drawing of the Course page asks for every step's codes at once). */
function skResultsMap(codes) {
  const want = new Set((codes || []).filter(Boolean)), map = {};
  want.forEach(c => { map[c] = []; });
  if (!want.size) return map;
  const stored = getStoredResults(), live = window.__liveResults || [], cutoff = {}, resets = getLocalResets();
  want.forEach(c => { cutoff[c] = resets[c] || ''; });
  live.concat(stored).forEach(r => {
    if (isResetMarker(r) && want.has(r.code) && r.resetAt && r.resetAt > cutoff[r.code]) cutoff[r.code] = r.resetAt;
  });
  const seen = new Set();
  (window.__allResults || []).concat(stored, live).forEach(r => {
    if (!r || !want.has(r.code) || isResetMarker(r) || isExpiredResult(r, cutoff[r.code])) return;
    const sig = resultSignature(r);
    if (seen.has(sig)) return;
    seen.add(sig);
    map[r.code].push(r);
  });
  return map;
}
/* every code of a step + part + group: its own and an old one kept with it (alsoCodes, taSkillsLinksFix) */
function skCodesFor(skill, step, g, links) {
  const e = skLinkEntry(skill, step, g, links);
  return e ? taSkillsEntryCodes(e) : [];
}
/* the results of a slot's codes, together */
function skSlotResults(map, codes) { return [].concat(...(codes || []).map(c => (map && map[c]) || [])); }
/* Listening/Reading: the band is worked out here from correct / total (kept to 0…total) — a result's own `band` is
   ignored, so a made-up record can't claim band 99. Writing: skWritingBandFor (kept to 1–9). */
function skResultBand(skill, r) {
  if (skill === 'writing') return skWritingBandFor(r);
  const total = Number(r.total), correct = Number(r.correct);
  if (!(total > 0) || !isFinite(total) || !isFinite(correct)) return null;
  return skBand(Math.max(0, Math.min(total, correct)), total);
}
function skResultRawNums(r) {
  const total = Number(r.total), correct = Number(r.correct);
  return total > 0 && isFinite(total) && isFinite(correct) ? Math.max(0, Math.min(total, correct)) + ' / ' + total : '';
}
function skResultRaw(skill, r) {
  if (skill === 'writing') return (typeof r.words === 'number' ? r.words : 0) + ' words';
  return skResultRawNums(r);
}
function skTableRows(step, groupId, resultsMap, links) {
  const g = skGroup(groupId);
  if (!g) return [];
  links = links || taSkillsLinks();
  const idx = taRosterIndex(), students = {};
  const codes = SK_TABLE_SKILLS.map(skill => skCodesFor(skill, step, g, links));
  const map = resultsMap || skResultsMap([].concat(...codes));
  SK_TABLE_SKILLS.forEach((skill, i) => {
    skSlotResults(map, codes[i]).forEach(r => {
      const st = rosterStudentForResult(r, idx);
      if (!st || st.group !== g.id) return;
      const band = skResultBand(skill, r);
      const waits = skill === 'writing' && typeof band !== 'number' && skWritingPending(r);   // waiting for the AI: ⏳
      if (typeof band !== 'number' && !waits) return;
      const key = String(st.id).trim().toLowerCase();
      const row = students[key] || (students[key] = { name: st.name, studentId: st.id, listening: null, reading: null, writing: null });
      const cur = row[skill];
      // a checked writing beats a waiting one; among the same kind the best band (the latest when equal)
      const better = !cur || (cur.pending && !waits) || (!cur.pending && !waits && (band > cur.band || (band === cur.band && String(r.date || '') > cur.date)))
        || (cur.pending && waits && String(r.date || '') > cur.date);
      if (better) {
        row[skill] = { band: waits ? null : band, pending: waits || undefined, raw: skResultRaw(skill, r), date: String(r.date || '') };
        if (!waits) delete row[skill].pending;
        if (skill === 'writing') Object.defineProperty(row[skill], 'res', { value: r });   // for skViewWriting (not copied out)
      }
    });
  });
  const rows = Object.keys(students).map(k => {
    const row = students[k];
    SK_TABLE_SKILLS.forEach(s => { if (row[s]) delete row[s].date; });
    row.overall = skOverall(SK_TABLE_SKILLS.map(s => row[s] && typeof row[s].band === 'number' ? row[s].band : null));
    row.cefr = row.overall === null ? '' : skCefr(row.overall);
    return row;
  });
  rows.sort((a, b) => (b.overall - a.overall) || a.name.localeCompare(b.name));
  rows.forEach(row => { row.place = 1 + rows.filter(o => o.overall > row.overall).length; });
  return rows;
}
window.skTableRows = skTableRows;
function skTableMeta(step, g) {
  const lv = skStep(step);
  return { step: lv ? lv.id : String(step), no: lv ? lv.no : '', title: 'Step ' + (lv ? lv.no : step) + ' · ' + (lv ? lv.theme : ''), group: g ? g.name : '',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) };
}
function skPlaceText(p) { return SK_MEDALS[p - 1] || String(p); }
function skTableHtml(rows, meta, opts) {
  opts = opts || {};
  const esc = escapeForHtml;
  const cell = (v, cls) => v && v.pending
    ? '<div class="' + cls + ' pending" title="Waiting for the AI check"><b>⏳</b><small>' + esc(v.raw) + '</small></div>'
    : v
    ? '<div class="' + cls + ' ' + skBandColour(v.band) + '"><b>' + v.band + '</b><small>' + esc(v.raw) + '</small></div>'
    : '<div class="' + cls + ' none">—</div>';
  // a writing band opens the student's text (the step page keeps the results in skWritingRes)
  const wcell = (r, i) => r.writing && r.writing.res && opts.writingLinks
    ? '<button type="button" class="sk-rt-cell sk-rt-wbtn ' + (r.writing.pending ? 'pending' : skBandColour(r.writing.band)) + '" onclick="skViewWriting(' + i + ')" title="Open ' + esc(r.name) + '\'s writing"><b>' + (r.writing.pending ? '⏳' : r.writing.band) + '</b><small>' + esc(r.writing.raw) + '</small></button>'
    : cell(r.writing, 'sk-rt-cell');
  const avg = skOverall(rows.map(r => r.overall));
  return '<div class="sk-rt">' +
    '<div class="sk-rt-head"><div class="sk-rt-brand" translate="no">🧶 loom</div>' +
      '<div class="sk-rt-title">🏆 ' + esc(meta.title) + '</div>' +
      '<div class="sk-rt-meta"><span translate="no">👥 ' + esc(meta.group) + '</span><span>📅 ' + esc(meta.date) + '</span></div>' +
      '<div class="sk-rt-chips">' + SK_TABLE_SKILLS.map(k => { const s = skSkill(k); return '<span class="sk-rt-chip sk-rt-' + k + '">' + s.emoji + ' ' + s.label + '</span>'; }).join('') + '</div></div>' +
    '<div class="sk-rt-scroll"><div class="sk-rt-grid">' +
      '<div class="sk-rt-cols"><span>#</span><span></span><span>Student</span>' + SK_TABLE_SKILLS.map(k => '<span>' + skSkill(k).emoji + ' ' + skSkill(k).label + '</span>').join('') + '<span>Overall</span></div>' +
      rows.map((r, i) => '<div class="sk-rt-row">' +
        '<span class="sk-rt-place' + (r.place <= 3 ? ' medal' : '') + '" aria-label="Place ' + r.place + '">' + skPlaceText(r.place) + '</span>' +
        '<span class="res-avatar" style="background:' + avatarColorForName(r.name) + ';">' + esc(initialsForName(r.name)) + '</span>' +
        '<span class="sk-rt-name" translate="no">' + esc(r.name) + '</span>' +
        SK_TABLE_SKILLS.map(k => k === 'writing' ? wcell(r, i) : cell(r[k], 'sk-rt-cell')).join('') +
        (r.overall === null ? '<div class="sk-rt-overall none">—</div>'
          : '<div class="sk-rt-overall ' + skBandColour(r.overall) + '"><b>' + r.overall + '</b><small>' + r.cefr + '</small></div>') +
      '</div>').join('') +
    '</div></div>' +
    '<div class="sk-rt-foot"><span>Group average: <b>' + (avg === null ? '—' : avg) + '</b></span><span>' + rows.length + (rows.length === 1 ? ' student' : ' students') + '</span></div>' +
  '</div>';
}
let skWritingRes = [];   // the writing result behind each row's ✍️ cell (step page), for skViewWriting
/* A ✍️ cell in the table: the student's writing (text, mistakes, the band the teacher can change — common.js) */
function skViewWriting(i) {
  const r = skWritingRes[i];
  if (!r) return;
  const modal = taModal('✍️ Writing', skWritingViewHtml(r), { wide: true, onClose: () => { skWvOpen = null; } });
  skWvOpen = { r: r, modal: modal };
}
/* ================= RESULTS AS A LINK (teacher, 2026-11-12) =================
   "🔗 Share results link": the step's table for this group goes online (taPublishShare, record share-<token>) and its link
   results-link.html?r=<token> is copied. The token is made once per group + step (ta_skills_shares) so the link never changes;
   every press puts the newest table online. Places, Overall and CEFR are worked out on the page (skOverall/skCefr), and every
   writing carries its id, text and asked words so tapping its band shows the AI feedback there (js/results-link.js). */
function skShareData(step, g) {
  const lv = skStep(step), ctx = skPathCtx(g, [lv]);
  const rows = skTableRows(lv.id, g.id, ctx.map, ctx.links);
  const part = v => v && typeof v.band === 'number' ? { band: v.band, raw: v.raw } : null;
  return { group: g.name, step: lv.id, stepNo: lv.no, theme: lv.theme, sharedAt: new Date().toISOString(),
    rows: rows.map(r => {
      const res = r.writing && r.writing.res, mark = res ? skTeacherMark(res) : null, band = res ? skWritingBandFor(res) : null;
      return { name: r.name, listening: part(r.listening), reading: part(r.reading),
        writing: res ? { id: res.__id || '', raw: r.writing.raw, text: String(res.text || ''), words: typeof res.words === 'number' ? res.words : 0,
          minWords: res.minWords || 0, maxWords: res.maxWords || 0, asked: res.asked && (res.asked.used || res.asked.missing) ? { used: res.asked.used || [], missing: res.asked.missing || [] } : null,
          mark: mark, band: band } : null };
    }) };
}
function skShareToken(g, step) {
  let all = {};
  try { all = JSON.parse(localStorage.getItem('ta_skills_shares') || '{}') || {}; } catch (e) { all = {}; }
  const key = g.id + '|' + step;
  if (!/^[0-9a-f]{16}$/.test(all[key] || '')) {
    const b = new Uint8Array(8);
    crypto.getRandomValues(b);
    all[key] = Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
    try { localStorage.setItem('ta_skills_shares', JSON.stringify(all)); } catch (e) { /* ignore */ }
  }
  return all[key];
}
async function skShareResults() {
  const g = skGroup();
  if (!skView.step || !g) return;
  const lv = skStep(skView.step);
  if (!lv) return;
  if (typeof window.taPublishShare !== 'function') { showToast('⚠️ The database isn\'t ready yet. Try again in a moment.'); return; }
  const token = skShareToken(g, lv.id);
  const base = window.skAppUrl || (/^https:/.test(TA_APP_URL) ? TA_APP_URL : '');
  const url = base + 'results-link.html?r=' + token;
  const ok = await window.taPublishShare(token, skShareData(lv.id, g));
  if (!ok) { showToast('⚠️ The results couldn\'t go online. Check the internet and press Share results link again.'); return; }
  const msg = '🔗 Link copied — send it to ' + g.name + '. It shows the table as it is now and updates itself while writings are checked.';
  const show = () => taModal('🔗 The results link', '<input type="text" class="ta-input" readonly value="' + escapeForHtml(url) + '" aria-label="The link">');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => showToast(msg, 'ok'), show);
  else show();
}
window.skShareResults = skShareResults;
window.skShareData = skShareData;
function skSlug(s) { return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'group'; }
async function skDownloadTable() {
  const g = skGroup();
  if (!skView.step || !g) return;
  const rows = skTableRows(skView.step, g.id), meta = skTableMeta(skView.step, g);
  try {
    const blob = await skDrawTablePng(rows, meta);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'step-' + meta.no + '-' + skSlug(meta.group) + '.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    showToast('⬇️ Picture saved — post it to ' + meta.group + '\'s chat.', 'ok');
  } catch (e) {
    showToast('⚠️ Couldn\'t make the picture in this browser. Try Chrome, or take a screenshot of the table.');
  }
}
/* The same table as a PNG (2× for sharp text on phones). Fonts: Fredoka / Nunito when the page has them. */
const SK_PNG = { page: '#FFF5E1', card: '#FFFFFF', line: '#2B2140', ink: '#2B2140', soft: '#5A4E72', head: '#2B2140', headInk: '#FFF7EC',
  good: ['#D6F7EA', '#0B6B4B', '#2ED3A0'], mid: ['#FFF1C2', '#7A5600', '#FFD23F'], low: ['#FFE0E0', '#A31F1F', '#FF6B6B'],
  chips: { listening: '#4D9BFF', reading: '#2ED3A0', writing: '#FF9F43' }, avatars: ['#4D9BFF', '#22C3D6', '#A97BFF', '#FF9F43', '#FF7AC6', '#2ED3A0', '#FF6B6B', '#FFD23F'] };
async function skDrawTablePng(rows, meta) {
  const has = f => { try { return document.fonts && document.fonts.check(f); } catch (e) { return false; } };
  try { if (document.fonts && document.fonts.load) await Promise.race([Promise.all([document.fonts.load('700 20px Fredoka'), document.fonts.load('700 16px Nunito')]), new Promise(r => setTimeout(r, 1500))]); } catch (e) { /* offline */ }
  const HEAD_F = has('700 20px Fredoka') ? 'Fredoka, sans-serif' : 'sans-serif';
  const BODY_F = has('700 16px Nunito') ? 'Nunito, sans-serif' : 'sans-serif';
  const W = 960, PAD = 28, HEAD_H = 168, COLS_H = 40, ROW_H = 78, FOOT_H = 64;
  const H = PAD + HEAD_H + 16 + COLS_H + rows.length * ROW_H + FOOT_H + PAD;
  const S = 2, cv = document.createElement('canvas');
  cv.width = W * S; cv.height = H * S;
  const x = cv.getContext('2d');
  x.scale(S, S);
  const rr = (X, Y, w, h, r) => { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); };
  const text = (t, X, Y, font, color, align) => { x.font = font; x.fillStyle = color; x.textAlign = align || 'left'; x.textBaseline = 'middle'; x.fillText(t, X, Y); };
  const fit = (t, font, max) => { x.font = font; if (x.measureText(t).width <= max) return t; while (t.length > 1 && x.measureText(t + '…').width > max) t = t.slice(0, -1); return t + '…'; };
  // page + card with a hard shadow
  x.fillStyle = SK_PNG.page; x.fillRect(0, 0, W, H);
  const cardX = PAD, cardY = PAD, cardW = W - 2 * PAD, cardH = H - 2 * PAD;
  rr(cardX, cardY + 6, cardW, cardH, 22); x.fillStyle = SK_PNG.line; x.fill();
  rr(cardX, cardY, cardW, cardH, 22); x.fillStyle = SK_PNG.card; x.fill(); x.lineWidth = 3; x.strokeStyle = SK_PNG.line; x.stroke();
  // header
  x.save(); rr(cardX, cardY, cardW, cardH, 22); x.clip(); x.fillStyle = SK_PNG.head; x.fillRect(cardX, cardY, cardW, HEAD_H); x.restore();
  rr(cardX, cardY, cardW, cardH, 22); x.lineWidth = 3; x.strokeStyle = SK_PNG.line; x.stroke();
  const hx = cardX + 28;
  text('loom', hx, cardY + 30, '700 18px ' + HEAD_F, '#FFD23F');
  text('🏆 ' + meta.title, hx, cardY + 66, '700 30px ' + HEAD_F, SK_PNG.headInk);
  text(meta.group + '  ·  ' + meta.date, hx, cardY + 102, '700 17px ' + BODY_F, '#D8CDEB');
  let cx = hx;
  SK_TABLE_SKILLS.forEach(k => {
    const s = skSkill(k), label = s.emoji + ' ' + s.label;
    x.font = '700 15px ' + BODY_F;
    const w = x.measureText(label).width + 26;
    rr(cx, cardY + 122, w, 30, 15); x.fillStyle = SK_PNG.chips[k]; x.fill();
    text(label, cx + 13, cardY + 137, '700 15px ' + BODY_F, SK_PNG.line);
    cx += w + 10;
  });
  // columns
  const colX = { place: cardX + 26, avatar: cardX + 74, name: cardX + 120 };
  const cellW = 116, ovW = 124, gap = 12;
  const ovX = cardX + cardW - 24 - ovW;
  const skX = SK_TABLE_SKILLS.map((k, i) => ovX - gap - (SK_TABLE_SKILLS.length - i) * (cellW + gap) + gap);
  let y = cardY + HEAD_H + 16;
  const colFont = '700 14px ' + BODY_F;
  text('#', colX.place + 14, y + COLS_H / 2, colFont, SK_PNG.soft, 'center');
  text('Student', colX.name, y + COLS_H / 2, colFont, SK_PNG.soft);
  SK_TABLE_SKILLS.forEach((k, i) => text(skSkill(k).emoji + ' ' + skSkill(k).label, skX[i] + cellW / 2, y + COLS_H / 2, colFont, SK_PNG.soft, 'center'));
  text('Overall', ovX + ovW / 2, y + COLS_H / 2, colFont, SK_PNG.soft, 'center');
  y += COLS_H;
  const drawCell = (v, X, w, sub, strong) => {
    const cy = y + 7, h = ROW_H - 18;
    if (!v) { rr(X, cy, w, h, 14); x.fillStyle = '#F4EEE2'; x.fill(); text('—', X + w / 2, cy + h / 2, '700 22px ' + HEAD_F, '#A99CC4', 'center'); return; }
    if (v.pending) { rr(X, cy, w, h, 14); x.fillStyle = '#F4EEE2'; x.fill(); text('⏳', X + w / 2, cy + h / 2 - 9, '700 24px ' + HEAD_F, '#A99CC4', 'center'); text(sub, X + w / 2, cy + h / 2 + 16, '700 13px ' + BODY_F, '#A99CC4', 'center'); return; }
    const c = SK_PNG[skBandColour(v.band)];
    if (strong) { rr(X, cy + 3, w, h, 14); x.fillStyle = SK_PNG.line; x.fill(); }
    rr(X, cy, w, h, 14); x.fillStyle = c[0]; x.fill(); x.lineWidth = 2; x.strokeStyle = strong ? SK_PNG.line : c[2]; x.stroke();
    text(String(v.band), X + w / 2, cy + h / 2 - 9, '700 26px ' + HEAD_F, c[1], 'center');
    text(sub, X + w / 2, cy + h / 2 + 16, '700 13px ' + BODY_F, c[1], 'center');
  };
  rows.forEach((r, i) => {
    if (i % 2 === 1) { x.fillStyle = '#FFF9EE'; x.fillRect(cardX + 2, y, cardW - 4, ROW_H); }
    x.strokeStyle = '#EFE6D6'; x.lineWidth = 1; x.beginPath(); x.moveTo(cardX + 16, y); x.lineTo(cardX + cardW - 16, y); x.stroke();
    const mid = y + ROW_H / 2;
    text(skPlaceText(r.place), colX.place + 14, mid, (r.place <= 3 ? '26px ' : '700 20px ') + HEAD_F, SK_PNG.ink, 'center');
    let h = 0; for (let k = 0; k < r.name.length; k++) h = (h * 31 + r.name.charCodeAt(k)) >>> 0;
    x.beginPath(); x.arc(colX.avatar + 19, mid, 19, 0, Math.PI * 2); x.fillStyle = SK_PNG.avatars[h % SK_PNG.avatars.length]; x.fill();
    x.lineWidth = 2; x.strokeStyle = SK_PNG.line; x.stroke();
    text(initialsForName(r.name), colX.avatar + 19, mid + 1, '700 14px ' + HEAD_F, SK_PNG.line, 'center');
    text(fit(r.name, '700 18px ' + BODY_F, skX[0] - colX.name - 12), colX.name, mid, '700 18px ' + BODY_F, SK_PNG.ink);
    SK_TABLE_SKILLS.forEach((k, j) => drawCell(r[k], skX[j], cellW, r[k] ? r[k].raw : ''));
    drawCell(r.overall === null ? null : { band: r.overall }, ovX, ovW, r.cefr, true);
    y += ROW_H;
  });
  // footer
  x.strokeStyle = SK_PNG.line; x.lineWidth = 2; x.beginPath(); x.moveTo(cardX + 16, y + 4); x.lineTo(cardX + cardW - 16, y + 4); x.stroke();
  const avg = skOverall(rows.map(r => r.overall));
  text('Group average: ' + (avg === null ? '—' : avg) + '  ·  ' + rows.length + (rows.length === 1 ? ' student' : ' students'), cardX + 28, y + FOOT_H / 2 + 2, '700 18px ' + HEAD_F, SK_PNG.ink);
  return new Promise((resolve, reject) => cv.toBlob(b => b ? resolve(b) : reject(new Error('no picture')), 'image/png'));
}
window.skDrawTablePng = skDrawTablePng;

/* firebase.js calls this when results change: the path's dots and the step page's table follow. */
/* The Course panel may be loaded in the background (taPreloadSections): it isn't drawn while hidden — opening it
   draws it (taOnTab). */
function skCourseShown() {
  const wrap = document.getElementById('courseWrap');
  return !!wrap && wrap.getClientRects().length > 0;
}
window.taCourseResultsChanged = function () { if (skCourseShown()) renderCourse(); };

/* ================= PAGE START ================= */
window.addEventListener('storage', e => { if (e.key && /ta_skills_links|ta_student_groups|ta_points_roster|ta_recent_exercises/.test(e.key) && skCourseShown()) renderCourse(); });
taOnTab('course', renderCourse);
taStartPage('course');
