// "Already done" when a student hadn't done it, and the reverse (teacher, 2026-11-14: "some of my students said even though I
// didn't do the exercise, the system says already done, and some say the reverse"). What the database showed:
// - three Step 4 writings with 0 words, sent 21–63 minutes after the page was opened: the writing clock goes on while the page
//   is closed, and a student who came back after it ran out had an empty writing sent at once → "already done";
// - the one-try check also matched by name alone: a student with the same name but another ID was "already done";
// - a phone remembers the last name + ID: on a shared phone the next student could start as the first one.
const { test, expect } = require('@playwright/test');
const { passIdCheck, prepare, watchErrors } = require('./support/app');

async function mockAi(context) {
  await context.route('https://loom-ai.toxiraxii010.workers.dev/**', route => route.fulfill({ status: 200, contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }, body: JSON.stringify({ queued: true }) }));
}
async function start(page, url, name, id) {
  await page.goto(url);
  await page.locator('#skIdInput').fill(id || '10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await passIdCheck(page);
}
const writings = page => page.evaluate(() => window.__fakeDocs.filter(d => d.type === 'Writing course'));

test('a writing whose time ran out while the page was closed, with nothing written, is not sent: the student starts again', async ({ page, context }) => {
  await prepare(context, { storage: { 'ta_skill_draft|WRT789|b1': JSON.stringify({ text: '', startedAt: Date.now() - 3600000, id: '10001' }) } });
  await mockAi(context);
  const errors = watchErrors(page);
  await start(page, '/skill.html?s=writing&st=b1&c=WRT789');
  await expect(page.locator('body')).toContainText('nothing was written');
  await page.waitForTimeout(1500);
  expect(await writings(page)).toHaveLength(0);
  expect(await page.evaluate(() => localStorage.getItem('ta_skill_draft|WRT789|b1'))).toBeNull();
  await page.getByRole('button', { name: /Start again/ }).click();
  await expect(page.locator('#skTimer')).toContainText(/15:00|14:5\d/);   // a fresh clock
  await expect(page.locator('#skWriteBox')).toBeEditable();
  expect(errors).toEqual([]);
});

test('the time runs out with nothing written: nothing is sent; with some words, the writing is sent', async ({ page, context }) => {
  test.setTimeout(60000);
  await prepare(context);
  await mockAi(context);
  await page.addInitScript(() => { window.__skFast = 1; });   // a minute lasts a second
  await start(page, '/skill.html?s=writing&st=b1&c=WRT789');
  await expect(page.locator('body')).toContainText('nothing was written', { timeout: 30000 });
  await page.waitForTimeout(1000);
  expect(await writings(page)).toHaveLength(0);
  await page.getByRole('button', { name: /Start again/ }).click();
  await page.locator('#skWriteBox').fill('My name is Anna and I like music.');
  await expect(page.locator('.sk-send')).toContainText('Saved ✅', { timeout: 30000 });
  await expect(page.locator('body')).toContainText("Time's up");
  const recs = await writings(page);
  expect(recs).toHaveLength(1);
  expect(recs[0]).toMatchObject({ words: 8, studentId: '10001' });
});

test('an empty writing already in the database (sent by the old clock) does not count as done: the student can write it', async ({ page, context }) => {
  const blank = { __id: 'sk_WRT789_10001_1', v: 1, code: 'WRT789', type: 'Writing course', skill: 'writing', step: 'b1', name: 'Alice', studentId: '10001',
    text: '', words: 0, date: new Date().toISOString() };
  await prepare(context, { docs: [blank] });
  await mockAi(context);
  await start(page, '/skill.html?s=writing&st=b1&c=WRT789');
  await expect(page.locator('#skWriteBox')).toBeEditable();
  await expect(page.locator('body')).not.toContainText('already done');
});

test('another student with the same name but a different ID is not "already done"', async ({ page, context }) => {
  const other = { __id: 'sk_LSN555_20002_1', v: 1, code: 'LSN555', type: 'Listening course', skill: 'listening', step: 'b5', name: 'Mubina', studentId: '20002',
    correct: 9, total: 12, date: new Date().toISOString() };
  await prepare(context, { docs: [other] });
  await start(page, '/skill.html?s=listening&st=b5&c=LSN555', 'Mubina', '10001');
  await expect(page.locator('#skSubmit')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('already done');
});

test('the same student with no ID on the earlier result is still "already done" by name', async ({ page, context }) => {
  const old = { __id: 'sk_LSN555_x_1', v: 1, code: 'LSN555', type: 'Listening course', skill: 'listening', step: 'b5', name: 'Mubina', studentId: '',
    correct: 9, total: 12, date: new Date().toISOString() };
  const list = { __id: 'class-LSN555', v: 1, code: 'TAUSER', type: 'TA_SYNC:CLASS', title: 'LSN555', name: '', date: new Date().toISOString(),
    data: JSON.stringify([{ h: require('crypto').createHash('sha256').update('LSN555|10001').digest('hex').slice(0, 24), n: 'Mubina' }]) };
  await prepare(context, { docs: [old, list] });   // the name comes from the teacher's list (ID only since 2026-11-15)
  await start(page, '/skill.html?s=listening&st=b5&c=LSN555', 'Mubina', '10001');
  await expect(page.locator('body')).toContainText('You have already done this listening');
});

test('"already done" says whose answers they are, and "Not you?" opens an empty start card', async ({ page, context }) => {
  const sent = { __id: 'sk_LSN555_10001_1', v: 1, code: 'LSN555', type: 'Listening course', skill: 'listening', step: 'b5', name: 'Alice Test', studentId: '10001',
    correct: 8, total: 12, date: new Date().toISOString() };
  const list = { __id: 'class-LSN555', v: 1, code: 'TAUSER', type: 'TA_SYNC:CLASS', title: 'LSN555', name: '', date: new Date().toISOString(),
    data: JSON.stringify([{ h: require('crypto').createHash('sha256').update('LSN555|10001').digest('hex').slice(0, 24), n: 'Alice Test' }]) };
  await prepare(context, { docs: [sent, list], storage: { ta_skill_student: JSON.stringify({ id: '10001' }) } });
  const errors = watchErrors(page);
  await page.goto('/skill.html?s=listening&st=b5&c=LSN555');
  await expect(page.locator('#skIdInput')).toHaveValue('10001');   // the phone remembers the last student
  await page.getByRole('button', { name: /Start/ }).click();
  await passIdCheck(page);
  await expect(page.locator('.sk-done-card')).toContainText('Alice Test');
  await expect(page.locator('.sk-done-card')).toContainText('ID 10001');
  await page.getByRole('button', { name: /Not you/ }).click();
  await expect(page.locator('#skIdInput')).toHaveValue('');
  expect(await page.evaluate(() => localStorage.getItem('ta_skill_student'))).toBeNull();
  expect(errors).toEqual([]);
});
