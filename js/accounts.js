/* ================= ACCOUNTS — keeps each teacher's data separate =================
   Every teacher signs in with their own login. Everything this app keeps in
   the browser (students, groups, exercises, results, points code, settings…)
   is stored under that teacher's own name, so two teachers never see or
   overwrite each other's data. TOXIRJON (the administrator) keeps the
   original, un-prefixed data exactly as it was before accounts existed.
   Accounts are created in the separate Control Panel file. */
function taSha256(input) {
  function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
  var mp = Math.pow, maxWord = mp(2, 32), result = '', words = [], i, j;
  var hash = [], k = [], primeCounter = 0, isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mp(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mp(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  hash = hash.slice(0, 8);
  var ascii = unescape(encodeURIComponent(String(input)));
  var bitLen = ascii.length * 8;
  ascii += '\x80';
  while (ascii.length % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) { j = ascii.charCodeAt(i); words[i >> 2] |= j << ((3 - i) % 4) * 8; }
  words[words.length] = ((bitLen / maxWord) | 0);
  words[words.length] = (bitLen);
  for (j = 0; j < words.length;) {
    var w = words.slice(j, j += 16), oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      var w15 = w[i - 15], w2 = w[i - 2], a = hash[0], e = hash[4];
      var t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & hash[5]) ^ ((~e) & hash[6])) + k[i] +
        (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
      var t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(t1 + t2) | 0].concat(hash);
      hash[4] = (hash[4] + t1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { var b = (hash[i] >> (j * 8)) & 255; result += ((b < 16) ? 0 : '') + b.toString(16); }
  return result;
}
function taHashPassword(login, password) {
  return taSha256('TA-ACCT-v1|' + String(login).trim().toUpperCase() + '|' + String(password));
}

var TA_ADMIN_LOGIN = 'TOXIRJON';
var TA_ADMIN_HASH = '417c7342809abaa8e5858c58274e5fe464a9cdee7198772a775e24872b9d610c';
var TA_ACCOUNTS_CODE = 'TAUSER';
var TA_SESSION_KEY = 'ta_session_v1';
var TA_REMEMBER_KEY = 'ta_remember_v1';
var TA_LOCKED_NS = 'ta_locked::';
(function () {
  var proto = Storage.prototype;
  var rawGet = proto.getItem, rawSet = proto.setItem, rawRemove = proto.removeItem;
  function readJson(store, key) { try { return JSON.parse(rawGet.call(store, key) || 'null'); } catch (e) { return null; } }
  var session = null;
  try { session = readJson(window.sessionStorage, TA_SESSION_KEY) || readJson(window.localStorage, TA_REMEMBER_KEY); } catch (e) { session = null; }
  if (!session || !session.login) session = null;
  var ns;
  if (!session) ns = TA_LOCKED_NS;
  else if (String(session.login).toUpperCase() === TA_ADMIN_LOGIN) ns = '';
  else ns = 'ta_u_' + String(session.login).toLowerCase() + '::';
  window.__TA_USER = session;
  window.__TA_NS = ns;
  function isLocal(store) { try { return store === window.localStorage; } catch (e) { return false; } }
  proto.getItem = function (k) { return rawGet.call(this, (ns && isLocal(this)) ? ns + k : k); };
  proto.setItem = function (k, v) { return rawSet.call(this, (ns && isLocal(this)) ? ns + k : k, v); };
  proto.removeItem = function (k) { return rawRemove.call(this, (ns && isLocal(this)) ? ns + k : k); };
  window.taRaw = {
    get: function (k) { try { return rawGet.call(window.localStorage, k); } catch (e) { return null; } },
    set: function (k, v) { try { rawSet.call(window.localStorage, k, v); } catch (e) { /* ignore */ } },
    remove: function (k) { try { rawRemove.call(window.localStorage, k); } catch (e) { /* ignore */ } },
    sessionGet: function (k) { try { return rawGet.call(window.sessionStorage, k); } catch (e) { return null; } },
    sessionSet: function (k, v) { try { rawSet.call(window.sessionStorage, k, v); } catch (e) { /* ignore */ } },
    sessionRemove: function (k) { try { rawRemove.call(window.sessionStorage, k); } catch (e) { /* ignore */ } }
  };
})();

/* Account records live in the shared "results" collection (the only one this
   app writes to), as append-only records: the newest record for a login wins. */
function taParseAccounts(docs) {
  var latest = {};
  (docs || []).forEach(function (v) {
    if (!v || v.type !== 'TA_ACCOUNT' || typeof v.title !== 'string') return;
    var parts = v.title.split('\u241F');
    var login = String(parts[0] || '').trim().toUpperCase();
    if (!login || login === TA_ADMIN_LOGIN) return; // the administrator can't be overridden from outside
    var rec = { login: login, hash: parts[1] || '', status: parts[2] || 'active', name: parts[3] || v.name || login, date: v.date || '' };
    if (!latest[login] || String(rec.date) >= String(latest[login].date)) latest[login] = rec;
  });
  return latest;
}
function taWaitFor(fnName, ms) {
  return new Promise(function (resolve) {
    var start = Date.now();
    (function poll() {
      if (typeof window[fnName] === 'function') return resolve(window[fnName]);
      if (Date.now() - start > ms) return resolve(null);
      setTimeout(poll, 150);
    })();
  });
}
async function taLoadAccounts() {
  var fetcher = await taWaitFor('taFetchAccounts', 9000);
  if (!fetcher) return null;
  var docs = await fetcher();
  if (!docs) return null;
  var map = taParseAccounts(docs);
  var cache = {};
  Object.keys(map).forEach(function (k) { cache[k] = { hash: map[k].hash, status: map[k].status, name: map[k].name }; });
  window.taRaw.set('ta_accounts_cache', JSON.stringify(cache));
  return map;
}
async function taVerifyAccount(login, password) {
  login = String(login || '').trim().toUpperCase();
  var hash = taHashPassword(login, password);
  if (login === TA_ADMIN_LOGIN) {
    return hash === TA_ADMIN_HASH ? { ok: true, login: login, name: 'Toxirjon', hash: hash } : { ok: false, msg: 'Login or password is incorrect.' };
  }
  var map = await taLoadAccounts();
  var offline = false;
  if (!map) {
    offline = true;
    try { map = JSON.parse(window.taRaw.get('ta_accounts_cache') || 'null'); } catch (e) { map = null; }
    if (!map) return { ok: false, msg: 'Can\'t reach the server to check your account. Check your internet connection and try again.' };
  }
  var rec = map[login];
  if (!rec || rec.status === 'deleted' || rec.hash !== hash) {
    return { ok: false, msg: offline ? 'Login or password is incorrect (checked offline — connect to the internet if your account is new).' : 'Login or password is incorrect.' };
  }
  if (rec.status === 'disabled') return { ok: false, msg: 'This account is turned off. Ask the administrator to turn it on.' };
  return { ok: true, login: login, name: rec.name || login, hash: hash };
}
function taLogout(skipConfirm) {
  if (!skipConfirm && !confirm('Log out of Teacher\'s Assistant?')) return;
  window.taRaw.sessionRemove(TA_SESSION_KEY);
  window.taRaw.remove(TA_REMEMBER_KEY);
  location.reload();
}
function taCurrentLogin() { return window.__TA_USER ? String(window.__TA_USER.login).toUpperCase() : ''; }
function taDefaultTeacherName() {
  var u = window.__TA_USER;
  if (!u) return 'Teacher';
  if (u.name) return u.name;
  var l = String(u.login || 'Teacher');
  return l.charAt(0).toUpperCase() + l.slice(1).toLowerCase();
}
