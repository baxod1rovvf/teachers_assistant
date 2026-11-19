// The Dictation Journey's content (teacher, 2026-11-19): 100 passages in 5 levels. Source docs/dictation-journey.md →
// `node tools/build-dictations.js` → js/dictation-data.js (window.TA_DICTATION). Sentence k of dN plays audio/dictation/dN-s<k>.mp3.
const { test, expect } = require('@playwright/test');
const fs = require('fs'), path = require('path'), vm = require('vm'), { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const LEVELS = [['beginner', 'Beginner'], ['elementary', 'Elementary'], ['preintermediate', 'Pre-intermediate'],
  ['intermediate', 'Intermediate'], ['advanced', 'Upper-intermediate & Advanced']];

function load() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js', 'dictation-data.js'), 'utf8'), sandbox);
  return sandbox.window.TA_DICTATION;
}
const all = () => load().levels.flatMap(l => l.items);

test('dictation data: 5 levels, d1…d100 in order, titles from the md, 416 sentences', () => {
  const D = load();
  expect(D.levels.map(l => [l.id, l.name])).toEqual(LEVELS);
  D.levels.forEach(l => expect(l.items.length).toBe(20));
  const items = all();
  const md = fs.readFileSync(path.join(ROOT, 'docs', 'dictation-journey.md'), 'utf8');
  const titles = [...md.matchAll(/^## Dictation (\d+) — (.+)$/gm)].map(m => [+m[1], m[2].trim()]);
  expect(titles.length).toBe(100);
  items.forEach((it, i) => {
    expect(it.id).toBe('d' + (i + 1));
    expect(it.no).toBe(i + 1);
    expect([it.no, it.title]).toEqual(titles[i]);
    expect(it.text.length).toBeGreaterThan(20);
    expect(it.sentences.length).toBeGreaterThan(0);
    expect(it.sentences.join(' ')).toBe(it.text.replace(/\s+/g, ' '));
  });
  expect(items.reduce((n, it) => n + it.sentences.length, 0)).toBe(416);
});

test('dictation data: known sentences', () => {
  const by = id => all().find(it => it.id === id).sentences;
  const d1 = by('d1');
  expect(d1.length).toBe(7);
  expect(d1[0]).toBe('Hello!');
  expect(d1[1]).toBe('My name is Daniel.');
  expect(d1[6]).toBe('My favourite colour is blue.');
  expect(by('d29')[0]).toMatch(/6 p\.m\.$/);
  expect(by('d29')[1]).toBe('Visitors must speak quietly and turn off their mobile phones.');
  expect(by('d34')[0]).toBe('Dear Mr Wilson, your reservation is confirmed.');
  expect(by('d26')[0]).toBe('“Hi, Emma.');
  expect(by('d26').slice(-1)[0]).toBe('Thanks!”');
});

test('dictation data: the same split as the audio tool (python)', () => {
  const py = fs.readFileSync(path.join(ROOT, 'tools', 'make-dictation-audio.py'), 'utf8');
  const start = py.indexOf('ABBR = '), end = py.indexOf('# ---- how numbers are said');
  expect(start).toBeGreaterThan(-1); expect(end).toBeGreaterThan(start);
  const code = 'import re, json, sys\n' + py.slice(start, end) +
    '\nmd = open(sys.argv[1], encoding="utf-8").read()\nprint(json.dumps({"d%d" % p["no"]: dictation_sentences(p["text"]) for p in passages(md)}))\n';
  const out = execFileSync('python3', ['-c', code, path.join(ROOT, 'docs', 'dictation-journey.md')], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const fromPy = JSON.parse(out);
  expect(Object.keys(fromPy).length).toBe(100);
  all().forEach(it => expect(it.sentences, it.id).toEqual(fromPy[it.id]));
});

test('dictation audio: a recorded passage has one file per sentence', () => {
  const dir = path.join(ROOT, 'audio', 'dictation');
  all().forEach(it => {
    if (!fs.existsSync(path.join(dir, it.id + '.mp3'))) return;   // not recorded yet
    it.sentences.forEach((_, k) => expect(fs.existsSync(path.join(dir, it.id + '-s' + (k + 1) + '.mp3')), it.id + ' s' + (k + 1)).toBe(true));
    expect(fs.existsSync(path.join(dir, it.id + '-s' + (it.sentences.length + 1) + '.mp3')), it.id + ' has an extra file').toBe(false);
  });
});

// Controller enables this (DC_ALL_AUDIO=1, or removes the skip) once the recording has finished.
test('dictation audio: all 100 dictations are recorded — dN.mp3 and one file per sentence', () => {
  test.skip(!process.env.DC_ALL_AUDIO, 'all 100 dictations are recorded (set DC_ALL_AUDIO=1 once recording ends)');
  const dir = path.join(ROOT, 'audio', 'dictation');
  expect(all().length).toBe(100);
  all().forEach(it => {
    expect(fs.existsSync(path.join(dir, it.id + '.mp3')), it.id + '.mp3').toBe(true);
    it.sentences.forEach((_, k) => expect(fs.existsSync(path.join(dir, it.id + '-s' + (k + 1) + '.mp3')), it.id + ' s' + (k + 1)).toBe(true));
  });
});
