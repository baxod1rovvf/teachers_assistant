// Stand-in for the Firebase Firestore SDK, served instead of the real one in
// the tests (tests/support/app.js). Records live in memory:
//   window.__FIXTURE  — the records the "database" starts with
//   window.__reads    — how many records the app has read (like Firebase counts them)
//   window.__writes / window.__deletes — what the app wrote / deleted
//   window.__studentSubmits(data) — a student handing in a result while the app is open
//   window.__RULES    — when true, like the real rules: the teacher's own kinds of
//                       records and deleting need a database sign-in (fake-auth.js)
const DOCS = (window.__FIXTURE || []).map(d => Object.assign({}, d));
window.__fakeDocs = DOCS;
window.__reads = 0;
window.__writes = [];
window.__deletes = [];
const listeners = [];
class Ts {
  constructor(ms) { this.ms = ms; }
  toMillis() { return this.ms; }
  static fromMillis(ms) { return new Ts(ms); }
}
export const Timestamp = Ts;
export function serverTimestamp() { return { __server: true }; }
export function initializeApp() { return {}; }
export function getFirestore() { return {}; }
export function collection(db, col) { return { col: col || 'results' }; }
export function doc(db, col, id) { return { id: id, col: col || 'results' }; }
export function where(f, op, v) { return { f, op, v }; }
export function query(c, ...w) { return Object.assign(w, { col: (c && c.col) || 'results' }); }
const asQuery = t => Array.isArray(t) ? t : Object.assign([], { col: (t && t.col) || 'results' });
const colOf = d => d.__col || 'results';
const signedIn = () => { try { return !!(JSON.parse(sessionStorage.getItem('__fakeAuth')) || {}).current; } catch (e) { return false; } };
const teachersKind = d => /^TA_SYNC:/.test(d.type || '') || ['TA_ACCOUNT', 'POINTS:Bonus', 'POINTS:DISABLE', 'POINTS:Removed'].includes(d.type) || d.kind === 'ta-reset';
const refuse = () => Object.assign(new Error('Missing or insufficient permissions.'), { code: 'permission-denied' });
const ms = v => v && typeof v === 'object' && 'ms' in v ? v.ms : (typeof v === 'string' ? Date.parse(v) : v);
const match = w => d => colOf(d) === (w.col || 'results') && w.every(c =>
  c.op === 'in' ? c.v.includes(d[c.f]) :
  c.op === '>' ? (d[c.f] != null && ms(d[c.f]) > ms(c.v)) :
  d[c.f] === c.v);
const wrap = d => ({ id: d.__id, data: () => Object.assign({}, d, d.submittedAt ? { submittedAt: new Ts(ms(d.submittedAt)) } : {}) });
const snapOf = (w, changes) => {
  const docs = DOCS.filter(match(w)).map(wrap);
  return { metadata: { hasPendingWrites: false }, docs, docChanges: () => changes || docs.map(x => ({ type: 'added', doc: x })) };
};
export function onSnapshot(t, cb) {
  const w = asQuery(t);
  const l = { w, cb };
  listeners.push(l);
  setTimeout(() => { const s = snapOf(w); window.__reads += s.docs.length || 1; cb(s); }, 20);
  return () => { const i = listeners.indexOf(l); if (i !== -1) listeners.splice(i, 1); };
}
export async function getDocs(t) { const w = asQuery(t); const s = snapOf(w); window.__reads += s.docs.length || 1; return s; }
function store(d) {
  if (d.submittedAt && d.submittedAt.__server) d.submittedAt = new Date().toISOString();
  const i = DOCS.findIndex(x => x.__id === d.__id && colOf(x) === colOf(d));
  if (i !== -1) DOCS.splice(i, 1);
  DOCS.push(d);
  window.__writes.push({ id: d.__id, type: d.type, code: d.code, title: d.title, len: (d.data || '').length });
  listeners.forEach(l => { if (match(l.w)(d)) { window.__reads++; l.cb(snapOf(l.w, [{ type: 'added', doc: wrap(d) }])); } });
}
export async function addDoc(c, data) {
  if (window.__RULES && teachersKind(data) && !signedIn()) throw refuse();
  store(Object.assign({ __id: 'auto' + Math.random().toString(36).slice(2), __col: (c && c.col) || 'results' }, data));
}
export async function setDoc(ref, data) {
  if (window.__RULES && (teachersKind(data) || ref.col !== 'results') && !signedIn()) throw refuse();
  store(Object.assign({ __id: ref.id, __col: ref.col || 'results' }, data));
}
export async function deleteDoc(ref) {
  if (window.__RULES && !signedIn()) throw refuse();
  window.__deletes.push(ref.id);
  const i = DOCS.findIndex(d => d.__id === ref.id && colOf(d) === (ref.col || 'results'));
  if (i !== -1) DOCS.splice(i, 1);
}
export async function updateDoc() {}
window.__studentSubmits = data => addDoc(collection(null, 'results'), Object.assign({ submittedAt: { __server: true } }, data));
