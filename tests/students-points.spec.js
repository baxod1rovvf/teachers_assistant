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

test('profile: the top bar\'s picture opens a menu — name + language, change picture, log out; the Dashboard shows the laptop animation', async ({ page, context }) => {
  await prepare(context);
  await open(page, 'index.html');
  await expect(page.locator('.hero-account-chip')).toHaveCount(0);
  await expect(page.locator('#heroEyebrow')).toContainText(/session/i);   // the date line over the greeting (2026-11-07)
  await expect(page.locator('#taTopbar .tb-brand')).toContainText(/loom/i);
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

/* ---- Changing a student's ID (teacher, 2026-11-18): ✎ has an ID box; the old ID is kept in oldIds, so the student keeps
   their results, points and links ---- */
const data = require('./support/data');
const nowIso = () => new Date().toISOString();
// Cora (Target) had ID 30003 before the teacher changed it to 10003
// a class list as Copy link put it online (the students' hashes don't matter here)
const classRec = (code, extra) => Object.assign({ __id: 'class-' + code, v: 1, code: 'TAUSER', builtAt: '', type: 'TA_SYNC:CLASS', title: code, name: '',
  data: '[]', score: 0, warnings: 0, timeSeconds: 0, timeDisplay: '00:00', date: nowIso() }, extra || {});
const classList = (page, code) => page.evaluate(c => { const d = window.__fakeDocs.find(x => x.__id === 'class-' + c); return d ? { h: JSON.parse(d.data).map(e => e.h), prev: d.prev, group: d.group } : null; }, code);
const CORA_MOVED = data.roster.map(s => s.id === '10003' ? Object.assign({}, s, { oldIds: ['30003'] }) : s);

test('✎ changes a student\'s ID: the old one is kept; empty, taken (now or before) are refused; going back works', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await open(page, 'students.html');
  await page.locator('.group-block', { hasText: 'Target' }).click();
  const edit = async (name, id) => {
    await page.locator('.sp-row', { hasText: name }).locator('.sp-icon-btn', { hasText: '✎' }).click();
    await expect(page.locator('.ta-modal .stu-edit-name')).toBeFocused();   // the window puts the cursor in Name first
    await page.locator('.ta-modal .stu-edit-id').fill(id);
    await page.locator('.ta-modal [data-act="ok"]').click();
  };
  const alice = () => page.evaluate(() => getPointsRoster().find(s => s.name === 'Alice Test'));
  await page.locator('.sp-row', { hasText: 'Alice Test' }).locator('.sp-icon-btn', { hasText: '✎' }).click();
  await expect(page.locator('.ta-modal .stu-edit-id')).toHaveValue('10001');
  await expect(page.locator('.ta-modal')).not.toContainText('stays the same');
  await page.locator('.ta-modal [data-act="cancel"]').click();
  // empty → refused
  await edit('Alice Test', '  ');
  await expect(page.locator('#toast')).toContainText('ID can\'t be empty');
  await page.locator('.ta-modal [data-act="cancel"]').click();
  // another student's ID → refused (taIdKey: "10 002" is 10002)
  await edit('Alice Test', '10 002');
  await expect(page.locator('#toast')).toContainText('That ID is already used by Bobur Test. Each student needs a unique ID.');
  await page.locator('.ta-modal [data-act="cancel"]').click();
  expect(await alice()).toEqual({ name: 'Alice Test', id: '10001', group: 'g1' });
  // a new ID: saved, the old one kept; nothing else changes
  await edit('Alice Test', 'A-77');
  await expect(page.locator('.ta-modal')).toHaveCount(0);
  expect(await alice()).toEqual({ name: 'Alice Test', id: 'A-77', group: 'g1', oldIds: ['10001'] });
  await expect(page.locator('.sp-row', { hasText: 'Alice Test' }).locator('.sp-id')).toHaveText('A-77');
  // Alice's old ID is still hers: Bobur can't take it, nor can a new student
  await edit('Bobur Test', '10001');
  await expect(page.locator('#toast')).toContainText('That ID is already used by Alice Test.');
  await page.locator('.ta-modal [data-act="cancel"]').click();
  expect(await page.evaluate(() => getPointsRoster().find(s => s.name === 'Bobur Test').id)).toBe('10002');
  // back to the old ID: it leaves oldIds, the one used meanwhile is kept
  await edit('Alice Test', '10001');
  expect(await alice()).toEqual({ name: 'Alice Test', id: '10001', group: 'g1', oldIds: ['A-77'] });
  expect(errors).toEqual([]);
});

test('a result sent with an old ID stays with the student: Results (not in Didn\'t do it), the Course table, the Grammar table', async ({ page, context }) => {
  const at = new Date(Date.now() - 60000).toISOString();
  const docs = data.results(Date.now()).concat([
    { __id: 'old1', v: 1, code: data.DICTATION_CODE, type: 'Dictation', title: 'Kitchen', name: 'Cora Test', studentId: '30003', score: 80,
      referenceText: data.REFERENCE, studentText: data.REFERENCE, dictationFeedback: 'ok', timeSeconds: 100, timeDisplay: '01:40', date: at, submittedAt: at },
    { __id: 'sk_LST111_30003_1', v: 1, code: 'LST111', skill: 'listening', step: 'b1', name: 'Cora Test', studentId: '30003', type: 'Listening course',
      correct: 8, total: 10, score: 80, date: at, submittedAt: at, title: 'Step 1 · Daily Routine — listening' },
    { __id: 'sk_GRM111_30003_1', v: 1, type: 'Grammar course', code: 'GRM111', skill: 'grammar', lesson: 'g1', lessonNo: 1, level: 'beginner',
      name: 'Cora Test', studentId: '30003', correct: 15, total: 20, score: 75, timeSeconds: 600, answers: [], date: at, builtAt: at, submittedAt: at }
  ]);
  await prepare(context, { docs, storage: { ta_points_roster: JSON.stringify(CORA_MOVED),
    ta_skills_links: JSON.stringify({ 'g1|listening|b1': { code: 'LST111' } }), ta_grammar_links: JSON.stringify({ g1: { code: 'GRM111' } }) } });
  const errors = watchErrors(page);
  await open(page, 'results.html');
  await page.evaluate(code => { document.getElementById('res-code-input').value = code; onResultsCodeInput(); }, data.DICTATION_CODE);
  const row = page.locator('.results-table tbody tr', { hasText: 'Cora Test' });
  await expect(row.locator('.res-id-tag')).toContainText('ID 10003');
  await expect(page.locator('.missing-student', { hasText: 'Cora Test' })).toHaveCount(0);
  await page.goto('/course.html');
  await page.waitForFunction(() => (window.__allResults || []).some(r => r.code === 'GRM111'), null, { timeout: 10000 });
  expect(await page.evaluate(() => skTableRows('b1', 'g1').map(r => [r.name, !!r.listening]))).toEqual([['Cora Test', true]]);
  const course = await page.evaluate(() => {
    const g = skGroup('g1'), lv = skStep('b1'), ctx = skPathCtx(g, [lv]);
    return { missing: skMissingRows(lv, g, ctx).rows.map(r => r.name), unlisted: skUnlistedRows(lv, g, ctx, ['listening']).length };
  });
  expect(course.missing).not.toContain('Cora Test');
  expect(course.missing).toContain('Alice Test');
  expect(course.unlisted).toBe(0);
  expect(await page.evaluate(() => grTableRows('g1', 'all').map(r => [r.name, r.studentId]))).toEqual([['Cora Test', '10003']]);
  expect(await page.evaluate(() => grUnlistedRows('g1').length)).toBe(0);
  expect(errors).toEqual([]);
});

test('points: the total adds the old ID\'s records and the new ID\'s; new points go under the new ID; Reset brings it to 0', async ({ page, context }) => {
  const pts = (id, sid, score) => ({ __id: id, v: 1, code: '900900', type: 'POINTS:Bonus', title: 'Words␟u1␟' + sid, name: 'Cora Test', score, date: nowIso(), submittedAt: nowIso() });
  await prepare(context, { docs: data.results(Date.now()).concat([pts('p1', '30003', 10), pts('p2', '10003', 5)]),
    storage: { ta_points_code: '900900', ta_points_roster: JSON.stringify(CORA_MOVED) } });
  page.on('dialog', d => d.accept());
  await open(page, 'students.html');
  await expect.poll(() => page.evaluate(() => pointsTotalFor('10003')), { timeout: 8000 }).toBe(15);
  await page.locator('.group-block', { hasText: 'Target' }).click();
  const row = page.locator('.sp-row', { hasText: 'Cora Test' });
  await expect(row.locator('.sp-pts')).toHaveText('🪙 15');
  await expect(page.locator('.group-detail-head [data-group-pts]')).toHaveText('🪙 15');
  await row.locator('.sp-pts').click();
  await expect(page.locator('#pointsModalTotal')).toContainText('15 points total');
  await expect(page.locator('#pointsModalBody .pm-row')).toHaveCount(2);
  await page.locator('#pointsModalBackdrop .points-modal-close').click();
  // new points: under the ID she has now
  await row.locator('.pt-adjust-btn.plus').click();
  await page.fill('#pointsAmountInput', '3');
  await page.locator('.pt-amount-ok').click();
  await expect(row.locator('.sp-pts')).toHaveText('🪙 18', { timeout: 8000 });
  expect(await page.evaluate(() => window.__writes.filter(w => /^POINTS:/.test(w.type)).map(w => w.title.split('␟')[2]))).toEqual(['10003']);
  // Reset All Points: each ID's records go to 0, so her total is 0
  await page.evaluate(() => resetAllPoints());
  await expect.poll(() => page.evaluate(() => pointsTotalFor('10003')), { timeout: 8000 }).toBe(0);
  await expect(row.locator('.sp-pts')).toHaveText('🪙 0');
});

test('the class lists follow an ID change by themselves: Grammar and a Skills Course link copied before, both IDs, same prev and group', async ({ page, context }) => {
  const links = { 'g1|listening|b1': { code: 'LST101', sentAt: nowIso() }, 'g1|listening|b2': { code: 'LST102', sentAt: nowIso() } };
  // Step 2's list is online already (Copy link made it, with the part before); Step 1's never went online
  const docs = data.results(Date.now()).concat([classRec('LST102', { prev: '{"skill":"listening","stepNo":1,"codes":["LST101"]}', group: 'Target' })]);
  await prepare(context, { docs, storage: { ta_skills_links: JSON.stringify(links), ta_grammar_links: JSON.stringify({ g1: { code: 'GRM111', sentAt: nowIso() } }) } });
  const errors = watchErrors(page);
  await open(page, 'course.html');
  const list = code => page.evaluate(c => { const d = window.__fakeDocs.find(x => x.__id === 'class-' + c); return d ? { h: JSON.parse(d.data).map(e => e.h), n: JSON.parse(d.data).map(e => e.n), prev: d.prev ? JSON.parse(d.prev) : null, group: d.group || '' } : null; }, code);
  const hash = (code, id) => page.evaluate(([c, i]) => skClassHash(c, i), [code, id]);
  // links copied before have no rosterSig: they go online once by themselves
  await expect.poll(() => page.evaluate(() => Object.values(JSON.parse(localStorage.getItem('ta_skills_links'))).every(e => e.rosterSig)), { timeout: 10000 }).toBe(true);
  const before = await list('LST102');
  expect(before.prev).toEqual({ skill: 'listening', stepNo: 1, codes: ['LST101'] });
  expect(before.group).toBe('Target');
  expect(before.h).toHaveLength(3);
  await expect.poll(() => page.evaluate(() => !!JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toBe(true);
  // no change → nothing written
  const classWrites = () => page.evaluate(() => window.__writes.filter(w => /^class-/.test(w.id)).length);
  const n0 = await classWrites();
  await page.evaluate(() => { window.__skRefreshMs = 0; window.__grRefreshMs = 0; skRefreshLists(); grRefreshLists(); });
  await page.waitForTimeout(800);
  expect(await classWrites()).toBe(n0);
  // Alice's ID changes from 10001 to A-77 (what ✎ saves)
  await page.evaluate(() => savePointsRoster(getPointsRoster().map(s => s.id === '10001' ? Object.assign({}, s, { id: 'A-77', oldIds: ['10001'] }) : s)));
  for (const code of ['LST101', 'LST102']) {
    await expect.poll(async () => (await list(code)).h.length, { timeout: 8000 }).toBe(4);
    const now = await list(code);
    expect(now.h).toEqual(expect.arrayContaining([await hash(code, 'A-77'), await hash(code, '10001')]));
    expect(now.n.filter(n => n === 'Alice Test')).toHaveLength(2);
    expect(now.group).toBe('Target');
  }
  expect((await list('LST102')).prev).toEqual(before.prev);
  expect((await list('LST101')).prev).toBeNull();
  await expect.poll(async () => { const d = await list('GRM111'); return d ? d.h.length : 0; }, { timeout: 8000 }).toBe(7);   // 6 students, Alice twice
  const gr = await list('GRM111');
  expect(gr.h).toEqual(expect.arrayContaining([await hash('GRM111', 'A-77'), await hash('GRM111', '10001')]));
  // only Target's links changed: 2 lists → 2 writes; again with no change → none
  await page.waitForTimeout(500);
  const n1 = await classWrites();
  expect(n1 - n0).toBe(3);   // LST101, LST102, GRM111
  await page.evaluate(() => { skRefreshLists(); grRefreshLists(); });
  await page.waitForTimeout(800);
  expect(await classWrites()).toBe(n1);
  expect(errors).toEqual([]);
});

test('the lists wait until sync has brought the Students list: nothing is published before, it is once sync is ready', async ({ page, context }) => {
  const links = { 'g1|listening|b1': { code: 'LST101', sentAt: nowIso() } };
  await prepare(context, { storage: { ta_skills_links: JSON.stringify(links), ta_grammar_links: JSON.stringify({ g1: { code: 'GRM111', sentAt: nowIso() } }) } });
  await open(page, 'course.html');
  await expect.poll(() => page.evaluate(() => !!JSON.parse(localStorage.getItem('ta_skills_links'))['g1|listening|b1'].rosterSig), { timeout: 10000 }).toBe(true);
  await expect.poll(() => page.evaluate(() => !!JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toBe(true);
  const classWrites = () => page.evaluate(() => window.__writes.filter(w => /^class-/.test(w.id)).length);
  const n0 = await classWrites();
  // sync is on but hasn't finished its first check: this device's Students list may be an old one
  await page.evaluate(() => {
    window.__skRefreshMs = 0; window.__grRefreshMs = 0; window.__taStoreRefreshMs = 0;
    window.__notReady = true;
    window.taSync = Object.assign({}, window.taSync || {}, { ready: () => !window.__notReady });
    savePointsRoster(getPointsRoster().concat([{ name: 'Hamid Test', id: '10007', group: 'g1' }]));
    taStoreChanged('ta_points_roster');
    renderCourse();
  });
  await page.waitForTimeout(1000);
  expect(await classWrites()).toBe(n0);
  // sync is ready (js/sync.js setReady calls both)
  await page.evaluate(() => { window.__notReady = false; skRefreshLists(); grRefreshLists(); });
  await expect.poll(async () => (await classList(page, 'LST101')).h.length).toBe(4);
  await expect.poll(async () => (await classList(page, 'GRM111')).h.length).toBe(7);
});

test('putting a list online again changes only the students: a link with no "earlier part" stays without one, a cross-skill one keeps its own', async ({ page, context }) => {
  const cross = '{"skill":"listening","stepNo":2,"codes":["LST102"]}';   // copied 2026-11-12…16: Reading waited for Listening
  const links = { 'g1|listening|b3': { code: 'LST103', sentAt: nowIso() }, 'g1|reading|b2': { code: 'RDG102', sentAt: nowIso() },
    'g1|listening|b2': { code: 'LST102', sentAt: nowIso() } };
  const docs = data.results(Date.now()).concat([classRec('LST103', { group: 'Old name' }), classRec('RDG102', { prev: cross, group: 'Target' }), classRec('LST102')]);
  await prepare(context, { docs, storage: { ta_skills_links: JSON.stringify(links) } });
  const errors = watchErrors(page);
  await open(page, 'course.html');
  // put online once (no rosterSig yet), with what was online
  await expect.poll(() => page.evaluate(() => Object.values(JSON.parse(localStorage.getItem('ta_skills_links'))).every(e => e.rosterSig)), { timeout: 10000 }).toBe(true);
  const check = async n => {
    const lst = await classList(page, 'LST103'), rdg = await classList(page, 'RDG102'), l2 = await classList(page, 'LST102');
    expect(lst.h).toHaveLength(n); expect(lst.prev).toBeUndefined(); expect(lst.group).toBe('Old name');
    expect(rdg.h).toHaveLength(n); expect(rdg.prev).toBe(cross); expect(rdg.group).toBe('Target');
    expect(l2.prev).toBeUndefined(); expect(l2.group).toBeUndefined();
  };
  await check(3);
  expect(await page.evaluate(() => { const l = JSON.parse(localStorage.getItem('ta_skills_links')); return [l['g1|listening|b3'].prevJson, l['g1|reading|b2'].prevJson]; })).toEqual(['', cross]);
  // a roster change: the same prev and group again
  const reads = await page.evaluate(() => window.__reads);
  await page.evaluate(() => { window.__skRefreshMs = 0; savePointsRoster(getPointsRoster().map(s => s.id === '10001' ? Object.assign({}, s, { id: 'A-77', oldIds: ['10001'] }) : s)); });
  await expect.poll(async () => (await classList(page, 'RDG102')).h.length).toBe(4);
  await expect.poll(async () => (await classList(page, 'LST103')).h.length).toBe(4);
  await check(4);
  expect(await page.evaluate(() => window.__reads)).toBe(reads);   // kept on the link: the records aren't read again
  expect(errors).toEqual([]);
});

test('Undo of a deleted student: an old ID given to someone else meanwhile stays theirs', async ({ page, context }) => {
  const roster = data.roster.map(s => s.id === '10001' ? Object.assign({}, s, { id: 'A-77', oldIds: ['10001', 'X-1'] }) : s);
  await prepare(context, { storage: { ta_points_roster: JSON.stringify(roster) } });
  await open(page, 'students.html');
  await page.locator('.group-block', { hasText: 'Target' }).click();
  await page.locator('.sp-row', { hasText: 'Alice Test' }).locator('.sp-icon-btn.danger').click();
  await page.evaluate(() => savePointsRoster(getPointsRoster().concat([{ name: 'Nodir Test', id: '10001', group: 'g1' }])));
  await page.locator('.toast-undo').click();
  await expect(page.locator('.sp-row', { hasText: 'Alice Test' })).toHaveCount(1);
  expect(await page.evaluate(() => getPointsRoster().find(s => s.name === 'Alice Test'))).toEqual({ name: 'Alice Test', id: 'A-77', group: 'g1', oldIds: ['X-1'] });
  expect(await page.evaluate(() => rosterStudentForId('10001').name)).toBe('Nodir Test');
});
