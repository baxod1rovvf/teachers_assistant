// Opens the app for a test: signed in as the administrator, with the made-up
// class (data.js) and the stand-in database (fake-firestore.js).
const fs = require('fs');
const path = require('path');
const data = require('./data');

const FAKE_FIRESTORE = fs.readFileSync(path.join(__dirname, 'fake-firestore.js'), 'utf8');

/**
 * Sets up a browser context. Options:
 *   docs     — the database's records (default: the made-up results)
 *   storage  — extra localStorage items (as the app saves them)
 *   empty    — start with nothing saved (no students, no exercises)
 *   signedIn — false to see the login screen
 */
async function prepare(context, opts = {}) {
  const now = Date.now();
  const storage = Object.assign(opts.empty ? {} : {
    ta_theme: 'dark',
    ta_student_groups: JSON.stringify(data.groups),
    ta_points_roster: JSON.stringify(data.roster),
    ta_recent_exercises: JSON.stringify(data.exercises())
  }, opts.storage || {});
  await context.addInitScript(({ storage, signedIn }) => {
    if (signedIn) sessionStorage.setItem('ta_session_v1', JSON.stringify({ login: 'TOXIRJON' }));
    // seed once per browser context (a reload keeps what the app saved since)
    if (!localStorage.getItem('__seeded')) {
      localStorage.setItem('__seeded', '1');
      for (const k in storage) localStorage.setItem(k, storage[k]);
    }
  }, { storage, signedIn: opts.signedIn !== false });
  await context.addInitScript(docs => { window.__FIXTURE = docs; }, opts.docs || data.results(now));
  // nothing leaves the test machine (fonts, animations from other sites…) —
  // added first, because the rules added later are checked before it
  await context.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await context.route(/gstatic\.com\/firebasejs\/.*firebase-firestore\.js/, r => r.fulfill({ contentType: 'application/javascript', body: FAKE_FIRESTORE }));
  await context.route(/gstatic\.com\/firebasejs\/.*firebase-app\.js/, r => r.fulfill({ contentType: 'application/javascript', body: 'export function initializeApp(){return {}}' }));
}

/** Collects page errors, so a test can say there were none. */
function watchErrors(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  return errors;
}

/** Hides the top-right warnings, so they don't cover what a test clicks. */
async function hideNotices(page) {
  await page.evaluate(() => document.querySelectorAll('.lesson-warn').forEach(x => x.classList.remove('show')));
}

/** An exercise template (js/exercise-templates.js) as stored, placeholders and all. */
function rawTemplate(name) {
  const src = fs.readFileSync(path.join(__dirname, '../../js/exercise-templates.js'), 'utf8');
  const line = src.split('\n').find(l => l.startsWith('const ' + name + ' '));
  if (!line) throw new Error('No template ' + name);
  return JSON.parse(line.slice(line.indexOf('=') + 1).trim().replace(/;\s*$/, ''));
}

/** An exercise template with its placeholders filled. */
function template(name, fill = {}) {
  const t = rawTemplate(name);
  const defaults = { WORDS_JSON: '["apple","banana"]', WORD_COUNT: '2', SPEECH_LANG: 'en-US', STRICTNESS: 'normal', LEARN_STAGE: 'off',
    DEFAULT_VOICE: 'female', ACCESS_MODE: 'nocode', ACCESS_ID_MODE: 'unified', ROSTER_JSON: '[]', MAX_TRIES: '3', PASS_SCORE: '70',
    POINTS_AWARD: '0', TIME_LIMIT_MINUTES: '0', EXERCISE_TITLE: 'Test', POINTS_TYPE_LABEL: 'Test', EXERCISE_UID: 'xtest1', TA_APP_URL: '',
    EXERCISE_CODE: '123456', BOARD_CODE: '654321', FILE_BUILT_AT: new Date().toISOString(), REQUIRED_CODE: '' };
  const all = Object.assign(defaults, fill);
  return t.replace(/__([A-Z_]+)__/g, (m, k) => k in all ? all[k] : '');
}

module.exports = { prepare, watchErrors, hideNotices, template, rawTemplate, data };
