import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, query, where, onSnapshot, getDocs, deleteDoc, updateDoc, doc, addDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCefg2YghdSneABh0ZOUu3-snO4soVw0lA",
  authDomain: "teachers-assistant-app-ccd1a.firebaseapp.com",
  projectId: "teachers-assistant-app-ccd1a",
  storageBucket: "teachers-assistant-app-ccd1a.firebasestorage.app",
  messagingSenderId: "185909682129",
  appId: "1:185909682129:web:21fd63e09809eac82d8af0",
  measurementId: "G-7P60GBSYEM"
};

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase init failed:", e);
}

// Cloud sync (js/sync.js): one record per synced item, updated in place.
if (db) {
  window.taSyncBackend = {
    listen: (code, onData, onErr) => onSnapshot(query(collection(db, 'results'), where('code', '==', code)),
      snap => onData(snap.docs.map(d => d.data())), onErr),
    put: (id, data) => setDoc(doc(db, 'results', id), data),
    remove: id => deleteDoc(doc(db, 'results', id))
  };
}

window.taFetchAccounts = async function () {
  if (!db) return null;
  try {
    const snap = await getDocs(query(collection(db, 'results'), where('code', '==', TA_ACCOUNTS_CODE)));
    return snap.docs.map(d => d.data());
  } catch (e) { console.error('Account check failed:', e); return null; }
};

let unsubscribe = null;
window.__liveResults = [];

function setStatus(text, cls) {
  const el = document.getElementById('liveSyncStatus');
  if (!el) return;
  el.innerText = text;
  el.className = 'live-sync-status' + (cls ? ' ' + cls : '');
}

window.startLiveSync = function (code) {
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }
  window.__liveResults = [];

  if (!db) {
    setStatus('🔴 Live sync unavailable — Firebase failed to load.', 'err');
    if (window.renderResultsTable) window.renderResultsTable();
    return;
  }
  if (!code || code.length !== 6) {
    setStatus('⚪ Enter a class code above to start live sync.', '');
    if (window.renderResultsTable) window.renderResultsTable();
    return;
  }

  setStatus('🟡 Connecting to live results...', '');
  const q = query(collection(db, 'results'), where('code', '==', code));
  unsubscribe = onSnapshot(q, snap => {
    window.__liveResults = snap.docs.map(d => d.data());
    const n = window.__liveResults.filter(r => !r || r.kind !== 'ta-reset').length;
    setStatus('🟢 Live — ' + n + ' result' + (n === 1 ? '' : 's') + ' synced automatically for code ' + code, 'ok');
    if (window.renderResultsTable) window.renderResultsTable();
  }, err => {
    console.error('Firestore live sync error:', err);
    setStatus('🔴 Live sync error — check your Firestore security rules (see console for details).', 'err');
  });
};

// Kick off live sync for whatever code is already showing (active code or
// whatever the teacher last typed into the "Class code to view" box).
const startingCode = (document.getElementById('res-code-input') || {}).value || '';
window.startLiveSync(startingCode.trim());

// ---- Points board live sync ----
let pointsUnsubscribe = null;
window.__pointsLedger = [];
window.startPointsSync = function (boardCode) {
  if (pointsUnsubscribe) { pointsUnsubscribe(); pointsUnsubscribe = null; }
  window.__pointsLedger = [];
  if (!db || !boardCode) { if (window.renderPointsBoard) window.renderPointsBoard(); return; }
  const pq = query(collection(db, 'results'), where('code', '==', boardCode));
  pointsUnsubscribe = onSnapshot(pq, snap => {
    window.__pointsLedger = snap.docs.map(d => window.taParsePointsDoc(d.data())).filter(Boolean);
    if (window.renderPointsBoard) window.renderPointsBoard();
    if (window.renderDashboard) window.renderDashboard();
  }, err => { console.error('Points live sync error:', err); });
};
if (window.getPointsBoardCode) window.startPointsSync(window.getPointsBoardCode());

// ---- Plain (non-points) completions live sync ----
// Types like English Content and Bidirectional Language never award points, so
// their completions never show up in the points ledger above \u2014 which
// meant Statistics always showed 0 for them no matter how many students
// finished them. This queries the results collection directly, keyed by
// every exercise code this teacher has ever created (batched, since
// Firestore's "in" operator caps out at 30 values per query), and counts
// completions for exactly the types that don't participate in points, so
// nothing here double-counts what the points ledger already covers.
let plainUnsubscribers = [];
window.__plainCompletions = [];
window.startPlainCompletionsSync = function () {
  plainUnsubscribers.forEach(u => { try { u(); } catch (e) { /* ignore */ } });
  plainUnsubscribers = [];
  window.__plainCompletions = [];
  if (!db || !window.getRecentExercises) return;
  const NO_POINTS_TYPES = ['English Content', 'Bidirectional Language'];
  const codes = (window.getRecentExercises() || [])
    .filter(e => NO_POINTS_TYPES.indexOf(e.typeLabel) !== -1)
    .map(e => e.code)
    .filter(Boolean);
  const uniqueCodes = [...new Set(codes)];
  const chunks = [];
  for (let i = 0; i < uniqueCodes.length; i += 30) chunks.push(uniqueCodes.slice(i, i + 30));

  let resultsByChunk = {};
  chunks.forEach((chunk, ci) => {
    const q = query(collection(db, 'results'), where('code', 'in', chunk));
    const unsub = onSnapshot(q, snap => {
      resultsByChunk[ci] = snap.docs.map(d => d.data()).filter(v => v && typeof v.type === 'string' && v.type.indexOf('POINTS:') !== 0);
      window.__plainCompletions = Object.values(resultsByChunk).flat();
      if (window.renderDashboard) window.renderDashboard();
    }, err => { console.error('Plain completions sync error:', err); });
    plainUnsubscribers.push(unsub);
  });
};
window.startPlainCompletionsSync();

// Lets the teacher's own page write points directly (manual +/- adjustments,
// and "disable points" markers) using the same schema-safe document shape
// the exercise files use.
window.taAwardPoints = async function (payload) {
  if (!db) return 'failed';
  try { await addDoc(collection(db, 'results'), payload); return 'ok'; }
  catch (e) { console.error('Points write failed:', e); return 'failed'; }
};

window.taDisableExercisePoints = async function (boardCode, exerciseCode) {
  if (!db) return 'failed';
  try {
    await addDoc(collection(db, 'results'), {
      v: 1, code: boardCode, builtAt: '', type: 'POINTS:DISABLE',
      title: 'x\u241F' + exerciseCode, name: '', score: 0, warnings: 0,
      timeSeconds: 0, timeDisplay: '00:00', date: new Date().toISOString()
    });
    return 'ok';
  } catch (e) { console.error('Disable points failed:', e); return 'failed'; }
};

// Watches every student's progress through one Homework/Class set,
// live \u2014 used by the teacher-facing results drill-down. The results
// collection is append-only (matching the rest of this app's Firestore
// rules), so each completed round is its own small record; this
// aggregates all of them, per student, into the completedFlags/lastActive
// shape the results list actually renders.
let hwcResultsUnsub = null;
window.taListenHwcProgress = function (code) {
  if (hwcResultsUnsub) { hwcResultsUnsub(); hwcResultsUnsub = null; }
  window.__hwcProgressDocs = [];
  if (!db || !code) { if (window.renderHwcResultsList) window.renderHwcResultsList(); return; }
  const q = query(collection(db, 'results'), where('code', '==', code));
  hwcResultsUnsub = onSnapshot(q, snap => {
    const records = snap.docs.map(d => d.data()).filter(v => v && v.type === 'HWC_PROGRESS');
    const byStudent = {};
    records.forEach(r => {
      const key = r.studentId;
      if (!byStudent[key]) {
        byStudent[key] = {
          studentId: r.studentId, studentName: r.name, totalCount: r.totalCount,
          completedFlags: new Array(r.totalCount).fill(false),
          roundLabels: new Array(r.totalCount).fill(''),
          roundCodes: new Array(r.totalCount).fill(''),
          roundTimeSeconds: new Array(r.totalCount).fill(0),
          lastActive: r.date
        };
      }
      const entry = byStudent[key];
      if (typeof r.roundIndex === 'number' && r.roundIndex < entry.totalCount) {
        entry.completedFlags[r.roundIndex] = true;
        entry.roundLabels[r.roundIndex] = r.roundLabel;
        entry.roundCodes[r.roundIndex] = r.roundCode;
        entry.roundTimeSeconds[r.roundIndex] = typeof r.timeSeconds === 'number' ? r.timeSeconds : 0;
      }
      if (!entry.lastActive || new Date(r.date) > new Date(entry.lastActive)) entry.lastActive = r.date;
    });
    window.__hwcProgressDocs = Object.values(byStudent).map(e => ({
      studentId: e.studentId, studentName: e.studentName,
      totalCount: e.totalCount, completedCount: e.completedFlags.filter(Boolean).length,
      completedFlags: e.completedFlags, roundLabels: e.roundLabels, roundCodes: e.roundCodes,
      totalTimeSeconds: e.roundTimeSeconds.reduce((a, b) => a + b, 0),
      lastActive: e.lastActive
    }));
    if (window.renderHwcResultsList) window.renderHwcResultsList();
  });
};

// Looks up one student's result for a single exercise inside a merged
// set, by that exercise's own code \u2014 used by the eye-icon drill-down.
window.taFindResultByCodeAndName = async function (code, studentName) {
  if (!db || !code) return null;
  try {
    const q = query(collection(db, 'results'), where('code', '==', code));
    const snap = await getDocs(q);
    const matches = snap.docs.map(d => d.data()).filter(v => v && v.name === studentName);
    if (!matches.length) return null;
    matches.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return matches[0];
  } catch (e) { console.error('Result lookup failed:', e); return null; }
};

// Permanently deletes every live (Firebase) result for a class code, so
// the teacher can reuse that same code for a fresh run of an exercise.
window.deleteAllPointsForBoard = async function (boardCode) {
  if (!db || !boardCode) return { ok: false, count: 0 };
  try {
    const SEP = '\u241F';
    const q = query(collection(db, 'results'), where('code', '==', boardCode));
    const snap = await getDocs(q);
    // We never update or delete existing point records — the security rules
    // only allow creating new documents, and deleting/editing would also
    // erase "this student completed this exercise" history (which the
    // Dashboard's completion counts depend on). Instead, for every student
    // with a positive total we add ONE new negative entry that brings their
    // total to exactly 0, while every original entry (and its exercise
    // name) stays visible exactly as it was when they tap their name.
    const totals = {}; // studentId -> { total, name }
    snap.docs.forEach(d => {
      const v = d.data() || {};
      if (typeof v.type !== 'string' || v.type.indexOf('POINTS:') !== 0 || v.type === 'POINTS:DISABLE') return;
      if (typeof v.title !== 'string') return;
      const parts = v.title.split(SEP);
      if (parts.length < 3) return;
      const studentId = parts[2];
      if (!studentId) return;
      if (!totals[studentId]) totals[studentId] = { total: 0, name: v.name || studentId };
      totals[studentId].total += (v.score || 0);
      if (v.name) totals[studentId].name = v.name;
    });

    const teacherName = (window.getTeacherName ? window.getTeacherName() : '') || 'Teacher';
    const toReset = Object.keys(totals).filter(id => totals[id].total > 0);
    await Promise.all(toReset.map(studentId => {
      const info = totals[studentId];
      return addDoc(collection(db, 'results'), {
        v: 1, code: boardCode, builtAt: '', type: 'POINTS:Removed',
        title: 'By teacher' + SEP + '__RESET__' + SEP + studentId,
        name: info.name, score: -info.total, warnings: 0,
        timeSeconds: 0, timeDisplay: '00:00', date: new Date().toISOString()
      });
    }));

    if (window.renderPointsBoard) window.renderPointsBoard();
    if (window.renderDashboard) window.renderDashboard();
    return { ok: true, count: toReset.length };
  } catch (e) {
    console.error('Failed resetting points for board', boardCode, e);
    return { ok: false, count: 0 };
  }
};

// True deletion — unlike deleteAllPointsForBoard above (which preserves
// completion history), this genuinely removes every points record for the
// board, so completion counts and the Dashboard both go back to 0 too.
window.deleteAllPointsEntirelyForBoard = async function (boardCode) {
  if (!db || !boardCode) return { ok: false, count: 0 };
  try {
    const q = query(collection(db, 'results'), where('code', '==', boardCode));
    const snap = await getDocs(q);
    const pointsDocs = snap.docs.filter(d => {
      const v = d.data() || {};
      return typeof v.type === 'string' && v.type.indexOf('POINTS:') === 0;
    });
    await Promise.all(pointsDocs.map(d => deleteDoc(doc(db, 'results', d.id))));
    if (window.renderPointsBoard) window.renderPointsBoard();
    if (window.renderDashboard) window.renderDashboard();
    return { ok: true, count: pointsDocs.length };
  } catch (e) {
    console.error('Failed deleting points entirely for board', boardCode, e);
    return { ok: false, count: 0 };
  }
};

window.deleteLiveResultsForCode = async function (code, resetAt) {
  if (!db || !code) return { ok: false, count: 0 };
  try {
    const q = query(collection(db, 'results'), where('code', '==', code));
    const snap = await getDocs(q);
    const realCount = snap.docs.filter(d => (d.data() || {}).kind !== 'ta-reset').length;
    await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'results', d.id))));
    // Leave a single marker behind that says "everything built before this
    // moment is expired", so old copies of the file can never pollute the
    // results again — on this computer or any other.
    await addDoc(collection(db, 'results'), {
      v: 1, kind: 'ta-reset', code: code, resetAt: resetAt || new Date().toISOString()
    });
    snap.docs.length = 0;
    // Refresh the live listener's local copy immediately so the table
    // updates even before Firestore's own change notification arrives.
    window.__liveResults = [];
    if (window.renderResultsTable) window.renderResultsTable();
    return { ok: true, count: realCount };
  } catch (e) {
    console.error('Failed deleting live results for code', code, e);
    return { ok: false, count: 0 };
  }
};
