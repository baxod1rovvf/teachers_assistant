// Results: kept on the device (few database reads), and what the teacher sees
// from them — Top 5 per group, Results, "Didn't do it", Checked, dictation scores.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices, data } = require('./support/app');

test('results are read once, then only new ones (the daily read limit)', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/index.html');
  await page.waitForFunction(() => window.taResultsCacheInfo && taResultsCacheInfo().kept > 0, null, { timeout: 10000 });
  await page.waitForTimeout(1000);
  const first = await page.evaluate(() => window.__reads);
  expect(first).toBeGreaterThan(10);                       // the first visit reads everything once

  await page.reload();
  await page.waitForFunction(() => window.__allResults && window.__allResults.length > 0, null, { timeout: 10000 });
  await page.waitForTimeout(1000);
  expect(await page.evaluate(() => window.__reads)).toBeLessThanOrEqual(3);   // later visits: only "anything new?"

  // a student hands in a result while the app is open: it arrives
  const before = await page.evaluate(() => window.__allResults.length);
  await page.evaluate(() => window.__studentSubmits({ v: 1, code: '700010', type: 'Dictation', title: 'Kitchen', name: 'Cora Test', studentId: '10003',
    score: 80, referenceText: 'a b', studentText: 'a b', dictationFeedback: 'ok', timeSeconds: 60, timeDisplay: '01:00', date: new Date().toISOString() }));
  await expect.poll(() => page.evaluate(() => window.__allResults.length)).toBe(before + 1);
  expect(errors).toEqual([]);
});

test('Top 5 shows one group at a time, with Target / Apex buttons', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/index.html');
  await page.waitForTimeout(2500);
  await hideNotices(page);
  const list = page.locator('#mainTopStudentsList');
  await expect(list.locator('.top-group-tab')).toHaveText(['Target', 'Apex']);
  await list.locator('.top-group-tab', { hasText: 'Apex' }).click();
  await expect(list).toContainText('Dilya Test');
  await expect(list).not.toContainText('Alice Test');
  await list.locator('.top-group-tab', { hasText: 'Target' }).click();
  await expect(list).toContainText('Alice Test');
  await expect(list).not.toContainText('Dilya Test');
});

test('a dictation with extra words counts them as mistakes, shown where they were typed', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/results.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  await page.evaluate(code => { document.getElementById('res-code-input').value = code; onResultsCodeInput(); }, data.DICTATION_CODE);
  const rows = page.locator('.results-table tbody tr');
  await expect(rows).toHaveCount(2);
  await expect(rows.filter({ hasText: 'Alice Test' })).toContainText('100%');
  await expect(rows.filter({ hasText: 'Bobur Test' })).toContainText('50%');   // typed the text twice: not 100 %
  const i = await page.evaluate(() => window.__lastResultsMatches.findIndex(r => r.name === 'Bobur Test'));
  await page.evaluate(i => viewDictationResult(i), i);
  await expect(page.locator('#sentenceViewBody .dd-extra-in').first()).toBeVisible();
  await expect(page.locator('#sentenceViewBody .dd-chip.extra')).toContainText('+ 14 extra');   // the text has 14 words
});

test('"Didn\'t do it" lists only the group\'s students who have no result; Checked is remembered', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/results.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  // the Target dictation: Cora (Target) is missing; Apex students are never listed
  await page.evaluate(code => { document.getElementById('res-code-input').value = code; onResultsCodeInput(); }, data.DICTATION_CODE);
  const missing = page.locator('.missing-section').first();
  await expect(missing).toContainText('Target');
  await expect(missing).toContainText('Cora Test');
  await expect(missing).not.toContainText('Farida Test');

  // Checked / Not checked
  const aliceChip = page.locator('.results-table tbody tr', { hasText: 'Alice Test' }).locator('.check-chip');
  await expect(aliceChip).toHaveText('○ Not checked');
  await aliceChip.click();
  await expect(page.locator('.results-table tbody tr', { hasText: 'Alice Test' }).locator('.check-chip')).toHaveText('✓ Checked');
  await page.reload();
  await page.waitForTimeout(1500);
  await hideNotices(page);
  await page.evaluate(code => { document.getElementById('res-code-input').value = code; onResultsCodeInput(); }, data.DICTATION_CODE);
  await expect(page.locator('.results-table tbody tr', { hasText: 'Alice Test' }).locator('.check-chip')).toHaveText('✓ Checked');

  // the Apex homework set: Farida (Apex) did nothing
  await page.evaluate(() => showExerciseResults('uset'));
  const set = page.locator('#hwcResultsInlineList');
  await expect(set.locator('.hwc-student-row')).toHaveCount(2);
  await expect(set.locator('.missing-section')).toContainText('Farida Test');
  await expect(set.locator('.missing-section')).not.toContainText('Cora Test');
});

test('a homework set shows each student\'s progress and their answers open', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/results.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  await page.evaluate(() => showExerciseResults('uset'));
  const row = page.locator('.hwc-student-row', { hasText: 'Dilya Test' });
  await expect(row).toContainText('3/3');
  await expect(row).toContainText('Completed');
  await page.evaluate(() => toggleHwcStudentExpand('20001'));
  await page.evaluate(() => viewHwcRoundAnswer('700004', 'Dilya Test', 'My room — Dictation', '20001'));
  await expect(page.locator('#sentenceViewTitle')).toContainText('Dilya Test');
  await expect(page.locator('#sentenceViewBody')).toContainText('correct');
  expect(errors).toEqual([]);
});
