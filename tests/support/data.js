// A made-up class for the tests (never real students' names).
const DAY = 86400000;
const iso = ms => new Date(ms).toISOString();

// Two groups, like the teacher's Target and Apex.
const groups = [{ id: 'g1', name: 'Target' }, { id: 'g2', name: 'Apex' }];
const roster = [
  { name: 'Alice Test', id: '10001', group: 'g1' },
  { name: 'Bobur Test', id: '10002', group: 'g1' },
  { name: 'Cora Test', id: '10003', group: 'g1' },
  { name: 'Dilya Test', id: '20001', group: 'g2' },
  { name: 'Eldor Test', id: '20002', group: 'g2' },
  { name: 'Farida Test', id: '20003', group: 'g2' }
];

// A Homework set for Apex (code 700001) with 3 exercises, and a Target dictation (700010).
const SET = { code: '700001', rounds: [
  { code: '700002', label: 'My day — Sentence Writing', type: 'Sentences' },
  { code: '700003', label: 'Short i — English Content', type: 'EnglishContent' },
  { code: '700004', label: 'My room — Dictation', type: 'Dictation' }
] };
const DICTATION_CODE = '700010';
const REFERENCE = 'Every Saturday Sarah wakes up in her bedroom and then goes to the kitchen.';

function results(now) {
  // handed in over the last few days ("at" = minutes after the start), like real results
  const t0 = now - 5 * DAY;
  const out = [];
  let n = 0;
  const add = (d, at) => out.push(Object.assign({ __id: 'r' + (++n), v: 1, date: iso(t0 + at * 60000), submittedAt: iso(t0 + at * 60000) }, d));
  // Apex: Dilya and Eldor finished the whole set, Farida did nothing
  ['20001', '20002'].forEach((id, s) => {
    const name = roster.find(r => r.id === id).name;
    SET.rounds.forEach((r, i) => {
      add({ code: SET.code, type: 'HWC_PROGRESS', title: 'Sep test', kind: 'homework', studentId: id, name,
        roundIndex: i, roundLabel: r.label, roundCode: r.code, totalCount: SET.rounds.length, timeSeconds: 300 }, s * 1000 + i * 100);
      const base = { code: r.code, type: r.type, title: r.label.split(' — ')[0], name, studentId: id, isRosterMatch: true, timeSeconds: 300, timeDisplay: '05:00' };
      if (r.type === 'Sentences') add(Object.assign(base, { sentenceCount: 2, sentences: [{ word: '', text: 'I wake up at seven.' }, { word: '', text: 'I go to school.' }] }), s * 1000 + i * 100 + 1);
      if (r.type === 'EnglishContent') add(Object.assign(base, { notes: 'short i: sit, big, fish', notesWordCount: 5 }), s * 1000 + i * 100 + 1);
      if (r.type === 'Dictation') add(Object.assign(base, { score: 90, referenceText: REFERENCE, studentText: REFERENCE, dictationFeedback: 'ok' }), s * 1000 + i * 100 + 1);
    });
  });
  // Target dictation: Alice wrote it well; Bobur typed the text twice (extra words must count as mistakes)
  add({ code: DICTATION_CODE, type: 'Dictation', title: 'Kitchen', name: 'Alice Test', studentId: '10001', score: 100,
    referenceText: REFERENCE, studentText: REFERENCE, dictationFeedback: 'ok', timeSeconds: 120, timeDisplay: '02:00' }, 5000);
  add({ code: DICTATION_CODE, type: 'Dictation', title: 'Kitchen', name: 'Bobur Test', studentId: '10002', score: 100,
    referenceText: REFERENCE, studentText: REFERENCE + ' ' + REFERENCE, dictationFeedback: 'ok', timeSeconds: 120, timeDisplay: '02:00' }, 6000);
  return out;
}

const exercises = () => [
  { uid: 'uset', title: 'Sep test', code: SET.code, typeLabel: 'Homework', groupId: 'g2', date: iso(Date.now() - 3 * DAY),
    mergedItems: SET.rounds.map(r => ({ code: r.code })) },
  { uid: 'udict', title: 'Kitchen', code: DICTATION_CODE, typeLabel: 'Dictation', groupId: 'g1', date: iso(Date.now() - 3 * DAY) }
];

module.exports = { groups, roster, exercises, results, SET, DICTATION_CODE, REFERENCE, DAY };
