/* ================= PAGES & TAB SWITCHING =================
   Every sidebar section is its own HTML file. A "tab" is one panel; the Create
   page holds several (the picker plus every exercise builder). Moving between
   sections doesn't reload the app: taNavigate() fetches the other section's
   file once, adds its panels and scripts to this page, and switches to it
   (see PAGE NAVIGATION below). Opening any file directly still works too. */
/* ================= ANIMATION BUDGET =================
   Every looping Lottie animation pauses while it can't be seen (scrolled
   away, inside the closed sidebar, or the tab is in the background) and
   resumes when it comes back. Phones also draw them at lower quality. This
   keeps the app smooth on phones and saves battery. */
const TA_LOW_POWER = (window.matchMedia && window.matchMedia('(max-width: 860px), (pointer: coarse)').matches) ||
  !!(navigator.connection && navigator.connection.saveData);
(function () {
  if (typeof lottie === 'undefined' || lottie.__taManaged) return;
  lottie.__taManaged = true;
  if (TA_LOW_POWER && lottie.setQuality) lottie.setQuality('low');
  const managed = new Map(); // container -> { anim, visible }
  const sync = entry => {
    const { anim, visible } = entry;
    const shouldRun = visible && !document.hidden;
    if (!shouldRun && !anim.isPaused) { anim.__taAutoPaused = true; anim.pause(); }
    else if (shouldRun && anim.__taAutoPaused) { anim.__taAutoPaused = false; anim.play(); }
  };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => {
      const entry = managed.get(e.target);
      if (!entry) return;
      // off-screen or hidden (visibility:hidden, e.g. the closed sidebar) counts as not visible
      entry.visible = e.isIntersecting && getComputedStyle(e.target).visibility !== 'hidden';
      sync(entry);
    });
  }) : null;
  document.addEventListener('visibilitychange', () => managed.forEach(sync));
  // the sidebar hides with visibility, which IntersectionObserver doesn't report: re-check when it opens/closes
  document.addEventListener('transitionend', e => {
    if (!e.target.classList || !e.target.classList.contains('sidebar')) return;
    managed.forEach((entry, el) => { if (e.target.contains(el)) { entry.visible = getComputedStyle(el).visibility !== 'hidden'; sync(entry); } });
  });
  const load = lottie.loadAnimation.bind(lottie);
  lottie.loadAnimation = function (params) {
    const anim = load(params);
    const el = params && params.container;
    if (io && el && params.loop !== false && params.autoplay !== false) {
      const old = managed.get(el);
      if (old) managed.delete(el);
      managed.set(el, { anim: anim, visible: true });
      io.observe(el);
      anim.addEventListener('destroy', () => { managed.delete(el); io.unobserve(el); });
    }
    return anim;
  };
})();

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
const BUILDER_TABS = ['wordorder', 'makeaword', 'flashcard', 'presentation', 'pronunciation', 'spelling', 'test', 'sentences', 'bilingual', 'engcontent', 'dictation', 'jungle', 'bamboozle', 'ielts-listening', 'ielts-reading', 'ielts-writing', 'ielts-speaking'];
const READY_TABS = ['flashcard', 'wordorder', 'makeaword', 'spelling', 'sentences', 'bilingual', 'engcontent', 'dictation', 'jungle', 'bamboozle'];
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
  myexercises: { eyebrow: "📁 My Exercises", title: "Everything you've built", sub: "Every exercise you've created — reopen it to make a new version, jump to its results, or turn off its points." },
  students: { eyebrow: "Students", title: "Your class roster", sub: "Give each student a unique ID so they can earn points without typing a name or code." },
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
// The speaker button at the top of the Dashboard.
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
// Computers: the sidebar sits beside the page and starts open on every page;
// the menu button closes it and the page takes the room.
// Phones (860px and narrower): it slides in over the page, starts closed, and
// the backdrop or picking a section closes it.
const TA_PHONE_MQ = window.matchMedia ? window.matchMedia('(max-width: 860px)') : { matches: false };
function taIsPhone() { return TA_PHONE_MQ.matches; }
function taCloseSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  if (!sidebar || sidebar.classList.contains('collapsed')) return;
  sidebar.classList.add('collapsed');
  if (typeof syncSidebarHamburgerIcon === 'function') syncSidebarHamburgerIcon(true);
}
function taSetupSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  if (!sidebar || document.getElementById('sidebarBackdrop')) return;
  const back = document.createElement('div');
  back.className = 'sidebar-backdrop';
  back.id = 'sidebarBackdrop';
  back.addEventListener('click', taCloseSidebar);
  sidebar.after(back);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && taIsPhone()) taCloseSidebar(); });
  const applyMode = () => {
    if (taIsPhone()) taCloseSidebar();
    else sidebar.classList.remove('collapsed');
    if (typeof syncSidebarHamburgerIcon === 'function') syncSidebarHamburgerIcon(false);
  };
  applyMode();
  if (TA_PHONE_MQ.addEventListener) TA_PHONE_MQ.addEventListener('change', applyMode);
  else if (TA_PHONE_MQ.addListener) TA_PHONE_MQ.addListener(applyMode);
}
function toggleSidebar() {
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
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  if (toggleBtn) toggleBtn.style.visibility = 'visible';
  if (taIsPhone()) taCloseSidebar(); // phones: picking a section closes the panel
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
    // no-cache: ask the server whether there's a newer copy (the browser would otherwise
    // reuse its saved page for a while after an update, with the old scripts in it)
    TA_PAGE_HTML[file] = fetch(file, { cache: 'no-cache' }).then(r => {
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
// The ?v= stamp of the app's files a page uses (one stamp for every page).
function taPageStamp(doc) {
  const sc = Array.from(doc.querySelectorAll('script[src]')).map(x => x.getAttribute('src') || '').find(x => /js\/common\.js\?v=/.test(x));
  return sc ? sc.split('?v=')[1] : '';
}
async function taLoadPage(file) {
  const doc = new DOMParser().parseFromString(await taFetchPage(file), 'text/html');
  // A newer (or older) version of the app than the page already open: mixing them would
  // show one section new and another old — open that section with a full page load.
  const mine = taPageStamp(document), theirs = taPageStamp(doc);
  if (mine && theirs && mine !== theirs) throw new Error('another version of the app');
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
  taInitSectionAnims();
}

// Animations that live inside one section's panels (not the shared sidebar).
// taStartPage() only sees the first section's panels, so this runs again each
// time taLoadPage() adds another section; each init skips a spot already playing.
function taInitSectionAnims() {
  initThemeToggleAnim();
  initCreateHeadingAnim();
  initPercentStatAnims();
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
      if (TA_LOW_POWER) return; // phones: skip ~2 MB of scripts until a section is actually opened
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
  taUndoAction = null; // a newer message replaces any Undo button
  toast.className = 'toast show' + (kind === 'ok' ? ' ok' : '');
  if (kind === 'ok') taSuccessChime(); else taErrorBuzz();
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* A toast with an Undo button, used instead of "Are you sure?" pop-ups:
   the change happens straight away and can be taken back for a few seconds
   (the button, or Ctrl+Z). */
let taUndoAction = null;
function showUndoToast(message, onUndo) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message + ' ';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'toast-undo';
  btn.textContent = '↶ Undo';
  const action = function () {
    if (taUndoAction !== action) return;
    taUndoAction = null;
    clearTimeout(toastTimeout);
    toast.classList.remove('show');
    onUndo();
  };
  btn.onclick = action;
  toast.appendChild(btn);
  toast.className = 'toast show ok';
  taSuccessChime();
  taUndoAction = action;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    if (taUndoAction === action) taUndoAction = null;
  }, 7000);
}
document.addEventListener('keydown', function (e) {
  if (!taUndoAction || !(e.ctrlKey || e.metaKey) || e.shiftKey || e.key.toLowerCase() !== 'z') return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return; // let text fields undo their own typing
  e.preventDefault();
  taUndoAction();
});

/* ================= DOWNLOAD HELPER ================= */
// Exercise files load their login animation from this site, so every
// downloaded file gets the site's address (e.g. https://…github.io/teachers_assistant/).
// Opened from disk the app has no web address, and the files keep the 🔐 instead.
const TA_APP_URL = /^https?:$/.test(location.protocol) ? new URL('.', location.href).href : '';

/* ---- Exercise links (play.html?x=<uid>) ----
   Every exercise is also put online for 7 days (js/firebase.js), so students
   can open it from a link — iPhones can't open exercise files, and a phone
   only allows the microphone on a web page. Sharing again renews the 7 days.
   See CLAUDE.md for the limits this runs into. */
const TA_PLAY_DAYS = 7;
function taPlayUrl(uid) { return /^https:/.test(TA_APP_URL) && uid ? TA_APP_URL + 'play.html?x=' + encodeURIComponent(uid) : ''; }
// online now, and for at least another hour
function taPlayLive(item) {
  const t = item && Date.parse(item.playAt || '');
  return !!t && Date.now() - t < TA_PLAY_DAYS * 86400000 - 3600000;
}
function taPlayUntil(item) {
  const t = item && Date.parse(item.playAt || '');
  return t ? new Date(t + TA_PLAY_DAYS * 86400000) : null;
}
async function taPublishPlayable(uid, html) {
  if (!taPlayUrl(uid) || !html) return false;
  const publish = await taWaitFor('taPublishPlay', 9000);
  if (!publish) return false;
  const before = getRecentExercises().find(e => e.uid === uid);
  const res = await publish(uid, html.split('__TA_APP_URL__').join(TA_APP_URL), before && before.playParts);
  if (!res) return false;
  const list = getRecentExercises();
  const item = list.find(e => e.uid === uid);
  if (item) { item.playAt = res.date; item.playParts = res.parts; item.playBytes = res.bytes; delete item.playPublished; saveRecentExercises(list); }
  if (window.renderRecentExercises) window.renderRecentExercises();
  return true;
}
window.taPlayUrl = taPlayUrl;
window.taPlayLive = taPlayLive;
window.taPlayUntil = taPlayUntil;
window.taPublishPlayable = taPublishPlayable;

/* ---- Database limits: warn the teacher ----
   The app can't read Firebase's usage, so it warns from what it sees:
   - Firebase answering "resource-exhausted" (a daily or monthly limit of the
     free plan was reached) — from any read or write (js/firebase.js);
   - the space exercise links take, measured by the twice-a-day cleanup. */
const TA_DB_FREE_BYTES = 1024 * 1024 * 1024;   // the free plan's storage: 1 GiB
const TA_PLAY_WARN_BYTES = 400 * 1024 * 1024;   // links alone over 400 MB: warn
function taDbWarning(id, title, text) {
  if (!window.__TA_USER) return;
  try { if (+localStorage.getItem('ta_db_warn_hidden_' + id) > Date.now()) return; } catch (e) { /* ignore */ }
  let box = document.getElementById(id);
  if (!box) {
    box = document.createElement('div');
    box.id = id;
    box.className = 'lesson-warn db-warn';
    box.setAttribute('role', 'alert');
    taNoticeStack().prepend(box);
  }
  box.innerHTML = '<div class="lesson-warn-head"><span>' + title + '</span><button type="button" class="lesson-warn-close" aria-label="Close">✕</button></div>' +
    '<div class="db-warn-text">' + text + '</div>' +
    '<div class="done-warn-foot"><a class="done-warn-results" href="https://console.firebase.google.com/project/teachers-assistant-app-ccd1a/usage" target="_blank" rel="noopener">Open Firebase usage</a>' +
    '<button type="button" class="done-warn-all">Remind me tomorrow</button></div>';
  box.querySelector('.lesson-warn-close').onclick = () => box.classList.remove('show');
  box.querySelector('.done-warn-all').onclick = () => {
    try { localStorage.setItem('ta_db_warn_hidden_' + id, String(Date.now() + 86400000)); } catch (e) { /* ignore */ }
    box.classList.remove('show');
  };
  void box.offsetWidth;
  box.classList.add('show');
}
let taDbLimitShown = false;
window.taDbLimitReached = function () {
  if (taDbLimitShown) return;
  taDbLimitShown = true;
  taDbWarning('taDbLimitWarn', '⚠️ The database has reached a limit',
    'Firebase (where results, sync and exercise links live) refused a request because a limit of its free plan was reached — usually a <b>daily</b> limit, which resets at the start of the next day (Pacific time). Until then results may not arrive and links may not open. If this happens often, check the usage page, and consider sharing big exercises (audio, pictures) as files instead of links.');
};
/* ---- Weekly backup reminder ----
   A browser can't save a file by itself, so once a week (from the last
   backup downloaded on this device) the app reminds the teacher to download
   one: Settings → Backup, which includes every result from the database. */
const TA_BACKUP_EVERY = 7 * 86400000;
function taBackupReminderIfDue() {
  if (!window.__TA_USER) return;
  let last = 0, snooze = 0, exercises = [];
  try {
    last = Date.parse(localStorage.getItem('ta_last_backup_at') || '') || 0;
    snooze = +localStorage.getItem('ta_backup_remind_at') || 0;
    exercises = JSON.parse(localStorage.getItem('ta_recent_exercises') || '[]');
  } catch (e) { /* ignore */ }
  if (!exercises.length || Date.now() - last < TA_BACKUP_EVERY || Date.now() < snooze) return;
  let box = document.getElementById('taBackupWarn');
  if (!box) {
    box = document.createElement('div');
    box.id = 'taBackupWarn';
    box.className = 'lesson-warn db-warn';
    box.setAttribute('role', 'status');
    taNoticeStack().appendChild(box);
  }
  box.innerHTML = '<div class="lesson-warn-head"><span>💾 Time for a backup</span><button type="button" class="lesson-warn-close" aria-label="Close">✕</button></div>' +
    '<div class="db-warn-text">' + (last ? 'Your last backup from this device was ' + Math.floor((Date.now() - last) / 86400000) + ' days ago.' : 'You haven\'t downloaded a backup from this device yet.') +
    ' One file keeps your students, exercises and <b>all results</b> — if results are ever deleted, they can be put back from it. Keep it somewhere safe (e.g. Google Drive or Telegram "Saved Messages").</div>' +
    '<div class="done-warn-foot"><button type="button" class="done-warn-later">Remind me tomorrow</button><button type="button" class="done-warn-all">Download a backup</button></div>';
  const later = () => { try { localStorage.setItem('ta_backup_remind_at', String(Date.now() + 86400000)); } catch (e) { /* ignore */ } box.classList.remove('show'); };
  box.querySelector('.lesson-warn-close').onclick = later;
  box.querySelector('.done-warn-later').onclick = later;
  box.querySelector('.done-warn-all').onclick = () => {
    box.classList.remove('show');
    if (typeof downloadBackup === 'function') downloadBackup(); else location.href = 'settings.html#backup';
  };
  void box.offsetWidth;
  box.classList.add('show');
}
window.taBackupReminderDone = function () { const b = document.getElementById('taBackupWarn'); if (b) b.classList.remove('show'); };
function taSweepPlayLinksIfDue() {
  if (!window.__TA_USER || !window.taSweepPlayLinks) return;
  let last = 0;
  try { last = +localStorage.getItem('ta_play_sweep_at') || 0; } catch (e) { /* ignore */ }
  if (Date.now() - last < 12 * 3600000) return;
  try { localStorage.setItem('ta_play_sweep_at', String(Date.now())); } catch (e) { /* ignore */ }
  window.taSweepPlayLinks().then(r => {
    try { localStorage.setItem('ta_play_usage', JSON.stringify({ at: Date.now(), bytes: r.liveBytes, links: r.liveLinks })); } catch (e) { /* ignore */ }
    if (r.liveBytes > TA_PLAY_WARN_BYTES) {
      const mb = Math.round(r.liveBytes / 1048576);
      taDbWarning('taDbSpaceWarn', '⚠️ Exercise links are taking a lot of space',
        r.liveLinks + (r.liveLinks === 1 ? ' exercise link is' : ' exercise links are') + ' online, taking about <b>' + mb + ' MB</b> of the database\'s ' + Math.round(TA_DB_FREE_BYTES / 1048576) + ' MB (free plan). They are deleted 7 days after they were shared, so this goes down by itself — but if it keeps growing, share exercises with audio or pictures as files instead of links.');
    }
  }).catch(() => { /* try again next time */ });
}

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
  const roster = getPointsRoster();
  const at = roster.findIndex(s => s.id === id);
  if (at === -1) return;
  const st = roster[at];
  roster.splice(at, 1);
  savePointsRoster(roster);
  refreshRosterViews();
  showUndoToast('Removed ' + st.name + ' (ID ' + st.id + ').', function () {
    const now = getPointsRoster();
    if (now.some(s => s.id === st.id)) return;
    now.splice(Math.min(at, now.length), 0, st);
    savePointsRoster(now);
    refreshRosterViews();
    showToast(st.name + ' is back.', 'ok');
  });
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
/* Results: the students of an exercise's group (chosen when it was made, or
   in My Exercises) who haven't done it. An exercise made without a group has
   no such list. doneStudents: the roster students who did it. */
function taMissingStudentsHtml(exercise, doneStudents) {
  if (!exercise) return '';
  const group = getStudentGroups().find(g => g.id === exercise.groupId) || null;
  if (!group) return '';
  const done = new Set((doneStudents || []).filter(Boolean).map(st => String(st.id).trim().toLowerCase()));
  const missing = getPointsRoster().filter(st => st.group === group.id && !done.has(String(st.id).trim().toLowerCase()));
  const chip = st => {
    const pk = taPunishKey(exercise.code, st.id);
    return '<span class="missing-student' + (taIsPunished(pk) ? ' punished' : '') + '"><span class="res-avatar" style="background:' + avatarColorForName(st.name) + ';">' +
      escapeForHtml(initialsForName(st.name)) + '</span><span translate="no">' + escapeForHtml(st.name) + '</span><small>ID ' + escapeForHtml(String(st.id)) + '</small>' +
      (exercise.code ? taPunishChipHtml(pk) : '') + '</span>';
  };
  const gName = '<span translate="no">' + escapeForHtml(group.name) + '</span>';
  return '<div class="results-section missing-section">' +
    '<div class="results-section-head"><h3>🚫 Didn\'t do it — ' + gName + ' (' + missing.length + ')</h3>' +
    '<p>Students in ' + gName + ' (this exercise\'s group) with no result yet.</p></div>' +
    (missing.length ? '<div class="missing-list">' + missing.map(chip).join('') + '</div>'
      : '<div class="empty-results">Everyone in ' + gName + ' has done it. 🎉</div>') +
    '</div>';
}
function taExerciseForCode(code) {
  return code ? (getRecentExercises() || []).find(e => e.code === code) || null : null;
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
  document.body.dataset.design = getDesign();
  document.body.classList.toggle('glass-ui', getUiStyle() === 'glass');
  // the phone's status bar (installed app) takes the design's page colour
  const d = taDesignByKey(getDesign());
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && d) meta.setAttribute('content', d.base);
}

/* ================= DESIGNS =================
   Six colour designs (css/style.css, "DESIGNS"), picked from the 🎨 button
   next to the day/night switch. Four are day designs and two (Dragon Fruit,
   Lime Spark) are night designs: picking one switches to its mode. The last
   day design and the last night design are remembered separately, so the
   day/night switch brings each back (Burnt Orange / Dragon Fruit at first). */
const LS_DESIGN_DAY = 'ta_design_day';
const LS_DESIGN_NIGHT = 'ta_design_night';
const TA_DESIGNS = [{"key": "signal", "name": "Signal Blue", "accent": "#0057FF", "base": "#F8F7F4", "mode": "day"}, {"key": "emerald", "name": "Emerald Ink", "accent": "#064E3B", "base": "#F8E7C9", "mode": "day"}, {"key": "dragonfruit", "name": "Dragon Fruit", "accent": "#FF4696", "base": "#1E1033", "mode": "night"}, {"key": "lime", "name": "Lime Spark", "accent": "#B6FF2E", "base": "#23262F", "mode": "night"}, {"key": "ultraviolet", "name": "Ultra Violet", "accent": "#6A00F4", "base": "#FFD6A5", "mode": "day"}, {"key": "burntorange", "name": "Burnt Orange", "accent": "#FC6C26", "base": "#FFF4D6", "mode": "day"}];
const TA_DEFAULT_DESIGN = { day: 'burntorange', night: 'dragonfruit' };
function taDesignByKey(key) { return TA_DESIGNS.find(x => x.key === key) || null; }
function getDesign() {
  const mode = getTheme() === 'light' ? 'day' : 'night';
  let key = '';
  try {
    // one-time move of the earlier single choice into its mode's slot
    const old = localStorage.getItem('ta_design');
    if (old) {
      const d = taDesignByKey(old);
      if (d) localStorage.setItem(d.mode === 'day' ? LS_DESIGN_DAY : LS_DESIGN_NIGHT, old);
      localStorage.removeItem('ta_design');
    }
    key = localStorage.getItem(mode === 'day' ? LS_DESIGN_DAY : LS_DESIGN_NIGHT) || '';
  } catch (e) { /* ignore */ }
  const d = taDesignByKey(key);
  return d && d.mode === mode ? key : TA_DEFAULT_DESIGN[mode];
}
function setDesign(key) {
  const d = taDesignByKey(key);
  if (!d) return;
  try { localStorage.setItem(d.mode === 'day' ? LS_DESIGN_DAY : LS_DESIGN_NIGHT, key); } catch (e) { /* ignore */ }
  const wantLight = d.mode === 'day';
  if ((getTheme() === 'light') !== wantLight) {
    // switch mode the same way the day/night switch does (with its animation)
    if (typeof toggleThemeAnimated === 'function') toggleThemeAnimated(); else setTheme(wantLight ? 'light' : 'dark');
  } else applyTheme();
  renderDesignPicker();
}
/* Style: the classic solid blocks, or glassmorphism (frosted, see-through
   blocks over a soft colour backdrop, css/style.css "GLASS STYLE"). It goes
   with every colour design, day and night, and is picked in the same 🎨 box. */
const LS_UI_STYLE = 'ta_ui_style';
function getUiStyle() {
  try { return localStorage.getItem(LS_UI_STYLE) === 'glass' ? 'glass' : 'classic'; } catch (e) { return 'classic'; }
}
function setUiStyle(style) {
  try { localStorage.setItem(LS_UI_STYLE, style === 'glass' ? 'glass' : 'classic'); } catch (e) { /* ignore */ }
  applyTheme();
  renderDesignPicker();
}
window.setUiStyle = setUiStyle;
function renderDesignPicker() {
  const box = document.getElementById('designPicker');
  if (!box) return;
  const cur = getDesign();
  const style = getUiStyle();
  const styleBtn = (key, label) => '<button type="button" class="style-option' + (style === key ? ' active' : '') + '" onclick="setUiStyle(\'' + key + '\')" aria-pressed="' + (style === key) + '">' + label + '</button>';
  box.innerHTML = '<div class="design-picker-title">✨ Style</div>' +
    '<div class="style-choice">' + styleBtn('classic', '<span class="style-swatch classic"></span>Classic') + styleBtn('glass', '<span class="style-swatch glass"></span>Glass') + '</div>' +
    '<div class="design-picker-title">🎨 Design</div>' + TA_DESIGNS.map(d =>
    '<button type="button" class="design-option' + (d.key === cur ? ' active' : '') + '" onclick="setDesign(\'' + d.key + '\')" aria-pressed="' + (d.key === cur) + '">' +
      '<span class="design-swatch" style="background:conic-gradient(' + d.accent + ' 0 50%, ' + d.base + ' 50% 100%)"></span>' +
      '<span>' + escapeForHtml(d.name) + '<small class="design-mode">' + (d.mode === 'day' ? '☀️ Day' : '🌙 Night') + '</small></span>' +
    '</button>').join('');
}
function toggleDesignPicker(ev) {
  if (ev) ev.stopPropagation();
  const box = document.getElementById('designPicker');
  const btn = document.getElementById('designPickerBtn');
  if (!box) return;
  const open = box.hasAttribute('hidden');
  if (open) {
    renderDesignPicker();
    box.removeAttribute('hidden');
    const r = btn.getBoundingClientRect(), w = box.offsetWidth;
    box.style.top = (r.bottom + 10) + 'px';
    box.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.right - w)) + 'px';
  } else box.setAttribute('hidden', '');
  if (btn) btn.setAttribute('aria-expanded', String(open));
}
document.addEventListener('click', e => {
  const box = document.getElementById('designPicker');
  if (box && !box.hasAttribute('hidden') && !e.target.closest('.hero-design-wrap')) box.setAttribute('hidden', '');
});
document.addEventListener('keydown', e => {
  const box = document.getElementById('designPicker');
  if (e.key === 'Escape' && box && !box.hasAttribute('hidden')) box.setAttribute('hidden', '');
});
['scroll', 'resize'].forEach(ev => window.addEventListener(ev, () => {
  const box = document.getElementById('designPicker');
  if (box && !box.hasAttribute('hidden')) box.setAttribute('hidden', '');
}, { passive: true }));
window.setDesign = setDesign;
window.toggleDesignPicker = toggleDesignPicker;

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

/* The list must not be lost when the browser's storage is full: make room by
   dropping saved copies of exercise files (they're only for "Redownload"),
   oldest first, and say so if it still can't be saved. */
function saveRecentExercises(list) {
  slimSetRounds(list, false);
  for (let tries = 0; tries < 25; tries++) {
    try { localStorage.setItem(LS_RECENT_EXERCISES, JSON.stringify(list)); return true; }
    catch (e) {
      if (taFreeExerciseCacheSpace(list)) continue;
      if (slimSetRounds(list, true)) continue; // last resort: sets keep "Use again", lose "Get one"
      break;
    }
  }
  if (typeof showToast === 'function') showToast('⚠️ This browser\'s storage is full, so My Exercises couldn\'t be saved. Download a backup in Settings, then delete some old exercises.');
  return false;
}
/* Homework/Class sets used to keep a full copy of every round's file in the list
   itself, which filled the browser's storage. The rounds are inside the set's own
   file (kept for Redownload), so the copies are dropped whenever that file is there
   — or, with force, from the oldest set that still has them. True if any went. */
function slimSetRounds(list, force) {
  let slimmed = false;
  const sets = list.filter(e => e && e.mergedItems && e.mergedItems.some(r => r && r.html));
  if (force) sets.reverse(); // oldest first
  for (const e of sets) {
    if (!force && !getCachedExerciseHtml(e.uid)) continue;
    e.mergedItems = e.mergedItems.map(r => ({ title: r.title, typeLabel: r.typeLabel }));
    slimmed = true;
    if (force) break;
  }
  return slimmed;
}

/* One exercise of a Homework/Class set as a file of its own, taken from the set's
   file: with the set's class code, and the set's points. Null if the set's file
   isn't saved in this browser any more. */
function setRoundHtml(item, i) {
  const r = item.mergedItems && item.mergedItems[i];
  if (r && r.html) return r.html; // sets made before this change
  const wrapper = getCachedExerciseHtml(item.uid);
  const m = wrapper && wrapper.match(/const HWC_ROUNDS = (.*);\n/);
  if (!m) return null;
  let rounds;
  try { rounds = JSON.parse(m[1]); } catch (e) { return null; }
  if (!rounds[i]) return null;
  const pts = Math.max.apply(null, rounds.map(x => Number((x.html.match(/const POINTS_AWARD = (-?\d+(?:\.\d+)?);/) || [])[1]) || 0));
  return rounds[i].html
    .replace(/const REQUIRED_CODE = "[^"]*";/, 'const REQUIRED_CODE = ' + JSON.stringify(item.requiredCode || '') + ';')
    .replace(/const POINTS_AWARD = -?\d+(?:\.\d+)?;/, 'const POINTS_AWARD = ' + pts + ';');
}

// Drops one saved exercise file (the oldest in the list, or one no longer listed). False when there's none left.
function taFreeExerciseCacheSpace(list) {
  try {
    const cache = JSON.parse(localStorage.getItem(LS_EXERCISE_HTML_CACHE) || '{}');
    const keys = Object.keys(cache);
    if (!keys.length) return false;
    const order = (list || getRecentExercises()).map(e => e.uid);
    const unlisted = keys.find(k => order.indexOf(k) === -1);
    const victim = unlisted || keys.sort((a, b) => order.indexOf(b) - order.indexOf(a))[0];
    delete cache[victim];
    localStorage.setItem(LS_EXERCISE_HTML_CACHE, JSON.stringify(cache));
    return true;
  } catch (e) { return false; }
}

function pushRecentExercise(entry) {
  const list = getRecentExercises();
  const snap = (window.taSnapshotForMyExercises && !entry.mergedItems) ? window.taSnapshotForMyExercises() : null;
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
    mergedItems: entry.mergedItems || null,
    // The builder's form as it was, so "Use again" can reopen it filled in (set by the Create page).
    builderTab: entry.builderState ? entry.builderTab : (snap && snap.state ? snap.tab : null),
    builderState: entry.builderState || (snap ? snap.state : null),
    groupId: entry.groupId || (snap && snap.groupId) || '',
    setKind: entry.setKind || null,          // Homework/Class sets: 'homework' | 'class'
    setTitle: entry.setTitle || '',          // … and the title the teacher gave it
    builderRounds: entry.builderRounds || null // … and each round's form
  });
  saveRecentExercises(list.slice(0, 200));
  if (entry.html) cacheExerciseHtml(entry.uid, entry.html);
  if (entry.html && taPlayUrl(entry.uid)) {
    setTimeout(() => {
      if (getRecentExercises().some(e => e.uid === entry.uid)) taPublishPlayable(entry.uid, entry.html);
    }, 5000);
  }
  if (window.startPlainCompletionsSync) { clearTimeout(window.__taResyncTimer); window.__taResyncTimer = setTimeout(window.startPlainCompletionsSync, 3000); }
  if (window.renderRecentExercises) window.renderRecentExercises();
}

/* Used when an exercise is moved into a Homework/Class set \u2014 it should
   no longer appear as its own separate entry in My Exercises. */
function removeRecentExercise(uid) {
  const gone = getRecentExercises().find(e => e.uid === uid);
  if (gone && gone.playAt && window.taUnpublishPlay) window.taUnpublishPlay(uid, gone.playParts);
  const list = getRecentExercises().filter(e => e.uid !== uid);
  saveRecentExercises(list);
  try {
    const cache = JSON.parse(localStorage.getItem(LS_EXERCISE_HTML_CACHE) || '{}');
    delete cache[uid];
    localStorage.setItem(LS_EXERCISE_HTML_CACHE, JSON.stringify(cache));
  } catch (e) { /* ignore */ }
  taDeleteBigFile(uid);
  if (window.renderRecentExercises) window.renderRecentExercises();
}

/* Exercise files are cached separately from the lightweight metadata list
   above (and capped in count) so My Exercises can offer a real
   re-download of each exercise, without risking this growing large
   enough to threaten the browser's storage quota for everything else. */
const LS_EXERCISE_HTML_CACHE = 'ta_exercise_html_cache';
const MAX_CACHED_EXERCISE_HTML = 20;

// All saved copies together stay under this many characters (the browser allows ~5 million
// for everything this site keeps), so there's always room left for the lists themselves.
const MAX_CACHED_EXERCISE_CHARS = 2200000;

function cacheExerciseHtml(uid, html) {
  // Big files (pictures, audio) don't fit in this small storage (or cloud sync): IndexedDB keeps them.
  if (typeof html === 'string' && html.length > 1048576) { taPutBigFile(uid, html); return; }
  try {
    const cache = JSON.parse(localStorage.getItem(LS_EXERCISE_HTML_CACHE) || '{}');
    cache[uid] = html;
    // newest first: this file, then the list's order; files no longer listed go first
    const order = getRecentExercises().map(e => e.uid);
    const rank = k => k === uid ? -1 : (order.indexOf(k) === -1 ? 1e9 : order.indexOf(k));
    const keys = Object.keys(cache).sort((a, b) => rank(a) - rank(b));
    let total = 0;
    keys.forEach((k, i) => {
      total += cache[k].length;
      if (k !== uid && (i >= MAX_CACHED_EXERCISE_HTML || total > MAX_CACHED_EXERCISE_CHARS)) delete cache[k];
    });
    for (;;) {
      try { localStorage.setItem(LS_EXERCISE_HTML_CACHE, JSON.stringify(cache)); break; }
      catch (e) {
        const oldest = Object.keys(cache).sort((a, b) => rank(b) - rank(a)).find(k => k !== uid);
        if (!oldest) throw e;
        delete cache[oldest];
      }
    }
  } catch (e) { if (typeof html === 'string') taPutBigFile(uid, html); /* storage full: keep it in IndexedDB instead */ }
}
function getCachedExerciseHtml(uid) {
  try {
    const cache = JSON.parse(localStorage.getItem(LS_EXERCISE_HTML_CACHE) || '{}');
    return cache[uid] || taBigHtml.get(uid) || null;
  } catch (e) { return taBigHtml.get(uid) || null; }
}

/* ---- Big exercise files (over 1 MB: sets with pictures, dictations with audio) ----
   The browser's small storage (~5 MB for everything this site keeps) can't hold
   them, so they're kept in IndexedDB (room for hundreds of MB), per account, the
   newest MAX_BIG_FILES of them, and read into memory at page start so
   getCachedExerciseHtml stays instant. Before 2026-10-02 such files weren't kept
   at all, so "Redownload" and "Get one exercise" didn't work for them;
   taEnsureExerciseHtml fetches those back from their online link (7 days). */
const MAX_BIG_FILES = 15;
const taBigHtml = new Map();
let taBigReady = null;
function taBigDb() {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open('ta_big_files' + (window.__TA_NS || ''), 1);
    r.onupgradeneeded = () => r.result.createObjectStore('html');
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
function taLoadBigFiles() {
  if (!taBigReady) {
    taBigReady = taBigDb().then(db => new Promise(resolve => {
      const req = db.transaction('html', 'readonly').objectStore('html').openCursor();
      req.onsuccess = () => { const c = req.result; if (c) { if (!taBigHtml.has(c.key)) taBigHtml.set(c.key, c.value); c.continue(); } else resolve(); };
      req.onerror = () => resolve();
    })).catch(() => { /* no IndexedDB here: big files just aren't kept */ })
      .then(() => { if (taBigHtml.size && window.renderRecentExercises && document.getElementById('recentExercisesWrap')) window.renderRecentExercises(); });
  }
  return taBigReady;
}
function taPutBigFile(uid, html) {
  taBigHtml.set(uid, html);
  // keep the newest ones that are still in My Exercises
  const order = getRecentExercises().map(e => e.uid);
  const rank = k => k === uid ? -1 : (order.indexOf(k) === -1 ? 1e9 : order.indexOf(k));
  const drop = Array.from(taBigHtml.keys()).sort((a, b) => rank(a) - rank(b)).filter((k, i) => k !== uid && (i >= MAX_BIG_FILES || order.indexOf(k) === -1));
  drop.forEach(k => taBigHtml.delete(k));
  taBigDb().then(db => {
    const st = db.transaction('html', 'readwrite').objectStore('html');
    st.put(html, uid);
    drop.forEach(k => st.delete(k));
  }).catch(() => { /* only kept in memory until the page closes */ });
}
function taDeleteBigFile(uid) {
  if (!taBigHtml.delete(uid)) return;
  taBigDb().then(db => db.transaction('html', 'readwrite').objectStore('html').delete(uid)).catch(() => {});
}
// The exercise's file: kept here, or else fetched back from its online link (and kept from now on).
const taRecovering = {};
async function taEnsureExerciseHtml(item) {
  if (!item) return null;
  await taLoadBigFiles();
  const have = getCachedExerciseHtml(item.uid);
  if (have || !taPlayLive(item)) return have;
  if (!taRecovering[item.uid]) {
    if (typeof showToast === 'function') showToast('⏳ Getting the file back from its online link…', 'ok');
    taRecovering[item.uid] = taFetchPlayHtml(item.uid).then(html => {
      if (html) taPutBigFile(item.uid, html);
      return html;
    }).finally(() => { delete taRecovering[item.uid]; });
  }
  return taRecovering[item.uid];
}
// An exercise as it is online (play.html reads it the same way)
async function taFetchPlayHtml(uid) {
  const base = 'https://firestore.googleapis.com/v1/projects/teachers-assistant-app-ccd1a/databases/(default)/documents/results/';
  const key = '?key=AIzaSyCefg2YghdSneABh0ZOUu3-snO4soVw0lA';
  const part = async id => {
    const r = await fetch(base + encodeURIComponent(id) + key);
    if (!r.ok) throw new Error('http ' + r.status);
    const f = (await r.json()).fields || {};
    if (!f.type || f.type.stringValue !== 'TA_SYNC:PLAY' || !f.data) throw new Error('missing');
    return f;
  };
  try {
    const first = await part('play-' + uid);
    const n = Math.max(1, parseInt(String((first.title && first.title.stringValue) || '').split('\u241F')[2], 10) || 1);
    const rest = [];
    for (let i = 1; i < n; i++) rest.push(part('play-' + uid + '-' + i));
    const html = [first.data.stringValue].concat((await Promise.all(rest)).map(f => f.data.stringValue)).join('');
    return html.indexOf('<html') !== -1 ? html : null;
  } catch (e) { return null; }
}
window.taEnsureExerciseHtml = taEnsureExerciseHtml;

/* ================= OLD EXERCISE FILES =================
   An exercise file never changes after it's made, so a file made before a
   fix keeps the old problem. The app checks the files it keeps (My
   Exercises) and the results students send (each carries when its file was
   made, builtAt), and warns the teacher to make a new copy (✏️ Use again).
   Add an entry here whenever a fix needs the teacher to recreate files:
   at = when the fix reached the site; types = which exercises it concerns
   (My Exercises type / a set round's label / a result's type); test(html) =
   true when a kept file shows the problem itself; minor = students can still
   do the exercise. */
const TA_FILE_FIXES = [
  { id: 'script', at: '2026-09-30T16:17:00Z', test: html => taFileScriptBroken(html),
    what: 'has an error and doesn\'t start — "Start" does nothing, and inside a Homework/Class set it asks for a code that doesn\'t exist' },
  { id: 'mic', at: '2026-09-30T18:52:00Z', types: /pronunciation/i,
    what: 'the microphone doesn\'t turn on on phones' },
  { id: 'dictation', at: '2026-09-30T07:06:00Z', types: /dictation/i, minor: true,
    what: 'students see too high a score when they type extra words (your Results show the right one)' },
  { id: 'flashtime', at: '2026-10-02T17:14:00Z', types: /flashcard|vocabulary journey/i,
    what: 'the result often says 0 seconds (the time is lost when the exercise ends), so Results and Top 5 show it wrong' },
  { id: 'sentencesend', at: '2026-10-02T17:14:00Z', types: /^sentences$|sentence writing/i, minor: true,
    what: 'when a student finishes, the start screen can come back instead of the certificate, with one extra warning' },
  { id: 'setsave', at: '2026-10-01T17:30:00Z', types: /^(homework|class)$/i,
    what: 'if a student\'s answers fail to upload, the set still counts the exercise as done — you see "Completed" but no answers' }
];
const taScriptCheckCache = new Map();
// true when one of the file's own scripts can't even be read (so nothing on the page works)
function taFileScriptBroken(html) {
  if (typeof html !== 'string' || !html) return false;
  if (taScriptCheckCache.has(html)) return taScriptCheckCache.get(html);
  let broken = false;
  const re = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi;
  let m;
  while (!broken && (m = re.exec(html))) {
    if (/\b(src|type)\s*=/i.test(m[1] || '')) continue;   // modules (Firebase) and outside files
    try { new Function(m[2]); } catch (e) { broken = e instanceof SyntaxError; }
  }
  taScriptCheckCache.set(html, broken);
  return broken;
}
// The fixes a My Exercises item was made before: [{ fix, where }] (where = a set round's label)
function taOldFileIssues(item) {
  if (!item || !item.date) return [];
  const out = [], seen = new Set();
  const add = (fix, where) => { if (!seen.has(fix.id)) { seen.add(fix.id); out.push({ fix: fix, where: where || '' }); } };
  const rounds = item.mergedItems && item.mergedItems.length ? item.mergedItems.map((r, i) => ({ label: r.typeLabel || r.title || '', html: () => setRoundHtml(item, i) })) : null;
  TA_FILE_FIXES.forEach(fix => {
    if (item.date >= fix.at) return;
    if (fix.test) {
      if (fix.test(getCachedExerciseHtml(item.uid))) return add(fix);
      if (rounds) rounds.forEach(r => { if (fix.test(r.html())) add(fix, r.label); });
      return;
    }
    if (fix.types.test(item.typeLabel || '')) return add(fix);
    if (rounds) rounds.forEach(r => { if (fix.types.test(r.label) || fix.types.test((String(r.html() || '').match(/<title>([^<]*)<\/title>/) || [])[1] || '')) add(fix, r.label); });
  });
  return out;
}
// The fixes the file that sent this result was made before
function taOldResultFixes(r) {
  if (!r || typeof r.builtAt !== 'string' || !r.builtAt || typeof r.type !== 'string') return [];
  return TA_FILE_FIXES.filter(f => f.types && f.types.test(r.type) && r.builtAt < f.at);
}
function taOldFileWhat(issues) {
  return issues.map(x => (x.where ? '“' + escapeForHtml(x.where) + '”: ' : '') + x.fix.what).join('; ');
}
// Results page: a note when students used a file made before a fix
function taOldFileBannerHtml(results) {
  const byFix = new Map();
  (results || []).forEach(r => taOldResultFixes(r).forEach(f => byFix.set(f, (byFix.get(f) || 0) + 1)));
  if (!byFix.size) return '';
  const lines = [...byFix].map(([f, n]) => '<li><b>' + n + '</b> result' + (n === 1 ? '' : 's') + ' came from a copy made before a fix — ' + f.what + '.</li>').join('');
  return '<div class="old-file-note" role="note"><b>⚠️ Old copy of this exercise</b><ul>' + lines + '</ul>' +
    'Make a new copy in My Exercises (✏️ Use again → create it), and send students the new file or link.</div>';
}
/* On entry: one note listing the exercises made before a fix, and those whose
   students are still sending results from an old copy (last 7 days). "Got it"
   stops it for those. */
const LS_OLD_FILE_ACK = 'ta_old_file_ack';
function taOldFileWarnCheck() {
  if (!window.__TA_USER) return;
  let ack = [];
  try { ack = JSON.parse(localStorage.getItem(LS_OLD_FILE_ACK) || '[]'); } catch (e) { ack = []; }
  const rows = [];
  getRecentExercises().forEach(item => {
    const issues = taOldFileIssues(item).filter(x => !x.fix.minor);
    const key = 'x:' + item.uid + ':' + issues.map(x => x.fix.id).join(',');
    if (issues.length && ack.indexOf(key) === -1) rows.push({ key: key, title: item.title, what: taOldFileWhat(issues) });
  });
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const byCode = new Map();
  (window.__allResults || []).forEach(r => {
    if (!r || !(r.date >= weekAgo)) return;
    taOldResultFixes(r).filter(f => !f.minor).forEach(f => {
      const key = 'r:' + r.code + ':' + f.id;
      if (ack.indexOf(key) === -1 && !byCode.has(key)) byCode.set(key, { key: key, title: r.title || r.code, what: 'students are still using an old copy — ' + f.what });
    });
  });
  byCode.forEach(v => { if (!rows.some(x => x.title === v.title)) rows.push(v); });
  let box = document.getElementById('taOldFileWarn');
  if (!rows.length) { if (box) box.classList.remove('show'); return; }
  if (!box) {
    box = document.createElement('div');
    box.id = 'taOldFileWarn';
    box.className = 'lesson-warn db-warn';
    box.setAttribute('role', 'status');
    taNoticeStack().appendChild(box);
  }
  box.innerHTML = '<div class="lesson-warn-head"><span>⚠️ Old exercise files</span><button type="button" class="lesson-warn-close" aria-label="Close">✕</button></div>' +
    '<div class="db-warn-text">These were made before a fix, so they still have the old problem. Make a new copy (My Exercises → ✏️ Use again) and share the new one.</div>' +
    rows.slice(0, 6).map(x => '<div class="lesson-warn-row"><div class="lesson-warn-main"><b translate="no">' + escapeForHtml(x.title) + '</b><small>' + x.what + '</small></div></div>').join('') +
    (rows.length > 6 ? '<div class="db-warn-text">…and ' + (rows.length - 6) + ' more.</div>' : '') +
    '<div class="done-warn-foot"><button type="button" class="done-warn-later">Got it</button><button type="button" class="done-warn-all">Open My Exercises</button></div>';
  box.querySelector('.lesson-warn-close').onclick = () => box.classList.remove('show');
  box.querySelector('.done-warn-later').onclick = () => {
    try { localStorage.setItem(LS_OLD_FILE_ACK, JSON.stringify(ack.concat(rows.map(x => x.key)).slice(-500))); } catch (e) { /* ignore */ }
    box.classList.remove('show');
  };
  box.querySelector('.done-warn-all').onclick = () => {
    box.classList.remove('show');
    if (typeof switchTo === 'function' && document.getElementById('panel-myexercises')) switchTo('myexercises'); else location.href = 'my-exercises.html';
  };
  void box.offsetWidth;
  box.classList.add('show');
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
/* An exercise title goes into the page's text and also into a "…" string in
   its script, so it must be safe in both: HTML-escaped, with double quotes,
   backslashes and line breaks made harmless too (a title like
   Review "Apex" used to break the exercise's script). */
function escapeForTemplateText(str) {
  return escapeForHtml(String(str)).replace(/"/g, '&quot;').replace(/\\/g, '&#92;').replace(/[\r\n]+/g, ' ');
}
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

/* ================= DICTATION ANSWERS, READABLE =================
   The original text with the student's mistakes marked on it: correct words
   plain, a wrong word shows the right word with what the student typed above
   it, missed words fade (a missed run is one phrase, not a tag per word), and
   extra words are listed once at the end. New results carry the student's
   own text; older ones are read back from their [missing: …] feedback. */
function taDictNorm(w) { return String(w).toLowerCase().replace(/[^\w']/g, ''); }
/* Lines the student's words up with the text for showing mistakes: a word typed
   in place of a similar one (Sara/Sarah, go/goes) is a wrong spelling of it;
   an unrelated word is an extra, and the one it replaced is missed. */
function taDictAlign(reference, studentText, norm) {
  const ref = String(reference || '').trim().split(/\s+/).filter(Boolean);
  const stu = String(studentText || '').trim().split(/\s+/).filter(Boolean);
  const a = ref.map(norm), b = stu.map(norm);
  const lev = (x, y) => {
    let prev = Array.from({ length: y.length + 1 }, (_, k) => k);
    for (let i = 1; i <= x.length; i++) {
      const cur = [i];
      for (let j = 1; j <= y.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[y.length];
  };
  const sub = (x, y) => {
    if (x === y) return 0;
    const len = Math.max(x.length, y.length) || 1;
    return (1 - lev(x, y) / len) >= 0.5 ? 0.9 : 2.2; // similar: one wrong word; else missed + extra
  };
  const m = a.length, n = b.length, d = [];
  for (let i = 0; i <= m; i++) { d.push(new Array(n + 1).fill(0)); d[i][0] = i; }
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + sub(a[i - 1], b[j - 1]));
  const ops = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + sub(a[i - 1], b[j - 1])) {
      ops.push(a[i - 1] === b[j - 1] ? { type: 'ok', ref: ref[i - 1] } : { type: 'wrong', ref: ref[i - 1], student: stu[j - 1] });
      i--; j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { ops.push({ type: 'missing', ref: ref[i - 1] }); i--; }
    else { ops.push({ type: 'extra', student: stu[j - 1] }); j--; }
  }
  return ops.reverse();
}
function taDictDiff(reference, studentText) { return taDictAlign(reference, studentText, taDictNorm); }
// Older results only kept the feedback line: "word [missing: w] said -> right [extra: w] …"
function taDictParseFeedback(text) {
  const ops = [], re = /\[missing: ([^\]]*)\]|\[extra: ([^\]]*)\]|(\S+) (?:->|→) (\S+)|(\S+)/g;
  let m;
  while ((m = re.exec(String(text || '')))) {
    if (m[1] !== undefined) ops.push({ type: 'missing', ref: m[1] });
    else if (m[2] !== undefined) ops.push({ type: 'extra', student: m[2] });
    else if (m[3] !== undefined) ops.push({ type: 'wrong', student: m[3], ref: m[4] });
    else ops.push({ type: 'ok', ref: m[5] });
  }
  return ops;
}
// A dictation's word-by-word check (null for fill-in-the-blanks or no answer).
function taDictationOps(r) {
  const fb = String(r.dictationFeedback || '');
  if (typeof r.referenceText === 'string' && typeof r.studentText === 'string') return taDictDiff(r.referenceText, r.studentText);
  if (!fb || /^[✓✗] Blank \d+:/m.test(fb)) return null;
  // Older results: their feedback line was made with the old word pairing ("weeks -> Sarah").
  // It still holds both texts, so rebuild them and check them again the new way.
  const old = taDictParseFeedback(fb);
  const refText = old.filter(o => o.type !== 'extra').map(o => o.ref).join(' ');
  const stuText = old.filter(o => o.type !== 'missing').map(o => o.type === 'ok' ? o.ref : o.student).join(' ');
  return taDictDiff(refText, stuText);
}
/* A result's score. A dictation's is worked out again here so that extra words
   count as mistakes (correct words out of the text's words plus the extras):
   older exercise files only divided by the text's words, so a student who typed
   the text twice still got 100%. */
function taResultScore(r) {
  if (!r || r.type !== 'Dictation') return r ? r.score : undefined;
  const ops = taDictationOps(r);
  if (!ops) return r.score;
  const correct = ops.filter(o => o.type === 'ok').length;
  const total = ops.length; // every word of the text, plus every extra word
  return total ? Math.round(correct / total * 100) : (typeof r.score === 'number' ? r.score : 0);
}
window.taResultScore = taResultScore;
function taDictationAnswerHtml(r) {
  const esc = escapeForHtml;
  const fb = String(r.dictationFeedback || '');
  // Fill-in-the-blanks: one line per blank
  if (/^[✓✗] Blank \d+:/m.test(fb)) {
    return '<div class="dd-blanks">' + fb.split('\n').filter(Boolean).map(line => {
      const ok = line.charAt(0) === '✓';
      const m = line.match(/Blank (\d+): you wrote "(.*?)"(?: — correct answer: "(.*)")?$/);
      if (!m) return '<div class="dd-blank">' + esc(line) + '</div>';
      return '<div class="dd-blank ' + (ok ? 'ok' : 'bad') + '"><span class="dd-blank-n">' + m[1] + '</span>' +
        (ok ? '<span class="dd-ok-word">' + esc(m[2]) + '</span><span class="dd-tick">✓</span>'
            : '<span class="dd-said-inline">' + esc(m[2] || '(empty)') + '</span><span class="dd-arrow">→</span><span class="dd-right-inline">' + esc(m[3] || '') + '</span>') +
        '</div>';
    }).join('') + '</div>';
  }
  const ops = taDictationOps(r) || [];
  const count = t => ops.filter(o => o.type === t).length;
  const mistakes = count('wrong') + count('missing') + count('extra');
  let text = '', missedRun = [];
  const flush = () => { if (missedRun.length) { text += '<span class="dd-missing" title="Missed">' + esc(missedRun.join(' ')) + '</span> '; missedRun = []; } };
  ops.forEach(o => {
    if (o.type === 'missing') { missedRun.push(o.ref); return; }
    flush();
    if (o.type === 'ok') text += '<span class="dd-ok">' + esc(o.ref) + '</span> ';
    else if (o.type === 'wrong') text += '<ruby class="dd-wrong">' + esc(o.ref) + '<rt>' + esc(o.student) + '</rt></ruby> ';
    // an extra word stays exactly where the student typed it, crossed out
    else if (o.type === 'extra') text += '<span class="dd-extra-in" title="Extra word — counts as a mistake">' + esc(o.student) + '</span> ';
  });
  flush();
  return '<div class="dd-summary">' +
      '<span class="dd-chip ok">✓ ' + count('ok') + ' correct</span>' +
      '<span class="dd-chip wrong">✗ ' + count('wrong') + ' wrong</span>' +
      '<span class="dd-chip missing">○ ' + count('missing') + ' missed</span>' +
      '<span class="dd-chip extra">+ ' + count('extra') + ' extra</span>' +
      '<span class="dd-chip mistakes">' + mistakes + ' mistake' + (mistakes === 1 ? '' : 's') + ' · ' + taResultScore(r) + '%</span>' +
    '</div>' +
    '<div class="dd-legend"><ruby class="dd-wrong">right<rt>typed</rt></ruby> a wrong word · <span class="dd-missing">faded</span> missed words · <span class="dd-extra-in">crossed</span> extra words the student added (each one is a mistake)</div>' +
    '<div class="dd-text">' + text + '</div>' +
    (typeof r.studentText === 'string' ? '<details class="dd-typed"><summary>What the student typed</summary><div>' + esc(r.studentText || '(nothing)') + '</div></details>' : '');
}

function viewDictationResult(idx) {
  const r = (window.__lastResultsMatches || [])[idx];
  if (!r) return;
  const modal = document.getElementById('sentenceViewModal');
  const title = document.getElementById('sentenceViewTitle');
  const body = document.getElementById('sentenceViewBody');
  if (!modal || !title || !body) return;
  const score = taResultScore(r);
  title.textContent = (r.name || 'Student') + ' — ' + (r.title || 'Dictation') + ' (' + (typeof score === 'number' ? score + '%' : '—') + ')';
  body.innerHTML = r.dictationFeedback ? taDictationAnswerHtml(r) : '<div class="empty-results">(no details)</div>';
  modal.classList.add('show', 'wide');
}

/* ================= RATING STUDENTS' SENTENCES =================
   Sentences aren't checked automatically, so the teacher gives each
   student's sentences 1–5 stars (very bad … very good). The rating is what
   Top Active Students uses for that exercise. Saved per result and synced. */
const LS_SENTENCE_RATINGS = 'ta_sentence_ratings'; // { resultSignature: 1..5 }
const SENTENCE_RATING_WORDS = ['', 'Very bad', 'Bad', 'Average', 'Good', 'Very good'];
function getSentenceRatings() {
  try { return JSON.parse(localStorage.getItem(LS_SENTENCE_RATINGS) || '{}') || {}; } catch (e) { return {}; }
}
function sentenceRatingFor(r) { return getSentenceRatings()[resultSignature(r)] || 0; }
function taStarRatingHtml(r) {
  const key = resultSignature(r), n = sentenceRatingFor(r);
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += '<button type="button" class="star' + (i <= n ? ' on' : '') + '" title="' + SENTENCE_RATING_WORDS[i] + '" aria-label="' + i + ' of 5 — ' + SENTENCE_RATING_WORDS[i] + '" ' +
      'onclick="rateSentences(' + jsAttr(key) + ',' + i + ', this)">★</button>';
  }
  return '<div class="star-rating" data-key="' + escapeForHtml(key) + '">' +
    '<span class="star-rating-label">Rate these sentences</span>' +
    '<span class="stars">' + stars + '</span>' +
    '<span class="star-rating-word">' + (n ? n + '/5 — ' + SENTENCE_RATING_WORDS[n] : 'Not rated yet') + '</span>' +
  '</div>';
}
function rateSentences(key, n, btn) {
  const all = getSentenceRatings();
  if (all[key] === n) delete all[key]; else all[key] = n; // tapping the same star again clears it
  try { localStorage.setItem(LS_SENTENCE_RATINGS, JSON.stringify(all)); } catch (e) { /* ignore */ }
  const box = btn && btn.closest('.star-rating');
  const now = all[key] || 0;
  if (box) {
    box.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('on', i < now));
    box.querySelector('.star-rating-word').textContent = now ? now + '/5 — ' + SENTENCE_RATING_WORDS[now] : 'Not rated yet';
  }
  document.querySelectorAll('.sentence-rate-chip[data-key="' + CSS.escape(key) + '"]').forEach(c => { c.textContent = now ? '★ ' + now + '/5' : '☆ Rate'; c.classList.toggle('rated', !!now); });
  if (window.renderTopActiveStudents) window.renderTopActiveStudents();
}
window.rateSentences = rateSentences;

function viewSentenceResult(idx) {
  const r = (window.__lastResultsMatches || [])[idx];
  if (!r || !Array.isArray(r.sentences)) return;
  const modal = document.getElementById('sentenceViewModal');
  const title = document.getElementById('sentenceViewTitle');
  const body = document.getElementById('sentenceViewBody');
  if (!modal || !title || !body) return;
  title.textContent = (r.name || 'Student') + ' — ' + (r.title || 'Sentences');
  body.innerHTML = taStarRatingHtml(r) + r.sentences.map((s, i) =>
    '<div class="resource-card">' +
      '<div class="resource-card-title">' + (i + 1) + (s.word ? ' — using "' + escapeForHtml(s.word) + '"' : '') + '</div>' +
      '<div class="resource-card-content">' + escapeForHtml(s.text || '(blank)') + '</div>' +
    '</div>'
  ).join('') || '<div class="empty-results">No sentences recorded.</div>';
  modal.classList.add('show');
}
function closeSentenceViewModal() {
  const modal = document.getElementById('sentenceViewModal');
  if (modal) modal.classList.remove('show', 'wide');
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

/* ---- Lessons taught (all time) ----
   Every weekly lesson counts each time its day and start time have passed,
   starting from when it was added to the schedule (its id holds that
   moment). Lessons removed from the schedule keep what they had counted in
   LS_LESSONS_ARCHIVED, so the total never goes down. */
const LS_LESSONS_ARCHIVED = 'ta_lessons_archived';
function lessonAddedAt(entry) {
  const m = /^sch_(\d{12,})_/.exec(entry && entry.id || '');
  return m ? Number(m[1]) : Date.now();
}
function lessonsTaughtFor(entry, now) {
  now = now || Date.now();
  const added = new Date(lessonAddedAt(entry));
  const parts = String(entry.time || '00:00').split(':');
  const first = new Date(added);
  first.setHours(parseInt(parts[0], 10) || 0, parseInt(parts[1], 10) || 0, 0, 0);
  first.setDate(first.getDate() + ((Number(entry.day) - first.getDay() + 7) % 7));
  if (first < added) first.setDate(first.getDate() + 7);
  if (first.getTime() > now) return 0;
  // count by calendar days so summer/winter clock changes don't skip a week
  const days = Math.floor((Date.UTC(new Date(now).getFullYear(), new Date(now).getMonth(), new Date(now).getDate()) -
    Date.UTC(first.getFullYear(), first.getMonth(), first.getDate())) / 86400000);
  let count = Math.floor(days / 7) + 1;
  const lastDay = new Date(first); lastDay.setDate(first.getDate() + (count - 1) * 7);
  if (lastDay.getTime() > now) count--; // today's lesson hasn't started yet
  return Math.max(0, count);
}
function getLessonsArchived() {
  try { return Number(localStorage.getItem(LS_LESSONS_ARCHIVED)) || 0; } catch (e) { return 0; }
}
function archiveLessonsTaught(entry) {
  try { localStorage.setItem(LS_LESSONS_ARCHIVED, String(getLessonsArchived() + lessonsTaughtFor(entry))); } catch (e) { /* ignore */ }
}
function getLessonsTaughtTotal() {
  const now = Date.now();
  return getLessonsArchived() + getWeeklySchedule().reduce((sum, e) => sum + lessonsTaughtFor(e, now), 0);
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
/* ---- Ready: the teacher marks each coming lesson as prepared ----
   (the lesson itself is planned elsewhere). Kept per lesson date, per
   account, and synced (ta_lessons_ready). */
const LS_LESSONS_READY = 'ta_lessons_ready';
const LS_READY_REMINDED = 'ta_ready_reminded_at'; // this device: when it last reminded
const TA_READY_EVERY_MS = 2 * 60 * 60 * 1000;
function taLessonKey(entry, date) { return entry.id + '_' + date.toISOString(); }
function getReadyLessons() {
  try { return JSON.parse(localStorage.getItem(LS_LESSONS_READY) || '[]'); } catch (e) { return []; }
}
function isLessonReady(entry, date) { return getReadyLessons().indexOf(taLessonKey(entry, date)) !== -1; }
function setLessonReady(key, on) {
  let list = getReadyLessons().filter(k => k !== key);
  if (on) list.push(key);
  // only keep the last few weeks
  const cutoff = Date.now() - 21 * 86400000;
  list = list.filter(k => { const t = Date.parse(k.slice(k.indexOf('_') + 1)); return !t || t > cutoff; });
  try { localStorage.setItem(LS_LESSONS_READY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  if (window.renderNextLessons && document.getElementById('mainLessonsList')) window.renderNextLessons();
  const box = document.getElementById('taLessonWarn');
  if (box && box.classList.contains('show')) {
    box.querySelectorAll('.lesson-ready-btn').forEach(b => { if (b.dataset.key === key) { b.classList.toggle('on', on); b.textContent = on ? '✅ Ready' : 'Ready'; } });
  }
}
window.setLessonReady = setLessonReady;
function taReadyButtonHtml(entry, date) {
  const key = taLessonKey(entry, date), on = isLessonReady(entry, date);
  return '<button class="lesson-ready-btn' + (on ? ' on' : '') + '" type="button" data-key="' + escapeForHtml(key) + '"' +
    ' onclick="event.stopPropagation(); setLessonReady(this.dataset.key, !this.classList.contains(\'on\'))"' +
    ' title="' + (on ? 'Ready — tap to undo' : 'Tap when this lesson is prepared') + '">' + (on ? '✅ Ready' : 'Ready') + '</button>';
}
// Lessons in the next 24 hours that aren't marked ready yet.
function getUnreadyLessons() { return getUpcomingReminders().filter(r => !isLessonReady(r.entry, r.date)); }
/* Every 2 hours (checked every few minutes while the site is open), a lesson
   in the next 24 hours that isn't ready brings the warning back, and a
   system notification too when they're allowed. */
function taReadyReminderCheck() {
  if (!window.__TA_USER) return;
  const list = getUnreadyLessons();
  if (!list.length) return;
  let last = 0;
  try { last = +localStorage.getItem(LS_READY_REMINDED) || 0; } catch (e) { /* ignore */ }
  if (Date.now() - last < TA_READY_EVERY_MS) return;
  try { localStorage.setItem(LS_READY_REMINDED, String(Date.now())); } catch (e) { /* ignore */ }
  showLessonWarning(list, true);
  taSystemNotify('📋 ' + (list.length === 1 ? 'A lesson isn\'t' : list.length + ' lessons aren\'t') + ' ready yet',
    list.map(r => (r.entry.group || 'Lesson') + ' — ' + SCHEDULE_DAY_SHORT[r.date.getDay()] + ' ' + formatTimeDisplay(r.entry.time) + ' (' + formatTimeUntil(r.date) + ')').join('\n'));
}
window.taReadyReminderCheck = taReadyReminderCheck;
function taSystemNotify(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const opts = { body: body, icon: 'images/app/icon-ta-192.png', tag: 'ta-lessons-ready' };
  // phones only show notifications through the service worker
  if (navigator.serviceWorker && navigator.serviceWorker.ready) {
    navigator.serviceWorker.ready.then(reg => reg.showNotification(title, opts)).catch(() => { try { new Notification(title, opts); } catch (e) { /* ignore */ } });
  } else { try { new Notification(title, opts); } catch (e) { /* ignore */ } }
}
function taAskNotifications(btn) {
  if (!('Notification' in window)) { showToast('This browser can\'t show notifications.'); return; }
  Notification.requestPermission().then(p => {
    if (btn) btn.remove();
    showToast(p === 'granted' ? '🔔 Notifications on — you\'ll be reminded about lessons that aren\'t ready.' : 'Notifications stay off. You can allow them in the browser\'s site settings.', p === 'granted' ? 'ok' : undefined);
  });
}
window.taAskNotifications = taAskNotifications;

/* Opening the site warns about every lesson in the next 24 hours; while it
   stays open, a lesson that newly comes within 24 hours is warned about once.
   The warning sits in the top-right corner and goes away after 5 seconds. */
let taEnteredWarned = false;
function showReminderToastIfDue() {
  if (!window.__TA_USER) return; // not signed in yet: the login screen is showing
  const reminders = getUpcomingReminders();
  const key = r => r.entry.id + '_' + r.date.toISOString();
  let list;
  if (!taEnteredWarned) {
    taEnteredWarned = true;
    list = reminders;
  } else {
    const shown = getShownReminderKeys();
    list = reminders.filter(r => shown.indexOf(key(r)) === -1);
  }
  if (!list.length) return;
  list.forEach(r => markReminderShown(key(r)));
  showLessonWarning(list);
  // opening the site counts as a reminder: the next one about unready lessons comes 2 hours later
  if (getUnreadyLessons().length) { try { localStorage.setItem(LS_READY_REMINDED, String(Date.now())); } catch (e) { /* ignore */ } }
}
let taLessonWarnTimer = 0;
// notReady: the every-2-hours reminder about lessons not marked ready yet
function showLessonWarning(list, notReady) {
  let box = document.getElementById('taLessonWarn');
  if (!box) {
    box = document.createElement('div');
    box.id = 'taLessonWarn';
    box.className = 'lesson-warn';
    box.setAttribute('role', 'status');
    taNoticeStack().prepend(box);
  }
  const n = list.length;
  box.innerHTML = '<div class="lesson-warn-head"><span>' + (notReady
      ? '📋 ' + (n === 1 ? 'A lesson isn\'t' : n + ' lessons aren\'t') + ' ready yet'
      : '⏰ ' + (n === 1 ? 'A lesson' : n + ' lessons') + ' in the next 24 hours') + '</span>' +
      '<button type="button" class="lesson-warn-close" aria-label="Close">✕</button></div>' +
    list.map(r => {
      const palette = lessonColorForId(r.entry.id);
      return '<div class="lesson-warn-row">' +
        '<span class="lesson-warn-dot" style="background:' + palette.color + ';"></span>' +
        '<div class="lesson-warn-main"><b>' + escapeForHtml(r.entry.group || 'Lesson') + '</b>' +
          '<small>' + SCHEDULE_DAY_SHORT[r.date.getDay()] + ' ' + formatTimeDisplay(r.entry.time) + (r.entry.level ? ' · ' + escapeForHtml(r.entry.level) : '') + '</small></div>' +
        '<span class="lesson-warn-when">' + formatTimeUntil(r.date) + '</span>' +
        taReadyButtonHtml(r.entry, r.date) +
      '</div>';
    }).join('') +
    ('Notification' in window && Notification.permission === 'default' && list.some(r => !isLessonReady(r.entry, r.date))
      ? '<button type="button" class="lesson-warn-notify" onclick="taAskNotifications(this)">🔔 Also remind me with notifications</button>' : '') +
    '<div class="lesson-warn-bar"></div>';
  const hide = () => { box.classList.remove('show'); clearTimeout(taLessonWarnTimer); };
  box.querySelector('.lesson-warn-close').onclick = hide;
  box.classList.remove('show');
  void box.offsetWidth; // restart the slide-in and the 5-second bar
  box.classList.add('show');
  clearTimeout(taLessonWarnTimer);
  taLessonWarnTimer = setTimeout(hide, 5000);
}
window.showReminderToastIfDue = showReminderToastIfDue;

// The top-right corner holds the lesson warning and, under it, the finished-exercises one.
function taNoticeStack() {
  let el = document.getElementById('taNoticeStack');
  if (!el) {
    el = document.createElement('div');
    el.id = 'taNoticeStack';
    el.className = 'notice-stack';
    document.body.appendChild(el);
  }
  return el;
}

/* ---- Finished exercises: warned about until checked ----
   Opening the site lists the students (from the Students list) who finished
   an exercise in the last 7 days that the teacher hasn't marked as checked
   yet. "Checked" (per student, or all at once) stops the warning for those;
   closing it with ✕ only hides it until the next visit. New completions
   coming in while the site is open bring it back. The checked ones are kept
   per account and synced (ta_checked_completions). */
const LS_CHECKED_COMPLETIONS = 'ta_checked_completions';
const TA_COMPLETION_DAYS = 7;
function getCheckedCompletions() {
  try { return JSON.parse(localStorage.getItem(LS_CHECKED_COMPLETIONS) || '[]'); } catch (e) { return []; }
}
function markCompletionsChecked(keys) {
  const list = getCheckedCompletions();
  const have = new Set(list);
  keys.forEach(k => { if (!have.has(k)) { list.push(k); have.add(k); } });
  try { localStorage.setItem(LS_CHECKED_COMPLETIONS, JSON.stringify(list.slice(-3000))); } catch (e) { /* ignore */ }
}
function unmarkCompletionsChecked(keys) {
  const drop = new Set(keys);
  try { localStorage.setItem(LS_CHECKED_COMPLETIONS, JSON.stringify(getCheckedCompletions().filter(k => !drop.has(k)))); } catch (e) { /* ignore */ }
}
// Results: tick a student's answers as checked (or back to not checked). The
// same list stops the "finished exercises" warning, so both stay in step.
function taSetChecked(keys, on) {
  if (on) markCompletionsChecked(keys); else unmarkCompletionsChecked(keys);
  if (window.renderResultsTable && document.getElementById('resultsTableWrap')) window.renderResultsTable();
  if (window.renderHwcResultsList) window.renderHwcResultsList();
  const box = document.getElementById('taDoneWarn');
  if (box && box.classList.contains('show')) showCompletionsWarning(getUncheckedCompletions());
}
window.taSetChecked = taSetChecked;
function taIsChecked(r) { return getCheckedCompletions().indexOf(taCompletionKey(r)) !== -1; }
window.taIsChecked = taIsChecked;
// the ✓ Checked / ○ Not checked button shown next to a result
// just an icon: ✓ checked, ✕ not checked yet (label: what the tooltip adds, e.g. "2 to check")
function taCheckChipHtml(keys, checked, label) {
  const tip = checked ? 'Checked — tap to mark as not checked' : (label ? label + ' — tap when you have checked them' : 'Not checked yet — tap when you have checked it');
  return '<button type="button" class="check-chip' + (checked ? ' on' : '') + '" data-keys="' + escapeForHtml(JSON.stringify(keys)).replace(/"/g, '&quot;') + '"' +
    ' onclick="event.stopPropagation(); taSetChecked(JSON.parse(this.dataset.keys), ' + (!checked) + ')"' +
    ' title="' + escapeForHtml(tip) + '" aria-label="' + escapeForHtml(tip) + '">' + (checked ? '✓' : '✕') + '</button>';
}
window.taCheckChipHtml = taCheckChipHtml;
/* ---- Results: "Will be punished" ----
   The teacher marks a student for one exercise (or Homework/Class set); the
   student's row then stands out in red. Kept per account and synced
   (ta_punished), as "code|student id or name". */
const LS_PUNISHED = 'ta_punished';
function taGetPunished() {
  try { return JSON.parse(localStorage.getItem(LS_PUNISHED) || '[]'); } catch (e) { return []; }
}
function taPunishKey(code, student) { return String(code || '') + '|' + String(student || '').trim().toLowerCase(); }
function taIsPunished(key) { return taGetPunished().indexOf(key) !== -1; }
function taSetPunished(key, on) {
  const list = taGetPunished().filter(k => k !== key);
  if (on) list.push(key);
  try { localStorage.setItem(LS_PUNISHED, JSON.stringify(list.slice(-3000))); } catch (e) { /* ignore */ }
  if (window.renderResultsTable && document.getElementById('resultsTableWrap')) window.renderResultsTable();
  if (window.renderHwcResultsList) window.renderHwcResultsList();
}
function taPunishChipHtml(key) {
  const on = taIsPunished(key);
  return '<button type="button" class="punish-chip' + (on ? ' on' : '') + '" data-key="' + escapeForHtml(key) + '"' +
    ' onclick="event.stopPropagation(); taSetPunished(this.dataset.key, ' + (!on) + ')"' +
    ' title="' + (on ? 'Will be punished — tap to take the mark off' : 'Mark this student: will be punished') + '"' +
    ' aria-label="' + (on ? 'Will be punished' : 'Punish?') + '">' + (on ? '⚠️' : '⚖️') + '</button>';
}
window.taPunishKey = taPunishKey;
window.taIsPunished = taIsPunished;
window.taSetPunished = taSetPunished;
window.taPunishChipHtml = taPunishChipHtml;
function taCompletionKey(r) { return r.code + '|' + String(r.studentId || r.name || '').trim().toLowerCase() + '|' + (r.date || ''); }
// Unchecked completions from the last week, grouped by student, newest first.
function getUncheckedCompletions() {
  const since = Date.now() - TA_COMPLETION_DAYS * 86400000;
  const checked = new Set(getCheckedCompletions());
  const rosterIdx = taRosterIndex();
  // an exercise inside a Homework/Class set is shown with the set's name
  const setTitleForCode = {}, nameForCode = {};
  (getRecentExercises() || []).forEach(e => {
    if (e.mergedItems && e.mergedItems.length) e.mergedItems.forEach(it => { if (it && it.code) setTitleForCode[it.code] = { title: e.title, uid: e.uid }; });
    else if (e.code) nameForCode[e.code] = e.title;
  });
  const byStudent = {};
  (window.__allResults || []).forEach(r => {
    if (!r || !r.code || !r.date || !(new Date(r.date).getTime() >= since)) return;
    const student = rosterStudentForResult(r, rosterIdx);
    if (!student) return;
    const key = taCompletionKey(r);
    if (checked.has(key)) return;
    const sk = String(student.id);
    if (!byStudent[sk]) byStudent[sk] = { name: student.name, items: [], latest: 0 };
    const set = setTitleForCode[r.code];
    byStudent[sk].items.push({ key: key, title: nameForCode[r.code] || r.title || r.type || 'Exercise', set: set ? set.title : '', setUid: set ? set.uid : '', code: r.code });
    byStudent[sk].latest = Math.max(byStudent[sk].latest, new Date(r.date).getTime());
  });
  return Object.values(byStudent).sort((a, b) => b.latest - a.latest);
}
let taCompletionsShown = new Set(), taCompletionsTimer = 0, taCompletionsFirst = true;
// Called whenever the results feed changes (js/firebase.js); waits for it to settle.
function taCompletionsChanged() {
  clearTimeout(taCompletionsTimer);
  taCompletionsTimer = setTimeout(() => {
    if (!window.__TA_USER) return;
    const groups = getUncheckedCompletions();
    const keys = groups.flatMap(g => g.items.map(i => i.key));
    const isNew = keys.some(k => !taCompletionsShown.has(k));
    const box = document.getElementById('taDoneWarn');
    if (taCompletionsFirst || isNew || (box && box.classList.contains('show'))) showCompletionsWarning(groups);
    taCompletionsFirst = false;
    keys.forEach(k => taCompletionsShown.add(k));
  }, 1500);
}
window.taCompletionsChanged = taCompletionsChanged;
function showCompletionsWarning(groups) {
  let box = document.getElementById('taDoneWarn');
  if (!groups.length) { if (box) box.classList.remove('show'); return; }
  if (!box) {
    box = document.createElement('div');
    box.id = 'taDoneWarn';
    box.className = 'lesson-warn done-warn';
    box.setAttribute('role', 'status');
    taNoticeStack().appendChild(box);
  }
  const n = groups.length;
  box.innerHTML = '<div class="lesson-warn-head"><span>✅ ' + n + ' student' + (n === 1 ? '' : 's') + ' finished exercises</span>' +
      '<button type="button" class="lesson-warn-close" aria-label="Remind me next time">✕</button></div>' +
    '<div class="done-warn-list">' + groups.map((g, i) => {
      // one button per exercise (a set's exercises together under the set's name:
      // "Sep 28 · 5 exercises"), each opening that exercise's own results
      const targets = [], byKey = {};
      g.items.forEach(x => {
        const k = x.setUid ? 'set:' + x.setUid : 'code:' + x.code + '|' + x.title;
        if (!byKey[k]) { byKey[k] = { title: x.set || x.title, n: 0, code: x.code, setUid: x.setUid || '', set: !!x.setUid }; targets.push(byKey[k]); }
        byKey[k].n++;
      });
      const btns = targets.slice(0, 3).map(t =>
        '<button type="button" class="done-warn-ex" data-code="' + escapeForHtml(t.code || '') + '" data-set="' + escapeForHtml(t.setUid) + '" title="Open the results of this exercise">📊 <span translate="no">' +
          escapeForHtml(t.title) + '</span>' + (t.set ? ' · ' + t.n + ' exercise' + (t.n === 1 ? '' : 's') : '') + '</button>').join('') +
        (targets.length > 3 ? '<small>+' + (targets.length - 3) + ' more</small>' : '');
      return '<div class="lesson-warn-row">' +
        '<span class="res-avatar done-warn-avatar" style="background:' + avatarColorForName(g.name) + ';">' + escapeForHtml(initialsForName(g.name)) + '</span>' +
        '<div class="lesson-warn-main"><b translate="no">' + escapeForHtml(g.name) + '</b><div class="done-warn-exs">' + btns + '</div></div>' +
        '<button type="button" class="done-warn-check" data-i="' + i + '">✓ Checked</button>' +
      '</div>';
    }).join('') + '</div>' +
    '<div class="done-warn-foot"><button type="button" class="done-warn-results">All results</button>' +
      '<button type="button" class="done-warn-all">✓ All checked</button></div>';
  box.querySelector('.lesson-warn-close').onclick = () => box.classList.remove('show');
  box.querySelectorAll('.done-warn-check').forEach(btn => btn.onclick = () => {
    markCompletionsChecked(groups[+btn.dataset.i].items.map(x => x.key));
    showCompletionsWarning(getUncheckedCompletions());
  });
  box.querySelector('.done-warn-all').onclick = () => {
    markCompletionsChecked(groups.flatMap(g => g.items.map(x => x.key)));
    box.classList.remove('show');
  };
  box.querySelector('.done-warn-results').onclick = () => { box.classList.remove('show'); switchTo('results'); };
  // the note stays open, so the next student's exercise can be opened too
  box.querySelectorAll('.done-warn-ex').forEach(btn => btn.onclick = () => {
    box.querySelectorAll('.done-warn-ex.opened').forEach(b => b.classList.remove('opened'));
    btn.classList.add('opened');
    taOpenResultsFor(btn.dataset.code, btn.dataset.set);
  });
  if (!box.classList.contains('show')) { void box.offsetWidth; box.classList.add('show'); }
}

// Results of one exercise (or Homework/Class set, by its My Exercises uid), from any page
function taOpenResultsFor(code, setUid) {
  const list = getRecentExercises() || [];
  const item = setUid ? list.find(e => e.uid === setUid)
    : list.find(e => e.code === code && !(e.mergedItems && e.mergedItems.length));
  taRunOnPage('results.html', () => {
    if (item && window.showExerciseResults) { window.showExerciseResults(item.uid); return; }
    const input = document.getElementById('res-code-input');
    if (input && code) { input.value = code; if (window.onResultsCodeInput) window.onResultsCodeInput(); }
  });
}
window.taOpenResultsFor = taOpenResultsFor;

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
    '<div class="lesson-group-col"><img class="lesson-group-icon icon-mono" src="images/icons/students.png" alt=""><b>' + escapeForHtml(o.entry.group || 'Untitled group') + '</b></div>' +
    '<div class="lesson-level-col">' + levelPill + '</div>' +
    taReadyButtonHtml(o.entry, o.date) +
  '</div>';
}

/* The next few lessons from the weekly schedule, however many weeks ahead they are. */
function getNextLessonOccurrences(limit) {
  const schedule = getWeeklySchedule();
  if (!schedule.length) return [];
  const now = new Date();
  const out = [];
  schedule.forEach(entry => {
    const parts = (entry.time || '00:00').split(':');
    const h = parseInt(parts[0], 10) || 0, m = parseInt(parts[1], 10) || 0;
    let found = 0;
    for (let addDays = 0; addDays < 7 * (limit + 1) && found < limit; addDays++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + addDays, h, m, 0, 0);
      if (d.getDay() === entry.day && d.getTime() >= now.getTime() - 60000) { out.push({ entry: entry, date: d }); found++; }
    }
  });
  return out.sort((a, b) => a.date - b.date).slice(0, limit);
}

function lessonWeekLabel(weekIndex, weekStart) {
  const end = new Date(weekStart); end.setDate(end.getDate() + 6);
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const name = weekIndex === 0 ? 'This week' : weekIndex === 1 ? 'Next week' : 'In ' + weekIndex + ' weeks';
  return '<div class="lesson-week-heading">' + name + ' <span class="lesson-week-dates">' + fmt(weekStart) + ' – ' + fmt(end) + '</span></div>';
}

// Shows the next 5 lessons, under the week each one is in.
function renderNextLessons() {
  const wrap = document.getElementById('mainLessonsList');
  if (!wrap) return;
  const next = getNextLessonOccurrences(5);
  if (!next.length) {
    wrap.innerHTML = '<div class="empty-results">No lessons scheduled yet. <button class="mini-btn" type="button" style="margin-top:8px;" onclick="goToScheduleSettings()">➕ Add your weekly schedule</button></div>';
    return;
  }
  const thisWeekStart = getWeekStartMonday(new Date());
  let html = '', shownWeek = -1;
  next.forEach(o => {
    const weekIndex = Math.round((getWeekStartMonday(o.date) - thisWeekStart) / (7 * 86400000));
    if (weekIndex !== shownWeek) {
      if (shownWeek === -1 && weekIndex > 0) html += lessonWeekLabel(0, thisWeekStart) + '<div class="lesson-week-empty">No more lessons this week.</div>';
      const ws = new Date(thisWeekStart); ws.setDate(ws.getDate() + 7 * weekIndex);
      html += lessonWeekLabel(weekIndex, ws);
      shownWeek = weekIndex;
    }
    html += renderLessonRow(o);
  });
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
    taCloudCheck();
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
  btn.textContent = 'Signing in…';
  const sk = await taDeriveSyncKey(res.login, pass);
  // the database account (see "DATABASE SIGN-IN" in accounts.js); if it fails
  // here (offline…), the app asks for the password again next time
  const cloud = await taCloudSignIn(res.login, pass);
  const session = JSON.stringify({ login: res.login, name: res.name, hash: res.hash, sk: sk, ce: cloud.ok ? cloud.email : '', at: new Date().toISOString() });
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

/* The database only takes the teacher's own records (synced data, exercise
   links, points, deleting results) from a browser signed in to the teacher's
   database account. Browsers signed in before that existed — or whose sign-in
   was lost — are asked for the password once. */
async function taCloudCheck(force) {
  const u = window.__TA_USER;
  if (!u || !(await taWaitFor('taCloudSignInWith', 9000))) return;
  const current = await window.taCloudReady;
  const live = window.taCloudUser ? window.taCloudUser() : current;
  if (u.ce && live && live.email === String(u.ce).toLowerCase()) return;
  if (!force && window.taRaw.sessionGet('ta_cloud_later') === '1') return;
  taAskCloudPassword();
}
let taCloudRefusedShown = false;
window.taCloudRefused = function () {
  if (taCloudRefusedShown || !window.__TA_USER) return;
  taCloudRefusedShown = true;
  taCloudCheck(true);
};
function taAskCloudPassword() {
  if (document.getElementById('taCloudUnlock')) return;
  const u = window.__TA_USER;
  const wrap = document.createElement('div');
  wrap.id = 'taCloudUnlock';
  wrap.className = 'sync-unlock-back';
  wrap.innerHTML = '<form class="sync-unlock-card" novalidate>' +
    '<h3>🔐 Enter your password once</h3>' +
    '<p>The database is now locked, so only teachers can save and delete things. Enter your password so this device can save your data, exercise links and points.</p>' +
    '<input type="password" autocomplete="current-password" placeholder="Your password">' +
    '<div class="sync-unlock-err" role="alert"></div>' +
    '<div class="sync-unlock-btns"><button type="button" class="sync-unlock-cancel">Not now</button><button type="submit" class="sync-unlock-ok">Continue</button></div>' +
    '</form>';
  document.body.appendChild(wrap);
  const form = wrap.querySelector('form'), input = wrap.querySelector('input'), err = wrap.querySelector('.sync-unlock-err'), ok = wrap.querySelector('.sync-unlock-ok');
  setTimeout(function () { input.focus(); }, 30);
  wrap.querySelector('.sync-unlock-cancel').onclick = function () { window.taRaw.sessionSet('ta_cloud_later', '1'); wrap.remove(); };
  form.onsubmit = async function (e) {
    e.preventDefault();
    if (taHashPassword(u.login, input.value) !== u.hash) { err.textContent = 'That password is incorrect.'; input.select(); return; }
    ok.disabled = true; ok.textContent = 'Checking…'; err.textContent = '';
    const r = await taCloudSignIn(u.login, input.value);
    if (!r.ok) {
      ok.disabled = false; ok.textContent = 'Continue';
      err.textContent = r.code === 'offline' || r.code === 'timeout' || /network/.test(r.code)
        ? 'Can\'t reach the database. Check your internet connection and try again.'
        : 'The database refused this sign-in (' + r.code + '). Please tell the administrator.';
      return;
    }
    u.ce = r.email;
    if (!u.sk) u.sk = await taDeriveSyncKey(u.login, input.value);
    taSaveSession(u);
    wrap.remove();
    showToast('🔐 Signed in to the database', 'ok');
  };
}
window.taCloudCheck = taCloudCheck;

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
  if (!el || el.dataset.ready || typeof lottie === 'undefined') return;
  try {
    el.innerHTML = '';
    el.dataset.ready = '1';
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

const AI_ROBOT_CONTACT_ITEM = { q: 'Have another question?', a: "Didn't find your answer here? Type a word in the search box above (it looks through every answer), or message Toxirjon directly and he'll help you out: +998886660904" };
function aiFaq(items) { return items.concat([AI_ROBOT_CONTACT_ITEM]); }

/* Answers about every part of the app. Each section shows its own list; the
   search box at the top of the bubble looks through ALL of them, so a
   question about any feature can be answered from anywhere.
   When a new feature is added to the app, add a question about it here. */
const AI_ROBOT_FAQ_BY_TAB = {
  main: aiFaq([
    { q: "What is Teacher's Assistant?", a: "It's your all-in-one classroom toolkit — build interactive exercises, plan your weekly lessons, track results, and reward your students, all without any coding." },
    { q: 'How do I set up my weekly lesson schedule?', a: 'Tap "⚙️ Manage schedule" (or go to Settings → Weekly Lesson Schedule) and add each class once with its day and time. It repeats every week and shows up here under Upcoming Lessons.' },
    { q: 'What does the "Ready" button on a lesson do?', a: 'Tap "Ready" when you have prepared that lesson. Until then, the app reminds you about lessons in the next 24 hours — when you open it, and again every 2 hours.' },
    { q: 'Will I get reminded before a lesson?', a: "Yes — within 24 hours of a lesson you'll get a reminder, and the lesson shows a 'starts soon' badge in Upcoming Lessons. Reminders only work while the app is open." },
    { q: 'How do I write a plan for a lesson?', a: 'Go to Settings → Weekly Lesson Schedule and tap "📝 Plan" next to the lesson. Write your notes, pick the exercises for it, and tap "💾 Save Plan".' },
    { q: 'How is "Top 5 Active Students" worked out?', a: 'Students are ranked by how well they did, not by how many exercises they finished. Each result becomes a fair 0–100 score (Sentences use the stars you give in Results). Use the group buttons (e.g. Target / Apex) to see one group at a time.' },
    { q: 'What is "Lessons taught"?', a: 'Every lesson on your weekly schedule counts once each time its day and time pass. Removing a lesson from the schedule keeps what it already counted.' },
    { q: 'What is the note about students who finished exercises?', a: 'When you open the app, a note lists your students who finished an exercise in the last 7 days that you haven\'t checked yet. Tap an exercise under a student\'s name (📊) to open that exercise\'s results. The note stays open, so you can open the next student\'s exercise too. Tap "Checked" for one student, or "All checked". Closing it with ✕ only hides it until next time.' },
    { q: 'Can I switch between day and night mode?', a: 'Yes — tap the toggle switch at the top of this page to flip between light and dark themes any time.' },
    { q: 'How do I change the colours or the look?', a: 'Tap the 🎨 button next to the day/night switch. Pick a Style (Classic or Glass) and a colour Design. Four designs are for day and two for night.' },
    { q: 'How do I turn sounds off?', a: 'Tap the speaker button at the top of this page. 🔇 means sounds are off; tap it again to turn them back on.' },
    { q: 'How do I find something quickly?', a: 'Tap "🔍 Search" in the sidebar, or press Ctrl+K (⌘K on a Mac). Type a section, an exercise type, a group, a student or an exercise title and jump straight to it.' },
    { q: 'What is the "Edunest system" button?', a: 'It opens the Edunest teacher page in a new tab.' },
    { q: 'Can I move the robot?', a: 'Yes — drag me anywhere. Double-tap me and I roll away like a bowling ball. 🤖' }
  ]),
  createpicker: aiFaq([
    { q: 'How do I create a new exercise?', a: 'Pick a type below — Flashcards, Word Order, Test, Dictation, and more. Fill in your content, press Create, and a ready-to-use file downloads to your computer. A copy is kept in My Exercises.' },
    { q: "What's the difference between Ready to use and In process?", a: 'Ready to use types are fully built. In process types are newer and still being polished, but you can already try them.' },
    { q: 'Which exercise types are there?', a: 'Word Order, Make a Word, Flashcard, Presentation, Pronunciation, Spelling, Test, Sentences, Bidirectional Language, English Content, Dictation, and two classroom games: Jungle and Bamboozle. Plus Homework/Class sets and IELTS Listening, Reading and Writing.' },
    { q: 'Can I combine several exercises into one?', a: 'Yes — that\'s Homework & Class on this page. Choose Homework (students do it on their own) or Class (used together in a lesson), build round 1, tap "➕ Add Another Exercise" for the next round, then "Create ⬇".' },
    { q: 'What are Jungle and Bamboozle?', a: 'Two games for the classroom screen, played in teams. Jungle is a board game with dice; Bamboozle is a quiz with numbered cards. They use the same questions, so one can be turned into the other.' },
    { q: 'What about IELTS?', a: 'IELTS Listening (4 parts), Reading (3 parts) and Writing (Task 1 and 2, checked by AI) build IELTS-style tests. They don\'t affect Statistics or Points and have their own results. Speaking is still to be designed.' }
  ]),
  builder: aiFaq([
    { q: 'Where does my finished exercise go?', a: 'It downloads to your computer as a ready-to-use file, a copy is saved under "My Exercises", and it is also put online for 7 days so you can share it as a link.' },
    { q: 'How do I add many words or sentences at once?', a: 'Type or paste them into the box at the top of the list and press Enter. Words split by commas (or one per line) and sentences split at . ! ? each become their own row.' },
    { q: 'Can I use the same words in another exercise?', a: 'Yes — under the list there is a "↪ Use these words in…" bar. Tap another exercise type and it opens with your words already filled in.' },
    { q: 'What if I close the page before finishing?', a: 'Nothing is lost. Your work is saved as a draft while you type; open the same builder again and it offers to bring it back.' },
    { q: 'I pressed Reset All by mistake — can I get it back?', a: 'Yes — right after Reset All a message with "Undo" appears for a few seconds. Tap Undo (or press Ctrl+Z).' },
    { q: 'Why does a new exercise start with my old settings?', a: 'The app remembers your usual settings for each type (points, time limit, design…) from the last one you made. Only settings, never the words or title.' },
    { q: 'How do I choose which group an exercise is for?', a: 'Pick the group when you create it (or change it later in My Exercises with the 👥 button). Results then show who in that group didn\'t do it.' },
    { q: 'How many points does an exercise give?', a: 'Set "Points awarded on completion" in the builder. Students get them on the Points & Rewards board when they finish with their ID.' },
    { q: 'Can I edit an exercise after creating it?', a: 'Yes — in My Exercises tap "✏️ Use again". The builder opens filled in; change what you need and create a new version. Share the new one.' },
    { q: 'Do results here count toward Statistics and Points?', a: 'Yes — once students submit results, they flow into Results, Statistics and (if points are on) Points & Rewards automatically.' }
  ]),
  hwcbuilder: aiFaq([
    { q: 'How do I build a Homework & Class set?', a: 'Pick the exercise type for round 1 and fill it in. Tap "➕ Add Another Exercise" to add the next round, and "Create ⬇" when the set is complete. Give the set a title if you like.' },
    { q: 'Can the next round use the same words?', a: 'Yes — tap "↪ Next round with the same words" under the list. The next exercise type opens with the words already filled in.' },
    { q: 'How do code and points work in a set?', a: 'The set has one code and one points value, chosen in round 1. Students get the points once they finish the whole set.' },
    { q: 'How do students use it?', a: 'They open the set, enter their ID (and code) once, and work through every exercise in order. If they stop, they pick up where they left off. At the end they get a certificate.' },
    { q: 'Can a student skip an exercise in a set?', a: 'No. An exercise only counts as done when the student presses Submit (with every answer filled in) or its time limit runs out, and the set waits until the answers have reached you. If they can\'t be sent, the student sees "Try again" and the exercise isn\'t counted.' },
    { q: 'Where do I see the combined results?', a: 'In My Exercises tap "📊 View Results" on the set. You see each student\'s progress (e.g. 2/3), their total time, and can open their answers.' }
  ]),
  dashboard: aiFaq([
    { q: 'How does Statistics work?', a: 'It shows which exercise types your students complete the most. Exercises inside Homework/Class sets are counted too.' },
    { q: 'Who is counted in Statistics?', a: 'Only students who entered with an ID from your Students list. Students who typed just a name are left out.' }
  ]),
  myexercises: aiFaq([
    { q: 'What is My Exercises for?', a: "Every exercise you've built lives here — share it, see its results, open it again in its builder, print it, or turn off its points." },
    { q: 'Why do some exercises have a coloured edge?', a: 'Those are sets: 📚 Homework sets have an orange edge and 🏫 Class sets a green one, so they stand out from single exercises.' },
    { q: 'How do I rename an exercise?', a: 'Tap the ✎ next to its name, type the new name and tap Save. The new name shows in My Exercises and Results. A file you have already sent to students keeps its old name.' },
    { q: 'How do I find an exercise?', a: 'Type in the search box (title, word or code), or tap the group and type buttons above the list to show only those.' },
    { q: 'How do I send an exercise to my students?', a: 'Tap "📤 Share". You get a link (works for 7 days, also on iPhones) with "🔗 Copy link", a ready message to paste into Telegram, the file itself, and "🔢 Show code on screen" for the board.' },
    { q: 'The link has expired — what now?', a: 'Links work for 7 days. Tap "📤 Share" again and the app puts the exercise online again with a new 7 days.' },
    { q: 'What does "✏️ Use again" do?', a: 'It opens the exercise in its builder with everything filled in, so you can change it or make a new version.' },
    { q: 'What does "⚠️ Made before a fix" mean?', a: 'That file was made before a bug was fixed, so it still has the bug. Press "✏️ Use again", create a new copy and share that one.' },
    { q: 'Can I print an exercise?', a: 'Yes — tap "🖨 Worksheet" on word-list exercises. A paper version opens in a new tab with an answer key on its own page. Print it or save it as PDF.' },
    { q: 'How do I change the group of an exercise?', a: 'Tap the 👥 button under the exercise title and pick a group.' },
    { q: 'Can I turn a Jungle into a Bamboozle?', a: 'Yes — in the Jungle builder tap "🔁 Make it a Bamboozle" (in the Bamboozle builder: "🔁 Make it a Jungle"). The other game opens with the same questions. For a game you made earlier, tap "✏️ Use again" first.' },
    { q: 'How do I take one exercise out of a set?', a: 'On a Homework/Class set tap "📤 Get one exercise" to download one of its exercises or add it to My Exercises, or "🔀 Separate" to see them all.' },
    { q: 'How do I stop an exercise giving points?', a: 'Choose 0 in "Points awarded on completion" when you create it. For an exercise you already made, tap "✏️ Use again", set the points to 0 and share the new copy.' },
    { q: 'Can I delete an old exercise?', a: 'Yes — tap "🗑 Delete". Results already submitted are not affected.' },
    { q: 'How do I download an exercise file again?', a: 'Tap "📤 Share" — "📥 Redownload" is right under the link. Big files (with pictures or audio) are kept too. If the file isn\'t on this device, the app gets it back from its online link (for 7 days after sharing); after that, use "✏️ Use again" to make it again.' }
  ]),
  students: aiFaq([
    { q: 'What is the Students list for?', a: 'Give each student a unique ID — this is what they type into an exercise instead of a name. Only students on this list count in Statistics, Top 5 and "Didn\'t do it".' },
    { q: 'How do I add a whole class at once?', a: 'Tap "📋 Add many". Paste a class list (one student per line, "Name, ID", or copied straight from Excel/Google Sheets) or choose a CSV file. Students without an ID get the next free number.' },
    { q: 'What are groups?', a: 'Every student belongs to one group (for example two classes). Exercises can be made for a group, and Results then show who in that group didn\'t do it.' },
    { q: 'Do students need an account?', a: 'No — their ID is all they need to submit exercises and appear on the leaderboard.' },
    { q: 'A student\'s results are missing — why?', a: 'Usually the student typed a wrong ID or just a name. Their results then show under "Entered with a name only" and are left out of Statistics and Top 5.' }
  ]),
  results: aiFaq([
    { q: "Where do I see my students' results?", a: 'Right here. In My Exercises tap "📊 View Results" on an exercise, or upload the exercise file here. New results arrive by themselves.' },
    { q: 'What do ⚖️ and ⚠️ next to a student mean?', a: 'Tap ⚖️ next to a student to mark them "will be punished" — it turns into a red ⚠️ and their row turns red. Tap ⚠️ to take the mark off. It works in the results table, in a set\'s student list and in "Didn\'t do it". The mark is only for that exercise.' },
    { q: 'What do ✓ and ✕ next to a student mean?', a: '✕ means you haven\'t checked the student\'s answers yet; tap it after you have looked at them and it becomes ✓ (checked). Tap ✓ to change it back. Checked students stop appearing in the "finished exercises" note you get when you open the app.' },
    { q: 'Who is in "Didn\'t do it"?', a: 'Students in the exercise\'s group who have no result yet. It only shows for exercises made for a group.' },
    { q: 'What is "Entered with a name only"?', a: 'People who typed a name instead of an ID from your Students list. They are left out of Statistics and Top 5.' },
    { q: 'How do I rate Sentences?', a: 'Tap "☆ Rate" next to a Sentences result and give 1–5 stars. The stars are used for Top 5 Active Students.' },
    { q: 'How do I see a student\'s answers?', a: 'Tap "👁 View" in their row. In a Homework/Class set, tap the student\'s row to open their rounds, then 👁 for each one.' },
    { q: 'How are dictations scored?', a: 'Each missing, wrong or extra word counts as a mistake. 👁 View shows the student\'s text with the mistakes marked where they were typed.' },
    { q: 'How are Homework & Class results different?', a: 'They are grouped by student across the whole set: how many exercises each student finished (e.g. 2/3), their total time (red if under 15 minutes) and their answers.' },
    { q: 'A student shows "Completed" but 👁 says "No result found" — why?', a: 'Their answers didn\'t reach the database (usually a bad connection) while the set still counted the exercise — a problem in sets made before 1 Oct 2026. New sets wait until the answers are saved. Make the set again with "✏️ Use again" in My Exercises and share the new one; ask the student to redo it.' },
    { q: 'Why does a Flashcard result say "not recorded" for time?', a: 'The student did finish — the result arrived with everything else. Only the clock reading was lost: Flashcard files made before 3 Oct 2026 sent 0 seconds. Inside a Homework/Class set, the set\'s own time is shown instead. Make the exercise again with "✏️ Use again" in My Exercises and share the new one.' },
    { q: 'Can I download the results?', a: 'Yes — "⬇ Download Results Report (.html)" for a printable report, or "📊 Download for Excel (.csv)" for a spreadsheet.' },
    { q: 'What does "Delete ALL results for this code" do?', a: 'It removes every result of that exercise. Old copies of the file stop counting; only students who use a newly made file appear. Keep a backup first (Settings → 💾 Backup).' },
    { q: 'Why does it say students used an old copy?', a: 'Those results came from a file made before a bug was fixed. Make a new copy with "✏️ Use again" in My Exercises and share that.' }
  ]),
  points: aiFaq([
    { q: 'How do Points & Rewards work?', a: 'Students earn points by finishing exercises with their ID. This page is a live leaderboard by group — tap a group to see its students.' },
    { q: 'How do I give or take points by hand?', a: 'Tap + or − next to a student and type how many points. It shows up as "Bonus: By Teacher <your name>" (set your name in Settings).' },
    { q: 'How do students see the leaderboard?', a: 'Tap "⬇ Download Shareable Leaderboard (.html)" and send the file to them. It updates live, and anyone can tap a name to see which exercises earned the points.' },
    { q: 'What is the Points Board Code?', a: 'It links your exercises to this board and is put into every exercise automatically. "🔄 New Code" starts a new board.' },
    { q: 'Can I reset points?', a: 'Yes — "🗑 Reset All Points" sets everyone back to zero, and "🗑 Delete All Entirely" removes all entries.' }
  ]),
  settings: aiFaq([
    { q: 'How do I set up my weekly lesson schedule?', a: 'Add each class once with its day and time under Weekly Lesson Schedule — it repeats every week. Tap "📝 Plan" next to a lesson to write its plan.' },
    { q: 'How do I change the language?', a: 'Under 🌐 Language pick English, Oʻzbekcha or Русский. Menus and buttons change; exercises for students stay in English.' },
    { q: 'How do I make a backup?', a: 'Under 💾 Backup tap "⬇ Download backup". One file holds your students, groups, exercises, schedule and every result. Keep it somewhere safe (not only on this device). The app reminds you every week.' },
    { q: 'How do I bring back deleted results or data?', a: 'Under 💾 Backup tap "⬆ Restore from file" and choose a backup. You can bring back the app\'s data, and/or put back results that were deleted from the database.' },
    { q: 'How do I put the app on my phone or computer?', a: 'Under 📲 Install on this device tap Install (Chrome, Edge, Android). On iPhone/iPad open the app in Safari → Share → Add to Home Screen.' },
    { q: 'What is 🩺 Status?', a: 'It shows how the app is doing on this device: database, sign-in, results kept, sync, last backup, links space and storage. If something doesn\'t work, a ⚠️ here usually says why.' },
    { q: 'What is sync?', a: 'Your data is copied (encrypted) to the cloud so other devices show the same things. If the sidebar says "☁️ Sync is off", tap it and enter your password.' },
    { q: 'Can I share this app with another teacher?', a: 'Yes — use "🔗 Copy App Link" under Share. Your colleague signs in with their own account, so your students, exercises and points stay just yours.' },
    { q: 'Can I change my name or profile picture?', a: 'Yes — both are right here in Settings. Your name is shown on bonus points ("Bonus: By Teacher …").' }
  ]),
  'ielts-listening': aiFaq([
    { q: 'How do IELTS Listening exercises work?', a: "Full IELTS-style listening tests (build any of the 4 parts; students do the ones you built, in order), tracked separately from your other exercises — they don't affect Statistics or Points." }
  ]),
  'ielts-writing': aiFaq([
    { q: 'How do IELTS Writing exercises work?', a: 'Write the Task 1 and Task 2 prompts (and minimum word counts, an optional time limit). Students write their answers, which are checked by AI once they submit. They don\'t affect Statistics or Points.' }
  ]),
  'ielts-reading': aiFaq([
    { q: 'How do IELTS Reading exercises work?', a: "Full IELTS-style reading tests: build any of the 3 parts — paste each passage (paragraphs split on blank lines) and add its questions. They don't affect Statistics or Points." }
  ]),
  default: aiFaq([
    { q: "What is Teacher's Assistant?", a: "It's your all-in-one classroom toolkit — build interactive exercises, plan your weekly lessons, track results, and reward your students, all without any coding." },
    { q: 'How do I create a new exercise?', a: 'Tap "➕ Create New Exercise" in the sidebar, then pick a type — Flashcards, Word Order, Test, Dictation, and more.' },
    { q: "Where do I see my students' results?", a: 'Open "Results" in the sidebar, or tap "📊 View Results" on an exercise in My Exercises.' }
  ])
};
/* One exercise type's own questions, shown above the general builder ones. */
const AI_ROBOT_TYPE_FAQ = {
  flashcard: [
    { q: 'How do Flashcards work?', a: 'Add words with their translations (the app can fill the translations in). Students flip through the cards for each group, then take a short multiple-choice check before the next group.' }
  ],
  wordorder: [
    { q: 'How does Word Order work?', a: 'Type sentences. Students drag the mixed-up words into the right order; each sentence must be finished before the exercise ends.' }
  ],
  makeaword: [
    { q: 'How does Make a Word work?', a: 'Type words. Students drag the mixed-up letters into slots to spell each word.' }
  ],
  spelling: [
    { q: 'How does Spelling work?', a: 'Type a word and three convincing misspellings are written for you. Students see all four, shuffled, and pick the right one; a voice can read the word aloud first.' }
  ],
  test: [
    { q: 'How does Test work?', a: 'Write the whole sentence, then click the word that should be hidden. The wrong options are written for you (grammatically wrong forms of the same word).' }
  ],
  sentences: [
    { q: 'How does Sentences work?', a: 'Students write their own sentences: give words to build sentences around, or just say how many sentences to write and about what. You can add a picture at the top for them to write about. Sentences aren\'t checked automatically — rate them with stars in Results.' }
  ],
  bilingual: [
    { q: 'How does Bidirectional Language work?', a: 'Paste an English text, choose a language and translate it (automatically or by hand). Students see both side by side; tapping a sentence highlights it in both, and tapping an English word looks it up. Their notes show in Results.' }
  ],
  engcontent: [
    { q: 'How does English Content work?', a: 'Paste a YouTube video link. Students watch it on one side and take notes on the other. You see their notes in Results ("👁 View Notes").' }
  ],
  dictation: [
    { q: 'How does Dictation work?', a: 'Add the audio (a file from your computer, or a YouTube link) and the text. Students listen and write what they hear — freely, or by filling blanks in the text. Missing, wrong and extra words count as mistakes.' },
    { q: 'Why is my dictation file big?', a: 'The audio is packed inside the exercise. The app makes it smaller first (about 0.4 MB per minute). Very long audio (30+ min) is best done on a computer.' }
  ],
  pronunciation: [
    { q: 'How does Pronunciation work?', a: 'Type only the words — the app works out the pronunciation. Students say each word into the microphone and see a percentage plus which sounds were right (green) and wrong (red). Works best in Chrome with the internet on.' },
    { q: 'The microphone doesn\'t work on phones — why?', a: 'Phones only allow the microphone on a web page, and not inside Telegram or Instagram. Send students the link from "📤 Share" and tell them to open it in Chrome (or Safari).' }
  ],
  presentation: [
    { q: 'How does Presentation work?', a: 'Each slide is its own section: add text blocks, drag them anywhere and colour each one. Download the deck to show in class.' }
  ],
  jungle: [
    { q: 'How does Jungle work?', a: 'A board game for the classroom screen. The class splits into 2–4 teams with tokens. A team rolls the dice, moves, and answers that square\'s question. Tap "🔁 Make it a Bamboozle" to use the same questions in Bamboozle.' }
  ],
  bamboozle: [
    { q: 'How does Bamboozle work?', a: 'A team quiz for the classroom screen, played with you (no student IDs). 2–4 teams pick numbered cards that hide your questions and their points. Tap "🔁 Make it a Jungle" to use the same questions in Jungle.' }
  ]
};
const AI_ROBOT_BUILDER_TABS = ['flashcard', 'wordorder', 'makeaword', 'spelling', 'sentences', 'bilingual', 'engcontent', 'dictation', 'jungle', 'bamboozle', 'presentation', 'pronunciation', 'test'];
function getAiRobotFaqForTab(tab) {
  if (tab === 'hwcround') tab = 'hwcbuilder';
  if (AI_ROBOT_FAQ_BY_TAB[tab]) return AI_ROBOT_FAQ_BY_TAB[tab];
  if (AI_ROBOT_BUILDER_TABS.indexOf(tab) !== -1) return (AI_ROBOT_TYPE_FAQ[tab] || []).concat(AI_ROBOT_FAQ_BY_TAB.builder);
  return AI_ROBOT_FAQ_BY_TAB.default;
}
// a question and its answer in the app's language (js/i18n-strings.js, TA_ROBOT_I18N)
function aiRobotText(item) {
  const lang = window.taUiLang ? window.taUiLang() : 'en';
  const t = lang !== 'en' && window.TA_ROBOT_I18N && window.TA_ROBOT_I18N[item.q];
  if (!t) return { q: item.q, a: item.a, own: false };
  return lang === 'uz' ? { q: t[0], a: t[1], own: true } : { q: t[2], a: t[3], own: true };
}
// every question once, for the search box
function getAiRobotAllFaq() {
  const seen = new Set(), out = [];
  const add = list => list.forEach(it => { if (it !== AI_ROBOT_CONTACT_ITEM && !seen.has(it.q)) { seen.add(it.q); out.push(it); } });
  Object.keys(AI_ROBOT_TYPE_FAQ).forEach(k => add(AI_ROBOT_TYPE_FAQ[k]));
  Object.keys(AI_ROBOT_FAQ_BY_TAB).forEach(k => add(AI_ROBOT_FAQ_BY_TAB[k]));
  return out;
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
  // Phones: the robot stays put (wandering moves it with left/top, which re-lays out the page every frame).
  if (aiRobotWanderPaused || TA_LOW_POWER) return;
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
    aiRobotStopBowling(); // grabbing it mid-roll catches it
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
    if (wasDrag) { aiRobotResumeWander(); return; }
    // One tap opens the questions; a second tap right after sends it rolling instead.
    if (aiRobotTapTimer) {
      clearTimeout(aiRobotTapTimer);
      aiRobotTapTimer = null;
      aiRobotBowl();
    } else {
      aiRobotTapTimer = setTimeout(function () { aiRobotTapTimer = null; toggleAiRobotBubble(); }, AI_ROBOT_DOUBLE_TAP_MS);
    }
  });
  widget.addEventListener('pointercancel', function () {
    aiRobotDragState = null;
    widget.classList.remove('dragging');
    widget.classList.remove('no-transition');
    aiRobotResumeWander();
  });
}

/* ---- double tap: roll away like a bowling ball ----
   It shoots off in a random direction, spinning as it rolls, bounces off the
   screen edges, slows down and stops somewhere new. */
const AI_ROBOT_DOUBLE_TAP_MS = 280;
let aiRobotTapTimer = null;
let aiRobotBowlFrame = null;
function aiRobotStopBowling() {
  if (!aiRobotBowlFrame) return;
  cancelAnimationFrame(aiRobotBowlFrame);
  aiRobotBowlFrame = null;
  const widget = document.getElementById('aiRobotWidget');
  if (widget) { widget.classList.remove('bowling'); widget.style.transform = ''; }
}
function aiRobotBowl() {
  const widget = document.getElementById('aiRobotWidget');
  if (!widget) return;
  aiRobotStopBowling();
  closeAiRobotBubble();
  aiRobotPauseWander();
  playAiRobotOnce('alert');
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const radius = widget.offsetWidth / 2;
  let x = parseFloat(widget.style.left) || 0;
  let y = parseFloat(widget.style.top) || 0;
  const angle = Math.random() * Math.PI * 2;
  const speed = 1500 + Math.random() * 700; // px per second at launch
  let vx = Math.cos(angle) * speed, vy = Math.sin(angle) * speed;
  let spin = 0; // degrees rolled so far
  let last = performance.now();
  widget.classList.add('no-transition', 'bowling');
  function step(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const b = aiRobotBounds();
    x += vx * dt; y += vy * dt;
    // bounce off the edges, losing a little speed each time
    if (x < b.minX) { x = b.minX; vx = Math.abs(vx) * 0.8; }
    if (x > b.maxX) { x = b.maxX; vx = -Math.abs(vx) * 0.8; }
    if (y < b.minY) { y = b.minY; vy = Math.abs(vy) * 0.8; }
    if (y > b.maxY) { y = b.maxY; vy = -Math.abs(vy) * 0.8; }
    const friction = Math.pow(0.28, dt); // slows smoothly, like a ball on a lane
    vx *= friction; vy *= friction;
    const v = Math.hypot(vx, vy);
    // a rolling ball turns one full circle for every 2πr it travels
    if (!reduced) spin += (v * dt / radius) * (180 / Math.PI) * (vx >= 0 ? 1 : -1);
    widget.style.left = x + 'px';
    widget.style.top = y + 'px';
    widget.style.transform = spin ? 'rotate(' + spin.toFixed(1) + 'deg)' : '';
    if (v > 25) { aiRobotBowlFrame = requestAnimationFrame(step); return; }
    // stopped: turn upright again and do a little jump
    aiRobotBowlFrame = null;
    const rest = ((spin % 360) + 540) % 360 - 180; // same angle, but the shortest way back to upright
    widget.style.transform = 'rotate(' + rest + 'deg)';
    void widget.offsetWidth;
    widget.classList.remove('no-transition', 'bowling');
    widget.classList.add('settling');
    widget.style.transform = 'rotate(0deg)';
    setTimeout(function () { widget.classList.remove('settling'); widget.style.transform = ''; }, 450);
    playAiRobotOnce('jump');
    aiRobotResumeWander();
  }
  aiRobotBowlFrame = requestAnimationFrame(step);
}

/* ---- FAQ thought bubble ---- */
let aiRobotBubbleOpen = false;
let aiRobotShown = [];   // the questions in the list right now
let aiRobotQuery = '';   // what's typed in the search box
function renderAiRobotQuestionList() {
  const body = document.getElementById('aiRobotBubbleBody');
  if (!body) return;
  body.innerHTML = '<input type="search" class="ai-robot-search" id="aiRobotSearch" placeholder="🔍 Search all questions…" autocomplete="off" oninput="aiRobotFilter(this.value)">' +
    '<div id="aiRobotQList"></div>';
  const input = document.getElementById('aiRobotSearch');
  input.value = aiRobotQuery;
  aiRobotFilter(aiRobotQuery);
}
// empty: this section's questions; otherwise every question with all the typed words
function aiRobotFilter(text) {
  aiRobotQuery = String(text || '');
  const list = document.getElementById('aiRobotQList');
  if (!list) return;
  const words = aiRobotQuery.toLowerCase().split(/\s+/).filter(Boolean);
  aiRobotShown = words.length
    ? getAiRobotAllFaq().filter(it => { const x = aiRobotText(it); const t = (x.q + ' ' + x.a + ' ' + it.q + ' ' + it.a).toLowerCase(); return words.every(w => t.indexOf(w) !== -1); }).concat([AI_ROBOT_CONTACT_ITEM])
    : getAiRobotFaqForTab(currentActiveTab);
  const lang = window.taUiLang ? window.taUiLang() : 'en';
  const none = lang === 'uz' ? 'Hech bir javobda “%” yoʻq.' : lang === 'ru' ? 'Ни в одном ответе нет «%».' : 'No answer mentions “%”.';
  list.innerHTML = (words.length && aiRobotShown.length === 1 ? '<div class="ai-robot-none" translate="no">' + escapeForHtml(none).replace('%', escapeForHtml(aiRobotQuery.trim())) + '</div>' : '') +
    aiRobotShown.map(function (item, i) {
      const x = aiRobotText(item);
      return '<button type="button" class="ai-robot-q-item" onclick="showAiRobotAnswer(' + i + ')"' + (x.own ? ' translate="no"' : '') + '>' + escapeForHtml(x.q) + '</button>';
    }).join('');
}
function showAiRobotAnswer(i) {
  const item = aiRobotShown[i];
  if (!item) return;
  const body = document.getElementById('aiRobotBubbleBody');
  if (!body) return;
  body.innerHTML =
    '<button type="button" class="ai-robot-back-btn" onclick="renderAiRobotQuestionList()">← Back to questions</button>' +
    (function (x) {
      const no = x.own ? ' translate="no"' : '';
      return '<div class="ai-robot-answer-q"' + no + '>' + escapeForHtml(x.q) + '</div>' +
        '<div class="ai-robot-answer-a"' + no + '>' + escapeForHtml(x.a) + '</div>';
    })(aiRobotText(item));
  playAiRobotOnce('yes');
}
window.aiRobotFilter = aiRobotFilter;
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
  // phones: park it in the bottom-right corner, out of the way of the content
  widget.style.left = (TA_LOW_POWER ? b.maxX : Math.min(60, b.maxX)) + 'px';
  widget.style.top = (TA_LOW_POWER ? Math.max(b.minY, b.maxY - 70) : Math.min(170, b.maxY)) + 'px';
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
  if (!el || el.dataset.ready || typeof lottie === 'undefined') return;
  try {
    el.innerHTML = '';
    el.dataset.ready = '1';
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


/* ================= INSTALL AS AN APP =================
   sw.js lets the app be installed (home screen / desktop) and open without
   a connection from what it has already loaded. Chrome, Edge and Android
   offer an install prompt, kept here for the Install button in Settings;
   iPhone and iPad install from Safari's Share menu instead. */
let taInstallPrompt = null;
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () { /* the app works the same without it */ });
  });
}
window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  taInstallPrompt = e;
  if (window.renderInstallSection) window.renderInstallSection();
});
window.addEventListener('appinstalled', function () {
  taInstallPrompt = null;
  if (window.renderInstallSection) window.renderInstallSection();
  showToast('📲 Installed! Open Teacher\'s Assistant from your home screen or apps.', 'ok');
});
function taIsInstalled() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
}
async function taInstallApp() {
  if (!taInstallPrompt) return false;
  const p = taInstallPrompt;
  taInstallPrompt = null;
  p.prompt();
  try { await p.userChoice; } catch (e) { /* ignore */ }
  if (window.renderInstallSection) window.renderInstallSection();
  return true;
}

/* ================= POP-UP WINDOW =================
   taModal(title, bodyHtml, { wide }) opens a pop-up built on the page's
   existing pop-up look, and returns { el, body, close }. Closes with ✕,
   Escape, or a tap outside it. */
function taModal(title, bodyHtml, opts) {
  opts = opts || {};
  const back = document.createElement('div');
  back.className = 'points-modal-backdrop show ta-modal';
  back.innerHTML = '<div class="points-modal" role="dialog" aria-modal="true"' + (opts.wide ? ' style="max-width:560px;"' : '') + '>' +
    '<button class="points-modal-close" type="button" aria-label="Close">✕</button>' +
    '<div class="points-modal-title"></div>' +
    '<div class="ta-modal-body"></div>' +
  '</div>';
  back.querySelector('.points-modal-title').textContent = title;
  const body = back.querySelector('.ta-modal-body');
  body.innerHTML = bodyHtml;
  const onKey = e => { if (e.key === 'Escape') close(); };
  function close() {
    back.remove();
    document.removeEventListener('keydown', onKey);
    if (opts.onClose) opts.onClose();
  }
  back.addEventListener('click', e => { if (e.target === back) close(); });
  back.querySelector('.points-modal-close').onclick = close;
  document.addEventListener('keydown', onKey);
  document.body.appendChild(back);
  return { el: back, body: body, close: close };
}

/* ================= ESC CLOSES THE FIXED POP-UPS =================
   Pop-ups made with taModal() close on Esc themselves. The ones written into
   the pages (lesson plan, answers viewer, points details, settings…) close
   with Esc here too, the same as their ✕ or Close button. */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  if (document.querySelector('.ta-modal')) return; // the newest pop-up is on top and closes itself
  const open = Array.from(document.querySelectorAll('.points-modal-backdrop.show, .modal-backdrop.show, .wheel-winner-modal.show')).pop();
  if (!open) return;
  if (open.id === 'sentenceViewModal') { closeSentenceViewModal(); return; }
  const close = open.querySelector('.points-modal-close, .modal-close');
  if (close) close.click();
});

/* ================= QUICK SEARCH (Ctrl+K) =================
   One box to jump anywhere: a section, an exercise builder, a group, a
   student, or an exercise in My Exercises. Opens with Ctrl+K (⌘K on a Mac),
   "/" when not typing, or the 🔍 Search button in the sidebar. */
const TA_TAB_LABELS = {
  main: ['🎓', 'Dashboard'], createpicker: ['➕', 'Create'], dashboard: ['📊', 'Statistics'],
  myexercises: ['📁', 'My Exercises'], students: ['👥', 'Students'], results: ['📋', 'Results'],
  points: ['🏆', 'Points & Rewards'], settings: ['⚙️', 'Settings'],
  flashcard: ['🎴', 'Flashcard'], wordorder: ['🧩', 'Word Order'], makeaword: ['🧱', 'Make a Word'],
  spelling: ['🔤', 'Spelling'], sentences: ['✍️', 'Sentences'], bilingual: ['📖', 'Bidirectional Language'],
  engcontent: ['🎬', 'English Content'], dictation: ['🎧', 'Dictation'], jungle: ['🌴', 'Jungle'], bamboozle: ['🎯', 'Bamboozle'], presentation: ['🖥️', 'Presentation'],
  pronunciation: ['🎙️', 'Pronunciation'], test: ['✅', 'Test'], 'ielts-listening': ['🎧', 'IELTS Listening'],
  'ielts-reading': ['📗', 'IELTS Reading'], 'ielts-writing': ['✍️', 'IELTS Writing']
};

function taQuickSearchItems() {
  const items = [];
  Object.keys(TA_PAGES).forEach(tab => {
    const l = TA_TAB_LABELS[tab];
    items.push({ icon: l[0], label: l[1], kind: 'Section', go: () => switchTo(tab) });
  });
  BUILDER_TABS.forEach(tab => {
    const l = TA_TAB_LABELS[tab];
    if (l) items.push({ icon: l[0], label: l[1], kind: 'New exercise', extra: 'create build make', go: () => switchTo(tab) });
  });
  items.push({ icon: '📚', label: 'Homework', kind: 'New set', go: () => taRunOnPage('create.html', () => openHwcBuilder('homework')) });
  items.push({ icon: '📚', label: 'Class', kind: 'New set', go: () => taRunOnPage('create.html', () => openHwcBuilder('class')) });
  items.push({ icon: '💾', label: 'Backup my data', kind: 'Settings', extra: 'download restore export import file', go: () => taNavigate('settings.html#backup') });
  items.push({ icon: '🌐', label: 'Language', kind: 'Settings', extra: 'til язык uzbek russian english oʻzbekcha русский', go: () => taNavigate('settings.html#language') });
  items.push({ icon: '📲', label: 'Install the app', kind: 'Settings', extra: 'home screen phone desktop offline pwa', go: () => taNavigate('settings.html#install') });
  items.push({ icon: '📅', label: 'Weekly lesson schedule', kind: 'Settings', extra: 'lessons timetable', go: () => taNavigate('settings.html#schedule') });
  getStudentGroups().forEach(g => {
    items.push({ icon: '👥', label: g.name, kind: 'Group', mine: true, go: () => taRunOnPage('students.html', () => openStudentGroup(g.id)) });
  });
  getPointsRoster().forEach(s => {
    const gName = groupNameFor(s.group);
    items.push({ icon: '🧑‍🎓', label: s.name, mine: true, kind: 'Student · ID ' + s.id + (gName ? ' · ' + gName : ''), extra: String(s.id),
      go: () => taRunOnPage('students.html', () => {
        openStudentGroup(getRosterByGroup().some(b => b.id === s.group) ? s.group : '');
        const row = document.querySelector('.roster-row[data-student-id="' + CSS.escape(String(s.id)) + '"]');
        if (!row) return;
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row.classList.add('flash-highlight');
        setTimeout(() => row.classList.remove('flash-highlight'), 1600);
      }) });
  });
  getRecentExercises().forEach(e => {
    const gName = groupNameFor(e.groupId);
    items.push({ icon: '📁', label: e.title, mine: true, kind: e.typeLabel + (gName ? ' · ' + gName : '') + (e.requiredCode ? ' · code ' + e.requiredCode : ''),
      extra: (e.requiredCode || '') + ' ' + (e.contentSummary || '').slice(0, 2000),
      go: () => taNavigate('my-exercises.html?highlight=' + encodeURIComponent(e.uid)) });
  });
  return items;
}

// Opens a section, then runs something that needs that section's script.
async function taRunOnPage(file, fn) {
  const tab = Object.keys(TA_PAGES).find(t => TA_PAGES[t] === file);
  if (document.getElementById('panel-' + tab)) switchTo(tab);
  else await taNavigate(file);
  try { fn(); } catch (e) { /* that section couldn't load: it's already showing */ }
}

function taScoreItem(item, words) {
  const shown = (!item.mine && window.taT) ? taT(item.label) : item.label;
  const label = shown.toLowerCase();
  const hay = label + ' ' + item.label.toLowerCase() + ' ' + item.kind.toLowerCase() + ' ' + (window.taT ? taT(item.kind).toLowerCase() : '') + ' ' + (item.extra || '').toLowerCase();
  let score = 0;
  for (const w of words) {
    if (hay.indexOf(w) === -1) return -1;
    score += label.indexOf(w) === 0 ? 3 : label.indexOf(w) !== -1 ? 2 : 1;
  }
  return score;
}

let taQuickSearchOpen = null;
function openQuickSearch() {
  if (taQuickSearchOpen) { taQuickSearchOpen.input.focus(); return; }
  const all = taQuickSearchItems();
  const m = taModal('🔍 Search', '<input type="search" class="qs-input" placeholder="Type a section, exercise, student or group…" autocomplete="off" spellcheck="false" aria-label="Search">' +
    '<div class="qs-list" role="listbox"></div><div class="qs-hint">↑ ↓ to move · Enter to open · Esc to close</div>',
    { wide: true, onClose: () => { taQuickSearchOpen = null; } });
  m.el.classList.add('qs-modal');
  const input = m.body.querySelector('.qs-input');
  const listEl = m.body.querySelector('.qs-list');
  let shown = [], sel = 0;
  const render = () => {
    const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) shown = all.filter(i => i.kind === 'Section' || i.kind === 'New exercise').slice(0, 30);
    else shown = all.map(i => ({ i: i, s: taScoreItem(i, words) })).filter(x => x.s >= 0)
      .sort((a, b) => b.s - a.s).slice(0, 40).map(x => x.i);
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    listEl.innerHTML = shown.length
      ? shown.map((it, k) => '<button type="button" class="qs-item' + (k === sel ? ' sel' : '') + '" data-k="' + k + '" role="option">' +
          '<span class="qs-icon" aria-hidden="true">' + it.icon + '</span>' +
          '<span class="qs-label"' + (it.mine ? ' translate="no"' : '') + '>' + escapeForHtml(it.label) + '</span>' +
          '<span class="qs-kind">' + escapeForHtml(it.kind) + '</span></button>').join('')
      : '<div class="empty-results">Nothing found.</div>';
    const cur = listEl.querySelector('.qs-item.sel');
    if (cur) cur.scrollIntoView({ block: 'nearest' });
  };
  const choose = k => {
    const it = shown[k];
    if (!it) return;
    m.close();
    if (taIsPhone()) taCloseSidebar();
    it.go();
  };
  input.addEventListener('input', () => { sel = 0; render(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, shown.length - 1); render(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
    else if (e.key === 'Enter') { choose(sel); e.preventDefault(); }
  });
  listEl.addEventListener('click', e => { const b = e.target.closest('.qs-item'); if (b) choose(+b.dataset.k); });
  render();
  setTimeout(() => input.focus(), 20);
  taQuickSearchOpen = { input: input };
}

document.addEventListener('keydown', function (e) {
  const tag = (e.target.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
  if (((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey)) {
    if (!window.__TA_USER) return; // not signed in yet
    e.preventDefault();
    openQuickSearch();
  }
});

function taMountQuickSearch() {
  const nav = document.querySelector('#mainSidebar nav');
  if (!nav || document.getElementById('quickSearchBtn')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'quickSearchBtn';
  btn.className = 'quick-search-btn';
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || '');
  btn.innerHTML = '<span>🔍 Search</span><kbd>' + (mac ? '⌘' : 'Ctrl') + ' K</kbd>';
  btn.onclick = openQuickSearch;
  nav.parentNode.insertBefore(btn, nav);
}

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
  taLoadBigFiles();
  taSetupSidebar();
  taMountQuickSearch();
  applyTheme();
  updateSoundToggleUI();
  applyAvatar();
  document.getElementById('sidebarProfileName').textContent = getTeacherName();
  (function () { const el = document.getElementById('sidebarProfileLogin'); if (el && taCurrentLogin()) el.textContent = '@' + taCurrentLogin(); })();
  // create.html#flashcard opens the Flashcard builder directly, and so on.
  const hashTab = decodeURIComponent(location.hash.slice(1));
  switchTo(hashTab && document.getElementById('panel-' + hashTab) ? hashTab : defaultTab);
  initWelcomeSplash();
  initStatsIconAnim();
  initCreateIconAnim();
  taInitSectionAnims();
  initAiRobotWidget();
  initSidebarHamburgerAnim();

  setTimeout(showReminderToastIfDue, 900);
  setTimeout(taSweepPlayLinksIfDue, 8000);
  setTimeout(taBackupReminderIfDue, 9000);
  setTimeout(taOldFileWarnCheck, 12000);

  /* Re-check lesson reminders periodically so the reminder pop-ups and "starts
     soon" badges stay accurate even if the app is left open across the 24h boundary. */
  setInterval(function () {
    showReminderToastIfDue();
    taReadyReminderCheck();
    if (currentActiveTab === 'main') renderNextLessons();
  }, 5 * 60 * 1000);

  const idle = window.requestIdleCallback || function (fn) { setTimeout(fn, 1500); };
  idle(taPrefetchPages);
}
