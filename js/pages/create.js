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
  if (!confirm('Reset the Word Order form? This clears the title, instructions, and all sentences.')) return;
  document.getElementById('wo-title').value = '';
  const woIns = document.getElementById('wo-instructions'); if (woIns) woIns.value = '';
  const woPts = document.getElementById('wo-points'); if (woPts) woPts.value = '10';
  const woCompose = document.getElementById('wo-compose'); if (woCompose) woCompose.value = '';
  woRows.innerHTML = '';
  renumberRows(woRows);
  showToast('Word Order form reset.', 'ok');
}

/* ================= MAKE A WORD ROWS ================= */
const mawRows = document.getElementById('maw-rows');
function addMakeAWordRow() { makeSingleRow(mawRows, 'e.g. kitchen'); }
function addMakeAWordRowFilled(text) {
  const input = makeSingleRow(mawRows, 'e.g. kitchen');
  input.value = text;
}

function resetMakeAWordForm() {
  if (!confirm('Reset the Make a Word form? This clears the title, instructions, and all words.')) return;
  document.getElementById('maw-title').value = '';
  const mawIns = document.getElementById('maw-instructions'); if (mawIns) mawIns.value = '';
  const mawPts = document.getElementById('maw-points'); if (mawPts) mawPts.value = '10';
  const mawCompose = document.getElementById('maw-compose'); if (mawCompose) mawCompose.value = '';
  mawRows.innerHTML = '';
  renumberRows(mawRows);
  showToast('Make a Word form reset.', 'ok');
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
  if (!confirm('Reset the Flashcard form? This clears the title, instructions, settings, and all words.')) return;
  document.getElementById('fc-title').value = '';
  const fcIns = document.getElementById('fc-instructions'); if (fcIns) fcIns.value = '';
  document.getElementById('fc-points').value = '10';
  document.getElementById('fc-groups').value = '3';
  document.getElementById('fc-design').value = 'cards';
  document.getElementById('fc-seconds').value = '4';
  document.getElementById('fc-speed').value = 'auto';
  document.getElementById('fc-quiz-mode').value = 'choice';
  document.getElementById('fc-direction').value = 'uz2en';
  document.getElementById('fc-lose-progress').value = 'true';
  document.getElementById('fc-keep-progress-on-back').value = 'true';
  const fcCompose = document.getElementById('fc-compose'); if (fcCompose) fcCompose.value = '';
  if (window.onFlashcardDesignChange) onFlashcardDesignChange();
  if (window.onQuizModeChange) onQuizModeChange();
  fcRows.innerHTML = '';
  renumberRows(fcRows);
  showToast('Flashcard form reset.', 'ok');
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
  { key: 'pronunciation', label: 'Pronunciation', icon: '\ud83c\udf99\ufe0f', color: '#34d399', createFn: 'createPronunciation' },
  { key: 'spelling', label: 'Spelling', icon: '\ud83d\udd24', color: '#8b7bf7', img: 'spelling', createFn: 'createSpelling' },
  { key: 'test', label: 'Test', icon: '\u2705', color: '#ef5f74', createFn: 'createTest' },
  { key: 'sentences', label: 'Sentences', icon: '\u270d\ufe0f', color: '#4f9de0', img: 'sentences', createFn: 'createSentences' },
  { key: 'bilingual', label: 'Bidirectional Language', icon: '\ud83d\udcd6', color: '#2f6fd6', img: 'bilingual', createFn: 'createBilingualReader' },
  { key: 'engcontent', label: 'English Content', icon: '\ud83c\udfac', color: '#e14e4e', img: 'engcontent', createFn: 'createEnglishContent' },
  { key: 'dictation', label: 'Dictation', icon: '\ud83c\udfa7', color: '#8b5cf6', img: 'listening', createFn: 'createDictation' },
  { key: 'ielts-listening', label: 'IELTS Listening', icon: '\ud83c\udfa7', color: '#0ea5e9', img: 'listening', createFn: 'createIeltsListening' },
  { key: 'ielts-reading', label: 'IELTS Reading', icon: '\ud83d\udcd7', color: '#0ea5e9', createFn: 'createIeltsReading' }
];

let hwcKind = 'homework';
let hwcRounds = []; // { label, html, code } \u2014 code is round 1's own original code, carried through
let hwcCurrentType = null;
let hwcRoundOriginParent = null;
let hwcRoundOriginNext = null;

function openHwcBuilder(kind) {
  hwcKind = kind;
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
    hwcRounds.map((r, i) => '<span class="badge-type" style="margin:0 6px 6px 0; display:inline-block;">' + (i + 1) + '. ' + escapeForHtml(r.label) + '</span>').join('') +
    '</div></div>';
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
  switchTo('hwcround');
}

function hwcRestoreCard() {
  const host = document.getElementById('hwcRoundHost');
  const card = host ? host.firstElementChild : null;
  if (card && hwcRoundOriginParent) {
    const actions = card.querySelector('.builder-actions');
    if (actions) actions.style.display = '';
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
  window.downloadFile = function (filename, content) { captured = content; };
  try { window[hwcCurrentType.createFn](); } catch (e) { /* validation toast already shown by the builder itself */ }
  window.downloadFile = original;
  return captured;
}

function hwcCaptureCurrentRound() {
  const html = captureHwcRoundBuild();
  if (!html) return false;
  const codeMatch = html.match(/const REQUIRED_CODE = "([^"]*)"/);
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  hwcRounds.push({
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
  const rounds = hwcRounds.map(r => ({
    label: r.label,
    html: r.html.replace(/const REQUIRED_CODE = "[^"]*";/, 'const REQUIRED_CODE = "";'),
    code: (r.html.match(/const EXERCISE_CODE = "([^"]*)"/) || [])[1] || ''
  }));
  const mergedItems = hwcRounds.map(r => ({ title: r.label, typeLabel: r.label, html: r.html }));

  const title = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const requiredCode = hwcRounds[0].code || '';
  const code = generateClassCode();
  const classCode = setActiveClassCode(code);
  const hwcUid = generateExerciseUid();
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
<div class="ta-screen" id="hwcDone">
  <div class="ta-blob ta-blob1"></div>
  <div class="ta-blob ta-blob3"></div>
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
  import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
  const firebaseConfig = {apiKey: "AIzaSyCefg2YghdSneABh0ZOUu3-snO4soVw0lA", authDomain: "teachers-assistant-app-ccd1a.firebaseapp.com", projectId: "teachers-assistant-app-ccd1a", storageBucket: "teachers-assistant-app-ccd1a.firebasestorage.app", messagingSenderId: "185909682129", appId: "1:185909682129:web:21fd63e09809eac82d8af0", measurementId: "G-7P60GBSYEM"};
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  window.__hwcDb = db; window.__hwcCollection = collection; window.__hwcQuery = query; window.__hwcWhere = where;
  window.__hwcGetDocs = getDocs; window.__hwcAddDoc = addDoc; window.__hwcServerTimestamp = serverTimestamp;
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
    const q = window.__hwcQuery(window.__hwcCollection(window.__hwcDb, "results"), window.__hwcWhere("code", "==", HWC_CODE));
    const snap = await window.__hwcGetDocs(q);
    return snap.docs.map(d => d.data()).filter(v => v && v.type === "HWC_PROGRESS" && v.studentId === hwcStudentId);
  } catch (e) { return []; }
}
async function hwcSaveProgress() {
  if (!window.__hwcFirebaseReady) return;
  try {
    const timeSeconds = hwcRoundStartTs ? Math.max(1, Math.round((Date.now() - hwcRoundStartTs) / 1000)) : 0;
    await window.__hwcAddDoc(window.__hwcCollection(window.__hwcDb, "results"), {
      v: 1, code: HWC_CODE, boardCode: HWC_BOARD_CODE, type: "HWC_PROGRESS", title: HWC_TITLE, kind: HWC_KIND,
      studentId: hwcStudentId, name: hwcStudentName,
      roundIndex: hwcIdx, roundLabel: HWC_ROUNDS[hwcIdx].label, roundCode: HWC_ROUNDS[hwcIdx].code,
      totalCount: HWC_ROUNDS.length, timeSeconds: timeSeconds,
      date: new Date().toISOString(), submittedAt: window.__hwcServerTimestamp()
    });
  } catch (e) { /* ignore \u2014 student can still finish locally even if a write fails */ }
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
  const frame = document.getElementById("hwcFrame");
  frame.name = "ta_merge_identity:" + JSON.stringify({ id: hwcStudentId, name: hwcStudentName, code: HWC_REQUIRED_CODE });
  frame.srcdoc = HWC_ROUNDS[i].html;
  document.getElementById("hwcBar").style.display = "flex";
  document.getElementById("hwcFrame").style.display = "block";
  hwcRoundStartTs = Date.now();
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
  if (hwcIdx === -1) { hwcShow("hwcDone"); return; }
  hwcShow(null);
  hwcLoad(hwcIdx);
}
function hwcNext() {
  hwcIdx++;
  if (hwcIdx >= HWC_ROUNDS.length) { hwcShow("hwcDone"); return; }
  hwcShow(null);
  hwcLoad(hwcIdx);
}
window.addEventListener("message", function (e) {
  if (!(e && e.data && e.data.taMergeEvent === "round-complete")) return;
  if (e.data.identity && e.data.identity.name) hwcStudentName = e.data.identity.name;
  hwcCompleted[hwcIdx] = true;
  hwcSaveProgress();
  // Cover the screen immediately \u2014 this is what keeps the round's own
  // certificate from being shown; only the wrapper's own certificate, at
  // the very end of the whole set, is meant to be seen.
  if (hwcIdx >= HWC_ROUNDS.length - 1) { hwcNext(); return; }
  document.getElementById("hwcNextLabel").textContent = HWC_ROUNDS[hwcIdx + 1].label;
  document.getElementById("hwcNextSub").textContent = "Exercise " + (hwcIdx + 2) + " of " + HWC_ROUNDS.length + " \u2014 press start when you're ready.";
  hwcShow("hwcNextScreen");
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

  const fname = (hwcKind === 'class' ? 'Class_' : 'Homework_') + title.replace(/[^a-z0-9\-_ ]/gi, '').replace(/\s+/g, '_') + '.html';
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
    mergedItems: mergedItems
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
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
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
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
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
function onFlashcardDesignChange() {
  const runner = document.getElementById('fc-design').value === 'runner';
  document.getElementById('fc-runner-settings').style.display = runner ? 'block' : 'none';
  document.getElementById('fc-card-settings').style.display = runner ? 'none' : 'block';
}

function createFlashcardRunner(title, mode, code, pairs) {
  if (pairs.length < 4) { showToast('The car game needs at least 4 words, so every question has three different options.'); return; }

  const words = pairs.map(p => ({ w: p.en, t: p.uz }));
  const classCode = setActiveClassCode(code);
  const points = readPointsAward('fc');

  let html = FLASHCARD_GAME_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
  html = html.split('__WORD_COUNT__').join(String(words.length));
  html = html.split('__WORDS_JSON__').join(JSON.stringify(words));
  html = html.split('__ANSWER_SECONDS__').join(document.getElementById('fc-seconds').value);
  html = html.split('__SPEED_MODE__').join(document.getElementById('fc-speed').value);
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
  downloadFile(typedFilename('Flashcard', title, 'car-game'), html);
  showToast('"' + title + '" downloaded!' + (mode === 'code' ? ' Class code: ' + classCode : ''), 'ok');
}

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

  if (document.getElementById('fc-design').value === 'runner') {
    createFlashcardRunner(title, mode, code, pairs);
    return;
  }

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
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
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
  if (!confirm('Reset the Presentation form? This clears the title, instructions, and every slide.')) return;
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
  showToast('Presentation form reset.', 'ok');
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

  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
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
  if (!confirm('Reset the Pronunciation form? This clears the title, instructions, settings, and all words.')) return;
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
  showToast('Pronunciation form reset.', 'ok');
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
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
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
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
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

function resetSentencesForm() {
  if (!confirm('Reset the Sentences form? This clears the title, instructions, and all words.')) return;
  document.getElementById('sn-title').value = '';
  const snIns = document.getElementById('sn-instructions'); if (snIns) snIns.value = '';
  const snPts = document.getElementById('sn-points'); if (snPts) snPts.value = '10';
  const snCount = document.getElementById('sn-count'); if (snCount) snCount.value = '5';
  const snCompose = document.getElementById('sn-compose'); if (snCompose) snCompose.value = '';
  snRows.innerHTML = '';
  renumberRows(snRows);
  showToast('Sentences form reset.', 'ok');
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

  if (words.length === 0 && !instructions) {
    showToast('Add some words, or write instructions for a free-writing exercise.');
    return;
  }

  const welcomeSub = words.length > 0
    ? ('Write ' + words.length + ' sentence' + (words.length > 1 ? 's' : '') + ', one for each word below.')
    : ('Write ' + count + ' sentence' + (count > 1 ? 's' : '') + ' using your own ideas.');

  const classCode = setActiveClassCode(code);
  const points = readPointsAward('sn');
  let html = SENTENCES_TEMPLATE;
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
  html = html.split('__WORDS_JSON__').join(JSON.stringify(words));
  html = html.split('__SENTENCE_COUNT__').join(String(count));
  html = html.split('__TOP_INSTRUCTION__').join(escapeForHtml(instructions));
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

  pushRecentExercise({ title: title, typeLabel: 'Sentences', code: classCode, uid: __sn_uid, html: html, requiredCode: __requiredCode_sn, contentSummary: (words.length ? words.join('\n') : instructions) });
  downloadFile(typedFilename('Sentences', title, 'sentences'), html);
  showToast('"' + title + '" downloaded!', 'ok');
}

onFlashcardDesignChange();

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
  if (!confirm('Reset the Bidirectional Language form? This clears the title, text, and all translations.')) return;
  document.getElementById('br-title').value = '';
  document.getElementById('br-lang').value = 'uz';
  document.getElementById('br-text').value = '';
  brParagraphs = [];
  renderBilingualRows();
  showToast('Bidirectional Language form reset.', 'ok');
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
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
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
  if (!confirm('Reset the English Content form? This clears the title, video link, and settings.')) return;
  document.getElementById('ec-title').value = '';
  document.getElementById('ec-youtube').value = '';
  document.getElementById('ec-code').value = '';
  showToast('English Content form reset.', 'ok');
}

function createEnglishContent() {
  const title = document.getElementById('ec-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }
  const videoUrl = document.getElementById('ec-youtube').value.trim();
  if (!videoUrl) { showToast('Paste a video link first.'); return; }
  if (!/^https?:\/\//i.test(videoUrl)) { showToast("That doesn't look like a valid link — it should start with http:// or https://."); return; }

  const requiredCode = document.getElementById('ec-code').value.trim();
  const __timerMin_ec = parseFloat((document.getElementById('ec-timer') || {value:''}).value);
  const timeLimitMinutesEc = isNaN(__timerMin_ec) || __timerMin_ec <= 0 ? '0' : String(__timerMin_ec);

  const code = generateClassCode();
  const classCode = setActiveClassCode(code);
  const __ec_uid = generateExerciseUid();

  let html = ENGLISH_CONTENT_TEMPLATE;
  html = html.split('__TIME_LIMIT_MINUTES__').join(timeLimitMinutesEc);
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
  html = html.split('__EXERCISE_CODE__').join(classCode);
  html = html.split('__EXERCISE_UID__').join(__ec_uid);
  html = html.split('__BOARD_CODE__').join(getPointsBoardCode());
  html = html.split('__ROSTER_JSON__').join(JSON.stringify(getPointsRoster()));
  html = html.split('__POINTS_AWARD__').join('0');
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
  const audioUrl = document.getElementById('dc-audio').value.trim();
  if (!audioUrl) { showToast('Paste the audio link first.'); return; }

  const target = document.getElementById(targetFieldId);
  const originalLabel = btn.textContent;
  dcTranscribing = true;
  btn.textContent = '🤖 Transcribing…';
  btn.disabled = true;

  try {
    await loadPuterScript();
    const result = await window.puter.ai.speech2txt(audioUrl);
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
  if (!confirm('Reset the Dictation form? This clears the title, audio link, and text.')) return;
  document.getElementById('dc-title').value = '';
  document.getElementById('dc-audio').value = '';
  document.getElementById('dc-mode').value = 'free';
  document.getElementById('dc-reference').value = '';
  document.getElementById('dc-cloze-text').value = '';
  document.getElementById('dc-code').value = '';
  onDictationModeChange();
  showToast('Dictation form reset.', 'ok');
}

function createDictation() {
  const title = document.getElementById('dc-title').value.trim();
  if (!title) { showToast('Please enter a title for the exercise.'); return; }
  const audioUrl = document.getElementById('dc-audio').value.trim();
  if (!audioUrl) { showToast('Paste an audio link first.'); return; }
  if (!/^https?:\/\//i.test(audioUrl)) { showToast("That doesn't look like a valid link — it should start with http:// or https://."); return; }

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

  const code = generateClassCode();
  const classCode = setActiveClassCode(code);
  const __dc_uid = generateExerciseUid();

  let html = DICTATION_TEMPLATE;
  html = html.split('__TIME_LIMIT_MINUTES__').join(timeLimitMinutesDc);
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
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
  if (!confirm('Reset the IELTS Listening form? This clears the title and all 4 parts.')) return;
  document.getElementById('il-title').value = '';
  document.getElementById('il-code').value = '';
  [1, 2, 3, 4].forEach(n => {
    document.getElementById('il-part' + n + '-include').checked = false;
    document.getElementById('il-part' + n + '-audio').value = '';
    document.getElementById('il-part' + n + '-body').classList.remove('show');
    document.getElementById('il-part' + n + '-groups').innerHTML = '';
    addIeltsGroup('il', n);
  });
  showToast('IELTS Listening form reset.', 'ok');
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
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
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
  if (!confirm('Reset the IELTS Reading form? This clears the title and all 3 parts.')) return;
  document.getElementById('ir-title').value = '';
  document.getElementById('ir-code').value = '';
  [1, 2, 3].forEach(n => {
    document.getElementById('ir-part' + n + '-include').checked = false;
    document.getElementById('ir-part' + n + '-passage').value = '';
    document.getElementById('ir-part' + n + '-body').classList.remove('show');
    document.getElementById('ir-part' + n + '-groups').innerHTML = '';
    addIeltsGroup('ir', n);
  });
  showToast('IELTS Reading form reset.', 'ok');
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
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
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
  if (!confirm('Reset the IELTS Writing form? This clears the title, both prompts, and settings.')) return;
  document.getElementById('iw-title').value = '';
  document.getElementById('iw-code').value = '';
  document.getElementById('iw-task1-prompt').value = '';
  document.getElementById('iw-task1-minwords').value = '150';
  document.getElementById('iw-task2-prompt').value = '';
  document.getElementById('iw-task2-minwords').value = '250';
  document.getElementById('iw-show-feedback').value = 'on';
  showToast('IELTS Writing form reset.', 'ok');
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
  html = html.split('__EXERCISE_TITLE__').join(escapeForHtml(title));
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
  if (!confirm('Reset the Spelling form? This clears the title, instructions, settings, and all words.')) return;
  document.getElementById('sp-title').value = '';
  const spIns = document.getElementById('sp-instructions'); if (spIns) spIns.value = '';
  document.getElementById('sp-points').value = '10';
  document.getElementById('sp-voice').value = 'female';
  document.getElementById('sp-lang').value = 'en-US';
  const spCompose = document.getElementById('sp-compose'); if (spCompose) spCompose.value = '';
  spRows.innerHTML = '';
  renumberRows(spRows);
  updateSpCount();
  showToast('Spelling form reset.', 'ok');
}

function resetTestForm() {
  if (!confirm('Reset the Test form? This clears the title, instructions, settings, and all sentences.')) return;
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
  showToast('Test form reset.', 'ok');
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


/* ================= PAGE START ================= */
initPresBuilder();
taOnTab('ielts-listening', renderIeltsListeningParts);
taOnTab('ielts-reading', renderIeltsReadingParts);
taStartPage('createpicker');
