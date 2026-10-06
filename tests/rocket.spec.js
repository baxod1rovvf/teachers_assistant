// Rocket Game (until 2026-10-06 Pronunciation's "Rocket game" design): a red laser beam between two lasers blocks
// the rocket's way up; the student says the word to switch it off. 3 hearts: a wrong try costs one.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const WORDS = ['moon', 'star', 'planet'];

// speech recognition that is always on and hears nothing by itself — the test "says" the words
const FAKE_SPEECH = `(() => {
  class Rec { start() { setTimeout(() => { this.onstart && this.onstart(); }, 20); } stop() { this.onend && this.onend(); } abort() {} }
  window.SpeechRecognition = window.webkitSpeechRecognition = Rec;
})();`;

test('Rocket Game: its own exercise (not a Pronunciation design), lasers left and right with a red beam, 3 hearts, the rocket flies up past a moving sky, the microphone is held while speaking', async ({ page, context }, info) => {
  test.setTimeout(60000);
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/create.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await expect(page.locator('#pr-design')).toHaveCount(0);   // Pronunciation has no "Design" choice any more
  // Pronunciation and Rocket Game are in "Ready to use" (moved from "In process" on 2026-10-06)
  const ready = page.locator('.picker-section', { hasText: 'Ready to use' });
  await expect(ready.locator('.picker-card', { hasText: 'Rocket Game' })).toHaveCount(1);
  await expect(ready.locator('.picker-card', { hasText: 'Pronunciation' })).toHaveCount(1);
  await expect(page.locator('.picker-section', { hasText: 'In process' }).locator('.picker-card', { hasText: /Rocket Game|Pronunciation/ })).toHaveCount(0);
  await page.locator('.picker-card', { hasText: 'Rocket Game' }).click();
  await expect(page.locator('#panel-rocket')).toHaveClass(/active/);
  await page.fill('#rk-title', 'Space words');
  for (const w of WORDS) {
    await page.fill('#rk-compose', w);
    await page.press('#rk-compose', 'Enter');
  }
  await expect(page.locator('#rk-count')).toHaveText('3');
  await expect(page.locator('#rk-rows .pr-ipa').first()).not.toHaveValue('');   // the pronunciation is filled in
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#panel-rocket .create-btn')]);
  const file = info.outputPath('rocket-game.html');
  await download.saveAs(file);
  const item = await page.evaluate(() => getRecentExercises()[0]);
  expect(item.typeLabel).toBe('Rocket Game');
  expect(item.builderTab).toBe('rocket');
  expect(item.contentSummary).toBe(WORDS.join('\n'));
  expect(errors).toEqual([]);

  const student = await context.newPage();
  const studentErrors = watchErrors(student);
  await student.addInitScript(FAKE_SPEECH);
  await student.addInitScript(() => {
    if (!window.__named) { window.__named = 1; window.name = 'ta_merge_identity:' + JSON.stringify({ id: '10001', name: 'Alice Test', code: '' }); }
  });
  await student.goto('file://' + file);
  await expect(student.locator('#laserRow')).toBeVisible({ timeout: 6000 });
  // laser ——— laser: the teacher's laser on the left and on the right, a red beam between them, the word above it
  await expect(student.locator('#laserRow .laser')).toHaveCount(2);
  await expect(student.locator('#beam')).toBeVisible();
  await expect(student.locator('#gateWord')).toHaveText('moon');
  const lasers = await student.locator('#laserRow .laser').evaluateAll(l => l.map(el => el.getBoundingClientRect()));
  const vw = await student.evaluate(() => innerWidth);
  expect(lasers[0].left).toBeLessThan(30);
  expect(lasers[1].right).toBeGreaterThan(vw - 30);
  // the teacher's pictures; no big box in the middle; a still background; 3 hearts
  for (const sel of ['#rocket .rk-img-rocket', '#rkEarth.rk-img-earth', '#burst.rk-img-stars', '#laserRow .laser.left', '.rk-jupiter.rk-img-jupiter', '.rk-mars.rk-img-mars'])
    expect(await student.locator(sel).first().evaluate(el => getComputedStyle(el).backgroundImage), sel).toContain('data:image/webp');
  await expect(student.locator('#gate, .track, .drifter')).toHaveCount(0);
  // the Earth isn't under the rocket (it's a planet at the side), and the planets are in proportion: Jupiter > Earth > Mars
  const box = async sel => student.locator(sel).boundingBox();
  const [earth, rocket0, jupiter, mars] = [await box('#rkEarth'), await box('#rocket'), await box('.rk-jupiter'), await box('.rk-mars')];
  expect(earth.x > rocket0.x + rocket0.width || earth.x + earth.width < rocket0.x).toBe(true);
  expect(jupiter.width).toBeGreaterThan(earth.width);
  expect(earth.width).toBeGreaterThan(mars.width);
  expect(mars.width).toBeGreaterThan(60);
  await expect(student.locator('#hudHearts span:not(.lost)')).toHaveCount(3);
  await expect(student.locator('#modeBtn')).toHaveCount(0);   // always space: no day/night button
  // the rocket is below the laser (it flies from the bottom to the top)
  const rocketY = (await student.locator('#rocket').boundingBox()).y;
  expect(rocketY).toBeGreaterThan((await student.locator('#beam').boundingBox()).y);
  await student.waitForTimeout(800);
  await student.screenshot({ path: info.outputPath('rocket-game.png') });

  // the microphone is off until 🎤 is held down; it listens only while held
  await expect(student.locator('#micBtn')).toHaveClass(/ask/);
  expect(await student.evaluate(() => recKeepAlive)).toBe(false);
  // the sky streams down (the rocket is flying), the planets stay where they are
  const skyY = () => student.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.sky')).transform).m42);
  const y1 = await skyY(); await student.waitForTimeout(700); const y2 = await skyY();
  expect(y2).toBeGreaterThan(y1);
  const jupiterBefore = (await student.locator('.rk-jupiter').boundingBox()).y;
  const btn = (await student.locator('#micBtn').boundingBox());
  const say = async (w, afterLettingGo) => {
    await student.waitForFunction(() => accepting && !holding, null, { timeout: 10000 });
    await student.mouse.move(btn.x + btn.width / 2, btn.y + btn.height / 2);
    await student.mouse.down();
    await expect(student.locator('#micBtn')).toHaveClass(/live/);
    expect(await student.evaluate(() => recKeepAlive)).toBe(true);
    if (!afterLettingGo) await student.evaluate(w => settleListen('ok', [{ transcript: w, confidence: 0.95 }]), w);
    await student.mouse.up();
    if (afterLettingGo) await student.evaluate(w => settleListen('ok', [{ transcript: w, confidence: 0.95 }]), w);   // the words can arrive just after letting go
    expect(await student.evaluate(() => recKeepAlive)).toBe(false);   // let go → the microphone is off
  };
  // a wrong word: the rocket loses a heart and the laser stays on
  await say('banana');
  await expect(student.locator('#hudHearts span:not(.lost)')).toHaveCount(2);
  await expect(student.locator('#beam')).not.toHaveClass(/off/);
  for (let n = 0; n < WORDS.length; n++) {
    await expect(student.locator('#gateWord')).toHaveText(WORDS[n]);
    await say(WORDS[n], n === 1);
    await expect(student.locator('#scoreLine')).toHaveClass(/good/);
  }
  await expect(student.locator('#endOverlay')).not.toHaveClass(/hidden/, { timeout: 10000 });
  await expect(student.locator('#endTitle')).toHaveText(/Mission complete/);
  expect((await student.locator('.rk-jupiter').boundingBox()).y).toBe(jupiterBefore);
  const payload = await student.evaluate(() => buildResultPayload());
  expect(payload.type).toBe('Rocket Game');
  expect(payload.heartsLeft).toBe(2);
  expect(payload.score).toBeGreaterThanOrEqual(70);
  expect(studentErrors.filter(e => !/module|import|Failed to fetch|lottie|fonts/i.test(e))).toEqual([]);

  // three wrong tries: no hearts left, the flight ends
  const again = await context.newPage();
  await again.addInitScript(FAKE_SPEECH);
  await again.addInitScript(() => {
    if (!window.__named) { window.__named = 1; window.name = 'ta_merge_identity:' + JSON.stringify({ id: '10002', name: 'Bob Test', code: '' }); }
  });
  await again.goto('file://' + file);
  await expect(again.locator('#laserRow')).toBeVisible({ timeout: 6000 });
  for (let n = 0; n < 3; n++) {
    await again.waitForFunction(() => accepting && !holding, null, { timeout: 10000 });
    await again.locator('#micBtn').dispatchEvent('pointerdown');
    await again.evaluate(() => settleListen('ok', [{ transcript: 'banana', confidence: 0.95 }]));
    await again.locator('#micBtn').dispatchEvent('pointerup');
    await expect(again.locator('#hudHearts span:not(.lost)')).toHaveCount(2 - n);
  }
  await expect(again.locator('#endOverlay')).not.toHaveClass(/hidden/, { timeout: 10000 });
  await expect(again.locator('#endTitle')).toHaveText(/Out of hearts/);
  expect(await again.evaluate(() => buildResultPayload().heartsLeft)).toBe(0);
});

test('Rocket Game: "Use again" on an old Pronunciation file made with the rocket design opens the Rocket Game builder', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(800);
  const load = await page.evaluate(() => exerciseLoadFor({ typeLabel: 'Pronunciation', title: 'Old', builderTab: 'pronunciation',
    builderState: { v: 1, fields: { 'pr-title': 'Old', 'pr-design': 'game', 'pr-pass': '80', 'pr-tries': '5', 'pr-learn': 'on' }, rows: [['tree', 'triː', '🌳']] } }));
  expect(load.tab).toBe('rocket');
  expect(load.state.fields).toEqual({ 'rk-title': 'Old', 'rk-pass': '80' });
  expect(load.state.rows).toEqual([['tree', 'triː', '🌳']]);
  // the usual design stays a Pronunciation exercise
  const usual = await page.evaluate(() => exerciseLoadFor({ typeLabel: 'Pronunciation', title: 'U', builderTab: 'pronunciation',
    builderState: { v: 1, fields: { 'pr-title': 'U', 'pr-design': 'flash' }, rows: [] } }));
  expect(usual.tab).toBe('pronunciation');
});
