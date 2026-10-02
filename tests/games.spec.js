// Jungle ⇄ Bamboozle: the same questions in the other classroom game.
const { test, expect } = require('@playwright/test');
const { prepare, hideNotices } = require('./support/app');

test('the Jungle builder hands its questions to Bamboozle, and back', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/create.html#jungle');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(() => switchTo('jungle'));
  await page.fill('#jg-title', 'Animals');
  await page.evaluate(() => ['What is "it"?', 'Say "67"', 'Name a fruit'].forEach(q => addJungleQuestion(q)));
  await page.click('#panel-jungle button:has-text("Make it a Bamboozle")');
  await expect(page.locator('#panel-bamboozle')).toHaveClass(/active/);
  await expect(page.locator('#bz-title')).toHaveValue('Animals');
  const bz = await page.evaluate(() => bamboozleQuestionsFilled());
  expect(bz.map(x => x.q)).toEqual(['What is "it"?', 'Say "67"', 'Name a fruit']);
  expect(bz.every(x => x.pts === 10 && x.a === '')).toBe(true);

  // back to Jungle, after an answer was added: the answer stays behind
  await page.evaluate(() => { bzQuestions[0].a = 'a pronoun'; });
  page.once('dialog', d => d.accept());                    // "already has 3 questions — replace them?"
  await page.click('#panel-bamboozle button:has-text("Make it a Jungle")');
  await expect(page.locator('#panel-jungle')).toHaveClass(/active/);
  expect(await page.evaluate(() => jungleQuestionsFilled())).toEqual([
    { q: 'What is "it"?', img: '' }, { q: 'Say "67"', img: '' }, { q: 'Name a fruit', img: '' }]);
});
