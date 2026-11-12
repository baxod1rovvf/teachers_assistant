// The Writing Journey (teacher, 2026-11-09): 20 writing tasks with asked words (+ Uzbek), the teacher's limits, and an AI
// check (the teacher's Cloudflare helper → Gemini): score /9 (grammar 3, vocabulary 2, structure 2, task 2, −0.5 when too
// short), word count, grammar mistakes, better words, the asked-words checklist and three tips. A stand-in AI here.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');
const fs = require('fs'), path = require('path');
const SOURCE = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'writing-journey.json'), 'utf8'));

const AI = { scores: { grammar: 2.5, vocabulary: 2, structure: 1.5, task: 2 },
  mistakes: [{ wrong: 'I goes to school at eight.', right: 'I go to school at eight.', why: 'With "I", use "go", not "goes".' }],
  better: [{ word: 'very good', instead: 'excellent', why: 'It is stronger.' }],
  tips: ['Use the past simple for yesterday.', 'Join short sentences with "and" or "because".', 'Check every asked word.'] };
async function fakeAi(context, { fail = false, calls } = {}) {
  await context.addInitScript(() => { try { localStorage.setItem('ta_ai_url', 'https://loom-ai.test/'); } catch (e) { /* ignore */ } });
  await context.route('https://loom-ai.test/**', async route => {
    if (calls) calls.push(JSON.parse(route.request().postData() || '{}'));
    if (fail) return route.fulfill({ status: 502, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: "today's free limit is used up (429)" }) });
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ result: AI }) });
  });
}
const TEXT = 'I usually wake up at seven. Then I get dressed and have breakfast with my family. I goes to school at eight. ' +
  'After school, I do homework and play football. In the evening, I watch TV. It is very good. I go to bed at ten.';

test('the 20 writing tasks are the approved ones: topic, instruction, asked words with Uzbek, limits and minutes', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/skill.html?s=writing&st=b1&preview=1');
  const W = await page.evaluate(() => TA_SKILLS.steps.map(s => s.writing));
  expect(W.length).toBe(20);
  W.forEach((w, i) => {
    const src = SOURCE[i];
    expect(w).toMatchObject({ topic: src.title, instruction: src.instruction, minWords: src.minWords, maxWords: src.maxWords, minutes: src.minutes });
    expect(w.words.map(x => [x.w, x.uz])).toEqual(src.words);
    expect(w.words.length).toBeGreaterThanOrEqual(8);
    expect(w.words.length).toBeLessThanOrEqual(10);
  });
  expect(W[0]).toMatchObject({ minWords: 80, maxWords: 100, minutes: 15 });
  expect(W[19]).toMatchObject({ minWords: 120, maxWords: 150, minutes: 25 });
});

test('asked words are found in other forms too, and the 9-point score takes off 0.5 only when too short', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/skill.html?s=writing&st=b1&preview=1');
  const r = await page.evaluate(() => ({
    asked: skAskedWords('We got along really well. I met her in May and we spent time together. I tried it on. My brother was born in York.',
      ['get along with', 'get along', 'meet', 'spend time', 'try on', 'was born', 'go to bed']),
    full: skWritingAiBand({ grammar: 3, vocabulary: 2, structure: 2, task: 2 }, 90, 80),
    short: skWritingAiBand({ grammar: 3, vocabulary: 2, structure: 2, task: 2 }, 70, 80),
    long: skWritingAiBand({ grammar: 2.5, vocabulary: 2, structure: 1.5, task: 2 }, 200, 80),
    silly: skWritingAiBand({ grammar: 99, vocabulary: -3 }, 90, 80)
  }));
  expect(r.asked).toEqual({ used: ['get along', 'meet', 'spend time', 'try on', 'was born'], missing: ['get along with', 'go to bed'] });
  expect([r.full, r.short, r.long, r.silly]).toEqual([9, 8.5, 8, 3]);
});

const SENT = '✅ Your writing was sent. Your teacher will share your results.';
async function fakeQueue(context, { fail = false, bodies } = {}) {
  await context.addInitScript(() => { try { localStorage.setItem('ta_ai_url', 'https://loom-ai.test/'); } catch (e) { /* ignore */ } });
  await context.route('https://loom-ai.test/**', async route => {
    if (bodies) bodies.push(JSON.parse(route.request().postData() || '{}'));
    const h = { 'Access-Control-Allow-Origin': '*' };
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { ...h, 'Access-Control-Allow-Headers': '*' } });
    if (fail) return route.fulfill({ status: 502, contentType: 'application/json', headers: h, body: JSON.stringify({ error: 'busy' }) });
    return route.fulfill({ status: 200, contentType: 'application/json', headers: h, body: JSON.stringify({ queued: true }) });
  });
}
const startWriting = async (page, code) => {
  await page.goto('/skill.html?s=writing&st=b1&c=' + code);
  await page.locator('#studentNameInput').fill('Test Student');
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
};
const writingRecord = page => page.evaluate(() => window.__writes.map(w => window.__fakeDocs.find(d => d.__id === w.id)).find(d => d && d.type === 'Writing course'));

test('student: the asked words tick as they are used', async ({ page, context }) => {
  await prepare(context);
  await fakeQueue(context);
  const errors = watchErrors(page);
  await startWriting(page, 'WRT321');
  await expect(page.locator('.sk-instruction')).toContainText('Describe a normal day in your life');
  await expect(page.locator('.sk-ask')).toHaveCount(8);
  await expect(page.locator('.sk-ask').first().locator('.sk-uz')).toHaveText("uyg'onmoq");
  await page.locator('#skWriteBox').fill(TEXT);
  await expect(page.locator('.sk-ask.used')).toHaveCount(8);
  await expect(page.locator('#skAskedCount')).toHaveText('8 / 8');
  await page.locator('#skWriteBox').fill('I wake up early.');
  await expect(page.locator('.sk-ask.used')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('student: Submit sends the writing to the AI\'s waiting list and shows only "sent"', async ({ page, context }) => {
  const bodies = [];
  let lt = 0;
  await prepare(context);
  await fakeQueue(context, { bodies });
  await context.route('**/api.languagetool.org/**', route => { lt++; route.fulfill({ status: 200, contentType: 'application/json', body: '{"matches":[]}' }); });
  const errors = watchErrors(page);
  await startWriting(page, 'WRT323');
  await page.locator('#skWriteBox').fill(TEXT);
  await page.getByRole('button', { name: /Submit my writing/ }).click();
  await expect(page.locator('.sk-sent-card')).toHaveText(SENT);
  await expect(page.locator('.sk-send')).toContainText('Saved ✅');
  await expect(page.locator('.sk-band')).toHaveCount(0);
  await expect(page.locator('.sk-ai-mistakes')).toHaveCount(0);
  await expect(page.locator('#skGrammar')).toHaveCount(0);
  const rec = await writingRecord(page);
  expect(bodies[0]).toMatchObject({ job: 'queue', id: rec.__id, topic: 'My Daily Routine', minWords: 80, maxWords: 100,
    words: ['wake up', 'get dressed', 'have breakfast', 'usually', 'after school', 'do homework', 'in the evening', 'go to bed'] });
  expect(bodies[0].text).toBe(TEXT);
  expect(rec.band).toBeUndefined();
  expect(rec.aiQueued).toBeUndefined();
  expect(rec).toMatchObject({ words: 46, asked: { missing: [] } });
  expect(lt).toBe(0);
  expect(errors).toEqual([]);
});

test('student: the helper down → the writing is still saved and shown as sent', async ({ page, context }) => {
  await prepare(context);
  await fakeQueue(context, { fail: true });
  await startWriting(page, 'WRT322');
  await page.locator('#skWriteBox').fill(TEXT);
  await page.getByRole('button', { name: /Submit my writing/ }).click();
  await expect(page.locator('.sk-send')).toContainText('Saved ✅');
  await expect(page.locator('.sk-sent-card')).toHaveText(SENT);
  const rec = await writingRecord(page);
  expect(rec.aiQueued).toBeUndefined();
  expect(rec.band).toBeUndefined();
});

test('student: the "sent" card waits for the save — failing saves show Send again and no card, then it appears', async ({ page, context }) => {
  await prepare(context);
  await fakeQueue(context);
  await startWriting(page, 'WRT325');
  await page.locator('#skWriteBox').fill(TEXT);
  await page.evaluate(() => { window.__failWrites = 3; });
  await page.getByRole('button', { name: /Submit my writing/ }).click();
  await expect(page.locator('.sk-send')).toContainText('Not sent yet — press Send again', { timeout: 15000 });
  await expect(page.locator('.sk-sent-card')).toHaveCount(0);
  await page.getByRole('button', { name: /Send again/ }).click();
  await expect(page.locator('.sk-send')).toContainText('Saved ✅');
  await expect(page.locator('.sk-sent-card')).toHaveText(SENT);
});

test('"already done" for a writing shows the words, no band', async ({ page, context }) => {
  await prepare(context);
  await fakeQueue(context);
  await startWriting(page, 'WRT324');
  await page.locator('#skWriteBox').fill(TEXT);
  await page.getByRole('button', { name: /Submit my writing/ }).click();
  await expect(page.locator('.sk-send')).toContainText('Saved ✅');
  await startWriting(page, 'WRT324');
  await expect(page.locator('.sk-done-score')).toContainText('46 words');
  await expect(page.locator('.sk-done-score')).not.toContainText('band');
});

test('teacher: a writing the AI didn\'t check gets "🤖 Check with AI" — its score becomes the teacher\'s mark', async ({ page, context }) => {
  const now = Date.now();
  const item = { uid: 'skwriting', code: 'WRT555', typeLabel: 'Writing course', groupId: 'g1', skill: 'writing', title: 'Step 1 — writing', date: new Date().toISOString() };
  await prepare(context, {
    docs: [{ __id: 'w9', v: 1, code: 'WRT555', type: 'Writing course', skill: 'writing', step: 'b1', title: 'Step 1 · Hello! — Writing', name: 'Alice Test', studentId: '10001',
      text: TEXT, words: 47, minWords: 80, maxWords: 100, mistakes: 0, mistakeList: [], grammarChecked: false, aiChecked: false, band: 5,
      asked: { used: ['wake up'], missing: ['go to bed'] }, timeSeconds: 600, timeDisplay: '10:00', date: new Date(now - 60000).toISOString(), submittedAt: new Date(now - 60000).toISOString() }],
    storage: { ta_recent_exercises: JSON.stringify([item]), ta_skills_links: JSON.stringify({ 'g1|writing|b1': { code: 'WRT555' } }) }
  });
  await fakeAi(context);
  await page.goto('/results.html');
  await page.waitForFunction(() => (window.__allResults || []).length >= 1, null, { timeout: 10000 });
  await hideNotices(page);
  await page.evaluate(() => showExerciseResults('skwriting'));
  await page.locator('.results-table tbody tr', { hasText: 'Alice Test' }).getByRole('button', { name: '👁 View' }).click();
  const modal = page.locator('.sk-wv');
  await expect(modal.locator('.sk-wv-noai')).toContainText("The AI check didn't run");
  await modal.getByRole('button', { name: '🤖 Check with AI' }).click();
  await expect(modal.locator('.sk-wv-parts')).toContainText('Grammar 2.5/3');
  await expect(modal.locator('#skWvBand')).toHaveValue('7.5');
  await expect(modal).toContainText('(your mark)');
  expect(await page.evaluate(() => [JSON.parse(localStorage.getItem('ta_skills_marks'))['WRT555|10001'], !!JSON.parse(localStorage.getItem('ta_skills_ai'))['WRT555|10001']])).toEqual([7.5, true]);
});
