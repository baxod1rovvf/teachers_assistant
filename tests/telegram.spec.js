// The Telegram bot (teacher, 2026-11-23): every day at the chosen hour the Cloudflare helper (tools/ai-worker.js) posts into a
// group's Telegram chat the new results and who hasn't finished the parts sent in the last 7 days. Loom's side: the "📨 Telegram"
// box on a group's Course page (js/pages/telegram.js) and the plan it puts online (`tg-<hash>`).
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { prepare, hideNotices } = require('./support/app');

const realImport = new Function('u', 'return import(u)');
let loaded = null;
const load = () => loaded || (loaded = realImport('data:text/javascript;base64,' + Buffer.from(fs.readFileSync(path.join(__dirname, '..', 'tools', 'ai-worker.js'), 'utf8')).toString('base64')));
function fakeKv() {
  const m = new Map();
  return { m, async get(k, t) { const v = m.get(k); return v == null ? null : t === 'json' ? JSON.parse(v) : v; },
    async put(k, v) { m.set(k, v); }, async delete(k) { m.delete(k); }, async list() { return { keys: [] }; } };
}
const fsVal = v => typeof v === 'string' ? { stringValue: v } : typeof v === 'number' ? { integerValue: String(v) } : { nullValue: null };
const fsDocJson = (id, o) => ({ name: 'projects/x/databases/(default)/documents/results/' + id, fields: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, fsVal(v)])) });
// the stand-in internet: Firestore REST (docs by id, runQuery by code IN / type / title) and Telegram (every call kept)
let realFetch, sent;
function stubNet(docs) {
  sent = [];
  realFetch = global.fetch;
  global.fetch = async (url, opts) => {
    url = String(url);
    const json = (b, s) => new Response(JSON.stringify(b), { status: s || 200, headers: { 'Content-Type': 'application/json' } });
    if (url.startsWith('https://api.telegram.org/')) {
      const method = url.split('/').pop(); const body = JSON.parse(opts.body || '{}');
      sent.push({ method, body });
      if (method === 'getMe') return json({ ok: true, result: { username: 'loom_class_bot' } });
      return json({ ok: true, result: {} });
    }
    if (url.includes(':runQuery')) {
      const f = JSON.parse(opts.body).structuredQuery.where.fieldFilter;
      const field = f.field.fieldPath, vals = f.op === 'IN' ? f.value.arrayValue.values.map(v => v.stringValue) : [f.value.stringValue];
      return json(Object.entries(docs).filter(([, d]) => vals.includes(d[field])).map(([id, d]) => ({ document: fsDocJson(id, d) })));
    }
    const id = decodeURIComponent(url.split('/results/')[1].split('?')[0]);
    return docs[id] ? json(fsDocJson(id, docs[id])) : json({}, 404);
  };
}
test.afterEach(() => { if (realFetch) { global.fetch = realFetch; realFetch = null; } });

test('the helper scrambles IDs and works out bands exactly like the app (js/skill-bands.js)', async () => {
  const w = await load();
  const ctx = { window: {}, crypto: globalThis.crypto, TextEncoder, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', 'skill-bands.js'), 'utf8'), ctx);
  for (const id of ['10001', ' ID 0042 ', 'АВ-12', 'a.b_c', '№7']) {
    expect(w.tgIdKey(id)).toBe(ctx.taIdKey(id));
    expect(await w.tgClassHash('RDG123', id)).toBe(await ctx.skClassHash('RDG123', id));
  }
  for (const [c, t] of [[0, 10], [5, 10], [8, 12], [16, 20], [20, 20]]) expect(w.tgBand(c, t)).toBe(ctx.skBand(c, t));
});

test('the posts are about the step the group is on (its link copied last): who hasn\'t finished it, and its results with a "Step 5 — results" link', async () => {
  const w = await load();
  const h = (code, id) => w.tgClassHash(code, id);
  const now = Date.parse('2026-11-23T14:00:00Z');
  const list = async code => JSON.stringify([{ h: await h(code, '10001'), n: 'Alice Test' }, { h: await h(code, '9'), n: 'Alice Test' },
    { h: await h(code, '10002'), n: 'Bobur Test' }, { h: await h(code, '10003'), n: 'Cora Test' }]);
  const docs = {
    'class-LSN555': { type: 'TA_SYNC:CLASS', data: await list('LSN555') },
    'class-RDG555': { type: 'TA_SYNC:CLASS', data: await list('RDG555') },
    'class-WRT555': { type: 'TA_SYNC:CLASS', data: await list('WRT555') },
    'class-RDG444': { type: 'TA_SYNC:CLASS', data: await list('RDG444') },
    r1: { code: 'LSN555', type: 'Listening course', studentId: '9', name: 'alice', correct: 16, total: 20, submittedAt: '2026-11-23T10:00:00Z' },
    r2: { code: 'RDG555', type: 'Reading course', studentId: '10002', name: 'Bobur Test', correct: 8, total: 10, submittedAt: '2026-11-21T10:00:00Z' },
    r3: { code: 'WRT555', type: 'Writing course', studentId: '10001', name: 'Alice Test', text: 'I wake up.', words: 90, minWords: 80, submittedAt: '2026-11-23T11:00:00Z' },
    r4: { code: 'RDG444', type: 'Reading course', studentId: '10003', name: 'Cora Test', correct: 9, total: 10, submittedAt: '2026-11-23T09:00:00Z' }
  };
  stubNet(docs);
  const env = { LOOM_KV: fakeKv() };
  await env.LOOM_KV.put('f:r3', JSON.stringify({ scores: { grammar: 2.5, vocabulary: 2, structure: 1.5, task: 1.5 } }));
  const s5 = '2026-11-20T09:00:00Z', s4 = '2026-11-15T09:00:00Z';
  const url5 = 'https://baxod1rovvf.github.io/teachers_assistant/results-link.html?r=0123456789abcdef';
  const plan = { group: 'Target', parts: [
    { label: 'Step 4 · Reading', codes: ['RDG444'], sentAt: s4 },
    { label: 'Step 5 · Listening', codes: ['LSN555'], sentAt: s5 }, { label: 'Step 5 · Reading', codes: ['RDG555'], sentAt: s5 },
    { label: 'Step 5 · Writing', codes: ['WRT555'], sentAt: '2026-11-20T09:05:00Z' } ],
    links: [{ label: 'Step 5', url: url5, sentAt: s5 }, { label: 'Step 4', url: url5.replace('0123', '4444'), sentAt: s4 }] };
  expect(w.tgCurrentStep(plan, now)).toMatchObject({ no: 5, label: 'Step 5' });
  // 17:00: only Step 5 — Cora did Step 4, but not Step 5; Alice (two IDs) is listed once
  const remind = (await w.tgBuildMessage(env, plan, 0, now, 'remind')).text;
  expect(remind).toContain('📚 <b>Target</b> · <b>Step 5</b>');
  expect(remind).toContain('1. Cora Test — Listening, Reading, Writing');
  expect(remind).toMatch(/\d\. Bobur Test — Listening, Writing/);
  expect(remind).toMatch(/\d\. Alice Test — Reading/);
  expect(remind.match(/Alice Test/g)).toHaveLength(1);
  expect(remind).not.toContain('Step 4');
  expect(remind).not.toContain('Results');
  // 19:00: Step 5's bands for everyone who did something, and the link as words
  const results = (await w.tgBuildMessage(env, plan, Date.parse('2026-11-22T14:00:00Z'), now, 'results')).text;
  expect(results).toContain('• Alice Test — 🎧 Listening <b>7.5</b> · ✍️ Writing <b>7.5</b>');
  expect(results).toContain('• Bobur Test — 📖 Reading <b>7.5</b>');
  expect(results).not.toContain('Cora Test');
  expect(results).toContain('👉 <a href="' + url5 + '">Step 5 — results</a>');
  expect(results).not.toContain('Not finished');
  expect(results).not.toContain('4444');
  // nothing new since the last results post → no results post
  expect(await w.tgBuildMessage(env, plan, Date.parse('2026-11-23T12:00:00Z'), now, 'results')).toEqual({ empty: true });
  // everyone done → "everyone has finished"; nothing sent in 21 days → no post
  docs['class-RDG333'] = { type: 'TA_SYNC:CLASS', data: JSON.stringify([{ h: await h('RDG333', '10003'), n: 'Cora Test' }]) };
  docs.r5 = { code: 'RDG333', type: 'Reading course', studentId: '10003', name: 'Cora Test', correct: 7, total: 10, submittedAt: '2026-11-16T09:00:00Z' };
  expect((await w.tgBuildMessage(env, { group: 'Target', parts: [{ label: 'Step 3 · Reading', codes: ['RDG333'], sentAt: s4 }], links: [] }, 0, Date.parse('2026-11-16T14:00:00Z'), 'remind')).text)
    .toContain('🎉 Everyone has finished Step 3');
  expect(await w.tgBuildMessage(env, plan, 0, Date.parse('2026-12-31T14:00:00Z'), 'remind')).toEqual({ empty: true });
});

test('the timer: who hasn\'t finished at 17:00, the results at 19:00, once a day each, on the chosen days, only into a connected chat; /connect needs Telegram\'s secret', async () => {
  const w = await load();
  const hash = await w.tgPlanHash('abcd2345');
  // 2026-11-23 is a Monday (1): it posts on Mondays and Wednesdays only
  const docs = { ['tg-' + hash]: { type: 'TA_SYNC:TG', title: hash, data: JSON.stringify({ v: 1, group: 'Target', remindHour: 17, resultsHour: 19, on: true, days: [1, 3],
    parts: [{ label: 'Step 5 · Reading', codes: ['RDG555'], sentAt: '2026-11-22T09:00:00Z' }],
    links: [{ label: 'Step 5', url: 'https://baxod1rovvf.github.io/teachers_assistant/results-link.html?r=0123456789abcdef', sentAt: '2026-11-22T09:00:00Z' }] }) },
    'class-RDG555': { type: 'TA_SYNC:CLASS', data: JSON.stringify([{ h: await w.tgClassHash('RDG555', '10003'), n: 'Cora Test' },
      { h: await w.tgClassHash('RDG555', '10001'), n: 'Alice Test' }]) },
    r1: { code: 'RDG555', type: 'Reading course', studentId: '10001', name: 'Alice Test', correct: 9, total: 10, submittedAt: '2026-11-23T08:00:00Z' } };
  stubNet(docs);
  const env = { LOOM_KV: fakeKv(), TELEGRAM_BOT_TOKEN: '123:abc' };
  const at = (hhmm) => Date.parse('2026-11-23T' + hhmm + ':00Z') - 5 * 3600000;   // Tashkent time → UTC
  // not connected yet → nothing
  expect((await w.runTelegram(env, at('17:02'))).sent).toBe(0);
  // /connect from the class chat, with and without Telegram's secret header
  const upd = (secret) => new Request('https://loom-ai.x.workers.dev/tg/update', { method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json' }, secret ? { 'X-Telegram-Bot-Api-Secret-Token': secret } : {}),
    body: JSON.stringify({ message: { text: '/connect@loom_class_bot ABCD2345', chat: { id: -1001, type: 'supergroup', title: 'Target 2026' } } }) });
  expect((await w.tgUpdate(upd(null), env)).status).toBe(403);
  expect(await env.LOOM_KV.get('tgchat:' + hash)).toBeNull();
  const secret = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('loom-tg-hook|123:abc'))))
    .map(x => x.toString(16).padStart(2, '0')).join('').slice(0, 32);
  expect((await w.tgUpdate(upd(secret), env)).status).toBe(200);
  expect(await env.LOOM_KV.get('tgchat:' + hash, 'json')).toMatchObject({ chatId: -1001, title: 'Target 2026' });
  sent.length = 0;
  const posts = () => sent.filter(x => x.method === 'sendMessage');
  // 16:00, or 17:20 (after the first quarter) → nothing; 17:03 → the "not finished" list only; 17:08 → no second one
  expect((await w.runTelegram(env, at('16:02'))).sent).toBe(0);
  expect((await w.runTelegram(env, at('17:20'))).sent).toBe(0);
  expect((await w.runTelegram(env, at('17:03'))).sent).toBe(1);
  expect((await w.runTelegram(env, at('17:08'))).sent).toBe(0);
  expect(posts()).toHaveLength(1);
  expect(posts()[0].body.chat_id).toBe(-1001);
  expect(posts()[0].body.text).toContain('<b>Target</b> · <b>Step 5</b>');
  expect(posts()[0].body.text).toContain('⏰ <b>Not finished yet</b>\n1. Cora Test — Reading');
  expect(posts()[0].body.text).not.toContain('Results');
  expect(posts()[0].body.text).not.toContain('results-link');
  // 19:03 → the results: Alice's band and the step's results link, no "not finished" list
  expect((await w.runTelegram(env, at('19:03'))).sent).toBe(1);
  expect((await w.runTelegram(env, at('19:09'))).sent).toBe(0);
  expect(posts()).toHaveLength(2);
  expect(posts()[1].body.text).toContain('• Alice Test — 📖 Reading <b>8</b>');
  expect(posts()[1].body.text).toContain('<a href="https://baxod1rovvf.github.io/teachers_assistant/results-link.html?r=0123456789abcdef">Step 5 — results</a>');
  expect(posts()[1].body.text).not.toContain('Not finished');
  // Wednesday 19:03: no new results since Monday's post → no results post; the 17:00 list is still sent
  expect((await w.runTelegram(env, at('19:03') + 2 * 86400000)).sent).toBe(0);
  expect((await w.runTelegram(env, at('17:03') + 2 * 86400000)).sent).toBe(1);
  // Tuesday isn't a chosen day
  expect((await w.runTelegram(env, at('17:03') + 86400000)).sent).toBe(0);
  // switched off in Loom → nothing the next Monday
  docs['tg-' + hash].data = JSON.stringify(Object.assign(JSON.parse(docs['tg-' + hash].data), { on: false }));
  expect((await w.runTelegram(env, at('17:03') + 7 * 86400000)).sent).toBe(0);
});

test('a plan put online before the two posts (one `hour`) sends both at that hour', async () => {
  const w = await load();
  const hash = await w.tgPlanHash('OLDPLAN1');
  stubNet({ ['tg-' + hash]: { type: 'TA_SYNC:TG', title: hash, data: JSON.stringify({ v: 1, group: 'Target', hour: 18, on: true,
    parts: [{ label: 'Step 5 · Reading', codes: ['RDG555'], sentAt: '2026-11-22T09:00:00Z' }] }) },
    'class-RDG555': { type: 'TA_SYNC:CLASS', data: JSON.stringify([{ h: 'x', n: 'Cora Test' }]) },
    r1: { code: 'RDG555', type: 'Reading course', studentId: '10009', name: 'Bob', correct: 5, total: 10, submittedAt: '2026-11-23T08:00:00Z' } });
  const env = { LOOM_KV: fakeKv(), TELEGRAM_BOT_TOKEN: '123:abc' };
  await env.LOOM_KV.put('tgchat:' + hash, JSON.stringify({ chatId: -9 }));
  expect((await w.runTelegram(env, Date.parse('2026-11-23T18:01:00Z') - 5 * 3600000)).sent).toBe(2);
});

test('a channel (2026-11-23): /connect from a channel post works, the post is deleted, another chat can\'t take the code; setup asks for channel posts', async () => {
  const w = await load();
  stubNet({});
  const env = { LOOM_KV: fakeKv(), TELEGRAM_BOT_TOKEN: '123:abc' };
  const secret = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('loom-tg-hook|123:abc'))))
    .map(x => x.toString(16).padStart(2, '0')).join('').slice(0, 32);
  const post = (update) => w.tgUpdate(new Request('https://loom-ai.x.workers.dev/tg/update', { method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Telegram-Bot-Api-Secret-Token': secret }, body: JSON.stringify(update) }), env);
  await post({ channel_post: { message_id: 55, text: '/connect QWER7788', chat: { id: -100777, type: 'channel', title: 'Apex news' } } });
  const hash = await w.tgPlanHash('QWER7788');
  expect(await env.LOOM_KV.get('tgchat:' + hash, 'json')).toMatchObject({ chatId: -100777, title: 'Apex news' });
  expect(sent.find(x => x.method === 'deleteMessage').body).toEqual({ chat_id: -100777, message_id: 55 });
  // somebody who saw the code tries it in their own chat → refused, the class stays connected to the channel
  sent.length = 0;
  await post({ message: { message_id: 9, text: '/connect QWER7788', chat: { id: -555, type: 'group', title: 'Not the class' } } });
  expect(await env.LOOM_KV.get('tgchat:' + hash, 'json')).toMatchObject({ chatId: -100777 });
  expect(sent.find(x => x.method === 'sendMessage').body.text).toContain('already used by another chat');
  // 🔌 Connect the bot asks Telegram for channel posts too
  sent.length = 0;
  const res = await w.default.fetch(new Request('https://loom-ai.x.workers.dev/', { method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://baxod1rovvf.github.io' }, body: JSON.stringify({ job: 'tg-setup' }) }), env);
  expect(res.status).toBe(200);
  expect(sent.find(x => x.method === 'setWebhook').body.allowed_updates).toEqual(['message', 'channel_post']);
});

test('teacher: Set up Telegram makes a connect code and puts the group\'s plan online — the code itself never goes online', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const now = Date.now(), iso = d => new Date(now - d * 86400000).toISOString();
  const links = { 'g1|reading|b5': { code: 'RDG555', sentAt: iso(2) }, 'g1|listening|b5': { code: 'LSN555', sentAt: iso(3) },
    'g1|writing|b1': { code: 'WRT111', sentAt: iso(40) }, 'g2|reading|b5': { code: 'RDG556', sentAt: iso(1) } };
  await prepare(context, { storage: { ta_skills_links: JSON.stringify(links), ta_course_group: 'g1' } });
  await context.addInitScript(() => { window.__tgSyncMs = 0; window.skAppUrl = 'https://baxod1rovvf.github.io/teachers_assistant/'; localStorage.setItem('ta_ai_url', 'https://loom-ai.test/'); });
  const asked = [];
  await context.route('https://loom-ai.test/**', async route => {
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' } });
    const b = JSON.parse(route.request().postData() || '{}'); asked.push(b);
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(b.job === 'tg-status' ? { connected: false, bot: 'loom_class_bot' } : { ok: true, bot: 'loom_class_bot' }) });
  });
  await page.goto('/course.html');
  await hideNotices(page);
  await page.locator('.sk-gcard[data-group="g1"] .sk-gcard-open').click();
  const box = page.locator('.tg-box');
  await box.getByRole('button', { name: 'Set up Telegram' }).click();
  await expect(box.locator('.tg-code')).toHaveText(/^\/connect [A-Z2-9]{8}$/);
  await expect(box.locator('#tgStatus')).toHaveText('⚪ Not connected yet');
  await expect(box.locator('#tgBot')).toHaveText('@loom_class_bot');
  const code = (await box.locator('.tg-code').textContent()).split(' ')[1];
  const hash = await page.evaluate(c => tgHash(c), code);
  const plan = () => page.evaluate(h => { const d = window.__fakeDocs.find(x => x.__id === 'tg-' + h); return d ? { title: d.title, type: d.type, data: JSON.parse(d.data) } : null; }, hash);
  await expect.poll(plan).not.toBeNull();
  const p = await plan();
  expect(p.type).toBe('TA_SYNC:TG');
  expect(p.data).toMatchObject({ group: 'Target', remindHour: 17, resultsHour: 19, on: true, days: [1, 2, 3, 4, 5, 6] });   // Mon–Sat, 17:00 and 19:00 to start with
  // only this group's parts sent in the last 21 days, in step order
  expect(p.data.parts.map(x => [x.label, x.codes])).toEqual([['Step 5 · Listening', ['LSN555']], ['Step 5 · Reading', ['RDG555']]]);
  // Step 5's results link, and its results page put online for it (the same token as "🔗 Share results link")
  expect(p.data.links).toHaveLength(1);
  expect(p.data.links[0]).toMatchObject({ label: 'Step 5' });
  const token = p.data.links[0].url.split('?r=')[1];
  expect(p.data.links[0].url).toBe('https://baxod1rovvf.github.io/teachers_assistant/results-link.html?r=' + token);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skills_shares'))['g1|b5'])).toBe(token);
  await expect.poll(() => page.evaluate(t => !!window.__fakeDocs.find(x => x.__id === 'share-' + t), token)).toBe(true);
  expect(JSON.stringify(await page.evaluate(() => window.__fakeDocs))).not.toContain(code);
  // days: Saturday off, Sunday on
  await box.getByRole('button', { name: 'Sa', exact: true }).click();
  await page.locator('.tg-box').getByRole('button', { name: 'Su', exact: true }).click();
  await expect.poll(async () => (await plan()).data.days).toEqual([0, 1, 2, 3, 4, 5]);
  await expect(page.locator('.tg-box .tg-day.on')).toHaveText(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Su']);
  // a new hour and Off → the plan goes online again
  await box.locator('.tg-hour[data-kind="remind"]').selectOption('16');
  await expect.poll(async () => (await plan()).data.remindHour).toBe(16);
  await page.locator('.tg-box .tg-hour[data-kind="results"]').selectOption('20');
  await expect.poll(async () => (await plan()).data.resultsHour).toBe(20);
  await box.getByLabel('On').uncheck();
  await expect.poll(async () => (await plan()).data.on).toBe(false);
  // Copy puts the /connect line on the clipboard; Connect the bot asks the helper to set itself up
  await box.getByRole('button', { name: '📋 Copy' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('/connect ' + code);
  await box.getByRole('button', { name: /Connect the bot/ }).click();
  await expect.poll(() => asked.some(b => b.job === 'tg-setup')).toBe(true);
  // the code is kept (synced) for the group
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_telegram')).g1)).toMatchObject({ code, remindHour: 16, resultsHour: 20, on: false, days: [0, 1, 2, 3, 4, 5] });
});
