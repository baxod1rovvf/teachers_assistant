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
    // only this teacher's sync records; changes still on their way to the server are skipped
    listen: (code, type, onData, onErr) => onSnapshot(query(collection(db, 'results'), where('code', '==', code), where('type', '==', type)),
      snap => { if (!snap.metadata.hasPendingWrites) onData(snap.docs.map(d => Object.assign({ __id: d.id }, d.data()))); }, e => { taReportDbError(e); if (onErr) onErr(e); }),
    put: (id, data) => setDoc(doc(db, 'results', id), data).catch(e => { taReportDbError(e); throw e; }),
    remove: id => deleteDoc(doc(db, 'results', id))
  };
}

/* ---- Exercise links (play.html?x=<uid>) ----
   Every exercise is also kept online for 7 days, so students can open it from
   a link: iPhones can't open an exercise file at all, and a phone only lets a
   page use the microphone when it comes from a web address. An exercise is
   stored as one or more records ("play-<uid>", "play-<uid>-1"…, 300 000
   characters each — a record may hold 1 MB). CLAUDE.md explains the limits. */
const PLAY_CHUNK = 300000;
const PLAY_DAYS = 7;
window.taPublishPlay = async function (uid, html, oldParts) {
  if (!db || !uid || !html) return null;
  const n = Math.max(1, Math.ceil(html.length / PLAY_CHUNK));
  if (n > 40) return null; // over 12 MB: too big to put online
  const date = new Date().toISOString();
  const id = i => i ? 'play-' + uid + '-' + i : 'play-' + uid;
  try {
    // the security rules allow creating and deleting records, not changing them:
    // a link put online again (renewed, or a new version) first removes its old records
    for (let i = 0; i < Math.max(n, oldParts || 0); i++) await deleteDoc(doc(db, 'results', id(i))).catch(() => {});
    for (let i = 0; i < n; i++) {
      const part = html.slice(i * PLAY_CHUNK, (i + 1) * PLAY_CHUNK);
      await setDoc(doc(db, 'results', id(i)), {
        v: 1, code: 'TAUSER', builtAt: '', type: 'TA_SYNC:PLAY', title: [uid, i, n].join('␟'), name: '', data: part,
        score: part.length, warnings: 0, timeSeconds: 0, timeDisplay: '00:00', date: date
      });
    }
    return { parts: n, bytes: html.length, date: date };
  } catch (e) { taReportDbError(e); console.error('Putting the exercise online failed:', e); return null; }
};
window.taUnpublishPlay = async function (uid, parts) {
  if (!db || !uid) return;
  for (let i = 0; i < Math.max(1, parts || 1); i++) {
    await deleteDoc(doc(db, 'results', i ? 'play-' + uid + '-' + i : 'play-' + uid)).catch(() => {});
  }
};
// Deletes every exercise link older than 7 days (any teacher's), and tells how
// much the ones still online take. Only the records' names, dates and sizes are
// read (not the exercises), so this stays light.
window.taSweepPlayLinks = async function () {
  const url = 'https://firestore.googleapis.com/v1/projects/' + firebaseConfig.projectId + '/databases/(default)/documents:runQuery?key=' + firebaseConfig.apiKey;
  const body = { structuredQuery: { from: [{ collectionId: 'results' }],
    select: { fields: [{ fieldPath: 'title' }, { fieldPath: 'date' }, { fieldPath: 'score' }] },
    where: { fieldFilter: { field: { fieldPath: 'type' }, op: 'EQUAL', value: { stringValue: 'TA_SYNC:PLAY' } } } } };
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) { if (r.status === 429) taReportDbError({ code: 'resource-exhausted' }); throw new Error('sweep ' + r.status); }
  const rows = await r.json();
  const cutoff = Date.now() - PLAY_DAYS * 86400000;
  let liveBytes = 0, liveLinks = 0, deleted = 0;
  for (const row of rows) {
    const d = row.document;
    if (!d) continue;
    const id = d.name.split('/').pop();
    const f = d.fields || {};
    const when = Date.parse((f.date && f.date.stringValue) || '') || 0;
    if (when < cutoff) { await deleteDoc(doc(db, 'results', id)).then(() => { deleted++; }, () => {}); continue; }
    liveBytes += +((f.score && f.score.integerValue) || 0);
    if (!/-\d+$/.test(id)) liveLinks++;
  }
  return { liveBytes: liveBytes, liveLinks: liveLinks, deleted: deleted };
};

/* Firebase's free plan has daily and monthly limits; when one is reached it
   answers "resource-exhausted". The app then warns the teacher (common.js). */
function taReportDbError(e) {
  const code = e && (e.code || '');
  if (/resource-exhausted/.test(String(code)) && window.taDbLimitReached) window.taDbLimitReached();
}
window.taReportDbError = taReportDbError;

window.taFetchAccounts = async function () {
  if (!db) return null;
  try {
    // account records only (sync records share the TAUSER code but have their own type)
    const snap = await getDocs(query(collection(db, 'results'), where('code', '==', TA_ACCOUNTS_CODE), where('type', '==', 'TA_ACCOUNT')));
    return snap.docs.map(d => d.data());
  } catch (e) { taReportDbError(e); console.error('Account check failed:', e); return null; }
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
    taReportDbError(err);
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
  }, err => { taReportDbError(err); console.error('Points live sync error:', err); });
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
// They're picked out by the result's own type, so the ones inside
// Homework/Class sets count too (the set itself isn't an English Content
// exercise, so looking them up by the exercise list missed them).
// It also keeps every result of every exercise (window.__allResults, including
// the exercises inside Homework/Class sets) for Top Active Students, which
// judges students by how well they did, not how many exercises they finished.
let plainUnsubscribers = [];
window.__plainCompletions = [];
window.__allResults = [];
window.startPlainCompletionsSync = function () {
  plainUnsubscribers.forEach(u => { try { u(); } catch (e) { /* ignore */ } });
  plainUnsubscribers = [];
  window.__plainCompletions = [];
  window.__allResults = [];
  if (!db || !window.getRecentExercises) return;
  const NO_POINTS_TYPES = ['EnglishContent', 'BilingualReader']; // as a result's type names them
  const exercises = window.getRecentExercises() || [];
  const codes = [];
  exercises.forEach((e, i) => {
    if (e.mergedItems && e.mergedItems.length) {
      // a set's own code only has its progress records; its exercises report under their own codes
      e.mergedItems.forEach((r, k) => {
        let c = r && r.code;
        if (!c && window.setRoundHtml) { const h = window.setRoundHtml(e, k); c = h && (h.match(/const EXERCISE_CODE = "([^"]*)"/) || [])[1]; }
        if (c) codes.push(c);
      });
    } else if (e.code) codes.push(e.code);
  });
  // Sets made before their exercises' codes were saved in My Exercises (and whose
  // file isn't in this browser any more): the set's own progress records name
  // the code of every exercise a student finished, so those are watched too.
  const setCodes = [...new Set(exercises.filter(e => e.mergedItems && e.mergedItems.length && e.code).map(e => e.code))];

  const watched = new Set();
  let resultsByChunk = {};
  let chunkCount = 0;
  function watchCodes(list) {
    const fresh = [...new Set(list)].filter(c => c && !watched.has(c));
    fresh.forEach(c => watched.add(c));
    for (let i = 0; i < fresh.length; i += 30) {
      const ci = chunkCount++;
      const q = query(collection(db, 'results'), where('code', 'in', fresh.slice(i, i + 30)));
      const unsub = onSnapshot(q, snap => {
        const docs = snap.docs.map(d => d.data());
        watchCodes(docs.filter(v => v && v.type === 'HWC_PROGRESS' && v.roundCode).map(v => v.roundCode));
        resultsByChunk[ci] = docs.filter(v => v && typeof v.type === 'string' && v.type.indexOf('POINTS:') !== 0 && v.type !== 'HWC_PROGRESS');
        window.__allResults = Object.values(resultsByChunk).flat();
        window.__plainCompletions = window.__allResults.filter(r => NO_POINTS_TYPES.indexOf(r.type) !== -1);
        if (window.renderDashboard) window.renderDashboard();
        if (window.renderTopActiveStudents) window.renderTopActiveStudents();
        if (window.taCompletionsChanged) window.taCompletionsChanged();
      }, err => { taReportDbError(err); console.error('Plain completions sync error:', err); });
      plainUnsubscribers.push(unsub);
    }
  }
  watchCodes(codes.concat(setCodes));
};
window.startPlainCompletionsSync();

// Lets the teacher's own page write points directly (manual +/- adjustments,
// and "disable points" markers) using the same schema-safe document shape
// the exercise files use.
window.taAwardPoints = async function (payload) {
  if (!db) return 'failed';
  try { await addDoc(collection(db, 'results'), payload); return 'ok'; }
  catch (e) { taReportDbError(e); console.error('Points write failed:', e); return 'failed'; }
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
  window.__hwcProgressError = '';
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
    window.__hwcProgressError = '';
    if (window.renderHwcResultsList) window.renderHwcResultsList();
  }, err => {
    taReportDbError(err);
    console.error('Homework progress failed:', err);
    window.__hwcProgressError = (err && err.code === 'permission-denied') ? 'not allowed by the database rules' : ((err && err.code) || 'no connection');
    if (window.renderHwcResultsList) window.renderHwcResultsList();
  });
};

// Looks up one student's result for a single exercise inside a merged
// set, by that exercise's own code \u2014 used by the eye-icon drill-down.
// A round's answers: matched by the student's ID (names can differ between rounds,
// e.g. the roster name in one and the typed ID in another), then by name.
window.taFindResultByCodeAndName = async function (code, studentName, studentId) {
  if (!db || !code) return null;
  try {
    const q = query(collection(db, 'results'), where('code', '==', code));
    const snap = await getDocs(q);
    const docs = snap.docs.map(d => d.data()).filter(v => v && typeof v.type === 'string' && v.type.indexOf('POINTS:') !== 0);
    const norm = x => String(x || '').trim().toLowerCase();
    let matches = studentId ? docs.filter(v => norm(v.studentId) === norm(studentId)) : [];
    if (!matches.length) matches = docs.filter(v => norm(v.name) === norm(studentName));
    if (!matches.length && studentId) matches = docs.filter(v => norm(v.name) === norm(studentId));
    if (!matches.length) return null;
    matches.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return matches[0];
  } catch (e) { taReportDbError(e); console.error('Result lookup failed:', e); return null; }
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
