// Old exercise files: files made before a fix keep the old problem, so the app
// points them out (My Exercises, Results, and a note on entry).
const { test, expect } = require('@playwright/test');
const { prepare, hideNotices, data } = require('./support/app');

const BEFORE = '2026-09-29T10:00:00.000Z';   // before the fixes of 2026-09-30
const ok = '<html><body><script>const INSTRUCTIONS = "Write about your day";<\/script></body></html>';
// how a Sentences file with instructions on two lines came out before the fix: the line break ends the string
const broken = '<html><body><script>const INSTRUCTIONS = "Write about\nyour day";<\/script></body></html>';
const item = (uid, title, typeLabel, date) => ({ uid, title, typeLabel, code: '7000' + uid.slice(-2), date, groupId: '' });
const exercises = [
  item('ubrk01', 'Broken sentences', 'Sentences', BEFORE),
  item('ufine2', 'Fine sentences', 'Sentences', BEFORE),
  item('umic03', 'Old pronunciation', 'Pronunciation', BEFORE),
  item('unew04', 'New pronunciation', 'Pronunciation', new Date().toISOString())
];
const storage = {
  ta_recent_exercises: JSON.stringify(exercises),
  ta_exercise_html_cache: JSON.stringify({ ubrk01: broken, ufine2: ok })
};

test('My Exercises points out files made before a fix', async ({ page, context }) => {
  await prepare(context, { storage });
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  const row = uid => page.locator('.recent-exercise-row[data-uid="' + uid + '"]');
  await expect(row('ubrk01').locator('.old-file-line')).toContainText("doesn't start");
  await expect(row('umic03').locator('.old-file-line')).toContainText('microphone');
  await expect(row('ufine2').locator('.old-file-line')).toHaveCount(0);
  await expect(row('unew04').locator('.old-file-line')).toHaveCount(0);
});

test('Results say when students used an old copy', async ({ page, context }) => {
  const docs = data.results(Date.now()).concat([
    { __id: 'p1', v: 1, code: '700020', type: 'Pronunciation', title: 'Sounds', name: 'Alice Test', studentId: '10001', score: 80, builtAt: BEFORE, date: new Date().toISOString(), submittedAt: new Date().toISOString() },
    { __id: 'p2', v: 1, code: '700020', type: 'Pronunciation', title: 'Sounds', name: 'Cora Test', studentId: '10003', score: 90, builtAt: new Date().toISOString(), date: new Date().toISOString(), submittedAt: new Date().toISOString() }
  ]);
  await prepare(context, { docs });
  await page.goto('/results.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  await page.evaluate(() => { document.getElementById('res-code-input').value = '700020'; onResultsCodeInput(); });
  await expect(page.locator('.old-file-note')).toContainText('1 result came from a copy made before a fix');
  await expect(page.locator('.old-file-note')).toContainText('microphone');
  // a code whose files are all new: no note
  await page.evaluate(code => { document.getElementById('res-code-input').value = code; onResultsCodeInput(); }, data.DICTATION_CODE);
  await expect(page.locator('.results-table').first()).toBeVisible();
  await expect(page.locator('.old-file-note')).toHaveCount(0);
});

test('on entry, a note lists the old files until "Got it"', async ({ page, context }) => {
  await prepare(context, { storage });
  await page.goto('/index.html');
  const warn = page.locator('#taOldFileWarn');
  await expect(warn).toHaveClass(/show/, { timeout: 20000 });
  await expect(warn).toContainText('Broken sentences');
  await expect(warn).toContainText('Old pronunciation');
  await expect(warn).not.toContainText('Fine sentences');
  await warn.locator('.done-warn-later').click();
  await expect(warn).not.toHaveClass(/show/);
  await page.reload();
  await page.waitForTimeout(14000);
  await expect(page.locator('#taOldFileWarn.show')).toHaveCount(0);
});
