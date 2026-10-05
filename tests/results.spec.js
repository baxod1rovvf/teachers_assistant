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
  await expect(aliceChip).toHaveText('✕');
  await aliceChip.click();
  await expect(page.locator('.results-table tbody tr', { hasText: 'Alice Test' }).locator('.check-chip')).toHaveText('✓');
  await page.reload();
  await page.waitForTimeout(1500);
  await hideNotices(page);
  await page.evaluate(code => { document.getElementById('res-code-input').value = code; onResultsCodeInput(); }, data.DICTATION_CODE);
  await expect(page.locator('.results-table tbody tr', { hasText: 'Alice Test' }).locator('.check-chip')).toHaveText('✓');

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
  await expect(row).not.toContainText('Completed'); // the 3/3 says it
  // the column names above the list
  const head = page.locator('.hwc-list-head');
  for (const t of ['Name', 'ID', 'Progress', 'Checked', 'Punished?', 'Time', 'Last online']) await expect(head).toContainText(t);
  // lined up: "Checked" sits right above the ✓/✕ icon
  const hx = (await head.locator('span').nth(3).boundingBox()).x, cx = (await row.locator('.hwc-col-status').boundingBox()).x;
  expect(Math.abs(hx - cx)).toBeLessThan(4);
  await page.evaluate(() => toggleHwcStudentExpand('20001'));
  await page.evaluate(() => viewHwcRoundAnswer('700004', 'Dilya Test', 'My room — Dictation', '20001'));
  await expect(page.locator('#sentenceViewTitle')).toContainText('Dilya Test');
  await expect(page.locator('#sentenceViewBody')).toContainText('correct');
  expect(errors).toEqual([]);
});

test('"Will be punished" marks a student in red and is remembered', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/results.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  const open = () => page.evaluate(code => { document.getElementById('res-code-input').value = code; onResultsCodeInput(); }, data.DICTATION_CODE);
  await open();
  const row = () => page.locator('.results-table tbody tr', { hasText: 'Alice Test' });
  await expect(row()).not.toHaveClass(/punished/);
  await row().locator('.punish-chip').click();
  await expect(row()).toHaveClass(/punished/);
  await expect(row().locator('.punish-chip')).toHaveText('⚠️');
  await expect(page.locator('.results-summary')).toContainText('1 will be punished');
  // a student who didn't do it can be marked too
  const cora = page.locator('.missing-student', { hasText: 'Cora Test' });
  await cora.locator('.punish-chip').click();
  await expect(page.locator('.missing-student', { hasText: 'Cora Test' })).toHaveClass(/punished/);
  await page.reload();
  await page.waitForTimeout(1500);
  await hideNotices(page);
  await open();
  await expect(row()).toHaveClass(/punished/);
  await expect(page.locator('.missing-student', { hasText: 'Cora Test' })).toHaveClass(/punished/);
  // take it off again
  await row().locator('.punish-chip').click();
  await expect(row()).not.toHaveClass(/punished/);
  // in a homework set
  await page.evaluate(() => showExerciseResults('uset'));
  const dilya = page.locator('.hwc-student-row', { hasText: 'Dilya Test' });
  await dilya.locator('.punish-chip').click();
  await expect(page.locator('.hwc-student-row', { hasText: 'Dilya Test' })).toHaveClass(/punished/);
  expect(errors).toEqual([]);
});

test('My Exercises: Homework and Class sets stand out', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/my-exercises.html');
  await page.waitForTimeout(1000);
  await hideNotices(page);
  const set = page.locator('.recent-exercise-row[data-uid="uset"]');
  await expect(set).toHaveClass(/set-row/);
  await set.locator('.myex-more').click();
  await expect(page.locator('#myexMenu .badge-set')).toHaveText('Homework');   // the label is at the top of ⋯
  await page.keyboard.press('Escape');
  const sets = await page.evaluate(() => getRecentExercises().filter(e => e.setKind || /^(Homework|Class)$/.test(e.typeLabel)).length);
  await expect(page.locator('.recent-exercise-row.set-row')).toHaveCount(sets);
});

test('a set\'s rounds a student hasn\'t done yet still show their names', async ({ page, context }) => {
  await prepare(context, { storage: { ta_recent_exercises: JSON.stringify([{ uid: 'uhw9', title: 'Oct set', typeLabel: 'Homework', code: '909090', date: new Date().toISOString(),
    mergedItems: [{ title: 'Words — Vocabulary Journey', code: '111111' }, { title: 'Say it — Pronunciation', code: '222222' }] }]) } });
  await page.goto('/results.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(() => {
    hwcResultsCurrentItem = getRecentExercises()[0];
    window.__hwcProgressDocs = [{ studentId: '10001', studentName: 'Alice Test', completedCount: 1, totalCount: 2, completedFlags: [true, false],
      roundLabels: ['Words — Vocabulary Journey', ''], roundCodes: ['111111', ''], lastActive: new Date().toISOString() }];
    hwcExpandedStudent = '10001';
    renderHwcResultsList();
  });
  await expect(page.locator('.hwc-round-row').nth(1)).toContainText('Say it — Pronunciation');
});

test('a Flashcard result with 0 seconds inside a set shows the time the set measured', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/results.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  const now = new Date().toISOString();
  await page.evaluate(now => {
    window.__studentSubmits({ v: 1, code: '700001', type: 'HWC_PROGRESS', title: 'Sep test', name: 'Alice Test', studentId: '10001',
      roundIndex: 0, roundLabel: 'Words — Vocabulary Journey', roundCode: '700099', totalCount: 3, timeSeconds: 964, date: now });
    window.__studentSubmits({ v: 1, code: '700099', type: 'Flashcard', title: 'Words', name: 'Alice Test', studentId: '10001',
      timeSeconds: 0, timeDisplay: '00:00', date: now });
  }, now);
  await page.waitForTimeout(1500);
  await page.evaluate(() => { document.getElementById('res-code-input').value = '700099'; onResultsCodeInput(); });
  await expect(page.locator('.results-table tbody tr', { hasText: 'Alice Test' })).toContainText('16:04', { timeout: 8000 });
});

test('Top 5: every exercise given to the group counts — one not done counts as 0%, so 3 good + 1 bad beats 1 good', async ({ page, context }) => {
  const ex = (n, groupId) => ({ uid: 'utop' + n, title: 'Top ' + n, code: 'T0000' + n, typeLabel: 'Spelling', groupId, date: new Date().toISOString() });
  await prepare(context, { storage: { ta_recent_exercises: JSON.stringify([1, 2, 3, 4].map(n => ex(n, 'g1'))) } });
  await page.goto('/index.html');
  await page.waitForTimeout(2000);
  const top = await page.evaluate(() => {
    let t = Date.now();
    const r = (code, id, name, score) => ({ code, type: 'Spelling', title: 'x', name, studentId: id, score, date: new Date(t -= 60000).toISOString() });
    const saved = window.__allResults;
    window.__allResults = [
      r('T00001', '10001', 'Alice Test', 100),                                   // Alice: 1 of 4, perfect
      r('T00001', '10002', 'Bobur Test', 90), r('T00002', '10002', 'Bobur Test', 90),
      r('T00003', '10002', 'Bobur Test', 90), r('T00004', '10002', 'Bobur Test', 30),   // Bobur: all 4, one bad
      r('T00001', '10003', 'Cora Test', 40), r('T00001', '10003', 'Cora Test', 80)       // Cora: tried one twice — the best try counts
    ];
    const out = getTopActiveStudents(5, 'g1').map(s => ({ name: s.name, pct: Math.round(s.avg), did: s.did, given: s.given }));
    window.__allResults = saved;
    return out;
  });
  expect(top).toEqual([
    { name: 'Bobur Test', pct: 75, did: 4, given: 4 },
    { name: 'Alice Test', pct: 25, did: 1, given: 4 },
    { name: 'Cora Test', pct: 20, did: 1, given: 4 }
  ]);
});

test('a set: a Dictation whose answers are there counts as done, even without its progress record (closed before pressing the button)', async ({ page, context }) => {
  // Eldor's dictation answers arrived, but not the record that says the round is done
  const docs = data.results(Date.now()).filter(d => !(d.type === 'HWC_PROGRESS' && d.studentId === '20002' && d.roundIndex === 2));
  await prepare(context, { docs });
  await page.goto('/results.html');
  await page.waitForTimeout(1500);
  await hideNotices(page);
  await page.evaluate(() => showExerciseResults('uset'));
  const eldor = page.locator('.hwc-student-row', { hasText: 'Eldor Test' });
  await expect(eldor).toContainText('3/3');
});
