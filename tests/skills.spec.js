// The Skills course (2026-11-04): band rules shared by the student page and Loom.
const { test, expect } = require('@playwright/test');
const { prepare } = require('./support/app');

test.describe('bands', () => {
  test('listening/reading bands, writing estimate, overall and CEFR follow the rules', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&lv=1&preview=1');
    const r = await page.evaluate(() => ({
      band: [skBand(19, 20), skBand(16, 20), skBand(9, 20), skBand(7, 20), skBand(3, 20), skBand(0, 20), skBand(10, 10), skBand(37, 40), skBand(11, 40)],
      overall: [skOverall([8.5, 8.5, 9, 9]), skOverall([7.5, 9, 9, 8.5]), skOverall([7, null]), skOverall([]), skOverall([7, 7.5])],
      cefr: [skCefr(9), skCefr(8), skCefr(6.5), skCefr(4), skCefr(3), skCefr(2)],
      writing: [skWritingBand(50, 40, 0, true), skWritingBand(20, 40, 0, true), skWritingBand(100, 40, 5, true), skWritingBand(50, 40, 5, true), skWritingBand(0, 40, 0, false), skWritingBand(40, 40, 0, false)],
      colour: [skBandColour(7), skBandColour(6.5), skBandColour(6), skBandColour(5.5), skBandColour(5), skBandColour(2)],
    }));
    expect(r.band).toEqual([8.5, 7.5, 5.5, 4.5, 3, 0, 9, 8.5, 4]);
    expect(r.overall).toEqual([9, 8.5, 7, null, 7.5]);
    expect(r.cefr).toEqual(['C2', 'C1', 'B2', 'B1', 'A2', 'A1']);
    expect(r.writing).toEqual([9, 7.5, 7.5, 6, 4.5, 7.5]);
    expect(r.colour).toEqual(['good', 'good', 'mid', 'mid', 'low', 'low']);
  });
});

test.describe('content', () => {
  // Spoken numbers → digits ("oh seven seven double oh" → "07700", "seven thirty" → "730"), then letters/digits only,
  // so an answer can be found in the transcript line that says it (spellings "That's T, H, O…" → "thatstho…").
  const NUM = { zero: 0, oh: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
    thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50 };
  const norm = s => {
    const w = String(s).toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/).filter(Boolean);
    const out = [];
    for (let i = 0; i < w.length; i++) {
      const x = w[i], nx = w[i + 1];
      if (x === 'double' && nx in NUM) { out.push(String(NUM[nx]).repeat(2)); i++; continue; }
      if (x === 'oh' && !(nx in NUM || nx === 'double') && !(w[i - 1] in NUM)) { out.push(x); continue; }
      out.push(x in NUM ? String(NUM[x]) : x);
    }
    return out.join('');
  };
  const sentences = text => text.trim().split(/(?<=[.!?])\s+/);

  test('every level has its theme; Level 1 has full, checked content in all four skills', async ({ page, context, request }) => {
    await prepare(context);
    await page.goto('/skill.html?s=listening&lv=1&preview=1');
    const S = await page.evaluate(() => ({ skills: TA_SKILLS, better: TA_BETTER_WORDS }));
    const levels = S.skills.elementary.levels;
    expect(levels.map(l => l.theme)).toEqual(['Meeting people', 'Family & friends', 'My home', 'My day', 'Food & cafés', 'Shopping', 'My town', 'Free time', 'Travel', 'Weather & holidays']);
    expect(levels.map(l => l.no)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    levels.forEach(l => expect(l.emoji).toBeTruthy());
    expect(Object.keys(S.better).length).toBeGreaterThanOrEqual(30);
    ['good', 'nice', 'big', 'small', 'very happy', 'bad', 'like'].forEach(w => expect(S.better[w].length).toBeGreaterThan(0));
    const full = levels.filter(l => l.listening);
    expect(full.length).toBeGreaterThanOrEqual(1);
    expect(full[0].no).toBe(1);
    for (const lv of full) {
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
    expect(l1.listening.src).toBe('audio/skills/elem-1-listening.mp3');
    expect(l1.reading.title).toMatch(/pen-friend/i);
    expect(l1.writing).toMatchObject({ topic: 'About me', minWords: 40, maxWords: 60, minutes: 15 });
    expect(l1.speaking.part2.seconds).toBe(45);
    expect(l1.speaking.part2.topic).toMatch(/yourself/i);
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

test.describe('student page', () => {
  // the record the stand-in database keeps for each write (window.__writes only lists a few fields)
  const sentRecords = page => page.evaluate(() => window.__writes.map(w => window.__fakeDocs.find(d => d.__id === w.id)));

  async function start(page, url) {
    await page.goto(url);
    await page.locator('#studentNameInput').fill('Test Student');
    await page.locator('#skIdInput').fill('10001');
    await page.getByRole('button', { name: /Start/ }).click();
  }

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
      skMark('Kingston', ['Kingsley']), skMark('', ['3']), skMark('three', ['3', 'three']), skMark('Lucy’s dog', ["Lucy's dog"])]);
    expect(r).toEqual([true, true, true, true, false, false, false, true, true]);
  });

  test('writing and speaking say they are coming soon on this page', async ({ page, context }) => {
    await prepare(context);
    await page.goto('/skill.html?s=writing&lv=1&preview=1');
    await expect(page.locator('body')).toContainText('Coming soon');
    await expect(page.locator('body')).not.toContainText("doesn't exist");
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
