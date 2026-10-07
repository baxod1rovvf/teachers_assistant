// Maze (2026-10-07): a quiz in a 3D labyrinth. The teacher writes questions with a right and a wrong answer;
// the student sees the labyrinth from above (light in the centre), then walks it: at every turn the two answers
// point left and right — the right one leads on, the wrong one into a dead end (game over). A new try has a new order.
const { test, expect } = require('@playwright/test');
const { prepare, watchErrors, hideNotices } = require('./support/app');

const QS = [['Past of "go"?', 'went', 'goed'], ['Plural of "child"?', 'children', 'childs'], ['Opposite of "hot"?', 'cold', 'warm'], ['3 + 4 = ?', 'seven', 'eight']];

async function makeMaze(page, info) {
  await page.goto('/create.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  const ready = page.locator('.picker-section', { hasText: 'Ready to use' });
  await ready.locator('.picker-card', { hasText: 'Maze' }).click();
  await expect(page.locator('#panel-maze')).toHaveClass(/active/);
  await expect(page.locator('#mz-rows .maze-row')).toHaveCount(3);   // three empty questions to start with
  for (let i = 0; i < QS.length; i++) {
    if (i >= 3) await page.click('#panel-maze button:has-text("Add question")');
    const row = page.locator('#mz-rows .maze-row').nth(i);
    await row.locator('.mz-q').fill(QS[i][0]);
    await row.locator('.mz-right').fill(QS[i][1]);
    await row.locator('.mz-wrong').fill(QS[i][2]);
  }
  await expect(page.locator('#mz-count')).toHaveText('4');
  await page.fill('#mz-title', 'Grammar maze');
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#panel-maze .create-btn')]);
  const file = info.outputPath('maze.html');
  await download.saveAs(file);
  return file;
}

async function openStudent(context, file, id) {
  const student = await context.newPage();
  await student.addInitScript(id => {
    window.__mzFast = true;   // the walks and turns, sped up
    if (!window.__named) { window.__named = 1; window.name = 'ta_merge_identity:' + JSON.stringify({ id: id, name: 'Test ' + id, code: '' }); }
  }, id);
  await student.goto('file://' + file);
  return student;
}

// which button holds the right (or wrong) answer to the question on screen
async function pick(student, wantRight) {
  await expect(student.locator('#mzQuestion')).toBeVisible({ timeout: 15000 });
  const q = await student.locator('#mzQText').innerText();
  const item = QS.find(x => x[0] === q);
  const text = wantRight ? item[1] : item[2];
  const side = (await student.locator('#mzOptL .txt').innerText()) === text ? '#mzOptL' : '#mzOptR';
  await expect(student.locator(side + ' .txt')).toHaveText(text);
  await student.click(side);
  await expect(student.locator('#mzQuestion')).toBeHidden();
  return q;
}

test('Maze: made on the Create page; the student finds the light by picking the right side at every turn', async ({ page, context }, info) => {
  test.setTimeout(90000);
  await prepare(context);
  const errors = watchErrors(page);
  const file = await makeMaze(page, info);
  const item = await page.evaluate(() => getRecentExercises()[0]);
  expect(item.typeLabel).toBe('Maze');
  expect(item.builderTab).toBe('maze');
  expect(item.builderState.rows.length).toBe(4);
  expect(errors).toEqual([]);

  const student = await openStudent(context, file, '10001');
  const studentErrors = watchErrors(student);
  // the 3D view: the teacher's site's copy of three.js and a canvas (or, without WebGL, a note — the game still works)
  await student.waitForFunction(() => typeof THREE_OK !== 'undefined' && (THREE_OK || !document.getElementById('mzNoGl').hidden), null, { timeout: 15000 });
  const has3d = await student.evaluate(() => THREE_OK);
  if (has3d) await expect(student.locator('#mzView canvas')).toHaveCount(1);
  for (let n = 0; n < QS.length; n++) {
    await pick(student, true);
    await expect(student.locator('#hudDone')).toHaveText(String(n + 1));
  }
  await expect(student.locator('#endOverlay')).not.toHaveClass(/hidden/, { timeout: 15000 });
  await expect(student.locator('#endTitle')).toHaveText(/found the light/);
  const payload = await student.evaluate(() => buildResultPayload());
  expect(payload.type).toBe('Maze');
  expect(payload.won).toBe(true);
  expect(payload.score).toBe(100);
  expect(payload.correct).toBe(4);
  expect(studentErrors.filter(e => !/module|import|Failed to fetch|lottie|fonts|ERR_|WebGL|GPU/i.test(e))).toEqual([]);
});

test('Maze: a wrong answer turns into a dead end — GAME OVER; trying again gives the questions in a new order', async ({ page, context }, info) => {
  test.setTimeout(90000);
  await prepare(context);
  const file = await makeMaze(page, info);
  const student = await openStudent(context, file, '10002');
  await pick(student, true);
  const failedQ = await pick(student, false);
  await student.waitForFunction(() => mzState === 'over', null, { timeout: 15000, polling: 50 });   // the dead end with GAME OVER
  await expect(student.locator('#endOverlay')).not.toHaveClass(/hidden/, { timeout: 15000 });
  await expect(student.locator('#endTitle')).toHaveText(/Game over/);
  await expect(student.locator('#endText')).toContainText(QS.find(x => x[0] === failedQ)[1]);   // shows the right answer
  const payload = await student.evaluate(() => buildResultPayload());
  expect(payload.won).toBe(false);
  expect(payload.correct).toBe(1);
  expect(payload.score).toBe(25);
  expect(payload.mistakes).toContain(failedQ);

  const first = await student.evaluate(() => order.map(q => q.q).join('|'));
  await student.click('#tryAgainBtn');
  await expect(student.locator('#endOverlay')).toHaveClass(/hidden/);
  await expect(student.locator('#mzQuestion')).toBeVisible({ timeout: 15000 });
  const second = await student.evaluate(() => order.map(q => q.q).join('|'));
  expect(second).not.toBe(first);
  expect(await student.locator('#hudDone').innerText()).toBe('0');
});

test('Maze: every labyrinth has one turn per question, with the wrong side a dead end and the light in the centre', async ({ page, context }, info) => {
  await prepare(context);
  const file = await makeMaze(page, info);
  const student = await openStudent(context, file, '10003');
  const report = await student.evaluate(() => {
    const out = [];
    for (const N of [2, 5, 12, 30]) for (let k = 0; k < 4; k++) {
      const m = buildMaze(N);
      const open = (c, d) => m.floor[2 * c[1] + 1 + d[1]][2 * c[0] + 1 + d[0]];
      const ok = m.junctions.length === N &&
        m.junctions.every(j => !open(j.cell, j.heading) && open(j.cell, j.correct) && open(j.cell, j.wrong) &&
          // the dead end: nothing past the stub
          [j.wrong, leftOf(j.wrong), rightOf(j.wrong)].every(d => !open(j.stub, d))) &&
        m.route[m.route.length - 1][0] === m.center[0] && m.route[m.route.length - 1][1] === m.center[1] &&
        m.center[0] === (m.n - 1) / 2 &&
        (m.start[0] === 0 || m.start[1] === 0 || m.start[0] === m.n - 1 || m.start[1] === m.n - 1);
      out.push(N + ':' + ok);
    }
    return out;
  });
  expect(report.every(r => r.endsWith(':true')), report.join(' ')).toBe(true);
});
