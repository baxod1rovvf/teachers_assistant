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
  const removed = getWeeklySchedule().find(e => e.id === id);
  if (removed) archiveLessonsTaught(removed); // its past lessons still count
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

/* ================= INSTALL ================= */
function renderInstallSection() {
  const el = document.getElementById('installSectionBody');
  if (!el) return;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const p = t => '<p style="font-size:0.85rem; color:var(--ink-soft); margin-bottom:10px;">' + t + '</p>';
  if (taIsInstalled()) {
    el.innerHTML = p('✅ You\'re using the installed app.');
  } else if (taInstallPrompt) {
    el.innerHTML = p('Add Teacher\'s Assistant to your home screen or desktop. It opens in its own window, starts faster, and still opens without internet (sync catches up once you\'re back online).') +
      '<button class="mini-btn solid" type="button" onclick="taInstallApp()">📲 Install the app</button>';
  } else if (ios) {
    el.innerHTML = p('On iPhone or iPad: open this site in <b>Safari</b>, tap the <b>Share</b> button (the square with an arrow), then <b>Add to Home Screen</b>.');
  } else {
    el.innerHTML = p('In Chrome or Edge, use the install icon at the right end of the address bar, or the browser menu → <b>Install Teacher\'s Assistant</b> (on Android: menu → <b>Add to Home screen</b>). The button appears here when your browser is ready to install.');
  }
}
window.renderInstallSection = renderInstallSection;

/* ================= BACKUP =================
   One file with everything that belongs to this account. Restoring writes
   it back (cloud sync then sends it to your other devices). The current
   data is downloaded first, so a restore can always be taken back. */
const TA_BACKUP_KEYS = ['ta_student_groups', 'ta_points_roster', 'ta_weekly_schedule', 'ta_recent_exercises',
  'ta_exercise_html_cache', 'ta_results', 'ta_code_resets', 'ta_active_code', 'ta_points_code',
  'ta_teacher_name', 'ta_avatar', 'ta_lessons_archived', 'ta_design_day', 'ta_design_night', 'ta_ui_style',
  'ta_theme', 'ta_sound_enabled', 'ta_builder_drafts', 'ta_sentence_ratings', 'ta_checked_completions', 'ta_lessons_ready'];
const LS_LAST_BACKUP = 'ta_last_backup_at';

function buildBackup() {
  const data = {};
  TA_BACKUP_KEYS.forEach(k => {
    const v = localStorage.getItem(k);
    if (v !== null) data[k] = v;
  });
  return { app: 'teachers-assistant', kind: 'backup', version: 1, login: taCurrentLogin() || '', createdAt: new Date().toISOString(), data: data };
}

function backupFilename(when) {
  const d = new Date(when);
  const pad = n => String(n).padStart(2, '0');
  return 'TeachersAssistant_backup_' + (taCurrentLogin() || 'me') + '_' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '_' + pad(d.getHours()) + pad(d.getMinutes()) + '.json';
}

function saveBackupFile(backup, suffix) {
  const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = backupFilename(backup.createdAt).replace(/\.json$/, (suffix || '') + '.json');
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// The backup also carries the results from the database (see taResultsForBackup
// in firebase.js), so results deleted there can be put back.
async function downloadBackup() {
  const backup = buildBackup();
  showToast('Preparing the backup…');
  let results = null;
  try {
    const fn = await taWaitFor('taResultsForBackup', 9000);
    if (fn) results = await Promise.race([fn(), new Promise(r => setTimeout(() => r(null), 30000))]);
  } catch (e) { results = null; }
  if (results) backup.results = results;
  saveBackupFile(backup);
  try { localStorage.setItem(LS_LAST_BACKUP, backup.createdAt); } catch (e) { /* ignore */ }
  renderBackupInfo();
  if (window.taBackupReminderDone) window.taBackupReminderDone();
  showToast(results ? 'Backup downloaded, with ' + results.length + ' results from the database. Keep the file somewhere safe.'
    : 'Backup downloaded — but without the database results (no connection). Try again when online.', results ? 'ok' : '');
}

function backupSummary(data) {
  const count = k => { try { const v = JSON.parse(data[k] || '[]'); return Array.isArray(v) ? v.length : 0; } catch (e) { return 0; } };
  const n = (x, word) => x + ' ' + word + (x === 1 ? '' : 's');
  return [n(count('ta_points_roster'), 'student'), n(count('ta_student_groups'), 'group'), n(count('ta_recent_exercises'), 'exercise'),
    n(count('ta_weekly_schedule'), 'weekly lesson'), n(count('ta_results'), 'result')].join(' · ');
}

function renderBackupInfo() {
  const el = document.getElementById('backupLastInfo');
  if (!el) return;
  let at = null;
  try { at = localStorage.getItem(LS_LAST_BACKUP); } catch (e) { at = null; }
  el.textContent = at ? 'Last backup from this device: ' + fmtDate(at) + '.' : 'You haven\'t downloaded a backup from this device yet.';
}

function onBackupFileChosen(input) {
  const file = input.files && input.files[0];
  input.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    let backup = null;
    try { backup = JSON.parse(reader.result); } catch (e) { backup = null; }
    if (!backup || backup.app !== 'teachers-assistant' || backup.kind !== 'backup' || !backup.data || typeof backup.data !== 'object') {
      showToast('That file isn\'t a Teacher\'s Assistant backup.');
      return;
    }
    const data = {};
    TA_BACKUP_KEYS.forEach(k => { if (typeof backup.data[k] === 'string') data[k] = backup.data[k]; });
    const results = Array.isArray(backup.results) ? backup.results : [];
    const other = backup.login && taCurrentLogin() && backup.login.toUpperCase() !== taCurrentLogin().toUpperCase();
    const m = taModal('⬆ Restore this backup?',
      '<p class="ta-modal-text">Made <b>' + escapeForHtml(fmtDate(backup.createdAt)) + '</b>' + (backup.login ? ' from account <b>' + escapeForHtml(backup.login) + '</b>' : '') + '.</p>' +
      '<p class="ta-modal-text">' + escapeForHtml(backupSummary(data)) + '</p>' +
      (other ? '<p class="ta-modal-text warn">This backup is from a different account. Restoring puts its data into <b>' + escapeForHtml(taCurrentLogin()) + '</b>.</p>' : '') +
      (results.length ? '<label class="ta-modal-text backup-pick"><input type="checkbox" data-pick="data" checked> Students, groups, exercises, lessons and settings — <i>replaces what\'s in your account now</i> (your current data is downloaded first, so you can go back)</label>' +
        '<label class="ta-modal-text backup-pick"><input type="checkbox" data-pick="results" checked> Put back results that were deleted from the database — <b>' + results.length + '</b> result' + (results.length === 1 ? '' : 's') + ' in this file; the ones still there are left as they are</label>'
      : '<p class="ta-modal-text">It replaces what\'s in your account now. Your current data is downloaded as a backup file first, so you can go back.</p>') +
      '<div class="ta-modal-btns"><button type="button" class="mini-btn" data-act="cancel">Cancel</button><button type="button" class="mini-btn solid" data-act="ok">Restore</button></div>');
    m.body.querySelector('[data-act="cancel"]').onclick = m.close;
    m.body.querySelector('[data-act="ok"]').onclick = async () => {
      const pick = k => { const el = m.body.querySelector('[data-pick="' + k + '"]'); return el ? el.checked : k === 'data'; };
      const doData = pick('data'), doResults = results.length > 0 && pick('results');
      if (!doData && !doResults) return;
      m.close();
      if (doResults) {
        showToast('Putting back results…');
        let r = null;
        try { const fn = await taWaitFor('taRestoreResults', 9000); r = fn ? await fn(results) : null; } catch (e) { r = null; }
        if (!r) { showToast('Could not reach the database. Check your internet connection and try again.'); return; }
        const parts = [r.added + ' result' + (r.added === 1 ? '' : 's') + ' put back', r.there + ' already there'];
        if (r.hidden) parts.push(r.hidden + ' left out (you deleted all results of that exercise yourself)');
        if (r.failed) parts.push(r.failed + ' refused by the database');
        await new Promise(res => {
          const done = taModal(r.failed ? '⚠️ Results partly put back' : '✅ Results put back', '<p class="ta-modal-text" id="restoreResultsInfo">' + escapeForHtml(parts.join(' · ')) + '.</p>' +
            '<div class="ta-modal-btns"><button type="button" class="mini-btn solid" data-act="ok">OK</button></div>', { onClose: res });
          done.body.querySelector('[data-act="ok"]').onclick = done.close;
        });
        if (!doData) return;
      }
      saveBackupFile(buildBackup(), '_before-restore'); // the way back
      TA_BACKUP_KEYS.forEach(k => {
        try {
          if (k in data) localStorage.setItem(k, data[k]);
          else if (k !== 'ta_theme' && k !== 'ta_sound_enabled') localStorage.removeItem(k);
        } catch (e) { /* storage full: the rest still restores */ }
      });
      showToast('✅ Backup restored. Reloading…', 'ok');
      try { if (window.taSync) await Promise.race([window.taSync.flush(), new Promise(r => setTimeout(r, 4000))]); } catch (e) { /* sync catches up later */ }
      setTimeout(() => location.reload(), 600);
    };
  };
  reader.onerror = () => showToast('Could not read that file.');
  reader.readAsText(file);
}

/* ================= PAGE START ================= */
taOnTab('settings', function () {
  renderWeeklyScheduleSettings();
  if (location.hash === '#schedule') scrollToScheduleSettings();
  renderBackupInfo();
  renderInstallSection();
  const langPick = document.getElementById('settingsLangPick');
  if (langPick) langPick.innerHTML = taLangPickerHtml();
  if (location.hash === '#backup') setTimeout(function () {
    const el = document.getElementById('settingsBackupSection');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
  if (location.hash === '#install') setTimeout(function () {
    const el = document.getElementById('settingsInstallSection');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
  if (location.hash === '#language') setTimeout(function () {
    const el = document.getElementById('settingsLanguageSection');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
  if (location.hash === '#backup') setTimeout(function () {
    const el = document.getElementById('settingsBackupSection');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
});
taStartPage('settings');
(function () {
  const nameEl = document.getElementById('settings-teacher-name');
  if (nameEl) nameEl.value = getTeacherName();
  const loginEl = document.getElementById('settingsAccountLogin');
  if (loginEl) loginEl.textContent = taCurrentLogin() || '—';
})();
