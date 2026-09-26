/* ================= CLOUD SYNC — the same data on every device =================
   A teacher's students, groups, lessons, exercises, results and profile photo
   live in this browser's storage. This keeps a copy in the cloud (Firebase)
   so signing in on another device brings the same data, and a change on one
   device shows up on the others.

   Privacy: everything is compressed and encrypted (AES-GCM) with a key made
   from the teacher's own password at sign-in, before it leaves the device.
   The key is only kept in this browser's sign-in session.

   Each synced item (e.g. ta_student_groups) is stored in its own record,
   updated in place, with the time it was last changed; the newer change wins.
   Data from before sync existed has no change time; when both sides only have
   such old data, the fuller copy wins, so an empty new device never wipes
   real data. Loaded right after accounts.js on every page. */
(function () {
  var SYNC_KEYS = ['ta_student_groups', 'ta_points_roster', 'ta_weekly_schedule', 'ta_recent_exercises',
    'ta_exercise_html_cache', 'ta_results', 'ta_code_resets', 'ta_active_code', 'ta_points_code',
    'ta_teacher_name', 'ta_avatar'];
  var SYNC_SET = {};
  SYNC_KEYS.forEach(function (k) { SYNC_SET[k] = true; });
  var SEP = '␟';
  var CHUNK = 700000; // characters per cloud record (records are limited to 1 MB)

  var user = window.__TA_USER;
  if (!user || !user.login || !window.taRaw) return; // not signed in
  var login = String(user.login).toUpperCase();
  var ns = window.__TA_NS || '';
  var raw = window.taRaw;

  var META_KEY = ns + 'ta_sync_meta';   // { key: time of the last local change }
  var SEEN_KEY = ns + 'ta_sync_seen';   // { key: version id last applied or uploaded }
  function readJson(k) { try { return JSON.parse(raw.get(k) || '{}') || {}; } catch (e) { return {}; } }
  var meta = readJson(META_KEY), seen = readJson(SEEN_KEY);
  function saveMeta() { raw.set(META_KEY, JSON.stringify(meta)); }
  function saveSeen() { raw.set(SEEN_KEY, JSON.stringify(seen)); }
  function getLocal(k) { return raw.get(ns + k); }
  function setLocal(k, v) { if (v === null || v === undefined) raw.remove(ns + k); else raw.set(ns + k, v); }

  /* ---------- status line (shown in the sidebar) ---------- */
  var status = { text: '', cls: '' };
  function setStatus(text, cls) {
    status = { text: text, cls: cls || '' };
    var el = document.getElementById('taSyncStatus');
    if (el) { el.textContent = text; el.className = 'sync-status' + (cls ? ' ' + cls : ''); }
  }
  function mountStatus() {
    if (document.getElementById('taSyncStatus')) return;
    var profile = document.querySelector('.sidebar-profile');
    if (!profile) return;
    var el = document.createElement('button');
    el.type = 'button';
    el.id = 'taSyncStatus';
    el.title = 'Your data is kept in step across your devices';
    el.addEventListener('click', function () {
      if (status.cls === 'off' && typeof taLogout === 'function') taLogout(true);
      else if (status.cls === 'bad') syncNow();
    });
    profile.parentNode.insertBefore(el, profile);
    setStatus(status.text, status.cls);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountStatus); else mountStatus();

  /* ---------- key ---------- */
  var key = null;
  if (!user.sk) { setStatus('☁️ Sync is off — tap to sign in again and turn it on', 'off'); return; }
  if (!window.crypto || !crypto.subtle) { setStatus('☁️ Sync needs the https:// address of this site', 'bad'); return; }
  var keyReady = crypto.subtle.importKey('raw', b64decode(user.sk), 'AES-GCM', false, ['encrypt', 'decrypt'])
    .then(function (k) { key = k; })
    .catch(function (e) { console.error('Sync key failed:', e); setStatus('⚠️ Sync could not start — sign in again', 'off'); });

  /* ---------- encoding ---------- */
  function b64encode(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function b64decode(str) {
    var s = atob(str), out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }
  async function pack(obj) {
    var text = new TextEncoder().encode(JSON.stringify(obj));
    var body = text, flag = 0;
    if (window.CompressionStream) {
      try {
        body = new Uint8Array(await new Response(new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
        flag = 1;
      } catch (e) { body = text; flag = 0; }
    }
    var plain = new Uint8Array(body.length + 1);
    plain[0] = flag; plain.set(body, 1);
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, plain));
    return b64encode(iv) + ':' + b64encode(ct);
  }
  async function unpack(sealed) {
    var p = sealed.split(':');
    var plain = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64decode(p[0]) }, key, b64decode(p[1])));
    var body = plain.subarray(1);
    if (plain[0] === 1) body = new Uint8Array(await new Response(new Blob([body]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
    return JSON.parse(new TextDecoder().decode(body));
  }

  /* ---------- local changes: stamp them and upload shortly after ---------- */
  var ready = false;     // true once the first cloud check has been merged (or we're offline)
  var dirty = {};
  var uploadTimer = null;
  function touched(k) {
    if (!SYNC_SET[k] || !ready) return; // writes made while the page starts up aren't the teacher's edits
    meta[k] = Date.now();
    saveMeta();
    dirty[k] = true;
    clearTimeout(uploadTimer);
    uploadTimer = setTimeout(flush, 2500);
    setStatus('☁️ Saving…', 'busy');
  }
  var proto = Storage.prototype, prevSet = proto.setItem, prevRemove = proto.removeItem;
  function isLocal(store) { try { return store === window.localStorage; } catch (e) { return false; } }
  proto.setItem = function (k, v) {
    var before = isLocal(this) && SYNC_SET[k] ? this.getItem(k) : null;
    var r = prevSet.call(this, k, v);
    if (isLocal(this) && SYNC_SET[k] && before !== String(v)) touched(k);
    return r;
  };
  proto.removeItem = function (k) {
    var had = isLocal(this) && SYNC_SET[k] ? this.getItem(k) !== null : false;
    var r = prevRemove.call(this, k);
    if (had) touched(k);
    return r;
  };
  document.addEventListener('visibilitychange', function () { if (document.hidden) flush(); });
  window.addEventListener('pagehide', flush);

  /* ---------- cloud ---------- */
  var backend = null;
  function waitBackend() {
    return new Promise(function (resolve) {
      var start = Date.now();
      (function poll() {
        if (window.taSyncBackend) return resolve(window.taSyncBackend);
        if (Date.now() - start > 12000) return resolve(null);
        setTimeout(poll, 150);
      })();
    });
  }
  var cloudCount = {}; // key -> number of records it currently uses in the cloud

  var uploading = null;
  async function flush() {
    clearTimeout(uploadTimer);
    if (!backend || !key) return;
    if (uploading) { await uploading; }
    var keys = Object.keys(dirty);
    if (!keys.length) { if (ready) setStatus('☁️ Synced', 'ok'); return; }
    dirty = {};
    uploading = (async function () {
      try {
        for (var i = 0; i < keys.length; i++) await upload(keys[i]);
        setStatus('☁️ Synced', 'ok');
      } catch (e) {
        console.error('Sync upload failed:', e);
        keys.forEach(function (k) { dirty[k] = true; });
        setStatus('⚠️ Not synced — tap to retry', 'bad');
      }
    })();
    await uploading;
    uploading = null;
  }
  async function upload(k) {
    var value = getLocal(k);
    var ts = meta[k] || 0;
    var sealed = await pack({ v: value });
    var ver = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    var parts = [];
    for (var i = 0; i < sealed.length; i += CHUNK) parts.push(sealed.slice(i, i + CHUNK));
    if (!parts.length) parts.push('');
    for (var j = 0; j < parts.length; j++) {
      await backend.put(docId(k, j), {
        v: 1, code: 'TASYNC:' + login, builtAt: '', type: 'TA_SYNC',
        title: [k, ver, j, parts.length, ts, value === null ? 'x' : ''].join(SEP),
        name: '', data: parts[j], score: 0, warnings: 0, timeSeconds: 0, timeDisplay: '00:00',
        date: new Date().toISOString()
      });
    }
    for (var n = parts.length; n < (cloudCount[k] || 0); n++) { try { await backend.remove(docId(k, n)); } catch (e) { /* leftover part, ignored by readers */ } }
    cloudCount[k] = parts.length;
    seen[k] = ver;
    saveSeen();
  }
  function docId(k, i) { return ('tasync_' + login + '_' + k + '_' + i).replace(/[^A-Za-z0-9_.-]/g, '-'); }

  // Picks, per item, the newest version whose parts are all present.
  function readCloud(docs) {
    var byKey = {};
    docs.forEach(function (d) {
      if (!d || d.type !== 'TA_SYNC' || typeof d.title !== 'string') return;
      var p = d.title.split(SEP);
      var k = p[0], ver = p[1], idx = +p[2], n = +p[3], ts = +p[4] || 0;
      if (!SYNC_SET[k]) return;
      var versions = byKey[k] || (byKey[k] = {});
      var v = versions[ver] || (versions[ver] = { ver: ver, n: n, ts: ts, parts: [] });
      v.parts[idx] = typeof d.data === 'string' ? d.data : '';
    });
    var out = {};
    Object.keys(byKey).forEach(function (k) {
      var best = null, count = 0;
      Object.keys(byKey[k]).forEach(function (ver) {
        var v = byKey[k][ver];
        count = Math.max(count, v.parts.length);
        var complete = v.parts.length === v.n && v.parts.every(function (x) { return typeof x === 'string'; });
        if (complete && (!best || v.ts > best.ts)) best = v;
      });
      cloudCount[k] = count;
      if (best) out[k] = best;
    });
    return out;
  }

  // Returns true if anything on this device changed.
  async function merge(docs, first) {
    await keyReady;
    if (!key) return false;
    var cloud = readCloud(docs);
    var changed = false;
    for (var i = 0; i < SYNC_KEYS.length; i++) {
      var k = SYNC_KEYS[i], c = cloud[k];
      var local = getLocal(k), localTs = meta[k] || 0;
      if (!c) { if (local !== null && (first || localTs)) dirty[k] = true; continue; }
      if (c.ver === seen[k]) { if (localTs > c.ts) dirty[k] = true; continue; } // nothing new from the cloud
      var value;
      try { value = (await unpack(c.parts.join(''))).v; }
      catch (e) { if (local !== null) dirty[k] = true; continue; } // made with an older password: replace it with this device's copy
      seen[k] = c.ver;
      if (value === local) { if (c.ts > localTs) meta[k] = c.ts; continue; }
      var takeCloud = c.ts > localTs ||
        (c.ts === localTs && (local === null || (value !== null && String(value).length > String(local).length)));
      if (takeCloud) { setLocal(k, value); meta[k] = c.ts; changed = true; }
      else dirty[k] = true;
    }
    saveSeen(); saveMeta();
    return changed;
  }

  function refreshScreen() {
    try {
      if (typeof applyAvatar === 'function') applyAvatar();
      var nameEl = document.getElementById('sidebarProfileName');
      if (nameEl && typeof getTeacherName === 'function') nameEl.textContent = getTeacherName();
      if (typeof switchTo === 'function' && typeof currentActiveTab !== 'undefined') switchTo(currentActiveTab);
      if (window.renderRecentExercises) window.renderRecentExercises();
    } catch (e) { console.error(e); }
  }

  async function start() {
    setStatus('☁️ Syncing…', 'busy');
    backend = await waitBackend();
    if (!backend) { ready = true; setStatus('☁️ Offline — will sync when connected', 'bad'); return; }
    var first = true;
    backend.listen('TASYNC:' + login, async function (docs) {
      var wasFirst = first; first = false;
      var changed = await merge(docs, wasFirst);
      if (wasFirst) {
        ready = true;
        await flush();
        var guard = Number(raw.sessionGet('ta_sync_reloaded_at')) || 0;
        if (changed && Date.now() - guard > 30000) {
          // this device just received data: reload once so every part of the page shows it
          raw.sessionSet('ta_sync_reloaded_at', String(Date.now()));
          location.reload();
          return;
        }
        if (changed) refreshScreen();
      } else if (changed) {
        refreshScreen();
        if (typeof showToast === 'function') showToast('☁️ Updated from your other device', 'ok');
      }
      if (Object.keys(dirty).length) flush(); else setStatus('☁️ Synced', 'ok');
    }, function (err) {
      console.error('Sync listen failed:', err);
      ready = true;
      setStatus('⚠️ Not synced — tap to retry', 'bad');
    });
  }
  function syncNow() { SYNC_KEYS.forEach(function (k) { if (getLocal(k) !== null) dirty[k] = true; }); flush(); }

  window.taSync = { flush: flush, now: syncNow, status: function () { return status; } };
  keyReady.then(start);
})();
