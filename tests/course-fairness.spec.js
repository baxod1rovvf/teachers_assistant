// The teacher's notes of 2026-11-09: the writing check marked the "i" inside "pencils", counted extra spaces, names and
// American spelling as mistakes, and gave 7.5 to 52 words when 25–35 were asked; students could do a course exercise
// again; a student who typed his ID was listed under "name only".
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const WTEXT = 'Well! My bag colour is black and there are 3 books  and also there are many pencils in it. ' +
  'Mainly one thing which i love a book in there it is called ,,deep working ". Hello my name is Mohlaroy. My favorite thing is my tablet.';
// an old result: its mistakes have no positions (sent before 2026-11-09)
const OLD_LIST = [
  { bad: '  ', fix: ' ', message: 'It seems like there are too many consecutive spaces here.' },
  { bad: 'i', fix: 'I', message: 'The personal pronoun “I” should be uppercase.' },
  { bad: ',,', fix: ',', message: 'Two consecutive commas' },
  { bad: 'Mohlaroy', fix: 'Molar', message: 'Possible spelling mistake found.' },
  { bad: 'favorite', fix: 'favourite', message: 'Possible spelling mistake. ‘favorite’ is American English.' }
];

test('writing rules: only real mistakes count; too few words lower the band, more than asked adds a little', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/skill.html?s=writing&st=b1&preview=1');
  const out = await page.evaluate(list => ({
    counted: list.filter(skCountsAsMistake).map(m => m.bad),
    inRange: skWritingBand(60, 50, 0, true, 70),
    over: skWritingBand(105, 50, 0, true, 70),
    noMaxGiven: skWritingBand(105, 50, 6, true),
    overWithMistakes: skWritingBand(105, 50, 6, true, 70),
    under: skWritingBand(25, 50, 0, true, 70),
    oldCall: skWritingBand(45, 40, 1, true)   // no maximum given: as before
  }), OLD_LIST);
  expect(out.counted).toEqual(['i', ',,']);
  expect(out.inRange).toBe(9);
  expect(out.over).toBe(9);   // more than asked never lowers the band (2026-11-09) — 9 is the most anyway
  expect(out.overWithMistakes).toBe(out.noMaxGiven + 0.5);   // the same writing, half a band more for going past the maximum
  expect(out.under).toBe(7.5);  // 25 for 50–70: half the least
  expect(out.oldCall).toBe(8.5);
});

test('Loom underlines each mistake in its real place (the lone "i", not the one inside "pencils") and lists only real mistakes', async ({ page, context }) => {
  const item = { uid: 'skwriting', code: 'WRT001', typeLabel: 'Writing course', groupId: 'g1', skill: 'writing', title: 'Step 4 — writing', date: new Date().toISOString() };
  const now = Date.now();
  await prepare(context, {
    docs: [{ __id: 'w1', v: 1, code: 'WRT001', type: 'Writing course', skill: 'writing', step: 'b4', title: 'Step 4 · Colours & things — Writing',
      name: 'Alice Test', studentId: '10001', text: WTEXT, words: 40, minWords: 25, maxWords: 35, mistakes: 5, mistakeList: OLD_LIST,
      grammarChecked: true, band: 7.5, timeSeconds: 443, timeDisplay: '07:23', date: new Date(now - 60000).toISOString(), submittedAt: new Date(now - 60000).toISOString() }],
    storage: { ta_recent_exercises: JSON.stringify([item]), ta_skills_links: JSON.stringify({ 'g1|writing|b4': { code: 'WRT001' } }) }
  });
  const errors = watchErrors(page);
  await page.goto('/results.html');
  await page.waitForFunction(() => (window.__allResults || []).length >= 1, null, { timeout: 10000 });
  await hideNotices(page);
  await page.evaluate(() => showExerciseResults('skwriting'));
  await page.locator('.results-table tbody tr', { hasText: 'Alice Test' }).getByRole('button', { name: '👁 View' }).click();
  const modal = page.locator('.sk-wv');
  await expect(modal.locator('.sk-wv-text mark')).toHaveText(['i', ',,']);
  // the marked "i" stands alone, right after "which "
  expect(await modal.locator('.sk-wv-text mark').first().evaluate(m => m.previousSibling.textContent.endsWith('which '))).toBe(true);
  await expect(modal.locator('.sk-wv-mistakes li')).toHaveCount(2);
  await expect(modal).toContainText('2 mistakes');
  await expect(modal).not.toContainText('consecutive spaces');
  await expect(modal).not.toContainText('Molar');
  await expect(modal.locator('#skWvBand')).toHaveValue('7.5');   // an older writing keeps the band it was sent with
  expect(errors).toEqual([]);
});

test('one try per course exercise: a student who already has a result sees it instead of the exercise', async ({ page, context }) => {
  const now = Date.now();
  await prepare(context, {
    docs: [{ __id: 'r1', v: 1, code: 'RDG123', type: 'Reading course', skill: 'reading', step: 'b1', name: 'Alice Test', studentId: '10001',
      correct: 7, total: 10, score: 70, answers: [], date: new Date(now - 3600000).toISOString(), submittedAt: new Date(now - 3600000).toISOString() }]
  });
  page.on('dialog', d => d.accept());
  const begin = async (name, id) => {
    await page.goto('/skill.html?s=reading&st=b1&c=RDG123');
    await page.locator('#studentNameInput').fill(name);
    await page.locator('#skIdInput').fill(id);
    await page.getByRole('button', { name: /Start/ }).click();
  };
  // in the database (another phone) by ID …
  await begin('Somebody Else', '10001');
  await expect(page.locator('.sk-done-card')).toContainText('You have already done this reading');
  await expect(page.locator('.sk-done-card')).toContainText('7 / 10');
  await expect(page.locator('#skSubmit')).toHaveCount(0);
  // … and by name
  await begin('alice test', '99999');
  await expect(page.locator('.sk-done-card')).toBeVisible();
  // somebody new can do it — once: after Submit, this device won't open it again
  await begin('Bobur Test', '10002');
  await expect(page.locator('#skSubmit')).toBeVisible();
  await page.locator('#skSubmit').click();
  await expect(page.locator('.sk-send')).toContainText('Saved ✅');
  await begin('Bobur Test', '10002');
  await expect(page.locator('.sk-done-card')).toContainText('You have already done this reading');
  // the teacher's Try (preview) is never blocked
  await page.goto('/skill.html?s=reading&st=b1&preview=1');
  await expect(page.locator('#skSubmit')).toBeVisible();
});

test('a student who typed the ID a little differently ("ID 10 001", "010001", Cyrillic look-alikes) still counts as that student', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/results.html');
  await page.waitForTimeout(800);
  const out = await page.evaluate(() => {
    const idx = taRosterIndex();
    const who = r => { const s = rosterStudentForResult(r, idx); return s ? s.name : null; };
    return {
      spaced: who({ studentId: 'ID 10 001', name: 'Typed name', isRosterMatch: false }),
      zeros: who({ studentId: '010001', name: 'x' }),
      wide: who({ studentId: '１０００１', name: 'x' }),
      swapped: who({ studentId: 'Alice', name: '10001' }),
      wrong: who({ studentId: '55555', name: 'Nobody Here', isRosterMatch: false }),
      cyr: taIdKey('А12') === taIdKey('a12'),
      keepsWords: taIdKey('idris')
    };
  });
  expect(out).toEqual({ spaced: 'Alice Test', zeros: 'Alice Test', wide: 'Alice Test', swapped: 'Alice Test', wrong: null, cyr: true, keepsWords: 'idris' });
});

test('only the group\'s students can start a course exercise: the ID must be on the list and the name must fit it', async ({ page, context }) => {
  const crypto = require('crypto');
  const code = 'RDG777', hash = id => crypto.createHash('sha256').update(code + '|' + id).digest('hex').slice(0, 24);
  const list = [{ h: hash('10001'), n: 'Alice Test' }, { h: hash('10002'), n: 'Yuldasheva Mohlaroy' }];
  await prepare(context, { docs: [{ __id: 'class-' + code, v: 1, code: 'TAUSER', type: 'TA_SYNC:CLASS', title: code, name: '', data: JSON.stringify(list), date: new Date().toISOString() }] });
  const errors = watchErrors(page);
  const begin = async (name, id) => {
    await page.goto('/skill.html?s=reading&st=b1&c=' + code);
    await page.locator('#studentNameInput').fill(name);
    await page.locator('#skIdInput').fill(id);
    await page.getByRole('button', { name: /Start/ }).click();
  };
  await begin('Alice Test', '99999');
  await expect(page.locator('#skStartErr')).toHaveText("This ID is not on your teacher's list. Check your ID and try again.");
  await expect(page.locator('#skSubmit')).toHaveCount(0);
  await begin('Bobur', '10001');
  await expect(page.locator('#skStartErr')).toHaveText('This ID belongs to another student. Write your own name and ID.');
  // the ID typed a little differently and only the first name: let in, and the result carries the name from the list
  await begin('mohlaroy', ' 10 002 ');
  await expect(page.locator('#skSubmit')).toBeVisible();
  await page.locator('#skSubmit').click();
  await expect(page.locator('.sk-send')).toContainText('Saved ✅');
  const rec = await page.evaluate(() => window.__writes.map(w => window.__fakeDocs.find(d => d.__id === w.id)).find(d => d && d.type === 'Reading course'));
  expect(rec).toMatchObject({ code, name: 'Yuldasheva Mohlaroy', studentId: '10 002' });
  expect(errors).toEqual([]);
});

test('Speaking Journey: each of the 20 steps has its topic and 10 words with their Uzbek meaning, shown under the word', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/skill.html?s=speaking&st=b1');
  await expect(page.locator('.sk-card h2').first()).toContainText('Daily Routine');
  await expect(page.locator('.sk-word')).toHaveCount(10);
  await expect(page.locator('.sk-word').first().locator('b')).toHaveText('Wake up');
  await expect(page.locator('.sk-word').first().locator('.sk-uz')).toHaveText("Uyg'onmoq");
  const topics = await page.evaluate(() => TA_SKILLS.steps.map(s => [s.speaking.topic, s.speaking.words.length, s.speaking.words.every(w => w.uz && w.ex && w.emoji)]));
  expect(topics.map(t => t[0])).toEqual(['Daily Routine', 'Family', 'Home & Living', 'Food & Meals', 'Free Time', 'Friends', 'School & Education', 'Hobbies & Sports', 'Shopping', 'Your City',
    'Holidays', 'Future Plans', 'Jobs & Careers', 'Clothes & Fashion', 'Transport', 'Animals & Pets', 'Health & Lifestyle', 'Technology', 'Movies & Music', 'Weather & Seasons']);
  topics.forEach(t => { expect(t[1]).toBe(10); expect(t[2]).toBe(true); });
  // Step 20 (the last, added 2026-11-09): its words with Uzbek, 5 questions and a Part 2 card
  await page.goto('/skill.html?s=speaking&st=e10');
  await expect(page.locator('.sk-card h2').first()).toContainText('Weather & Seasons');
  await expect(page.locator('.sk-word').first().locator('b')).toHaveText('Sunny');
  await expect(page.locator('.sk-word').first().locator('.sk-uz')).toHaveText('Quyoshli');
});
