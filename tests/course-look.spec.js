// The students' course pages use Loom's light "Mountain Air" look (teacher, 2026-11-15): the mountain picture behind,
// white glass cards, a dark Start button — not the old dark look (css/skill-dark.css, removed).
const { test, expect } = require('@playwright/test');

test('the course page: the picture behind, a white card and a dark Start button', async ({ page, context }) => {
  await context.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await page.goto('/skill.html?s=listening&st=b4&c=ABC123');
  await expect(page.locator('#skIdInput')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/sk-air/);
  await expect(page.locator('link[href*="skill-dark.css"]')).toHaveCount(0);
  expect(await page.evaluate(() => getComputedStyle(document.body, '::before').backgroundImage)).toContain('images/app/sky');
  expect(await page.locator('.ta-login-card').evaluate(el => getComputedStyle(el).backgroundColor)).toMatch(/rgba\(255, 255, 255, 0\.\d+\)/);
  expect(await page.locator('.start-btn').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(20, 24, 31)');
});
