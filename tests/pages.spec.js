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
