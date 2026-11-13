// A step's results as a link: the teacher presses "🔗 Share results link" (the table goes online as results/share-<token>),
// students open results-link.html?r=<token>, see the group's table and tap a writing band to read its AI feedback.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const TEXT = 'I usually wake up at seven. Then I get dressed and have breakfast with my family. I go to school at eight. ' +
  'After school, I do homework and play football. In the evening, I watch TV. It is very good. I go to bed at ten.';
const RESULT = { scores: { grammar: 2.5, vocabulary: 2, structure: 1.5, task: 1.5 },
  mistakes: [{ wrong: 'I go to school at eight.', right: 'I go to school at eight o\'clock.', why: 'Say o\'clock.' }, { wrong: 'This is not in the text.', right: 'x', why: 'never written' }],
  better: [{ word: 'good', instead: 'excellent', why: 'stronger' }], tips: ['Tip one', 'Tip two', 'Tip three'], words: 90, band: 7.5 };
const H = { 'Access-Control-Allow-Origin': '*' };
const TOKEN = 'abcdef0123456789';
const shareData = rows => ({ group: 'Group A', step: 'b1', stepNo: 1, theme: 'Daily Routine', sharedAt: new Date().toISOString(), rows });
const wr = (extra) => Object.assign({ id: 'sk_WRT555_10001_1', raw: '90 words', text: TEXT, words: 90, minWords: 80, maxWords: 100,
  asked: { used: ['wake up'], missing: ['go to bed'] }, mark: null, band: null }, extra || {});
const alice = w => ({ name: 'Alice Test', listening: { band: 7, raw: '16 / 20' }, reading: null, writing: w });
const record = data => ({ fields: { type: { stringValue: 'TA_SYNC:SHARE' }, title: { stringValue: TOKEN }, data: { stringValue: JSON.stringify(data) } } });

async function linkPage(page, context, data, feedback, bodies, pollMs) {
  await context.addInitScript(ms => { try { localStorage.setItem('ta_ai_url', 'https://loom-ai.test/'); } catch (e) { /* ignore */ } window.__rlPollMs = ms; }, pollMs || 300);
  await context.route('https://loom-ai.test/**', async route => {
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { ...H, 'Access-Control-Allow-Headers': '*' } });
    const b = JSON.parse(route.request().postData() || '{}');
    (bodies || []).push(b);
    return route.fulfill({ status: 200, contentType: 'application/json', headers: H,
      body: JSON.stringify({ states: Object.fromEntries((b.ids || []).map(id => [id, feedback[id] || { state: 'unknown' }])) }) });
  });
  await page.route(/documents\/results\/share-abcdef0123456789/, r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(record(data)) }));
}

test('Share results link puts the step\'s table online and copies a link that stays the same', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await context.addInitScript(() => { window.skAppUrl = 'https://example.github.io/teachers_assistant/'; });
  const W = (id, sid, name) => ({ __id: id, v: 1, code: 'WRT555', type: 'Writing course', skill: 'writing', step: 'b1', title: 'Step 1 · Daily Routine — Writing', name, studentId: sid,
    text: TEXT, words: 90, minWords: 80, maxWords: 100, band: 6, asked: { used: ['wake up'], missing: [] }, timeSeconds: 600, timeDisplay: '10:00',
    date: new Date(Date.now() - 60000).toISOString(), submittedAt: new Date(Date.now() - 60000).toISOString() });
  const item = { uid: 'skwriting', code: 'WRT555', typeLabel: 'Writing course', groupId: 'g1', skill: 'writing', title: 'Step 1 — writing', date: new Date().toISOString() };
  await prepare(context, { docs: [W('sk_WRT555_10001_1', '10001', 'Alice Test')], storage: { ta_recent_exercises: JSON.stringify([item]),
    ta_skills_links: JSON.stringify({ 'g1|writing|b1': { code: 'WRT555' } }), ta_course_group: 'g1' } });
  const errors = watchErrors(page);
  await page.goto('/course.html');
  await page.waitForFunction(() => (window.__allResults || []).length >= 1, null, { timeout: 10000 });
  await hideNotices(page);
  await page.addStyleTag({ content: '#taNoticeStack { display: none !important; }' });
  await page.locator('.sk-gcard[data-group="g1"] .sk-gcard-open').click();
  await page.locator('.sk-node[data-step="b1"]').click();
  await page.getByRole('button', { name: '🔗 Share results link' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/^https:\/\/example\.github\.io\/teachers_assistant\/results-link\.html\?r=[0-9a-f]{16}$/);
  const link = await page.evaluate(() => navigator.clipboard.readText());
  const token = link.split('r=')[1];
  const recs = () => page.evaluate(() => window.__fakeDocs.filter(d => /^share-/.test(d.__id)));
  await expect.poll(async () => (await recs()).length).toBe(1);
  const rec = (await recs())[0];
  expect(rec).toMatchObject({ __id: 'share-' + token, type: 'TA_SYNC:SHARE', code: 'TAUSER', title: token });
  const data = JSON.parse(rec.data);
  expect(data).toMatchObject({ group: expect.any(String), stepNo: 1, step: 'b1' });
  const row = data.rows.find(r => r.name === 'Alice Test');
  expect(row.writing).toMatchObject({ id: 'sk_WRT555_10001_1', band: 6, mark: null, words: 90 });
  expect(rec.score).toBe(data.rows.length);
  // again: the same link, one record
  await page.evaluate(() => navigator.clipboard.writeText(''));
  await page.getByRole('button', { name: '🔗 Share results link' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(link);
  await expect.poll(async () => (await page.evaluate(() => window.__deletes)).filter(d => d === 'share-' + token).length).toBeGreaterThanOrEqual(2);
  expect((await recs()).length).toBe(1);
  expect(errors).toEqual([]);
});

test('the link page: the table, ⏳ for a waiting writing, then its band; tapping a band shows the feedback', async ({ page, context }) => {
  const feedback = { sk_WRT555_10001_1: { state: 'waiting', tries: 1, lastError: 'busy' } }, bodies = [];
  await linkPage(page, context, shareData([alice(wr())]), feedback, bodies);
  const errors = watchErrors(page);
  await page.goto('/results-link.html?r=' + TOKEN);
  const cell = page.locator('.sk-rt-row', { hasText: 'Alice Test' }).locator('.sk-rt-cell').nth(2);
  await expect(page.locator('.sk-rt-title')).toContainText('Step 1');
  await expect(page.locator('.sk-rt-row', { hasText: 'Alice Test' })).toContainText('7');
  await expect(cell).toContainText('⏳');
  await expect(page.locator('body')).toContainText('⏳ Checking…');
  await cell.click();
  await expect(page.locator('.rl-modal')).toContainText('still being checked');
  await page.keyboard.press('Escape');
  feedback.sk_WRT555_10001_1 = { state: 'done', result: Object.assign({}, RESULT, { praise: ['Good <i>order</i>.', 'Nice words.', 'Clear ending.'], betterVersion: 'I usually wake up at seven o\'clock.' }) };
  await expect(cell).toContainText('7.5');
  await expect(cell).not.toContainText('⏳');
  await expect(page.locator('.sk-rt-row', { hasText: 'Alice Test' }).locator('.sk-rt-overall')).toContainText('7.5');   // (7 + 7.5) / 2 → 7.5
  await cell.click();
  const m = page.locator('.rl-modal');
  await expect(m).toContainText('Grammar 2.5/3');
  await expect(m.locator('.sk-wv-text mark')).toHaveText('I go to school at eight.');
  await expect(m.locator('.sk-wv-mistakes')).toContainText('This is not in the text.');   // not found → listed, not underlined
  await expect(m.locator('.sk-wv-text mark')).toHaveCount(1);
  await expect(m).toContainText('excellent');
  await expect(m.locator('.sk-wv-tips li')).toHaveCount(3);
  // the generous check's extras (2026-11-13): what the student did well (escaped) and the better version
  await expect(m.locator('.sk-wv-praise li')).toHaveCount(3);
  await expect(m.locator('.sk-wv-praise li').first()).toHaveText('Good <i>order</i>.');
  await expect(m.locator('.sk-wv-betterv')).toHaveText('I usually wake up at seven o\'clock.');
  await expect(m).toContainText('✅ wake up');
  await expect(m).toContainText('❌ go to bed');
  // nothing waits any more: the poll stops
  const n = bodies.length;
  await page.waitForTimeout(1200);
  expect(bodies.length).toBe(n);
  expect(errors).toEqual([]);
});

test('student text on the link page is never run as HTML', async ({ page, context }) => {
  const evil = '<img src=x onerror="window.__pwned=1"> I go to school at eight.';
  const w = wr({ text: evil });
  await linkPage(page, context, shareData([alice(w)]), { [w.id]: { state: 'done', result: RESULT } }, []);
  await page.goto('/results-link.html?r=' + TOKEN);
  await page.locator('.sk-rt-wbtn').click();
  await expect(page.locator('.rl-modal .sk-wv-text')).toContainText('<img src=x');
  expect(await page.evaluate(() => window.__pwned)).toBeUndefined();
});

test('a teacher\'s mark shows on the link even while the AI is still waiting', async ({ page, context }) => {
  await linkPage(page, context, shareData([alice(wr({ mark: 6 }))]), { sk_WRT555_10001_1: { state: 'waiting', tries: 1 } }, []);
  await page.goto('/results-link.html?r=' + TOKEN);
  const cell = page.locator('.sk-rt-row', { hasText: 'Alice Test' }).locator('.sk-rt-cell').nth(2);
  await expect(cell).toContainText('6');
  await expect(cell).not.toContainText('⏳');
  await expect(page.locator('body')).not.toContainText('⏳ Checking…');
});

test('the link page fits a phone', async ({ page, context }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await linkPage(page, context, shareData([alice(wr({ mark: 6 }))]), {}, []);
  await page.goto('/results-link.html?r=' + TOKEN);
  await expect(page.locator('.sk-rt-row')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('a missing link and no internet show plain messages', async ({ page }) => {
  await page.route(/documents\/results\/share-404404404404404f/, r => r.fulfill({ status: 404, body: '{}' }));
  await page.goto('/results-link.html?r=404404404404404f');
  await expect(page.locator('body')).toContainText('This results link doesn\'t exist — ask your teacher for it again.');
  await page.route(/documents\/results\/share-0ff11e0ff11e0ff1/, r => r.abort());
  await page.goto('/results-link.html?r=0ff11e0ff11e0ff1');
  await expect(page.locator('body')).toContainText('Couldn\'t load the results — check the internet and open the link again.');
});

test('an already-checked writing (its feedback came with the table, the helper doesn\'t know it) shows its feedback', async ({ page, context }) => {
  const bodies = [];
  await linkPage(page, context, shareData([alice(wr({ ai: RESULT }))]), {}, bodies);   // the helper answers `unknown`
  const errors = watchErrors(page);
  await page.goto('/results-link.html?r=' + TOKEN);
  const cell = page.locator('.sk-rt-row', { hasText: 'Alice Test' }).locator('.sk-rt-cell').nth(2);
  await expect(cell).toContainText('7.5');
  await cell.click();
  await expect(page.locator('.rl-modal')).toContainText('Grammar 2.5/3');
  await expect(page.locator('.rl-modal .sk-wv-tips li')).toHaveCount(3);
  await expect(page.locator('.rl-modal')).not.toContainText('still being checked');
  // feedback from before the generous check has no praise / better version: those parts are simply left out
  await expect(page.locator('.rl-modal')).not.toContainText('What you did well');
  await expect(page.locator('.rl-modal .sk-wv-betterv')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('a writing the helper doesn\'t know and with no feedback: a plain "No AI feedback" note with its text and band, and it isn\'t asked about again', async ({ page, context }) => {
  const bodies = [];
  await linkPage(page, context, shareData([alice(wr({ band: 6 }))]), {}, bodies);
  await page.goto('/results-link.html?r=' + TOKEN);
  const cell = page.locator('.sk-rt-row', { hasText: 'Alice Test' }).locator('.sk-rt-cell').nth(2);
  await expect(cell).toContainText('6');
  await cell.click();
  const m = page.locator('.rl-modal');
  await expect(m).toContainText('No AI feedback for this writing yet.');
  await expect(m).not.toContainText('still being checked');
  await expect(m.locator('.sk-wv-text')).toContainText('I usually wake up at seven.');
  await expect(m.locator('.rl-score')).toContainText('6');
  await page.waitForTimeout(1500);
  expect(bodies.length).toBe(1);   // asked once at the start, never polled
});

test('the link page asks less and less often while a writing waits (60 s → 2 → 4 … ≤ 10 min) and stops after an hour', async ({ page, context }) => {
  const bodies = [];
  await context.addInitScript(() => { window.__rlPollForMs = 2600; });
  await linkPage(page, context, shareData([alice(wr())]), { sk_WRT555_10001_1: { state: 'waiting', tries: 1 } }, bodies, 200);
  await page.goto('/results-link.html?r=' + TOKEN);
  await expect(page.locator('.sk-rt-wbtn')).toContainText('⏳');
  // asks at 0, then 200, 400, 800, 1600 ms later (0.2 · 0.6 · 1.4 · 3.0 s) — the hour (2.6 s here) ends it
  await page.waitForTimeout(4500);
  const n = bodies.length;
  expect(n).toBeGreaterThanOrEqual(3);
  expect(n).toBeLessThanOrEqual(5);
  await page.waitForTimeout(2000);
  expect(bodies.length).toBe(n);
});

test('a blank writing counts as band 1 on the link', async ({ page, context }) => {
  await linkPage(page, context, shareData([alice(wr({ text: '', words: 0, raw: '0 words' }))]), {}, []);
  await page.goto('/results-link.html?r=' + TOKEN);
  const cell = page.locator('.sk-rt-row', { hasText: 'Alice Test' }).locator('.sk-rt-cell').nth(2);
  await expect(cell).toContainText('1');
  await expect(cell).not.toContainText('⏳');
  await expect(page.locator('.sk-rt-row', { hasText: 'Alice Test' }).locator('.sk-rt-overall')).toContainText('4');   // (7 + 1) / 2
});

test('Share results link carries a checked writing\'s feedback (so the link can show it)', async ({ page, context }) => {
  const W = { __id: 'sk_WRT555_10001_1', v: 1, code: 'WRT555', type: 'Writing course', skill: 'writing', step: 'b1', title: 'Step 1 · Daily Routine — Writing', name: 'Alice Test', studentId: '10001',
    text: TEXT, words: 90, minWords: 80, maxWords: 100, asked: { used: ['wake up'], missing: [] }, timeSeconds: 600, timeDisplay: '10:00',
    date: new Date(Date.now() - 60000).toISOString(), submittedAt: new Date(Date.now() - 60000).toISOString() };
  await prepare(context, { docs: [W], storage: { ta_skills_links: JSON.stringify({ 'g1|writing|b1': { code: 'WRT555' } }), ta_course_group: 'g1',
    ta_skills_ai: JSON.stringify({ sk_WRT555_10001_1: RESULT }) } });
  await page.goto('/course.html');
  await page.waitForFunction(() => (window.__allResults || []).length >= 1, null, { timeout: 10000 });
  const d = await page.evaluate(() => skShareData('b1', { id: 'g1', name: 'Target' }));
  const row = d.rows.find(r => r.name === 'Alice Test');
  expect(row.writing.ai).toMatchObject({ scores: RESULT.scores, tips: RESULT.tips });
  expect(row.writing.band).toBe(7.5);
});
