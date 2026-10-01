// Clean-ups: Firebase kept inside the app, one ?v= stamp on every page, and Settings → Status.
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');
const { prepare, hideNotices } = require('./support/app');

const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));

test('every page loads the app\'s files with the same ?v= stamp, and the files exist', () => {
  const stamps = new Set();
  pages.forEach(f => {
    const html = fs.readFileSync(path.join(root, f), 'utf8');
    for (const m of html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)) {
      const [file, query] = m[1].split('?');
      expect(fs.existsSync(path.join(root, file)), f + ' → ' + file).toBe(true);
      expect(query, f + ' → ' + file + ' has no ?v= stamp (run npm run stamp)').toMatch(/^v=\d{8}[a-z]+$/);
      stamps.add(query);
    }
  });
  expect([...stamps]).toHaveLength(1);
});

test('the app\'s own pages load Firebase from the app, not from gstatic.com', () => {
  const app = fs.readFileSync(path.join(root, 'js/firebase.js'), 'utf8') + fs.readFileSync(path.join(root, 'CP.html'), 'utf8');
  expect(app).not.toContain('gstatic.com/firebasejs');
  for (const f of ['firebase-app.js', 'firebase-firestore.js', 'firebase-auth.js']) {
    const src = fs.readFileSync(path.join(root, 'js/vendor/firebase-10.12.5', f), 'utf8');
    expect(src).not.toMatch(/from\s*"https?:/);           // nothing fetched from elsewhere
  }
});

test('the Firebase files kept in the app really work in a browser', async ({ page }) => {
  // the real files this time (no stand-in); nothing is sent to the database
  await page.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await page.goto('/tests/support/blank.html');
  const res = await page.evaluate(async () => {
    const app = await import('/js/vendor/firebase-10.12.5/firebase-app.js');
    const fs = await import('/js/vendor/firebase-10.12.5/firebase-firestore.js');
    const auth = await import('/js/vendor/firebase-10.12.5/firebase-auth.js');
    const a = app.initializeApp({ apiKey: 'x', projectId: 'demo-test', appId: '1:1:web:1' });
    const db = fs.getFirestore(a);
    return { db: !!db && typeof fs.collection === 'function', auth: typeof auth.getAuth === 'function', ver: app.SDK_VERSION };
  });
  expect(res).toEqual({ db: true, auth: true, ver: '10.12.5' });
});

test('Settings → Status shows how the app is doing', async ({ page, context }) => {
  await prepare(context, { storage: { ta_play_usage: JSON.stringify({ at: Date.now(), bytes: 3 * 1048576, links: 4 }) } });
  await page.goto('/settings.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  const rows = page.locator('#statusRows');
  await expect(rows.locator('.status-row')).not.toHaveCount(0, { timeout: 5000 });
  await expect(rows).toContainText('Signed in — this device can save');
  await expect(rows).toContainText('4 links, about 3.0 MB');
  await expect(rows).toContainText(/Results on this device\s*\d+ kept/);
  await expect(rows).toContainText('Firebase 10.12.5');
  // a refused request shows up there
  await page.evaluate(() => { window.taReportDbError({ code: 'resource-exhausted' }); renderStatusPanel(); });
  await expect(rows.locator('.status-row.bad')).toContainText('limit was reached');
});
