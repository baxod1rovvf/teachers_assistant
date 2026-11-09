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

test('student: the asked words tick as they are used; after Submit the AI feedback comes in the teacher\'s order', async ({ page, context }) => {
  const calls = [];
  await prepare(context);
  await fakeAi(context, { calls });
  const errors = watchErrors(page);
  await page.goto('/skill.html?s=writing&st=b1&c=WRT321');
  await page.locator('#studentNameInput').fill('Test Student');
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await expect(page.locator('.sk-instruction')).toContainText('Describe a normal day in your life');
  await expect(page.locator('.sk-ask')).toHaveCount(8);
  await expect(page.locator('.sk-ask').first().locator('.sk-uz')).toHaveText("uyg'onmoq");
  await page.locator('#skWriteBox').fill(TEXT);
  await expect(page.locator('.sk-ask.used')).toHaveCount(8);
  await expect(page.locator('#skAskedCount')).toHaveText('8 / 8');
  await page.locator('#skWriteBox').fill('I wake up early.');
  await expect(page.locator('.sk-ask.used')).toHaveCount(1);
  await page.locator('#skWriteBox').fill(TEXT);
  await page.getByRole('button', { name: /Submit my writing/ }).click();
  // 1 score /9 with its parts — the text is 46 words, under 80: −0.5
  await expect(page.locator('.sk-band')).toContainText('7.5');
  await expect(page.locator('.sk-band')).toContainText('/ 9');
  await expect(page.locator('.sk-band')).toContainText('Grammar 2.5/3 · Vocabulary 2/2 · Structure 1.5/2 · Task 2/2 · −0.5 (too short)');
  // 2 words · 3 grammar · 4 better words · 5 asked words · 6 tips — in this order
  const cards = page.locator('#skAfter .sk-card h2');
  await expect(cards).toHaveText(['📏 Word count', '🔍 Grammar', '💡 Better words', '📝 Asked words', '🚀 Next time']);
  await expect(page.locator('.sk-ai-len')).toContainText('46 words · required 80–100');
  await expect(page.locator('.sk-ai-mistakes li')).toHaveCount(1);
  await expect(page.locator('.sk-ai-mistakes li')).toContainText('I go to school at eight.');
  await expect(page.locator('.sk-better li')).toContainText('excellent');
  await expect(page.locator('.sk-asked-result .sk-ask.used')).toHaveCount(8);
  await expect(page.locator('.sk-tips li')).toHaveCount(3);
  await expect(page.locator('.sk-send')).toContainText('Saved ✅');
  // what the helper got, and what the teacher gets
  expect(calls[0]).toMatchObject({ job: 'writing', topic: 'My Daily Routine', minWords: 80, maxWords: 100, words: ['wake up', 'get dressed', 'have breakfast', 'usually', 'after school', 'do homework', 'in the evening', 'go to bed'] });
  const rec = await page.evaluate(() => window.__writes.map(w => window.__fakeDocs.find(d => d.__id === w.id)).find(d => d && d.type === 'Writing course'));
  expect(rec).toMatchObject({ aiChecked: true, band: 7.5, words: 46, ai: { scores: AI.scores }, asked: { missing: [] } });
  expect(errors).toEqual([]);
});

test('student: when the AI is busy, the writing is still checked the simple way and sent, marked "AI didn\'t run"', async ({ page, context }) => {
  await prepare(context);
  await fakeAi(context, { fail: true });
  await page.goto('/skill.html?s=writing&st=b1&c=WRT322');
  await page.locator('#studentNameInput').fill('Test Student');
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await page.locator('#skWriteBox').fill(TEXT);
  await page.getByRole('button', { name: /Submit my writing/ }).click();
  await expect(page.locator('.sk-ai-note')).toContainText("today's free limit is used up");
  await expect(page.locator('.sk-asked-card')).toBeVisible();
  await expect(page.locator('.sk-send')).toContainText('Saved ✅');
  const rec = await page.evaluate(() => window.__writes.map(w => window.__fakeDocs.find(d => d.__id === w.id)).find(d => d && d.type === 'Writing course'));
  expect(rec.aiChecked).toBe(false);
  expect(rec.ai).toBeUndefined();
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
