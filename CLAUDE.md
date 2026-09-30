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

## ⚠️ Known risks — warn the teacher (they asked: even unlikely ones, under 20 %)

The teacher wants to hear about problems **before** they happen. In a new chat, after the
database reminder above, give a **short** list of the risks below (one line each, plain
words), and whenever a task touches one of these areas, mention the relevant risk again.
Check whether anything below has changed (fixed, or got worse) before repeating it, and
update this list when you fix or discover something. Rough likelihoods are for the next
few months of normal use (1 teacher account in heavy use, ~20 more accounts, ~100 students).

**More likely (≥ 20 %)**
1. **Daily read limit (50 000 reads/day, shared by all teacher accounts)** — *much reduced
   2026-09-30.* Opening the app used to read every result again (~1 300 reads a time). Now
   results are kept on the device (IndexedDB, `js/firebase.js` "RESULTS KEPT ON THIS DEVICE")
   and only new ones are read (by server time `submittedAt`), plus a full re-read once a week
   per device and once per new exercise code. Still possible on a busy day with many teachers,
   new devices, or cleared browsers (each starts with one full read).
2. **Monthly download limit (10 GiB)** from exercise links — heavy for audio/picture
   exercises (dictation audio is now shrunk, ~0.4 MB per minute of audio; sets with many
   pictures are still heavy).
3. **Old exercise files keep old bugs.** Files made before a fix never change: Sentences with
   multi-line instructions (fixed 2026-09-30), Pronunciation microphone on phones (fixed
   2026-09-30), dictation extra-word scoring inside the student's own score. The teacher has
   to recreate them ("Use again"). Renewing a link from Share re-uploads the app's saved copy
   — which is the old broken one for "Review - Apex" (its fixed copy was put online by hand
   under a different link, `xfix7ee298e757c4`, until 2026-10-07).
4. **Links expire after 7 days** — students who open a link late see "This link has
   expired"; the teacher has to Share again.
5. **Students open files inside Telegram/Instagram viewers** — no microphone there, and
   iPhones can't open .html files at all. Links (play.html) are the answer; the exercise
   shows "Open in Chrome" when it detects the problem.

**Less likely (< 20 %) but serious**
18. **"Delete all results" doesn't leave its marker.** The rules refuse the `ta-reset` marker
    record (`deleteLiveResultsForCode`, checked 2026-09-30: 403 even in the app's own shape).
    The results themselves are deleted, but the marker that should stop old copies of the file
    from sending results again is never saved, so old files can still send results for that
    code. Also, a deletion made on one device reaches the others' kept copy only at their
    weekly full re-read.
6. **Anyone can change the database.** The security rules need no login: anyone who finds
   the project id and API key (they are in every exercise file) can **read, create and
   delete** records in `results` — delete students' results or points, or spam fake results
   (confirmed 2026-09-30: an unauthenticated REST DELETE worked). Scores are also computed
   on the student's device, so a clever student could send a fake score. Real fix: Firebase
   Authentication + stricter rules (a big change; discuss with the teacher first).
7. **A fake exercise link could run someone else's code on the teacher's site.** Because
   anyone can create a `TA_SYNC:PLAY` record, someone could make a `play.html?x=…` link with
   their own page. It runs on the app's own address, so if the **teacher** opened it in the
   browser where they use the app, it could read the app's saved data in that browser
   (student list, exercises; synced data is encrypted, but the local copy isn't). Advise:
   only open exercise links the teacher shared themselves. Fix idea: serve play pages from a
   separate origin, or check the record was made by this teacher (needs auth).
8. **Browser storage filling up** (~5–10 MB per site): My Exercises keeps copies of exercise
   files and builder forms (pictures included). When full, older saved copies are dropped
   (so "Redownload"/"Use again"/Share-renewal may stop working for old exercises) and, in the
   worst case, new data can't be saved.
9. **Forgotten password = synced data can't be read.** Sync is encrypted with a key from the
   teacher's password; on a new device without the password, cloud copies are unreadable.
   Remind them to keep a backup file (Settings → Backup) now and then.
10. **Speech recognition depends on Google's servers** (Chrome's Web Speech API): needs the
    internet, can be slow or refuse at times; Safari on iPhone works less reliably.
11. **The site's address must not change.** Renaming the GitHub repo/user, making the repo
    private (Pages may stop), or a stuck Pages deployment breaks every link and the login
    animation inside exercise files (the address is written into each file).
12. **The Firebase SDK is loaded from gstatic.com (version 10.12.5)**; if that URL ever
    stopped working, results would stop everywhere. Very unlikely.
13. **Upgrading Firebase to the paid (Blaze) plan** would turn limits into bills — heavy link
    traffic would then cost money instead of stopping. Warn before any such upgrade; suggest
    a budget alert.
14. **Two Claude chats editing at once** → merge conflicts on `main` (it happened once with the
    `?v=` stamp). Always fetch `main` before merging and re-test after resolving.
15. **Very long audio in the Dictation builder** (e.g. 30+ min) is shrunk in the teacher's
    browser; on a weak phone this can take long or crash the tab — suggest a computer.
16. **Student ID typos / shared IDs**: results then don't match the Students list and are
    left out of Statistics, Top 5 and "Didn't do it".
17. **Reminders and notifications only work while the app is open** (no server to push them).

## Automatic tests — run them before every merge

`npm test` (Playwright, `tests/*.spec.js`, ~40 s; see `tests/README.md`). In this cloud
environment: `npm install` then `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test`.
They also run on GitHub for every push (`.github/workflows/tests.yml`). **Run them before
merging into `main`, and don't merge while any fail.** When you add or change a feature, add
or update a test for it. The tests use a stand-in database and a made-up class — never put
real students' names or results into the repository (it is public).

## Results kept on the device (keep this in mind when changing how results load)

- `js/firebase.js` keeps every result it has read in IndexedDB (`ta_results_cache…`, per
  account namespace) and derives `__allResults`, `__plainCompletions`, `__pointsLedger`,
  `__liveResults` and `__hwcProgressDocs` from it (`rsDerive*`). Loading: `rsEnsureCodes(codes)`
  reads a code's results once (`code in […]`, 30 per query); `rsStartDelta` listens to
  `submittedAt > newest kept − 10 min` for everything new. Records without `submittedAt`
  are never seen by that listener — every result/points/progress record must carry
  `submittedAt: serverTimestamp()` (exercise files do; the teacher's own points writes do
  since 2026-09-30). `taResultsCacheInfo()` in the console shows what's kept.

## How exercise links work (keep this in mind when changing them)

- `js/firebase.js` → `taPublishPlay` writes an exercise as records `play-<uid>`,
  `play-<uid>-1`, … (300 000 characters each; a Firestore record may hold 1 MB). Fields follow
  the sync record shape (`code: 'TAUSER'`, `type: 'TA_SYNC:PLAY'`) because the security rules
  only allow certain record shapes — a different `type`/`code` is refused (403).
  `title` = `uid␟part␟total`, `score` = characters in that part, `date` = when published.
  **The rules allow creating and deleting records but not changing them** (a PATCH/`setDoc`
  on an existing record is refused, 403) — so re-publishing deletes the old records first.
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

- Dictation audio chosen as a file is packed inside the exercise (base64). It is made smaller
  first in the builder (`taShrinkSpeechAudio` in `js/pages/create.js`: one channel, 22 kHz,
  MP3 48 kbps, using `js/vendor/lame.min.js` — lamejs, LGPL, loaded only then); a 64 s clip went
  from 2.4 MB to 0.4 MB. Keep it that way: audio is what makes exercises heavy.

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
