// The AI robot: every feature should have a question about it, and the
// search box finds answers from any section.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

test('the robot is an AI chat: any question goes to the AI with Loom\'s notes; without the AI the closest saved answer shows', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/index.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(() => toggleAiRobotBubble());
  const body = page.locator('#aiRobotBubbleBody');
  // a greeting, two of this section's questions as chips, a box to type in and a Send button
  await expect(body.locator('.ai-msg-assistant').first()).toContainText('Ask me anything');
  await expect(body.locator('.ai-chip')).toHaveCount(2);
  await expect(page.locator('#aiRobotInput')).toBeFocused();
  await expect(page.locator('#aiRobotSend')).toHaveAttribute('aria-label', 'Send question');
  // the AI can't be reached (the tests block the internet) → the closest saved answer, marked as such
  await page.locator('#aiRobotInput').fill('how do I punish a student who did not do it');
  await page.locator('#aiRobotSend').click();
  await expect(body.locator('.ai-msg-user')).toHaveText('how do I punish a student who did not do it');
  await expect(body.locator('.ai-msg-note')).toContainText('will be punished');
  await expect(body.locator('.ai-chip')).toHaveCount(0);
  // with the AI helper: the question, the chat so far, the section and Loom's notes go to it; its answer shows
  let sent = null;
  await page.route('https://loom-ai.test/**', async route => {
    sent = JSON.parse(route.request().postData());
    await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ answer: 'Here are **5 warm-up questions**:\n1. What did you do yesterday?' }) });
  });
  await page.evaluate(() => localStorage.setItem('ta_ai_url', 'https://loom-ai.test/'));
  await page.locator('#aiRobotInput').fill('Give me 5 warm-up questions for Grade 8A');
  await page.keyboard.press('Enter');
  await expect(body.locator('.ai-msg-assistant').last()).toContainText('5 warm-up questions');
  await expect(body.locator('.ai-msg-assistant b').last()).toHaveText('5 warm-up questions');
  expect(sent.question).toBe('Give me 5 warm-up questions for Grade 8A');
  expect(sent.section).toBe('main');
  expect(sent.history.length).toBe(2);
  expect(sent.knowledge).toContain('will be punished');
  // the AI fails → the closest saved answer instead
  await page.unroute('https://loom-ai.test/**');
  await page.route('https://loom-ai.test/**', route => route.fulfill({ status: 502, headers: { 'Access-Control-Allow-Origin': '*' }, body: '{}' }));
  await page.locator('#aiRobotInput').fill('change the language');
  await page.keyboard.press('Enter');
  await expect(body.locator('.ai-msg-note').last()).toContainText('didn’t answer');
  expect(errors).toEqual([]);
});

test('every robot question has its Uzbek and Russian translation', async () => {
  const fs = require('fs'), vm = require('vm'), path = require('path');
  const common = fs.readFileSync(path.join(__dirname, '../js/common.js'), 'utf8');
  const all = vm.runInNewContext(common.slice(common.indexOf('const AI_ROBOT_CONTACT_ITEM'), common.indexOf('let aiRobotLottieAnim')) +
    ';getAiRobotAllFaq().concat([AI_ROBOT_CONTACT_ITEM]).map(x => x.q)', { Set });
  const win = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/i18n-strings.js'), 'utf8'), { window: win });
  const missing = all.filter(q => !(win.TA_ROBOT_I18N[q] && win.TA_ROBOT_I18N[q].length === 4 && win.TA_ROBOT_I18N[q].every(t => t && t.trim())));
  expect(missing, 'add these to TA_ROBOT_I18N in js/i18n-strings.js').toEqual([]);
  const unused = Object.keys(win.TA_ROBOT_I18N).filter(q => !all.includes(q));
  expect(unused, 'translations of questions that no longer exist').toEqual([]);
});

test('in Uzbek and Russian the robot speaks that language', async ({ page, context }) => {
  await prepare(context);
  for (const [lang, a, word] of [['uz', 'rasmingizni', 'tilni oʻzgartiraman'], ['ru', 'картинку', 'поменять язык']]) {
    await page.addInitScript(l => { try { localStorage.setItem('ta_ui_lang', l); } catch (e) {} }, lang);
    await page.goto('/index.html');
    await page.waitForTimeout(1200);
    await hideNotices(page);
    await page.evaluate(() => toggleAiRobotBubble());
    const body = page.locator('#aiRobotBubbleBody');
    await page.locator('#aiRobotInput').fill(word);
    await page.keyboard.press('Enter');
    await expect(body.locator('.ai-msg-note').last()).toContainText(a);
  }
});
