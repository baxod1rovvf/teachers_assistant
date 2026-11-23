/* ================= THE JOURNEYS' SHARED HELPERS (2026-11-23) =================
   The Course is four pages since 2026-11-23 (teacher: "it is too big so separate every journey"): course.html (the three cards),
   ieltsjourney.html (js/pages/ielts-journey.js — the groups on the 20 steps), grammarjourney.html (js/pages/grammar.js) and
   dictationjourney.html (js/pages/dictation.js). What more than one of them needs lives here, loaded by all three journey pages
   (once: a page opened without a reload doesn't load a script twice).
   - the results of some codes (skResultsMap), places/medals, short dates, scrolling back to a row;
   - the class lists of Grammar and Dictation (one list of every student with a group — grClassStudents, grRosterSig, the
     refresher jrMakeRefresher), the codes already in use (grUsedCodes), first tries / Not finished / Not on your Students list (jr*);
   - "results changed": firebase.js/common.js call taCourseResultsChanged(); each journey page adds its own redraw (jrOnResultsChanged). */
const SK_MEDALS = ['🥇', '🥈', '🥉'];
const TA_JOURNEY_REDRAWS = [];
function jrOnResultsChanged(fn) { TA_JOURNEY_REDRAWS.push(fn); }
window.taCourseResultsChanged = function () { TA_JOURNEY_REDRAWS.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); };
/* is a page's wrap on screen (a page loaded in the background isn't drawn while hidden — opening it draws it, taOnTab) */
function jrShown(id) { const w = document.getElementById(id); return !!w && w.getClientRects().length > 0; }
/* "← Course": back to the three journeys */
function jrBackToCourseHtml() { return '<button type="button" class="back-to-picker-btn" onclick="taNavigate(\'course.html\')">← Course</button>'; }

function skShortDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
function skCourseShownScroll(sel) {
  const el = document.querySelector(sel);
  if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
function skPlaceText(p) { return SK_MEDALS[p - 1] || String(p); }

/* The results of some codes (kept on this device): { code: [results] }, without those cleared by "Delete all results"
   — decided by isExpiredResult, the same rule Results uses. The kept results are read once for all the codes
   (a drawing of the Course page asks for every step's codes at once). */
function skResultsMap(codes) {
  const want = new Set((codes || []).filter(Boolean)), map = {};
  want.forEach(c => { map[c] = []; });
  if (!want.size) return map;
  const stored = getStoredResults(), live = window.__liveResults || [], cutoff = {}, resets = getLocalResets();
  want.forEach(c => { cutoff[c] = resets[c] || ''; });
  live.concat(stored).forEach(r => {
    if (isResetMarker(r) && want.has(r.code) && r.resetAt && r.resetAt > cutoff[r.code]) cutoff[r.code] = r.resetAt;
  });
  const seen = new Set();
  (window.__allResults || []).concat(stored, live).forEach(r => {
    if (!r || !want.has(r.code) || isResetMarker(r) || isExpiredResult(r, cutoff[r.code])) return;
    const sig = resultSignature(r);
    if (seen.has(sig)) return;
    seen.add(sig);
    map[r.code].push(r);
  });
  return map;
}

/* every code this teacher already uses — a new lesson code is never one of them (skills links, lessons, My Exercises) */
function grUsedCodes() {
  const used = new Set();
  const add = v => { if (v && typeof v === 'object') [v.code].concat(Array.isArray(v.alsoCodes) ? v.alsoCodes : []).forEach(c => { if (c) used.add(String(c)); }); };
  try { Object.values(taSkillsLinks()).forEach(add); } catch (e) { /* ignore */ }
  try { Object.values(JSON.parse(localStorage.getItem('ta_skills_links') || '{}') || {}).forEach(add); } catch (e) { /* ignore */ }
  try { Object.values(JSON.parse(localStorage.getItem('ta_grammar_links') || '{}') || {}).forEach(add); } catch (e) { /* ignore */ }
  try { Object.values(JSON.parse(localStorage.getItem('ta_dictation_links') || '{}') || {}).forEach(add); } catch (e) { /* ignore */ }
  try { (getRecentExercises() || []).forEach(add); } catch (e) { /* ignore */ }
  return used;
}

/* ---- the class list: every student who is in a group, with the group's name ---- */
function grClassStudents() {
  const names = {};
  getStudentGroups().forEach(g => { names[g.id] = g.name; });
  // one entry per ID: a student whose ID was changed (✎ on the Students page) can start with the old one too
  return taClassListEntries(getPointsRoster().filter(s => s && names[s.group] !== undefined)
    .map(s => ({ id: s.id, oldIds: s.oldIds, name: s.name, groupName: names[s.group] })));
}
/* the Students list as it goes online (IDs, names, groups) — when it changes, the lists must be put online again */
function grRosterSig() {
  return grClassStudents().map(s => taIdKey(s.id) + '|' + String(s.name || '').trim() + '|' + s.groupName).sort().join('\n');
}

/* ---- the class lists follow the Students list (2026-11-16): a student added (or renamed, or moved) after Copy link can start
   without pressing Copy link again. Runs when the Course page draws and when sync/another tab changes the roster or groups.
   At most one run per 5 s (window[o.msVar] in tests), never two at once; a failed publish keeps the old rosterSig, so the next run retries.
   jrMakeRefresher is shared with the Dictation Journey (js/pages/dictation.js): o = { links(), save(v), msVar, retryVar } —
   links() = { <id>: { code, rosterSig } }, every list holds every student with a group (grClassStudents). ---- */
function jrMakeRefresher(o) {
  let busy = false, again = false, last = 0, timer = 0, retryTimer = 0, failStreak = 0, sigBusy = false;
  const code = id => { const e = o.links()[id]; return e && typeof e === 'object' && e.code ? String(e.code) : ''; };
  return function refresh() {
    if (sigBusy) return;
    if (window.taSync && typeof window.taSync.ready === 'function' && !window.taSync.ready()) return;   // sync hasn't brought the Students list yet — it calls us once ready
    if (typeof window.taPublishClassList !== 'function') return;   // Firebase is still loading — the next draw tries again
    if (busy) { again = true; return; }
    const wait = (window[o.msVar] !== undefined ? window[o.msVar] : 5000) - (Date.now() - last);
    if (wait > 0) { if (!timer) timer = setTimeout(() => { timer = 0; refresh(); }, wait); return; }
    sigBusy = true;   // getStudentGroups can save (and so call us again) while we work out the signature
    let sig, students;
    try { students = grClassStudents(); sig = grRosterSig(); } finally { sigBusy = false; }
    const links = o.links();
    const stale = Object.keys(links).filter(id => { const e = links[id]; return e && typeof e === 'object' && e.code && e.rosterSig !== sig; });
    if (!stale.length) return;
    /* an empty roster while a list was published before = most likely a device whose Students list hasn't synced yet:
       an empty list would delete the class list and let any ID in — wait instead */
    if (!students.length && stale.some(id => links[id].rosterSig)) return;
    busy = true; last = Date.now();
    let failed = false;
    (async () => {
      for (const id of stale) {
        const c = code(id);
        let ok = false;
        try { ok = await window.taPublishClassList(c, students); } catch (e) { ok = false; }
        if (!ok) { failed = true; continue; }
        const now = o.links();   // read again: sync may have changed it while we waited
        if (now[id] && now[id].code === c) { now[id].rosterSig = sig; o.save(now); }
      }
    })().catch(() => {}).then(() => {
      busy = false;
      if (!failed) failStreak = 0;
      else if (++failStreak <= 3 && !retryTimer) {   // one delayed retry per failure, 3 attempts at most
        retryTimer = setTimeout(() => { retryTimer = 0; refresh(); }, window[o.retryVar] !== undefined ? window[o.retryVar] : 30000);
      }
      if (again) { again = false; refresh(); }
    });
  };
}

function grStudentKey(st) { return String(st.id).trim().toLowerCase(); }
function grNum(v) { const n = Number(v); return isFinite(n) ? n : null; }

/* ---- shared with the Dictation Journey: a list of results → each roster student's first try, who hasn't done it, who isn't listed ---- */
/* each roster student's first try (the earliest date) — [{ st, r }], only students of groupId ('all' / '' → everyone) */
function jrFirstTries(list, groupId) {
  const idx = taRosterIndex(), first = {};
  (list || []).forEach(r => {
    const st = rosterStudentForResult(r, idx);
    if (!st) return;
    if (groupId && groupId !== 'all' && st.group !== groupId) return;
    const key = grStudentKey(st), cur = first[key];
    if (!cur || String(r.date || '') < String(cur.r.date || '')) first[key] = { st: st, r: r };
  });
  return Object.values(first);
}
/* the group's students (Students list) with no result in the list; 'all' → everyone in a group */
function jrMissing(list, groupId) {
  const idx = taRosterIndex(), done = new Set();
  (list || []).forEach(r => { const st = rosterStudentForResult(r, idx); if (st) done.add(grStudentKey(st)); });
  const names = {};
  getStudentGroups().forEach(g => { names[g.id] = g.name; });
  return getPointsRoster().filter(s => s && names[s.group] !== undefined && (!groupId || groupId === 'all' || s.group === groupId) && !done.has(grStudentKey(s)))
    .map(s => ({ name: s.name, id: s.id, group: names[s.group], groupId: s.group }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
/* answers from an ID that isn't on the Students list — one row per typed ID (else name) */
function jrUnlisted(list) {
  const idx = taRosterIndex(), by = {}, fixed = new Set();
  list = list || [];
  list.forEach(r => { if (r && r.correctedFrom) fixed.add(r.correctedFrom); });
  list.forEach(r => {
    if (rosterStudentForResult(r, idx) || fixed.has(r.__id)) return;
    const key = taIdKey(r.studentId) || 'name:' + String(r.name || '').trim().toLowerCase();
    if (key === 'name:' || by[key]) return;
    by[key] = { name: String(r.name || '').trim(), id: String(r.studentId || '').trim() };
  });
  return Object.values(by).sort((a, b) => a.name.localeCompare(b.name));
}
/* how many students have done it (anyone with a result, on the list or not) */
function jrDoneCount(list) {
  const seen = new Set(), idx = taRosterIndex();
  (list || []).forEach(r => {
    const st = rosterStudentForResult(r, idx);   // one student, whichever of their IDs (now or before) they typed
    const k = st ? 'roster:' + grStudentKey(st) : (taIdKey(r.studentId) || String(r.name || '').trim().toLowerCase());
    if (k) seen.add(k);
  });
  return seen.size;
}
/* places: 1 + how many rows are better (equal ones share a place) */
function jrPlaces(rows, better) { rows.forEach(row => { row.place = 1 + rows.filter(o => better(o, row)).length; }); return rows; }
/* copies text; when the browser won't, shows it in a window to copy by hand */
function jrCopyText(text, msg, title, rows) {
  const show = () => taModal(title, rows ? '<textarea class="ta-input" readonly rows="' + rows + '" aria-label="The list">' + escapeForHtml(text) + '</textarea>'
    : '<input type="text" class="ta-input" readonly value="' + escapeForHtml(text) + '" aria-label="The link">');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => showToast(msg, 'ok'), show);
  else show();
}
/* the group filter chips (All · each group); onPick = the global function's name */
function jrFilterHtml(active, onPick) {
  const chip = (id, label) => '<button type="button" class="gr-chip' + (active === id ? ' active' : '') + '" aria-pressed="' + (active === id) + '" onclick="' + onPick + '(' + jsAttr(id) + ')"' + (id === 'all' ? '' : ' translate="no"') + '>' + escapeForHtml(label) + '</button>';
  return '<div class="gr-filter" role="group" aria-label="Show a group">' + chip('all', 'All') + getStudentGroups().map(x => chip(x.id, x.name)).join('') + '</div>';
}
/* "🚫 Not finished — <group>" with 📋 Copy list (onCopy = the global function's name, given the group id) */
function jrMissingHtml(rows, g, onCopy, doneText) {
  const gName = '<span translate="no">' + escapeForHtml(g.name) + '</span>';
  return '<section class="sk-missing gr-missing" data-group="' + escapeForHtml(g.id) + '" aria-label="Not finished — ' + escapeForHtml(g.name) + '">' +
    '<div class="sk-results-head"><h3>🚫 Not finished — ' + gName + ' (' + rows.length + ')</h3>' +
    (rows.length ? '<button type="button" class="mini-btn solid" onclick="' + onCopy + '(' + jsAttr(g.id) + ')">📋 Copy list</button>' : '') + '</div>' +
    (rows.length ? '<ol class="sk-missing-list">' + rows.map(r => '<li><b translate="no">' + escapeForHtml(r.name) + '</b></li>').join('') + '</ol>'
      : '<div class="sk-results-empty"><span class="sk-results-empty-emoji">🎉</span><div><b>Everyone has finished</b><span>Every student in ' + gName + ' ' + doneText + '</span></div></div>') +
    '</section>';
}
function jrUnlistedHtml(odd) {
  if (!odd.length) return '';
  return '<section class="sk-unlisted gr-unlisted" aria-label="Not on your Students list">' +
    '<div class="sk-results-head"><h3>❓ Not on your Students list (' + odd.length + ')</h3></div>' +
    '<ol class="sk-missing-list">' + odd.map(r => '<li><b translate="no">' + escapeForHtml(r.name || '—') + '</b> <small>ID ' + escapeForHtml(r.id || '—') + '</small></li>').join('') + '</ol>' +
    '<p class="sk-hint sk-results-note">These answers came with an ID that isn\'t on the Students list, so they count for nobody. A new student: add them to their group with this ID. ' +
    'A wrong ID: change the student\'s ID on the Students page, or tell them their right ID.</p></section>';
}
/* "📋 Copy list" text: "<title> — Apex / Not finished yet: / 1. Name" */
function jrCopyMissing(title, g, rows) {
  if (!rows.length) { showToast('🎉 Everyone has finished — nothing to copy.'); return; }
  const text = [title + ' — ' + g.name, 'Not finished yet:'].concat(rows.map((r, i) => (i + 1) + '. ' + r.name)).join('\n');
  jrCopyText(text, '📋 Copied — ' + rows.length + (rows.length === 1 ? ' student' : ' students') + '. Paste it into ' + g.name + '\'s chat.',
    '📋 Not finished — ' + g.name, Math.min(14, rows.length + 3));
}

function grTimeText(seconds) {
  const s = Number(seconds);
  if (!(s > 0)) return '—';
  const m = Math.max(1, Math.round(s / 60));
  return m >= 60 ? Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min' : m + ' min';
}

Object.assign(window, { skResultsMap, skShortDate, skPlaceText, skCourseShownScroll, grUsedCodes, grClassStudents, grRosterSig, jrMakeRefresher, jrShown, jrOnResultsChanged });
