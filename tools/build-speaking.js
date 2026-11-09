// Puts the Speaking Journey for Steps 11–20 (docs/speaking-journey-11-20.json — the teacher's words with Uzbek meanings,
// 2026-11-09) into js/skills-data.js: each step's `speaking: { … }` is replaced (Part 2 keeps its seconds), or added after
// the writing for steps that had none (Steps 19–20, 90 s). Run `node tools/build-speaking.js` after editing the JSON.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const J = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'speaking-journey-11-20.json'), 'utf8'));
const file = path.join(root, 'js', 'skills-data.js');
let src = fs.readFileSync(file, 'utf8');
const q = v => JSON.stringify(v);
function blockEnd(from) {   // index of the } that closes the { at/after `from`
  let i = src.indexOf('{', from), depth = 0, inStr = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); continue; }   // a comment ("teacher's")
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) return i; }
  }
  throw new Error('unclosed block');
}
for (const s of J) {
  const id = 'e' + (s.no - 10), I = '        ';
  if (s.words.length !== 10 || s.questions.length !== 5) throw new Error(id + ': needs 10 words and 5 questions');
  const at = src.search(new RegExp("id: '" + id + "'"));
  if (at < 0) throw new Error('no step ' + id);
  const next = src.indexOf("id: '", at + 5);
  const inStep = k => k > 0 && (next < 0 || k < next);
  const s0 = src.indexOf('speaking: {', at);
  let seconds = 90;
  if (inStep(s0)) { const m = /seconds:\s*(\d+)/.exec(src.slice(s0, blockEnd(s0))); if (m) seconds = +m[1]; }
  const lit = 'speaking: {\n' +
    I + "// the teacher's Speaking Journey (2026-11-09) — made by tools/build-speaking.js from docs/speaking-journey-11-20.json\n" +
    I + 'topic: ' + q(s.topic) + ',\n' +
    I + 'words: [\n' + s.words.map(([w, uz, emoji, ex]) => I + '  { w: ' + q(w) + ', uz: ' + q(uz) + ', emoji: ' + q(emoji) + ', ex: ' + q(ex) + ' }').join(',\n') + '\n' + I + '],\n' +
    I + 'questions: [\n' + s.questions.map(([qq, use]) => I + '  { q: ' + q(qq) + ', use: ' + q(use) + ' }').join(',\n') + '\n' + I + '],\n' +
    I + 'part2: { topic: ' + q(s.part2[0]) + ', hints: ' + q(s.part2[1]) + ', seconds: ' + seconds + ' }\n' +
    '      }';
  if (inStep(s0)) src = src.slice(0, s0) + lit + src.slice(blockEnd(s0) + 1);
  else {
    const w0 = src.indexOf('writing: {', at);
    if (!inStep(w0)) throw new Error(id + ': no place for the speaking');
    const e = blockEnd(w0);
    src = src.slice(0, e + 1) + ',\n      ' + lit + src.slice(e + 1);
  }
}
fs.writeFileSync(file, src);
const T = new Function(src + '; return TA_SKILLS;')();
console.log(T.steps.map(s => s.no + ':' + (s.speaking ? (s.speaking.topic || '?') + '/' + s.speaking.part2.seconds + 's' : '—')).join(' | '));
