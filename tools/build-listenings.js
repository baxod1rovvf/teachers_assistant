// Puts the Listening Journey (the teacher's 20 listenings, 2026-11-10) into js/skills-data.js: each step's `listening: { … }`
// is replaced (Steps 19–20 get one, before their reading).
//   docs/listening-journey-steps-1-7.md, …-8-20.md   the teacher's files (scripts + questions + answer key)
//   docs/listening-journey-transcripts.json          the scripts as paragraphs (made by tools/listening-transcripts.py)
//   docs/listening-journey-questions.json            the questions + answers (edit this), each with a few words of the
//                                                    script that hold its answer ("Analyze >" highlights that paragraph)
//   audio/skills/listening-journey-scripts.json      what the voices say (tools/make-course-audio.py makes listen-step-N.mp3)
// Run `node tools/build-listenings.js` after editing the questions.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const read = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const TR = read('docs/listening-journey-transcripts.json'), QS = read('docs/listening-journey-questions.json');
const file = path.join(root, 'js', 'skills-data.js');
let src = fs.readFileSync(file, 'utf8');
const q = v => JSON.stringify(v);
const low = s => s.toLowerCase().replace(/[’‘]/g, "'");
function blockEnd(from) {
  let i = src.indexOf('{', from), depth = 0, inStr = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) return i; }
  }
  throw new Error('unclosed block');
}
// a gap's answer also counts with the word next to the blank: "Riverside" → "Riverside Park", "12" → "Room 12"
function withNeighbours(text, answers) {
  const [before, after] = text.split('_____');
  const b = (before.match(/([A-Za-z]+)\s*$/) || [])[1], a = (after || '').match(/^\s*([A-Za-z]+)/);
  const out = new Set(answers);
  answers.forEach(x => {
    if (a && !/^(of|in|on|at|a|the|and|for|to|from)$/i.test(a[1])) out.add(x + ' ' + a[1]);
    if (b && /^(Room|Platform|Route|number)$/i.test(b)) out.add(b + ' ' + x);
  });
  return [...out];
}
let total = 0;
for (const S of QS) {
  const T = TR.find(t => t.no === S.no);
  if (!T) throw new Error('no transcript for step ' + S.no);
  const transcript = T.transcript.map(p => ({ who: p.who === 'Speaker' && S.speaker ? S.speaker : p.who, man: p.man, text: p.text, answers: [] }));
  const questions = [];
  S.sections.forEach(sec => sec.qs.forEach(row => {
    const n = questions.length + 1;
    let item;
    if (sec.t === 'choose') {
      const [text, opts, ans, at] = row;
      if (!opts.includes(ans)) throw new Error(`step ${S.no} Q${n}: answer not among the options`);
      item = { type: 'choose', q: text, opts, a: [ans], at };
    } else if (sec.t === 'tf') {
      const [text, ans, at] = row;
      if (!/^(True|False)$/.test(ans)) throw new Error(`step ${S.no} Q${n}: True or False`);
      item = { type: 'tf', q: text, a: [ans], at };
    } else if (sec.t === 'open') {
      const [text, keys, at] = row;
      item = { type: 'open', q: text, keys, a: [keys[0]], at };
    } else {
      const [text, ans, at] = row;
      if (!text.includes('_____')) throw new Error(`step ${S.no} Q${n}: a gap needs _____`);
      item = { type: 'gap', q: text, a: withNeighbours(text, ans), at };
    }
    const where = transcript.findIndex(p => low(p.text).includes(low(item.at)));
    if (where < 0) throw new Error(`step ${S.no} Q${n}: "${item.at}" isn't in the script`);
    transcript[where].answers.push(n);
    delete item.at;
    item.sec = sec.h;
    questions.push(item);
  }));
  total += questions.length;
  const id = S.no <= 10 ? 'b' + S.no : 'e' + (S.no - 10), I = '        ';
  const lit = 'listening: {\n' +
    I + '// LISTENING JOURNEY — the teacher\'s (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json\n' +
    I + 'src: ' + q('audio/skills/listen-step-' + S.no + '.mp3?v=1') + ',\n' +
    I + 'title: ' + q(T.title) + ',\n' +
    I + 'intro: ' + q(S.intro + ' Then answer the ' + questions.length + ' questions.') + ',\n' +
    I + 'questions: [\n' + questions.map(x => I + '  ' + q(x)).join(',\n') + '\n' + I + '],\n' +
    I + 'transcript: [\n' + transcript.map(x => I + '  ' + q(x)).join(',\n') + '\n' + I + ']\n' +
    I + '// LISTENING JOURNEY END\n' +
    '      }';
  const at = src.search(new RegExp("id: '" + id + "'"));
  if (at < 0) throw new Error('no step ' + id);
  const next = src.indexOf("id: '", at + 5);
  const inStep = k => k > 0 && (next < 0 || k < next);
  const l0 = src.indexOf('listening: {', at);
  if (inStep(l0)) src = src.slice(0, l0) + lit + src.slice(blockEnd(l0) + 1);
  else {
    const r0 = src.indexOf('reading: {', at);
    if (!inStep(r0)) throw new Error(id + ': no place for the listening');
    src = src.slice(0, r0) + lit + ',\n      ' + src.slice(r0);
  }
}
fs.writeFileSync(file, src);
const T = new Function(src + '; return TA_SKILLS;')();
console.log(T.steps.map(s => s.no + ':' + (s.listening ? s.listening.questions.length + 'q' : '—')).join(' '), '· total', total);
