// The Grammar Journey's content (teacher, 2026-11-16): 7 levels, Beginner Lessons 1–15, Elementary 16–32. Each lesson is 2–4 learn → practise
// chunks (5 practise questions each) and a 20-question revision test; from Lesson 2 on, exactly 4 test questions come from
// earlier lessons. The source is docs/grammar-journey.json; `node tools/build-grammar.js` writes js/grammar-data.js and the
// teacher's readable copy docs/grammar-journey.md. These checks read the generated file the way the student page does.
const { test, expect } = require('@playwright/test');
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.join(__dirname, '..');
const LEVELS = [['beginner', 'Beginner'], ['elementary', 'Elementary'], ['preintermediate', 'Pre-Intermediate'],
  ['intermediate', 'Intermediate'], ['upperintermediate', 'Upper-Intermediate'], ['advanced', 'Advanced'], ['intensive', 'Intensive']];
const TITLES = ['To Be (am/is/are) + A/An', 'Subject Pronouns + Possessive Adjectives', 'Singular and Plural Nouns',
  'This, That, These, Those', 'Have Got / Has Got', 'There Is / There Are', 'Articles (A, An, The)',
  'Countable and Uncountable Nouns', 'Some and Any', 'Prepositions of Place', 'Present Simple (Affirmative)',
  'Present Simple (Negative and Questions)', 'Adverbs of Frequency', 'Object Pronouns + Possessive Pronouns',
  'Imperatives and Basic Sentence Structure'];
const ELEMENTARY = ['Present Continuous', 'Present Simple vs Present Continuous', 'Can and Cannot (Ability)',
  'Can (Permission and Requests)', 'Like, Love, Hate + Gerund', 'Infinitive with To', 'Prepositions of Time (In, On, At)',
  'Possessive \'s and Whose', 'Much, Many, A Lot Of', 'Few, A Few, Little, A Little', 'Comparative Adjectives',
  'Superlative Adjectives', 'Adjective Order', 'Was / Were', 'Past Simple (Regular and Irregular Verbs)',
  'Past Simple (Negative and Questions)', 'Future with Will and Be Going To'];
// the same list as the skills course's "only English" check (tests/skills.spec.js), plus the Uzbek apostrophe letters
const UZBEK = /Uzbek|Tashkent|Samarkand|Bukhara|Kamila|Jasur|Bobur|Nodira|Karimov|Aziz|Lola\b|Malika|Rustam|Laylo|Jamol|Bekzod|Sardor|Nilufar|Madina|Timur|Dilnoza|Karim\b|\bAli\b|harf|raqam|unli tovush|telefon|ikki marta|[ʻʼ‘’]/;
const CYRILLIC = /[Ѐ-ӿ]/;

function loadGrammar() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js', 'grammar-data.js'), 'utf8'), sandbox);
  return sandbox.window.TA_GRAMMAR;
}
// the words of an order answer, without its final full stop / question mark / exclamation mark
const orderWords = s => s.replace(/[.?!]$/, '').toLowerCase().split(' ').sort();   // a fronted word may be capitalised

function checkQuestion(q, where) {
  expect(['choose', 'gap', 'order', 'fix'], where + ' type').toContain(q.type);
  expect(typeof q.q === 'string' && q.q.trim().length > 0, where + ' has a question').toBe(true);
  expect(Array.isArray(q.a) && q.a.length > 0 && q.a.every(a => typeof a === 'string' && a.trim()), where + ' has answers').toBe(true);
  if (q.type === 'choose' || q.type === 'fix') {
    expect(q.options.length, where + ' options').toBeGreaterThanOrEqual(2);
    expect(q.options.length, where + ' options').toBeLessThanOrEqual(4);
    expect(new Set(q.options).size, where + ' options are different').toBe(q.options.length);
    expect(q.options, where + ' answer is an option').toContain(q.a[0]);
    expect(q.a.length, where + ' one right option').toBe(1);
  }
  if (q.type === 'gap') expect(q.q, where + ' has a gap').toContain('___');
  if (q.type === 'order') {
    expect(q.words.length, where + ' words').toBeGreaterThanOrEqual(2);
    q.a.forEach(a => expect(orderWords(a), where + ' "' + a + '" uses exactly its words').toEqual(orderWords(q.words.join(' '))));
  }
}

test('the Grammar Journey: 7 levels, 15 Beginner + 17 Elementary lessons, 2–4 chunks of 5 practise questions, 20-question tests', async () => {
  const G = loadGrammar();
  expect(G.v).toBe(1);
  expect(G.levels.map(l => [l.id, l.name])).toEqual(LEVELS);
  G.levels.slice(2).forEach(l => expect(l.lessons, l.id).toEqual([]));
  const beginner = G.levels[0].lessons;
  expect(beginner.map(l => l.id)).toEqual(TITLES.map((t, i) => 'g' + (i + 1)));
  expect(beginner.map(l => l.no)).toEqual(TITLES.map((t, i) => i + 1));
  expect(beginner.map(l => l.title)).toEqual(TITLES);
  const elementary = G.levels[1].lessons;
  expect(elementary.map(l => l.id)).toEqual(ELEMENTARY.map((t, i) => 'g' + (i + 16)));
  expect(elementary.map(l => l.no)).toEqual(ELEMENTARY.map((t, i) => i + 16));
  expect(elementary.map(l => l.title)).toEqual(ELEMENTARY);
  for (const L of beginner.concat(elementary)) {
    expect(Number.isInteger(L.v) && L.v >= 1, L.id + ' content version').toBe(true);
    expect(L.chunks.length, L.id + ' chunks').toBeGreaterThanOrEqual(2);
    expect(L.chunks.length, L.id + ' chunks').toBeLessThanOrEqual(4);
    L.chunks.forEach((c, ci) => {
      const where = L.id + ' chunk ' + (ci + 1);
      expect(c.learn.title && c.learn.rule, where + ' title + rule').toBeTruthy();
      expect(c.learn.uz && c.learn.uz.trim().length > 0, where + ' Uzbek line').toBe(true);
      expect(c.learn.examples.length, where + ' examples').toBeGreaterThanOrEqual(4);
      expect(c.learn.examples.length, where + ' examples').toBeLessThanOrEqual(6);
      if (c.learn.table) c.learn.table.forEach(r => expect(r.length, where + ' table row').toBe(c.learn.table[0].length));
      expect(c.practise.length, where + ' practise').toBe(5);
      c.practise.forEach((q, qi) => {
        checkQuestion(q, where + ' practise ' + (qi + 1));
        expect(q.hint, where + ' practise ' + (qi + 1) + ' has a hint').toBeTruthy();
        expect(q.from, where + ' practise is this lesson\'s own').toBeUndefined();
      });
    });
    expect(L.test.length, L.id + ' test').toBe(20);
    L.test.forEach((q, qi) => checkQuestion(q, L.id + ' test ' + (qi + 1)));
    expect(new Set(L.test.map(q => q.type)).size, L.id + ' test mixes the four kinds').toBe(4);
    const from = L.test.filter(q => q.from);
    if (L.no === 1) expect(from.length, 'g1 has only its own questions').toBe(0);
    else {
      expect(from.length, L.id + ' earlier-lesson questions').toBe(4);
      from.forEach(q => {
        const n = Number(String(q.from).replace(/^g/, ''));
        expect(/^g\d+$/.test(q.from) && n >= 1 && n < L.no, L.id + ' "' + q.q + '" from an earlier lesson').toBe(true);
      });
    }
  }
});

test('the Grammar Journey is English only — Uzbek only in the one line under each rule (uz), and no Cyrillic', async () => {
  const G = loadGrammar();
  const bad = [];
  (function walk(v, key, where) {
    if (typeof v === 'string') {
      if (CYRILLIC.test(v)) bad.push(where + ': Cyrillic in "' + v + '"');
      if (key !== 'uz' && UZBEK.test(v)) bad.push(where + ': not English "' + v + '"');
    } else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, Array.isArray(v) ? key : k, where + '.' + k));
  })(G, '', 'TA_GRAMMAR');
  expect(bad).toEqual([]);
});

test('js/grammar-data.js and the teacher\'s copy are made from docs/grammar-journey.json (never edited by hand)', async () => {
  const { build } = require('../tools/build-grammar.js');
  const source = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'grammar-journey.json'), 'utf8'));
  const out = build(source);
  expect(loadGrammar()).toEqual(out.data);
  expect(fs.readFileSync(path.join(ROOT, 'js', 'grammar-data.js'), 'utf8')).toBe(out.js);
  expect(fs.readFileSync(path.join(ROOT, 'docs', 'grammar-journey.md'), 'utf8')).toBe(out.md);
});
