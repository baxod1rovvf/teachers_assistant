// Loom keeps the AI's feedback for each writing (ta_skills_ai[<result id>]), never leaves a writing unchecked (a safety net asks
// the helper about writings it has no feedback for and puts unknown ones on its waiting list) and shows ⏳ while one waits.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const TEXT = 'I usually wake up at seven. Then I get dressed and have breakfast with my family. I go to school at eight. ' +
  'After school, I do homework and play football. In the evening, I watch TV. It is very good. I go to bed at ten.';
const RESULT = { scores: { grammar: 2.5, vocabulary: 2, structure: 1.5, task: 2 }, mistakes: [{ wrong: 'a', right: 'b', why: 'c' }], better: [], tips: ['x', 'y', 'z'], words: 90, band: 8 };
const H = { 'Access-Control-Allow-Origin': '*' };

/* the stand-in helper: `state` answers the `feedback` job per id, `bodies` keeps what was asked */
async function fakeHelper(context, state, bodies) {
  await context.addInitScript(() => { try { localStorage.setItem('ta_ai_url', 'https://loom-ai.test/'); } catch (e) { /* ignore */ } });
  await context.route('https://loom-ai.test/**', async route => {
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { ...H, 'Access-Control-Allow-Headers': '*' } });
    const b = JSON.parse(route.request().postData() || '{}');
    bodies.push(b);
    const json = o => route.fulfill({ status: 200, contentType: 'application/json', headers: H, body: JSON.stringify(o) });
    if (b.job === 'feedback') return json({ states: Object.fromEntries((b.ids || []).map(id => [id, state.feedback[id] || { state: 'unknown' }])) });
    if (b.job === 'queue') return json({ queued: true });
    if (b.job === 'check') return json({ result: Object.assign({}, RESULT, { praise: ['You used <b>all</b> the asked words.', 'Clear order.'], betterVersion: 'I usually wake up at seven o\'clock.' }) });
    return route.fulfill({ status: 400, contentType: 'application/json', headers: H, body: '{"error":"?"}' });
  });
}
const writing = (id, studentId, name, extra) => Object.assign({ __id: id, v: 1, code: 'WRT555', type: 'Writing course', skill: 'writing', step: 'b1', title: 'Step 1 · Daily Routine — Writing',
  name, studentId, text: TEXT, words: 90, minWords: 80, maxWords: 100, asked: { used: ['wake up'], missing: ['go to bed'] }, timeSeconds: 600, timeDisplay: '10:00',
  date: new Date(Date.now() - 60000).toISOString(), submittedAt: new Date(Date.now() - 60000).toISOString() }, extra || {});
const ITEM = { uid: 'skwriting', code: 'WRT555', typeLabel: 'Writing course', groupId: 'g1', skill: 'writing', title: 'Step 1 — writing', date: new Date().toISOString() };

async function openStep(page, context, docs, state, bodies, storage) {
  await prepare(context, { docs, storage: Object.assign({ ta_recent_exercises: JSON.stringify([ITEM]), ta_skills_links: JSON.stringify({ 'g1|writing|b1': { code: 'WRT555' } }), ta_course_group: 'g1' }, storage || {}) });
  await fakeHelper(context, state, bodies);
  const errors = watchErrors(page);
  await page.goto('/course.html');
  await page.waitForFunction(n => (window.__allResults || []).length >= n, docs.length, { timeout: 10000 });
  await hideNotices(page);
  await page.addStyleTag({ content: '#taNoticeStack { display: none !important; }' });
  await page.locator('.sk-gcard[data-group="g1"] .sk-gcard-open').click();
  await page.locator('.sk-node[data-step="b1"]').click();
  return errors;
}
const wcell = (page, name) => page.locator('.sk-rt-row', { hasText: name }).locator('.sk-rt-cell').nth(2);

test('Loom asks the helper about unchecked writings: checked ones get their band, unknown ones go on the waiting list', async ({ page, context }) => {
  const bodies = [], state = { feedback: { sk_WRT555_10001_1: { state: 'done', result: RESULT } } };
  const errors = await openStep(page, context, [writing('sk_WRT555_10001_1', '10001', 'Alice Test'), writing('sk_WRT555_10002_2', '10002', 'Bobur Test')], state, bodies);
  await expect.poll(() => page.evaluate(() => (JSON.parse(localStorage.getItem('ta_skills_ai') || '{}')['sk_WRT555_10001_1'] || {}).scores)).toBeTruthy();
  await expect.poll(() => bodies.find(b => b.job === 'queue' && b.id === 'sk_WRT555_10002_2')).toBeTruthy();
  expect(bodies.find(b => b.job === 'feedback').ids.sort()).toEqual(['sk_WRT555_10001_1', 'sk_WRT555_10002_2']);
  expect(bodies.find(b => b.job === 'queue')).toMatchObject({ text: TEXT, minWords: 80, maxWords: 100 });
  await expect(wcell(page, 'Alice Test')).toContainText('8');
  await expect(wcell(page, 'Bobur Test')).toContainText('⏳');
  expect(errors).toEqual([]);
});

test('an old writing keeps its old band until the AI\'s arrives', async ({ page, context }) => {
  const bodies = [], state = { feedback: { sk_WRT555_10001_1: { state: 'waiting', tries: 1, lastError: 'busy' } } };
  const errors = await openStep(page, context, [writing('sk_WRT555_10001_1', '10001', 'Alice Test', { band: 5 })], state, bodies);
  await expect.poll(() => bodies.some(b => b.job === 'feedback')).toBe(true);
  await expect(wcell(page, 'Alice Test')).toContainText('5');
  await expect(wcell(page, 'Alice Test')).not.toContainText('⏳');
  state.feedback.sk_WRT555_10001_1 = { state: 'done', result: Object.assign({}, RESULT, { scores: { grammar: 3, vocabulary: 2, structure: 1.5, task: 1 } }) };
  await page.evaluate(() => { window.__taWritingAsked = {}; return window.taWritingAiSync(); });
  await expect(wcell(page, 'Alice Test')).toContainText('7.5');
  expect(errors).toEqual([]);
});

test('the teacher\'s mark wins over ⏳ and over the AI', async ({ page, context }) => {
  const bodies = [], state = { feedback: {} };
  const errors = await openStep(page, context, [writing('sk_WRT555_10002_2', '10002', 'Bobur Test')], state, bodies, { ta_skills_marks: JSON.stringify({ 'WRT555|10002': 6 }) });
  await expect(wcell(page, 'Bobur Test')).toContainText('6');
  await expect(wcell(page, 'Bobur Test')).not.toContainText('⏳');
  expect(errors).toEqual([]);
});

test('the writing window: waiting → "⏳ Waiting for the AI check" with tries and reason; Check now → the AI\'s feedback', async ({ page, context }) => {
  const bodies = [], state = { feedback: { sk_WRT555_10002_2: { state: 'waiting', tries: 2, lastError: 'the free limit is used up' } } };
  const errors = await openStep(page, context, [writing('sk_WRT555_10002_2', '10002', 'Bobur Test')], state, bodies);
  await expect.poll(() => bodies.some(b => b.job === 'feedback')).toBe(true);
  await expect(wcell(page, 'Bobur Test')).toContainText('⏳');
  await wcell(page, 'Bobur Test').click();
  const modal = page.locator('.sk-wv');
  await expect(modal.locator('.sk-wv-wait')).toContainText('⏳ Waiting for the AI check');
  await expect(modal.locator('.sk-wv-wait')).toContainText('2');
  await expect(modal.locator('.sk-wv-wait')).toContainText('the free limit is used up');
  await modal.getByRole('button', { name: '🤖 Check now' }).click();
  await expect(modal.locator('.sk-wv-parts')).toContainText('Grammar 2.5/3');
  // the generous check's extras (2026-11-13): what the student did well (escaped) and the better version
  await expect(modal).toContainText('⭐ What you did well');
  await expect(modal.locator('.sk-wv-praise li')).toHaveCount(2);
  await expect(modal.locator('.sk-wv-praise li').first()).toHaveText('You used <b>all</b> the asked words.');
  await expect(modal).toContainText('✏️ Things to improve');
  await expect(modal.locator('.sk-wv-betterv')).toHaveText('I usually wake up at seven o\'clock.');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skills_marks') || '{}'))).toEqual({});   // no mark is written
  await expect(wcell(page, 'Bobur Test')).toContainText('8');
  expect(errors).toEqual([]);
});

test('a waiting writing is asked about again by itself (a poll): once the helper has checked it, ⏳ turns into the band', async ({ page, context }) => {
  await context.addInitScript(() => { window.__taWritingPollMs = 1500; });
  const bodies = [], state = { feedback: { sk_WRT555_10002_2: { state: 'waiting', tries: 1, lastError: '' } } };
  const errors = await openStep(page, context, [writing('sk_WRT555_10002_2', '10002', 'Bobur Test')], state, bodies);
  await expect(wcell(page, 'Bobur Test')).toContainText('⏳');
  state.feedback.sk_WRT555_10002_2 = { state: 'done', result: RESULT };   // no new result arrives — only the poll can notice
  await expect(wcell(page, 'Bobur Test')).toContainText('8', { timeout: 15000 });
  await expect(wcell(page, 'Bobur Test')).not.toContainText('⏳');
  const n = bodies.filter(b => b.job === 'feedback').length;
  await page.waitForTimeout(3500);
  expect(bodies.filter(b => b.job === 'feedback').length).toBe(n);   // nothing waits any more → the poll stopped
  expect(errors).toEqual([]);
});

test('the Course draws quickly with 300 kept feedbacks and 300 writings (the feedback store is read once, not per writing)', async ({ page, context }) => {
  const N = 300, docs = [], store = {}, roster = [];
  const big = Object.assign({}, RESULT, { mistakes: Array.from({ length: 12 }, (_, i) => ({ wrong: 'I goes to the school every day number ' + i + '.', right: 'I go to school every day number ' + i + '.', why: 'I + go, and no "the" before school here.' })) });
  for (let i = 0; i < N; i++) {
    const id = 'sk_WRT555_' + (20000 + i) + '_1';
    docs.push(writing(id, String(20000 + i), 'Student ' + i));
    store[id] = big;
    roster.push({ id: String(20000 + i), name: 'Student ' + i, group: 'g1' });
  }
  const errors = await openStep(page, context, docs, { feedback: {} }, [], { ta_skills_ai: JSON.stringify(store), ta_points_roster: JSON.stringify(roster) });
  await expect(page.locator('.sk-rt-row')).toHaveCount(N);
  const ms = await page.evaluate(() => { const t0 = performance.now(); renderCourse(); renderCourse(); return (performance.now() - t0) / 2; });
  expect(ms).toBeLessThan(150);   // 2026-11-13: ~300 ms when the store was parsed for every writing, ~15 ms read once
  // still right: a feedback written meanwhile (another tab / sync) is seen once the store is dropped
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('ta_skills_ai')); delete s.sk_WRT555_20000_1; localStorage.setItem('ta_skills_ai', JSON.stringify(s)); window.taStoreChanged('ta_skills_ai'); renderCourse(); });
  await expect(page.locator('.sk-rt-row', { has: page.locator('.sk-rt-name', { hasText: /^Student 0$/ }) }).locator('.sk-rt-cell').nth(2)).toContainText('⏳');
  expect(errors).toEqual([]);
});

test('a blank writing (no text, no mark) counts as band 1, not ⏳ or missing', async ({ page, context }) => {
  const errors = await openStep(page, context, [writing('sk_WRT555_10002_2', '10002', 'Bobur Test', { text: '', words: 0 })], { feedback: {} }, []);
  await expect(wcell(page, 'Bobur Test')).toContainText('1');
  await expect(wcell(page, 'Bobur Test')).not.toContainText('⏳');
  expect(await page.evaluate(() => skWritingBandFor(window.__allResults.find(r => r.__id === 'sk_WRT555_10002_2')))).toBe(1);
  expect(errors).toEqual([]);
});

test('the teacher\'s mark wins over a checked AI band', async ({ page, context }) => {
  const bodies = [], state = { feedback: {} };
  const errors = await openStep(page, context, [writing('sk_WRT555_10002_2', '10002', 'Bobur Test')], state, bodies,
    { ta_skills_marks: JSON.stringify({ 'WRT555|10002': 4 }), ta_skills_ai: JSON.stringify({ sk_WRT555_10002_2: RESULT }) });   // the AI says 8
  await expect(wcell(page, 'Bobur Test')).toContainText('4');
  await expect(wcell(page, 'Bobur Test')).not.toContainText('8');
  await wcell(page, 'Bobur Test').click();
  await expect(page.locator('.sk-wv-how')).toHaveText('(your mark)');
  await expect(page.getByRole('button', { name: '↩️ Use the AI\'s band' })).toBeVisible();
  await page.getByRole('button', { name: '↩️ Use the AI\'s band' }).click();
  await expect(wcell(page, 'Bobur Test')).toContainText('8');
  await expect(page.locator('.sk-wv-how')).toHaveText('(AI\'s band)');
  expect(errors).toEqual([]);
});
