// The AI helper's waiting list (tools/ai-worker.js): runs the worker module in Node, with a stand-in KV and a stubbed Gemini.
const { test, expect } = require('@playwright/test');
const path = require('path');

const AI = { scores: { grammar: 2, vocabulary: 1.5, structure: 1, task: 2 },
  mistakes: [{ wrong: 'I goes home.', right: 'I go home.', why: 'I + go' }],
  better: [{ word: 'good', instead: 'excellent', why: 'stronger' }], tips: ['a', 'b', 'c'] };

// The worker is an ES module in a .js file (the site has no package "type"), so it is loaded as a data: module.
// A real dynamic import() is used (Playwright would turn a plain one into require).
const realImport = new Function('u', 'return import(u)');
let loaded = null;
async function load() {
  if (!loaded) {
    const src = require('fs').readFileSync(path.join(__dirname, '..', 'tools', 'ai-worker.js'), 'utf8');
    loaded = realImport('data:text/javascript;base64,' + Buffer.from(src).toString('base64'));
  }
  return loaded;
}
function fakeKv() {
  const m = new Map();
  return {
    m,
    async get(k, type) { const e = m.get(k); if (!e) return null; return type === 'json' ? JSON.parse(e.value) : e.value; },
    async put(k, v, o) { m.set(k, { value: v, metadata: (o && o.metadata) || null }); },
    async delete(k) { m.delete(k); },
    async list(o) {
      const keys = [...m.entries()].filter(([k]) => k.startsWith((o && o.prefix) || '')).map(([name, e]) => ({ name, metadata: e.metadata }));
      return { keys: keys.slice(0, (o && o.limit) || 1000), list_complete: true };
    }
  };
}
let realFetch, geminiCalls;
function stubGemini(statuses) {   // statuses: a function (callNo) → HTTP status
  geminiCalls = 0;
  globalThis.fetch = async () => {
    const status = statuses ? statuses(++geminiCalls) : 200;
    if (status !== 200) return new Response(JSON.stringify({ error: { message: 'nope' } }), { status });
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(AI) }] } }] }), { status: 200 });
  };
}
test.beforeEach(() => { realFetch = globalThis.fetch; });
test.afterEach(() => { globalThis.fetch = realFetch; });

let ipNo = 0;
async function post(worker, env, body) {
  const req = new Request('https://x.workers.dev/', { method: 'POST',
    headers: { Origin: 'https://baxod1rovvf.github.io', 'CF-Connecting-IP': 'ip' + (++ipNo), 'Content-Type': 'application/json' },
    body: JSON.stringify(body) });
  const res = await worker.default.fetch(req, env);
  return { status: res.status, body: await res.json() };
}
const writingOf = (id, text) => ({ id, text: text || 'I go to school every day with my friend.', topic: 'My day', instruction: 'Write', minWords: 5, maxWords: 50, words: ['school'] });

test('queue saves a waiting writing; a checked one answers done; bad ids, long texts and a missing KV are refused', async () => {
  const w = await load(), kv = fakeKv(), env = { LOOM_KV: kv, GEMINI_API_KEY: 'k' };
  let r = await post(w, env, Object.assign({ job: 'queue' }, writingOf('sk_ABC123_10001_1')));
  expect(r.body).toEqual({ queued: true });
  expect(kv.m.get('q:sk_ABC123_10001_1').metadata.tries).toBe(0);
  kv.m.set('f:sk_ABC123_10001_2', { value: '{}', metadata: null });
  r = await post(w, env, Object.assign({ job: 'queue' }, writingOf('sk_ABC123_10001_2')));
  expect(r.body).toEqual({ done: true });
  expect(kv.m.has('q:sk_ABC123_10001_2')).toBe(false);
  r = await post(w, env, Object.assign({ job: 'queue' }, writingOf('../x')));
  expect(r.status).toBe(400);
  r = await post(w, env, Object.assign({ job: 'queue' }, writingOf('sk_ABC123_10001_3', 'a'.repeat(6001))));
  expect(r.status).toBe(400);
  r = await post(w, { GEMINI_API_KEY: 'k' }, Object.assign({ job: 'queue' }, writingOf('sk_ABC123_10001_4')));
  expect(r.status).toBe(500);
  expect(r.body.error).toBe('The helper has no LOOM_KV storage yet');
});

test('the timer checks the 5 oldest of 7, saves feedback with words and band, removes them from the list; the next run checks the rest', async () => {
  const w = await load(), kv = fakeKv(), env = { LOOM_KV: kv, GEMINI_API_KEY: 'k' };
  stubGemini();
  for (let i = 7; i >= 1; i--) {   // saved in reverse order, so "oldest" is by `at`, not by position
    const id = 'sk_ABC123_1000' + i + '_1', q = Object.assign(writingOf(id), { at: '2026-11-12T10:0' + i + ':00.000Z', tries: 0, lastError: '' });
    kv.m.set('q:' + id, { value: JSON.stringify(q), metadata: { at: q.at, tries: 0 } });
  }
  let out = await w.runQueue(env);
  expect(out.checked).toBe(5);
  for (let i = 1; i <= 5; i++) {
    expect(kv.m.has('q:sk_ABC123_1000' + i + '_1')).toBe(false);
    const f = JSON.parse(kv.m.get('f:sk_ABC123_1000' + i + '_1').value);
    expect(f.words).toBe(9);
    expect(f.band).toBe(w.aiBand(AI.scores, 9, 5));
    expect(f.checkedAt).toBeTruthy();
  }
  expect(kv.m.has('q:sk_ABC123_10006_1') && kv.m.has('q:sk_ABC123_10007_1')).toBe(true);
  out = await w.runQueue(env);
  expect(out.checked).toBe(2);
  expect([...kv.m.keys()].filter(k => k.startsWith('q:'))).toHaveLength(0);
});

test("a failed check keeps the writing (tries + 1, the reason); Google's limit (429) stops the run", async () => {
  const w = await load(), kv = fakeKv(), env = { LOOM_KV: kv, GEMINI_API_KEY: 'k' };
  const put = (i) => { const id = 'sk_ABC123_2000' + i + '_1', q = Object.assign(writingOf(id), { at: '2026-11-12T10:0' + i + ':00.000Z', tries: 0, lastError: '' });
    kv.m.set('q:' + id, { value: JSON.stringify(q), metadata: { at: q.at, tries: 0 } }); return 'q:' + id; };
  const k1 = put(1);
  stubGemini(() => 503);
  let out = await w.runQueue(env);
  expect(out.checked).toBe(0); expect(out.failed).toBe(1);
  const kept = JSON.parse(kv.m.get(k1).value);
  expect(kept.tries).toBe(1); expect(kept.lastError).not.toBe('');
  expect(kv.m.get(k1).metadata.tries).toBe(1);
  kv.m.clear();
  const keys = [put(1), put(2), put(3)];
  stubGemini(() => 429);
  out = await w.runQueue(env);
  expect(out).toEqual({ checked: 0, failed: 1, stopped: true });
  expect(JSON.parse(kv.m.get(keys[1]).value).tries).toBe(0);
  expect(JSON.parse(kv.m.get(keys[2]).value).tries).toBe(0);
});

test('feedback tells done / waiting / unknown; check checks one at once', async () => {
  const w = await load(), kv = fakeKv(), env = { LOOM_KV: kv, GEMINI_API_KEY: 'k' };
  stubGemini();
  kv.m.set('f:sk_ABC123_30001_1', { value: JSON.stringify({ scores: AI.scores, band: 6.5, words: 9 }), metadata: null });
  kv.m.set('q:sk_ABC123_30002_1', { value: JSON.stringify({ tries: 2, lastError: 'busy' }), metadata: { tries: 2 } });
  let r = await post(w, env, { job: 'feedback', ids: ['sk_ABC123_30001_1', 'sk_ABC123_30002_1', 'sk_ABC123_30003_1'] });
  expect(r.body.states['sk_ABC123_30001_1'].state).toBe('done');
  expect(r.body.states['sk_ABC123_30001_1'].result.band).toBe(6.5);
  expect(r.body.states['sk_ABC123_30002_1']).toEqual({ state: 'waiting', tries: 2, lastError: 'busy' });
  expect(r.body.states['sk_ABC123_30003_1']).toEqual({ state: 'unknown' });
  const id = 'sk_ABC123_30004_1';
  kv.m.set('q:' + id, { value: '{}', metadata: { tries: 0 } });
  r = await post(w, env, Object.assign({ job: 'check' }, writingOf(id)));
  expect(r.body.result.band).toBeGreaterThanOrEqual(1);
  expect(kv.m.has('f:' + id)).toBe(true);
  expect(kv.m.has('q:' + id)).toBe(false);
});

test('aiBand: -0.5 only when too short, kept to 1-9', async () => {
  const w = await load();
  expect(w.aiBand({ grammar: 3, vocabulary: 2, structure: 2, task: 2 }, 90, 80)).toBe(9);
  expect(w.aiBand({ grammar: 3, vocabulary: 2, structure: 2, task: 2 }, 70, 80)).toBe(8.5);
  expect(w.aiBand({ grammar: 0, vocabulary: 0, structure: 0, task: 0 }, 10, 80)).toBe(1);
});

test('limits per visitor: the 11th check in a minute from one IP answers 429, another IP still gets through; queue 30, feedback 60', async () => {
  const w = await load(), kv = fakeKv(), env = { LOOM_KV: kv, GEMINI_API_KEY: 'k' };
  stubGemini();
  const call = async (ip, body) => { const res = await w.default.fetch(new Request('https://x.workers.dev/', { method: 'POST',
    headers: { Origin: 'https://baxod1rovvf.github.io', 'CF-Connecting-IP': ip }, body: JSON.stringify(body) }), env); return res.status; };
  const stamp = Date.now();
  for (let i = 1; i <= 10; i++) expect(await call('lim-c-' + stamp, Object.assign({ job: 'check' }, writingOf('sk_LIM_' + i)))).toBe(200);
  expect(await call('lim-c-' + stamp, Object.assign({ job: 'check' }, writingOf('sk_LIM_11')))).toBe(429);
  expect(await call('lim-c2-' + stamp, Object.assign({ job: 'check' }, writingOf('sk_LIM_12')))).toBe(200);
  for (let i = 1; i <= 30; i++) expect(await call('lim-q-' + stamp, Object.assign({ job: 'queue' }, writingOf('sk_LIMQ_' + i)))).toBe(200);
  expect(await call('lim-q-' + stamp, Object.assign({ job: 'queue' }, writingOf('sk_LIMQ_31')))).toBe(429);
  for (let i = 1; i <= 60; i++) expect(await call('lim-f-' + stamp, { job: 'feedback', ids: [] })).toBe(200);
  expect(await call('lim-f-' + stamp, { job: 'feedback', ids: [] })).toBe(429);
});

test('/status shows version, kv, waiting count and the jobs', async () => {
  const w = await load(), kv = fakeKv();
  kv.m.set('q:sk_A_1', { value: '{}', metadata: { at: 'x' } });
  kv.m.set('f:sk_B_1', { value: '{}', metadata: null });
  const res = await w.default.fetch(new Request('https://x.workers.dev/status'), { LOOM_KV: kv, GEMINI_API_KEY: 'k' });
  expect(await res.json()).toEqual({ running: true, version: '2026-11-12q', keySaved: true, kv: true, waiting: 1, jobs: ['chat', 'writing', 'queue', 'feedback', 'check'] });
});
