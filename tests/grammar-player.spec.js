// Grammar Journey — the student's lesson (2026-11-16): learn → practise → a 20-question revision test. Only the first Submit is
// sent; a retake shows a score and sends nothing; a reload continues where the student was; only active time counts.
// Spec: docs/superpowers/specs/2026-11-16-grammar-journey-design.md ("Student page", "Total time").
const { test, expect } = require('@playwright/test');
const crypto = require('crypto');
const { passIdCheck, prepare, watchErrors } = require('./support/app');

const CODE = 'GRM111';
const URL_G = '/skill.html?s=grammar&gl=g1&c=' + CODE;
const hashFor = (code, id) => crypto.createHash('sha256').update(code + '|' + id).digest('hex').slice(0, 24);
const classDoc = code => ({ __id: 'class-' + code, v: 1, code: 'TAUSER', type: 'TA_SYNC:CLASS', title: code, name: '',
  data: JSON.stringify([{ h: hashFor(code, '10001'), n: 'Alice Test', g: 'Apex' }, { h: hashFor(code, '10002'), n: 'Bobur Test', g: 'Target' }]),
  date: new Date().toISOString() });
const grammarDocs = page => page.evaluate(code => window.__fakeDocs.filter(d => d.code === code && d.type === 'Grammar course'), CODE);
const kept = page => page.evaluate(() => Object.values(JSON.parse(localStorage.getItem('ta_skill_unsent') || '{}')));

async function setup(context, extra) {
  await prepare(context, Object.assign({ docs: [classDoc(CODE)] }, extra || {}));
  await context.addInitScript(() => { window.__grFast = true; window.__skSendTimeoutMs = 2000; });
}
async function start(page) {
  await page.goto(URL_G);
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await passIdCheck(page);
}
// answers the question on screen (practise: one `.gr-pq`; test: every `.gr-tq`) right — or wrong
async function answer(page, sel, wrong) {
  await page.evaluate(([sel, wrong]) => {
    const lesson = window.TA_GRAMMAR.levels[0].lessons.find(l => l.id === 'g1');
    document.querySelectorAll(sel).forEach(li => {
      const q = li.dataset.chunk != null ? lesson.chunks[+li.dataset.chunk].practise[+li.dataset.q] : lesson.test[+li.dataset.q];
      if (q.type === 'choose' || q.type === 'fix') {
        const opts = [...li.querySelectorAll('.gr-opt')];
        (opts.find(b => (b.dataset.val === q.a[0]) !== !!wrong) || opts[0]).click();
      } else if (q.type === 'gap') {
        const inp = li.querySelector('.gr-gap');
        inp.value = wrong ? 'zzz' : q.a[0];
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        const words = wrong ? q.words.slice().reverse() : q.a[0].replace(/[.?!]$/, '').split(' ');
        words.forEach(w => { const c = [...li.querySelectorAll('.gr-bank .gr-chip')].find(b => b.textContent === w); if (c) c.click(); });
      }
    });
  }, [sel, !!wrong]);
}
// the whole practise of one part, answered right
async function practisePart(page) {
  for (let i = 0; i < 5; i++) {
    await answer(page, '.gr-pq');
    if (await page.locator('#grCheck').isVisible()) await page.locator('#grCheck').click();
    await expect(page.locator('#grNext')).toBeEnabled();
    await page.locator('#grNext').click();
  }
}
async function toTest(page) {
  for (let c = 0; c < 3; c++) {
    await page.locator('#grPractise').click();
    await practisePart(page);
  }
  await expect(page.locator('.gr-tq')).toHaveCount(20);
}

test('start → Bu sizmi (with the student\'s group) → Ha → the first learn card, with its Uzbek note', async ({ page, context }) => {
  await setup(context);
  const errors = watchErrors(page);
  await page.goto(URL_G);
  await page.locator('#skIdInput').fill('10001');
  await page.getByRole('button', { name: /Start/ }).click();
  await expect(page.locator('.sk-confirm')).toContainText('Alice Test — 10001');
  await expect(page.locator('.sk-confirm')).toContainText('Apex');
  await page.locator('#skYes').click();
  await expect(page.locator('.gr-learn h2')).toHaveText('I am, you are, she is');
  await expect(page.locator('.gr-uz')).toBeVisible();
  await expect(page.locator('.sk-head')).toContainText('Lesson 1');
  expect(errors).toEqual([]);
});

test('a wrong practise answer shows the rule again and blocks Next', async ({ page, context }) => {
  await setup(context);
  await start(page);
  await page.locator('#grPractise').click();
  await expect(page.locator('#grNext')).toBeDisabled();
  await answer(page, '.gr-pq', true);
  await expect(page.locator('.gr-hint')).toBeVisible();
  await expect(page.locator('.gr-hint')).toContainText('With I, always use am.');
  await expect(page.locator('#grNext')).toBeDisabled();
  await answer(page, '.gr-pq');
  await expect(page.locator('#grNext')).toBeEnabled();
});

test('an order question: chips as written, tap again to take a word back', async ({ page, context }) => {
  await setup(context);
  await start(page);
  await page.locator('#grPractise').click();
  for (let i = 0; i < 4; i++) { await answer(page, '.gr-pq'); if (await page.locator('#grCheck').isVisible()) await page.locator('#grCheck').click(); await page.locator('#grNext').click(); }
  const chips = page.locator('.gr-pq .gr-bank .gr-chip');
  await expect(chips).toHaveCount(4);
  expect((await chips.allTextContents()).sort()).toEqual(['The', 'big', 'house', 'is'].sort());
  await page.locator('.gr-pq .gr-bank .gr-chip', { hasText: 'big' }).click();
  await expect(page.locator('.gr-pq .gr-line .gr-chip')).toHaveText(['big']);
  await page.locator('.gr-pq .gr-line .gr-chip', { hasText: 'big' }).click();
  await expect(page.locator('.gr-pq .gr-line .gr-chip')).toHaveCount(0);
  await answer(page, '.gr-pq');
  await page.locator('#grCheck').click();
  await expect(page.locator('#grNext')).toBeEnabled();
});

test('the test sends one result with 20 answers and the listed name', async ({ page, context }) => {
  test.setTimeout(60000);
  await setup(context);
  const errors = watchErrors(page);
  await start(page);
  await toTest(page);
  await answer(page, '.gr-tq');
  await page.locator('#grSubmit').click();
  await expect(page.locator('.gr-score')).toContainText('20/20');
  await expect(page.locator('#grSend')).toContainText('Saved ✅');
  const docs = await grammarDocs(page);
  expect(docs).toHaveLength(1);
  expect(docs[0]).toMatchObject({ type: 'Grammar course', skill: 'grammar', lesson: 'g1', lessonNo: 1, level: 'beginner', total: 20, correct: 20,
    score: 100, name: 'Alice Test', studentId: '10001' });
  expect(docs[0].timeSeconds).toBeGreaterThan(0);
  expect(docs[0].answers).toHaveLength(20);
  expect(docs[0].answers[0]).toMatchObject({ right: 'am', ok: true });
  expect(await page.evaluate(c => localStorage.getItem('ta_grammar_draft|' + c), CODE)).toBeNull();
  expect(await kept(page)).toEqual([]);
  expect(errors).toEqual([]);
});

test('a retake shows a score and sends nothing; its questions are shuffled', async ({ page, context }) => {
  test.setTimeout(60000);
  await setup(context);
  await context.addInitScript(() => { window.__grSeed = 7; });
  await start(page);
  await toTest(page);
  const firstQ = await page.locator('.gr-tq .gr-qtext').first().textContent();
  await answer(page, '.gr-tq');
  await page.locator('#grSubmit').click();
  await expect(page.locator('#grSend')).toContainText('Saved ✅');
  await page.locator('#grRetake').click();
  await expect(page.locator('.gr-tq')).toHaveCount(20);
  expect(await page.locator('.gr-tq .gr-qtext').first().textContent()).not.toBe(firstQ);
  await answer(page, '.gr-tq', true);
  await page.locator('#grSubmit').click();
  await expect(page.locator('.gr-score')).toBeVisible();
  await expect(page.locator('#grSend')).toHaveCount(0);
  const docs = await grammarDocs(page);
  expect(docs).toHaveLength(1);
  expect(docs[0].correct).toBe(20);
});

test('reload in the middle continues where the student was, and the time doesn\'t go back', async ({ page, context }) => {
  test.setTimeout(60000);
  await setup(context);
  await start(page);
  await page.locator('#grPractise').click();
  await practisePart(page);
  await page.locator('#grPractise').click();
  await expect(page.locator('.gr-practise')).toHaveAttribute('data-chunk', '1');
  await page.waitForTimeout(300);
  await page.locator('.gr-practise').click();
  const before = await page.evaluate(() => { window.GR.save(); return window.GR.activeMs(); });
  expect(before).toBeGreaterThan(0);
  await start(page);
  await expect(page.locator('.gr-practise')).toHaveAttribute('data-chunk', '1');
  expect(await page.evaluate(() => window.GR.activeMs())).toBeGreaterThanOrEqual(before);
});

test('a hidden page doesn\'t add time, and idling adds at most 5 minutes', async ({ page, context }) => {
  await setup(context);
  await context.addInitScript(() => { window.__grClock = 1e12; });
  await start(page);
  await expect(page.locator('.gr-learn')).toBeVisible();
  const setVis = v => page.evaluate(v => {
    Object.defineProperty(document, 'visibilityState', { value: v, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  }, v);
  await page.evaluate(() => { window.__grClock += 60000; document.body.dispatchEvent(new Event('pointerdown', { bubbles: true })); });
  const t0 = await page.evaluate(() => window.GR.activeMs());
  expect(t0).toBeGreaterThanOrEqual(60000);
  await setVis('hidden');
  await page.evaluate(() => { window.__grClock += 600000; });
  expect(await page.evaluate(() => window.GR.activeMs())).toBe(t0);
  await setVis('visible');
  await page.evaluate(() => { window.__grClock += 360000; });
  const t1 = await page.evaluate(() => window.GR.activeMs());
  expect(t1 - t0).toBeLessThanOrEqual(300000);
  expect(t1 - t0).toBeGreaterThan(0);
  expect(await page.evaluate(() => [window.GR.formatTime(26 * 60), window.GR.formatTime(65 * 60)])).toEqual(['26 min', '1 h 05 min']);
});

test('opening the link again after the result is saved → "You\'ve done this lesson"; retake and re-read send nothing', async ({ page, context }) => {
  test.setTimeout(60000);
  const done = { __id: 'sk_GRM111_10001_1', v: 1, type: 'Grammar course', code: CODE, skill: 'grammar', lesson: 'g1', lessonNo: 1, name: 'Alice Test',
    studentId: '10001', correct: 17, total: 20, score: 85, date: '2026-11-16T09:00:00.000Z' };
  await setup(context, { docs: [classDoc(CODE), done] });
  await start(page);
  await expect(page.locator('.gr-done')).toContainText('You\'ve done this lesson — 17/20');
  await expect(page.locator('#grReread')).toBeVisible();
  await page.locator('#grRetake').click();
  await answer(page, '.gr-tq');
  await page.locator('#grSubmit').click();
  await expect(page.locator('.gr-score')).toContainText('20/20');
  await page.locator('#grReread').click();
  await expect(page.locator('.gr-learn h2')).toHaveText('I am, you are, she is');
  expect(await grammarDocs(page)).toHaveLength(1);
  expect(await page.evaluate(() => window.__writes.length)).toBe(0);
});

test('a first Submit that fails is kept; a retake doesn\'t replace it', async ({ page, context }) => {
  test.setTimeout(60000);
  await setup(context);
  await start(page);
  await toTest(page);
  await answer(page, '.gr-tq');
  await page.evaluate(() => { window.__failWrites = 1000; });
  await page.locator('#grSubmit').click();
  await expect(page.locator('#grSend')).toContainText('📤 Send my answers', { timeout: 20000 });
  expect(await grammarDocs(page)).toHaveLength(0);
  await page.locator('#grRetake').click();
  await answer(page, '.gr-tq', true);
  await page.locator('#grSubmit').click();
  await expect(page.locator('.gr-score')).toBeVisible();
  const k = await kept(page);
  expect(k).toHaveLength(1);
  expect(k[0]).toMatchObject({ type: 'Grammar course', correct: 20 });
  // the internet is back: the first try reaches the teacher
  await page.evaluate(() => { window.__failWrites = 0; });
  await page.getByRole('button', { name: '📤 Send my answers' }).click();
  await expect.poll(() => grammarDocs(page).then(d => d.length)).toBe(1);
  expect((await grammarDocs(page))[0].correct).toBe(20);
});

test('an old draft with another content version starts again but keeps the time', async ({ page, context }) => {
  await setup(context, { storage: { ['ta_grammar_draft|' + CODE]: JSON.stringify({ v: 0, lesson: 'g1', studentId: '10001', chunk: 2, stage: 'practise', q: 3,
    activeMs: 600000, answers: [] }) } });
  await start(page);
  await expect(page.locator('.gr-learn h2')).toHaveText('I am, you are, she is');
  expect(await page.evaluate(() => window.GR.activeMs())).toBeGreaterThanOrEqual(600000);
});

test('another student\'s draft on a shared phone isn\'t used', async ({ page, context }) => {
  await setup(context, { storage: { ['ta_grammar_draft|' + CODE]: JSON.stringify({ v: 1, lesson: 'g1', studentId: '10002', chunk: 2, stage: 'practise', q: 3,
    activeMs: 600000, answers: [] }) } });
  await start(page);
  await expect(page.locator('.gr-learn h2')).toHaveText('I am, you are, she is');
  expect(await page.evaluate(() => window.GR.activeMs())).toBeLessThan(600000);
});

test('preview sends nothing and has no ID card', async ({ page, context }) => {
  test.setTimeout(60000);
  await setup(context);
  await page.goto('/skill.html?s=grammar&gl=g1&preview=1');
  await expect(page.locator('#skIdInput')).toHaveCount(0);
  await expect(page.locator('.gr-learn h2')).toHaveText('I am, you are, she is');
  await toTest(page);
  await answer(page, '.gr-tq');
  await page.locator('#grSubmit').click();
  await expect(page.locator('.gr-score')).toContainText('20/20');
  await expect(page.locator('#grSend')).toContainText('Preview');
  expect(await page.evaluate(() => (window.__writes || []).length)).toBe(0);   // the database isn't even loaded
  expect(await page.evaluate(() => Object.keys(localStorage).filter(k => /^ta_grammar_draft|^ta_skill_unsent/.test(k)))).toEqual([]);
});

test('a missing lesson → "This lesson doesn\'t exist"; fits a phone with no sideways scrolling', async ({ page, context }) => {
  await setup(context);
  await page.goto('/skill.html?s=grammar&gl=g99&c=' + CODE);
  await expect(page.locator('body')).toContainText('doesn\'t exist');
  await page.setViewportSize({ width: 375, height: 760 });
  await start(page);
  await page.locator('#grPractise').click();
  for (let i = 0; i < 4; i++) { await answer(page, '.gr-pq'); if (await page.locator('#grCheck').isVisible()) await page.locator('#grCheck').click(); await page.locator('#grNext').click(); }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('the teacher\'s grammar CSS doesn\'t leak into the student page: the "done" card fits 375 px', async ({ page, context }) => {
  test.setTimeout(60000);
  const done = { __id: 'sk_GRM111_10001_1', v: 1, type: 'Grammar course', code: CODE, skill: 'grammar', lesson: 'g1', lessonNo: 1, name: 'Alice Test',
    studentId: '10001', correct: 17, total: 20, score: 85, date: '2026-11-16T09:00:00.000Z' };
  await page.setViewportSize({ width: 375, height: 700 });
  await setup(context, { docs: [classDoc(CODE), done] });
  await start(page);
  await expect(page.locator('.gr-done')).toContainText('You\'ve done this lesson');
  const r = await page.evaluate(() => {
    const card = document.querySelector('.gr-done');
    return { ws: getComputedStyle(card).whiteSpace, shadow: getComputedStyle(card).boxShadow,
      over: [card, ...card.querySelectorAll('*')].filter(e => e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0).map(e => e.tagName + '.' + e.className) };
  });
  expect(r.ws).not.toBe('nowrap');
  expect(r.over).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});
