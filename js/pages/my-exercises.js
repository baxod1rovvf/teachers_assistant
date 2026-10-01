
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
    const disabledBadge = item.disabled
      ? '<span class="badge-type" style="background:rgba(232,103,74,0.14); color:var(--danger);">Points off</span>'
      : '<span class="badge-type">' + escapeForHtml(item.typeLabel) + '</span>';
    const disableBtn = item.disabled
      ? ''
      : '<button class="mini-btn danger" type="button" onclick="disableRecentExercisePoints(' + idx + ')">🚫 Disable Points</button>';
    const gName = groupNames[item.groupId];
    const groupBtn = '<button type="button" class="myex-group-btn' + (gName ? '' : ' none') + '" onclick="changeRecentExerciseGroup(' + idx + ')" title="Change which group this is for"' + (gName ? ' translate="no"' : '') + '>👥 ' + escapeForHtml(gName || 'Set group') + '</button>';
    const oldIssues = taOldFileIssues(item);
    const oldLine = oldIssues.length
      ? '<div class="old-file-line' + (oldIssues.every(x => x.fix.minor) ? ' minor' : '') + '">⚠️ Made before a fix: ' + taOldFileWhat(oldIssues) + '. Press ✏️ Use again to make a new copy, and share that one.</div>'
      : '';
    const codeLine = '<div class="recent-exercise-date">' + groupBtn + (item.requiredCode ? 'Code: ' + escapeForHtml(item.requiredCode) : 'No code set') + ' &middot; ' + dateStr + '</div>';
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
      ? '<button class="mini-btn" type="button" onclick="getOneFromSet(' + idx + ')" title="Download one exercise of this set, or add it to My Exercises on its own">📤 Get one exercise</button>' +
        '<button class="mini-btn" type="button" onclick="separateHomeworkOrClass(' + idx + ')">🔀 Separate</button>'
      : '';
    html +=
      '<div class="recent-exercise-row" data-uid="' + escapeForHtml(item.uid || '') + '">' +
        '<div class="recent-exercise-info">' +
          '<div class="recent-exercise-title"><span translate="no">' + escapeForHtml(item.title) + '</span> ' + disabledBadge + '</div>' +
          codeLine + oldLine +
        '</div>' +
        '<div class="recent-exercise-actions">' +
          againBtn +
          openBtn +
          (worksheetFor(item) ? '<button class="mini-btn" type="button" onclick="printRecentExercise(' + idx + ')" title="A paper version for lessons without devices, with an answer key">🖨 Worksheet</button>' : '') +
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

function shareRecentExercise(idx) {
  const item = getRecentExercises()[idx];
  if (!item) return;
  const html = getCachedExerciseHtml(item.uid);
  const asLink = sharesAsLink(item, html);
  const m = taModal('📤 Share "' + item.title + '"',
    (asLink ? '<label class="field-label">Link</label>' +
      '<div class="share-link-row"><input type="text" class="share-link" readonly spellcheck="false" aria-label="Link to the exercise">' +
      '<button type="button" class="mini-btn solid" data-act="copylink">🔗 Copy link</button></div>' : '') +
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

/* ---------- Printable worksheet ----------
   Word-list exercises turn into a paper version: matching, spelling
   choice, unscrambling, word order, gap-fill… with the answer key on its
   own page. It opens in a new tab ready to print (or save as PDF). */
function wsShuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
// shuffled, but never left in the original order when that's possible
function wsMix(list) {
  if (list.length < 2 || list.every(x => x === list[0])) return list.slice();
  let a;
  do { a = wsShuffle(list); } while (a.join('\u0001') === list.join('\u0001'));
  return a;
}
const WS_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
function wsEsc(t) { return escapeForHtml(String(t == null ? '' : t)).replace(/"/g, '&quot;'); }

function worksheetFor(item) {
  const load = exerciseLoadFor(item);
  if (!load || load.set || !WS_BUILDERS[load.tab]) return null;
  const rows = (load.state.rows || []).filter(r => {
    const w = typeof r === 'string' ? r : Array.isArray(r) ? r[0] : r.s;
    return String(w || '').trim();
  });
  return rows.length ? { tab: load.tab, rows: rows } : null;
}

const WS_BUILDERS = {
  flashcard: rows => {
    const pairs = rows.map(r => ({ w: r[0].trim(), tr: String(r[1] || '').trim() }));
    const withTr = pairs.filter(p => p.tr);
    if (!withTr.length) return WS_BUILDERS.sentences(pairs.map(p => p.w));
    const mixed = wsMix(withTr.map(p => p.tr));
    const letterOf = tr => WS_LETTERS[mixed.indexOf(tr)] || '?';
    return {
      parts: [
        { h: 'Match each word with its translation', note: 'Write the letter next to the number.',
          body: '<div class="ws-match"><ol class="ws-list">' + withTr.map(p => '<li>' + wsEsc(p.w) + ' <span class="ws-blank short"></span></li>').join('') + '</ol>' +
            '<ol class="ws-list" type="a">' + mixed.map(tr => '<li>' + wsEsc(tr) + '</li>').join('') + '</ol></div>' },
        { h: 'Write the English word', body: '<ol class="ws-list">' + wsShuffle(withTr).map(p => '<li>' + wsEsc(p.tr) + ' → <span class="ws-blank"></span></li>').join('') + '</ol>' }
      ],
      key: withTr.map((p, i) => (i + 1) + '-' + letterOf(p.tr)).join(', ')
    };
  },
  spelling: rows => ({
    parts: [{ h: 'Circle the correct spelling',
      body: '<ol class="ws-list">' + rows.map(r => '<li class="ws-options">' + wsShuffle([r[0]].concat((r[1] || []).filter(Boolean))).map(o => '<span>' + wsEsc(o) + '</span>').join('') + '</li>').join('') + '</ol>' }],
    key: rows.map((r, i) => (i + 1) + '. ' + r[0]).join(' · ')
  }),
  makeaword: rows => ({
    parts: [{ h: 'Put the letters in order to make a word',
      body: '<ol class="ws-list">' + rows.map(w => '<li><span class="ws-letters">' + wsEsc(wsMix(Array.from(String(w).replace(/\s+/g, ''))).join(' ')) + '</span> <span class="ws-blank"></span></li>').join('') + '</ol>' }],
    key: rows.map((w, i) => (i + 1) + '. ' + w).join(' · ')
  }),
  pronunciation: rows => ({
    parts: [{ h: 'Read each word aloud, then write it twice',
      body: '<ol class="ws-list">' + rows.map(r => '<li>' + (r[2] ? wsEsc(r[2]) + ' ' : '') + '<b>' + wsEsc(r[0]) + '</b>' + (r[1] ? ' <span class="ws-ipa">/' + wsEsc(String(r[1]).replace(/^\/|\/$/g, '')) + '/</span>' : '') +
        ' <span class="ws-blank"></span> <span class="ws-blank"></span></li>').join('') + '</ol>' }],
    key: ''
  }),
  sentences: rows => ({
    parts: [{ h: 'Write a sentence with each word',
      body: '<ol class="ws-list ws-roomy">' + rows.map(w => '<li><b>' + wsEsc(w) + '</b><span class="ws-line"></span></li>').join('') + '</ol>' }],
    key: ''
  }),
  wordorder: rows => ({
    parts: [{ h: 'Put the words in the right order',
      body: '<ol class="ws-list ws-roomy">' + rows.map(sn => '<li><span class="ws-letters">' + wsEsc(wsMix(String(sn).trim().split(/\s+/)).join('  /  ')) + '</span><span class="ws-line"></span></li>').join('') + '</ol>' }],
    key: rows.map((sn, i) => (i + 1) + '. ' + sn).join('<br>')
  }),
  test: rows => {
    const items = rows.map(r => {
      const words = String(r.s).trim().split(/\s+/);
      let gap = r.gap >= 0 && r.gap < words.length ? r.gap : words.reduce((best, w, i) => w.replace(/\W/g, '').length > words[best].replace(/\W/g, '').length ? i : best, 0);
      const answer = words[gap].replace(/^[^\w']+|[^\w']+$/g, '');
      const shown = words.map((w, i) => i === gap ? w.replace(answer, '_______') : w).join(' ');
      const opts = (r.wrongs || []).filter(Boolean);
      return { shown: shown, answer: answer, opts: opts.length ? wsShuffle([answer].concat(opts)) : null };
    });
    const bank = items.every(it => !it.opts) ? wsShuffle(items.map(it => it.answer)) : null;
    return {
      parts: [{ h: 'Fill in the gaps', note: bank ? 'Use these words: ' + bank.map(wsEsc).join(' · ') : 'Circle the right answer.',
        body: '<ol class="ws-list ws-roomy">' + items.map(it => '<li>' + wsEsc(it.shown) +
          (it.opts ? '<div class="ws-options">' + it.opts.map((o, i) => '<span>' + WS_LETTERS[i] + ') ' + wsEsc(o) + '</span>').join('') + '</div>' : '') + '</li>').join('') + '</ol>' }],
      key: items.map((it, i) => (i + 1) + '. ' + wsEsc(it.answer)).join(' · ')
    };
  }
};

function buildWorksheetHtml(item) {
  const ws = worksheetFor(item);
  const sheet = WS_BUILDERS[ws.tab](ws.rows);
  const gName = groupNameFor(item.groupId);
  const partsHtml = sheet.parts.map((p, i) =>
    '<section><h2>' + (sheet.parts.length > 1 ? (i + 1) + '. ' : '') + wsEsc(p.h) + '</h2>' + (p.note ? '<p class="ws-note">' + p.note + '</p>' : '') + p.body + '</section>').join('');
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + wsEsc(item.title) + ' — worksheet</title><style>' +
    'body{font-family:Georgia,"Times New Roman",serif;color:#111;background:#fff;margin:0;padding:28px;max-width:760px;margin:0 auto;line-height:1.5;font-size:15px}' +
    '.ws-logo{float:right;height:58px;margin:0 0 8px 16px}h1{font-size:24px;margin:0 0 4px}h2{font-size:17px;margin:22px 0 6px}.ws-sub{color:#555;font-size:13px;margin:0 0 14px}' +
    '.ws-head{display:flex;gap:24px;flex-wrap:wrap;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:6px;font-size:14px}.ws-head span{flex:1;min-width:180px;border-bottom:1px solid #999;padding-bottom:2px}' +
    '.ws-list{padding-left:26px;margin:6px 0}.ws-list li{margin:0 0 9px}.ws-roomy li{margin-bottom:16px}' +
    '.ws-match{display:flex;gap:40px;flex-wrap:wrap}.ws-match .ws-list{flex:1;min-width:200px}' +
    '.ws-blank{display:inline-block;min-width:150px;border-bottom:1px solid #333;height:1em;vertical-align:bottom}.ws-blank.short{min-width:40px}' +
    '.ws-line{display:block;border-bottom:1px solid #333;height:1.9em}.ws-letters{letter-spacing:.06em;font-family:"Courier New",monospace}.ws-ipa{color:#555}' +
    '.ws-options span{display:inline-block;margin:2px 22px 2px 0}.ws-note{margin:0 0 6px;color:#333;font-style:italic}' +
    '.ws-key{page-break-before:always;break-before:page;padding-top:10px}.ws-key p{font-size:14px}' +
    '.ws-bar{position:sticky;top:0;background:#fff;padding:8px 0 12px;display:flex;gap:10px;align-items:center;font-family:system-ui,sans-serif;font-size:13px;color:#555}' +
    '.ws-bar button{font:inherit;font-weight:700;padding:8px 16px;border-radius:8px;border:1.5px solid #111;background:#111;color:#fff;cursor:pointer}' +
    '@media print{.ws-bar{display:none}body{padding:0}}' +
    '</style></head><body>' +
    '<div class="ws-bar"><button type="button" onclick="print()">🖨 Print</button><span>Or save it as PDF from the print window.' + (sheet.key ? ' The answer key prints on its own page.' : '') + '</span></div>' +
    '<img class="ws-logo" src="' + new URL('images/app/logo-full.png', location.href).href + '" alt="Teacher\'s Assistant">' +
    '<h1>' + wsEsc(item.title) + '</h1><p class="ws-sub">' + wsEsc(item.typeLabel) + (gName ? ' · ' + wsEsc(gName) : '') + '</p>' +
    '<div class="ws-head"><span>Name:</span><span>Date:</span></div>' + partsHtml +
    (sheet.key ? '<div class="ws-key"><h2>Answer key — ' + wsEsc(item.title) + '</h2><p>' + sheet.key + '</p></div>' : '') +
    '</body></html>';
}

function printRecentExercise(idx) {
  const item = getRecentExercises()[idx];
  if (!item || !worksheetFor(item)) return;
  const html = buildWorksheetHtml(item);
  const win = window.open('', '_blank');
  if (win && win.document) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    return;
  }
  // pop-up blocked: download it instead
  downloadFile((item.title.replace(/[^a-z0-9\-_ ]/gi, '').trim().replace(/\s+/g, '_') || 'worksheet') + '_worksheet.html', html);
  showToast('Worksheet downloaded — open it and print.', 'ok');
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

function separateHomeworkOrClass(idx) {
  const item = getRecentExercises()[idx];
  if (!item || !item.mergedItems || !item.mergedItems.length) return;
  const parts = item.mergedItems.map((orig, i) => roundAsExercise(item, i));
  if (parts.some(p => !p)) { showToast(SET_FILE_GONE); return; }
  if (!confirm('Separate "' + item.title + '" back into its ' + item.mergedItems.length + ' original exercises?')) return;
  parts.forEach(p => pushRecentExercise(p));
  removeRecentExercise(item.uid);
  showToast('Separated back into ' + item.mergedItems.length + ' exercises.', 'ok');
}

/* Take just one exercise out of a set: download it on its own, or add it to My
   Exercises as a separate exercise. The set stays as it is. */
const SET_FILE_GONE = 'This set\'s file isn\'t saved in this browser any more, so its exercises can\'t be taken out. Use "Use again" to rebuild the set, or Redownload it on the device where you made it.';

function getOneFromSet(idx) {
  const item = getRecentExercises()[idx];
  if (!item || !item.mergedItems || !item.mergedItems.length) return;
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
