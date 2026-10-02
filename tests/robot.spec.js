// The AI robot: every feature should have a question about it, and the
// search box finds answers from any section.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

test('the robot answers questions about the newest features, found with its search', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/index.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(() => toggleAiRobotBubble());
  const body = page.locator('#aiRobotBubbleBody');
  await expect(body).toContainText('Ready');
  // a Results question, searched for from the Dashboard
  await body.locator('.ai-robot-search').fill('punish');
  await body.locator('.ai-robot-q-item', { hasText: '⚖️' }).click();
  await expect(body.locator('.ai-robot-answer-a')).toContainText('will be punished');
  await body.locator('.ai-robot-back-btn').click();
  await expect(body.locator('.ai-robot-search')).toHaveValue('punish');
  await body.locator('.ai-robot-search').fill('zzzz nothing');
  await expect(body).toContainText('No answer mentions');
  // each section has its own list
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1000);
  await hideNotices(page);
  await page.evaluate(() => { aiRobotQuery = ''; toggleAiRobotBubble(); });
  await expect(page.locator('#aiRobotBubbleBody')).toContainText('coloured edge');
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

test('in Uzbek and Russian the robot answers in that language', async ({ page, context }) => {
  await prepare(context);
  for (const [lang, q, a, word] of [['uz', 'Robotni surish mumkinmi?', 'bouling', 'jazo'], ['ru', 'Можно ли передвинуть робота?', 'боулинга', 'наказан']]) {
    await page.addInitScript(l => { try { localStorage.setItem('ta_ui_lang', l); } catch (e) {} }, lang);
    await page.goto('/index.html');
    await page.waitForTimeout(1200);
    await hideNotices(page);
    await page.evaluate(() => { aiRobotQuery = ''; toggleAiRobotBubble(); });
    const body = page.locator('#aiRobotBubbleBody');
    await body.locator('.ai-robot-q-item', { hasText: q }).click();
    await expect(body.locator('.ai-robot-answer-a')).toContainText(a);
    await body.locator('.ai-robot-back-btn').click();
    await body.locator('.ai-robot-search').fill(word);
    await expect(body.locator('.ai-robot-q-item').first()).toContainText('⚖️');
  }
});
