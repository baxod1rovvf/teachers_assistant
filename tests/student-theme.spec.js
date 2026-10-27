// One look for every student exercise (2026-10-27): the start screen, buttons and finish card are the same in every
// exercise and in a Homework/Class set's own screens, and fit a phone.
const { test, expect } = require('@playwright/test');
const { prepare, hideNotices } = require('./support/app');

test('a new exercise (and a set, with its rounds) carries the shared design; on a phone the start screen uses it', async ({ page, context, browser }, info) => {
  test.setTimeout(90000);
  await prepare(context);
  await page.goto('/create.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  await page.evaluate(() => { switchTo('spelling'); TA_BUILDER_ROWS.spelling.set([['necessary', []], ['beautiful', []]]); document.getElementById('sp-title').value = 'Words'; });
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#panel-spelling .create-btn')]);
  const file = info.outputPath('spelling.html');
  await download.saveAs(file);
  const html = require('fs').readFileSync(file, 'utf8');
  expect(html.split('id="ta-student-theme"').length - 1).toBe(1);
  // the copy kept in My Exercises (Redownload, the link) has it too
  expect(await page.evaluate(() => getCachedExerciseHtml(getRecentExercises()[0].uid).indexOf('id="ta-student-theme"') !== -1)).toBe(true);

  // a set: its own screens and each round inside it
  const set = await page.evaluate(() => {
    openHwcBuilder('homework');
    selectHwcType('spelling'); TA_BUILDER_ROWS.spelling.set([['necessary', []], ['beautiful', []]]); document.getElementById('sp-title').value = 'Round one';
    hwcAddExercise();
    selectHwcType('sentences'); TA_BUILDER_ROWS.sentences.set(['apple']); document.getElementById('sn-title').value = 'Round two';
    let out = null; const orig = window.downloadFile; window.downloadFile = (n, c) => { out = taApplyStudentTheme(c); };
    hwcFinishAndCreate(); window.downloadFile = orig;
    return { wrapper: out.indexOf('id="ta-student-theme"') !== -1, rounds: (out.match(/id=\\"ta-student-theme\\"/g) || []).length };
  });
  expect(set.wrapper).toBe(true);
  expect(set.rounds).toBe(2);

  // on a phone: the same big gradient Start button, the type shown once, a roomy name box
  const phone = await browser.newContext({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true });
  await phone.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  const s = await phone.newPage();
  await s.goto('file://' + file);
  await s.waitForTimeout(800);
  const start = s.locator('.ta-login-form button', { hasText: 'Start' }).first();
  expect(await start.evaluate(el => getComputedStyle(el).backgroundImage)).toContain('radial-gradient');   // a mesh gradient (no linear ones)
  expect((await start.boundingBox()).height).toBeGreaterThanOrEqual(54);
  expect(await s.locator('.ta-login-form .eyebrow').evaluateAll(l => l.every(el => getComputedStyle(el).display === 'none'))).toBe(true);
  expect((await s.locator('#studentNameInput').boundingBox()).height).toBeGreaterThanOrEqual(50);
  await phone.close();
});
