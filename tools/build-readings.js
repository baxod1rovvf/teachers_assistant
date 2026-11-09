// Puts the Reading Journey (docs/reading-journey.json — the 20 readings the teacher approved on 2026-11-09) into
// js/skills-data.js: each step's `reading: { … }` is replaced (or added, for steps that had none).
// Run `node tools/build-readings.js` after editing docs/reading-journey.json (the teacher's document
// docs/reading-journey.md is made from the same data).
//
// A reading in the course: { title, text, words: [{w, uz, emoji, ex}], questions, retell }
//   - words: the teacher's 10 words with their Uzbek meaning; `ex` = the sentence of the text the word is in (found here)
//   - questions in this order: tf (Steps 1–10) / tfng (Steps 11–20), then gap, then open (WH-questions)
//       tf / tfng: { type, q, a: ['True' | 'False' | 'Not given'], line }
//       gap:       { type: 'gap', q (with _____), a: [accepted words], line }
//       open:      { type: 'open', q, keys: [main words — an answer with one of them is right], line }
//     line = the sentence (text.trim().split(/(?<=[.!?])\s+/)[line]) the answer is in — Analyze marks it
//   - retell: the retelling instruction ("Try to use at least 5 vocabulary items…" is added by the page)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const J = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'reading-journey.json'), 'utf8'));
const file = path.join(root, 'js', 'skills-data.js');
let src = fs.readFileSync(file, 'utf8');

const sentencesOf = text => text.trim().split(/(?<=[.!?])\s+/);
const lineOf = (sents, snippet, where) => {
  const i = sents.findIndex(s => s.includes(snippet));
  if (i < 0) throw new Error(where + ': no sentence has "' + snippet + '"');
  return i;
};
// the sentence a word or phrase is in: each of its words by its first letters, in order (move → moved, tried … on)
const IRREG = { be: 'was|were|is|are|be', break: 'broke|break', win: 'won|win', go: 'went|go', pay: 'paid|pay', feel: 'felt|feel', have: 'ha[sd]|have|having', make: 'make|made', take: 'take|took', keep: 'keeps?|kept', rise: 'rises?|rose', try: 'tr(?:y|ied|ies)' };
const stem = w => w.replace(/(ing|ed|es|s|e)$/, '').slice(0, Math.max(3, Math.min(5, w.length - 1)));
function sentenceWith(sents, phrase) {
  const ws = phrase.toLowerCase().split(/\s+/).filter(w => !['a', 'an', 'the'].includes(w));
  const pat = ws.map(w => '(?:' + (IRREG[w] || stem(w).replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')) + ')[a-z\'’-]*').join('(?:\\s+\\S+){0,3}?\\s+');
  const re = new RegExp('(^|[^a-z])' + pat, 'i');
  return sents.find(s => re.test(s)) || '';
}

const q = v => JSON.stringify(v);
for (const s of J) {
  const id = s.no <= 10 ? 'b' + s.no : 'e' + (s.no - 10);
  const where = 'Step ' + s.no;
  const sents = sentencesOf(s.text);
  const questions = [
    ...s.tf.map(([qq, a, snip]) => ({ type: s.no > 10 ? 'tfng' : 'tf', q: qq, a: [a], line: lineOf(sents, snip, where) })),
    ...(s.gap || []).map(([qq, a, snip]) => ({ type: 'gap', q: qq, a, line: lineOf(sents, snip, where) })),
    ...(s.open || []).map(([qq, keys, snip]) => ({ type: 'open', q: qq, keys, line: lineOf(sents, snip, where) }))
  ];
  const words = s.words.map(([w, uz, emoji]) => {
    const ex = sentenceWith(sents, w);
    if (!ex) throw new Error(where + ': the word "' + w + '" is not in the text');
    return { w, uz, emoji, ex };
  });
  const I = '        ';
  const lit = 'reading: {\n' +
    I + '// the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json\n' +
    I + 'title: ' + q(s.title) + ',\n' +
    I + 'text: ' + s.text.split('\n\n').map((p, i, all) => q(p + (i < all.length - 1 ? '\n\n' : ''))).join(' +\n' + I + '  ') + ',\n' +
    I + 'words: [\n' + words.map(o => I + '  { w: ' + q(o.w) + ', uz: ' + q(o.uz) + ', emoji: ' + q(o.emoji) + ', ex: ' + q(o.ex) + ' }').join(',\n') + '\n' + I + '],\n' +
    I + 'questions: [\n' + questions.map(o => I + '  { ' + Object.entries(o).map(([k, v]) => k + ': ' + q(v)).join(', ') + ' }').join(',\n') + '\n' + I + '],\n' +
    I + 'retell: ' + q(s.retell) + '\n' +
    '      }';
  const at = src.search(new RegExp("id: '" + id + "'"));
  if (at < 0) throw new Error('no step ' + id);
  const next = src.indexOf("id: '", at + 5);
  const r0 = src.indexOf('reading: {', at);
  if (r0 > 0 && (next < 0 || r0 < next)) {
    // replace the old reading block (matching braces, skipping strings)
    let i = r0 + 'reading: '.length, depth = 0, inStr = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
      if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
      if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) break; }
    }
    src = src.slice(0, r0) + lit + src.slice(i + 1);
  } else {
    // a step with no reading yet (Steps 19–20 were stubs): one-line `{ id: 'e9', … }` → add the reading
    const end = src.indexOf('}', at);
    src = src.slice(0, end).replace(/\s*$/, '') + ',\n      ' + lit + '\n    ' + src.slice(end);
  }
}
fs.writeFileSync(file, src);
const T = new Function(src + '; return TA_SKILLS;')();
console.log(T.steps.map(s => s.no + ':' + (s.reading ? s.reading.questions.length + 'q' : '—')).join(' '));
