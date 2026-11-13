// The teacher's rules for the rewritten Listening Journey, Steps 8–20 (2026-11-13: "listening is a little weird" — up to 15 spelled
// words, 5 named people, questions jumping back and forth, six temperatures in a row). Spec:
// docs/superpowers/specs/2026-11-13-listening-journey-8-20-rewrite-design.md. NEW grows as the steps are rewritten.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { prepare } = require('./support/app');

const NEW = [8, 9, 10, 11];
const COUNT = { 8: 14, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 19, 19: 20, 20: 20 };
const ROLES = /^(Speaker|Presenter|Host|Interviewer|Guide|Teacher|Reporter|Assistant|Customer|Announcer|Narrator|Coach|Receptionist|Driver|Manager|Shop assistant|Staff)$/i;

const root = path.join(__dirname, '..');
const SCRIPTS = JSON.parse(fs.readFileSync(path.join(root, 'audio/skills/listening-journey-scripts.json'), 'utf8'));
const QS = JSON.parse(fs.readFileSync(path.join(root, 'docs/listening-journey-questions.json'), 'utf8'));
// the recording tool's patterns (tools/make-course-audio.py)
const SPELLING = /^\s*(?:(?:double )?[A-Z]\.\s*)+$/;
const DIGIT = '(?:double oh|double \\w+|oh|zero|one|two|three|four|five|six|seven|eight|nine)';
const PHONE = new RegExp(DIGIT + '(?:,? ' + DIGIT + '){5,}', 'i');
const DIGITS = { oh: '0', zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9' };
const spokenDigits = text => (text.match(PHONE)[0].toLowerCase().match(new RegExp(DIGIT, 'g')) || [])
  .map(d => d.startsWith('double ') ? DIGITS[d.slice(7)].repeat(2) : DIGITS[d]).join('');
const spelledWord = line => line.match(/(?:double )?[A-Z]/g).map(x => x.startsWith('double ') ? x.slice(-1) + x.slice(-1) : x).join('').toLowerCase();
const lettersOf = s => String(s).toLowerCase().replace(/[^a-z]/g, '');
const MONTH = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/i;
const kindOf = q => {
  const all = q.a || [];
  if (/°C/.test(q.q)) return 'temperature';
  if (/\$|\bcosts?\b|\bprice\b/i.test(q.q) || all.some(x => /^\$/.test(x))) return 'price';
  if (all.some(x => /^\d{1,2}[:.]\d{2}$/.test(x)) || /\b[ap]\.m\.|\bPM\b|\bAM\b/.test(q.q)) return 'time';
  if (all.some(x => /^\d{1,2}(st|nd|rd|th)$/i.test(x) || MONTH.test(x)) || /_____ of /.test(q.q)) return 'date';
  return '';
};

for (const no of NEW) {
  test(`Step ${no}: 1–2 spelled words (Q1, then Q5+), one spelled number, questions in order, no look-alikes, ≤ 2 names`, async ({ page, context }) => {
    await prepare(context);
    const id = no <= 10 ? 'b' + no : 'e' + (no - 10);
    await page.goto('/skill.html?s=listening&st=' + id + '&preview=1');
    const L = await page.evaluate(id => TA_SKILLS.steps.find(s => s.id === id).listening, id);
    const lines = SCRIPTS[no - 1].lines.map(l => l[1]);
    const Q = L.questions;
    expect(Q, 'question count').toHaveLength(COUNT[no]);

    // spelled words: 1–2, each one word; Q1 is the first; a second is Q5 or later
    const spelled = lines.filter(t => SPELLING.test(t)).map(spelledWord);
    expect(spelled.length, 'spelled words ' + spelled.join(', ')).toBeGreaterThanOrEqual(1);
    expect(spelled.length, 'spelled words ' + spelled.join(', ')).toBeLessThanOrEqual(2);
    const spelledQ = spelled.map(w => Q.findIndex(q => q.type === 'gap' && lettersOf(q.a[0]) === w && !/\s/.test(q.a[0].trim())) + 1);
    expect(spelledQ[0], 'the first spelled word is Question 1').toBe(1);
    if (spelled.length === 2) expect(spelledQ[1], 'the second spelled word is Question 5 or later').toBeGreaterThanOrEqual(5);

    // one spelled number (a phone/ticket number said digit by digit), asked once, not next to a spelled word
    // (said once and read back by the other speaker: one number, maybe two lines)
    const phones = [...new Set(lines.filter(t => PHONE.test(t)).map(spokenDigits))];
    expect(phones, 'one spelled number').toHaveLength(1);
    const digits = phones[0];
    const phoneQ = Q.map((q, i) => (q.a || []).some(x => String(x).replace(/\D/g, '') === digits) ? i + 1 : 0).filter(Boolean);
    expect(phoneQ, 'one question asks for the spelled number').toHaveLength(1);
    spelledQ.forEach(n => expect(Math.abs(n - phoneQ[0]), 'the number isn\'t next to a spelled word').toBeGreaterThan(1));

    // in the order of the recording
    const para = Q.map((q, k) => L.transcript.findIndex(t => t.answers.includes(k + 1)));
    para.forEach((p, k) => { if (k) expect(p, `Q${k + 1} comes after Q${k}`).toBeGreaterThanOrEqual(para[k - 1]); });

    // no look-alikes: at most one price, clock time, temperature, date; no answer twice
    const kinds = Q.map(kindOf).filter(Boolean);
    ['price', 'time', 'temperature', 'date'].forEach(k => expect(kinds.filter(x => x === k).length, 'answers of kind ' + k).toBeLessThanOrEqual(1));
    const answers = Q.filter(q => q.type !== 'tf').map(q => String(q.a[0]).toLowerCase());
    expect(new Set(answers).size, 'no answer asked twice').toBe(answers.length);

    // at most 2 named people; every other speaker is a role
    const src = QS.find(s => s.no === no);
    expect(src.inOrder).toBe(true);
    expect(src.names.length).toBeGreaterThanOrEqual(1);
    expect(src.names.length).toBeLessThanOrEqual(2);
    L.transcript.forEach(t => expect(src.names.includes(t.who) || ROLES.test(t.who), 'speaker ' + t.who).toBe(true));

    // a clock time can be written more than one way
    Q.filter(q => q.type === 'gap' && kindOf(q) === 'time').forEach(q => expect(q.a.length).toBeGreaterThanOrEqual(2));

    // students type it their way: Q1 letter by letter, the number without spaces → still full marks
    const rows = page.locator('.sk-q');
    for (let i = 0; i < Q.length; i++) {
      const q = Q[i];
      if (q.type === 'gap') {
        const v = i + 1 === spelledQ[0] ? q.a[0].toUpperCase().split('').join('-') : i + 1 === phoneQ[0] ? digits : q.a[0];
        await rows.nth(i).locator('input').fill(v);
      } else if (q.type === 'open') await rows.nth(i).locator('input').fill('I think ' + q.keys[0]);
      else await rows.nth(i).locator('.sk-opt[data-val="' + q.a[0] + '"]').click();
    }
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.locator('.sk-score')).toContainText(Q.length + ' / ' + Q.length);
  });
}
