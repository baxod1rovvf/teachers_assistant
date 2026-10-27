// Sync (2026-10-27): phones re-downloaded every synced item (several MB) at every visit. Now the app reads the
// cloud records' names first and downloads only the items that changed since this device last saw them.
const { test, expect } = require('@playwright/test');
const { prepare } = require('./support/app');

const SK = Buffer.alloc(32, 7).toString('base64');   // a sync key (made from the password at sign-in)

test('sync reads only what changed: nothing on a visit with no changes, just the changed item otherwise', async ({ page, context }) => {
  test.setTimeout(60000);
  await prepare(context, { session: { login: 'TOXIRJON', ce: 'toxirjon+000000000000@teachers-assistant.app', sk: SK } });
  // the records' names only (as the real database answers a "select title" query)
  await context.route(/documents:runQuery/, async route => {
    const docs = await page.evaluate(() => window.__fakeDocs.filter(d => d.code === 'TAUSER' && d.type === 'TA_SYNC:TOXIRJON')
      .map(d => ({ id: d.__id, title: d.title })));
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(docs.map(d => ({ document: { name: 'projects/p/databases/(default)/documents/results/' + d.id, fields: { title: { stringValue: d.title } } } }))) });
  });
  await page.goto('/index.html');
  // first visit: nothing in the cloud yet → this device's data goes up, with a "something changed" record
  await expect.poll(() => page.evaluate(() => window.__writes.filter(w => w.type === 'TA_SYNC:TOXIRJON').length), { timeout: 15000 }).toBeGreaterThan(3);
  await expect.poll(() => page.evaluate(() => window.__writes.filter(w => w.type === 'TA_SYNC:TOXIRJON:SIG').length), { timeout: 15000 }).toBeGreaterThan(0);
  expect(await page.evaluate(() => taSync.light().titles)).toBe(0);
  await page.waitForTimeout(1500);

  // the cloud keeps what was uploaded (the stand-in database starts afresh on each load)
  const cloud = await page.evaluate(() => window.__fakeDocs.filter(d => d.code === 'TAUSER'));
  await context.addInitScript(docs => { window.__FIXTURE = (window.__FIXTURE || []).concat(docs); }, cloud);

  // next visit, nothing changed: only the names are read, no item is downloaded
  await page.reload();
  await expect.poll(() => page.evaluate(() => taSync.light() && taSync.light().titles), { timeout: 15000 }).toBeGreaterThan(3);
  expect(await page.evaluate(() => taSync.light().fetched)).toBe(0);

  // one item changed elsewhere (this device last saw an older version of it): just that one is downloaded
  await page.evaluate(() => {
    const ns = window.__TA_NS || '';
    const seen = JSON.parse(localStorage.getItem(ns + 'ta_sync_seen') || '{}');
    seen.ta_student_groups = 'older';
    localStorage.setItem(ns + 'ta_sync_seen', JSON.stringify(seen));
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => taSync.light() && taSync.light().titles), { timeout: 15000 }).toBeGreaterThan(3);
  expect(await page.evaluate(() => taSync.light().fetched)).toBe(1);
  // and the students' groups are still there
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem((window.__TA_NS || '') + 'ta_student_groups')).length)).toBeGreaterThan(0);
});
