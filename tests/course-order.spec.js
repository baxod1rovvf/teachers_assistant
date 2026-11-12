// The teacher's notes of 2026-11-12: the "students finished exercises" note shouldn't list course exercises; a student who
// opens a course exercise before finishing the one before it is stopped ("Oldingi Listening mashq tugatilmagan"); and the
// writing check let "I playing volleybal" through.
const { test, expect } = require('@playwright/test');
const crypto = require('crypto');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const hashFor = (code, id) => crypto.createHash('sha256').update(code + '|' + id).digest('hex').slice(0, 24);
const classDoc = (code, prev) => Object.assign({ __id: 'class-' + code, v: 1, code: 'TAUSER', type: 'TA_SYNC:CLASS', title: code, name: '',
  data: JSON.stringify([{ h: hashFor(code, '10001'), n: 'Alice Test' }]), date: new Date().toISOString() }, prev ? { prev: JSON.stringify(prev) } : {});

test('a course exercise opens only after the part before it is done — else the Uzbek warning', async ({ page, context }) => {
  await prepare(context, { docs: [classDoc('RDG901', { skill: 'listening', stepNo: 5, codes: ['LSN901'] })] });
  const errors = watchErrors(page);
  const kept = [];   // results put into the stand-in database (it starts empty on every page load)
  const begin = async () => {
    await page.goto('/skill.html?s=reading&st=b5&c=RDG901');
    await page.evaluate(async docs => { await window.skPrevDone({ codes: ['XXXXXX'] }, 'x', 'x'); docs.forEach(d => window.__fakeDocs.push(d)); }, kept);
    await page.locator('#studentNameInput').fill('Alice');
    await page.locator('#skIdInput').fill('10001');
    await page.getByRole('button', { name: /Start/ }).click();
  };
  await begin();
  await expect(page.locator('#skStartErr')).toHaveText('⚠️ Oldingi Listening mashq tugatilmagan. Avval Step 5 · Listening mashqini tugating.');
  await expect(page.locator('#skSubmit')).toHaveCount(0);
  // another student's Listening doesn't count; hers (the ID typed a little differently) does
  const base = { v: 1, code: 'LSN901', type: 'Listening course', skill: 'listening', step: 'b5', correct: 8, total: 12, date: new Date().toISOString() };
  kept.push(Object.assign({ __id: 'sk_other', name: 'Bobur Test', studentId: '10002' }, base));
  await begin();
  await expect(page.locator('#skStartErr')).toContainText('Oldingi Listening mashq tugatilmagan');
  kept.push(Object.assign({ __id: 'sk_alice', name: 'Alice Test', studentId: '010001' }, base));
  await begin();
  await expect(page.locator('#skSubmit')).toBeVisible();
  expect(errors).toEqual([]);
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

test('teacher: a missing space shows its word, and why the AI didn\'t run', async ({ page, context }) => {
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
  await expect(modal.locator('.sk-wv-noai')).toContainText("The AI check didn't run when this was sent (the AI could not be reached)");
  const items = modal.locator('.sk-wv-mistakes li');
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText('Yusuf.I → Yusuf. I');
  await expect(items.nth(1)).toContainText('volleybal → volleyball');
  await expect(modal.locator('.sk-wv-text mark')).toHaveCount(2);
});
