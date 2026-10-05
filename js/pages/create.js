/* ================= GENERIC ROW HELPERS ================= */

/* ================= COMPOSE BOX (type, press Enter, it becomes a row) ================= */
function splitComposeText(raw, mode) {
  const lines = raw.split(/\n+/).map(s => s.trim()).filter(Boolean);
  let pieces = [];
  if (mode === 'sentence') {
    lines.forEach(line => {
      let parts = line.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
      if (parts.length <= 1 && /[.!?]/.test(line)) {
        const alt = line.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
        if (alt.length > 1) parts = alt;
      }
      pieces = pieces.concat(parts);
    });
  } else if (mode === 'word') {
    lines.forEach(line => {
      pieces = pieces.concat(line.split(/[,،]+/).map(s => s.trim()).filter(Boolean));
    });
  } else {
    pieces = lines;
  }
  return pieces.filter(Boolean);
}

function commitComposeBox(composeId, mode, addRowFn) {
  const el = document.getElementById(composeId);
  if (!el) return;
  const pieces = splitComposeText(el.value, mode);
  pieces.forEach(p => addRowFn(p));
  el.value = '';
  el.focus();
}

function handleComposeKeydown(e, composeId, mode, addRowFn) {
  if (e.key !== 'Enter' || e.shiftKey) return;
  e.preventDefault();
  commitComposeBox(composeId, mode, addRowFn);
}

function makeSingleRow(container, placeholder) {
  const row = document.createElement('div');
  row.className = 'row-item';
  const idx = document.createElement('div');
  idx.className = 'idx';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.innerHTML = '&times;';
  removeBtn.type = 'button';
  removeBtn.onclick = () => { row.remove(); renumberRows(container); };
  row.appendChild(idx);
  row.appendChild(input);
  row.appendChild(removeBtn);
  container.appendChild(row);
  renumberRows(container);
  return input;
}

function makePairRow(container, placeholderA, placeholderB) {
  const row = document.createElement('div');
  row.className = 'row-item';
  const idx = document.createElement('div');
  idx.className = 'idx';
  const pair = document.createElement('div');
  pair.className = 'pair';
  const inputA = document.createElement('input');
  inputA.type = 'text';
  inputA.placeholder = placeholderA;
  const inputB = document.createElement('input');
  inputB.type = 'text';
  inputB.placeholder = placeholderB;
  pair.appendChild(inputA);
  pair.appendChild(inputB);
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.innerHTML = '&times;';
  removeBtn.type = 'button';
  removeBtn.onclick = () => { row.remove(); renumberRows(container); };
  row.appendChild(idx);
  row.appendChild(pair);
  row.appendChild(removeBtn);
  container.appendChild(row);
  renumberRows(container);
  return [inputA, inputB];
}

function renumberRows(container) {
  Array.from(container.children).forEach((row, i) => {
    row.querySelector('.idx').innerText = i + 1;
  });
  if (container.id === 'wo-rows') document.getElementById('wo-count').innerText = container.children.length;
  if (container.id === 'maw-rows') document.getElementById('maw-count').innerText = container.children.length;
  if (container.id === 'fc-rows') document.getElementById('fc-count').innerText = container.children.length;
  if (container.id === 'ck-rows') document.getElementById('ck-count').innerText = container.children.length;
  if (container.id === 'cg-rows') document.getElementById('cg-count').innerText = container.children.length;
  if (container.id === 'sn-rows') document.getElementById('sn-count-display').innerText = container.children.length;
}

/* ================= WORD ORDER ROWS ================= */
const woRows = document.getElementById('wo-rows');
function addWordOrderRow() { makeSingleRow(woRows, 'e.g. She has cooked dinner already.'); }
function addWordOrderRowFilled(text) {
  const input = makeSingleRow(woRows, 'e.g. She has cooked dinner already.');
  input.value = text;
}

function resetWordOrderForm() {
  document.getElementById('wo-title').value = '';
  const woIns = document.getElementById('wo-instructions'); if (woIns) woIns.value = '';
  const woPts = document.getElementById('wo-points'); if (woPts) woPts.value = '10';
  const woCompose = document.getElementById('wo-compose'); if (woCompose) woCompose.value = '';
  woRows.innerHTML = '';
  renumberRows(woRows);
}

/* ================= MAKE A WORD ROWS ================= */
const mawRows = document.getElementById('maw-rows');
function addMakeAWordRow() { makeSingleRow(mawRows, 'e.g. kitchen'); }
function addMakeAWordRowFilled(text) {
  const input = makeSingleRow(mawRows, 'e.g. kitchen');
  input.value = text;
}

function resetMakeAWordForm() {
  document.getElementById('maw-title').value = '';
  const mawIns = document.getElementById('maw-instructions'); if (mawIns) mawIns.value = '';
  const mawPts = document.getElementById('maw-points'); if (mawPts) mawPts.value = '10';
  const mawCompose = document.getElementById('maw-compose'); if (mawCompose) mawCompose.value = '';
  mawRows.innerHTML = '';
  renumberRows(mawRows);
}

/* ================= FLASHCARD ROWS ================= */
const fcRows = document.getElementById('fc-rows');
function addFlashcardRow() { makePairRow(fcRows, 'Word (e.g. kitchen)', 'Translation (e.g. oshxona)'); }
function addFlashcardRowFilled(line) {
  const parts = line.split(/\s*[-–—:]\s*/);
  const [inputA, inputB] = makePairRow(fcRows, 'Word (e.g. kitchen)', 'Translation (e.g. oshxona)');
  inputA.value = (parts[0] || '').trim();
  inputB.value = (parts.slice(1).join(' - ') || '').trim();
}

function resetFlashcardForm() {
  document.getElementById('fc-title').value = '';
  const fcIns = document.getElementById('fc-instructions'); if (fcIns) fcIns.value = '';
  document.getElementById('fc-points').value = '10';
  document.getElementById('fc-groups').value = '3';
  document.getElementById('fc-quiz-mode').value = 'choice';
  document.getElementById('fc-direction').value = 'uz2en';
  document.getElementById('fc-lose-progress').value = 'true';
  document.getElementById('fc-keep-progress-on-back').value = 'true';
  const fcCompose = document.getElementById('fc-compose'); if (fcCompose) fcCompose.value = '';
  if (window.onQuizModeChange) onQuizModeChange();
  fcRows.innerHTML = '';
  renumberRows(fcRows);
}

/* Fills every empty translation box with a machine translation (the same
   free service Bidirectional Language uses). Words go in batches, one per
   line, so 30 words take one or two requests; a batch that comes back
   with a different number of lines is redone word by word. */
async function autoTranslateFlashcards() {
  const lang = document.getElementById('fc-tr-lang').value;
  const todo = Array.from(fcRows.querySelectorAll('.row-item')).map(r => r.querySelectorAll('input'))
    .filter(inp => inp[0].value.trim() && !inp[1].value.trim());
  if (!todo.length) {
    showToast(fcRows.querySelector('.row-item') ? 'Every word already has a translation.' : 'Type some words first.');
    return;
  }
  const btn = document.getElementById('fc-translate-btn');
  btn.disabled = true;
  const label = btn.textContent;
  btn.textContent = '🌐 Translating…';
  let ok = 0, fail = 0;
  for (let i = 0; i < todo.length; i += 40) {
    const batch = todo.slice(i, i + 40);
    let lines = null;
    const joined = await mtTranslateBuilder(batch.map(inp => inp[0].value.trim()).join('\n'), lang);
    if (joined !== null) {
      lines = joined.split('\n').map(x => x.trim());
      if (lines.length !== batch.length) lines = null;
    }
    for (let j = 0; j < batch.length; j++) {
      let tr = lines ? lines[j] : await mtTranslateBuilder(batch[j][0].value.trim(), lang);
      if (tr && !batch[j][1].value.trim()) { batch[j][1].value = tr; ok++; } else if (!tr) fail++;
    }
  }
  btn.disabled = false;
  btn.textContent = label;
  if (!fail) showToast('✅ Translated ' + ok + ' word' + (ok === 1 ? '' : 's') + '. Check them — machine translation can be wrong.', 'ok');
  else if (ok) showToast('⚠️ Translated ' + ok + ', but ' + fail + ' failed — type those by hand.');
  else showToast('The translation service isn\'t answering right now — check your internet connection, or type them by hand.');
}

/* ================= CAN KNOCKDOWN ROWS (word + translation) ================= */
const ckRows = document.getElementById('ck-rows');
function addCanKnockRow() { makePairRow(ckRows, 'Word (e.g. hello)', 'Translation (e.g. salom)'); }
function addCanKnockRowFilled(line) {
  const parts = line.split(/\s*[-–—:]\s*/);
  const [inputA, inputB] = makePairRow(ckRows, 'Word (e.g. hello)', 'Translation (e.g. salom)');
  inputA.value = (parts[0] || '').trim();
  inputB.value = (parts.slice(1).join(' - ') || '').trim();
}
function resetCanKnockForm() {
  document.getElementById('ck-title').value = '';
  document.getElementById('ck-points').value = '10';
  document.getElementById('ck-code').value = '';
  document.getElementById('ck-timer').value = '';
  const ckCompose = document.getElementById('ck-compose'); if (ckCompose) ckCompose.value = '';
  ckRows.innerHTML = '';
  renumberRows(ckRows);
}
// the same machine translation as Flashcard, into the boxes of this builder
async function autoTranslateCanKnock() {
  const lang = document.getElementById('ck-tr-lang').value;
  const btn = document.getElementById('ck-translate-btn');
  const todo = Array.from(ckRows.querySelectorAll('.row-item')).map(r => r.querySelectorAll('input'))
    .filter(inp => inp[0].value.trim() && !inp[1].value.trim());
  if (!todo.length) { showToast(ckRows.querySelector('.row-item') ? 'Every word already has a translation.' : 'Type some words first.'); return; }
  btn.disabled = true;
  const label = btn.textContent;
  btn.textContent = '🌐 Translating…';
  let ok = 0, fail = 0;
  for (let i = 0; i < todo.length; i += 40) {
    const batch = todo.slice(i, i + 40);
    let lines = null;
    const joined = await mtTranslateBuilder(batch.map(inp => inp[0].value.trim()).join('\n'), lang);
    if (joined !== null) { lines = joined.split('\n').map(x => x.trim()); if (lines.length !== batch.length) lines = null; }
    for (let j = 0; j < batch.length; j++) {
      const tr = lines ? lines[j] : await mtTranslateBuilder(batch[j][0].value.trim(), lang);
      if (tr && !batch[j][1].value.trim()) { batch[j][1].value = tr; ok++; } else if (!tr) fail++;
    }
  }
  btn.disabled = false;
  btn.textContent = label;
  if (!fail) showToast('✅ Translated ' + ok + ' word' + (ok === 1 ? '' : 's') + '. Check them — machine translation can be wrong.', 'ok');
  else if (ok) showToast('⚠️ Translated ' + ok + ', but ' + fail + ' failed — type those by hand.');
  else showToast('The translation service isn\'t answering right now — check your internet connection, or type them by hand.');
}

/* ================= CAR GAME ROWS (word + translation) ================= */
const cgRows = document.getElementById('cg-rows');
function addCarGameRow() { makePairRow(cgRows, 'Word (e.g. road)', 'Translation (e.g. yo\'l)'); }
function addCarGameRowFilled(line) {
  const parts = line.split(/\s*[-–—:]\s*/);
  const [inputA, inputB] = makePairRow(cgRows, 'Word (e.g. road)', 'Translation (e.g. yo\'l)');
  inputA.value = (parts[0] || '').trim();
  inputB.value = (parts.slice(1).join(' - ') || '').trim();
}
function resetCarGameForm() {
  document.getElementById('cg-title').value = '';
  document.getElementById('cg-points').value = '10';
  document.getElementById('cg-code').value = '';
  document.getElementById('cg-timer').value = '';
  document.getElementById('cg-seconds').value = '4';
  document.getElementById('cg-speed').value = 'auto';
  const cgCompose = document.getElementById('cg-compose'); if (cgCompose) cgCompose.value = '';
  cgRows.innerHTML = '';
  renumberRows(cgRows);
}
// the same machine translation as Flashcard, into the boxes of this builder
async function autoTranslateCarGame() {
  const lang = document.getElementById('cg-tr-lang').value;
  const btn = document.getElementById('cg-translate-btn');
  const todo = Array.from(cgRows.querySelectorAll('.row-item')).map(r => r.querySelectorAll('input'))
    .filter(inp => inp[0].value.trim() && !inp[1].value.trim());
  if (!todo.length) { showToast(cgRows.querySelector('.row-item') ? 'Every word already has a translation.' : 'Type some words first.'); return; }
  btn.disabled = true;
  const label = btn.textContent;
  btn.textContent = '🌐 Translating…';
  let ok = 0, fail = 0;
  for (let i = 0; i < todo.length; i += 40) {
    const batch = todo.slice(i, i + 40);
    let lines = null;
    const joined = await mtTranslateBuilder(batch.map(inp => inp[0].value.trim()).join('\n'), lang);
    if (joined !== null) { lines = joined.split('\n').map(x => x.trim()); if (lines.length !== batch.length) lines = null; }
    for (let j = 0; j < batch.length; j++) {
      const tr = lines ? lines[j] : await mtTranslateBuilder(batch[j][0].value.trim(), lang);
      if (tr && !batch[j][1].value.trim()) { batch[j][1].value = tr; ok++; } else if (!tr) fail++;
    }
  }
  btn.disabled = false;
  btn.textContent = label;
  if (!fail) showToast('✅ Translated ' + ok + ' word' + (ok === 1 ? '' : 's') + '. Check them — machine translation can be wrong.', 'ok');
  else if (ok) showToast('⚠️ Translated ' + ok + ', but ' + fail + ' failed — type those by hand.');
  else showToast('The translation service isn\'t answering right now — check your internet connection, or type them by hand.');
}

/* ================= FLASHCARD MODE HINT ================= */
function onQuizModeChange() {
  const mode = document.getElementById('fc-quiz-mode').value;
  const hint = document.getElementById('fc-mode-hint');
  if (!hint) return;
  if (mode === 'choice') {
    hint.innerText = 'The student picks the correct answer from 3 options.';
  } else if (mode === 'write') {
    hint.innerText = 'The student types the answer by hand — no options shown.';
  } else {
    hint.innerText = 'In "Both" mode, the student first picks an option (without being told right or wrong), then a text box appears to write the answer — only after writing is the result revealed.';
  }
}

/* ================= HOMEWORK / CLASS (build inline, round by round) ================= */
const HWC_TYPES = [
  { key: 'wordorder', label: 'Word Order', icon: '\ud83e\udde9', color: '#4f7df3', img: 'wordorder', createFn: 'createWordOrder' },
  { key: 'makeaword', label: 'Make a Word', icon: '\ud83e\uddf1', color: '#2dd4bf', img: 'makeaword', createFn: 'createMakeAWord' },
  { key: 'flashcard', label: 'Flashcard', icon: '\ud83c\udfb4', color: '#fb923c', img: 'flashcard', createFn: 'createFlashcard' },
  { key: 'pronunciation', label: 'Pronunciation', icon: '\ud83c\udf99\ufe0f', color: '#34d399', img: 'pronunciation', createFn: 'createPronunciation' },
  { key: 'spelling', label: 'Spelling', icon: '\ud83d\udd24', color: '#8b7bf7', img: 'spelling', createFn: 'createSpelling' },
  { key: 'canknock', label: 'Can Knockdown', icon: '\ud83e\udd6b', color: '#f03a52', img: 'canknock', createFn: 'createCanKnockdown' },
  { key: 'cargame', label: 'Car Game', icon: '\ud83d\ude97', color: '#e0a526', img: 'cargame', createFn: 'createCarGame' },
  { key: 'test', label: 'Test', icon: '\u2705', color: '#ef5f74', img: 'test', createFn: 'createTest' },
  { key: 'sentences', label: 'Sentences', icon: '\u270d\ufe0f', color: '#4f9de0', img: 'sentences', createFn: 'createSentences' },
  { key: 'bilingual', label: 'Bidirectional Language', icon: '\ud83d\udcd6', color: '#2f6fd6', img: 'bilingual', createFn: 'createBilingualReader' },
  { key: 'engcontent', label: 'English Content', icon: '\ud83c\udfac', color: '#e14e4e', img: 'engcontent', createFn: 'createEnglishContent' },
  { key: 'dictation', label: 'Dictation', icon: '\ud83c\udfa7', color: '#8b5cf6', img: 'listening', createFn: 'createDictation' },
  { key: 'ielts-listening', label: 'IELTS Listening', icon: '\ud83c\udfa7', color: '#0ea5e9', img: 'listening', createFn: 'createIeltsListening' },
  { key: 'ielts-reading', label: 'IELTS Reading', icon: '\ud83d\udcd7', color: '#0ea5e9', img: 'reading', createFn: 'createIeltsReading' }
];

let hwcKind = 'homework';
let hwcRounds = []; // { label, html, code } \u2014 code is round 1's own original code, carried through
let hwcCurrentType = null;
let hwcRoundOriginParent = null;
let hwcRoundOriginNext = null;

/* A Homework/Class set has one class code and one points value, chosen in
   round 1. Later rounds hide those fields and are built with the set's
   values; in the student file every round gives 0 points except the last,
   which gives the set's points once the whole set is finished. */
const HWC_PREFIX = { wordorder: 'wo', makeaword: 'maw', flashcard: 'fc', pronunciation: 'pr', spelling: 'sp', canknock: 'ck', cargame: 'cg', test: 'ts',
  sentences: 'sn', bilingual: 'br', engcontent: 'ec', dictation: 'dc', 'ielts-listening': 'il', 'ielts-reading': 'ir' };
function hwcSetPoints() {
  const m = hwcRounds.length ? hwcRounds[0].html.match(/const POINTS_AWARD = (-?\d+(?:\.\d+)?);/) : null;
  return m ? Number(m[1]) : 0;
}
// Round 2 onwards: build with the set's code and points (the form's own values come back afterwards).
function hwcWithSetValues(fn) {
  const p = hwcCurrentType && HWC_PREFIX[hwcCurrentType.key];
  if (!hwcRounds.length || !p) return fn();
  const codeEl = document.getElementById(p + '-code'), ptsEl = document.getElementById(p + '-points');
  const keep = [codeEl ? codeEl.value : null, ptsEl ? ptsEl.value : null];
  if (codeEl) codeEl.value = hwcRounds[0].code || '';
  if (ptsEl) {
    const want = String(hwcSetPoints());
    if (!Array.from(ptsEl.options || []).some(o => o.value === want) && ptsEl.tagName === 'SELECT') ptsEl.add(new Option(want + ' points', want));
    ptsEl.value = want;
  }
  try { return fn(); }
  finally { if (codeEl) codeEl.value = keep[0]; if (ptsEl) ptsEl.value = keep[1]; }
}
// Shows or hides the code and points fields of the builder in the round.
function hwcMarkSetFields(card, laterRound) {
  const p = hwcCurrentType && HWC_PREFIX[hwcCurrentType.key];
  if (!card) return;
  card.classList.toggle('hwc-later-round', !!laterRound);
  if (!p) return;
  [p + '-code', p + '-points'].forEach(id => {
    const el = document.getElementById(id);
    const field = el && (el.closest('.title-field') || el.parentElement);
    if (field) field.classList.add('hwc-set-field');
  });
}
function renderHwcSetNote() {
  const note = document.getElementById('hwcSetNote');
  if (!note) return;
  if (!hwcRounds.length) {
    note.innerHTML = '🔑 The <b>class code</b> and <b>points</b> you choose in this first round are for the whole ' + (hwcKind === 'class' ? 'class set' : 'homework') +
      '. Students enter the code and their ID once, and get the points when they finish every exercise.';
  } else {
    const code = hwcRounds[0].code, pts = hwcSetPoints();
    note.innerHTML = '🔑 Same as round 1 for the whole set: ' + (code ? 'code <b>' + escapeForHtml(code) + '</b>' : '<b>no code</b>') +
      ' · <b>' + pts + ' point' + (pts === 1 ? '' : 's') + '</b>, given when the student finishes every exercise.';
  }
}

/* The set's title: what the teacher typed, else round 1's exercise title, else the date. */
function hwcSetTitle() {
  const typed = (document.getElementById('hwcSetTitle') || { value: '' }).value.trim();
  if (typed) return { title: typed, typed: true };
  const r = hwcRounds[0];
  const p = r && HWC_PREFIX[r.tab];
  const first = p && r.state && r.state.fields ? String(r.state.fields[p + '-title'] || '').trim() : '';
  return { title: first || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), typed: false };
}

function openHwcBuilder(kind) {
  hwcKind = kind;
  const titleEl = document.getElementById('hwcSetTitle');
  if (titleEl) titleEl.value = '';
  const titleLabel = document.getElementById('hwcSetTitleLabel');
  if (titleLabel) titleLabel.textContent = kind === 'class' ? 'Class title' : 'Homework title';
  hwcRounds = [];
  hwcCurrentType = null;
  document.getElementById('hwcBuilderTitle').textContent = kind === 'class' ? '\ud83c\udfeb Class' : '\ud83d\udcda Homework';
  renderHwcRoundsBanner();
  renderHwcTypeGrid();
  switchTo('hwcbuilder');
}

function renderHwcRoundsBanner() {
  const banner = document.getElementById('hwcRoundsBanner');
  const numEl = document.getElementById('hwcRoundNum');
  if (numEl) numEl.textContent = hwcRounds.length + 1;
  if (!banner) return;
  if (!hwcRounds.length) { banner.style.display = 'none'; return; }
  banner.style.display = '';
  banner.innerHTML = '<div class="title-field"><label class="field-label">Added so far</label><div>' +
    hwcRounds.map((r, i) => '<span class="badge-type hwc-round-badge">' + (i + 1) + '. ' + escapeForHtml(r.label) +
      '<button type="button" class="hwc-round-remove" onclick="hwcRemoveRound(' + i + ')" title="Take this exercise out of the set" aria-label="Remove round ' + (i + 1) + '">✕</button></span>').join('') +
    '</div></div>';
}

function hwcRemoveRound(i) {
  const r = hwcRounds[i];
  if (!r) return;
  hwcRounds.splice(i, 1);
  renderHwcRoundsBanner();
  showUndoToast('Took "' + r.label + '" out of the set.', function () {
    hwcRounds.splice(Math.min(i, hwcRounds.length), 0, r);
    renderHwcRoundsBanner();
  });
}

function renderHwcTypeGrid() {
  const grid = document.getElementById('hwcTypeGrid');
  if (!grid) return;
  grid.innerHTML = HWC_TYPES.map(t =>
    '<button class="picker-card" type="button" onclick="selectHwcType(' + jsAttr(t.key) + ')">' +
      (t.img
        ? '<span class="exercise-badge picker-icon picker-icon-' + t.img + '" aria-hidden="true"></span>'
        : '<span class="exercise-badge" style="background:' + t.color + ';">' + t.icon + '</span>') +
      '<div><div class="picker-card-title">' + t.label + '</div></div>' +
    '</button>'
  ).join('');
}

function selectHwcType(key) {
  const type = HWC_TYPES.find(t => t.key === key);
  if (!type) return;
  hwcCurrentType = type;
  const panel = document.getElementById('panel-' + type.key);
  const card = panel ? panel.querySelector('.card') : null;
  const host = document.getElementById('hwcRoundHost');
  if (!card || !host) { showToast('That exercise type is not available yet.'); return; }
  hwcRoundOriginParent = card.parentNode;
  hwcRoundOriginNext = card.nextSibling;
  host.appendChild(card);
  const numEl = document.getElementById('hwcRoundHostNum');
  if (numEl) numEl.textContent = hwcRounds.length + 1;
  const actions = card.querySelector('.builder-actions');
  if (actions) actions.style.display = 'none';
  if (typeof taFillGroupSelect === 'function') taFillGroupSelect(type.key);
  hwcMarkSetFields(card, hwcRounds.length > 0);
  renderHwcSetNote();
  switchTo('hwcround');
}

function hwcRestoreCard() {
  const host = document.getElementById('hwcRoundHost');
  const card = host ? host.firstElementChild : null;
  if (card && hwcRoundOriginParent) {
    const actions = card.querySelector('.builder-actions');
    if (actions) actions.style.display = '';
    card.classList.remove('hwc-later-round');
    hwcRoundOriginParent.insertBefore(card, hwcRoundOriginNext);
  }
  hwcRoundOriginParent = null;
  hwcRoundOriginNext = null;
}

function hwcBackToTypePicker() {
  hwcRestoreCard();
  hwcCurrentType = null;
  renderHwcRoundsBanner();
  switchTo('hwcbuilder');
}

function captureHwcRoundBuild() {
  if (!hwcCurrentType) return null;
  let captured = null;
  const original = window.downloadFile;
  const originalPush = window.pushRecentExercise;
  window.downloadFile = function (filename, content) { captured = content; };
  // a round belongs to the set, not to My Exercises on its own (the finished set is listed there)
  window.pushRecentExercise = function () {};
  try { hwcWithSetValues(() => window[hwcCurrentType.createFn]()); } catch (e) { /* validation toast already shown by the builder itself */ }
  window.downloadFile = original;
  window.pushRecentExercise = originalPush;
  return captured;
}

function hwcCaptureCurrentRound() {
  const html = captureHwcRoundBuild();
  if (!html) return false;
  if (typeof taRememberSettings === 'function') taRememberSettings(hwcCurrentType.key);
  const codeMatch = html.match(/const REQUIRED_CODE = "([^"]*)"/);
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  // the round's form, so the whole set can be reopened later with "Use again"
  let state = typeof taCaptureBuilder === 'function' ? taCaptureBuilder(hwcCurrentType.key) : null;
  if (state && JSON.stringify(state).length > 300000) state = null;
  hwcRounds.push({
    tab: hwcCurrentType.key,
    state: state,
    groupId: typeof taBuilderGroup === 'function' ? taBuilderGroup(hwcCurrentType.key) : '',
    label: titleMatch ? titleMatch[1] : hwcCurrentType.label,
    html: html,
    code: hwcRounds.length === 0 && codeMatch ? codeMatch[1] : (hwcRounds[0] ? hwcRounds[0].code : '')
  });
  return true;
}

function hwcAddExercise() {
  if (!hwcCaptureCurrentRound()) { showToast('Please finish filling in this exercise before adding it.'); return; }
  hwcRestoreCard();
  hwcCurrentType = null;
  showToast('Added. Choose the next exercise.', 'ok');
  renderHwcRoundsBanner();
  renderHwcTypeGrid();
  switchTo('hwcbuilder');
}

/* "Create" with nothing added yet behaves exactly like building that one
   exercise normally, with no Homework/Class wrapper around it at all \u2014
   only once a second exercise has been added does this produce a merged,
   multi-round file. */
function hwcFinishAndCreate() {
  if (!hwcRounds.length) {
    hwcRestoreCard();
    if (hwcCurrentType) window[hwcCurrentType.createFn]();
    hwcCurrentType = null;
    switchTo('createpicker');
    return;
  }
  if (!hwcCaptureCurrentRound()) { showToast('Please finish filling in this exercise before creating.'); return; }
  hwcRestoreCard();
  buildAndDownloadHwc();
}

function cancelHwcBuilder() {
  if (!confirm('Cancel? Anything added so far will be lost.')) return;
  hwcRestoreCard();
  hwcRounds = [];
  hwcCurrentType = null;
  switchTo('createpicker');
}

/* A merged Homework/Class file needs its own results tracking that
   survives the student closing and reopening it, not just an in-memory
   variable. Progress is written to Firestore keyed by this file's own
   code plus the student's ID, so reopening with the same ID resumes at
   the first unfinished exercise rather than starting over. Each round's
   own certificate is skipped \u2014 the wrapper covers it immediately with
   its own full-screen "next exercise" screen \u2014 and only the very end of
   the whole set shows a certificate, generated by the wrapper itself. */
function buildAndDownloadHwc() {
  const setPoints = hwcSetPoints();
  const hwcUid = generateExerciseUid();
  const rounds = hwcRounds.map((r, i) => ({
    label: r.label,
    html: r.html.replace(/const REQUIRED_CODE = "[^"]*";/, 'const REQUIRED_CODE = "";')
      // "Open in Chrome" (Pronunciation) opens the whole set's link: the round alone isn't online
      .replace(/(play\.html\?x=' \+ encodeURIComponent\(")[^"]*("\))/g, '$1' + hwcUid + '$2')
      // one points value for the whole set, given by the last round
      .replace(/const POINTS_AWARD = -?\d+(?:\.\d+)?;/, 'const POINTS_AWARD = ' + (i === hwcRounds.length - 1 ? setPoints : 0) + ';'),
    code: (r.html.match(/const EXERCISE_CODE = "([^"]*)"/) || [])[1] || ''
  }));
  // each round's file is inside the set's own file (see setRoundHtml), not kept twice
  const mergedItems = hwcRounds.map(r => ({ title: r.label, typeLabel: r.label, code: (r.html.match(/const EXERCISE_CODE = "([^"]*)"/) || [])[1] || '' }));

  const setTitle = hwcSetTitle();
  const title = setTitle.title;
  const requiredCode = hwcRounds[0].code || '';
  const code = generateClassCode();
  const classCode = setActiveClassCode(code);
  const boardCode = getPointsBoardCode();
  const roster = getPointsRoster();

  const wrapper = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeForHtml(title)}</title>
<style>
html,body{margin:0;padding:0;height:100%;background:#101116;font-family:'Inter',system-ui,sans-serif;overflow:hidden;}
#hwcBar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 16px;background:#17181F;color:#F2F2F7;font-weight:800;font-size:.95rem;position:relative;z-index:10;}
#hwcFrame{width:100%;height:calc(100% - 40px);border:none;display:block;position:relative;z-index:10;}
.hwc-send-anim{position:relative;z-index:2;width:min(440px,86vw);height:calc(min(440px,86vw) * 0.185);display:none;align-items:center;justify-content:center;}
.hwc-send-anim svg{width:100% !important;height:100% !important;}
.hwc-send-bar{width:80%;height:12px;border-radius:999px;background:linear-gradient(90deg,#4F46E5,#EC4899,#4F46E5);background-size:200% 100%;animation:hwcBar 1.2s linear infinite;}
@keyframes hwcBar{from{background-position:200% 0}to{background-position:0 0}}
.hwc-sent-note{position:relative;z-index:2;color:#3FD6B4 !important;font-weight:800;font-size:1.05rem !important;}
#hwcReviewBar{position:fixed;left:0;right:0;bottom:0;z-index:60;display:none;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;padding:12px 16px;background:rgba(16,17,22,.94);color:#fff;font-weight:700;box-shadow:0 -8px 24px rgba(0,0,0,.35);}
#hwcReviewBar.show{display:flex;}
#hwcReviewBar .ta-btn{padding:12px 18px;font-size:.98rem;}
.ta-screen{position:fixed;inset:0;z-index:50;display:none;align-items:center;justify-content:center;flex-direction:column;gap:14px;background:#101116;color:#fff;text-align:center;padding:24px;overflow:hidden;}
.ta-screen.show{display:flex;}
.ta-screen .ta-blob{position:absolute;border-radius:50%;opacity:.75;pointer-events:none;}
.ta-screen .ta-blob1{display:none;}
.ta-screen .ta-blob2{display:none;}
.ta-screen .ta-blob3{display:none;}
.ta-screen .ta-road{display:none;}
.ta-screen h1{position:relative;z-index:2;font-family:'Space Grotesk',sans-serif;font-size:1.9rem;margin:8px 0 2px;font-weight:800;}
.ta-screen h1 .ta-accent{color:#4F46E5;}
.ta-screen .ta-underline{position:relative;z-index:2;width:46px;height:3px;background:#4F46E5;border-radius:2px;margin-bottom:14px;}
.ta-screen p{position:relative;z-index:2;color:#B7BACB;max-width:460px;margin:0 0 6px;font-size:.95rem;line-height:1.6;}
.ta-screen .ta-card{position:relative;z-index:2;width:92%;max-width:420px;background:#FFFFFF;border:1.5px solid rgba(20,21,31,0.12);border-radius:20px;padding:26px 22px;display:flex;flex-direction:column;gap:14px;margin-top:8px;box-shadow:0 24px 48px -14px rgba(20,21,31,0.35);}
.ta-screen .ta-input-wrap{display:flex;align-items:center;gap:10px;background:#ECECF5;border:1.5px solid rgba(20,21,31,0.12);border-radius:14px;padding:12px 16px;}
.ta-screen .ta-input-wrap svg{flex-shrink:0;opacity:.8;}
.ta-screen input{flex:1;background:none;border:none;color:#14151F;font-size:1rem;outline:none;}
.ta-screen input::placeholder{color:#8B8DA0;}
.ta-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:#4F46E5;color:#fff;border:none;padding:15px 20px;border-radius:14px;font-weight:800;font-size:1.05rem;cursor:pointer;position:relative;z-index:2;box-shadow:0 10px 24px -8px rgba(79,70,229,0.4);}
.ta-screen .ta-footer{display:flex;align-items:center;justify-content:center;gap:10px;color:#4B4E63;font-size:.8rem;margin-top:4px;position:relative;z-index:2;}
.ta-screen .ta-footer .ta-dash{width:26px;height:1px;background:rgba(20,21,31,0.16);}
.ta-cert-box{position:relative;z-index:2;border:4px double #A06908;border-radius:18px;padding:32px 28px;background:#FFFFFF;max-width:440px;width:92%;color:#14151F;box-shadow:0 24px 60px -20px rgba(20,40,80,.25);}
.ta-cert-box .ta-cert-list{text-align:left;margin:16px 0 0;padding:0;list-style:none;color:#4B4E63;font-size:.9rem;}
.ta-cert-box .ta-cert-list li{padding:6px 0;border-bottom:1px solid rgba(20,21,31,0.1);}
.ta-cert-box .ta-cert-list li:last-child{border-bottom:none;}.ta-cert-box p{color:#4B4E63;}.ta-cert-box h1{color:#14151F;}.welcome-icon-badge{position:relative;z-index:2;margin:0 auto 6px;width:64px;height:64px;border-radius:16px;background:#4F46E5;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:30px;}:focus-visible{outline:2px solid #4F46E5;outline-offset:2px;}button:active{transform:scale(0.97);}@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:0.001ms !important;animation-iteration-count:1 !important;transition-duration:0.001ms !important;}}
</style>
</head>
<body>
<div class="ta-screen show" id="hwcStart">
  <div class="ta-blob ta-blob1"></div>
  <div class="ta-blob ta-blob2"></div>
  <div class="ta-blob ta-blob3"></div>
  <svg class="ta-road" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M500 40C420 60 460 120 380 140C300 160 340 220 260 240C180 260 220 300 140 300" stroke="#233252" stroke-width="34" stroke-linecap="round"/>
    <path d="M500 40C420 60 460 120 380 140C300 160 340 220 260 240C180 260 220 300 140 300" stroke="#ef7d2e" stroke-width="4" stroke-dasharray="10 10" stroke-linecap="round"/>
  </svg>
  <div class="ta-login-stage"><div class="ta-login-anim" id="taLoginAnim" aria-hidden="true">🔐</div><div class="ta-login-form">
  <h1>${hwcKind === 'class' ? 'Class' : 'Homework'} <span class="ta-accent">${escapeForHtml(title)}</span></h1>
  <div class="ta-underline"></div>
  <p>This has ${rounds.length} exercises: ${rounds.map(r => escapeForHtml(r.label)).join(' \u2014 ')}. Enter your ID once \u2014 if you have started this before, you will pick up right where you left off.</p>
  <div class="ta-card">
    ${requiredCode ? '<div class="ta-input-wrap"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#4B4E63" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><input type="text" id="hwcCodeInput" placeholder="Class code" maxlength="4" inputmode="numeric"></div>' : ''}
    <div class="ta-input-wrap"><svg width="16" height="18" viewBox="0 0 24 26" fill="none"><rect x="4" y="11" width="16" height="13" rx="2" stroke="#4B4E63" stroke-width="1.6"/><path d="M8 11V7a4 4 0 018 0v4" stroke="#4B4E63" stroke-width="1.6"/></svg><input type="text" id="hwcIdInput" placeholder="Enter your ID or name..."></div>
    <button class="ta-btn" onclick="hwcBegin()">Start <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <div class="ta-footer"><span class="ta-dash"></span><span>Get ready. Your next step is here.</span><span class="ta-dash"></span></div>
  </div>
  </div></div>
</div>
<div class="ta-screen" id="hwcNextScreen">
  <div class="ta-blob ta-blob1"></div>
  <div class="ta-blob ta-blob3"></div>
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="position:relative;z-index:2;"><path d="M9 6l6 6-6 6" stroke="#4F46E5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <h1 id="hwcNextLabel">Next exercise</h1>
  <div class="ta-underline"></div>
  <p id="hwcNextSub"></p>
  <button class="ta-btn" onclick="hwcNext()">Start Exercise <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
</div>
<div class="ta-screen" id="hwcSaving">
  <div style="font-size:2.4rem;position:relative;z-index:2;" id="hwcSavingIcon">\ud83c\udf89</div>
  <div class="hwc-send-anim" id="hwcSendAnim"><div class="hwc-send-bar"></div></div>
  <h1 id="hwcSavingTitle">Sending your answers\u2026</h1>
  <div class="ta-underline"></div>
  <p id="hwcSavingSub">Please wait \u2014 your answers are on their way to your teacher.</p>
  <button class="ta-btn" id="hwcSendBtn" style="display:none;" onclick="hwcSendNow()">\ud83d\udce4 Send my answers to my teacher</button>
  <button class="ta-btn" id="hwcRetryBtn" style="display:none;" onclick="hwcRetrySave()">Try again</button>
  <button class="ta-btn" id="hwcRedoBtn" style="display:none;" onclick="hwcRedoMissing()">Do it again</button>
</div>
<div id="hwcReviewBar"><span id="hwcReviewMsg">Look at your mistakes \u2014 take your time.</span><button class="ta-btn" id="hwcReviewBtn" onclick="hwcReviewNext()">Next exercise \u2192</button></div>
<div class="ta-screen" id="hwcDone">
  <div class="ta-blob ta-blob1"></div>
  <div class="ta-blob ta-blob3"></div>
  <p class="hwc-sent-note">\u2705 All your answers have reached your teacher</p>
  <div class="ta-cert-box">
    <div style="font-size:2.2rem;">\ud83c\udfc6</div>
    <h1 style="font-size:1.4rem;">Certificate of Completion</h1>
    <div class="ta-underline" style="margin-left:auto;margin-right:auto;"></div>
    <p style="margin-bottom:0;">This certifies that <b id="hwcCertName" style="color:#4F46E5;font-family:'Space Grotesk',sans-serif;"></b> has completed all ${rounds.length} exercises in ${escapeForHtml(title)}.</p>
    <ul class="ta-cert-list">${rounds.map(r => '<li>\u2713 ' + escapeForHtml(r.label) + '</li>').join('')}</ul>
  </div>
</div>
<div id="hwcBar" style="display:none;"><span id="hwcStageLabel"></span><span id="hwcStageCount"></span></div>
<iframe id="hwcFrame" allow="fullscreen" allowfullscreen style="display:none;"></iframe>
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
  import { getFirestore, collection, query, where, getDocs, getDocsFromServer, addDoc, serverTimestamp, doc, setDoc, getDocFromServer } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
  const firebaseConfig = {apiKey: "AIzaSyCefg2YghdSneABh0ZOUu3-snO4soVw0lA", authDomain: "teachers-assistant-app-ccd1a.firebaseapp.com", projectId: "teachers-assistant-app-ccd1a", storageBucket: "teachers-assistant-app-ccd1a.firebasestorage.app", messagingSenderId: "185909682129", appId: "1:185909682129:web:21fd63e09809eac82d8af0", measurementId: "G-7P60GBSYEM"};
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  window.__hwcDb = db; window.__hwcCollection = collection; window.__hwcQuery = query; window.__hwcWhere = where;
  window.__hwcGetDocs = getDocs; window.__hwcAddDoc = addDoc; window.__hwcServerTimestamp = serverTimestamp;
  window.__hwcDoc = doc; window.__hwcSetDoc = setDoc; window.__hwcGetDocFromServer = getDocFromServer; window.__hwcGetDocsFromServer = getDocsFromServer;
  window.__hwcFirebaseReady = true;
<\/script>
<script>
const HWC_ROUNDS = ${JSON.stringify(rounds).replace(/<\/script/gi, '<\\/script')};
const HWC_CODE = ${JSON.stringify(classCode)};
const HWC_REQUIRED_CODE = ${JSON.stringify(requiredCode)};
const HWC_BOARD_CODE = ${JSON.stringify(boardCode)};
const HWC_TITLE = ${JSON.stringify(title)};
const HWC_KIND = ${JSON.stringify(hwcKind)};
const HWC_ROSTER = ${JSON.stringify(roster)};
let hwcIdx = 0;
let hwcCompleted = [];
let hwcStudentId = "";
let hwcStudentName = "";
let hwcRoundStartTs = 0;
async function hwcLoadProgress() {
  for (let tries = 0; tries < 40 && !window.__hwcFirebaseReady; tries++) await new Promise(r => setTimeout(r, 50));
  if (!window.__hwcFirebaseReady) return [];
  try {
    // only this student's progress (not every student's, which cost a read per record each time a set opened)
    const q = window.__hwcQuery(window.__hwcCollection(window.__hwcDb, "results"), window.__hwcWhere("code", "==", HWC_CODE), window.__hwcWhere("studentId", "==", hwcStudentId));
    const snap = await window.__hwcGetDocs(q);
    return snap.docs.map(d => d.data()).filter(v => v && v.type === "HWC_PROGRESS" && v.studentId === hwcStudentId);
  } catch (e) { return []; }
}
function hwcRoundSeconds() { return hwcRoundStartTs ? Math.max(1, Math.round((Date.now() - hwcRoundStartTs) / 1000)) : 0; }
async function hwcWriteProgress(idx, timeSeconds) {
  await window.__hwcAddDoc(window.__hwcCollection(window.__hwcDb, "results"), {
    v: 1, code: HWC_CODE, boardCode: HWC_BOARD_CODE, type: "HWC_PROGRESS", title: HWC_TITLE, kind: HWC_KIND,
    studentId: hwcStudentId, name: hwcStudentName,
    roundIndex: idx, roundLabel: HWC_ROUNDS[idx].label, roundCode: HWC_ROUNDS[idx].code,
    totalCount: HWC_ROUNDS.length, timeSeconds: timeSeconds,
    date: new Date().toISOString(), submittedAt: window.__hwcServerTimestamp()
  });
}
async function hwcSaveProgress() {
  if (!window.__hwcFirebaseReady) return;
  try { await hwcWriteProgress(hwcIdx, hwcRoundSeconds()); }
  catch (e) { /* ignore \u2014 the check at the end ("Send my answers") writes it again */ }
}
function hwcFindRosterName(id) {
  for (let i = 0; i < HWC_ROSTER.length; i++) {
    if (HWC_ROSTER[i] && String(HWC_ROSTER[i].id).trim().toLowerCase() === id.toLowerCase()) return HWC_ROSTER[i].name;
  }
  return null;
}
function hwcShow(id) {
  document.querySelectorAll('.ta-screen').forEach(function(el){ el.classList.remove('show'); });
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}
function hwcLoad(i) {
  document.getElementById("hwcStageLabel").textContent = HWC_ROUNDS[i].label;
  document.getElementById("hwcStageCount").textContent = "Exercise " + (i+1) + " of " + HWC_ROUNDS.length;
  // Each round gets its own frame. The finished round's frame stays (hidden) for a
  // minute, so it can finish sending the student's answers to the teacher.
  const old = document.getElementById("hwcFrame");
  const frame = document.createElement("iframe");
  frame.setAttribute("allow", "fullscreen");
  frame.setAttribute("allowfullscreen", "");
  if (old) {
    old.removeAttribute("id");
    old.style.display = "none";
    old.parentNode.insertBefore(frame, old);
    setTimeout(function () { old.remove(); }, 60000);
  } else document.body.appendChild(frame);
  frame.id = "hwcFrame";
  // The student's code and ID go into the round itself, so it never asks for them again.
  const identity = "ta_merge_identity:" + JSON.stringify({ id: hwcStudentId, name: hwcStudentName, code: HWC_REQUIRED_CODE });
  const carry = "<script>window.name = " + JSON.stringify(identity).replace(/</g, "\\\\u003c") + ";(" + hwcRoundHook.toString() + ")();<\\/script>";
  const html = HWC_ROUNDS[i].html;
  const at = html.search(/<head[^>]*>/i);
  frame.name = identity;
  frame.srcdoc = at === -1 ? carry + html : html.replace(/<head[^>]*>/i, function (h) { return h + carry; });
  document.getElementById("hwcBar").style.display = "flex";
  frame.style.display = "block";
  hwcRoundStartTs = Date.now();
  hwcGotComplete = false; hwcResultState = null; hwcPendingResult = null; hwcPressed = false;
  hwcReview = /\u2014 Dictation$/.test(HWC_ROUNDS[i].label || ""); // a dictation's mistakes stay on screen
  document.getElementById("hwcReviewBar").classList.remove("show");
  clearTimeout(hwcWaitTimer);
}
async function hwcBegin() {
  const idVal = (document.getElementById("hwcIdInput").value || "").trim();
  if (!idVal) { alert("Please enter your ID or name."); return; }
  const codeInput = document.getElementById("hwcCodeInput");
  if (HWC_REQUIRED_CODE && (!codeInput || codeInput.value.trim() !== HWC_REQUIRED_CODE)) { alert("Incorrect class code."); return; }
  hwcStudentId = idVal;
  const rosterName = hwcFindRosterName(idVal);
  hwcStudentName = rosterName || idVal;
  document.getElementById("hwcCertName").textContent = hwcStudentName;
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
  if (req) { try { req.call(el).catch(function(){}); } catch (e) {} }
  const savedRecords = await hwcLoadProgress();
  hwcCompleted = new Array(HWC_ROUNDS.length).fill(false);
  savedRecords.forEach(function(r) { if (typeof r.roundIndex === 'number' && r.roundIndex < hwcCompleted.length) hwcCompleted[r.roundIndex] = true; });
  hwcIdx = hwcCompleted.indexOf(false);
  if (hwcIdx === -1) { hwcIdx = HWC_ROUNDS.length - 1; hwcSavingScreen("ready"); return; } // all done: the check is left
  hwcShow(null);
  hwcLoad(hwcIdx);
}
// the next exercise not done yet (after this one, or an earlier one to do again); -1 when none
function hwcNextTodo() {
  for (let k = 1; k <= HWC_ROUNDS.length; k++) { const i = (hwcIdx + k) % HWC_ROUNDS.length; if (!hwcCompleted[i]) return i; }
  return -1;
}
function hwcNext() {
  const i = hwcNextTodo();
  if (i === -1) { hwcSavingScreen("ready"); return; }
  hwcIdx = i;
  hwcShow(null);
  hwcLoad(hwcIdx);
}
/* A round counts as done only once the student's answers are safely in the
   database. Each round hands its result to this file (hwcRoundHook, put into
   the round), which saves it, tries again if needed, and only then moves on.
   Before, a round said "done" before its own upload had finished, so a
   failed upload still counted the round as completed, with no answers. */
let hwcGotComplete = false, hwcResultState = null, hwcPendingResult = null, hwcWaitTimer = null;
function hwcRoundHook() {
  var pend = {}, n = 0;
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (d && d.taMergeEvent === 'round-result-saved' && pend[d.id]) { pend[d.id](d.status); delete pend[d.id]; }
  });
  function viaSet(p) {
    var full = Object.assign({}, p);
    if (full.studentId === undefined) full.studentId = (typeof taStudentId !== 'undefined' ? taStudentId : (typeof studentId !== 'undefined' ? studentId : ''));
    if (full.isRosterMatch === undefined) full.isRosterMatch = (typeof isRosterMatch !== 'undefined' ? !!isRosterMatch : false);
    return new Promise(function (res) {
      var id = ++n;
      pend[id] = res;
      try { parent.postMessage({ taMergeEvent: 'round-result', id: id, payload: JSON.parse(JSON.stringify(full)) }, '*'); }
      catch (err) { delete pend[id]; res('failed'); }
    });
  }
  try { Object.defineProperty(window, 'submitResultToFirebase', { configurable: true, get: function () { return viaSet; }, set: function () {} }); } catch (err) { /* ignore */ }
}
function hwcWithin(promise, ms) {
  return Promise.race([promise, new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, ms); })]);
}
/* The end of each exercise:
   - every exercise's answers are saved as soon as it's finished (the teacher sees
     the progress straight away), then "Next exercise";
   - a Dictation stays on its page, so the student can look at the mistakes for as
     long as they like, until they press "Next exercise" (hwcReviewBar);
   - at the end, "Send my answers to my teacher" checks with the database that every
     exercise's answers are there (hwcVerifyAll): what's missing is sent again, or —
     from an earlier visit, so not here to send — the student does that exercise
     again. An animation plays meanwhile; then "All your answers have reached your
     teacher". An exercise that sends 0 seconds gets the time the set measured. */
let hwcReview = false, hwcPressed = false;
const hwcSaved = {}; // this visit's saved answers, per exercise: { payload }
const HWC_APP_URL = "__TA_APP_URL__";
let hwcAnimLoading = false;
function hwcPlaySendAnim() {
  if (hwcAnimLoading || !/^https?:/.test(HWC_APP_URL)) return; // offline / opened as a file: the moving bar stays
  hwcAnimLoading = true;
  const box = document.getElementById("hwcSendAnim");
  const go = function () {
    fetch(HWC_APP_URL + "animations/sending-answers.json").then(function (r) { return r.json(); }).then(function (data) {
      box.textContent = "";
      window.lottie.loadAnimation({ container: box, renderer: "svg", loop: true, autoplay: true, animationData: data });
    }).catch(function () { /* keep the moving bar */ });
  };
  if (window.lottie) { go(); return; }
  const lib = document.createElement("script");
  lib.src = HWC_APP_URL + "js/lottie.min.js";
  lib.onload = go;
  document.head.appendChild(lib);
}
// mode: "ready" (send button), "sending" / "checking" (animation), "failed" (Try again), "missing" (Do it again)
let hwcMissing = [];
function hwcSavingScreen(mode) {
  if (mode === true) mode = "failed"; else if (mode === false) mode = "sending";
  const el = id => document.getElementById(id);
  const busy = mode === "sending" || mode === "checking";
  el("hwcSavingIcon").style.display = busy ? "none" : "";
  el("hwcSavingIcon").textContent = mode === "failed" || mode === "missing" ? "\u26a0\ufe0f" : "\ud83c\udf89";
  el("hwcSendAnim").style.display = busy ? "flex" : "none";
  el("hwcSavingTitle").textContent = mode === "ready" ? "You've finished every exercise!"
    : mode === "checking" ? "Checking your answers\u2026"
    : mode === "failed" ? "Your answers haven't reached your teacher"
    : mode === "missing" ? "Some answers didn't reach your teacher"
    : "Sending your answers\u2026";
  el("hwcSavingSub").textContent = mode === "ready" ? "Press the button to send your answers to your teacher."
    : mode === "checking" ? "Stay on this page and keep the internet on \u2014 we're making sure your teacher has every answer."
    : mode === "failed" ? "Check your internet connection, then press Try again. Don't close this page \u2014 your answers are still here."
    : mode === "missing" ? "Please do " + (hwcMissing.length === 1 ? "this exercise" : "these exercises") + " again: " + hwcMissing.map(i => HWC_ROUNDS[i].label).join(", ") + "."
    : "Please wait \u2014 your answers are on their way to your teacher.";
  el("hwcSendBtn").style.display = mode === "ready" ? "" : "none";
  el("hwcRetryBtn").style.display = mode === "failed" ? "" : "none";
  el("hwcRedoBtn").style.display = mode === "missing" ? "" : "none";
  if (busy) hwcPlaySendAnim();
  document.getElementById("hwcReviewBar").classList.remove("show");
  hwcShow("hwcSaving");
}
function hwcResultId(p) {
  return "r_" + String(p.code || "") + "_" + String(p.studentId || hwcStudentId || p.name || "").replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40) + "_" + String(p.date || "").replace(/[^0-9]/g, "");
}
// One record per submission (its own id): sending it again can never make a copy.
async function hwcSaveJob(job) {
  for (let tries = 0; tries < 40 && !window.__hwcFirebaseReady; tries++) await new Promise(r => setTimeout(r, 100));
  const p = job.payload;
  const rid = hwcResultId(p);
  let ok = false;
  for (let attempt = 0; attempt < 3 && !ok && window.__hwcFirebaseReady; attempt++) {
    if (attempt) await new Promise(r => setTimeout(r, 1500 * attempt));
    const ref = window.__hwcDoc(window.__hwcDb, "results", rid);
    try {
      await hwcWithin(window.__hwcSetDoc(ref, Object.assign({}, p, { submittedAt: window.__hwcServerTimestamp() })), 15000);
      ok = true;
    } catch (e) {
      // already saved by an earlier try (changing a record is refused)?
      try { const snap = await hwcWithin(window.__hwcGetDocFromServer(ref), 10000); if (snap.exists()) ok = true; } catch (e2) { /* still not there */ }
    }
  }
  if (ok && typeof job.idx === "number") hwcSaved[job.idx] = { payload: p };
  try { job.source && job.source.postMessage({ taMergeEvent: "round-result-saved", id: job.id, status: ok ? "ok" : "failed" }, "*"); } catch (e) { /* ignore */ }
  return ok;
}
async function hwcSaveRoundResult() {
  const job = hwcPendingResult;
  if (!job) return;
  hwcResultState = "saving";
  hwcCheckFailed = false;
  if (hwcGotComplete && (!hwcReview || hwcPressed)) hwcSavingScreen("sending");
  else if (hwcReview) hwcReviewBarState();
  const ok = await hwcSaveJob(job);
  if (job !== hwcPendingResult) return; // a newer round took over
  hwcResultState = ok ? "ok" : "failed";
  hwcAfterSave();
}
function hwcAfterSave() {
  if (!hwcGotComplete) return;
  if (hwcReview && !hwcPressed) { hwcReviewBarState(); return; }
  if (hwcResultState === "failed") { hwcSavingScreen("failed"); return; }
  if (hwcResultState === "ok") hwcRoundDone();
}
let hwcCheckFailed = false; // "Try again" after the final check, or after saving one exercise
function hwcRetrySave() {
  if (hwcCheckFailed || !hwcPendingResult || hwcResultState !== "failed") hwcSendNow();
  else hwcSaveRoundResult();
}
function hwcRoundDone() {
  clearTimeout(hwcWaitTimer);
  hwcCompleted[hwcIdx] = true;
  hwcSaveProgress();
  const next = hwcNextTodo();
  if (next === -1) { if (hwcPressed) hwcSendNow(); else hwcSavingScreen("ready"); return; }
  if (hwcPressed) { hwcNext(); return; } // "Next exercise" was pressed on the dictation's page
  document.getElementById("hwcNextLabel").textContent = HWC_ROUNDS[next].label;
  document.getElementById("hwcNextSub").textContent = "Exercise " + (next + 1) + " of " + HWC_ROUNDS.length + " \u2014 press start when you're ready.";
  hwcShow("hwcNextScreen");
}
// the dictation's own page stays, with this bar under it
function hwcReviewBarState() {
  const bar = document.getElementById("hwcReviewBar"), btn = document.getElementById("hwcReviewBtn"), msg = document.getElementById("hwcReviewMsg");
  bar.classList.add("show");
  const failed = hwcResultState === "failed";
  const lastOne = hwcCompleted.filter(x => !x).length <= 1;
  btn.textContent = failed ? "Try again" : (lastOne ? "\ud83d\udce4 Send my answers to my teacher" : "Next exercise \u2192");
  msg.textContent = failed ? "Your answers haven't reached your teacher yet \u2014 check the internet." : "Look at your mistakes \u2014 take your time.";
}
function hwcReviewNext() {
  if (hwcResultState === "failed") { hwcSaveRoundResult(); return; }
  hwcPressed = true;
  document.getElementById("hwcReviewBar").classList.remove("show");
  if (hwcResultState === "ok" || !hwcPendingResult) hwcRoundDone();
  else hwcSavingScreen("sending"); // still saving: moves on as soon as it's done
}
// "Send my answers to my teacher": make sure the teacher has every exercise's answers
const hwcNorm = x => String(x || "").trim().toLowerCase();
async function hwcFindMine(code) {
  const col = window.__hwcCollection(window.__hwcDb, "results");
  const get = async (field, value) => (await hwcWithin(window.__hwcGetDocsFromServer(window.__hwcQuery(col, window.__hwcWhere("code", "==", code), window.__hwcWhere(field, "==", value))), 20000)).docs.map(d => d.data());
  let found = await get("studentId", hwcStudentId);
  if (!found.length && hwcStudentName) found = await get("name", hwcStudentName);
  return found.filter(v => v && typeof v.type === "string" && v.type.indexOf("POINTS:") !== 0);
}
async function hwcVerifyAll() {
  for (let tries = 0; tries < 40 && !window.__hwcFirebaseReady; tries++) await new Promise(r => setTimeout(r, 100));
  if (!window.__hwcFirebaseReady) throw new Error("offline");
  const missing = [];
  for (let i = 0; i < HWC_ROUNDS.length; i++) {
    const code = HWC_ROUNDS[i].code;
    if (!code) continue;
    if ((await hwcFindMine(code)).some(v => v.type !== "HWC_PROGRESS")) continue;
    if (hwcSaved[i]) { // answered on this visit: send it again
      if (await hwcSaveJob({ payload: hwcSaved[i].payload, idx: i })) continue;
      throw new Error("offline");
    }
    missing.push(i);
  }
  // the progress records (what the teacher's list counts) for every exercise that's there
  const progress = (await hwcFindMine(HWC_CODE)).filter(v => v.type === "HWC_PROGRESS" && hwcNorm(v.studentId) === hwcNorm(hwcStudentId));
  const have = new Set(progress.map(v => v.roundIndex));
  for (let i = 0; i < HWC_ROUNDS.length; i++) {
    if (!have.has(i) && missing.indexOf(i) === -1) await hwcWithin(hwcWriteProgress(i, 0), 15000);
  }
  return missing;
}
async function hwcSendNow() {
  hwcPressed = true;
  hwcSavingScreen("checking");
  const t0 = Date.now();
  let missing = null;
  try { missing = await hwcWithin(hwcVerifyAll(), 90000); } catch (e) { missing = null; }
  const rest = 5300 - (Date.now() - t0); // until the animation's bar is full
  if (rest > 0) await new Promise(r => setTimeout(r, rest));
  hwcCheckFailed = missing === null;
  if (missing === null) { hwcSavingScreen("failed"); return; }
  if (missing.length) { hwcMissing = missing; hwcSavingScreen("missing"); return; }
  hwcShow("hwcDone");
}
function hwcRedoMissing() {
  hwcMissing.forEach(i => { hwcCompleted[i] = false; });
  hwcIdx = hwcMissing[0];
  hwcShow(null);
  hwcLoad(hwcIdx);
}
window.addEventListener("message", function (e) {
  const d = e && e.data;
  if (!d) return;
  if (d.taMergeEvent === "round-result" && d.payload) {
    const p = Object.assign({}, d.payload);
    // an exercise that lost its own time: the time the set measured for it
    if (!(p.timeSeconds > 0)) { const t = hwcRoundSeconds(); p.timeSeconds = t; p.timeDisplay = String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0"); p.timeFromSet = true; }
    hwcPendingResult = { payload: p, id: d.id, source: e.source, idx: hwcIdx };
    if (p.type === "Dictation") hwcReview = true;
    hwcSaveRoundResult();
    return;
  }
  if (d.taMergeEvent !== "round-complete" || hwcGotComplete) return;
  if (d.identity && d.identity.name) hwcStudentName = d.identity.name;
  hwcGotComplete = true;
  if (hwcReview) { hwcReviewBarState(); return; }
  // Cover the screen immediately \u2014 this is what keeps the round's own
  // certificate from being shown; only the wrapper's own certificate, at
  // the very end of the whole set, is meant to be seen.
  if (hwcResultState === "ok") { hwcRoundDone(); return; }
  hwcSavingScreen(hwcResultState === "failed" ? "failed" : "sending");
  // a round that sends no result of its own moves on after a moment
  if (!hwcResultState) hwcWaitTimer = setTimeout(function () { if (!hwcResultState) hwcRoundDone(); }, 3000);
});
<\/script>
<!-- ================= LOGIN ANIMATION =================
     Start screen layout: animation on the left, ID / password on the right.
     In a narrow start card they stack, and in a very thin one the animation hides. The animation and its player load from the
     Teacher's Assistant site this file was made on; offline, the 🔐 stays. -->
<style>
.ta-login-card { max-width: 1100px !important; width: min(1100px, 94vw) !important; }
.deck-container:has(> #slide-welcome.active) { max-width: min(1100px, 94vw) !important; }
.ta-login-stage { position: relative; z-index: 2; display: flex; align-items: center; gap: 40px; width: 100%; max-width: 1100px; margin: 0 auto; }
.ta-login-anim { flex: 0 0 min(440px, 42%); aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; font-size: 4.5rem; }
.ta-login-anim svg { width: 100% !important; height: 100% !important; }
.ta-login-form { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; text-align: center; }
.ta-login-form > * { max-width: 100%; }
.ta-login-form > input, .ta-login-form > .ta-input-wrap, .ta-login-form > .ta-card { width: 100%; }
.ta-login-type { display: inline-block; margin: 6px 0 12px; padding: 5px 14px; border-radius: 999px; background: rgba(99, 102, 241, 0.14); color: #6366F1; font-size: 0.82rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
.ta-login-stage.ta-login-narrow { flex-direction: column; gap: 4px; }
.ta-login-stage.ta-login-narrow .ta-login-anim { flex: 0 0 auto; width: 150px; font-size: 3rem; }
.ta-login-stage.ta-login-tiny .ta-login-anim { display: none; }
</style>
<script>
(function () {
  var APP_URL = "__TA_APP_URL__";
  var box = document.getElementById('taLoginAnim');
  if (!box) return;
  var stage = box.parentNode;
  function fit() {
    var w = stage.parentNode.clientWidth;
    stage.classList.toggle('ta-login-narrow', w < 540);
    stage.classList.toggle('ta-login-tiny', w < 300);
  }
  fit();
  window.addEventListener('resize', fit);
  if (!/^https?:/.test(APP_URL)) return;
  function play(data) {
    try {
      box.textContent = '';
      lottie.loadAnimation({ container: box, renderer: 'svg', loop: true, autoplay: true, animationData: data });
    } catch (e) { box.textContent = '🔐'; }
  }
  var lib = document.createElement('script');
  lib.src = APP_URL + 'js/lottie.min.js';
  lib.onload = function () {
    fetch(APP_URL + 'animations/profile-password-unlock.json')
      .then(function (r) { return r.json(); })
      .then(play)
      .catch(function () { /* keep the 🔐 */ });
  };
  document.head.appendChild(lib);
})();
<\/script>
</body>
</html>`;

  // the teacher's title names the file; without one it's "Homework_<round 1 title or date>"
  const fname = (setTitle.typed ? '' : (hwcKind === 'class' ? 'Class_' : 'Homework_')) +
    (title.replace(/[^\p{L}\p{N}\-_ ]/gu, '').trim().replace(/\s+/g, '_') || 'Set') + '.html';
  downloadFile(fname, wrapper);
  showToast('"' + title + '" downloaded \u2014 ' + rounds.length + ' exercises.', 'ok');

  const summary = mergedItems.map((it, i) => (i + 1) + '. ' + it.title).join('\n');
  pushRecentExercise({
    title: title,
    typeLabel: hwcKind === 'class' ? 'Class' : 'Homework',
    code: classCode,
    uid: hwcUid,
    html: wrapper,
    requiredCode: requiredCode,
    contentSummary: summary,
    mergedItems: mergedItems,
    groupId: (hwcRounds.find(r => r.groupId) || {}).groupId || '',
    setKind: hwcKind,
    setTitle: setTitle.typed ? title : '',
    builderRounds: hwcRounds.every(r => r.state) ? hwcRounds.map(r => ({ tab: r.tab, state: r.state })) : null
  });

  hwcRounds = [];
  switchTo('createpicker');
}

/* Restores every exercise inside a Homework/Class set back into My
   Exercises as its own separate entry again, then removes the merged
   entry \u2014 the reverse of buildAndDownloadHwc(). Each round's own code
   was stripped when it was embedded (so students weren't asked for it a
   second time), so it's re-extracted from the original captured HTML
   here rather than carried in mergedItems. */
function readAccessMode(prefix) {
  const el = document.querySelector('input[name="' + prefix + '-mode"]:checked');
  return el ? el.value : 'code';
}

function readPointsAward(prefix) {
  const el = document.getElementById(prefix + '-points');
  return el ? (parseInt(el.value, 10) || 0) : 0;
}

function onAccessModeChange(prefix) {
  const mode = readAccessMode(prefix);
  const isCode = mode === 'code';
  const codeBlock = document.getElementById(prefix + '-code-block');
  const nocodeNote = document.getElementById(prefix + '-nocode-note');
  const pointsBlock = document.getElementById(prefix + '-points-block');
  if (codeBlock) codeBlock.style.display = isCode ? '' : 'none';
  if (nocodeNote) nocodeNote.style.display = isCode ? 'none' : '';
  if (pointsBlock) pointsBlock.style.display = isCode ? 'none' : '';
}
/* ================= CREATE: WORD ORDER ================= */
function createWordOrder() {
  const title = document.getElementById('wo-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }

  const mode = 'nocode';
  const code = generateClassCode();

  const sentences = Array.from(woRows.querySelectorAll('input'))
    .map(i => i.value.trim())
    .filter(Boolean)
    .map(s => s.replace(/[.!?]+$/, ''));

  if (sentences.length < 2) { showToast('Please enter at least 2 sentences.'); return; }

  let html = WORD_ORDER_TEMPLATE;
  const classCode = setActiveClassCode(code);
  const points = readPointsAward('wo');
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__SENTENCE_COUNT__').join(String(sentences.length));
  html = html.split('__SENTENCES_JSON__').join(JSON.stringify(sentences));
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());
  html = html.split('__ACCESS_MODE__').join(mode);
  html = html.split('__ACCESS_ID_MODE__').join('unified');
  const __requiredCode_wo = (document.getElementById('wo-code') || {value:''}).value.trim();
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(__requiredCode_wo));
  const __timerMin_wo = parseFloat((document.getElementById('wo-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_wo) || __timerMin_wo <= 0 ? '0' : String(__timerMin_wo));
  html = html.split('__POINTS_AWARD__').join(String(points));
  const __uid = generateExerciseUid();
  html = html.split('__EXERCISE_UID__').join(__uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_TYPE_LABEL__').join('Word Order');

  pushRecentExercise({ title: title, typeLabel: 'Word Order', code: classCode, uid: __uid, html: html, requiredCode: __requiredCode_wo, contentSummary: sentences.join('\n') });
  downloadFile(typedFilename('Word_Order', title, 'word-order'), html);
  showToast('"' + title + '" downloaded!' + (mode === 'code' ? ' Class code: ' + classCode : ''), 'ok');
}

/* ================= CREATE: MAKE A WORD ================= */
function createMakeAWord() {
  const title = document.getElementById('maw-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }

  const mode = 'nocode';
  const code = generateClassCode();

  const words = Array.from(mawRows.querySelectorAll('input'))
    .map(i => i.value.trim().replace(/\s+/g, ''))
    .filter(Boolean)
    .map(w => ({ en: w.toLowerCase() }));

  if (words.length < 2) { showToast('Please enter at least 2 words.'); return; }

  let html = MAKE_A_WORD_TEMPLATE;
  const classCode = setActiveClassCode(code);
  const points = readPointsAward('maw');
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__WORD_COUNT__').join(String(words.length));
  html = html.split('__WORDS_JSON__').join(JSON.stringify(words));
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());
  html = html.split('__ACCESS_MODE__').join(mode);
  html = html.split('__ACCESS_ID_MODE__').join('unified');
  const __requiredCode_maw = (document.getElementById('maw-code') || {value:''}).value.trim();
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(__requiredCode_maw));
  const __timerMin_maw = parseFloat((document.getElementById('maw-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_maw) || __timerMin_maw <= 0 ? '0' : String(__timerMin_maw));
  html = html.split('__POINTS_AWARD__').join(String(points));
  const __uid = generateExerciseUid();
  html = html.split('__EXERCISE_UID__').join(__uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_TYPE_LABEL__').join('Make a Word');

  pushRecentExercise({ title: title, typeLabel: 'Make a Word', code: classCode, uid: __uid, html: html, requiredCode: __requiredCode_maw, contentSummary: words.map(w => w.en).join('\n') });
  downloadFile(typedFilename('Make_a_Word', title, 'make-a-word'), html);
  showToast('"' + title + '" downloaded!' + (mode === 'code' ? ' Class code: ' + classCode : ''), 'ok');
}

/* ================= CREATE: FLASHCARD ================= */
function createFlashcard() {
  const title = document.getElementById('fc-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }

  const mode = 'nocode';
  const code = generateClassCode();

  const groupCount = parseInt(document.getElementById('fc-groups').value, 10);

  const pairs = Array.from(fcRows.querySelectorAll('.row-item')).map(row => {
    const inputs = row.querySelectorAll('input');
    return { en: inputs[0].value.trim(), uz: inputs[1].value.trim() };
  }).filter(p => p.en && p.uz);


  if (pairs.length < groupCount) {
    showToast('Please enter at least ' + groupCount + ' words to split into ' + groupCount + ' groups.');
    return;
  }

  // Split into `groupCount` nearly-equal chunks, in entry order
  const groups = [];
  const base = Math.floor(pairs.length / groupCount);
  let extra = pairs.length % groupCount;
  let cursor = 0;
  for (let g = 0; g < groupCount; g++) {
    const size = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra--;
    const words = pairs.slice(cursor, cursor + size);
    cursor += size;
    groups.push({ title: 'Group ' + (g + 1), words });
  }

  let html = FLASHCARD_TEMPLATE;
  const classCode = setActiveClassCode(code);
  const points = readPointsAward('fc');
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__WORD_COUNT__').join(String(pairs.length));
  html = html.split('__GROUPS_JSON__').join(JSON.stringify(groups));
  html = html.split('__QUIZ_MODE__').join(document.getElementById('fc-quiz-mode').value);
  html = html.split('__QUIZ_DIRECTION__').join(document.getElementById('fc-direction').value);
  html = html.split('__LOSE_PROGRESS__').join(document.getElementById('fc-lose-progress').value);
  html = html.split('__KEEP_PROGRESS_ON_BACK__').join(document.getElementById('fc-keep-progress-on-back').value);
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());
  html = html.split('__ACCESS_MODE__').join(mode);
  html = html.split('__ACCESS_ID_MODE__').join('unified');
  const __requiredCode_fc = (document.getElementById('fc-code') || {value:''}).value.trim();
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(__requiredCode_fc));
  const __timerMin_fc = parseFloat((document.getElementById('fc-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_fc) || __timerMin_fc <= 0 ? '0' : String(__timerMin_fc));
  html = html.split('__POINTS_AWARD__').join(String(points));
  const __uid = generateExerciseUid();
  html = html.split('__EXERCISE_UID__').join(__uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_TYPE_LABEL__').join('Flashcard');

  pushRecentExercise({ title: title, typeLabel: 'Flashcard', code: classCode, uid: __uid, html: html, requiredCode: __requiredCode_fc, contentSummary: pairs.map(p => p.en + ' - ' + p.uz).join('\n') });
  downloadFile(typedFilename('Flashcard', title, 'flashcard'), html);
  showToast('"' + title + '" downloaded!' + (mode === 'code' ? ' Class code: ' + classCode : ''), 'ok');
}

/* ================= PRESENTATION BUILDER ================= */
const PRES_FONTS = [
  { name: 'Plus Jakarta Sans', param: 'Plus+Jakarta+Sans:wght@400;600;700;800' },
  { name: 'Poppins', param: 'Poppins:wght@400;600;700;800' },
  { name: 'Inter', param: 'Inter:wght@400;600;700;800' },
  { name: 'Fredoka', param: 'Fredoka:wght@400;600;700' },
  { name: 'Space Grotesk', param: 'Space+Grotesk:wght@400;600;700' },
  { name: 'Nunito', param: 'Nunito:wght@400;700;800' },
  { name: 'Merriweather', param: 'Merriweather:wght@400;700;900' },
  { name: 'Playfair Display', param: 'Playfair+Display:wght@500;700;800' }
];

const PRES_ICONS = [
  { value: '📖', label: '📖 Book' },
  { value: '💡', label: '💡 Idea' },
  { value: '⭐', label: '⭐ Star' },
  { value: '💬', label: '💬 Speech' },
  { value: '🌍', label: '🌍 Globe' },
  { value: '🎵', label: '🎵 Music' },
  { value: '❤️', label: '❤️ Heart' },
  { value: '🎯', label: '🎯 Target' },
  { value: '🏆', label: '🏆 Trophy' },
  { value: '📷', label: '📷 Camera' },
  { value: '✏️', label: '✏️ Pencil' },
  { value: '📝', label: '📝 Notes' },
  { value: '🏠', label: '🏠 House' },
  { value: '🌳', label: '🌳 Tree' },
  { value: '☀️', label: '☀️ Sun' },
  { value: '☁️', label: '☁️ Cloud' },
  { value: '🎁', label: '🎁 Gift' },
  { value: '❓', label: '❓ Question' },
  { value: '✅', label: '✅ Check' },
  { value: '❌', label: '❌ Cross' },
  { value: '🚀', label: '🚀 Rocket' },
  { value: '🎨', label: '🎨 Palette' },
  { value: '🚩', label: '🚩 Flag' },
  { value: '🕐', label: '🕐 Clock' },
  { value: '🗺️', label: '🗺️ Map' },
  { value: '👥', label: '👥 People' },
  { value: '🎮', label: '🎮 Game' },
  { value: '🎓', label: '🎓 Graduation' },
  { value: '🗣️', label: '🗣️ Speaking' },
  { value: '👂', label: '👂 Listening' },
  { value: '🎤', label: '🎤 Microphone' },
  { value: '🧩', label: '🧩 Puzzle' },
  { value: '🐾', label: '🐾 Animal' },
  { value: '✈️', label: '✈️ Travel' },
  { value: '🍴', label: '🍴 Food' },
  { value: '🛍️', label: '🛍️ Shopping' },
  { value: '🧪', label: '🧪 Science' },
  { value: '🔢', label: '🔢 Numbers' },
  { value: '🔤', label: '🔤 Letters' },
  { value: '⚠️', label: '⚠️ Warning' },
  { value: '👉', label: '👉 Pointer' },
  { value: '🔥', label: '🔥 Fire' }
];

const STAGE_W = 1000;
const STAGE_H = 562;

/* Each slide keeps its OWN background and its OWN list of items, so editing
   slide 2 can never change anything on slide 1. */
let presSlides = [];
let presCurrent = 0;
let presSelId = null;
let presElSeq = 1;
let presStageScale = 1;

function populatePresFontSelect() {
  const sel = document.getElementById('pres-font');
  sel.innerHTML = '';
  PRES_FONTS.forEach(f => {
    const o = document.createElement('option');
    o.value = f.name + '|' + f.param;
    o.innerText = f.name;
    sel.appendChild(o);
  });
}

function deckFontValue() {
  const sel = document.getElementById('pres-font');
  return (sel && sel.value) || (PRES_FONTS[0].name + '|' + PRES_FONTS[0].param);
}
function fontNameOf(value) { return (value || '').split('|')[0]; }

function newPresEl(type, extra) {
  const base = { id: 'e' + (presElSeq++), type: type, x: 90, y: 200 };
  if (type === 'text') {
    Object.assign(base, {
      text: 'New text', w: 480, size: 30, color: '#ffffff', bold: false, italic: false,
      align: 'left', lh: 1.35, font: ''
    });
  } else if (type === 'icon') {
    Object.assign(base, { icon: '⭐', size: 90, color: '#f2c14e' });
  } else if (type === 'box') {
    Object.assign(base, { w: 320, h: 140, color: '#f2c14e', radius: 18, opacity: 0.85 });
  } else if (type === 'image') {
    Object.assign(base, { w: 340, src: '', radius: 14, opacity: 1 });
  }
  return Object.assign(base, extra || {});
}

function defaultPresSlide(isFirst) {
  if (isFirst) {
    return {
      bg: '#1f3357',
      els: [
        newPresEl('text', { text: 'Your title here', x: 100, y: 190, w: 800, size: 66, bold: true, align: 'center', color: '#ffffff' }),
        newPresEl('text', { text: 'Subtitle — what this lesson is about', x: 150, y: 310, w: 700, size: 24, align: 'center', color: '#d7e2f5' })
      ]
    };
  }
  return {
    bg: '#1c2740',
    els: [
      newPresEl('text', { text: 'Slide heading', x: 70, y: 90, w: 860, size: 44, bold: true, align: 'left', color: '#ffffff' }),
      newPresEl('text', { text: 'Write your content here.', x: 70, y: 185, w: 860, size: 24, align: 'left', color: '#c9d5ea' })
    ]
  };
}

function currentSlide() { return presSlides[presCurrent]; }
function selectedEl() {
  const s = currentSlide();
  if (!s || !presSelId) return null;
  return s.els.find(e => e.id === presSelId) || null;
}

/* ---------- shared rendering (canvas + exported file use the same styles) ---------- */
function presElStyle(el) {
  let s = 'left:' + Math.round(el.x) + 'px;top:' + Math.round(el.y) + 'px;';
  if (el.type === 'text') {
    s += 'width:' + Math.round(el.w) + 'px;font-size:' + el.size + 'px;color:' + el.color + ';';
    s += 'font-weight:' + (el.bold ? '800' : '400') + ';font-style:' + (el.italic ? 'italic' : 'normal') + ';';
    s += 'text-align:' + el.align + ';line-height:' + el.lh + ';';
    if (el.font) s += "font-family:'" + fontNameOf(el.font) + "',sans-serif;";
  } else if (el.type === 'icon') {
    s += 'width:' + el.size + 'px;height:' + el.size + 'px;font-size:' + Math.round(el.size * 0.86) + 'px;line-height:1;color:' + el.color + ';';
  } else if (el.type === 'box') {
    s += 'width:' + Math.round(el.w) + 'px;height:' + Math.round(el.h) + 'px;background:' + el.color + ';';
    s += 'border-radius:' + el.radius + 'px;opacity:' + el.opacity + ';';
  } else if (el.type === 'image') {
    s += 'width:' + Math.round(el.w) + 'px;border-radius:' + el.radius + 'px;overflow:hidden;opacity:' + el.opacity + ';';
  }
  return s;
}

function presElInnerHtml(el) {
  if (el.type === 'text') return escapeForHtml(el.text || '');
  if (el.type === 'icon') return escapeForHtml(el.icon || '');
  if (el.type === 'image') return el.src ? ('<img src="' + el.src + '" alt="">') : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a2230;color:#64748b;font-size:12px;">No image</div>';
  return '';
}

function presElHtml(el, forCanvas) {
  return '<div class="el el-' + el.type + (forCanvas && el.id === presSelId ? ' selected' : '') + '"' +
    (forCanvas ? ' data-id="' + el.id + '"' : '') +
    ' style="' + presElStyle(el) + '">' + presElInnerHtml(el) + '</div>';
}

function presSlideHtml(slide) {
  return '<div class="slide" style="background:' + slide.bg + '">' +
    slide.els.map(el => presElHtml(el, false)).join('') +
    '</div>';
}

/* ---------- tabs ---------- */
function renderPresTabs() {
  const wrap = document.getElementById('pres-slide-tabs');
  wrap.innerHTML = '';
  presSlides.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'slide-tab' + (i === presCurrent ? ' active' : '');
    b.innerText = 'Slide ' + (i + 1);
    b.onclick = () => selectPresSlide(i);
    wrap.appendChild(b);
  });
  const sel = document.getElementById('pres-slide-count');
  const opt = Array.from(sel.options).find(o => parseInt(o.value, 10) === presSlides.length);
  if (opt) sel.value = String(presSlides.length);
}

function selectPresSlide(i) {
  presCurrent = Math.max(0, Math.min(i, presSlides.length - 1));
  presSelId = null;
  renderPresTabs();
  renderPresCanvas();
  renderPresProps();
}

function onPresSlideCountChange() {
  const want = parseInt(document.getElementById('pres-slide-count').value, 10);
  while (presSlides.length < want) presSlides.push(defaultPresSlide(presSlides.length === 0));
  while (presSlides.length > want) presSlides.pop();
  if (presCurrent >= presSlides.length) presCurrent = presSlides.length - 1;
  selectPresSlide(presCurrent);
}

function addPresSlide() {
  presSlides.splice(presCurrent + 1, 0, defaultPresSlide(false));
  selectPresSlide(presCurrent + 1);
}

function duplicatePresSlide() {
  const copy = JSON.parse(JSON.stringify(currentSlide()));
  copy.els.forEach(e => { e.id = 'e' + (presElSeq++); });
  presSlides.splice(presCurrent + 1, 0, copy);
  selectPresSlide(presCurrent + 1);
}

function deletePresSlide() {
  if (presSlides.length <= 1) { showToast('A presentation needs at least one slide.'); return; }
  presSlides.splice(presCurrent, 1);
  selectPresSlide(Math.max(0, presCurrent - 1));
}

function movePresSlide(dir) {
  const target = presCurrent + dir;
  if (target < 0 || target >= presSlides.length) return;
  const s = presSlides.splice(presCurrent, 1)[0];
  presSlides.splice(target, 0, s);
  selectPresSlide(target);
}

/* ---------- canvas ---------- */
function fitPresCanvas() {
  const outer = document.getElementById('pres-canvas-outer');
  const stage = document.getElementById('pres-canvas');
  if (!outer || !stage) return;
  const w = outer.clientWidth || 600;
  presStageScale = w / STAGE_W;
  stage.style.transform = 'scale(' + presStageScale + ')';
  outer.style.height = Math.round(STAGE_H * presStageScale) + 'px';
}

function renderPresCanvas() {
  const stage = document.getElementById('pres-canvas');
  if (!stage) return;
  const slide = currentSlide();
  if (!slide) return;
  stage.style.background = slide.bg;
  stage.style.fontFamily = "'" + fontNameOf(deckFontValue()) + "', sans-serif";
  stage.innerHTML = slide.els.map(el => presElHtml(el, true)).join('');
  fitPresCanvas();
  Array.from(stage.querySelectorAll('.el')).forEach(node => {
    node.addEventListener('pointerdown', onPresElPointerDown);
  });
}

let presDrag = null;
function onPresElPointerDown(e) {
  e.preventDefault();
  e.stopPropagation();
  const id = this.getAttribute('data-id');
  const el = currentSlide().els.find(x => x.id === id);
  if (!el) return;
  if (presSelId !== id) { presSelId = id; renderPresCanvas(); renderPresProps(); }
  const node = document.querySelector('#pres-canvas .el[data-id="' + id + '"]');
  presDrag = { el: el, node: node, startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y };
  try { node.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  node.addEventListener('pointermove', onPresElPointerMove);
  node.addEventListener('pointerup', onPresElPointerUp);
  node.addEventListener('pointercancel', onPresElPointerUp);
}

function onPresElPointerMove(e) {
  if (!presDrag) return;
  const dx = (e.clientX - presDrag.startX) / presStageScale;
  const dy = (e.clientY - presDrag.startY) / presStageScale;
  const el = presDrag.el;
  const w = el.w || el.size || 80;
  el.x = Math.round(Math.max(-(w - 40), Math.min(STAGE_W - 30, presDrag.origX + dx)));
  el.y = Math.round(Math.max(-40, Math.min(STAGE_H - 20, presDrag.origY + dy)));
  presDrag.node.style.left = el.x + 'px';
  presDrag.node.style.top = el.y + 'px';
  syncPresPosInputs();
}

function onPresElPointerUp(e) {
  if (!presDrag) return;
  const node = presDrag.node;
  node.removeEventListener('pointermove', onPresElPointerMove);
  node.removeEventListener('pointerup', onPresElPointerUp);
  node.removeEventListener('pointercancel', onPresElPointerUp);
  presDrag = null;
}

function syncPresPosInputs() {
  const el = selectedEl();
  if (!el) return;
  const xi = document.getElementById('prop-x');
  const yi = document.getElementById('prop-y');
  if (xi) xi.value = Math.round(el.x);
  if (yi) yi.value = Math.round(el.y);
}

function addPresElement(type, extra) {
  const slide = currentSlide();
  if (!slide) return;
  const el = newPresEl(type, extra);
  el.x = 90 + (slide.els.length % 5) * 18;
  el.y = 150 + (slide.els.length % 5) * 24;
  slide.els.push(el);
  presSelId = el.id;
  renderPresCanvas();
  renderPresProps();
}

function deleteSelectedEl() {
  const slide = currentSlide();
  if (!slide || !presSelId) return;
  slide.els = slide.els.filter(e => e.id !== presSelId);
  presSelId = null;
  renderPresCanvas();
  renderPresProps();
}

function duplicateSelectedEl() {
  const el = selectedEl();
  if (!el) return;
  const copy = JSON.parse(JSON.stringify(el));
  copy.id = 'e' + (presElSeq++);
  copy.x += 24; copy.y += 24;
  currentSlide().els.push(copy);
  presSelId = copy.id;
  renderPresCanvas();
  renderPresProps();
}

function layerSelectedEl(dir) {
  const slide = currentSlide();
  const i = slide.els.findIndex(e => e.id === presSelId);
  if (i === -1) return;
  const j = i + dir;
  if (j < 0 || j >= slide.els.length) return;
  const tmp = slide.els[i];
  slide.els[i] = slide.els[j];
  slide.els[j] = tmp;
  renderPresCanvas();
}

/* ---------- property panel ---------- */
function propGroup(label, inner) {
  return '<div class="prop-group"><label>' + label + '</label>' + inner + '</div>';
}

function renderPresProps() {
  const box = document.getElementById('pres-props');
  if (!box) return;
  const slide = currentSlide();
  const el = selectedEl();

  let html = '<div class="props-title">Slide ' + (presCurrent + 1) + '</div>';
  html += propGroup('Slide background (this slide only)',
    '<div class="prop-row"><input type="color" id="prop-slide-bg" class="fixed" value="' + slide.bg + '"></div>');

  if (!el) {
    html += '<div class="props-empty">Click any item on the slide to edit it on its own — or use the buttons above the slide to add a new text box, icon, shape or image.</div>';
    box.innerHTML = html;
    document.getElementById('prop-slide-bg').addEventListener('input', function () {
      currentSlide().bg = this.value;
      renderPresCanvas();
    });
    return;
  }

  const typeName = { text: 'Text box', icon: 'Icon', box: 'Shape', image: 'Image' }[el.type];
  html += '<div class="props-title" style="margin-top:16px;">' + typeName + ' — selected</div>';

  if (el.type === 'text') {
    html += propGroup('Text', '<textarea id="prop-text" rows="3">' + escapeForHtml(el.text) + '</textarea>');
    html += propGroup('Colour of THIS text only',
      '<div class="prop-row"><input type="color" id="prop-color" class="fixed" value="' + el.color + '"></div>');
    let fontOpts = '<option value="">Use deck font (' + fontNameOf(deckFontValue()) + ')</option>';
    PRES_FONTS.forEach(f => {
      const v = f.name + '|' + f.param;
      fontOpts += '<option value="' + v + '"' + (el.font === v ? ' selected' : '') + '>' + f.name + '</option>';
    });
    html += propGroup('Font for this text', '<select id="prop-font">' + fontOpts + '</select>');
    html += propGroup('Size (' + el.size + 'px)',
      '<input type="range" id="prop-size" min="10" max="140" value="' + el.size + '">');
    html += propGroup('Style',
      '<div class="toggle-row">' +
      '<button type="button" class="toggle-btn' + (el.bold ? ' on' : '') + '" id="prop-bold"><b>B</b></button>' +
      '<button type="button" class="toggle-btn' + (el.italic ? ' on' : '') + '" id="prop-italic"><i>I</i></button>' +
      '</div>');
    html += propGroup('Align',
      '<div class="toggle-row">' +
      ['left', 'center', 'right'].map(a =>
        '<button type="button" class="toggle-btn' + (el.align === a ? ' on' : '') + '" data-align="' + a + '">' +
        (a === 'left' ? '⬅' : a === 'center' ? '⬌' : '➡') + '</button>').join('') +
      '</div>');
    html += propGroup('Box width / line height',
      '<div class="prop-row"><input type="number" id="prop-w" value="' + Math.round(el.w) + '" step="10">' +
      '<input type="number" id="prop-lh" value="' + el.lh + '" step="0.05" min="0.8" max="3"></div>');
  } else if (el.type === 'icon') {
    let iconOpts = '';
    PRES_ICONS.forEach(o => {
      iconOpts += '<option value="' + o.value + '"' + (el.icon === o.value ? ' selected' : '') + '>' + o.label + '</option>';
    });
    html += propGroup('Icon', '<select id="prop-icon">' + iconOpts + '</select>');
    html += propGroup('Colour', '<div class="prop-row"><input type="color" id="prop-color" class="fixed" value="' + el.color + '"></div>');
    html += propGroup('Size (' + el.size + 'px)', '<input type="range" id="prop-size" min="20" max="300" value="' + el.size + '">');
  } else if (el.type === 'box') {
    html += propGroup('Fill colour', '<div class="prop-row"><input type="color" id="prop-color" class="fixed" value="' + el.color + '"></div>');
    html += propGroup('Width / height',
      '<div class="prop-row"><input type="number" id="prop-w" value="' + Math.round(el.w) + '" step="10">' +
      '<input type="number" id="prop-h" value="' + Math.round(el.h) + '" step="10"></div>');
    html += propGroup('Corner radius', '<input type="range" id="prop-radius" min="0" max="120" value="' + el.radius + '">');
    html += propGroup('Opacity', '<input type="range" id="prop-opacity" min="5" max="100" value="' + Math.round(el.opacity * 100) + '">');
  } else if (el.type === 'image') {
    html += propGroup('Width', '<input type="number" id="prop-w" value="' + Math.round(el.w) + '" step="10">');
    html += propGroup('Corner radius', '<input type="range" id="prop-radius" min="0" max="200" value="' + el.radius + '">');
    html += propGroup('Opacity', '<input type="range" id="prop-opacity" min="5" max="100" value="' + Math.round(el.opacity * 100) + '">');
  }

  html += propGroup('Position (X / Y)',
    '<div class="prop-row"><input type="number" id="prop-x" value="' + Math.round(el.x) + '" step="5">' +
    '<input type="number" id="prop-y" value="' + Math.round(el.y) + '" step="5"></div>');

  html += propGroup('Layer',
    '<div class="toggle-row">' +
    '<button type="button" class="toggle-btn" id="prop-back">⬇ Back</button>' +
    '<button type="button" class="toggle-btn" id="prop-front">⬆ Front</button>' +
    '</div>');

  html += '<div class="toggle-row" style="margin-top:14px;">' +
    '<button type="button" class="mini-btn" id="prop-dup">⧉ Duplicate</button>' +
    '<button type="button" class="mini-btn danger" id="prop-del">🗑 Delete</button>' +
    '</div>';

  box.innerHTML = html;
  bindPresProps(el);
}

function bindPresProps(el) {
  const on = (id, ev, fn) => {
    const node = document.getElementById(id);
    if (node) node.addEventListener(ev, fn);
  };

  on('prop-slide-bg', 'input', function () { currentSlide().bg = this.value; renderPresCanvas(); });
  on('prop-text', 'input', function () { el.text = this.value; renderPresCanvas(); });
  on('prop-color', 'input', function () { el.color = this.value; renderPresCanvas(); });
  on('prop-font', 'change', function () { el.font = this.value; renderPresCanvas(); });
  on('prop-icon', 'change', function () { el.icon = this.value; renderPresCanvas(); });
  on('prop-size', 'input', function () {
    el.size = parseInt(this.value, 10);
    const lab = this.parentElement.querySelector('label');
    if (lab) lab.innerText = lab.innerText.replace(/\(.*\)/, '(' + el.size + 'px)');
    renderPresCanvas();
  });
  on('prop-w', 'input', function () { el.w = parseInt(this.value, 10) || 40; renderPresCanvas(); });
  on('prop-h', 'input', function () { el.h = parseInt(this.value, 10) || 40; renderPresCanvas(); });
  on('prop-lh', 'input', function () { el.lh = parseFloat(this.value) || 1.35; renderPresCanvas(); });
  on('prop-radius', 'input', function () { el.radius = parseInt(this.value, 10); renderPresCanvas(); });
  on('prop-opacity', 'input', function () { el.opacity = parseInt(this.value, 10) / 100; renderPresCanvas(); });
  on('prop-x', 'input', function () { el.x = parseInt(this.value, 10) || 0; renderPresCanvas(); });
  on('prop-y', 'input', function () { el.y = parseInt(this.value, 10) || 0; renderPresCanvas(); });
  on('prop-bold', 'click', function () { el.bold = !el.bold; this.classList.toggle('on'); renderPresCanvas(); });
  on('prop-italic', 'click', function () { el.italic = !el.italic; this.classList.toggle('on'); renderPresCanvas(); });
  on('prop-back', 'click', function () { layerSelectedEl(-1); });
  on('prop-front', 'click', function () { layerSelectedEl(1); });
  on('prop-dup', 'click', duplicateSelectedEl);
  on('prop-del', 'click', deleteSelectedEl);

  Array.from(document.querySelectorAll('#pres-props [data-align]')).forEach(btn => {
    btn.addEventListener('click', function () {
      el.align = this.getAttribute('data-align');
      Array.from(document.querySelectorAll('#pres-props [data-align]')).forEach(b => b.classList.remove('on'));
      this.classList.add('on');
      renderPresCanvas();
    });
  });
}

/* ---------- build the downloadable deck ---------- */
function buildPresentationHtml(title) {
  const deckFont = deckFontValue();
  const params = [deckFont.split('|')[1]];
  presSlides.forEach(s => s.els.forEach(e => {
    if (e.font) {
      const p = e.font.split('|')[1];
      if (params.indexOf(p) === -1) params.push(p);
    }
  }));
  const fontImportUrl = 'https://fonts.googleapis.com/css2?' + params.map(p => 'family=' + p).join('&') + '&display=swap';

  const parts = presSlides.map(s => presSlideHtml(s));
  if (parts.length > 0) parts[0] = parts[0].replace('class="slide "', 'class="slide active "').replace('class="slide"', 'class="slide active"');

  let html = PRESENTATION_TEMPLATE;
  html = html.split('__PRESENTATION_TITLE__').join(escapeForHtml(title || 'Presentation'));
  html = html.split('__FONT_IMPORT_URL__').join(fontImportUrl);
  html = html.split('__COLOR_BG__').join(document.getElementById('pres-color-bg').value);
  html = html.split('__FONT_FAMILY__').join(fontNameOf(deckFont));
  html = html.split('__SLIDE_COUNT__').join(String(presSlides.length));
  html = html.split('__SLIDES_HTML__').join(parts.join('\n'));
  return html;
}

function previewPresentation() {
  const title = document.getElementById('pres-title').value.trim() || 'Presentation';
  const html = buildPresentationHtml(title);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function createPresentation() {
  const title = document.getElementById('pres-title').value.trim();
  if (!title) { showToast('Please enter a presentation title.'); return; }
  if (presSlides.length === 0) { showToast('Add at least one slide.'); return; }

  const html = buildPresentationHtml(title);
  downloadFile(typedFilename('Presentation', title, 'presentation'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}

/* ---------- init ---------- */
function initPresBuilder() {
  populatePresFontSelect();
  const want = parseInt(document.getElementById('pres-slide-count').value, 10) || 5;
  presSlides = [];
  for (let i = 0; i < want; i++) presSlides.push(defaultPresSlide(i === 0));
  presCurrent = 0;
  presSelId = null;
  renderPresTabs();
  renderPresCanvas();
  renderPresProps();

  document.getElementById('pres-color-bg').addEventListener('input', function () { /* deck background only */ });

  const stage = document.getElementById('pres-canvas');
  stage.addEventListener('pointerdown', function (e) {
    if (e.target === stage) { presSelId = null; renderPresCanvas(); renderPresProps(); }
  });

  document.getElementById('pres-image-input').addEventListener('change', function (e) {
    const file = (e.target.files || [])[0];
    if (!file) return;
    if (file.size > 2500000) { showToast('That image is very large — please use one under about 2 MB.'); e.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = () => { addPresElement('image', { src: reader.result }); };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  window.addEventListener('resize', fitPresCanvas);

  document.addEventListener('keydown', function (e) {
    const panel = document.getElementById('panel-presentation');
    if (!panel || !panel.classList.contains('active')) return;
    if (!presSelId) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    const step = e.shiftKey ? 10 : 1;
    const el = selectedEl();
    if (!el) return;
    if (e.key === 'ArrowLeft') { el.x -= step; }
    else if (e.key === 'ArrowRight') { el.x += step; }
    else if (e.key === 'ArrowUp') { el.y -= step; }
    else if (e.key === 'ArrowDown') { el.y += step; }
    else if (e.key === 'Delete' || e.key === 'Backspace') { deleteSelectedEl(); e.preventDefault(); return; }
    else return;
    e.preventDefault();
    renderPresCanvas();
    syncPresPosInputs();
  });
}

function resetPresentationForm() {
  document.getElementById('pres-title').value = '';
  const presIns = document.getElementById('pres-instructions'); if (presIns) presIns.value = '';
  document.getElementById('pres-slide-count').value = '5';
  document.getElementById('pres-color-bg').value = '#141d2b';
  const want = parseInt(document.getElementById('pres-slide-count').value, 10) || 5;
  presSlides = [];
  for (let i = 0; i < want; i++) presSlides.push(defaultPresSlide(i === 0));
  presCurrent = 0;
  presSelId = null;
  renderPresTabs();
  renderPresCanvas();
  renderPresProps();
}

/* ================= PRONUNCIATION ENGINE (shared) ================= */
/* Rough English spelling -> IPA. Used to transcribe whatever the student
   actually said, and as a fallback when no dictionary pronunciation exists. */
const IPA_EXCEPTIONS = {
  a: 'ə', the: 'ðə', of: 'ʌv', to: 'tuː', do: 'duː', does: 'dʌz', done: 'dʌn',
  go: 'ɡoʊ', going: 'ɡoʊɪŋ', one: 'wʌn', two: 'tuː', four: 'fɔːr', eight: 'eɪt',
  who: 'huː', whose: 'huːz', what: 'wʌt', want: 'wɒnt', was: 'wʌz', were: 'wɜːr',
  said: 'sɛd', says: 'sɛz', are: 'ɑːr', you: 'juː', your: 'jɔːr', there: 'ðɛər',
  their: 'ðɛər', they: 'ðeɪ', them: 'ðɛm', this: 'ðɪs', that: 'ðæt', these: 'ðiːz',
  those: 'ðoʊz', then: 'ðɛn', than: 'ðæn', though: 'ðoʊ', through: 'θruː',
  thought: 'θɔːt', enough: 'ɪnʌf', laugh: 'læf', cough: 'kɒf', rough: 'rʌf',
  tough: 'tʌf', high: 'haɪ', night: 'naɪt', light: 'laɪt', right: 'raɪt',
  might: 'maɪt', sight: 'saɪt', bought: 'bɔːt', caught: 'kɔːt', taught: 'tɔːt',
  daughter: 'dɔːtər', water: 'wɔːtər', people: 'piːpəl', because: 'bɪkɔːz',
  friend: 'frɛnd', school: 'skuːl', island: 'aɪlənd', answer: 'ænsər',
  business: 'bɪznəs', hour: 'aʊər', once: 'wʌns', some: 'sʌm', come: 'kʌm',
  love: 'lʌv', give: 'ɡɪv', live: 'lɪv', have: 'hæv', move: 'muːv', prove: 'pruːv',
  where: 'wɛər', here: 'hɪər', very: 'vɛri', many: 'mɛni', any: 'ɛni',
  woman: 'wʊmən', women: 'wɪmɪn', child: 'tʃaɪld', children: 'tʃɪldrən',
  eye: 'aɪ', bird: 'bɜːrd', word: 'wɜːrd', world: 'wɜːrld', work: 'wɜːrk',
  heart: 'hɑːrt', early: 'ɜːrli', learn: 'lɜːrn', earth: 'ɜːrθ', great: 'ɡreɪt',
  break: 'breɪk', steak: 'steɪk', head: 'hɛd', bread: 'brɛd', read: 'riːd',
  ready: 'rɛdi', dead: 'dɛd', health: 'hɛlθ', weather: 'wɛðər', put: 'pʊt',
  push: 'pʊʃ', pull: 'pʊl', full: 'fʊl', book: 'bʊk', look: 'lʊk', good: 'ɡʊd',
  foot: 'fʊt', wood: 'wʊd', cook: 'kʊk', could: 'kʊd', would: 'wʊd',
  should: 'ʃʊd', use: 'juːz', used: 'juːzd', usually: 'juːʒuəli', sure: 'ʃʊər',
  sugar: 'ʃʊɡər', picture: 'pɪktʃər', nature: 'neɪtʃər', future: 'fjuːtʃər',
  question: 'kwɛstʃən', station: 'steɪʃən', nation: 'neɪʃən', vision: 'vɪʒən',
  decision: 'dɪsɪʒən', machine: 'məʃiːn', beautiful: 'bjuːtɪfəl',
  another: 'ənʌðər', other: 'ʌðər', mother: 'mʌðər', father: 'fɑːðər',
  brother: 'brʌðər', sister: 'sɪstər', teacher: 'tiːtʃər', student: 'stuːdənt',
  colour: 'kʌlər', color: 'kʌlər', money: 'mʌni', honey: 'hʌni', monkey: 'mʌŋki',
  country: 'kʌntri', young: 'jʌŋ', touch: 'tʌtʃ', enough_: 'ɪnʌf'
};

const IPA_VOWEL_DIGRAPHS = [
  ['eigh', 'eɪ'], ['ough', 'ɔː'], ['augh', 'ɔː'], ['tion', 'ʃən'], ['sion', 'ʒən'],
  ['air', 'ɛər'], ['ear', 'ɪər'], ['eer', 'ɪər'], ['our', 'aʊər'], ['oor', 'ɔːr'],
  ['are', 'ɛər'], ['ire', 'aɪər'], ['ure', 'jʊər'], ['ore', 'ɔːr'],
  ['ee', 'iː'], ['ea', 'iː'], ['ai', 'eɪ'], ['ay', 'eɪ'], ['oa', 'oʊ'],
  ['oe', 'oʊ'], ['oo', 'uː'], ['ou', 'aʊ'], ['ow', 'aʊ'], ['oi', 'ɔɪ'],
  ['oy', 'ɔɪ'], ['au', 'ɔː'], ['aw', 'ɔː'], ['ie', 'aɪ'], ['ei', 'eɪ'],
  ['ey', 'eɪ'], ['ew', 'uː'], ['ue', 'uː'], ['ui', 'uː'],
  ['ar', 'ɑːr'], ['or', 'ɔːr'], ['er', 'ɜːr'], ['ir', 'ɜːr'], ['ur', 'ɜːr']
];

const IPA_CONSONANTS = [
  ['tch', 'tʃ'], ['dge', 'dʒ'], ['sch', 'sk'], ['sh', 'ʃ'], ['ch', 'tʃ'],
  ['th', 'θ'], ['ph', 'f'], ['ck', 'k'], ['ng', 'ŋ'], ['nk', 'ŋk'],
  ['qu', 'kw'], ['wh', 'w'], ['gh', ''], ['ss', 's'], ['ll', 'l'],
  ['tt', 't'], ['pp', 'p'], ['bb', 'b'], ['dd', 'd'], ['ff', 'f'],
  ['gg', 'ɡ'], ['mm', 'm'], ['nn', 'n'], ['rr', 'r'], ['zz', 'z']
];

const IPA_SHORT_VOWELS = { a: 'æ', e: 'ɛ', i: 'ɪ', o: 'ɒ', u: 'ʌ' };
const IPA_LONG_VOWELS = { a: 'eɪ', e: 'iː', i: 'aɪ', o: 'oʊ', u: 'juː' };

function pronNormalise(text) {
  return String(text || '').toLowerCase().replace(/[^a-z' ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function ipaOfWord(raw) {
  let w = pronNormalise(raw).replace(/'/g, '');
  if (!w) return '';
  if (IPA_EXCEPTIONS[w]) return IPA_EXCEPTIONS[w];

  // magic "e": make + final e => long vowel, e is silent
  const endsWithS = /s$/.test(w);
  let tail = '';
  // "-le" after a consonant is a syllabic /əl/  (apple, table, little)
  if (/[^aeiou]le$/.test(w)) { tail = 'əl'; w = w.slice(0, -2); }
  else if (/[^aeiou]ow$/.test(w) || /ow$/.test(w)) { /* handled below */ }
  let magicE = false;
  if (/[a-z]{3,}e$/.test(w) && !/[aeiou]e$/.test(w.slice(-2)) && /[aeiou][^aeiou]e$/.test(w)) {
    magicE = true;
    w = w.slice(0, -1);
  }

  let out = '';
  let i = 0;
  // final "-ow" is /oʊ/ (window, yellow) rather than /aʊ/
  const finalOw = /ow$/.test(w);
  const startsWith = (str) => w.startsWith(str, i);

  // silent starting clusters
  if (w.startsWith('kn') || w.startsWith('gn') || w.startsWith('pn')) i = 1;
  if (w.startsWith('wr')) i = 1;
  if (w.startsWith('ps')) i = 1;

  while (i < w.length) {
    let matched = false;

    for (let k = 0; k < IPA_CONSONANTS.length; k++) {
      if (startsWith(IPA_CONSONANTS[k][0])) {
        out += IPA_CONSONANTS[k][1];
        i += IPA_CONSONANTS[k][0].length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    if (finalOw && i === w.length - 2 && w.substr(i, 2) === 'ow') { out += 'oʊ'; i += 2; continue; }
    if (startsWith('nge')) { out += 'ndʒ'; i += 3; continue; }
    if (startsWith('nce')) { out += 'ns'; i += 3; continue; }

    for (let k = 0; k < IPA_VOWEL_DIGRAPHS.length; k++) {
      if (startsWith(IPA_VOWEL_DIGRAPHS[k][0])) {
        out += IPA_VOWEL_DIGRAPHS[k][1];
        i += IPA_VOWEL_DIGRAPHS[k][0].length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    const c = w[i];
    const next = w[i + 1] || '';

    if ('aeiou'.indexOf(c) !== -1) {
      const isLast = i === w.length - 1;
      if (magicE && isLast === false && /[^aeiou]$/.test(w.slice(i + 1))) {
        // vowel followed by one consonant then the dropped silent e
        out += (w.length - i === 2) ? IPA_LONG_VOWELS[c] : IPA_SHORT_VOWELS[c];
      } else if (c === 'e' && isLast) {
        out += 'i';
      } else if (c === 'y') {
        out += 'i';
      } else {
        out += IPA_SHORT_VOWELS[c];
      }
      i++;
      continue;
    }

    if (c === 'c') { out += ('eiy'.indexOf(next) !== -1) ? 's' : 'k'; i++; continue; }
    if (c === 'g') { out += ('eiy'.indexOf(next) !== -1) ? 'dʒ' : 'ɡ'; i++; continue; }
    if (c === 'j') { out += 'dʒ'; i++; continue; }
    if (c === 'x') { out += 'ks'; i++; continue; }
    if (c === 'y') { out += (i === 0) ? 'j' : (i === w.length - 1 ? 'i' : 'aɪ'); i++; continue; }
    if (c === 's') { out += (i === w.length - 1 && endsWithS && w.length > 3 && /[aeioubdgmnlrvwyz]/.test(w[i - 1] || '')) ? 'z' : 's'; i++; continue; }
    if (c === 'z') { out += 'z'; i++; continue; }
    if (c === 'h' && i > 0) { i++; continue; }
    out += c;
    i++;
  }
  return out + tail;
}

function ipaOfText(text) {
  return pronNormalise(text).split(' ').filter(Boolean).map(ipaOfWord).join(' ');
}

const IPA_PAIRS = ['tʃ', 'dʒ', 'aɪ', 'aʊ', 'eɪ', 'oʊ', 'ɔɪ', 'ɪə', 'ɛə', 'ʊə', 'ju'];

function ipaTokens(ipa) {
  const clean = String(ipa || '').replace(/[\/\[\]ˈˌ\.\s]/g, '');
  const out = [];
  let i = 0;
  while (i < clean.length) {
    let tok = clean[i];
    const two = clean.substr(i, 2);
    if (IPA_PAIRS.indexOf(two) !== -1) { tok = two; i += 2; } else { i += 1; }
    while (i < clean.length && /[ːʰ̃ʲ]/.test(clean[i])) { tok += clean[i]; i++; }
    if (/r/.test(clean[i] || '') && /[ɜɑɔ]ː$/.test(tok)) { tok += 'r'; i++; }
    out.push(tok);
  }
  return out;
}

/* Levenshtein alignment: says which sounds of the TARGET were hit or missed. */
function ipaAlign(A, B) {
  const n = A.length, m = B.length;
  const d = [], bt = [];
  for (let i = 0; i <= n; i++) { d.push(new Array(m + 1).fill(0)); bt.push(new Array(m + 1).fill('')); }
  for (let i = 0; i <= n; i++) { d[i][0] = i; bt[i][0] = 'D'; }
  for (let j = 0; j <= m; j++) { d[0][j] = j; bt[0][j] = 'I'; }
  bt[0][0] = '';
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = A[i - 1] === B[j - 1] ? 0 : 1;
      const sub = d[i - 1][j - 1] + cost, del = d[i - 1][j] + 1, ins = d[i][j - 1] + 1;
      const best = Math.min(sub, del, ins);
      d[i][j] = best;
      bt[i][j] = (best === sub) ? (cost === 0 ? 'M' : 'S') : (best === del ? 'D' : 'I');
    }
  }
  const marks = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    const op = (i > 0 && j > 0) ? bt[i][j] : (i > 0 ? 'D' : 'I');
    if (op === 'M' || op === 'S') { marks.unshift({ tok: A[i - 1], ok: op === 'M' }); i--; j--; }
    else if (op === 'D') { marks.unshift({ tok: A[i - 1], ok: false }); i--; }
    else { j--; }
  }
  const dist = d[n][m];
  const score = Math.max(0, Math.round((1 - dist / Math.max(n, m, 1)) * 100));
  return { score: score, marks: marks };
}

/* Compares one spoken attempt against the target word. */
function scorePronunciation(targetWord, targetIpa, heardText) {
  const target = pronNormalise(targetWord);
  const heard = pronNormalise(heardText);
  const shownIpa = (targetIpa && targetIpa.trim()) ? targetIpa.trim() : ipaOfText(targetWord);
  const tokens = ipaTokens(shownIpa);

  if (heard && heard === target) {
    return { score: 100, marks: tokens.map(t => ({ tok: t, ok: true })), ipa: shownIpa, heard: heard };
  }
  const al = ipaAlign(tokens, ipaTokens(ipaOfText(heard)));
  return { score: al.score, marks: al.marks, ipa: shownIpa, heard: heard };
}

/* ---------------------------------------------------------------
   Judging an attempt.

   The browser's recogniser is a guessing machine: it hunts for the most
   likely real word, so a sloppy "tri" still comes back as "tree". Three
   things stop that from being scored as perfect:

   1. Only the recogniser's FIRST (most likely) guess counts. We never go
      shopping through the other guesses for one that happens to match.
   2. The confidence the recogniser reports is folded into the score, so a
      hesitant "I think that was tree" cannot be 100%.
   3. If the recogniser offered several different words, the student's
      sounds were ambiguous — that costs marks too.
--------------------------------------------------------------- */
const STRICTNESS_SETTINGS = {
  lenient: { floor: 0.40, span: 0.45, base: 0.72, ambiguity: 0.03, extraWord: 0.10 },
  normal:  { floor: 0.55, span: 0.40, base: 0.55, ambiguity: 0.07, extraWord: 0.18 },
  strict:  { floor: 0.70, span: 0.28, base: 0.38, ambiguity: 0.11, extraWord: 0.26 }
};

function clamp01(x) { return Math.max(0, Math.min(1, x)); }

function judgeAttempt(targetWord, targetIpa, alternatives, strictness) {
  const cfg = STRICTNESS_SETTINGS[strictness] || STRICTNESS_SETTINGS.normal;
  const shownIpa = (targetIpa && targetIpa.trim()) ? targetIpa.trim() : ipaOfText(targetWord);
  const tokens = ipaTokens(shownIpa);
  const target = pronNormalise(targetWord);

  const list = (alternatives || []).map(a => (typeof a === 'string')
    ? { transcript: a, confidence: null }
    : { transcript: (a && a.transcript) || '', confidence: (a && typeof a.confidence === 'number' && a.confidence > 0) ? a.confidence : null });

  if (!list.length || !pronNormalise(list[0].transcript)) {
    return { score: 0, marks: tokens.map(t => ({ tok: t, ok: false })), ipa: shownIpa, heard: '', verdict: 'nothing' };
  }

  const top = list[0];
  const heard = pronNormalise(top.transcript);

  // how unsure was the recogniser? (other words it also considered)
  const others = [];
  list.slice(1).forEach(a => {
    const t = pronNormalise(a.transcript);
    if (t && t !== heard && others.indexOf(t) === -1) others.push(t);
  });

  // it heard a DIFFERENT word — compare sound by sound, that is the honest score
  if (heard !== target) {
    const al = ipaAlign(tokens, ipaTokens(ipaOfText(heard)));
    let score = al.score;
    if (top.confidence !== null && top.confidence < 0.6) score = Math.round(score * 0.9);
    return { score: score, marks: al.marks, ipa: shownIpa, heard: heard, verdict: 'wrong-word' };
  }

  // it heard the right word — but how convincingly?
  let quality;
  if (top.confidence === null) {
    quality = 0.86;                                  // recogniser gave no number
  } else {
    quality = cfg.base + (1 - cfg.base) * clamp01((top.confidence - cfg.floor) / cfg.span);
  }
  quality -= Math.min(others.length, 3) * cfg.ambiguity;

  // extra words in the answer (they said a sentence, or the mic caught noise)
  const extra = Math.max(0, heard.split(' ').length - target.split(' ').length);
  quality -= Math.min(extra, 3) * cfg.extraWord;

  const score = Math.max(10, Math.min(100, Math.round(quality * 100)));
  const clear = score >= 85;
  return {
    score: score,
    marks: tokens.map(t => ({ tok: t, ok: clear, weak: !clear })),
    ipa: shownIpa,
    heard: heard,
    verdict: clear ? 'clear' : 'unclear',
    rivals: others
  };
}

/* kept for compatibility with older generated files */
function bestAttempt(targetWord, targetIpa, alternatives) {
  return judgeAttempt(targetWord, targetIpa, alternatives, 'normal');
}

function ipaMarksHtml(marks) {
  return marks.map(m => {
    const cls = m.ok ? 'ok' : (m.weak ? 'weak' : 'bad');
    return '<span class="ph ' + cls + '">' + m.tok + '</span>';
  }).join('');
}

/* ---------------- microphone ----------------
   The browser asks for microphone permission once per listening engine.
   So we open ONE audio stream and ONE recogniser at the start of the
   session and keep both alive for the whole exercise — every later word
   reuses them, which is why the permission box only appears once. */
function speechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

let micStream = null;
let micMuted = false;
function setMicMuted(v) { micMuted = !!v; }
let sharedRec = null;
let recRunning = false;
let recKeepAlive = false;
let pendingListen = null;
let micLang = 'en-US';
let micState = 'idle';               // 'idle' | 'ready' | 'blocked'
let micStateHandler = null;

function setMicState(state) {
  if (micState === state) return;
  micState = state;
  if (micStateHandler) { try { micStateHandler(state); } catch (e) { /* ignore */ } }
}
function micIsReady() { return micState === 'ready'; }

/* Holding a live audio stream keeps the permission granted for this page,
   so restarting the recogniser between words never re-prompts. */
function primeMicrophone() {
  if (micStream) return Promise.resolve(true);
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.resolve(true);
  return navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => { micStream = stream; return true; })
    .catch(() => false);
}

function buildRecogniser() {
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Rec) return null;
  const rec = new Rec();
  rec.lang = micLang;
  rec.interimResults = false;
  rec.maxAlternatives = 5;
  rec.continuous = true;

  rec.onstart = () => { recRunning = true; setMicState('ready'); };
  rec.onresult = (ev) => {
    const res = ev.results[ev.results.length - 1];
    const alts = [];
    for (let i = 0; i < res.length; i++) {
      alts.push({ transcript: res[i].transcript, confidence: res[i].confidence });
    }
    settleListen('ok', alts);
  };
  rec.onerror = (ev) => {
    const err = String(ev.error || '');
    if (err === 'not-allowed' || err === 'service-not-allowed') {
      recKeepAlive = false;
      setMicState('blocked');
    }
    if (err === 'no-speech' || err === 'aborted') return;   // engine simply restarts
    settleListen('err', new Error(err));
  };
  rec.onend = () => {
    recRunning = false;
    if (recKeepAlive) {
      // restart at once, in the same breath, so the browser treats it as the
      // same listening session and does not interrupt the student again
      try { rec.start(); recRunning = true; return; } catch (e) { /* fall through */ }
      setTimeout(() => {
        if (!recKeepAlive || recRunning) return;
        try { rec.start(); recRunning = true; } catch (e2) { /* already starting */ }
      }, 120);
    }
  };
  return rec;
}

function settleListen(kind, payload) {
  if (micMuted) return;          // the app is playing the model voice
  if (!pendingListen) return;
  const p = pendingListen;
  pendingListen = null;
  clearTimeout(p.timer);
  if (kind === 'ok') p.resolve(payload); else p.reject(payload);
}

/* Called once, as soon as the file is opened, so the permission box appears
   on the very first screen instead of interrupting the exercise later. */
function startMicEngine(lang) {
  micLang = lang || micLang;
  return primeMicrophone().then(() => {
    if (!speechSupported()) return false;
    if (!sharedRec) sharedRec = buildRecogniser();
    if (!sharedRec) return false;
    sharedRec.lang = micLang;
    recKeepAlive = true;
    if (!recRunning) {
      try { sharedRec.start(); recRunning = true; } catch (e) { /* already running */ }
    }
    return true;
  });
}

function stopMicEngine() {
  recKeepAlive = false;
  try { if (sharedRec && recRunning) sharedRec.stop(); } catch (e) { /* ignore */ }
  recRunning = false;
  try { if (micStream) micStream.getTracks().forEach(t => t.stop()); } catch (e) { /* ignore */ }
  micStream = null;
}

/* Opens a listening window on the always-on engine — no new permission box. */
function listenOnce(lang) {
  return new Promise((resolve, reject) => {
    if (!speechSupported()) { reject(new Error('unsupported')); return; }
    startMicEngine(lang).then(ready => {
      if (!ready) { reject(new Error('not-allowed')); return; }
      if (pendingListen) { clearTimeout(pendingListen.timer); pendingListen = null; }
      const p = { resolve: resolve, reject: reject };
      p.timer = setTimeout(() => { if (pendingListen === p) { pendingListen = null; resolve([]); } }, 9000);
      pendingListen = p;
    }).catch(() => reject(new Error('not-allowed')));
  });
}

/* ---------------- model pronunciation (the app speaks) ----------------
   Two voices — a woman and a man — chosen from whatever English voices the
   device has installed, plus speed and volume control. */
let ttsVoices = [];
function refreshVoices() {
  try { ttsVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
  catch (e) { ttsVoices = []; }
  return ttsVoices;
}
if (typeof window !== 'undefined' && window.speechSynthesis) {
  refreshVoices();
  try { window.speechSynthesis.onvoiceschanged = refreshVoices; } catch (e) { /* ignore */ }
}

const FEMALE_VOICE_HINTS = /female|woman|zira|samantha|karen|moira|tessa|serena|fiona|susan|joanna|salli|kendra|amy|emma|libby|aria|jenny|michelle|sonia|catherine|natasha|clara|victoria|allison|ava|nicky/i;
const MALE_VOICE_HINTS = /male|man|david|daniel|alex|fred|rishi|mark|guy|james|matthew|brian|arthur|ryan|william|liam|christopher|eric|roger|steffan|tom|oliver|aaron/i;

function ttsSupported() {
  return !!(typeof window !== 'undefined' && window.speechSynthesis && window.SpeechSynthesisUtterance);
}

function pickVoice(gender, lang) {
  const list = refreshVoices();
  if (!list.length) return null;
  const prefix = String(lang || 'en').slice(0, 2).toLowerCase();
  const sameLang = list.filter(v => String(v.lang || '').toLowerCase().indexOf(prefix) === 0);
  const pool = sameLang.length ? sameLang : list;
  const exact = pool.filter(v => String(v.lang || '').toLowerCase().replace('_', '-') === String(lang || '').toLowerCase());
  const search = exact.length ? exact : pool;
  const want = (gender === 'male') ? MALE_VOICE_HINTS : FEMALE_VOICE_HINTS;
  const avoid = (gender === 'male') ? FEMALE_VOICE_HINTS : MALE_VOICE_HINTS;
  let v = search.filter(x => want.test(x.name))[0];
  if (!v) v = search.filter(x => !avoid.test(x.name))[gender === 'male' ? Math.max(0, search.length - 1) : 0];
  if (!v) v = search.filter(x => !avoid.test(x.name))[0];
  return v || search[0] || pool[0];
}

function voiceLabel(gender, lang) {
  const v = pickVoice(gender, lang);
  return v ? (v.name + ' (' + v.lang + ')') : 'device default voice';
}

function speakWord(text, opts) {
  opts = opts || {};
  return new Promise(resolve => {
    if (!ttsSupported()) { resolve(false); return; }
    try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    const u = new window.SpeechSynthesisUtterance(String(text || ''));
    const v = pickVoice(opts.gender || 'female', opts.lang || 'en-US');
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = opts.lang || 'en-US'; }
    u.rate = opts.rate || 1;
    u.pitch = 1;
    u.volume = (typeof opts.volume === 'number') ? opts.volume : 1;

    setMicMuted(true);                       // do not let the mic score our own voice
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setTimeout(() => setMicMuted(false), 400);
      resolve(true);
    };
    u.onend = finish;
    u.onerror = finish;
    setTimeout(finish, 7000);
    try { window.speechSynthesis.speak(u); } catch (e) { finish(); }
  });
}

/* Opens the microphone as early as possible — on page load, and again from a
   button on the first screen if the browser refused without a tap. */
function micBootstrap(lang, onState) {
  if (onState) micStateHandler = onState;
  if (onState) { try { onState(micState); } catch (e) { /* ignore */ } }
  if (!speechSupported()) { setMicState('blocked'); return Promise.resolve(false); }
  return startMicEngine(lang).then(ok => {
    if (!ok) setMicState('blocked');
    return ok;
  });
}

/* ================= PRONUNCIATION BUILDER ================= */
const PRON_EMOJI = {
  tree: '🌳', flower: '🌸', grass: '🌱', leaf: '🍃', forest: '🌲', mountain: '⛰️', river: '🏞️',
  sun: '☀️', moon: '🌙', star: '⭐', cloud: '☁️', rain: '🌧️', snow: '❄️', wind: '💨', sky: '🌌',
  fire: '🔥', water: '💧', sea: '🌊', beach: '🏖️', island: '🏝️', earth: '🌍', rainbow: '🌈',
  cat: '🐱', dog: '🐶', bird: '🐦', fish: '🐟', horse: '🐴', cow: '🐮', sheep: '🐑', pig: '🐷',
  lion: '🦁', tiger: '🐯', bear: '🐻', monkey: '🐵', elephant: '🐘', rabbit: '🐰', mouse: '🐭',
  frog: '🐸', snake: '🐍', bee: '🐝', butterfly: '🦋', spider: '🕷️', duck: '🦆', chicken: '🐔',
  apple: '🍎', banana: '🍌', orange: '🍊', grape: '🍇', lemon: '🍋', peach: '🍑', melon: '🍉',
  bread: '🍞', cheese: '🧀', egg: '🥚', meat: '🥩', rice: '🍚', soup: '🍲', salad: '🥗',
  cake: '🍰', chocolate: '🍫', icecream: '🍨', coffee: '☕', tea: '🍵', milk: '🥛', juice: '🧃',
  house: '🏠', home: '🏠', school: '🏫', hospital: '🏥', shop: '🏪', bank: '🏦', hotel: '🏨',
  church: '⛪', bridge: '🌉', city: '🏙️', village: '🏘️', garden: '🌷', park: '🏞️', farm: '🚜',
  room: '🛏️', kitchen: '🍳', bathroom: '🛁', door: '🚪', window: '🪟', chair: '🪑', table: '🪑',
  bed: '🛏️', lamp: '💡', clock: '🕐', key: '🔑', mirror: '🪞', box: '📦', bag: '👜',
  car: '🚗', bus: '🚌', train: '🚆', plane: '✈️', boat: '⛵', bike: '🚲', ship: '🚢', taxi: '🚕',
  rocket: '🚀', road: '🛣️', map: '🗺️', ticket: '🎫', travel: '🧳', suitcase: '🧳',
  book: '📖', pen: '🖊️', pencil: '✏️', paper: '📄', notebook: '📓', bag_: '🎒', ruler: '📏',
  teacher: '🧑‍🏫', student: '🧑‍🎓', class: '👩‍🏫', lesson: '📚', test: '📝', exam: '📝',
  computer: '💻', phone: '📱', camera: '📷', television: '📺', music: '🎵', song: '🎶',
  guitar: '🎸', piano: '🎹', football: '⚽', basketball: '🏀', tennis: '🎾', swimming: '🏊',
  running: '🏃', game: '🎮', ball: '⚽', money: '💰', gift: '🎁', letter: '✉️', email: '📧',
  doctor: '🧑‍⚕️', nurse: '👩‍⚕️', police: '👮', driver: '🧑‍✈️', cook: '👨‍🍳', farmer: '🧑‍🌾',
  family: '👨‍👩‍👧', mother: '👩', father: '👨', sister: '👧', brother: '👦', baby: '👶',
  friend: '🧑‍🤝‍🧑', people: '👥', man: '👨', woman: '👩', boy: '👦', girl: '👧',
  hand: '✋', eye: '👁️', ear: '👂', nose: '👃', mouth: '👄', foot: '🦶', hair: '💇', heart: '❤️',
  happy: '😊', sad: '😢', angry: '😠', tired: '😴', sleep: '😴', laugh: '😂', cry: '😭',
  hot: '🔥', cold: '🥶', big: '🐘', small: '🐜', fast: '⚡', slow: '🐌', strong: '💪',
  time: '⏰', day: '🌞', night: '🌙', morning: '🌅', evening: '🌆', week: '📅', year: '📆',
  work: '💼', job: '💼', idea: '💡', question: '❓', answer: '✅', yes: '✅', no: '❌',
  language: '🗣️', english: '🇬🇧', word: '🔤', number: '🔢', color: '🎨', colour: '🎨'
};

function guessPronIcon(word) {
  const w = String(word || '').toLowerCase().trim().replace(/[^a-z]/g, '');
  if (!w) return '';
  if (PRON_EMOJI[w]) return PRON_EMOJI[w];
  if (w.endsWith('s') && PRON_EMOJI[w.slice(0, -1)]) return PRON_EMOJI[w.slice(0, -1)];
  if (w.endsWith('es') && PRON_EMOJI[w.slice(0, -2)]) return PRON_EMOJI[w.slice(0, -2)];
  if (w.endsWith('ing') && PRON_EMOJI[w.slice(0, -3)]) return PRON_EMOJI[w.slice(0, -3)];
  return '🔤';
}

const prRows = document.getElementById('pr-rows');

function makePronRow(container) {
  const row = document.createElement('div');
  row.className = 'row-item pron-row';

  const idx = document.createElement('div');
  idx.className = 'idx';

  const wordInput = document.createElement('input');
  wordInput.type = 'text';
  wordInput.className = 'pr-word';
  wordInput.placeholder = 'e.g. tree';

  const ipaInput = document.createElement('input');
  ipaInput.type = 'text';
  ipaInput.className = 'pr-ipa';
  ipaInput.placeholder = 'e.g. triː';

  const iconInput = document.createElement('input');
  iconInput.type = 'text';
  iconInput.className = 'pr-icon';
  iconInput.placeholder = '🌳';

  wordInput.addEventListener('input', () => {
    const w = wordInput.value.trim();
    ipaInput.value = w ? ipaOfText(w) : '';
    if (w) iconInput.value = guessPronIcon(w);
  });

  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.type = 'button';
  removeBtn.innerHTML = '&times;';
  removeBtn.onclick = () => { row.remove(); renumberRows(container); updatePronCount(); };

  row.appendChild(idx);
  row.appendChild(wordInput);
  row.appendChild(ipaInput);
  row.appendChild(iconInput);
  row.appendChild(removeBtn);
  container.appendChild(row);
  renumberRows(container);
  updatePronCount();
  return wordInput;
}

function addPronRow() { makePronRow(prRows); }
function addPronRowFilled(word) {
  const input = makePronRow(prRows);
  input.value = word;
  input.dispatchEvent(new Event('input'));
}
function updatePronCount() {
  const el = document.getElementById('pr-count');
  if (el) el.innerText = prRows.querySelectorAll('.pron-row').length;
}

function onPronDesignChange() {
  /* design hint text removed; function kept for the onchange wiring */
}

function readPronRows() {
  return Array.from(prRows.querySelectorAll('.pron-row')).map(row => ({
    w: row.querySelector('.pr-word').value.trim(),
    ipa: row.querySelector('.pr-ipa').value.trim().replace(/^\/|\/$/g, ''),
    icon: row.querySelector('.pr-icon').value.trim()
  })).filter(x => x.w);
}

/* Optional: pull the real dictionary pronunciation for every word. */
async function autoFillPronunciation() {
  const rows = Array.from(prRows.querySelectorAll('.pron-row'))
    .filter(r => r.querySelector('.pr-word').value.trim());
  if (rows.length === 0) { showToast('Type some words first.'); return; }

  showToast('Looking up ' + rows.length + ' word' + (rows.length > 1 ? 's' : '') + '…', 'ok');
  let found = 0;

  for (const row of rows) {
    const word = row.querySelector('.pr-word').value.trim();
    const ipaInput = row.querySelector('.pr-ipa');
    const iconInput = row.querySelector('.pr-icon');
    if (!iconInput.value.trim()) iconInput.value = guessPronIcon(word);
    try {
      const res = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word.toLowerCase()));
      if (!res.ok) throw new Error('not found');
      const data = await res.json();
      let text = '';
      (data || []).forEach(entry => {
        if (!text && entry.phonetic) text = entry.phonetic;
        (entry.phonetics || []).forEach(p => { if (!text && p.text) text = p.text; });
      });
      if (text) {
        ipaInput.value = text.replace(/^\/|\/$/g, '').replace(/^\[|\]$/g, '').trim();
        found++;
      } else if (!ipaInput.value.trim()) {
        ipaInput.value = ipaOfText(word);
      }
    } catch (e) {
      if (!ipaInput.value.trim()) ipaInput.value = ipaOfText(word);
    }
  }
  showToast('✅ ' + found + ' of ' + rows.length + ' found in the dictionary. The rest keep the automatic spelling-based version — edit any of them by hand.', 'ok');
}

function createPronunciation() {
  const title = document.getElementById('pr-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }

  const mode = 'nocode';
  const code = generateClassCode();

  const words = readPronRows().map(x => ({
    w: x.w,
    ipa: x.ipa || ipaOfText(x.w),
    icon: x.icon || guessPronIcon(x.w)
  }));
  if (words.length < 2) { showToast('Please enter at least 2 words.'); return; }

  const design = document.getElementById('pr-design').value;
  let html = (design === 'game') ? PRONUNCIATION_GAME_TEMPLATE : PRONUNCIATION_FLASH_TEMPLATE;
  const classCode = setActiveClassCode(code);

  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__WORD_COUNT__').join(String(words.length));
  html = html.split('__WORDS_JSON__').join(JSON.stringify(words));
  html = html.split('__PASS_SCORE__').join(document.getElementById('pr-pass').value);
  html = html.split('__SPEECH_LANG__').join(document.getElementById('pr-lang').value);
  html = html.split('__MAX_TRIES__').join(document.getElementById('pr-tries').value);
  html = html.split('__STRICTNESS__').join(document.getElementById('pr-strict').value);
  html = html.split('__LEARN_STAGE__').join(document.getElementById('pr-learn').value);
  html = html.split('__DEFAULT_VOICE__').join(document.getElementById('pr-voice').value);
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());
  html = html.split('__ACCESS_MODE__').join(mode);
  html = html.split('__ACCESS_ID_MODE__').join('unified');
  const __requiredCode_pr = (document.getElementById('pr-code') || {value:''}).value.trim();
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(__requiredCode_pr));
  const __timerMin_pr = parseFloat((document.getElementById('pr-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_pr) || __timerMin_pr <= 0 ? '0' : String(__timerMin_pr));
  html = html.split('__POINTS_AWARD__').join('0');
  const __uid = generateExerciseUid();
  html = html.split('__EXERCISE_UID__').join(__uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_TYPE_LABEL__').join('Pronunciation');

  pushRecentExercise({ title: title, typeLabel: 'Pronunciation', code: classCode, uid: __uid, html: html, requiredCode: __requiredCode_pr, contentSummary: words.map(w => w.w).join('\n') });
  downloadFile(typedFilename('Pronunciation', title, 'pronunciation'), html);
  showToast('"' + title + '" downloaded!' + (mode === 'code' ? ' Class code: ' + classCode : ''), 'ok');
}

onPronDesignChange();

function resetPronunciationForm() {
  document.getElementById('pr-title').value = '';
  const prIns = document.getElementById('pr-instructions'); if (prIns) prIns.value = '';
  document.getElementById('pr-design').value = 'flash';
  document.getElementById('pr-pass').value = '70';
  document.getElementById('pr-lang').value = 'en-US';
  document.getElementById('pr-learn').value = 'on';
  document.getElementById('pr-voice').value = 'female';
  document.getElementById('pr-strict').value = 'normal';
  document.getElementById('pr-tries').value = '3';
  const prCompose = document.getElementById('pr-compose'); if (prCompose) prCompose.value = '';
  onPronDesignChange();
  prRows.innerHTML = '';
  renumberRows(prRows);
  updatePronCount();
}

/* ================= SPELLING + TEST BUILDERS ================= */

/* ---------- plausible misspellings ---------- */
const SP_SUFFIX_SWAPS = [
  ['ately', 'atly'], ['ately', 'etely'], ['ely', 'ley'], ['able', 'ible'], ['ible', 'able'],
  ['ance', 'ence'], ['ence', 'ance'], ['ant', 'ent'], ['ent', 'ant'], ['tion', 'sion'],
  ['sion', 'tion'], ['cial', 'tial'], ['tial', 'cial'], ['ous', 'ious'], ['ious', 'ous'],
  ['ary', 'ery'], ['ery', 'ary'], ['ally', 'aly'], ['ful', 'full'], ['ment', 'mant'],
  ['ness', 'nes'], ['ledge', 'lege'], ['ceed', 'cede'], ['cede', 'ceed'], ['ise', 'ize'],
  ['ize', 'ise'], ['our', 'or'], ['ei', 'ie'], ['ie', 'ei'], ['ph', 'f'], ['gh', 'g']
];

function matchWordCase(source, produced) {
  if (!source) return produced;
  if (source[0] === source[0].toUpperCase() && source[0] !== source[0].toLowerCase()) {
    return produced.charAt(0).toUpperCase() + produced.slice(1);
  }
  return produced;
}

function spellingDistractors(word, count) {
  const original = String(word || '').trim();
  const L = original.toLowerCase();
  if (L.length < 3) return [];

  const famDouble = [], famVowel = [], famSuffix = [], famSwap = [];
  const seen = {};
  const add = (arr, variant) => {
    if (!variant || variant === L || seen[variant]) return;
    if (!/^[a-z' -]+$/.test(variant)) return;
    seen[variant] = 1;
    arr.push(variant);
  };

  // 1) doubled letter -> single, and single consonant -> doubled
  for (let i = 1; i < L.length; i++) {
    if (L[i] === L[i - 1] && 'bcdfglmnprstz'.indexOf(L[i]) !== -1) {
      add(famDouble, L.slice(0, i) + L.slice(i + 1));
    }
  }
  for (let i = 1; i < L.length - 1; i++) {
    const c = L[i];
    if ('bcdflmnprstgz'.indexOf(c) !== -1 && L[i + 1] !== c && L[i - 1] !== c &&
        'aeiou'.indexOf(L[i - 1]) !== -1 && 'aeiou'.indexOf(L[i + 1]) !== -1) {
      add(famDouble, L.slice(0, i) + c + L.slice(i));
    }
  }

  // 2) vowel swaps in the quieter, later syllables
  const swaps = { a: ['e', 'i'], e: ['a', 'i'], i: ['e', 'a'], o: ['u', 'a'], u: ['o', 'a'] };
  for (let i = L.length - 2; i >= 1; i--) {
    const c = L[i];
    if (swaps[c]) {
      swaps[c].forEach(r => add(famVowel, L.slice(0, i) + r + L.slice(i + 1)));
    }
  }

  // 3) endings that learners mix up
  SP_SUFFIX_SWAPS.forEach(pair => {
    const from = pair[0], to = pair[1];
    if (L.length > from.length + 1 && L.slice(-from.length) === from) {
      add(famSuffix, L.slice(0, L.length - from.length) + to);
    }
    const mid = L.indexOf(from, 1);
    if (mid > 0 && mid < L.length - from.length) {
      add(famSuffix, L.slice(0, mid) + to + L.slice(mid + from.length));
    }
  });

  // 4) two letters swapped over
  for (let i = 1; i < L.length - 2; i++) {
    if (L[i] !== L[i + 1]) add(famSwap, L.slice(0, i) + L[i + 1] + L[i] + L.slice(i + 2));
  }

  const want = count || 3;
  const order = [famDouble, famVowel, famSuffix, famVowel, famSwap, famVowel, famSuffix, famDouble, famSwap];
  const picked = [];
  const cursor = [0, 0, 0, 0];
  const famIndex = f => (f === famDouble ? 0 : f === famVowel ? 1 : f === famSuffix ? 2 : 3);
  for (let round = 0; round < order.length && picked.length < want; round++) {
    const fam = order[round];
    const k = famIndex(fam);
    if (cursor[k] < fam.length) {
      picked.push(fam[cursor[k]++]);
    }
  }
  // top up from anything left
  [famVowel, famSuffix, famDouble, famSwap].forEach(fam => {
    fam.forEach(v => { if (picked.length < want && picked.indexOf(v) === -1) picked.push(v); });
  });

  return picked.slice(0, want).map(v => matchWordCase(original, v));
}

/* ---------- grammatically wrong alternatives for a gap ---------- */
const TS_WORD_SETS = [
  ['a', 'an', 'the'],
  ['in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about'],
  ['is', 'are', 'am', 'was', 'were', 'be', 'been', 'being'],
  ['do', 'does', 'did', 'done', 'doing'],
  ['have', 'has', 'had', 'having'],
  ['he', 'him', 'his'], ['she', 'her', 'hers'], ['they', 'them', 'their', 'theirs'],
  ['we', 'us', 'our', 'ours'], ['i', 'me', 'my', 'mine'], ['you', 'your', 'yours'],
  ['it', 'its', "it's"],
  ['much', 'many', 'more', 'most'], ['some', 'any', 'no', 'none'],
  ['this', 'that', 'these', 'those'],
  ['who', 'whom', 'whose', 'which'],
  ['good', 'well', 'better', 'best'], ['bad', 'badly', 'worse', 'worst'],
  ['there', 'their', "they're"], ['too', 'to', 'two'], ['than', 'then'],
  ['can', 'could', 'must', 'should', 'would'],
  ['will', 'would', 'shall'],
  ['a lot of', 'lots of', 'much', 'many'],
  ['always', 'never', 'usually', 'often'],
  ['since', 'for', 'ago', 'during']
];

/* base form -> [past simple (V2), past participle (V3)] */
const IRREGULAR_VERBS = {
  be: ['was', 'been'], begin: ['began', 'begun'], break: ['broke', 'broken'], bring: ['brought', 'brought'],
  build: ['built', 'built'], buy: ['bought', 'bought'], catch: ['caught', 'caught'], choose: ['chose', 'chosen'],
  come: ['came', 'come'], cost: ['cost', 'cost'], cut: ['cut', 'cut'], do: ['did', 'done'],
  draw: ['drew', 'drawn'], drink: ['drank', 'drunk'], drive: ['drove', 'driven'], eat: ['ate', 'eaten'],
  fall: ['fell', 'fallen'], feel: ['felt', 'felt'], find: ['found', 'found'], fly: ['flew', 'flown'],
  forget: ['forgot', 'forgotten'], get: ['got', 'gotten'], give: ['gave', 'given'], go: ['went', 'gone'],
  grow: ['grew', 'grown'], have: ['had', 'had'], hear: ['heard', 'heard'], hold: ['held', 'held'],
  keep: ['kept', 'kept'], know: ['knew', 'known'], leave: ['left', 'left'], lend: ['lent', 'lent'],
  lose: ['lost', 'lost'], make: ['made', 'made'], mean: ['meant', 'meant'], meet: ['met', 'met'],
  pay: ['paid', 'paid'], put: ['put', 'put'], read: ['read', 'read'], ride: ['rode', 'ridden'],
  ring: ['rang', 'rung'], rise: ['rose', 'risen'], run: ['ran', 'run'], say: ['said', 'said'],
  see: ['saw', 'seen'], sell: ['sold', 'sold'], send: ['sent', 'sent'], shine: ['shone', 'shone'],
  show: ['showed', 'shown'], sing: ['sang', 'sung'], sit: ['sat', 'sat'], sleep: ['slept', 'slept'],
  speak: ['spoke', 'spoken'], spend: ['spent', 'spent'], stand: ['stood', 'stood'], steal: ['stole', 'stolen'],
  swim: ['swam', 'swum'], take: ['took', 'taken'], teach: ['taught', 'taught'], tell: ['told', 'told'],
  think: ['thought', 'thought'], throw: ['threw', 'thrown'], understand: ['understood', 'understood'],
  wake: ['woke', 'woken'], wear: ['wore', 'worn'], win: ['won', 'won'], write: ['wrote', 'written']
};

function irregularBaseOf(form) {
  for (const base in IRREGULAR_VERBS) {
    if (base === form) return base;
    if (IRREGULAR_VERBS[base].indexOf(form) !== -1) return base;
  }
  return '';
}

/* the "-es where it should be -s" mistake: work -> workes, listen -> listenes */
function wrongEs(w) {
  if (/(s|x|z|ch|sh|o|y)$/.test(w)) return w + 's';
  return w + 'es';
}

function verbS(w) {
  if (/(s|x|z|ch|sh|o)$/.test(w)) return w + 'es';
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies';
  return w + 's';
}
/* short consonant-vowel-consonant verbs double the last letter: swim -> swimming */
const DOUBLING_EXCEPTIONS = { begin: 'beginn', forget: 'forgett', prefer: 'preferr', admit: 'admitt', permit: 'permitt', occur: 'occurr' };
function doubledStem(w) {
  if (DOUBLING_EXCEPTIONS[w]) return DOUBLING_EXCEPTIONS[w];
  const vowelGroups = (w.match(/[aeiouy]+/g) || []).length;
  if (vowelGroups === 1 && w.length <= 5 && /[^aeiou][aeiou][bcdfglmnprstvz]$/.test(w)) return w + w.slice(-1);
  return w;
}
function verbIng(w) {
  if (/[^aeiou]e$/.test(w)) return w.slice(0, -1) + 'ing';
  if (/ie$/.test(w)) return w.slice(0, -2) + 'ying';
  return doubledStem(w) + 'ing';
}
function verbEd(w) {
  if (/e$/.test(w)) return w + 'd';
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ied';
  return doubledStem(w) + 'ed';
}
function pluralOf(w) {
  if (/(s|x|z|ch|sh)$/.test(w)) return w + 'es';
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies';
  return w + 's';
}

/* AI-generated wrong options for Test: uses Puter.js (the same free,
   keyless service already used for Dictation's auto-transcribe and IELTS
   Writing's grading) to ask for wrong options that are genuinely confusing
   in THIS sentence's context, rather than just other grammatical forms of
   the same word. Falls back to the rule-based testDistractors() below if
   the AI call fails or the response can't be parsed, so a slow or missing
   connection never blocks the teacher from building the exercise. */
async function testDistractorsAI(sentenceWithBlank, word, count) {
  const prompt = 'A teacher is building a multiple-choice fill-in-the-blank English exercise.\n' +
    'Sentence with the blank: "' + sentenceWithBlank + '"\n' +
    'The correct word for the blank is: "' + word + '"\n\n' +
    'Give ' + count + ' wrong answer option(s) that would genuinely confuse an English learner in THIS specific sentence \u2014 ' +
    'words that are similar in meaning, spelling, sound, or grammatical form to the correct word, and would plausibly seem right at a glance, ' +
    'but are actually incorrect once you read the sentence carefully. Do not repeat the correct word.\n\n' +
    'Respond with ONLY valid JSON, no other text, no markdown fences: {"options": ["wrong1", "wrong2", ...]}';

  await loadPuterScript();
  const res = await window.puter.ai.chat(prompt);
  let text = '';
  if (typeof res === 'string') text = res;
  else if (res && res.message && typeof res.message.content === 'string') text = res.message.content;
  else if (res && res.message && Array.isArray(res.message.content)) text = res.message.content.map(c => (c && c.text) ? c.text : '').join('');
  else if (res && typeof res.text === 'string') text = res.text;

  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON in AI response.');
  const parsed = JSON.parse(cleaned.slice(start, end + 1));
  if (!Array.isArray(parsed.options)) throw new Error('Malformed AI response.');
  return parsed.options.map(o => matchWordCase(word, String(o).trim())).filter(Boolean).slice(0, count);
}

function testDistractors(word, count) {
  const original = String(word || '').trim();
  const w = original.toLowerCase();
  if (!w) return [];
  const out = [];
  const push = (x) => {
    if (!x) return;
    const v = String(x).trim();
    if (!v || v.toLowerCase() === w) return;
    if (out.some(o => o.toLowerCase() === v.toLowerCase())) return;
    out.push(matchWordCase(original, v));
  };

  // words that belong to a family the learner confuses
  TS_WORD_SETS.forEach(set => {
    if (set.indexOf(w) !== -1) set.forEach(x => { if (x !== w) push(x); });
  });

  // if the word belongs to a family above, those wrong answers are the best ones
  const inSet = TS_WORD_SETS.some(set => set.indexOf(w) !== -1);
  if (!inSet && /^[a-z]+$/.test(w)) {
    if (/(ful|ous|ive|able|ible|ical|less|ish|ing)$/.test(w)) {
      // adjective-ish: wrong comparatives and a stray adverb
      push(w + 'er');
      push(w + 'ly');
      push('more ' + w + 'er');
      push('most ' + w);
    } else if (/(tion|sion|ment|ness|ity|ance|ence|ledge)$/.test(w)) {
      // uncountable-ish noun: a wrong plural and a wrong article
      push(pluralOf(w));
      push('a ' + w);
      push('many ' + w);
    } else {
      // verb or simple noun: only other FORMS of the same word
      const base = irregularBaseOf(w);
      if (base) {
        const forms = IRREGULAR_VERBS[base];
        push(verbIng(base));          // going
        push(forms[0]);               // went   (V2)
        push(forms[1]);               // gone   (V3)
        push(verbS(base));            // goes
        push(base);                   // go
        push(verbEd(base));           // goed  — the classic learner mistake
      } else {
        push(verbIng(w));             // working
        push(verbEd(w));              // worked
        push(verbS(w));               // works
        push(wrongEs(w));             // workes
        if (/e$/.test(w)) push(w + 'ing');
      }
    }
  }

  return out.slice(0, count || 2);
}

/* ================= SPELLING PANEL ================= */
const spRows = document.getElementById('sp-rows');

function makeSpellingRow(container) {
  const row = document.createElement('div');
  row.className = 'row-item sp-row';

  const idx = document.createElement('div');
  idx.className = 'idx';

  const wordInput = document.createElement('input');
  wordInput.type = 'text';
  wordInput.className = 'sp-word';
  wordInput.placeholder = 'e.g. approximately';

  const wrongWrap = document.createElement('div');
  wrongWrap.className = 'sp-wrongs';
  const wrongInputs = [];
  for (let i = 0; i < 3; i++) {
    const w = document.createElement('input');
    w.type = 'text';
    w.className = 'sp-wrong';
    w.placeholder = 'wrong spelling ' + (i + 1);
    wrongWrap.appendChild(w);
    wrongInputs.push(w);
  }

  const fill = () => {
    const word = wordInput.value.trim();
    if (!word) { wrongInputs.forEach(w => { w.value = ''; }); return; }
    const list = spellingDistractors(word, 3);
    wrongInputs.forEach((w, i) => { w.value = list[i] || ''; });
  };
  wordInput.addEventListener('input', fill);

  const again = document.createElement('button');
  again.className = 'remove-btn';
  again.type = 'button';
  again.title = 'Make different wrong spellings';
  again.innerHTML = '🎲';
  again.onclick = () => {
    const word = wordInput.value.trim();
    if (!word) return;
    const list = spellingDistractors(word, 9);
    const shuffled = list.sort(() => Math.random() - 0.5);
    wrongInputs.forEach((w, i) => { w.value = shuffled[i] || w.value; });
  };

  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.type = 'button';
  removeBtn.innerHTML = '&times;';
  removeBtn.onclick = () => { row.remove(); renumberRows(container); updateSpCount(); };

  row.appendChild(idx);
  row.appendChild(wordInput);
  row.appendChild(wrongWrap);
  row.appendChild(again);
  row.appendChild(removeBtn);
  container.appendChild(row);
  renumberRows(container);
  updateSpCount();
  return wordInput;
}

function addSpellingRow() { makeSpellingRow(spRows); }
function addSpellingRowFilled(word) {
  const input = makeSpellingRow(spRows);
  input.value = word;
  input.dispatchEvent(new Event('input'));
}
function updateSpCount() {
  const el = document.getElementById('sp-count');
  if (el) el.innerText = spRows.querySelectorAll('.sp-row').length;
}

function createSpelling() {
  const title = document.getElementById('sp-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }
  const mode = 'nocode';
  const code = generateClassCode();

  const items = [];
  let incomplete = 0;
  Array.from(spRows.querySelectorAll('.sp-row')).forEach(row => {
    const word = row.querySelector('.sp-word').value.trim();
    if (!word) return;
    const wrongs = Array.from(row.querySelectorAll('.sp-wrong'))
      .map(i => i.value.trim())
      .filter(v => v && v.toLowerCase() !== word.toLowerCase());
    const unique = [];
    wrongs.forEach(w => { if (!unique.some(u => u.toLowerCase() === w.toLowerCase())) unique.push(w); });
    if (unique.length < 3) { incomplete++; return; }
    const options = unique.slice(0, 3).concat([word]);
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = options[i]; options[i] = options[j]; options[j] = t;
    }
    items.push({
      word: word,
      icon: guessPronIcon(word),
      options: options,
      answer: options.indexOf(word)
    });
  });

  if (items.length < 2) { showToast('Please add at least 2 words with three wrong spellings each.'); return; }
  if (incomplete) showToast(incomplete + ' word(s) were skipped — they need three different wrong spellings.');

  const classCode = setActiveClassCode(code);
  const points = readPointsAward('sp');
  let html = QUIZ_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__TYPE_LABEL__').join('Spelling');
  html = html.split('__QUIZ_MODE__').join('spelling');
  html = html.split('__ITEM_COUNT__').join(String(items.length));
  html = html.split('__ITEMS_JSON__').join(JSON.stringify(items));
  html = html.split('__SPEECH_LANG__').join(document.getElementById('sp-lang').value);
  html = html.split('__DEFAULT_VOICE__').join(document.getElementById('sp-voice').value);
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());
  html = html.split('__ACCESS_MODE__').join(mode);
  html = html.split('__ACCESS_ID_MODE__').join('unified');
  const __requiredCode_sp = (document.getElementById('sp-code') || {value:''}).value.trim();
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(__requiredCode_sp));
  html = html.split('__POINTS_AWARD__').join(String(points));
  const __uid = generateExerciseUid();
  html = html.split('__EXERCISE_UID__').join(__uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_TYPE_LABEL__').join('Spelling');
  html = html.split('__HAS_MATCHING_ROUND__').join('false');
  const __timerMin_sp = parseFloat((document.getElementById('sp-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_sp) || __timerMin_sp <= 0 ? '0' : String(__timerMin_sp));

  pushRecentExercise({ title: title, typeLabel: 'Spelling', code: classCode, uid: __uid, html: html, requiredCode: __requiredCode_sp, contentSummary: items.map(it => it.word).join('\n') });
  downloadFile(typedFilename('Spelling', title, 'spelling'), html);
  showToast('"' + title + '" downloaded!' + (mode === 'code' ? ' Class code: ' + classCode : ''), 'ok');
}

/* ================= CAN KNOCKDOWN =================
   Built on the quiz template (mode "canknock"): each item is an English word
   (what the student types; "a / b" accepts either) and its translation (shown
   on the paper). The game itself is in QUIZ_TEMPLATE. */
function createCanKnockdown() {
  const title = document.getElementById('ck-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }
  const pairs = [];
  let missing = 0;
  Array.from(ckRows.querySelectorAll('.row-item')).forEach(row => {
    const inp = row.querySelectorAll('input');
    const word = inp[0].value.trim(), tr = inp[1].value.trim();
    if (!word && !tr) return;
    if (!word || !tr) { missing++; return; }
    if (!pairs.some(p => p.word.toLowerCase() === word.toLowerCase())) pairs.push({ word: word, tr: tr });
  });
  if (pairs.length < 2) { showToast('Please add at least 2 words, each with its translation.'); return; }
  if (missing) showToast(missing + ' word(s) were skipped — they need both the word and its translation.');
  // the student sees the translation and types the English word (a word may list several, split by /)
  const items = pairs.map(p => ({ word: p.word, prompt: p.tr, options: [p.tr], answer: 0 }));

  const mode = 'nocode';
  const classCode = setActiveClassCode(generateClassCode());
  const points = readPointsAward('ck');
  let html = QUIZ_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__TYPE_LABEL__').join('Can Knockdown');
  html = html.split('__QUIZ_MODE__').join('canknock');
  html = html.split('__ITEM_COUNT__').join(String(items.length));
  html = html.split('__ITEMS_JSON__').join(JSON.stringify(items).replace(/<\//g, '<\\/'));
  html = html.split('__SPEECH_LANG__').join(document.getElementById('ck-lang').value);
  html = html.split('__DEFAULT_VOICE__').join(document.getElementById('ck-voice').value);
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());
  html = html.split('__ACCESS_MODE__').join(mode);
  html = html.split('__ACCESS_ID_MODE__').join('unified');
  const requiredCode = (document.getElementById('ck-code') || { value: '' }).value.trim();
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(requiredCode));
  html = html.split('__POINTS_AWARD__').join(String(points));
  const uid = generateExerciseUid();
  html = html.split('__EXERCISE_UID__').join(uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_TYPE_LABEL__').join('Can Knockdown');
  html = html.split('__HAS_MATCHING_ROUND__').join('false');
  const timerMin = parseFloat((document.getElementById('ck-timer') || { value: '' }).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(timerMin) || timerMin <= 0 ? '0' : String(timerMin));

  html = html.replace('</head>', () => '<style>\n' + CANKNOCK_IMAGES_CSS + '\n</style>\n</head>');   // the cans and the ball
  pushRecentExercise({ title: title, typeLabel: 'Can Knockdown', code: classCode, uid: uid, html: html, requiredCode: requiredCode,
    contentSummary: pairs.map(p => p.word + ' - ' + p.tr).join('\n') });
  downloadFile(typedFilename('Can Knockdown', title, 'canknock'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}

/* ================= CAR GAME =================
   The student drives down a city road; a word floats above it with three
   meanings, and the right one steers the car past the warning signs.
   (Until 2026-10-04 this was Flashcard's "Car game" design.) */
function createCarGame() {
  const title = document.getElementById('cg-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }
  const mode = 'nocode';
  const code = generateClassCode();
  const pairs = Array.from(cgRows.querySelectorAll('.row-item')).map(row => {
    const inputs = row.querySelectorAll('input');
    return { en: inputs[0].value.trim(), uz: inputs[1].value.trim() };
  }).filter(p => p.en && p.uz);
  if (pairs.length < 4) { showToast('The car game needs at least 4 words, so every question has three different options.'); return; }

  const words = pairs.map(p => ({ w: p.en, t: p.uz }));
  const classCode = setActiveClassCode(code);
  const points = readPointsAward('cg');

  let html = CAR_GAME_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__WORD_COUNT__').join(String(words.length));
  html = html.split('__WORDS_JSON__').join(JSON.stringify(words));
  html = html.split('__ANSWER_SECONDS__').join(document.getElementById('cg-seconds').value);
  html = html.split('__SPEED_MODE__').join(document.getElementById('cg-speed').value);
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());
  html = html.split('__ACCESS_MODE__').join(mode);
  html = html.split('__ACCESS_ID_MODE__').join('unified');
  const __requiredCode_cg = (document.getElementById('cg-code') || {value:''}).value.trim();
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(__requiredCode_cg));
  const __timerMin_cg = parseFloat((document.getElementById('cg-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_cg) || __timerMin_cg <= 0 ? '0' : String(__timerMin_cg));
  html = html.split('__POINTS_AWARD__').join(String(points));
  const __uid = generateExerciseUid();
  html = html.split('__EXERCISE_UID__').join(__uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_TYPE_LABEL__').join('Car Game');

  html = html.replace('</head>', () => '<style>\n' + CARGAME_IMAGES_CSS + '\n</style>\n</head>');   // the buildings and the warning sign
  pushRecentExercise({ title: title, typeLabel: 'Car Game', code: classCode, uid: __uid, html: html, requiredCode: __requiredCode_cg, contentSummary: pairs.map(p => p.en + ' - ' + p.uz).join('\n') });
  downloadFile(typedFilename('Car Game', title, 'car-game'), html);
  showToast('"' + title + '" downloaded!' + (mode === 'code' ? ' Class code: ' + classCode : ''), 'ok');
}

/* ================= TEST PANEL ================= */
const tsRows = document.getElementById('ts-rows');

function makeTestRow(container) {
  const row = document.createElement('div');
  row.className = 'test-row';
  row.dataset.gap = '-1';

  const head = document.createElement('div');
  head.className = 'test-row-head';
  const idx = document.createElement('div');
  idx.className = 'idx';
  const label = document.createElement('span');
  label.className = 'test-row-label';
  label.innerText = 'Sentence';
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.type = 'button';
  removeBtn.innerHTML = '&times;';
  removeBtn.onclick = () => { row.remove(); renumberRows(container); updateTsCount(); };
  head.appendChild(idx); head.appendChild(label); head.appendChild(removeBtn);

  const sentence = document.createElement('input');
  sentence.type = 'text';
  sentence.className = 'ts-sentence';
  sentence.placeholder = 'e.g. I listen to music every day';

  const chips = document.createElement('div');
  chips.className = 'word-chips';

  const wrongWrap = document.createElement('div');
  wrongWrap.className = 'ts-wrongs';

  const buildWrongInputs = () => {
    const want = parseInt(document.getElementById('ts-options').value, 10) - 1;
    const current = Array.from(wrongWrap.querySelectorAll('.ts-wrong')).map(i => i.value);
    wrongWrap.innerHTML = '';
    for (let i = 0; i < want; i++) {
      const w = document.createElement('input');
      w.type = 'text';
      w.className = 'ts-wrong';
      w.placeholder = 'wrong option ' + (i + 1);
      w.value = current[i] || '';
      wrongWrap.appendChild(w);
    }
  };

  const fillWrongs = async (answer, fullSentence) => {
    const want = parseInt(document.getElementById('ts-options').value, 10) - 1;
    const inputs = Array.from(wrongWrap.querySelectorAll('.ts-wrong'));
    inputs.forEach(w => { w.value = ''; w.placeholder = '🤖 thinking of a confusing option...'; w.disabled = true; });
    let list;
    try {
      list = await testDistractorsAI(fullSentence, answer, want);
      if (!list.length) throw new Error('empty');
    } catch (e) {
      list = testDistractors(answer, want);
    }
    inputs.forEach((w, i) => { w.value = list[i] || ''; w.placeholder = 'wrong option ' + (i + 1); w.disabled = false; });
  };

  const renderChips = () => {
    const words = sentence.value.trim().split(/\s+/).filter(Boolean);
    chips.innerHTML = '';
    if (!words.length) { chips.innerHTML = '<span class="chip-hint">Type the sentence, then click the word to hide.</span>'; return; }
    words.forEach((word, i) => {
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'chip' + (String(i) === row.dataset.gap ? ' picked' : '');
      c.innerText = word;
      c.onclick = () => {
        row.dataset.gap = String(i);
        renderChips();
        fillWrongs(word.replace(/^[^\w']+|[^\w']+$/g, ''), sentence.value.trim());
      };
      chips.appendChild(c);
    });
  };

  sentence.addEventListener('input', () => { row.dataset.gap = '-1'; renderChips(); });

  row.appendChild(head);
  row.appendChild(sentence);
  row.appendChild(chips);
  row.appendChild(wrongWrap);
  container.appendChild(row);
  buildWrongInputs();
  renderChips();
  renumberRows(container);
  updateTsCount();
  return sentence;
}

function addTestRow() { makeTestRow(tsRows); }
function addTestRowFilled(sentenceText) {
  const input = makeTestRow(tsRows);
  input.value = sentenceText;
  input.dispatchEvent(new Event('input'));
}
function updateTsCount() {
  const el = document.getElementById('ts-count');
  if (el) el.innerText = tsRows.querySelectorAll('.test-row').length;
}
function onTestOptionCountChange() {
  const want = parseInt(document.getElementById('ts-options').value, 10) - 1;
  Array.from(tsRows.querySelectorAll('.test-row')).forEach(row => {
    const wrap = row.querySelector('.ts-wrongs');
    const current = Array.from(wrap.querySelectorAll('.ts-wrong')).map(i => i.value);
    wrap.innerHTML = '';
    for (let i = 0; i < want; i++) {
      const w = document.createElement('input');
      w.type = 'text';
      w.className = 'ts-wrong';
      w.placeholder = 'wrong option ' + (i + 1);
      w.value = current[i] || '';
      wrap.appendChild(w);
    }
  });
}

function createTest() {
  const title = document.getElementById('ts-title').value.trim();
  if (!title) { showToast('Please enter a title for the test.'); return; }
  const mode = 'nocode';
  const code = generateClassCode();

  const items = [];
  let noGap = 0, thin = 0;
  Array.from(tsRows.querySelectorAll('.test-row')).forEach(row => {
    const raw = row.querySelector('.ts-sentence').value.trim();
    if (!raw) return;
    const gap = parseInt(row.dataset.gap, 10);
    const words = raw.split(/\s+/);
    if (isNaN(gap) || gap < 0 || gap >= words.length) { noGap++; return; }

    const chosen = words[gap];
    const lead = (chosen.match(/^[^\w']+/) || [''])[0];
    const tail = (chosen.match(/[^\w']+$/) || [''])[0];
    const answer = chosen.slice(lead.length, chosen.length - tail.length);

    const wrongs = Array.from(row.querySelectorAll('.ts-wrong'))
      .map(i => i.value.trim())
      .filter(v => v && v.toLowerCase() !== answer.toLowerCase());
    const unique = [];
    wrongs.forEach(w => { if (!unique.some(u => u.toLowerCase() === w.toLowerCase())) unique.push(w); });
    if (unique.length < 1) { thin++; return; }

    const blanked = words.slice();
    blanked[gap] = lead + '_____' + tail;

    const options = unique.concat([answer]);
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = options[i]; options[i] = options[j]; options[j] = t;
    }

    items.push({
      prompt: blanked.join(' '),
      full: raw,
      word: answer,
      options: options,
      answer: options.indexOf(answer)
    });
  });

  if (items.length < 2) { showToast('Please add at least 2 finished sentences (click the word to hide, and fill the wrong options).'); return; }
  if (noGap) showToast(noGap + ' sentence(s) skipped — click the word that should be hidden.');
  else if (thin) showToast(thin + ' sentence(s) skipped — they need at least one wrong option.');

  const hasMatchingRound = document.getElementById('ts-matching-round').checked;
  if (hasMatchingRound && items.length < 3) { showToast('Round 2: Matching needs at least 3 sentences. Add more, or turn the matching round off.'); return; }

  const classCode = setActiveClassCode(code);
  const points = readPointsAward('ts');
  let html = QUIZ_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__TYPE_LABEL__').join('Test');
  html = html.split('__QUIZ_MODE__').join('gap');
  html = html.split('__ITEM_COUNT__').join(String(items.length));
  html = html.split('__ITEMS_JSON__').join(JSON.stringify(items));
  html = html.split('__HAS_MATCHING_ROUND__').join(hasMatchingRound ? 'true' : 'false');
  const __timerMin_ts = parseFloat((document.getElementById('ts-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_ts) || __timerMin_ts <= 0 ? '0' : String(__timerMin_ts));
  html = html.split('__SPEECH_LANG__').join('en-US');
  html = html.split('__DEFAULT_VOICE__').join('female');
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());
  html = html.split('__ACCESS_MODE__').join(mode);
  html = html.split('__ACCESS_ID_MODE__').join('unified');
  const __requiredCode_ts = (document.getElementById('ts-code') || {value:''}).value.trim();
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(__requiredCode_ts));
  html = html.split('__POINTS_AWARD__').join(String(points));
  const __uid = generateExerciseUid();
  html = html.split('__EXERCISE_UID__').join(__uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_TYPE_LABEL__').join('Test');

  pushRecentExercise({ title: title, typeLabel: 'Test', code: classCode, uid: __uid, html: html, requiredCode: __requiredCode_ts, contentSummary: items.map(it => it.full).join('\n') });
  downloadFile(typedFilename('Test', title, 'test'), html);
  showToast('"' + title + '" downloaded!' + (mode === 'code' ? ' Class code: ' + classCode : ''), 'ok');
}

/* ================= SENTENCES ================= */
const snRows = document.getElementById('sn-rows');
function addSnWordFilled(text) {
  const input = makeSingleRow(snRows, 'e.g. water');
  input.value = text;
}

// The picture students write about: kept (resized) in a hidden field, so drafts,
// "Use again" and Homework/Class sets keep it like the rest of the form.
function setSnPicture(src) {
  const field = document.getElementById('sn-picture');
  if (field) field.value = src || '';
  renderSnPicture();
}
function renderSnPicture() {
  const src = (document.getElementById('sn-picture') || {}).value || '';
  const img = document.getElementById('sn-picture-preview');
  if (img) { img.src = src; img.style.display = src ? '' : 'none'; }
  const pick = document.getElementById('sn-picture-pick');
  if (pick) pick.textContent = src ? '🖼️ Change picture' : '🖼️ Add a picture';
  const rm = document.getElementById('sn-picture-remove');
  if (rm) rm.style.display = src ? '' : 'none';
}
document.getElementById('sn-picture-input').addEventListener('change', function (e) {
  const file = e.target.files && e.target.files[0];
  e.target.value = '';
  if (file) taShrinkImage(file, setSnPicture);
});
document.getElementById('sn-picture').addEventListener('change', renderSnPicture);

function resetSentencesForm() {
  document.getElementById('sn-title').value = '';
  setSnPicture('');
  const snIns = document.getElementById('sn-instructions'); if (snIns) snIns.value = '';
  const snPts = document.getElementById('sn-points'); if (snPts) snPts.value = '10';
  const snCount = document.getElementById('sn-count'); if (snCount) snCount.value = '5';
  const snCompose = document.getElementById('sn-compose'); if (snCompose) snCompose.value = '';
  snRows.innerHTML = '';
  renumberRows(snRows);
}

function createSentences() {
  const title = document.getElementById('sn-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }
  const mode = 'nocode';
  const code = generateClassCode();

  const words = Array.from(snRows.querySelectorAll('input'))
    .map(i => i.value.trim())
    .filter(Boolean);

  const instructions = (document.getElementById('sn-instructions').value || '').trim();
  const count = Math.max(1, Math.min(30, parseInt(document.getElementById('sn-count').value, 10) || 5));

  const picture = (document.getElementById('sn-picture') || {}).value || '';
  if (words.length === 0 && !instructions && !picture) {
    showToast('Add some words, a picture, or write instructions for a free-writing exercise.');
    return;
  }

  const welcomeSub = words.length > 0
    ? ('Write ' + words.length + ' sentence' + (words.length > 1 ? 's' : '') + ', one for each word below.')
    : ('Write ' + count + ' sentence' + (count > 1 ? 's' : '') + ' using your own ideas.');

  const classCode = setActiveClassCode(code);
  const points = readPointsAward('sn');
  let html = SENTENCES_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__WORDS_JSON__').join(JSON.stringify(words));
  html = html.split('__SENTENCE_COUNT__').join(String(count));
  html = html.split('__TOP_INSTRUCTION__').join(escapeForJsString(instructions)); // it's a "…" string in the script: line breaks and quotes must be escaped
  html = html.split('__WELCOME_SUB__').join(escapeForHtml(welcomeSub));
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());
  html = html.split('__ACCESS_MODE__').join(mode);
  html = html.split('__ACCESS_ID_MODE__').join('unified');
  const __requiredCode_sn = (document.getElementById('sn-code') || {value:''}).value.trim();
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(__requiredCode_sn));
  const __timerMin_sn = parseFloat((document.getElementById('sn-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_sn) || __timerMin_sn <= 0 ? '0' : String(__timerMin_sn));
  html = html.split('__POINTS_AWARD__').join(String(points));
  const __sn_uid = generateExerciseUid();
  html = html.split('__EXERCISE_UID__').join(__sn_uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_TYPE_LABEL__').join('Sentences');
  html = html.split('__PICTURE_SRC__').join(/^data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]+$/.test(picture) ? picture : '');

  pushRecentExercise({ title: title, typeLabel: 'Sentences', code: classCode, uid: __sn_uid, html: html, requiredCode: __requiredCode_sn, contentSummary: (words.length ? words.join('\n') : instructions) });
  downloadFile(typedFilename('Sentences', title, 'sentences'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}


/* ================= BILINGUAL READER ================= */
let brParagraphs = []; // [{ letter, sentences: [{ en, tr }] }]

function parseBilingualText() {
  const raw = document.getElementById('br-text').value;
  if (!raw.trim()) { showToast('Paste some English text first.'); return; }
  const paras = raw.split(/\n\s*\n/).map(p => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  if (!paras.length) { showToast('Could not find any paragraphs — check your text.'); return; }

  brParagraphs = paras.map((p, i) => {
    const sentences = p.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [p];
    return {
      letter: String.fromCharCode(65 + i),
      sentences: sentences.map(s => s.trim()).filter(Boolean).map(s => ({ en: s, tr: '' }))
    };
  });
  renderBilingualRows();
  showToast('Split into ' + brParagraphs.reduce((n, p) => n + p.sentences.length, 0) + ' sentences across ' + brParagraphs.length + ' paragraph(s).', 'ok');
}

function renderBilingualRows() {
  const wrap = document.getElementById('br-sentence-rows');
  wrap.innerHTML = '';
  let total = 0;
  brParagraphs.forEach((p, pi) => {
    const letterEl = document.createElement('div');
    letterEl.style.cssText = 'font-weight:800; color:var(--brand); margin-top:6px;';
    letterEl.textContent = 'Paragraph ' + p.letter;
    wrap.appendChild(letterEl);
    p.sentences.forEach((s, si) => {
      total++;
      const row = document.createElement('div');
      row.style.cssText = 'border:1.5px solid var(--border); border-radius:10px; padding:10px 12px; background:rgba(244,241,234,0.02);';
      row.innerHTML =
        '<div style="font-weight:700; font-size:0.9rem; margin-bottom:6px;">' + escapeForHtml(s.en) + '</div>' +
        '<input type="text" data-p="' + pi + '" data-s="' + si + '" class="br-tr-input" placeholder="Translation..." value="' + escapeForHtml(s.tr) + '" style="width:100%; padding:8px 10px; border-radius:8px; border:1.5px solid var(--border); background:rgba(244,241,234,0.04); color:var(--ink);">';
      wrap.appendChild(row);
    });
  });
  document.getElementById('br-sentence-count').innerText = total;
  wrap.querySelectorAll('.br-tr-input').forEach(inp => {
    inp.addEventListener('input', () => {
      brParagraphs[+inp.dataset.p].sentences[+inp.dataset.s].tr = inp.value;
    });
  });
}

/* Same best-effort free translation endpoint used in the student-facing
   exercise — see the note in the builder UI about this not being guaranteed. */
async function mtTranslateBuilder(text, targetLangCode) {
  try {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + targetLangCode + '&dt=t&q=' + encodeURIComponent(text);
    const res = await fetch(url);
    if (!res.ok) throw new Error('bad status');
    const data = await res.json();
    return data[0].map(seg => seg[0]).join('');
  } catch (e) {
    return null;
  }
}

async function autoTranslateBilingual() {
  if (!brParagraphs.length) { showToast('Split the text into sentences first.'); return; }
  const lang = document.getElementById('br-lang').value;
  showToast('Translating…', 'ok');
  let ok = 0, fail = 0;
  for (const p of brParagraphs) {
    for (const s of p.sentences) {
      const result = await mtTranslateBuilder(s.en, lang);
      if (result) { s.tr = result; ok++; } else { fail++; }
    }
  }
  renderBilingualRows();
  if (fail === 0) {
    showToast('✅ Translated all ' + ok + ' sentences. Review and edit any that need fixing.', 'ok');
  } else {
    showToast('⚠️ Translated ' + ok + ', but ' + fail + ' failed (service unavailable) — please fill those in by hand.');
  }
}

function resetBilingualForm() {
  document.getElementById('br-title').value = '';
  document.getElementById('br-lang').value = 'uz';
  document.getElementById('br-text').value = '';
  brParagraphs = [];
  renderBilingualRows();
}

function createBilingualReader() {
  const title = document.getElementById('br-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }
  if (!brParagraphs.length) { showToast('Split your text into sentences first.'); return; }
  const missing = brParagraphs.some(p => p.sentences.some(s => !s.tr.trim()));
  if (missing) { showToast('Some sentences still have no translation — fill them in, or use Auto-translate.'); return; }

  const langSelect = document.getElementById('br-lang');
  const langCode = langSelect.value;
  const langName = langSelect.options[langSelect.selectedIndex].textContent.replace(/^\w+(-\w+)? — /, '');

  const mode = 'nocode';
  const code = generateClassCode();
  const classCode = setActiveClassCode(code);
  const points = readPointsAward('br');

  let html = BILINGUAL_READER_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__PARAGRAPHS_JSON__').join(JSON.stringify(brParagraphs));
  html = html.split('__TARGET_LANG_NAME__').join(escapeForHtml(langName));
  html = html.split('__TARGET_LANG_CODE__').join(langCode);
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());
  html = html.split('__ACCESS_MODE__').join(mode);
  html = html.split('__ACCESS_ID_MODE__').join('unified');
  const __requiredCode_br = (document.getElementById('br-code') || {value:''}).value.trim();
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(__requiredCode_br));
  const __timerMin_br = parseFloat((document.getElementById('br-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_br) || __timerMin_br <= 0 ? '0' : String(__timerMin_br));
  html = html.split('__POINTS_AWARD__').join(String(points));
  const __br_uid = generateExerciseUid();
  html = html.split('__EXERCISE_UID__').join(__br_uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_TYPE_LABEL__').join('BilingualReader');

  pushRecentExercise({ title: title, typeLabel: 'Bidirectional Language', code: classCode, uid: __br_uid, html: html, requiredCode: __requiredCode_br, contentSummary: brParagraphs.flatMap(p => p.sentences.map(s => s.en)).join('\n') });
  downloadFile(typedFilename('BilingualReader', title, 'reader'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}

function resetEnglishContentForm() {
  document.getElementById('ec-title').value = '';
  document.getElementById('ec-youtube').value = '';
  clearMediaFile('ec');
  document.getElementById('ec-code').value = '';
}

/* ================= MEDIA FILES PACKED INTO AN EXERCISE =================
   Instead of pasting a link, the teacher can choose an audio/video file from
   their computer. It's stored inside the downloaded exercise file itself (as
   base64 text), and a small script at the top of that file turns it back into
   a playable file when a student opens it — no hosting or link needed. */
const TA_MEDIA_FILES = {}; // 'ec' / 'dc' -> File
const TA_MEDIA_B64 = {};   // 'ec' / 'dc' -> the file as base64, read as soon as it's chosen
const TA_MEDIA_PACKED = {}; // 'dc' -> { mime, bytes } when the audio was made smaller before packing
const TA_MEDIA_WARN_MB = 40, TA_MEDIA_MAX_MB = 300;
function taFormatMb(bytes) { return (bytes / 1048576).toFixed(bytes < 10485760 ? 1 : 0) + ' MB'; }
function onMediaFileChosen(prefix, input) {
  const file = input.files && input.files[0];
  input.value = '';
  if (!file) return;
  if (!/^(audio|video)\//.test(file.type) && !/\.(mp3|m4a|wav|ogg|oga|aac|flac|mp4|m4v|mov|webm|mkv)$/i.test(file.name)) {
    showToast('That doesn\'t look like an audio or video file.'); return;
  }
  if (file.size > TA_MEDIA_MAX_MB * 1048576) {
    showToast('That file is ' + taFormatMb(file.size) + ' — too big to pack into an exercise (the limit is ' + TA_MEDIA_MAX_MB + ' MB). Try a shorter clip.'); return;
  }
  TA_MEDIA_FILES[prefix] = file;
  delete TA_MEDIA_B64[prefix];
  delete TA_MEDIA_PACKED[prefix];
  // read it now, so creating the exercise (and adding it to a Homework/Class set) is instant;
  // a Dictation's audio is made smaller first (speech quality — see taShrinkSpeechAudio)
  const isAudio = /^audio\//.test(file.type) || /\.(mp3|m4a|wav|ogg|oga|aac|flac)$/i.test(file.name);
  const ready = (prefix === 'dc' && isAudio)
    ? taShrinkSpeechAudio(file).then(blob => {
        if (!blob || blob.size > file.size * 0.9) return taReadFileBase64(file); // not worth it: keep the original
        TA_MEDIA_PACKED[prefix] = { mime: 'audio/mpeg', bytes: blob.size };
        return taReadFileBase64(blob);
      }, () => taReadFileBase64(file))
    : taReadFileBase64(file);
  ready.then(b64 => { if (TA_MEDIA_FILES[prefix] === file) { TA_MEDIA_B64[prefix] = b64; renderMediaFileName(prefix); } })
    .catch(() => { if (TA_MEDIA_FILES[prefix] === file) { clearMediaFile(prefix); showToast('Could not read that file. Try choosing it again.'); } });
  const linkInput = document.getElementById(prefix === 'ec' ? 'ec-youtube' : 'dc-audio');
  if (linkInput) { linkInput.value = ''; linkInput.disabled = true; linkInput.placeholder = 'Using the file you chose'; }
  renderMediaFileName(prefix);
}
function clearMediaFile(prefix) {
  delete TA_MEDIA_FILES[prefix];
  delete TA_MEDIA_B64[prefix];
  delete TA_MEDIA_PACKED[prefix];
  const linkInput = document.getElementById(prefix === 'ec' ? 'ec-youtube' : 'dc-audio');
  if (linkInput) { linkInput.disabled = false; linkInput.placeholder = prefix === 'ec' ? 'YouTube, Vimeo, Google Drive, or a direct video link...' : 'A YouTube link, or a link to an audio file (…mp3)'; }
  renderMediaFileName(prefix);
}
function renderMediaFileName(prefix) {
  const el = document.getElementById(prefix + '-media-name');
  if (!el) return;
  const file = TA_MEDIA_FILES[prefix];
  const packed = TA_MEDIA_PACKED[prefix];
  el.innerHTML = file
    ? (TA_MEDIA_B64[prefix] ? '✅ ' : '⏳ ') + escapeForHtml(file.name) + ' <span class="media-pick-size">' + taFormatMb(file.size) +
      (!TA_MEDIA_B64[prefix] ? ' · ' + (prefix === 'dc' ? 'making it smaller…' : 'preparing…') : packed ? ' → ' + taFormatMb(packed.bytes) + ' (made smaller for speech)' : '') + '</span> <button type="button" class="media-pick-remove" onclick="clearMediaFile(\'' + prefix + '\')" title="Remove this file">✕</button>' +
      ((packed ? packed.bytes : file.size) > TA_MEDIA_WARN_MB * 1048576 ? '<div class="media-pick-warn">Big file: the exercise will be about ' + taFormatMb(file.size * 1.34) + ' and slower to send and open. A shorter or smaller clip works better.</div>' : '')
    : '';
}
window.onMediaFileChosen = onMediaFileChosen;
window.clearMediaFile = clearMediaFile;
function taReadFileBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).slice(String(r.result).indexOf(',') + 1));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
/* Dictation audio is made smaller before it's packed into the exercise: one
   channel, 22 kHz, MP3 at 48 kbps — clear for speech, and usually 3–6 times
   smaller, which matters because every student downloads the whole exercise
   (and links count against the database's monthly downloads, see CLAUDE.md).
   MP3 plays everywhere, iPhones included. The encoder (js/vendor/lame.min.js,
   lamejs, LGPL) is only loaded when it's needed. */
function taLoadLame() {
  if (window.lamejs) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'js/vendor/lame.min.js';
    s.onload = () => window.lamejs ? resolve() : reject(new Error('lamejs'));
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
async function taShrinkSpeechAudio(file) {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC || !window.OfflineAudioContext) return null;
  const buf = await file.arrayBuffer();
  const ctx = new AC();
  let decoded;
  try { decoded = await new Promise((res, rej) => ctx.decodeAudioData(buf, res, rej)); }
  finally { try { ctx.close(); } catch (e) { /* ignore */ } }
  const RATE = 22050;
  const off = new OfflineAudioContext(1, Math.max(1, Math.ceil(decoded.duration * RATE)), RATE); // mixed down to one channel
  const src = off.createBufferSource();
  src.buffer = decoded;
  src.connect(off.destination);
  src.start();
  const mono = (await off.startRendering()).getChannelData(0);
  await taLoadLame();
  const enc = new lamejs.Mp3Encoder(1, RATE, 48);
  const BLOCK = 1152 * 16, parts = [];
  const pcm = new Int16Array(BLOCK);
  for (let i = 0, n = 0; i < mono.length; i += BLOCK, n++) {
    const len = Math.min(BLOCK, mono.length - i);
    for (let k = 0; k < len; k++) { const v = Math.max(-1, Math.min(1, mono[i + k])); pcm[k] = v < 0 ? v * 32768 : v * 32767; }
    const out = enc.encodeBuffer(pcm.subarray(0, len));
    if (out.length) parts.push(new Uint8Array(out));
    if (n % 40 === 39) await new Promise(r => setTimeout(r)); // keep the page responsive
  }
  const end = enc.flush();
  if (end.length) parts.push(new Uint8Array(end));
  return new Blob(parts, { type: 'audio/mpeg' });
}
function taGuessMime(file) {
  if (file.type) return file.type;
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  return ({ mp3: 'audio/mpeg', m4a: 'audio/mp4', wav: 'audio/wav', ogg: 'audio/ogg', oga: 'audio/ogg', aac: 'audio/aac', flac: 'audio/flac',
    mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', mkv: 'video/x-matroska' })[ext] || 'application/octet-stream';
}
// Puts the file inside the exercise, plus the script that unpacks it for students.
function taEmbedMedia(html, b64, mime) {
  const block =
    '<script type="text/plain" id="taMediaData" data-mime="' + escapeForHtml(mime) + '">' + b64 + '<\/script>\n' +
    '<script>(function(){try{var el=document.getElementById("taMediaData");var s=atob(el.textContent.trim());el.textContent="";' +
    'var u=new Uint8Array(s.length);for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);' +
    'window.__TA_MEDIA_URL=URL.createObjectURL(new Blob([u],{type:el.getAttribute("data-mime")}));}catch(e){console.error("Media could not be unpacked",e);}' +
    'document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll("[data-ta-media]").forEach(function(m){m.src=window.__TA_MEDIA_URL||"";});});})();<\/script>\n';
  const at = html.indexOf('<body>');
  return html.slice(0, at + 6) + '\n' + block + html.slice(at + 6);
}
// Exercises with a packed media file are too big to keep for re-download/merging in the browser.
const TA_MAX_CACHED_HTML_CHARS = 3 * 1048576;

function createEnglishContent() {
  const title = document.getElementById('ec-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }
  const mediaFile = TA_MEDIA_FILES.ec || null;
  const videoUrl = mediaFile ? '' : document.getElementById('ec-youtube').value.trim();
  if (!mediaFile && !videoUrl) { showToast('Paste a video link or choose a video file first.'); return; }
  if (!mediaFile && !/^https?:\/\//i.test(videoUrl)) { showToast("That doesn't look like a valid link — it should start with http:// or https://."); return; }
  const mediaB64 = mediaFile ? TA_MEDIA_B64.ec : '';
  if (mediaFile && !mediaB64) { showToast('Still preparing "' + mediaFile.name + '" — try again in a moment.'); return; }

  const requiredCode = document.getElementById('ec-code').value.trim();
  const __timerMin_ec = parseFloat((document.getElementById('ec-timer') || {value:''}).value);
  const timeLimitMinutesEc = isNaN(__timerMin_ec) || __timerMin_ec <= 0 ? '0' : String(__timerMin_ec);

  const code = generateClassCode();
  const classCode = setActiveClassCode(code);
  const __ec_uid = generateExerciseUid();

  let html = ENGLISH_CONTENT_TEMPLATE;
  html = html.split('__TIME_LIMIT_MINUTES__').join(timeLimitMinutesEc);
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__EXERCISE_UID__').join(__ec_uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_AWARD__').join('0');
  if (mediaFile) {
    // the player reads the unpacked file instead of a link
    html = html.split('const VIDEO_URL = "__VIDEO_URL__";').join('const VIDEO_URL = window.__TA_MEDIA_URL || "";');
    html = taEmbedMedia(html, mediaB64, taGuessMime(mediaFile));
  }
  html = html.split('__VIDEO_URL__').join(videoUrl.replace(/'/g, "\\'"));
  html = html.split('__ACCESS_ID_MODE__').join('unified');
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(requiredCode));
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());

  pushRecentExercise({ title: title, typeLabel: 'English Content', code: classCode, uid: __ec_uid, html: html, requiredCode: requiredCode });
  downloadFile(typedFilename('EnglishContent', title, 'video'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}

function onDictationModeChange() {
  const mode = document.getElementById('dc-mode').value;
  document.getElementById('dc-free-field').style.display = mode === 'free' ? 'block' : 'none';
  document.getElementById('dc-cloze-field').style.display = mode === 'cloze' ? 'block' : 'none';
}

/* Auto-transcribe with AI: uses Puter.js, a free third-party library that
   provides access to OpenAI's Whisper/GPT-4o transcription models directly
   from a browser with no API key and no backend of ours involved — it loads
   on first use, sends the audio link off to be transcribed, and fills in
   the result. This is a free service run by a third party (not Anthropic or
   this app), so if they ever change their terms this could stop working;
   always proofread the result before using it either way. */
let dcPuterLoading = null;
function loadPuterScript() {
  if (window.puter) return Promise.resolve();
  if (dcPuterLoading) return dcPuterLoading;
  dcPuterLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://js.puter.com/v2/';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not load the transcription service.'));
    document.head.appendChild(s);
  });
  return dcPuterLoading;
}

let dcTranscribing = false;
async function autoTranscribeDictation(targetFieldId, btn) {
  if (dcTranscribing) return;
  const mediaFile = TA_MEDIA_FILES.dc || null;
  const audioUrl = mediaFile ? '' : document.getElementById('dc-audio').value.trim();
  if (!mediaFile && !audioUrl) { showToast('Paste the audio link or choose an audio file first.'); return; }
  if (!mediaFile && taYouTubeId(audioUrl)) {
    showToast('Auto-transcribe can\'t read YouTube videos. On YouTube, open the video\'s "…more" → "Show transcript", copy it and paste it here.');
    return;
  }

  const target = document.getElementById(targetFieldId);
  const originalLabel = btn.textContent;
  dcTranscribing = true;
  btn.textContent = '🤖 Transcribing…';
  btn.disabled = true;

  try {
    await loadPuterScript();
    const result = await window.puter.ai.speech2txt(mediaFile || audioUrl);
    const text = (result && result.text) ? result.text : (typeof result === 'string' ? result : '');
    if (!text) { showToast('The transcription came back empty — check the audio link.'); }
    else {
      target.value = text.trim();
      showToast('Transcribed! Read it over before creating the exercise.', 'ok');
    }
  } catch (e) {
    showToast('Auto-transcribe failed — check the audio link and your internet connection, or type the transcript yourself.');
  } finally {
    dcTranscribing = false;
    btn.textContent = originalLabel;
    btn.disabled = false;
  }
}

/* Turns "The cat sat on the *mat*." into the HTML students see (with real
   <input> blanks in place of each *word*) plus the ordered list of correct
   answers used for grading. */
function parseDictationCloze(text) {
  const answers = [];
  let idx = 0;
  const html = escapeForHtml(text).replace(/\*([^*]+)\*/g, (m, word) => {
    answers.push(word.trim());
    const i = idx++;
    return '<input type="text" class="dc-blank" data-idx="' + i + '">';
  });
  return { html: html, answers: answers };
}

/* Text-based Multiple Choice format, one question per block separated by a
   blank line — same "blank line separates things" convention already used
   for paragraphs. Each option line becomes a choice; whichever one ends
   with a trailing *asterisk* is the correct answer. Leading "A)", "A.", or
   "-" markers are stripped so teachers can write options either way. */
function parseMultipleChoice(raw) {
  const blocks = raw.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const questions = [];
  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 3) return; // need a question plus at least 2 options
    const question = lines[0];
    const options = [];
    let correctIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      let opt = lines[i];
      const isCorrect = opt.endsWith('*');
      if (isCorrect) { opt = opt.slice(0, -1).trim(); correctIndex = options.length; }
      opt = opt.replace(/^[A-Za-z][).]\s*/, '').replace(/^-\s*/, '');
      options.push(opt);
    }
    if (correctIndex === -1) return; // no answer marked - skip this block
    questions.push({ question: question, options: options, correctIndex: correctIndex });
  });
  return questions;
}

/* True / False / Not Given \u2014 Reading only. Each block is a statement
   line followed by an answer line (TRUE / FALSE / NOT GIVEN, or the short
   forms T / F / NG), separated from the next block by a blank line. */
function parseTrueFalseNotGiven(raw) {
  const blocks = raw.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const questions = [];
  const normalize = (s) => {
    s = s.trim().toUpperCase();
    if (s === 'T' || s === 'TRUE') return 'TRUE';
    if (s === 'F' || s === 'FALSE') return 'FALSE';
    if (s === 'NG' || s === 'NOT GIVEN' || s === 'NOTGIVEN') return 'NOT GIVEN';
    return null;
  };
  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return;
    const statement = lines[0];
    const answer = normalize(lines[1]);
    if (!answer) return;
    questions.push({ statement: statement, answer: answer });
  });
  return questions;
}

/* Short Answer \u2014 Reading only. A question line followed by its answer
   line, blocks separated by a blank line, same convention as the other
   IELTS question types. */
function parseShortAnswer(raw) {
  const blocks = raw.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const questions = [];
  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return;
    questions.push({ question: lines[0], answer: lines[1] });
  });
  return questions;
}

/* Matching \u2014 the first block is the shared list of options (an optional
   "OPTIONS:" header line, then one option per line, "A)"/"A."/"-" markers
   stripped automatically). Every block after that is one item: its text on
   the first line, then the letter of its correct option on the second. */
function parseMatching(raw) {
  const blocks = raw.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  if (!blocks.length) return null;
  const optionLines = blocks[0].split('\n').map(l => l.trim()).filter(Boolean);
  let startIdx = 0;
  if (/^options:?$/i.test(optionLines[0])) startIdx = 1;
  const options = [];
  for (let i = startIdx; i < optionLines.length; i++) {
    options.push(optionLines[i].replace(/^[A-Za-z][).]\s*/, '').replace(/^-\s*/, ''));
  }
  const items = [];
  for (let b = 1; b < blocks.length; b++) {
    const lines = blocks[b].split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;
    const answerLetter = lines[1].trim().toUpperCase();
    const answerIndex = answerLetter.charCodeAt(0) - 65;
    if (answerIndex < 0 || answerIndex >= options.length) continue;
    items.push({ item: lines[0], correctIndex: answerIndex });
  }
  if (!options.length || !items.length) return null;
  return { options: options, items: items };
}

/* Which Paragraph \u2014 Reading only. A clue line followed by the letter of
   the paragraph it belongs to, blocks separated by a blank line. Paragraphs
   in the passage are lettered A, B, C... so students can refer to them. */
function parseWhichParagraph(raw) {
  const blocks = raw.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const questions = [];
  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return;
    const letter = lines[1].trim().toUpperCase().charAt(0);
    if (!/^[A-Z]$/.test(letter)) return;
    questions.push({ clue: lines[0], answer: letter });
  });
  return questions;
}

/* Table / Summary Completion \u2014 Reading only. First block is the shared
   word bank (same "OPTIONS:" convention as Matching). Everything after
   that is the summary text itself, with each blank marked the same way as
   Gap Filling (*word*) \u2014 except here the marked word must exactly match
   one of the word-bank entries, since the student picks it from a list
   rather than typing freely. */
function parseTableCompletion(raw) {
  const blocks = raw.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  if (blocks.length < 2) return null;
  const optionLines = blocks[0].split('\n').map(l => l.trim()).filter(Boolean);
  let startIdx = 0;
  if (/^options:?$/i.test(optionLines[0])) startIdx = 1;
  const options = [];
  for (let i = startIdx; i < optionLines.length; i++) {
    options.push(optionLines[i].replace(/^[A-Za-z][).]\s*/, '').replace(/^-\s*/, ''));
  }
  const summaryRaw = blocks.slice(1).join('\n\n');
  const answers = [];
  const html = escapeForHtml(summaryRaw).replace(/\*([^*]+)\*/g, (m, word) => {
    const correctIdx = options.findIndex(o => o.toLowerCase() === word.trim().toLowerCase());
    answers.push(correctIdx);
    return '{{BLANK}}';
  });
  if (!options.length || !answers.length || answers.indexOf(-1) !== -1) return null;
  return { options: options, html: html, answers: answers };
}

function resetDictationForm() {
  document.getElementById('dc-title').value = '';
  document.getElementById('dc-audio').value = '';
  clearMediaFile('dc');
  document.getElementById('dc-mode').value = 'free';
  document.getElementById('dc-reference').value = '';
  document.getElementById('dc-cloze-text').value = '';
  document.getElementById('dc-code').value = '';
  onDictationModeChange();
}

// The 11-character video id of a YouTube link (watch, youtu.be, shorts, embed, live), or ''.
function taYouTubeId(url) {
  const m = String(url || '').match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : '';
}

function createDictation() {
  const title = document.getElementById('dc-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }
  const mediaFile = TA_MEDIA_FILES.dc || null;
  const audioUrl = mediaFile ? '' : document.getElementById('dc-audio').value.trim();
  if (!mediaFile && !audioUrl) { showToast('Paste an audio link or choose an audio file first.'); return; }
  if (!mediaFile && !/^https?:\/\//i.test(audioUrl)) { showToast("That doesn't look like a valid link — it should start with http:// or https://."); return; }

  const mode = document.getElementById('dc-mode').value;
  let referenceText = '', clozeHtml = '', clozeAnswers = [];
  if (mode === 'free') {
    referenceText = document.getElementById('dc-reference').value.trim();
    if (!referenceText) { showToast('Enter the reference text (what is actually said in the audio).'); return; }
  } else {
    const raw = document.getElementById('dc-cloze-text').value.trim();
    if (!raw) { showToast('Enter the transcript, marking blanks with *asterisks*.'); return; }
    const parsed = parseDictationCloze(raw);
    if (!parsed.answers.length) { showToast('Mark at least one word with *asterisks* to create a blank.'); return; }
    clozeHtml = parsed.html;
    clozeAnswers = parsed.answers;
  }

  const points = parseInt(document.getElementById('dc-points').value, 10) || 0;
  const requiredCode = document.getElementById('dc-code').value.trim();
  const __timerMin_dc = parseFloat((document.getElementById('dc-timer') || {value:''}).value);
  const timeLimitMinutesDc = isNaN(__timerMin_dc) || __timerMin_dc <= 0 ? '0' : String(__timerMin_dc);

  const mediaB64 = mediaFile ? TA_MEDIA_B64.dc : '';
  if (mediaFile && !mediaB64) { showToast('Still preparing "' + mediaFile.name + '" — try again in a moment.'); return; }

  const code = generateClassCode();
  const classCode = setActiveClassCode(code);
  const __dc_uid = generateExerciseUid();

  let html = DICTATION_TEMPLATE;
  const ytId = mediaFile ? '' : taYouTubeId(audioUrl);
  if (ytId) {
    // A YouTube link plays in YouTube's own player (captions off, so they don't give the answers away)
    const player = '<iframe id="dcYouTube" class="dc-yt" src="https://www.youtube-nocookie.com/embed/' + ytId +
      '?rel=0&modestbranding=1&cc_load_policy=0&iv_load_policy=3&playsinline=1" title="Listening" ' +
      'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>' +
      '<style>.dc-yt{flex:1 1 320px;min-width:260px;max-width:560px;aspect-ratio:16/9;border:0;border-radius:10px;background:#000;}</style>';
    const before = html;
    html = html.replace(/<audio id="dcAudio"[^>]*><\/audio>/, player);
    if (html === before) { showToast('This Dictation file can\'t play YouTube links — choose the audio file instead.'); return; }
  } else if (mediaFile) {
    // the audio player gets the unpacked file instead of a link
    html = html.split('src="__AUDIO_URL__"').join('data-ta-media');
    html = taEmbedMedia(html, mediaB64, (TA_MEDIA_PACKED.dc && TA_MEDIA_PACKED.dc.mime) || taGuessMime(mediaFile));
  }
  html = html.split('__TIME_LIMIT_MINUTES__').join(timeLimitMinutesDc);
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__EXERCISE_UID__').join(__dc_uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(requiredCode));
  html = html.split('__DICTATION_MODE__').join(mode);
  html = html.split('__REFERENCE_TEXT_JSON__').join(JSON.stringify(referenceText));
  html = html.split('__CLOZE_HTML_JSON__').join(JSON.stringify(clozeHtml));
  html = html.split('__CLOZE_ANSWERS_JSON__').join(JSON.stringify(clozeAnswers));
  html = html.split('__AUDIO_URL__').join(audioUrl.replace(/'/g, "\\'"));
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());
  html = html.split('__POINTS_AWARD__').join(String(points));

  pushRecentExercise({ title: title, typeLabel: 'Dictation', code: classCode, uid: __dc_uid, html: html, requiredCode: requiredCode, contentSummary: mode === 'free' ? referenceText : clozeAnswers.join(', ') });
  downloadFile(typedFilename('Dictation', title, 'listen'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}

/* ================= IELTS: LISTENING BUILDER ================= */
const IELTS_GROUP_HINTS = {
  gap: 'Each *word* becomes one gap-fill question. Wrap the missing word in *asterisks*.',
  mc: 'One question per block, separated by a blank line. Mark the correct option with a trailing *asterisk*.',
  tfng: 'One statement per block, separated by a blank line. Write TRUE, FALSE, or NOT GIVEN on the line below each statement.',
  short: 'One question per block, separated by a blank line. Write the answer on the line below each question.',
  matching: 'First block is the shared list of options. Every block after that is one item: its text, then the letter of its correct option on the next line.',
  which_paragraph: 'One clue per block, separated by a blank line. Write the letter of the paragraph it belongs to on the line below (paragraphs in the passage are lettered A, B, C...).',
  table: 'First block is the shared word bank. Everything after that is the summary text \u2014 mark each blank by wrapping the correct word bank entry in *asterisks*, exactly as it appears in the word bank.'
};
const IELTS_GROUP_PLACEHOLDERS = {
  gap: 'e.g. The meeting starts at *9am* and ends at *5pm*.',
  mc: 'What is the capital of France?\nLondon\nParis*\nBerlin\nMadrid',
  tfng: 'The company was founded in 1990.\nTRUE\n\nThe author disagrees with the theory.\nFALSE',
  short: 'What is the capital of France?\nParis\n\nWhich continent is Egypt in?\nAfrica',
  matching: 'OPTIONS:\nBank\nPost office\nSupermarket\nLibrary\n\nWhere did John go on Monday?\nB\n\nWhere did Mary go on Tuesday?\nA',
  which_paragraph: 'Which paragraph mentions the discovery date?\nB\n\nWhich paragraph describes health benefits?\nD',
  table: 'OPTIONS:\nfunding\ntrees\ncontrol\nflooding\n\nBusinesses often lack *control* from regulators, which can lead to *flooding* and other harm.'
};
const IELTS_GROUP_TYPE_LABELS = {
  gap: 'Gap Filling', mc: 'Multiple Choice', tfng: 'True / False / Not Given', short: 'Short Answer', matching: 'Matching', which_paragraph: 'Which Paragraph', table: 'Table / Summary Completion'
};

function addIeltsGroup(prefix, partNum) {
  const groupsWrap = document.getElementById(prefix + '-part' + partNum + '-groups');
  const availableTypes = prefix === 'ir' ? ['gap', 'mc', 'tfng', 'short', 'matching', 'which_paragraph', 'table'] : ['gap', 'mc', 'matching'];
  const block = document.createElement('div');
  block.className = 'ielts-group-block';
  const optionsHtml = availableTypes.map(t => '<option value="' + t + '">' + IELTS_GROUP_TYPE_LABELS[t] + '</option>').join('');
  block.innerHTML =
    '<div class="ielts-group-head">' +
      '<select class="ielts-group-type" onchange="onIeltsGroupTypeChange(this)">' + optionsHtml + '</select>' +
      '<button class="mini-btn danger" type="button" onclick="this.closest(\'.ielts-group-block\').remove()">Remove</button>' +
    '</div>' +
    '<textarea class="ielts-group-textarea" placeholder="' + escapeForHtml(IELTS_GROUP_PLACEHOLDERS.gap) + '"></textarea>' +
    '<p class="ielts-group-hint">' + IELTS_GROUP_HINTS.gap + '</p>';
  groupsWrap.appendChild(block);
}

function onIeltsGroupTypeChange(select) {
  const block = select.closest('.ielts-group-block');
  const textarea = block.querySelector('.ielts-group-textarea');
  const hint = block.querySelector('.ielts-group-hint');
  textarea.placeholder = IELTS_GROUP_PLACEHOLDERS[select.value];
  hint.textContent = IELTS_GROUP_HINTS[select.value];
}

/* Reads every question-group block inside one part and turns each into a
   gradeable group, tagged with its own type so the student-facing file
   knows how to render and grade it. Groups stay distinct (rather than
   flattened into one list) since Gap Filling and Multiple Choice render
   completely differently. */
function collectIeltsGroups(prefix, n, blankClass) {
  const groupsWrap = document.getElementById(prefix + '-part' + n + '-groups');
  const blocks = Array.from(groupsWrap.querySelectorAll('.ielts-group-block'));
  const groups = [];
  for (const block of blocks) {
    const type = block.querySelector('.ielts-group-type').value;
    const raw = block.querySelector('.ielts-group-textarea').value.trim();
    if (!raw) continue;
    if (type === 'gap') {
      const parsed = parseDictationCloze(raw);
      if (!parsed.answers.length) continue;
      groups.push({ type: 'gap', html: parsed.html.split('dc-blank').join(blankClass), answers: parsed.answers });
    } else if (type === 'mc') {
      const questions = parseMultipleChoice(raw);
      if (!questions.length) continue;
      groups.push({ type: 'mc', questions: questions });
    } else if (type === 'tfng') {
      const questions = parseTrueFalseNotGiven(raw);
      if (!questions.length) continue;
      groups.push({ type: 'tfng', questions: questions });
    } else if (type === 'short') {
      const questions = parseShortAnswer(raw);
      if (!questions.length) continue;
      groups.push({ type: 'short', questions: questions });
    } else if (type === 'matching') {
      const parsed = parseMatching(raw);
      if (!parsed) continue;
      groups.push({ type: 'matching', options: parsed.options, items: parsed.items });
    } else if (type === 'which_paragraph') {
      const questions = parseWhichParagraph(raw);
      if (!questions.length) continue;
      groups.push({ type: 'which_paragraph', questions: questions });
    } else if (type === 'table') {
      const parsed = parseTableCompletion(raw);
      if (!parsed) continue;
      groups.push({ type: 'table', options: parsed.options, html: parsed.html, answers: parsed.answers });
    }
  }
  return groups;
}

function renderIeltsListeningParts() {
  const wrap = document.getElementById('il-parts-wrap');
  if (!wrap || wrap.children.length) return; // render once
  wrap.innerHTML = [1, 2, 3, 4].map(n =>
    '<div class="ielts-part-card">' +
      '<div class="ielts-part-head" onclick="toggleIeltsListeningPart(' + n + ')">' +
        '<input type="checkbox" id="il-part' + n + '-include" onclick="event.stopPropagation(); onIeltsListeningPartToggle(' + n + ')">' +
        '<span class="label">Part ' + n + '</span>' +
      '</div>' +
      '<div class="ielts-part-body" id="il-part' + n + '-body">' +
        '<div class="title-field">' +
          '<label class="field-label">Audio link for Part ' + n + '</label>' +
          '<input type="text" id="il-part' + n + '-audio" placeholder="https://example.com/part' + n + '.mp3">' +
        '</div>' +
        '<div class="title-field">' +
          '<label class="field-label">Questions</label>' +
          '<div id="il-part' + n + '-groups"></div>' +
          '<button class="mini-btn" type="button" onclick="addIeltsGroup(\'il\', ' + n + ')">+ Add question group</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  ).join('');
  [1, 2, 3, 4].forEach(n => addIeltsGroup('il', n));
}

function toggleIeltsListeningPart(n) {
  const checkbox = document.getElementById('il-part' + n + '-include');
  checkbox.checked = !checkbox.checked;
  onIeltsListeningPartToggle(n);
}
function onIeltsListeningPartToggle(n) {
  const included = document.getElementById('il-part' + n + '-include').checked;
  document.getElementById('il-part' + n + '-body').classList.toggle('show', included);
}

function resetIeltsListeningForm() {
  document.getElementById('il-title').value = '';
  document.getElementById('il-code').value = '';
  [1, 2, 3, 4].forEach(n => {
    document.getElementById('il-part' + n + '-include').checked = false;
    document.getElementById('il-part' + n + '-audio').value = '';
    document.getElementById('il-part' + n + '-body').classList.remove('show');
    document.getElementById('il-part' + n + '-groups').innerHTML = '';
    addIeltsGroup('il', n);
  });
}

function createIeltsListening() {
  const title = document.getElementById('il-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }

  const parts = [null, null, null, null];
  let anyBuilt = false;
  for (let n = 1; n <= 4; n++) {
    if (!document.getElementById('il-part' + n + '-include').checked) continue;
    const audioUrl = document.getElementById('il-part' + n + '-audio').value.trim();
    if (!audioUrl) { showToast('Part ' + n + ' is checked but has no audio link.'); return; }
    if (!/^https?:\/\//i.test(audioUrl)) { showToast('Part ' + n + '\'s audio link should start with http:// or https://.'); return; }
    const groups = collectIeltsGroups('il', n, 'il-blank');
    if (!groups.length) { showToast('Part ' + n + ' is checked but has no valid questions yet.'); return; }
    parts[n - 1] = { audioUrl: audioUrl, groups: groups };
    anyBuilt = true;
  }
  if (!anyBuilt) { showToast('Check at least one part and fill it in before creating.'); return; }

  const requiredCode = document.getElementById('il-code').value.trim();
  const code = generateClassCode();
  const classCode = setActiveClassCode(code);
  const __il_uid = generateExerciseUid();

  let html = IELTS_LISTENING_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__EXERCISE_UID__').join(__il_uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(requiredCode));
  html = html.split('__PARTS_JSON__').join(JSON.stringify(parts));
  const __timerMin_il = parseFloat((document.getElementById('il-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_il) || __timerMin_il <= 0 ? '0' : String(__timerMin_il));
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());

  pushRecentExercise({ title: title, typeLabel: 'IELTS Listening', code: classCode, uid: __il_uid, html: html, requiredCode: requiredCode });
  downloadFile(typedFilename('IELTS_Listening', title, 'listen'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}

/* ================= IELTS: READING BUILDER ================= */
function renderIeltsReadingParts() {
  const wrap = document.getElementById('ir-parts-wrap');
  if (!wrap || wrap.children.length) return; // render once
  wrap.innerHTML = [1, 2, 3].map(n =>
    '<div class="ielts-part-card">' +
      '<div class="ielts-part-head" onclick="toggleIeltsReadingPart(' + n + ')">' +
        '<input type="checkbox" id="ir-part' + n + '-include" onclick="event.stopPropagation(); onIeltsReadingPartToggle(' + n + ')">' +
        '<span class="label">Part ' + n + '</span>' +
      '</div>' +
      '<div class="ielts-part-body" id="ir-part' + n + '-body">' +
        '<div class="title-field">' +
          '<label class="field-label">Reading passage for Part ' + n + ' (leave a blank line between paragraphs)</label>' +
          '<textarea id="ir-part' + n + '-passage" placeholder="Paste the passage here..." style="min-height:140px;"></textarea>' +
        '</div>' +
        '<div class="title-field">' +
          '<label class="field-label">Questions</label>' +
          '<div id="ir-part' + n + '-groups"></div>' +
          '<button class="mini-btn" type="button" onclick="addIeltsGroup(\'ir\', ' + n + ')">+ Add question group</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  ).join('');
  [1, 2, 3].forEach(n => addIeltsGroup('ir', n));
}

function toggleIeltsReadingPart(n) {
  const checkbox = document.getElementById('ir-part' + n + '-include');
  checkbox.checked = !checkbox.checked;
  onIeltsReadingPartToggle(n);
}
function onIeltsReadingPartToggle(n) {
  const included = document.getElementById('ir-part' + n + '-include').checked;
  document.getElementById('ir-part' + n + '-body').classList.toggle('show', included);
}

function resetIeltsReadingForm() {
  document.getElementById('ir-title').value = '';
  document.getElementById('ir-code').value = '';
  [1, 2, 3].forEach(n => {
    document.getElementById('ir-part' + n + '-include').checked = false;
    document.getElementById('ir-part' + n + '-passage').value = '';
    document.getElementById('ir-part' + n + '-body').classList.remove('show');
    document.getElementById('ir-part' + n + '-groups').innerHTML = '';
    addIeltsGroup('ir', n);
  });
}

/* Splits a pasted passage into paragraphs on blank lines, same rule as
   Bidirectional Language, and wraps each in a simple paragraph div. */
function buildReadingPassageHtml(raw) {
  const paragraphs = raw.split(/\n\s*\n/).map(p => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  return paragraphs.map((p, i) =>
    '<div class="ir-para"><span class="ir-para-letter">' + String.fromCharCode(65 + i) + '</span>' + escapeForHtml(p) + '</div>'
  ).join('');
}
function countReadingParagraphs(passageHtml) {
  return (passageHtml.match(/class="ir-para"/g) || []).length;
}

function createIeltsReading() {
  const title = document.getElementById('ir-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }

  const parts = [null, null, null];
  let anyBuilt = false;
  for (let n = 1; n <= 3; n++) {
    if (!document.getElementById('ir-part' + n + '-include').checked) continue;
    const passageRaw = document.getElementById('ir-part' + n + '-passage').value.trim();
    if (!passageRaw) { showToast('Part ' + n + ' is checked but has no passage written yet.'); return; }
    const groups = collectIeltsGroups('ir', n, 'ir-blank');
    if (!groups.length) { showToast('Part ' + n + ' is checked but has no valid questions yet.'); return; }
    parts[n - 1] = { passageHtml: buildReadingPassageHtml(passageRaw), groups: groups };
    anyBuilt = true;
  }
  if (!anyBuilt) { showToast('Check at least one part and fill it in before creating.'); return; }

  const requiredCode = document.getElementById('ir-code').value.trim();
  const code = generateClassCode();
  const classCode = setActiveClassCode(code);
  const __ir_uid = generateExerciseUid();

  let html = IELTS_READING_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__EXERCISE_UID__').join(__ir_uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(requiredCode));
  html = html.split('__PARTS_JSON__').join(JSON.stringify(parts));
  const __timerMin_ir = parseFloat((document.getElementById('ir-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_ir) || __timerMin_ir <= 0 ? '0' : String(__timerMin_ir));
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());

  pushRecentExercise({ title: title, typeLabel: 'IELTS Reading', code: classCode, uid: __ir_uid, html: html, requiredCode: requiredCode });
  downloadFile(typedFilename('IELTS_Reading', title, 'read'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}

function resetIeltsWritingForm() {
  document.getElementById('iw-title').value = '';
  document.getElementById('iw-code').value = '';
  document.getElementById('iw-task1-prompt').value = '';
  document.getElementById('iw-task1-minwords').value = '150';
  document.getElementById('iw-task2-prompt').value = '';
  document.getElementById('iw-task2-minwords').value = '250';
  document.getElementById('iw-show-feedback').value = 'on';
}

function createIeltsWriting() {
  const title = document.getElementById('iw-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }
  const task1Prompt = document.getElementById('iw-task1-prompt').value.trim();
  const task2Prompt = document.getElementById('iw-task2-prompt').value.trim();
  if (!task1Prompt) { showToast('Please write the Task 1 prompt.'); return; }
  if (!task2Prompt) { showToast('Please write the Task 2 prompt.'); return; }
  const task1MinWords = parseInt(document.getElementById('iw-task1-minwords').value, 10) || 150;
  const task2MinWords = parseInt(document.getElementById('iw-task2-minwords').value, 10) || 250;
  const showFeedback = document.getElementById('iw-show-feedback').value === 'on';

  const requiredCode = document.getElementById('iw-code').value.trim();
  const code = generateClassCode();
  const classCode = setActiveClassCode(code);
  const __iw_uid = generateExerciseUid();

  let html = IELTS_WRITING_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__EXERCISE_UID__').join(__iw_uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__REQUIRED_CODE__').join(escapeForHtml(requiredCode));
  html = html.split('__CODE_FIELD_DISPLAY__').join(requiredCode ? '' : 'none');
  html = html.split('__TASK1_PROMPT__').join(escapeForJsString(task1Prompt));
  html = html.split('__TASK2_PROMPT__').join(escapeForJsString(task2Prompt));
  html = html.split('__TASK1_MIN_WORDS__').join(String(task1MinWords));
  html = html.split('__TASK2_MIN_WORDS__').join(String(task2MinWords));
  html = html.split('__SHOW_FEEDBACK__').join(showFeedback ? 'true' : 'false');
  const __timerMin_iw = parseFloat((document.getElementById('iw-timer') || {value:''}).value);
  html = html.split('__TIME_LIMIT_MINUTES__').join(isNaN(__timerMin_iw) || __timerMin_iw <= 0 ? '0' : String(__timerMin_iw));
  html = html.split('__FILE_BUILT_AT__').join(new Date().toISOString());

  pushRecentExercise({ title: title, typeLabel: 'IELTS Writing', code: classCode, uid: __iw_uid, html: html, requiredCode: requiredCode });
  downloadFile(typedFilename('IELTS_Writing', title, 'write'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}

function resetSpellingForm() {
  document.getElementById('sp-title').value = '';
  const spIns = document.getElementById('sp-instructions'); if (spIns) spIns.value = '';
  document.getElementById('sp-points').value = '10';
  document.getElementById('sp-voice').value = 'female';
  document.getElementById('sp-lang').value = 'en-US';
  const spCompose = document.getElementById('sp-compose'); if (spCompose) spCompose.value = '';
  spRows.innerHTML = '';
  renumberRows(spRows);
  updateSpCount();
}

function resetTestForm() {
  document.getElementById('ts-title').value = '';
  const tsIns = document.getElementById('ts-instructions'); if (tsIns) tsIns.value = '';
  document.getElementById('ts-points').value = '10';
  document.getElementById('ts-options').value = '3';
  const tsMatching = document.getElementById('ts-matching-round'); if (tsMatching) tsMatching.checked = false;
  const tsCompose = document.getElementById('ts-compose'); if (tsCompose) tsCompose.value = '';
  if (window.onTestOptionCountChange) onTestOptionCountChange();
  tsRows.innerHTML = '';
  renumberRows(tsRows);
  updateTsCount();
}

/* ================= BULK PASTE — one box, many rows =================
   Paste "house. bed. phone. book" (or one item per line, or a numbered
   list) into the first box, press the split button, and each item gets
   its own row. */
function splitPastedList(text) {
  const raw = String(text || '').trim();
  if (!raw) return [];
  let parts;

  if (/\r?\n/.test(raw)) {
    parts = raw.split(/\r?\n+/);                       // pasted as a list
  } else if ((raw.match(/\d+\s*[\).]\s*\S/g) || []).length >= 2) {
    parts = raw.split(/\s*\d+\s*[\).]\s*/);            // "1. house 2. bed"
  } else {
    parts = raw.split(/[.;•|]+/);                      // "house. bed. phone"
  }

  return parts
    .map(p => p.replace(/^\s*\d+\s*[\).\-:]\s*/, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/* Fills a column of rows, adding new rows when there are more items. */
function fillRowsFromSplit(opts) {
  const rows = () => Array.from(document.querySelectorAll(opts.rowSelector));
  const first = rows()[0];
  if (!first) { showToast('Add one row first.'); return 0; }

  const columns = opts.columns;                        // [{ selector, items }]
  const needed = Math.max.apply(null, columns.map(c => c.items.length));
  if (needed === 0) { showToast('Paste your list into the first box, then press this button.'); return 0; }

  while (rows().length < needed) opts.addRow();

  const list = rows();
  columns.forEach(col => {
    col.items.forEach((value, i) => {
      const input = list[i].querySelector(col.selector);
      if (!input) return;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  if (opts.after) opts.after(list, needed);
  showToast('✅ Split into ' + needed + ' row' + (needed > 1 ? 's' : '') + '.', 'ok');
  return needed;
}

function splitWordOrderRows() {
  const first = document.querySelector('#wo-rows .row-item input');
  fillRowsFromSplit({
    rowSelector: '#wo-rows .row-item',
    addRow: addWordOrderRow,
    columns: [{ selector: 'input', items: splitPastedList(first ? first.value : '') }]
  });
}

function splitMakeAWordRows() {
  const first = document.querySelector('#maw-rows .row-item input');
  fillRowsFromSplit({
    rowSelector: '#maw-rows .row-item',
    addRow: addMakeAWordRow,
    columns: [{ selector: 'input', items: splitPastedList(first ? first.value : '') }]
  });
}

function splitFlashcardRows() {
  const firstRow = document.querySelector('#fc-rows .row-item');
  if (!firstRow) { showToast('Add one row first.'); return; }
  const inputs = firstRow.querySelectorAll('input');
  const words = splitPastedList(inputs[0] ? inputs[0].value : '');
  const trans = splitPastedList(inputs[1] ? inputs[1].value : '');
  if (words.length && trans.length && words.length !== trans.length) {
    showToast('⚠️ ' + words.length + ' words but ' + trans.length + ' translations — check the pair that does not line up.');
  }
  fillRowsFromSplit({
    rowSelector: '#fc-rows .row-item',
    addRow: addFlashcardRow,
    columns: [
      { selector: 'input:nth-of-type(1)', items: words },
      { selector: 'input:nth-of-type(2)', items: trans }
    ]
  });
}

function splitPronRows() {
  const first = document.querySelector('#pr-rows .pron-row .pr-word');
  fillRowsFromSplit({
    rowSelector: '#pr-rows .pron-row',
    addRow: addPronRow,
    columns: [{ selector: '.pr-word', items: splitPastedList(first ? first.value : '') }]
  });
}

function splitSpellingRows() {
  const first = document.querySelector('#sp-rows .sp-row .sp-word');
  fillRowsFromSplit({
    rowSelector: '#sp-rows .sp-row',
    addRow: addSpellingRow,
    columns: [{ selector: '.sp-word', items: splitPastedList(first ? first.value : '') }]
  });
}

function splitTestRows() {
  const first = document.querySelector('#ts-rows .test-row .ts-sentence');
  fillRowsFromSplit({
    rowSelector: '#ts-rows .test-row',
    addRow: addTestRow,
    columns: [{ selector: '.ts-sentence', items: splitPastedList(first ? first.value : '') }]
  });
}


/* ================= JUNGLE (board game for the classroom screen) =================
   Every question is one square of the board, in order. A picture can go
   under a question; it's shrunk before it's kept so the file stays small. */
let jgQuestions = []; // [{ q, img }]
let jgImageFor = -1;

function renderJungleRows() {
  const wrap = document.getElementById('jg-rows');
  if (!wrap) return;
  wrap.innerHTML = '';
  jgQuestions.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'row-item jg-row';
    row.innerHTML =
      '<div class="idx">' + (i + 1) + '</div>' +
      '<div class="jg-row-body">' +
        '<textarea rows="2" placeholder="e.g. What vocabulary word do you use for this?"></textarea>' +
        '<div class="jg-row-img"></div>' +
      '</div>' +
      '<button class="remove-btn" type="button" title="Remove this question">&times;</button>';
    const ta = row.querySelector('textarea');
    ta.value = item.q || '';
    ta.addEventListener('input', () => { jgQuestions[i].q = ta.value; });
    const imgBox = row.querySelector('.jg-row-img');
    if (item.img) {
      imgBox.innerHTML = '<img alt=""><button class="mini-btn danger" type="button">✕ Remove picture</button>';
      imgBox.querySelector('img').src = item.img;
      imgBox.querySelector('button').onclick = () => { jgQuestions[i].img = ''; renderJungleRows(); };
    } else {
      imgBox.innerHTML = '<button class="mini-btn" type="button">🖼 Add a picture</button>';
      imgBox.querySelector('button').onclick = () => { jgImageFor = i; document.getElementById('jg-image-input').click(); };
    }
    row.querySelector('.remove-btn').onclick = () => { jgQuestions.splice(i, 1); renderJungleRows(); };
    wrap.appendChild(row);
  });
  const count = document.getElementById('jg-count');
  if (count) count.textContent = jgQuestions.length;
}

function addJungleQuestion(text) {
  jgQuestions.push({ q: text || '', img: '' });
  renderJungleRows();
}

// Pictures are resized to at most 900px and saved as JPEG.
function taShrinkImage(file, done) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 900 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.width * k));
      c.height = Math.max(1, Math.round(img.height * k));
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      done(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => showToast('That file isn\'t a picture the browser can open.');
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

document.getElementById('jg-image-input').addEventListener('change', function (e) {
  const file = (e.target.files || [])[0];
  const i = jgImageFor;
  e.target.value = '';
  if (!file || !jgQuestions[i]) return;
  taShrinkImage(file, src => { jgQuestions[i].img = src; renderJungleRows(); });
});

function jungleQuestionsFilled() {
  return jgQuestions.filter(item => (item.q || '').trim() || item.img).map(item => ({ q: (item.q || '').trim(), img: item.img || '' }));
}

function buildJungleHtml(title) {
  const data = {
    title: title,
    instructions: document.getElementById('jg-instructions').value.trim(),
    questions: jungleQuestionsFilled()
  };
  let html = JUNGLE_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__JUNGLE_DATA__').join(JSON.stringify(data).replace(/</g, '\\u003c'));
  return html;
}

function previewJungle() {
  if (!jungleQuestionsFilled().length) { showToast('Add at least one question first.'); return; }
  const title = document.getElementById('jg-title').value.trim() || 'Jungle Game';
  const url = URL.createObjectURL(new Blob([buildJungleHtml(title)], { type: 'text/html' }));
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function createJungle() {
  const title = document.getElementById('jg-title').value.trim();
  if (!title) { showToast('Please enter a game title.'); return; }
  const qs = jungleQuestionsFilled();
  if (qs.length < 3) { showToast('Add at least 3 questions — each one is a square on the board.'); return; }
  const html = buildJungleHtml(title);
  pushRecentExercise({ title: title, typeLabel: 'Jungle', code: '', uid: generateExerciseUid(), html: html,
    contentSummary: qs.map((item, i) => (i + 1) + '. ' + (item.q || '(picture)')).join('\n') });
  downloadFile(typedFilename('Jungle', title, 'jungle'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}

function resetJungleForm() {
  document.getElementById('jg-title').value = '';
  document.getElementById('jg-instructions').value = '';
  document.getElementById('jg-compose').value = '';
  jgQuestions = [];
  renderJungleRows();
}

/* ================= BAMBOOZLE (team quiz game for the classroom screen) =================
   Every question is one numbered card with hidden points. The answer is
   optional and only shown when the teacher asks for it. */
let bzQuestions = []; // [{ q, a, pts, img }]
let bzImageFor = -1;

function bzDefaultPoints() {
  return parseInt(document.getElementById('bz-default-points').value, 10) || 10;
}

function renderBamboozleRows() {
  const wrap = document.getElementById('bz-rows');
  if (!wrap) return;
  wrap.innerHTML = '';
  bzQuestions.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'row-item jg-row';
    row.innerHTML =
      '<div class="idx">' + (i + 1) + '</div>' +
      '<div class="jg-row-body">' +
        '<textarea rows="2" placeholder="e.g. What is the past tense of &quot;go&quot;?"></textarea>' +
        '<div class="bz-row-line">' +
          '<input type="text" class="bz-ans" placeholder="Answer (optional, only you see it)">' +
          '<label class="bz-pts-label"><input type="number" class="bz-pts" min="1" max="1000" step="1"> pts</label>' +
        '</div>' +
        '<div class="jg-row-img"></div>' +
      '</div>' +
      '<button class="remove-btn" type="button" title="Remove this question">&times;</button>';
    const ta = row.querySelector('textarea'), ans = row.querySelector('.bz-ans'), pts = row.querySelector('.bz-pts');
    ta.value = item.q || '';
    ans.value = item.a || '';
    pts.value = item.pts;
    ta.addEventListener('input', () => { bzQuestions[i].q = ta.value; });
    ans.addEventListener('input', () => { bzQuestions[i].a = ans.value; });
    pts.addEventListener('input', () => { bzQuestions[i].pts = Math.max(1, Math.abs(parseInt(pts.value, 10) || 0)) || bzDefaultPoints(); });
    const imgBox = row.querySelector('.jg-row-img');
    if (item.img) {
      imgBox.innerHTML = '<img alt=""><button class="mini-btn danger" type="button">✕ Remove picture</button>';
      imgBox.querySelector('img').src = item.img;
      imgBox.querySelector('button').onclick = () => { bzQuestions[i].img = ''; renderBamboozleRows(); };
    } else {
      imgBox.innerHTML = '<button class="mini-btn" type="button">🖼 Add a picture</button>';
      imgBox.querySelector('button').onclick = () => { bzImageFor = i; document.getElementById('bz-image-input').click(); };
    }
    row.querySelector('.remove-btn').onclick = () => { bzQuestions.splice(i, 1); renderBamboozleRows(); };
    wrap.appendChild(row);
  });
  const count = document.getElementById('bz-count');
  if (count) count.textContent = bzQuestions.length;
}

// "Question | answer | points" — the answer and the points are optional.
function addBamboozleQuestion(text) {
  const parts = String(text || '').split('|').map(s => s.trim());
  let pts = bzDefaultPoints();
  if (parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) pts = parseInt(parts.pop(), 10) || pts;
  bzQuestions.push({ q: parts[0] || '', a: parts.slice(1).join(' | '), pts: pts, img: '' });
  renderBamboozleRows();
}

document.getElementById('bz-image-input').addEventListener('change', function (e) {
  const file = (e.target.files || [])[0];
  const i = bzImageFor;
  e.target.value = '';
  if (!file || !bzQuestions[i]) return;
  taShrinkImage(file, src => { bzQuestions[i].img = src; renderBamboozleRows(); });
});

function bamboozleQuestionsFilled() {
  return bzQuestions.filter(item => (item.q || '').trim() || item.img)
    .map(item => ({ q: (item.q || '').trim(), a: (item.a || '').trim(), pts: Math.abs(parseInt(item.pts, 10) || 0) || bzDefaultPoints(), img: item.img || '' }));
}

function buildBamboozleHtml(title) {
  const data = { title: title, wrong: document.getElementById('bz-wrong').value, questions: bamboozleQuestionsFilled() };
  let html = BAMBOOZLE_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForTemplateText(title));
  html = html.split('__BAMBOOZLE_DATA__').join(JSON.stringify(data).replace(/</g, '\\u003c'));
  return html;
}

function previewBamboozle() {
  if (!bamboozleQuestionsFilled().length) { showToast('Add at least one question first.'); return; }
  const title = document.getElementById('bz-title').value.trim() || 'Bamboozle';
  const url = URL.createObjectURL(new Blob([buildBamboozleHtml(title)], { type: 'text/html' }));
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function createBamboozle() {
  const title = document.getElementById('bz-title').value.trim();
  if (!title) { showToast('Please enter a game title.'); return; }
  const qs = bamboozleQuestionsFilled();
  if (qs.length < 2) { showToast('Add at least 2 questions — each one is a card.'); return; }
  const html = buildBamboozleHtml(title);
  pushRecentExercise({ title: title, typeLabel: 'Bamboozle', code: '', uid: generateExerciseUid(), html: html,
    contentSummary: qs.map((item, i) => (i + 1) + '. ' + (item.q || '(picture)') + (item.a ? ' → ' + item.a : '') + ' (' + item.pts + ' pts)').join('\n') });
  downloadFile(typedFilename('Bamboozle', title, 'bamboozle'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}

function resetBamboozleForm() {
  document.getElementById('bz-title').value = '';
  document.getElementById('bz-compose').value = '';
  document.getElementById('bz-default-points').value = '10';
  document.getElementById('bz-wrong').value = 'zero';
  bzQuestions = [];
  renderBamboozleRows();
}

/* ================= JUNGLE ⇄ BAMBOOZLE =================
   The same questions (and pictures) in the other classroom game. Bamboozle
   cards get the usual points; Jungle has no answers or points, so those stay
   behind. (For a game made earlier: Use again in My Exercises, then this.) */
function switchGameBuilder(to) {
  const fromJungle = to === 'bamboozle';
  const qs = fromJungle ? jungleQuestionsFilled() : bamboozleQuestionsFilled();
  if (!qs.length) { showToast('Add some questions first.'); return; }
  const title = document.getElementById(fromJungle ? 'jg-title' : 'bz-title').value.trim();
  const target = fromJungle ? bamboozleQuestionsFilled() : jungleQuestionsFilled();
  if (target.length && !confirm('The ' + (fromJungle ? 'Bamboozle' : 'Jungle') + ' builder already has ' + target.length + ' question' + (target.length === 1 ? '' : 's') + '. Replace them?')) return;
  if (fromJungle) {
    bzQuestions = qs.map(x => ({ q: x.q, a: '', pts: bzDefaultPoints(), img: x.img }));
    document.getElementById('bz-title').value = title;
    renderBamboozleRows();
  } else {
    jgQuestions = qs.map(x => ({ q: x.q, img: x.img }));
    document.getElementById('jg-title').value = title;
    renderJungleRows();
  }
  switchTo(to);
  const answers = !fromJungle && qs.some(x => x.a);
  showToast('🔁 ' + qs.length + ' questions moved to ' + (fromJungle ? 'Bamboozle — each card is worth ' + bzDefaultPoints() + ' points; add answers if you like.' : 'Jungle' + (answers ? ' (Jungle has no answers or points, so those stay in Bamboozle).' : '.')) +
    (!fromJungle && qs.length < 3 ? ' Jungle needs at least 3.' : ''), 'ok');
}

/* ================= SAVED WORK: drafts, "Use again", Undo for Reset =================
   taCaptureBuilder(tab) reads a builder's whole form (its fields and its
   rows) into plain data, and taRestoreBuilder(tab, state) puts it back.
   That powers three things:
   - Drafts: while a builder is open its form is saved every few seconds, so
     a closed tab or a locked phone never loses work. Opening the builder
     again offers to bring it back.
   - "Use again" in My Exercises: each exercise keeps its form, and the
     builder reopens filled in.
   - Reset All clears the form straight away, with Undo. */
function taRowInputs(container, selector) {
  return Array.from(container.querySelectorAll(selector));
}
function taSingleRows(container) {
  return taRowInputs(container, '.row-item input').map(i => i.value);
}
function taSetSingleRows(container, list, addFilled) {
  container.innerHTML = '';
  (list || []).forEach(v => addFilled(String(v)));
  renumberRows(container);
}
// Spelling / Pronunciation: typing the word fills the other boxes; keep saved values over the automatic ones.
function taFillAfterWord(input, rowSelector, extraSelectors, values) {
  input.value = values[0] || '';
  input.dispatchEvent(new Event('input'));
  const row = input.closest(rowSelector);
  extraSelectors.forEach((sel, i) => {
    const boxes = row.querySelectorAll(sel);
    (Array.isArray(values[i + 1]) ? values[i + 1] : [values[i + 1]]).forEach((v, j) => {
      if (boxes[j] && v) boxes[j].value = v;
    });
  });
}

const TA_BUILDER_ROWS = {
  wordorder: {
    get: () => taSingleRows(woRows),
    set: v => taSetSingleRows(woRows, v, addWordOrderRowFilled)
  },
  makeaword: {
    get: () => taSingleRows(mawRows),
    set: v => taSetSingleRows(mawRows, v, addMakeAWordRowFilled)
  },
  sentences: {
    get: () => taSingleRows(snRows),
    set: v => taSetSingleRows(snRows, v, addSnWordFilled)
  },
  flashcard: {
    get: () => taRowInputs(fcRows, '.row-item').map(r => Array.from(r.querySelectorAll('input')).map(i => i.value)),
    set: v => {
      fcRows.innerHTML = '';
      (v || []).forEach(pair => {
        const inputs = makePairRow(fcRows, 'Word (e.g. kitchen)', 'Translation (e.g. oshxona)');
        inputs[0].value = pair[0] || '';
        inputs[1].value = pair[1] || '';
      });
      renumberRows(fcRows);
    }
  },
  canknock: {
    get: () => taRowInputs(ckRows, '.row-item').map(r => Array.from(r.querySelectorAll('input')).map(i => i.value)),
    set: v => {
      ckRows.innerHTML = '';
      (v || []).forEach(pair => {
        const inputs = makePairRow(ckRows, 'Word (e.g. hello)', 'Translation (e.g. salom)');
        inputs[0].value = pair[0] || '';
        inputs[1].value = pair[1] || '';
      });
      renumberRows(ckRows);
    }
  },
  cargame: {
    get: () => taRowInputs(cgRows, '.row-item').map(r => Array.from(r.querySelectorAll('input')).map(i => i.value)),
    set: v => {
      cgRows.innerHTML = '';
      (v || []).forEach(pair => {
        const inputs = makePairRow(cgRows, 'Word (e.g. road)', 'Translation (e.g. yo\'l)');
        inputs[0].value = pair[0] || '';
        inputs[1].value = pair[1] || '';
      });
      renumberRows(cgRows);
    }
  },
  spelling: {
    get: () => taRowInputs(spRows, '.sp-row').map(r => [r.querySelector('.sp-word').value, taRowInputs(r, '.sp-wrong').map(i => i.value)]),
    set: v => {
      spRows.innerHTML = '';
      (v || []).forEach(r => taFillAfterWord(makeSpellingRow(spRows), '.sp-row', ['.sp-wrong'], r));
      renumberRows(spRows);
      updateSpCount();
    }
  },
  pronunciation: {
    get: () => taRowInputs(prRows, '.pron-row').map(r => [r.querySelector('.pr-word').value, r.querySelector('.pr-ipa').value, r.querySelector('.pr-icon').value]),
    set: v => {
      prRows.innerHTML = '';
      (v || []).forEach(r => taFillAfterWord(makePronRow(prRows), '.pron-row', ['.pr-ipa', '.pr-icon'], r));
      renumberRows(prRows);
      updatePronCount();
    }
  },
  test: {
    get: () => taRowInputs(tsRows, '.test-row').map(r => ({
      s: r.querySelector('.ts-sentence').value,
      gap: parseInt(r.dataset.gap, 10),
      wrongs: taRowInputs(r, '.ts-wrong').map(i => i.value)
    })),
    set: v => {
      tsRows.innerHTML = '';
      (v || []).forEach(item => {
        const input = makeTestRow(tsRows);
        input.value = item.s || '';
        input.dispatchEvent(new Event('input')); // draws the word chips
        const row = input.closest('.test-row');
        if (item.gap >= 0) {
          row.dataset.gap = String(item.gap);
          const chip = row.querySelectorAll('.word-chips .chip')[item.gap];
          if (chip) chip.classList.add('picked');
        }
        const boxes = row.querySelectorAll('.ts-wrong');
        (item.wrongs || []).forEach((w, j) => { if (boxes[j]) boxes[j].value = w; });
      });
      renumberRows(tsRows);
      updateTsCount();
    }
  },
  bilingual: {
    get: () => JSON.parse(JSON.stringify(brParagraphs)),
    set: v => { brParagraphs = JSON.parse(JSON.stringify(v || [])); renderBilingualRows(); }
  },
  presentation: {
    get: () => ({ slides: JSON.parse(JSON.stringify(presSlides)), current: presCurrent }),
    set: v => {
      if (!v || !v.slides || !v.slides.length) return;
      presSlides = JSON.parse(JSON.stringify(v.slides));
      let top = 0;
      presSlides.forEach(sl => sl.els.forEach(el => { top = Math.max(top, parseInt(String(el.id).slice(1), 10) || 0); }));
      presElSeq = Math.max(presElSeq, top + 1);
      selectPresSlide(v.current || 0);
    }
  },
  'ielts-listening': taIeltsGroupRows('il', 4),
  'ielts-reading': taIeltsGroupRows('ir', 3),
  'ielts-writing': { get: () => null, set: () => {} },
  engcontent: { get: () => null, set: () => {} },
  dictation: { get: () => null, set: () => {} },
  jungle: {
    get: () => JSON.parse(JSON.stringify(jgQuestions)),
    set: v => { jgQuestions = Array.isArray(v) ? JSON.parse(JSON.stringify(v)) : []; renderJungleRows(); }
  },
  bamboozle: {
    get: () => JSON.parse(JSON.stringify(bzQuestions)),
    set: v => { bzQuestions = Array.isArray(v) ? JSON.parse(JSON.stringify(v)) : []; renderBamboozleRows(); }
  }
};
function taIeltsGroupRows(prefix, parts) {
  const nums = Array.from({ length: parts }, (_, i) => i + 1);
  return {
    get: () => nums.map(n => {
      const wrap = document.getElementById(prefix + '-part' + n + '-groups');
      return wrap ? taRowInputs(wrap, '.ielts-group-block').map(b => [b.querySelector('.ielts-group-type').value, b.querySelector('.ielts-group-textarea').value]) : [];
    }),
    set: v => {
      nums.forEach((n, i) => {
        const wrap = document.getElementById(prefix + '-part' + n + '-groups');
        if (!wrap) return;
        const groups = (v && v[i] && v[i].length) ? v[i] : [['gap', '']];
        wrap.innerHTML = '';
        groups.forEach(g => {
          addIeltsGroup(prefix, n);
          const block = wrap.lastElementChild;
          const sel = block.querySelector('.ielts-group-type');
          sel.value = g[0];
          onIeltsGroupTypeChange(sel);
          block.querySelector('.ielts-group-textarea').value = g[1] || '';
        });
        const box = document.getElementById(prefix + '-part' + n + '-include');
        const body = document.getElementById(prefix + '-part' + n + '-body');
        if (box && body) body.classList.toggle('show', box.checked);
      });
    }
  };
}
const TA_SAVED_TABS = Object.keys(TA_BUILDER_ROWS);
const TA_MEDIA_PREFIX = { engcontent: 'ec', dictation: 'dc' };

// The builder's form, wherever it is right now (Homework/Class borrows it into its own panel).
function taBuilderRoot(tab) {
  const panel = document.getElementById('panel-' + tab);
  if (panel && panel.querySelector('.card')) return panel;
  return document.getElementById('panel-hwcround') || panel;
}
function taBuilderFields(tab) {
  const root = taBuilderRoot(tab);
  if (!root) return [];
  return Array.from(root.querySelectorAll('input[id], select[id], textarea[id]')).filter(el => el.type !== 'file');
}

function taCaptureBuilder(tab) {
  if (!TA_BUILDER_ROWS[tab]) return null;
  const fields = {};
  taBuilderFields(tab).forEach(el => { fields[el.id] = el.type === 'checkbox' ? el.checked : el.value; });
  return { v: 1, fields: fields, rows: TA_BUILDER_ROWS[tab].get() };
}

function taRestoreBuilder(tab, state) {
  if (!state || !TA_BUILDER_ROWS[tab]) return;
  const fields = state.fields || {};
  const changed = [];
  Object.keys(fields).forEach(id => {
    const el = document.getElementById(id);
    if (!el || el.type === 'file') return;
    if (el.type === 'checkbox') el.checked = !!fields[id];
    else if (el.tagName === 'SELECT') {
      if (Array.from(el.options).some(o => o.value === String(fields[id]))) { el.value = fields[id]; changed.push(el); }
    } else el.value = fields[id];
  });
  // Selects that show or hide other settings (design, quiz mode, number of options…)
  changed.forEach(el => el.dispatchEvent(new Event('change')));
  // hidden fields (like the Sentences picture) update what shows them
  Object.keys(fields).forEach(id => { const el = document.getElementById(id); if (el && el.type === 'hidden') el.dispatchEvent(new Event('change')); });
  TA_BUILDER_ROWS[tab].set(state.rows);
}

/* What counts as "work": typed text and rows. Settings left on their
   defaults don't, so an untouched builder never makes a draft. */
function taBuilderSignature(tab, state) {
  if (!state) return '';
  const texts = {};
  taBuilderFields(tab).forEach(el => {
    if (el.type === 'hidden' || el.type === 'checkbox' || el.type === 'number' || el.tagName === 'SELECT') return;
    const v = String(state.fields[el.id] == null ? '' : state.fields[el.id]).trim();
    if (v) texts[el.id] = v;
  });
  // presentation elements get new ids each time; they aren't content
  return JSON.stringify(texts) + JSON.stringify(state.rows).replace(/"id":"e\d+",?/g, '');
}

function taDescribeState(tab, state) {
  const titleId = Object.keys(state.fields || {}).find(id => /-title$/.test(id) && state.fields[id]);
  const rows = state.rows;
  let count = 0, noun = 'item';
  if (tab === 'presentation' && rows) { count = rows.slides.length; noun = 'slide'; }
  else if (tab === 'bilingual') { count = (rows || []).reduce((n, p) => n + p.sentences.length, 0); noun = 'sentence'; }
  else if (tab === 'jungle' || tab === 'bamboozle') { count = (rows || []).length; noun = 'question'; }
  else if (/ielts-/.test(tab)) { count = (rows || []).reduce((n, part) => n + part.filter(g => g[1].trim()).length, 0); noun = 'question group'; }
  else if (Array.isArray(rows)) {
    count = rows.length;
    noun = (tab === 'wordorder' || tab === 'test') ? 'sentence' : 'word';
  }
  const bits = [];
  if (titleId) bits.push('“' + state.fields[titleId] + '”');
  if (count) bits.push(count + ' ' + noun + (count === 1 ? '' : 's'));
  return bits.join(' · ');
}

function taTimeAgo(ms) {
  const min = Math.round((Date.now() - ms) / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return min + ' min ago';
  const h = Math.round(min / 60);
  if (h < 24) return h + ' hour' + (h === 1 ? '' : 's') + ' ago';
  const d = Math.round(h / 24);
  return d + ' day' + (d === 1 ? '' : 's') + ' ago';
}

/* ---------- your usual settings ----------
   Points, time limit, design, quiz type… are remembered per exercise type
   from the last one you made, so a new exercise starts the way you like.
   Only settings, never content (title, words, instructions). */
const LS_BUILDER_DEFAULTS = 'ta_builder_defaults'; // { tab: { fieldId: value } }
function taIsSettingField(el) {
  if (el.classList.contains('ta-no-remember')) return false;
  return el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'number';
}
function taGetDefaults() {
  try { return JSON.parse(localStorage.getItem(LS_BUILDER_DEFAULTS) || '{}') || {}; } catch (e) { return {}; }
}
function taRememberSettings(tab) {
  if (!TA_BUILDER_ROWS[tab]) return;
  const mine = {};
  taBuilderFields(tab).forEach(el => { if (taIsSettingField(el)) mine[el.id] = el.type === 'checkbox' ? el.checked : el.value; });
  const all = taGetDefaults();
  all[tab] = mine;
  try { localStorage.setItem(LS_BUILDER_DEFAULTS, JSON.stringify(all)); } catch (e) { /* ignore */ }
}
function taApplySettings(tab) {
  const mine = taGetDefaults()[tab];
  if (!mine) return;
  taRestoreBuilder(tab, { v: 1, fields: mine, rows: TA_BUILDER_ROWS[tab].get() });
}

/* ---------- drafts ---------- */
const LS_BUILDER_DRAFTS = 'ta_builder_drafts'; // { tab: { state, at } }
const taPristine = {};      // tab -> signature of the empty form
const taLastSaved = {};     // tab -> JSON last written as a draft (or turned into an exercise)
const taDraftMine = {};     // tab -> this visit wrote the tab's draft

function taGetDrafts() {
  try { return JSON.parse(localStorage.getItem(LS_BUILDER_DRAFTS) || '{}') || {}; } catch (e) { return {}; }
}
function taSetDraft(tab, state) {
  const drafts = taGetDrafts();
  if (state) drafts[tab] = { state: state, at: Date.now() }; else delete drafts[tab];
  try { localStorage.setItem(LS_BUILDER_DRAFTS, JSON.stringify(drafts)); return true; }
  catch (e) { return false; } // too big for the browser's storage (large pictures): nothing else breaks
}

function taIsEmptyBuilder(tab, state) {
  return taBuilderSignature(tab, state) === taPristine[tab];
}

function taAutosaveBuilder(tab) {
  if (!TA_BUILDER_ROWS[tab] || taPristine[tab] === undefined) return;
  const state = taCaptureBuilder(tab);
  if (taIsEmptyBuilder(tab, state)) {
    // emptied by hand: the old draft is no longer wanted (unless it's waiting in the banner)
    if (taDraftMine[tab]) { taSetDraft(tab, null); taDraftMine[tab] = false; taLastSaved[tab] = null; }
    return;
  }
  const json = JSON.stringify(state);
  if (json === taLastSaved[tab]) return;
  taHideDraftBanner(tab); // new work replaces the offered draft
  if (taSetDraft(tab, state)) { taLastSaved[tab] = json; taDraftMine[tab] = true; }
}

function taActiveSavedTab() {
  return TA_BUILDER_ROWS[currentActiveTab] ? currentActiveTab : null;
}
setInterval(function () { const t = taActiveSavedTab(); if (t) taAutosaveBuilder(t); }, 2500);
function taFlushDraft() { const t = taActiveSavedTab(); if (t) taAutosaveBuilder(t); }
document.addEventListener('visibilitychange', function () { if (document.hidden) taFlushDraft(); });
window.addEventListener('pagehide', taFlushDraft);

function taHideDraftBanner(tab) {
  const el = document.getElementById('draftBanner-' + tab);
  if (el) el.remove();
}
function taShowDraftBanner(tab, draft) {
  taHideDraftBanner(tab);
  const panel = document.getElementById('panel-' + tab);
  if (!panel) return;
  const bar = document.createElement('div');
  bar.className = 'draft-banner';
  bar.id = 'draftBanner-' + tab;
  const what = taDescribeState(tab, draft.state);
  bar.innerHTML = '<span class="draft-banner-icon" aria-hidden="true">📝</span>' +
    '<div class="draft-banner-text"><b>You have unfinished work here</b>' +
    '<span>' + escapeForHtml((what ? what + ' · ' : '') + 'saved ' + taTimeAgo(draft.at)) + '</span></div>' +
    '<div class="draft-banner-btns">' +
      '<button type="button" class="mini-btn solid">Restore</button>' +
      '<button type="button" class="mini-btn">Discard</button>' +
    '</div>';
  const btns = bar.querySelectorAll('button');
  btns[0].onclick = function () {
    taRestoreBuilder(tab, draft.state);
    taLastSaved[tab] = JSON.stringify(taCaptureBuilder(tab));
    taDraftMine[tab] = true;
    bar.remove();
    showToast('✅ Your unfinished work is back.' + (TA_MEDIA_PREFIX[tab] ? ' Choose the audio/video file again.' : ''), 'ok');
  };
  btns[1].onclick = function () {
    taSetDraft(tab, null);
    bar.remove();
    showUndoToast('Draft discarded.', function () { taSetDraft(tab, draft.state); taShowDraftBanner(tab, draft); });
  };
  panel.insertBefore(bar, panel.firstChild);
}

/* ---------- "Use again" from My Exercises ---------- */
const SS_BUILDER_LOAD = 'ta_builder_load'; // { tab, state, title } waiting for its builder to open

function taLoadIntoBuilder(tab, state, label) {
  const before = taCaptureBuilder(tab);
  const hadWork = !taIsEmptyBuilder(tab, before);
  taRestoreBuilder(tab, state);
  taHideDraftBanner(tab);
  const msg = '✏️ "' + label + '" is ready to edit.' + (TA_MEDIA_PREFIX[tab] ? ' Choose the audio/video file again.' : '');
  if (hadWork) showUndoToast(msg, function () { taRestoreBuilder(tab, before); });
  else showToast(msg, 'ok');
}

function taOnBuilderOpened(tab) {
  taFillGroupSelect(tab); // groups may have changed since
  if (taPristine[tab] === undefined) {
    taApplySettings(tab); // first time this visit: start from the teacher's usual settings
    taPristine[tab] = taBuilderSignature(tab, taCaptureBuilder(tab));
  }
  let pending = null;
  try { pending = JSON.parse(sessionStorage.getItem(SS_BUILDER_LOAD) || 'null'); } catch (e) { pending = null; }
  if (pending && pending.tab === tab) {
    try { sessionStorage.removeItem(SS_BUILDER_LOAD); } catch (e) { /* ignore */ }
    taLoadIntoBuilder(tab, pending.state, pending.title || 'Exercise');
    return;
  }
  const draft = taGetDrafts()[tab];
  if (!draft || document.getElementById('draftBanner-' + tab)) return;
  const now = taCaptureBuilder(tab);
  // Only offer it when the builder is empty; work already on screen is newer.
  if (taIsEmptyBuilder(tab, now) && !taIsEmptyBuilder(tab, draft.state)) taShowDraftBanner(tab, draft);
}

/* ---------- which group an exercise is for ----------
   Every builder gets a "For group" picker under its title. The group is
   saved with the exercise, so My Exercises can show and filter by it. */
function taGroupSelectId(tab) { return 'grp-' + tab; }
function taMountGroupPickers() {
  TA_SAVED_TABS.forEach(tab => {
    const panel = document.getElementById('panel-' + tab);
    const title = panel && panel.querySelector('input[id$="-title"]');
    const field = title && title.closest('.title-field');
    if (!field || document.getElementById(taGroupSelectId(tab))) return;
    const box = document.createElement('div');
    box.className = 'title-field';
    box.innerHTML = '<label class="field-label" for="' + taGroupSelectId(tab) + '">Group</label>' +
      '<select id="' + taGroupSelectId(tab) + '" class="ta-no-remember ta-group-select"></select>';
    field.after(box);
    taFillGroupSelect(tab);
  });
}
function taFillGroupSelect(tab) {
  const sel = document.getElementById(taGroupSelectId(tab));
  if (!sel) return;
  const keep = sel.value;
  sel.innerHTML = '<option value="">— Any group —</option>' +
    getStudentGroups().map(g => '<option value="' + escapeForHtml(g.id) + '" translate="no">' + escapeForHtml(g.name) + '</option>').join('');
  if (Array.from(sel.options).some(o => o.value === keep)) sel.value = keep;
}
function taBuilderGroup(tab) {
  const sel = document.getElementById(taGroupSelectId(tab));
  return sel ? sel.value : '';
}

// Called at page start, after the builders' own tab hooks are registered.
function taWireSavedWork() {
  TA_SAVED_TABS.forEach(taWireSavedTab);
}
function taWireSavedTab(tab) {
  const before = TA_TAB_HOOKS[tab];
  taOnTab(tab, function () {
    if (before) before();
    taOnBuilderOpened(tab);
  });
}

/* "Use again" on a Homework/Class set: every round is rebuilt from its
   saved form, and the last one is left open to check or change, then add
   more or create. Builders used by the earlier rounds get their own work
   back afterwards. */
function taLoadSet(pending) {
  const rounds = (pending.rounds || []).filter(r => HWC_TYPES.some(t => t.key === r.tab));
  if (!rounds.length) return;
  openHwcBuilder(pending.kind === 'class' ? 'class' : 'homework');
  const titleEl = document.getElementById('hwcSetTitle');
  if (titleEl) titleEl.value = pending.setTitle || '';
  const previous = {};
  for (let i = 0; i < rounds.length; i++) {
    const r = rounds[i];
    if (!(r.tab in previous)) previous[r.tab] = taCaptureBuilder(r.tab);
    selectHwcType(r.tab);
    taRestoreBuilder(r.tab, r.state);
    if (i === rounds.length - 1) break;
    if (!hwcCaptureCurrentRound()) {
      showToast('Round ' + (i + 1) + ' needs a look before it can be added — check it, then press ➕ Add Another Exercise.');
      return;
    }
    hwcRestoreCard();
  }
  const last = rounds[rounds.length - 1].tab;
  Object.keys(previous).forEach(tab => { if (tab !== last) taRestoreBuilder(tab, previous[tab]); });
  showToast('📚 "' + (pending.title || 'Set') + '" reopened: ' + (rounds.length - 1) + ' round' + (rounds.length === 2 ? '' : 's') +
    ' added, the last one is open to check. Then add more or press Create.', 'ok');
}

(function () {
  const before = TA_TAB_HOOKS.createpicker;
  taOnTab('createpicker', function () {
    if (before) before();
    let pending = null;
    try { pending = JSON.parse(sessionStorage.getItem(SS_BUILDER_LOAD) || 'null'); } catch (e) { pending = null; }
    if (!pending || !pending.set) return;
    try { sessionStorage.removeItem(SS_BUILDER_LOAD); } catch (e) { /* ignore */ }
    taLoadSet(pending);
  });
})();

/* A new exercise keeps its form for "Use again", and its draft is done with. */
window.taSnapshotForMyExercises = function () {
  const tab = taActiveSavedTab() ||
    (currentActiveTab === 'hwcround' && hwcCurrentType && TA_BUILDER_ROWS[hwcCurrentType.key] ? hwcCurrentType.key : null);
  if (!tab) return null;
  taRememberSettings(tab);
  const state = taCaptureBuilder(tab);
  const json = JSON.stringify(state);
  taSetDraft(tab, null);
  taDraftMine[tab] = false;
  taLastSaved[tab] = json; // the same form isn't saved again as a draft
  // big pictures in a presentation: too large to keep in the list
  return { tab: tab, state: json.length > 300000 ? null : state, groupId: taBuilderGroup(tab) };
};

/* ---------- Reset All: straight away, with Undo ---------- */
[
  ['wordorder', 'resetWordOrderForm'], ['makeaword', 'resetMakeAWordForm'], ['flashcard', 'resetFlashcardForm'],
  ['presentation', 'resetPresentationForm'], ['pronunciation', 'resetPronunciationForm'], ['sentences', 'resetSentencesForm'],
  ['bilingual', 'resetBilingualForm'], ['engcontent', 'resetEnglishContentForm'], ['dictation', 'resetDictationForm'], ['jungle', 'resetJungleForm'], ['bamboozle', 'resetBamboozleForm'],
  ['ielts-listening', 'resetIeltsListeningForm'], ['ielts-reading', 'resetIeltsReadingForm'], ['ielts-writing', 'resetIeltsWritingForm'],
  ['spelling', 'resetSpellingForm'], ['canknock', 'resetCanKnockForm'], ['cargame', 'resetCarGameForm'], ['test', 'resetTestForm']
].forEach(function (pair) {
  const tab = pair[0], reset = window[pair[1]];
  window[pair[1]] = function () {
    const before = taCaptureBuilder(tab);
    const media = TA_MEDIA_PREFIX[tab];
    const file = media ? TA_MEDIA_FILES[media] : null, b64 = media ? TA_MEDIA_B64[media] : null;
    reset();
    taApplySettings(tab); // cleared back to the teacher's usual settings, not the factory ones
    showUndoToast('Form cleared.', function () {
      taRestoreBuilder(tab, before);
      if (file) {
        TA_MEDIA_FILES[media] = file;
        if (b64) TA_MEDIA_B64[media] = b64;
        const linkInput = document.getElementById(media === 'ec' ? 'ec-youtube' : 'dc-audio');
        if (linkInput) { linkInput.value = ''; linkInput.disabled = true; linkInput.placeholder = 'Using the file you chose'; }
        renderMediaFileName(media);
      }
      showToast('Everything is back.', 'ok');
    });
  };
});


/* ================= USE THE SAME WORDS IN ANOTHER EXERCISE =================
   Each list builder has a "Use these words in…" bar. It carries the list
   (and the title, if the other builder has none) into another builder, so
   20 flashcard words become a Spelling or Make a Word exercise without
   typing them again. Words go to word builders, sentences to sentence
   builders. Words already in the other builder aren't added twice. */
const TA_JUMP = {
  flashcard:     { p: 'fc', kind: 'word',     noun: 'words',     read: r => ({ w: r[0], tr: r[1] }), row: it => [it.w, it.tr || ''] },
  spelling:      { p: 'sp', kind: 'word',     noun: 'words',     read: r => ({ w: r[0] }),           row: it => [it.w, []] },
  canknock:      { p: 'ck', kind: 'word',     noun: 'words',     read: r => ({ w: r[0], tr: r[1] }), row: it => [it.w, it.tr || ''] },
  cargame:       { p: 'cg', kind: 'word',     noun: 'words',     read: r => ({ w: r[0], tr: r[1] }), row: it => [it.w, it.tr || ''] },
  makeaword:     { p: 'maw', kind: 'word',    noun: 'words',     read: r => ({ w: r }),              row: it => it.w },
  pronunciation: { p: 'pr', kind: 'word',     noun: 'words',     read: r => ({ w: r[0] }),           row: it => [it.w, '', ''] },
  sentences:     { p: 'sn', kind: 'word',     noun: 'words',     read: r => ({ w: r }),              row: it => it.w },
  wordorder:     { p: 'wo', kind: 'sentence', noun: 'sentences', read: r => ({ w: r }),              row: it => it.w },
  test:          { p: 'ts', kind: 'sentence', noun: 'sentences', read: r => ({ w: r.s }),            row: it => ({ s: it.w, gap: -1, wrongs: [] }) }
};

function taJumpItems(tab) {
  const rows = TA_BUILDER_ROWS[tab].get() || [];
  return rows.map(TA_JUMP[tab].read)
    .map(it => Object.assign(it, { w: String(it.w || '').trim(), tr: String(it.tr || '').trim() }))
    .filter(it => it.w);
}

function taJumpTo(from, to) {
  if (currentActiveTab === 'hwcround' && hwcCurrentType && hwcCurrentType.key === from) { taHwcJumpTo(from, to); return; }
  if (currentActiveTab !== from) return;
  const items = taJumpItems(from);
  if (!items.length) { showToast('Add some ' + TA_JUMP[from].noun + ' first.'); return; }
  const target = TA_JUMP[to];

  switchTo(to);
  const before = taCaptureBuilder(to);
  const key = s => s.toLowerCase().replace(/\s+/g, ' ');
  const have = new Set(taJumpItems(to).map(it => key(it.w)));
  const adding = [];
  items.forEach(it => { if (!have.has(key(it.w))) { have.add(key(it.w)); adding.push(it); } });

  const titleEl = document.getElementById(target.p + '-title');
  const fromTitle = document.getElementById(TA_JUMP[from].p + '-title');
  const tookTitle = titleEl && !titleEl.value.trim() && fromTitle && fromTitle.value.trim();
  if (tookTitle) titleEl.value = fromTitle.value.trim();
  const toGroup = document.getElementById(taGroupSelectId(to));
  if (toGroup && !toGroup.value && taBuilderGroup(from)) toGroup.value = taBuilderGroup(from);

  const label = TA_TAB_LABELS[to][1];
  if (!adding.length) {
    showToast('All of these ' + target.noun + ' are already in ' + label + '.', 'ok');
    return;
  }
  const rows = (TA_BUILDER_ROWS[to].get() || []).concat(adding.map(target.row));
  TA_BUILDER_ROWS[to].set(rows);
  taHideDraftBanner(to);
  const skipped = items.length - adding.length;
  let msg = '↪ ' + adding.length + ' ' + (adding.length === 1 ? target.noun.slice(0, -1) : target.noun) + ' added to ' + label +
    (skipped ? ' (' + skipped + ' already there)' : '') + '.';
  const untranslated = (to === 'flashcard' || to === 'canknock' || to === 'cargame') ? adding.filter(it => !it.tr).length : 0;
  if (untranslated) msg += ' Press 🌐 Fill empty translations to add ' + (untranslated === 1 ? 'its translation.' : 'the translations.');
  showUndoToast(msg, function () {
    taRestoreBuilder(to, before);
    showToast('Taken out of ' + label + ' again.', 'ok');
  });
  const firstNew = document.querySelectorAll('#panel-' + to + ' .rows > *')[rows.length - adding.length];
  if (firstNew && firstNew.scrollIntoView) firstNew.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* In a Homework/Class set the same bar adds this round to the set and
   starts the next round in the other exercise type, with the same words
   (and title) in place of whatever that builder held before. */
function taHwcJumpTo(from, to) {
  const items = taJumpItems(from);
  if (!items.length) { showToast('Add some ' + TA_JUMP[from].noun + ' first.'); return; }
  const fromTitleEl = document.getElementById(TA_JUMP[from].p + '-title');
  const title = fromTitleEl ? fromTitleEl.value.trim() : '';
  const fromGroup = taBuilderGroup(from);
  if (!hwcCaptureCurrentRound()) { showToast('Please finish filling in this exercise first — then its ' + TA_JUMP[from].noun + ' carry over.'); return; }
  const roundNum = hwcRounds.length;
  hwcRestoreCard();
  const before = taCaptureBuilder(to);
  selectHwcType(to);

  const target = TA_JUMP[to];
  const key = s => s.toLowerCase().replace(/\s+/g, ' ');
  const seen = new Set();
  const unique = items.filter(it => !seen.has(key(it.w)) && seen.add(key(it.w)));
  TA_BUILDER_ROWS[to].set(unique.map(target.row));
  const titleEl = document.getElementById(target.p + '-title');
  if (titleEl && title) titleEl.value = title;
  const toGroup = document.getElementById(taGroupSelectId(to));
  if (toGroup && fromGroup) toGroup.value = fromGroup;

  const label = TA_TAB_LABELS[to][1];
  let msg = 'Round ' + roundNum + ' added. Round ' + (roundNum + 1) + ': ' + label + ' with the same ' + unique.length + ' ' +
    (unique.length === 1 ? target.noun.slice(0, -1) : target.noun) + '.';
  if ((to === 'flashcard' || to === 'canknock' || to === 'cargame') && unique.some(it => !it.tr)) msg += ' Press 🌐 Fill empty translations to add the translations.';
  showUndoToast(msg, function () {
    // back to the round that was just added, as it was
    hwcRestoreCard();
    taRestoreBuilder(to, before);
    hwcRounds.pop();
    selectHwcType(from);
    showToast('Back to round ' + roundNum + '.', 'ok');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function taMountJumpBars() {
  Object.keys(TA_JUMP).forEach(from => {
    const compose = document.getElementById(TA_JUMP[from].p + '-compose');
    const anchor = compose && compose.parentNode;
    if (!anchor || document.getElementById('jumpBar-' + from)) return;
    const targets = Object.keys(TA_JUMP).filter(t => t !== from && TA_JUMP[t].kind === TA_JUMP[from].kind);
    const bar = document.createElement('div');
    bar.className = 'jump-bar';
    bar.id = 'jumpBar-' + from;
    bar.innerHTML = '<span class="jump-bar-label jump-solo">↪ Use these ' + TA_JUMP[from].noun + ' in</span>' +
      '<span class="jump-bar-label jump-hwc">↪ Next round with the same ' + TA_JUMP[from].noun + '</span>' +
      targets.map(t => '<button type="button" class="jump-chip" data-to="' + t + '">' + TA_TAB_LABELS[t][0] + ' ' + escapeForHtml(TA_TAB_LABELS[t][1]) + '</button>').join('');
    bar.addEventListener('click', e => {
      const b = e.target.closest('.jump-chip');
      if (b) taJumpTo(from, b.dataset.to);
    });
    anchor.parentNode.insertBefore(bar, anchor);
  });
}

/* ================= PAGE START ================= */
initPresBuilder();
taOnTab('ielts-listening', renderIeltsListeningParts);
taOnTab('ielts-reading', renderIeltsReadingParts);
taMountGroupPickers();
taWireSavedWork();
taMountJumpBars();
taStartPage('createpicker');
