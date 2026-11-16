// The teacher's notes of 2026-11-12: the "students finished exercises" note shouldn't list course exercises; a student who
// opens a course exercise before finishing the same skill in the step before is stopped ("Oldingi Reading mashq tugatilmagan");
// inside a step the parts can be done in any order (teacher, 2026-11-16); and the
// writing check let "I playing volleybal" through.
const { test, expect } = require('@playwright/test');
const crypto = require('crypto');
const { passIdCheck, prepare, watchErrors, hideNotices } = require('./support/app');

const hashFor = (code, id) => crypto.createHash('sha256').update(code + '|' + id).digest('hex').slice(0, 24);
const classDoc = (code, prev) => Object.assign({ __id: 'class-' + code, v: 1, code: 'TAUSER', type: 'TA_SYNC:CLASS', title: code, name: '',
  data: JSON.stringify([{ h: hashFor(code, '10001'), n: 'Alice Test' }]), date: new Date().toISOString() }, prev ? { prev: JSON.stringify(prev) } : {});

test('a course exercise opens only after the same skill in the step before is done — else the Uzbek warning', async ({ page, context }) => {
  await prepare(context, { docs: [classDoc('RDG901', { skill: 'reading', stepNo: 5, codes: ['RDG800'] })] });
  const errors = watchErrors(page);
  const kept = [];   // results put into the stand-in database (it starts empty on every page load)
  const begin = async () => {
    await page.goto('/skill.html?s=reading&st=b6&c=RDG901');
    await page.evaluate(async docs => { await window.skPrevDone({ codes: ['XXXXXX'] }, 'x', 'x'); docs.forEach(d => window.__fakeDocs.push(d)); }, kept);
    await page.locator('#skIdInput').fill('10001');
    await page.getByRole('button', { name: /Start/ }).click();
    await passIdCheck(page);
  };
  await begin();
  await expect(page.locator('#skStartErr')).toHaveText('⚠️ Oldingi Reading mashq tugatilmagan. Avval Step 5 · Reading mashqini tugating.');
  await expect(page.locator('#skSubmit')).toHaveCount(0);
  // another student's Reading doesn't count; hers (the ID typed a little differently) does
  const base = { v: 1, code: 'RDG800', type: 'Reading course', skill: 'reading', step: 'b5', correct: 8, total: 10, date: new Date().toISOString() };
  kept.push(Object.assign({ __id: 'sk_other', name: 'Bobur Test', studentId: '10002' }, base));
  await begin();
  await expect(page.locator('#skStartErr')).toContainText('Oldingi Reading mashq tugatilmagan');
  kept.push(Object.assign({ __id: 'sk_alice', name: 'Alice Test', studentId: '010001' }, base));
  await begin();
  await expect(page.locator('#skSubmit')).toBeVisible();
  expect(errors).toEqual([]);
});

test('inside a step the parts can be done in any order: a list from before 2026-11-16 that names another skill doesn\'t stop Writing', async ({ page, context }) => {
  // put online before the change: Step 5 Writing "after" Step 5 Reading, which Alice hasn't done
  await prepare(context, { docs: [classDoc('WRT902', { skill: 'reading', stepNo: 5, codes: ['RDG902'] })] });
  const errors = watchErrors(page);
  await page.goto('/skill.html?s=writing&st=b5&c=WRT902');
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await passIdCheck(page);
  await expect(page.locator('#skWriting, .sk-write-card').first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Oldingi');
  expect(errors).toEqual([]);
});

test('teacher: the part before is the same skill in the nearest earlier step whose link was sent', async ({ page, context }) => {
  const links = { 'g1|reading|b6': { code: 'RDG006' }, 'g1|writing|b5': { code: 'WRT005' }, 'g1|writing|b6': { code: 'WRT006' }, 'g1|listening|b4': { code: 'LSN004' } };
  await prepare(context, { storage: { ta_skills_links: JSON.stringify(links), ta_course_group: 'g1' } });
  await page.goto('/course.html');
  await page.waitForFunction(() => typeof skPrevPart === 'function');
  const r = await page.evaluate(() => {
    const g = getStudentGroups().find(x => x.id === 'g1'), l = taSkillsLinks();
    const p = (skill, st) => { const x = skPrevPart(skill, st, g, l); return x && [x.skill, x.stepNo, x.codes]; };
    return { w6: p('writing', 'b6'), r6: p('reading', 'b6'), l6: p('listening', 'b6'), w5: p('writing', 'b5'),
      next: skNextPart('writing', 'b5', g, l) };
  });
  expect(r.w6).toEqual(['writing', 5, ['WRT005']]);   // not Step 6 Reading
  expect(r.r6).toBeNull();                            // no Reading was sent before Step 6
  expect(r.l6).toEqual(['listening', 4, ['LSN004']]); // a step without a sent link is skipped
  expect(r.w5).toBeNull();
  expect(r.next).toEqual({ skill: 'writing', step: 'b6', code: 'WRT006' });
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
