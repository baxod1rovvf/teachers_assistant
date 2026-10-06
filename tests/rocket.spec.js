// Rocket Game (until 2026-10-06 Pronunciation's "Rocket game" design): the rocket takes off from the Earth;
// each word blocks the way and the student says it into the microphone to fly on.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const WORDS = ['moon', 'star', 'planet'];

// speech recognition that is always on and hears nothing by itself — the test "says" the words
const FAKE_SPEECH = `(() => {
  class Rec { start() { setTimeout(() => { this.onstart && this.onstart(); }, 20); } stop() { this.onend && this.onend(); } abort() {} }
  window.SpeechRecognition = window.webkitSpeechRecognition = Rec;
})();`;

test('Rocket Game: its own exercise (not a Pronunciation design), with the teacher\'s rocket, Earth, planets and stars; saying every word finishes the flight', async ({ page, context }, info) => {
  test.setTimeout(60000);
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/create.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await expect(page.locator('#pr-design')).toHaveCount(0);   // Pronunciation has no "Design" choice any more
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
  await expect(student.locator('#gate')).toBeVisible({ timeout: 6000 });
  // the teacher's pictures: the rocket, the Earth it takes off from (falling behind), planets and stars drifting by
  for (const sel of ['#rocket .rk-img-rocket', '#rkEarth.rk-img-earth', '#burst.rk-img-stars'])
    expect(await student.locator(sel).evaluate(el => getComputedStyle(el).backgroundImage), sel).toContain('data:image/webp');
  await expect(student.locator('#rkEarth')).toHaveClass(/away/);
  expect(await student.locator('#planetLayer .rk-img-planet').count()).toBeGreaterThan(0);
  expect(await student.locator('#planetLayer .rk-img-mars').count()).toBeGreaterThan(0);
  expect(await student.locator('#starLayer .star').count()).toBeGreaterThan(20);
  await expect(student.locator('#modeBtn')).toHaveCount(0);   // always space: no day/night button
  await student.waitForTimeout(2600);
  await student.screenshot({ path: info.outputPath('rocket-game.png') });

  // say every word right
  for (let n = 0; n < WORDS.length; n++) {
    await student.waitForFunction(() => typeof pendingListen !== 'undefined' && !!pendingListen, null, { timeout: 10000 });
    const word = await student.locator('#gateWord').innerText();
    expect(word).toBe(WORDS[n]);
    await student.evaluate(w => settleListen('ok', [{ transcript: w, confidence: 0.95 }]), word);
    await expect(student.locator('#scoreLine')).toHaveClass(/good/);
  }
  await expect(student.locator('#endOverlay')).not.toHaveClass(/hidden/, { timeout: 10000 });
  const payload = await student.evaluate(() => buildResultPayload());
  expect(payload.type).toBe('Rocket Game');
  expect(payload.score).toBeGreaterThanOrEqual(70);
  expect(studentErrors.filter(e => !/module|import|Failed to fetch|lottie|fonts/i.test(e))).toEqual([]);
});

test('Rocket Game: "Use again" on an old Pronunciation file made with the rocket design opens the Rocket Game builder', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(800);
  const load = await page.evaluate(() => exerciseLoadFor({ typeLabel: 'Pronunciation', title: 'Old', builderTab: 'pronunciation',
    builderState: { v: 1, fields: { 'pr-title': 'Old', 'pr-design': 'game', 'pr-pass': '80', 'pr-tries': '5', 'pr-learn': 'on' }, rows: [['tree', 'triː', '🌳']] } }));
  expect(load.tab).toBe('rocket');
  expect(load.state.fields).toEqual({ 'rk-title': 'Old', 'rk-pass': '80', 'rk-tries': '5' });
  expect(load.state.rows).toEqual([['tree', 'triː', '🌳']]);
  // the usual design stays a Pronunciation exercise
  const usual = await page.evaluate(() => exerciseLoadFor({ typeLabel: 'Pronunciation', title: 'U', builderTab: 'pronunciation',
    builderState: { v: 1, fields: { 'pr-title': 'U', 'pr-design': 'flash' }, rows: [] } }));
  expect(usual.tab).toBe('pronunciation');
});
