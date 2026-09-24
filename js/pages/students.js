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
  const members = getPointsRoster().filter(s => s.group === groupId);
  const msg = members.length
    ? 'Delete the group "' + g.name + '"? Its ' + members.length + ' student' + (members.length === 1 ? '' : 's') + ' will move to ' + ((groups.filter(x => x.id !== groupId)[0] || {}).name ? '"' + groups.filter(x => x.id !== groupId)[0].name + '"' : '"Not in a group"') + ', with their points kept.'
    : 'Delete the empty group "' + g.name + '"?';
  if (!confirm(msg)) return;
  saveStudentGroups(groups.filter(x => x.id !== groupId));
  savePointsRoster(getPointsRoster().map(s => s.group === groupId ? Object.assign({}, s, { group: '' }) : s));
  if (studentsOpenGroup === groupId) studentsOpenGroup = null;
  refreshRosterViews();
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
      html += '<div class="gd-actions">' +
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
      '</div></div>';
    }
    html += '<div class="title-field"><label class="field-label">All students</label>';
    html += b.students.length
      ? b.students.map(s =>
          '<div class="roster-row">' +
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

/* ================= PAGE START ================= */
taOnTab('students', function () { studentsOpenGroup = null; renderStudentsList(); });
taStartPage('students');
