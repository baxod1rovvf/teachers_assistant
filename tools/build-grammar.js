// Puts the Grammar Journey (docs/grammar-journey.json — the lessons the teacher approves) into js/grammar-data.js
// (window.TA_GRAMMAR, read by the student page and the Course page) and writes the teacher's readable copy
// docs/grammar-journey.md. Run `node tools/build-grammar.js` after editing the JSON; never edit grammar-data.js by hand.
// It checks every rule first and stops (exit code 1, nothing written) when one is broken.
//
// The JSON: { "<level id>": [lesson, …] } — only "beginner" has lessons for now. A lesson:
//   { no, title, v (content version: raise it when questions change, so old drafts on students' phones start again),
//     chunks: [{ title, rule, table? [[header…], [row…]…], examples [4–6], uz (one Uzbek line), practise [5 questions] }] (2–4),
//     test: [20 questions] — from Lesson 2 on, exactly 4 of them are { "from": "g<N>", "q": question } (an earlier lesson) }
// A question is a short list:
//   ["choose", question, [options], right option, hint?]
//   ["gap", question with ___, [accepted answers], hint?]
//   ["order", [words], the sentence (or [sentences] when more than one order is right), hint?]
//   ["fix", [sentences], the correct sentence, hint?]
// Every practise question has a hint (it points back to the rule); test questions have none.
//
// Out: TA_GRAMMAR = { v: 1, levels: [{ id, name, lessons: [{ id: 'g<no>', no, title, v,
//        chunks: [{ learn: { title, rule, table?, examples, uz }, practise: [Q] }], test: [Q] }] }] }
//      Q = { type, q, options? (choose/fix), words? (order), a: [accepted], hint?, from? }
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');

const LEVELS = [['beginner', 'Beginner'], ['elementary', 'Elementary'], ['preintermediate', 'Pre-Intermediate'],
  ['intermediate', 'Intermediate'], ['upperintermediate', 'Upper-Intermediate'], ['advanced', 'Advanced'], ['intensive', 'Intensive']];
const KIND = { choose: 'Choose', gap: 'Write', order: 'Put in order', fix: 'Correct sentence' };
const UZBEK = /Uzbek|Tashkent|Samarkand|Bukhara|Kamila|Jasur|Bobur|Nodira|Karimov|Aziz|Lola\b|Malika|Rustam|Laylo|Jamol|Bekzod|Sardor|Nilufar|Madina|Timur|Dilnoza|Karim\b|\bAli\b|harf|raqam|unli tovush|telefon|ikki marta|[ʻʼ‘’]/;
const CYRILLIC = /[Ѐ-ӿ]/;
const orderWords = s => s.replace(/[.?!]$/, '').split(' ').sort();

function question(t, where, errors) {
  if (!Array.isArray(t)) { errors.push(where + ': a question must be a list'); return null; }
  const [type] = t;
  const list = v => Array.isArray(v) ? v : [v];
  let Q;
  if (type === 'choose') Q = { type, q: t[1], options: t[2], a: [t[3]], hint: t[4] };
  else if (type === 'gap') Q = { type, q: t[1], a: list(t[2]), hint: t[3] };
  else if (type === 'order') Q = { type, q: 'Put the words in order.', words: t[1], a: list(t[2]), hint: t[3] };
  else if (type === 'fix') Q = { type, q: 'Which sentence is correct?', options: t[1], a: [t[2]], hint: t[3] };
  else { errors.push(where + ': unknown kind "' + type + '"'); return null; }
  if (Q.hint === undefined) delete Q.hint;
  const bad = m => errors.push(where + ' (' + JSON.stringify(t[1]) + '): ' + m);
  if (typeof Q.q !== 'string' || !Q.q.trim()) bad('no question');
  if (!Q.a.length || !Q.a.every(a => typeof a === 'string' && a.trim())) bad('no answer');
  if (Q.options) {
    if (!Array.isArray(Q.options) || Q.options.length < 2 || Q.options.length > 4) bad('needs 2–4 options');
    else {
      if (new Set(Q.options).size !== Q.options.length) bad('two options are the same');
      if (!Q.options.includes(Q.a[0])) bad('the answer "' + Q.a[0] + '" is not one of the options');
    }
  }
  if (type === 'gap' && !String(Q.q).includes('___')) bad('a gap question needs ___');
  if (type === 'order') {
    if (!Array.isArray(Q.words) || Q.words.length < 2) bad('needs at least 2 words');
    else Q.a.forEach(a => {
      if (JSON.stringify(orderWords(a)) !== JSON.stringify([...Q.words].sort())) bad('"' + a + '" does not use exactly its words');
    });
  }
  return Q;
}

function build(source) {
  const errors = [];
  const levels = LEVELS.map(([id, name]) => {
    const lessons = (source[id] || []).map((L, li) => {
      const id = 'g' + L.no, where = 'Lesson ' + L.no;
      if (!Number.isInteger(L.v) || L.v < 1) errors.push(where + ': v must be a whole number from 1');
      if (!L.chunks || L.chunks.length < 2 || L.chunks.length > 4) errors.push(where + ': needs 2–4 chunks');
      const chunks = (L.chunks || []).map((c, ci) => {
        const w = where + ' chunk ' + (ci + 1);
        if (!c.title || !c.rule) errors.push(w + ': needs a title and a rule');
        if (!c.uz || !String(c.uz).trim()) errors.push(w + ': needs its Uzbek line (uz)');
        if (!c.examples || c.examples.length < 4 || c.examples.length > 6) errors.push(w + ': needs 4–6 examples');
        if (c.table && c.table.some(r => r.length !== c.table[0].length)) errors.push(w + ': every table row needs ' + c.table[0].length + ' cells');
        if (!c.practise || c.practise.length !== 5) errors.push(w + ': needs 5 practise questions');
        const learn = { title: c.title, rule: c.rule };
        if (c.table) learn.table = c.table;
        learn.examples = c.examples;
        learn.uz = c.uz;
        const practise = (c.practise || []).map((t, qi) => {
          const Q = question(t, w + ' practise ' + (qi + 1), errors);
          if (Q && !Q.hint) errors.push(w + ' practise ' + (qi + 1) + ': needs a hint');
          return Q;
        });
        return { learn, practise };
      });
      if (!L.test || L.test.length !== 20) errors.push(where + ': the test needs 20 questions');
      const test = (L.test || []).map((t, qi) => {
        const w = where + ' test ' + (qi + 1);
        if (Array.isArray(t)) return question(t, w, errors);
        const n = Number(String(t.from).replace(/^g/, ''));
        if (!/^g\d+$/.test(t.from) || n < 1 || n >= L.no) errors.push(w + ': "from" must be an earlier lesson, not ' + t.from);
        const Q = question(t.q, w, errors);
        if (Q) Q.from = t.from;
        return Q;
      });
      const from = test.filter(Q => Q && Q.from).length;
      if (L.no === 1 ? from !== 0 : from !== 4) errors.push(where + ': the test needs ' + (L.no === 1 ? 'no' : 'exactly 4') + ' earlier-lesson questions (has ' + from + ')');
      if (new Set(test.filter(Boolean).map(Q => Q.type)).size !== 4) errors.push(where + ': the test needs all four kinds of question');
      return { id, no: L.no, title: L.title, v: L.v, chunks, test };
    });
    return { id, name, lessons };
  });
  const data = { v: 1, levels };
  // English only: Uzbek only in `uz`, no Cyrillic anywhere
  (function walk(v, key, where) {
    if (typeof v === 'string') {
      if (CYRILLIC.test(v)) errors.push(where + ': Cyrillic in "' + v + '"');
      if (key !== 'uz' && UZBEK.test(v)) errors.push(where + ': not English "' + v + '"');
    } else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, Array.isArray(v) ? key : k, where + '.' + k));
  })(data, '', 'TA_GRAMMAR');
  return { errors, data, js: toJs(data), md: toMd(data) };
}

// one question per line, so a change shows up as one line in the history
function toJs(data) {
  const s = v => JSON.stringify(v).replace(/<\//g, '<\\/');
  const qs = (list, ind) => '[\n' + list.map(Q => ind + '  ' + s(Q)).join(',\n') + '\n' + ind + ']';
  const lesson = L => '      {\n' +
    '        id: ' + s(L.id) + ', no: ' + L.no + ', title: ' + s(L.title) + ', v: ' + L.v + ',\n' +
    '        chunks: [\n' + L.chunks.map(c => '          {\n' +
      '            learn: ' + s(c.learn) + ',\n' +
      '            practise: ' + qs(c.practise, '            ') + '\n' +
      '          }').join(',\n') + '\n        ],\n' +
    '        test: ' + qs(L.test, '        ') + '\n' +
    '      }';
  return '// made by tools/build-grammar.js from docs/grammar-journey.json — don\'t edit\n' +
    'window.TA_GRAMMAR = {\n  v: ' + data.v + ',\n  levels: [\n' +
    data.levels.map(l => '    {\n      id: ' + s(l.id) + ', name: ' + s(l.name) + ', lessons: ' +
      (l.lessons.length ? '[\n' + l.lessons.map(lesson).join(',\n') + '\n    ]' : '[]') + '\n    }').join(',\n') +
    '\n  ]\n};\n';
}

function toMd(data) {
  const out = ['# Grammar Journey — Beginner (Lessons 1–15)', '',
    'Made by `tools/build-grammar.js` from `docs/grammar-journey.json` — please read and approve. Each lesson: learn → practise',
    'for every part, then a 20-question revision test. Right answers are in **bold**; questions from an earlier lesson are',
    'marked *(from Lesson N)*. When a gap accepts more than one answer, all of them are listed.', ''];
  const cell = v => String(v).replace(/\|/g, '\\|');
  const qLine = (Q, i) => {
    const from = Q.from ? ' *(from Lesson ' + Q.from.slice(1) + ')*' : '';
    let line = (i + 1) + '. [' + KIND[Q.type] + '] ';
    if (Q.type === 'choose') line += Q.q + ' — ' + Q.options.map(o => o === Q.a[0] ? '**' + o + '**' : o).join(' / ');
    else if (Q.type === 'gap') line += Q.q + ' → **' + Q.a.join('** / **') + '**';
    else if (Q.type === 'order') line += Q.words.join(' / ') + ' → **' + Q.a.join('** or **') + '**';
    else line += Q.options.map(o => o === Q.a[0] ? '**' + o + '** ✓' : o + ' ✗').join(' · ');
    if (Q.hint) line += '  \n   *Hint: ' + Q.hint + '*';
    return line + from;
  };
  for (const level of data.levels) for (const L of level.lessons) {
    out.push('---', '', '## Lesson ' + L.no + ' — ' + L.title, '');
    L.chunks.forEach((c, ci) => {
      const k = c.learn;
      out.push('### Part ' + (ci + 1) + ': ' + k.title, '', k.rule, '');
      if (k.table) {
        out.push('| ' + k.table[0].map(cell).join(' | ') + ' |', '|' + k.table[0].map(() => '---').join('|') + '|');
        k.table.slice(1).forEach(r => out.push('| ' + r.map(cell).join(' | ') + ' |'));
        out.push('');
      }
      out.push('Examples:', '', ...k.examples.map(e => '- ' + e), '', '🇺🇿 ' + k.uz, '', '**Practise**', '');
      c.practise.forEach((Q, i) => out.push(qLine(Q, i)));
      out.push('');
    });
    out.push('### Revision test (20 questions)', '');
    L.test.forEach((Q, i) => out.push(qLine(Q, i)));
    out.push('');
  }
  return out.join('\n');
}

if (require.main === module) {
  const source = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'grammar-journey.json'), 'utf8'));
  const out = build(source);
  if (out.errors.length) {
    console.error('Not written — fix these in docs/grammar-journey.json:\n- ' + out.errors.join('\n- '));
    process.exit(1);
  }
  fs.writeFileSync(path.join(root, 'js', 'grammar-data.js'), out.js);
  fs.writeFileSync(path.join(root, 'docs', 'grammar-journey.md'), out.md);
  const lessons = out.data.levels.reduce((n, l) => n + l.lessons.length, 0);
  console.log('js/grammar-data.js and docs/grammar-journey.md written: ' + lessons + ' lessons.');
}

module.exports = { build };
