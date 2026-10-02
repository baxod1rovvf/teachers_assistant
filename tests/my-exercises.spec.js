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

// Files over 1 MB (sets with pictures, dictations with audio) don't fit in the browser's
// small storage: they're kept in IndexedDB, so Redownload / Get one exercise work for them.
test('a big exercise file (over 1 MB) is kept, and is still there after a reload', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(800);
  const big = '<html><body>' + 'x'.repeat(2200000) + '</body></html>';
  await page.evaluate(html => pushRecentExercise({ title: 'Big pictures', typeLabel: 'Word Order', code: '654321', uid: 'ubig', html }), big);
  await page.waitForTimeout(500);
  await page.reload();
  const len = await page.evaluate(async () => { await taLoadBigFiles(); const h = getCachedExerciseHtml('ubig'); return h ? h.length : 0; });
  expect(len).toBe(big.length);
});

test('a set whose file isn\'t kept here gets it back from its online link (Get one exercise)', async ({ page, context }) => {
  const round = code => '<html><head></head><body><script>const EXERCISE_CODE = "' + code + '"; const EXERCISE_UID = "r' + code + '"; const REQUIRED_CODE = ""; const POINTS_AWARD = 5;<\/script></body></html>';
  const setHtml = '<html><body><script>\nconst HWC_ROUNDS = ' + JSON.stringify([{ label: 'One', html: round('111111'), code: '111111' }, { label: 'Two', html: round('222222'), code: '222222' }]) + ';\n<\/script></body></html>';
  const half = Math.ceil(setHtml.length / 2);
  const parts = [setHtml.slice(0, half), setHtml.slice(half)];
  await prepare(context, { storage: { ta_recent_exercises: JSON.stringify([{ uid: 'uset2', title: 'Pictures set', typeLabel: 'Homework', code: '333333',
    date: new Date().toISOString(), playAt: new Date().toISOString(), playParts: 2, mergedItems: [{ title: 'One', typeLabel: 'One' }, { title: 'Two', typeLabel: 'Two' }] }]) } });
  let fetched = 0;
  await page.route(/firestore\.googleapis\.com\/v1\/.*\/documents\/results\/play-uset2/, route => {
    const i = /play-uset2-(\d+)/.test(route.request().url()) ? +route.request().url().match(/play-uset2-(\d+)/)[1] : 0;
    fetched++;
    route.fulfill({ contentType: 'application/json', body: JSON.stringify({ fields: { type: { stringValue: 'TA_SYNC:PLAY' }, title: { stringValue: 'uset2␟' + i + '␟2' }, data: { stringValue: parts[i] } } }) });
  });
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1000);
  await hideNotices(page);
  await page.locator('.recent-exercise-row[data-uid="uset2"] button', { hasText: 'Get one exercise' }).click();
  await expect(page.locator('.set-round-row')).toHaveCount(2, { timeout: 8000 });
  expect(fetched).toBe(2);
  // kept from now on: no second download
  expect(await page.evaluate(() => (getCachedExerciseHtml('uset2') || '').length)).toBe(setHtml.length);
});
