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

test('Redownload is inside Share, under the link', async ({ page, context }) => {
  await prepare(context, { storage: {
    ta_recent_exercises: JSON.stringify([{ uid: 'uw1', title: 'Animals', typeLabel: 'Word Order', code: '123456', date: new Date().toISOString() }]),
    ta_exercise_html_cache: JSON.stringify({ uw1: '<html><body>exercise</body></html>' })
  } });
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1000);
  await hideNotices(page);
  const row = page.locator('.recent-exercise-row[data-uid="uw1"]');
  await expect(row.locator('.recent-exercise-actions')).not.toContainText('Redownload');
  await row.locator('button', { hasText: 'Share' }).click();
  const dl = page.locator('[data-act="redownload"]');
  await expect(dl).toBeVisible();
  // right under the link (there's no link on this test address), above the message
  const around = await page.evaluate(() => { const d = document.querySelector('.share-dl-row');
    return [d.previousElementSibling ? d.previousElementSibling.className : '', d.nextElementSibling.textContent]; });
  expect(around[0]).toMatch(/^(share-link-row|)$/);
  expect(around[1]).toContain('Message for your students');
  const [download] = await Promise.all([page.waitForEvent('download'), dl.click()]);
  expect(download.suggestedFilename()).toBe('Animals.html');
});
