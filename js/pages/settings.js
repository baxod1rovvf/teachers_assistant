function addWeeklyScheduleEntry() {
  const dayEl = document.getElementById('sched-day');
  const timeEl = document.getElementById('sched-time');
  const groupEl = document.getElementById('sched-group');
  const levelEl = document.getElementById('sched-level');
  const group = (groupEl.value || '').trim();
  if (!group) { showToast('Please enter a group name.'); return; }
  const list = getWeeklySchedule();
  list.push({
    id: 'sch_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    day: parseInt(dayEl.value, 10),
    time: timeEl.value || '16:00',
    group: group,
    level: (levelEl.value || '').trim(),
    plan: { notes: '', exerciseUids: [], materialIds: [] }
  });
  saveWeeklySchedule(list);
  groupEl.value = '';
  levelEl.value = '';
  renderWeeklyScheduleSettings();
  renderNextLessons();
  showToast('Lesson added to your weekly schedule.', 'ok');
}
function deleteWeeklyScheduleEntry(id) {
  saveWeeklySchedule(getWeeklySchedule().filter(e => e.id !== id));
  renderWeeklyScheduleSettings();
  renderNextLessons();
}
function renderWeeklyScheduleSettings() {
  const wrap = document.getElementById('weeklyScheduleWrap');
  if (!wrap) return;
  const list = getWeeklySchedule();
  if (!list.length) { wrap.innerHTML = '<div class="empty-results">No weekly lessons added yet.</div>'; return; }
  const sorted = list.slice().sort((a, b) => (a.day - b.day) || String(a.time).localeCompare(String(b.time)));
  wrap.innerHTML = sorted.map(e => {
    const levelBadge = e.level ? ' <span class="badge-type">' + escapeForHtml(e.level) + '</span>' : '';
    return '<div class="recent-exercise-row">' +
      '<div class="recent-exercise-info">' +
        '<div class="recent-exercise-title">' + escapeForHtml(e.group || 'Untitled group') + levelBadge + '</div>' +
        '<div class="recent-exercise-date">' + SCHEDULE_DAY_NAMES[e.day] + ' · ' + formatTimeDisplay(e.time) + '</div>' +
      '</div>' +
      '<div class="recent-exercise-actions">' +
        '<button class="mini-btn" type="button" onclick="openLessonPlanModal(' + jsAttr(e.id) + ')">📝 Plan</button>' +
        '<button class="mini-btn danger" type="button" onclick="deleteWeeklyScheduleEntry(' + jsAttr(e.id) + ')">🗑 Delete</button>' +
      '</div>' +
    '</div>';
  }).join('');
}
window.renderWeeklyScheduleSettings = renderWeeklyScheduleSettings;

/* ================= SHARE APP =================
   The app is a website now, so sharing it means sharing its link. A
   colleague signs in with their own account (made in the Control Panel),
   so their data stays separate from yours. */
function shareTeachersAssistant() {
  const link = new URL(taAddressFor('index.html'), location.href).href;
  const done = () => showToast('App link copied — send it to your colleague.', 'ok');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(done, () => prompt('Copy this link and send it to your colleague:', link));
  } else {
    prompt('Copy this link and send it to your colleague:', link);
  }
}

/* ================= PAGE START ================= */
taOnTab('settings', function () {
  renderWeeklyScheduleSettings();
  if (location.hash === '#schedule') scrollToScheduleSettings();
});
taStartPage('settings');
(function () {
  const nameEl = document.getElementById('settings-teacher-name');
  if (nameEl) nameEl.value = getTeacherName();
  const loginEl = document.getElementById('settingsAccountLogin');
  if (loginEl) loginEl.textContent = taCurrentLogin() || '—';
})();
