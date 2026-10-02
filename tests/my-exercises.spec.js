// My Exercises: renaming an exercise.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

test('an exercise can be renamed, and the new name is kept', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1000);
  await hideNotices(page);
  const row = page.locator('.recent-exercise-row[data-uid="uset"]');
  await row.locator('.myex-rename').click();
  const input = page.locator('.myex-rename-input');
  await expect(input).toHaveValue('Sep test');
  await input.fill('Present simple — week 1');
  await input.press('Enter');
  await expect(row.locator('.recent-exercise-title')).toContainText('Present simple — week 1');
  await page.reload();
  await page.waitForTimeout(1000);
  await hideNotices(page);
  await expect(page.locator('.recent-exercise-row[data-uid="uset"] .recent-exercise-title')).toContainText('Present simple — week 1');
  // the "finished exercises" note uses the new name too
  await page.evaluate(() => showCompletionsWarning(getUncheckedCompletions()));
  await expect(page.locator('#taDoneWarn')).toContainText('Present simple — week 1');
  expect(errors).toEqual([]);
});

test('My Exercises has no "Disable Points" or "Make it a Jungle/Bamboozle" buttons', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1000);
  await expect(page.locator('.recent-exercise-row').first()).toBeVisible();
  await expect(page.locator('.recent-exercise-actions', { hasText: 'Disable Points' })).toHaveCount(0);
  await expect(page.locator('.recent-exercise-actions', { hasText: 'Make it a' })).toHaveCount(0);
});
