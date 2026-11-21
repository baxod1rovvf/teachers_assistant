// Dictation Journey — the student's dictation (2026-11-19): one sentence plays, the student writes it and presses Check; wrong
// words are marked and the student fixes them (or presses Skip); only the first full run is sent; a reload continues; only active
// time counts; on a phone the box, buttons and marks stay above the keyboard.
// Spec: docs/superpowers/specs/2026-11-19-dictation-journey-design.md ("Student screen", "Result").
const { test, expect } = require('@playwright/test');
const crypto = require('crypto');
const { passIdCheck, prepare, watchErrors } = require('./support/app');

const CODE = 'DCT111';
const URL_D = '/skill.html?s=dictation&dl=d1&c=' + CODE;
const D1 = ['Hello!', 'My name is Daniel.', 'I am thirteen years old.', 'I live in a small house with my family.',
  'I have one brother and one sister.', 'We are students.', 'My favourite colour is blue.'];
const hashFor = (code, id) => crypto.createHash('sha256').update(code + '|' + id).digest('hex').slice(0, 24);
const classDoc = code => ({ __id: 'class-' + code, v: 1, code: 'TAUSER', type: 'TA_SYNC:CLASS', title: code, name: '',
  data: JSON.stringify([{ h: hashFor(code, '10001'), n: 'Alice Test', g: 'Apex' }, { h: hashFor(code, '10002'), n: 'Bobur Test', g: 'Target' }]),
  date: new Date().toISOString() });
const dictDocs = page => page.evaluate(code => window.__fakeDocs.filter(d => d.code === code && d.type === 'Dictation course'), CODE);
const played = page => page.evaluate(() => (window.__dcPlayed || []).map(p => p.sentence));

async function setup(context, extra) {
  // the real data says which dictations are recorded so far; these tests treat every one as recorded
  await context.route('**/js/dictation-data.js*', r => r.fulfill({ contentType: 'application/javascript',
    body: require('fs').readFileSync(require('path').join(__dirname, '..', 'js', 'dictation-data.js'), 'utf8') +
      '\nwindow.TA_DICTATION.levels.forEach(l => l.items.forEach(i => { i.recorded = true; }));' }));
  await prepare(context, Object.assign({ docs: [classDoc(CODE)] }, extra || {}));
  await context.addInitScript(() => { window.__dcFast = true; window.__dcNoAudio = true; window.__skSendTimeoutMs = 2000; });
}
async function start(page, url) {
  await page.goto(url || URL_D);
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await passIdCheck(page);
  await expect(page.locator('#dcBox, .dc-done')).toBeVisible();
}
const count = page => page.locator('#dcCount');
async function write(page, text) {
  await page.locator('#dcBox').fill(text);
  await page.locator('#dcCheck').click();
}
// writes sentence n (1-based) right and waits for the next one (or the end)
async function writeRight(page, n) {
  await expect(count(page)).toContainText(`Sentence ${n} of 7`);
  await write(page, D1[n - 1]);
  if (n < 7) await expect(count(page)).toContainText(`Sentence ${n + 1} of 7`);
  else await expect(page.locator('.dc-end')).toBeVisible();
}

test('Bu sizmi → Ha → "Sentence 1 of 7": the sentence plays by itself; ▶ and Play slower play it again', async ({ page, context }) => {
  await setup(context);
  const errors = watchErrors(page);
  await page.goto(URL_D);
  await expect(page.locator('.sk-start-card')).toContainText('My Name');
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await expect(page.locator('.sk-confirm')).toContainText('Alice Test — 10001');
  await page.locator('#skYes').click();
  await expect(count(page)).toContainText('Sentence 1 of 7');
  await expect(page.locator('.sk-head')).toContainText('Dictation 1');
  await expect.poll(() => played(page)).toEqual([1]);
  await page.locator('#dcPlay').click();
  await expect.poll(() => played(page)).toEqual([1, 1]);
  await page.locator('#dcSlow').click();
  expect(await page.evaluate(() => window.__dcPlayed.map(p => p.rate))).toEqual([1, 1, 0.75]);
  expect(await page.evaluate(() => window.__dcPlayed[0].src)).toMatch(/^audio\/dictation\/d1-s1\.mp3\?v=\d+[a-z]?$/);
  const box = page.locator('#dcBox');
  for (const [a, v] of [['autocapitalize', 'off'], ['autocorrect', 'off'], ['autocomplete', 'off'], ['spellcheck', 'false']]) await expect(box).toHaveAttribute(a, v);
  expect(errors).toEqual([]);
});

test('wrong words are marked and the box keeps the text; fixed → ✅ and the next sentence plays', async ({ page, context }) => {
  await setup(context);
  await start(page);
  await write(page, 'Helo');
  await expect(page.locator('.dc-word.wrong')).toHaveCount(1);
  await expect(page.locator('.dc-word.wrong')).toContainText('Hello');
  await expect(page.locator('#dcBox')).toHaveValue('Helo');
  await expect(count(page)).toContainText('Sentence 1 of 7');
  await page.locator('#dcBox').fill('Hello');
  await page.locator('#dcCheck').click();
  await expect(page.locator('#dcFeedback')).toContainText('✅');
  await expect(count(page)).toContainText('Sentence 2 of 7');
  await expect.poll(() => played(page)).toEqual([1, 2]);
  await expect(page.locator('#dcBox')).toHaveValue('');
  // a missing word and an extra one
  await write(page, 'My name is is');
  await expect(page.locator('.dc-word.missing')).toContainText('Daniel');
  await expect(page.locator('.dc-word.extra')).toHaveCount(1);
});

test('Skip shows the right sentence, counts a skip and goes on', async ({ page, context }) => {
  await setup(context);
  await start(page);
  await page.locator('#dcSkip').click();
  await expect(page.locator('#dcFeedback')).toContainText('Hello!');
  await expect(count(page)).toContainText('Sentence 2 of 7');
  await expect(count(page)).toContainText('1 skipped');
  await expect.poll(() => played(page)).toEqual([1, 2]);
});

test('all 7 sentences → one result with each sentence\'s first try, tries and skips; active time only', async ({ page, context }) => {
  test.setTimeout(60000);
  await setup(context);
  await context.addInitScript(() => { window.__dcClock = 1e12; });
  const errors = watchErrors(page);
  await start(page);
  await write(page, 'Helo');
  await expect(page.locator('.dc-word.wrong')).toHaveCount(1);
  await page.evaluate(() => { window.__dcClock += 90000; document.body.dispatchEvent(new Event('pointerdown', { bubbles: true })); });
  await writeRight(page, 1);
  await writeRight(page, 2);
  await page.locator('#dcSkip').click();
  await expect(count(page)).toContainText('Sentence 4 of 7');
  for (let n = 4; n <= 7; n++) await writeRight(page, n);
  await expect(page.locator('.dc-score')).toContainText('5/7');
  await expect(page.locator('#dcSend')).toContainText('Saved ✅');
  const docs = await dictDocs(page);
  expect(docs).toHaveLength(1);
  expect(docs[0]).toMatchObject({ type: 'Dictation course', skill: 'dictation', dictation: 'd1', dictationNo: 1, level: 'beginner', total: 7,
    correctFirst: 5, score: 71, skips: 1, name: 'Alice Test', studentId: '10001', code: CODE, v: 1 });
  expect(docs[0].sentences).toHaveLength(7);
  expect(docs[0].sentences[0]).toEqual({ first: 'Helo', tries: 2, skipped: false, ok: false });
  expect(docs[0].sentences[1]).toEqual({ first: 'My name is Daniel.', tries: 1, skipped: false, ok: true });
  expect(docs[0].sentences[2]).toEqual({ first: '', tries: 0, skipped: true, ok: false });
  expect(docs[0].timeSeconds).toBeGreaterThanOrEqual(90);
  expect(docs[0].timeDisplay).toMatch(/min/);
  expect(docs[0].date).toBe(docs[0].builtAt);
  expect(await page.evaluate(c => localStorage.getItem('ta_dictation_draft|' + c), CODE)).toBeNull();
  expect(await page.evaluate(() => Object.values(JSON.parse(localStorage.getItem('ta_skill_unsent') || '{}')))).toEqual([]);
  expect(errors).toEqual([]);
});

test('a reload continues at the same sentence with the earlier answers; "Do it again" sends nothing', async ({ page, context }) => {
  test.setTimeout(90000);
  await setup(context);
  await start(page);
  await write(page, 'Helo');
  await expect(page.locator('.dc-word.wrong')).toHaveCount(1);
  await writeRight(page, 1);
  await writeRight(page, 2);
  await page.locator('#dcBox').fill('I am thir');
  await page.waitForTimeout(700);
  await start(page);
  await expect(count(page)).toContainText('Sentence 3 of 7');
  await expect(page.locator('#dcBox')).toHaveValue('I am thir');
  for (let n = 3; n <= 7; n++) await writeRight(page, n);
  await expect(page.locator('#dcSend')).toContainText('Saved ✅');
  let docs = await dictDocs(page);
  expect(docs).toHaveLength(1);
  expect(docs[0].sentences[0]).toEqual({ first: 'Helo', tries: 2, skipped: false, ok: false });
  expect(docs[0].correctFirst).toBe(6);
  // practice: the same sentences again, nothing sent
  await page.locator('#dcAgain').click();
  await expect(count(page)).toContainText('Sentence 1 of 7');
  for (let n = 1; n <= 7; n++) await writeRight(page, n);
  await expect(page.locator('.dc-end')).toContainText('not sent');
  await expect(page.locator('#dcSend')).toHaveCount(0);
  expect(await dictDocs(page)).toHaveLength(1);
});

test('opening the link again after the result is saved → "You\'ve done this dictation" with the summary; Do it again sends nothing', async ({ page, context }) => {
  const done = { __id: 'sk_DCT111_10001_1', v: 1, type: 'Dictation course', code: CODE, skill: 'dictation', dictation: 'd1', dictationNo: 1,
    level: 'beginner', name: 'Alice Test', studentId: '10001', total: 7, correctFirst: 6, score: 86, skips: 1, date: '2026-11-19T09:00:00.000Z' };
  await setup(context, { docs: [classDoc(CODE), done] });
  await start(page);
  await expect(page.locator('.dc-done')).toContainText('You\'ve done this dictation');
  await expect(page.locator('.dc-done')).toContainText('6 / 7');
  await expect(page.locator('.dc-done')).toContainText('1 skipped');
  await page.locator('#dcAgain').click();
  await expect(count(page)).toContainText('Sentence 1 of 7');
  await page.locator('#dcSkip').click();
  await expect(count(page)).toContainText('Sentence 2 of 7');
  expect(await page.evaluate(() => window.__writes.length)).toBe(0);
  expect(await page.evaluate(c => localStorage.getItem('ta_dictation_draft|' + c), CODE)).toBeNull();
});

test('a sentence that doesn\'t play shows the 📶 note, and Check still works', async ({ page, context }) => {
  await setup(context);
  await context.addInitScript(() => { window.__dcAudioFails = true; });
  await start(page);
  await expect(page.locator('#dcAudioNote')).toBeVisible();
  await expect(page.locator('#dcAudioNote')).toContainText('📶');
  await write(page, 'Hello!');
  await expect(count(page)).toContainText('Sentence 2 of 7');
});

test('preview: no ID card, nothing sent or kept', async ({ page, context }) => {
  test.setTimeout(60000);
  await setup(context);
  await page.goto('/skill.html?s=dictation&dl=d1&preview=1');
  await expect(page.locator('#skIdInput')).toHaveCount(0);
  for (let n = 1; n <= 7; n++) await writeRight(page, n);
  await expect(page.locator('#dcSend')).toContainText('Preview');
  expect(await page.evaluate(() => (window.__writes || []).length)).toBe(0);
  expect(await page.evaluate(() => Object.keys(localStorage).filter(k => /^ta_dictation_draft|^ta_skill_unsent/.test(k)))).toEqual([]);
});

test('a missing dictation → "This dictation doesn\'t exist"', async ({ page, context }) => {
  await setup(context);
  await page.goto('/skill.html?s=dictation&dl=d999&c=' + CODE);
  await expect(page.locator('body')).toContainText('This dictation doesn\'t exist');
});

// on a phone with the keyboard open (375×360): ▶, the box, Check, Skip and every marked word are inside the visible part
async function phoneMarksInView(page, url, skipsBefore, wrongText) {
  await page.setViewportSize({ width: 375, height: 667 });
  await start(page, url);
  for (let i = 0; i < skipsBefore; i++) {
    await page.locator('#dcSkip').click();
    await expect(count(page)).toContainText(`Sentence ${i + 2} of`);
  }
  await page.locator('#dcBox').focus();
  await page.setViewportSize({ width: 375, height: 360 });   // the keyboard takes the bottom of the screen
  await page.locator('#dcBox').fill(wrongText);
  await page.locator('#dcCheck').click();
  await expect(page.locator('.dc-marks')).toBeVisible();
  await page.waitForTimeout(300);
  const out = await page.evaluate(() => {
    const vv = window.visualViewport, top = vv.offsetTop, bottom = vv.offsetTop + vv.height;
    const els = ['#dcPlay', '#dcSlow', '#dcBox', '#dcCheck', '#dcSkip'].map(sel => [sel, document.querySelector(sel)])
      .concat([...document.querySelectorAll('.dc-marks .dc-word')].map((e, i) => ['word ' + i + ' ' + e.textContent, e]));
    return els.filter(([, e]) => [...e.getClientRects()].some(r => r.top < top - 1 || r.bottom > bottom + 1) || !e.getClientRects().length)
      .map(([n, e]) => n + ' @' + Math.round(e.getBoundingClientRect().top) + '-' + Math.round(e.getBoundingClientRect().bottom));
  });
  expect(out).toEqual([]);
  expect(await page.evaluate(() => document.activeElement && document.activeElement.id)).toBe('dcBox');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
}

test('a phone with the keyboard open: ▶, the box, Check, Skip and the marked words stay in view; nothing scrolls sideways', async ({ page, context }) => {
  await setup(context);
  await phoneMarksInView(page, URL_D, 1, 'My nme is');
  await expect(page.locator('.dc-word.wrong')).toHaveCount(1);
  await expect(page.locator('.dc-word.missing')).toHaveCount(1);
});

test('a phone with the keyboard open: a long sentence with 4 mistakes (Dictation 85, sentence 3) still fits', async ({ page, context }) => {
  await setup(context);
  await phoneMarksInView(page, '/skill.html?s=dictation&dl=d85&c=' + CODE, 2,
    'Although online acess makes the materal easier to explore, the archive team must also consider copyrite, privacy, and the long-term preservaton of digital files.');
  await expect(page.locator('.dc-word.wrong')).toHaveCount(4);
});

test('a phone with the keyboard open: the longest sentence (Dictation 87, sentence 2) with 4 mistakes still fits', async ({ page, context }) => {
  await setup(context);
  await phoneMarksInView(page, '/skill.html?s=dictation&dl=d87&c=' + CODE, 1,
    'Protectin a natural habitt may restrict activities that local comunities depend on for income, while allowing unrestricted development can cause lasting enviromental damage.');
  await expect(page.locator('.dc-word.wrong')).toHaveCount(4);
  // it really is the longest sentence in the data
  const max = await page.evaluate(() => Math.max(...window.TA_DICTATION.levels.flatMap(l => l.items.flatMap(i => i.sentences.map(s => s.length)))));
  expect(await page.evaluate(() => window.TA_DICTATION.levels.flatMap(l => l.items).find(i => i.id === 'd87').sentences[1].length)).toBe(max);
});

test('the first sentence is unlocked inside the tap: DC.prime runs in the Start and Ha taps, before any wait', async ({ page, context }) => {
  await setup(context);
  await page.goto(URL_D);
  await page.evaluate(() => {
    window.__primeEv = [];
    const o = window.DC.prime;
    window.DC.prime = function () { window.__primeEv.push(window.event ? window.event.type : null); return o.apply(this, arguments); };
  });
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await page.locator('#skYes').click();
  await expect(count(page)).toContainText('Sentence 1 of 7');
  expect(await page.evaluate(() => window.__primeEv)).toEqual(['submit', 'click']);
  expect(await page.evaluate(() => window.__dcPrimed)).toBe(2);
});

test('the keyboard stays open: the box keeps its focus through Check, Skip and ▶; a phone\'s Enter checks', async ({ page, context }) => {
  await setup(context);
  await start(page);
  const focused = () => page.evaluate(() => document.activeElement && document.activeElement.id);
  await page.locator('#dcBox').focus();
  await page.locator('#dcBox').fill('Helo');
  await page.locator('#dcCheck').click();
  await expect(page.locator('.dc-word.wrong')).toHaveCount(1);
  expect(await focused()).toBe('dcBox');
  await page.locator('#dcPlay').click();
  await page.locator('#dcSlow').click();
  expect(await focused()).toBe('dcBox');
  await page.locator('#dcSkip').click();
  expect(await page.evaluate(() => document.querySelector('#dcBox').readOnly)).toBe(false);
  expect(await focused()).toBe('dcBox');
  await expect(count(page)).toContainText('Sentence 2 of 7');
  // a phone's Enter: beforeinput insertLineBreak
  await page.locator('#dcBox').fill('My name is Daniel');
  await page.evaluate(() => document.querySelector('#dcBox').dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertLineBreak', bubbles: true, cancelable: true })));
  await expect(count(page)).toContainText('Sentence 3 of 7');
  // … or only an input with a line break in it
  await page.evaluate(() => { const b = document.querySelector('#dcBox'); b.value = 'I am thirteen years old\n'; b.dispatchEvent(new Event('input', { bubbles: true })); });
  await expect(count(page)).toContainText('Sentence 4 of 7');
  await expect(page.locator('#dcBox')).toHaveValue('');
});

test('Check on an empty box keeps the marks and says to write first; the next sentence\'s audio is fetched early', async ({ page, context }) => {
  await setup(context);
  await start(page);
  await expect.poll(() => page.evaluate(() => window.__dcPreloaded || [])).toEqual([expect.stringMatching(/d1-s2\.mp3/)]);
  await write(page, 'Helo');
  await expect(page.locator('.dc-word.wrong')).toHaveCount(1);
  await write(page, '');
  await expect(page.locator('#dcFeedback')).toContainText('Write the sentence first');
  await expect(page.locator('.dc-word.wrong')).toHaveCount(1);
  await write(page, '');
  await expect(page.locator('.dc-empty')).toHaveCount(1);
});

test('a draft made for other sentences (the teacher changed the text) starts again from sentence 1 but keeps the time', async ({ page, context }) => {
  await setup(context, { storage: { ['ta_dictation_draft|' + CODE]: JSON.stringify({ dictation: 'd1', h: 'old', studentId: '10001', k: 3,
    recs: [{ first: 'x', tries: 1, skipped: false, ok: false }], typed: 'zzz', activeMs: 600000 }) } });
  await start(page);
  await expect(count(page)).toContainText('Sentence 1 of 7');
  await expect(page.locator('#dcBox')).toHaveValue('');
  expect(await page.evaluate(() => window.DC.activeMs())).toBeGreaterThanOrEqual(600000);
});

test('preview: "Do it again" doesn\'t show "Send my answers"', async ({ page, context }) => {
  test.setTimeout(60000);
  await setup(context);
  await page.goto('/skill.html?s=dictation&dl=d1&preview=1');
  for (let n = 1; n <= 7; n++) { await expect(count(page)).toContainText(`Sentence ${n} of 7`); await page.locator('#dcSkip').click(); }
  await expect(page.locator('#dcSend')).toContainText('Preview');
  await page.locator('#dcAgain').click();
  for (let n = 1; n <= 7; n++) { await expect(count(page)).toContainText(`Sentence ${n} of 7`); await page.locator('#dcSkip').click(); }
  await expect(page.locator('.dc-end')).toContainText('not sent');
  await expect(page.locator('#dcSend')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Send my answers/ })).toHaveCount(0);
});

test('DC_SHOW_ANSWER true (now): a wrong word shows the right one, a missed word shows itself', async ({ page, context }) => {
  await setup(context);
  await start(page);
  await page.locator('#dcSkip').click();
  await expect(count(page)).toContainText('Sentence 2 of 7');
  await write(page, 'My nme is');
  await expect(page.locator('.dc-word.wrong .dc-want')).toHaveText('name');
  await expect(page.locator('.dc-word.missing')).toHaveText('Daniel');
});

test('DC_SHOW_ANSWER false: struck words and blanks first; the right words after the 2nd wrong Check', async ({ page, context }) => {
  await setup(context);
  await context.addInitScript(() => { window.__dcShowAnswer = false; });
  await start(page);
  await page.locator('#dcSkip').click();
  await expect(count(page)).toContainText('Sentence 2 of 7');
  await write(page, 'My nme is');
  await expect(page.locator('.dc-word.wrong')).toHaveCount(1);
  await expect(page.locator('.dc-want')).toHaveCount(0);
  await expect(page.locator('.dc-word.missing')).toHaveText('______');
  expect(await page.locator('.dc-marks').textContent()).not.toMatch(/name|Daniel/);
  await write(page, 'My nme is');
  await expect(page.locator('.dc-word.wrong .dc-want')).toHaveText('name');
  await expect(page.locator('.dc-word.missing')).toHaveText('Daniel');
});

test('a 40-word sentence wraps on a phone without sideways scrolling', async ({ page, context }) => {
  await setup(context);
  const long = 'On Saturday morning my older brother and I walked slowly to the busy market near the old railway station because our grandmother wanted fresh tomatoes, green peppers, two kilos of rice and a large watermelon for the family dinner.';
  await page.route('**/js/dictation-data.js*', async route => {
    const res = await route.fetch();
    route.fulfill({ response: res, body: (await res.text()) + `\nwindow.TA_DICTATION.levels[0].items[0].sentences[0] = ${JSON.stringify(long)};` });
  });
  await page.setViewportSize({ width: 375, height: 667 });
  await start(page);
  expect(long.split(' ').length).toBeGreaterThanOrEqual(38);
  await write(page, long.replace('tomatoes', 'tomatos').replace('watermelon', 'water melon').replace('railway', 'rail way'));
  await expect(page.locator('.dc-word.wrong').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  const over = await page.evaluate(() => [...document.querySelectorAll('.dc-card, .dc-card *')].filter(e => e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0 && getComputedStyle(e).overflowX !== 'auto').map(e => e.tagName + '.' + e.className));
  expect(over).toEqual([]);
  await page.locator('#dcSkip').click();
  await expect(page.locator('#dcFeedback')).toContainText('watermelon');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('a link to an unrecorded dictation says it isn\'t ready — no ID check, nothing starts', async ({ page, context }) => {
  await setup(context);
  await context.route('**/js/dictation-data.js*', r => r.fulfill({ contentType: 'application/javascript',
    body: require('fs').readFileSync(require('path').join(__dirname, '..', 'js', 'dictation-data.js'), 'utf8') +
      '\nwindow.TA_DICTATION.levels.forEach(l => l.items.forEach(i => { if (i.id === "d1") i.recorded = false; }));' }));
  await page.goto(URL_D);
  await expect(page.locator('body')).toContainText("This dictation isn't ready yet — ask your teacher.");
  await expect(page.locator('#skIdInput')).toHaveCount(0);
  await expect(page.locator('#dcBox')).toHaveCount(0);
});

test('one Enter counts one try even when beforeinput can\'t be cancelled', async ({ page, context }) => {
  test.setTimeout(60000);
  await setup(context);
  await start(page);
  await page.locator('#dcBox').fill('Helo');
  await page.evaluate(() => {
    const box = document.getElementById('dcBox');
    box.dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertLineBreak', cancelable: false, bubbles: true }));
    box.value = 'Helo\n';
    box.dispatchEvent(new InputEvent('input', { inputType: 'insertLineBreak', bubbles: true }));
  });
  await expect(page.locator('.dc-word.wrong')).toHaveCount(1);
  await writeRight(page, 1);
  for (let n = 2; n <= 7; n++) await writeRight(page, n);
  await expect(page.locator('#dcSend')).toContainText('Saved ✅');
  const docs = await dictDocs(page);
  expect(docs[0].sentences[0]).toEqual({ first: 'Helo', tries: 2, skipped: false, ok: false });   // the wrong try + the right one — not 3
});

// teacher, 2026-11-20: "if a student gets the sentence right, it should be highlighted greater" + a mock-up: "Sentence 1 of 7" with dots,
// a right sentence on a green banner with only a round ✓ (no "Right!" text)
test('a right sentence stands out: a green banner with a round ✓ and the sentence; dots show the progress', async ({ page, context }) => {
  await setup(context);
  await context.addInitScript(() => { window.__dcFast = false; });   // the usual pause, so the banner can be seen
  const errors = watchErrors(page);
  await start(page);
  await expect(page.locator('#dcCount .dc-dot')).toHaveCount(7);
  await expect(page.locator('#dcCount .dc-dot.on')).toHaveCount(1);
  await write(page, D1[0]);
  const banner = page.locator('.dc-msg.dc-right');
  await expect(banner).toBeVisible();
  await expect(banner.locator('.dc-tick')).toBeVisible();
  await expect(banner.getByRole('img', { name: 'Right' })).toBeVisible();
  await expect(banner).toHaveText('Hello!');   // no "Right!" text
  await page.waitForTimeout(400);
  await page.screenshot({ path: test.info().outputPath('right.png'), clip: { x: 280, y: 60, width: 840, height: 340 } });
  await expect(count(page)).toContainText('Sentence 2 of 7');
  await expect(page.locator('#dcCount .dc-dot.done')).toHaveCount(1);
  expect(errors).toEqual([]);
});
