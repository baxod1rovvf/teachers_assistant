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
  // 19:00: Step 5's top 3 (here only 2 did something), short "L - 7.5", and the link as words
  const results = (await w.tgBuildMessage(env, plan, Date.parse('2026-11-22T14:00:00Z'), now, 'results')).text;
  expect(results).toContain('🏆 <b>Results</b>\n• Alice Test — 🎧 L - 7.5 · ✍️ W - 7.5\n• Bobur Test — 📖 R - 7.5\n');
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
  expect(posts()[1].body.text).toContain('• Alice Test — 📖 R - 8');
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

test('results: only the top 3 (2026-11-24), ranked like Overall — a sent part not done counts 0, a writing waiting (⏳) is left out', async () => {
  const w = await load();
  const now = Date.parse('2026-11-23T14:00:00Z'), at = '2026-11-23T10:00:00Z';
  const kids = [['1', 'Ann'], ['2', 'Ben'], ['3', 'Cat'], ['4', 'Dan'], ['5', 'Eve']];
  const docs = {};
  for (const code of ['LSN777', 'RDG777', 'WRT777']) docs['class-' + code] = { type: 'TA_SYNC:CLASS', data: JSON.stringify(await Promise.all(kids.map(async ([id, n]) => ({ h: await w.tgClassHash(code, id), n })))) };
  const L = (id, c) => ({ code: 'LSN777', type: 'Listening course', studentId: id, correct: c, total: 10, submittedAt: at });
  const R = (id, c) => ({ code: 'RDG777', type: 'Reading course', studentId: id, correct: c, total: 10, submittedAt: at });
  // Dan: L 9 R 9 W blank (band 1) → 6.3 · Ben: L 5.5 R 5.5 W waiting → 5.5 (⏳ left out) · Ann: L 8 R 8, no writing (0) → 5.3 · Cat: R 9 → 3 · Eve: L 3.5 → 1.2
  Object.assign(docs, { a1: L('1', 9), a2: R('1', 9), b1: L('2', 5), b2: R('2', 5), b3: { code: 'WRT777', type: 'Writing course', studentId: '2', text: 'Hi there.', words: 2, submittedAt: at },
    c1: R('3', 10), d1: L('4', 10), d2: R('4', 10), d3: { code: 'WRT777', type: 'Writing course', studentId: '4', text: '', words: 0, submittedAt: at }, e1: L('5', 3) });
  stubNet(docs);
  const plan = { group: 'Apex', parts: ['Listening', 'Reading', 'Writing'].map(k => ({ label: 'Step 8 · ' + k, codes: [k.slice(0, 3).toUpperCase().replace('LIS', 'LSN').replace('REA', 'RDG').replace('WRI', 'WRT') + '777'], sentAt: '2026-11-22T09:00:00Z' })),
    links: [{ label: 'Step 8', url: 'https://baxod1rovvf.github.io/teachers_assistant/results-link.html?r=0123456789abcdef', sentAt: '2026-11-22T09:00:00Z' }] };
  const text = (await w.tgBuildMessage({ LOOM_KV: fakeKv() }, plan, 0, now, 'results')).text;
  const rows = text.split('\n').filter(l => l.startsWith('• '));
  expect(rows.map(r => r.split(' — ')[0])).toEqual(['• Dan', '• Ben', '• Ann']);
  expect(rows[1]).toBe('• Ben — 🎧 L - 5.5 · 📖 R - 5.5 · ✍️ W - ⏳');
  expect(rows[2]).toBe('• Ann — 🎧 L - 8 · 📖 R - 8');
  expect(text).toContain('👉 <a href="https://baxod1rovvf.github.io/teachers_assistant/results-link.html?r=0123456789abcdef">Step 8 — results</a>');
  expect(text).not.toContain('Cat');
  expect(text).not.toContain('Eve');
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
  await page.goto('/ieltsjourney.html');
  await hideNotices(page);
  await page.evaluate(() => skOpenGroup('g1'));
  const box = page.locator('.tg-box');
  // folded to one line until tapped (2026-11-23: "hide the telegram box")
  await expect(box.getByRole('button', { name: 'Set up Telegram' })).toBeHidden();
  await box.locator('summary').click();
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

test('your own messages (2026-11-23 "➕ Add"): a repeating message on its days at its hour, a course link with Send now only; text from the request is never posted', async () => {
  const w = await load();
  const hash = await w.tgPlanHash('EXTRA234');
  const url = 'https://baxod1rovvf.github.io/teachers_assistant/skill.html?s=listening&st=e9&c=LSN999';
  const docs = { ['tg-' + hash]: { type: 'TA_SYNC:TG', title: hash, data: JSON.stringify({ v: 1, group: 'Target', remindHour: 17, resultsHour: 19, on: true, days: [3], parts: [], links: [],
    extras: [{ id: 'aa11bb22', kind: 'text', text: 'Lesson at 15:00 <today> & bring books', days: [1, 3], hour: 9 },
      { id: 'cc33dd44', kind: 'link', label: 'Step 9 · Listening', url, text: 'Before Friday', days: [], hour: 9 },
      { id: 'ee55ff66', kind: 'link', label: 'Evil', url: 'https://evil.example/x', days: [1], hour: 9 }] }) } };
  stubNet(docs);
  const env = { LOOM_KV: fakeKv(), TELEGRAM_BOT_TOKEN: '123:abc' };
  await env.LOOM_KV.put('tgchat:' + hash, JSON.stringify({ chatId: -5 }));
  const at = (hhmm, plus) => Date.parse('2026-11-23T' + hhmm + ':00Z') - 5 * 3600000 + (plus || 0) * 86400000;   // Monday
  const posts = () => sent.filter(x => x.method === 'sendMessage');
  // Monday 09:00 (the group's own posts aren't on Mondays): the repeating message once; the link has no days; the foreign link is dropped
  expect((await w.runTelegram(env, at('09:02'))).sent).toBe(1);
  expect((await w.runTelegram(env, at('09:07'))).sent).toBe(0);
  expect(posts()).toHaveLength(1);
  expect(posts()[0].body).toMatchObject({ chat_id: -5, parse_mode: 'HTML', text: 'Lesson at 15:00 &lt;today&gt; &amp; bring books' });
  expect((await w.runTelegram(env, at('10:02'))).sent).toBe(0);
  expect((await w.runTelegram(env, at('09:02', 1))).sent).toBe(0);   // Tuesday
  expect((await w.runTelegram(env, at('09:02', 2))).sent).toBe(1);   // Wednesday
  // Send now: the link, read from the plan online; an id that isn't there → refused
  const job = b => w.default.fetch(new Request('https://loom-ai.x.workers.dev/', { method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://baxod1rovvf.github.io' }, body: JSON.stringify(b) }), env);
  sent.length = 0;
  expect((await job({ job: 'tg-extra', code: 'EXTRA234', id: 'cc33dd44', text: 'ignored' })).status).toBe(200);
  expect(posts()[0].body.text).toBe('📚 <b>Step 9 · Listening</b>\nBefore Friday\n👉 <a href="' + url.replace(/&/g, '&amp;') + '">Open the exercise</a>');
  expect((await job({ job: 'tg-extra', code: 'EXTRA234', id: 'cc33dd44' })).status).toBe(429);   // once a minute
  expect((await job({ job: 'tg-extra', code: 'EXTRA234', id: 'ee55ff66' })).status).toBe(409);
  expect((await job({ job: 'tg-extra', code: 'EXTRA234', id: 'zz99zz99' })).status).toBe(409);
  expect(posts()).toHaveLength(1);
  // Off in Loom stops them too
  docs['tg-' + hash].data = JSON.stringify(Object.assign(JSON.parse(docs['tg-' + hash].data), { on: false }));
  expect((await w.runTelegram(env, at('09:02', 7))).sent).toBe(0);
});

test('teacher: ➕ Add puts a repeating message and a course link into the group\'s plan; Send now asks the helper; 🗑 deletes', async ({ page, context }) => {
  const now = Date.now();
  await prepare(context, { storage: { ta_course_group: 'g1',
    ta_telegram: JSON.stringify({ g1: { code: 'ABCD2345', remindHour: 17, resultsHour: 19, on: true, days: [1, 2, 3] } }) } });
  await context.addInitScript(() => { window.__tgSyncMs = 0; window.skAppUrl = 'https://baxod1rovvf.github.io/teachers_assistant/'; localStorage.setItem('ta_ai_url', 'https://loom-ai.test/'); });
  const asked = [];
  await context.route('https://loom-ai.test/**', async route => {
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' } });
    const b = JSON.parse(route.request().postData() || '{}'); asked.push(b);
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(b.job === 'tg-status' ? { connected: true, title: 'Target chat', bot: 'loom_class_bot' } : { ok: true }) });
  });
  await page.goto('/ieltsjourney.html');
  await hideNotices(page);
  await page.evaluate(() => skOpenGroup('g1'));
  const box = page.locator('.tg-box');
  // folded: only the line with the status shows
  await expect(box.locator('#tgStatus')).toHaveText(/Connected to “Target chat”/);
  await expect(box.getByRole('button', { name: '➕ Add' })).toBeHidden();
  await box.locator('summary').click();
  await expect(box.locator('.tg-x-none')).toBeVisible();
  // a repeating message: the group's days to start with, 9:00 → Monday + Friday at 8:00
  await box.getByRole('button', { name: '➕ Add' }).click();
  const dlg = page.locator('.ta-modal');
  await expect(dlg.locator('#tgxDays .tg-day.on')).toHaveText(['Mo', 'Tu', 'We']);
  await dlg.locator('#tgxText').fill('Lesson today at 15:00');
  await dlg.getByRole('button', { name: 'Tu', exact: true }).click();
  await dlg.getByRole('button', { name: 'We', exact: true }).click();
  await dlg.getByRole('button', { name: 'Fr', exact: true }).click();
  await dlg.locator('#tgxHour').selectOption('8');
  await dlg.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(dlg).toHaveCount(0);
  // the box stays open after the redraw, with the message listed
  await expect(box.locator('.tg-extra')).toHaveCount(1);
  await expect(box.locator('.tg-extra .tg-x-when')).toHaveText('Mo Fr · 8:00');
  const hash = await page.evaluate(() => tgHash('ABCD2345'));
  const plan = () => page.evaluate(h => { const d = window.__fakeDocs.find(x => x.__id === 'tg-' + h); return d ? JSON.parse(d.data) : null; }, hash);
  await expect.poll(async () => ((await plan()) || {}).extras).toEqual([expect.objectContaining({ kind: 'text', text: 'Lesson today at 15:00', days: [1, 5], hour: 8 })]);
  // a course link: Step 2 · Reading, no day → Save and send now
  await box.getByRole('button', { name: '➕ Add' }).click();
  await dlg.getByRole('radio', { name: '🔗 Course link' }).click();
  await expect(dlg.locator('#tgxDays .tg-day.on')).toHaveCount(0);
  await expect(dlg.locator('#tgxTip')).toHaveText(/only when you press Send now/);
  await dlg.locator('#tgxStep').selectOption('b2');
  await dlg.locator('#tgxSkill').selectOption('reading');
  await dlg.locator('#tgxNote').fill('Before Friday');
  await dlg.getByRole('button', { name: '📨 Save and send now' }).click();
  await expect.poll(() => asked.filter(b => b.job === 'tg-extra').length).toBe(1);
  const link = (await plan()).extras.find(x => x.kind === 'link');
  expect(link).toMatchObject({ label: 'Step 2 · Reading', text: 'Before Friday', days: [] });
  expect(link.url).toMatch(/^https:\/\/baxod1rovvf\.github\.io\/teachers_assistant\/skill\.html\?s=reading&st=b2&c=[A-Z0-9]{6}$/);
  expect(asked.find(b => b.job === 'tg-extra')).toEqual({ job: 'tg-extra', code: 'ABCD2345', id: link.id });
  // the same as Copy link: the code is kept for the group and its class list goes online
  const code = link.url.split('c=')[1];
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skills_links'))['g1|reading|b2'].code)).toBe(code);
  await expect.poll(() => page.evaluate(c => !!window.__fakeDocs.find(x => x.__id === 'class-' + c), code)).toBe(true);
  await expect(box.locator('.tg-extra')).toHaveCount(2);
  await expect(box.locator('.tg-extra').nth(1).locator('.tg-x-when')).toHaveText('Only when you press Send now');
  // 🗑 deletes it
  page.once('dialog', d => d.accept());
  await box.locator('.tg-extra').first().getByRole('button', { name: 'Delete this message' }).click();
  await expect(box.locator('.tg-extra')).toHaveCount(1);
  await expect.poll(async () => (await plan()).extras.map(x => x.kind)).toEqual(['link']);
});
