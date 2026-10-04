// Can Knockdown: the teacher writes words + translations; students see the translation on a paper and
// type the English word — every right answer knocks down a can, 6 cans a round.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const WORDS = [['hi / hello', 'salom'], ['kitchen', 'oshxona'], ['apple', 'olma'], ['book', 'kitob'],
  ['water', 'suv'], ['house', 'uy'], ['school', 'maktab'], ['street', 'koʻcha']];

test('Can Knockdown: built from words + translations; the student types the English word; a right answer knocks a can down, a missed word comes back; 6 cans a round', async ({ page, context }, info) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/create.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await expect(page.locator('.picker-card', { hasText: 'Can Knockdown' })).toBeVisible();
  await page.locator('.picker-card', { hasText: 'Can Knockdown' }).click();
  await expect(page.locator('#panel-canknock')).toHaveClass(/active/);
  await page.fill('#ck-title', 'Unit 1 words');
  for (const [w, t] of WORDS) {
    await page.fill('#ck-compose', w + ' - ' + t);
    await page.press('#ck-compose', 'Enter');
  }
  await expect(page.locator('#ck-count')).toHaveText('8');
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#panel-canknock .create-btn')]);
  const file = info.outputPath('canknock.html');
  await download.saveAs(file);
  const item = await page.evaluate(() => getRecentExercises()[0]);
  expect(item.typeLabel).toBe('Can Knockdown');
  expect(errors).toEqual([]);

  // the student (handed over the way a Homework set does it)
  const student = await context.newPage();
  const studentErrors = watchErrors(student);
  await student.addInitScript(() => {
    if (!window.__named) { window.__named = 1; window.name = 'ta_merge_identity:' + JSON.stringify({ id: '10001', name: 'Alice Test', code: '' }); }
    window.__sent = [];
    window.submitResultToFirebase = p => { window.__sent.push(p); return Promise.resolve('ok'); };
  });
  await student.goto('file://' + file);
  await expect(student.locator('#slide-cans')).toHaveClass(/active/, { timeout: 6000 });
  await expect(student.locator('#ckRoundLabel')).toHaveText('Round 1 / 2');
  await expect(student.locator('#ckShelf .ck-can')).toHaveCount(6);
  // the order they fall in: 1 on top, then 2 3, then 4 5 6 (left to right)
  expect(await student.locator('#ckShelf .ck-can').evaluateAll(l => l.map(c => c.dataset.n))).toEqual(['4', '5', '6', '2', '3', '1']);
  expect(await student.locator('#ckShelf .ck-can').evaluateAll(l => l.every(c => /ck-k[123]/.test(c.className)))).toBe(true); // the teacher's can pictures
  await expect(student.locator('#ckInput')).toBeVisible();
  await expect(student.locator('#ckLeft')).toHaveText('6');

  const current = () => student.evaluate(() => ({ prompt: ITEMS[idx].prompt, word: ITEMS[idx].word, idx }));
  const type = async (text) => {
    await expect(student.locator('#ckInput')).toBeEnabled({ timeout: 4000 });
    await student.fill('#ckInput', text);
    await student.press('#ckInput', 'Enter');
  };
  // the paper shows the English word; a wrong translation: no can falls, the right one is shown, the word comes back
  const missed = await current();
  await expect(student.locator('#ckPrompt')).toHaveText(missed.prompt);   // the translation on the paper
  await type('nothing like it');
  await expect(student.locator('#ckVerdict')).toContainText('Missed');
  await expect(student.locator('#ckVerdict')).toContainText(missed.word.split(' / ')[0]);
  await expect(student.locator('#ckLeft')).toHaveText('6');
  // then every translation right — capitals and another apostrophe don't matter: a can falls each time
  for (let left = 5; left >= 0; left--) {
    await expect(student.locator('#ckInput')).toBeEnabled({ timeout: 4000 });
    const c = await current();
    await type(c.word.split(' / ').pop().toUpperCase());
    await expect(student.locator('#ckLeft')).toHaveText(String(left));
  }
  await expect(student.locator('#ckCleared')).toBeVisible({ timeout: 4000 });
  await expect(student.locator('#ckCleared')).toContainText('Round 1 cleared');
  await student.locator('#ckClearedBtn').click();
  // round 2: the 2 words left, 2 cans
  await expect(student.locator('#ckRoundLabel')).toHaveText('Round 2 / 2');
  await expect(student.locator('#ckShelf .ck-can')).toHaveCount(2);
  for (let left = 1; left >= 0; left--) {
    await expect(student.locator('#ckInput')).toBeEnabled({ timeout: 4000 });
    const c = await current();
    await type(c.word.split(' / ')[0]);
    await expect(student.locator('#ckLeft')).toHaveText(String(left));
  }
  await expect(student.locator('#ckCleared')).toContainText('All the cans are down', { timeout: 4000 });
  await student.locator('#ckClearedBtn').click();
  await expect(student.locator('#slide-certificate')).toHaveClass(/active/);
  // only the first try counts: 7 of 8
  await expect(student.locator('#certCorrect')).toHaveText('7 / 8');
  const payload = await student.evaluate(() => buildResultPayload());
  expect(payload.type).toBe('Can Knockdown');
  expect(payload.correct).toBe(7);
  expect(payload.mistakes).toContain(missed.prompt + ' = ' + missed.word + ' → nothing like it');
  expect(studentErrors.filter(e => !/module|import|Failed to fetch/i.test(e))).toEqual([]);
});

test('builders are short: no description or chips under the title, short labels, no optional instructions box', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/create.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(() => switchTo('canknock'));
  const panel = page.locator('#panel-canknock');
  await expect(panel.locator('.card-head p, .deco-chips')).toHaveCount(0);
  await expect(panel.locator('.field-label')).toContainText(['Exercise Title', 'Group', 'Points', 'Class code', 'Time limit']);
  await expect(page.locator('#ck-instructions, #wo-instructions, #sp-instructions, #fc-instructions')).toHaveCount(0);
  await expect(page.locator('#sn-instructions')).toHaveCount(1);   // Sentences keeps its own (part of the exercise)
  await expect(page.locator('#panel-create .deco-chips, .panel .deco-chips')).toHaveCount(0);
  // the robot explains it
  await page.evaluate(() => { aiRobotQuery = ''; toggleAiRobotBubble(); });
  await expect(page.locator('#aiRobotBubbleBody')).toContainText('What is the Can Knockdown exercise?');
});
