// Course answers that didn't reach the teacher (2026-11-13: students sent screenshots of a finished Listening, but Loom had no
// answers from them, and the Reading link said "Oldingi Listening mashq tugatilmagan"). The score shows at Submit, before the
// save; when the save failed or the page was closed while sending, the phone still said "already done" and nothing arrived.
// Now: the answers are kept on the phone until the save is confirmed and are sent again whenever a course link is opened; a
// phone that says "done" but whose answers never arrived lets the student do it again.
const { test, expect } = require('@playwright/test');
const crypto = require('crypto');
const { prepare, watchErrors } = require('./support/app');

const hashFor = (code, id) => crypto.createHash('sha256').update(code + '|' + id).digest('hex').slice(0, 24);
const classDoc = (code, prev) => Object.assign({ __id: 'class-' + code, v: 1, code: 'TAUSER', type: 'TA_SYNC:CLASS', title: code, name: '',
  data: JSON.stringify([{ h: hashFor(code, '10001'), n: 'Alice Test' }]), date: new Date().toISOString() }, prev ? { prev: JSON.stringify(prev) } : {});
const listening = page => page.evaluate(() => window.__fakeDocs.filter(d => d.code === 'LSN777' && d.type === 'Listening course'));

async function start(page, url, name) {
  await page.goto(url);
  await page.locator('#studentNameInput').fill(name || 'Alice');
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
}
// a Listening whose save fails (no internet): the score shows, "Not sent yet", and the student closes the page
async function failedListening(page) {
  await start(page, '/skill.html?s=listening&st=b5&c=LSN777');
  await page.locator('.sk-q').first().locator('input, .sk-opt').first().click();
  await page.evaluate(() => { window.__failWrites = 1000; });
  await page.getByRole('button', { name: /Submit/ }).click();
  await expect(page.locator('.sk-score')).toBeVisible();
  await expect(page.locator('.sk-send')).toContainText('Not sent yet', { timeout: 15000 });
  expect(await listening(page)).toHaveLength(0);
}

test('answers that didn\'t reach the teacher are kept on the phone and sent when the student opens the link again', async ({ page, context }) => {
  test.setTimeout(60000);
  await prepare(context);
  const errors = watchErrors(page);
  await failedListening(page);
  // the stand-in database starts empty on every page load, like a save that never happened
  await start(page, '/skill.html?s=listening&st=b5&c=LSN777');
  await expect(page.locator('body')).toContainText('You have already done this listening');
  await expect.poll(() => listening(page).then(d => d.length)).toBe(1);
  expect((await listening(page))[0]).toMatchObject({ studentId: '10001', step: 'b5', total: 12 });
  // sent: nothing is kept any more
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skill_unsent') || '{}'))).toEqual({});
  expect(errors).toEqual([]);
});

test('the next part on the same phone: kept Listening answers are sent first, so Reading opens', async ({ page, context }) => {
  test.setTimeout(60000);
  await prepare(context, { docs: [classDoc('RDG777', { skill: 'listening', stepNo: 5, codes: ['LSN777'] })] });
  const errors = watchErrors(page);
  await failedListening(page);
  await start(page, '/skill.html?s=reading&st=b5&c=RDG777', 'Alice');
  await expect(page.locator('#skSubmit')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('body')).not.toContainText('Oldingi');
  expect(await listening(page)).toHaveLength(1);
  expect(errors).toEqual([]);
});

test('a phone that says "done" but whose answers never arrived (before this fix) lets the student do it again', async ({ page, context }) => {
  await prepare(context, { storage: { ta_skill_done: JSON.stringify({ 'LSN777|id:10001': { at: '2026-11-12T10:00:00.000Z', summary: '8 / 12' },
    'LSN777|name:alice': { at: '2026-11-12T10:00:00.000Z', summary: '8 / 12' } }) } });
  const errors = watchErrors(page);
  await start(page, '/skill.html?s=listening&st=b5&c=LSN777');
  await expect(page.locator('#skSubmit')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('You have already done this');
  expect(errors).toEqual([]);
});

test('one try still holds: with the answers in the database, the link says "already done"', async ({ page, context }) => {
  const sent = { __id: 'sk_LSN777_10001_1', v: 1, code: 'LSN777', type: 'Listening course', skill: 'listening', step: 'b5', name: 'Alice', studentId: '10001',
    correct: 8, total: 12, date: new Date().toISOString() };
  await prepare(context, { docs: [sent] });
  await start(page, '/skill.html?s=listening&st=b5&c=LSN777');
  await expect(page.locator('body')).toContainText('You have already done this listening');
  await expect(page.locator('body')).toContainText('8 / 12');
});

// The teacher's rule (2026-11-13): "already done" only when the answers reached the database
test('"already done" only when the answers reached the teacher: answers still on the phone get "haven\'t reached your teacher yet" + Send', async ({ page, context }) => {
  test.setTimeout(90000);
  await prepare(context);
  const errors = watchErrors(page);
  await failedListening(page);
  await page.addInitScript(() => { window.__failWrites = 1000; });   // still no internet when the link is opened again
  await start(page, '/skill.html?s=listening&st=b5&c=LSN777');
  const card = page.locator('.sk-done-card');
  await expect(card).toContainText('Your answers haven\'t reached your teacher yet', { timeout: 30000 });
  await expect(card).toContainText('/ 12');
  await expect(card).not.toContainText('You have already done this');
  await expect(card).not.toContainText('already has your answers');
  expect(await listening(page)).toHaveLength(0);
  await page.evaluate(() => { window.__failWrites = 0; });   // back online
  await card.getByRole('button', { name: '📤 Send my answers' }).click();
  await expect(card).toContainText('You have already done this listening', { timeout: 15000 });
  expect(await listening(page)).toHaveLength(1);
  expect(errors).toEqual([]);
});

test('no internet at Start: the phone\'s own note never says "already done" — "check the internet and press Start again"', async ({ page, context }) => {
  await prepare(context, { storage: { ta_skill_done: JSON.stringify({ 'LSN777|id:10001': { at: '2026-11-12T10:00:00.000Z', summary: '8 / 12' } }) } });
  const errors = watchErrors(page);
  await page.goto('/skill.html?s=listening&st=b5&c=LSN777');
  await page.evaluate(() => { window.__failReads = 100; });   // the database can't be asked
  await page.locator('#studentNameInput').fill('Alice');
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await expect(page.locator('#skStartErr')).toHaveText('📶 We couldn\'t check your answers — check the internet and press Start again.');
  await expect(page.locator('body')).not.toContainText('You have already done this');
  await expect(page.locator('#skSubmit')).toHaveCount(0);
  await page.evaluate(() => { window.__failReads = 0; });   // back online: nothing from her in the database → she can do it
  await page.getByRole('button', { name: /Start/ }).click();
  await expect(page.locator('#skSubmit')).toBeVisible();
  expect(errors).toEqual([]);
});
