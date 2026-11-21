// Analysis mode (teacher, 2026-11-20: "if they enter again, they should see 'Bu mashqni allaqachon tugatgansiz' and how many
// answers they got correct and everything … like when they finish the exercise the first time. Because some students cannot do
// analysis after leaving the exercise. One thing they can't do: play the recording and change answers.")
const { test, expect } = require('@playwright/test');
const { passIdCheck, prepare, watchErrors } = require('./support/app');

async function stepB5(page) {
  return page.evaluate(() => TA_SKILLS.steps.find(s => s.id === 'b5'));
}
async function open(page, url) {
  await page.goto(url);
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await passIdCheck(page);
}
const docsOf = (page, code) => page.evaluate(c => window.__fakeDocs.filter(d => d.code === c).length, code);

test('a finished Reading opens in analysis mode: own answers, right answers, locked, Analyze — nothing sent', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/skill.html?s=reading&st=b5&c=RDA111');
  const qs = (await stepB5(page)).reading.questions;
  const answers = qs.map((q, i) => i === 0 ? { q: q.q, given: q.a[0] === 'True' ? 'False' : 'True', right: false }
    : i === 5 ? { q: q.q, given: q.keys[0], right: true } : { q: q.q, given: '', right: false });
  const sent = { __id: 'sk_RDA111_10001_1', v: 1, code: 'RDA111', type: 'Reading course', skill: 'reading', step: 'b5', name: 'Alice', studentId: '10001',
    correct: 1, total: qs.length, answers, date: new Date().toISOString() };
  await prepare(context, { docs: [sent] });
  const errors = watchErrors(page);
  await open(page, '/skill.html?s=reading&st=b5&c=RDA111');
  const card = page.locator('.sk-done-card');
  await expect(card).toContainText('Bu mashqni allaqachon tugatgansiz');
  await expect(card).toContainText('You have already done this reading');
  await expect(page.locator('.sk-score-n')).toHaveText(`1 / ${qs.length}`);
  const q1 = page.locator('.sk-q').nth(0);
  await expect(q1).toHaveClass(/wrong/);
  await expect(q1.locator('.sk-opt.is-answer')).toHaveText(qs[0].a[0]);
  await expect(q1.locator('.sk-opt.on')).toBeDisabled();
  const q6 = page.locator('.sk-q').nth(5);
  await expect(q6).toHaveClass(/right/);
  await expect(q6.locator('input')).toHaveValue(qs[5].keys[0]);
  await expect(q6.locator('input')).toBeDisabled();
  await expect(page.locator('#skSubmit')).toHaveCount(0);
  await page.getByRole('button', { name: 'Analyze >' }).click();
  await expect(page.locator('#skText .sk-sent.hl').first()).toBeVisible();
  await page.waitForTimeout(500);
  expect(await docsOf(page, 'RDA111')).toBe(1);   // nothing new was sent
  expect(errors).toEqual([]);
});

test('a finished Listening in analysis mode has no recording to play; Analyze shows what the speakers said', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/skill.html?s=listening&st=b5&c=LSA111');
  const qs = (await stepB5(page)).listening.questions;
  const sent = { __id: 'sk_LSA111_10001_1', v: 1, code: 'LSA111', type: 'Listening course', skill: 'listening', step: 'b5', name: 'Alice', studentId: '10001',
    correct: 1, total: qs.length, answers: qs.map((q, i) => ({ q: q.q, given: i === 0 ? q.a[0] : '', right: i === 0 })), date: new Date().toISOString() };
  await prepare(context, { docs: [sent] });
  const errors = watchErrors(page);
  await open(page, '/skill.html?s=listening&st=b5&c=LSA111');
  await expect(page.locator('.sk-done-card')).toContainText('Bu mashqni allaqachon tugatgansiz');
  await expect(page.locator('audio')).toHaveCount(0);
  await expect(page.locator('.sk-q').first()).toHaveClass(/right/);
  await expect(page.locator('.sk-q').nth(1)).toHaveClass(/wrong/);
  await page.getByRole('button', { name: 'Analyze >' }).click();
  await expect(page.locator('.sk-transcript .sk-line.hl').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('answers sent for questions that have changed since: a plain list of them and the score', async ({ page, context }) => {
  const sent = { __id: 'sk_LSA222_10001_1', v: 1, code: 'LSA222', type: 'Listening course', skill: 'listening', step: 'b5', name: 'Alice', studentId: '10001',
    correct: 1, total: 2, answers: [{ q: 'An old question?', given: 'Paris', right: true }, { q: 'Another old one?', given: 'blue', right: false }],
    date: new Date().toISOString() };
  await prepare(context, { docs: [sent] });
  const errors = watchErrors(page);
  await open(page, '/skill.html?s=listening&st=b5&c=LSA222');
  const box = page.locator('.sk-old-answers');
  await expect(box).toContainText('An old question?');
  await expect(box).toContainText('Paris');
  await expect(box.locator('.sk-score-n')).toHaveText('1 / 2');
  await expect(page.locator('audio')).toHaveCount(0);
  expect(errors).toEqual([]);
});
