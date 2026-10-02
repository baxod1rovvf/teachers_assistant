// The top-right warnings: lessons in the next 24 hours (with Ready and a
// reminder every 2 hours), and students who finished exercises (until Checked).
const { test, expect } = require('@playwright/test');
const { prepare, hideNotices } = require('./support/app');

function lessonsFromNow(hours) {
  const now = Date.now();
  return hours.map((h, i) => {
    const d = new Date(now + h * 3600000);
    return { id: String(1700000000001 + i), group: ['Target', 'Apex', 'Target'][i % 3], level: 'B1', day: d.getDay(),
      time: String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') };
  });
}

test('lessons in the next 24 hours: warned on entry, Ready, and a reminder every 2 hours until ready', async ({ page, context }) => {
  await prepare(context, { storage: { ta_weekly_schedule: JSON.stringify(lessonsFromNow([3, 20, 72])) } });
  await page.goto('/index.html');
  const warn = page.locator('#taLessonWarn');
  await expect(warn).toHaveClass(/show/, { timeout: 5000 });
  await expect(warn.locator('.lesson-warn-row')).toHaveCount(2);        // the lesson in 3 days isn't listed
  await expect(warn).not.toHaveClass(/show/, { timeout: 8000 });         // gone after 5 seconds

  // Ready on the dashboard, kept after a reload
  await hideNotices(page);
  const first = page.locator('#mainLessonsList .lesson-ready-btn').first();
  await expect(first).toHaveText('Ready');
  await first.click();
  await expect(page.locator('#mainLessonsList .lesson-ready-btn').first()).toHaveText('✅ Ready');

  // 1 hour later: no reminder yet; 2 hours later: only the lesson that isn't ready
  await page.evaluate(() => { localStorage.setItem('ta_ready_reminded_at', String(Date.now() - 3600e3)); taReadyReminderCheck(); });
  await expect(warn).not.toHaveClass(/show/);
  await page.evaluate(() => { localStorage.setItem('ta_ready_reminded_at', String(Date.now() - 2.01 * 3600e3)); taReadyReminderCheck(); });
  await expect(warn).toHaveClass(/show/);
  await expect(warn).toContainText("isn't ready yet");
  await expect(warn.locator('.lesson-warn-row')).toHaveCount(1);
});

test('students who finished exercises are listed until checked', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/index.html');
  const done = page.locator('#taDoneWarn');
  await expect(done).toHaveClass(/show/, { timeout: 8000 });
  const names = await done.locator('.lesson-warn-main b').allTextContents();
  expect(names).toEqual(expect.arrayContaining(['Alice Test', 'Bobur Test', 'Dilya Test', 'Eldor Test']));
  await done.locator('.lesson-warn-row', { hasText: 'Alice Test' }).locator('.done-warn-check').click();
  await expect(done).not.toContainText('Alice Test');
  await done.locator('.done-warn-all').click();
  await page.reload();
  await page.waitForTimeout(5000);
  await expect(page.locator('#taDoneWarn.show')).toHaveCount(0);
});

test('each exercise in the "finished exercises" note opens that exercise\'s own results', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/index.html');
  const done = page.locator('#taDoneWarn');
  await expect(done).toHaveClass(/show/, { timeout: 8000 });
  // Bobur did the Kitchen dictation; Dilya did the "Sep test" homework set
  await expect(done.locator('.lesson-warn-row', { hasText: 'Dilya Test' }).locator('.done-warn-ex')).toContainText('Sep test · 3 exercises');
  await done.locator('.lesson-warn-row', { hasText: 'Bobur Test' }).locator('.done-warn-ex').click();
  await expect(page.locator('#activeCodeValue')).toHaveText('Kitchen', { timeout: 8000 });
  await expect(page.locator('.results-table tbody tr', { hasText: 'Bobur Test' })).toBeVisible();
  await page.goto('/index.html');
  await expect(done).toHaveClass(/show/, { timeout: 8000 });
  await done.locator('.lesson-warn-row', { hasText: 'Dilya Test' }).locator('.done-warn-ex').click();
  await expect(page.locator('#activeCodeValue')).toHaveText('Sep test', { timeout: 8000 });
  await expect(page.locator('.hwc-student-row', { hasText: 'Dilya Test' })).toBeVisible();
});
