// Car Game (until 2026-10-04 Flashcard's "Car game" design): the student drives down a road; a word
// floats above it with three meanings, and the right one steers the car past the warning signs.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const WORDS = [['road', 'yoʻl'], ['car', 'mashina'], ['bridge', 'koʻprik'], ['street', 'koʻcha']];

test('Car Game: its own exercise (not a Flashcard design); the teacher\'s car, buildings far away, trees, bushes, fence, puddles and warning signs; right answers finish the game', async ({ page, context }, info) => {
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
  // the teacher's pictures: the car from the animation, the buildings only far away, trees + bushes + fence by the road, puddles, warning signs
  expect(await student.locator('.car-svg path').count()).toBeGreaterThan(20);
  expect(await student.locator('#props .cg-bld1, #props .cg-bld2').count()).toBe(0);
  expect(await student.locator('.sky-img.cg-bld1').count()).toBeGreaterThan(5);
  expect(await student.locator('.sky-img.cg-bld2').count()).toBeGreaterThan(5);
  expect(await student.locator('#props .cg-trees').count()).toBeGreaterThan(3);
  expect(await student.locator('#props .cg-bush').count()).toBeGreaterThan(3);
  expect(await student.locator('#props .fence-wall.cg-fence').count()).toBe(2);   // one straight fence along each edge of the road
  // the puddles lie on the grass, beside the road (more than half the road's width from the middle)
  const puddleX = await student.locator('#props .cg-puddle').evaluateAll(l => l.map(el => Math.abs(parseFloat(el.style.transform.match(/translate3d\(([-\d.]+)px/)[1]))));
  expect(puddleX.length).toBe(6);
  expect(puddleX.every(x => x > 180)).toBe(true);
  await expect(student.locator('#obstacles .obs .cg-sign')).toHaveCount(2);
  expect(await student.locator('#obstacles .cg-sign').first().evaluate(el => getComputedStyle(el).backgroundImage)).toContain('data:image/webp');
  await student.waitForTimeout(600);
  await student.screenshot({ path: info.outputPath('car-game.png') });

  // every answer right (on a busy machine a word can run out of time — it comes back, so keep going until the end)
  const ended = () => student.evaluate(() => !document.getElementById('endOverlay').classList.contains('hidden'));
  for (let n = 0; n < 12 && !(await ended()); n++) {
    await student.waitForFunction(() => document.querySelectorAll('#options .opt:not([disabled])').length === 3 ||
      !document.getElementById('endOverlay').classList.contains('hidden'), null, { timeout: 10000 });
    if (await ended()) break;
    const word = await student.locator('#wordText').innerText();
    const right = WORDS.find(w => w[0] === word)[1];
    await student.locator('#options .opt', { hasText: right }).click({ timeout: 3000 }).catch(() => {});
    await student.waitForFunction(() => document.querySelectorAll('#options .opt:not([disabled])').length === 0 ||
      !document.getElementById('endOverlay').classList.contains('hidden'), null, { timeout: 10000 });
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
