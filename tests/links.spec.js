// Exercise links (play.html, 7 days) and the database warnings.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const DAY = 86400000;
// The test site is http://localhost; links need the real https address, so pretend.
const PRETEND_HTTPS = () => { window.taPlayUrl = uid => 'https://example.github.io/teachers_assistant/play.html?x=' + uid; };

test('an exercise goes online at the first "Copy link"; the link works 7 days from then, then says it has expired', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/create.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(PRETEND_HTTPS);
  await page.evaluate(() => switchTo('sentences'));
  await page.fill('#sn-title', 'Link test');
  await page.fill('#sn-instructions', 'Write about your day.');
  await Promise.all([page.waitForEvent('download'), page.click('#panel-sentences .create-btn')]);
  // making it doesn't put it online any more
  await page.waitForTimeout(6500);
  expect(await page.evaluate(() => window.__writes.filter(w => w.type === 'TA_SYNC:PLAY').length)).toBe(0);

  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(PRETEND_HTTPS);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const idx = () => page.evaluate(() => getRecentExercises().findIndex(e => e.title === 'Link test'));
  const plays = () => page.evaluate(() => window.__writes.filter(w => w.type === 'TA_SYNC:PLAY').length);
  const uid = await page.evaluate(() => getRecentExercises().find(e => e.title === 'Link test').uid);
  // first press: put online, link copied, the 7 days start now
  await page.evaluate(i => copyRecentExerciseLink(i), await idx());
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(new RegExp('play\\.html\\?x=' + uid + '$'));
  expect(await plays()).toBe(1);
  const item = await page.evaluate(() => getRecentExercises().find(e => e.title === 'Link test'));
  expect(Date.now() - Date.parse(item.linkAt)).toBeLessThan(60000);
  // 3 days later: the same link, not put online again, the 7 days don't restart
  const ago = days => page.evaluate(d => {
    const list = getRecentExercises(); const it = list.find(e => e.title === 'Link test');
    it.linkAt = it.playAt = new Date(Date.now() - d * 864e5).toISOString(); saveRecentExercises(list);
  }, days);
  await ago(3);
  await page.evaluate(() => navigator.clipboard.writeText('-'));
  await page.evaluate(i => copyRecentExerciseLink(i), await idx());
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(new RegExp('play\\.html\\?x=' + uid + '$'));
  expect(await plays()).toBe(1);
  // 8 days later: "This link has expired", nothing copied or put online
  await ago(8);
  await page.evaluate(() => navigator.clipboard.writeText('-'));
  await page.evaluate(i => copyRecentExerciseLink(i), await idx());
  await expect(page.locator('.ta-modal')).toContainText('This link has expired');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('-');
  expect(await plays()).toBe(1);
  expect(errors).toEqual([]);
});

test('a big exercise is split into parts; putting it online again removes the old parts first', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/index.html');
  await page.waitForTimeout(1000);
  const r = await page.evaluate(async () => {
    window.__deletes = []; window.__writes = [];
    const res = await window.taPublishPlay('bigone', '<html>' + 'x'.repeat(700000) + '</html>', 5);
    return { res, writes: window.__writes.map(w => w.id + ' ' + w.title), deletes: window.__deletes };
  });
  expect(r.res.parts).toBe(3);
  expect(r.writes).toEqual(['play-bigone bigone␟0␟3', 'play-bigone-1 bigone␟1␟3', 'play-bigone-2 bigone␟2␟3']);
  // the database rules don't allow changing a record: the old ones (up to 5 parts) go first
  expect(r.deletes).toEqual(expect.arrayContaining(['play-bigone', 'play-bigone-1', 'play-bigone-2', 'play-bigone-3', 'play-bigone-4']));
});

test('play.html joins the parts of an exercise, and refuses links older than 7 days', async ({ page }) => {
  const now = new Date().toISOString(), old = new Date(Date.now() - 8 * DAY).toISOString();
  const html = '<!DOCTYPE html><html><head><title>Two parts</title></head><body><h1 id="h">…</h1><script>document.getElementById("h").textContent="joined OK"<\/script></body></html>';
  const rec = (id, i, n, date, data) => ({ fields: { type: { stringValue: 'TA_SYNC:PLAY' }, title: { stringValue: [id, i, n].join('␟') }, date: { stringValue: date }, data: { stringValue: data } } });
  await page.route(/documents\/results\/play-twoparts(\?|$)/, r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(rec('twoparts', 0, 2, now, html.slice(0, 50))) }));
  await page.route(/documents\/results\/play-twoparts-1/, r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(rec('twoparts', 1, 2, now, html.slice(50))) }));
  await page.route(/documents\/results\/play-oldlink/, r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(rec('oldlink', 0, 1, old, html)) }));
  await page.route(/documents\/results\/play-gonelink/, r => r.fulfill({ status: 404, body: '{}' }));
  await page.goto('/play.html?x=twoparts');
  await expect(page.locator('#h')).toHaveText('joined OK');
  await page.goto('/play.html?x=oldlink');
  await expect(page.locator('body')).toContainText('This link has expired');
  await page.goto('/play.html?x=gonelink');
  await expect(page.locator('body')).toContainText('isn’t online');
});

test('the cleanup deletes links older than 7 days and warns when links take a lot of space', async ({ page, context }) => {
  await prepare(context);
  let score = '80000';
  const rows = () => JSON.stringify([
    { document: { name: 'x/results/play-oldone', fields: { title: { stringValue: 'oldone␟0␟1' }, date: { stringValue: new Date(Date.now() - 8 * DAY).toISOString() }, score: { integerValue: '300000' } } } },
    { document: { name: 'x/results/play-newone', fields: { title: { stringValue: 'newone␟0␟1' }, date: { stringValue: new Date().toISOString() }, score: { integerValue: score } } } }
  ]);
  await context.route(/documents:runQuery/, r => r.fulfill({ contentType: 'application/json', body: rows() }));
  await page.goto('/index.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(() => { window.__deletes = []; localStorage.removeItem('ta_play_sweep_at'); taSweepPlayLinksIfDue(); });
  await expect.poll(() => page.evaluate(() => window.__deletes)).toEqual(['play-oldone']);
  await expect(page.locator('#taDbSpaceWarn')).toHaveCount(0);
  score = String(450 * 1048576);
  await page.evaluate(() => { localStorage.removeItem('ta_play_sweep_at'); taSweepPlayLinksIfDue(); });
  await expect(page.locator('#taDbSpaceWarn')).toBeVisible();
  await expect(page.locator('#taDbSpaceWarn')).toContainText('450 MB');
});

test('when Firebase refuses a request for a reached limit, the teacher is warned', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/index.html');
  await page.waitForTimeout(1200);
  await page.evaluate(() => taReportDbError({ code: 'resource-exhausted' }));
  await expect(page.locator('#taDbLimitWarn')).toBeVisible();
  await expect(page.locator('#taDbLimitWarn')).toContainText('reached a limit');
});
