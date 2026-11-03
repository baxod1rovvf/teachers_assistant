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
    expect(c.test, c.id).toBe(/l\d$/.test(c.id) ? 20 : 30);
  });
  // the Beginner exam: grammar, listening and reading online (12 + 8 + 10), writing on paper — no speaking
  expect(await page.evaluate(() => { const e = TA_COURSES[0].blocks[0].exam; return ['grammar', 'listening', 'reading'].map(p => e.test.filter(t => t.part === p).length).concat([e.writing.max, e.skills.indexOf('speaking')]); }))
    .toEqual([12, 8, 10, 10, -1]);
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
  await expect(page.locator('.course-game')).toHaveCount(2);
  await page.locator('.course-taught-btn').click();
  await expect(page.locator('.course-taught-btn')).toContainText('✅ Taught with');
  expect(await page.evaluate(() => courseTaught(courseGroupId()).b1l1)).toBeTruthy();
  // the slides follow the teacher's order (2026-11-03)
  const tags = await page.evaluate(() => TA_COURSES[0].blocks[0].lessons[0].deck.map(d => d.layout + (d.ex ? ':' + d.ex : '')));
  expect(tags).toEqual(['title', 'list', 'questions', 'words', 'boxes', 'mistakes', 'exercise:letters', 'boxes', 'exercise:numbers', 'skill', 'exercise:phones', 'finish']);
  // the exercise slides and the handout come from the same exercises
  const onSlides = await page.evaluate(() => {
    const stop = courseFindStop('b1l1'), deck = slOriginal(stop);
    return deck.filter((s, i) => stop.lesson.deck[i].layout === 'exercise').map(s => s.items.filter(it => it.type === 'text' && /^\d+\.  /.test(it.text)).map(it => it.text.replace(/^\d+\.  /, '')));
  });
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.getByRole('button', { name: /Open & print/ }).click()]);
  await expect(popup.locator('section.ex')).toHaveCount(3);
  const onPaper = await popup.locator('section.ex').evaluateAll(l => l.map(sec => Array.from(sec.querySelectorAll('.items div')).map(d => d.textContent.replace(/^\d+\. /, '').replace(/  →  _+$/, ''))));
  expect(onPaper).toEqual(onSlides);
  await expect(popup.locator('.teacher')).toContainText('Exercise 3: 1 071 339 502');
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
  await expect(page.locator('.sle-thumb')).toHaveCount(12);
  await expect(page.locator('#slPanel')).toContainText('Slide 1 of 12');
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
  await expect(page.locator('.sle-thumb')).toHaveCount(13);
  await page.locator('.sle-thumb').nth(1).click();
  await page.locator('.sle-thumb.on .sle-thumb-tools button[title="Skip in Teach mode"]').click();
  await expect(page.locator('.sle-thumb').nth(1)).toHaveClass(/skipped/);
  await page.locator('.sle-close').click();
  // kept after a reload
  await page.reload();
  await page.waitForTimeout(1000);
  await hideNotices(page);
  await page.locator('.course-stop[data-stop="b1l1"]').click();
  await expect(page.locator('.course-mat', { hasText: 'Slides' })).toContainText('13 slides (1 skipped) · ✏️ changed by you');
  await page.getByRole('button', { name: '✏️ Edit slides' }).click();
  await expect(page.locator('#slStage .sl-text', { hasText: 'Letters & numbers' })).toHaveCount(1);
  // Original
  await page.locator('.sle-tools button', { hasText: 'Original' }).click();
  await page.getByRole('button', { name: '↩️ Use the original slides' }).click();
  await expect(page.locator('.sle-thumb')).toHaveCount(12);
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
  await expect(page.locator('#sltCount')).toHaveText('1 / 11');
  await page.keyboard.press('ArrowRight');   // slide 2 is skipped → the warm-up, its 5 questions hidden
  await expect(page.locator('#sltStage')).toContainText('Hello! Let\'s talk');
  await expect(page.locator('#sltCount')).toHaveText('2 / 11 · 🙈 5');
  await expect(page.locator('#sltStage .sl-concealed')).toHaveCount(5);
  await page.locator('#sltStage').click({ position: { x: 20, y: 20 } });
  await expect(page.locator('#sltStage .sl-concealed')).toHaveCount(4);
  await expect(page.locator('#sltStage .sl-revealed')).toContainText('What\'s your name?');
  for (let k = 0; k < 4; k++) await page.keyboard.press(' ');
  await expect(page.locator('#sltCount')).toHaveText('2 / 11');
  await page.keyboard.press(' ');
  await expect(page.locator('#sltStage')).toContainText('Words for today');
  // back shows the previous slide whole
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#sltStage .sl-concealed')).toHaveCount(0);
  // notes
  await page.keyboard.press('n');
  await expect(page.locator('#sltNotes')).toContainText('Number ping-pong');
  await page.locator('.slt-bar button[title^="Stop teaching"]').click();
  await expect(page.locator('#slTeach')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('lessons not redone yet open in the editor too, with any text the teacher had changed', async ({ page, context }) => {
  await prepare(context);
  await page.goto('/course.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(() => courseWrite(LS_COURSE_EDITS, { b1l2: { 1: { title: 'My own title', body: 'My own text' } } }));
  await page.evaluate(() => courseOpenSlideEditor('b1l2'));
  await expect(page.locator('.sle-thumb')).toHaveCount(12);
  await page.locator('.sle-thumb').nth(1).click();
  await expect(page.locator('#slStage')).toContainText('My own title');
  await expect(page.locator('#slStage')).toContainText('My own text');
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
  await expect(page.locator('.course-listen')).toHaveCount(2);              // the two listening texts, read aloud
  await expect(page.locator('.course-marks-table tbody tr')).toHaveCount(3); // Target's three students
  await expect(page.locator('.course-marks-table .course-online').first()).toContainText('not yet');
  await page.getByRole('button', { name: /Copy the link for/ }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(/play\.html\?x=/);
  const item = await page.evaluate(() => getRecentExercises()[0]);
  expect(item.title).toBe('Block 1 exam — online part (Target)');
  expect(item.contentSummary.split('\n')[0]).toMatch(/^Grammar 1\./);
  expect(item.contentSummary.split('\n')[29]).toMatch(/^Reading 30\./);
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
  await expect(page.locator('.course-marks-table tr[data-student="10001"] .course-total')).toContainText('89%');
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
