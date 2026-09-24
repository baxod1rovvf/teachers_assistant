
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

function renderRecentExercises() {
  const wrap = document.getElementById('recentExercisesWrap');
  if (!wrap) return;
  const list = getRecentExercises();
  if (!list.length) { wrap.innerHTML = '<div class="empty-results">No exercises created yet in this browser.</div>'; return; }

  let html = '';
  let currentGroup = null;
  list.forEach((item, idx) => {
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
          openBtn +
          answersBtn +
          separateBtn +
          '<button class="mini-btn" type="button" onclick="viewRecentExerciseResults(' + idx + ')">📊 View Results</button>' +
          disableBtn +
          '<button class="mini-btn danger" type="button" onclick="deleteRecentExercise(' + idx + ')">🗑 Delete</button>' +
        '</div>' +
      '</div>';
  });
  wrap.innerHTML = html;
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
  if (!confirm('Permanently remove "' + item.title + '" from My Exercises? This only removes it from this list — it won\'t delete the downloaded file or its results.')) return;
  list.splice(idx, 1);
  saveRecentExercises(list);
  renderRecentExercises();
  showToast('Removed from My Exercises.', 'ok');
}

// Results is its own page; it loads this exercise from ?exercise=<uid>.
function viewRecentExerciseResults(idx) {
  const item = getRecentExercises()[idx];
  if (!item) return;
  location.href = 'results.html?exercise=' + encodeURIComponent(item.uid);
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
taOnTab('myexercises', renderRecentExercises);
taStartPage('myexercises');

// Opened from a lesson plan: my-exercises.html?highlight=<uid>
(function () {
  const uid = new URLSearchParams(location.search).get('highlight');
  if (!uid) return;
  setTimeout(function () {
    const row = document.querySelector('.recent-exercise-row[data-uid="' + CSS.escape(uid) + '"]');
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.classList.add('flash-highlight');
      setTimeout(function () { row.classList.remove('flash-highlight'); }, 1600);
    }
  }, 150);
})();
