// Stand-in for the Firebase Authentication SDK (the database sign-in), served
// instead of the real one in the tests. Accounts and who is signed in are kept
// in sessionStorage ("__fakeAuth"), so they last across reloads like the real one.
const KEY = '__fakeAuth';
const load = () => { try { return JSON.parse(sessionStorage.getItem(KEY)) || { users: {}, current: null }; } catch (e) { return { users: {}, current: null }; } };
const save = st => sessionStorage.setItem(KEY, JSON.stringify(st));
const fail = code => Object.assign(new Error(code), { code });
const userOf = st => st.current && st.users[st.current] ? { uid: st.users[st.current].uid, email: st.current } : null;
export function getAuth() { return { get currentUser() { return userOf(load()); } }; }
export function onAuthStateChanged(auth, cb) { setTimeout(() => cb(auth.currentUser), 10); return () => {}; }
export async function signInWithEmailAndPassword(auth, email, password) {
  const st = load(); email = String(email).toLowerCase();
  if (!st.users[email] || st.users[email].pw !== password) throw fail('auth/invalid-credential');
  st.current = email; save(st);
}
export async function createUserWithEmailAndPassword(auth, email, password) {
  const st = load(); email = String(email).toLowerCase();
  if (st.users[email]) throw fail('auth/email-already-in-use');
  st.users[email] = { uid: 'uid-' + Math.random().toString(36).slice(2, 10), pw: password };
  st.current = email; save(st);
}
export async function signOut() { const st = load(); st.current = null; save(st); }
