// Things that went wrong with no internet (2026-10): the weekly re-read of results ran offline and kept
// "nothing" (Top 5 fell from "21 of 24 done" to "4 of 21"), and "Reset All Points" pressed offline waited
// on the phone, then every press arrived together the next day (totals went to −120).
const { test, expect } = require('@playwright/test');
const { prepare, hideNotices, data } = require('./support/app');

test('results: a re-read with no internet keeps the old copy, and reads again when the internet is back', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/index.html');
  await page.waitForFunction(() => window.taResultsCacheInfo && taResultsCacheInfo().kept > 0, null, { timeout: 10000 });
  await page.waitForTimeout(1500);   // the copy is saved on the device
  const kept = await page.evaluate(() => taResultsCacheInfo().kept);
  const topText = () => page.locator('#mainTopStudentsList').evaluate(el => el.textContent);
  const top = await topText();
  expect(top).toContain('exercise');

  // a week later (time for the full re-read) — with no internet
  await page.evaluate(() => new Promise(res => {
    const name = 'ta_results_cache' + (window.__TA_NS ? '__' + String(window.__TA_NS).replace(/[^a-z0-9_]/gi, '_') : '');
    const req = indexedDB.open(name, 1);
    req.onsuccess = () => {
      const st = req.result.transaction('kv', 'readwrite').objectStore('kv');
      const g = st.get('state');
      g.onsuccess = () => { const v = g.result; v.fullAt = Date.now() - 8 * 86400000; st.put(v, 'state').onsuccess = res; };
    };
  }));
  await page.addInitScript(() => { window.__failReads = 9999; });
  await page.reload();
  await page.waitForTimeout(2500);
  await hideNotices(page);
  expect(await page.evaluate(() => taResultsCacheInfo().kept)).toBe(kept);           // nothing lost
  expect(await page.evaluate(() => taResultsCacheInfo().codes)).toBe(0);             // and nothing marked as read
  await expect.poll(topText).toBe(top);                                                   // Top 5 unchanged

  // the internet is back: the codes are read again
  await page.evaluate(() => { window.__failReads = 0; window.dispatchEvent(new Event('online')); });
  await expect.poll(() => page.evaluate(() => taResultsCacheInfo().codes), { timeout: 8000 }).toBeGreaterThan(0);
  expect(await page.evaluate(() => taResultsCacheInfo().kept)).toBe(kept);
});

test('Reset All Points: refused with no internet (nothing queued), once at a time, and below-zero totals go to 0 too', async ({ page, context }) => {
  const now = new Date().toISOString();
  const pts = (id, sid, score, type) => ({ __id: id, v: 1, code: '900900', type: type || 'POINTS:Bonus', title: 'Words␟u1␟' + sid,
    name: 'x', score: score, date: now, submittedAt: now });
  const docs = data.results(Date.now()).concat([
    pts('p1', '10001', 40),
    // a student hit by the doubled reset: +40, then four resets of −40 → −120
    pts('p2', '10002', 40), pts('p3', '10002', -40, 'POINTS:Removed'), pts('p4', '10002', -40, 'POINTS:Removed'),
    pts('p5', '10002', -40, 'POINTS:Removed'), pts('p6', '10002', -40, 'POINTS:Removed')
  ]);
  await prepare(context, { docs, storage: { ta_points_code: '900900' } });
  page.on('dialog', d => d.accept());
  await page.goto('/students.html');
  await page.waitForTimeout(2000);
  await hideNotices(page);
  await expect.poll(() => page.evaluate(() => [pointsTotalFor('10001'), pointsTotalFor('10002')]), { timeout: 8000 }).toEqual([40, -120]);
  const resets = () => page.evaluate(() => window.__writes.filter(w => w.type === 'POINTS:Removed').length);

  // no connection to the database: nothing is written, the teacher is told
  await page.evaluate(() => { window.__failReads = 1; });
  await page.evaluate(() => resetAllPoints());
  expect(await resets()).toBe(0);
  await expect(page.locator('.toast, #toast, .ta-toast').last()).toContainText(/Could not reset|internet/);

  // pressed twice quickly: one reset
  await page.evaluate(() => { resetAllPoints(); resetAllPoints(); });
  await expect.poll(resets, { timeout: 8000 }).toBe(2);   // one record per student (40 → 0, −120 → 0)
  await expect.poll(() => page.evaluate(() => [pointsTotalFor('10001'), pointsTotalFor('10002')]), { timeout: 8000 }).toEqual([0, 0]);
  // and again: already 0, nothing new
  await page.evaluate(() => resetAllPoints());
  await page.waitForTimeout(800);
  expect(await resets()).toBe(2);
});
