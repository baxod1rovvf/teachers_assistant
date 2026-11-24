// Course links ask only for the ID, then "Bu sizmi?" — the name, ID and group from the teacher's list — with Ha / Yo'q
// (teacher, 2026-11-15: Muhlisa had typed an ID that wasn't hers). Spec: docs/superpowers/specs/2026-11-15-course-id-check-design.md
const { test, expect } = require('@playwright/test');
const crypto = require('crypto');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const hashFor = (code, id) => crypto.createHash('sha256').update(code + '|' + id).digest('hex').slice(0, 24);
const classDoc = (code, extra) => Object.assign({ __id: 'class-' + code, v: 1, code: 'TAUSER', type: 'TA_SYNC:CLASS', title: code, name: '',
  data: JSON.stringify([{ h: hashFor(code, '10001'), n: 'Alice Test' }, { h: hashFor(code, '10002'), n: 'Bobur Test' }]),
  date: new Date().toISOString(), group: 'Apex' }, extra || {});
const URL_L = '/skill.html?s=listening&st=b5&c=LSN777';

async function start(page, url, id) {
  await page.goto(url);
  await page.locator('#skIdInput').fill(id || '10001');
  await page.getByRole('button', { name: /Start/ }).click();
}
const sent = page => page.evaluate(() => window.__fakeDocs.filter(d => d.code === 'LSN777' && d.type === 'Listening course'));

test('the start card asks only for the ID', async ({ page, context }) => {
  await prepare(context, { docs: [classDoc('LSN777')] });
  await page.goto(URL_L);
  await expect(page.locator('#skIdInput')).toBeVisible();
  await expect(page.locator('#studentNameInput')).toHaveCount(0);
});

test('ID on the list → "Bu sizmi" with name, ID and group; Ha starts the exercise; the result carries the listed name', async ({ page, context }) => {
  await prepare(context, { docs: [classDoc('LSN777')] });
  const errors = watchErrors(page);
  await start(page, URL_L);
  const card = page.locator('.sk-confirm');
  await expect(card).toContainText('Bu sizmi:');
  await expect(card).toContainText('Alice Test — 10001');
  await expect(card).toContainText('Guruh:');
  await expect(card).toContainText('Apex');
  await expect(page.locator('#skSubmit')).toHaveCount(0);
  await page.getByRole('button', { name: 'Ha', exact: true }).click();
  await expect(page.locator('#skSubmit')).toBeVisible();
  await page.locator('#skSubmit').click();
  await expect(page.locator('.sk-send')).toContainText('Saved ✅');
  expect((await sent(page))[0]).toMatchObject({ name: 'Alice Test', studentId: '10001' });
  expect(errors).toEqual([]);
});

test('Yo\'q → back to an empty ID box, the remembered ID forgotten', async ({ page, context }) => {
  await prepare(context, { docs: [classDoc('LSN777')], storage: { ta_skill_student: JSON.stringify({ id: '10002' }) } });
  await page.goto(URL_L);
  await expect(page.locator('#skIdInput')).toHaveValue('10002');   // a phone shared with another student
  await page.getByRole('button', { name: /Start/ }).click();
  await expect(page.locator('.sk-confirm')).toContainText('Bobur Test — 10002');
  await page.getByRole('button', { name: /Yo'q/ }).click();
  await expect(page.locator('#skIdInput')).toHaveValue('');
  expect(await page.evaluate(() => localStorage.getItem('ta_skill_student'))).toBeNull();
});

test('a list without a group → no "Guruh:" lines', async ({ page, context }) => {
  await prepare(context, { docs: [classDoc('LSN777', { group: undefined })] });
  await start(page, URL_L);
  await expect(page.locator('.sk-confirm')).toContainText('Alice Test — 10001');
  await expect(page.locator('.sk-confirm')).not.toContainText('Guruh');
});

test('ID not on the list → "This ID is not on your teacher\'s list"', async ({ page, context }) => {
  await prepare(context, { docs: [classDoc('LSN777')] });
  await start(page, URL_L, '1415');
  await expect(page.locator('#skStartErr')).toContainText('This ID is not on your teacher\'s list');
  await expect(page.locator('.sk-confirm')).toHaveCount(0);
});

test('no list → straight to the exercise; the result has the ID and no name', async ({ page, context }) => {
  await prepare(context);
  await start(page, URL_L, '10005');
  await expect(page.locator('#skSubmit')).toBeVisible();
  await page.locator('#skSubmit').click();
  await expect(page.locator('.sk-send')).toContainText('Saved ✅');
  expect((await sent(page))[0]).toMatchObject({ name: '', studentId: '10005' });
});

test('the list can\'t be read → a spinner, then "check the internet", and no exercise', async ({ page, context }) => {
  await prepare(context, { docs: [classDoc('LSN777')] });
  await page.addInitScript(() => { window.__failReads = 1000; window.__skCheckTimeoutMs = 1500; });
  await page.goto(URL_L);
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await expect(page.locator('#skStartForm .sk-spin')).toBeVisible();
  await expect(page.locator('#skStartErr')).toContainText('We couldn\'t check your ID', { timeout: 10000 });
  await expect(page.locator('#skSubmit')).toHaveCount(0);
  await expect(page.locator('.sk-confirm')).toHaveCount(0);
});

test('Ha when already done → "already done"; Ha on the next step opens it, the step before not needed (2026-11-23)', async ({ page, context }) => {
  const done = { __id: 'sk_LSN777_10001_1', v: 1, code: 'LSN777', type: 'Listening course', skill: 'listening', step: 'b5', name: 'Alice Test',
    studentId: '10001', correct: 8, total: 12, date: new Date().toISOString() };
  await prepare(context, { docs: [classDoc('LSN777'), done, classDoc('LSN778', { prev: JSON.stringify({ skill: 'listening', stepNo: 5, codes: ['LSN999'] }) })] });
  await start(page, URL_L);
  await page.getByRole('button', { name: 'Ha', exact: true }).click();
  await expect(page.locator('.sk-done-card')).toContainText('You have already done this listening');
  await start(page, '/skill.html?s=listening&st=b6&c=LSN778');
  await page.getByRole('button', { name: 'Ha', exact: true }).click();
  await expect(page.locator('#skSubmit')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Oldingi');
});

test('Copy link puts the group\'s name on the list', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await prepare(context, { storage: { ta_course_group: 'g1' } });
  await page.goto('/ieltsjourney.html');
  await hideNotices(page);
  await page.evaluate(() => skOpenGroup('g1'));
  await page.locator('.sk-node[data-step="b1"]').click();
  await page.locator('.sk-part').first().getByRole('button', { name: /Copy link/ }).click();
  await expect.poll(() => page.evaluate(() => (window.__fakeDocs.find(d => d.type === 'TA_SYNC:CLASS') || {}).group)).toBe('Target');
});

test('a list whose entries carry their own group → Bu sizmi shows that student\'s group', async ({ page, context }) => {
  await prepare(context, { docs: [classDoc('LSN777', { group: undefined, data: JSON.stringify([
    { h: hashFor('LSN777', '10001'), n: 'Alice Test', g: 'Apex' }, { h: hashFor('LSN777', '10002'), n: 'Bobur Test', g: 'Target' }]) })] });
  await start(page, URL_L, '10002');
  await expect(page.locator('.sk-confirm')).toContainText('Bobur Test — 10002');
  await expect(page.locator('.sk-confirm')).toContainText('Guruh:');
  await expect(page.locator('.sk-confirm')).toContainText('Target');
  await expect(page.locator('.sk-confirm')).not.toContainText('Apex');
});

test('taPublishClassList stores each student\'s group as g', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/ieltsjourney.html');
  await page.waitForFunction(() => typeof window.taPublishClassList === 'function');
  const ok = await page.evaluate(() => window.taPublishClassList('LSN778', [{ id: '10001', name: 'Alice', groupName: 'Apex' }, { id: '10002', name: 'Bobur' }]));
  expect(ok).toBe(true);
  const data = await page.evaluate(() => JSON.parse(window.__fakeDocs.find(d => d.type === 'TA_SYNC:CLASS' && d.title === 'LSN778').data));
  expect(data.map(x => x.g)).toEqual(['Apex', undefined]);
});
