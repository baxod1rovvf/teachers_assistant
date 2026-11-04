/* ================= COURSE — the four skill courses (2026-11-04) =================
   Listening, Reading, Writing and Speaking, Elementary, 10 levels each (content: js/skills-data.js, TA_SKILLS).
   The students' page is skill.html?s=<skill>&lv=<n>&c=<code> (speaking: no code — nothing is sent).
   - ta_skills_links  { "<groupId>|<skill>|<level>": { uid, code } }  (synced, in the backup) — the My Exercises item
                      made at the first "Copy link" for that level + skill + group, so Results / Statistics / Top 5 work;
                      the code is kept so a sent link stays valid even if the item is deleted (it comes back the same).
                      The link itself: taSkillLink / taSkillItemLink in common.js (My Exercises uses them too).
   - ta_skills_marks  the teacher's writing marks (Results, Task 7; synced, in the backup)
   - ta_course_group  the group picked on this device (not synced)
   - ta_skills_open   the skill open on this device (not synced) */
const LS_COURSE_GROUP = 'ta_course_group';
const LS_SKILLS_LINKS = 'ta_skills_links';
const LS_SKILLS_OPEN = 'ta_skills_open';
const SK_SKILLS = [
  { key: 'listening', label: 'Listening', emoji: '🎧', color: 'var(--c-blue)', about: 'A recording and questions to answer while you listen.', results: true },
  { key: 'reading', label: 'Reading', emoji: '📖', color: 'var(--c-green)', about: 'A text to read and questions about it.', results: true },
  { key: 'writing', label: 'Writing', emoji: '✍️', color: 'var(--c-orange)', about: 'A short text, checked for mistakes, with a band.', results: true },
  { key: 'speaking', label: 'Speaking', emoji: '🗣️', color: 'var(--c-pink)', about: 'Words, questions and a short talk. Nothing is recorded.', results: false }
];

function skSkill(key) { return SK_SKILLS.find(s => s.key === key) || null; }
function skLevels() { return (window.TA_SKILLS && TA_SKILLS.elementary && TA_SKILLS.elementary.levels) || []; }
function skLevel(no) { return skLevels().find(l => l.no === Number(no)) || null; }
function skWriteLinks(v) {
  try { localStorage.setItem(LS_SKILLS_LINKS, JSON.stringify(v)); } catch (e) { showToast('⚠️ Couldn\'t save — the browser\'s storage is full.'); }
}
function skOpenSkill() {
  let k = '';
  try { k = localStorage.getItem(LS_SKILLS_OPEN) || ''; } catch (e) { /* ignore */ }
  return skSkill(k) ? k : '';
}
function skGroupId() {
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
function skLinkKey(skill, level, group) { return group.id + '|' + skill + '|' + Number(level); }
/* { uid, code } kept for a level + skill + group (an old entry was just the uid) */
function skLinkEntry(skill, level, g) {
  const v = taSkillsLinks()[skLinkKey(skill, level, g)];
  if (!v) return null;
  if (typeof v === 'object') return v.uid ? v : null;
  const item = getRecentExercises().find(e => e.uid === v);
  return { uid: v, code: item ? item.code : '' };
}
function skItemFor(skill, level, group) {
  const g = skGroup(group);
  if (!g) return null;
  const e = skLinkEntry(skill, level, g);
  return e ? getRecentExercises().find(x => x.uid === e.uid) || null : null;
}
/* The My Exercises item for a level + skill + group: made at the first call, the same one after that.
   A link once sent must keep working: if the teacher deleted the item, it comes back with the same code and uid. */
function skEnsureItem(skill, level, group) {
  const g = skGroup(group), lv = skLevel(level), s = skSkill(skill);
  if (!g || !lv || !s || skill === 'speaking') return null;
  const key = skLinkKey(skill, level, g), kept = skLinkEntry(skill, level, g);
  const list = getRecentExercises();
  let item = kept ? list.find(e => e.uid === kept.uid) : null;
  if (item) {
    if (!item.skill || typeof taSkillsLinks()[key] !== 'object') {   // made before skill/level/code were kept
      item.skill = skill; item.level = lv.no; saveRecentExercises(list);
      const links = taSkillsLinks(); links[key] = { uid: item.uid, code: item.code }; skWriteLinks(links);
    }
    return item;
  }
  const uid = (kept && kept.code && kept.uid) || generateExerciseUid();
  const code = (kept && kept.code) || generateClassCode();
  // the Create page's form (if it's loaded in the background) has nothing to do with this item
  const snap = window.taSnapshotForMyExercises;
  window.taSnapshotForMyExercises = null;
  try {
    pushRecentExercise({ title: 'Level ' + lv.no + ' · ' + lv.theme + ' — ' + s.label + ' (' + g.name + ')', typeLabel: s.label + ' course',
      code: code, uid: uid, groupId: g.id, contentSummary: 'Level ' + lv.no + ' · ' + s.label });
  } finally { window.taSnapshotForMyExercises = snap; }
  const now = getRecentExercises();
  item = now.find(e => e.uid === uid) || null;
  if (item) { item.skill = skill; item.level = lv.no; saveRecentExercises(now); }
  const links = taSkillsLinks();
  links[key] = { uid: uid, code: code };
  skWriteLinks(links);
  return item;
}
/* The students' link. Listening/Reading/Writing carry the group's code (the item is made if needed). */
function skLinkFor(skill, level, group) {
  if (skill === 'speaking') return taSkillLink(skill, level);
  const item = skEnsureItem(skill, level, group);
  return item ? taSkillLink(skill, level, item.code) : '';
}
window.skLinkFor = skLinkFor;
window.skEnsureItem = skEnsureItem;

function renderCourse() {
  const wrap = document.getElementById('courseWrap');
  if (!wrap) return;
  const groups = getStudentGroups(), gid = skGroupId(), g = skGroup(gid);
  const open = skOpenSkill();
  let html = '<div class="sk-groups"><span class="sk-groups-label">👥 Group:</span>' +
    (groups.length
      ? groups.map(x => '<button type="button" class="myex-type-chip' + (x.id === gid ? ' active' : '') + '" onclick="skPickGroup(' + jsAttr(x.id) + ')" translate="no">' + escapeForHtml(x.name) + '</button>').join('')
      : '<span class="sk-hint">Add a group on the Students page first — each group gets its own links.</span>') + '</div>';
  if (!open) {
    html += '<div class="sk-skills">' + SK_SKILLS.map(s => {
      const ready = skLevels().filter(l => l[s.key]).length;
      return '<button type="button" class="sk-skill-card" style="--skc:' + s.color + '" onclick="skOpen(' + jsAttr(s.key) + ')">' +
        '<span class="sk-skill-emoji">' + s.emoji + '</span><span class="sk-skill-name">' + s.label + '</span>' +
        '<span class="sk-skill-about">' + escapeForHtml(s.about) + '</span>' +
        '<span class="sk-skill-count">Elementary · ' + ready + ' of ' + skLevels().length + ' levels ready</span></button>';
    }).join('') + '</div>';
    wrap.innerHTML = html;
    return;
  }
  const s = skSkill(open);
  html += '<button type="button" class="back-to-picker-btn" onclick="skOpen(\'\')">← All skills</button>' +
    '<div class="sk-skill-head" style="--skc:' + s.color + '"><span class="sk-skill-emoji">' + s.emoji + '</span><div><h3>' + s.label + '</h3>' +
    '<div class="sk-skill-level">Elementary · 10 levels</div></div></div>' +
    '<div class="sk-levels" style="--skc:' + s.color + '">' + skLevels().map(lv => skTileHtml(s, lv, g)).join('') + '</div>';
  wrap.innerHTML = html;
}
function skTileSub(c) { return c.title || c.topic || (c.part2 && (c.part2.topic || c.part2.title)) || ''; }
function skTileHtml(s, lv, g) {
  const c = lv[s.key];
  let html = '<div class="sk-level-tile' + (c ? '' : ' soon') + '" data-level="' + lv.no + '">' +
    '<div class="sk-tile-top"><span class="sk-tile-emoji">' + lv.emoji + '</span><div class="sk-tile-name"><b>Level ' + lv.no + ' · ' + escapeForHtml(lv.theme) + '</b>' +
    (c && skTileSub(c) ? '<span>' + escapeForHtml(skTileSub(c)) + '</span>' : '') + '</div></div>';
  if (!c) return html + '<span class="sk-soon-tag">🛠️ Coming soon</span></div>';
  const item = g && s.results ? skItemFor(s.key, lv.no, g) : null;
  html += '<div class="sk-tile-btns"><button type="button" class="mini-btn" onclick="skTry(' + jsAttr(s.key) + ', ' + lv.no + ')">▶️ Try</button>' +
    (g ? '<button type="button" class="mini-btn solid" onclick="skCopyLink(' + jsAttr(s.key) + ', ' + lv.no + ')">🔗 Copy link for ' + escapeForHtml(g.name) + '</button>' : '') +
    (item ? '<button type="button" class="mini-btn" onclick="taNavigate(\'results.html?exercise=' + encodeURIComponent(item.uid) + '\')">📊 View Results</button>' : '') + '</div>';
  if (!g) html += '<p class="sk-hint">Add a group on the Students page first.</p>';
  return html + '</div>';
}

function skPickGroup(id) {
  try { localStorage.setItem(LS_COURSE_GROUP, id); } catch (e) { /* ignore */ }
  renderCourse();
}
function skOpen(key) {
  try { if (key) localStorage.setItem(LS_SKILLS_OPEN, key); else localStorage.removeItem(LS_SKILLS_OPEN); } catch (e) { /* ignore */ }
  renderCourse();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function skTry(skill, level) {
  const w = window.open(taSkillLink(skill, level) + '&preview=1', '_blank');
  if (!w) showToast('⚠️ The browser blocked the new tab. Allow pop-ups for this site and press again.');
}
function skCopyLink(skill, level) {
  const g = skGroup();
  if (!g) { showToast('Add a group on the Students page first.'); return; }
  const url = skLinkFor(skill, level, g);
  if (!url) return;
  const msg = '🔗 Link copied — send it to ' + g.name + '. It always works.';
  const show = () => taModal('🔗 The link for ' + escapeForHtml(g.name), '<input type="text" class="ta-input" readonly value="' + escapeForHtml(url) + '" aria-label="The link">');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => showToast(msg, 'ok'), show);
  else show();
  renderCourse();
}

/* firebase.js calls this when results change (the results table comes in Task 7). */
window.taCourseResultsChanged = function () { if (skOpenSkill()) renderCourse(); };

/* ================= PAGE START ================= */
window.addEventListener('storage', e => { if (e.key && /ta_skills_links|ta_student_groups|ta_recent_exercises/.test(e.key)) renderCourse(); });
taOnTab('course', renderCourse);
taStartPage('course');
