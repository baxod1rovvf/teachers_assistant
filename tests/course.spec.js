// The Course section (2026-11-02): one course map for every group — blocks of 5 lessons, a review and an exam,
// all four skills in every block — and Block 1 Lesson 1 "Letters and numbers" with warm-ups, slides the teacher
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
  const check = await page.evaluate(() => courseStops(TA_COURSES[0]).filter(s => s.lesson.slides).map(s => {
    const l = s.lesson;
    return { id: s.id, warm: (l.warmups || []).length >= 2, slides: l.slides.length >= 6, handout: !!(l.handout && l.handout.sections.length),
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

test('a lesson: mark it taught, present the slides and change their text (kept), print the handout', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/course.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.locator('.course-stop[data-stop="b1l1"]').click();
  await expect(page.locator('.course-lesson-head h3')).toHaveText('Letters and numbers');
  await expect(page.locator('.course-game')).toHaveCount(2);
  // taught with the group
  await page.locator('.course-taught-btn').click();
  await expect(page.locator('.course-taught-btn')).toContainText('✅ Taught with');
  // slides: next, then change the title
  await page.getByRole('button', { name: 'Present' }).click();
  await expect(page.locator('.course-slide-count')).toHaveText('1 / 12');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.course-slide-count')).toHaveText('2 / 12');
  await page.locator('.course-slide-tools button', { hasText: 'Change the text' }).click();
  const title = page.locator('.course-slide-title');
  await title.click();
  await page.keyboard.press('End');
  await page.keyboard.type(' (pairs)');
  await page.locator('.course-slide-tools button', { hasText: 'Done changing' }).click();
  await expect(title).toHaveText('Warm-up: Number ping-pong (pairs)');
  await page.locator('.course-slide-tools button[title="Close"]').click();
  await expect(page.locator('#courseSlides')).toHaveCount(0);
  // still there after a reload, and "Original text" puts it back
  await page.reload();
  await page.waitForTimeout(1000);
  await hideNotices(page);
  await page.locator('.course-stop[data-stop="b1l1"]').click();
  await expect(page.locator('.course-mat', { hasText: 'Slides' })).toContainText('1 changed by you');
  await page.locator('.course-stop.done').count();   // (the map remembered "taught")
  await page.evaluate(() => courseShowSlides('b1l1', 1, true));
  await expect(page.locator('.course-slide-title')).toHaveText('Warm-up: Number ping-pong (pairs)');
  await page.locator('.course-slide-tools button', { hasText: 'Original text' }).click();
  await expect(page.locator('.course-slide-title')).toHaveText('Warm-up: Number ping-pong');
  await page.locator('.course-slide-tools button[title="Close"]').click();
  expect(await page.evaluate(() => courseTaught(courseGroupId()).b1l1)).toBeTruthy();
  // the handout opens in a new tab, ready to print, with the teacher's page
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.getByRole('button', { name: /Open & print/ }).click()]);
  await expect(popup.locator('section.ex')).toHaveCount(6);
  await expect(popup.locator('.teacher')).toContainText('Number one: E.');   // the listening texts are on the teacher's page too
  expect(errors).toEqual([]);
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
