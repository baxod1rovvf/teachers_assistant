// Puts the Dictation Journey (docs/dictation-journey.md — 100 passages under 5 "# Level N — Name" headings, 20 each) into js/dictation-data.js
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
// "## Dictation N — Title": N is the passage's fixed id (dN — its recordings and links); its place in the journey (1–100) is shown as "Dictation <place>".
// The teacher rebuilt the journey on 2026-11-21 (kept 50 of the first passages, added 50 harder ones as 101–150), so ids skip numbers.
function passages(md) {
  const items = [], re = /^(?:# Level (\d+)[^\n]*|## Dictation (\d+) — ([^\n]+)\n([\s\S]+?)(?=\n\n|$(?![\s\S])))/gm;
  let m, level = 0;
  while ((m = re.exec(md))) {
    if (m[1]) { level = +m[1]; continue; }
    items.push({ num: +m[2], level, title: m[3].trim(), text: m[4].trim() });
  }
  return items;
}

const errors = [];
const items = passages(fs.readFileSync(path.join(root, 'docs', 'dictation-journey.md'), 'utf8'));
if (items.length !== 100) errors.push('expected 100 passages, found ' + items.length);
const seen = new Set();
items.forEach((it, i) => {
  it.no = i + 1;
  if (seen.has(it.num)) errors.push('Dictation ' + it.num + ' appears twice');
  seen.add(it.num);
  if (it.level !== Math.floor(i / 20) + 1) errors.push('Dictation ' + it.num + ' (place ' + it.no + ') is under Level ' + it.level + ' — each level needs exactly 20');
  if (!it.title) errors.push('Dictation ' + it.num + ' has no title');
  it.sentences = sentences(it.text);
  if (!it.sentences.length) errors.push('Dictation ' + it.num + ' has no sentences');
  if (it.sentences.join(' ').replace(/\s+/g, ' ') !== it.text.replace(/\s+/g, ' ')) errors.push('Dictation ' + it.num + ': sentences do not add up to the text');
});
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

const levels = LEVELS.map(([id, name], li) => ({
  id, name,
  items: items.slice(li * 20, li * 20 + 20).map(it => ({ id: 'd' + it.num, no: it.no, title: it.title, text: it.text, sentences: it.sentences,
    recorded: fs.existsSync(path.join(root, 'audio', 'dictation', 'd' + it.num + '.mp3')) }))   // dN.mp3 (the whole passage) is written last by the recording tool
}));
const total = items.reduce((n, it) => n + it.sentences.length, 0);
const out = '// made by tools/build-dictations.js from docs/dictation-journey.md — don\'t edit by hand\n' +
  'window.TA_DICTATION = ' + JSON.stringify({ levels }, null, 1) + ';\n';
fs.writeFileSync(path.join(root, 'js', 'dictation-data.js'), out);
console.log('dictation-data.js: ' + items.length + ' passages, ' + total + ' sentences, ' + levels.reduce((n, l) => n + l.items.filter(i => i.recorded).length, 0) + ' recorded');
