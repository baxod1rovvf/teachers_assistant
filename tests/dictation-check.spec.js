// The Dictation Journey's checker (js/dictation-check.js, teacher 2026-11-19): a typed sentence is right when its words are
// the passage's words — spelling exact (British/American spellings stay different: it's a spelling exercise), contractions as
// in the passage; case, punctuation, curly/straight apostrophes and hyphen vs space don't matter (capitals/punctuation only
// give a gentle note); numbers count in digits or in words, the way the recording says them (tools/make-dictation-audio.py
// spoken()): "7:20" = "seven twenty", "14 August" = "the fourteenth of August", "9 a.m." = "9am" = "nine A M", "AZ 418" = "AZ418".
const { test, expect } = require('@playwright/test');
const fs = require('fs'), path = require('path'), vm = require('vm'), { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

async function open(page, context) {
  await context.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await page.goto('/skill.html?s=speaking&st=b1');
  await page.waitForFunction(() => typeof window.dcCheck === 'function' && typeof window.dcWordKeys === 'function');
}

function sentences() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js', 'dictation-data.js'), 'utf8'), sandbox);
  return sandbox.window.TA_DICTATION.levels.flatMap(l => l.items).flatMap(it => it.sentences.map((s, k) => ({ id: it.id + ' s' + (k + 1), s })));
}

// the sentence the way the recording says it, by the audio tool's own spoken()
function spokenForms(list) {
  const py = fs.readFileSync(path.join(ROOT, 'tools', 'make-dictation-audio.py'), 'utf8');
  const start = py.indexOf('# ---- how numbers are said'), end = py.indexOf("if __name__ != '__main__'");
  expect(start).toBeGreaterThan(-1); expect(end).toBeGreaterThan(start);
  const code = 'import re, json, sys\n' + py.slice(start, end) +
    '\nprint(json.dumps([spoken(s) for s in json.loads(sys.stdin.read())]))\n';
  return JSON.parse(execFileSync('python3', ['-c', code], { input: JSON.stringify(list), encoding: 'utf8', maxBuffer: 1 << 24 }));
}

test('dictation check: words, spelling, capitals and punctuation', async ({ page, context }) => {
  await open(page, context);
  const r = await page.evaluate(() => {
    const c = (e, t) => window.dcCheck(e, t);
    return {
      hello: c('Hello!', 'hello'),
      exact: c('My favourite colour is blue.', 'My favourite colour is blue.'),
      lower: c('My favourite colour is blue.', 'my favourite colour is blue'),
      noStop: c('My name is Daniel.', 'My name is Daniel'),
      capsOnly: c('My name is Daniel.', 'my name is daniel.'),
      us: c('My favourite colour is blue.', 'my favorite colour is blue'),
      missing: c('My favourite colour is blue.', 'My favourite colour blue.'),
      extra: c('My favourite colour is blue.', 'My favourite colour is very blue.'),
      unrelated: c('My favourite colour is blue.', 'My favourite banana is blue.'),
      empty: c('My name is Daniel.', ''),
      mrs: [c('Mrs Brown is my teacher.', 'Mrs. Brown is my teacher.'), c('Mrs. Brown is my teacher.', 'mrs brown is my teacher')],
      apos: [c('It’s my sister’s book.', "It's my sister's book."), c("It's my sister's book.", 'it’s my sister’s book')],
      contraction: c("I'm happy.", 'I am happy.'),
      contraction2: c('I am happy.', "I'm happy."),
      hyphen: c('Check-in begins at 2 p.m.', 'check in begins at 2 pm'),
      hyphenGone: c('Check-in begins at 2 p.m.', 'checkin begins at 2 pm'),
      cafe: c('The café is busy.', 'The cafe is busy.'),
      quote: c('“Hi, Emma.', 'Hi, Emma.'),
    };
  });
  expect(r.hello.ok).toBe(true);
  expect(r.exact).toEqual({ ok: true, note: '', parts: ['My', 'favourite', 'colour', 'is', 'blue'].map(text => ({ text, state: 'ok' })) });
  expect(r.lower.ok).toBe(true);
  expect(r.lower.note).toContain('capital letters');
  expect(r.noStop).toMatchObject({ ok: true, note: 'Check the punctuation.' });
  expect(r.capsOnly).toMatchObject({ ok: true, note: 'Check the capital letters.' });
  expect(r.lower.note).toBe('Check the capital letters and punctuation.');
  expect(r.us.ok).toBe(false);
  expect(r.us.parts.filter(p => p.state !== 'ok')).toEqual([{ text: 'favorite', state: 'wrong', want: 'favourite' }]);
  expect(r.missing.ok).toBe(false);
  expect(r.missing.parts.map(p => p.state)).toEqual(['ok', 'ok', 'ok', 'missing', 'ok']);
  expect(r.missing.parts[3]).toEqual({ text: 'is', state: 'missing' });
  expect(r.extra.ok).toBe(false);
  expect(r.extra.parts.filter(p => p.state !== 'ok')).toEqual([{ text: 'very', state: 'extra' }]);
  expect(r.unrelated.parts.filter(p => p.state !== 'ok').map(p => p.state).sort()).toEqual(['extra', 'missing']);
  expect(r.empty.ok).toBe(false);
  expect(r.empty.parts.map(p => p.state)).toEqual(['missing', 'missing', 'missing', 'missing']);
  r.mrs.forEach(x => expect(x.ok).toBe(true));
  r.apos.forEach(x => expect(x.ok).toBe(true));
  expect(r.contraction.ok).toBe(false);
  expect(r.contraction2.ok).toBe(false);
  expect(r.hyphen.ok).toBe(true);
  expect(r.hyphenGone.ok).toBe(true);   // a hyphenated word may be typed joined (review, 2026-11-19)
  expect(r.cafe.ok).toBe(true);
  expect(r.quote.ok).toBe(true);
  expect(r.quote.note).toBe('Check the punctuation.');
});

test('dictation check: numbers in digits or in words', async ({ page, context }) => {
  await open(page, context);
  const ok = await page.evaluate(() => {
    const cases = [
      ['I am waiting for the number 12 bus.', 'I am waiting for the number twelve bus'],
      ['The train from Andijan to Tashkent left at 7:20 in the morning.', 'the train from andijan to tashkent left at seven twenty in the morning'],
      ['The train from Andijan to Tashkent left at 7:20 in the morning.', 'The train from Andijan to Tashkent left at 7.20 in the morning.'],
      ['You have booked a double room for three nights, from 14 August to 17 August.', 'You have booked a double room for three nights, from 14th August to 17th August.'],
      ['You have booked a double room for three nights, from 14 August to 17 August.', 'you have booked a double room for 3 nights from the fourteenth of August to the seventeenth of August'],
      ['You have booked a double room for three nights, from 14 August to 17 August.', 'you have booked a double room for three nights from 14 august to 17 august'],
      ['You have booked a double room for three nights, from 14 August to 17 August.', 'You have booked a double room for three nights, from fourteenth of August to 17 August.'],
      ['The library is open from Monday to Saturday, between 9 a.m. and 6 p.m.', 'The library is open from Monday to Saturday, between 9am and 6pm'],
      ['The library is open from Monday to Saturday, between 9 a.m. and 6 p.m.', 'the library is open from monday to saturday between nine a m and six p m'],
      ['The library is open from Monday to Saturday, between 9 a.m. and 6 p.m.', 'The library is open from Monday to Saturday, between 9 AM and 6 PM.'],
      ['Passengers travelling on Flight AZ 418 to Istanbul are advised that the departure has been delayed by approximately fifty minutes.',
        'Passengers travelling on Flight AZ418 to Istanbul are advised that the departure has been delayed by approximately 50 minutes.'],
      ['The railway museum opened in 1987 inside a former station building.', 'The railway museum opened in nineteen eighty-seven inside a former station building.'],
      ['The railway museum opened in nineteen eighty-seven inside a former station building.', 'The railway museum opened in 1987 inside a former station building.'],
      ['Registration opens at 8:15 a.m., and the opening address begins at 9:00.', 'Registration opens at 8:15 am, and the opening address begins at 9 o’clock.'],
      ['Registration opens at 8:15 a.m., and the opening address begins at 9:00.', 'Registration opens at 8:15 a.m., and the opening address begins at 9.'],
      ['The annual education conference will take place at the Riverside Convention Centre on 12 and 13 September.',
        'The annual education conference will take place at the Riverside Convention Centre on 12th and 13th September.'],
      ['We usually have dinner together at seven o\'clock.', 'We usually have dinner together at 7 o\'clock.'],
      ['The bread costs twelve thousand so\'m.', 'The bread costs 12,000 so\'m.'],
      ['The bread costs twelve thousand so\'m.', 'The bread costs 12000 so’m.'],
    ];
    return cases.map(([e, t]) => [t, window.dcCheck(e, t).ok]);
  });
  ok.forEach(([t, v]) => expect(v, t).toBe(true));
  const wrong = await page.evaluate(() => [
    window.dcCheck('The train left at 7:20 in the morning.', 'The train left at 7:30 in the morning.'),
    window.dcCheck('I am waiting for the number 12 bus.', 'I am waiting for the number 13 bus.'),
    window.dcCheck('The museum opened in 1987.', 'The museum opened in 1978.'),
    window.dcCheck('Passengers travelling on Flight AZ 418 to Istanbul.', 'Passengers travelling on Flight AZ 481 to Istanbul.'),
    window.dcCheck('I have two brothers.', 'I have to brothers.'),
    window.dcCheck('Workshops will run from 11:30 until 1:00 p.m.', 'Workshops will run from 11:30 until 1:00 a.m.'),
  ]);
  wrong.forEach(w => expect(w.ok).toBe(false));
  const firstWrong = w => w.parts.filter(p => p.state !== 'ok');
  expect(firstWrong(wrong[0])).toEqual([{ text: '7:30', state: 'wrong', want: '7:20' }]);
  expect(firstWrong(wrong[3])).toEqual([{ text: '481', state: 'wrong', want: '418' }]);   // a wrong number is one wrong word
  expect(firstWrong(wrong[4])).toEqual([{ text: 'to', state: 'wrong', want: 'two' }]);    // "two" is compared as written too
  expect(firstWrong(wrong[5])).toEqual([{ text: 'a.m.', state: 'wrong', want: 'p.m.' }]);
  expect(await page.evaluate(() => window.dcWordKeys('Check-in at 7:20, from the 14th of August; Flight AZ 418 at 9 a.m.'))).toEqual(
    ['check', 'in', 'at', '7:20', 'from', '14', 'august', 'flight', 'az', '418', 'at', '9', 'am']);
});

// review round 1 (2026-11-19): the reviewer's own inputs
test('dictation check: ordinals, o\'clock, Doctor/Mister, thousands, joined words, a.m. commas, long junk', async ({ page, context }) => {
  await open(page, context);
  const wrong = [
    ['At first, I felt nervous because I did not know anyone.', 'At one, I felt nervous because I did not know anyone.'],
    ['The judges gave us second prize.', 'The judges gave us two prize.'],
    ['Welcome to the second floor of the museum.', 'Welcome to the two floor of the museum.'],
    ['The shelves are crowded with novels, travel guides, and second-hand textbooks.', 'The shelves are crowded with novels, travel guides, and two hand textbooks.'],
    ['My first meal was vegetable soup.', 'My one meal was vegetable soup.'],
    ['First impressions can influence our opinions long before we have enough information to make a fair judgement.',
      'One impressions can influence our opinions long before we have enough information to make a fair judgement.'],
    ['You have booked a double room for three nights, from 14 August to 17 August.', 'You have booked a double room for third nights, from 14 August to 17 August.'],
    ['I am waiting for the number 12 bus.', 'I am waiting for the number twelfth bus.'],
    ['Passengers should remain near Gate 12 and listen for further announcements.', 'Passengers should remain near Gate twelfth and listen for further announcements.'],
    ['We won two goals to one.', 'We won second goals to first.'],
    ["My lessons start at eight o'clock.", 'My lessons start at eight.'],
    ["We usually have dinner together at seven o'clock.", 'We usually have dinner together at seven.'],
    ["We usually have dinner together at seven o'clock.", 'We usually have dinner together at 7:00.'],   // the passage writes o'clock: it's required
    ["My lessons start at eight o'clock.", 'My lessons start at eight oclock.'],
  ];
  const right = [
    ['At first, I felt nervous.', 'At 1st, I felt nervous.'],
    ["My lessons start at eight o'clock.", 'My lessons start at 8 o’clock.'],
    ['Registration opens at 8:15 a.m., and the opening address begins at 9:00.', "Registration opens at 8:15 a.m., and the opening address begins at nine o'clock."],
    ['Registration opens at 8:15 a.m., and the opening address begins at 9:00.', 'Registration opens at 8:15 a.m., and the opening address begins at 9.'],
    ['Please remember that your appointment with Dr Harris is scheduled for Thursday, 21 May, at 3:45 p.m.',
      'Please remember that your appointment with Doctor Harris is scheduled for Thursday, 21 May, at 3:45 p.m.'],
    ['Dear Mr Wilson, your reservation is confirmed.', 'Dear Mister Wilson, your reservation is confirmed.'],
    ["The bread costs twelve thousand so'm.", "The bread costs 12 000 so'm."],
    ["The bread costs twelve thousand so'm.", "The bread costs 12.000 so'm."],
    ['Sleep plays an essential role in learning, concentration, and general well-being.', 'Sleep plays an essential role in learning, concentration, and general wellbeing.'],
    ['We scored the first goal, but the other team equalised before half-time.', 'We scored the first goal, but the other team equalised before halftime.'],
  ];
  const r = await page.evaluate(([wrong, right]) => {
    const t0 = performance.now();
    const junk = window.dcCheck('Hello!', 'x '.repeat(200000));
    return {
      wrong: wrong.map(([e, t]) => [t, window.dcCheck(e, t).ok]),
      right: right.map(([e, t]) => [t, window.dcCheck(e, t)]),
      ordWrong: window.dcCheck('My first meal was vegetable soup.', 'My one meal was vegetable soup.').parts.filter(p => p.state !== 'ok'),
      comma: window.dcCheck('Check-in begins at 2 p.m., and check-out is before 11 a.m.', 'Check-in begins at 2 p.m. and check-out is before 11 a.m.'),
      commaPm: window.dcCheck('Check-in begins at 2 p.m., and check-out is before 11 a.m.', 'Check-in begins at 2pm, and check-out is before 11am.'),
      mrs: window.dcCheck('Mrs Brown is my teacher.', 'Mrs. Brown is my teacher.'),
      junk: { ok: junk.ok, ms: performance.now() - t0 },
    };
  }, [wrong, right]);
  r.wrong.forEach(([t, ok]) => expect(ok, t).toBe(false));
  r.right.forEach(([t, x]) => expect(x.ok, t + ' ' + JSON.stringify(x.parts.filter(p => p.state !== 'ok'))).toBe(true));
  expect(r.right.map(([, x]) => x.note).filter(Boolean)).toEqual([]);   // Doctor/Mister, 12 000, wellbeing: no note either
  expect(r.ordWrong).toEqual([{ text: 'one', state: 'wrong', want: 'first' }]);
  expect(r.comma).toMatchObject({ ok: true, note: 'Check the punctuation.' });
  expect(r.commaPm).toMatchObject({ ok: true, note: '' });
  expect(r.mrs).toMatchObject({ ok: true, note: '' });
  expect(r.junk.ok).toBe(false);
  expect(r.junk.ms).toBeLessThan(1000);
});

test('dictation check: every sentence is right typed exactly, in lower case without punctuation, and as the recording says it', async ({ page, context }) => {
  test.setTimeout(120000);
  await open(page, context);
  const list = sentences();
  expect(list.length).toBe(711);
  const lowerNoPunct = s => s.toLowerCase().replace(/[.,!?;:“”"()]/g, ' ');
  const spoken = spokenForms(list.map(x => x.s));
  const cases = [];
  list.forEach((x, i) => {
    cases.push({ id: x.id + ' exact', e: x.s, t: x.s, exact: true });
    cases.push({ id: x.id + ' lower', e: x.s, t: lowerNoPunct(x.s) });
    if (/\d/.test(x.s)) {
      expect(spoken[i], x.id).not.toMatch(/\d/);
      cases.push({ id: x.id + ' spoken: ' + spoken[i], e: x.s, t: spoken[i] });
      cases.push({ id: x.id + ' spoken lower: ' + spoken[i], e: x.s, t: lowerNoPunct(spoken[i]) });
    }
  });
  expect(cases.filter(c => / spoken: /.test(c.id)).length).toBe(9);   // sentences whose recording says a number differently (9 since the 2026-11-21 rebuild)
  const res = await page.evaluate(cs => cs.map(c => {
    const r = window.dcCheck(c.e, c.t);
    return { id: c.id, ok: r.ok, note: r.note, exact: !!c.exact, bad: r.parts.filter(p => p.state !== 'ok') };
  }), cases);
  res.forEach(r => {
    expect(r.ok, r.id + ' ' + JSON.stringify(r.bad)).toBe(true);
    if (r.exact) expect(r.note, r.id).toBe('');
  });
});
