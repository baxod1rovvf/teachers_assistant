// The Listening Journey (teacher, 2026-11-10): 20 recordings with the teacher's questions (a/b/c, True/False, gaps,
// spellings, short answers, matching) — made by tools/build-listenings.js from docs/listening-journey-*.json.
const { test, expect } = require('@playwright/test');
const { prepare } = require('./support/app');
const PLAN = [10, 10, 10, 11, 12, 13, 13, 14, 14, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20];   // the teacher's question counts

test('all 20 steps: the teacher\'s recording, question counts, a heading for every group, and each answer found in the script', async ({ page, context, request }) => {
  await prepare(context);
  await page.goto('/skill.html?s=listening&st=b1&preview=1');
  const steps = await page.evaluate(() => TA_SKILLS.steps.map(s => s.listening));
  expect(steps).toHaveLength(20);
  for (let i = 0; i < 20; i++) {
    const L = steps[i];
    expect(L.src).toMatch(new RegExp('^audio/skills/listen-step-' + (i + 1) + '\\.mp3\\?v=\\d+$'));
    expect(L.questions, 'step ' + (i + 1)).toHaveLength(PLAN[i]);
    expect(L.intro).toContain('Then answer the ' + PLAN[i] + ' questions.');
    L.questions.forEach((q, k) => {
      expect(['choose', 'tf', 'gap', 'open']).toContain(q.type);
      expect(q.sec).toBeTruthy();
      expect(q.a.length).toBeGreaterThan(0);
      if (q.type === 'choose') expect(q.opts).toContain(q.a[0]);
      if (q.type === 'tf') expect(['True', 'False']).toContain(q.a[0]);
      if (q.type === 'gap') expect(q.q).toContain('_____');
      if (q.type === 'open') expect(q.keys.length).toBeGreaterThan(0);
      // "Analyze >" marks exactly one paragraph for every question
      expect(L.transcript.filter(t => t.answers.includes(k + 1)), `step ${i + 1} Q${k + 1}`).toHaveLength(1);
    });
    L.transcript.forEach(t => { expect(t.who).toBeTruthy(); expect(typeof t.man).toBe('boolean'); });
    const res = await request.get('/' + L.src.split('?')[0]);
    expect(res.status()).toBe(200);
    expect((await res.body()).length).toBeGreaterThan(500000);
  }
  // the teacher's mix: every kind is used, and the steps don't all use the same mix
  // (Steps 1–7, the teacher's own mixes; Steps 8–20 follow the 2026-11-13 rules instead — blocks in recording order —
  // checked by tests/listening-rules.spec.js)
  const mixes = new Set(steps.slice(0, 7).map(L => [...new Set(L.questions.map(q => q.sec))].join('|')));
  expect(mixes.size).toBeGreaterThan(4);
});

test('Steps 11–20 can be done with full marks; a spelled name counts letter by letter, a wrong letter doesn\'t', async ({ page, context }) => {
  test.setTimeout(120000);
  await prepare(context);
  for (const id of ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10']) {
    await page.goto('/skill.html?s=listening&st=' + id + '&preview=1');
    const L = await page.evaluate(id => TA_SKILLS.steps.find(s => s.id === id).listening, id);
    const rows = page.locator('.sk-q');
    for (let i = 0; i < L.questions.length; i++) {
      const q = L.questions[i];
      if (q.type === 'gap') await rows.nth(i).locator('input').fill(q.a[0]);
      else if (q.type === 'open') await rows.nth(i).locator('input').fill('I think ' + q.keys[0]);
      else await rows.nth(i).locator('.sk-opt[data-val="' + q.a[0] + '"]').click();
    }
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-score'), id).toContainText(L.questions.length + ' / ' + L.questions.length);
  }
  const marks = await page.evaluate(() => [skMark('G-R-E-E-N', ['Green']), skMark('w i l l o w  c r e e k', ['Willow Creek']), skMark('G-R-E-N', ['Green']),
    skMark('$18.50', ['18.50']), skMark('−3', ['-3']), skMark('Room 14', ['14', 'Room 14'])]);
  expect(marks).toEqual([true, true, false, true, true, true]);
});
