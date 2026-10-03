const { test } = require('@playwright/test');
const { prepare, hideNotices, template } = require('./support/app');
test('perf', async ({ page, context }) => {
  test.setTimeout(120000);
  const groups = [{ id: 'g1', name: 'Target' }, { id: 'g2', name: 'Apex' }];
  const roster = Array.from({ length: 40 }, (_, i) => ({ id: String(57000 + i), name: 'Student ' + i, group: i % 2 ? 'g1' : 'g2' }));
  const fileHtml = template('SENTENCES_TEMPLATE', { WORDS_JSON: '[]', SENTENCE_COUNT: '3', INSTRUCTIONS_JSON: '""', PICTURE_DATA: '' });
  const ex = [], cache = {}, docs = [];
  const types = ['Sentences', 'Flashcard', 'Dictation', 'Word Order'];
  for (let e = 0; e < 20; e++) {
    const code = String(300000 + e), uid = 'ux' + e;
    ex.push({ uid, title: 'Exercise ' + e, typeLabel: types[e % 4], code, groupId: e % 2 ? 'g1' : 'g2', date: new Date(Date.now() - e * 86400000).toISOString(), builderTab: 'spelling', builderState: { v: 1, fields: {}, rows: [['house', []]] } });
    if (e < 15) cache[uid] = fileHtml;
    roster.forEach((st, k) => { if ((k + e) % 3) docs.push({ __id: 'r' + e + '_' + k, v: 1, code, type: types[e % 4], title: 'Exercise ' + e, name: st.name, studentId: st.id, score: 50 + (k % 50), timeSeconds: 100 + k, timeDisplay: '01:40', date: new Date(Date.now() - e * 86400000 - k * 1000).toISOString(), submittedAt: new Date(Date.now() - e * 86400000).toISOString(), sentences: [{ word: '', text: 'I like it.' }] }); });
  }
  await prepare(context, { docs, storage: { ta_student_groups: JSON.stringify(groups), ta_points_roster: JSON.stringify(roster), ta_recent_exercises: JSON.stringify(ex), ta_exercise_html_cache: JSON.stringify(cache) } });
  await page.goto('/index.html'); await page.waitForTimeout(4000); await hideNotices(page);
  const out = ['docs ' + docs.length];
  for (const round of [1, 2]) for (const tab of ['createpicker','myexercises','dashboard','students','points','settings','main']) {
    const t = await page.evaluate(async (tab) => {
      const t0 = performance.now();
      document.querySelector('.side-btn[data-tab="' + tab + '"]').click();
      for (let i = 0; i < 2000; i++) { const p = document.getElementById('panel-' + tab); if (p && p.classList.contains('active')) break; await new Promise(r => setTimeout(r, 5)); }
      const t1 = performance.now();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      return [Math.round(t1 - t0), Math.round(performance.now() - t0)];
    }, tab);
    out.push(round + ' ' + tab + ' ' + t.join('/'));
  }
  require('fs').writeFileSync('/tmp/claude-0/-home-user-teachers-assistant/be69a70c-7160-51f4-ac06-e15bdbeb3320/scratchpad/perf.txt', out.join('\n'));
});
