/* ================= HOMEWORK / CLASS RESULTS DRILL-DOWN ================= */
let hwcResultsCurrentItem = null;
let hwcExpandedStudent = null;

function formatRelativeTime(ts) {
  if (!ts) return 'never';
  const ms = typeof ts.toMillis === 'function' ? ts.toMillis() : new Date(ts).getTime();
  if (!ms) return 'never';
  const diffMin = Math.round((Date.now() - ms) / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return diffMin + ' min ago';
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return diffHr + ' hr ago';
  return Math.round(diffHr / 24) + ' d ago';
}

/* Tapping "View Results" on a Homework/Class entry goes to the same
   Results tab every other exercise uses \u2014 just showing the student
   progress list there instead of the normal code-upload flow, rather than
   a separate popup. */
function viewHomeworkClassResults(idx) {
  const item = getRecentExercises()[idx];
  if (!item) return;
  hwcResultsCurrentItem = item;
  hwcExpandedStudent = null;
  document.getElementById('resultsNormalWrap').style.display = 'none';
  document.getElementById('hwcResultsInlineWrap').style.display = '';
  const valueEl = document.getElementById('activeCodeValue');
  const subEl = document.querySelector('#activeCodeBox .active-code-sub');
  if (valueEl) valueEl.textContent = item.title;
  if (subEl) subEl.textContent = 'Tap a student\'s progress to see which exercises are done, and view their answers.';
  switchTo('results');
  if (window.taListenHwcProgress) window.taListenHwcProgress(item.code);
  else renderHwcResultsList();
}

/* Opened from My Exercises ("View Results"): results.html?exercise=<uid> */
function showExerciseResults(uid) {
  const list = getRecentExercises();
  const idx = list.findIndex(e => e.uid === uid);
  const item = list[idx];
  if (!item) return;
  if (item.mergedItems && item.mergedItems.length) { viewHomeworkClassResults(idx); return; }
  document.getElementById('resultsNormalWrap').style.display = '';
  document.getElementById('hwcResultsInlineWrap').style.display = 'none';
  document.getElementById('res-code-input').value = item.code;
  onResultsCodeInput();
  const valueEl = document.getElementById('activeCodeValue');
  const subEl = document.querySelector('#activeCodeBox .active-code-sub');
  if (valueEl) valueEl.textContent = item.title;
  if (subEl) subEl.textContent = 'From your My Exercises list.';
}

function renderHwcResultsList() {
  const wrap = document.getElementById('hwcResultsInlineList');
  if (!wrap || !hwcResultsCurrentItem) return;
  const docs = (window.__hwcProgressDocs || []).slice().sort((a, b) => (b.completedCount || 0) - (a.completedCount || 0));

  const total = docs.length;
  const completed = docs.filter(d => d.completedCount === d.totalCount && d.totalCount > 0).length;
  const inProgress = docs.filter(d => d.completedCount > 0 && d.completedCount < d.totalCount).length;
  const avgProgressPct = total ? Math.round(docs.reduce((a, d) => a + (d.totalCount ? d.completedCount / d.totalCount : 0), 0) / total * 100) : null;
  setResultsStatCard(1, '\ud83d\udc65', 'rgba(232,115,15,0.14)', 'var(--brand)', String(total), 'Total Students');
  setResultsStatCard(2, '\u2705', 'var(--success-surface)', 'var(--success)', String(completed), 'Completed');
  setResultsStatCard(3, '\u23f3', 'rgba(79,126,227,0.14)', 'var(--category-blue)', String(inProgress), 'In Progress');
  setResultsStatCard(4, '\ud83d\udcc8', 'rgba(245,179,1,0.16)', 'var(--celebrate)', avgProgressPct !== null ? avgProgressPct + '%' : '\u2014', 'Average Progress');

  if (!docs.length) { wrap.innerHTML = '<p class="empty-results">No students have started this yet.</p>'; return; }

  wrap.innerHTML = docs.map(d => {
    const done = d.completedCount === d.totalCount && d.totalCount > 0;
    const startedNone = d.completedCount === 0;
    const pct = d.totalCount ? Math.round((d.completedCount / d.totalCount) * 100) : 0;
    let statusLabel, pillBg, pillColor, barColor;
    if (done) { statusLabel = '\u2705 Completed'; pillBg = 'var(--success-surface)'; pillColor = 'var(--success)'; barColor = 'var(--success)'; }
    else if (startedNone) { statusLabel = '\u26a0\ufe0f Needs Attention'; pillBg = 'var(--danger-surface)'; pillColor = 'var(--danger)'; barColor = 'var(--danger)'; }
    else { statusLabel = '\u23f3 In Progress'; pillBg = 'rgba(79,126,227,0.14)'; pillColor = 'var(--category-blue)'; barColor = 'var(--warning)'; }
    const fractionText = d.completedCount + '/' + d.totalCount;
    const studentKey = d.studentId;
    const isExpanded = hwcExpandedStudent === studentKey;
    const initials = initialsForName(d.studentName);
    const avatarColor = avatarColorForName(d.studentName || '');
    // Total time to complete the WHOLE homework set, shown only once every
    // round is done (a partial total would be misleading). Under 15 minutes
    // is flagged red (likely rushed); 15+ minutes shown in green.
    let totalTimeHtml = '';
    if (done && typeof d.totalTimeSeconds === 'number' && d.totalTimeSeconds > 0) {
      const totalMin = Math.floor(d.totalTimeSeconds / 60);
      const totalSec = d.totalTimeSeconds % 60;
      const totalTimeText = totalMin + 'm ' + (totalSec < 10 ? '0' : '') + totalSec + 's';
      const timeColor = d.totalTimeSeconds < 900 ? 'var(--danger)' : 'var(--success)';
      totalTimeHtml = '<span class="hwc-total-time" style="font-weight:800; color:' + timeColor + ';">\u23f1 ' + totalTimeText + '</span>';
    }
    const roundsHtml = isExpanded ? (d.roundLabels || []).map((label, i) => {
      const roundDone = !!(d.completedFlags && d.completedFlags[i]);
      const roundCode = (d.roundCodes && d.roundCodes[i]) || '';
      return '<div class="hwc-round-row">' +
        '<span>' + (roundDone ? '\u2713' : '\u2717') + ' ' + escapeForHtml(label) + '</span>' +
        (roundDone && roundCode ? '<button class="mini-btn" type="button" onclick="viewHwcRoundAnswer(' + jsAttr(roundCode) + ',' + jsAttr(d.studentName) + ',' + jsAttr(label) + ')">\ud83d\udc41</button>' : '') +
        '</div>';
    }).join('') : '';

    return '<div class="hwc-student-row">' +
      '<div class="hwc-student-head" onclick="toggleHwcStudentExpand(' + jsAttr(studentKey) + ')">' +
        '<div class="hwc-col-name"><span class="res-avatar" style="background:' + avatarColor + ';">' + escapeForHtml(initials) + '</span><b>' + escapeForHtml(d.studentName) + '</b></div>' +
        '<div class="hwc-col-id">ID: ' + escapeForHtml(d.studentId) + '</div>' +
        '<div class="hwc-col-progress res-score-cell">' +
          '<span>' + fractionText + ' \u00b7 ' + pct + '%</span>' +
          '<div class="res-score-bar-track"><div class="res-score-bar-fill" style="width:' + pct + '%; background:' + barColor + ';"></div></div>' +
        '</div>' +
        '<div class="hwc-col-status"><span class="res-status-pill" style="background:' + pillBg + '; color:' + pillColor + ';">' + statusLabel + '</span></div>' +
        totalTimeHtml +
        '<span class="hwc-time">' + formatRelativeTime(d.lastActive) + '</span>' +
        '<span class="hwc-chevron">' + (isExpanded ? '\u25b2' : '\u25bc') + '</span>' +
      '</div>' +
      (isExpanded ? '<div class="hwc-round-list">' + roundsHtml + '</div>' : '') +
      '</div>';
  }).join('');
}
window.renderHwcResultsList = renderHwcResultsList;

function toggleHwcStudentExpand(studentKey) {
  hwcExpandedStudent = (hwcExpandedStudent === studentKey) ? null : studentKey;
  renderHwcResultsList();
}

async function viewHwcRoundAnswer(roundCode, studentName, roundLabel) {
  if (!window.taFindResultByCodeAndName) { showToast('Still connecting \u2014 try again in a moment.'); return; }
  const result = await window.taFindResultByCodeAndName(roundCode, studentName);
  const modal = document.getElementById('sentenceViewModal');
  const title = document.getElementById('sentenceViewTitle');
  const body = document.getElementById('sentenceViewBody');
  if (!modal || !title || !body) return;
  title.textContent = roundLabel + ' \u2014 ' + studentName;
  if (!result) {
    body.innerHTML = '<div class="empty-results">No result found for this exercise yet.</div>';
  } else {
    const lines = [];
    if (typeof result.score !== 'undefined') lines.push('<div><b>Score:</b> ' + escapeForHtml(String(result.score)) + '</div>');
    if (result.timeDisplay) lines.push('<div><b>Time:</b> ' + escapeForHtml(result.timeDisplay) + '</div>');
    if (result.dictationFeedback) lines.push('<div style="white-space:pre-wrap;">' + escapeForHtml(result.dictationFeedback) + '</div>');
    // Sentences: the student's own written sentence for each word.
    if (Array.isArray(result.sentences) && result.sentences.length) {
      lines.push(result.sentences.map((s, i) =>
        '<div class="resource-card">' +
          '<div class="resource-card-title">' + (i + 1) + (s.word ? ' — using "' + escapeForHtml(s.word) + '"' : '') + '</div>' +
          '<div class="resource-card-content">' + escapeForHtml(s.text || '(blank)') + '</div>' +
        '</div>'
      ).join(''));
    }
    // Bidirectional Language and English Content: free-form notes the
    // student wrote while reading/watching.
    if (typeof result.notes === 'string' && result.notes.trim()) {
      lines.push('<div class="resource-card"><div class="resource-card-title">Notes</div><div class="resource-card-content" style="white-space:pre-wrap;">' + escapeForHtml(result.notes) + '</div></div>');
    }
    body.innerHTML = lines.join('') || '<div class="empty-results">No further detail recorded for this exercise.</div>';
  }
  modal.classList.add('show');
}

function renderActiveCodeBox() {
  const code = getActiveCode();
  const valueEl = document.getElementById('activeCodeValue');
  if (!valueEl) return;
  const subEl = document.getElementById('activeCodeBox').querySelector('.active-code-sub');
  if (code) {
    valueEl.innerText = code;
    subEl.innerText = 'From the exercise you most recently created in this session.';
    const resInput = document.getElementById('res-code-input');
    if (resInput && !resInput.value) {
      resInput.value = code;
      if (window.startLiveSync) window.startLiveSync(code);
    }
  } else {
    valueEl.innerText = '— none yet —';
    subEl.innerText = 'Upload an exercise file below to load its results.';
  }
}
/* ================= RESULTS TAB ================= */
function decodeResultCode(code) {
  const trimmed = code.trim();
  const b64 = trimmed.startsWith('TA1-') ? trimmed.slice(4) : trimmed;
  const json = decodeURIComponent(escape(atob(b64)));
  const payload = JSON.parse(json);
  if (!payload || !payload.code || !payload.name) throw new Error('Not a valid result code.');
  return payload;
}

function addResults(newEntries) {
  const activeCode = getActiveCode();
  const existing = getStoredResults();
  const existingSigs = new Set(existing.map(resultSignature));
  let added = 0, skippedWrongCode = 0, skippedDupe = 0;

  newEntries.forEach(entry => {
    if (!entry || !entry.code) return;
    if (activeCode && entry.code !== activeCode) { skippedWrongCode++; return; }
    const sig = resultSignature(entry);
    if (existingSigs.has(sig)) { skippedDupe++; return; }
    existingSigs.add(sig);
    existing.push(entry);
    added++;
  });

  saveStoredResults(existing);
  renderResultsTable();

  if (added > 0) {
    showToast('✅ Imported ' + added + ' result' + (added > 1 ? 's' : '') + '.', 'ok');
  } else if (skippedWrongCode > 0) {
    showToast("❌ Those results don't match the active class code.");
  } else if (skippedDupe > 0) {
    showToast('Those results were already imported.');
  } else {
    showToast('No valid results found.');
  }
}

function importPastedCodes() {
  const textarea = document.getElementById('res-code-paste');
  const lines = textarea.value.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) { showToast('Paste at least one result code first.'); return; }

  const entries = [];
  lines.forEach(line => {
    try { entries.push(decodeResultCode(line)); } catch (e) { /* skip invalid line */ }
  });

  if (entries.length === 0) { showToast('❌ Could not read any of those codes.'); return; }
  addResults(entries);
  textarea.value = '';
}

function importFileList(files, onDone) {
  files = files.filter(f => f.name.toLowerCase().endsWith('.json'));
  if (files.length === 0) {
    showToast('No .json result files found.');
    if (onDone) onDone();
    return;
  }

  let remaining = files.length;
  const entries = [];
  files.forEach(file => {
    const reader = new FileReader();
    const settle = () => {
      remaining--;
      if (remaining === 0) {
        addResults(entries);
        if (onDone) onDone();
      }
    };
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result);
        if (payload && payload.code && payload.name) entries.push(payload);
      } catch (err) { /* skip unreadable file */ }
      settle();
    };
    reader.onerror = settle;
    reader.readAsText(file);
  });
}

const __resFileInput = document.getElementById('res-file-input');
if (__resFileInput) __resFileInput.addEventListener('change', function (e) {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;
  importFileList(files, () => { e.target.value = ''; });
});

const __resFolderInput = document.getElementById('res-folder-input');
if (__resFolderInput) __resFolderInput.addEventListener('change', function (e) {
  const allFiles = Array.from(e.target.files || []);
  const jsonFiles = allFiles.filter(f => f.name.toLowerCase().endsWith('.json'));
  const statusEl = document.getElementById('res-folder-status');
  if (jsonFiles.length === 0) {
    statusEl.innerText = 'No .json result files found in that folder.';
    showToast('No .json result files found in that folder.');
    e.target.value = '';
    return;
  }
  statusEl.innerText = jsonFiles.length + ' result file(s) found in that folder.';
  importFileList(jsonFiles, () => { e.target.value = ''; });
});

function onExerciseFileUpload(input) {
  const file = input.files && input.files[0];
  const statusEl = document.getElementById('liveSyncStatus');
  const valueEl = document.getElementById('activeCodeValue');
  const subEl = document.querySelector('#activeCodeBox .active-code-sub');
  if (!file) return;
  if (statusEl) statusEl.textContent = '⏳ Reading file…';
  const reader = new FileReader();
  reader.onload = function () {
    const text = String(reader.result || '');
    const m = text.match(/const EXERCISE_CODE = "([0-9]{6})"/);
    if (!m) {
      if (statusEl) statusEl.textContent = "⚠️ Couldn't find a code in that file — make sure it's an exercise created by this app.";
      return;
    }
    const code = m[1];
    const titleMatch = text.match(/<title>(.*?) - /);
    document.getElementById('res-code-input').value = code;
    onResultsCodeInput();
    if (valueEl) valueEl.textContent = titleMatch ? titleMatch[1] : (file.name || 'Exercise');
    if (subEl) subEl.textContent = 'From: ' + (file.name || 'uploaded file');
    if (statusEl) statusEl.textContent = '🟢 Showing results for this exercise.';
  };
  reader.onerror = function () {
    if (statusEl) statusEl.textContent = '⚠️ Could not read that file.';
  };
  reader.readAsText(file);
}

function onResultsCodeInput() {
  const entered = document.getElementById('res-code-input').value.trim();
  if (window.startLiveSync) window.startLiveSync(entered);
  if (entered.length === 6) {
    renderResultsTable(entered);
  } else if (entered.length === 0) {
    renderResultsTable(getActiveCode());
  } else {
    renderResultsTable(entered); // will show "no results" until 6 digits are entered
  }
}

function setResultsStatCard(n, icon, bg, color, value, label) {
  const iconEl = document.getElementById('resStatIcon' + n);
  const valEl = document.getElementById('resStatValue' + n);
  const labelEl = document.getElementById('resStatLabel' + n);
  // icon === null means this slot has its own persistent contents (e.g. a mounted
  // animation) that must not be wiped out by re-assigning textContent on every render.
  if (iconEl) { if (icon !== null) iconEl.textContent = icon; iconEl.style.background = bg; iconEl.style.color = color; }
  if (valEl) valEl.textContent = value;
  if (labelEl) labelEl.textContent = label;
}
function setResultsStatsForCode() {
  setResultsStatCard(1, '👥', 'rgba(232,115,15,0.14)', 'var(--brand)', '—', 'Submissions');
  setResultsStatCard(2, null, '#145C4E', 'var(--success)', '—', 'Average Score');
  setResultsStatCard(3, '⏱️', 'rgba(79,126,227,0.14)', 'var(--category-blue)', '—', 'Average Time');
  setResultsStatCard(4, null, '#5C4108', 'var(--celebrate)', '—', 'Highest Score');
}

function renderResultsTable(codeOverride) {
  const activeCode = getActiveCode();
  const lookupCode = (codeOverride !== undefined ? codeOverride : (document.getElementById('res-code-input').value.trim() || activeCode));
  const wrap = document.getElementById('resultsTableWrap');
  const clearBtn = document.getElementById('clearResultsBtn');

  const collected = collectResults(lookupCode);
  const matches = collected.visible;
  const expiredCount = collected.expired.length;

  if (!lookupCode || matches.length === 0) {
    wrap.innerHTML = '<div class="empty-results" id="emptyResultsMsg">' +
      (expiredCount > 0
        ? '🚫 ' + expiredCount + ' submission' + (expiredCount > 1 ? 's' : '') + ' for this code came from an <b>expired file</b> (a file built before you last deleted the results for this code), so they are not shown. Only students using the newest file you created will appear here.'
        : 'No results yet for this code.') +
      '</div>';
    clearBtn.style.display = (lookupCode && lookupCode.length === 6) ? 'inline-flex' : 'none';
    setResultsStatsForCode();
    return;
  }

  matches.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Split: students who entered with an ID from the Students list, and
  // people who only typed a name. The stat cards describe your students.
  const rosterIdx = taRosterIndex();
  const rosterOf = new Map();
  matches.forEach(r => rosterOf.set(r, rosterStudentForResult(r, rosterIdx)));
  const idMatches = matches.filter(r => rosterOf.get(r));
  const nameMatches = matches.filter(r => !rosterOf.get(r));

  const scored = idMatches.filter(r => typeof r.score === 'number');
  const avgScore = scored.length ? (scored.reduce((a, r) => a + r.score, 0) / scored.length).toFixed(1) : null;
  const highScore = scored.length ? Math.max.apply(null, scored.map(r => r.score)) : null;
  const timed = idMatches.filter(r => typeof r.timeSeconds === 'number');
  const avgTime = timed.length ? Math.round(timed.reduce((a, r) => a + r.timeSeconds, 0) / timed.length) : null;
  const avgTimeDisplay = avgTime !== null ? (String(Math.floor(avgTime / 60)).padStart(2, '0') + ':' + String(avgTime % 60).padStart(2, '0')) : '—';

  setResultsStatCard(1, '👥', 'rgba(232,115,15,0.14)', 'var(--brand)', String(idMatches.length), 'Your students (with ID)');
  setResultsStatCard(2, null, '#145C4E', 'var(--success)', avgScore !== null ? avgScore + '%' : '—', 'Average Score');
  setResultsStatCard(3, '⏱️', 'rgba(79,126,227,0.14)', 'var(--category-blue)', avgTimeDisplay, 'Average Time');
  setResultsStatCard(4, null, '#5C4108', 'var(--celebrate)', highScore !== null ? highScore + '%' : '—', 'Highest Score');

  window.__lastResultsMatches = matches;

  const searchInput = document.getElementById('resultsSearchInput');
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const indexed = matches.map((r, i) => ({ r: r, i: i }));
  const displayRows = searchTerm
    ? indexed.filter(function (o) { return (o.r.name || '').toLowerCase().indexOf(searchTerm) !== -1 || (o.r.type || '').toLowerCase().indexOf(searchTerm) !== -1; })
    : indexed;

  let html = '<div class="results-summary">' +
    '<span><b>' + idMatches.length + '</b> with ID</span>' +
    '<span><b>' + nameMatches.length + '</b> name only</span>' +
    (avgScore !== null ? '<span>Average score (with ID): <b>' + avgScore + '</b></span>' : '') +
    '<span>Average time: <b>' + avgTimeDisplay + '</b></span>' +
    (expiredCount > 0 ? '<span>🚫 <b>' + expiredCount + '</b> hidden (expired file)</span>' : '') +
    '</div>';

  if (displayRows.length === 0) {
    html += '<div class="empty-results">No results match your search.</div>';
    wrap.innerHTML = html;
    clearBtn.style.display = 'inline-flex';
    return;
  }

  const tableFor = function (rows) {
    let html = '<table class="results-table"><thead><tr>' +
      '<th>Student</th><th>Exercise</th><th>Score</th><th>Time</th><th>Status</th><th>Date</th><th></th>' +
      '</tr></thead><tbody>';
    rows.forEach(function (o) {
      const r = o.r, idx = o.i;
      const st = rosterOf.get(r);
      let viewBtn = '<span style="color:var(--ink-faint); font-size:0.8rem;">—</span>';
      if (r.type === 'Sentences' && Array.isArray(r.sentences)) {
        viewBtn = '<button class="res-view-btn" type="button" onclick="viewSentenceResult(' + idx + ')">👁 View</button>';
      } else if ((r.type === 'BilingualReader' || r.type === 'EnglishContent') && typeof r.notes === 'string' && r.notes.trim()) {
        viewBtn = '<button class="res-view-btn" type="button" onclick="viewNotesResult(' + idx + ')">👁 View Notes</button>';
      } else if (r.type === 'Dictation' && typeof r.dictationFeedback === 'string' && r.dictationFeedback.trim()) {
        viewBtn = '<button class="res-view-btn" type="button" onclick="viewDictationResult(' + idx + ')">👁 View</button>';
      }
      const initials = initialsForName(r.name);
      const avatarColor = avatarColorForName(r.name || '');
      let scoreCell;
      if (typeof r.score === 'number') {
        const pct = Math.max(0, Math.min(100, r.score));
        const barColor = pct >= 80 ? 'var(--success)' : (pct >= 50 ? 'var(--warning)' : 'var(--danger)');
        scoreCell = '<div class="res-score-cell">' +
          '<span>' + r.score + '%</span>' +
          '<div class="res-score-bar-track"><div class="res-score-bar-fill" style="width:' + pct + '%; background:' + barColor + ';"></div></div>' +
          '</div>';
      } else {
        scoreCell = escapeForHtml(r.sentenceCount ? r.sentenceCount + ' sentences' : (r.wordsLearned ? r.wordsLearned + ' words' : '—'));
      }
      html += '<tr>' +
        '<td><div class="res-student-cell"><span class="res-avatar" style="background:' + avatarColor + ';">' + escapeForHtml(initials) + '</span><span>' + escapeForHtml(r.name || '—') + (st ? '<span class="res-id-tag">ID ' + escapeForHtml(st.id) + (groupNameFor(st.group) ? ' · ' + escapeForHtml(groupNameFor(st.group)) : '') + '</span>' : '') + '</span></div></td>' +
        '<td><span class="badge-type">' + escapeForHtml(r.type || '—') + '</span></td>' +
        '<td>' + scoreCell + '</td>' +
        '<td>' + escapeForHtml(r.timeDisplay || '—') + '</td>' +
        '<td><span class="res-status-pill">✅ Completed</span></td>' +
        '<td>' + fmtDate(r.date) + '</td>' +
        '<td>' + viewBtn + '</td>' +
        '</tr>';
    });
    html += '</tbody></table>';
    return html;
  };
  const idRows = displayRows.filter(o => rosterOf.get(o.r));
  const nameRows = displayRows.filter(o => !rosterOf.get(o.r));
  html += '<div class="results-section">' +
    '<div class="results-section-head"><h3>🎓 Entered with ID — your students (' + idRows.length + ')</h3><p>Matched to your Students list.</p></div>' +
    (idRows.length ? tableFor(idRows) : '<div class="empty-results">No results from students with an ID' + (searchTerm ? ' match your search' : '') + '.</div>') +
    '</div>';
  html += '<div class="results-section name-only">' +
    '<div class="results-section-head"><h3>✍️ Entered with a name only (' + nameRows.length + ')</h3><p>Not on your Students list — left out of Statistics and Top Active Students.</p></div>' +
    (nameRows.length ? tableFor(nameRows) : '<div class="empty-results">No name-only results' + (searchTerm ? ' match your search' : '') + '.</div>') +
    '</div>';
  wrap.innerHTML = html;
  clearBtn.style.display = 'inline-flex';
}

function exportResultsReport() {
  const code = (document.getElementById('res-code-input').value.trim()) || getActiveCode();
  if (!code) { showToast('Enter a class code first.'); return; }

  const rosterIdxExp = taRosterIndex();
  const matches = collectResults(code).visible
    .map(r => ({ r: r, st: rosterStudentForResult(r, rosterIdxExp) }))
    .sort((a, b) => ((a.st ? 0 : 1) - (b.st ? 0 : 1)) || (new Date(a.r.date) - new Date(b.r.date)))
    .map(o => { o.r.__entered = o.st ? ('ID ' + o.st.id + (groupNameFor(o.st.group) ? ' · ' + groupNameFor(o.st.group) : '')) : 'Name only'; return o.r; });
  if (matches.length === 0) { showToast('No results to export for this code yet.'); return; }

  const scored = matches.filter(r => typeof r.score === 'number');
  const avgScore = scored.length ? (scored.reduce((a, r) => a + r.score, 0) / scored.length).toFixed(1) : null;
  const timed = matches.filter(r => typeof r.timeSeconds === 'number');
  const avgTime = timed.length ? Math.round(timed.reduce((a, r) => a + r.timeSeconds, 0) / timed.length) : null;
  const avgTimeDisplay = avgTime !== null ? (String(Math.floor(avgTime / 60)).padStart(2, '0') + ':' + String(avgTime % 60).padStart(2, '0')) : '—';

  const rowsHtml = matches.map(r =>
    '<tr>' +
    '<td>' + escapeForHtml(r.name || '—') + '</td>' +
    '<td>' + escapeForHtml(r.__entered || '') + '</td>' +
    '<td>' + escapeForHtml(r.type || '—') + '</td>' +
    '<td>' + (typeof r.score === 'number' ? r.score : (r.wordsLearned ? r.wordsLearned + ' words' : '—')) + '</td>' +
    '<td>' + escapeForHtml(r.timeDisplay || '—') + '</td>' +
    '<td>' + fmtDate(r.date) + '</td>' +
    '</tr>'
  ).join('');

  const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Results — Class Code ' + code + '</title>' +
    '<style>' +
    'body{font-family:"Segoe UI",Arial,sans-serif;background:#f4f1ea;color:#1f2e28;padding:40px;max-width:820px;margin:0 auto;}' +
    'h1{margin-bottom:4px;font-size:1.6rem;}' +
    '.meta{color:#6b6b6b;margin-bottom:8px;font-size:0.95rem;}' +
    '.summary{display:flex;gap:24px;margin:18px 0 26px;font-size:0.95rem;flex-wrap:wrap;}' +
    '.summary b{color:#111;}' +
    'table{width:100%;border-collapse:collapse;background:#fff;box-shadow:0 4px 14px rgba(0,0,0,0.08);border-radius:10px;overflow:hidden;}' +
    'th,td{padding:12px 16px;text-align:left;border-bottom:1px solid #eee;}' +
    'th{background:#26392f;color:#f2c14e;text-transform:uppercase;font-size:0.72rem;letter-spacing:0.5px;}' +
    'tr:nth-child(even){background:#fafafa;}' +
    '@media print{body{padding:10px;}}' +
    '</style></head><body>' +
    '<h1>Class Results — Code ' + code + '</h1>' +
    '<div class="meta">Report generated ' + new Date().toLocaleString() + '</div>' +
    '<div class="summary"><span><b>' + matches.length + '</b> submission' + (matches.length > 1 ? 's' : '') + '</span>' +
    (avgScore !== null ? '<span>Average score: <b>' + avgScore + '</b></span>' : '') +
    '<span>Average time: <b>' + avgTimeDisplay + '</b></span></div>' +
    '<table><thead><tr><th>Student</th><th>Entered with</th><th>Exercise</th><th>Score</th><th>Time</th><th>Date</th></tr></thead><tbody>' +
    rowsHtml + '</tbody></table>' +
    '</body></html>';

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'results_' + code + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  showToast('✅ Results report downloaded.', 'ok');
}

function clearResultsForActiveCode() {
  const code = (document.getElementById('res-code-input').value.trim()) || getActiveCode();
  if (!code) { showToast('Enter a class code first.'); return; }
  if (!confirm('Delete ALL results for class code ' + code + ' and EXPIRE every file already made with it?\n\n' +
               '• All results for ' + code + ' are deleted (here and in the cloud).\n' +
               '• Every file you built with this code before now becomes expired — anyone can still open it, but its results will never show up again.\n' +
               '• Only the next file you create with ' + code + ' will report results.\n\nThis cannot be undone.')) return;

  const resetAt = new Date().toISOString();
  setLocalReset(code, resetAt);

  // Remove any locally-imported (manual upload/paste) entries for this code.
  saveStoredResults(getStoredResults().filter(r => r.code !== code));

  if (window.deleteLiveResultsForCode) {
    showToast('Deleting…', 'ok');
    window.deleteLiveResultsForCode(code, resetAt).then(function (res) {
      if (res.ok) {
        showToast('✅ Deleted ' + res.count + ' result' + (res.count === 1 ? '' : 's') + '. Older files with code ' + code + ' are now expired — create a new file to start collecting again.', 'ok');
      } else {
        showToast('⚠️ Results hidden on this device, but the cloud copy could not be deleted — check your Firestore rules allow delete.');
      }
      renderResultsTable();
    });
  } else {
    renderResultsTable();
    showToast('Results cleared and older files expired on this device.', 'ok');
  }
}


/* ================= PAGE START ================= */
renderActiveCodeBox();
taOnTab('results', function () {
  // Opened from My Exercises ("View Results"): results.html?exercise=<uid>
  const uid = new URLSearchParams(location.search).get('exercise');
  if (uid) { showExerciseResults(uid); return; }
  try { renderResultsTable(); } catch (e) { /* ignore */ }
});
taStartPage('results');
