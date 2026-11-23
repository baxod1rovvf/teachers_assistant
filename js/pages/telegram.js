/* ================= TELEGRAM BOT (teacher, 2026-11-23: "connect telegram bot with loom … warn students who don't finish
   exercise yet and results too") =================
   Each group can have the class bot post into its Telegram chat every day (the teacher chose: into the group chat, automatically
   every day): the new results since the last post, and who hasn't finished the Course parts sent in the last 7 days.
   The bot lives in the Cloudflare helper (tools/ai-worker.js — runTelegram, tgUpdate, tgJob). Loom keeps, per group,
   ta_telegram[groupId] = { code, remindHour, resultsHour, days, on, sig, shares } (synced, in the backup) and puts the group's plan online as `tg-<hash>`
   (window.taPublishTgPlan in firebase.js) whenever it changes (sig = the plan as published). The connect code never goes online:
   only sha256("loom-tg|<code>") does, so nobody can connect another chat to the class.
   The box sits on a group's Course page (skTgBoxHtml, called from skGroupPageHtml in course.js). */
const LS_TELEGRAM = 'ta_telegram';
const TG_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
// two posts a day (teacher, 2026-11-23: "a list of students who don't finish exercise at 17:00 and results at 19:00"); an entry from
// before had one `hour` — it stays the results hour
const tgRemindHour = e => Number.isInteger(e.remindHour) ? e.remindHour : 17;
const tgResultsHour = e => Number.isInteger(e.resultsHour) ? e.resultsHour : (Number.isInteger(e.hour) ? e.hour : 19);
const TG_PLAN_DAYS = 21;   // parts sent in the last 21 days go into the plan; the bot itself reminds about the last 7
// the weekdays (JS: 0 = Sunday), shown Monday first; an entry without `days` posts every day (2026-11-23: "make be able to choose days")
const TG_DAYS = [[1, 'Mo'], [2, 'Tu'], [3, 'We'], [4, 'Th'], [5, 'Fr'], [6, 'Sa'], [0, 'Su']];
const tgDaysOf = e => (e && Array.isArray(e.days)) ? e.days : [0, 1, 2, 3, 4, 5, 6];

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
  // each step's results page (the same link as "🔗 Share results link"), with the step's newest sentAt
  const base = window.skAppUrl || (/^https:/.test(TA_APP_URL) ? TA_APP_URL : '');
  const steps = new Map();
  parts.forEach(p => { const no = Math.floor(p.n / 10), x = steps.get(no); if (!x || p.sentAt > x.sentAt) steps.set(no, { no, sentAt: p.sentAt }); });
  const results = base && typeof skShareToken === 'function' ? [...steps.values()].map(x => {
    const st = skSteps().find(y => y.no === x.no);
    return st ? { label: 'Step ' + x.no, step: st.id, url: base + 'results-link.html?r=' + skShareToken(g, st.id), sentAt: x.sentAt } : null;
  }).filter(Boolean) : [];
  return { v: 1, group: g.name, remindHour: tgRemindHour(e), resultsHour: tgResultsHour(e), days: tgDaysOf(e).slice().sort(), on: e.on !== false,
    parts: parts.map(p => ({ label: p.label, codes: p.codes, sentAt: p.sentAt })),
    links: results.map(l => ({ label: l.label, url: l.url, sentAt: l.sentAt })),
    extras: tgExtrasOf(e).map(x => ({ id: x.id, kind: x.kind, text: x.text || '', label: x.label || '', url: x.url || '', days: (x.days || []).slice().sort(), hour: x.hour })),
    _steps: results.map(l => l.step) };
}
/* every group with Telegram on gets its plan online again when it changed (after sync has brought the data; 2 s debounce) */
let tgSyncTimer = 0, tgSyncChain = Promise.resolve();
function skTgSyncSoon() {
  clearTimeout(tgSyncTimer);
  tgSyncTimer = setTimeout(tgSyncNow, window.__tgSyncMs !== undefined ? window.__tgSyncMs : 2000);
}
// one run at a time; a caller (Send now) waits for the run under way and then its own, so the plan online is the newest
function tgSyncNow() {
  tgSyncChain = tgSyncChain.catch(() => {}).then(tgSyncOnce);
  return tgSyncChain;
}
async function tgSyncOnce() {
  if (typeof window.taPublishTgPlan !== 'function') return;
  if (window.taSync && typeof window.taSync.ready === 'function' && !window.taSync.ready()) return;
  {
    const store = tgStore();
    for (const g of getStudentGroups()) {
      const e = store[g.id];
      if (!e || !e.code) continue;
      const plan = tgPlanFor(g, e), steps = plan._steps;
      delete plan._steps;
      const sig = JSON.stringify(plan);
      if (e.sig !== sig && await window.taPublishTgPlan(await tgHash(e.code), plan)) {
        const now = tgStore();
        if (now[g.id] && now[g.id].code === e.code) { now[g.id].sig = sig; tgSave(now); }
      }
      // the results pages the message links to follow the results while Loom is open (only when a table changed: 2 writes)
      if (e.on === false || typeof window.taPublishShare !== 'function' || typeof skShareData !== 'function') continue;
      for (const step of steps) {
        const data = skShareData(step, g), shareSig = JSON.stringify(Object.assign({}, data, { sharedAt: '' }));
        const cur = tgStore()[g.id];
        if (!cur || (cur.shares || {})[step] === shareSig) continue;
        if (await window.taPublishShare(skShareToken(g, step), data)) {
          const now = tgStore();
          if (now[g.id] && now[g.id].code === e.code) { now[g.id].shares = Object.assign({}, now[g.id].shares, { [step]: shareSig }); tgSave(now); }
        }
      }
    }
  }
}
async function tgAsk(job, extra) {
  const res = await fetch(taAiUrl(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ job }, extra || {})) });
  let out = {};
  try { out = await res.json(); } catch (e) { out = {}; }
  if (!res.ok) throw new Error(out.error || ('The helper answered ' + res.status));
  return out;
}

/* ---- the box ---- */
// Folded to one line (teacher, 2026-11-23: "hide the telegram box in the course"): "📨 Telegram" + the status; a tap opens it.
// Which groups' boxes are open is kept only while the page is open (a redraw keeps it).
const tgOpenBoxes = new Set();
function tgOnToggle(groupId, open) { if (open) tgOpenBoxes.add(groupId); else tgOpenBoxes.delete(groupId); }
function skTgBoxHtml(g) {
  const e = tgEntry(g.id), open = tgOpenBoxes.has(g.id) ? ' open' : '';
  const head = (status) => '<summary class="tg-head"><b>📨 Telegram</b>' + status + '<span class="tg-chev" aria-hidden="true"></span></summary>';
  if (!e) {
    return '<details class="tg-box" data-group="' + escapeForHtml(g.id) + '"' + open + ' ontoggle="tgOnToggle(' + jsAttr(g.id) + ', this.open)">' +
      head('<span class="tg-sub">Not set up</span>') + '<div class="tg-body">' +
      '<p class="tg-sub">On the days you choose, the class bot posts who hasn\'t finished and the new results into <span translate="no">' + escapeForHtml(g.name) + '</span>\'s Telegram chat.</p>' +
      '<div class="tg-actions"><button type="button" class="mini-btn solid" onclick="tgTurnOn(' + jsAttr(g.id) + ')">Set up Telegram</button></div></div></details>';
  }
  const hours = sel => TG_HOURS.map(h => '<option value="' + h + '"' + (h === sel ? ' selected' : '') + '>' + h + ':00</option>').join('');
  return '<details class="tg-box on" data-group="' + escapeForHtml(g.id) + '"' + open + ' ontoggle="tgOnToggle(' + jsAttr(g.id) + ', this.open)">' +
    head('<span class="tg-status" id="tgStatus" aria-live="polite">Checking…</span>') + '<div class="tg-body">' +
    '<ol class="tg-steps">' +
    '<li><span>Once for all groups: connect the bot.</span> <button type="button" class="mini-btn" onclick="tgSetup()">🔌 Connect the bot</button> <span class="tg-bot" id="tgBot"></span></li>' +
    '<li><span>Add the bot to <span translate="no">' + escapeForHtml(g.name) + '</span>\'s Telegram group or channel (in a channel: as an admin that can post and delete messages) and send there:</span> ' +
      '<code class="tg-code">/connect ' + escapeForHtml(e.code) + '</code> <button type="button" class="mini-btn" onclick="tgCopyConnect(' + jsAttr(g.id) + ')">📋 Copy</button></li>' +
    '<li><span>Post on</span> <span class="tg-days" role="group" aria-label="Days">' + TG_DAYS.map(([d, n]) =>
      '<button type="button" class="tg-day' + (tgDaysOf(e).includes(d) ? ' on' : '') + '" aria-pressed="' + tgDaysOf(e).includes(d) + '" onclick="tgToggleDay(' + jsAttr(g.id) + ', ' + d + ')">' + n + '</button>').join('') + '</span> ' +
      '<label class="tg-on"><input type="checkbox"' + (e.on !== false ? ' checked' : '') + ' onchange="tgSetOn(' + jsAttr(g.id) + ', this.checked)"> On</label>' +
      '<div class="tg-times"><label>⏰ Who hasn\'t finished at <select class="tg-hour" data-kind="remind" onchange="tgSetHour(' + jsAttr(g.id) + ', \'remind\', this.value)">' + hours(tgRemindHour(e)) + '</select></label>' +
      '<label>🏆 Results at <select class="tg-hour" data-kind="results" onchange="tgSetHour(' + jsAttr(g.id) + ', \'results\', this.value)">' + hours(tgResultsHour(e)) + '</select></label></div></li>' +
    '</ol>' +
    tgExtrasHtml(g, e) +
    '<div class="tg-actions"><button type="button" class="mini-btn" onclick="tgTest(' + jsAttr(g.id) + ')">📨 Send both messages now</button>' +
    '<button type="button" class="mini-btn danger" onclick="tgTurnOff(' + jsAttr(g.id) + ')">Stop Telegram</button></div>' +
    '<p class="sk-hint tg-hint">The messages are about the step whose link you copied last (now: the newest step you sent this group) — who hasn\'t finished it, and its results with a \"Step N — results\" link. Each group gets its own message — two groups can share one chat. Everyone in the chat sees the names. Off stops your own messages too.</p>' +
    '</div></details>';
}

/* ---- the teacher's own posts (teacher, 2026-11-23: "if i want bot to send something else too add an 'add' button"; chose a repeating
   message and a course link) — entry.extras = [{ id, kind: 'text'|'link', text, step, skill, label, url, days, hour }], at most 10;
   they go online in the plan and the helper posts each on its days at its hour (a link with no days: only with 📨 Send now). ---- */
const TG_EXTRAS_MAX = 10;
const TG_SKILL_NAMES = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' };
const tgExtrasOf = e => (e && Array.isArray(e.extras) ? e.extras : []).filter(x => x && x.id);
function tgWhenText(days, hour) {
  if (!days || !days.length) return 'Only when you press Send now';
  const d = days.length === 7 ? 'Every day' : TG_DAYS.filter(([n]) => days.includes(n)).map(([, n]) => n).join(' ');
  return d + ' · ' + hour + ':00';
}
function tgExtrasHtml(g, e) {
  const list = tgExtrasOf(e);
  const rows = list.map(x => '<div class="tg-extra" data-extra="' + escapeForHtml(x.id) + '">' +
    '<span class="tg-x-ic" aria-hidden="true">' + (x.kind === 'link' ? '🔗' : '🔁') + '</span>' +
    '<div class="tg-x-main"><div class="tg-x-text">' + escapeForHtml(x.kind === 'link' ? x.label + (x.text ? ' — ' + x.text : '') : x.text) + '</div>' +
    '<div class="tg-x-when">' + escapeForHtml(tgWhenText(x.days, x.hour)) + '</div></div>' +
    '<button type="button" class="mini-btn" onclick="tgSendExtra(' + jsAttr(g.id) + ', ' + jsAttr(x.id) + ')">📨 Send now</button>' +
    '<button type="button" class="mini-btn danger" title="Delete this message" aria-label="Delete this message" onclick="tgDeleteExtra(' + jsAttr(g.id) + ', ' + jsAttr(x.id) + ')">🗑</button></div>').join('');
  return '<div class="tg-extras"><div class="tg-extras-head"><b>Your own messages</b>' +
    (list.length < TG_EXTRAS_MAX ? '<button type="button" class="mini-btn solid" onclick="tgAddExtra(' + jsAttr(g.id) + ')">➕ Add</button>' : '') + '</div>' +
    (rows || '<p class="tg-sub tg-x-none">None yet — e.g. a reminder before every lesson, or an exercise\'s link.</p>') + '</div>';
}
/* the steps with a part, and that step's parts, for the link form */
function tgStepsWithParts() {
  return skSteps().map(st => ({ st, skills: ['listening', 'reading', 'writing', 'speaking'].filter(k => st[k]) })).filter(x => x.skills.length);
}
function tgAddExtra(groupId) {
  const g = getStudentGroups().find(x => x.id === groupId), e = tgEntry(groupId);
  if (!g || !e) return;
  const steps = tgStepsWithParts();
  const days = TG_DAYS.map(([d, n]) => '<button type="button" class="tg-day" data-day="' + d + '" aria-pressed="false">' + n + '</button>').join('');
  const hours = TG_HOURS.map(h => '<option value="' + h + '"' + (h === 9 ? ' selected' : '') + '>' + h + ':00</option>').join('');
  const m = taModal('➕ A message for ' + g.name,
    '<div class="tg-add">' +
    '<div class="tg-kinds" role="radiogroup" aria-label="Kind">' +
      '<button type="button" class="tg-kind on" data-kind="text" role="radio" aria-checked="true">🔁 Repeating message</button>' +
      '<button type="button" class="tg-kind" data-kind="link" role="radio" aria-checked="false">🔗 Course link</button></div>' +
    '<div class="tg-k tg-k-text"><label class="tg-field">Message<textarea id="tgxText" class="ta-input" rows="4" maxlength="1000" placeholder="e.g. Lesson today at 15:00 — don\'t be late!"></textarea></label></div>' +
    '<div class="tg-k tg-k-link" hidden>' +
      '<div class="tg-row2"><label class="tg-field">Step<select id="tgxStep" class="ta-input">' +
        steps.map(x => '<option value="' + escapeForHtml(x.st.id) + '">Step ' + x.st.no + ' · ' + escapeForHtml(x.st.theme || '') + '</option>').join('') + '</select></label>' +
      '<label class="tg-field">Part<select id="tgxSkill" class="ta-input"></select></label></div>' +
      '<label class="tg-field">Note (optional)<textarea id="tgxNote" class="ta-input" rows="2" maxlength="300" placeholder="e.g. Do it before Friday"></textarea></label></div>' +
    '<div class="tg-field">Post on <span class="tg-days" id="tgxDays">' + days + '</span></div>' +
    '<label class="tg-field tg-inline">at <select id="tgxHour" class="ta-input tg-hour">' + hours + '</select></label>' +
    '<p class="tg-sub tg-x-tip" id="tgxTip"></p>' +
    '<div class="tg-actions"><button type="button" class="mini-btn solid" data-act="save">Save</button>' +
      '<button type="button" class="mini-btn" data-act="send">📨 Save and send now</button></div>' +
    '</div>', { wide: true });
  const root = m.body, $ = sel => root.querySelector(sel);
  let kind = 'text';
  const fillSkills = () => {
    const x = steps.find(y => y.st.id === $('#tgxStep').value);
    $('#tgxSkill').innerHTML = (x ? x.skills : []).map(k => '<option value="' + k + '">' + TG_SKILL_NAMES[k] + '</option>').join('');
  };
  const chosenDays = () => [...root.querySelectorAll('#tgxDays .tg-day.on')].map(b => Number(b.dataset.day)).sort();
  const tip = () => {
    $('#tgxTip').textContent = kind === 'link' && !chosenDays().length ? 'No day chosen: the bot posts it only when you press Send now.' : '';
  };
  const setKind = k => {
    kind = k;
    root.querySelectorAll('.tg-kind').forEach(b => { const on = b.dataset.kind === k; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); });
    $('.tg-k-text').hidden = k !== 'text';
    $('.tg-k-link').hidden = k !== 'link';
    // a repeating message starts on the group's days; a link on none (send it now)
    const want = k === 'text' ? tgDaysOf(e) : [];
    root.querySelectorAll('#tgxDays .tg-day').forEach(b => { const on = want.includes(Number(b.dataset.day)); b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    tip();
  };
  root.querySelectorAll('.tg-kind').forEach(b => { b.onclick = () => setKind(b.dataset.kind); });
  root.querySelectorAll('#tgxDays .tg-day').forEach(b => { b.onclick = () => { const on = !b.classList.contains('on'); b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); tip(); }; });
  $('#tgxStep').onchange = fillSkills;
  fillSkills();
  setKind('text');
  const save = sendNow => {
    const x = { id: tgNewId(), kind, days: chosenDays(), hour: Number($('#tgxHour').value), at: new Date().toISOString() };
    if (kind === 'text') {
      x.text = $('#tgxText').value.trim();
      if (!x.text) { showToast('Write the message first.'); $('#tgxText').focus(); return; }
      if (!x.days.length && !sendNow) { showToast('Choose at least one day — or press Save and send now.'); return; }
    } else {
      const st = skStep($('#tgxStep').value), skill = $('#tgxSkill').value;
      if (!st || !TG_SKILL_NAMES[skill]) { showToast('Choose a step and a part.'); return; }
      const url = typeof skLinkFor === 'function' ? skLinkFor(skill, st.id, g) : '';
      if (!url) { showToast('⚠️ This link couldn\'t be made.'); return; }
      // the same as 🔗 Copy link: the group's class list goes online (Speaking: marked as sent)
      if (skill === 'speaking') { if (typeof skMarkSpeakingSent === 'function') skMarkSpeakingSent(st.id, g); }
      else if (typeof skPutClassOnline === 'function') skPutClassOnline(url, g, skill, st.id);
      Object.assign(x, { step: st.id, skill, label: 'Step ' + st.no + ' · ' + TG_SKILL_NAMES[skill], url, text: $('#tgxNote').value.trim() });
    }
    const s = tgStore();
    if (!s[groupId]) return;
    s[groupId].extras = tgExtrasOf(s[groupId]).concat(x).slice(-TG_EXTRAS_MAX);
    tgSave(s);
    m.close();
    tgOpenBoxes.add(groupId);
    renderCourse();
    if (sendNow) tgSendExtra(groupId, x.id); else { skTgSyncSoon(); showToast('✅ Saved — the bot posts it ' + tgWhenText(x.days, x.hour).replace('Every day', 'every day') + '.', 'ok'); }
  };
  root.querySelector('[data-act="save"]').onclick = () => save(false);
  root.querySelector('[data-act="send"]').onclick = () => save(true);
  $('#tgxText').focus();
}
function tgNewId() {
  const a = new Uint8Array(4);
  crypto.getRandomValues(a);
  return Array.from(a).map(x => x.toString(16).padStart(2, '0')).join('');
}
function tgSendExtra(groupId, id) {
  const e = tgEntry(groupId);
  if (!e) return;
  showToast('Sending…');
  tgSyncNow().then(() => tgAsk('tg-extra', { code: e.code, id }))
    .then(() => showToast('✅ Sent — look in the class chat.', 'ok'))
    .catch(err => showToast('⚠️ ' + err.message));
}
function tgDeleteExtra(groupId, id) {
  if (!confirm('Delete this message? The bot stops posting it.')) return;
  const s = tgStore();
  if (!s[groupId]) return;
  s[groupId].extras = tgExtrasOf(s[groupId]).filter(x => x.id !== id);
  tgSave(s); skTgSyncSoon();
  renderCourse();
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
      const days = tgDaysOf(e), when = days.length === 7 ? 'every day' : days.length ? TG_DAYS.filter(([d]) => days.includes(d)).map(([, n]) => n).join(' ') : 'no days chosen';
      el2.textContent = r.connected ? '🟢 Connected to “' + (r.title || 'the chat') + '” · ' + when + ', ' + tgRemindHour(e) + ':00 and ' + tgResultsHour(e) + ':00' + (e.on === false ? ' (off)' : '') : '⚪ Not connected yet';
      el2.classList.toggle('ok', !!r.connected);
    }
  }).catch(err => { const el2 = document.getElementById('tgStatus'); if (el2) el2.textContent = '⚠️ ' + err.message; });
}
function tgTurnOn(groupId) {
  const s = tgStore();
  s[groupId] = { code: tgNewCode(), remindHour: 17, resultsHour: 19, on: true, days: [1, 2, 3, 4, 5, 6] };   // Monday–Saturday to start with
  tgSave(s);
  tgOpenBoxes.add(groupId);
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
function tgSetHour(groupId, kind, h) {
  const s = tgStore(), e = s[groupId];
  if (!e) return;
  const n = Math.max(0, Math.min(23, parseInt(h, 10)));
  if (!Number.isInteger(n)) return;
  if (kind === 'remind') e.remindHour = n; else e.resultsHour = n;
  if (!Number.isInteger(e.remindHour)) e.remindHour = tgRemindHour(e);
  if (!Number.isInteger(e.resultsHour)) e.resultsHour = tgResultsHour(e);
  delete e.hour;
  tgSave(s); skTgSyncSoon(); tgRefreshStatus(groupId);
}
function tgSetOn(groupId, on) {
  const s = tgStore();
  if (!s[groupId]) return;
  s[groupId].on = !!on;
  tgSave(s); skTgSyncSoon(); tgRefreshStatus(groupId);
}
function tgToggleDay(groupId, d) {
  const s = tgStore(), e = s[groupId];
  if (!e) return;
  const days = new Set(tgDaysOf(e));
  if (days.has(d)) days.delete(d); else days.add(d);
  e.days = [...days].sort();
  tgSave(s); skTgSyncSoon();
  renderCourse();
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
Object.assign(window, { tgOnToggle, tgAddExtra, tgSendExtra, tgDeleteExtra, tgToggleDay, tgTurnOn, tgTurnOff, tgSetHour, tgSetOn, tgCopyConnect, tgSetup, tgTest, tgHash, tgPlanFor, tgSyncNow });
