// The Course section (2026-11-02): one course map for every group — blocks of 5 lessons, a review and an exam,
// all four skills in every block — and Block 1 Lesson 1 "Letters and numbers" with warm-ups, slides the teacher
// edits freely and teaches (things hidden until a click),
// can change, a printable handout and a 20-question revision test shared by link.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const PRETEND_HTTPS = () => { window.taPlayUrl = uid => 'https://example.github.io/teachers_assistant/play.html?x=' + uid; };

test('the course map: every block is 5 lessons + review + exam and covers all four skills; all of Block 1 is ready', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/index.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.locator('.tb-tab[data-tab="course"]').click();
  await expect(page.locator('#panel-course')).toHaveClass(/active/, { timeout: 8000 });
  const blocks = page.locator('.course-block');
  await expect(blocks).toHaveCount(6);
  for (let i = 0; i < 6; i++) {
    await expect(blocks.nth(i).locator('.course-stop')).toHaveCount(7);
    await expect(blocks.nth(i).locator('.course-stop.k-lesson')).toHaveCount(5);
    await expect(blocks.nth(i).locator('.course-stop.k-review')).toHaveCount(1);
    await expect(blocks.nth(i).locator('.course-stop.k-exam')).toHaveCount(1);
    await expect(blocks.nth(i).locator('.course-skills span')).toHaveCount(4);   // 🎧 📖 ✍️ 🗣️
  }
  // every ready meeting: slides, a handout, a test whose questions have a gap and 3 wrong answers (never the right one);
  // lessons and the review have warm-ups; anything with a listening exercise has a text to read aloud
  const check = await page.evaluate(() => courseStops(TA_COURSES[0]).filter(s => s.lesson.deck || s.lesson.slides).map(s => {
    const l = s.lesson;
    return { id: s.id, warm: (l.warmups || []).length >= 2, slides: (l.deck || l.slides).length >= 6, handout: !!(l.handout && l.handout.sections.length),
      test: l.test.length, ok: l.test.every(t => t.q.indexOf('_____') !== -1 && t.wrong.length === 3 && t.wrong.indexOf(t.a) === -1 && new Set(t.wrong).size === 3),
      listen: !l.handout.sections.some(x => x.skill === 'listening') || !!(l.listen && l.listen.length) };
  }));
  expect(check.map(c => c.id)).toEqual(['b1l1', 'b1l2', 'b1l3', 'b1l4', 'b1l5', 'b1review', 'b1exam']);
  check.forEach(c => {
    expect(c, c.id).toMatchObject({ slides: true, handout: true, ok: true, listen: true, warm: c.id !== 'b1exam' });
    expect(c.test, c.id).toBe(/l\d$/.test(c.id) ? 20 : c.id === 'b1exam' ? 35 : 30);
  });
  // the Beginner exam: grammar, listening and reading online (12 + 8 + 10), writing on paper — no speaking
  expect(await page.evaluate(() => { const e = TA_COURSES[0].blocks[0].exam; return ['grammar', 'listening', 'reading'].map(p => e.test.filter(t => t.part === p).length).concat([e.writing.max, e.skills.indexOf('speaking')]); }))
    .toEqual([10, 15, 10, 10, -1]);   // 3 recordings × 5 listening questions (teacher, 2026-11-03)
  await expect(page.locator('.course-stop.ready')).toHaveCount(7);
  await expect(page.locator('.course-stop.next')).toHaveCount(1);   // the first group's next lesson glows
  expect(errors).toEqual([]);
});

test('a lesson: mark it taught; the handout has exactly the exercises the slides show', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/course.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.locator('.course-stop[data-stop="b1l1"]').click();
  await expect(page.locator('.course-lesson-head h3')).toHaveText('Letters and numbers');
  await expect(page.locator('.course-game')).toHaveCount(4);
  await page.locator('.course-taught-btn').click();
  await expect(page.locator('.course-taught-btn')).toContainText('✅ Taught with');
  expect(await page.evaluate(() => courseTaught(courseGroupId()).b1l1)).toBeTruthy();
  // a 2-hour lesson in the teacher's order: title, today, warm-up, lead-in words, then lessons with exercises, "You found it",
  // listening, reading, speaking, writing… and a finish slide; every exercise has its slide, in the handout's order
  const info = await page.evaluate(() => {
    const l = TA_COURSES[0].blocks[0].lessons[0];
    return { first: l.deck.slice(0, 5).map(d => d.layout), last: l.deck[l.deck.length - 1].layout, slides: l.deck.length,
      onSlides: l.deck.filter(d => d.layout === 'exercise').map(d => d.ex), exercises: l.exercises.map(e => e.id),
      kinds: [...new Set(l.exercises.map(e => e.type))].length, mistakes: l.deck.filter(d => d.layout === 'mistakes').length,
      skills: [...new Set(l.deck.filter(d => d.layout === 'skill').map(d => d.skill))].sort(),
      listenings: l.exercises.filter(e => typeof e.listen === 'number').map(e => [e.listen, e.items.length]), audio: l.listen.map(x => x.src) };
  });
  expect(info.first).toEqual(['title', 'list', 'questions', 'game', 'words']);
  expect(info.last).toBe('finish');
  expect(info.slides).toBeGreaterThanOrEqual(30);
  expect(info.onSlides).toEqual(info.exercises);
  expect(info.exercises.length).toBeGreaterThanOrEqual(14);
  expect(info.kinds).toBeGreaterThanOrEqual(7);
  expect(info.mistakes).toBeGreaterThanOrEqual(1);
  expect(info.skills).toEqual(['listening', 'reading']);
  // three listenings, five questions each, each with its own recording (on the site)
  expect(info.listenings).toEqual([[0, 5], [1, 5], [2, 5]]);
  for (const src of info.audio) {
    const r = await page.request.get('/' + src);
    expect(r.status(), src).toBe(200);
    expect((await r.body()).length, src).toBeGreaterThan(100000);
  }
  // the exercise slides and the handout come from the same exercises
  const onSlides = await page.evaluate(() => {
    const stop = courseFindStop('b1l1'), deck = slOriginal(stop);
    return deck.filter((s, i) => stop.lesson.deck[i].layout === 'exercise').map(s => s.items.filter(it => it.type === 'text' && /^\d+\.  /.test(it.text)).map(it => it.text.replace(/^\d+\.  /, '')));
  });
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.getByRole('button', { name: /Open & print/ }).click()]);
  await expect(popup.locator('section.ex')).toHaveCount(onSlides.length);
  const onPaper = await popup.locator('section.ex').evaluateAll(l => l.map(sec => Array.from(sec.querySelectorAll('.items > div, .match > div:first-child > div')).map(d => d.textContent.replace(/^\d+\. /, '').replace(/(  →  _+|   _{4})$/, ''))));
  expect(onPaper).toEqual(onSlides);
  await expect(popup.locator('.teacher')).toContainText('Exercise 3: 1 Emma · 2 Jack · 3 Green · 4 Sophie · 5 Lizzy');
  await expect(popup.locator('.teacher .script').first()).toContainText("B: That's E, double M, A.");   // the listening scripts, with who speaks
  await expect(popup.locator('.match')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('the slide editor: type, add, hide until a click, move, delete, undo, skip — kept; Original brings the ready-made slides back', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/course.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.locator('.course-stop[data-stop="b1l1"]').click();
  await page.getByRole('button', { name: '✏️ Edit slides' }).click();
  await expect(page.locator('#slEditor')).toBeVisible();
  await expect(page.locator('.sle-thumb')).toHaveCount(35);
  await expect(page.locator('#slPanel')).toContainText('Slide 1 of 35');
  // double-click the title and type
  const title = page.locator('#slStage .sl-text', { hasText: 'Letters and numbers' });
  await title.dblclick();
  await expect(page.locator('#slStage [contenteditable]')).toBeFocused();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('Letters & numbers');
  await page.locator('#slPanel').click({ position: { x: 20, y: 400 } });
  await expect(page.locator('#slStage .sl-text', { hasText: 'Letters & numbers' })).toHaveCount(1);
  // add a text, hide it until a click, move it with the arrow keys
  await page.locator('.sle-tools button', { hasText: 'Text' }).first().click();
  await expect(page.locator('#slStage [contenteditable]')).toBeFocused();   // ready to type at once
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('Secret answer');
  await page.locator('#slPanel').click({ position: { x: 20, y: 600 } });
  await page.locator('#slStage .sl-text', { hasText: 'Secret answer' }).click();
  await page.getByLabel(/Hidden until I click/).check();
  await expect(page.locator('#slStage .sl-item.sl-hidden', { hasText: 'Secret answer' })).toHaveCount(1);
  const x0 = await page.evaluate(() => slItem().x);
  await page.keyboard.press('Shift+ArrowRight');
  expect(await page.evaluate(() => slItem().x)).toBe(x0 + 20);
  // drag it
  const box = await page.locator('#slStage .sl-item', { hasText: 'Secret answer' }).boundingBox();
  await page.mouse.move(box.x + 20, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 120, box.y + 60, { steps: 5 });
  await page.mouse.up();
  expect(await page.evaluate(() => slItem().x)).toBeGreaterThan(x0 + 100);
  // Delete removes it, ↶ brings it back
  await page.keyboard.press('Delete');
  await expect(page.locator('#slStage .sl-item', { hasText: 'Secret answer' })).toHaveCount(0);
  await page.locator('#slUndoBtn').click();
  await expect(page.locator('#slStage .sl-item', { hasText: 'Secret answer' })).toHaveCount(1);
  // a new slide, then skip slide 2 in Teach mode
  await page.locator('.sle-tools button', { hasText: 'Slide' }).first().click();
  await expect(page.locator('.sle-thumb')).toHaveCount(36);
  await page.locator('.sle-thumb').nth(1).click();
  await page.locator('.sle-thumb.on .sle-thumb-tools button[title="Skip in Teach mode"]').click();
  await expect(page.locator('.sle-thumb').nth(1)).toHaveClass(/skipped/);
  await page.locator('.sle-close').click();
  // kept after a reload
  await page.reload();
  await page.waitForTimeout(1000);
  await hideNotices(page);
  await page.locator('.course-stop[data-stop="b1l1"]').click();
  await expect(page.locator('.course-mat', { hasText: 'Slides' })).toContainText('36 slides (1 skipped) · ✏️ changed by you');
  await page.getByRole('button', { name: '✏️ Edit slides' }).click();
  await expect(page.locator('#slStage .sl-text', { hasText: 'Letters & numbers' })).toHaveCount(1);
  // Original
  await page.locator('.sle-tools button', { hasText: 'Original' }).click();
  await page.getByRole('button', { name: '↩️ Use the original slides' }).click();
  await expect(page.locator('.sle-thumb')).toHaveCount(35);
  await expect(page.locator('#slStage .sl-text', { hasText: 'Letters and numbers' })).toHaveCount(1);
  await page.locator('.sle-close').click();
  await expect(page.locator('.course-mat', { hasText: 'Slides' })).not.toContainText('changed by you');
  expect(errors).toEqual([]);
});

test('Teach mode: a click shows the hidden things one by one, then goes on; skipped slides are left out; Esc stops', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/course.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(() => { const stop = courseFindStop('b1l1'), d = slOriginal(stop); d[1].skip = true; slSave('b1l1', d); });
  await page.locator('.course-stop[data-stop="b1l1"]').click();
  await page.getByRole('button', { name: 'Teach' }).click();
  await expect(page.locator('#slTeach')).toBeVisible();
  await expect(page.locator('#sltCount')).toHaveText('1 / 34');
  await page.keyboard.press('ArrowRight');   // slide 2 is skipped → the warm-up, its 5 questions hidden
  await expect(page.locator('#sltStage')).toContainText('Hello! Let\'s talk');
  await expect(page.locator('#sltCount')).toHaveText('2 / 34 · 🙈 5');
  await expect(page.locator('#sltStage .sl-concealed')).toHaveCount(5);
  await page.locator('#sltStage').click({ position: { x: 20, y: 20 } });
  await expect(page.locator('#sltStage .sl-concealed')).toHaveCount(4);
  await expect(page.locator('#sltStage .sl-revealed')).toContainText('What\'s your name?');
  for (let k = 0; k < 4; k++) await page.keyboard.press(' ');
  await expect(page.locator('#sltCount')).toHaveText('2 / 34');
  await page.keyboard.press(' ');
  await expect(page.locator('#sltStage')).toContainText('Name chain');
  // back shows the previous slide whole
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#sltStage .sl-concealed')).toHaveCount(0);
  // notes
  await page.keyboard.press('n');
  await expect(page.locator('#sltNotes')).toContainText('ask 3–4 students');
  // a listening slide: 🔊 Listen plays its recording
  await page.keyboard.press('n');
  const mp3 = page.waitForRequest(r => /b1l1-listening-1\.mp3$/.test(r.url()));
  await page.evaluate(() => sltGo(SLT.slides.findIndex(s => s.items.some(i => i.type === 'audio')), true));
  await page.locator('#sltStage .sl-audio').click();
  await mp3;
  await page.locator('.slt-bar button[title^="Stop teaching"]').click();
  await expect(page.locator('#slTeach')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('every lesson and the review: a 2-hour lesson — 15 exercises, 3 listenings of 5 questions with recordings; the exam: 3 recordings too', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/course.html');
  await page.waitForTimeout(1000);
  const all = await page.evaluate(() => courseStops(TA_COURSES[0]).filter(s => s.blockNo === 1).map(s => {
    const l = s.lesson;
    return { id: s.id, slides: (l.deck || []).length, exercises: (l.exercises || []).length, kinds: [...new Set((l.exercises || []).map(e => e.type))].length,
      listenings: (l.exercises || []).filter(e => typeof e.listen === 'number').map(e => e.items.length), audio: (l.listen || []).map(x => x.src),
      handout: l.exercises ? l.handout.sections.length : null, built: slOriginal(courseFindStop(s.id)).length };
  }));
  for (const x of all) {
    expect(x.audio.length, x.id).toBe(3);
    for (const src of x.audio) expect((await page.request.get('/' + src)).status(), src).toBe(200);
    expect(x.built, x.id).toBe(x.slides);
    if (x.id === 'b1exam') continue;
    expect(x.slides, x.id).toBeGreaterThanOrEqual(30);
    expect(x.exercises, x.id).toBe(15);
    expect(x.handout, x.id).toBe(15);
    expect(x.kinds, x.id).toBeGreaterThanOrEqual(6);
    expect(x.listenings, x.id).toEqual([5, 5, 5]);
  }
  // an old text-only change doesn't break the new slides
  await page.evaluate(() => courseWrite(LS_COURSE_EDITS, { b1l2: { 1: { title: 'My own title', body: 'My own text' } } }));
  await page.evaluate(() => courseOpenSlideEditor('b1l2'));
  await expect(page.locator('.sle-thumb')).toHaveCount(all.find(x => x.id === 'b1l2').slides);
});

test('the revision test: one Test exercise per group with 20 questions, put online at the first "Copy the link"', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/course.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(PRETEND_HTTPS);
  await page.locator('.course-stop[data-stop="b1l1"]').click();
  const before = await page.evaluate(() => getRecentExercises().length);
  await page.getByRole('button', { name: /Copy the link for/ }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/play\.html\?x=/);
  const item = await page.evaluate(() => getRecentExercises()[0]);
  expect(await page.evaluate(() => getRecentExercises().length)).toBe(before + 1);
  expect(item.typeLabel).toBe('Test');
  expect(item.title).toMatch(/^Revision test — Letters and numbers/);
  expect(item.groupId).toBe(await page.evaluate(() => courseGroupId()));
  expect(item.linkAt).toBeTruthy();
  expect(item.contentSummary.split('\n')).toHaveLength(20);
  const html = await page.evaluate(uid => getCachedExerciseHtml(uid), item.uid);
  expect(html.replace(/__TA_APP_URL__/g, '')).not.toMatch(/__[A-Z][A-Z_]+__/);   // every blank filled (the site address goes in when it's put online)
  expect(html).toContain('id="ta-student-theme"');
  // pressing again copies the same link — nothing new made or put online
  const plays = await page.evaluate(() => window.__writes.filter(w => w.type === 'TA_SYNC:PLAY').length);
  await page.getByRole('button', { name: /Copy the link for/ }).click();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => getRecentExercises().length)).toBe(before + 1);
  expect(await page.evaluate(() => window.__writes.filter(w => w.type === 'TA_SYNC:PLAY').length)).toBe(plays);
  await expect(page.getByRole('button', { name: '📊 View Results' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('on a phone the course path goes down the screen', async ({ page, context }) => {
  await prepare(context);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/course.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  const a = await page.locator('.course-block').first().locator('.course-stop').nth(0).boundingBox();
  const b = await page.locator('.course-block').first().locator('.course-stop').nth(1).boundingBox();
  expect(b.y).toBeGreaterThan(a.y + 20);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('the exam: the online part keeps its order (grammar → listening → reading); marks = online score + the writing mark', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/course.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(PRETEND_HTTPS);
  await page.locator('.course-stop[data-stop="b1exam"]').click();
  await expect(page.locator('.course-lesson-head h3')).toHaveText('Block 1 exam');
  await expect(page.locator('.course-listen')).toHaveCount(3);              // the two listening texts, read aloud
  await expect(page.locator('.course-marks-table tbody tr')).toHaveCount(3); // Target's three students
  await expect(page.locator('.course-marks-table .course-online').first()).toContainText('not yet');
  await page.getByRole('button', { name: /Copy the link for/ }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/play\.html\?x=/);
  const item = await page.evaluate(() => getRecentExercises()[0]);
  expect(item.title).toBe('Block 1 exam — online part (Target)');
  expect(item.contentSummary.split('\n')[0]).toMatch(/^Grammar 1\./);
  expect(item.contentSummary.split('\n')[34]).toMatch(/^Reading 35\./);
  // Alice finishes it twice (24 and 27 right) — the better try counts
  await page.evaluate(code => {
    window.__allResults = (window.__allResults || []).concat([
      { code, type: 'Test', name: 'Alice Test', studentId: '10001', correct: 24, total: 30, score: 80 },
      { code, type: 'Test', name: 'Alice Test', studentId: '10001', correct: 27, total: 30, score: 90 }]);
    window.taCourseResultsChanged();
  }, item.code);
  const alice = page.locator('.course-marks-table tr[data-student="10001"]');
  await expect(alice.locator('.course-online')).toHaveText('27');
  await alice.locator('.course-mark-input').fill('8.5');
  await alice.locator('.course-mark-input').press('Enter');
  await page.locator('.course-lesson-head h3').click();   // leave the box → saved
  await expect(page.locator('.course-marks-table tr[data-student="10001"] .course-total')).toContainText('35.5');
  await expect(page.locator('.course-marks-table tr[data-student="10001"] .course-total')).toContainText('79%');   // 35.5 of 45
  // a mark above 10 isn't kept
  const bobur = page.locator('.course-marks-table tr[data-student="10002"] .course-mark-input');
  await bobur.fill('14');
  await page.locator('.course-lesson-head h3').click();
  await expect(bobur).toHaveValue('');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => /ta_course_marks$/.test(k))))))
    .toEqual({ 'g1|b1exam': { '10001': 8.5 } });
  // 🔊 Play doesn't break anything (the test browser may have no voice)
  await page.locator('.course-play').first().click();
  await page.waitForTimeout(300);
  expect(errors).toEqual([]);
});

test('the course has no Uzbek names or Uzbek words (teacher, 2026-11-03) — only English', async () => {
  const fs = require('fs'), path = require('path');
  const files = ['js/course-data.js'].concat(fs.readdirSync(path.join(__dirname, '../audio/course')).filter(f => /-scripts\.json$/.test(f)).map(f => 'audio/course/' + f)).map(f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
  const uzbek = /Uzbek|Tashkent|Samarkand|Bukhara|Kamila|Jasur|Bobur|Nodira|Karimov|Aziz|Lola\b|Malika|Rustam|Laylo|Jamol|Bekzod|Sardor|Nilufar|Madina|Timur|Dilnoza|Karim\b|\bAli\b|harf|raqam|unli tovush|telefon|ikki marta/;
  files.forEach(t => expect(t.match(uzbek)).toBeNull());
});

test('in the recordings a spelled name is said letter by letter, slowly', async () => {
  const fs = require('fs'), path = require('path');
  const maker = fs.readFileSync(path.join(__dirname, '../tools/make-course-audio.py'), 'utf8');
  expect(maker).toMatch(/SPELLING = re\.compile/);
  const scripts = JSON.parse(fs.readFileSync(path.join(__dirname, '../audio/course/b1l1-scripts.json'), 'utf8'));
  const spelled = scripts.flatMap(x => x.lines.map(l => l[1])).filter(t => /^\s*(?:(?:double )?[A-Z]\.\s*)+$/.test(t));
  expect(spelled.length).toBeGreaterThanOrEqual(6);   // five names in Listening 1, one in Listening 3
});
