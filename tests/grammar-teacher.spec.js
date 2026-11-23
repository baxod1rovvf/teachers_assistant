// The teacher's Grammar Journey (2026-11-16): a section under the group cards on the Course page — 7 levels (Beginner and
// Elementary and Pre-Intermediate have lessons), one link per lesson for every group, a results table with a group filter, Not finished per group.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const GROUPS = [{ id: 'ga', name: 'Apex' }, { id: 'gt', name: 'Target' }];
const ROSTER = [
  { name: 'Alice Test', id: '10001', group: 'ga' },
  { name: 'Bobur Test', id: '10002', group: 'ga' },
  { name: 'Dilnoza Test', id: '10003', group: 'gt' }
];
const iso = minsAgo => new Date(Date.now() - minsAgo * 60000).toISOString();
const res = (n, sid, name, correct, secs, minsAgo) => ({ __id: 'sk_GRM111_' + sid + '_' + n, v: 1, type: 'Grammar course', code: 'GRM111', skill: 'grammar',
  lesson: 'g1', lessonNo: 1, level: 'beginner', name, studentId: sid, correct, total: 20, score: Math.round(correct / 20 * 100),
  timeSeconds: secs, timeDisplay: Math.round(secs / 60) + ' min', answers: [], date: iso(minsAgo), builtAt: iso(minsAgo), submittedAt: iso(minsAgo),
  title: 'Lesson 1 · To Be — Grammar' });
const LINKS = { g1: { code: 'GRM111', sentAt: iso(60 * 24), rosterSig: '' } };

async function openCourse(page, context, opts) {
  opts = opts || {};
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const storage = { ta_student_groups: JSON.stringify(GROUPS), ta_points_roster: JSON.stringify(opts.roster || ROSTER) };
  if (opts.links) storage.ta_grammar_links = JSON.stringify(opts.links);
  const docs = opts.docs || [];
  await prepare(context, { docs, storage });
  const errors = watchErrors(page);
  await page.goto('/grammarjourney.html');
  if (docs.length) await page.waitForFunction(n => (window.__allResults || []).length >= n, docs.filter(d => d.code === 'GRM111').length, { timeout: 10000 });
  await hideNotices(page);
  await page.addStyleTag({ content: '#taNoticeStack { display: none !important; }' });
  return errors;
}
async function openLesson(page) {
  if (!await page.locator('.gr-lesson').count()) await page.locator('.gr-level[data-level="beginner"] .gr-level-open').click();
  await page.locator('.gr-lesson[data-lesson="g1"] .gr-lesson-open').click();
  await expect(page.locator('.gr-lesson-page')).toBeVisible();
}

test('Grammar Journey has its own page (grammarjourney.html): 7 levels, 4 coming soon; Beginner lists 15 lessons; ← Course goes back', async ({ page, context }) => {
  const errors = await openCourse(page, context);
  await expect(page.locator('#panel-grammarjourney .card-head h2')).toHaveText('📚 Grammar Journey');
  await expect(page.locator('#grammarWrap .gr-journey')).toBeVisible();
  await expect(page.locator('.sk-cards')).toHaveCount(0);   // the IELTS Journey's groups are on their own page
  await expect(page.locator('.gr-level')).toHaveCount(7);
  await expect(page.locator('.gr-level.soon')).toHaveCount(4);
  await expect(page.locator('.gr-level.soon').first()).toContainText('Coming soon');
  await expect(page.locator('.gr-level[data-level="beginner"]')).toContainText('15 lessons');
  await page.locator('.gr-level[data-level="beginner"] .gr-level-open').click();
  await expect(page.locator('.gr-lesson')).toHaveCount(15);
  await page.getByRole('button', { name: '← Grammar Journey' }).click();
  await expect(page.locator('.gr-level')).toHaveCount(7);
  // ← Course opens the three journeys' cards, and the Grammar card comes back here
  await page.getByRole('button', { name: '← Course' }).click();
  await expect(page.locator('.cr-card')).toHaveCount(3);
  await expect(page.locator('.cr-card[data-journey="grammarjourney"] .cr-line')).toHaveText('0 lessons sent');
  await page.locator('.cr-card[data-journey="grammarjourney"]').click();
  await expect(page.locator('#grammarWrap .gr-level')).toHaveCount(7);
  expect(errors).toEqual([]);
});

test('Elementary is open: 17 lessons (16–32), and Copy link on Lesson 16 gives its own link', async ({ page, context }) => {
  const errors = await openCourse(page, context);
  await expect(page.locator('.gr-level[data-level="elementary"]')).not.toHaveClass(/soon/);
  await expect(page.locator('.gr-level[data-level="elementary"] .gr-level-sub')).toHaveText('17 lessons · 0 sent');
  await page.locator('.gr-level[data-level="elementary"] .gr-level-open').click();
  await expect(page.locator('.gr-lesson')).toHaveCount(17);
  expect(await page.locator('.gr-lesson').evaluateAll(els => els.map(e => e.dataset.lesson)))
    .toEqual(Array.from({ length: 17 }, (_, i) => 'g' + (i + 16)));
  await expect(page.locator('.gr-lesson[data-lesson="g16"]')).toContainText('Present Continuous');
  await expect(page.locator('.gr-lesson[data-lesson="g32"]')).toContainText('Future with Will and Be Going To');
  await page.locator('.gr-lesson[data-lesson="g16"]').getByRole('button', { name: '🔗 Copy link' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/skill\.html\?s=grammar&gl=g16&c=[0-9A-Za-z]{6}$/);
  const code = (await page.evaluate(() => navigator.clipboard.readText())).split('&c=')[1];
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g16.code)).toBe(code);
  expect(errors).toEqual([]);
});

test('Pre-Intermediate is open: 18 lessons (33–50)', async ({ page, context }) => {
  const errors = await openCourse(page, context);
  await expect(page.locator('.gr-level[data-level="preintermediate"]')).not.toHaveClass(/soon/);
  await expect(page.locator('.gr-level[data-level="preintermediate"] .gr-level-sub')).toHaveText('18 lessons · 0 sent');
  await page.locator('.gr-level[data-level="preintermediate"] .gr-level-open').click();
  await expect(page.locator('.gr-lesson')).toHaveCount(18);
  expect(await page.locator('.gr-lesson').evaluateAll(els => els.map(e => e.dataset.lesson)))
    .toEqual(Array.from({ length: 18 }, (_, i) => 'g' + (i + 33)));
  await expect(page.locator('.gr-lesson[data-lesson="g33"]')).toContainText('Present Continuous for Future Arrangements');
  await expect(page.locator('.gr-lesson[data-lesson="g50"]')).toContainText('Too and Enough');
  expect(errors).toEqual([]);
});

test('🔗 Copy link: one link for every group, the class list holds every student with their own group', async ({ page, context }) => {
  const errors = await openCourse(page, context);
  await page.locator('.gr-level[data-level="beginner"] .gr-level-open').click();
  await page.locator('.gr-lesson[data-lesson="g1"]').getByRole('button', { name: '🔗 Copy link' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/skill\.html\?s=grammar&gl=g1&c=[0-9A-Za-z]{6}$/);
  const url = await page.evaluate(() => navigator.clipboard.readText());
  const code = url.split('&c=')[1];
  const kept = await page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1);
  expect(kept.code).toBe(code);
  expect(kept.sentAt).toBeTruthy();
  const sig = await page.evaluate(() => window.grRosterSig());
  expect(sig).toContain('10001|Alice Test|Apex');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toBe(sig);
  await expect.poll(() => page.evaluate(c => { const d = window.__fakeDocs.find(x => x.__id === 'class-' + c); return d ? JSON.parse(d.data).map(e => e.g) : null; }, code))
    .toEqual(['Apex', 'Apex', 'Target']);
  // the same code on the next press; a skills code is never reused
  await page.locator('.gr-lesson[data-lesson="g1"]').getByRole('button', { name: '🔗 Copy link' }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.code)).toBe(code);
  await expect(page.locator('.gr-lesson[data-lesson="g1"]')).toContainText('0 done');
  expect(errors).toEqual([]);
});

test('the lesson\'s results: first try only, ranked by score then time, filter by group, Not finished, not on the list', async ({ page, context }) => {
  const docs = [
    res(1, '10001', 'Alice Test', 15, 26 * 60, 120),   // Alice's first try
    res(2, '10001', 'Alice Test', 19, 10 * 60, 30),    // a later one — never counted
    res(1, '10003', 'Dilnoza Test', 15, 20 * 60, 90),  // same score, faster → above Alice
    res(1, '99999', 'Stranger Kid', 18, 15 * 60, 60)   // not on the Students list
  ];
  const errors = await openCourse(page, context, { docs, links: LINKS });
  await expect(page.locator('.gr-level[data-level="beginner"]')).toContainText('1 sent');
  await page.locator('.gr-level[data-level="beginner"] .gr-level-open').click();
  await expect(page.locator('.gr-lesson[data-lesson="g1"]')).toContainText('3 done');
  await openLesson(page);
  const rows = page.locator('.gr-table .gr-trow');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText('Dilnoza Test');
  await expect(rows.nth(0)).toContainText('Target');
  await expect(rows.nth(1)).toContainText('Alice Test');
  await expect(rows.nth(1)).toContainText('15/20');
  await expect(rows.nth(1)).not.toContainText('19/20');
  await expect(rows.nth(1)).toContainText('26 min');
  const data = await page.evaluate(() => window.grTableRows('g1', 'all').map(r => [r.place, r.name, r.group, r.correct]));
  expect(data).toEqual([[1, 'Dilnoza Test', 'Target', 15], [2, 'Alice Test', 'Apex', 15]]);
  // under All: one Not finished list per group
  await expect(page.locator('.gr-missing')).toHaveCount(2);
  await expect(page.locator('.gr-missing').filter({ hasText: 'Apex' }).locator('h3')).toHaveText('🚫 Not finished — Apex (1)');
  await expect(page.locator('.gr-missing').filter({ hasText: 'Target' })).toContainText('Everyone has finished');
  // not on the Students list
  await expect(page.locator('.gr-unlisted h3')).toContainText('Not on your Students list (1)');
  await expect(page.locator('.gr-unlisted')).toContainText('Stranger Kid');
  await expect(page.locator('.gr-unlisted')).toContainText('ID 99999');
  // filter Apex
  await page.locator('.gr-filter').getByRole('button', { name: 'Apex' }).click();
  await expect(rows).toHaveCount(1);
  await expect(rows.nth(0)).toContainText('Alice Test');
  await expect(page.locator('.gr-missing')).toHaveCount(1);
  await expect(page.locator('.gr-missing h3')).toHaveText('🚫 Not finished — Apex (1)');
  await expect(page.locator('.gr-missing li')).toHaveText(['Bobur Test']);
  await page.locator('.gr-missing').getByRole('button', { name: '📋 Copy list' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(
    'Lesson 1 · To Be (am/is/are) + A/An — Apex\nNot finished yet:\n1. Bobur Test');
  // ← Beginner goes back to the level's lessons
  await page.getByRole('button', { name: '← Beginner' }).click();
  await expect(page.locator('.gr-lesson')).toHaveCount(15);
  expect(errors).toEqual([]);
});

test('a result\'s group is the student\'s group now; ▶️ Try opens the preview', async ({ page, context }) => {
  const moved = ROSTER.map(s => s.id === '10001' ? Object.assign({}, s, { group: 'gt' }) : s);
  const errors = await openCourse(page, context, { docs: [res(1, '10001', 'Alice Test', 17, 600, 60)], links: LINKS, roster: moved });
  await openLesson(page);
  await expect(page.locator('.gr-table .gr-trow')).toHaveCount(1);
  await expect(page.locator('.gr-table .gr-trow')).toContainText('Target');
  await page.locator('.gr-filter').getByRole('button', { name: 'Apex' }).click();
  await expect(page.locator('.gr-table .gr-trow')).toHaveCount(0);
  await page.locator('.gr-filter').getByRole('button', { name: 'All' }).click();
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.locator('.gr-lesson-page').getByRole('button', { name: '▶️ Try' }).click()]);
  await popup.waitForURL(/skill\.html/);
  expect(popup.url()).toMatch(/skill\.html\?s=grammar&gl=g1&c=GRM111&preview=1$/);
  await popup.close();
  expect(errors).toEqual([]);
});

test('a student added after Copy link can start: the Course page puts the class list online again', async ({ page, context }) => {
  const errors = await openCourse(page, context, { links: LINKS, roster: ROSTER.concat([{ name: 'Eshmat Test', id: '10004', group: 'gt' }]) });
  await expect.poll(() => page.evaluate(() => { const d = window.__fakeDocs.find(x => x.__id === 'class-GRM111'); return d ? JSON.parse(d.data).length : null; })).toBe(4);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toContain('10004|Eshmat Test|Target');
  expect(errors).toEqual([]);
});

test('no change, no write: a list that is up to date is not put online again', async ({ page, context }) => {
  const sig = ROSTER.map(s => s.id + '|' + s.name + '|' + (s.group === 'ga' ? 'Apex' : 'Target')).sort().join('\n');
  await openCourse(page, context, { links: { g1: { code: 'GRM111', sentAt: iso(60), rosterSig: sig } } });
  expect(await page.evaluate(() => window.grRosterSig())).toBe(sig);
  await page.evaluate(() => { window.__grRefreshMs = 0; window.grRefreshLists(); });
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.__writes.filter(w => /^class-/.test(w.id)).length)).toBe(0);
  expect(await page.evaluate(() => window.__deletes.filter(i => /^class-/.test(i)).length)).toBe(0);
});

test('a roster change from sync (a storage event) refreshes the list; a failed publish is tried again', async ({ page, context }) => {
  await openCourse(page, context, { links: LINKS });
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toContain('10003|Dilnoza Test|Target');
  // sync puts a new Students list: taStoreChanged (js/sync.js setLocal) refreshes a moment later
  await page.evaluate(() => {
    window.__grRefreshMs = 0; window.__taStoreRefreshMs = 0;   // it waits 3 s for the rest of a sync merge; not here
    const r = JSON.parse(localStorage.getItem('ta_points_roster')); r.push({ name: 'Farhod Test', id: '10005', group: 'ga' });
    localStorage.setItem('ta_points_roster', JSON.stringify(r));
    window.taStoreChanged('ta_points_roster');
  });
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toContain('10005|Farhod Test|Apex');
  // a publish that can't reach the database keeps the old rosterSig, so the next change tries again
  await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('ta_points_roster')); r.push({ name: 'Gayrat Test', id: '10006', group: 'ga' });
    localStorage.setItem('ta_points_roster', JSON.stringify(r));
    window.__failWrites = 1; window.__grRetryMs = 60000;
    window.grRefreshLists();
    window.__grRefreshMs = 60000;                  // another refresh now must wait (debounce)
  });
  await expect.poll(() => page.evaluate(() => window.__failWrites)).toBe(0);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).not.toContain('10006');
  await page.evaluate(() => { window.__grRefreshMs = 0; window.taStoreChanged('ta_student_groups'); });
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toContain('10006|Gayrat Test|Apex');
  await expect.poll(() => page.evaluate(() => { const d = window.__fakeDocs.find(x => x.__id === 'class-GRM111'); return d ? JSON.parse(d.data).length : null; })).toBe(5);
});

test('with a lesson page open, a student added to the roster still gets the list refreshed', async ({ page, context }) => {
  await openCourse(page, context, { links: LINKS });
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toContain('10003|');
  await page.locator('.gr-level[data-level="beginner"] .gr-level-open').click();
  await page.locator('.gr-lesson[data-lesson="g1"] .gr-lesson-open').click();
  await expect(page.locator('.gr-lesson-page')).toBeVisible();
  await page.evaluate(() => {
    window.__grRefreshMs = 0;
    const r = JSON.parse(localStorage.getItem('ta_points_roster')); r.push({ name: 'Gulnora Test', id: '10006', group: 'gt' });
    localStorage.setItem('ta_points_roster', JSON.stringify(r));
    window.renderGrammarJourney();
  });
  await expect.poll(() => page.evaluate(() => { const d = window.__fakeDocs.find(x => x.__id === 'class-GRM111'); return d ? JSON.parse(d.data).length : null; })).toBe(4);
});

test('adding a student on the Students page refreshes the list without visiting Course', async ({ page, context }) => {
  await openCourse(page, context, { links: LINKS });
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toContain('10003|');
  await page.evaluate(() => { window.__grRefreshMs = 0; savePointsRoster(getPointsRoster().concat([{ name: 'Hamid Test', id: '10007', group: 'ga' }])); });
  await expect.poll(() => page.evaluate(() => { const d = window.__fakeDocs.find(x => x.__id === 'class-GRM111'); return d ? JSON.parse(d.data).length : null; })).toBe(4);
});

test('a failed publish gets a delayed retry by itself (3 attempts at most)', async ({ page, context }) => {
  await openCourse(page, context, { links: LINKS });
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toContain('10003|');
  await page.evaluate(() => {
    window.__grRefreshMs = 0; window.__grRetryMs = 300; window.__failWrites = 1;
    savePointsRoster(getPointsRoster().concat([{ name: 'Ibrohim Test', id: '10008', group: 'ga' }]));
  });
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toContain('10008|Ibrohim Test|Apex');
});

test('an empty Students list on this device doesn\'t wipe a class list that was published before', async ({ page, context }) => {
  const sig = ROSTER.map(s => s.id + '|' + s.name + '|' + (s.group === 'ga' ? 'Apex' : 'Target')).sort().join('\n');
  await openCourse(page, context, { roster: [], links: { g1: { code: 'GRM111', sentAt: iso(60), rosterSig: sig } } });
  await page.evaluate(() => { window.__grRefreshMs = 0; window.grRefreshLists(); });
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.__writes.filter(w => /^class-/.test(w.id)).length)).toBe(0);
  expect(await page.evaluate(() => window.__deletes.filter(i => /^class-/.test(i)).length)).toBe(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_grammar_links')).g1.rosterSig)).toBe(sig);
});

test('Copy link with an empty Students list does not publish over a list that is already online', async ({ page, context }) => {
  const errors = await openCourse(page, context, { links: { g1: { code: 'GRM111', sentAt: iso(60), rosterSig: 'x|y|z' } }, roster: [] });
  await page.evaluate(() => { window.__writes.length = 0; window.__deletes.length = 0; });
  await page.evaluate(() => window.grCopyLink('g1'));
  await expect(page.getByText('Your Students list hasn\'t loaded yet').first()).toBeVisible();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.__writes.filter(w => /^class-/.test(w.id)).length)).toBe(0);
  expect(errors).toEqual([]);
});
