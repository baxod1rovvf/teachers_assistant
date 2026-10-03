// Every page of the app opens without errors, and the sidebar moves between them.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const PAGES = ['index.html', 'create.html', 'statistics.html', 'my-exercises.html', 'students.html', 'results.html', 'settings.html'];

for (const file of PAGES) {
  test(`${file} opens without errors`, async ({ page, context }) => {
    await prepare(context);
    const errors = watchErrors(page);
    await page.goto('/' + file);
    await page.waitForTimeout(1500);
    await expect(page.locator('#mainSidebar')).toBeAttached();
    expect(errors).toEqual([]);
  });
}

test('the sidebar opens each section without reloading', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/index.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  for (const [tab, panel] of [['myexercises', '#panel-myexercises'], ['students', '#panel-students'], ['results', '#panel-results'], ['main', '#panel-main']]) {
    await page.evaluate(t => switchTo(t), tab);
    await expect(page.locator(panel)).toHaveClass(/active/, { timeout: 5000 });
  }
  expect(errors).toEqual([]);
});

test('signed out, the login screen shows', async ({ page, context }) => {
  await prepare(context, { signedIn: false });
  await page.goto('/index.html');
  await page.waitForTimeout(1200);
  await expect(page.locator('#welcomeSplashOverlay')).toBeVisible();
});

// After an update, another section must never come in as a different version of the
// app (one section new, another old): it opens with a full page load instead.
test('a section from another version of the app opens with a full page load', async ({ page, context }) => {
  await prepare(context);
  // Results comes from another version of the app (before the background loading reaches it)
  let served = false;
  await page.route(/\/results\.html$/, async route => {
    const res = await route.fetch();
    const html = (await res.text()).replace(/\?v=[\w]+/g, '?v=19990101a');
    served = true;
    await route.fulfill({ response: res, body: html });
  });
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  expect(await page.evaluate(() => !document.getElementById('panel-results'))).toBe(true); // not mixed in by the background loading
  await page.evaluate(() => { window.__noReload = true; });
  await page.evaluate(() => taNavigate('results.html'));
  await page.waitForURL(/results\.html/);
  await expect(page.locator('#panel-results')).toBeVisible({ timeout: 8000 });
  expect(served).toBe(true);
  expect(await page.evaluate(() => window.__noReload)).toBeUndefined(); // the page was loaded again
});

test('another section is asked for fresh from the server, not the browser\'s saved copy', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1200);
  const mode = await page.evaluate(async () => {
    let seen = null;
    const real = window.fetch;
    window.fetch = (url, init) => { if (/results\.html$/.test(String(url))) seen = init && init.cache; return real(url, init); };
    delete TA_PAGE_HTML['results.html'];
    await taFetchPage('results.html');
    window.fetch = real;
    return seen;
  });
  expect(mode).toBe('no-cache');
});

test('Results isn\'t in the menu: it opens from View Results, with a way back to My Exercises', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await expect(page.locator('.side-btn[data-tab="results"]')).toBeHidden();
  await page.locator('.myex-card', { hasText: 'Kitchen' }).locator('.myex-results').click();
  await expect(page.locator('#panel-results')).toHaveClass(/active/, { timeout: 8000 });
  await page.locator('.res-back-btn').click();
  await expect(page.locator('#panel-myexercises')).toHaveClass(/active/, { timeout: 8000 });
});

test('on a computer, the other sections load in the background, so opening one is instant', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/index.html');
  await expect.poll(() => page.evaluate(() => ['panel-myexercises', 'panel-students', 'panel-settings', 'panel-createpicker'].every(id => document.getElementById(id))), { timeout: 15000 }).toBe(true);
  const ms = await page.evaluate(() => { const t0 = performance.now(); switchTo('students'); return performance.now() - t0; });
  expect(ms).toBeLessThan(500);
  await expect(page.locator('#panel-students')).toHaveClass(/active/);
});

test('My Exercises reads the saved exercise files once per drawing, and sees a newly saved one at once', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1200);
  const res = await page.evaluate(() => {
    let reads = 0;
    const real = Storage.prototype.getItem;
    Storage.prototype.getItem = function (k) { if (/ta_exercise_html_cache$/.test(k)) reads++; return real.apply(this, arguments); };
    renderRecentExercises();
    Storage.prototype.getItem = real;
    cacheExerciseHtml('udict', '<html>new copy</html>');
    return { reads, fresh: getCachedExerciseHtml('udict') };
  });
  expect(res.reads).toBeLessThanOrEqual(1);
  expect(res.fresh).toBe('<html>new copy</html>');
});

test('phones load the other sections in the background too', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await prepare(context);
  const page = await context.newPage();
  await page.goto('/index.html');
  await expect.poll(() => page.evaluate(() => ['panel-myexercises', 'panel-students', 'panel-settings'].every(id => document.getElementById(id))), { timeout: 20000 }).toBe(true);
  await context.close();
});

test('the Dashboard opens quickly even with many long dictations (and their scores stay the same)', async ({ page, context }) => {
  const words = 'every saturday sarah wakes up in her bedroom and then goes to the kitchen to make breakfast'.split(' ');
  const ref = Array.from({ length: 150 }, (_, i) => words[i % words.length]).join(' ');
  const roster = Array.from({ length: 30 }, (_, i) => ({ id: String(57000 + i), name: 'Student ' + i, group: 'g1' }));
  const docs = [], ex = [];
  for (let e = 0; e < 6; e++) {
    const code = String(300000 + e);
    ex.push({ uid: 'u' + e, title: 'Dict ' + e, code, typeLabel: 'Dictation', groupId: 'g1', date: new Date().toISOString() });
    roster.forEach((st, k) => docs.push({ __id: 'r' + e + '_' + k, v: 1, code, type: 'Dictation', title: 'Dict ' + e, name: st.name, studentId: st.id, score: 100,
      referenceText: ref, studentText: ref.split(' ').filter((w, i) => (i + k + e) % 7).join(' '), timeSeconds: 60, date: new Date(Date.now() - e * 1e6 - k * 1000).toISOString(), submittedAt: new Date(Date.now() - e * 1e6).toISOString() }));
  }
  await prepare(context, { docs, storage: { ta_student_groups: JSON.stringify([{ id: 'g1', name: 'Target' }]), ta_points_roster: JSON.stringify(roster), ta_recent_exercises: JSON.stringify(ex) } });
  await page.goto('/my-exercises.html');
  await expect.poll(() => page.evaluate(() => (window.__allResults || []).length), { timeout: 15000 }).toBe(180);
  const res = await page.evaluate(() => {
    const t0 = performance.now(); switchTo('main'); const ms = performance.now() - t0;
    const r = window.__allResults.find(x => x.studentId === '57001' && x.code === '300000');
    return { ms, score: taResultScore(r), again: taResultScore(r), slow: (() => { const ops = taDictAlign(r.referenceText, r.studentText, taDictNorm); return Math.round(ops.filter(o => o.type === 'ok').length / ops.length * 100); })() };
  });
  expect(res.ms).toBeLessThan(1500);   // was ~5 s before 2026-10-04
  expect(res.score).toBe(res.slow);
  expect(res.again).toBe(res.score);
});
