// Every page of the app opens without errors, and the sidebar moves between them.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const PAGES = ['index.html', 'create.html', 'statistics.html', 'my-exercises.html', 'students.html', 'results.html', 'points.html', 'settings.html'];

for (const file of PAGES) {
  test(`${file} opens without errors`, async ({ page, context }) => {
    await prepare(context);
    const errors = watchErrors(page);
    await page.goto('/' + file);
    await page.waitForTimeout(1500);
    await expect(page.locator('#mainSidebar')).toBeAttached();
    expect(errors).toEqual([]);
  });
}

test('the sidebar opens each section without reloading', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/index.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  for (const [tab, panel] of [['myexercises', '#panel-myexercises'], ['students', '#panel-students'], ['results', '#panel-results'], ['main', '#panel-main']]) {
    await page.evaluate(t => switchTo(t), tab);
    await expect(page.locator(panel)).toHaveClass(/active/, { timeout: 5000 });
  }
  expect(errors).toEqual([]);
});

test('signed out, the login screen shows', async ({ page, context }) => {
  await prepare(context, { signedIn: false });
  await page.goto('/index.html');
  await page.waitForTimeout(1200);
  await expect(page.locator('#welcomeSplashOverlay')).toBeVisible();
});

// After an update, another section must never come in as a different version of the
// app (one section new, another old): it opens with a full page load instead.
test('a section from another version of the app opens with a full page load', async ({ page, context }) => {
  await prepare(context);
  // Results comes from another version of the app (before the background loading reaches it)
  let served = false;
  await page.route(/\/results\.html$/, async route => {
    const res = await route.fetch();
    const html = (await res.text()).replace(/\?v=[\w]+/g, '?v=19990101a');
    served = true;
    await route.fulfill({ response: res, body: html });
  });
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  expect(await page.evaluate(() => !document.getElementById('panel-results'))).toBe(true); // not mixed in by the background loading
  await page.evaluate(() => { window.__noReload = true; });
  await page.evaluate(() => taNavigate('results.html'));
  await page.waitForURL(/results\.html/);
  await expect(page.locator('#panel-results')).toBeVisible({ timeout: 8000 });
  expect(served).toBe(true);
  expect(await page.evaluate(() => window.__noReload)).toBeUndefined(); // the page was loaded again
});

test('another section is asked for fresh from the server, not the browser\'s saved copy', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1200);
  const mode = await page.evaluate(async () => {
    let seen = null;
    const real = window.fetch;
    window.fetch = (url, init) => { if (/results\.html$/.test(String(url))) seen = init && init.cache; return real(url, init); };
    delete TA_PAGE_HTML['results.html'];
    await taFetchPage('results.html');
    window.fetch = real;
    return seen;
  });
  expect(mode).toBe('no-cache');
});

test('Results isn\'t in the menu: it opens from View Results, with a way back to My Exercises', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await expect(page.locator('.side-btn[data-tab="results"]')).toBeHidden();
  await page.locator('.myex-card', { hasText: 'Kitchen' }).locator('.myex-results').click();
  await expect(page.locator('#panel-results')).toHaveClass(/active/, { timeout: 8000 });
  await page.locator('.res-back-btn').click();
  await expect(page.locator('#panel-myexercises')).toHaveClass(/active/, { timeout: 8000 });
});

test('on a computer, the other sections load in the background, so opening one is instant', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/index.html');
  await expect.poll(() => page.evaluate(() => ['panel-myexercises', 'panel-students', 'panel-settings', 'panel-createpicker'].every(id => document.getElementById(id))), { timeout: 15000 }).toBe(true);
  const ms = await page.evaluate(() => { const t0 = performance.now(); switchTo('students'); return performance.now() - t0; });
  expect(ms).toBeLessThan(500);
  await expect(page.locator('#panel-students')).toHaveClass(/active/);
});
