/* ================= TELEGRAM BOT (teacher, 2026-11-23: "connect telegram bot with loom … warn students who don't finish
   exercise yet and results too") =================
   Each group can have the class bot post into its Telegram chat every day (the teacher chose: into the group chat, automatically
   every day): the new results since the last post, and who hasn't finished the Course parts sent in the last 7 days.
   The bot lives in the Cloudflare helper (tools/ai-worker.js — runTelegram, tgUpdate, tgJob). Loom keeps, per group,
   ta_telegram[groupId] = { code, hour, on, sig } (synced, in the backup) and puts the group's plan online as `tg-<hash>`
   (window.taPublishTgPlan in firebase.js) whenever it changes (sig = the plan as published). The connect code never goes online:
   only sha256("loom-tg|<code>") does, so nobody can connect another chat to the class.
   The box sits on a group's Course page (skTgBoxHtml, called from skGroupPageHtml in course.js). */
const LS_TELEGRAM = 'ta_telegram';
const TG_HOURS = [15, 16, 17, 18, 19, 20, 21];
const TG_PLAN_DAYS = 21;   // parts sent in the last 21 days go into the plan; the bot itself reminds about the last 7

function tgStore() { try { const v = JSON.parse(localStorage.getItem(LS_TELEGRAM) || '{}'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; } }
function tgSave(v) { try { localStorage.setItem(LS_TELEGRAM, JSON.stringify(v)); } catch (e) { /* ignore */ } if (typeof taStoreChanged === 'function') taStoreChanged(LS_TELEGRAM); }
function tgEntry(groupId) { const e = tgStore()[groupId]; return e && typeof e === 'object' && e.code ? e : null; }
async function tgHash(code) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('loom-tg|' + String(code || '').trim().toUpperCase()));
  return Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, '0')).join('').slice(0, 24);
}
function tgNewCode() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', a = new Uint8Array(8);
  crypto.getRandomValues(a);
  return Array.from(a).map(x => abc[x % abc.length]).join('');
}
/* the group's plan: its Listening/Reading/Writing links sent in the last 21 days */
function tgPlanFor(g, e) {
  const links = taSkillsLinks(), now = Date.now(), parts = [];
  Object.keys(links).forEach(key => {
    const m = /^(.*)\|(listening|reading|writing)\|([^|]+)$/.exec(key), v = links[key];
    if (!m || m[1] !== g.id || !v || typeof v !== 'object' || !v.code) return;
    const st = typeof skStep === 'function' ? skStep(m[3]) : null;
    const t = Date.parse(v.sentAt || '');
    if (!st || !(t > now - TG_PLAN_DAYS * 86400000)) return;
    const skill = m[2][0].toUpperCase() + m[2].slice(1);
    parts.push({ label: 'Step ' + st.no + ' · ' + skill, codes: (typeof taSkillsEntryCodes === 'function' ? taSkillsEntryCodes(v) : [v.code]).slice(0, 5), sentAt: v.sentAt, n: st.no * 10 + ['listening', 'reading', 'writing'].indexOf(m[2]) });
  });
  parts.sort((a, b) => a.n - b.n);
  return { v: 1, group: g.name, hour: e.hour, on: e.on !== false, parts: parts.map(p => ({ label: p.label, codes: p.codes, sentAt: p.sentAt })) };
}
/* every group with Telegram on gets its plan online again when it changed (after sync has brought the data; 2 s debounce) */
let tgSyncTimer = 0, tgSyncBusy = false;
function skTgSyncSoon() {
  clearTimeout(tgSyncTimer);
  tgSyncTimer = setTimeout(tgSyncNow, window.__tgSyncMs !== undefined ? window.__tgSyncMs : 2000);
}
async function tgSyncNow() {
  if (tgSyncBusy || typeof window.taPublishTgPlan !== 'function') return;
  if (window.taSync && typeof window.taSync.ready === 'function' && !window.taSync.ready()) return;
  tgSyncBusy = true;
  try {
    const store = tgStore();
    for (const g of getStudentGroups()) {
      const e = store[g.id];
      if (!e || !e.code) continue;
      const plan = tgPlanFor(g, e), sig = JSON.stringify(plan);
      if (e.sig === sig) continue;
      if (await window.taPublishTgPlan(await tgHash(e.code), plan)) {
        const now = tgStore();
        if (now[g.id] && now[g.id].code === e.code) { now[g.id].sig = sig; tgSave(now); }
      }
    }
  } finally { tgSyncBusy = false; }
}
async function tgAsk(job, extra) {
  const res = await fetch(taAiUrl(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ job }, extra || {})) });
  let out = {};
  try { out = await res.json(); } catch (e) { out = {}; }
  if (!res.ok) throw new Error(out.error || ('The helper answered ' + res.status));
  return out;
}

/* ---- the box ---- */
function skTgBoxHtml(g) {
  const e = tgEntry(g.id);
  if (!e) {
    return '<section class="tg-box" data-group="' + escapeForHtml(g.id) + '"><div class="tg-head"><b>📨 Telegram</b>' +
      '<span class="tg-sub">Every day the class bot posts new results and who hasn\'t finished yet into <span translate="no">' + escapeForHtml(g.name) + '</span>\'s Telegram chat.</span></div>' +
      '<button type="button" class="mini-btn solid" onclick="tgTurnOn(' + jsAttr(g.id) + ')">Set up Telegram</button></section>';
  }
  const hours = TG_HOURS.map(h => '<option value="' + h + '"' + (h === e.hour ? ' selected' : '') + '>' + h + ':00</option>').join('');
  return '<section class="tg-box on" data-group="' + escapeForHtml(g.id) + '">' +
    '<div class="tg-head"><b>📨 Telegram</b><span class="tg-status" id="tgStatus" aria-live="polite">Checking…</span></div>' +
    '<ol class="tg-steps">' +
    '<li><span>Once for all groups: connect the bot.</span> <button type="button" class="mini-btn" onclick="tgSetup()">🔌 Connect the bot</button> <span class="tg-bot" id="tgBot"></span></li>' +
    '<li><span>Add the bot to <span translate="no">' + escapeForHtml(g.name) + '</span>\'s Telegram chat and send there:</span> ' +
      '<code class="tg-code">/connect ' + escapeForHtml(e.code) + '</code> <button type="button" class="mini-btn" onclick="tgCopyConnect(' + jsAttr(g.id) + ')">📋 Copy</button></li>' +
    '<li><label>Post every day at <select class="tg-hour" onchange="tgSetHour(' + jsAttr(g.id) + ', this.value)">' + hours + '</select></label> ' +
      '<label class="tg-on"><input type="checkbox"' + (e.on !== false ? ' checked' : '') + ' onchange="tgSetOn(' + jsAttr(g.id) + ', this.checked)"> On</label></li>' +
    '</ol>' +
    '<div class="tg-actions"><button type="button" class="mini-btn" onclick="tgTest(' + jsAttr(g.id) + ')">📨 Send today\'s message now</button>' +
    '<button type="button" class="mini-btn danger" onclick="tgTurnOff(' + jsAttr(g.id) + ')">Stop Telegram</button></div>' +
    '<p class="sk-hint tg-hint">It lists the Listening, Reading and Writing parts you sent this group in the last 7 days. Everyone in the chat sees the names.</p>' +
    '</section>';
}
/* the status line, asked from the helper after the page is drawn */
let tgStatusFor = '';
function tgRefreshStatus(groupId) {
  const e = tgEntry(groupId), el = document.getElementById('tgStatus');
  if (!e || !el) return;
  tgStatusFor = groupId;
  tgAsk('tg-status', { code: e.code }).then(r => {
    if (tgStatusFor !== groupId) return;
    const el2 = document.getElementById('tgStatus'), bot = document.getElementById('tgBot');
    if (bot && r.bot) bot.textContent = '@' + r.bot;
    if (el2) {
      el2.textContent = r.connected ? '🟢 Connected to “' + (r.title || 'the chat') + '” · daily at ' + e.hour + ':00' + (e.on === false ? ' (off)' : '') : '⚪ Not connected yet';
      el2.classList.toggle('ok', !!r.connected);
    }
  }).catch(err => { const el2 = document.getElementById('tgStatus'); if (el2) el2.textContent = '⚠️ ' + err.message; });
}
function tgTurnOn(groupId) {
  const s = tgStore();
  s[groupId] = { code: tgNewCode(), hour: 19, on: true };
  tgSave(s);
  skTgSyncSoon();
  renderCourse();
}
function tgTurnOff(groupId) {
  if (!confirm('Stop the Telegram messages for this group? You can set it up again later (with a new code).')) return;
  const s = tgStore(), e = s[groupId];
  if (!e) return;
  // the plan goes online once more, switched off, so the bot stops at once
  if (typeof window.taPublishTgPlan === 'function') {
    const g = getStudentGroups().find(x => x.id === groupId);
    if (g) tgHash(e.code).then(h => window.taPublishTgPlan(h, Object.assign(tgPlanFor(g, e), { on: false })));
  }
  delete s[groupId];
  tgSave(s);
  renderCourse();
}
function tgSetHour(groupId, h) {
  const s = tgStore();
  if (!s[groupId]) return;
  s[groupId].hour = Math.max(0, Math.min(23, parseInt(h, 10) || 19));
  tgSave(s); skTgSyncSoon(); tgRefreshStatus(groupId);
}
function tgSetOn(groupId, on) {
  const s = tgStore();
  if (!s[groupId]) return;
  s[groupId].on = !!on;
  tgSave(s); skTgSyncSoon(); tgRefreshStatus(groupId);
}
function tgCopyConnect(groupId) {
  const e = tgEntry(groupId);
  if (!e) return;
  const text = '/connect ' + e.code;
  const ok = () => showToast('Copied — send it in the class chat after adding the bot.', 'ok');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, () => showToast(text));
  else showToast(text);
}
function tgSetup() {
  showToast('Connecting the bot…');
  tgAsk('tg-setup').then(r => {
    showToast('✅ The bot @' + r.bot + ' is ready. Add it to your class chat.', 'ok');
    const bot = document.getElementById('tgBot');
    if (bot) bot.textContent = '@' + r.bot;
  }).catch(err => showToast('⚠️ ' + err.message));
}
function tgTest(groupId) {
  const e = tgEntry(groupId);
  if (!e) return;
  showToast('Sending…');
  tgSyncNow().then(() => tgAsk('tg-test', { code: e.code }))
    .then(() => showToast('✅ Sent — look in the class chat.', 'ok'))
    .catch(err => showToast('⚠️ ' + err.message));
}
window.skTgBoxHtml = skTgBoxHtml;
window.skTgSyncSoon = skTgSyncSoon;
window.tgRefreshStatus = tgRefreshStatus;
Object.assign(window, { tgTurnOn, tgTurnOff, tgSetHour, tgSetOn, tgCopyConnect, tgSetup, tgTest, tgHash, tgPlanFor, tgSyncNow });
