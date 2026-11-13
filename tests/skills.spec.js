// The Skills course (2026-11-04): band rules shared by the student page and Loom.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

// Writing words since 2026-11-09 (teacher: "double it — Step 1 60, last step 200"): about 60 + (step − 1) × 140/17 words, ±10,
// rounded to 5; the minutes at least the old ones and about 7 words a minute.
function skPlanWords(no, oldMinutes) {
  const t = 60 + (no - 1) * 140 / 17, r5 = x => Math.round(x / 5) * 5;
  return { minWords: r5(t - 10), maxWords: r5(t + 10), minutes: Math.max(oldMinutes, Math.ceil(t / 7 / 5) * 5) };
}

test.describe('bands', () => {
  test('listening/reading bands, overall and CEFR follow the rules', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&lv=1&preview=1');
    const r = await page.evaluate(() => ({
      band: [skBand(19, 20), skBand(16, 20), skBand(9, 20), skBand(7, 20), skBand(3, 20), skBand(0, 20), skBand(10, 10), skBand(37, 40), skBand(11, 40)],
      overall: [skOverall([8.5, 8.5, 9, 9]), skOverall([7.5, 9, 9, 8.5]), skOverall([7, null]), skOverall([]), skOverall([7, 7.5])],
      cefr: [skCefr(9), skCefr(8), skCefr(6.5), skCefr(4), skCefr(3), skCefr(2)],
      colour: [skBandColour(7), skBandColour(6.5), skBandColour(6), skBandColour(5.5), skBandColour(5), skBandColour(2)],
    }));
    expect(r.band).toEqual([8.5, 7.5, 5.5, 4.5, 3, 0, 9, 8.5, 4]);
    expect(r.overall).toEqual([9, 8.5, 7, null, 7.5]);
    expect(r.cefr).toEqual(['C2', 'C1', 'B2', 'B1', 'A2', 'A1']);
    expect(r.colour).toEqual(['good', 'good', 'mid', 'mid', 'low', 'low']);
  });
});

test.describe('content', () => {
  // Spoken numbers → digits ("oh seven seven double oh" → "07700", "seven thirty" → "730"), then letters/digits only,
  // so an answer can be found in the transcript line that says it (spellings "That's T, H, O…" → "thatstho…").
  // "twenty-seven" → 27, "four hundred and fifty" → 450.
  const NUM = { zero: 0, oh: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
    thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
    sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
  const norm = s => {
    const w = String(s).toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/).filter(Boolean);
    const out = [];
    const tensUnits = i => {   // [value, words used] for "twenty seven" / "twenty" / "seven" at w[i]
      const x = w[i], nx = w[i + 1];
      if (NUM[x] >= 20 && NUM[x] % 10 === 0 && NUM[nx] >= 1 && NUM[nx] <= 9) return [NUM[x] + NUM[nx], 2];
      return [NUM[x], 1];
    };
    for (let i = 0; i < w.length; i++) {
      const x = w[i], nx = w[i + 1];
      if ((x in NUM || x === 'a') && x !== 'oh' && nx === 'hundred') {
        let v = (x === 'a' ? 1 : NUM[x]) * 100; i += 1;
        if (w[i + 1] === 'and' && w[i + 2] in NUM) { const [t, n] = tensUnits(i + 2); v += t; i += 1 + n; }
        out.push(String(v)); continue;
      }
      if (NUM[x] >= 20 && NUM[x] % 10 === 0 && NUM[nx] >= 1 && NUM[nx] <= 9) { out.push(String(NUM[x] + NUM[nx])); i++; continue; }
      if (x === 'double' && nx in NUM) { out.push(String(NUM[nx]).repeat(2)); i++; continue; }
      if (x === 'double' && /^[a-z]$/.test(nx)) { out.push(nx + nx); i++; continue; }   // a spelled "A, double N, A"
      if (x === 'oh' && !(nx in NUM || nx === 'double') && !(w[i - 1] in NUM)) { out.push(x); continue; }
      out.push(x in NUM ? String(NUM[x]) : x);
    }
    return out.join('');
  };
  const sentences = text => text.trim().split(/(?<=[.!?])\s+/);

  test('20 steps in order (b1…b10 Beginner, e1…e10 Elementary); all 20 have the four parts, with checked content', async ({ page, context, request }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&st=e1&preview=1');
    const S = await page.evaluate(() => ({ skills: TA_SKILLS, better: TA_BETTER_WORDS }));
    expect(S.skills.elementary).toBeUndefined();
    const steps = S.skills.steps;
    expect(steps.map(l => l.id)).toEqual(['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10']);
    expect(steps.map(l => l.no)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(steps.map(l => l.stage)).toEqual(Array(10).fill('Beginner').concat(Array(10).fill('Elementary')));
    expect(steps.map(l => l.theme)).toEqual(['Daily Routine', 'Family', 'Home & Living', 'Food & Meals', 'Free Time', 'Friends', 'School & Education', 'Hobbies & Sports', 'Shopping', 'Your City',
      'Holidays', 'Future Plans', 'Jobs & Careers', 'Clothes & Fashion', 'Transport', 'Animals & Pets', 'Health & Lifestyle', 'Technology', 'Movies & Music', 'Weather & Seasons']);
    steps.forEach(l => expect(l.emoji).toBeTruthy());
    // Steps 1–10 (b1–b10) are complete (b1's writing + speaking came from old Level 1) — no stubs left among them
    const beginners = steps.slice(0, 10);
    beginners.forEach(l => expect(Object.keys(l).sort(), l.id).toEqual(['emoji', 'id', 'listening', 'no', 'reading', 'speaking', 'stage', 'theme', 'writing']));
    const levels = steps.slice(10).map(l => Object.assign({}, l, { n: Number(l.id.slice(1)) }));   // e<n> = old Level n
    expect(Object.keys(S.better).length).toBeGreaterThanOrEqual(30);
    ['good', 'nice', 'big', 'small', 'very happy', 'bad', 'like'].forEach(w => expect(S.better[w].length).toBeGreaterThan(0));
    // the teacher (2026-11-04): "finish when level 5 is ready; levels 6–10 are for future" — levels 6, 7 and 8 added 2026-11-05
    const full = levels.filter(l => l.n <= 8);
    full.forEach(l => ['listening', 'reading', 'writing', 'speaking'].forEach(k => expect(l[k], l.id + ' ' + k).toBeTruthy()));
    levels.forEach(l => ['listening', 'reading', 'writing', 'speaking'].forEach(k => expect(l[k], l.id + ' ' + k).toBeTruthy()));   // Steps 19–20 too (Listening Journey, 2026-11-10)
    // the listenings: tests/listening-journey.spec.js (the Listening Journey, 2026-11-10)
    for (const lv of beginners.concat(full)) {
      const W = lv.writing;
      expect(W.topic).toBeTruthy();
      expect(W.words.length).toBeGreaterThanOrEqual(8);   // the asked words (Writing Journey, 2026-11-09)
      expect(W.minWords).toBeLessThan(W.maxWords);
      expect(W.minutes).toBeGreaterThan(0);

      const P = lv.speaking;
      expect(P.words.length).toBeGreaterThanOrEqual(lv.stage === 'Beginner' ? 6 : 8);
      expect(P.words.length).toBeLessThanOrEqual(10);
      P.words.forEach(w => expect(w.w && w.emoji && w.ex).toBeTruthy());
      expect(P.questions.length).toBeGreaterThanOrEqual(4);
      expect(P.questions.length).toBeLessThanOrEqual(5);
      expect(P.part2.topic).toBeTruthy();
      expect(P.part2.hints.length).toBe(3);
      expect(P.part2.seconds).toBeGreaterThan(0);
    }
  });

  test('Step 1 has old Level 1\'s About me (Speaking: Daily Routine since 2026-11-09); Step 11 (old Level 1) keeps the hotel and pen-friend, with a new writing and talk', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&st=e1&preview=1');
    const [b1, l1] = await page.evaluate(() => [TA_SKILLS.steps[0], TA_SKILLS.steps.find(s => s.id === 'e1')]);
    expect(b1).toMatchObject({ id: 'b1', no: 1, stage: 'Beginner', theme: 'Daily Routine' });
    expect(b1.writing).toMatchObject({ topic: 'My Daily Routine', minWords: 80, maxWords: 100, minutes: 15 });   // the Writing Journey (2026-11-09)
    expect(b1.speaking).toMatchObject({ topic: 'Daily Routine', part2: { topic: 'Talk about your daily routine', seconds: 30 } });   // the teacher's Speaking Journey (2026-11-09)
    expect(b1.speaking.words.map(w => [w.w, w.uz])).toContainEqual(['Wake up', "Uyg'onmoq"]);
    expect(l1).toMatchObject({ id: 'e1', no: 11, stage: 'Elementary', theme: 'Holidays', emoji: '🏖️' });
    expect(l1.listening.src).toMatch(/^audio\/skills\/listen-step-11\.mp3(\?v=\d+)?$/);   // the Listening Journey (2026-11-10)
    expect(l1.reading.title).toBe('My First Big Trip');   // the Reading Journey (2026-11-09)
    expect(l1.writing).toMatchObject({ topic: 'My Last Holiday', minWords: 100, maxWords: 120, minutes: 20 });   // the Writing Journey (2026-11-09)
    expect(l1.speaking.part2).toMatchObject({ topic: 'Talk about a memorable holiday', seconds: 45 });   // the Speaking Journey (2026-11-09)
    l1.speaking.questions.forEach(q => expect(q.use.length).toBeGreaterThan(0));
    expect(JSON.stringify(l1.speaking)).not.toBe(JSON.stringify(b1.speaking));
  });

  test('Steps 1–10 (beginner) are as the plan says (Part 2 topics and seconds)', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&st=b1&preview=1');
    const B = await page.evaluate(() => TA_SKILLS.steps.slice(0, 10));
    const plan = [
      { topic: 'About me', min: 25, max: 35, minutes: 12, talk: /daily routine/, sec: 30 },
      { topic: 'My numbers', min: 20, max: 30, minutes: 10, talk: /your family/, sec: 30 },
      { topic: 'My family', min: 25, max: 35, minutes: 10, talk: /your home/, sec: 30 },
      { topic: 'My bag', min: 25, max: 35, minutes: 10, talk: /favourite dish/, sec: 30 },
      { topic: 'Shopping list', min: 30, max: 40, minutes: 12, talk: /free time/, sec: 30 },
      { topic: 'My week', min: 30, max: 40, minutes: 12, talk: /best friend/, sec: 40 },
      { topic: 'My food', min: 30, max: 40, minutes: 12, talk: /your school/, sec: 40 },
      { topic: 'My pet', min: 35, max: 45, minutes: 15, talk: /your hobby/, sec: 40 },
      { topic: 'My room', min: 35, max: 45, minutes: 15, talk: /a shop you like/, sec: 45 },
      { topic: 'My best friend', min: 40, max: 50, minutes: 15, talk: /your city/, sec: 45 },
    ];
    expect(B.length).toBe(plan.length);
    B.forEach((st, i) => {
      const p = plan[i];
      // the writing: tests/writing-journey.spec.js (the Writing Journey, 2026-11-09)
      expect(st.speaking.part2.topic).toMatch(p.talk);
      expect(st.speaking.part2.seconds).toBe(p.sec);
      st.speaking.questions.forEach(q => expect(q.use.length).toBeGreaterThan(0));
    });
  });

  test('Steps 12–18 (old Levels 2–8) are as the spec plans them (themes, tasks, writing words/minutes, Part 2 seconds)', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&st=e1&preview=1');
    const L = await page.evaluate(() => TA_SKILLS.steps.filter(s => s.stage === 'Elementary'));
    const plan = [
      { no: 2, listen: /sports club/i, topic: 'My family', min: 40, max: 60, minutes: 15, talk: /future/i, sec: 45 },
      { no: 3, listen: /room/i, topic: 'My home', min: 40, max: 60, minutes: 15, talk: /job/i, sec: 45 },
      { no: 4, listen: /doctor/i, topic: 'My weekday', min: 50, max: 70, minutes: 20, talk: /clothes/i, sec: 60 },
      { no: 5, listen: /party/i, topic: 'My favourite meal', min: 50, max: 70, minutes: 20, talk: /journey/i, sec: 60 },
      { no: 6, listen: /lost bag/i, topic: 'A shopping trip', min: 50, max: 70, minutes: 20, talk: /pet/i, sec: 60 },
      { no: 7, listen: /tourist/i, topic: 'My town', min: 60, max: 80, minutes: 20, talk: /healthy/i, sec: 60 },
      { no: 8, listen: /course/i, topic: 'My free time', min: 60, max: 80, minutes: 25, talk: /technology/i, sec: 90 },
    ];
    const words = t => t.split(/\s+/).filter(Boolean).length;
    for (const p of plan) {
      const lv = L[p.no - 1];
      // the writing: tests/writing-journey.spec.js
      expect(lv.speaking.part2.topic).toMatch(p.talk);
      expect(lv.speaking.part2.seconds).toBe(p.sec);
      lv.speaking.questions.forEach(q => expect(q.use.length).toBeGreaterThan(0));
    }
  });

  test('the skills course has no Uzbek names or Uzbek words — only English', async () => {
    const fs = require('fs'), path = require('path');
    const uzbek = /Uzbek|Tashkent|Samarkand|Bukhara|Kamila|Jasur|Bobur|Nodira|Karimov|Aziz|Lola\b|Malika|Rustam|Laylo|Jamol|Bekzod|Sardor|Nilufar|Madina|Timur|Dilnoza|Karim\b|\bAli\b|harf|raqam|unli tovush|telefon|ikki marta/;
    ['js/skills-data.js'].forEach(f => {
      // the Speaking words' Uzbek meanings (uz) are the teacher's own choice (2026-11-09), and so is the teacher's own Listening
      // Journey (2026-11-10: plov in Step 4, Layla Karim, Yusuf) — everything else stays English
      const t = fs.readFileSync(path.join(__dirname, '..', f), 'utf8').replace(/uz: "(?:[^"\\]|\\.)*"/g, '').replace(/Uzbek meaning/g, '')
        .replace(/listening: \{\n\s*\/\/ LISTENING JOURNEY[\s\S]*?LISTENING JOURNEY END/g, '');
      expect(t.match(uzbek), f).toBeNull();
    });
  });
});

// the record the stand-in database keeps for each write (window.__writes only lists a few fields)
const sentRecords = page => page.evaluate(() => window.__writes.map(w => window.__fakeDocs.find(d => d.__id === w.id)));

async function start(page, url) {
  await page.goto(url);
  await page.locator('#studentNameInput').fill('Test Student');
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
}

// answers every question right (or as `given` says: a text, or 'wrong' for a wrong choice / a wrong text), 1-based numbers
async function answerAll(page, Q, given = {}) {
  const rows = page.locator('.sk-q');
  for (let i = 0; i < Q.questions.length; i++) {
    const q = Q.questions[i], row = rows.nth(i), g = given[i + 1];
    const kind = q.type || 'gap';
    if (kind === 'gap' || kind === 'open') {
      await row.locator('input').fill(g === 'wrong' ? 'zzz' : g != null ? g : kind === 'open' ? 'It is ' + q.keys[0] : q.a[q.a.length - 1]);
    } else {
      const opts = kind === 'tfng' ? ['True', 'False', 'Not given'] : kind === 'tf' ? ['True', 'False'] : q.opts;
      const pick = g === 'wrong' ? opts.find(o => o !== q.a[0]) : q.a[0];
      await row.locator('.sk-opt[data-val="' + pick.replace(/"/g, '\\"') + '"]').click();
    }
  }
}

test.describe('student page', () => {

  test('listening: Step 11 — a/b/c, spellings, gaps and short answers are marked, Analyze shows who said each answer, one result is sent', async ({ page, context }) => {
    await prepare(context);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await start(page, '/skill.html?s=listening&lv=1&c=ABC123');
    await expect(page.locator('audio')).toHaveAttribute('src', /audio\/skills\/listen-step-11\.mp3/);
    const L = await page.evaluate(() => TA_SKILLS.steps.find(s => s.id === 'e1').listening);
    expect(L.questions).toHaveLength(16);
    await expect(page.locator('.sk-sub')).toHaveText(['Choose the correct answer.', 'Spelling and numbers.', 'True or False?', 'Answer the questions.']);
    // the student: Q1 wrong, the town spelled out letter by letter (right), the last one wrong — 14 of 16
    await answerAll(page, L, { 1: 'wrong', 5: 'S-I-L-V-E-R L-A-K-E', 15: 'We saw goats and sheep.', 16: 'in August' });
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-q.right')).toHaveCount(14);
    await expect(page.locator('.sk-q.wrong')).toHaveCount(2);
    await expect(page.locator('.sk-q.wrong').nth(0)).toContainText('By train');
    await expect(page.locator('.sk-score')).toContainText('14 / 16');
    await expect(page.locator('.sk-words li')).toHaveCount(0);   // no word list: the Listening Journey has none
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');

    await page.getByRole('button', { name: 'Analyze >' }).click();
    const want = L.transcript.filter(t => t.answers.length).length;
    await expect(page.locator('.sk-line.hl')).toHaveCount(want);
    expect(await page.locator('.sk-line.hl .sk-qno').count()).toBe(16);
    await expect(page.locator('.sk-line.hl', { hasText: 'Nora is N-O-R-A' }).locator('.sk-qno')).toContainText(['Q3', 'Q6']);
    await expect(page.locator('.sk-line').first().locator('.sk-who')).toContainText('👩 Amelia');

    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ v: 1, code: 'ABC123', type: 'Listening course', title: 'Step 11 · Holidays — Listening', step: 'e1', stepNo: 11,
      skill: 'listening', name: 'Test Student', studentId: '10001', correct: 14, total: 16, score: 88 });
    expect(recs[0].band).toBe(await page.evaluate(() => skBand(14, 16)));
    expect(recs[0].answers).toHaveLength(16);
    expect(recs[0].answers[4]).toEqual({ q: "The town's name: _____", given: 'S-I-L-V-E-R L-A-K-E', right: true });
    expect(recs[0].answers[0].right).toBe(false);
    expect(recs[0].submittedAt).toBeTruthy();
    expect(recs[0].timeDisplay).toMatch(/^\d\d:\d\d$/);
    // builtAt = the Submit time (a page opened before "Delete all results" and sent after it still counts)
    expect(recs[0].builtAt).toBe(recs[0].date);
    // the answers stay on the screen; a second press sends nothing more
    await expect(page.locator('.sk-q').nth(4).locator('input')).toHaveValue('S-I-L-V-E-R L-A-K-E');
    await expect(page.getByRole('button', { name: /Submit/ })).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('reading: Step 11 has 15 questions — True/False/Not given, gaps, and answers marked by their main words', async ({ page, context }) => {
    await prepare(context);
    await start(page, '/skill.html?s=reading&st=e1&c=RDG456');
    const R = await page.evaluate(() => TA_SKILLS.steps.find(s => s.id === 'e1').reading);
    const N = R.questions.length;
    expect(N).toBe(15);
    await expect(page.locator('.sk-sub')).toHaveText(['True, False or Not given?', 'Complete the sentences with a word from the text.', 'Answer the questions.']);
    await expect(page.locator('.sk-q')).toHaveCount(N);
    expect(await page.locator('.sk-sent').evaluateAll(l => new Set(l.map(x => x.dataset.line)).size)).toBe(R.text.trim().split(/(?<=[.!?])\s+/).length);
    // every paragraph of the text is its own paragraph on the page (also after a sentence that ends in a quote mark)
    await expect(page.locator('.sk-text p, #skText p, .sk-card p:has(.sk-sent)')).toHaveCount(R.text.split('\n\n').length);
    let expectRight = 0;
    const firstOf = ['tfng', 'gap', 'open'].map(t => R.questions.findIndex(q => q.type === t));
    for (let i = 0; i < N; i++) {
      const q = R.questions[i], row = page.locator('.sk-q').nth(i);
      const wrong = firstOf.includes(i);   // one of each kind wrong
      if (q.type === 'gap') await row.locator('input').fill(wrong ? 'house' : q.a[0].toUpperCase() + ' ');
      else if (q.type === 'open') await row.locator('input').fill(wrong ? 'I do not know' : 'I think it is because of the ' + q.keys[0].toUpperCase() + '.');
      else {
        const opts = q.type === 'tfng' ? ['True', 'False', 'Not given'] : q.opts;
        const pick = wrong ? opts.find(o => o !== q.a[0]) : q.a[0];
        await row.getByRole('button', { name: pick, exact: false }).first().click();
      }
      if (!wrong) expectRight++;
    }
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-q.right')).toHaveCount(expectRight);
    await expect(page.locator('.sk-q.wrong')).toHaveCount(N - expectRight);
    await expect(page.locator('.sk-score')).toContainText(expectRight + ' / ' + N);
    await expect(page.locator('.sk-words li')).toHaveCount(10);
    await page.getByRole('button', { name: 'Analyze >' }).click();
    const lines = [...new Set(R.questions.map(q => q.line))];
    await expect(page.locator('.sk-sent.hl')).toHaveCount(lines.length);
    await expect(page.locator('.sk-sent.hl').first().locator('.sk-qno')).not.toHaveCount(0);
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ code: 'RDG456', type: 'Reading course', title: 'Step 11 · Holidays — Reading', step: 'e1', stepNo: 11, skill: 'reading',
      correct: expectRight, total: N, score: Math.round(expectRight / N * 100) });
    expect(recs[0].band).toBe(await page.evaluate(([n, t]) => skBand(n, t), [expectRight, N]));
  });

  test('preview sends nothing', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&st=e1&preview=1');
    await expect(page.locator('.sk-preview')).toContainText('Preview');
    await expect(page.locator('#studentNameInput')).toHaveCount(0);
    await page.locator('.sk-q').first().getByRole('button', { name: 'By train' }).click();
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-q.right')).toHaveCount(1);
    await expect(page.locator('.sk-score')).toContainText('1 / 16');
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => window.__writes ? window.__writes.length : 0)).toBe(0);
  });

  test('Steps 1–10 (beginner): every listening and reading can be done — all right answers give full marks', async ({ page, context }) => {
    test.setTimeout(120000);
    await prepare(context);
    for (const id of ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10']) {
      await page.goto('/skill.html?s=listening&st=' + id + '&preview=1');
      const n = id.slice(1);
      await expect(page.locator('audio')).toHaveAttribute('src', new RegExp('audio/skills/listen-step-' + n + '\\.mp3'));
      const L = await page.evaluate(id => TA_SKILLS.steps.find(s => s.id === id).listening, id);
      await answerAll(page, L);
      await page.getByRole('button', { name: /Submit/ }).click();
      await expect(page.locator('.sk-score'), id).toContainText(L.questions.length + ' / ' + L.questions.length);

      await page.goto('/skill.html?s=reading&st=' + id + '&preview=1');
      const R = await page.evaluate(id => TA_SKILLS.steps.find(s => s.id === id).reading, id);
      const rows = page.locator('.sk-q');
      // the Reading Journey: odd steps True/False + questions, even steps True/False + gaps (teacher, 2026-11-09)
      const stepNo = Number(id.slice(1));
      await expect(rows).toHaveCount(10);
      await expect(page.locator('.sk-sub')).toHaveText(['True or False?', stepNo % 2 ? 'Answer the questions.' : 'Complete the sentences with a word from the text.']);
      for (let i = 0; i < 10; i++) {
        const q = R.questions[i];
        if (q.type === 'tf') await rows.nth(i).locator('.sk-opt', { hasText: q.a[0] }).first().click();
        else await rows.nth(i).locator('input').fill(q.type === 'gap' ? q.a[0] : 'It is ' + q.keys[0]);
      }
      await page.getByRole('button', { name: /Submit/ }).click();
      await expect(page.locator('.sk-score'), id).toContainText('10 / 10');
    }
    expect(await page.evaluate(() => window.__writes ? window.__writes.length : 0)).toBe(0);
  });

  test('sending fails → Send again', async ({ page, context }) => {
    await prepare(context);
    await start(page, '/skill.html?s=listening&st=e1&c=ABC123');
    await page.locator('.sk-q').first().getByRole('button', { name: 'By train' }).click();
    await page.evaluate(() => { window.__failWrites = 3; });   // the 3 automatic tries fail
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-send')).toContainText('Not sent yet — press Send again', { timeout: 10000 });
    await expect(page.locator('.sk-q').first().locator('.sk-opt.on')).toContainText('By train');
    expect(await page.evaluate(() => window.__writes.length)).toBe(0);
    await page.getByRole('button', { name: /Send again/ }).click();
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ code: 'ABC123', correct: 1, total: 16 });
  });

  test('offline: the write waits, the student sees Send again, and only one record is ever saved', async ({ page, context }) => {
    await prepare(context, { rules: true });   // like the real rules: a record can't be changed once it's there
    await start(page, '/skill.html?s=listening&st=e1&c=ABC123');
    await page.locator('.sk-q').first().getByRole('button', { name: 'By train' }).click();
    await page.evaluate(() => { window.__skSendTimeoutMs = 300; window.__holdWrites = true; });
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-send')).toContainText('Sending');
    await expect(page.locator('.sk-send')).toContainText('Not sent yet — press Send again', { timeout: 8000 });
    // the waiting writes arrive late (back online), then the student presses Send again
    await page.evaluate(() => window.__releaseWrites());
    await page.getByRole('button', { name: /Send again/ }).click();
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    const docs = await page.evaluate(() => window.__fakeDocs.filter(d => d.code === 'ABC123' && d.type === 'Listening course'));
    expect(docs).toHaveLength(1);
    expect(docs[0].__id).toMatch(/^sk_ABC123_10001_\d+$/);
    expect(docs[0]).toMatchObject({ correct: 1, total: 16, name: 'Test Student' });
  });

  test('a link without its 6-character code never reaches the start card', async ({ page, context }) => {
    await prepare(context);
    for (const url of ['/skill.html?s=listening&st=e1', '/skill.html?s=reading&st=e1&c=AB12', '/skill.html?s=writing&st=e1&c=ABCDEFG']) {
      await page.goto(url);
      await expect(page.locator('body')).toContainText('This link is missing its code — ask your teacher for the link again.');
      await expect(page.locator('#studentNameInput')).toHaveCount(0);
    }
  });

  test('unknown step', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=dance&lv=99');
    await expect(page.locator('body')).toContainText("This step doesn't exist");
    await expect(page.locator('a[href="index.html"]')).toBeVisible();
    for (const url of ['/skill.html?s=listening&lv=99&c=ABC123', '/skill.html?s=listening&st=e99&c=ABC123', '/skill.html?s=listening&st=x1&lv=1&c=ABC123']) {
      await page.goto(url);
      await expect(page.locator('body')).toContainText("This step doesn't exist");
    }
    // (a step without a part says "Coming soon" — since the Listening Journey, 2026-11-10, every step has all four)
  });

  test('an old link (lv=3) opens Step 13, the same as st=e3: "Step 13" on the chip, the start card and the tab', async ({ page, context }) => {
    await prepare(context);
    for (const url of ['/skill.html?s=reading&lv=3&c=RDG456', '/skill.html?s=reading&st=e3&c=RDG456']) {
      await page.goto(url);
      await expect(page.locator('.ta-login-type')).toHaveText('Reading · Step 13');
      await expect(page).toHaveTitle('Reading · Step 13 — Loom');
      await page.locator('#studentNameInput').fill('Test Student');
      await page.locator('#skIdInput').fill('10001');
      await page.getByRole('button', { name: /Start/ }).click();
      await expect(page.locator('.sk-head')).toContainText('Step 13 · Jobs & Careers');
      await expect(page.locator('.sk-text-card h2')).toContainText(await page.evaluate(() => TA_SKILLS.steps.find(s => s.id === 'e3').reading.title));
    }
    await expect(page.locator('body')).not.toContainText(/Level \d/);
  });

  test('reading: True/False questions (tf) and a 10-question reading are marked, analysed and banded', async ({ page, context }) => {
    // a test-only step: b2 gets a small reading with 5 True/False and 5 a/b/c questions
    await context.route('**/js/skills-data.js*', async route => {
      const res = await route.fetch();
      const body = (await res.text()) + `
TA_SKILLS.steps[1].reading = { title: 'Tom and his cat', text: 'Tom is ten. He has got a cat. The cat is black. It likes milk. Tom lives in York. He goes to school by bus.',
  questions: [
    { type: 'tf', q: 'Tom is ten.', a: ['True'], line: 0 },
    { type: 'tf', q: 'Tom has got a dog.', a: ['False'], line: 1 },
    { type: 'tf', q: 'The cat is white.', a: ['False'], line: 2 },
    { type: 'tf', q: 'The cat likes milk.', a: ['True'], line: 3 },
    { type: 'tf', q: 'Tom walks to school.', a: ['False'], line: 5 },
    { type: 'choose', q: 'Tom lives in …', opts: ['London', 'York', 'Bath'], a: ['York'], line: 4 },
    { type: 'choose', q: 'The cat is …', opts: ['black', 'grey', 'brown'], a: ['black'], line: 2 },
    { type: 'choose', q: 'Tom goes to school by …', opts: ['car', 'bike', 'bus'], a: ['bus'], line: 5 },
    { type: 'choose', q: 'Tom has got a …', opts: ['cat', 'dog', 'fish'], a: ['cat'], line: 1 },
    { type: 'choose', q: 'Tom is …', opts: ['eight', 'nine', 'ten'], a: ['ten'], line: 0 }
  ],
  words: [{ w: 'cat', emoji: '🐱', m: 'a small animal', ex: 'He has got a cat.' }] };`;
      await route.fulfill({ response: res, body });
    });
    await prepare(context);
    await start(page, '/skill.html?s=reading&st=b2&c=RDG456');
    await expect(page.locator('.sk-head')).toContainText('Step 2 · Family');
    await expect(page.locator('.sk-intro').first()).toContainText('answer the 10 questions');
    await expect(page.locator('.sk-sub')).toHaveText(['True or False?', 'Choose a, b or c.']);
    const rows = page.locator('.sk-q');
    await expect(rows).toHaveCount(10);
    await expect(rows.nth(0).locator('.sk-opt')).toHaveText(['True', 'False']);
    const R = await page.evaluate(() => TA_SKILLS.steps[1].reading);
    for (let i = 0; i < 10; i++) {
      const q = R.questions[i], wrong = i === 1 || i === 7;
      const opts = q.type === 'tf' ? ['True', 'False'] : q.opts;
      await rows.nth(i).getByRole('button', { name: wrong ? opts.find(o => o !== q.a[0]) : q.a[0], exact: false }).first().click();
    }
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-q.right')).toHaveCount(8);
    await expect(page.locator('.sk-q.wrong')).toHaveCount(2);
    await expect(rows.nth(1).locator('.sk-opt.is-answer')).toHaveText('False');
    await expect(page.locator('.sk-score')).toContainText('8 / 10');
    await page.getByRole('button', { name: 'Analyze >' }).click();
    await expect(page.locator('.sk-sent.hl')).toHaveCount(6);
    await expect(page.locator('.sk-sent.hl[data-line="5"] .sk-qno')).toHaveText(['Q5', 'Q8']);
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ code: 'RDG456', type: 'Reading course', step: 'b2', stepNo: 2, title: 'Step 2 · Family — Reading', correct: 8, total: 10, score: 80 });
    expect(recs[0].band).toBe(await page.evaluate(() => skBand(8, 10)));
    expect(recs[0].level).toBeUndefined();
  });

  test('marking ignores case, spaces and a final full stop; phone numbers compare digits', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&st=e1&preview=1');
    const r = await page.evaluate(() => [
      skMark('THOMPSON.', ['Thompson']), skMark('  big   supermarket ', ['supermarket', 'big supermarket']),
      skMark('07700 900123', ['07700 900 123']), skMark('07700-900-123', ['07700 900 123']), skMark('07700 900124', ['07700 900 123']),
      skMark('Kingston', ['Kingsley']), skMark('', ['3']), skMark('three', ['3', 'three']), skMark('Lucy’s dog', ["Lucy's dog"]),
      skMark('1a2', ['12']), skMark('no 12', ['12']), skMark('+12', ['12']), skMark('7.30', ['730', '7.30']), skMark('room 214', ['214'])]);
    expect(r).toEqual([true, true, true, true, false, false, false, true, true, false, false, true, true, false]);
  });


  test('works on a phone without sideways scrolling', async ({ page, context }) => {
    await prepare(context);
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/skill.html?s=reading&st=e1&preview=1');
    await page.getByRole('button', { name: /Submit/ }).click();
    await page.getByRole('button', { name: 'Analyze >' }).click();
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(w).toBeLessThanOrEqual(390);
  });
});

test.describe('writing', () => {
  // 45 words, with "good", "very big" and "like" from the better-words list
  const TEXT = 'Hello! My name is Anna and I am fourteen years old. I live in a very big city with my family. ' +
    'I have got one brother and he is good at football. In my free time I like reading books and swimming with my friends.';
  // a stand-in for the AI helper's waiting list (no real network in the tests)
  async function mockGrammar(context) {
    await context.route('https://loom-ai.toxiraxii010.workers.dev/**', route => route.fulfill({ status: 200, contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }, body: JSON.stringify({ queued: true }) }));
  }

  test('writing: time runs out', async ({ page, context }) => {
    await prepare(context);
    await mockGrammar(context);
    await page.addInitScript(() => { window.__skFast = 1; });
    await start(page, '/skill.html?s=writing&st=b1&c=WRT789');
    await expect(page.locator('.sk-timer')).toContainText('15:00');
    await expect(page.locator('.sk-send')).toContainText('Saved ✅', { timeout: 30000 });
    await expect(page.locator('body')).toContainText("Time's up");
    await expect(page.locator('#skWriteBox')).toHaveJSProperty('readOnly', true);
    await page.waitForTimeout(1500);
    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ words: 0, text: '', skill: 'writing' });
    expect(recs[0].band).toBeUndefined();
  });

  test('writing: a reload keeps the text and the clock (phones reload background tabs); a sent writing clears it', async ({ page, context }) => {
    await prepare(context);
    await mockGrammar(context);
    await page.addInitScript(() => { window.__skFast = 1; });   // a minute lasts a second: 12 minutes = 12 s
    page.on('dialog', d => d.accept());
    await start(page, '/skill.html?s=writing&st=b1&c=WRT789');
    await page.locator('#skWriteBox').fill(TEXT);
    const draft = await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skill_draft|WRT789|b1')));
    expect(draft.text).toBe(TEXT);
    expect(typeof draft.startedAt).toBe('number');
    await page.waitForTimeout(3000);
    await page.reload();
    await page.getByRole('button', { name: /Start/ }).click();   // name + ID are remembered
    await expect(page.locator('#skWriteBox')).toHaveValue(TEXT);
    const left = await page.locator('#skTimer b').textContent();
    const mins = Number(left.split(':')[0]);
    expect(mins, 'the clock went on: ' + left).toBeLessThanOrEqual(12);
    expect(mins).toBeGreaterThanOrEqual(1);
    await page.getByRole('button', { name: /Submit my writing/ }).click();
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    expect(await page.evaluate(() => localStorage.getItem('ta_skill_draft|WRT789|b1'))).toBeNull();
    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ text: TEXT, words: 45 });
  });

  test('writing: the time ran out while the page was away → it is sent at once, with the kept text', async ({ page, context }) => {
    await prepare(context, { storage: { 'ta_skill_draft|WRT789|b1': JSON.stringify({ text: 'My name is Anna.', startedAt: Date.now() - 3600000, id: '10001' }) } });
    await mockGrammar(context);
    await start(page, '/skill.html?s=writing&st=b1&c=WRT789');
    await expect(page.locator('body')).toContainText("Time's up");
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ text: 'My name is Anna.', words: 4 });
    expect(await page.evaluate(() => localStorage.getItem('ta_skill_draft|WRT789|b1'))).toBeNull();
  });

  test('writing: another student on the same device does not get the kept text; a preview keeps nothing', async ({ page, context }) => {
    await prepare(context, { storage: { 'ta_skill_draft|WRT789|b1': JSON.stringify({ text: 'Not mine.', startedAt: Date.now(), id: '99999' }) } });
    await mockGrammar(context);
    await start(page, '/skill.html?s=writing&st=b1&c=WRT789');
    await expect(page.locator('#skWriteBox')).toHaveValue('');
    await expect(page.locator('#skTimer')).toContainText(/15:00|14:5\d/);   // a fresh clock (15 minutes since the Writing Journey)
    await page.goto('/skill.html?s=writing&st=b1&preview=1');
    await page.locator('#skWriteBox').fill(TEXT);
    expect(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('ta_skill_draft') && !k.includes('WRT789')))).toEqual([]);
  });

  test('writing: opened from an old lv= link, a writing kept under the old key (…|<level number>) comes back and moves to the step id key', async ({ page, context }) => {
    await prepare(context, { storage: { 'ta_skill_draft|WRT789|1': JSON.stringify({ text: 'My old text.', startedAt: Date.now() - 60000, id: '10001' }) } });
    await mockGrammar(context);
    await start(page, '/skill.html?s=writing&lv=1&c=WRT789');
    await expect(page.locator('#skWriteBox')).toHaveValue('My old text.');
    expect(await page.evaluate(() => [localStorage.getItem('ta_skill_draft|WRT789|1'), JSON.parse(localStorage.getItem('ta_skill_draft|WRT789|e1') || 'null')]))
      .toEqual([null, expect.objectContaining({ text: 'My old text.' })]);
  });

  test('writing: preview sends nothing; a phone has no sideways scrolling', async ({ page, context }) => {
    await prepare(context);
    await mockGrammar(context);
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/skill.html?s=writing&st=b1&preview=1');
    await expect(page.locator('#studentNameInput')).toHaveCount(0);
    await page.locator('#skWriteBox').fill(TEXT);
    await page.getByRole('button', { name: /Submit my writing/ }).click();
    await expect(page.locator('.sk-sent-card')).toHaveCount(0);
    await expect(page.locator('.sk-send')).toContainText('Preview');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    expect(await page.evaluate(() => window.__writes ? window.__writes.length : 0)).toBe(0);
  });
});

test.describe('speaking', () => {
  test('speaking: words → questions → Part 2, nothing sent, no ID', async ({ page, context }) => {
    await prepare(context);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => { window.__skFast = 1; });
    await page.goto('/skill.html?s=speaking&st=b1');
    await expect(page.locator('#studentNameInput, #skIdInput')).toHaveCount(0);
    await expect(page.locator('.sk-steps')).toContainText('Words');
    const n = await page.locator('.sk-word').count();
    expect(n).toBeGreaterThanOrEqual(8);
    expect(n).toBeLessThanOrEqual(10);
    await page.getByRole('button', { name: /Next →/ }).click();
    const qs = await page.evaluate(() => TA_SKILLS.steps[0].speaking.questions);
    for (let i = 0; i < qs.length; i++) {
      await expect(page.locator('.sk-sq')).toContainText(qs[i].q);
      await expect(page.locator('.sk-use')).toContainText('Words you can use');
      await expect(page.locator('.sk-use')).toContainText(qs[i].use[0]);
      if (i === 1) {
        await page.getByRole('button', { name: /← Back/ }).click();
        await expect(page.locator('.sk-sq')).toContainText(qs[0].q);
        await page.getByRole('button', { name: /Next →/ }).click();
      }
      await page.getByRole('button', { name: /Next →/ }).click();
    }
    await expect(page.locator('.sk-topic')).toContainText('Talk about your daily routine');
    await expect(page.locator('.sk-points li')).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Get ready (30 s)' })).toBeVisible();
    await page.getByRole('button', { name: 'Start speaking' }).click();
    await expect(page.locator('.sk-speak-timer')).toContainText('0:30', { timeout: 5000 });
    await expect(page.locator('body')).toContainText('Well done!', { timeout: 15000 });
    await page.getByRole('button', { name: 'Start again' }).click();
    await expect(page.getByRole('button', { name: 'Start speaking' })).toBeVisible();
    await page.getByRole('button', { name: 'Get ready (30 s)' }).click();
    await expect(page.getByRole('button', { name: /Stop/ })).toBeVisible();
    await page.getByRole('button', { name: /Stop/ }).click();
    await expect(page.getByRole('button', { name: 'Start speaking' })).toBeVisible();
    expect(await page.evaluate(() => window.__writes ? window.__writes.length : 0)).toBe(0);
    expect(errors).toEqual([]);
  });

  test('speaking: the 🔊 button only shows when the browser can speak; a phone has no sideways scrolling', async ({ page, context }) => {
    await prepare(context);
    await page.setViewportSize({ width: 390, height: 800 });
    await page.addInitScript(() => { try { delete window.speechSynthesis; } catch (e) {} try { Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true }); delete window.speechSynthesis; } catch (e) {} });
    await page.goto('/skill.html?s=speaking&st=b1&preview=1');
    await expect(page.locator('.sk-word').first()).toBeVisible();
    await expect(page.locator('.sk-say')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});


test.describe('course page', () => {
  // The links are absolute on the real site (https); the tests run on http, so pretend.
  const PRETEND_HTTPS = () => { window.skAppUrl = 'https://example.github.io/teachers_assistant/'; };
  const open = async (page, context, opts, group = 'g1') => {
    await prepare(context, opts);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const errors = watchErrors(page);
    await page.goto('/course.html');
    await page.waitForTimeout(1000);
    await hideNotices(page);
    await page.addStyleTag({ content: '#taNoticeStack { display: none !important; }' });   // notes that come later (old files…)
    if (group) await page.locator('.sk-gcard[data-group="' + group + '"] .sk-gcard-open').click();   // the page opens on group cards
    return errors;
  };

  test('a group\'s Journey: 20 steps in order, a plain dot per part (none inside), all open with four parts; Try opens a preview', async ({ page, context }) => {
    test.setTimeout(300000);   // opens 40 preview tabs; some take ~2 s each in headless Chromium
    const errors = await open(page, context);
    await expect(page.locator('.sk-tab[data-tab="journey"]')).toHaveAttribute('aria-selected', 'true');
    const rows = page.locator('.sk-row');
    await expect(rows).toHaveCount(20);
    const nodes = page.locator('.sk-node');
    await expect(nodes).toHaveText([/Step 1\s*Daily Routine/, /Step 2/, /Step 3/, /Step 4/, /Step 5/, /Step 6/, /Step 7/, /Step 8/, /Step 9/, /Step 10\s*Your City/,
      /Step 11\s*Holidays/, /Step 12/, /Step 13/, /Step 14/, /Step 15\s*Transport/, /Step 16\s*Animals & Pets/, /Step 17\s*Health & Lifestyle/, /Step 18\s*Technology/, /Step 19/, /Step 20/]);
    // every step: all four parts (Steps 19–20 since the Listening Journey, 2026-11-10)
    for (let i = 0; i < 20; i++) {
      const parts = ['listening', 'reading', 'writing', 'speaking'];
      await expect(rows.nth(i).locator('.sk-dot')).toHaveCount(parts.length);
      expect(await rows.nth(i).locator('.sk-dot').evaluateAll(d => d.map(x => x.dataset.skill))).toEqual(parts);
      await expect(rows.nth(i).locator('button.sk-node')).toHaveCount(1);
      await expect(rows.nth(i)).not.toContainText('Coming soon');
    }
    // Steps 1–10 have all four parts
    for (let i = 0; i < 10; i++) await expect(rows.nth(i).locator('button.sk-dot')).toHaveCount(4);
    // plain dots: no 🎧📖✍️🗣️ inside (a step's first part isn't always Listening)
    expect(await page.locator('.sk-path .sk-dot').evaluateAll(d => d.map(x => x.textContent).join(''))).not.toMatch(/🎧|📖|✍️|🗣️/);
    // the old skill cards are gone, and nothing on the Course page is a separate results button
    await expect(page.locator('.sk-skill-card, .sk-level-tile')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /View Results|Results table/ })).toHaveCount(0);
    // nothing done yet: Step 1 is the one to teach; a dot's tooltip says why
    await expect(page.locator('.sk-row.focus')).toHaveCount(1);
    await expect(rows.nth(0)).toHaveClass(/focus/);
    await expect(rows.nth(0).locator('.sk-dot[data-skill="writing"]')).toHaveAttribute('title', 'Writing — 0 of 3 students done');
    await expect(rows.nth(10).locator('.sk-dot').first()).toHaveAttribute('title', 'Listening — 0 of 3 students done');
    await expect(rows.nth(10).locator('.sk-dot').nth(3)).toHaveAttribute('title', 'Speaking — Link not sent yet');
    // a step opens its page: four parts with Try and Copy link
    await nodes.nth(10).click();
    await expect(page.locator('.sk-level-head')).toContainText('Step 11 · Holidays');
    await expect(page.locator('.sk-level-head')).toContainText('Elementary');
    const parts = page.locator('.sk-part');
    await expect(parts).toHaveText([/Listening/, /Reading/, /Writing\s*My Last Holiday/, /Speaking\s*Holidays/]);
    await expect(page.locator('.sk-results-empty')).toContainText('No results yet');
    await expect(page.getByRole('button', { name: /View Results|Results table/ })).toHaveCount(0);
    const [popup] = await Promise.all([page.waitForEvent('popup'), parts.nth(0).getByRole('button', { name: '▶️ Try' }).click()]);
    await popup.waitForURL(/skill\.html\?s=listening&st=e1&preview=1/);
    await page.getByRole('button', { name: /^← Target · Journey$/ }).click();
    await expect(page.locator('.sk-row')).toHaveCount(20);
    // Steps 1–10 (beginner) open with all four parts, and each part can be tried
    const beg = await page.evaluate(() => TA_SKILLS.steps.slice(0, 10).map(s => ({ id: s.id, no: s.no, theme: s.theme, w: s.writing.topic, t: s.speaking.topic || s.speaking.part2.topic })));   // the Speaking tile shows its topic (Daily Routine…)
    for (const st of beg) {
      await nodes.nth(st.no - 1).click();
      await expect(page.locator('.sk-level-head')).toContainText('Step ' + st.no + ' · ' + st.theme);
      await expect(page.locator('.sk-level-head')).toContainText('Beginner');
      await expect(page.locator('.sk-part.soon')).toHaveCount(0);
      await expect(page.locator('.sk-part')).toHaveText([/Listening/, /Reading/, new RegExp('Writing\\s*' + st.w), new RegExp('Speaking\\s*' + st.t)]);
      for (const [k, skill] of ['listening', 'reading', 'writing', 'speaking'].entries()) {
        const [pop] = await Promise.all([page.waitForEvent('popup'), page.locator('.sk-part').nth(k).getByRole('button', { name: '▶️ Try' }).click()]);
        await pop.waitForURL(new RegExp('skill\\.html\\?s=' + skill + '&st=' + st.id + '(&|$)'), { waitUntil: 'commit' });
        await pop.close();
      }
      await page.getByRole('button', { name: /^← Target · Journey$/ }).click();
    }
    await nodes.nth(0).click();
    await expect(page.locator('.sk-part[data-skill="writing"]')).toContainText('My Daily Routine');
    expect(await page.evaluate(() => localStorage.getItem('ta_skills_open'))).toBeNull();
    expect(errors).toEqual([]);
  });

  test('Copy link only keeps a code per step + part + group (no My Exercises item); Speaking keeps when it was sent, and its dot turns done', async ({ page, context }) => {
    const errors = await open(page, context);
    await page.evaluate(PRETEND_HTTPS);
    await page.locator('.sk-node[data-step="e1"]').click();
    const part = page.locator('.sk-part[data-skill="listening"]');
    const before = await page.evaluate(() => JSON.stringify(getRecentExercises()));
    const group = await page.evaluate(() => getStudentGroups().find(g => g.id === skGroupId()));
    await part.getByRole('button', { name: '🔗 Copy link for ' + group.name }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/^https:\/\/example\.github\.io\/teachers_assistant\/skill\.html\?s=listening&st=e1&c=[A-Z0-9]{6}$/);
    const first = await page.evaluate(() => navigator.clipboard.readText());
    const code = first.split('&c=')[1];
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skills_links')))).toEqual({ [group.id + '|listening|e1']: { code, sentAt: expect.any(String) } });
    expect(await page.evaluate(() => JSON.stringify(getRecentExercises()))).toBe(before);
    await page.evaluate(() => navigator.clipboard.writeText(''));
    await part.getByRole('button', { name: /Copy link for/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(first);
    expect(await page.evaluate(() => JSON.stringify(getRecentExercises()))).toBe(before);
    expect(await page.evaluate(() => (window.__writes || []).filter(w => w.type === 'TA_SYNC:PLAY').length)).toBe(0);
    // the group's list goes online with the link, the IDs scrambled (2026-11-09: only the group's students can start)
    await expect.poll(() => page.evaluate(c => (window.__writes || []).filter(w => w.type === 'TA_SYNC:CLASS' && w.id === 'class-' + c).length, code)).toBeGreaterThan(0);
    const list = await page.evaluate(async c => { const w = (window.__writes || []).filter(x => x.id === 'class-' + c).pop();
      return { w, hash: await skClassHash(c, '10001') }; }, code);
    expect(list.w).toMatchObject({ code: 'TAUSER', title: code });
    expect(list.hash).toMatch(/^[0-9a-f]{24}$/);
    expect(list.w.prev).toBeUndefined();   // nothing was sent before it
    // the next part (Reading) knows Listening comes before it (2026-11-12: one after another)
    await page.locator('.sk-part[data-skill="reading"]').getByRole('button', { name: /Copy link for/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/s=reading&st=e1&c=/);
    const rcode = (await page.evaluate(() => navigator.clipboard.readText())).split('&c=')[1];
    await expect.poll(() => page.evaluate(c => { const d = (window.__fakeDocs || []).find(x => x.__id === 'class-' + c); return d && d.prev; }, rcode))
      .toBe(JSON.stringify({ skill: 'listening', stepNo: 11, codes: [code] }));
    await page.evaluate(() => navigator.clipboard.writeText(''));
    // a copied link alone doesn't make Listening done (nobody has done it)
    await expect(part.locator('.sk-part-state')).toHaveText('⏳ 0 of 3 students done');
    // the new code's results are loaded, though no My Exercises item has it (firebase.js reads the codes from ta_skills_links)
    await page.evaluate(c => window.__studentSubmits({ v: 1, code: c, type: 'Listening course', skill: 'listening', step: 'e1', stepNo: 11, title: 'Step 11',
      name: 'Alice Test', studentId: '10001', correct: 9, total: 10, score: 90, answers: [], timeSeconds: 300, timeDisplay: '05:00', date: new Date().toISOString() }), code);
    await expect(part.locator('.sk-part-state')).toHaveText('⏳ 1 of 3 students done', { timeout: 10000 });
    // after a reload the same link comes back
    await page.reload();
    await page.waitForTimeout(800);
    await page.evaluate(PRETEND_HTTPS);
    await page.locator('.sk-gcard[data-group="g1"] .sk-gcard-open').click();
    await page.locator('.sk-node[data-step="e1"]').click();
    await page.evaluate(() => navigator.clipboard.writeText(''));
    await page.locator('.sk-part[data-skill="listening"]').getByRole('button', { name: /Copy link for/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(first);
    // Speaking: just the link — and its dot is done ("Link sent …")
    const sp = page.locator('.sk-part[data-skill="speaking"]');
    await expect(sp.locator('.sk-part-state')).toHaveText('⏳ Link not sent yet');
    await sp.getByRole('button', { name: /Copy link for/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('https://example.github.io/teachers_assistant/skill.html?s=speaking&st=e1');
    expect(await page.evaluate(() => JSON.stringify(getRecentExercises()))).toBe(before);
    const links = await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skills_links')));
    expect(Object.keys(links[group.id + '|speaking|e1'])).toEqual(['sentAt']);
    await expect(sp.locator('.sk-part-state')).toHaveText(/^✅ Link sent \d{1,2} [A-Z][a-z]{2}$/);
    // copying it again keeps the first date
    const at = links[group.id + '|speaking|e1'].sentAt;
    await sp.getByRole('button', { name: /Copy link for/ }).click();
    expect(await page.evaluate(k => JSON.parse(localStorage.getItem('ta_skills_links'))[k].sentAt, group.id + '|speaking|e1')).toBe(at);
    await page.getByRole('button', { name: /Journey$/ }).click();
    const dot = page.locator('.sk-row').nth(10).locator('.sk-dot[data-skill="speaking"]');
    await expect(dot).toHaveClass(/done/);
    await expect(dot).toHaveAttribute('title', /^Speaking — Link sent /);
    expect(errors).toEqual([]);
  });

  test('old ta_skills_links keys ("g1|reading|1" = Step 11) keep their code: the same link, and the next save writes the new key', async ({ page, context }) => {
    const errors = await open(page, context, { storage: { ta_course_group: 'g1', ta_skills_links: JSON.stringify({
      'g1|reading|1': { uid: 'skold', code: 'RDG777' }, 'g1|speaking|1': { sentAt: '2026-11-04T10:00:00.000Z' }, 'g1|writing|2': 'gone-uid' }) } });
    await page.evaluate(PRETEND_HTTPS);
    // read in the new form at once
    expect(await page.evaluate(() => Object.keys(taSkillsLinks()).sort())).toEqual(['g1|reading|e1', 'g1|speaking|e1', 'g1|writing|e2']);
    expect(await page.evaluate(() => [taSkillStepId(3), taSkillStepId('e3'), taSkillStepId('b10'), taSkillStepId('x')]))
      .toEqual(['e3', 'e3', 'b10', '']);
    // the old Speaking key makes Step 11's dot done
    await expect(page.locator('.sk-row').nth(10).locator('.sk-dot[data-skill="speaking"]')).toHaveClass(/done/);
    await page.locator('.sk-node[data-step="e1"]').click();
    await page.locator('.sk-part[data-skill="reading"]').getByRole('button', { name: /Copy link for/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('https://example.github.io/teachers_assistant/skill.html?s=reading&st=e1&c=RDG777');
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skills_links')));
    expect(stored).toEqual({ 'g1|reading|e1': { uid: 'skold', code: 'RDG777' }, 'g1|speaking|e1': { sentAt: '2026-11-04T10:00:00.000Z' }, 'g1|writing|e2': 'gone-uid' });
    expect(await page.evaluate(() => getRecentExercises().filter(e => / course$/.test(e.typeLabel)).length)).toBe(0);
    expect(errors).toEqual([]);
  });

  test('the clipboard refuses → the link shows in a window titled with the group\'s name as typed ("Kids & Teens")', async ({ page, context }) => {
    const errors = await open(page, context, { storage: { ta_student_groups: JSON.stringify([{ id: 'g1', name: 'Kids & Teens' }]) } });
    await page.evaluate(PRETEND_HTTPS);
    await page.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('blocked')); });
    await page.locator('.sk-node[data-step="e1"]').click();
    await page.locator('.sk-part[data-skill="listening"]').getByRole('button', { name: '🔗 Copy link for Kids & Teens' }).click();
    await expect(page.locator('.ta-modal .points-modal-title')).toHaveText('🔗 The link for Kids & Teens');
    await expect(page.locator('.ta-modal input')).toHaveValue(/skill\.html\?s=listening&st=e1&c=[A-Z0-9]{6}$/);
    expect(errors).toEqual([]);
  });

  test('results arriving while the Course page is hidden don\'t redraw it; each drawing reads the kept results once', async ({ page, context }) => {
    const errors = await open(page, context);
    for (const level of [0, 1]) {
      if (level) await page.locator('.sk-node[data-step="e1"]').click();
      const r = await page.evaluate(() => {
        let draws = 0, reads = 0;
        const realRender = window.renderCourse, realRead = window.getStoredResults;
        window.renderCourse = function () { draws++; return realRender.apply(this, arguments); };
        window.getStoredResults = function () { reads++; return realRead.apply(this, arguments); };
        const wrap = document.getElementById('courseWrap');
        wrap.style.display = 'none';
        window.taCourseResultsChanged();
        const hidden = draws;
        wrap.style.display = '';
        reads = 0;
        window.taCourseResultsChanged();
        const shown = draws - hidden;
        window.renderCourse = realRender; window.getStoredResults = realRead;
        return { hidden, shown, reads };
      });
      expect(r.hidden).toBe(0);
      expect(r.shown).toBe(1);
      expect(r.reads).toBeLessThanOrEqual(level ? 2 : 1);
    }
    expect(errors).toEqual([]);
  });

  test('without groups the Course page asks for one; on a phone nothing scrolls sideways', async ({ page, context }) => {
    const errors = await open(page, context, { storage: { ta_student_groups: '[]' } }, null);
    await page.setViewportSize({ width: 390, height: 800 });
    await expect(page.locator('.sk-gcard')).toHaveCount(0);
    await expect(page.locator('#courseWrap')).toContainText('Add a group on the Students page');
    await expect(page.getByRole('button', { name: /Copy link for/ })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.getByRole('button', { name: '🧑‍🎓 Open Students' }).click();
    await page.waitForURL(/students\.html/);
    expect(errors).toEqual([]);
  });

  test('My Exercises hides the "… course" items made before (not deleted): no card, no type chip', async ({ page, context }) => {
    const old = { title: 'Level 1 · Meeting people — Listening (Target)', typeLabel: 'Listening course', code: 'LSN123', uid: 'skold1', groupId: 'g1',
      contentSummary: 'Level 1 · Listening', date: new Date().toISOString(), disabled: false };
    const test1 = { title: 'A test', typeLabel: 'Test', code: 'TST123', uid: 'tst1', groupId: 'g1', contentSummary: 'Test', date: new Date().toISOString(), disabled: false };
    const spell = Object.assign({}, test1, { title: 'A spelling', typeLabel: 'Spelling', code: 'SPL123', uid: 'spl1' });
    await prepare(context, { storage: { ta_recent_exercises: JSON.stringify([old, test1, spell]), ta_skills_links: JSON.stringify({ 'g1|listening|1': 'skold1' }) } });
    const errors = watchErrors(page);
    await page.goto('/my-exercises.html');
    await page.waitForTimeout(1000);
    await hideNotices(page);
    await expect(page.locator('.myex-card')).toHaveCount(2);
    await expect(page.locator('.myex-card', { hasText: 'Meeting people' })).toHaveCount(0);
    await expect(page.locator('#myexTypeChips')).not.toContainText('course');
    await expect(page.locator('#myexCount')).toHaveText('2 exercises');
    expect(await page.evaluate(() => getRecentExercises().map(e => e.uid))).toEqual(['skold1', 'tst1', 'spl1']);
    // nor in the quick search (🔍) or a lesson plan's exercise list
    expect(await page.evaluate(() => taQuickSearchItems().filter(i => i.icon === '📁' && i.mine).map(i => i.label))).toEqual(['A test', 'A spelling']);
    expect(await page.evaluate(() => taQuickSearchItems().some(i => i.kind === 'Section' && i.label === 'Course'))).toBe(true);
    expect(await page.evaluate(() => {
      renderLessonPlanModalBody({ plan: { notes: '', exerciseUids: [], materialIds: [] } });
      return [...document.querySelectorAll('#lessonPlanModalBody .lp-exercise-check')].map(x => x.value);
    })).toEqual(['tst1', 'spl1']);
    // its link (found through ta_skills_links) is the step's new link
    expect(await page.evaluate(() => { window.skAppUrl = 'https://x/'; return taSkillItemLink(getRecentExercises()[0]); })).toBe('https://x/skill.html?s=listening&st=e1&c=LSN123');
    // the ⋯ menu of a visible card still opens its own item
    await page.locator('.myex-card', { hasText: 'A spelling' }).locator('.myex-more').click();
    await expect(page.locator('#myexMenu')).toContainText('Spelling');
    expect(errors).toEqual([]);
  });

  // Made-up groups for the group cards: Target (Beginner, did Step 1's Writing), Apex (Elementary, Steps 11–12 sent), Nexus (no level, nothing yet)
  const CARD_SEED = () => {
    const groups = [{ id: 'g1', name: 'Target' }, { id: 'g2', name: 'Apex' }, { id: 'g3', name: 'Nexus' }];
    const roster = [
      { name: 'Alice Test', id: '10001', group: 'g1' }, { name: 'Bobur Test', id: '10002', group: 'g1' }, { name: 'Cora Test', id: '10003', group: 'g1' },
      { name: 'Dilya Test', id: '20001', group: 'g2' }, { name: 'Eldor Test', id: '20002', group: 'g2' }, { name: 'Farida Test', id: '20003', group: 'g2' }, { name: 'Gulya Test', id: '20004', group: 'g2' }];
    const sched = [{ id: 's1', day: 1, time: '16:00', group: 'Target', level: 'Beginner' }, { id: 's2', day: 2, time: '17:00', group: 'Apex', level: 'Elementary' }];
    const now = new Date().toISOString();
    const links = { 'g1|writing|b1': { code: 'WRB001' }, 'g1|speaking|b1': { sentAt: now },
      'g2|listening|e1': { code: 'LSE001' }, 'g2|reading|e1': { code: 'RDE001' }, 'g2|writing|e1': { code: 'WRE001' }, 'g2|speaking|e1': { sentAt: now },
      'g2|listening|e2': { code: 'LSE002' }, 'g2|reading|e2': { code: 'RDE002' } };
    let n = 0, t = Date.now() - 3600000;
    const d = x => Object.assign({ __id: 'c' + (++n), v: 1, date: new Date(t += 60000).toISOString(), submittedAt: new Date(t).toISOString(), timeSeconds: 300, timeDisplay: '05:00' }, x);
    const lr = (code, step, id, name, c, tot, skill) => d({ code, type: skill === 'reading' ? 'Reading course' : 'Listening course', skill, step, name, studentId: id, correct: c, total: tot, score: Math.round(c / tot * 100), answers: [] });
    const w = (code, step, id, name, band) => d({ code, type: 'Writing course', skill: 'writing', step, name, studentId: id, text: 'My name is Test.', words: 50, minWords: 40, mistakes: 0, mistakeList: [], grammarChecked: true, band });
    const docs = [
      w('WRB001', 'b1', '10001', 'Alice Test', 7), w('WRB001', 'b1', '10002', 'Bobur Test', 4),
      lr('LSE001', 'e1', '20001', 'Dilya Test', 9, 10, 'listening'), lr('RDE001', 'e1', '20001', 'Dilya Test', 14, 15, 'reading'), w('WRE001', 'e1', '20001', 'Dilya Test', 7),
      lr('LSE001', 'e1', '20002', 'Eldor Test', 5, 10, 'listening'), lr('RDE001', 'e1', '20002', 'Eldor Test', 9, 15, 'reading'), w('WRE001', 'e1', '20002', 'Eldor Test', 6),
      lr('LSE001', 'e1', '20003', 'Farida Test', 3, 10, 'listening'),
      lr('LSE002', 'e2', '20001', 'Dilya Test', 8, 10, 'listening'), lr('RDE002', 'e2', '20001', 'Dilya Test', 12, 15, 'reading'),
      lr('LSE002', 'e2', '20002', 'Eldor Test', 6, 10, 'listening'), lr('RDE002', 'e2', '20002', 'Eldor Test', 10, 15, 'reading')];
    return { docs, storage: { ta_student_groups: JSON.stringify(groups), ta_points_roster: JSON.stringify(roster), ta_weekly_schedule: JSON.stringify(sched),
      ta_skills_links: JSON.stringify(links), ta_recent_exercises: '[]' } };
  };
  const openCards = async (page, context) => {
    const errors = await open(page, context, CARD_SEED(), null);
    await page.waitForFunction(() => (window.__allResults || []).length >= 13, null, { timeout: 10000 });
    await page.evaluate(() => renderCourse());
    return errors;
  };
  const squareStates = card => card.locator('.sk-squares .sk-stepbox').evaluateAll(sq => sq.map(x => (x.className.replace('sk-stepbox', '').trim() || '-')));

  test('the Course page opens on group cards: name, level, a square per step, ⭐ average, 🐢 behind, Teach STEP N', async ({ page, context }) => {
    const errors = await openCards(page, context);
    const cards = page.locator('.sk-gcard');
    await expect(cards).toHaveCount(3);
    await expect(cards.locator('.sk-gcard-open')).toHaveText(['Target', 'Apex', 'Nexus']);
    await expect(cards.locator('.sk-level-chip')).toHaveText(['Beginner', 'Elementary', '—']);
    await expect(page.locator('.sk-row, .sk-tabs')).toHaveCount(0);
    const rest = Array(19).fill('-');   // Steps 19–20 have their Reading (2026-11-09), so they aren't "coming soon" any more
    // Target (Beginner): Step 1's Writing (2 of 3) and Speaking (sent) are done, its Listening and Reading not yet → on Step 1
    expect(await squareStates(cards.nth(0))).toEqual(['on', ...rest]);
    expect(await cards.nth(0).locator('.sk-stepbox').first().getAttribute('title')).toMatch(/^Step 1 · Daily Routine/);
    // Apex (Elementary) starts at Step 11: Steps 1–10 skipped (grey), Step 11 done, on Step 12
    expect(await squareStates(cards.nth(1))).toEqual([...Array(10).fill('skipped'), 'done', 'on', '-', '-', '-', '-', '-', '-', '-', '-']);
    // Nexus (no level = Beginner): on Step 1
    expect(await squareStates(cards.nth(2))).toEqual(['on', ...rest]);
    await expect(cards.nth(1).locator('.sk-stepbox').nth(11)).toHaveAttribute('title', 'Step 12 · Future Plans — teach next');
    // ⭐ the students' average band: Target 7 and 4 → 5.5; Apex 4, 8, 6.5 (Gulya has none) → 6; Nexus none yet
    await expect(cards.locator('.sk-stat').filter({ hasText: '⭐' })).toHaveText([/⭐\s*5\.5/, /⭐\s*6$/, /⭐\s*—/]);
    // 🐢 behind: Target — Bobur (average 4); Apex — Farida (missed 4 parts, average 4) and Gulya (missed 5 parts)
    await expect(cards.locator('.sk-stat').filter({ hasText: /behind/i })).toHaveText([/🐢\s*1\s*behind/, /🐢\s*2\s*behind/, /Nobody behind/]);
    await expect(cards.locator('.sk-teach')).toHaveText(['▶ Teach STEP 1', '▶ Teach STEP 12', '▶ Teach STEP 1']);
    expect(await page.evaluate(() => { const s = skGroupStats(skGroup('g2'), skPathCtx(skGroup('g2'), skSteps().filter(skReady)));
      return s.students.map(x => [x.name, x.avg, x.did, x.missed, x.behind]); }))
      .toEqual([['Farida Test', 4, 0, 4, true], ['Gulya Test', null, 0, 5, true], ['Dilya Test', 8, 1, 0, false], ['Eldor Test', 6.5, 1, 0, false]]);
    // the card (its name) opens the group's Journey; ← All groups comes back
    await cards.nth(2).locator('.sk-gcard-open').click();
    await expect(page.locator('.sk-ghead h3')).toHaveText('Nexus');
    await expect(page.locator('.sk-row')).toHaveCount(20);
    expect(await page.evaluate(() => localStorage.getItem('ta_course_group'))).toBe('g3');
    await page.getByRole('button', { name: '← All groups' }).click();
    await expect(page.locator('.sk-gcard')).toHaveCount(3);
    expect(errors).toEqual([]);
  });

  test('🐢: a part counts as missed only 2 days after its link was first copied (entries without sentAt were sent long ago)', async ({ page, context }) => {
    const errors = await openCards(page, context);
    const missed = () => page.evaluate(() => { const g = skGroup('g2'), s = skGroupStats(g, skPathCtx(g, skSteps().filter(skReady)));
      return s.students.map(x => [x.name, x.missed, x.behind]); });
    const setSent = ms => page.evaluate(ms => {
      const l = taSkillsLinks(), at = new Date(Date.now() - ms).toISOString();
      Object.keys(l).forEach(k => { if (k.startsWith('g2|') && l[k].code) l[k].sentAt = at; });
      taSaveSkillsLinks(l);
    }, ms);
    // sent an hour ago (right after the lesson): nobody has missed anything yet — Farida is still behind for her average 4
    await setSent(3600000);
    expect(await missed()).toEqual([['Farida Test', 0, true], ['Dilya Test', 0, false], ['Eldor Test', 0, false], ['Gulya Test', 0, false]]);
    // sent 3 days ago: missed parts count again
    await setSent(3 * 864e5);
    expect(await missed()).toEqual([['Farida Test', 4, true], ['Gulya Test', 5, true], ['Dilya Test', 0, false], ['Eldor Test', 0, false]]);
    // a new code is kept with the time it was made; an entry already kept keeps its fields
    const made = await page.evaluate(() => { skEnsureCode('reading', 'b2', 'g1'); skEnsureCode('reading', 'e1', 'g2'); const l = taSkillsLinks(); return [l['g1|reading|b2'], l['g2|reading|e1']]; });
    expect(made[0].code).toMatch(/^[A-Z0-9]{6}$/);
    expect(Date.now() - Date.parse(made[0].sentAt)).toBeLessThan(60000);
    expect(made[1].code).toBe('RDE001');
    expect(Date.now() - Date.parse(made[1].sentAt)).toBeGreaterThan(2 * 864e5);
    expect(errors).toEqual([]);
  });

  test('a drawing reads the kept links once (not once per dot); the squares and ⭐/🐢 show their tooltips above the card\'s click area', async ({ page, context }) => {
    const errors = await openCards(page, context);
    const reads = async fn => page.evaluate(fn => {
      let n = 0;
      const real = window.taSkillsLinks;
      window.taSkillsLinks = function () { n++; return real.apply(this, arguments); };
      try { (0, eval)(fn)(); } finally { window.taSkillsLinks = real; }
      return n;
    }, fn);
    expect(await reads('() => renderCourse()')).toBeLessThanOrEqual(1);   // every card
    expect(await reads('() => skOpenGroup("g2")')).toBeLessThanOrEqual(1);   // the Journey
    expect(await reads('() => skShowTab("progress")')).toBeLessThanOrEqual(1);
    expect(await reads('() => skOpenStep("e1")')).toBeLessThanOrEqual(1);   // a step page with its table
    await page.evaluate(() => skOpenGroup(''));
    const card = page.locator('.sk-gcard').nth(1);
    const onTop = loc => loc.evaluate(el => { const r = el.getBoundingClientRect(); return el.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)); });
    expect(await onTop(card.locator('.sk-stepbox').nth(11))).toBe(true);
    expect(await onTop(card.locator('.sk-stat').first())).toBe(true);
    expect(await onTop(card.locator('.sk-stat').nth(1))).toBe(true);
    // the card still opens from its name
    await card.locator('.sk-gcard-open').click();
    await expect(page.locator('.sk-ghead h3')).toHaveText('Apex');
    expect(errors).toEqual([]);
  });

  test('an old numeric key and a new key for the same part: both codes load, and the results of both count', async ({ page, context }) => {
    const seed = CARD_SEED();
    const links = JSON.parse(seed.storage.ta_skills_links);
    links['g2|listening|1'] = { code: 'LSOLD1' };   // the same slot as g2|listening|e1, an older code sent to students
    seed.storage.ta_skills_links = JSON.stringify(links);
    const t = new Date(Date.now() - 1800000).toISOString();
    seed.docs.push({ __id: 'old1', v: 1, code: 'LSOLD1', type: 'Listening course', skill: 'listening', level: 1, name: 'Gulya Test', studentId: '20004',
      correct: 8, total: 10, score: 80, answers: [], date: t, submittedAt: t, timeSeconds: 300, timeDisplay: '05:00' });
    await prepare(context, seed);
    const errors = watchErrors(page);
    await page.goto('/course.html');
    await page.waitForFunction(() => (window.__allResults || []).some(r => r.code === 'LSOLD1'), null, { timeout: 10000 });
    expect(await page.evaluate(() => taSkillsLinks()['g2|listening|e1'])).toEqual({ code: 'LSE001', alsoCodes: ['LSOLD1'] });
    const r = await page.evaluate(() => {
      const g = skGroup('g2'), s = skGroupStats(g, skPathCtx(g, skSteps().filter(skReady)));
      return { gulya: s.students.find(x => x.name === 'Gulya Test').steps.e1, dot: s.steps.find(x => x.st.id === 'e1').dots.find(d => d.skill.key === 'listening').text,
        table: skTableRows('e1', 'g2').map(x => [x.name, !!x.listening]) };
    });
    expect(r.gulya).toEqual({ listening: expect.any(Number) });
    expect(r.dot).toBe('4 of 4 students done');
    expect(r.table).toContainEqual(['Gulya Test', true]);
    // saved in the new form, the old code stays with the entry
    await page.evaluate(() => taSaveSkillsLinks(JSON.parse(localStorage.getItem('ta_skills_links'))));
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skills_links'))['g2|listening|e1'])).toEqual({ code: 'LSE001', alsoCodes: ['LSOLD1'] });
    expect(errors).toEqual([]);
  });

  test('a group\'s level is kept on the group too: with no lesson days it still starts at Step 11; "All ready steps done" while 19–20 are coming', async ({ page, context }) => {
    await prepare(context, { storage: { ta_student_groups: JSON.stringify([{ id: 'g1', name: 'Target' }]), ta_weekly_schedule: '[]' } });
    await page.goto('/students.html');
    await page.waitForTimeout(500);
    const g = await page.evaluate(() => { saveGroup('g1', 'Target', {}, 'Elementary'); return getStudentGroups()[0]; });
    expect(g).toMatchObject({ id: 'g1', name: 'Target', level: 'Elementary' });
    expect(await page.evaluate(() => getWeeklySchedule().length)).toBe(0);
    await page.goto('/course.html');
    await page.waitForTimeout(800);
    await expect(page.locator('.sk-gcard .sk-level-chip')).toHaveText('Elementary');
    await expect(page.locator('.sk-gcard .sk-teach')).toHaveText('▶ Teach STEP 11');
    expect(await page.evaluate(() => skStartNo(skGroup('g1')))).toBe(11);
    // the teacher picks where the group starts on its page ("Starts at Step 4")
    await page.locator('.sk-gcard .sk-gcard-name, .sk-gcard button').first().click();
    await page.locator('.sk-start-pick select').selectOption('4');
    expect(await page.evaluate(() => skStartNo(skGroup('g1')))).toBe(4);
    await page.evaluate(() => skOpenGroup(''));
    await expect(page.locator('.sk-gcard .sk-teach')).toHaveText('▶ Teach STEP 4');
    await page.evaluate(() => { const l = getStudentGroups(); delete l[0].courseStart; saveStudentGroups(l); });
    // the editor shows the group's own level
    await page.goto('/students.html');
    await page.waitForTimeout(500);
    await page.evaluate(() => openGroupEditor('g1'));
    await expect(page.locator('.gsched-level')).toHaveValue('Elementary');
    // the Teach button when no ready step is left
    expect(await page.evaluate(() => [skTeachLabel({ on: null, allDone: false }), skTeachLabel({ on: null, allDone: true })]))
      .toEqual(['🎉 All ready steps done', '🎉 All steps done']);
  });

  test('Teach STEP N opens the Journey at that step, singled out; skipped steps are grey but open; the tabs switch to Progress', async ({ page, context }) => {
    const errors = await openCards(page, context);
    await page.locator('.sk-gcard[data-group="g2"]').getByRole('button', { name: '▶ Teach STEP 12' }).click();
    await expect(page.locator('.sk-ghead h3')).toHaveText('Apex');
    await expect(page.locator('.sk-ghead .sk-level-chip')).toHaveText('Elementary');
    await expect(page.getByRole('tab', { name: '🧭 Journey' })).toHaveAttribute('aria-selected', 'true');
    const focus = page.locator('.sk-row.focus');
    await expect(focus).toHaveCount(1);
    await expect(focus).toHaveAttribute('data-step', 'e2');
    await expect(focus).toContainText('Teach this step');
    await expect(focus.locator('.sk-node')).toBeInViewport();
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
    // the singled-out step is bigger than the others
    const h = await page.evaluate(() => [document.querySelector('.sk-row.focus .sk-node').getBoundingClientRect().height, document.querySelector('.sk-row[data-step="e3"] .sk-node').getBoundingClientRect().height]);
    expect(h[0]).toBeGreaterThan(h[1]);
    // Steps 1–10 are skipped for Apex: grey, Step 1 still opens
    await expect(page.locator('.sk-row.skipped')).toHaveCount(10);
    await expect(page.locator('.sk-row[data-step="b1"]')).toContainText('Skipped');
    await expect(page.locator('.sk-row[data-step="e1"]')).not.toHaveClass(/skipped/);
    // plain dots, with their reason in the tooltip
    await expect(page.locator('.sk-row[data-step="e2"] .sk-dot[data-skill="writing"]')).toHaveAttribute('title', 'Writing — 0 of 4 students done');
    await expect(page.locator('.sk-row[data-step="e2"] .sk-dot.done')).toHaveCount(2);
    // Progress: behind students first (🐢 with the reason), then the rest; a square per step, coloured by the band
    await page.getByRole('tab', { name: '📈 Progress' }).click();
    await expect(page.getByRole('tab', { name: '📈 Progress' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.sk-row')).toHaveCount(0);
    const rows = page.locator('.sk-prow');
    await expect(rows.locator('.sk-prow-text b')).toHaveText(['Farida Test', 'Gulya Test', 'Dilya Test', 'Eldor Test']);
    await expect(rows.nth(0)).toHaveClass(/behind/);
    await expect(rows.nth(0).locator('.sk-turtle')).toHaveAttribute('title', 'Missed 4 parts · Average 4');
    await expect(rows.nth(1).locator('.sk-turtle')).toHaveAttribute('title', 'Missed 5 parts');
    await expect(rows.nth(2).locator('.sk-turtle')).toHaveCount(0);
    await expect(rows.locator('.sk-prow-did')).toHaveText(['0 of 10 steps done', '0 of 10 steps done', '1 of 10 steps done', '1 of 10 steps done']);
    await expect(rows.locator('.sk-prow-avg')).toHaveText(['⭐ 4', '⭐ —', '⭐ 8', '⭐ 6.5']);
    const st = i => squareStates(rows.nth(i));
    const tail = ['-', '-', '-', '-', '-', '-', '-', '-'];
    expect(await st(0)).toEqual([...Array(10).fill('skipped'), 'b-low', '-', ...tail]);
    expect(await st(1)).toEqual([...Array(10).fill('skipped'), '-', '-', ...tail]);
    expect(await st(2)).toEqual([...Array(10).fill('skipped'), 'b-good', 'b-good', ...tail]);
    expect(await st(3)).toEqual([...Array(10).fill('skipped'), 'b-mid', 'b-good', ...tail]);
    await expect(rows.nth(2).locator('.sk-stepbox').nth(10)).toHaveAttribute('title', 'Step 11 — band 8');
    // back to the Journey
    await page.getByRole('tab', { name: '🧭 Journey' }).click();
    await expect(page.locator('.sk-row')).toHaveCount(20);
    // a step opens its page; its back button returns to the Journey
    await page.locator('.sk-node[data-step="b1"]').click();
    await expect(page.locator('.sk-level-head')).toContainText('Step 1 · Daily Routine');
    await page.getByRole('button', { name: /^← Apex · Journey$/ }).click();
    await expect(page.locator('.sk-row')).toHaveCount(20);
    expect(errors).toEqual([]);
  });

  test('on a phone the group cards, the Journey and Progress fit without sideways scrolling', async ({ page, context }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    const errors = await openCards(page, context);
    const fits = async () => expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await expect(page.locator('.sk-gcard')).toHaveCount(3);
    await fits();
    // the cards stack
    const xs = await page.locator('.sk-gcard').evaluateAll(c => c.map(x => Math.round(x.getBoundingClientRect().left)));
    expect(new Set(xs).size).toBe(1);
    await page.locator('.sk-gcard[data-group="g2"] .sk-teach').click();
    await expect(page.locator('.sk-row.focus')).toBeInViewport();
    await fits();
    await page.getByRole('tab', { name: '📈 Progress' }).click();
    await expect(page.locator('.sk-prow')).toHaveCount(4);
    await fits();
    const tabs = await page.locator('.sk-tab').evaluateAll(t => t.map(x => x.getBoundingClientRect().right));
    expect(Math.max(...tabs)).toBeLessThanOrEqual(390);
    expect(errors).toEqual([]);
  });

  test('old Course data is gone', async ({ page, context }) => {
    await open(page, context);
    expect(await page.evaluate(() => [typeof COURSE_BEGINNER, typeof courseTeach, typeof TA_COURSES])).toEqual(['undefined', 'undefined', 'undefined']);
    expect((await page.request.get('/audio/course/c1l1-scripts.json')).status()).toBe(404);
    expect((await page.request.get('/js/course-data.js')).status()).toBe(404);
  });
});

test.describe('results', () => {
  // Made-up results for level 1 of Target (g1): Alice, Bobur and Cora from the test class.
  const items = () => ['listening', 'reading', 'writing'].map((s, i) => ({
    uid: 'sk' + s, code: ['LSN001', 'RDG001', 'WRT001'][i], typeLabel: s[0].toUpperCase() + s.slice(1) + ' course', groupId: 'g1', skill: s, level: 1,
    title: 'Level 1 · Meeting people — ' + s + ' (Target)', contentSummary: 'Level 1', date: new Date().toISOString() }));
  const links = () => JSON.stringify(Object.fromEntries(items().map(it => ['g1|' + it.skill + '|1', { uid: it.uid, code: it.code }])));
  const TEXT = 'My name is Alice and I am fourteen years old. I live in a small town near the sea. I has two brothers and one sister. ' +
    'My favourite colour is blue and I like music very much. On Sunday I play football with my friends in the park. I want to be a doctor.';
  const docs = () => {
    let n = 0, t = Date.now() - 3600000;
    const d = x => Object.assign({ __id: 'sk' + (++n), v: 1, level: 1, date: new Date(t += 60000).toISOString(), submittedAt: new Date(t).toISOString(),
      timeSeconds: 600, timeDisplay: '10:00' }, x);
    const lr = (skill, code, id, name, correct, total) => d({ code, type: skill === 'listening' ? 'Listening course' : 'Reading course', skill, title: 'Level 1',
      name, studentId: id, correct, total, score: Math.round(correct / total * 100), band: null, answers: [] });
    const w = (id, name, band, words, extra) => d(Object.assign({ code: 'WRT001', type: 'Writing course', skill: 'writing', title: 'Level 1 · About me', name, studentId: id,
      text: TEXT, words, minWords: 40, maxWords: 60, mistakes: 1, mistakeList: [{ bad: 'I has', fix: 'I have', message: 'Use "have" with I.' }],
      grammarChecked: true, band, timeSeconds: 754, timeDisplay: '12:34' }, extra || {}));
    return [
      lr('listening', 'LSN001', '10001', 'Alice Test', 10, 10), lr('reading', 'RDG001', '10001', 'Alice Test', 15, 15), w('10001', 'Alice Test', 7, 54),
      lr('listening', 'LSN001', '10002', 'Bobur Test', 6, 10), lr('listening', 'LSN001', '10002', 'Bobur Test', 8, 10),   // best try counts
      lr('reading', 'RDG001', '10002', 'Bobur Test', 12, 15),
      lr('listening', 'LSN001', '10003', 'Cora Test', 8, 10), lr('reading', 'RDG001', '10003', 'Cora Test', 12, 15), w('10003', 'Cora Test', 8, 48),
      lr('listening', 'LSN001', '20001', 'Dilya Test', 10, 10)   // another group: not in Target's table
    ].map(x => { if (x.band === null) delete x.band; return x; });
  };
  const open = async (page, context, url, extra) => {
    await prepare(context, { docs: docs(), storage: Object.assign({ ta_recent_exercises: JSON.stringify(items()), ta_skills_links: links(), ta_course_group: 'g1' }, extra || {}) });
    const errors = watchErrors(page);
    await page.goto(url);
    await page.waitForFunction(() => (window.__allResults || []).length >= 10, null, { timeout: 10000 });
    await page.waitForTimeout(500);
    await hideNotices(page);
    await page.addStyleTag({ content: '#taNoticeStack { display: none !important; }' });
    if (/course\.html/.test(url)) await page.locator('.sk-gcard[data-group="g1"] .sk-gcard-open').click();   // Target's page
    return errors;
  };

  test('writing results: the text, mistakes and a band the teacher can change', async ({ page, context }) => {
    const errors = await open(page, context, '/results.html');
    await page.evaluate(() => showExerciseResults('skwriting'));
    const row = page.locator('.results-table tbody tr', { hasText: 'Alice Test' });
    await expect(row).toContainText('Band 7');
    await row.getByRole('button', { name: '👁 View' }).click();
    const modal = page.locator('.sk-wv');
    await expect(modal).toContainText('Alice Test');
    await expect(modal).toContainText('Level 1 · About me');
    await expect(modal).toContainText('I live in a small town near the sea.');
    await expect(modal.locator('.sk-wv-text mark')).toHaveText('I has');
    await expect(modal).toContainText('54 words');
    await expect(modal).toContainText('12:34');
    await expect(modal).toContainText('I have');
    await expect(modal).toContainText('(old band)');
    const input = modal.getByLabel('Band');
    await expect(input).toHaveValue('7');
    await input.fill('6');
    await modal.getByRole('button', { name: 'Save band' }).click();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skills_marks')))).toEqual({ 'WRT001|10001': 6 });
    expect(await page.evaluate(() => skWritingBandFor(window.__allResults.find(r => r.type === 'Writing course' && r.studentId === '10001')))).toBe(6);
    await expect(page.locator('.sk-wv')).toContainText('(your mark)');
    await expect(row).toContainText('Band 6');
    // a band outside 1–9 isn't saved
    await page.locator('.sk-wv').getByLabel('Band').fill('12');
    await page.locator('.sk-wv').getByRole('button', { name: 'Save band' }).click();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skills_marks')))).toEqual({ 'WRT001|10001': 6 });
    expect(errors).toEqual([]);
  });

  test('the path: a dot is done when half of the group has done it; Speaking when its link was sent; a step with all four shows ✓ (old level-1 keys and results = Step 11)', async ({ page, context }) => {
    const errors = await open(page, context, '/course.html');
    const row1 = page.locator('.sk-row').nth(10);
    const dot = k => row1.locator('.sk-dot[data-skill="' + k + '"]');
    // Target has 3 students: Listening and Reading 3 of 3, Writing 2 of 3 (Alice, Cora) — half or more → done
    await expect(dot('listening')).toHaveClass(/done/);
    await expect(dot('listening')).toHaveAttribute('title', 'Listening — 3 of 3 students done');
    await expect(dot('writing')).toHaveClass(/done/);
    await expect(dot('writing')).toHaveAttribute('title', 'Writing — 2 of 3 students done');
    await expect(dot('speaking')).not.toHaveClass(/done/);
    await expect(row1.locator('.sk-node')).not.toHaveClass(/done/);
    // Dilya (Apex) did Step 11 Listening for Target's code: she doesn't count for Target, and Apex has no links yet
    await page.getByRole('button', { name: '← All groups' }).click();
    await page.locator('.sk-gcard', { hasText: 'Apex' }).locator('.sk-gcard-open').click();
    await expect(page.locator('.sk-row').nth(10).locator('.sk-dot.done')).toHaveCount(0);
    await page.getByRole('button', { name: '← All groups' }).click();
    await page.locator('.sk-gcard', { hasText: 'Target' }).locator('.sk-gcard-open').click();
    // the Speaking link sent (an old-style key) → Step 11 is all done (✓)
    await page.evaluate(() => { const l = JSON.parse(localStorage.getItem('ta_skills_links')); l['g1|speaking|1'] = { sentAt: new Date().toISOString() }; localStorage.setItem('ta_skills_links', JSON.stringify(l)); renderCourse(); });
    await expect(row1.locator('.sk-dot.done')).toHaveCount(4);
    await expect(row1.locator('.sk-node')).toHaveClass(/done/);
    await expect(row1.locator('.sk-node-check')).toHaveText('✓');
    expect(errors).toEqual([]);
  });

  test('the path: fewer than half → not done; a group with no students on the list needs one result', async ({ page, context }) => {
    const docsLess = docs().filter(d => !(d.code === 'WRT001' && d.studentId === '10003'));   // Writing: only Alice → 1 of 3
    await prepare(context, { docs: docsLess, storage: { ta_recent_exercises: JSON.stringify(items()), ta_skills_links: links(), ta_course_group: 'g1' } });
    const errors = watchErrors(page);
    await page.goto('/course.html');
    await page.waitForFunction(() => (window.__allResults || []).length >= 9, null, { timeout: 10000 });
    await page.evaluate(() => skOpenGroup('g1'));
    const dot = k => page.locator('.sk-row').nth(10).locator('.sk-dot[data-skill="' + k + '"]');
    await expect(dot('writing')).not.toHaveClass(/done/);
    await expect(dot('writing')).toHaveAttribute('title', 'Writing — 1 of 3 students done');
    // nobody on the Students list in Target: one result is enough
    await page.evaluate(() => { localStorage.setItem('ta_points_roster', JSON.stringify([])); renderCourse(); });
    await expect(dot('writing')).toHaveClass(/done/);
    await expect(dot('writing')).toHaveAttribute('title', 'Writing — 1 result');
    expect(errors).toEqual([]);
  });

  test('results table: ranking with ties, missing skills, colours, picture', async ({ page, context }) => {
    const errors = await open(page, context, '/course.html', { ta_skills_marks: JSON.stringify({ 'WRT001|10003': 6 }) });
    // Step 12 has no results: a friendly empty state, no picture button
    await page.locator('.sk-node[data-step="e2"]').click();
    await expect(page.locator('.sk-results-empty')).toContainText('No results yet');
    await expect(page.getByRole('button', { name: '⬇️ Download picture' })).toHaveCount(0);
    await page.getByRole('button', { name: /Journey$/ }).click();
    await page.locator('.sk-node[data-step="e1"]').click();
    // the four parts come first and the results below them (teacher, 2026-11-05) — no separate results buttons
    expect(await page.evaluate(() => !!(document.querySelector('.sk-parts').compareDocumentPosition(document.querySelector('.sk-results')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    await expect(page.locator('.sk-part')).toHaveCount(4);
    for (const k of ['listening', 'reading', 'writing', 'speaking']) {
      await expect(page.locator('.sk-part[data-skill="' + k + '"]').getByRole('button', { name: '▶️ Try' })).toBeVisible();
      await expect(page.locator('.sk-part[data-skill="' + k + '"]').getByRole('button', { name: '🔗 Copy link for Target' })).toBeVisible();
    }
    await expect(page.locator('.sk-part[data-skill="writing"] .sk-part-state')).toHaveText('✅ 2 of 3 students done');
    await expect(page.getByRole('button', { name: /View Results|Results table/ })).toHaveCount(0);
    await expect(page.locator('.ta-modal')).toHaveCount(0);
    const table = page.locator('.sk-results .sk-rt');
    await expect(table.locator('.sk-rt-head')).toContainText('Step 11 · Holidays');
    await expect(table.locator('.sk-rt-head')).toContainText('Target');
    await expect(table.locator('.sk-rt-chip')).toHaveText([/Listening/, /Reading/, /Writing/]);
    const rows = table.locator('.sk-rt-row');
    await expect(rows).toHaveCount(3);
    await expect(rows.locator('.sk-rt-name')).toHaveText(['Alice Test', 'Bobur Test', 'Cora Test']);
    await expect(rows.locator('.sk-rt-place')).toHaveText(['🥇', '🥈', '🥉']);
    // Alice: 9 · 9 · 7 → 8.5 C2 (band 8.5 is C2)
    const a = rows.nth(0);
    await expect(a.locator('.sk-rt-cell').nth(0)).toHaveClass(/good/);
    await expect(a.locator('.sk-rt-cell').nth(0)).toContainText('9');
    await expect(a.locator('.sk-rt-cell').nth(0)).toContainText('10 / 10');
    await expect(a.locator('.sk-rt-cell').nth(2)).toContainText('54 words');
    await expect(a.locator('.sk-rt-overall')).toContainText('8.5');
    await expect(a.locator('.sk-rt-overall')).toContainText('C2');
    // Bobur: best listening try 8/10 → 7.5; no writing
    const b = rows.nth(1);
    await expect(b.locator('.sk-rt-cell').nth(0)).toContainText('8 / 10');
    await expect(b.locator('.sk-rt-cell').nth(0)).toContainText('7.5');
    await expect(b.locator('.sk-rt-cell').nth(2)).toHaveText('—');
    await expect(b.locator('.sk-rt-overall')).toContainText('7.5');
    // Cora: the teacher's 6 replaces the estimate 8 → mid (yellow); overall 7 C1
    const c = rows.nth(2);
    await expect(c.locator('.sk-rt-cell').nth(2)).toHaveClass(/mid/);
    await expect(c.locator('.sk-rt-cell').nth(2)).toContainText('6');
    await expect(c.locator('.sk-rt-overall')).toContainText('C1');
    await expect(table.locator('.sk-rt-foot')).toContainText('Group average: 7.5');
    await expect(table.locator('.sk-rt-foot')).toContainText('3 students');
    // ties share a place
    const tie = await page.evaluate(() => {
      localStorage.setItem('ta_skills_marks', JSON.stringify({ 'WRT001|10003': 7.5 }));
      return skTableRows('e1', 'g1').map(r => [r.name, r.place, r.overall, r.writing && r.writing.band]);
    });
    expect(tie).toEqual([['Alice Test', 1, 8.5, 7], ['Bobur Test', 2, 7.5, null], ['Cora Test', 2, 7.5, 7.5]]);
    // the picture
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: '⬇️ Download picture' }).click()]);
    expect(download.suggestedFilename()).toBe('step-11-target.png');
    const buf = require('fs').readFileSync(await download.path());
    expect(buf.length).toBeGreaterThan(5000);
    expect(buf.slice(1, 4).toString()).toBe('PNG');
    // a Writing band opens the student's text, where the band can be changed
    await page.evaluate(() => renderCourse());
    await page.locator('.sk-rt-row', { hasText: 'Alice Test' }).locator('.sk-rt-wbtn').click();
    await expect(page.locator('.sk-wv')).toContainText('I live in a small town near the sea.');
    await page.locator('.sk-wv').getByLabel('Band').fill('8');
    await page.locator('.sk-wv').getByRole('button', { name: 'Save band' }).click();
    await expect(page.locator('.sk-rt-row', { hasText: 'Alice Test' }).locator('.sk-rt-cell').nth(2)).toContainText('8');
    expect(errors).toEqual([]);
  });

  test('Top 5 leaves the Skills course out: open levels sent ahead never count as 0 %, and their results don\'t count either', async ({ page, context }) => {
    const extra = [{ uid: 'tst1', code: 'TST001', typeLabel: 'Test', groupId: 'g1', title: 'A test (Target)', contentSummary: 'Test', date: new Date().toISOString() }];
    await prepare(context, { docs: docs().concat([{ __id: 'tst-c', v: 1, code: 'TST001', type: 'Test', title: 'A test', name: 'Cora Test', studentId: '10003',
      score: 90, correct: 9, total: 10, date: new Date().toISOString(), submittedAt: new Date().toISOString(), timeSeconds: 60, timeDisplay: '01:00' }]),
      storage: { ta_recent_exercises: JSON.stringify(items().concat(extra)), ta_skills_links: links(), ta_course_group: 'g1' } });
    await page.goto('/index.html');
    await page.waitForFunction(() => (window.__allResults || []).length >= 11, null, { timeout: 10000 });
    const r = await page.evaluate(() => ({
      top: getTopActiveStudents(5, 'g1').map(s => ({ name: s.name, pct: Math.round(s.avg), did: s.did, given: s.given })),
      assigned: [...(taAssignedCodesByGroup().g1 || [])]
    }));
    expect(r.assigned).toEqual(['TST001']);
    // Cora: only the test counts (90 %); Alice and Bobur did only course levels → not listed
    expect(r.top).toEqual([{ name: 'Cora Test', pct: 90, did: 1, given: 1 }]);
  });

  test('"Delete all results" hides older course results only: a newer one sent without builtAt still shows', async ({ page, context }) => {
    const errors = await open(page, context, '/results.html', { ta_code_resets: '{}' });
    await page.evaluate(() => setLocalReset('LSN001', new Date(Date.now() - 30 * 60000).toISOString()));   // after every seeded result
    await page.evaluate(() => showExerciseResults('sklistening'));
    await expect(page.locator('.results-table tbody tr')).toHaveCount(0);
    await page.evaluate(() => window.__studentSubmits({ v: 1, code: 'LSN001', type: 'Listening course', skill: 'listening', level: 1, title: 'Level 1',
      name: 'Alice Test', studentId: '10001', correct: 9, total: 10, score: 90, band: 8.5, answers: [], timeSeconds: 300, timeDisplay: '05:00', date: new Date().toISOString() }));
    await expect.poll(async () => { await page.evaluate(() => onResultsCodeInput()); return page.locator('.results-table tbody tr', { hasText: 'Alice Test' }).count(); }).toBe(1);
    expect(errors).toEqual([]);
  });

  test('"Delete all results": Results and the results table agree — a page opened before the reset and sent after it shows in both', async ({ page, context }) => {
    const errors = await open(page, context, '/course.html', { ta_code_resets: '{}' });
    const cut = await page.evaluate(() => { const iso = new Date(Date.now() - 30 * 60000).toISOString(); setLocalReset('LSN001', iso); return iso; });
    const before = new Date(Date.parse(cut) - 10 * 60000).toISOString(), now = new Date().toISOString();
    await page.evaluate(([now]) => window.__studentSubmits({ v: 1, code: 'LSN001', type: 'Listening course', skill: 'listening', level: 1, title: 'Level 1',
      name: 'Alice Test', studentId: '10001', correct: 9, total: 10, score: 90, band: 8.5, answers: [], timeSeconds: 300, timeDisplay: '05:00', date: now, builtAt: now }), [now]);
    // an older page's record (builtAt = when it was opened, before the reset) — hidden in both places
    await page.evaluate(([before, now]) => window.__studentSubmits({ v: 1, code: 'LSN001', type: 'Listening course', skill: 'listening', level: 1, title: 'Level 1',
      name: 'Bobur Test', studentId: '10002', correct: 10, total: 10, score: 100, answers: [], timeSeconds: 300, timeDisplay: '05:00', date: now, builtAt: before }), [before, now]);
    await expect.poll(() => page.evaluate(() => window.__allResults.filter(r => r.code === 'LSN001').length)).toBe(7);
    const r = await page.evaluate(() => ({
      table: skTableRows('e1', 'g1').filter(x => x.listening).map(x => x.name),
      results: collectResults('LSN001').visible.map(x => x.name)
    }));
    expect(r.table).toEqual(['Alice Test']);
    expect(r.results.filter(n => n !== 'Alice Test')).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('a fake result can\'t set any band: Listening/Reading bands come from correct / total, writing bands stay 1–9', async ({ page, context }) => {
    const errors = await open(page, context, '/course.html', { ta_skills_marks: JSON.stringify({ 'WRT001|10003': 42 }) });
    await page.evaluate(() => {
      const base = { v: 1, level: 1, title: 'Level 1', answers: [], timeSeconds: 60, timeDisplay: '01:00', date: new Date().toISOString() };
      window.__studentSubmits(Object.assign({}, base, { code: 'LSN001', type: 'Listening course', skill: 'listening', name: 'Alice Test', studentId: '10001', correct: 2, total: 10, score: 20, band: 99 }));
      window.__studentSubmits(Object.assign({}, base, { code: 'RDG001', type: 'Reading course', skill: 'reading', name: 'Bobur Test', studentId: '10002', correct: 400, total: 15, score: 100, band: 99 }));
      window.__studentSubmits(Object.assign({}, base, { code: 'WRT001', type: 'Writing course', skill: 'writing', name: 'Bobur Test', studentId: '10002', text: 'Hi.', words: 1, band: 99 }));
    });
    await expect.poll(() => page.evaluate(() => window.__allResults.length)).toBeGreaterThanOrEqual(13);
    const r = await page.evaluate(() => {
      const rows = skTableRows('e1', 'g1');
      const row = n => rows.find(x => x.name === n);
      return { all: rows.map(x => [x.listening, x.reading, x.writing, x.overall]).flat().filter(v => v !== null).map(v => typeof v === 'object' ? v.band : v),
        bobR: row('Bobur Test').reading.band, bobW: row('Bobur Test').writing.band, cora: row('Cora Test').writing.band,
        fakeW: skWritingBandFor({ code: 'X', studentId: '1', band: 99 }), lowW: skWritingBandFor({ code: 'X', studentId: '1', band: -3 }) };
    });
    r.all.forEach(b => { expect(b).toBeGreaterThanOrEqual(0); expect(b).toBeLessThanOrEqual(9); });
    expect(r.bobR).toBe(9);          // 400 / 15 is clamped to 15 / 15
    expect(r.bobW).toBe(9);          // band 99 → 9
    expect(r.cora).toBe(9);          // a stored mark of 42 is kept to 9
    expect(r.fakeW).toBe(9);
    expect(r.lowW).toBe(1);
    expect(errors).toEqual([]);
  });

  test('the spreadsheet (CSV) has the band of a writing result', async ({ page, context }) => {
    const errors = await open(page, context, '/results.html');
    await page.evaluate(() => showExerciseResults('skwriting'));
    const [download] = await Promise.all([page.waitForEvent('download'), page.evaluate(() => exportResultsCsv())]);
    const csv = require('fs').readFileSync(await download.path(), 'utf8');
    const alice = csv.split('\r\n').find(l => l.includes('Alice Test'));
    expect(alice).toContain('"Band 7"');
    expect(errors).toEqual([]);
  });

  test('a fake writing result can\'t add attributes: quotes in a mistake are shown as text', async ({ page, context }) => {
    const errors = await open(page, context, '/results.html');
    await page.evaluate(() => window.__studentSubmits({ v: 1, code: 'WRT001', type: 'Writing course', skill: 'writing', level: 1, title: 'Level 1',
      name: 'Bobur Test', studentId: '10002', text: 'I has a cat.', words: 4, minWords: 40, maxWords: 60, mistakes: 1, grammarChecked: true, band: 4,
      mistakeList: [{ bad: 'I has', fix: 'x" onmouseover="alert(1)', message: "It's \"wrong\"" }], timeSeconds: 60, timeDisplay: '01:00', date: new Date().toISOString() }));
    await page.evaluate(() => showExerciseResults('skwriting'));
    const row = page.locator('.results-table tbody tr', { hasText: 'Bobur Test' });
    await expect(row).toHaveCount(1);
    await row.getByRole('button', { name: '👁 View' }).click();
    const mark = page.locator('.sk-wv-text mark');
    await expect(mark).toHaveText('I has');
    expect(await mark.getAttribute('onmouseover')).toBeNull();
    expect(await mark.getAttribute('title')).toBe('→ x" onmouseover="alert(1)');
    expect(await page.locator('.sk-wv [onmouseover]').count()).toBe(0);
    await expect(page.locator('.sk-wv-mistakes')).toContainText('x" onmouseover="alert(1)');
    expect(errors).toEqual([]);
  });

  test('the Course page loads a step\'s results by itself, even when its My Exercises item was deleted', async ({ page, context }) => {
    const errors = await open(page, context, '/course.html', { ta_recent_exercises: JSON.stringify(items().filter(i => i.skill !== 'reading')) });
    expect(await page.evaluate(() => window.__allResults.filter(r => r.code === 'RDG001').length)).toBe(3);
    await page.locator('.sk-node[data-step="e1"]').click();
    await expect(page.locator('.sk-rt-row').first().locator('.sk-rt-cell').nth(1)).toContainText('15 / 15');
    expect(errors).toEqual([]);
  });

  test('the results table fits a phone: it scrolls inside its own box', async ({ page, context }) => {
    const errors = await open(page, context, '/course.html');
    await page.setViewportSize({ width: 390, height: 800 });
    await expect(page.locator('.sk-row')).toHaveCount(20);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.locator('.sk-node[data-step="e1"]').click();
    await expect(page.locator('.sk-rt-row')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    expect(errors).toEqual([]);
  });
});
