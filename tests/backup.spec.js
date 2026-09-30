// Backup: the file carries every result from the database, results deleted
// from the database can be put back from it, and a weekly reminder.
const fs = require('fs');
const { test, expect } = require('@playwright/test');
const { prepare, hideNotices, data } = require('./support/app');

async function downloadBackupFile(page) {
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), page.click('#settingsBackupSection button:has-text("Download backup")')]);
  return JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
}

test('the backup file carries every result from the database', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/settings.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  const backup = await downloadBackupFile(page);
  const expected = data.results(Date.now()).map(r => r.__id).sort();
  expect(backup.results.map(r => r.__id).sort()).toEqual(expected);
  expect(backup.results.find(r => r.name === 'Bobur Test' && r.type === 'Dictation').studentText).toContain(data.REFERENCE);
  expect(backup.data.ta_points_roster).toBeTruthy();                 // the usual data is still there
});

test('results deleted from the database are put back from a backup, without doubles', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/settings.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  const backup = await downloadBackupFile(page);
  const file = test.info().outputPath('backup.json');
  fs.writeFileSync(file, JSON.stringify(backup));

  // someone deletes Alice's and Bobur's dictation results
  const gone = await page.evaluate(() => {
    const ids = window.__fakeDocs.filter(d => d.code === '700010').map(d => d.__id);
    for (let i = window.__fakeDocs.length - 1; i >= 0; i--) if (ids.includes(window.__fakeDocs[i].__id)) window.__fakeDocs.splice(i, 1);
    return ids;
  });
  expect(gone.length).toBe(2);

  await page.setInputFiles('#settingsBackupSection input[type=file]', file);
  const modal = page.locator('.ta-modal').last();
  await expect(modal).toContainText(backup.results.length + ' results in this file');
  await modal.locator('[data-pick="data"]').uncheck();              // only the results
  await modal.locator('[data-act="ok"]').click();
  await expect(page.locator('#restoreResultsInfo')).toContainText('2 results put back', { timeout: 10000 });
  await expect(page.locator('#restoreResultsInfo')).toContainText((backup.results.length - 2) + ' already there');
  const back = await page.evaluate(ids => window.__fakeDocs.filter(d => ids.includes(d.__id)).map(d => ({ id: d.__id, restored: !!d.restoredAt, name: d.name })), gone);
  expect(back.map(b => b.name).sort()).toEqual(['Alice Test', 'Bobur Test']);
  expect(back.every(b => b.restored)).toBe(true);
  await page.locator('.ta-modal [data-act="ok"]').click();
  // nothing was replaced: the students are still there, and no reload happened
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_points_roster')).length)).toBe(data.roster.length);
});

test('a reminder to download a backup once a week', async ({ page, context }) => {
  await prepare(context, { storage: { ta_last_backup_at: new Date(Date.now() - 8 * data.DAY).toISOString() } });
  await page.goto('/index.html');
  const warn = page.locator('#taBackupWarn');
  await expect(warn).toHaveClass(/show/, { timeout: 15000 });
  await expect(warn).toContainText('8 days ago');
  await warn.locator('.done-warn-later').click();
  await expect(warn).not.toHaveClass(/show/);
  await page.reload();
  await page.waitForTimeout(11000);
  await expect(page.locator('#taBackupWarn.show')).toHaveCount(0);   // not again until tomorrow
});
