// The Skills course (2026-11-04): band rules shared by the student page and Loom.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

test.describe('bands', () => {
  test('listening/reading bands, writing estimate, overall and CEFR follow the rules', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&lv=1&preview=1');
    const r = await page.evaluate(() => ({
      band: [skBand(19, 20), skBand(16, 20), skBand(9, 20), skBand(7, 20), skBand(3, 20), skBand(0, 20), skBand(10, 10), skBand(37, 40), skBand(11, 40)],
      overall: [skOverall([8.5, 8.5, 9, 9]), skOverall([7.5, 9, 9, 8.5]), skOverall([7, null]), skOverall([]), skOverall([7, 7.5])],
      cefr: [skCefr(9), skCefr(8), skCefr(6.5), skCefr(4), skCefr(3), skCefr(2)],
      writing: [skWritingBand(50, 40, 0, true), skWritingBand(20, 40, 0, true), skWritingBand(100, 40, 5, true), skWritingBand(50, 40, 5, true), skWritingBand(0, 40, 0, false), skWritingBand(40, 40, 0, false), skWritingBand(0, 40, 0, true), skWritingBand(1, 40, 0, false)],
      colour: [skBandColour(7), skBandColour(6.5), skBandColour(6), skBandColour(5.5), skBandColour(5), skBandColour(2)],
    }));
    expect(r.band).toEqual([8.5, 7.5, 5.5, 4.5, 3, 0, 9, 8.5, 4]);
    expect(r.overall).toEqual([9, 8.5, 7, null, 7.5]);
    expect(r.cefr).toEqual(['C2', 'C1', 'B2', 'B1', 'A2', 'A1']);
    expect(r.writing).toEqual([9, 7.5, 7.5, 6, 1, 7.5, 1, 4.5]);   // 0 words = band 1
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
      if (x === 'oh' && !(nx in NUM || nx === 'double') && !(w[i - 1] in NUM)) { out.push(x); continue; }
      out.push(x in NUM ? String(NUM[x]) : x);
    }
    return out.join('');
  };
  const sentences = text => text.trim().split(/(?<=[.!?])\s+/);

  test('every level has its theme; Levels 1–5 have full, checked content in all four skills; 6–10 are still to come', async ({ page, context, request }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&lv=1&preview=1');
    const S = await page.evaluate(() => ({ skills: TA_SKILLS, better: TA_BETTER_WORDS }));
    const levels = S.skills.elementary.levels;
    expect(levels.map(l => l.theme)).toEqual(['Meeting people', 'Family & friends', 'My home', 'My day', 'Food & cafés', 'Shopping', 'My town', 'Free time', 'Travel', 'Weather & holidays']);
    expect(levels.map(l => l.no)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    levels.forEach(l => expect(l.emoji).toBeTruthy());
    expect(Object.keys(S.better).length).toBeGreaterThanOrEqual(30);
    ['good', 'nice', 'big', 'small', 'very happy', 'bad', 'like'].forEach(w => expect(S.better[w].length).toBeGreaterThan(0));
    // the teacher (2026-11-04): "finish when level 5 is ready; levels 6–10 are for future"
    const full = levels.filter(l => l.no <= 5);
    full.forEach(l => ['listening', 'reading', 'writing', 'speaking'].forEach(k => expect(l[k], 'level ' + l.no + ' ' + k).toBeTruthy()));
    levels.filter(l => l.no > 5).forEach(l => expect(Object.keys(l).sort(), 'level ' + l.no).toEqual(['emoji', 'no', 'theme']));
    // every listening/reading is its own (no copy of another level)
    expect(new Set(full.map(l => l.listening.src)).size).toBe(5);
    expect(new Set(full.map(l => l.reading.title)).size).toBe(5);
    for (const lv of full) {
      expect(lv.listening.src).toMatch(new RegExp('^audio/skills/elem-' + lv.no + '-listening\\.mp3(\\?v=\\d+)?$'));
      const L = lv.listening;
      expect(L.questions.length).toBe(10);
      expect(L.words.length).toBe(10);
      L.words.forEach(w => { expect(w.w && w.m && w.ex).toBeTruthy(); });
      L.transcript.forEach(t => expect(['Woman', 'Man']).toContain(t.who));
      L.questions.forEach((q, i) => {
        expect(q.a.length).toBeGreaterThan(0);
        const said = norm(L.transcript.filter(t => (t.answers || []).includes(i + 1)).map(t => t.text).join(' '));
        expect(said, `listening question ${i + 1} (${q.a[0]})`).toContain(norm(q.a[0]));
      });
      // the answers come in question order
      const firstLine = L.questions.map((q, i) => L.transcript.findIndex(t => (t.answers || []).includes(i + 1)));
      expect(firstLine).toEqual([...firstLine].sort((a, b) => a - b));
      const res = await request.get('/' + L.src);
      expect(res.status()).toBe(200);
      expect((await res.body()).length).toBeGreaterThan(100000);

      const R = lv.reading;
      const sent = sentences(R.text);
      expect(R.questions.length).toBe(15);
      expect(R.words.length).toBe(10);
      ['tfng', 'gap', 'choose'].forEach(t => expect(R.questions.filter(q => q.type === t).length).toBe(5));
      R.questions.forEach((q, i) => {
        expect(sent[q.line], `reading question ${i + 1}`).toBeTruthy();
        if (q.type === 'gap') expect(sent[q.line].toLowerCase()).toContain(q.a[0].toLowerCase());
        if (q.type === 'tfng') expect(['True', 'False', 'Not given']).toContain(q.a[0]);
        if (q.type === 'choose') { expect(q.opts.length).toBe(3); expect(q.opts).toContain(q.a[0]); }
      });

      const W = lv.writing;
      expect(W.topic).toBeTruthy();
      expect(W.points.length).toBe(3);
      expect(W.minWords).toBeLessThan(W.maxWords);
      expect(W.minutes).toBeGreaterThan(0);

      const P = lv.speaking;
      expect(P.words.length).toBeGreaterThanOrEqual(8);
      expect(P.words.length).toBeLessThanOrEqual(10);
      P.words.forEach(w => expect(w.w && w.emoji && w.ex).toBeTruthy());
      expect(P.questions.length).toBeGreaterThanOrEqual(4);
      expect(P.questions.length).toBeLessThanOrEqual(5);
      expect(P.part2.topic).toBeTruthy();
      expect(P.part2.hints.length).toBe(3);
      expect(P.part2.seconds).toBeGreaterThan(0);
    }
  });

  test('Level 1 is as the teacher planned it (hotel check-in, pen-friend, About me, Talk about yourself)', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&lv=1&preview=1');
    const l1 = await page.evaluate(() => TA_SKILLS.elementary.levels[0]);
    expect(l1).toMatchObject({ no: 1, theme: 'Meeting people', emoji: '👋' });
    expect(l1.listening.src).toMatch(/^audio\/skills\/elem-1-listening\.mp3(\?v=\d+)?$/);
    expect(l1.reading.title).toMatch(/pen-friend/i);
    expect(l1.writing).toMatchObject({ topic: 'About me', minWords: 40, maxWords: 60, minutes: 15 });
    expect(l1.speaking.part2.seconds).toBe(45);
    expect(l1.speaking.part2.topic).toMatch(/yourself/i);
  });

  test('Levels 2–5 are as the spec plans them (themes, tasks, writing words/minutes, Part 2 seconds)', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&lv=1&preview=1');
    const L = await page.evaluate(() => TA_SKILLS.elementary.levels);
    const plan = [
      { no: 2, listen: /sports club/i, read: /Emma's family/, topic: 'My family', min: 40, max: 60, minutes: 15, talk: /family member/i, sec: 45 },
      { no: 3, listen: /room/i, read: /Two homes/, topic: 'My home', min: 40, max: 60, minutes: 15, talk: /your home/i, sec: 45 },
      { no: 4, listen: /doctor/i, read: /nurse/i, topic: 'My weekday', min: 50, max: 70, minutes: 20, talk: /favourite day/i, sec: 60 },
      { no: 5, listen: /party/i, read: /café/i, topic: 'My favourite meal', min: 50, max: 70, minutes: 20, talk: /food you like/i, sec: 60 },
    ];
    const words = t => t.split(/\s+/).filter(Boolean).length;
    let last = words(L[0].reading.text);
    for (const p of plan) {
      const lv = L[p.no - 1];
      expect(lv.listening.title).toMatch(p.listen);
      expect(lv.listening.intro).toMatch(/NO MORE THAN TWO WORDS AND\/OR A NUMBER/);
      expect(lv.reading.title).toMatch(p.read);
      expect(lv.writing).toMatchObject({ topic: p.topic, minWords: p.min, maxWords: p.max, minutes: p.minutes });
      expect(lv.writing.task).toBeTruthy();
      expect(lv.speaking.part2.topic).toMatch(p.talk);
      expect(lv.speaking.part2.seconds).toBe(p.sec);
      lv.speaking.questions.forEach(q => expect(q.use.length).toBeGreaterThan(0));
      // a little longer each level (~170, 190, 210, 230 words)
      const n = words(lv.reading.text);
      expect(n, 'level ' + p.no + ' reading words').toBeGreaterThan(last);
      expect(Math.abs(n - (130 + 20 * p.no)), 'level ' + p.no + ' reading words').toBeLessThanOrEqual(20);
      last = n;
    }
  });

  test('the skills course has no Uzbek names or Uzbek words — only English', async () => {
    const fs = require('fs'), path = require('path');
    const uzbek = /Uzbek|Tashkent|Samarkand|Bukhara|Kamila|Jasur|Bobur|Nodira|Karimov|Aziz|Lola\b|Malika|Rustam|Laylo|Jamol|Bekzod|Sardor|Nilufar|Madina|Timur|Dilnoza|Karim\b|\bAli\b|harf|raqam|unli tovush|telefon|ikki marta/;
    ['js/skills-data.js', 'audio/skills/elementary-scripts.json'].forEach(f => {
      const t = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
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

test.describe('student page', () => {

  test('listening: Submit marks each box, shows 10 words, Analyze highlights the answer lines, one result is sent', async ({ page, context }) => {
    await prepare(context);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await start(page, '/skill.html?s=listening&lv=1&c=ABC123');
    await expect(page.locator('audio')).toHaveAttribute('src', /audio\/skills\/elem-1-listening\.mp3/);
    const given = ['THOMPSON.', 'steven', '214', '07700 900123', '  brighton ', 'three', '7:30', 'Kingston', 'shop', '12'];
    const boxes = page.locator('.sk-q input');
    await expect(boxes).toHaveCount(10);
    for (let i = 0; i < 10; i++) await boxes.nth(i).fill(given[i]);
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-q.right')).toHaveCount(7);
    await expect(page.locator('.sk-q.wrong')).toHaveCount(3);
    await expect(page.locator('.sk-q.wrong').nth(0)).toContainText('Kingsley');
    await expect(page.locator('.sk-q.wrong').nth(1)).toContainText('supermarket');
    await expect(page.locator('.sk-q.wrong').nth(2)).toContainText('11');
    await expect(page.locator('.sk-score')).toContainText('7 / 10');
    await expect(page.locator('.sk-words li')).toHaveCount(10);
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');

    await page.getByRole('button', { name: 'Analyze >' }).click();
    const want = await page.evaluate(() => TA_SKILLS.elementary.levels[0].listening.transcript.filter(t => t.answers.length).length);
    await expect(page.locator('.sk-line.hl')).toHaveCount(want);
    const hl = page.locator('.sk-line.hl');
    for (let i = 0; i < want; i++) await expect(hl.nth(i).locator('.sk-qno')).not.toHaveCount(0);
    await expect(page.locator('.sk-line.hl', { hasText: 'Kingsley Street' }).locator('.sk-qno')).toHaveText(['Q8']);

    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ v: 1, code: 'ABC123', type: 'Listening course', title: 'Level 1 · Meeting people — Listening', level: 1,
      skill: 'listening', name: 'Test Student', studentId: '10001', correct: 7, total: 10, score: 70, band: 6.5 });
    expect(recs[0].answers).toHaveLength(10);
    expect(recs[0].answers[0]).toEqual({ q: 'Surname: _____', given: 'THOMPSON.', right: true });
    expect(recs[0].answers[7].right).toBe(false);
    expect(recs[0].submittedAt).toBeTruthy();
    expect(recs[0].timeDisplay).toMatch(/^\d\d:\d\d$/);
    // builtAt = the Submit time (a page opened before "Delete all results" and sent after it still counts)
    expect(recs[0].builtAt).toBe(recs[0].date);
    // the answers stay on the screen; a second press sends nothing more
    await expect(boxes.nth(0)).toHaveValue('THOMPSON.');
    await expect(page.getByRole('button', { name: /Submit/ })).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('reading: the same with 15 questions', async ({ page, context }) => {
    await prepare(context);
    await start(page, '/skill.html?s=reading&lv=1&c=RDG456');
    const R = await page.evaluate(() => TA_SKILLS.elementary.levels[0].reading);
    await expect(page.locator('.sk-q')).toHaveCount(15);
    await expect(page.locator('.sk-sent')).toHaveCount(R.text.trim().split(/(?<=[.!?])\s+/).length);
    let expectRight = 0;
    for (let i = 0; i < 15; i++) {
      const q = R.questions[i], row = page.locator('.sk-q').nth(i);
      const wrong = i === 0 || i === 5 || i === 10;   // one of each kind wrong
      if (q.type === 'gap') await row.locator('input').fill(wrong ? 'house' : q.a[0].toUpperCase() + ' ');
      else {
        const opts = q.type === 'tfng' ? ['True', 'False', 'Not given'] : q.opts;
        const pick = wrong ? opts.find(o => o !== q.a[0]) : q.a[0];
        await row.getByRole('button', { name: pick, exact: false }).first().click();
      }
      if (!wrong) expectRight++;
    }
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-q.right')).toHaveCount(expectRight);
    await expect(page.locator('.sk-q.wrong')).toHaveCount(15 - expectRight);
    await expect(page.locator('.sk-score')).toContainText(expectRight + ' / 15');
    await expect(page.locator('.sk-words li')).toHaveCount(10);
    await page.getByRole('button', { name: 'Analyze >' }).click();
    const lines = [...new Set(R.questions.map(q => q.line))];
    await expect(page.locator('.sk-sent.hl')).toHaveCount(lines.length);
    await expect(page.locator('.sk-sent.hl').first().locator('.sk-qno')).not.toHaveCount(0);
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ code: 'RDG456', type: 'Reading course', title: 'Level 1 · Meeting people — Reading', skill: 'reading',
      correct: expectRight, total: 15, score: Math.round(expectRight / 15 * 100) });
    expect(recs[0].band).toBe(await page.evaluate(n => skBand(n, 15), expectRight));
  });

  test('preview sends nothing', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&lv=1&preview=1');
    await expect(page.locator('.sk-preview')).toContainText('👀 Preview');
    await expect(page.locator('#studentNameInput')).toHaveCount(0);
    await page.locator('.sk-q input').first().fill('Thompson');
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-q.right')).toHaveCount(1);
    await expect(page.locator('.sk-score')).toContainText('1 / 10');
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => window.__writes ? window.__writes.length : 0)).toBe(0);
  });

  test('sending fails → Send again', async ({ page, context }) => {
    await prepare(context);
    await start(page, '/skill.html?s=listening&lv=1&c=ABC123');
    await page.locator('.sk-q input').first().fill('Thompson');
    await page.evaluate(() => { window.__failWrites = 3; });   // the 3 automatic tries fail
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-send')).toContainText('Not sent yet — press Send again', { timeout: 10000 });
    await expect(page.locator('.sk-q input').first()).toHaveValue('Thompson');
    expect(await page.evaluate(() => window.__writes.length)).toBe(0);
    await page.getByRole('button', { name: /Send again/ }).click();
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ code: 'ABC123', correct: 1, total: 10 });
  });

  test('offline: the write waits, the student sees Send again, and only one record is ever saved', async ({ page, context }) => {
    await prepare(context, { rules: true });   // like the real rules: a record can't be changed once it's there
    await start(page, '/skill.html?s=listening&lv=1&c=ABC123');
    await page.locator('.sk-q input').first().fill('Thompson');
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
    expect(docs[0]).toMatchObject({ correct: 1, total: 10, name: 'Test Student' });
  });

  test('a link without its 6-character code never reaches the start card', async ({ page, context }) => {
    await prepare(context);
    for (const url of ['/skill.html?s=listening&lv=1', '/skill.html?s=reading&lv=1&c=AB12', '/skill.html?s=writing&lv=1&c=ABCDEFG']) {
      await page.goto(url);
      await expect(page.locator('body')).toContainText('This link is missing its code — ask your teacher for the link again.');
      await expect(page.locator('#studentNameInput')).toHaveCount(0);
    }
  });

  test('unknown level', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=dance&lv=99');
    await expect(page.locator('body')).toContainText("This level doesn't exist");
    await expect(page.locator('a[href="index.html"]')).toBeVisible();
    await page.goto('/skill.html?s=listening&lv=99&c=ABC123');
    await expect(page.locator('body')).toContainText("This level doesn't exist");
  });

  test('marking ignores case, spaces and a final full stop; phone numbers compare digits', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&lv=1&preview=1');
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
    await page.goto('/skill.html?s=reading&lv=1&preview=1');
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
  // a stand-in LanguageTool: two mistakes found in whatever text it gets (after prepare(), so this route wins)
  async function mockGrammar(context, { status = 200, calls } = {}) {
    await context.route('**/api.languagetool.org/**', async route => {
      const req = route.request();
      const text = new URLSearchParams(req.postData() || '').get('text') || '';
      if (calls) calls.push({ method: req.method(), lang: new URLSearchParams(req.postData() || '').get('language'), text });
      if (status !== 200) return route.fulfill({ status, contentType: 'text/plain', body: 'Too many requests' });
      const at = (bit) => text.indexOf(bit);
      const matches = [
        { offset: at('have got'), length: 8, message: 'Use "have" here.', replacements: [{ value: 'have' }], context: {} },
        { offset: at('<b>'), length: 3, message: 'A <b> tag & "quotes" must stay text.', replacements: [{ value: '<i>' }], context: {} }
      ].filter(m => m.offset >= 0);
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ matches }) });
    });
  }

  test('writing: counter, check, better words, band', async ({ page, context }) => {
    await prepare(context);
    const calls = [];
    await mockGrammar(context, { calls });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await start(page, '/skill.html?s=writing&lv=1&c=WRT789');
    await expect(page.locator('.sk-topic')).toContainText('About me');
    await expect(page.locator('.sk-points li')).toHaveCount(3);
    await expect(page.locator('.sk-timer')).toContainText('15:00');
    const box = page.locator('#skWriteBox');
    await expect(page.locator('.sk-count')).toContainText('0 / 40–60 words');
    await expect(page.locator('.sk-count')).not.toHaveClass(/ok/);
    await box.fill(TEXT + ' <b>');
    await expect(page.locator('.sk-count')).toContainText('46 / 40–60 words');
    await box.fill(TEXT);
    await expect(page.locator('.sk-count')).toContainText('45 / 40–60 words');
    await expect(page.locator('.sk-count')).toHaveClass(/ok/);
    await box.fill(TEXT + ' <b> & more');
    await page.getByRole('button', { name: /Submit my writing/ }).click();
    await expect(page.locator('.sk-mistake')).toHaveCount(2);
    await expect(page.locator('.sk-mistake').nth(0)).toContainText('have got');
    await expect(page.locator('.sk-mistake').nth(0)).toContainText('have');
    await expect(page.locator('.sk-mistake').nth(0)).toContainText('Use "have" here.');
    await expect(page.locator('.sk-mistake').nth(1)).toContainText('A <b> tag & "quotes" must stay text.');
    // the student's text with the two mistakes underlined, every character shown as text
    await expect(page.locator('.sk-checked mark.sk-err')).toHaveCount(2);
    await expect(page.locator('.sk-checked mark.sk-err').nth(0)).toHaveText('have got');
    await expect(page.locator('.sk-checked mark.sk-err').nth(1)).toHaveText('<b>');
    await expect(page.locator('.sk-checked')).toHaveText(TEXT + ' <b> & more');
    await expect(page.locator('.sk-checked b')).toHaveCount(0);
    // better words: "very big" (not also "big"), "good", "like"
    await expect(page.locator('.sk-better li', { hasText: 'good' }).first()).toContainText('great');
    await expect(page.locator('.sk-better li', { hasText: 'very big' })).toContainText('huge');
    await expect(page.locator('.sk-better li', { hasText: /^\s*big/ })).toHaveCount(0);
    await expect(page.locator('.sk-better li', { hasText: /^\s*old/ })).toHaveCount(0);   // "fourteen years old" is an age
    expect(await page.evaluate(() => [skBetterWords('A GOOD, old house; I like it.'), skBetterWords('Good morning! It looks like rain. Goodbye!')])).toEqual([
      [{ word: 'good', better: ['great', 'excellent', 'wonderful'] }, { word: 'old', better: ['ancient', 'historic'] }, { word: 'like', better: ['enjoy', 'love', 'am keen on'] }],
      []]);
    await expect(page.locator('#skWriteBox')).toHaveJSProperty('readOnly', true);
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    await expect(page.getByRole('button', { name: /Submit my writing/ })).toHaveCount(0);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({ method: 'POST', lang: 'en-GB', text: TEXT + ' <b> & more' });

    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    const band = await page.evaluate(() => skWritingBand(47, 40, 2, true));
    expect(recs[0]).toMatchObject({ v: 1, code: 'WRT789', type: 'Writing course', title: 'Level 1 · Meeting people — Writing', level: 1,
      skill: 'writing', name: 'Test Student', studentId: '10001', text: TEXT + ' <b> & more', words: 47, minWords: 40, maxWords: 60,
      mistakes: 2, grammarChecked: true, band });
    expect(recs[0].score).toBeUndefined();
    expect(recs[0].mistakeList).toEqual([
      { bad: 'have got', fix: 'have', message: 'Use "have" here.' },
      { bad: '<b>', fix: '<i>', message: 'A <b> tag & "quotes" must stay text.' }]);
    expect(recs[0].timeDisplay).toMatch(/^\d\d:\d\d$/);
    expect(recs[0].builtAt).toBe(recs[0].date);
    await expect(page.locator('.sk-band')).toContainText(String(band));
    expect(errors).toEqual([]);
  });

  test('writing: the 45-word text gives the band from the rules', async ({ page, context }) => {
    await prepare(context);
    await mockGrammar(context);
    await start(page, '/skill.html?s=writing&lv=1&c=WRT789');
    await page.locator('#skWriteBox').fill(TEXT);
    await page.getByRole('button', { name: /Submit my writing/ }).click();
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    const recs = await sentRecords(page);
    expect(recs[0]).toMatchObject({ words: 45, mistakes: 1, grammarChecked: true, band: await page.evaluate(() => skWritingBand(45, 40, 1, true)) });
  });

  test('writing: grammar checker down', async ({ page, context }) => {
    await prepare(context);
    const calls = [];
    await mockGrammar(context, { status: 429, calls });
    await start(page, '/skill.html?s=writing&lv=1&c=WRT789');
    await page.locator('#skWriteBox').fill(TEXT);
    await page.getByRole('button', { name: /Submit my writing/ }).click();
    await expect(page.locator('.sk-check-note')).toContainText("The grammar check couldn't run this time");
    await expect(page.locator('.sk-better li', { hasText: 'good' }).first()).toContainText('great');
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    let recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ words: 45, mistakes: 0, mistakeList: [], grammarChecked: false, band: await page.evaluate(() => skWritingBand(45, 40, 0, false)) });
    // Check again: the checker works now → the mistakes show, but no second result is sent
    await context.unroute('**/api.languagetool.org/**');
    await mockGrammar(context, { calls });
    await page.getByRole('button', { name: /Check again/ }).click();
    await expect(page.locator('.sk-mistake')).toHaveCount(1);
    await expect(page.locator('.sk-check-note')).toHaveCount(0);
    expect(calls).toHaveLength(2);
    await page.waitForTimeout(500);
    recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
  });

  test('writing: time runs out', async ({ page, context }) => {
    await prepare(context);
    await mockGrammar(context);
    await page.addInitScript(() => { window.__skFast = 1; });
    await start(page, '/skill.html?s=writing&lv=1&c=WRT789');
    await expect(page.locator('.sk-timer')).toContainText('15:00');
    await expect(page.locator('.sk-send')).toContainText('Saved ✅', { timeout: 25000 });
    await expect(page.locator('body')).toContainText("Time's up");
    await expect(page.locator('#skWriteBox')).toHaveJSProperty('readOnly', true);
    await page.waitForTimeout(1500);
    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ words: 0, text: '', skill: 'writing' });
    expect(recs[0].band).toBe(1);
  });

  test('writing: a reload keeps the text and the clock (phones reload background tabs); a sent writing clears it', async ({ page, context }) => {
    await prepare(context);
    await mockGrammar(context);
    await page.addInitScript(() => { window.__skFast = 1; });   // a minute lasts a second: 15 minutes = 15 s
    page.on('dialog', d => d.accept());
    await start(page, '/skill.html?s=writing&lv=1&c=WRT789');
    await page.locator('#skWriteBox').fill(TEXT);
    const draft = await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skill_draft|WRT789|1')));
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
    expect(await page.evaluate(() => localStorage.getItem('ta_skill_draft|WRT789|1'))).toBeNull();
    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ text: TEXT, words: 45 });
  });

  test('writing: the time ran out while the page was away → it is sent at once, with the kept text', async ({ page, context }) => {
    await prepare(context, { storage: { 'ta_skill_draft|WRT789|1': JSON.stringify({ text: 'My name is Anna.', startedAt: Date.now() - 3600000, id: '10001' }) } });
    await mockGrammar(context);
    await start(page, '/skill.html?s=writing&lv=1&c=WRT789');
    await expect(page.locator('body')).toContainText("Time's up");
    await expect(page.locator('.sk-send')).toContainText('Saved ✅');
    const recs = await sentRecords(page);
    expect(recs).toHaveLength(1);
    expect(recs[0]).toMatchObject({ text: 'My name is Anna.', words: 4 });
    expect(await page.evaluate(() => localStorage.getItem('ta_skill_draft|WRT789|1'))).toBeNull();
  });

  test('writing: another student on the same device does not get the kept text; a preview keeps nothing', async ({ page, context }) => {
    await prepare(context, { storage: { 'ta_skill_draft|WRT789|1': JSON.stringify({ text: 'Not mine.', startedAt: Date.now(), id: '99999' }) } });
    await mockGrammar(context);
    await start(page, '/skill.html?s=writing&lv=1&c=WRT789');
    await expect(page.locator('#skWriteBox')).toHaveValue('');
    await expect(page.locator('#skTimer')).toContainText('15:00');
    await page.goto('/skill.html?s=writing&lv=1&preview=1');
    await page.locator('#skWriteBox').fill(TEXT);
    expect(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('ta_skill_draft') && !k.includes('WRT789')))).toEqual([]);
  });

  test('writing: preview sends nothing; a phone has no sideways scrolling', async ({ page, context }) => {
    await prepare(context);
    await mockGrammar(context);
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/skill.html?s=writing&lv=1&preview=1');
    await expect(page.locator('#studentNameInput')).toHaveCount(0);
    await page.locator('#skWriteBox').fill(TEXT);
    await page.getByRole('button', { name: /Submit my writing/ }).click();
    await expect(page.locator('.sk-mistake')).toHaveCount(1);
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
    await page.goto('/skill.html?s=speaking&lv=1');
    await expect(page.locator('#studentNameInput, #skIdInput')).toHaveCount(0);
    await expect(page.locator('.sk-steps')).toContainText('Words');
    const n = await page.locator('.sk-word').count();
    expect(n).toBeGreaterThanOrEqual(8);
    expect(n).toBeLessThanOrEqual(10);
    await page.getByRole('button', { name: /Next →/ }).click();
    const qs = await page.evaluate(() => TA_SKILLS.elementary.levels[0].speaking.questions);
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
    await expect(page.locator('.sk-topic')).toContainText('Talk about yourself');
    await expect(page.locator('.sk-points li')).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Get ready (30 s)' })).toBeVisible();
    await page.getByRole('button', { name: 'Start speaking' }).click();
    await expect(page.locator('.sk-speak-timer')).toContainText('0:45', { timeout: 5000 });
    await expect(page.locator('body')).toContainText('Well done! 🎉', { timeout: 15000 });
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
    await page.goto('/skill.html?s=speaking&lv=1&preview=1');
    await expect(page.locator('.sk-word').first()).toBeVisible();
    await expect(page.locator('.sk-say')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});


test.describe('course page', () => {
  // The links are absolute on the real site (https); the tests run on http, so pretend.
  const PRETEND_HTTPS = () => { window.skAppUrl = 'https://example.github.io/teachers_assistant/'; };
  const open = async (page, context, opts) => {
    await prepare(context, opts);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const errors = watchErrors(page);
    await page.goto('/course.html');
    await page.waitForTimeout(1000);
    await hideNotices(page);
    await page.addStyleTag({ content: '#taNoticeStack { display: none !important; }' });   // notes that come later (old files…)
    return errors;
  };

  test('the Course page: four skills, 10 levels each (1–5 ready, 6–10 coming soon), Try opens a preview', async ({ page, context }) => {
    const errors = await open(page, context);
    const cards = page.locator('.sk-skill-card');
    await expect(cards).toHaveCount(4);
    await expect(cards).toHaveText([/Listening/, /Reading/, /Writing/, /Speaking/]);
    const tiles = page.locator('.sk-level-tile');
    for (const skill of ['Reading', 'Writing', 'Speaking', 'Listening']) {
      await cards.filter({ hasText: skill }).click();
      await expect(page.locator('#courseWrap')).toContainText('Elementary');
      await expect(tiles).toHaveCount(10);
      for (let i = 0; i < 10; i++) {
        if (i < 5) {
          await expect(tiles.nth(i).getByRole('button', { name: '▶️ Try' })).toBeVisible();
          await expect(tiles.nth(i)).not.toContainText('Coming soon');
        } else {
          await expect(tiles.nth(i)).toContainText('Coming soon');
          await expect(tiles.nth(i).getByRole('button', { name: '▶️ Try' })).toHaveCount(0);
        }
      }
      if (skill !== 'Listening') await page.getByRole('button', { name: '← All skills' }).click();
    }
    await expect(tiles.nth(0)).toContainText('Level 1 · Meeting people');
    await expect(tiles.nth(4)).toContainText('Level 5 · Food & cafés');
    const [popup] = await Promise.all([page.waitForEvent('popup'), tiles.nth(0).getByRole('button', { name: '▶️ Try' }).click()]);
    await popup.waitForURL(/skill\.html\?s=listening&lv=1&preview=1/);
    // the chosen skill is remembered on this device; ← All skills goes back
    await page.reload();
    await expect(page.locator('.sk-level-tile')).toHaveCount(10);
    await page.getByRole('button', { name: '← All skills' }).click();
    await expect(page.locator('.sk-skill-card')).toHaveCount(4);
    expect(errors).toEqual([]);
  });

  test('Copy link makes one My Exercises item per level + skill + group', async ({ page, context }) => {
    const errors = await open(page, context);
    await page.evaluate(PRETEND_HTTPS);
    await page.locator('.sk-skill-card', { hasText: 'Listening' }).click();
    const tile = page.locator('.sk-level-tile').first();
    await expect(tile.getByRole('button', { name: '📊 View Results' })).toHaveCount(0);
    const before = await page.evaluate(() => getRecentExercises().length);
    const group = await page.evaluate(() => getStudentGroups().find(g => g.id === skGroupId()));
    await tile.getByRole('button', { name: '🔗 Copy link for ' + group.name }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/^https:\/\/example\.github\.io\/teachers_assistant\/skill\.html\?s=listening&lv=1&c=[A-Z0-9]{6}$/);
    const first = await page.evaluate(() => navigator.clipboard.readText());
    const item = await page.evaluate(() => getRecentExercises()[0]);
    expect(item).toMatchObject({ typeLabel: 'Listening course', groupId: group.id, title: 'Level 1 · Meeting people — Listening (' + group.name + ')', contentSummary: 'Level 1 · Listening' });
    expect(first).toContain('&c=' + item.code);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ta_skills_links')))).toEqual({ [group.id + '|listening|1']: { uid: item.uid, code: item.code } });
    expect(item).toMatchObject({ skill: 'listening', level: 1 });
    await page.evaluate(() => navigator.clipboard.writeText(''));
    await tile.getByRole('button', { name: /Copy link for/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(first);
    expect(await page.evaluate(() => getRecentExercises().length)).toBe(before + 1);
    expect(await page.evaluate(() => (window.__writes || []).filter(w => w.type === 'TA_SYNC:PLAY').length)).toBe(0);
    await expect(tile.getByRole('button', { name: '📊 View Results' })).toBeVisible();
    // Speaking: just the link, no My Exercises item and no results
    await page.getByRole('button', { name: '← All skills' }).click();
    await page.locator('.sk-skill-card', { hasText: 'Speaking' }).click();
    const sp = page.locator('.sk-level-tile').first();
    await sp.getByRole('button', { name: /Copy link for/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('https://example.github.io/teachers_assistant/skill.html?s=speaking&lv=1');
    expect(await page.evaluate(() => getRecentExercises().length)).toBe(before + 1);
    await expect(sp.getByRole('button', { name: '📊 View Results' })).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('the clipboard refuses → the link shows in a window titled with the group\'s name as typed ("Kids & Teens")', async ({ page, context }) => {
    const errors = await open(page, context, { storage: { ta_student_groups: JSON.stringify([{ id: 'g1', name: 'Kids & Teens' }]) } });
    await page.evaluate(PRETEND_HTTPS);
    await page.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('blocked')); });
    await page.locator('.sk-skill-card', { hasText: 'Listening' }).click();
    await page.locator('.sk-level-tile').first().getByRole('button', { name: '🔗 Copy link for Kids & Teens' }).click();
    await expect(page.locator('.ta-modal .points-modal-title')).toHaveText('🔗 The link for Kids & Teens');
    await expect(page.locator('.ta-modal input')).toHaveValue(/skill\.html\?s=listening&lv=1&c=[A-Z0-9]{6}$/);
    expect(errors).toEqual([]);
  });

  test('results arriving while the Course page is hidden don\'t redraw it; each drawing reads the kept results once', async ({ page, context }) => {
    const errors = await open(page, context);
    await page.locator('.sk-skill-card', { hasText: 'Listening' }).click();
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
    expect(r.reads).toBeLessThanOrEqual(2);
    expect(errors).toEqual([]);
  });

  test('without groups the tiles ask for one; on a phone nothing scrolls sideways', async ({ page, context }) => {
    const errors = await open(page, context, { storage: { ta_student_groups: '[]' } });
    await page.setViewportSize({ width: 390, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.locator('.sk-skill-card', { hasText: 'Reading' }).click();
    await expect(page.locator('.sk-level-tile').first()).toContainText('Add a group on the Students page first');
    await expect(page.getByRole('button', { name: /Copy link for/ })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    expect(errors).toEqual([]);
  });

  test('a sent link stays valid: the item deleted in My Exercises comes back with the same code', async ({ page, context }) => {
    const errors = await open(page, context);
    await page.evaluate(PRETEND_HTTPS);
    await page.locator('.sk-skill-card', { hasText: 'Reading' }).click();
    const tile = page.locator('.sk-level-tile').first();
    await tile.getByRole('button', { name: /Copy link for/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/skill\.html\?s=reading&lv=1&c=[A-Z0-9]{6}$/);
    const first = await page.evaluate(() => navigator.clipboard.readText());
    const item = await page.evaluate(() => getRecentExercises()[0]);
    await page.evaluate(uid => removeRecentExercise(uid), item.uid);
    expect(await page.evaluate(uid => getRecentExercises().filter(e => e.uid === uid).length, item.uid)).toBe(0);
    await page.evaluate(() => { renderCourse(); return navigator.clipboard.writeText(''); });
    await expect(tile.getByRole('button', { name: '📊 View Results' })).toHaveCount(0);
    await tile.getByRole('button', { name: /Copy link for/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(first);
    const again = await page.evaluate(uid => getRecentExercises().filter(e => e.uid === uid), item.uid);
    expect(again).toHaveLength(1);
    expect(again[0]).toMatchObject({ code: item.code, title: item.title, typeLabel: 'Reading course', groupId: item.groupId, skill: 'reading', level: 1 });
    expect(errors).toEqual([]);
  });

  test('My Exercises: ⋯ on a course item copies its skill.html link and has no Redownload (old items found through ta_skills_links)', async ({ page, context }) => {
    // an item made before skill/level were kept on it: only the uid in ta_skills_links
    const old = { title: 'Level 1 · Meeting people — Listening (Target)', typeLabel: 'Listening course', code: 'LSN123', uid: 'skold1', groupId: 'g1',
      contentSummary: 'Level 1 · Listening', date: new Date().toISOString(), disabled: false };
    await prepare(context, { storage: { ta_recent_exercises: JSON.stringify([old]), ta_skills_links: JSON.stringify({ 'g1|listening|1': 'skold1' }) } });
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const errors = watchErrors(page);
    await page.addInitScript(() => { window.skAppUrl = 'https://example.github.io/teachers_assistant/'; });
    await page.goto('/my-exercises.html');
    await page.waitForTimeout(1000);
    await hideNotices(page);
    await page.addStyleTag({ content: '#taNoticeStack { display: none !important; }' });
    await page.locator('.myex-more').first().click();
    const menu = page.locator('#myexMenu');
    await expect(menu.getByRole('menuitem', { name: 'Copy link' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Redownload' })).toHaveCount(0);
    await menu.getByRole('menuitem', { name: 'Copy link' }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('https://example.github.io/teachers_assistant/skill.html?s=listening&lv=1&c=LSN123');
    expect(await page.evaluate(() => (window.__writes || []).filter(w => w.type === 'TA_SYNC:PLAY').length)).toBe(0);
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
    await expect(modal).toContainText('(estimated)');
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

  test('results table: ranking with ties, missing skills, colours, picture', async ({ page, context }) => {
    const errors = await open(page, context, '/course.html', { ta_skills_marks: JSON.stringify({ 'WRT001|10003': 6 }) });
    await page.locator('.sk-skill-card', { hasText: 'Writing' }).click();
    const tile = page.locator('.sk-level-tile').first();
    await expect(page.locator('.sk-level-tile').nth(1).getByRole('button', { name: '🏆 Results table' })).toHaveCount(0);
    await tile.getByRole('button', { name: '🏆 Results table' }).click();
    const table = page.locator('.sk-rt');
    await expect(table.locator('.sk-rt-head')).toContainText('Level 1 · Meeting people');
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
      return skTableRows(1, 'g1').map(r => [r.name, r.place, r.overall, r.writing && r.writing.band]);
    });
    expect(tie).toEqual([['Alice Test', 1, 8.5, 7], ['Bobur Test', 2, 7.5, null], ['Cora Test', 2, 7.5, 7.5]]);
    // the picture
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: '⬇️ Download picture' }).click()]);
    expect(download.suggestedFilename()).toBe('level-1-target.png');
    const buf = require('fs').readFileSync(await download.path());
    expect(buf.length).toBeGreaterThan(5000);
    expect(buf.slice(1, 4).toString()).toBe('PNG');
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
      table: skTableRows(1, 'g1').filter(x => x.listening).map(x => x.name),
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
      const rows = skTableRows(1, 'g1');
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

  test('the Course page loads a level\'s results by itself, even when its My Exercises item was deleted', async ({ page, context }) => {
    const errors = await open(page, context, '/course.html', { ta_recent_exercises: JSON.stringify(items().filter(i => i.skill !== 'reading')) });
    expect(await page.evaluate(() => window.__allResults.filter(r => r.code === 'RDG001').length)).toBe(3);
    await page.locator('.sk-skill-card', { hasText: 'Reading' }).click();
    await page.locator('.sk-level-tile').first().getByRole('button', { name: '🏆 Results table' }).click();
    await expect(page.locator('.sk-rt-row').first().locator('.sk-rt-cell').nth(1)).toContainText('15 / 15');
    expect(errors).toEqual([]);
  });

  test('the results table fits a phone: it scrolls inside its own box', async ({ page, context }) => {
    const errors = await open(page, context, '/course.html');
    await page.setViewportSize({ width: 390, height: 800 });
    await page.locator('.sk-skill-card', { hasText: 'Listening' }).click();
    await page.locator('.sk-level-tile').first().getByRole('button', { name: '🏆 Results table' }).click();
    await expect(page.locator('.sk-rt-row')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    expect(errors).toEqual([]);
  });
});
