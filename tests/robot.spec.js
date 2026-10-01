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
  await body.locator('.ai-robot-q-item', { hasText: 'Punish' }).click();
  await expect(body.locator('.ai-robot-answer-a')).toContainText('Will be punished');
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
