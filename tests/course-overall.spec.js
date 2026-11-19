// A step's Overall counts every part whose link was sent; a part not done counts 0 (teacher, 2026-11-19: "reading 9,
// listening and writing not done → 9/3 = 3"). Parts not sent don't count; a writing waiting for the AI shows ⏳.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const ago = new Date(Date.now() - 60000).toISOString();
const res = (id, code, skill, studentId, name, extra) => Object.assign({ __id: id, v: 1, code, skill, step: 'b1', name, studentId, date: ago, submittedAt: ago,
  type: skill[0].toUpperCase() + skill.slice(1) + ' course', title: 'Step 1 · Daily Routine — ' + skill }, extra || {});
const R9 = (sid, name) => res('sk_RDG222_' + sid + '_1', 'RDG222', 'reading', sid, name, { correct: 10, total: 10, score: 100 });
const L9 = (sid, name) => res('sk_LST111_' + sid + '_1', 'LST111', 'listening', sid, name, { correct: 10, total: 10, score: 100 });
const Wwait = (sid, name) => res('sk_WRT555_' + sid + '_1', 'WRT555', 'writing', sid, name, { text: 'I wake up at seven every day.', words: 7, minWords: 80, maxWords: 100 });
const ALL = { 'g1|listening|b1': { code: 'LST111' }, 'g1|reading|b1': { code: 'RDG222' }, 'g1|writing|b1': { code: 'WRT555' } };

async function openStep(page, context, docs, links) {
  await prepare(context, { docs, storage: { ta_skills_links: JSON.stringify(links), ta_course_group: 'g1' } });
  const errors = watchErrors(page);
  await page.goto('/course.html');
  await page.waitForFunction(n => (window.__allResults || []).length >= n, docs.length, { timeout: 10000 });
  await hideNotices(page);
  await page.locator('.sk-gcard[data-group="g1"] .sk-gcard-open').click();
  await page.locator('.sk-node[data-step="b1"]').click();
  return errors;
}
const row = (page, name) => page.locator('.sk-rt-row', { hasText: name });

test('Overall: Reading 9 with Listening and Writing sent but not done → 3, the missing parts show 0', async ({ page, context }) => {
  const errors = await openStep(page, context, [R9('10001', 'Alice Test')], ALL);
  const r = row(page, 'Alice Test');
  await expect(r.locator('.sk-rt-overall b')).toHaveText('3');
  await expect(r.locator('.sk-rt-cell').nth(0)).toContainText('0');
  await expect(r.locator('.sk-rt-cell').nth(0)).toContainText('not done');
  await expect(r.locator('.sk-rt-cell').nth(1)).toContainText('9');
  expect(errors).toEqual([]);
});

test('Overall: parts whose link wasn\'t sent don\'t count (only Reading sent → 9)', async ({ page, context }) => {
  const errors = await openStep(page, context, [R9('10001', 'Alice Test')], { 'g1|reading|b1': { code: 'RDG222' } });
  await expect(row(page, 'Alice Test').locator('.sk-rt-overall b')).toHaveText('9');
  expect(errors).toEqual([]);
});

test('Overall: a writing waiting for the AI shows ⏳ instead of a number', async ({ page, context }) => {
  const errors = await openStep(page, context, [R9('10001', 'Alice Test'), L9('10001', 'Alice Test'), Wwait('10001', 'Alice Test')], ALL);
  await expect(row(page, 'Alice Test').locator('.sk-rt-overall')).toHaveText('⏳');
  expect(errors).toEqual([]);
});

test('the shared results link carries the sent parts, and its Overall counts a part not done as 0', async ({ page, context }) => {
  await openStep(page, context, [R9('10001', 'Alice Test')], ALL);
  const d = await page.evaluate(() => window.skShareData('b1', skGroup('g1')));
  expect(d.parts).toEqual(['listening', 'reading', 'writing']);
  const r = d.rows.find(x => x.name === 'Alice Test');
  expect(r.listening).toEqual({ band: 0, raw: 'not done' });
  expect(r.writing).toBeNull();
  // the results link works Overall out the same way (skStepOverall in js/skill-bands.js)
  const o = await page.evaluate(() => skStepOverall([{ sent: true, band: 0 }, { sent: true, band: 9 }, { sent: true, band: null }]));
  expect(o).toEqual({ overall: 3, pending: false });
});
