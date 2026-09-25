/* ================= PAGES & TAB SWITCHING =================
   Every sidebar section is its own HTML file. A "tab" is one panel; the Create
   page holds several (the picker plus every exercise builder). Moving between
   sections doesn't reload the app: taNavigate() fetches the other section's
   file once, adds its panels and scripts to this page, and switches to it
   (see PAGE NAVIGATION below). Opening any file directly still works too. */
const TA_PAGES = {
  main: 'index.html',
  createpicker: 'create.html',
  dashboard: 'statistics.html',
  myexercises: 'my-exercises.html',
  students: 'students.html',
  results: 'results.html',
  points: 'points.html',
  settings: 'settings.html'
};
const BUILDER_TABS = ['wordorder', 'makeaword', 'flashcard', 'presentation', 'pronunciation', 'spelling', 'test', 'sentences', 'bilingual', 'engcontent', 'dictation', 'ielts-listening', 'ielts-reading', 'ielts-writing', 'ielts-speaking'];
const READY_TABS = ['flashcard', 'wordorder', 'makeaword', 'spelling', 'sentences', 'bilingual', 'engcontent', 'dictation'];
const INPROCESS_TABS = ['presentation', 'pronunciation', 'test'];
const CREATE_TABS = READY_TABS.concat(INPROCESS_TABS);

function pageForTab(tab) {
  if (TA_PAGES[tab]) return TA_PAGES[tab];
  if (BUILDER_TABS.indexOf(tab) !== -1 || tab === 'hwcbuilder' || tab === 'hwcround') return TA_PAGES.createpicker;
  return TA_PAGES.main;
}

/* Each page script registers what to render when one of its panels is shown. */
const TA_TAB_HOOKS = {};
function taOnTab(tab, fn) { TA_TAB_HOOKS[tab] = fn; }

const MASTHEAD_COPY = {
  builderDefault: { eyebrow: "✎ Teacher's Assistant", title: "Build exercises in minutes", sub: "Type your content, hit create, and a ready-to-use interactive exercise downloads straight to your computer — no coding required." },
  createpicker: { eyebrow: "➕ Create", title: "Pick an exercise type", sub: "Ready to use, in process, or merge a few together — everything starts here." },
  hwcbuilder: { eyebrow: "📚 Homework & Class", title: "Build your set", sub: "Pick exercises from My Exercises, put them in order, then generate one combined file." },
  main: { eyebrow: "🎓 Teacher's Assistant", title: "Welcome back", sub: "Everything you need to build, share, and track classroom exercises." },
  dashboard: { eyebrow: "📊 Statistics", title: "Your classroom at a glance", sub: "See which exercise types get used the most, updated live from your Points Board." },
  myexercises: { eyebrow: "📁 My Exercises", title: "Everything you've built", sub: "Every exercise you've created in this browser — jump to its results, turn off its points, or remove it for good." },
  students: { eyebrow: "👥 Students", title: "Your class roster", sub: "Give each student a unique ID so they can earn points without typing a name or code." },
  results: { eyebrow: "📊 Results", title: "Student Results", sub: "Track your students' progress, view results and help them achieve their goals." },
  points: { eyebrow: "🏆 Points & Rewards", title: "Track and reward progress", sub: "A live leaderboard for every student, plus the ability to give or take bonus points yourself." },
  settings: { eyebrow: "⚙️ Settings", title: "Make it yours", sub: "Set your name, add a profile picture, and manage your weekly lesson schedule." }
};

function updateMasthead(tab) {
  const copy = MASTHEAD_COPY[tab] || MASTHEAD_COPY.builderDefault;
  const eyebrowEl = document.getElementById('mastheadEyebrow');
  const titleEl = document.getElementById('mastheadTitle');
  const subEl = document.getElementById('mastheadSubtitle');
  if (eyebrowEl) eyebrowEl.textContent = copy.eyebrow;
  if (titleEl) titleEl.textContent = copy.title;
  if (subEl) subEl.textContent = copy.sub;
}

/* ================= SOUND EFFECTS ================= */
let __taAudioCtx = null;
function taGetAudioCtx() {
  try {
    if (!__taAudioCtx) __taAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (__taAudioCtx.state === 'suspended') __taAudioCtx.resume();
    return __taAudioCtx;
  } catch (e) { return null; }
}
function taBeep(freq, dur, type, vol) {
  const ctx = taGetAudioCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol || 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch (e) { /* ignore */ }
}
const LS_SOUND_ENABLED = 'ta_sound_enabled';
function taSoundEnabled() {
  try { return localStorage.getItem(LS_SOUND_ENABLED) !== 'off'; } catch (e) { return true; }
}
function setSoundEnabled(on) {
  try { localStorage.setItem(LS_SOUND_ENABLED, on ? 'on' : 'off'); } catch (e) { /* ignore */ }
  updateSoundToggleUI();
  if (on) taBeep(880, 0.08, 'triangle', 0.14);
}
// The speaker button at the top of Main.
function updateSoundToggleUI() {
  const btn = document.getElementById('soundToggleBtn');
  if (!btn) return;
  const on = taSoundEnabled();
  const label = on ? 'Sound effects: On' : 'Sound effects: Off';
  btn.textContent = on ? '🔊' : '🔇';
  btn.title = label;
  btn.setAttribute('aria-label', label);
  btn.classList.toggle('muted', !on);
}
function taSuccessChime() {
  if (!taSoundEnabled()) return;
  [880, 1175].forEach((f, i) => setTimeout(() => taBeep(f, 0.16, 'triangle', 0.13), i * 90));
}
function taErrorBuzz() {
  if (!taSoundEnabled()) return;
  [220, 165].forEach((f, i) => setTimeout(() => taBeep(f, 0.16, 'square', 0.09), i * 90));
}
function taPointsChime() {
  if (!taSoundEnabled()) return;
  [988, 1319, 1568].forEach((f, i) => setTimeout(() => taBeep(f, 0.2, 'triangle', 0.15), i * 70));
}
const TA_CONFETTI_COLORS = ['#8B87FF', '#F5B301', '#4F7EE3', '#2ACBC5', '#D85A86', '#45AF6E', '#E5814D'];
function taConfettiBurst(x, y, count) {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const n = count || 26;
    for (let i = 0; i < n; i++) {
      const piece = document.createElement('div');
      piece.className = 'ta-confetti-piece';
      const color = TA_CONFETTI_COLORS[i % TA_CONFETTI_COLORS.length];
      piece.style.background = color;
      if (Math.random() < 0.4) piece.style.borderRadius = '50%';
      const angle = (Math.random() * Math.PI * 2);
      const dist = 60 + Math.random() * 120;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 40;
      const rot = (Math.random() * 720 - 360) + 'deg';
      const dur = 700 + Math.random() * 500;
      piece.style.left = x + 'px';
      piece.style.top = y + 'px';
      piece.style.transform = 'translate(-50%, -50%)';
      piece.style.opacity = '1';
      piece.style.animation = 'taConfettiFall ' + dur + 'ms ease-out forwards';
      document.body.appendChild(piece);
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / dur);
        const ease = 1 - Math.pow(1 - t, 2);
        const curX = x + dx * ease;
        const curY = y + dy * (1 - Math.pow(1 - t, 3)) + (t * t) * 140;
        piece.style.left = curX + 'px';
        piece.style.top = curY + 'px';
        piece.style.transform = 'translate(-50%, -50%) rotate(' + (parseFloat(rot) * t) + 'deg)';
        if (t < 1) requestAnimationFrame(step); else piece.remove();
      }
      requestAnimationFrame(step);
    }
  } catch (e) { /* ignore */ }
}

let currentActiveTab = 'main';
function toggleSidebar() {
  if (currentActiveTab === 'main') return; // sidebar always stays visible on the Main section
  const sidebar = document.getElementById('mainSidebar');
  if (sidebar) sidebar.classList.toggle('collapsed');
  if (typeof syncSidebarHamburgerIcon === 'function') syncSidebarHamburgerIcon(true);
}

function switchTo(tab) {
  const panel = document.getElementById('panel-' + tab);
  if (!panel) {
    const page = pageForTab(tab);
    if (page === taCurrentPageFile()) return; // it isn't on this page either
    taNavigate(page + (TA_PAGES[tab] === page ? '' : '#' + tab));
    return;
  }
  currentActiveTab = tab;
  // Keep the address bar and tab title on the section being shown.
  const page = pageForTab(tab);
  if (taStarted && page !== taCurrentPageFile()) history.pushState(null, '', taAddressFor(page));
  if (TA_PAGE_TITLES[page]) document.title = TA_PAGE_TITLES[page];
  document.body.classList.toggle('main-hero-active', tab === 'main');
  if (tab === 'main') {
    const sidebar = document.getElementById('mainSidebar');
    if (sidebar) sidebar.classList.remove('collapsed');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    if (toggleBtn) toggleBtn.style.visibility = 'hidden';
  } else {
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    if (toggleBtn) toggleBtn.style.visibility = 'visible';
    if (typeof syncSidebarHamburgerIcon === 'function') syncSidebarHamburgerIcon(false);
  }
  document.querySelectorAll('.tab-btn, .side-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

  document.querySelectorAll('[data-tab="' + tab + '"]').forEach(b => b.classList.add('active'));
  panel.classList.add('active');
  updateMasthead(tab);

  const isBuilder = BUILDER_TABS.indexOf(tab) !== -1;
  const subRow = document.getElementById('subTabRow');
  if (subRow) subRow.style.display = isBuilder ? '' : 'none';
  const readyRow = document.getElementById('readyTabRow');
  const inprocessRow = document.getElementById('inprocessTabRow');
  const isReady = READY_TABS.indexOf(tab) !== -1;
  const isInProcess = INPROCESS_TABS.indexOf(tab) !== -1;
  if (readyRow) readyRow.style.display = isReady ? '' : 'none';
  if (inprocessRow) inprocessRow.style.display = isInProcess ? '' : 'none';
  if (CREATE_TABS.indexOf(tab) !== -1 || tab === 'hwcbuilder') {
    document.querySelectorAll('[data-tab="createpicker"]').forEach(b => b.classList.add('active'));
  }

  if (TA_TAB_HOOKS[tab]) TA_TAB_HOOKS[tab]();

  // Keep the AI robot's FAQ bubble in sync with whichever section is now active.
  if (typeof aiRobotBubbleOpen !== 'undefined' && aiRobotBubbleOpen) renderAiRobotQuestionList();
}

// Builder tabs on the Create page are buttons that switch panels; sidebar
// entries are links to the other sections, opened in place by taNavigate().
// Listening on the document also covers sections added later.
document.addEventListener('click', function (e) {
  const btn = e.target.closest('button.tab-btn[data-tab], button.side-btn[data-tab]');
  if (btn) { switchTo(btn.dataset.tab); return; }
  const link = e.target.closest('a.side-btn[href]');
  if (!link || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  taNavigate(link.getAttribute('href'));
});

/* ================= PAGE NAVIGATION (no reloads) ================= */
// On GitHub Pages the address bar shows clean names (…/students instead of
// …/students.html); GitHub serves students.html for both. Other hosts (and
// files opened from disk) keep the .html names so refreshing still works.
const TA_CLEAN_URLS = /\.github\.io$/.test(location.hostname);

// "students", "students.html" or "" (the site root) -> "students.html"
function taPageFileFromPath(pathname) {
  const last = decodeURIComponent(pathname.split('/').pop() || '');
  if (!last) return 'index.html';
  return /\.html$/.test(last) ? last : last + '.html';
}
function taCurrentPageFile() { return taPageFileFromPath(location.pathname); }

function taAddressFor(file, search, hash) {
  const name = TA_CLEAN_URLS ? file.replace(/\.html$/, '') : file;
  return name + (search || '') + (hash || '');
}

// Sections whose panels and scripts are already on this page.
const TA_LOADED_PAGES = new Set();
const TA_PAGE_TITLES = {};
const TA_PAGE_HTML = {};
function taFetchPage(file) {
  if (!TA_PAGE_HTML[file]) {
    TA_PAGE_HTML[file] = fetch(file).then(r => {
      if (!r.ok) throw new Error(file + ': ' + r.status);
      return r.text();
    });
    TA_PAGE_HTML[file].catch(() => { delete TA_PAGE_HTML[file]; });
  }
  return TA_PAGE_HTML[file];
}

function taLoadScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.async = false;
    el.onload = resolve;
    el.onerror = () => reject(new Error('Could not load ' + src));
    document.body.appendChild(el);
  });
}

// Adds another section's panels, pop-ups and scripts to this page.
async function taLoadPage(file) {
  const doc = new DOMParser().parseFromString(await taFetchPage(file), 'text/html');
  const wrap = document.querySelector('.main-content .wrap');
  doc.querySelectorAll('.main-content .wrap > *:not(.masthead)').forEach(el => {
    if (!el.id || !document.getElementById(el.id)) wrap.appendChild(document.importNode(el, true));
  });
  Array.from(doc.body.children).forEach(el => {
    if (el.id && el.tagName !== 'SCRIPT' && !document.getElementById(el.id)) document.body.appendChild(document.importNode(el, true));
  });
  const have = new Set(Array.from(document.scripts).map(sc => sc.src));
  for (const sc of doc.querySelectorAll('script[src]:not([type="module"])')) {
    const src = new URL(sc.getAttribute('src'), location.href).href;
    if (!have.has(src)) await taLoadScript(src);
  }
  TA_PAGE_TITLES[file] = doc.title;
  TA_LOADED_PAGES.add(file);
}

let taNavigateBusy = null;
async function taNavigate(url, fromHistory) {
  const target = new URL(url, location.href);
  const file = taPageFileFromPath(target.pathname);
  if (!TA_PAGES_FILES.has(file)) { location.href = target.href; return; }
  const myTurn = taNavigateBusy = {};
  if (!TA_LOADED_PAGES.has(file)) {
    document.body.classList.add('ta-page-loading');
    try { await taLoadPage(file); }
    catch (e) { location.href = target.href; return; } // fall back to a normal page load
    finally { document.body.classList.remove('ta-page-loading'); }
  }
  if (myTurn !== taNavigateBusy) return; // the teacher already clicked somewhere else
  if (!fromHistory) history.pushState(null, '', taAddressFor(file, target.search, target.hash));
  const hashTab = decodeURIComponent(target.hash.slice(1));
  const defaultTab = Object.keys(TA_PAGES).find(t => TA_PAGES[t] === file);
  switchTo(hashTab && document.getElementById('panel-' + hashTab) ? hashTab : defaultTab);
  if (!fromHistory) window.scrollTo(0, 0);
}
const TA_PAGES_FILES = new Set(Object.values(TA_PAGES));

window.addEventListener('popstate', function () { taNavigate(location.href, true); });

// Once the app is idle, quietly download the other sections so opening them is instant.
function taPrefetchPages() {
  const scripts = new Set(Array.from(document.scripts).map(sc => sc.src));
  TA_PAGES_FILES.forEach(file => {
    if (TA_LOADED_PAGES.has(file)) return;
    taFetchPage(file).then(html => {
      new DOMParser().parseFromString(html, 'text/html').querySelectorAll('script[src]:not([type="module"])').forEach(sc => {
        const src = new URL(sc.getAttribute('src'), location.href).href;
        if (scripts.has(src)) return;
        scripts.add(src);
        const link = document.createElement('link');
        link.rel = 'prefetch'; link.as = 'script'; link.href = src;
        document.head.appendChild(link);
      });
    }).catch(() => { /* it'll load normally when opened */ });
  });
}

/* ================= TOAST ================= */
let toastTimeout = null;
function showToast(message, kind) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.className = 'toast show' + (kind === 'ok' ? ' ok' : '');
  if (kind === 'ok') taSuccessChime(); else taErrorBuzz();
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ================= DOWNLOAD HELPER ================= */
// Exercise files load their login animation from this site, so every
// downloaded file gets the site's address (e.g. https://…github.io/teachers_assistant/).
// Opened from disk the app has no web address, and the files keep the 🔐 instead.
const TA_APP_URL = /^https?:$/.test(location.protocol) ? new URL('.', location.href).href : '';

function downloadFile(filename, content) {
  content = content.split('__TA_APP_URL__').join(TA_APP_URL);
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function safeFilename(title, fallback) {
  const base = (title || fallback).trim().replace(/[^a-z0-9\-_ ]/gi, '').replace(/\s+/g, '_');
  return (base || fallback) + '.html';
}

/* Exercise-type-labelled filename, e.g. "Flashcard_Animals.html" */
function typedFilename(typeLabel, title, fallback) {
  const base = (title || fallback).trim().replace(/[^a-z0-9\-_ ]/gi, '').replace(/\s+/g, '_');
  return (base || fallback) + '.html';
}

function taParsePointsDoc(v) {
  if (!v || typeof v.type !== 'string' || v.type.indexOf('POINTS:') !== 0 || v.type === 'POINTS:DISABLE') return null;
  if (typeof v.title !== 'string') return null;
  const parts = v.title.split('\u241F');
  if (parts.length < 3) return null;
  return {
    exerciseTitle: parts[0],
    uid: parts[1],
    studentId: parts[2],
    teacherName: parts[3] || 'Teacher',
    exerciseType: v.type.slice(7),
    studentName: v.name || parts[2],
    points: v.score || 0,
    date: v.date || '',
    hasCode: !!v.hasCode,
    isRosterMatch: !!v.isRosterMatch
  };
}
window.taParsePointsDoc = taParsePointsDoc;

/* ================= POINTS TAB ================= */
const LS_POINTS_ROSTER = 'ta_points_roster'; // [{name, id}]

function getPointsRoster() {
  try { return JSON.parse(localStorage.getItem(LS_POINTS_ROSTER) || '[]'); } catch (e) { return []; }
}
function savePointsRoster(list) {
  try { localStorage.setItem(LS_POINTS_ROSTER, JSON.stringify(list)); } catch (e) { /* ignore */ }
}
function rosterNameFor(id) {
  const r = getPointsRoster().find(s => s.id === id);
  return r ? r.name : null;
}

/* ================= STUDENT GROUPS =================
   Every student belongs to one group (e.g. two classes). Groups are kept in
   this browser like the roster itself. A student with no group, or whose
   group was deleted, shows up under "Not in a group" until moved. */
const LS_STUDENT_GROUPS = 'ta_student_groups'; // [{id, name}]

function getStudentGroups() {
  let list = null;
  try { list = JSON.parse(localStorage.getItem(LS_STUDENT_GROUPS) || 'null'); } catch (e) { list = null; }
  if (!Array.isArray(list)) {
    list = [{ id: 'g1', name: 'Group 1' }, { id: 'g2', name: 'Group 2' }];
    saveStudentGroups(list);
  }
  return list;
}
function saveStudentGroups(list) {
  try { localStorage.setItem(LS_STUDENT_GROUPS, JSON.stringify(list)); } catch (e) { /* ignore */ }
}
function groupNameFor(groupId) {
  const g = getStudentGroups().find(x => x.id === groupId);
  return g ? g.name : '';
}
/* Returns [{id, name, students:[...]}] in group order, plus an
   "unassigned" bucket (id '') only when someone is in it. */
function assignLooseStudentsToFirstGroup() {
  const groups = getStudentGroups();
  if (!groups.length) return;
  const known = new Set(groups.map(g => g.id));
  const roster = getPointsRoster();
  let changed = false;
  roster.forEach(st => { if (!st.group || !known.has(st.group)) { st.group = groups[0].id; changed = true; } });
  if (changed) savePointsRoster(roster);
}
function getRosterByGroup() {
  assignLooseStudentsToFirstGroup();
  const groups = getStudentGroups();
  const roster = getPointsRoster();
  const known = new Set(groups.map(g => g.id));
  const out = groups.map(g => ({ id: g.id, name: g.name, students: roster.filter(s => s.group === g.id) }));
  const loose = roster.filter(s => !s.group || !known.has(s.group));
  if (loose.length) out.push({ id: '', name: 'Not in a group', students: loose, unassigned: true });
  return out;
}

function renderGroupSelect() {
  const sel = document.getElementById('pt-student-group');
  if (!sel) return;
  const prev = sel.value;
  const groups = getStudentGroups();
  sel.innerHTML = groups.map(g => '<option value="' + escapeForHtml(g.id) + '">' + escapeForHtml(g.name) + '</option>').join('') +
    (groups.length ? '' : '<option value="">No groups yet</option>');
  if (prev && groups.some(g => g.id === prev)) sel.value = prev;
}

function refreshRosterViews() {
  renderGroupSelect();
  if (window.renderStudentsList) window.renderStudentsList();
  if (window.renderPointsBoard) window.renderPointsBoard();
  if (window.renderDashboard) window.renderDashboard();
  if (window.renderTopActiveStudents) window.renderTopActiveStudents();
  if (window.renderResultsTable) { try { window.renderResultsTable(); } catch (e) { /* ignore */ } }
}

function removePointsStudent(id) {
  savePointsRoster(getPointsRoster().filter(s => s.id !== id));
  refreshRosterViews();
}

/* ---- Is a result / points entry from one of MY students? ----
   A student counts as yours only if they entered with an ID that is on
   your Students list. Returns that roster student, or null for anyone who
   just typed a name. Works for older results too (before exercises
   recorded the ID), by matching the resolved name. */
function taRosterIndex() {
  const byId = {}, byName = {};
  getPointsRoster().forEach(s => {
    byId[String(s.id).trim().toLowerCase()] = s;
    byName[String(s.name).trim().toLowerCase()] = s;
  });
  return { byId: byId, byName: byName };
}
function rosterStudentForId(id, idx) {
  if (id === undefined || id === null || id === '') return null;
  idx = idx || taRosterIndex();
  return idx.byId[String(id).trim().toLowerCase()] || null;
}
function rosterStudentForResult(r, idx) {
  if (!r) return null;
  idx = idx || taRosterIndex();
  const byId = rosterStudentForId(r.studentId, idx);
  if (byId) return byId;
  const nameKey = String(r.name || '').trim().toLowerCase();
  if (!nameKey) return null;
  // Typed an ID that wasn't in the exercise's built-in list but is on the
  // Students list now — the typed ID became the recorded name.
  if (idx.byId[nameKey]) return idx.byId[nameKey];
  // Exercise says the student typed a plain name: not one of yours.
  if (r.isRosterMatch === false) return null;
  // ID matched when the exercise ran (or an older result with no flag):
  // the name was replaced by the roster name.
  return idx.byName[nameKey] || null;
}
window.rosterStudentForResult = rosterStudentForResult;
try { assignLooseStudentsToFirstGroup(); } catch (e) { /* ignore */ }
window.rosterStudentForId = rosterStudentForId;

function pointsTotalFor(id) {
  const entries = window.__pointsLedger || [];
  let total = 0;
  const key = String(id).trim().toLowerCase();
  entries.forEach(e => { if (e && e.studentId && String(e.studentId).trim().toLowerCase() === key) total += (e.points || 0); });
  return total;
}

/* ================= TEACHER NAME (for bonus labels) ================= */
const LS_TEACHER_NAME = 'ta_teacher_name';

function getTeacherName() {
  try { return localStorage.getItem(LS_TEACHER_NAME) || taDefaultTeacherName(); } catch (e) { return taDefaultTeacherName(); }
}

function setTeacherName(v) {
  const name = (v || '').trim() || taDefaultTeacherName();
  try { localStorage.setItem(LS_TEACHER_NAME, name); } catch (e) { /* ignore */ }
  const sp = document.getElementById('sidebarProfileName');
  if (sp) sp.textContent = name;
  const heroName = document.getElementById('heroAccountName');
  if (heroName) heroName.textContent = name;
  if (window.renderMainGreeting) window.renderMainGreeting();
}

/* ================= THEME (day / night) ================= */
const LS_THEME = 'ta_theme';

function getTheme() {
  try { return localStorage.getItem(LS_THEME) || 'dark'; } catch (e) { return 'dark'; }
}

function setTheme(t) {
  try { localStorage.setItem(LS_THEME, t); } catch (e) { /* ignore */ }
  applyTheme();
}

function applyTheme() {
  const t = getTheme();
  document.body.classList.toggle('light-theme', t === 'light');
}

/* ================= PROFILE PICTURE ================= */
const LS_AVATAR = 'ta_avatar';

function getAvatar() {
  try { return localStorage.getItem(LS_AVATAR) || ''; } catch (e) { return ''; }
}

function applyAvatar() {
  const url = getAvatar();
  document.querySelectorAll('.avatar-img').forEach(img => {
    if (url) { img.src = url; img.style.display = ''; } else { img.style.display = 'none'; }
  });
  document.querySelectorAll('.avatar-fallback').forEach(el => {
    el.style.display = url ? 'none' : '';
  });
}

function onAvatarFileChosen(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale, h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      try {
        localStorage.setItem(LS_AVATAR, canvas.toDataURL('image/jpeg', 0.85));
      } catch (err) { showToast("Couldn't save that picture — try a smaller image."); }
      applyAvatar();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

let __settingsModalOriginParent = null;
let __settingsModalOriginNext = null;

function openSettingsModal(prefix) {
  const content = document.getElementById(prefix + '-extra-settings');
  const body = document.getElementById('settingsModalBody');
  const backdrop = document.getElementById('settingsModalBackdrop');
  if (!content || !body || !backdrop) return;
  __settingsModalOriginParent = content.parentNode;
  __settingsModalOriginNext = content.nextSibling;
  content.style.display = '';
  body.appendChild(content);
  backdrop.classList.add('show');
}

function closeSettingsModal() {
  const body = document.getElementById('settingsModalBody');
  const backdrop = document.getElementById('settingsModalBackdrop');
  const content = body ? body.firstElementChild : null;
  if (content && __settingsModalOriginParent) {
    content.style.display = 'none';
    __settingsModalOriginParent.insertBefore(content, __settingsModalOriginNext);
  }
  if (backdrop) backdrop.classList.remove('show');
  __settingsModalOriginParent = null;
  __settingsModalOriginNext = null;
}

const LS_POINTS_CODE = 'ta_points_code';

function getPointsBoardCode() {
  try {
    let c = localStorage.getItem(LS_POINTS_CODE);
    if (!c) { c = generateClassCode(); localStorage.setItem(LS_POINTS_CODE, c); }
    return c;
  } catch (e) { return '000000'; }
}

function regeneratePointsBoardCode() {
  let c = '000000';
  try {
    c = generateClassCode();
    localStorage.setItem(LS_POINTS_CODE, c);
  } catch (e) { /* ignore */ }
  if (window.startPointsSync) window.startPointsSync(c);
  if (window.renderPointsBoard) window.renderPointsBoard();
  return c;
}

function generateExerciseUid() {
  return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

/* ================= RECENT EXERCISES (last 5) ================= */
const LS_RECENT_EXERCISES = 'ta_recent_exercises';

function getRecentExercises() {
  try { return JSON.parse(localStorage.getItem(LS_RECENT_EXERCISES) || '[]'); } catch (e) { return []; }
}

function saveRecentExercises(list) {
  try { localStorage.setItem(LS_RECENT_EXERCISES, JSON.stringify(list)); } catch (e) { /* ignore */ }
}

function pushRecentExercise(entry) {
  const list = getRecentExercises();
  list.unshift({
    title: entry.title,
    typeLabel: entry.typeLabel,
    code: entry.code,
    requiredCode: entry.requiredCode || '',
    contentSummary: entry.contentSummary || '',
    uid: entry.uid,
    boardCode: getPointsBoardCode(),
    date: new Date().toISOString(),
    disabled: false,
    mergedItems: entry.mergedItems || null
  });
  saveRecentExercises(list.slice(0, 200));
  if (entry.html) cacheExerciseHtml(entry.uid, entry.html);
  if (window.renderRecentExercises) window.renderRecentExercises();
}

/* Used when an exercise is moved into a Homework/Class set \u2014 it should
   no longer appear as its own separate entry in My Exercises. */
function removeRecentExercise(uid) {
  const list = getRecentExercises().filter(e => e.uid !== uid);
  saveRecentExercises(list);
  try {
    const cache = JSON.parse(localStorage.getItem(LS_EXERCISE_HTML_CACHE) || '{}');
    delete cache[uid];
    localStorage.setItem(LS_EXERCISE_HTML_CACHE, JSON.stringify(cache));
  } catch (e) { /* ignore */ }
  if (window.renderRecentExercises) window.renderRecentExercises();
}

/* Exercise files are cached separately from the lightweight metadata list
   above (and capped in count) so My Exercises can offer a real
   re-download of each exercise, without risking this growing large
   enough to threaten the browser's storage quota for everything else. */
const LS_EXERCISE_HTML_CACHE = 'ta_exercise_html_cache';
const MAX_CACHED_EXERCISE_HTML = 20;

function cacheExerciseHtml(uid, html) {
  try {
    const cache = JSON.parse(localStorage.getItem(LS_EXERCISE_HTML_CACHE) || '{}');
    cache[uid] = html;
    const keys = Object.keys(cache);
    if (keys.length > MAX_CACHED_EXERCISE_HTML) {
      const recentUids = getRecentExercises().map(e => e.uid);
      keys.forEach(k => {
        if (Object.keys(cache).length <= MAX_CACHED_EXERCISE_HTML) return;
        if (recentUids.indexOf(k) === -1 || recentUids.indexOf(k) >= MAX_CACHED_EXERCISE_HTML) delete cache[k];
      });
    }
    localStorage.setItem(LS_EXERCISE_HTML_CACHE, JSON.stringify(cache));
  } catch (e) { /* storage full or file too large \u2014 the exercise still downloads fine, it just won't have a "Get" button later */ }
}
function getCachedExerciseHtml(uid) {
  try {
    const cache = JSON.parse(localStorage.getItem(LS_EXERCISE_HTML_CACHE) || '{}');
    return cache[uid] || null;
  } catch (e) { return null; }
}

/* ================= CLASS CODE + RESULTS STORAGE ================= */
const LS_ACTIVE_CODE = 'ta_active_code';
const LS_RESULTS = 'ta_results';
const LS_RESETS = 'ta_code_resets';
const RESET_KIND = 'ta-reset';

/* ---- Code expiry -------------------------------------------------------
   When you delete all results for a code, that moment is recorded as the
   code's "reset time". Every file this app builds carries the date/time it
   was built. A submission is only shown if it came from a file built AFTER
   the last reset — so an OLD file someone still has open can be opened and
   used, but its results never appear in your table again. */
function getLocalResets() {
  try { return JSON.parse(localStorage.getItem(LS_RESETS) || '{}'); } catch (e) { return {}; }
}
function setLocalReset(code, iso) {
  const map = getLocalResets();
  if (!map[code] || map[code] < iso) map[code] = iso;
  try { localStorage.setItem(LS_RESETS, JSON.stringify(map)); } catch (e) { /* ignore */ }
}
function isResetMarker(r) { return !!(r && r.kind === RESET_KIND); }

function resetCutoffFor(code) {
  let cutoff = getLocalResets()[code] || '';
  const scan = (list) => (list || []).forEach(r => {
    if (isResetMarker(r) && r.code === code && r.resetAt && r.resetAt > cutoff) cutoff = r.resetAt;
  });
  scan(window.__liveResults);
  scan(getStoredResults());
  return cutoff;
}

function isExpiredResult(r, cutoff) {
  if (!cutoff) return false;
  if (!r.builtAt) return true;   // built before this app stamped its files
  return r.builtAt <= cutoff;
}

function collectResults(code) {
  const combined = getStoredResults().concat(window.__liveResults || []);
  const seen = new Set();
  const all = [];
  combined.forEach(r => {
    if (!r || isResetMarker(r)) return;
    const sig = resultSignature(r);
    if (seen.has(sig)) return;
    seen.add(sig);
    all.push(r);
  });
  const matches = code ? all.filter(r => r.code === code) : all;
  const cutoff = code ? resetCutoffFor(code) : '';
  const visible = [], expired = [];
  matches.forEach(r => { (isExpiredResult(r, cutoff) ? expired : visible).push(r); });
  return { visible: visible, expired: expired, cutoff: cutoff };
}

function generateClassCode() {
  return String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
}

/* The violation code unlocks an exercise after a student leaves full screen.
   Keep it secret from students — you type it in for them. */
function validateClassCode(code) {
  return /^[0-9]{6}$/.test(code);
}

// Called right before every "Create" button builds its file, using the code the
// teacher typed in. Wipes results only if this is actually a different code than
// the currently active one — reusing the same code keeps existing results intact.
function setActiveClassCode(code) {
  const previous = getActiveCode();
  try {
    localStorage.setItem(LS_ACTIVE_CODE, code);
    if (code !== previous) {
      localStorage.setItem(LS_RESULTS, '[]');
    }
  } catch (e) { /* localStorage unavailable — code still works for this session */ }
  if (window.renderActiveCodeBox) window.renderActiveCodeBox();
  return code;
}

function getActiveCode() {
  try { return localStorage.getItem(LS_ACTIVE_CODE) || ''; } catch (e) { return ''; }
}

function getStoredResults() {
  try { return JSON.parse(localStorage.getItem(LS_RESULTS) || '[]'); } catch (e) { return []; }
}

function saveStoredResults(list) {
  try { localStorage.setItem(LS_RESULTS, JSON.stringify(list)); } catch (e) { /* ignore */ }
}

function escapeForHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Produces the *inside* of a double-quoted JS string literal — for
   substituting into templates that look like const X = "__PLACEHOLDER__";
   inside a <script> tag. Escapes backslash, double quote, and newlines via
   JSON.stringify, then also escapes "</script" so the value can never
   accidentally close the surrounding script tag. Does NOT include the
   surrounding quotes themselves, since the template already has those. */
function escapeForJsString(str) {
  return JSON.stringify(String(str)).slice(1, -1).split('</script').join('<\\/script');
}

/* Produces a single-quoted JS string literal safe to embed inside a
   double-quoted HTML onclick="..." attribute (escapes backslash, single
   quote, and double quote so it can never break out of either context). */
function jsAttr(v) {
  return "'" + String(v)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;') + "'";
}

function resultSignature(r) {
  return [r.code, r.name, r.date, r.type].join('|');
}
function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch (e) { return iso || ''; }
}

const RESULT_AVATAR_COLORS = ['var(--category-blue)', 'var(--category-teal)', 'var(--category-violet)', 'var(--category-amber)', 'var(--category-rose)', 'var(--category-green)', 'var(--category-cyan)', 'var(--category-orange)'];
function initialsForName(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}
function avatarColorForName(name) {
  let hash = 0;
  const s = name || '';
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return RESULT_AVATAR_COLORS[hash % RESULT_AVATAR_COLORS.length];
}
function viewNotesResult(idx) {
  const r = (window.__lastResultsMatches || [])[idx];
  if (!r) return;
  const modal = document.getElementById('sentenceViewModal');
  const title = document.getElementById('sentenceViewTitle');
  const body = document.getElementById('sentenceViewBody');
  if (!modal || !title || !body) return;
  title.textContent = (r.name || 'Student') + ' — ' + (r.title || 'Bidirectional Language') + ' notes';
  body.innerHTML = '<div class="resource-card"><div class="resource-card-content" style="white-space:pre-wrap;">' + escapeForHtml(r.notes || '(no notes)') + '</div></div>';
  modal.classList.add('show');
}

function viewDictationResult(idx) {
  const r = (window.__lastResultsMatches || [])[idx];
  if (!r) return;
  const modal = document.getElementById('sentenceViewModal');
  const title = document.getElementById('sentenceViewTitle');
  const body = document.getElementById('sentenceViewBody');
  if (!modal || !title || !body) return;
  title.textContent = (r.name || 'Student') + ' — ' + (r.title || 'Dictation') + ' (' + (typeof r.score === 'number' ? r.score + '%' : '—') + ')';
  body.innerHTML = '<div class="resource-card"><div class="resource-card-content" style="white-space:pre-wrap;">' + escapeForHtml(r.dictationFeedback || '(no details)') + '</div></div>';
  modal.classList.add('show');
}

function viewSentenceResult(idx) {
  const r = (window.__lastResultsMatches || [])[idx];
  if (!r || !Array.isArray(r.sentences)) return;
  const modal = document.getElementById('sentenceViewModal');
  const title = document.getElementById('sentenceViewTitle');
  const body = document.getElementById('sentenceViewBody');
  if (!modal || !title || !body) return;
  title.textContent = (r.name || 'Student') + ' — ' + (r.title || 'Sentences');
  body.innerHTML = r.sentences.map((s, i) =>
    '<div class="resource-card">' +
      '<div class="resource-card-title">' + (i + 1) + (s.word ? ' — using "' + escapeForHtml(s.word) + '"' : '') + '</div>' +
      '<div class="resource-card-content">' + escapeForHtml(s.text || '(blank)') + '</div>' +
    '</div>'
  ).join('') || '<div class="empty-results">No sentences recorded.</div>';
  modal.classList.add('show');
}
function closeSentenceViewModal() {
  const modal = document.getElementById('sentenceViewModal');
  if (modal) modal.classList.remove('show');
}

/* ================= MAIN DASHBOARD: weekly lesson schedule ================= */
const LS_WEEKLY_SCHEDULE = 'ta_weekly_schedule';
const SCHEDULE_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SCHEDULE_DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const LESSON_PALETTE = [
  { color: 'var(--category-blue)', surface: 'rgba(79,126,227,0.14)' },
  { color: 'var(--category-green)', surface: 'rgba(69,175,110,0.14)' },
  { color: 'var(--category-coral)', surface: 'rgba(255,122,107,0.16)' },
  { color: 'var(--category-pink)', surface: 'rgba(240,107,168,0.16)' },
  { color: 'var(--category-orange)', surface: 'rgba(229,129,77,0.16)' }
];

function getWeeklySchedule() {
  try { return JSON.parse(localStorage.getItem(LS_WEEKLY_SCHEDULE) || '[]'); } catch (e) { return []; }
}
function saveWeeklySchedule(list) {
  try { localStorage.setItem(LS_WEEKLY_SCHEDULE, JSON.stringify(list)); } catch (e) { /* ignore */ }
}
function formatTimeDisplay(t) {
  if (!t) return '';
  const parts = t.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  const period = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12; if (h12 === 0) h12 = 12;
  return h12 + ':' + String(m).padStart(2, '0') + ' ' + period;
}
function lessonColorForId(id) {
  let hash = 0;
  const s = String(id || '');
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return LESSON_PALETTE[hash % LESSON_PALETTE.length];
}

function getWeekStartMonday(d) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = date.getDay(); // 0=Sun..6=Sat
  const diff = (day === 0 ? -6 : 1 - day);
  date.setDate(date.getDate() + diff);
  return date;
}

function getNextOccurrenceForEntry(entry, now) {
  const parts = (entry.time || '00:00').split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  for (let addDays = 0; addDays < 8; addDays++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + addDays, h, m, 0, 0);
    if (d.getDay() === entry.day && d.getTime() >= now.getTime() - 60000) return d;
  }
  return null;
}

function getNextLessonOccurrencesGrouped() {
  const schedule = getWeeklySchedule();
  const result = { thisWeek: [], nextWeek: [] };
  if (!schedule.length) return result;
  const now = new Date();
  const thisWeekStart = getWeekStartMonday(now);
  const nextWeekStart = new Date(thisWeekStart); nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  const afterNextWeekStart = new Date(thisWeekStart); afterNextWeekStart.setDate(afterNextWeekStart.getDate() + 14);
  const occurrences = [];
  schedule.forEach(entry => {
    const parts = (entry.time || '00:00').split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    const totalDays = Math.ceil((afterNextWeekStart.getTime() - now.getTime()) / 86400000) + 1;
    for (let addDays = 0; addDays < totalDays; addDays++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + addDays, h, m, 0, 0);
      if (d.getTime() >= afterNextWeekStart.getTime()) break;
      if (d.getDay() === entry.day && d.getTime() >= now.getTime() - 60000) {
        occurrences.push({ entry: entry, date: d });
      }
    }
  });
  occurrences.sort((a, b) => a.date - b.date);
  occurrences.forEach(o => {
    if (o.date.getTime() < nextWeekStart.getTime()) result.thisWeek.push(o);
    else result.nextWeek.push(o);
  });
  return result;
}

/* ---- 24h reminders ---- */
function getUpcomingReminders() {
  const schedule = getWeeklySchedule();
  if (!schedule.length) return [];
  const now = new Date();
  const windowMs = 24 * 60 * 60 * 1000;
  const out = [];
  schedule.forEach(entry => {
    const d = getNextOccurrenceForEntry(entry, now);
    if (d && (d.getTime() - now.getTime()) <= windowMs) out.push({ entry: entry, date: d });
  });
  out.sort((a, b) => a.date - b.date);
  return out;
}
function formatTimeUntil(d) {
  const now = new Date();
  let diffMs = d.getTime() - now.getTime();
  if (diffMs < 0) diffMs = 0;
  const totalMin = Math.round(diffMs / 60000);
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hrs <= 0) return mins <= 1 ? 'starting now' : ('in ' + mins + 'm');
  if (mins === 0) return 'in ' + hrs + 'h';
  return 'in ' + hrs + 'h ' + mins + 'm';
}
const LS_SHOWN_REMINDERS = 'ta_shown_reminders';
function getShownReminderKeys() {
  try { return JSON.parse(localStorage.getItem(LS_SHOWN_REMINDERS) || '[]'); } catch (e) { return []; }
}
function markReminderShown(key) {
  try {
    const list = getShownReminderKeys();
    if (list.indexOf(key) === -1) {
      list.push(key);
      localStorage.setItem(LS_SHOWN_REMINDERS, JSON.stringify(list.slice(-50)));
    }
  } catch (e) { /* ignore */ }
}
function showReminderToastIfDue() {
  const reminders = getUpcomingReminders();
  if (!reminders.length) return;
  const shown = getShownReminderKeys();
  const due = reminders.filter(r => shown.indexOf(r.entry.id + '_' + r.date.toISOString()) === -1);
  if (!due.length) return;
  const first = due[0];
  const label = due.length > 1
    ? ('⏰ Reminder: ' + (first.entry.group || 'Lesson') + ' starts ' + formatTimeUntil(first.date) + ' (+' + (due.length - 1) + ' more within 24h)')
    : ('⏰ Reminder: ' + (first.entry.group || 'Lesson') + ' starts ' + formatTimeUntil(first.date) + ', ' + formatTimeDisplay(first.entry.time));
  showToast(label);
  due.forEach(r => markReminderShown(r.entry.id + '_' + r.date.toISOString()));
}
window.showReminderToastIfDue = showReminderToastIfDue;

function renderLessonRow(o) {
  const palette = lessonColorForId(o.entry.id);
  const levelPill = o.entry.level
    ? '<span class="lesson-level-pill" style="background:' + palette.surface + '; color:' + palette.color + ';">' + escapeForHtml(o.entry.level) + '</span>'
    : '';
  const withinDay = (o.date.getTime() - Date.now()) <= (24 * 60 * 60 * 1000);
  const soonBadge = withinDay ? '<div class="lesson-soon-badge">⏰ ' + formatTimeUntil(o.date) + '</div>' : '';
  return '<div class="lesson-row">' +
    '<div class="lesson-accent" style="background:' + palette.color + ';"></div>' +
    '<div class="lesson-time-col"><div class="lesson-time-val">' + formatTimeDisplay(o.entry.time) + '</div><div class="lesson-day-val">' + SCHEDULE_DAY_SHORT[o.date.getDay()] + '</div>' + soonBadge + '</div>' +
    '<div class="lesson-group-col"><span class="lesson-group-icon">👥</span><b>' + escapeForHtml(o.entry.group || 'Untitled group') + '</b></div>' +
    '<div class="lesson-level-col">' + levelPill + '</div>' +
    '<button class="lesson-plan-btn" type="button" onclick="openLessonPlanModal(' + jsAttr(o.entry.id) + ')">📝 Plan</button>' +
  '</div>';
}

function renderNextLessons() {
  const wrap = document.getElementById('mainLessonsList');
  if (!wrap) return;
  const grouped = getNextLessonOccurrencesGrouped();
  if (!grouped.thisWeek.length && !grouped.nextWeek.length) {
    wrap.innerHTML = '<div class="empty-results">No lessons scheduled yet. <button class="mini-btn" type="button" style="margin-top:8px;" onclick="goToScheduleSettings()">➕ Add your weekly schedule</button></div>';
    return;
  }
  let html = '';
  html += '<div class="lesson-week-heading">This Week</div>';
  html += grouped.thisWeek.length
    ? grouped.thisWeek.map(renderLessonRow).join('')
    : '<div class="lesson-week-empty">No more lessons this week.</div>';
  html += '<div class="lesson-week-heading">Next Week</div>';
  html += grouped.nextWeek.length
    ? grouped.nextWeek.map(renderLessonRow).join('')
    : '<div class="lesson-week-empty">No lessons scheduled next week.</div>';
  wrap.innerHTML = html;
  showReminderToastIfDue();
}
window.renderNextLessons = renderNextLessons;

/* ================= MAIN DASHBOARD: lesson plan modal ================= */
let lessonPlanCurrentId = null;
function openLessonPlanModal(id) {
  const entry = getWeeklySchedule().find(e => e.id === id);
  if (!entry) return;
  lessonPlanCurrentId = id;
  if (!entry.plan) entry.plan = { notes: '', exerciseUids: [], materialIds: [] };
  const titleEl = document.getElementById('lessonPlanModalTitle');
  if (titleEl) titleEl.textContent = '📝 Plan — ' + (entry.group || 'Lesson') + (entry.level ? ' (' + entry.level + ')' : '');
  renderLessonPlanModalBody(entry);
  const backdrop = document.getElementById('lessonPlanModalBackdrop');
  if (backdrop) backdrop.classList.add('show');
}
function closeLessonPlanModal() {
  const backdrop = document.getElementById('lessonPlanModalBackdrop');
  if (backdrop) backdrop.classList.remove('show');
  lessonPlanCurrentId = null;
}
window.openLessonPlanModal = openLessonPlanModal;
window.closeLessonPlanModal = closeLessonPlanModal;

function renderLessonPlanModalBody(entry) {
  const wrap = document.getElementById('lessonPlanModalBody');
  if (!wrap) return;
  const exercises = getRecentExercises();
  const plan = entry.plan || { notes: '', exerciseUids: [], materialIds: [] };

  let html = '<div class="title-field"><label class="field-label">Notes — what will you cover?</label>' +
    '<textarea id="lp-notes" style="min-height:90px;" placeholder="Write your lesson plan here...">' + escapeForHtml(plan.notes || '') + '</textarea></div>';

  html += '<div class="title-field"><label class="field-label">📚 Add exercises to this plan</label>';
  if (!exercises.length) {
    html += '<div class="empty-results">No exercises created yet.</div>';
  } else {
    html += '<div style="display:flex; flex-direction:column; gap:8px; max-height:170px; overflow-y:auto; padding:2px;">';
    exercises.slice(0, 60).forEach(ex => {
      const checked = plan.exerciseUids.indexOf(ex.uid) !== -1;
      html += '<label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; cursor:pointer;">' +
        '<input type="checkbox" class="lp-exercise-check" value="' + escapeForHtml(ex.uid) + '" ' + (checked ? 'checked' : '') + '>' +
        escapeForHtml(ex.title) + ' <span class="badge-type">' + escapeForHtml(ex.typeLabel) + '</span>' +
      '</label>';
    });
    html += '</div>';
  }
  html += '</div>';

  if (plan.exerciseUids.length) {
    const chips = plan.exerciseUids.map(uid => {
      const ex = exercises.find(e => e.uid === uid);
      if (!ex) return '';
      return '<button class="mini-btn" type="button" onclick="jumpToExerciseInMyExercises(' + jsAttr(uid) + ')">↗ ' + escapeForHtml(ex.title) + '</button>';
    }).join('');
    if (chips) {
      html += '<div class="title-field"><label class="field-label">Jump to an exercise in this plan</label>' +
        '<div style="display:flex; flex-wrap:wrap; gap:8px;">' + chips + '</div></div>';
    }
  }

  html += '<div style="display:flex; justify-content:flex-end; gap:10px; margin-top:6px;">' +
    '<button class="create-btn" type="button" style="width:auto; padding:12px 26px;" onclick="saveLessonPlan()">💾 Save Plan</button>' +
  '</div>';

  wrap.innerHTML = html;
}

function saveLessonPlan() {
  if (!lessonPlanCurrentId) return;
  const list = getWeeklySchedule();
  const entry = list.find(e => e.id === lessonPlanCurrentId);
  if (!entry) return;
  const notesEl = document.getElementById('lp-notes');
  const exerciseUids = Array.prototype.slice.call(document.querySelectorAll('.lp-exercise-check:checked')).map(el => el.value);
  entry.plan = { notes: notesEl ? notesEl.value : '', exerciseUids: exerciseUids, materialIds: (entry.plan && entry.plan.materialIds) || [] };
  saveWeeklySchedule(list);
  renderLessonPlanModalBody(entry);
  showToast('Lesson plan saved.', 'ok');
}
window.saveLessonPlan = saveLessonPlan;

// My Exercises is its own page; it highlights the row named in ?highlight=
function jumpToExerciseInMyExercises(uid) {
  closeLessonPlanModal();
  taNavigate('my-exercises.html?highlight=' + encodeURIComponent(uid));
}
window.jumpToExerciseInMyExercises = jumpToExerciseInMyExercises;

// Opens Settings and scrolls to the weekly schedule.
function goToScheduleSettings() {
  taNavigate('settings.html#schedule');
}
function scrollToScheduleSettings() {
  setTimeout(function () {
    const el = document.getElementById('settingsScheduleSection');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

/* ================= LOTTIE ANIMATIONS ================= */

function initRobotHiAnim() {
  const el = document.getElementById('robotHiAnim');
  if (!el || typeof lottie === 'undefined') return;
  try {
    el.innerHTML = '';
    lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: ROBOT_SAYS_HI_ANIM
    });
  } catch (e) { /* animation is decorative — fail silently */ }
}
window.initRobotHiAnim = initRobotHiAnim;

function initWelcomeSplash() {
  const overlay = document.getElementById('welcomeSplashOverlay');
  const animEl = document.getElementById('welcomeSplashAnim');
  if (!overlay || !animEl) return;
  let anim = null;
  function dismiss() {
    overlay.classList.add('hide');
    document.body.style.overflow = '';
    setTimeout(function () {
      overlay.style.display = 'none';
      if (anim) { try { anim.destroy(); } catch (e) { /* ignore */ } }
    }, 450);
  }

  // Already signed in (this tab, or "keep me signed in"): go straight in.
  if (window.__TA_USER) {
    overlay.classList.add('signed-in');
    setTimeout(dismiss, 250);
    taRecheckAccount();
    return;
  }

  document.body.style.overflow = 'hidden';
  if (typeof lottie !== 'undefined') {
    try {
      animEl.innerHTML = '';
      anim = lottie.loadAnimation({ container: animEl, renderer: 'svg', loop: false, autoplay: true, animationData: WELCOME_ANIM });
    } catch (e) { /* keep the emoji fallback already in the markup */ }
    const loginAnimEl = document.getElementById('loginStageAnim');
    if (loginAnimEl) {
      try {
        loginAnimEl.innerHTML = '';
        lottie.loadAnimation({ container: loginAnimEl, renderer: 'svg', loop: true, autoplay: true, animationData: LOGIN_STAGE_ANIM });
      } catch (e) { /* keep the emoji fallback already in the markup */ }
    }
  }
  const userEl = document.getElementById('taLoginUser');
  const passEl = document.getElementById('taLoginPass');
  const last = window.taRaw.get('ta_last_login');
  if (userEl && last) userEl.value = last;
  setTimeout(function () { (userEl && !userEl.value ? userEl : passEl).focus(); }, 60);
}

async function taSubmitLogin(ev) {
  if (ev) ev.preventDefault();
  const userEl = document.getElementById('taLoginUser');
  const passEl = document.getElementById('taLoginPass');
  const errEl = document.getElementById('taLoginError');
  const btn = document.getElementById('taLoginBtn');
  const remember = document.getElementById('taLoginRemember');
  const login = (userEl.value || '').trim().toUpperCase();
  const pass = passEl.value || '';
  userEl.removeAttribute('aria-invalid'); passEl.removeAttribute('aria-invalid');
  errEl.textContent = '';
  if (!login) { errEl.textContent = 'Enter your login.'; userEl.setAttribute('aria-invalid', 'true'); userEl.focus(); return; }
  if (!pass) { errEl.textContent = 'Enter your password.'; passEl.setAttribute('aria-invalid', 'true'); passEl.focus(); return; }
  btn.disabled = true; btn.textContent = 'Checking…';
  let res;
  try { res = await taVerifyAccount(login, pass); } catch (e) { res = { ok: false, msg: 'Something went wrong. Try again.' }; }
  if (!res.ok) {
    btn.disabled = false; btn.textContent = 'Sign in';
    errEl.textContent = res.msg;
    passEl.setAttribute('aria-invalid', 'true');
    passEl.select();
    return;
  }
  const session = JSON.stringify({ login: res.login, name: res.name, hash: res.hash, at: new Date().toISOString() });
  window.taRaw.sessionSet(TA_SESSION_KEY, session);
  if (remember && remember.checked) window.taRaw.set(TA_REMEMBER_KEY, session); else window.taRaw.remove(TA_REMEMBER_KEY);
  window.taRaw.set('ta_last_login', res.login);
  // Throw away anything the app wrote while nobody was signed in.
  try {
    const junk = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf(TA_LOCKED_NS) === 0) junk.push(k); }
    junk.forEach(k => window.taRaw.remove(k));
  } catch (e) { /* ignore */ }
  btn.textContent = 'Welcome, ' + res.name + '!';
  document.getElementById('taLoginForm').classList.add('leaving');
  setTimeout(function () { location.reload(); }, 350);
}
window.taSubmitLogin = taSubmitLogin;

/* If the administrator turns an account off, deletes it or changes its
   password, the teacher is signed out the next time the app opens online. */
async function taRecheckAccount() {
  const u = window.__TA_USER;
  if (!u || String(u.login).toUpperCase() === TA_ADMIN_LOGIN) return;
  // Every sidebar section is its own page, so only re-check every 10 minutes.
  const last = Number(window.taRaw.sessionGet('ta_account_checked_at')) || 0;
  if (Date.now() - last < 10 * 60 * 1000) return;
  window.taRaw.sessionSet('ta_account_checked_at', String(Date.now()));
  const map = await taLoadAccounts();
  if (!map) return; // offline — keep working
  const rec = map[String(u.login).toUpperCase()];
  if (!rec || rec.status !== 'active' || rec.hash !== u.hash) {
    alert('Your account was changed by the administrator. Please sign in again.');
    taLogout(true);
  }
}
window.initWelcomeSplash = initWelcomeSplash;

/* ================= LOTTIE ANIMATIONS: toggle, brand, statistics ================= */

const THEME_TOGGLE_SEGMENTS = { dayIdle: [0, 20], dayToNight: [20, 81], nightIdle: [81, 119], nightToDay: [120, 200] };
let themeToggleLottieAnim = null;
function initThemeToggleAnim() {
  const el = document.getElementById('themeToggleAnim');
  if (!el || typeof lottie === 'undefined' || themeToggleLottieAnim) return;
  try {
    el.innerHTML = '';
    themeToggleLottieAnim = lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: THEME_TOGGLE_ANIM
    });
    themeToggleLottieAnim.addEventListener('DOMLoaded', function () { setThemeToggleIdleSegment(); });
    themeToggleLottieAnim.addEventListener('complete', function () { setThemeToggleIdleSegment(); });
  } catch (e) { /* decorative — fail silently */ }
}
window.initThemeToggleAnim = initThemeToggleAnim;

function setThemeToggleIdleSegment() {
  if (!themeToggleLottieAnim) return;
  const seg = getTheme() === 'light' ? THEME_TOGGLE_SEGMENTS.dayIdle : THEME_TOGGLE_SEGMENTS.nightIdle;
  themeToggleLottieAnim.loop = true;
  themeToggleLottieAnim.playSegments(seg, true);
}

function toggleThemeAnimated() {
  const current = getTheme();
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
  if (themeToggleLottieAnim) {
    themeToggleLottieAnim.loop = false;
    const seg = current === 'light' ? THEME_TOGGLE_SEGMENTS.dayToNight : THEME_TOGGLE_SEGMENTS.nightToDay;
    themeToggleLottieAnim.playSegments(seg, true);
  }
}
window.toggleThemeAnimated = toggleThemeAnimated;

function initBrandArcAnim() {
  const el = document.getElementById('brandArcAnim');
  if (!el || typeof lottie === 'undefined') return;
  try {
    el.innerHTML = '';
    const anim = lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: BRAND_ARC_ANIM
    });
    anim.addEventListener('DOMLoaded', function () {
      try {
        var idleMarker = (BRAND_ARC_ANIM.markers || []).find(function (m) { return m.cm === 'idle'; });
        if (idleMarker) anim.playSegments([idleMarker.tm, idleMarker.tm + idleMarker.dr], true);
      } catch (e) { /* ignore */ }
    });
  } catch (e) { /* decorative — fail silently */ }
}
window.initBrandArcAnim = initBrandArcAnim;

function initStatsIconAnim() {
  const el = document.getElementById('statsIconAnim');
  if (!el || typeof lottie === 'undefined') return;
  try {
    el.innerHTML = '';
    lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: CHART_GROW_ANIM
    });
  } catch (e) { /* decorative — fail silently */ }
}
window.initStatsIconAnim = initStatsIconAnim;

function initCreateIconAnim() {
  const el = document.getElementById('createIconAnim');
  if (!el || typeof lottie === 'undefined') return;
  try {
    el.innerHTML = '';
    lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: REPORT_GEN_ANIM
    });
  } catch (e) { /* decorative — fail silently */ }
}
window.initCreateIconAnim = initCreateIconAnim;

function initCreateHeadingAnim() {
  const el = document.getElementById('createHeadingAnim');
  if (!el || typeof lottie === 'undefined') return;
  try {
    el.innerHTML = '';
    lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: REPORT_GEN_ANIM
    });
  } catch (e) { /* decorative — fail silently */ }
}
window.initCreateHeadingAnim = initCreateHeadingAnim;

/* ================= AI ROBOT ASSISTANT (floating, draggable FAQ helper) ================= */
const AI_ROBOT_SEGMENTS = { idle: [0, 29], yes: [31, 105], no: [106, 180], alert: [181, 270], thinking: [271, 390], jump: [391, 479] };

const AI_ROBOT_CONTACT_ITEM = { q: 'Have another question?', a: "Didn't find your answer here? Message Toxirjon directly and he'll help you out: +998886660904" };
function aiFaq(items) { return items.concat([AI_ROBOT_CONTACT_ITEM]); }

const AI_ROBOT_FAQ_BY_TAB = {
  main: aiFaq([
    { q: "What is Teacher's Assistant?", a: "It's your all-in-one classroom toolkit — build interactive exercises, plan your weekly lessons, track results, and reward your students, all without any coding." },
    { q: 'How do I set up my weekly lesson schedule?', a: 'Go to Settings → Weekly Lesson Schedule and add each class once with its day and time. It repeats automatically every week and shows up here under Upcoming Lessons.' },
    { q: 'Will I get reminded before a lesson?', a: "Yes — within 24 hours of a lesson you'll get a reminder pop-up, and the lesson shows a 'starts soon' badge in Upcoming Lessons." },
    { q: 'Can I switch between day and night mode?', a: 'Yes — tap the toggle switch at the top of this page to flip between light and dark themes any time.' },
    { q: 'How do I turn sounds off?', a: 'Tap the speaker button at the top of this page. 🔇 means sounds are off; tap it again to turn them back on.' }
  ]),
  createpicker: aiFaq([
    { q: 'How do I create a new exercise?', a: 'Pick a type below — Flashcards, Word Order, Test, Dictation, and more. Fill in your content and a ready-to-use file downloads straight to your computer.' },
    { q: "What's the difference between Ready to use and In process?", a: 'Ready to use types are fully built and download instantly. In process types are newer and still being polished, but you can already try them.' },
    { q: 'Can I combine several exercises into one?', a: "Yes — that's Homework & Class, further down this page. Pick exercises you've already created, put them in order, then generate one combined file." }
  ]),
  builder: aiFaq([
    { q: 'Where does my finished exercise go?', a: 'It downloads straight to your computer as a ready-to-use file, and a copy is saved under "My Exercises" in this browser.' },
    { q: 'Can I edit an exercise after creating it?', a: 'Re-open it from My Exercises to review it, or create a new version with the same type — your original stays untouched until you delete it.' },
    { q: 'Do results here count toward Statistics and Points?', a: 'Yes — once students submit results, they flow into Statistics and (if enabled) Points & Rewards automatically.' }
  ]),
  hwcbuilder: aiFaq([
    { q: 'How do I build a Homework & Class set?', a: "Pick exercises you've already created from My Exercises, put them in the order you want, then generate one combined file." },
    { q: 'How do students use it?', a: 'They open the combined file, enter their ID and code once, and work through every exercise inside it in order.' },
    { q: 'Where do I see the combined results?', a: 'Open "Results" and switch to the Homework & Class view for progress across the whole set.' }
  ]),
  dashboard: aiFaq([
    { q: 'How does Statistics work?', a: 'This page shows which exercise types your class uses most, updated live from your Points Board.' },
    { q: 'Where do these numbers come from?', a: 'From the results your students submit and the activity tracked on your Points Board — no manual entry needed.' }
  ]),
  myexercises: aiFaq([
    { q: 'What is My Exercises for?', a: "Every exercise you've built in this browser lives here — jump to its results, turn its points on or off, or remove it for good." },
    { q: 'Can I delete an old exercise?', a: "Yes — open it here and use the remove option. This won't affect results already submitted." }
  ]),
  students: aiFaq([
    { q: 'What is the Students roster for?', a: 'Give each student a unique ID so they can earn points without typing their name or an exercise code.' },
    { q: 'Do students need an account?', a: 'No — their ID is all they need to submit exercises and appear on the leaderboard.' }
  ]),
  results: aiFaq([
    { q: "Where do I see my students' results?", a: 'Right here — individual exercise scores, plus a separate view for combined Homework & Class sets.' },
    { q: 'How are Homework & Class results different?', a: "They're grouped by student across a whole merged set, instead of one exercise at a time." }
  ]),
  points: aiFaq([
    { q: 'How do Points & Rewards work?', a: "It's a live leaderboard — give or take bonus points for any student by hand, on top of what they earn from exercises." },
    { q: 'Can I reset points?', a: "Yes — this page has options to reset everyone's points or delete entries entirely." }
  ]),
  settings: aiFaq([
    { q: 'How do I set up my weekly lesson schedule?', a: 'Add each class once with its day and time under Weekly Lesson Schedule below — it repeats automatically every week.' },
    { q: 'Can I share this app with another teacher?', a: 'Yes — use Share App below to copy the link to this app. Your colleague signs in with their own account, so your students, exercises and points stay just yours.' },
    { q: 'Can I change my name or profile picture?', a: 'Yes — both are right here in Settings.' }
  ]),
  'ielts-listening': aiFaq([
    { q: 'How do IELTS Listening exercises work?', a: "Full IELTS-style listening tests, tracked separately from your other exercises — they don't affect Statistics or Points." }
  ]),
  'ielts-reading': aiFaq([
    { q: 'How do IELTS Reading exercises work?', a: "Full IELTS-style reading tests, tracked separately from your other exercises — they don't affect Statistics or Points." }
  ]),
  default: aiFaq([
    { q: "What is Teacher's Assistant?", a: "It's your all-in-one classroom toolkit — build interactive exercises, plan your weekly lessons, track results, and reward your students, all without any coding." },
    { q: 'How do I create a new exercise?', a: 'Tap "➕ Create New Exercise" in the sidebar, then pick a type — Flashcards, Word Order, Test, Dictation, and more.' },
    { q: "Where do I see my students' results?", a: 'Open "Results" in the sidebar for individual exercise scores, or check "Homework & Class" for combined results.' }
  ])
};
const AI_ROBOT_BUILDER_TABS = ['flashcard', 'wordorder', 'makeaword', 'spelling', 'sentences', 'bilingual', 'engcontent', 'dictation', 'presentation', 'pronunciation', 'test'];
function getAiRobotFaqForTab(tab) {
  if (AI_ROBOT_FAQ_BY_TAB[tab]) return AI_ROBOT_FAQ_BY_TAB[tab];
  if (AI_ROBOT_BUILDER_TABS.indexOf(tab) !== -1) return AI_ROBOT_FAQ_BY_TAB.builder;
  return AI_ROBOT_FAQ_BY_TAB.default;
}

let aiRobotLottieAnim = null;
let aiRobotReturnToIdle = false;
function initAiRobotAnimPlayer() {
  const el = document.getElementById('aiRobotAnim');
  if (!el || typeof lottie === 'undefined' || aiRobotLottieAnim) return;
  try {
    el.innerHTML = '';
    aiRobotLottieAnim = lottie.loadAnimation({
      container: el, renderer: 'svg', loop: false, autoplay: false, animationData: AI_ROBOT_ANIM
    });
    aiRobotLottieAnim.addEventListener('DOMLoaded', function () {
      aiRobotLottieAnim.loop = true;
      aiRobotLottieAnim.playSegments(AI_ROBOT_SEGMENTS.idle, true);
    });
    aiRobotLottieAnim.addEventListener('complete', function () {
      if (aiRobotReturnToIdle) {
        aiRobotReturnToIdle = false;
        aiRobotLottieAnim.loop = true;
        aiRobotLottieAnim.playSegments(AI_ROBOT_SEGMENTS.idle, true);
      }
    });
  } catch (e) { /* decorative — fail silently */ }
}
function playAiRobotOnce(name) {
  if (!aiRobotLottieAnim) return;
  const seg = AI_ROBOT_SEGMENTS[name];
  if (!seg) return;
  try {
    aiRobotReturnToIdle = true;
    aiRobotLottieAnim.loop = false;
    aiRobotLottieAnim.playSegments(seg, true);
  } catch (e) { /* ignore */ }
}

/* ---- wandering ---- */
let aiRobotWanderTimer = null;
let aiRobotWanderPaused = false;
const AI_ROBOT_MARGIN = 10;
function aiRobotBounds() {
  const widget = document.getElementById('aiRobotWidget');
  const w = widget ? widget.offsetWidth : 76;
  const h = widget ? widget.offsetHeight : 76;
  return {
    minX: AI_ROBOT_MARGIN, minY: AI_ROBOT_MARGIN,
    maxX: Math.max(AI_ROBOT_MARGIN, window.innerWidth - w - AI_ROBOT_MARGIN),
    maxY: Math.max(AI_ROBOT_MARGIN, window.innerHeight - h - AI_ROBOT_MARGIN)
  };
}
function aiRobotScheduleWander() {
  clearTimeout(aiRobotWanderTimer);
  if (aiRobotWanderPaused) return;
  const pause = 2500 + Math.random() * 5000;
  aiRobotWanderTimer = setTimeout(aiRobotWanderStep, pause);
}
function aiRobotWanderStep() {
  if (aiRobotWanderPaused) return;
  const widget = document.getElementById('aiRobotWidget');
  const anim = document.getElementById('aiRobotAnim');
  if (!widget) return;
  const b = aiRobotBounds();
  const curX = parseFloat(widget.style.left) || 0;
  const curY = parseFloat(widget.style.top) || 0;
  const nextX = b.minX + Math.random() * Math.max(1, (b.maxX - b.minX));
  const nextY = b.minY + Math.random() * Math.max(1, (b.maxY - b.minY));
  const dist = Math.hypot(nextX - curX, nextY - curY);
  const speed = 55 + Math.random() * 45;
  const duration = Math.max(1.4, Math.min(6, dist / speed));
  widget.classList.remove('no-transition');
  widget.style.transition = 'left ' + duration.toFixed(2) + 's linear, top ' + duration.toFixed(2) + 's linear';
  if (anim) anim.classList.toggle('flip', nextX < curX);
  widget.style.left = nextX + 'px';
  widget.style.top = nextY + 'px';
  aiRobotWanderTimer = setTimeout(aiRobotScheduleWander, duration * 1000);
}
function aiRobotFreezeInPlace() {
  // Clearing the wander timer only stops the *next* move — if the widget is mid-transition
  // (CSS animating toward its last wander target) it would keep gliding there on its own.
  // Snap it to wherever it actually is right now so it truly stops.
  const widget = document.getElementById('aiRobotWidget');
  if (!widget) return;
  const rect = widget.getBoundingClientRect();
  widget.classList.add('no-transition');
  widget.style.left = rect.left + 'px';
  widget.style.top = rect.top + 'px';
  // force reflow so the no-transition class takes effect before anything else touches left/top
  void widget.offsetWidth;
}
function aiRobotPauseWander() {
  aiRobotWanderPaused = true;
  clearTimeout(aiRobotWanderTimer);
  aiRobotFreezeInPlace();
}
function aiRobotResumeWander() {
  aiRobotWanderPaused = false;
  aiRobotScheduleWander();
}

/* ---- drag (pick up + carry) ---- */
let aiRobotDragState = null;
function aiRobotInitDrag() {
  const widget = document.getElementById('aiRobotWidget');
  if (!widget) return;
  widget.addEventListener('pointerdown', function (e) {
    if (e.target && e.target.closest && e.target.closest('.ai-robot-bubble')) return;
    const rect = widget.getBoundingClientRect();
    aiRobotDragState = { startX: e.clientX, startY: e.clientY, origLeft: rect.left, origTop: rect.top, moved: false, pointerId: e.pointerId };
    aiRobotPauseWander();
    widget.classList.add('no-transition');
    try { widget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  widget.addEventListener('pointermove', function (e) {
    if (!aiRobotDragState) return;
    const dx = e.clientX - aiRobotDragState.startX;
    const dy = e.clientY - aiRobotDragState.startY;
    if (!aiRobotDragState.moved && Math.hypot(dx, dy) > 6) {
      aiRobotDragState.moved = true;
      widget.classList.add('dragging');
      closeAiRobotBubble();
      playAiRobotOnce('alert');
    }
    if (aiRobotDragState.moved) {
      const b = aiRobotBounds();
      let nx = aiRobotDragState.origLeft + dx;
      let ny = aiRobotDragState.origTop + dy;
      nx = Math.max(b.minX, Math.min(b.maxX, nx));
      ny = Math.max(b.minY, Math.min(b.maxY, ny));
      widget.style.left = nx + 'px';
      widget.style.top = ny + 'px';
    }
  });
  widget.addEventListener('pointerup', function () {
    if (!aiRobotDragState) return;
    const wasDrag = aiRobotDragState.moved;
    widget.classList.remove('dragging');
    widget.classList.remove('no-transition');
    try { widget.releasePointerCapture(aiRobotDragState.pointerId); } catch (err) { /* ignore */ }
    aiRobotDragState = null;
    if (wasDrag) aiRobotResumeWander();
    else toggleAiRobotBubble();
  });
  widget.addEventListener('pointercancel', function () {
    aiRobotDragState = null;
    widget.classList.remove('dragging');
    widget.classList.remove('no-transition');
    aiRobotResumeWander();
  });
}

/* ---- FAQ thought bubble ---- */
let aiRobotBubbleOpen = false;
function renderAiRobotQuestionList() {
  const body = document.getElementById('aiRobotBubbleBody');
  if (!body) return;
  const faq = getAiRobotFaqForTab(currentActiveTab);
  body.innerHTML = faq.map(function (item, i) {
    return '<button type="button" class="ai-robot-q-item" onclick="showAiRobotAnswer(' + i + ')">' + escapeForHtml(item.q) + '</button>';
  }).join('');
}
function showAiRobotAnswer(i) {
  const faq = getAiRobotFaqForTab(currentActiveTab);
  const item = faq[i];
  if (!item) return;
  const body = document.getElementById('aiRobotBubbleBody');
  if (!body) return;
  body.innerHTML =
    '<button type="button" class="ai-robot-back-btn" onclick="renderAiRobotQuestionList()">← Back to questions</button>' +
    '<div class="ai-robot-answer-q">' + escapeForHtml(item.q) + '</div>' +
    '<div class="ai-robot-answer-a">' + escapeForHtml(item.a) + '</div>';
  playAiRobotOnce('yes');
}
window.showAiRobotAnswer = showAiRobotAnswer;
window.renderAiRobotQuestionList = renderAiRobotQuestionList;
function positionAiRobotBubble() {
  const widget = document.getElementById('aiRobotWidget');
  const bubble = document.getElementById('aiRobotBubble');
  if (!widget || !bubble) return;
  const rect = widget.getBoundingClientRect();
  bubble.classList.remove('above', 'below', 'align-left', 'align-right');
  bubble.classList.add(rect.top > 340 ? 'above' : 'below');
  const bubbleWidth = 300;
  if (rect.left + rect.width / 2 - bubbleWidth / 2 < 8) bubble.classList.add('align-left');
  else if (rect.left + rect.width / 2 + bubbleWidth / 2 > window.innerWidth - 8) bubble.classList.add('align-right');
}
function toggleAiRobotBubble() {
  if (aiRobotBubbleOpen) closeAiRobotBubble(); else openAiRobotBubble();
}
function openAiRobotBubble() {
  const bubble = document.getElementById('aiRobotBubble');
  if (!bubble) return;
  renderAiRobotQuestionList();
  positionAiRobotBubble();
  bubble.classList.add('show');
  aiRobotBubbleOpen = true;
  aiRobotPauseWander();
  playAiRobotOnce('thinking');
}
function closeAiRobotBubble() {
  const bubble = document.getElementById('aiRobotBubble');
  if (!bubble) return;
  bubble.classList.remove('show');
  aiRobotBubbleOpen = false;
  aiRobotResumeWander();
}
window.closeAiRobotBubble = closeAiRobotBubble;
window.toggleAiRobotBubble = toggleAiRobotBubble;

window.addEventListener('resize', function () {
  const widget = document.getElementById('aiRobotWidget');
  if (!widget || !widget.style.left) return;
  const b = aiRobotBounds();
  const curX = parseFloat(widget.style.left) || 0;
  const curY = parseFloat(widget.style.top) || 0;
  widget.classList.add('no-transition');
  widget.style.left = Math.max(b.minX, Math.min(b.maxX, curX)) + 'px';
  widget.style.top = Math.max(b.minY, Math.min(b.maxY, curY)) + 'px';
  if (aiRobotBubbleOpen) positionAiRobotBubble();
});

function initAiRobotWidget() {
  const widget = document.getElementById('aiRobotWidget');
  if (!widget) return;
  const b = aiRobotBounds();
  widget.classList.add('no-transition');
  widget.style.left = Math.min(60, b.maxX) + 'px';
  widget.style.top = Math.min(170, b.maxY) + 'px';
  initAiRobotAnimPlayer();
  aiRobotInitDrag();
  aiRobotScheduleWander();
}
window.initAiRobotWidget = initAiRobotWidget;

/* ================= SIDEBAR HAMBURGER ANIMATION ================= */
const HAMBURGER_SEGMENTS = { toX: [0, 45], toHamburger: [45, 75] };
let sidebarHamburgerLottieAnim = null;
function initSidebarHamburgerAnim() {
  const el = document.getElementById('sidebarHamburgerAnim');
  if (!el || typeof lottie === 'undefined' || sidebarHamburgerLottieAnim) return;
  try {
    el.innerHTML = '';
    sidebarHamburgerLottieAnim = lottie.loadAnimation({
      container: el, renderer: 'svg', loop: false, autoplay: false, animationData: HAMBURGER_MENU_ANIM
    });
    sidebarHamburgerLottieAnim.addEventListener('DOMLoaded', function () {
      syncSidebarHamburgerIcon(false);
    });
  } catch (e) { /* decorative — fail silently */ }
}
window.initSidebarHamburgerAnim = initSidebarHamburgerAnim;
function syncSidebarHamburgerIcon(animate) {
  if (!sidebarHamburgerLottieAnim) return;
  const sidebar = document.getElementById('mainSidebar');
  const isOpen = !!sidebar && !sidebar.classList.contains('collapsed');
  try {
    if (animate) {
      sidebarHamburgerLottieAnim.playSegments(isOpen ? HAMBURGER_SEGMENTS.toX : HAMBURGER_SEGMENTS.toHamburger, true);
    } else {
      sidebarHamburgerLottieAnim.goToAndStop(isOpen ? HAMBURGER_SEGMENTS.toX[1] : HAMBURGER_SEGMENTS.toHamburger[1], true);
    }
  } catch (e) { /* ignore */ }
}
window.syncSidebarHamburgerIcon = syncSidebarHamburgerIcon;

/* ================= RESULTS PERCENTAGE STAT ANIMATIONS ================= */
function initPercentStatAnim(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof lottie === 'undefined') return;
  try {
    el.innerHTML = '';
    lottie.loadAnimation({
      container: el, renderer: 'svg', loop: true, autoplay: true, animationData: PERCENT_LOADING_ANIM
    });
  } catch (e) { /* decorative — fail silently */ }
}
function initPercentStatAnims() {
  initPercentStatAnim('avgScorePercentAnim');
  initPercentStatAnim('highScorePercentAnim');
}
window.initPercentStatAnims = initPercentStatAnims;


/* ================= PAGE START =================
   Each page script calls this last, once all of its own functions exist. */
let taStarted = false;
function taStartPage(defaultTab) {
  // A section added later by taNavigate() only needs its own panels; the app
  // around it is already running.
  if (taStarted) return;
  taStarted = true;
  TA_LOADED_PAGES.add(taCurrentPageFile());
  TA_PAGE_TITLES[taCurrentPageFile()] = document.title;
  if (TA_CLEAN_URLS && /\.html$/.test(location.pathname)) {
    history.replaceState(null, '', taAddressFor(taCurrentPageFile(), location.search, location.hash));
  }
  applyTheme();
  updateSoundToggleUI();
  applyAvatar();
  document.getElementById('sidebarProfileName').textContent = getTeacherName();
  (function () { const el = document.getElementById('sidebarProfileLogin'); if (el && taCurrentLogin()) el.textContent = '@' + taCurrentLogin(); })();
  // create.html#flashcard opens the Flashcard builder directly, and so on.
  const hashTab = decodeURIComponent(location.hash.slice(1));
  switchTo(hashTab && document.getElementById('panel-' + hashTab) ? hashTab : defaultTab);
  initWelcomeSplash();
  initThemeToggleAnim();
  initBrandArcAnim();
  initStatsIconAnim();
  initCreateIconAnim();
  initCreateHeadingAnim();
  initAiRobotWidget();
  initSidebarHamburgerAnim();
  initPercentStatAnims();

  /* Re-check lesson reminders periodically so the reminder pop-ups and "starts
     soon" badges stay accurate even if the app is left open across the 24h boundary. */
  setInterval(function () {
    showReminderToastIfDue();
    if (currentActiveTab === 'main') renderNextLessons();
  }, 5 * 60 * 1000);

  const idle = window.requestIdleCallback || function (fn) { setTimeout(fn, 1500); };
  idle(taPrefetchPages);
}
