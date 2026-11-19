// Puts the Dictation Journey (docs/dictation-journey.md — the teacher's 100 passages) into js/dictation-data.js
// (window.TA_DICTATION, read by the student page and the Course page). Run `node tools/build-dictations.js` after editing the md;
// never edit dictation-data.js by hand. It checks everything first and stops (exit code 1, nothing written) when a rule is broken.
// Sentences are split EXACTLY like dictation_sentences() in tools/make-dictation-audio.py: sentence k of dN plays audio/dictation/dN-s<k>.mp3.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');

const LEVELS = [['beginner', 'Beginner'], ['elementary', 'Elementary'], ['preintermediate', 'Pre-intermediate'],
  ['intermediate', 'Intermediate'], ['advanced', 'Upper-intermediate & Advanced']];
const ABBR = '(?:Mr|Mrs|Ms|Dr|St|e\\.g|i\\.e|vs)';   // "6 p.m. Visitors" ends a sentence; "Mr Wilson" never does

function sentences(text) {
  const t = text.trim(), out = [], endAbbr = new RegExp('\\b' + ABBR + '\\.$');
  const re = /[.!?]["”’]?(?=\s+["“‘]?[A-Z0-9])/g;
  let start = 0, m;
  while ((m = re.exec(t))) {
    const end = m.index + m[0].length, before = t.slice(start, end);
    if (endAbbr.test(before)) continue;
    out.push(before.trim()); start = end;
  }
  if (t.slice(start).trim()) out.push(t.slice(start).trim());
  return out;
}
function passages(md) {
  const items = [], re = /^## Dictation (\d+) — ([^\n]+)\n([\s\S]+?)(?=\n\n|$(?![\s\S]))/gm;
  let m;
  while ((m = re.exec(md))) items.push({ no: +m[1], title: m[2].trim(), text: m[3].trim() });
  return items;
}

const errors = [];
const items = passages(fs.readFileSync(path.join(root, 'docs', 'dictation-journey.md'), 'utf8'));
if (items.length !== 100) errors.push('expected 100 passages, found ' + items.length);
items.forEach((it, i) => {
  if (it.no !== i + 1) errors.push('passage ' + (i + 1) + ' is numbered ' + it.no);
  if (!it.title) errors.push('Dictation ' + it.no + ' has no title');
  it.sentences = sentences(it.text);
  if (!it.sentences.length) errors.push('Dictation ' + it.no + ' has no sentences');
  if (it.sentences.join(' ').replace(/\s+/g, ' ') !== it.text.replace(/\s+/g, ' ')) errors.push('Dictation ' + it.no + ': sentences do not add up to the text');
});
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

const levels = LEVELS.map(([id, name], li) => ({
  id, name,
  items: items.slice(li * 20, li * 20 + 20).map(it => ({ id: 'd' + it.no, no: it.no, title: it.title, text: it.text, sentences: it.sentences }))
}));
const total = items.reduce((n, it) => n + it.sentences.length, 0);
const out = '// made by tools/build-dictations.js from docs/dictation-journey.md — don\'t edit by hand\n' +
  'window.TA_DICTATION = ' + JSON.stringify({ levels }, null, 1) + ';\n';
fs.writeFileSync(path.join(root, 'js', 'dictation-data.js'), out);
console.log('dictation-data.js: ' + items.length + ' passages, ' + total + ' sentences');
