// Statistics: one chart per exercise type — the last 7 days, today compared with yesterday,
// and today's piece of the line dashed (the day isn't over yet).
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

test('each exercise type has its own 7-day chart, with today compared with yesterday', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/statistics.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(() => {
    const D = 864e5, L = [];
    const add = (type, ago, n, id) => { for (let k = 0; k < n; k++) L.push({ exerciseType: type, studentId: id || '10001', date: new Date(Date.now() - ago * D).toISOString() }); };
    add('Word Order', 1, 1); add('Word Order', 0, 3);
    add('Flashcard', 1, 2); add('Flashcard', 0, 1);
    add('Spelling', 9, 5);                 // older than 7 days: no chart
    add('Test', 0, 4, 'not-on-the-list');  // not one of the teacher's students
    window.__pointsLedger = L; window.__plainCompletions = []; renderDashboard();
  });
  const cards = page.locator('#dashboardWrap .stats-chart');
  await expect(cards).toHaveCount(2);
  const wo = page.locator('.stats-chart[data-type="Word Order"]');
  await expect(wo.locator('.sc-today')).toContainText('3 today');
  await expect(wo.locator('.sc-change.up')).toContainText('2 more than yesterday');
  await expect(wo.locator('.sc-week')).toContainText('4 in the last 7 days');
  await expect(wo.locator('.sc-day')).toHaveCount(7);
  await expect(wo.locator('.sc-tail')).toHaveAttribute('stroke-dasharray', /\d/);
  await expect(page.locator('.stats-chart[data-type="Flashcard"] .sc-change.down')).toContainText('1 fewer than yesterday');
  // nothing in the last 7 days
  await page.evaluate(() => { window.__pointsLedger = []; renderDashboard(); });
  await expect(page.locator('#dashboardWrap')).toContainText('No exercises were done in the last 7 days');
  expect(errors).toEqual([]);
});
