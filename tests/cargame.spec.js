// Car Game (until 2026-10-04 Flashcard's "Car game" design): the student drives down a road; a word
// floats above it with three meanings, and the right one steers the car past the warning signs.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const WORDS = [['road', 'yoʻl'], ['car', 'mashina'], ['bridge', 'koʻprik'], ['street', 'koʻcha']];

test('Car Game: its own exercise (not a Flashcard design); the teacher\'s car, buildings and warning signs; right answers finish the game', async ({ page, context }, info) => {
  test.setTimeout(60000);
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/create.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await expect(page.locator('#fc-design')).toHaveCount(0);   // Flashcard has no "Design" choice any more
  await page.locator('.picker-card', { hasText: 'Car Game' }).click();
  await expect(page.locator('#panel-cargame')).toHaveClass(/active/);
  await page.fill('#cg-title', 'Travel words');
  for (const [w, t] of WORDS) {
    await page.fill('#cg-compose', w + ' - ' + t);
    await page.press('#cg-compose', 'Enter');
  }
  await expect(page.locator('#cg-count')).toHaveText('4');
  await page.selectOption('#cg-seconds', '2');
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#panel-cargame .create-btn')]);
  const file = info.outputPath('car-game.html');
  await download.saveAs(file);
  const item = await page.evaluate(() => getRecentExercises()[0]);
  expect(item.typeLabel).toBe('Car Game');
  expect(item.builderTab).toBe('cargame');
  expect(errors).toEqual([]);

  const student = await context.newPage();
  const studentErrors = watchErrors(student);
  await student.addInitScript(() => {
    if (!window.__named) { window.__named = 1; window.name = 'ta_merge_identity:' + JSON.stringify({ id: '10001', name: 'Alice Test', code: '' }); }
  });
  await student.goto('file://' + file);
  await expect(student.locator('#options .opt')).toHaveCount(3, { timeout: 6000 });
  // the teacher's pictures: the car from her animation, two buildings, the warning sign
  expect(await student.locator('.car-svg path').count()).toBeGreaterThan(20);
  expect(await student.locator('.bld-img.cg-bld1').count()).toBeGreaterThan(2);
  expect(await student.locator('.bld-img.cg-bld2').count()).toBeGreaterThan(2);
  expect(await student.locator('.sky-img').count()).toBeGreaterThan(10);
  await expect(student.locator('#obstacles .obs .cg-sign')).toHaveCount(2);
  expect(await student.locator('#obstacles .cg-sign').first().evaluate(el => getComputedStyle(el).backgroundImage)).toContain('data:image/webp');
  await student.waitForTimeout(600);
  await student.screenshot({ path: info.outputPath('car-game.png') });

  // every answer right
  for (let n = 0; n < WORDS.length; n++) {
    await expect(student.locator('#options .opt:not([disabled])')).toHaveCount(3, { timeout: 8000 });
    const word = await student.locator('#wordText').innerText();
    const right = WORDS.find(w => w[0] === word)[1];
    await student.locator('#options .opt', { hasText: right }).click();
  }
  await expect(student.locator('#endOverlay')).not.toHaveClass(/hidden/, { timeout: 10000 });
  const payload = await student.evaluate(() => buildResultPayload());
  expect(payload.type).toBe('Car Game');
  expect(studentErrors.filter(e => !/module|import|Failed to fetch/i.test(e))).toEqual([]);
});

test('Car Game: "Use again" on an old Flashcard file made with the car design opens the Car Game builder', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(800);
  const load = await page.evaluate(() => exerciseLoadFor({ typeLabel: 'Flashcard', title: 'Old', builderTab: 'flashcard',
    builderState: { v: 1, fields: { 'fc-title': 'Old', 'fc-design': 'runner', 'fc-seconds': '3', 'fc-points': '20' }, rows: [['a', 'b']] } }));
  expect(load.tab).toBe('cargame');
  expect(load.state.fields).toEqual({ 'cg-title': 'Old', 'cg-seconds': '3', 'cg-points': '20' });
  expect(load.state.rows).toEqual([['a', 'b']]);
});
