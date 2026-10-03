
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
let myexGroupFilter = null; // null = every group, '' = no group, else a group id

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

  // group chips: every group the teacher has, plus "No group" when some exercises have none
  const groupEl = document.getElementById('myexGroupChips');
  const groups = getStudentGroups();
  const groupCount = {};
  list.forEach(item => { const g = groups.some(x => x.id === item.groupId) ? item.groupId : ''; groupCount[g] = (groupCount[g] || 0) + 1; });
  if (myexGroupFilter !== null && myexGroupFilter !== '' && !groups.some(g => g.id === myexGroupFilter)) myexGroupFilter = null;
  if (groupEl) {
    const chip = (val, label, n) => '<button type="button" class="myex-type-chip' + (myexGroupFilter === val ? ' active' : '') + '" onclick="setMyexGroupFilter(' + (val === null ? 'null' : jsAttr(val)) + ')">' +
      escapeForHtml(label) + '<span class="n">' + n + '</span></button>';
    groupEl.innerHTML = groups.length
      ? '<span class="myex-chips-label">👥</span>' + chip(null, 'All groups', list.length) +
        groups.map(g => chip(g.id, g.name, groupCount[g.id] || 0)).join('') +
        (groupCount[''] ? chip('', 'No group', groupCount['']) : '')
      : '';
  }
  const groupNames = {};
  groups.forEach(g => { groupNames[g.id] = g.name; });

  const searchEl = document.getElementById('myexSearchInput');
  const words = (searchEl ? searchEl.value : '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = item => {
    if (myexTypeFilter && item.typeLabel !== myexTypeFilter) return false;
    if (myexGroupFilter !== null && (groupNames[item.groupId] ? item.groupId : '') !== myexGroupFilter) return false;
    if (!words.length) return true;
    const hay = [item.title, item.typeLabel, item.requiredCode, groupNames[item.groupId] || '', item.contentSummary].join('\n').toLowerCase();
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
    // Homework and Class sets stand out from single exercises
    const setKind = (item.setKind === 'class' || item.typeLabel === 'Class') ? 'class'
      : ((item.setKind === 'homework' || item.typeLabel === 'Homework') ? 'homework' : '');
    const setBadge = setKind
      ? '<span class="badge-set ' + setKind + '">' + (setKind === 'class' ? '🏫 Class set' : '📚 Homework set') +
        (item.mergedItems && item.mergedItems.length ? ' · ' + item.mergedItems.length + ' exercises' : '') + '</span>'
      : '';
    const disabledBadge = setBadge + (item.disabled
      ? '<span class="badge-type" style="background:rgba(232,103,74,0.14); color:var(--danger);">Points off</span>'
      : (setKind ? '' : '<span class="badge-type">' + escapeForHtml(item.typeLabel) + '</span>'));
    const gName = groupNames[item.groupId];
    const groupBtn = '<button type="button" class="myex-group-btn' + (gName ? '' : ' none') + '" onclick="changeRecentExerciseGroup(' + idx + ')" title="Change which group this is for"' + (gName ? ' translate="no"' : '') + '>👥 ' + escapeForHtml(gName || 'Set group') + '</button>';
    const oldIssues = taOldFileIssues(item);
    const oldLine = oldIssues.length
      ? '<button type="button" class="old-file-line' + (oldIssues.every(x => x.fix.minor) ? ' minor' : '') + '" onclick="showOldFileInfo(' + idx + ')" title="' + escapeForHtml('Made before a fix: ' + taOldFileWhat(oldIssues) + '. Press ✏️ Use again to make a new copy, and share that one.') + '">⚠️ Made before a fix</button>'
      : '';
    const codeLine = '<div class="recent-exercise-date">' + groupBtn + (item.requiredCode ? 'Code: ' + escapeForHtml(item.requiredCode) : 'No code set') + ' &middot; ' + dateStr + '</div>';
    const againBtn = exerciseLoadFor(item)
      ? '<button class="mini-btn solid" type="button" onclick="useRecentExerciseAgain(' + idx + ')" title="Open this exercise in its builder, filled in, to change it or make a new version">✏️ Use again</button>'
      : '';
    html +=
      '<div class="recent-exercise-row' + (setKind ? ' set-row set-' + setKind : '') + '" data-uid="' + escapeForHtml(item.uid || '') + '">' +
        '<div class="recent-exercise-info">' +
          '<div class="recent-exercise-title"><span translate="no">' + escapeForHtml(item.title) + '</span>' +
            '<button type="button" class="myex-rename" onclick="renameRecentExercise(' + idx + ')" title="Rename" aria-label="Rename">✎</button> ' + disabledBadge + '</div>' +
          codeLine + oldLine +
        '</div>' +
        '<div class="recent-exercise-actions">' +
          againBtn +
          '<button class="mini-btn" type="button" onclick="shareRecentExercise(' + idx + ')" title="Message and file to send to students, or show the code on the board">📤 Share</button>' +
          '<button class="mini-btn" type="button" onclick="viewRecentExerciseResults(' + idx + ')">📊 View Results</button>' +
          '<button class="mini-btn danger myex-delete" type="button" onclick="deleteRecentExercise(' + idx + ')" title="Delete" aria-label="Delete">🗑</button>' +
        '</div>' +
      '</div>';
  });
  const countEl = document.getElementById('myexCount');
  const filtered = words.length || myexTypeFilter || myexGroupFilter !== null;
  if (countEl) countEl.textContent = filtered ? shown + ' of ' + list.length : list.length + ' exercise' + (list.length === 1 ? '' : 's');
  wrap.innerHTML = shown
    ? html
    : '<div class="empty-results">Nothing matches' + (words.length ? ' “' + escapeForHtml(searchEl.value.trim()) + '”' : '') + (myexTypeFilter ? ' in ' + escapeForHtml(myexTypeFilter) : '') +
      (myexGroupFilter !== null ? ' for ' + escapeForHtml(groupNames[myexGroupFilter] || 'no group') : '') + '. ' +
      '<button class="mini-btn" type="button" onclick="clearMyexFilters()">Show all</button></div>';
}

function setMyexTypeFilter(type) {
  myexTypeFilter = type;
  renderRecentExercises();
}
function setMyexGroupFilter(groupId) {
  myexGroupFilter = groupId;
  renderRecentExercises();
}

function changeRecentExerciseGroup(idx) {
  const item = getRecentExercises()[idx];
  if (!item) return;
  const groups = getStudentGroups();
  if (!groups.length) { showToast('Add a group on the Students page first.'); return; }
  const m = taModal('👥 Which group is "' + item.title + '" for?',
    '<div class="group-pick-list">' +
      groups.map(g => '<button type="button" class="mini-btn' + (g.id === item.groupId ? ' solid' : '') + '" data-g="' + escapeForHtml(g.id) + '">' + escapeForHtml(g.name) + '</button>').join('') +
      '<button type="button" class="mini-btn' + (!groups.some(g => g.id === item.groupId) ? ' solid' : '') + '" data-g="">No group</button>' +
    '</div>');
  m.body.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
    const list = getRecentExercises();
    const at = list.findIndex(e => e.uid === item.uid);
    if (at === -1) return;
    list[at].groupId = b.dataset.g;
    saveRecentExercises(list);
    m.close();
    renderRecentExercises();
    showToast(b.dataset.g ? '"' + item.title + '" is now for ' + b.textContent + '.' : '"' + item.title + '" isn\'t linked to a group now.', 'ok');
  });
}

/* Rename: the name in My Exercises, Results and the notes, and the name
   "Use again" starts with. A file already sent to students keeps the old
   name inside it (make a new one with Use again to change that too). */
function renameRecentExercise(idx) {
  const item = getRecentExercises()[idx];
  if (!item) return;
  const m = taModal('✎ Rename',
    '<input type="text" class="ta-input myex-rename-input" maxlength="120" spellcheck="false" aria-label="New name">' +
    '<p class="ta-modal-text">The new name shows in My Exercises and Results. A file you have already sent keeps its old name.</p>' +
    '<div class="share-actions"><button type="button" class="mini-btn solid" data-act="save">Save</button><button type="button" class="mini-btn" data-act="cancel">Cancel</button></div>');
  const input = m.body.querySelector('.myex-rename-input');
  input.value = item.title;
  setTimeout(() => { input.focus(); input.select(); }, 30);
  const save = () => {
    const name = input.value.replace(/\s+/g, ' ').trim();
    if (!name) { showToast('Please type a name.'); return; }
    const list = getRecentExercises();
    const at = list.findIndex(e => e.uid === item.uid);
    if (at === -1) { m.close(); return; }
    const old = list[at].title;
    list[at].title = name;
    if (list[at].setTitle) list[at].setTitle = name;
    // "Use again" opens the builder with the new name
    const st = list[at].builderState;
    if (st && st.fields) Object.keys(st.fields).forEach(id => { if (/-title$/.test(id) && st.fields[id] === old) st.fields[id] = name; });
    saveRecentExercises(list);
    m.close();
    renderRecentExercises();
    showToast('Renamed to "' + name + '".', 'ok');
  };
  m.body.querySelector('[data-act="save"]').onclick = save;
  m.body.querySelector('[data-act="cancel"]').onclick = m.close;
  input.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
}

function clearMyexFilters() {
  myexTypeFilter = '';
  myexGroupFilter = null;
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
  if (item.builderRounds && item.builderRounds.length) {
    return { set: true, kind: item.setKind || (item.typeLabel === 'Class' ? 'class' : 'homework'), rounds: item.builderRounds, setTitle: item.setTitle || '' };
  }
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
    sessionStorage.setItem('ta_builder_load', JSON.stringify(Object.assign({ title: item.title }, load)));
  } catch (e) { showToast('Your browser blocked this — try again.'); return; }
  taNavigate(load.set ? 'create.html' : 'create.html#' + load.tab); // a set opens from the Create page
}

window.renderRecentExercises = renderRecentExercises;

async function redownloadRecentExercise(idx) {
  const item = getRecentExercises()[idx];
  if (!item) return;
  const html = await taEnsureExerciseHtml(item);
  if (!html) { showToast('This file was not cached and can\'t be redownloaded.'); return; }
  downloadFile(item.title.replace(/[^a-z0-9]/gi, '_') + '.html', html);
  showToast('Redownloaded "' + item.title + '".', 'ok');
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
// Every exercise can be shared as a link (online for 7 days): iPhones can't open
// exercise files, and a phone only allows the microphone on a web page.
function sharesAsLink(item, html) { return !!(item && taPlayUrl(item.uid) && (taPlayLive(item) || html)); }
// withLink false: the message as shown, without the link (the Share window shows the link above it)
function shareMessageFor(item, html, withLink) {
  const lines = ['📘 ' + item.title + ' (' + item.typeLabel + ')'];
  if (item.requiredCode) lines.push('🔑 Code: ' + item.requiredCode);
  if (sharesAsLink(item, html)) {
    lines.push(item.typeLabel === 'Pronunciation'
      ? '🎤 Open this link in Google Chrome (on an iPhone: Safari) — the microphone only works there:'
      : '🔗 Open this link (works on any phone, iPhone too):');
    if (withLink !== false) lines.push(taPlayUrl(item.uid));
    lines.push('Type your student ID' + (item.requiredCode ? ' and the code' : '') + (item.typeLabel === 'Pronunciation' ? ', allow the microphone,' : '') + ' and start. Good luck! 🍀');
  } else lines.push('Open the file, type your student ID' + (item.requiredCode ? ' and the code' : '') + ', and start. Good luck! 🍀');
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

async function shareRecentExercise(idx) {
  const item = getRecentExercises()[idx];
  if (!item) return;
  const html = getCachedExerciseHtml(item.uid) || (taPlayLive(item) ? await taEnsureExerciseHtml(item) : null);
  const asLink = sharesAsLink(item, html);
  const m = taModal('📤 Share "' + item.title + '"',
    (asLink ? '<label class="field-label">Link</label>' +
      '<div class="share-link-row"><input type="text" class="share-link" readonly spellcheck="false" aria-label="Link to the exercise">' +
      '<button type="button" class="mini-btn solid" data-act="copylink">🔗 Copy link</button></div>' : '') +
    ((html || (item.mergedItems && item.mergedItems.length)) ? '<div class="share-dl-row">' +
      (html ? '<button type="button" class="mini-btn" data-act="redownload" title="Download the exercise file again">📥 Redownload</button>' : '') +
      (item.mergedItems && item.mergedItems.length ? '<button type="button" class="mini-btn" data-act="getone" title="Download one exercise of this set, or add it to My Exercises on its own">📤 Get one exercise</button>' : '') +
    '</div>' : '') +
    '<label class="field-label">Message for your students</label>' +
    '<textarea class="share-msg" rows="4"></textarea>' +
    '<div class="share-actions">' +
      '<button type="button" class="mini-btn' + (asLink ? '' : ' solid') + '" data-act="copy">📋 Copy message</button>' +
      (html ? '<button type="button" class="mini-btn" data-act="file">📎 Send the file</button>' : '') +
      (item.requiredCode ? '<button type="button" class="mini-btn" data-act="code">🔢 Show code on screen</button>' : '') +
    '</div>' +
    (sharesAsLink(item, html) ? '<p class="ta-modal-text share-link-note">🔗 …</p>' : '') +
    '<p class="ta-modal-text">' + (html
      ? 'On a phone, <b>Send the file</b> opens Telegram, WhatsApp and the rest with the file and message attached. On a computer it downloads the file for you to attach.'
      : 'This file isn\'t saved in this browser any more, so only the message can be shared. Send the file you downloaded when you made it.') + '</p>',
    { wide: true });
  const msgEl = m.body.querySelector('.share-msg');
  msgEl.value = shareMessageFor(item, html, false);
  // what's copied: the message with the link put back in, after the line that announces it
  const withLink = text => {
    if (!asLink) return text;
    const url = taPlayUrl(item.uid);
    if (text.indexOf(url) !== -1) return text;
    const lines = text.split('\n');
    const at = lines.findIndex(l => /^(🔗|🎤)/.test(l));
    lines.splice(at === -1 ? lines.length : at + 1, 0, url);
    return lines.join('\n');
  };
  // the link: already online, or put (back) online now for another 7 days
  const note = m.body.querySelector('.share-link-note');
  const showUntil = it => {
    if (!note) return;
    const until = taPlayUntil(it);
    note.innerHTML = '🔗 <b>The link works until ' + (until ? until.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) : '—') + '</b> (7 days), on any phone — iPhones too. ' +
      (it.typeLabel === 'Pronunciation' ? 'Pronunciation needs the microphone, which only works from the link (in Chrome), so send the message rather than the file. ' : '') +
      'After that it\'s deleted; share again for a new one.';
  };
  let online = Promise.resolve(true);
  if (sharesAsLink(item, html)) {
    if (taPlayLive(item)) showUntil(item);
    else {
      if (note) note.textContent = '🔗 Putting the exercise online…';
      online = taPublishPlayable(item.uid, html);
      online.then(ok => {
        if (ok) showUntil(getRecentExercises().find(e => e.uid === item.uid) || item);
        else if (note) note.textContent = '⚠️ Couldn\'t put the exercise online (no internet, or the database is full) — send the file instead, or try again.';
      });
    }
  }
  m.body.querySelector('[data-act="copy"]').onclick = () => online.then(() => taCopyText(withLink(msgEl.value), 'Message copied, with the link — paste it into your class chat.'));
  const linkEl = m.body.querySelector('.share-link');
  if (linkEl) {
    linkEl.value = taPlayUrl(item.uid);
    linkEl.onfocus = () => linkEl.select();
    m.body.querySelector('[data-act="copylink"]').onclick = () => online.then(ok => {
      if (ok === false) { showToast('The exercise isn\'t online — send the file instead, or try again.'); return; }
      taCopyText(linkEl.value, 'Link copied.');
    });
  }
  const dlBtn = m.body.querySelector('[data-act="redownload"]');
  if (dlBtn) dlBtn.onclick = () => redownloadRecentExercise(idx);
  const oneBtn = m.body.querySelector('[data-act="getone"]');
  if (oneBtn) oneBtn.onclick = () => { m.close(); getOneFromSet(idx); };
  const fileBtn = m.body.querySelector('[data-act="file"]');
  if (fileBtn) fileBtn.onclick = async () => {
    const filename = item.title.replace(/[^a-z0-9\-_ ]/gi, '').trim().replace(/\s+/g, '_') + '.html';
    const content = html.split('__TA_APP_URL__').join(TA_APP_URL);
    let file = null;
    try { file = new File([content], filename || 'exercise.html', { type: 'text/html' }); } catch (e) { file = null; }
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text: withLink(msgEl.value), title: item.title }); return; }
      catch (e) { if (e && e.name === 'AbortError') return; } // closed the share sheet
    }
    downloadFile(filename || 'exercise.html', html);
    taCopyText(withLink(msgEl.value), 'File downloaded and message copied — attach the file in your class chat.');
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

// "⚠️ Made before a fix": what was fixed, and what to do
function showOldFileInfo(idx) {
  const item = getRecentExercises()[idx];
  const issues = item ? taOldFileIssues(item) : [];
  if (!issues.length) return;
  taModal('⚠️ Made before a fix',
    '<p class="ta-modal-text">This file was made before a bug was fixed, so it still has it: ' + taOldFileWhat(issues) + '.</p>' +
    '<p class="ta-modal-text">Press <b>✏️ Use again</b> to make a new copy, and share that one.</p>');
}

// Results is its own page; it loads this exercise from ?exercise=<uid>.
function viewRecentExerciseResults(idx) {
  const item = getRecentExercises()[idx];
  if (!item) return;
  taNavigate('results.html?exercise=' + encodeURIComponent(item.uid));
}
/* One exercise of a Homework/Class set as its own My Exercises entry. It keeps
   the code and id it was built with, so "View Results" finds its results. */
function roundAsExercise(item, i) {
  const orig = item.mergedItems[i];
  const round = item.builderRounds && item.builderRounds[i];
  const html = setRoundHtml(item, i);
  if (!html) return null; // the set's file isn't saved in this browser any more
  const pick = re => (html.match(re) || [])[1] || '';
  const typeName = round && TA_TAB_LABELS[round.tab] ? TA_TAB_LABELS[round.tab][1] : orig.typeLabel;
  return {
    title: orig.title, typeLabel: typeName,
    code: pick(/const EXERCISE_CODE = "([^"]*)"/) || generateClassCode(),
    uid: pick(/const EXERCISE_UID = "([^"]*)"/) || generateExerciseUid(),
    html: html, requiredCode: pick(/const REQUIRED_CODE = "([^"]*)"/), groupId: item.groupId || '',
    builderTab: round ? round.tab : null, builderState: round ? round.state : null
  };
}


/* Take just one exercise out of a set: download it on its own, or add it to My
   Exercises as a separate exercise. The set stays as it is. */
const SET_FILE_GONE = 'This set\'s file isn\'t saved in this browser, and its online link has expired, so its exercises can\'t be taken out. Use "Use again" to rebuild the set.';

async function getOneFromSet(idx) {
  const item = getRecentExercises()[idx];
  if (!item || !item.mergedItems || !item.mergedItems.length) return;
  await taEnsureExerciseHtml(item);
  if (!roundAsExercise(item, 0)) { showToast(SET_FILE_GONE); return; }
  const have = new Set(getRecentExercises().map(e => e.uid));
  const m = taModal('📤 Get one exercise from "' + item.title + '"',
    '<p class="ta-modal-text">Each exercise works on its own too, with its own results. The ' + escapeForHtml(item.typeLabel.toLowerCase()) + ' set stays as it is.</p>' +
    '<div class="set-round-list">' + item.mergedItems.map((orig, i) => {
      const ex = roundAsExercise(item, i);
      return '<div class="set-round-row"><span><b>' + (i + 1) + '.</b> <span translate="no">' + escapeForHtml(orig.title) + '</span> <span class="badge-type">' + escapeForHtml(ex.typeLabel) + '</span></span>' +
        '<span class="set-round-btns"><button type="button" class="mini-btn" data-dl="' + i + '">⬇ Download</button>' +
        (have.has(ex.uid) ? '<span class="unavailable-hint">In My Exercises</span>' : '<button type="button" class="mini-btn solid" data-add="' + i + '">➕ Add to My Exercises</button>') +
        '</span></div>';
    }).join('') + '</div>', { wide: true });
  m.body.addEventListener('click', e => {
    const dl = e.target.closest('[data-dl]'), add = e.target.closest('[data-add]');
    if (dl) {
      const orig = item.mergedItems[+dl.dataset.dl];
      downloadFile((orig.title.replace(/[^a-z0-9\-_ ]/gi, '').trim().replace(/\s+/g, '_') || 'exercise') + '.html', setRoundHtml(item, +dl.dataset.dl));
      showToast('"' + orig.title + '" downloaded.', 'ok');
    } else if (add) {
      const ex = roundAsExercise(item, +add.dataset.add);
      pushRecentExercise(ex);
      add.outerHTML = '<span class="unavailable-hint">In My Exercises</span>';
      showUndoToast('Added "' + ex.title + '" to My Exercises.', function () { removeRecentExercise(ex.uid); });
    }
  });
}
/* ================= PAGE START ================= */
taOnTab('myexercises', function () {
  // Opened from a group on the Students page: my-exercises.html?group=<id>
  const g = new URLSearchParams(location.search).get('group');
  if (g !== null) { myexTypeFilter = ''; myexGroupFilter = g; const el = document.getElementById('myexSearchInput'); if (el) el.value = ''; }
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
