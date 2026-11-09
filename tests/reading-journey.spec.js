// The Reading Journey (teacher, 2026-11-09): 20 readings that grow from ~185 words (Step 1, the teacher's own) to ~600
// (Step 20); Steps 1–10 alternate True/False + WH-questions (odd) and True/False + gaps (even); Steps 11–20 have
// True/False/Not given + gaps + WH-questions (15). A WH answer is right when it has one of its main words.
const { test, expect } = require('@playwright/test');
const { prepare } = require('./support/app');
const fs = require('fs'), path = require('path');

const SOURCE = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'reading-journey.json'), 'utf8'));
const sentences = t => t.trim().split(/(?<=[.!?])\s+/);
const words = t => t.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;

test('the 20 readings: the teacher\'s plan, from the approved document, every question pointing at its sentence', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/skill.html?s=reading&st=b1&preview=1');
  const steps = await page.evaluate(() => TA_SKILLS.steps.map(s => ({ id: s.id, no: s.no, reading: s.reading })));
  expect(steps.filter(s => s.reading).length).toBe(20);
  let last = 0;
  for (const s of steps) {
    const R = s.reading, src = SOURCE.find(x => x.no === s.no);
    expect(R.title, s.id).toBe(src.title);
    expect(R.text, s.id).toBe(src.text);          // what the teacher approved, word for word
    const n = words(R.text);
    expect(Math.abs(n - (185 + (s.no - 1) * 415 / 19)), s.id + ' length').toBeLessThanOrEqual(45);
    if (s.no > 1) expect(n, s.id + ' longer than the step before').toBeGreaterThan(last - 20);
    last = n;
    const kinds = [...new Set(R.questions.map(q => q.type))];
    if (s.no <= 10) expect(kinds, s.id).toEqual(s.no % 2 ? ['tf', 'open'] : ['tf', 'gap']);
    else expect(kinds, s.id).toEqual(['tfng', 'gap', 'open']);
    expect(R.questions.length, s.id).toBe(s.no <= 10 ? 10 : 15);
    kinds.forEach(k => expect(R.questions.filter(q => q.type === k).length, s.id + ' ' + k).toBe(5));
    if (s.no > 10) expect(R.questions.some(q => q.a && q.a[0] === 'Not given'), s.id + ' has a Not given').toBe(true);
    const sent = sentences(R.text);
    R.questions.forEach((q, i) => {
      expect(sent[q.line], s.id + ' question ' + (i + 1)).toBeTruthy();
      if (q.type === 'gap') { expect(q.q).toContain('_____'); expect(R.text.toLowerCase()).toContain(q.a[0].toLowerCase()); }
      if (q.type === 'open') expect(q.keys.some(k => R.text.toLowerCase().replace(/(\d),(\d)/g, '$1$2').includes(k.toLowerCase())), s.id + ' ' + q.q).toBe(true);
    });
    expect(R.words.length, s.id).toBe(10);
    R.words.forEach(w => { expect(w.uz && w.emoji, s.id + ' ' + w.w).toBeTruthy(); expect(sent, s.id + ' ' + w.w).toContain(w.ex); });
    expect(R.retell, s.id).toMatch(/^Retell/);
  }
  expect(words(steps[19].reading.text)).toBeGreaterThan(550);
});

test('a WH answer is right when it has a main word (case, endings, accents and commas in numbers don\'t matter)', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/skill.html?s=reading&st=b1&preview=1');
  const r = await page.evaluate(() => [
    skOpenRight('because it is his dream', ['dream']),     // the teacher's own example
    skOpenRight('He has big DREAMS.', ['dream']),
    skOpenRight('He likes football', ['dream']),
    skOpenRight('at 20', ['2', 'two']),                     // "2" is not "20"
    skOpenRight('at 2 p.m.', ['2', 'two']),
    skOpenRight('more than 1,500', ['1500']),
    skOpenRight('in a cafe', ['café']),
    skOpenRight('he has enough time', ['enough time']),
    skOpenRight('he loves exploring', ['explor']),
    skOpenRight('', ['dream'])
  ]);
  expect(r).toEqual([true, true, false, false, true, true, true, true, true, false]);
});

test('the student page: questions, marking by main words, the words with their Uzbek meaning, and the retelling reminder', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/skill.html?s=reading&st=b1&preview=1');
  await expect(page.locator('.sk-sub')).toHaveText(['True or False?', 'Answer the questions.']);
  const R = await page.evaluate(() => TA_SKILLS.steps[0].reading);
  const rows = page.locator('.sk-q');
  await expect(rows).toHaveCount(10);
  for (let i = 0; i < 5; i++) await rows.nth(i).locator('.sk-opt', { hasText: R.questions[i].a[0] }).first().click();
  await rows.nth(5).locator('input').fill('He takes a SHOWER and gets dressed.');   // right: has "shower"
  await rows.nth(6).locator('input').fill('At 20 o\'clock');                         // wrong: "20" is not "2"
  await page.getByRole('button', { name: /Submit/ }).click();
  await expect(page.locator('.sk-score')).toContainText('6 / 10');
  await expect(rows.nth(5)).toHaveClass(/right/);
  await expect(rows.nth(6)).toHaveClass(/wrong/);
  await expect(rows.nth(6).locator('.sk-fix')).toContainText('A good answer has:');
  await expect(page.locator('.sk-words li')).toHaveCount(10);
  await expect(page.locator('.sk-words li').first().locator('.sk-uz')).toHaveText('Odatda');
  await expect(page.locator('.sk-retell-card')).toContainText("Retell Daniel's day");
  await expect(page.locator('.sk-retell-card')).toContainText('Try to use at least 5 vocabulary items from the text.');
});
