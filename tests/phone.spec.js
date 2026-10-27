// The teacher's app on a phone (2026-10-27): a ⟳ refresh button (no Ctrl+R), Results as small cards,
// notes that stay on the screen (their "Got it" reachable), no heavy blur, no blue flash on taps.
const { test, expect } = require('@playwright/test');
const { prepare, hideNotices, data } = require('./support/app');

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true });

  test('⟳ refresh is in the top bar; notes stay inside the screen with their buttons reachable', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/index.html');
    await page.waitForTimeout(2500);
    await expect(page.locator('#taRefreshBtn')).toBeVisible();
    // the "students finished" note and the old-files note together: the stack fits the screen and scrolls inside
    await page.evaluate(() => taOldFileWarnCheck());
    await page.waitForTimeout(600);
    const box = await page.locator('#taNoticeStack').boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    expect(box.y + box.height).toBeLessThanOrEqual(700);
    // nothing makes the page wider than the phone
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    // the top bar's buttons don't flash blue when tapped
    expect(await page.locator('.tb-tab').first().evaluate(el => getComputedStyle(el).webkitTapHighlightColor)).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  });

  test('Results: each result is a card — name and score on one line, time / checked / punish / date under it', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/results.html');
    await page.waitForTimeout(2000);
    await hideNotices(page);
    await page.evaluate(code => { document.getElementById('res-code-input').value = code; onResultsCodeInput(); }, data.DICTATION_CODE);
    const row = page.locator('table.results-table tbody tr').first();
    await expect(row).toBeVisible();
    const name = await row.locator('td.res-c-student').boundingBox();
    const score = await row.locator('td.res-c-score').boundingBox();
    const time = await row.locator('td.res-c-time').boundingBox();
    const check = await row.locator('td.res-c-check').boundingBox();
    expect(Math.abs(name.y - score.y)).toBeLessThan(24);          // the same line
    expect(score.x + score.width).toBeLessThanOrEqual(390);
    expect(time.y).toBeGreaterThan(name.y + 10);                   // the next line…
    expect(Math.abs(time.y - check.y)).toBeLessThan(24);           // …together
  });

  test('the glass design has no blur on phones (it made scrolling lag)', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/index.html');
    await page.waitForTimeout(1500);
    await page.evaluate(() => document.body.classList.add('glass-ui'));
    const blurred = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el =>
      [getComputedStyle(el), getComputedStyle(el, '::before')].some(cs => (cs.backdropFilter || 'none') !== 'none')).length);
    expect(blurred).toBe(0);
  });
});

test('on a computer there is no ⟳ button (Ctrl+R / F5 do it)', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/index.html');
  await page.waitForTimeout(1500);
  await expect(page.locator('#taRefreshBtn')).toBeHidden();
});
