// Students & Points: groups with their lesson times, students' IDs and points in one
// section; the profile (picture, name, language, log out) in the top bar and on the
// Dashboard; Settings keeps only Install, Backup and Status.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

async function open(page, file) {
  await page.goto('/' + file);
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.addStyleTag({ content: '#taNoticeStack { display: none !important; }' }); // notes that come later
}
const schedule = page => page.evaluate(() => getWeeklySchedule());

test('the menu has one "Students & Points" section; the old Points address lands there', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await open(page, 'index.html');
  await expect(page.locator('.tb-tab[data-tab="students"]')).toHaveAttribute('title', 'Students');
  await expect(page.locator('[data-tab="points"]')).toHaveCount(0);
  await page.goto('/points.html');
  await page.waitForURL(/students/);
  await expect(page.locator('#panel-students')).toHaveClass(/active/, { timeout: 8000 });
  expect(errors).toEqual([]);
});

test('inside a group: each student\'s name (✎ 🗑), ID and points with − / +', async ({ page, context }) => {
  await prepare(context);
  await open(page, 'students.html');
  await expect(page.locator('.group-block', { hasText: 'Target' }).locator('[data-group-pts]')).toContainText('🪙 0');
  await page.locator('.group-block', { hasText: 'Target' }).click();
  await expect(page.locator('.sp-head')).toContainText('Name');
  const row = page.locator('.sp-row', { hasText: 'Alice Test' });
  await expect(row.locator('.sp-name .sp-id')).toHaveText('10001'); // the ID sits next to the name, after 🗑
  // "➕ Add student" shows ID, then Name below it
  await expect(page.locator('#pt-student-id')).toHaveCount(0);
  await page.locator('.sp-add-row .mini-btn', { hasText: 'Add student' }).click();
  const idBox = await page.locator('#pt-student-id').boundingBox(), nameBox = await page.locator('#pt-student-name').boundingBox();
  expect(nameBox.y).toBeGreaterThan(idBox.y);
  await page.fill('#pt-student-id', '10009');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Gulnora Test');
  await page.keyboard.press('Enter');
  await expect(page.locator('.sp-row', { hasText: 'Gulnora Test' }).locator('.sp-id')).toHaveText('10009');
  await expect(page.locator('#pt-student-id')).toBeFocused(); // ready for the next one
  await expect(row.locator('.sp-pts')).toHaveText('🪙 0');
  // give 7 points: the number changes without redrawing the list
  await page.fill('#pt-student-name', 'half-typed');
  await row.locator('.pt-adjust-btn.plus').click();
  await page.fill('#pointsAmountInput', '7');
  await page.locator('.pt-amount-ok').click();
  await expect(row.locator('.sp-pts')).toHaveText('🪙 7', { timeout: 8000 });
  await expect(page.locator('#pt-student-name')).toHaveValue('half-typed');
  await expect(page.locator('.group-detail-head [data-group-pts]')).toHaveText('🪙 7');
  // tapping the points shows where they came from
  await row.locator('.sp-pts').click();
  await expect(page.locator('#pointsModalBody')).toContainText('Bonus: By Teacher');
  await page.locator('#pointsModalBackdrop .points-modal-close').click();
  // ✎: name and group
  await row.locator('.sp-icon-btn', { hasText: '✎' }).click();
  await page.locator('.stu-edit-name').fill('Alice Renamed');
  await page.locator('.stu-edit-group').selectOption('g2');
  await page.locator('.ta-modal [data-act="ok"]').click();
  expect(await page.evaluate(() => getPointsRoster().find(s => s.id === '10001'))).toMatchObject({ name: 'Alice Renamed', group: 'g2' });
  await expect(page.locator('.sp-row', { hasText: 'Alice' })).toHaveCount(0); // moved to Apex
  // 🗑 takes a student off (with Undo)
  await page.locator('.sp-row', { hasText: 'Bobur Test' }).locator('.sp-icon-btn.danger').click();
  await expect(page.locator('.sp-row', { hasText: 'Bobur Test' })).toHaveCount(0);
  await page.locator('.toast-undo').click();
  await expect(page.locator('.sp-row', { hasText: 'Bobur Test' })).toHaveCount(1);
});

test('a new group gets its lesson days and times, which show in Upcoming Lessons', async ({ page, context }) => {
  await prepare(context);
  await open(page, 'students.html');
  await page.locator('.groups-toolbar .mini-btn', { hasText: 'Add group' }).click();
  await page.locator('.gsched-group-name').fill('Evening B1');
  for (const day of ['1', '3']) await page.locator('.gsched-day[data-day="' + day + '"] input[type="checkbox"]').check();
  await page.locator('.gsched-day[data-day="3"] input[type="time"]').fill('18:30');
  await expect(page.locator('.gsched-level option')).toContainText(['No level', 'Beginner', 'Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'IELTS']);
  await page.locator('.gsched-level').selectOption('Intermediate');
  await page.locator('.ta-modal [data-act="ok"]').click();
  await expect(page.locator('.group-block', { hasText: 'Evening B1' })).toContainText('Mon / Wed');
  const lessons = (await schedule(page)).filter(e => e.group === 'Evening B1').sort((a, b) => a.day - b.day);
  expect(lessons.map(e => [e.day, e.time, e.level])).toEqual([[1, '16:00', 'Intermediate'], [3, '18:30', 'Intermediate']]);
  await page.evaluate(() => switchTo('main'));
  await expect(page.locator('#mainLessonsList')).toContainText('Evening B1');
  // the group's name on a lesson opens its plan
  await page.locator('#mainLessonsList .lesson-plan-open').first().click();
  await expect(page.locator('#lessonPlanModalBackdrop')).toHaveClass(/show/);
});

test('changing a group renames its lessons and drops unticked days; deleting it removes them (Undo puts them back)', async ({ page, context }) => {
  const now = Date.now();
  await prepare(context, { storage: { ta_weekly_schedule: JSON.stringify([
    { id: 'sch_' + (now - 864e6) + '_a', day: 2, time: '15:00', group: 'Target', level: 'A2', plan: { notes: 'keep me', exerciseUids: [], materialIds: [] } },
    { id: 'sch_' + (now - 864e6) + '_b', day: 4, time: '15:00', group: 'Target', level: 'A2', plan: { notes: '', exerciseUids: [], materialIds: [] } },
    { id: 'sch_' + (now - 864e6) + '_c', day: 5, time: '10:00', group: 'Apex', level: '', plan: { notes: '', exerciseUids: [], materialIds: [] } }
  ]) } });
  await open(page, 'students.html');
  await expect(page.locator('.group-block', { hasText: 'Target' })).toContainText('Tue / Thu');
  await page.locator('.group-block', { hasText: 'Target' }).locator('.sp-icon-btn', { hasText: '✎' }).click();
  await expect(page.locator('.gsched-day[data-day="2"] input[type="checkbox"]')).toBeChecked();
  await page.locator('.gsched-group-name').fill('Target A2');
  await page.locator('.gsched-day[data-day="4"] input[type="checkbox"]').uncheck();
  await page.locator('.ta-modal [data-act="ok"]').click();
  let list = await schedule(page);
  expect(list.filter(e => e.group === 'Target A2').map(e => [e.day, e.plan.notes])).toEqual([[2, 'keep me']]);
  expect(list.some(e => e.group === 'Target')).toBe(false);
  expect(await page.evaluate(() => getStudentGroups().find(g => g.id === 'g1').name)).toBe('Target A2');
  // delete the group: its lesson goes too, and Undo brings both back
  await page.locator('.group-block', { hasText: 'Target A2' }).locator('.sp-icon-btn.danger').click();
  list = await schedule(page);
  expect(list.map(e => e.group)).toEqual(['Apex']);
  await page.locator('.toast-undo').click();
  list = await schedule(page);
  expect(list.map(e => e.group).sort()).toEqual(['Apex', 'Target A2']);
  await expect(page.locator('.group-block', { hasText: 'Target A2' })).toBeVisible();
});

test('profile: the top bar\'s picture opens a menu — name + language, change picture, log out; the Dashboard shows the task animation', async ({ page, context }) => {
  await prepare(context);
  await open(page, 'index.html');
  await expect(page.locator('.hero-account-chip')).toHaveCount(0);
  await expect(page.locator('#heroTaskAnim svg')).toHaveCount(1, { timeout: 8000 });   // the "task" animation is playing
  await expect(page.locator('#taTopbar .tb-brand')).toContainText("Teacher's Assistant");
  await page.locator('#tbAvatarBtn').click();
  await expect(page.locator('#tbProfileMenu')).toBeVisible();
  await expect(page.locator('#tbProfileMenu')).toContainText('Log out');
  const chooser = page.waitForEvent('filechooser');
  await page.locator('#tbProfileMenu .tb-menu-item', { hasText: 'Change profile picture' }).click();
  await chooser;
  await expect(page.locator('#tbProfileMenu')).toBeHidden();
  await page.locator('#tbAvatarBtn').click();
  await page.locator('#tbProfileMenu .tb-menu-head').click();
  await expect(page.locator('.ta-modal .lang-choice')).not.toHaveCount(0);
  await page.locator('.profile-name-input').fill('Ms Test');
  await page.locator('.ta-modal [data-act="ok"]').click();
  await expect(page.locator('#tbProfileName')).toHaveText('Ms Test');
  await expect(page.locator('#mainGreetingName')).toHaveText('Ms Test');
  page.once('dialog', d => d.dismiss());
  await page.locator('#tbAvatarBtn').click();
  await page.locator('#tbProfileMenu .tb-menu-item.danger').click(); // asks first; dismissed, so still signed in
  await expect(page.locator('#tbProfileName')).toHaveText('Ms Test');
});

test('Settings keeps only Install on this device, Backup and Status', async ({ page, context }) => {
  await prepare(context);
  await open(page, 'settings.html');
  const labels = await page.locator('#panel-settings .title-field > .field-label').allTextContents();
  expect(labels.map(l => l.replace(/^\W+/, '').trim())).toEqual(['Install on this device', 'Backup', 'Status']);
  await expect(page.locator('#panel-settings')).not.toContainText('Share Teacher');
  await expect(page.locator('#panel-settings')).not.toContainText('Weekly Lesson Schedule');
});

test('in a group, every student\'s ✎, 🗑 and ID stand in straight columns', async ({ page, context }) => {
  await prepare(context);
  await open(page, 'students.html');
  await page.evaluate(() => {
    const g = getRosterByGroup().find(b => b.students.length);
    openStudentGroup(g.id);
  });
  const rows = page.locator('.sp-table .sp-row');
  expect(await rows.count()).toBeGreaterThan(1);
  const lefts = await rows.evaluateAll(list => list.map(r => [...r.querySelectorAll('.sp-icon-btn, .sp-id')].map(el => Math.round(el.getBoundingClientRect().left))));
  for (const l of lefts) expect(l).toEqual(lefts[0]);
});
