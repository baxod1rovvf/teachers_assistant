// A step's page lists, under its results table, the group's students who haven't done every part whose link was sent,
// with what's missing, and copies it as a ready message for the group's chat (teacher, 2026-11-13).
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const ago = new Date(Date.now() - 60000).toISOString();
const res = (id, code, skill, studentId, name, extra) => Object.assign({ __id: id, v: 1, code, skill, step: 'b1', name, studentId, date: ago, submittedAt: ago,
  type: skill[0].toUpperCase() + skill.slice(1) + ' course', title: 'Step 1 · Daily Routine — ' + skill }, extra || {});
const L = (sid, name) => res('sk_LST111_' + sid + '_1', 'LST111', 'listening', sid, name, { correct: 8, total: 10, score: 80 });
const R = (sid, name) => res('sk_RDG222_' + sid + '_1', 'RDG222', 'reading', sid, name, { correct: 7, total: 10, score: 70 });
const W = (sid, name) => res('sk_WRT555_' + sid + '_1', 'WRT555', 'writing', sid, name, { text: 'I wake up at seven.', words: 5, minWords: 80, maxWords: 100 });
const ALL_LINKS = { 'g1|listening|b1': { code: 'LST111' }, 'g1|reading|b1': { code: 'RDG222' }, 'g1|writing|b1': { code: 'WRT555' } };

async function openStep(page, context, docs, links) {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await prepare(context, { docs, storage: { ta_skills_links: JSON.stringify(links), ta_course_group: 'g1' } });
  const errors = watchErrors(page);
  await page.goto('/course.html');
  await page.waitForFunction(n => (window.__allResults || []).length >= n, docs.length, { timeout: 10000 });
  await hideNotices(page);
  await page.addStyleTag({ content: '#taNoticeStack { display: none !important; }' });
  await page.locator('.sk-gcard[data-group="g1"] .sk-gcard-open').click();
  await page.locator('.sk-node[data-step="b1"]').click();
  return errors;
}

test('Not finished: the students missing a sent part, most missing first, and Copy list gives a ready message', async ({ page, context }) => {
  // Target: Alice did everything, Bobur only Listening, Cora nothing
  const errors = await openStep(page, context, [L('10001', 'Alice Test'), R('10001', 'Alice Test'), W('10001', 'Alice Test'), L('10002', 'Bobur Test')], ALL_LINKS);
  const box = page.locator('.sk-missing');
  await expect(box.locator('h3')).toHaveText('🚫 Not finished — Target (2)');
  const items = box.locator('.sk-missing-list li');
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText('Cora Test');
  await expect(items.nth(0).locator('.sk-missing-part')).toHaveText(['🎧 Listening', '📖 Reading', '✍️ Writing']);
  await expect(items.nth(1)).toContainText('Bobur Test');
  await expect(items.nth(1).locator('.sk-missing-part')).toHaveText(['📖 Reading', '✍️ Writing']);
  await expect(box).not.toContainText('Alice Test');
  await box.getByRole('button', { name: '📋 Copy list' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(
    'Step 1 · Daily Routine — Target\nNot finished yet:\n1. Cora Test — Listening, Reading, Writing\n2. Bobur Test — Reading, Writing');
  expect(errors).toEqual([]);
});

test('Not finished: only parts whose link was sent count; everyone done → a 🎉 note and no Copy button', async ({ page, context }) => {
  // only the Listening link was sent: Bobur (who did it) isn't listed, Cora is, for Listening only
  let errors = await openStep(page, context, [L('10001', 'Alice Test'), L('10002', 'Bobur Test')], { 'g1|listening|b1': { code: 'LST111' } });
  const box = page.locator('.sk-missing');
  await expect(box.locator('h3')).toHaveText('🚫 Not finished — Target (1)');
  await expect(box.locator('.sk-missing-list li')).toHaveCount(1);
  await expect(box.locator('.sk-missing-list li')).toContainText('Cora Test');
  await expect(box.locator('.sk-missing-part')).toHaveText(['🎧 Listening']);
  expect(errors).toEqual([]);
  // everyone has done the sent part
  await page.evaluate(() => {
    const d = { __id: 'sk_LST111_10003_1', v: 1, code: 'LST111', skill: 'listening', step: 'b1', name: 'Cora Test', studentId: '10003', type: 'Listening course',
      correct: 9, total: 10, score: 90, date: new Date().toISOString(), submittedAt: new Date().toISOString() };
    window.__allResults.push(d);
    window.taCourseResultsChanged();
  });
  await expect(box.locator('h3')).toHaveText('🚫 Not finished — Target (0)');
  await expect(box).toContainText('Everyone has finished');
  await expect(box.getByRole('button', { name: '📋 Copy list' })).toHaveCount(0);
});

test('Not finished: no list before any link is sent', async ({ page, context }) => {
  const errors = await openStep(page, context, [], {});
  await expect(page.locator('.sk-results')).toBeVisible();
  await expect(page.locator('.sk-missing')).toHaveCount(0);
  expect(errors).toEqual([]);
});
