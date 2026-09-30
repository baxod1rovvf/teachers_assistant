// Stand-in for the Firebase Firestore SDK, served instead of the real one in
// the tests (tests/support/app.js). Records live in memory:
//   window.__FIXTURE  — the records the "database" starts with
//   window.__reads    — how many records the app has read (like Firebase counts them)
//   window.__writes / window.__deletes — what the app wrote / deleted
//   window.__studentSubmits(data) — a student handing in a result while the app is open
const DOCS = (window.__FIXTURE || []).map(d => Object.assign({}, d));
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
export function collection() { return {}; }
export function doc(db, col, id) { return { id: id }; }
export function where(f, op, v) { return { f, op, v }; }
export function query(c, ...w) { return w; }
const ms = v => v && typeof v === 'object' && 'ms' in v ? v.ms : (typeof v === 'string' ? Date.parse(v) : v);
const match = w => d => w.every(c =>
  c.op === 'in' ? c.v.includes(d[c.f]) :
  c.op === '>' ? (d[c.f] != null && ms(d[c.f]) > ms(c.v)) :
  d[c.f] === c.v);
const wrap = d => ({ id: d.__id, data: () => Object.assign({}, d, d.submittedAt ? { submittedAt: new Ts(ms(d.submittedAt)) } : {}) });
const snapOf = (w, changes) => {
  const docs = DOCS.filter(match(w)).map(wrap);
  return { metadata: { hasPendingWrites: false }, docs, docChanges: () => changes || docs.map(x => ({ type: 'added', doc: x })) };
};
export function onSnapshot(w, cb) {
  const l = { w, cb };
  listeners.push(l);
  setTimeout(() => { const s = snapOf(w); window.__reads += s.docs.length || 1; cb(s); }, 20);
  return () => { const i = listeners.indexOf(l); if (i !== -1) listeners.splice(i, 1); };
}
export async function getDocs(w) { const s = snapOf(w); window.__reads += s.docs.length || 1; return s; }
function store(d) {
  if (d.submittedAt && d.submittedAt.__server) d.submittedAt = new Date().toISOString();
  const i = DOCS.findIndex(x => x.__id === d.__id);
  if (i !== -1) DOCS.splice(i, 1);
  DOCS.push(d);
  window.__writes.push({ id: d.__id, type: d.type, code: d.code, title: d.title, len: (d.data || '').length });
  listeners.forEach(l => { if (match(l.w)(d)) { window.__reads++; l.cb(snapOf(l.w, [{ type: 'added', doc: wrap(d) }])); } });
}
export async function addDoc(c, data) { store(Object.assign({ __id: 'auto' + Math.random().toString(36).slice(2) }, data)); }
export async function setDoc(ref, data) { store(Object.assign({ __id: ref.id }, data)); }
export async function deleteDoc(ref) {
  window.__deletes.push(ref.id);
  const i = DOCS.findIndex(d => d.__id === ref.id);
  if (i !== -1) DOCS.splice(i, 1);
}
export async function updateDoc() {}
window.__studentSubmits = data => addDoc(null, Object.assign({ submittedAt: { __server: true } }, data));
