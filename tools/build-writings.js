// Puts the Writing Journey (docs/writing-journey.json — the 20 writing tasks the teacher approved on 2026-11-09) into
// js/skills-data.js: each step's `writing: { … }` is replaced (or added, for steps that had none).
// Run `node tools/build-writings.js` after editing docs/writing-journey.json (docs/writing-journey.md is the readable copy).
//
// A writing task in the course: { topic, instruction, words: [{w, uz}], minWords, maxWords, minutes }
//   - words: the asked words — the student must use all of them (skAskedWords in skill-bands.js checks, other forms count)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const J = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'writing-journey.json'), 'utf8'));
const file = path.join(root, 'js', 'skills-data.js');
let src = fs.readFileSync(file, 'utf8');
const q = v => JSON.stringify(v);
for (const s of J) {
  const id = s.no <= 10 ? 'b' + s.no : 'e' + (s.no - 10);
  const I = '        ';
  const lit = 'writing: {\n' +
    I + '// the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json\n' +
    I + 'topic: ' + q(s.title) + ',\n' +
    I + 'instruction: ' + q(s.instruction) + ',\n' +
    I + 'words: [\n' + s.words.map(([w, uz]) => I + '  { w: ' + q(w) + ', uz: ' + q(uz) + ' }').join(',\n') + '\n' + I + '],\n' +
    I + 'minWords: ' + s.minWords + ', maxWords: ' + s.maxWords + ', minutes: ' + s.minutes + '\n' +
    '      }';
  const at = src.search(new RegExp("id: '" + id + "'"));
  if (at < 0) throw new Error('no step ' + id);
  const next = src.indexOf("id: '", at + 5);
  const w0 = src.indexOf('writing: {', at);
  if (w0 > 0 && (next < 0 || w0 < next)) {
    let i = w0 + 'writing: '.length, depth = 0, inStr = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
      if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
      if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) break; }
    }
    src = src.slice(0, w0) + lit + src.slice(i + 1);
  } else {
    // no writing yet (Steps 19–20): add it after the step's reading
    const r0 = src.indexOf('reading: {', at);
    if (r0 < 0 || (next > 0 && r0 > next)) throw new Error(id + ': no place for the writing');
    let i = r0 + 'reading: '.length, depth = 0, inStr = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
      if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
      if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) break; }
    }
    src = src.slice(0, i + 1) + ',\n      ' + lit + src.slice(i + 1);
  }
}
fs.writeFileSync(file, src);
const T = new Function(src + '; return TA_SKILLS;')();
console.log(T.steps.map(s => s.no + ':' + (s.writing ? s.writing.minWords + '-' + s.writing.maxWords + '/' + s.writing.minutes + 'm/' + s.writing.words.length + 'w' : '—')).join(' '));
