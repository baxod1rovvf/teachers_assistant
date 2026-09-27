function addStudentGroup() {
  const groups = getStudentGroups();
  const suggested = 'Group ' + (groups.length + 1);
  const name = prompt('Name for the new group:', suggested);
  if (name === null) return;
  const clean = name.trim();
  if (!clean) { showToast('Group name can\'t be empty.'); return; }
  let n = groups.length + 1, id = 'g' + n;
  while (groups.some(g => g.id === id)) { n++; id = 'g' + n; }
  groups.push({ id: id, name: clean });
  saveStudentGroups(groups);
  refreshRosterViews();
  const sel = document.getElementById('pt-student-group');
  if (sel) sel.value = id;
  showToast('Added group "' + clean + '".', 'ok');
}

function renameStudentGroup(groupId) {
  const groups = getStudentGroups();
  const g = groups.find(x => x.id === groupId);
  if (!g) return;
  const name = prompt('Rename group:', g.name);
  if (name === null) return;
  const clean = name.trim();
  if (!clean) { showToast('Group name can\'t be empty.'); return; }
  g.name = clean;
  saveStudentGroups(groups);
  refreshRosterViews();
}

function deleteStudentGroup(groupId) {
  const groups = getStudentGroups();
  const g = groups.find(x => x.id === groupId);
  if (!g) return;
  const rosterBefore = getPointsRoster();
  const moved = rosterBefore.filter(s => s.group === groupId).length;
  saveStudentGroups(groups.filter(x => x.id !== groupId));
  savePointsRoster(rosterBefore.map(s => s.group === groupId ? Object.assign({}, s, { group: '' }) : s));
  if (studentsOpenGroup === groupId) studentsOpenGroup = null;
  refreshRosterViews();
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
    // put back the students that are still where the delete put them (anyone moved since stays put)
    savePointsRoster(getPointsRoster().map(s => (s.id in movedTo && s.group === movedTo[s.id]) ? Object.assign({}, s, { group: groupId }) : s));
    refreshRosterViews();
    showToast('"' + g.name + '" is back.', 'ok');
  });
}

function moveStudentToGroup(studentId, groupId) {
  savePointsRoster(getPointsRoster().map(s => s.id === studentId ? Object.assign({}, s, { group: groupId }) : s));
  refreshRosterViews();
}

function renameRosterStudent(studentId) {
  const roster = getPointsRoster();
  const st = roster.find(s => s.id === studentId);
  if (!st) return;
  const name = prompt('Student name (their ID ' + st.id + ' stays the same):', st.name);
  if (name === null) return;
  const clean = name.trim();
  if (!clean) { showToast('Name can\'t be empty.'); return; }
  const oldName = st.name;
  st.name = clean;
  savePointsRoster(roster);
  refreshRosterViews();
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
  const freshName = document.getElementById('pt-student-name');
  if (freshName) freshName.focus();
}

/* The Students page shows the groups as blocks. Tapping a block opens that
   group: the add-student form and its student list. */
let studentsOpenGroup = null;

function openStudentGroup(groupId) {
  studentsOpenGroup = groupId;
  renderStudentsList();
  const nameEl = document.getElementById('pt-student-name');
  if (nameEl) nameEl.focus();
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
  const groups = getStudentGroups();
  const buckets = getRosterByGroup();

  if (studentsOpenGroup !== null && !buckets.some(b => b.id === studentsOpenGroup)) studentsOpenGroup = null;

  /* ---------- one group opened ---------- */
  if (studentsOpenGroup !== null) {
    const b = buckets.find(x => x.id === studentsOpenGroup);
    const moveOptions = groups.map(g => '<option value="' + escapeForHtml(g.id) + '"' + (g.id === b.id ? ' selected' : '') + '>' + escapeForHtml(g.name) + '</option>').join('') +
      (b.unassigned ? '<option value="" selected>Not in a group</option>' : '');
    let html = '<div class="group-detail-head">' +
      '<div class="gd-left"><button class="mini-btn" type="button" onclick="closeStudentGroup()">← All groups</button>' +
      '<h3>' + escapeForHtml(b.name) + '</h3>' +
      '<span class="student-group-count">' + b.students.length + ' student' + (b.students.length === 1 ? '' : 's') + '</span></div>';
    if (!b.unassigned) {
      const exCount = getRecentExercises().filter(e => e.groupId === b.id).length;
      html += '<div class="gd-actions">' +
        '<button class="mini-btn" type="button" onclick="taNavigate(\'my-exercises.html?group=\' + encodeURIComponent(' + jsAttr(b.id) + '))">📁 ' + exCount + ' exercise' + (exCount === 1 ? '' : 's') + '</button>' +
        '<button class="mini-btn" type="button" onclick="renameStudentGroup(' + jsAttr(b.id) + ')">✏️ Rename</button>' +
        '<button class="mini-btn danger" type="button" onclick="deleteStudentGroup(' + jsAttr(b.id) + ')">🗑 Delete group</button>' +
      '</div>';
    }
    html += '</div>';
    if (!b.unassigned) {
      html += '<div class="title-field"><div class="roster-form-box">' +
        '<input type="text" id="pt-student-name" placeholder="Student name" style="flex:1; min-width:140px;">' +
        '<input type="text" id="pt-student-id" placeholder="Unique ID (e.g. 101)" style="flex:1; min-width:120px;" onkeydown="if(event.key===\'Enter\') addPointsStudent()">' +
        '<button class="mini-btn" type="button" onclick="addPointsStudent()">➕ Add Student</button>' +
        '<button class="mini-btn solid" type="button" onclick="openBulkAddStudents()" title="Paste a whole class list, or choose a CSV/Excel-saved file">📋 Add many</button>' +
      '</div></div>';
    }
    html += '<div class="title-field"><label class="field-label">All students</label>';
    html += b.students.length
      ? b.students.map(s =>
          '<div class="roster-row" data-student-id="' + escapeForHtml(String(s.id)) + '">' +
            '<span><strong>' + escapeForHtml(s.name) + '</strong> — ID ' + escapeForHtml(s.id) + '</span>' +
            '<span class="roster-pts">🪙 ' + pointsTotalFor(s.id) + ' pts</span>' +
            '<div class="roster-actions">' +
              '<select class="group-select" aria-label="Move ' + escapeForHtml(s.name) + ' to another group" title="Move to another group" onchange="moveStudentToGroup(' + jsAttr(s.id) + ', this.value)">' + moveOptions + '</select>' +
              '<button class="mini-btn" type="button" onclick="renameRosterStudent(' + jsAttr(s.id) + ')">Edit name</button>' +
              '<button class="mini-btn danger" type="button" onclick="removePointsStudent(' + jsAttr(s.id) + ')">Remove</button>' +
            '</div>' +
          '</div>'
        ).join('')
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
    wrap.innerHTML = html + '<div class="empty-results">No groups yet. Add a group, then open it to add your students.</div>';
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
    const subParts = [count + ' student(s)'];
    if (info && info.days) subParts.push(info.days);
    if (info && info.time) subParts.push(info.time);
    const pts = b.students.reduce((a, st) => a + pointsTotalFor(st.id), 0);
    html += '<div class="group-block' + (b.unassigned ? ' unassigned' : '') + '" role="button" tabindex="0" ' +
        'onclick="openStudentGroup(' + jsAttr(b.id) + ')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();openStudentGroup(' + jsAttr(b.id) + ');}">' +
      '<div class="group-block-main">' +
        '<div class="group-block-title"><b>' + escapeForHtml(b.name) + '</b>' + pill + '</div>' +
        '<div class="group-block-sub">' + subParts.map(escapeForHtml).join(' · ') + '</div>' +
      '</div>' +
      '<div class="group-block-side">' +
        '<span class="group-block-pts">🪙 ' + pts + '</span>' +
        (b.unassigned ? '' : '<button class="mini-btn" type="button" onclick="event.stopPropagation(); renameStudentGroup(' + jsAttr(b.id) + ')">Edit</button>') +
        '<span class="group-block-chevron" aria-hidden="true">›</span>' +
      '</div>' +
    '</div>';
  });
  html += '</div>';
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
taOnTab('students', function () { studentsOpenGroup = null; renderStudentsList(); });
taStartPage('students');
