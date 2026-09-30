# Teacher's Assistant — notes for Claude

A teacher's web app (static site on GitHub Pages: `https://baxod1rovvf.github.io/teachers_assistant/`,
deployed from `main`). Plain HTML/CSS/JS, no build step. The teacher (the owner of this
repo) builds exercises on the Create page; each exercise is a single self-contained HTML
file (templates in `js/exercise-templates.js`) that students open, and results come back
through Firebase Firestore (project `teachers-assistant-app-ccd1a`, collection `results`).

The teacher asks for changes in plain words, often by screenshot, and merges to `main`
when asked ("merge it"). Explain things simply — they are a teacher, not a developer.

## ⚠️ Tell the teacher at the start of a new chat — database limits

**If this is a new conversation, remind the teacher of the points below once, briefly,
before or alongside the first task** (they asked for this so they don't forget):

1. **Exercise links use the free Firebase plan.** Every exercise is also put online for
   **7 days** (`play.html?x=<id>`), so students — especially on iPhones — can open it from a
   link. The free (Spark) plan has limits: about **1 GiB of storage** and **10 GiB of
   downloads a month**, plus daily read/write limits. Big exercises (dictations with audio,
   sets with pictures — one set was ~3.5 MB) cost the most: every student who opens the link
   downloads the whole exercise. Suggest checking usage now and then at
   https://console.firebase.google.com/project/teachers-assistant-app-ccd1a/usage
   and sharing heavy exercises as files instead of links.
2. **The app warns in the top-right corner** when Firebase refuses a request because a limit
   was reached ("⚠️ The database has reached a limit"), and when exercise links take more
   than 400 MB ("⚠️ Exercise links are taking a lot of space"). If the teacher mentions
   either warning, results not arriving, or links not opening, check the limits first.
3. **Anyone can read the `results` collection** (no login; the rules allow reads). Online
   exercises — including their answers and the class list (names, IDs) — can be read by
   anyone who finds the database. The exercise files contain the same data. Synced app data
   (`TA_SYNC:<login>` records) is encrypted and not affected.

## How exercise links work (keep this in mind when changing them)

- `js/firebase.js` → `taPublishPlay` writes an exercise as records `play-<uid>`,
  `play-<uid>-1`, … (300 000 characters each; a Firestore record may hold 1 MB). Fields follow
  the sync record shape (`code: 'TAUSER'`, `type: 'TA_SYNC:PLAY'`) because the security rules
  only allow certain record shapes — a different `type`/`code` is refused (403).
  `title` = `uid␟part␟total`, `score` = characters in that part, `date` = when published.
- `js/common.js` → `pushRecentExercise` puts every new exercise online 5 s after it's made;
  `taPublishPlayable` records `playAt`/`playParts`/`playBytes` on the My Exercises item;
  Share (`js/pages/my-exercises.js`) renews a link that expired. Exercises merged into a
  Homework/Class set are taken offline (`removeRecentExercise`).
- **7-day cleanup:** `taSweepPlayLinks` (firebase.js) runs at most every 12 h per device
  (`taSweepPlayLinksIfDue` in common.js). It lists only the records' title/date/score (REST
  `runQuery` with a field mask — cheap), deletes those older than 7 days (any teacher's), and
  totals the space of the rest → the space warning. `play.html` also refuses links older
  than 7 days, even if nothing deleted them yet.
- `play.html` fetches the parts (REST), then `document.write`s the exercise, so it runs at
  the site's https address — that's what lets phones use the microphone (Pronunciation).
  Exercise pages share the site's origin with the teacher app; they must not use the app's
  `localStorage` keys (checked: they only use `ta_reader_*` and `ta_ielts_reader_prefs`).
- The app can't read Firebase's usage itself; the warnings come from `resource-exhausted`
  errors (`taReportDbError` in firebase.js → `taDbLimitReached` in common.js) and from the
  sweep's total.

## Other things worth knowing

- Every change to CSS/JS needs the `?v=` stamp bumped in all the `*.html` pages (they share
  one stamp, e.g. `v=20260930g`), or browsers keep the old files.
- Text put into an exercise template's `<script>` must be escaped for a JS string
  (`escapeForJsString`); titles use `escapeForTemplateText` (page text and script at once).
  Raw line breaks or quotes there break the whole exercise.
- Exercise templates are stored as JSON strings on one line each in
  `js/exercise-templates.js`; edit them by parsing the string, changing it, and writing it
  back with `JSON.stringify(t).replace(/<\//g, '<\\/')`.
- Accounts: each teacher's `localStorage` is namespaced (`js/accounts.js`); the admin
  `TOXIRJON` uses un-prefixed keys.
