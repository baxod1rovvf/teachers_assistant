// The teacher's Dictation Journey (2026-11-19): a section under the Grammar Journey on the Course page — 5 levels of 20 dictations,
// one link per dictation for every group, ▶ the whole audio, 📄 the transcript, a results table with a group filter (a row opens what
// the student wrote, sentence by sentence), Not finished per group, Not on your Students list.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const GROUPS = [{ id: 'ga', name: 'Apex' }, { id: 'gt', name: 'Target' }];
const ROSTER = [
  { name: 'Alice Test', id: '10001', group: 'ga' },
  { name: 'Bobur Test', id: '10002', group: 'ga' },
  { name: 'Dilnoza Test', id: '10003', group: 'gt' }
];
const D1 = ['Hello!', 'My name is Daniel.', 'I am thirteen years old.', 'I live in a small house with my family.',
  'I have one brother and one sister.', 'We are students.', 'My favourite colour is blue.'];
const iso = minsAgo => new Date(Date.now() - minsAgo * 60000).toISOString();
// sentences: the first try of each sentence (D1's own text unless given), ok = right the first time
function res(n, sid, name, minsAgo, secs, over) {
  over = over || {};
  const sentences = D1.map((s, i) => Object.assign({ first: s, tries: 1, skipped: false, ok: true }, (over.sentences || {})[i] || {}));
  const correctFirst = sentences.filter(s => s.ok).length, skips = sentences.filter(s => s.skipped).length;
  return { __id: 'sk_DCT111_' + sid + '_' + n, v: 1, type: 'Dictation course', code: 'DCT111', skill: 'dictation', dictation: 'd1', dictationNo: 1,
    level: 'beginner', title: 'Dictation 1 · My Name', name, studentId: sid, sentences, total: D1.length, correctFirst,
    score: Math.round(correctFirst / D1.length * 100), skips, timeSeconds: secs, timeDisplay: Math.round(secs / 60) + ' min',
    date: iso(minsAgo), builtAt: iso(minsAgo), submittedAt: iso(minsAgo) };
}
const LINKS = { d1: { code: 'DCT111', sentAt: iso(60 * 24), rosterSig: '' } };
const classSize = code => { const d = window.__fakeDocs.find(x => x.__id === 'class-' + code); return d ? JSON.parse(d.data).length : null; };

// The tests use the old Dictation 1 ("My Name", 7 sentences) as a stand-in first passage (the teacher rebuilt the journey on
// 2026-11-21 and it isn't in the real data any more), so they don't depend on which passages the journey holds.
const STAND_IN = '\nwindow.TA_DICTATION.levels[0].items[0] = { id: "d1", no: 1, title: "My Name", recorded: true, ' +
  'text: "Hello! My name is Daniel. I am thirteen years old. I live in a small house with my family. I have one brother and one sister. We are students. My favourite colour is blue.", ' +
  'sentences: ["Hello!", "My name is Daniel.", "I am thirteen years old.", "I live in a small house with my family.", "I have one brother and one sister.", "We are students.", "My favourite colour is blue."] };';
// the real data says which dictations are recorded so far; these tests pin it (all recorded, except the ones listed)
async function pinRecorded(context, unrecorded) {
  const fs = require('fs'), file = require('path').join(__dirname, '..', 'js', 'dictation-data.js');
  await context.route('**/js/dictation-data.js*', r => r.fulfill({ contentType: 'application/javascript',
    body: fs.readFileSync(file, 'utf8') + STAND_IN + '\nwindow.TA_DICTATION.levels.forEach(l => l.items.forEach(i => { i.recorded = !' + JSON.stringify(unrecorded || []) + '.includes(i.id); }));' }));
  // the stand-in d1 has no recording of its own: it borrows d16's whole-passage file
  await context.route('**/audio/dictation/d1.mp3*', r => r.fulfill({ contentType: 'audio/mpeg',
    body: fs.readFileSync(require('path').join(__dirname, '..', 'audio', 'dictation', 'd16.mp3')) }));
}
async function openCourse(page, context, opts) {
  opts = opts || {};
  await pinRecorded(context, opts.unrecorded);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const storage = { ta_student_groups: JSON.stringify(GROUPS), ta_points_roster: JSON.stringify(opts.roster || ROSTER) };
  if (opts.links) storage.ta_dictation_links = JSON.stringify(opts.links);
  const docs = opts.docs || [];
  await prepare(context, { docs, storage });
  const errors = watchErrors(page);
  await page.goto('/dictationjourney.html');
  if (docs.length) await page.waitForFunction(n => (window.__allResults || []).length >= n, docs.filter(d => d.code === 'DCT111').length, { timeout: 10000 });
  await hideNotices(page);
  await page.addStyleTag({ content: '#taNoticeStack { display: none !important; }' });
  return errors;
}
async function openLevel(page, level) {
  await page.evaluate(l => dcOpenLevel(l), level || 'beginner');
  await expect(page.locator('.dct-item').first()).toBeVisible();
}
async function openD1(page) {
  await openLevel(page);
  await page.locator('.dct-item[data-item="d1"] .gr-lesson-open').click();
  await expect(page.locator('.dct-page')).toBeVisible();
}

test('the Dictation Journey has its own page (dictationjourney.html), opening straight on a level of 20 dictations', async ({ page, context }) => {
  const errors = await openCourse(page, context, { links: LINKS });
  await expect(page.locator('#panel-dictationjourney .card-head h2')).toHaveText('Dictation Journey');
  await expect(page.locator('#panel-dictationjourney .card-head h2 .lc-pen-line')).toHaveCount(1);
  await expect(page.locator('.gr-journey, .dct-journey')).toHaveCount(0);   // no "all levels" view (2026-11-24) — the Course page lists them
  await expect(page.locator('.dct-item')).toHaveCount(20);   // no level asked → Beginner
  await openLevel(page);
  await expect(page.locator('.dct-item')).toHaveCount(20);
  expect(await page.locator('.dct-item').evaluateAll(els => els.map(e => e.dataset.item))).toEqual(await page.evaluate(() => window.TA_DICTATION.levels[0].items.map(i => i.id)));
  expect(await page.locator('.dct-item').first().getAttribute('data-item')).toBe('d1');
  await expect(page.locator('.dct-item[data-item="d1"]')).toContainText('My Name');
  await expect(page.locator('.dct-item[data-item="d1"]')).toContainText('0 done');
  await expect(page.locator('.dct-item[data-item="d17"]')).toContainText('Not sent yet');
  for (const name of ['▶ Play', '📄 Transcript', '🔗 Copy link', '▶️ Try']) {
    await expect(page.locator('.dct-item[data-item="d17"]').getByRole('button', { name, exact: true })).toBeVisible();
  }
  // ← Course: the Dictation card lists the 5 levels and opens one
  await page.getByRole('button', { name: '← Course' }).click();
  const levels = page.locator('.cr-card[data-journey="dictationjourney"] .cr-item');
  await expect(levels.locator('.cr-item-name')).toHaveText(['Beginner', 'Elementary', 'Pre-intermediate', 'Intermediate', 'Upper-intermediate & Advanced']);
  await levels.filter({ hasText: 'Intermediate' }).filter({ hasNotText: 'Pre' }).filter({ hasNotText: 'Upper' }).click();
  await expect(page.locator('#panel-dictationjourney')).toHaveClass(/active/);
  await expect(page.locator('.gr-page-head h3')).toContainText('Intermediate');
  expect(errors).toEqual([]);
});

test('▶ plays the whole audio; a missing file says it isn\'t ready; 📄 Transcript shows the full text', async ({ page, context }) => {
  await context.route('**/audio/dictation/d20.mp3*', r => r.fulfill({ status: 404, body: 'not here' }));
  const errors = await openCourse(page, context);
  await openLevel(page);
  const [req] = await Promise.all([page.waitForRequest(/audio\/dictation\/d1\.mp3/),
    page.locator('.dct-item[data-item="d1"]').getByRole('button', { name: '▶ Play', exact: true }).click()]);
  expect(req.url()).toMatch(/audio\/dictation\/d1\.mp3/);
  await expect(page.locator('.dct-item[data-item="d1"]').getByRole('button', { name: '⏸ Stop' })).toBeVisible();
  await page.locator('.dct-item[data-item="d1"]').getByRole('button', { name: '⏸ Stop' }).click();
  await expect(page.locator('.dct-item[data-item="d1"]').getByRole('button', { name: '▶ Play', exact: true })).toBeVisible();
  await page.locator('.dct-item[data-item="d20"]').getByRole('button', { name: '▶ Play', exact: true }).click();
  await expect(page.locator('#toast')).toContainText('This audio isn\'t ready yet');
  await expect(page.locator('.dct-item[data-item="d20"]').getByRole('button', { name: '▶ Play', exact: true })).toBeVisible();
  await page.locator('.dct-item[data-item="d1"]').getByRole('button', { name: '📄 Transcript' }).click();
  const modal = page.locator('.ta-modal');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.points-modal-title')).toHaveText('📄 Dictation 1 · My Name');
  await expect(modal).toContainText('Hello! My name is Daniel. I am thirteen years old.');
  await expect(modal).toContainText('My favourite colour is blue.');
  await page.keyboard.press('Escape');
  await expect(modal).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('🔗 Copy link: one link for every group, the class list holds every student with their own group; ▶️ Try opens the preview', async ({ page, context }) => {
  const errors = await openCourse(page, context);
  await openLevel(page);
  await page.locator('.dct-item[data-item="d1"]').getByRole('button', { name: '🔗 Copy link' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/skill\.html\?s=dictation&dl=d1&c=[0-9A-Za-z]{6}$/);
  const code = (await page.evaluate(() => navigator.clipboard.readText())).split('&c=')[1];
  const kept = await page.evaluate(() => JSON.parse(localStorage.getItem('ta_dictation_links')).d1);
  expect(kept.code).toBe(code);
  expect(kept.sentAt).toBeTruthy();
  const sig = await page.evaluate(() => window.grRosterSig());
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_dictation_links')).d1.rosterSig)).toBe(sig);
  await expect.poll(() => page.evaluate(c => { const d = window.__fakeDocs.find(x => x.__id === 'class-' + c); return d ? JSON.parse(d.data).map(e => e.g) : null; }, code))
    .toEqual(['Apex', 'Apex', 'Target']);
  await expect(page.locator('.dct-item[data-item="d1"]')).toContainText('0 done');
  // the same code on the next press; never a grammar code
  await page.locator('.dct-item[data-item="d1"]').getByRole('button', { name: '🔗 Copy link' }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_dictation_links')).d1.code)).toBe(code);
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.locator('.dct-item[data-item="d1"]').getByRole('button', { name: '▶️ Try' }).click()]);
  await popup.waitForURL(/skill\.html/);
  expect(popup.url()).toMatch(new RegExp('skill\\.html\\?s=dictation&dl=d1&c=' + code + '&preview=1$'));
  await popup.close();
  expect(errors).toEqual([]);
});

test('a dictation\'s results: first run only, filter by group, a row shows what they wrote; Not finished, not on the list', async ({ page, context }) => {
  const docs = [
    res(1, '10001', 'Alice Test', 120, 9 * 60, { sentences: { 1: { first: 'My name is Danil.', tries: 2, ok: false }, 4: { first: 'I have one', tries: 3, skipped: true, ok: false } } }),
    res(2, '10001', 'Alice Test', 30, 4 * 60),                      // a later run — never counted
    res(1, '10003', 'Dilnoza Test', 90, 6 * 60),                    // all right → above Alice
    res(1, '99999', 'Stranger Kid', 60, 300)                        // not on the Students list
  ];
  const errors = await openCourse(page, context, { docs, links: LINKS });
  await openLevel(page);
  await expect(page.locator('.dct-item[data-item="d1"]')).toContainText('3 done');
  await page.locator('.dct-item[data-item="d1"] .gr-lesson-open').click();
  await expect(page.locator('.dct-page h3').first()).toHaveText('Dictation 1 · My Name');
  const rows = page.locator('.dct-table .gr-trow');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText('Dilnoza Test');
  await expect(rows.nth(0)).toContainText('Target');
  await expect(rows.nth(0)).toContainText('7/7');
  await expect(rows.nth(1)).toContainText('Alice Test');
  await expect(rows.nth(1)).toContainText('5/7');
  await expect(rows.nth(1).locator('.dct-skips')).toHaveText('1');
  await expect(rows.nth(1)).toContainText('9 min');
  const data = await page.evaluate(() => window.dcTableRows('d1', 'all').map(r => [r.place, r.name, r.group, r.correct, r.total, r.skips]));
  expect(data).toEqual([[1, 'Dilnoza Test', 'Target', 7, 7, 0], [2, 'Alice Test', 'Apex', 5, 7, 1]]);
  // a row opens what the student wrote, sentence by sentence, next to the right sentence
  await rows.nth(1).getByRole('button', { name: 'Alice Test' }).click();
  const modal = page.locator('.ta-modal');
  await expect(modal.locator('.points-modal-title')).toHaveText('Alice Test — Dictation 1 · My Name');
  await expect(modal.locator('.dct-sent')).toHaveCount(7);
  const s2 = modal.locator('.dct-sent').nth(1);
  await expect(s2).toHaveClass(/wrong/);
  await expect(s2.locator('.dct-mark.wrong')).toHaveText('Danil');
  await expect(s2.locator('.dct-want')).toHaveText('Daniel');
  await expect(s2.locator('.dct-right')).toContainText('My name is Daniel.');
  await expect(s2).toContainText('2 tries');
  const s5 = modal.locator('.dct-sent').nth(4);
  await expect(s5).toHaveClass(/skipped/);
  await expect(s5).toContainText('Skipped');
  await expect(s5.locator('.dct-mark.missing')).toHaveText(['one', 'brother', 'and', 'sister']);
  await expect(modal.locator('.dct-sent').nth(0)).toHaveClass(/ok/);
  await page.keyboard.press('Escape');
  // Not finished: one list per group under All
  await expect(page.locator('.gr-missing')).toHaveCount(2);
  await expect(page.locator('.gr-missing').filter({ hasText: 'Apex' }).locator('h3')).toHaveText('🚫 Not finished — Apex (1)');
  await expect(page.locator('.gr-missing').filter({ hasText: 'Target' })).toContainText('Everyone has finished');
  await expect(page.locator('.gr-unlisted h3')).toContainText('Not on your Students list (1)');
  await expect(page.locator('.gr-unlisted')).toContainText('Stranger Kid');
  await expect(page.locator('.gr-unlisted')).toContainText('ID 99999');
  // filter Apex
  await page.locator('.gr-filter').getByRole('button', { name: 'Apex' }).click();
  await expect(rows).toHaveCount(1);
  await expect(rows.nth(0)).toContainText('Alice Test');
  await expect(page.locator('.gr-missing')).toHaveCount(1);
  await expect(page.locator('.gr-missing li')).toHaveText(['Bobur Test']);
  await page.locator('.gr-missing').getByRole('button', { name: '📋 Copy list' }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('Dictation 1 · My Name — Apex\nNot finished yet:\n1. Bobur Test');
  await page.getByRole('button', { name: '← Beginner' }).click();
  await expect(page.locator('.dct-item')).toHaveCount(20);
  expect(errors).toEqual([]);
});

test('a result\'s group is the student\'s group now', async ({ page, context }) => {
  const moved = ROSTER.map(s => s.id === '10001' ? Object.assign({}, s, { group: 'gt' }) : s);
  const errors = await openCourse(page, context, { docs: [res(1, '10001', 'Alice Test', 60, 600)], links: LINKS, roster: moved });
  await openD1(page);
  await expect(page.locator('.dct-table .gr-trow')).toHaveCount(1);
  await expect(page.locator('.dct-table .gr-trow')).toContainText('Target');
  await page.locator('.gr-filter').getByRole('button', { name: 'Apex' }).click();
  await expect(page.locator('.dct-table .gr-trow')).toHaveCount(0);
  await expect(page.locator('.dct-page')).toContainText('No results yet');
  expect(errors).toEqual([]);
});

test('the class list follows the Students list by itself, only once sync is ready, and never empties a full one', async ({ page, context }) => {
  await openCourse(page, context, { links: LINKS });
  await expect.poll(() => page.evaluate(classSize, 'DCT111')).toBe(3);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_dictation_links')).d1.rosterSig)).toContain('10003|Dilnoza Test|Target');
  // sync not ready yet: nothing goes online
  await page.evaluate(() => {
    window.__dcRefreshMs = 0; window.__grRefreshMs = 0; window.__taStoreRefreshMs = 0;
    window.__taSyncReadySaved = window.taSync.ready; window.taSync.ready = () => false;
    savePointsRoster(getPointsRoster().concat([{ name: 'Eshmat Test', id: '10004', group: 'gt' }]));
  });
  await page.waitForTimeout(600);
  expect(await page.evaluate(classSize, 'DCT111')).toBe(3);
  // sync is ready: it goes online
  await page.evaluate(() => { window.taSync.ready = window.__taSyncReadySaved; window.dcRefreshLists(); });
  await expect.poll(() => page.evaluate(classSize, 'DCT111')).toBe(4);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ta_dictation_links')).d1.rosterSig)).toContain('10004|Eshmat Test|Target');
  // a change from sync (taStoreChanged) too
  await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('ta_points_roster')); r.push({ name: 'Farhod Test', id: '10005', group: 'ga' });
    localStorage.setItem('ta_points_roster', JSON.stringify(r));
    window.taStoreChanged('ta_points_roster');
  });
  await expect.poll(() => page.evaluate(classSize, 'DCT111')).toBe(5);
  // an empty Students list never wipes it
  const writes = await page.evaluate(() => window.__writes.filter(w => w.id === 'class-DCT111').length);
  await page.evaluate(() => { localStorage.setItem('ta_points_roster', '[]'); window.dcRefreshLists(); });
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.__writes.filter(w => w.id === 'class-DCT111').length)).toBe(writes);
  expect(await page.evaluate(classSize, 'DCT111')).toBe(5);
});

test('ta_dictation_links is synced and in the backup', async ({ page, context }) => {
  await openCourse(page, context, { links: LINKS });
  const keys = await page.evaluate(() => (typeof TA_BACKUP_KEYS !== 'undefined' ? TA_BACKUP_KEYS : null));
  if (keys) expect(keys).toContain('ta_dictation_links');
  const src = await page.evaluate(async () => [await (await fetch('js/sync.js')).text(), await (await fetch('js/pages/settings.js')).text()]);
  expect(src[0]).toMatch(/'ta_dictation_links'/);
  expect(src[1]).toMatch(/TA_BACKUP_KEYS[^;]*'ta_dictation_links'/);
});

test('a sentence with no record shows "— no answer", not "Right after 2 tries"', async ({ page, context }) => {
  const r = res(1, '10001', 'Alice Test', 60, 300);
  r.sentences = r.sentences.slice(0, 5); r.total = 7;
  const errors = await openCourse(page, context, { docs: [r], links: LINKS });
  await openLevel(page);
  await page.locator('.dct-item[data-item="d1"] .gr-lesson-open').click();
  await page.locator('.dct-open').first().click();
  const last = page.locator('.ta-modal .dct-sent').nth(6);
  await expect(last).toContainText('no answer');
  await expect(last).not.toContainText('Right after');
  expect(errors).toEqual([]);
});

test('Copy link with an empty Students list does not publish over a list that is already online', async ({ page, context }) => {
  const links = { d1: { code: 'DCT111', sentAt: iso(60), rosterSig: 'x|y|z' } };
  const errors = await openCourse(page, context, { links, roster: [] });
  await openLevel(page);
  await page.evaluate(() => { window.__writes.length = 0; window.__deletes.length = 0; });
  await page.locator('.dct-item[data-item="d1"]').getByRole('button', { name: '🔗 Copy link' }).click();
  await expect(page.getByText('Your Students list hasn\'t loaded yet').first()).toBeVisible();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.__writes.filter(w => /^class-/.test(w.id)).length)).toBe(0);
  expect(await page.evaluate(() => window.__deletes.filter(i => /^class-/.test(i)).length)).toBe(0);
  expect(errors).toEqual([]);
});

test('the teacher\'s audio carries the page\'s ?v= stamp and stops when the teacher leaves the page', async ({ page, context }) => {
  const errors = await openCourse(page, context);
  await openLevel(page);
  await page.evaluate(() => { window.__srcs = []; const P = HTMLMediaElement.prototype; P.play = function () { window.__srcs.push(this.src); return Promise.resolve(); }; });
  await page.locator('.dct-item[data-item="d1"]').getByRole('button', { name: '▶ Play' }).click();
  await expect.poll(() => page.evaluate(() => window.__srcs.length)).toBe(1);
  expect(await page.evaluate(() => window.__srcs[0])).toMatch(/audio\/dictation\/d1\.mp3\?v=\w+$/);
  await expect(page.locator('.dct-item[data-item="d1"]').getByRole('button', { name: '⏸ Stop' })).toBeVisible();
  await page.evaluate(() => { window.taNavigate('index.html'); });
  await expect(page.locator('[data-dc-play]').first()).toHaveText('▶ Play');
  expect(errors).toEqual([]);
});

test('an unrecorded dictation shows "Recording…" instead of Play / Try / Copy link', async ({ page, context }) => {
  const errors = await openCourse(page, context, { unrecorded: ['d17', 'd18'] });
  await openLevel(page);
  const d2 = page.locator('.dct-item[data-item="d17"]');
  await expect(d2).toContainText('🎙 Recording…');
  for (const name of ['▶ Play', '🔗 Copy link', '▶️ Try']) await expect(d2.getByRole('button', { name, exact: true })).toHaveCount(0);
  await expect(page.locator('.dct-item[data-item="d19"]').getByRole('button', { name: '🔗 Copy link' })).toBeVisible();
  await expect(page.locator('.dct-item[data-item="d19"]')).not.toContainText('Recording');
  expect(errors).toEqual([]);
});
