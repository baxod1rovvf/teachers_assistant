
/* Groups exercises by day, using the same relative-day labelling the rest
   of the app already uses elsewhere ("Today", "Yesterday", then a count
   with the actual date for anything older). */
function getRelativeDayLabel(iso) {
  try {
    const d = new Date(iso);
    const today = new Date();
    const startOfDay = dt => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    const diffDays = Math.round((startOfDay(today) - startOfDay(d)) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (diffDays > 1) return diffDays + ' days ago (' + dateStr + ')';
    return dateStr; // future-dated, shouldn't normally happen
  } catch (e) { return 'Unknown date'; }
}

let myexTypeFilter = ''; // '' = every type

function renderRecentExercises() {
  const wrap = document.getElementById('recentExercisesWrap');
  if (!wrap) return;
  const list = getRecentExercises();
  const toolbar = document.getElementById('myexToolbar');
  const chipsEl = document.getElementById('myexTypeChips');
  if (toolbar) toolbar.style.display = list.length ? '' : 'none';
  if (!list.length) {
    if (chipsEl) chipsEl.innerHTML = '';
    wrap.innerHTML = '<div class="empty-results">No exercises created yet in this browser.</div>';
    return;
  }

  // one chip per exercise type that's in the list, most used first
  const typeCounts = {};
  list.forEach(item => { typeCounts[item.typeLabel] = (typeCounts[item.typeLabel] || 0) + 1; });
  const types = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a]);
  if (myexTypeFilter && !typeCounts[myexTypeFilter]) myexTypeFilter = '';
  if (chipsEl) {
    chipsEl.innerHTML = types.length > 1
      ? ['', ...types].map(t =>
          '<button type="button" class="myex-type-chip' + (t === myexTypeFilter ? ' active' : '') + '" onclick="setMyexTypeFilter(' + jsAttr(t) + ')">' +
            escapeForHtml(t || 'All') + '<span class="n">' + (t ? typeCounts[t] : list.length) + '</span></button>'
        ).join('')
      : '';
  }

  const searchEl = document.getElementById('myexSearchInput');
  const words = (searchEl ? searchEl.value : '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = item => {
    if (myexTypeFilter && item.typeLabel !== myexTypeFilter) return false;
    if (!words.length) return true;
    const hay = [item.title, item.typeLabel, item.requiredCode, item.contentSummary].join('\n').toLowerCase();
    return words.every(w => hay.indexOf(w) !== -1);
  };

  let html = '';
  let currentGroup = null;
  let shown = 0;
  list.forEach((item, idx) => {
    if (!matches(item)) return;
    shown++;
    const groupLabel = getRelativeDayLabel(item.date);
    if (groupLabel !== currentGroup) {
      currentGroup = groupLabel;
      html += '<div class="recent-exercise-daygroup">' + escapeForHtml(groupLabel) + '</div>';
    }
    const dateStr = fmtDate(item.date);
    const disabledBadge = item.disabled
      ? '<span class="badge-type" style="background:rgba(232,103,74,0.14); color:var(--danger);">Points off</span>'
      : '<span class="badge-type">' + escapeForHtml(item.typeLabel) + '</span>';
    const disableBtn = item.disabled
      ? ''
      : '<button class="mini-btn danger" type="button" onclick="disableRecentExercisePoints(' + idx + ')">🚫 Disable Points</button>';
    const codeLine = '<div class="recent-exercise-date">' + (item.requiredCode ? 'Code: ' + escapeForHtml(item.requiredCode) : 'No code set') + ' &middot; ' + dateStr + '</div>';
    const hasHtml = !!getCachedExerciseHtml(item.uid);
    const openBtn = hasHtml
      ? '<button class="mini-btn" type="button" onclick="redownloadRecentExercise(' + idx + ')">📥 Redownload</button>'
      : '<span class="unavailable-hint">File not cached</span>';
    const againBtn = exerciseLoadFor(item)
      ? '<button class="mini-btn solid" type="button" onclick="useRecentExerciseAgain(' + idx + ')" title="Open this exercise in its builder, filled in, to change it or make a new version">✏️ Use again</button>'
      : '';
    const answersBtn = item.contentSummary
      ? '<button class="mini-btn" type="button" onclick="viewRecentExerciseAnswers(' + idx + ')">📝 Answers</button>'
      : '';
    const separateBtn = (item.mergedItems && item.mergedItems.length)
      ? '<button class="mini-btn" type="button" onclick="separateHomeworkOrClass(' + idx + ')">🔀 Separate</button>'
      : '';
    html +=
      '<div class="recent-exercise-row" data-uid="' + escapeForHtml(item.uid || '') + '">' +
        '<div class="recent-exercise-info">' +
          '<div class="recent-exercise-title">' + escapeForHtml(item.title) + ' ' + disabledBadge + '</div>' +
          codeLine +
        '</div>' +
        '<div class="recent-exercise-actions">' +
          againBtn +
          openBtn +
          '<button class="mini-btn" type="button" onclick="shareRecentExercise(' + idx + ')" title="Message and file to send to students, or show the code on the board">📤 Share</button>' +
          answersBtn +
          separateBtn +
          '<button class="mini-btn" type="button" onclick="viewRecentExerciseResults(' + idx + ')">📊 View Results</button>' +
          disableBtn +
          '<button class="mini-btn danger" type="button" onclick="deleteRecentExercise(' + idx + ')">🗑 Delete</button>' +
        '</div>' +
      '</div>';
  });
  const countEl = document.getElementById('myexCount');
  const filtered = words.length || myexTypeFilter;
  if (countEl) countEl.textContent = filtered ? shown + ' of ' + list.length : list.length + ' exercise' + (list.length === 1 ? '' : 's');
  wrap.innerHTML = shown
    ? html
    : '<div class="empty-results">Nothing matches' + (words.length ? ' “' + escapeForHtml(searchEl.value.trim()) + '”' : '') + (myexTypeFilter ? ' in ' + escapeForHtml(myexTypeFilter) : '') + '. ' +
      '<button class="mini-btn" type="button" onclick="clearMyexFilters()">Show all</button></div>';
}

function setMyexTypeFilter(type) {
  myexTypeFilter = type;
  renderRecentExercises();
}
function clearMyexFilters() {
  myexTypeFilter = '';
  const el = document.getElementById('myexSearchInput');
  if (el) el.value = '';
  renderRecentExercises();
}

/* ---------- Use again ----------
   New exercises keep their whole builder form (builderState). Older ones
   only kept their word list (contentSummary), which is enough to refill
   the list builders. */
const MYEX_SUMMARY_BUILDERS = {
  'Word Order': { tab: 'wordorder', p: 'wo', row: line => line },
  'Make a Word': { tab: 'makeaword', p: 'maw', row: line => line },
  'Sentences': { tab: 'sentences', p: 'sn', row: line => line },
  'Spelling': { tab: 'spelling', p: 'sp', row: line => [line, []] },
  'Pronunciation': { tab: 'pronunciation', p: 'pr', row: line => [line, '', ''] },
  'Test': { tab: 'test', p: 'ts', row: line => ({ s: line, gap: -1, wrongs: [] }) },
  'Flashcard': { tab: 'flashcard', p: 'fc', row: line => { const i = line.indexOf(' - '); return i === -1 ? [line, ''] : [line.slice(0, i), line.slice(i + 3)]; } }
};

function exerciseLoadFor(item) {
  if (!item) return null;
  if (item.builderTab && item.builderState) return { tab: item.builderTab, state: item.builderState };
  const b = MYEX_SUMMARY_BUILDERS[item.typeLabel];
  const lines = String(item.contentSummary || '').split('\n').map(s => s.trim()).filter(Boolean);
  if (!b || !lines.length) return null;
  const fields = {};
  fields[b.p + '-title'] = item.title;
  fields[b.p + '-code'] = item.requiredCode || '';
  return { tab: b.tab, state: { v: 1, fields: fields, rows: lines.map(b.row) } };
}

function useRecentExerciseAgain(idx) {
  const item = getRecentExercises()[idx];
  const load = exerciseLoadFor(item);
  if (!load) { showToast('This exercise can\'t be reopened in its builder.'); return; }
  try {
    sessionStorage.setItem('ta_builder_load', JSON.stringify({ tab: load.tab, state: load.state, title: item.title }));
  } catch (e) { showToast('Your browser blocked this — try again.'); return; }
  taNavigate('create.html#' + load.tab);
}

window.renderRecentExercises = renderRecentExercises;

function redownloadRecentExercise(idx) {
  const item = getRecentExercises()[idx];
  if (!item) return;
  const html = getCachedExerciseHtml(item.uid);
  if (!html) { showToast('This file was not cached and can\'t be redownloaded.'); return; }
  downloadFile(item.title.replace(/[^a-z0-9]/gi, '_') + '.html', html);
  showToast('Redownloaded "' + item.title + '".', 'ok');
}

function viewRecentExerciseAnswers(idx) {
  const item = getRecentExercises()[idx];
  if (!item || !item.contentSummary) return;
  const modal = document.getElementById('sentenceViewModal');
  const title = document.getElementById('sentenceViewTitle');
  const body = document.getElementById('sentenceViewBody');
  if (!modal || !title || !body) return;
  title.textContent = item.title + ' — words/sentences used';
  body.innerHTML = '<div class="resource-card"><div class="resource-card-content" style="white-space:pre-wrap;">' + escapeForHtml(item.contentSummary) + '</div></div>';
  modal.classList.add('show');
}

function deleteRecentExercise(idx) {
  const list = getRecentExercises();
  const item = list[idx];
  if (!item) return;
  list.splice(idx, 1);
  saveRecentExercises(list);
  renderRecentExercises();
  // Only the list entry goes; the downloaded file, its results and its cached copy stay, so Undo is complete.
  showUndoToast('Removed "' + item.title + '" from My Exercises.', function () {
    const now = getRecentExercises();
    if (now.some(e => e.uid === item.uid)) return;
    now.splice(Math.min(idx, now.length), 0, item);
    saveRecentExercises(now);
    renderRecentExercises();
    showToast('"' + item.title + '" is back.', 'ok');
  });
}

/* ---------- Share ----------
   A ready message for Telegram/WhatsApp, the exercise file itself (the
   phone's share sheet where it can send files, otherwise a download), and
   the class code in big numbers for the classroom screen. */
function shareMessageFor(item) {
  const lines = ['📘 ' + item.title + ' (' + item.typeLabel + ')'];
  if (item.requiredCode) lines.push('🔑 Code: ' + item.requiredCode);
  lines.push('Open the file, type your student ID' + (item.requiredCode ? ' and the code' : '') + ', and start. Good luck! 🍀');
  return lines.join('\n');
}

function taCopyText(text, doneMsg) {
  const done = () => showToast(doneMsg, 'ok');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(done, () => { prompt('Copy this:', text); });
  }
  prompt('Copy this:', text);
  return Promise.resolve();
}

function shareRecentExercise(idx) {
  const item = getRecentExercises()[idx];
  if (!item) return;
  const html = getCachedExerciseHtml(item.uid);
  const m = taModal('📤 Share "' + item.title + '"',
    '<label class="field-label">Message for your students</label>' +
    '<textarea class="share-msg" rows="4"></textarea>' +
    '<div class="share-actions">' +
      '<button type="button" class="mini-btn solid" data-act="copy">📋 Copy message</button>' +
      (html ? '<button type="button" class="mini-btn" data-act="file">📎 Send the file</button>' : '') +
      (item.requiredCode ? '<button type="button" class="mini-btn" data-act="code">🔢 Show code on screen</button>' : '') +
    '</div>' +
    '<p class="ta-modal-text">' + (html
      ? 'On a phone, <b>Send the file</b> opens Telegram, WhatsApp and the rest with the file and message attached. On a computer it downloads the file for you to attach.'
      : 'This file isn\'t saved in this browser any more, so only the message can be shared. Send the file you downloaded when you made it.') + '</p>',
    { wide: true });
  const msgEl = m.body.querySelector('.share-msg');
  msgEl.value = shareMessageFor(item);
  m.body.querySelector('[data-act="copy"]').onclick = () => taCopyText(msgEl.value, 'Message copied — paste it into your class chat.');
  const fileBtn = m.body.querySelector('[data-act="file"]');
  if (fileBtn) fileBtn.onclick = async () => {
    const filename = item.title.replace(/[^a-z0-9\-_ ]/gi, '').trim().replace(/\s+/g, '_') + '.html';
    const content = html.split('__TA_APP_URL__').join(TA_APP_URL);
    let file = null;
    try { file = new File([content], filename || 'exercise.html', { type: 'text/html' }); } catch (e) { file = null; }
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text: msgEl.value, title: item.title }); return; }
      catch (e) { if (e && e.name === 'AbortError') return; } // closed the share sheet
    }
    downloadFile(filename || 'exercise.html', html);
    taCopyText(msgEl.value, 'File downloaded and message copied — attach the file in your class chat.');
  };
  const codeBtn = m.body.querySelector('[data-act="code"]');
  if (codeBtn) codeBtn.onclick = () => { m.close(); showCodeOnScreen(item); };
}

function showCodeOnScreen(item) {
  const el = document.createElement('div');
  el.className = 'code-screen';
  el.setAttribute('role', 'dialog');
  el.innerHTML = '<div class="code-screen-title"></div><div class="code-screen-label">Code</div><div class="code-screen-code"></div>' +
    '<div class="code-screen-hint">Tap anywhere or press Esc to close</div>';
  el.querySelector('.code-screen-title').textContent = item.title;
  el.querySelector('.code-screen-code').textContent = item.requiredCode;
  const close = () => {
    el.remove();
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('fullscreenchange', onFs);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };
  const onKey = e => { if (e.key === 'Escape') close(); };
  const onFs = () => { if (!document.fullscreenElement) close(); }; // Esc in full screen only leaves full screen
  el.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.appendChild(el);
  if (el.requestFullscreen) el.requestFullscreen().then(() => document.addEventListener('fullscreenchange', onFs)).catch(() => { /* fine without full screen */ });
}

// Results is its own page; it loads this exercise from ?exercise=<uid>.
function viewRecentExerciseResults(idx) {
  const item = getRecentExercises()[idx];
  if (!item) return;
  taNavigate('results.html?exercise=' + encodeURIComponent(item.uid));
}
function separateHomeworkOrClass(idx) {
  const item = getRecentExercises()[idx];
  if (!item || !item.mergedItems || !item.mergedItems.length) return;
  if (!confirm('Separate "' + item.title + '" back into its ' + item.mergedItems.length + ' original exercises?')) return;
  item.mergedItems.forEach(orig => {
    const codeMatch = orig.html.match(/const REQUIRED_CODE = "([^"]*)"/);
    pushRecentExercise({
      title: orig.title, typeLabel: orig.typeLabel,
      code: generateClassCode(), uid: generateExerciseUid(),
      html: orig.html, requiredCode: codeMatch ? codeMatch[1] : ''
    });
  });
  removeRecentExercise(item.uid);
  showToast('Separated back into ' + item.mergedItems.length + ' exercises.', 'ok');
}
async function disableRecentExercisePoints(idx) {
  const list = getRecentExercises();
  const item = list[idx];
  if (!item) return;
  if (!window.taDisableExercisePoints) { showToast('Still connecting — try again in a moment.'); return; }
  const res = await window.taDisableExercisePoints(item.boardCode || getPointsBoardCode(), item.code);
  if (res === 'ok') {
    list[idx].disabled = true;
    saveRecentExercises(list);
    renderRecentExercises();
    showToast('"' + item.title + '" will no longer award points.', 'ok');
  } else {
    showToast("Couldn't save that — check your internet connection.");
  }
}

/* ================= PAGE START ================= */
taOnTab('myexercises', function () {
  renderRecentExercises();
  // Opened from a lesson plan: my-exercises.html?highlight=<uid>
  const uid = new URLSearchParams(location.search).get('highlight');
  if (!uid) return;
  clearMyexFilters(); // make sure the highlighted exercise is in view
  setTimeout(function () {
    const row = document.querySelector('.recent-exercise-row[data-uid="' + CSS.escape(uid) + '"]');
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.classList.add('flash-highlight');
      setTimeout(function () { row.classList.remove('flash-highlight'); }, 1600);
    }
  }, 150);
});
taStartPage('myexercises');
