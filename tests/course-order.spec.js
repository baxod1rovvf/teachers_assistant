// The teacher's notes of 2026-11-12: the "students finished exercises" note shouldn't list course exercises, and the writing check
// let "I playing volleybal" through. The "finish the part before first" rule from that day was removed on 2026-11-23 (any step, any order).
const { test, expect } = require('@playwright/test');
const crypto = require('crypto');
const { passIdCheck, prepare, watchErrors, hideNotices } = require('./support/app');

const hashFor = (code, id) => crypto.createHash('sha256').update(code + '|' + id).digest('hex').slice(0, 24);
const classDoc = (code, prev) => Object.assign({ __id: 'class-' + code, v: 1, code: 'TAUSER', type: 'TA_SYNC:CLASS', title: code, name: '',
  data: JSON.stringify([{ h: hashFor(code, '10001'), n: 'Alice Test' }]), date: new Date().toISOString() }, prev ? { prev: JSON.stringify(prev) } : {});

test('any step in any order (2026-11-23): Step 6 opens without Step 5 done — even on a list put online with a "part before"', async ({ page, context }) => {
  // put online before 2026-11-23: Step 6 Reading "after" Step 5 Reading, which Alice hasn't done
  await prepare(context, { docs: [classDoc('RDG901', { skill: 'reading', stepNo: 5, codes: ['RDG800'] })] });
  const errors = watchErrors(page);
  await page.goto('/skill.html?s=reading&st=b6&c=RDG901');
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await passIdCheck(page);
  await expect(page.locator('#skSubmit')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Oldingi');
  expect(errors).toEqual([]);
});

test('teacher: Copy link puts the class list online with no "part before", even when the step before was sent', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const links = { 'g1|reading|b5': { code: 'RDG005', sentAt: new Date().toISOString() } };
  await prepare(context, { storage: { ta_skills_links: JSON.stringify(links), ta_course_group: 'g1' } });
  await page.goto('/course.html');
  await hideNotices(page);
  await page.locator('.sk-gcard[data-group="g1"] .sk-gcard-open').click();
  await page.locator('.sk-node[data-step="b6"]').click();
  await page.locator('.sk-part[data-skill="reading"]').getByRole('button', { name: /Copy link for/ }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/s=reading&st=b6&c=/);
  const code = (await page.evaluate(() => navigator.clipboard.readText())).split('&c=')[1];
  await expect.poll(() => page.evaluate(c => { const d = (window.__fakeDocs || []).find(x => x.__id === 'class-' + c); return d ? (d.prev || 'none') : null; }, code)).toBe('none');
});

test('the "students finished exercises" note leaves the course exercises out', async ({ page, context }) => {
  const now = Date.now(), iso = ms => new Date(now - ms).toISOString();
  const item = { uid: 'ex1', code: 'SPL111', typeLabel: 'Spelling', groupId: 'g1', title: 'Fruit words', date: iso(3600000) };
  await prepare(context, {
    docs: [
      { __id: 'c1', v: 1, code: 'LSN222', type: 'Listening course', skill: 'listening', name: 'Alice Test', studentId: '10001', correct: 5, total: 10, date: iso(60000), submittedAt: iso(60000) },
      { __id: 'c2', v: 1, code: 'SPL111', type: 'Spelling', name: 'Bob Test', studentId: '10002', score: 80, date: iso(60000), submittedAt: iso(60000) }
    ],
    storage: { ta_recent_exercises: JSON.stringify([item]), ta_skills_links: JSON.stringify({ 'g1|listening|b1': { code: 'LSN222' } }) }
  });
  await page.goto('/index.html');
  await page.waitForFunction(() => (window.__allResults || []).length >= 2, null, { timeout: 10000 });
  const groups = await page.evaluate(() => getUncheckedCompletions().map(g => [g.name, g.items.map(i => i.code)]));
  expect(groups).toEqual([['Bobur Test', ['SPL111']]]);
});

test('teacher: a missing space shows its word, and why it waits for the AI', async ({ page, context }) => {
  const now = Date.now();
  const text = 'Hello my name is Yusuf.I am a student. In my free time I playing volleybal with my friends.';
  const item = { uid: 'skwriting', code: 'WRT901', typeLabel: 'Writing course', groupId: 'g1', skill: 'writing', title: 'Step 5 — writing', date: new Date().toISOString() };
  await prepare(context, {
    docs: [{ __id: 'w901', v: 1, code: 'WRT901', type: 'Writing course', skill: 'writing', step: 'b5', title: 'Step 5 · Free Time — Writing', name: 'Alice Test', studentId: '10001',
      text, words: 18, minWords: 90, maxWords: 110, grammarChecked: true, aiChecked: false, aiError: 'the AI could not be reached', band: 4,
      mistakeList: [{ bad: 'I', fix: ' I', message: 'Add a space between sentences.', at: 23, rule: 'SENTENCE_WHITESPACE' },
        { bad: 'volleybal', fix: 'volleyball', message: 'Possible spelling mistake found.', at: text.indexOf('volleybal'), rule: 'MORFOLOGIK_RULE_EN_GB' }],
      mistakes: 2, timeSeconds: 600, timeDisplay: '10:00', date: new Date(now - 60000).toISOString(), submittedAt: new Date(now - 60000).toISOString() }],
    storage: { ta_recent_exercises: JSON.stringify([item]), ta_skills_links: JSON.stringify({ 'g1|writing|b5': { code: 'WRT901' } }) }
  });
  await page.goto('/results.html');
  await page.waitForFunction(() => (window.__allResults || []).length >= 1, null, { timeout: 10000 });
  await hideNotices(page);
  await page.evaluate(() => showExerciseResults('skwriting'));
  await page.locator('.results-table tbody tr', { hasText: 'Alice Test' }).getByRole('button', { name: '👁 View' }).click();
  const modal = page.locator('.sk-wv');
  await expect(modal.locator('.sk-wv-wait')).toContainText('Waiting for the AI check');   // since 2026-11-12 every unchecked writing waits for the helper
  const items = modal.locator('.sk-wv-mistakes li');
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText('Yusuf.I → Yusuf. I');
  await expect(items.nth(1)).toContainText('volleybal → volleyball');
  await expect(modal.locator('.sk-wv-text mark')).toHaveCount(2);
});
