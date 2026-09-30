// The database lock: teachers sign in to the database (Firebase Authentication)
// with their login and password, and the Control Panel tells the database which
// account belongs to which teacher (firestore.rules).
const crypto = require('crypto');
const { test, expect } = require('@playwright/test');
const { prepare, data, ADMIN_CLOUD } = require('./support/app');

const sha = s => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const LOGIN = 'TESTER', PASS = 'pass1234';
const HASH = sha('TA-ACCT-v1|' + LOGIN + '|' + PASS);
const TAG = sha('TA-AUTH-v1|' + LOGIN + '|' + PASS).slice(0, 12);
const EMAIL = 'tester+' + TAG + '@teachers-assistant.app';

// the teacher's account record, as the Control Panel writes it
function accountRecord(pw) {
  return { __id: 'acct1', v: 1, code: 'TAUSER', type: 'TA_ACCOUNT', title: [LOGIN, HASH, 'active', 'Tess Test'].join('␟'),
    name: 'Tess Test', pw: pw || '', date: new Date(Date.now() - 86400000).toISOString() };
}
const docs = pw => data.results(Date.now()).concat([accountRecord(pw)]);
const fakeAuth = page => page.evaluate(() => JSON.parse(sessionStorage.getItem('__fakeAuth')));
const session = page => page.evaluate(() => JSON.parse(sessionStorage.getItem('ta_session_v1') || 'null'));

test('signing in also signs in to the database', async ({ page, context }) => {
  await prepare(context, { signedIn: false, docs: docs() });
  await page.goto('/index.html');
  await page.fill('#taLoginUser', LOGIN);
  await page.fill('#taLoginPass', PASS);
  await page.click('#taLoginBtn');
  await page.waitForURL('**/index.html');
  await expect.poll(async () => (await session(page) || {}).ce, { timeout: 10000 }).toBe(EMAIL);
  expect((await fakeAuth(page)).current).toBe(EMAIL);
  await page.waitForTimeout(1500);
  await expect(page.locator('#taCloudUnlock')).toHaveCount(0);   // no need to ask again
});

test('a device signed in before the lock is asked for the password once', async ({ page, context }) => {
  await prepare(context, { docs: docs(), rules: true, cloud: false,
    session: { login: LOGIN, name: 'Tess Test', hash: HASH } });
  await page.goto('/index.html');
  const ask = page.locator('#taCloudUnlock');
  await expect(ask).toBeVisible({ timeout: 10000 });
  await ask.locator('input').fill('wrong');
  await ask.locator('.sync-unlock-ok').click();
  await expect(ask.locator('.sync-unlock-err')).toContainText('incorrect');
  await ask.locator('input').fill(PASS);
  await ask.locator('.sync-unlock-ok').click();
  await expect(ask).toHaveCount(0);
  expect((await fakeAuth(page)).current).toBe(EMAIL);
  const s = await session(page);
  expect(s.ce).toBe(EMAIL);
  expect(s.sk).toBeTruthy();                                        // sync turned on at the same time

  // now the teacher's own records are accepted
  expect(await page.evaluate(() => taDisableExercisePoints('654321', '123456'))).toBe('ok');
  await page.reload();
  await page.waitForTimeout(2000);
  await expect(page.locator('#taCloudUnlock')).toHaveCount(0);
});

test('without the database sign-in the teacher\'s records are refused, and the app asks', async ({ page, context }) => {
  await prepare(context, { docs: docs(), rules: true, cloud: false,
    session: { login: LOGIN, name: 'Tess Test', hash: HASH } });
  await page.goto('/index.html');
  await expect(page.locator('#taCloudUnlock')).toBeVisible({ timeout: 10000 });
  await page.locator('#taCloudUnlock .sync-unlock-cancel').click();     // "Not now"
  expect(await page.evaluate(() => taDisableExercisePoints('654321', '123456'))).toBe('failed');
  // students' results still arrive without any sign-in
  await page.evaluate(() => window.__studentSubmits({ v: 1, code: '700010', type: 'Dictation', title: 'Kitchen', name: 'Cora Test', studentId: '10003', score: 80, date: new Date().toISOString() }));
  expect(await page.evaluate(() => window.__fakeDocs.some(d => d.name === 'Cora Test'))).toBe(true);
  // after "Not now", it asks again only when something is refused
  await page.reload();
  await page.waitForTimeout(2000);
  await expect(page.locator('#taCloudUnlock')).toHaveCount(0);
  await page.evaluate(() => taDisableExercisePoints('654321', '123456'));
  await expect(page.locator('#taCloudUnlock')).toBeVisible();
});

test('logging out also signs out of the database', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/index.html');
  await page.waitForTimeout(1000);
  expect((await fakeAuth(page)).current).toBe(ADMIN_CLOUD.email);
  await page.evaluate(() => taLogout(true));
  await page.waitForTimeout(1500);
  expect((await fakeAuth(page)).current).toBe(null);
  await expect(page.locator('#welcomeSplashOverlay')).toBeVisible();
});

// the teacher's password, sealed the way the Control Panel keeps it (AES-GCM with the panel's key)
function seal(keyBytes, text) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', keyBytes, iv);
  const ct = Buffer.concat([c.update(text, 'utf8'), c.final(), c.getAuthTag()]);
  return 'v1:' + iv.toString('base64') + ':' + ct.toString('base64');
}

test('the Control Panel tells the database which account is each teacher\'s, and shows the rules', async ({ page, context }) => {
  const key = crypto.randomBytes(32);
  await prepare(context, { docs: docs(seal(key, PASS)) });
  await context.addInitScript(({ k, ce }) => {
    sessionStorage.setItem('ta_ctrl_session', '1');
    sessionStorage.setItem('ta_ctrl_pwkey', k);
    sessionStorage.setItem('ta_ctrl_ce', ce);
  }, { k: key.toString('base64'), ce: ADMIN_CLOUD.email });
  await page.goto('/CP.html');
  await expect.poll(() => page.evaluate(() => (window.__fakeDocs.find(d => d.__col === 'accounts' && d.__id === 'tester') || {}).tag), { timeout: 10000 }).toBe(TAG);
  await expect(page.locator('.user-row', { hasText: 'Tess Test' }).locator('.db-line')).toContainText('ready');
  await expect(page.locator('#dbStatus')).toContainText('locked');

  // turning the teacher off takes their database access away
  page.once('dialog', d => d.accept());
  await page.locator('.user-row', { hasText: 'Tess Test' }).locator('[data-act="toggle"]').click();
  await expect.poll(() => page.evaluate(() => window.__fakeDocs.find(d => d.__col === 'accounts' && d.__id === 'tester').status)).toBe('off');

  await page.click('#dbRulesBtn');
  await expect(page.locator('#dbRules')).toHaveValue(/request\.auth\.uid == 'uid-admin'/);
  expect(await page.locator('#dbRules').inputValue()).not.toContain('__ADMIN_UID__');
});
