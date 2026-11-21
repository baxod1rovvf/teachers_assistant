// The Dictation Journey's content (teacher, 2026-11-19; rebuilt 2026-11-21): 100 passages in 5 levels. Source docs/dictation-journey.md →
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

test('dictation data: 5 levels of 20, ids from the md, places 1…100, titles from the md', () => {
  const D = load();
  expect(D.levels.map(l => [l.id, l.name])).toEqual(LEVELS);
  D.levels.forEach(l => expect(l.items.length).toBe(20));
  const items = all();
  const md = fs.readFileSync(path.join(ROOT, 'docs', 'dictation-journey.md'), 'utf8');
  const titles = [...md.matchAll(/^## Dictation (\d+) — (.+)$/gm)].map(m => [+m[1], m[2].trim()]);
  expect(titles.length).toBe(100);
  expect(new Set(items.map(it => it.id)).size).toBe(100);
  items.forEach((it, i) => {
    expect(it.no).toBe(i + 1);
    expect([it.id, it.title]).toEqual(['d' + titles[i][0], titles[i][1]]);
    expect(it.text.length).toBeGreaterThan(20);
    expect(it.sentences.length).toBeGreaterThan(0);
    expect(it.sentences.join(' ')).toBe(it.text.replace(/\s+/g, ' '));
  });
});

// teacher, 2026-11-21: "make dictation difficult" — kept the last 5 Beginner, last 10 Elementary, last 10 Pre-intermediate, last 5
// Intermediate and all 20 Upper passages (ids kept), added the 50 "Progressive" passages as d101–d150, 20 per level
test('dictation data: the teacher\'s layout (2026-11-21)', () => {
  const r = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => 'd' + (a + i));
  expect(load().levels.map(l => l.items.map(i => i.id))).toEqual([
    [...r(16, 20), ...r(31, 40), ...r(51, 55)],
    [...r(56, 60), ...r(76, 80), ...r(81, 90)],
    [...r(91, 100), ...r(101, 110)],
    r(111, 130),
    r(131, 150)]);
  const words = all().map(it => it.text.split(/\s+/).length);
  expect(words[99]).toBeGreaterThanOrEqual(190);                        // the last passage is long now (~200 words)
  expect(words.slice(60).every(w => w >= 100)).toBe(true);               // Intermediate and Upper: 100+ words each
});

test('dictation data: known sentences', () => {
  const by = id => all().find(it => it.id === id).sentences;
  expect(by('d16')).toEqual(["Today is my cousin's birthday.", 'She is turning fourteen.', "Her party starts at five o'clock on Saturday afternoon.",
    'We are going to bring a chocolate cake, some balloons, and a present.', 'I hope she likes her new camera.']);
  expect(by('d34')[0]).toBe('Dear Mr Wilson, your reservation is confirmed.');
  expect(by('d34')[3]).toBe('Check-in begins at 2 p.m., and check-out is before 11 a.m.');
  expect(by('d124')[1]).toBe('The owner, Mr Karimov, has worked there for nearly twenty-five years.');
  expect(by('d101')[0]).toBe('Building a new habit does not require a big promise.');
  expect(by('d150').slice(-1)[0]).toBe('This perspective encourages thoughtful choices and helps ensure that services remain responsible in the future.');
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

test('dictation data: `recorded` matches whether dN.mp3 exists', () => {
  all().forEach(it => expect(it.recorded, it.id).toBe(fs.existsSync(path.join(ROOT, 'audio', 'dictation', it.id + '.mp3'))));
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
