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

test('the day\'s message: new results with bands, and who still has to finish (old IDs counted once)', async () => {
  const w = await load();
  const h = (code, id) => w.tgClassHash(code, id);
  const now = Date.parse('2026-11-23T14:00:00Z');
  const list = async code => JSON.stringify([{ h: await h(code, '10001'), n: 'Alice Test' }, { h: await h(code, '9'), n: 'Alice Test' },
    { h: await h(code, '10002'), n: 'Bobur Test' }, { h: await h(code, '10003'), n: 'Cora Test' }]);
  const docs = {
    'class-LSN555': { type: 'TA_SYNC:CLASS', data: await list('LSN555') },
    'class-RDG555': { type: 'TA_SYNC:CLASS', data: await list('RDG555') },
    'class-WRT555': { type: 'TA_SYNC:CLASS', data: await list('WRT555') },
    r1: { code: 'LSN555', type: 'Listening course', studentId: '9', name: 'alice', correct: 16, total: 20, submittedAt: '2026-11-23T10:00:00Z' },
    r2: { code: 'RDG555', type: 'Reading course', studentId: '10002', name: 'Bobur Test', correct: 8, total: 10, submittedAt: '2026-11-21T10:00:00Z' },
    r3: { code: 'WRT555', type: 'Writing course', studentId: '10001', name: 'Alice Test', text: 'I wake up.', words: 90, minWords: 80, submittedAt: '2026-11-23T11:00:00Z' }
  };
  stubNet(docs);
  const env = { LOOM_KV: fakeKv() };
  await env.LOOM_KV.put('f:r3', JSON.stringify({ scores: { grammar: 2.5, vocabulary: 2, structure: 1.5, task: 1.5 } }));
  const sentAt = '2026-11-20T09:00:00Z';
  const plan = { group: 'Target', parts: [
    { label: 'Step 5 · Listening', codes: ['LSN555'], sentAt }, { label: 'Step 5 · Reading', codes: ['RDG555'], sentAt },
    { label: 'Step 5 · Writing', codes: ['WRT555'], sentAt }, { label: 'Step 1 · Reading', codes: ['RDG111'], sentAt: '2026-10-01T09:00:00Z' } ] };
  const m = await w.tgBuildMessage(env, plan, Date.parse('2026-11-22T14:00:00Z'), now);
  expect(m.text).toContain('<b>Target</b>');
  // new since yesterday: Alice's Listening (under her old ID, shown with her listed name) and her writing (the AI's band); Bobur's
  // Reading is older than the last post
  expect(m.text).toContain('Alice Test — Step 5 · Listening: <b>7.5</b>');
  expect(m.text).toContain('Alice Test — Step 5 · Writing: <b>7.5</b>');
  expect(m.text).not.toContain('Bobur Test — Step 5 · Reading:');
  // not finished: most missing first; a part sent long ago isn't reminded about; Alice is listed once despite two IDs
  expect(m.text).toContain('1. Cora Test — Step 5 · Listening, Step 5 · Reading, Step 5 · Writing');
  expect(m.text).toMatch(/\d\. Bobur Test — Step 5 · Listening, Step 5 · Writing/);
  expect(m.text).toMatch(/\d\. Alice Test — Step 5 · Reading/);
  expect(m.text.match(/Alice Test — Step 5 · Reading/g)).toHaveLength(1);
  expect(m.text).not.toContain('Step 1 · Reading');
  // nothing sent in the last 7 days → no message
  expect(await w.tgBuildMessage(env, { group: 'Target', parts: [plan.parts[3]] }, 0, now)).toEqual({ empty: true });
});

test('the timer posts once a day at the group\'s hour, only into a connected chat; /connect needs Telegram\'s secret', async () => {
  const w = await load();
  const hash = await w.tgPlanHash('abcd2345');
  const docs = { ['tg-' + hash]: { type: 'TA_SYNC:TG', title: hash, data: JSON.stringify({ v: 1, group: 'Target', hour: 19, on: true,
    parts: [{ label: 'Step 5 · Reading', codes: ['RDG555'], sentAt: '2026-11-22T09:00:00Z' }] }) },
    'class-RDG555': { type: 'TA_SYNC:CLASS', data: JSON.stringify([{ h: await w.tgClassHash('RDG555', '10003'), n: 'Cora Test' }]) } };
  stubNet(docs);
  const env = { LOOM_KV: fakeKv(), TELEGRAM_BOT_TOKEN: '123:abc' };
  const at = (hhmm) => Date.parse('2026-11-23T' + hhmm + ':00Z') - 5 * 3600000;   // Tashkent time → UTC
  // not connected yet → nothing
  expect((await w.runTelegram(env, at('19:02'))).sent).toBe(0);
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
  // another hour, or after the first quarter of the hour → nothing; 19:03 → one post; 19:08 the same day → no second post
  expect((await w.runTelegram(env, at('18:02'))).sent).toBe(0);
  expect((await w.runTelegram(env, at('19:20'))).sent).toBe(0);
  expect((await w.runTelegram(env, at('19:03'))).sent).toBe(1);
  expect((await w.runTelegram(env, at('19:08'))).sent).toBe(0);
  const posts = sent.filter(s => s.method === 'sendMessage');
  expect(posts).toHaveLength(1);
  expect(posts[0].body.chat_id).toBe(-1001);
  expect(posts[0].body.text).toContain('1. Cora Test — Step 5 · Reading');
  // switched off in Loom → nothing the next day
  docs['tg-' + hash].data = JSON.stringify(Object.assign(JSON.parse(docs['tg-' + hash].data), { on: false }));
  expect((await w.runTelegram(env, at('19:03') + 86400000)).sent).toBe(0);
});

test('teacher: Set up Telegram makes a connect code and puts the group\'s plan online — the code itself never goes online', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const now = Date.now(), iso = d => new Date(now - d * 86400000).toISOString();
  const links = { 'g1|reading|b5': { code: 'RDG555', sentAt: iso(2) }, 'g1|listening|b5': { code: 'LSN555', sentAt: iso(3) },
    'g1|writing|b1': { code: 'WRT111', sentAt: iso(40) }, 'g2|reading|b5': { code: 'RDG556', sentAt: iso(1) } };
  await prepare(context, { storage: { ta_skills_links: JSON.stringify(links), ta_course_group: 'g1' } });
  await context.addInitScript(() => { window.__tgSyncMs = 0; localStorage.setItem('ta_ai_url', 'https://loom-ai.test/'); });
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
  expect(p.data).toMatchObject({ group: 'Target', hour: 19, on: true });
  // only this group's parts sent in the last 21 days, in step order
  expect(p.data.parts.map(x => [x.label, x.codes])).toEqual([['Step 5 · Listening', ['LSN555']], ['Step 5 · Reading', ['RDG555']]]);
  expect(JSON.stringify(await page.evaluate(() => window.__fakeDocs))).not.toContain(code);
  // a new hour and Off → the plan goes online again
  await box.locator('.tg-hour').selectOption('17');
  await expect.poll(async () => (await plan()).data.hour).toBe(17);
  await box.getByLabel('On').uncheck();
  await expect.poll(async () => (await plan()).data.on).toBe(false);
  // Copy puts the /connect line on the clipboard; Connect the bot asks the helper to set itself up
  await box.getByRole('button', { name: '📋 Copy' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('/connect ' + code);
  await box.getByRole('button', { name: /Connect the bot/ }).click();
  await expect.poll(() => asked.some(b => b.job === 'tg-setup')).toBe(true);
  // the code is kept (synced) for the group
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_telegram')).g1)).toMatchObject({ code, hour: 17, on: false });
});
