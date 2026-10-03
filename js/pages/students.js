/* ================= STUDENTS & POINTS =================
   One section for groups, their lesson times (Upcoming Lessons on the
   Dashboard), students' IDs and points (2026-10-03: Points & Rewards and the
   Settings schedule moved in here). A group's lessons are the weekly-schedule
   entries with the group's name. */
const GROUP_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

function scheduleEntriesForGroup(name) {
  const key = String(name || '').trim().toLowerCase();
  if (!key) return [];
  return getWeeklySchedule().filter(e => e && String(e.group || '').trim().toLowerCase() === key);
}

function newScheduleEntry(day, time, group, level) {
  return {
    id: 'sch_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    day: day, time: time || '16:00', group: group, level: level || '',
    plan: { notes: '', exerciseUids: [], materialIds: [] }
  };
}

// A group's level (shown on its lessons). A level typed before 2026-10-04 (e.g. "A2") stays a choice.
const GROUP_LEVELS = ['Beginner', 'Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'IELTS'];
function groupLevelOptions(current) {
  const list = GROUP_LEVELS.slice();
  if (current && list.indexOf(current) === -1) list.push(current);
  return '<option value="">No level</option>' +
    list.map(l => '<option value="' + escapeForHtml(l) + '"' + (l === current ? ' selected' : '') + '>' + escapeForHtml(l) + '</option>').join('');
}

// Adding a group, or ✏️ on one: its name, lesson days and times, and level.
function openGroupEditor(groupId) {
  const groups = getStudentGroups();
  const g = groupId ? groups.find(x => x.id === groupId) : null;
  if (groupId && !g) return;
  const entries = g ? scheduleEntriesForGroup(g.name) : [];
  const byDay = {};
  entries.forEach(e => { if (!(e.day in byDay)) byDay[e.day] = e; });
  const anyTime = (entries[0] && entries[0].time) || '16:00';
  const level = (entries.find(e => e.level) || {}).level || '';
  const rows = GROUP_DAY_ORDER.map(d => {
    const on = d in byDay;
    return '<label class="gsched-day' + (on ? ' on' : '') + '" data-day="' + d + '">' +
      '<input type="checkbox"' + (on ? ' checked' : '') + '><span class="gsched-name">' + SCHEDULE_DAY_SHORT[d] + '</span>' +
      '<input type="time" value="' + escapeForHtml(on ? byDay[d].time : anyTime) + '"' + (on ? '' : ' disabled') + '></label>';
  }).join('');
  const m = taModal(g ? '✏️ ' + g.name : '➕ New group',
    '<label class="field-label">Group name</label>' +
    '<input type="text" class="gsched-group-name" placeholder="e.g. Group A">' +
    '<label class="field-label" style="margin-top:16px;">📅 Lesson days and times</label>' +
    '<p class="ta-modal-text">Tick the days this group has lessons. They show in "Upcoming Lessons" on the Dashboard every week.</p>' +
    '<div class="gsched-days">' + rows + '</div>' +
    '<label class="field-label" style="margin-top:16px;">Level</label>' +
    '<select class="gsched-level">' + groupLevelOptions(level) + '</select>' +
    '<div class="ta-modal-btns"><button type="button" class="mini-btn" data-act="cancel">Cancel</button><button type="button" class="mini-btn solid" data-act="ok">' + (g ? 'Save' : '➕ Add group') + '</button></div>',
    { wide: true });
  const nameEl = m.body.querySelector('.gsched-group-name');
  nameEl.value = g ? g.name : 'Group ' + (groups.length + 1);
  m.body.querySelectorAll('.gsched-day').forEach(row => {
    const box = row.querySelector('input[type="checkbox"]'), time = row.querySelector('input[type="time"]');
    box.addEventListener('change', () => { time.disabled = !box.checked; row.classList.toggle('on', box.checked); });
  });
  m.body.querySelector('[data-act="cancel"]').onclick = m.close;
  m.body.querySelector('[data-act="ok"]').onclick = () => {
    const name = nameEl.value.trim();
    if (!name) { showToast('Group name can\'t be empty.'); nameEl.focus(); return; }
    if (getStudentGroups().some(x => x.id !== groupId && x.name.trim().toLowerCase() === name.toLowerCase())) {
      showToast('There is already a group called "' + name + '".'); nameEl.focus(); return;
    }
    const days = {};
    m.body.querySelectorAll('.gsched-day').forEach(row => {
      if (row.querySelector('input[type="checkbox"]').checked) days[Number(row.dataset.day)] = row.querySelector('input[type="time"]').value || '16:00';
    });
    saveGroup(groupId, name, days, m.body.querySelector('.gsched-level').value.trim());
    m.close();
  };
  setTimeout(() => { nameEl.focus(); nameEl.select(); }, 30);
  return m;
}

// Saves a group and its lessons. days: { 1: '16:00', 3: '16:00' } (0 = Sunday).
function saveGroup(groupId, name, days, level) {
  const groups = getStudentGroups();
  let g = groupId ? groups.find(x => x.id === groupId) : null;
  const oldName = g ? g.name : name;
  if (!g) {
    let n = groups.length + 1, id = 'g' + n;
    while (groups.some(x => x.id === id)) { n++; id = 'g' + n; }
    g = { id: id, name: name };
    groups.push(g);
  } else {
    g.name = name;
  }
  saveStudentGroups(groups);
  // its lessons: keep the ones on days still ticked (and their lesson plans), add new days, take off the rest
  const key = String(oldName).trim().toLowerCase();
  const kept = [], usedDay = {};
  getWeeklySchedule().forEach(e => {
    if (!e || String(e.group || '').trim().toLowerCase() !== key) { kept.push(e); return; }
    if (e.day in days && !usedDay[e.day]) {
      usedDay[e.day] = true;
      kept.push(Object.assign({}, e, { group: name, time: days[e.day], level: level }));
    } else if (e.day in days) {
      kept.push(Object.assign({}, e, { group: name, level: level })); // a second lesson that day stays as it was
    } else {
      archiveLessonsTaught(e); // its past lessons still count
    }
  });
  GROUP_DAY_ORDER.forEach(d => { if (d in days && !usedDay[d]) kept.push(newScheduleEntry(d, days[d], name, level)); });
  saveWeeklySchedule(kept);
  refreshRosterViews();
  if (window.renderNextLessons) window.renderNextLessons();
  showToast((groupId ? 'Saved "' : 'Added group "') + name + '".', 'ok');
  return g.id;
}

function addStudentGroup() { return openGroupEditor(null); }
function renameStudentGroup(groupId) { return openGroupEditor(groupId); }

function deleteStudentGroup(groupId) {
  const groups = getStudentGroups();
  const g = groups.find(x => x.id === groupId);
  if (!g) return;
  const rosterBefore = getPointsRoster();
  const moved = rosterBefore.filter(s => s.group === groupId).length;
  // its lessons leave Upcoming Lessons too (lessons already taught still count)
  const scheduleBefore = getWeeklySchedule();
  const archivedBefore = localStorage.getItem('ta_lessons_archived');
  const gKey = g.name.trim().toLowerCase();
  const lessons = scheduleBefore.filter(e => e && String(e.group || '').trim().toLowerCase() === gKey);
  lessons.forEach(archiveLessonsTaught);
  saveWeeklySchedule(scheduleBefore.filter(e => lessons.indexOf(e) === -1));
  saveStudentGroups(groups.filter(x => x.id !== groupId));
  savePointsRoster(rosterBefore.map(s => s.group === groupId ? Object.assign({}, s, { group: '' }) : s));
  if (studentsOpenGroup === groupId) studentsOpenGroup = null;
  refreshRosterViews();
  if (window.renderNextLessons) window.renderNextLessons();
  // Students left without a group are placed in the first remaining one; note where each went.
  const movedTo = {};
  getPointsRoster().forEach(s => { if (rosterBefore.some(b => b.id === s.id && b.group === groupId)) movedTo[s.id] = s.group; });
  const dest = (getStudentGroups()[0] || {}).name;
  showUndoToast('Deleted "' + g.name + '"' + (moved ? ' — its ' + moved + ' student' + (moved === 1 ? '' : 's') + ' moved to ' + (dest ? '"' + dest + '"' : '"Not in a group"') + ' with their points.' : '.'), function () {
    const now = getStudentGroups();
    if (!now.some(x => x.id === groupId)) {
      now.splice(Math.min(groups.indexOf(g), now.length), 0, g);
      saveStudentGroups(now);
    }
    const ids = new Set(getWeeklySchedule().map(e => e.id));
    saveWeeklySchedule(getWeeklySchedule().concat(lessons.filter(e => !ids.has(e.id))));
    try { if (archivedBefore === null) localStorage.removeItem('ta_lessons_archived'); else localStorage.setItem('ta_lessons_archived', archivedBefore); } catch (e) { /* ignore */ }
    // put back the students that are still where the delete put them (anyone moved since stays put)
    savePointsRoster(getPointsRoster().map(s => (s.id in movedTo && s.group === movedTo[s.id]) ? Object.assign({}, s, { group: groupId }) : s));
    refreshRosterViews();
    if (window.renderNextLessons) window.renderNextLessons();
    showToast('"' + g.name + '" is back.', 'ok');
  });
}

function moveStudentToGroup(studentId, groupId) {
  savePointsRoster(getPointsRoster().map(s => s.id === studentId ? Object.assign({}, s, { group: groupId }) : s));
  refreshRosterViews();
}

// ✎ next to a student: their name and group (the ID stays the same).
function renameRosterStudent(studentId) {
  const st = getPointsRoster().find(s => s.id === studentId);
  if (!st) return;
  const groups = getStudentGroups();
  const m = taModal('✎ ' + st.name,
    '<label class="field-label">Name</label><input type="text" class="stu-edit-name">' +
    '<label class="field-label" style="margin-top:14px;">Group</label>' +
    '<select class="stu-edit-group">' + groups.map(g => '<option value="' + escapeForHtml(g.id) + '">' + escapeForHtml(g.name) + '</option>').join('') +
      (groups.some(g => g.id === st.group) ? '' : '<option value="">Not in a group</option>') + '</select>' +
    '<p class="ta-modal-text" style="margin-top:12px;">ID <b>' + escapeForHtml(st.id) + '</b> stays the same, and so do the points.</p>' +
    '<div class="ta-modal-btns"><button type="button" class="mini-btn" data-act="cancel">Cancel</button><button type="button" class="mini-btn solid" data-act="ok">Save</button></div>');
  const nameEl = m.body.querySelector('.stu-edit-name'), groupEl = m.body.querySelector('.stu-edit-group');
  nameEl.value = st.name;
  groupEl.value = groups.some(g => g.id === st.group) ? st.group : '';
  const save = () => {
    const clean = nameEl.value.trim();
    if (!clean) { showToast('Name can\'t be empty.'); nameEl.focus(); return; }
    savePointsRoster(getPointsRoster().map(s => s.id === studentId ? Object.assign({}, s, { name: clean, group: groupEl.value }) : s));
    m.close();
    refreshRosterViews();
  };
  nameEl.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
  m.body.querySelector('[data-act="cancel"]').onclick = m.close;
  m.body.querySelector('[data-act="ok"]').onclick = save;
  setTimeout(() => { nameEl.focus(); nameEl.select(); }, 30);
  return m;
}
function addPointsStudent() {
  const nameEl = document.getElementById('pt-student-name');
  const idEl = document.getElementById('pt-student-id');
  const groupEl = document.getElementById('pt-student-group');
  const name = nameEl.value.trim();
  const id = idEl.value.trim();
  const group = studentsOpenGroup || (groupEl ? groupEl.value : '') || ((getStudentGroups()[0] || {}).id || '');
  if (!name || !id) { showToast('Enter both a name and an ID.'); return; }
  const roster = getPointsRoster();
  const clash = roster.find(s => String(s.id).trim().toLowerCase() === id.toLowerCase());
  if (clash) { showToast('That ID is already used by ' + clash.name + '. Each student needs a unique ID.'); return; }
  roster.push({ name, id, group });
  savePointsRoster(roster);
  const anchor = idEl.getBoundingClientRect();
  refreshRosterViews();
  const gName = groupNameFor(group);
  showToast('Added ' + name + ' (ID ' + id + ')' + (gName ? ' to ' + gName : '') + '.', 'ok');
  taConfettiBurst(anchor.left, anchor.top, 14);
  const freshId = document.getElementById('pt-student-id');
  if (freshId) freshId.focus(); // ready for the next student
}

// "➕ Add student" shows the ID and Name boxes; they stay open for the next student until Cancel.
let studentsAddOpen = false;
function toggleAddStudentForm(open) {
  studentsAddOpen = !!open;
  renderStudentsList();
  const idEl = document.getElementById('pt-student-id');
  if (idEl) idEl.focus();
}

/* The Students page shows the groups as blocks. Tapping a block opens that
   group: the add-student form and its student list. */
let studentsOpenGroup = null;

function openStudentGroup(groupId) {
  studentsOpenGroup = groupId;
  studentsAddOpen = false;
  renderStudentsList();
  const panel = document.getElementById('panel-students');
  if (panel && panel.scrollIntoView) panel.scrollIntoView({ block: 'start' });
}
function closeStudentGroup() {
  studentsOpenGroup = null;
  renderStudentsList();
}

/* Lesson days, time and level for a group, taken from the weekly schedule
   when a lesson there has the same group name. */
function scheduleInfoForGroup(name) {
  const key = String(name || '').trim().toLowerCase();
  if (!key || typeof getWeeklySchedule !== 'function') return null;
  const entries = getWeeklySchedule().filter(e => e && String(e.group || '').trim().toLowerCase() === key);
  if (!entries.length) return null;
  const order = [1, 2, 3, 4, 5, 6, 0];
  const days = order.filter(d => entries.some(e => e.day === d)).map(d => SCHEDULE_DAY_SHORT[d]);
  const times = [...new Set(entries.map(e => e.time).filter(Boolean))];
  const withLevel = entries.find(e => e.level);
  return {
    days: days.join(' / '),
    time: times.length === 1 ? formatTimeDisplay(times[0]) : '',
    level: withLevel ? withLevel.level : '',
    colorId: (withLevel || entries[0]).id
  };
}

function renderStudentsList() {
  renderGroupSelect();
  const wrap = document.getElementById('studentsListWrap');
  if (!wrap) return;
  const buckets = getRosterByGroup();

  if (studentsOpenGroup !== null && !buckets.some(b => b.id === studentsOpenGroup)) studentsOpenGroup = null;

  /* ---------- one group opened: add students; each one's name (✎ 🗑), ID and points ---------- */
  if (studentsOpenGroup !== null) {
    const b = buckets.find(x => x.id === studentsOpenGroup);
    const info = b.unassigned ? null : scheduleInfoForGroup(b.name);
    const groupPts = b.students.reduce((a, st) => a + pointsTotalFor(st.id), 0);
    let html = '<div class="group-detail-head">' +
      '<div class="gd-left"><button class="mini-btn" type="button" onclick="closeStudentGroup()">← All groups</button>' +
      '<h3' + (b.unassigned ? '' : ' translate="no"') + '>' + escapeForHtml(b.name) + '</h3>' +
      (b.unassigned ? '' :
        '<button class="sp-icon-btn" type="button" title="Change name or lesson times" aria-label="Change name or lesson times" onclick="renameStudentGroup(' + jsAttr(b.id) + ')">✎</button>' +
        '<button class="sp-icon-btn danger" type="button" title="Delete group" aria-label="Delete group" onclick="deleteStudentGroup(' + jsAttr(b.id) + ')">🗑</button>') +
      '<span class="student-group-count">' + b.students.length + ' student' + (b.students.length === 1 ? '' : 's') + ' · <span data-group-pts="' + escapeForHtml(b.id) + '">🪙 ' + groupPts + '</span></span></div>';
    if (!b.unassigned) {
      const exCount = getRecentExercises().filter(e => e.groupId === b.id).length;
      html += '<div class="gd-actions">' +
        '<button class="mini-btn" type="button" onclick="taNavigate(\'my-exercises.html?group=\' + encodeURIComponent(' + jsAttr(b.id) + '))">📁 ' + exCount + ' exercise' + (exCount === 1 ? '' : 's') + '</button>' +
      '</div>';
    }
    html += '</div>';
    if (!b.unassigned) {
      html += '<div class="gd-schedule">📅 ' + (info && info.days
          ? escapeForHtml(info.days) + (info.time ? ' · ' + escapeForHtml(info.time) : '') + (info.level ? ' · ' + escapeForHtml(info.level) : '')
          : 'No lesson times yet') +
        ' <button class="link-btn" type="button" onclick="renameStudentGroup(' + jsAttr(b.id) + ')">' + (info && info.days ? 'Change' : 'Set lesson times') + '</button></div>';
      html += '<div class="title-field">' + (studentsAddOpen
        ? '<div class="roster-form-box sp-add-form">' +
            '<label class="field-label" for="pt-student-id">ID</label>' +
            '<input type="text" id="pt-student-id" placeholder="Unique ID (e.g. 101)" onkeydown="if(event.key===\'Enter\'){event.preventDefault();document.getElementById(\'pt-student-name\').focus();}">' +
            '<label class="field-label" for="pt-student-name">Name</label>' +
            '<input type="text" id="pt-student-name" placeholder="Student name" onkeydown="if(event.key===\'Enter\') addPointsStudent()">' +
            '<div class="sp-add-btns"><button class="mini-btn" type="button" onclick="toggleAddStudentForm(false)">Cancel</button>' +
            '<button class="mini-btn solid" type="button" onclick="addPointsStudent()">➕ Add</button></div>' +
          '</div>'
        : '<div class="sp-add-row"><button class="mini-btn solid" type="button" onclick="toggleAddStudentForm(true)">➕ Add student</button>' +
            '<button class="mini-btn" type="button" onclick="openBulkAddStudents()" title="Paste a whole class list, or choose a CSV/Excel-saved file">📋 Add many</button></div>') +
      '</div>';
    }
    html += '<div class="title-field">';
    html += b.students.length
      ? '<div class="sp-table"><div class="sp-head"><span>Name · ID</span><span>Points</span></div>' +
        b.students.map(s =>
          '<div class="roster-row sp-row" data-student-id="' + escapeForHtml(String(s.id)) + '">' +
            '<span class="sp-name"><strong translate="no">' + escapeForHtml(s.name) + '</strong>' +
              '<button class="sp-icon-btn" type="button" title="Change name or group" aria-label="Change name or group" onclick="renameRosterStudent(' + jsAttr(s.id) + ')">✎</button>' +
              '<button class="sp-icon-btn danger" type="button" title="Delete student" aria-label="Delete student" onclick="removePointsStudent(' + jsAttr(s.id) + ')">🗑</button>' +
              '<span class="sp-id" title="ID">' + escapeForHtml(s.id) + '</span></span>' +
            '<span class="points-cell">' +
              '<button class="pt-adjust-btn minus" type="button" title="Take points" onclick="showPointsAmountPopover(this, ' + jsAttr(s.id) + ', ' + jsAttr(s.name) + ', -1);">−</button>' +
              '<button class="pt-adjust-value sp-pts" type="button" title="See their points" data-pts-for="' + escapeForHtml(String(s.id)) + '" onclick="openStudentPoints(' + jsAttr(s.id) + ')">🪙 ' + pointsTotalFor(s.id) + '</button>' +
              '<button class="pt-adjust-btn plus" type="button" title="Give points" onclick="showPointsAmountPopover(this, ' + jsAttr(s.id) + ', ' + jsAttr(s.name) + ', 1);">+</button>' +
            '</span>' +
          '</div>'
        ).join('') + '</div>'
      : '<div class="empty-results">No students in this group yet. Add one above.</div>';
    html += '</div>';
    wrap.innerHTML = html;
    return;
  }

  /* ---------- all groups as blocks ---------- */
  let html = '<div class="groups-toolbar">' +
    '<label class="field-label" style="margin:0;">Groups</label>' +
    '<button class="mini-btn solid" type="button" onclick="addStudentGroup()">➕ Add group</button>' +
  '</div>';
  if (!buckets.length) {
    wrap.innerHTML = html + '<div class="empty-results">No groups yet. Add a group with its lesson days, then open it to add your students.</div>';
    return;
  }
  html += '<div class="group-block-list">';
  buckets.forEach(b => {
    const count = b.students.length;
    const info = b.unassigned ? null : scheduleInfoForGroup(b.name);
    let pill = '';
    if (info && info.level) {
      const pal = (typeof lessonColorForId === 'function') ? lessonColorForId(info.colorId) : null;
      pill = '<span class="lesson-level-pill"' + (pal ? ' style="background:' + pal.surface + '; color:' + pal.color + ';"' : '') + '>' + escapeForHtml(info.level) + '</span>';
    }
    const subParts = [count + ' student' + (count === 1 ? '' : 's')];
    if (info && info.days) subParts.push(info.days);
    if (info && info.time) subParts.push(info.time);
    if (!b.unassigned && !(info && info.days)) subParts.push('No lesson times yet');
    const pts = b.students.reduce((a, st) => a + pointsTotalFor(st.id), 0);
    html += '<div class="group-block' + (b.unassigned ? ' unassigned' : '') + '" role="button" tabindex="0" ' +
        'onclick="openStudentGroup(' + jsAttr(b.id) + ')" onkeydown="if(event.target===this&&(event.key===\'Enter\'||event.key===\' \')){event.preventDefault();openStudentGroup(' + jsAttr(b.id) + ');}">' +
      '<div class="group-block-main">' +
        '<div class="group-block-title"><b' + (b.unassigned ? '' : ' translate="no"') + '>' + escapeForHtml(b.name) + '</b>' + pill + '</div>' +
        '<div class="group-block-sub">' + subParts.map(escapeForHtml).join(' · ') + '</div>' +
      '</div>' +
      '<div class="group-block-side">' +
        '<span class="group-block-pts" data-group-pts="' + escapeForHtml(b.id) + '">🪙 ' + pts + '</span>' +
        (b.unassigned ? '' : '<button class="sp-icon-btn" type="button" title="Change name or lesson times" aria-label="Change name or lesson times" onclick="event.stopPropagation(); renameStudentGroup(' + jsAttr(b.id) + ')">✎</button>' +
          '<button class="sp-icon-btn danger" type="button" title="Delete group" aria-label="Delete group" onclick="event.stopPropagation(); deleteStudentGroup(' + jsAttr(b.id) + ')">🗑</button>') +
        '<span class="group-block-chevron" aria-hidden="true">›</span>' +
      '</div>' +
    '</div>';
  });
  html += '</div>';
  html += '<div class="sp-danger-row">' +
    '<button class="mini-btn danger" type="button" onclick="resetAllPoints()">🗑 Reset All Points</button>' +
    '<button class="mini-btn danger" type="button" onclick="deleteAllPointsEntirely()">🗑 Delete All Entirely</button>' +
  '</div>';
  wrap.innerHTML = html;
}

/* ================= ADD MANY STUDENTS =================
   Paste a class list (one student per line, "Name, ID" or copied straight
   from Excel/Google Sheets) or choose a CSV file. A student without an ID
   gets the next free number. Everyone goes into the open group. */
function parseStudentLines(text) {
  const looksLikeId = v => /^[A-Za-z0-9_\-.]{1,20}$/.test(v) && /\d/.test(v);
  const out = [];
  String(text || '').split(/\r?\n/).forEach(line => {
    const raw = line.replace(/^﻿/, '').trim();
    if (!raw) return;
    let parts = raw.split(/\t|;|,/).map(p => p.trim().replace(/^"(.*)"$/, '$1').trim()).filter(Boolean);
    const HEADER = /^(name|names|student|students|full ?name|first ?name|last ?name|surname|id|student ?id|ism|familiya|f\.?i\.?o\.?|no\.?|№|#)$/i;
    if (parts.every(p => HEADER.test(p))) return; // a header row like "Name, ID"
    if (parts.length === 1) {
      // "Ali Valiyev 101" or "101 Ali Valiyev"
      const words = parts[0].split(/\s+/);
      if (words.length > 1 && looksLikeId(words[words.length - 1])) parts = [words.slice(0, -1).join(' '), words[words.length - 1]];
      else if (words.length > 1 && looksLikeId(words[0])) parts = [words.slice(1).join(' '), words[0]];
    }
    let idAt = parts.findIndex(looksLikeId);
    if (idAt === -1 && parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) idAt = parts.length - 1;
    const id = idAt === -1 ? '' : parts[idAt];
    const name = parts.filter((p, i) => i !== idAt).join(' ').replace(/\s+/g, ' ').trim();
    if (!name) return;
    out.push({ name: name, id: id });
  });
  return out;
}

// Works out what adding these lines would do, without adding anything.
function planBulkStudents(lines) {
  const roster = getPointsRoster();
  const taken = new Set(roster.map(s => String(s.id).trim().toLowerCase()));
  let next = 101;
  roster.forEach(s => { const n = parseInt(s.id, 10); if (String(n) === String(s.id).trim() && n >= next) next = n + 1; });
  lines.forEach(l => { const n = parseInt(l.id, 10); if (String(n) === l.id && n >= next) next = n + 1; });
  return lines.map(l => {
    if (l.id) {
      const key = l.id.toLowerCase();
      if (taken.has(key)) {
        const who = roster.find(s => String(s.id).trim().toLowerCase() === key);
        return { name: l.name, id: l.id, skip: who ? 'ID already used by ' + who.name : 'ID repeated in this list' };
      }
      taken.add(key);
      return { name: l.name, id: l.id };
    }
    while (taken.has(String(next))) next++;
    const id = String(next++);
    taken.add(id);
    return { name: l.name, id: id, auto: true };
  });
}

function openBulkAddStudents() {
  const groupId = studentsOpenGroup;
  const gName = groupNameFor(groupId) || 'this group';
  const m = taModal('📋 Add many students to ' + gName,
    '<p class="ta-modal-text">One student per line: <b>Name, ID</b>. You can paste two columns straight from Excel or Google Sheets. Students without an ID get the next free number.</p>' +
    '<textarea class="bulk-students-input" rows="8" placeholder="Ali Valiyev, 101&#10;Madina Karimova, 102&#10;Jasur Toshmatov"></textarea>' +
    '<label class="mini-btn bulk-file-btn">📄 Or choose a CSV file<input type="file" accept=".csv,.txt,text/csv,text/plain" style="display:none;"></label>' +
    '<div class="bulk-preview"></div>' +
    '<div class="ta-modal-btns"><button type="button" class="mini-btn" data-act="cancel">Cancel</button><button type="button" class="mini-btn solid" data-act="ok" disabled>Add students</button></div>',
    { wide: true });
  const ta = m.body.querySelector('textarea');
  const prev = m.body.querySelector('.bulk-preview');
  const ok = m.body.querySelector('[data-act="ok"]');
  let plan = [];
  const render = () => {
    plan = planBulkStudents(parseStudentLines(ta.value));
    const adding = plan.filter(p => !p.skip);
    ok.disabled = !adding.length;
    ok.textContent = adding.length ? 'Add ' + adding.length + ' student' + (adding.length === 1 ? '' : 's') : 'Add students';
    prev.innerHTML = plan.length
      ? plan.map(p => '<div class="bulk-row' + (p.skip ? ' skip' : '') + '"><span>' + escapeForHtml(p.name) + '</span>' +
          '<span class="bulk-id">ID ' + escapeForHtml(p.id) + (p.auto ? ' <em>new</em>' : '') + '</span>' +
          (p.skip ? '<span class="bulk-note">⚠️ ' + escapeForHtml(p.skip) + ' — skipped</span>' : '') + '</div>').join('')
      : '';
  };
  ta.addEventListener('input', render);
  m.body.querySelector('input[type="file"]').addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const r = new FileReader();
    r.onload = () => { ta.value = String(r.result || ''); render(); };
    r.readAsText(file);
  });
  m.body.querySelector('[data-act="cancel"]').onclick = m.close;
  ok.onclick = () => {
    const adding = plan.filter(p => !p.skip).map(p => ({ name: p.name, id: p.id, group: groupId || '' }));
    if (!adding.length) return;
    savePointsRoster(getPointsRoster().concat(adding));
    m.close();
    refreshRosterViews();
    const ids = new Set(adding.map(a => a.id));
    showUndoToast('Added ' + adding.length + ' student' + (adding.length === 1 ? '' : 's') + ' to ' + gName + '.', function () {
      savePointsRoster(getPointsRoster().filter(s => !ids.has(s.id)));
      refreshRosterViews();
      showToast('Those students were taken off again.', 'ok');
    });
    taConfettiBurst(window.innerWidth / 2, 80, 24);
  };
  setTimeout(() => ta.focus(), 30);
}

/* ================= PAGE START ================= */
taOnTab('students', function () {
  studentsOpenGroup = null;
  renderStudentsList();
  if (window.startPointsSync) window.startPointsSync(getPointsBoardCode());
});
taStartPage('students');
