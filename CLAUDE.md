# Loom (formerly Teacher's Assistant) — notes for Claude

A teacher's web app called **Loom** (renamed from "Teacher's Assistant" 2026-10-27; logo in `images/app/`; the site address and repo name stay `teachers_assistant` — don't change them, risk 11) (static site on GitHub Pages: `https://baxod1rovvf.github.io/teachers_assistant/`,
deployed from `main`). Plain HTML/CSS/JS, no build step. The teacher (the owner of this
repo) builds exercises on the Create page; each exercise is a single self-contained HTML
file (templates in `js/exercise-templates.js`) that students open, and results come back
through Firebase Firestore (project `teachers-assistant-app-ccd1a`, collection `results`).

The teacher asks for changes in plain words, often by screenshot, and merges to `main`
when asked ("merge it"). Explain things simply — they are a teacher, not a developer.

## 🤖 New features and the AI robot — ask the teacher (they asked for this)

**Whenever you add a new feature, option or button, ask the teacher (in your reply) whether
to add a question + answer about it to the AI robot** — the floating help robot on every page.
They want the robot short: **only useful, not-obvious questions** — no easy ones like "How do I
rename / find / delete an exercise?" or "Can I switch day/night?" (those were removed
2026-10-03). On 2026-10-04 the teacher picked what stays: Dashboard (`main`) — colours/look, the note
about students who finished, language; My Exercises — the link, one exercise out of a set; Students —
all but "What are groups?" and "How do points work?"; Create and Statistics as they were. Don't
add questions back unless the teacher agrees. **When a feature is removed or changed, remove or fix its questions in the same
change** (questions about things that no longer exist must never stay). Where: `AI_ROBOT_FAQ_BY_TAB`
(one list per section: `main`, `createpicker`, `builder`, `hwcbuilder`, `dashboard` = Statistics,
`myexercises`, `students`, `results`, `points`, `settings`, IELTS ones) and `AI_ROBOT_TYPE_FAQ`
(one list per exercise type) in `js/common.js`. Plain words, real button names. **Every question
needs its Uzbek and Russian translation** in `TA_ROBOT_I18N` in `js/i18n-strings.js` (keyed by the
English question; button names as they appear on screen in that language) — `tests/robot.spec.js`
fails when a question has no translation, or a translation's question no longer exists.

## ⚠️ Tell the teacher at the start of a new chat — database limits

**If this is a new conversation, remind the teacher of the points below once, briefly,
before or alongside the first task** (they asked for this so they don't forget):

1. **Exercise links use the free Firebase plan.** An exercise is put online when the teacher
   first presses 🔗 Copy link, for **7 days** from then (`play.html?x=<id>`), so students — especially on iPhones — can open it from a
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
3. **Anyone can read the `results` collection** (no login; the rules allow reads — the database
   lock only protects writes and deletes). Online
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
   **2026-10-05: the limit ran out (55 K reads, only 224 writes).** Cause: exercise files, on every
   Start, read the whole points board (`taCheckAward`: `code == board`, ~430 records) — and a
   Homework/Class set does that for every round, and also read every student's progress
   (`hwcLoadProgress`). Fixed in the templates: awards now carry `uid` + `studentId`, the check
   reads `code+uid+studentId` and `code+type==POINTS:DISABLE` (2 reads); the set reads only its
   student's progress. **Old files still do the full read** (`TA_FILE_FIXES` `reads`/`readsone`)
   — the sets students still use must be recreated. Database then: 2 202 records (29 synced,
   32 link, 21 account, 432 points). Never read a whole code/board from an exercise file.
2. **Monthly download limit (10 GiB)** from exercise links — heavy for audio/picture
   exercises (dictation audio is now shrunk, ~0.4 MB per minute of audio; sets with many
   pictures are still heavy).
3. **Old exercise files keep old bugs.** Files made before a fix never change: Sentences with
   multi-line instructions (fixed 2026-09-30), Pronunciation microphone on phones (fixed
   2026-09-30), dictation extra-word scoring inside the student's own score, Homework/Class sets
   counting a round as done when its answers failed to upload (fixed 2026-10-01), Flashcard
   sending 0 seconds and Sentences showing the start screen instead of the certificate (both:
   `showCertificate` left full screen while the full-screen guard was still on, so the guard
   "restarted" the finished exercise; fixed 2026-10-02 — 44 of 246 Flashcard results had 0 s). The teacher has
   to recreate them ("Use again") — since 2026-10-01 the app points these out (see "Old
   exercise files" below). Renewing a link from Share re-uploads the app's saved copy
   — which is the old broken one for "Review - Apex" (its fixed copy was put online by hand
   under a different link, `xfix7ee298e757c4`, until 2026-10-07).
4. **Links expire 7 days after the first 🔗 Copy link** — students who open a link late see
   "This link has expired"; Copy link then shows "This link has expired" too (no renewal since
   2026-10-03) — the teacher makes a new copy with "Use again" or sends the file.
5. **Students open files inside Telegram/Instagram viewers** — no microphone there, and
   iPhones can't open .html files at all. Links (play.html) are the answer; the exercise
   shows "Open in Chrome" when it detects the problem.

6b. **Working with no internet** (fixed 2026-10-27, after it hurt): the weekly re-read of results ran offline,
   the database answered "nothing" from its empty memory and that was kept → Top 5 dropped ("21 of 24" → "4 of 21");
   "Reset All Points" pressed offline queued on the phone and every press arrived the next day → −120. Now reads that
   decide anything use `getDocsFromServer` (offline = error, nothing kept/written), the old results copy stays until
   a re-read works (`rs.failed` re-read on `online`, `RS_VERSION` 2 forced one full re-read everywhere), Reset needs
   the internet, runs once at a time and sets every total — below zero too — to 0. Other teacher writes (bonus +/−)
   still queue offline and arrive later — that's intended. `tests/data-safety.spec.js`.

**Less likely (< 20 %) but serious**
18. **"Delete all results"** — its marker is allowed since the lock (2026-09-30). A deletion made on one device reaches the others' kept copy only at their weekly full re-read.
6. **The database lock is on (rules published 2026-09-30; CP showed "🟢 The database is
   locked").** Only signed-in teachers can save their own kinds of records or delete. Still:
   anyone can *read* everything and send *fake student results or points* (students' scores
   are computed on their device), and the passwords' fingerprints (`TA_ACCOUNT` hashes) are
   public, so a weak password could be guessed offline. If someone pastes old rules back into
   Firebase, the lock is gone — CP's "🔐 Database lock" box shows the state.
7. **A fake exercise link could run someone else's code on the teacher's site** — much less
   likely since the lock: only signed-in teachers can create `TA_SYNC:PLAY` records. Still advise: only open exercise links the teacher shared themselves.
19. **Teachers whose password isn't saved in the Control Panel can't save to the locked
    database** (their synced data, links, points). CP shows "🔐 Database: can't save yet" — the
    administrator sets their password again with 🔑 Change password (it can be the same one).
20. **If the administrator's password changes**, the administrator gets a new database account
    (new id), so the rules must be copied from CP and published again.
8. **Browser storage filling up** (~5–10 MB per site): My Exercises keeps copies of exercise
   files and builder forms (pictures included). Files over 1 MB go to IndexedDB instead
   (`taPutBigFile` in common.js, newest 15, since 2026-10-02 — before that they weren't kept
   at all, so a 2.1 MB set with pictures couldn't be Redownloaded or split); a missing copy is
   fetched back from its online link while it lasts (`taEnsureExerciseHtml`). Big files are
   not in the backup file or synced to other devices. When full, older saved copies are dropped
   (so "Redownload"/"Use again"/Share-renewal may stop working for old exercises) and, in the
   worst case, new data can't be saved.
9. **Forgotten password = synced data can't be read.** Sync is encrypted with a key from the
   teacher's password; on a new device without the password, cloud copies are unreadable.
   The backup file (Settings → Backup, weekly reminder) is the safety net — it also holds
   every result, so deleted results can be put back. It only protects if the teacher
   actually downloads it and keeps it somewhere other than the same device.
10. **Speech recognition depends on Google's servers** (Chrome's Web Speech API): needs the
    internet, can be slow or refuse at times; Safari on iPhone works less reliably.
11. **The site's address must not change.** Renaming the GitHub repo/user, making the repo
    private (Pages may stop), or a stuck Pages deployment breaks every link and the login
    animation inside exercise files (the address is written into each file).
12. **The Firebase SDK in exercise files is loaded from gstatic.com (version 10.12.5)**; if
    that URL ever stopped working, students' results would stop. The teacher app itself keeps
    its own copy since 2026-10-01 (`js/vendor/firebase-10.12.5/`). Very unlikely.
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
21. **Writing's grammar check (LanguageTool, free) allows about 20 checks a minute per connection** — a whole class on one Wi-Fi may see
    "press Check again" (the text is still sent; the band then uses only the length).

## Automatic tests — run them before every merge

`npm test` (Playwright, `tests/*.spec.js`, ~40 s; see `tests/README.md`). In this cloud
environment: `npm install` then `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test`.
They also run on GitHub for every push (`.github/workflows/tests.yml`). **Run them before
merging into `main`, and don't merge while any fail.** When you add or change a feature, add
or update a test for it. The tests use a stand-in database and a made-up class — never put
real students' names or results into the repository (it is public).

## Homework/Class sets: a round is done only when its answers are saved

- The set file (`buildAndDownloadHwc` in `js/pages/create.js`) runs each round in an iframe
  and puts `hwcRoundHook` into it: the round's `submitResultToFirebase` hands the result to the
  set, which saves it with its own id (`r_<code>_<student>_<date>`, `setDoc`; a retry of a
  record that's already there is refused → `getDocFromServer` confirms it), up to 3 tries, and
  only then writes `HWC_PROGRESS` and moves on. If it can't, the student sees "Try again".
  Before 2026-10-01 a round said "done" before its own upload finished, so a failed upload
  still counted as Completed with no answers (seen for 2 of ~15 students in "Present simple";
  `TA_FILE_FIXES` id `setsave` points out the old sets). A round type that sends no result
  moves on after 3 s. `tests/exercises.spec.js` ("Homework set: …").
- Every round (the last too) is saved as soon as it's finished, so the teacher sees progress
  live. At the end the student presses "📤 Send my answers to my teacher" (`hwcSendNow` →
  `hwcVerifyAll`): for each round it asks the server (`getDocsFromServer`, `code` + `studentId`,
  else `name`) whether that round's answers are there; missing ones answered on this visit are
  sent again (`hwcSaved`), missing ones from an earlier visit → "Do it again" (`hwcRedoMissing`);
  missing progress records are written again. `animations/sending-answers.json` plays (lottie
  from the site, a CSS bar offline) for at least 5.3 s, then "✅ All your answers have reached
  your teacher" + the certificate. A result without a time gets the time the set measured
  (`timeFromSet`), so no 00:00. A **Dictation** round (label "… — Dictation" or a result of type
  Dictation) isn't covered when it ends: its page with the mistakes stays, saving in the
  background, with `#hwcReviewBar` "Next exercise →" (2026-10-02); since 2026-10-05 its button waits
  30 s with a countdown (`HWC_LOOK_SECONDS`, `hwcReviewSince`) so students look at their mistakes first.
- **A round counts as done when its answers are there** (2026-10-05): a Dictation's progress record used to be written
  only when the student pressed the button under the mistakes — 2 students closed the page first, so the teacher saw 5/6
  though the dictation answers had arrived. Now the set writes it as soon as the answers are saved (`hwcProgressSent`, no
  duplicate on the press), and the teacher's view (`rsDeriveHwc` in firebase.js) marks a round done when the student's
  answers for its code exist even without a progress record (codes from other progress records or the set's `mergedItems`,
  which are also loaded). `tests/results.spec.js` ("a set: a Dictation whose answers…").

- **No ID screen and no certificate inside a set** (teacher, 2026-10-27 — each flashed ~2 s and confused students):
  `hwcRoundHook` gives the round a ready answer for `taCheckAward` (the set checks the last round's points once at
  `hwcBegin`, `hwcCheckSetAward`, and passes `award` in the identity), so it starts at once; a style in the round never
  draws its start screen (`#startOverlay`, `#slide-welcome`, overlays with `.ta-login-stage`) or its certificate
  (`#certModal`, `#slide-certificate`, `#slide-thanks`, `#endOverlay`, `.certificate-card`); a MutationObserver posts
  `round-finishing` the moment one would show, and the set covers the round with "Sending your answers…" (not a dictation —
  its mistakes stay). Rounds never go full screen inside a set (`noFull`). Maze in a set: after GAME OVER a new try starts by
  itself (no result screen there). Old sets: `TA_FILE_FIXES` `setflash`, `setfull`.

## Results kept on the device (keep this in mind when changing how results load)

- `js/firebase.js` keeps every result it has read in IndexedDB (`ta_results_cache…`, per
  account namespace) and derives `__allResults`, `__plainCompletions`, `__pointsLedger`,
  `__liveResults` and `__hwcProgressDocs` from it (`rsDerive*`). Loading: `rsEnsureCodes(codes)`
  reads a code's results once (`code in […]`, 30 per query); `rsStartDelta` listens to
  `submittedAt > newest kept − 10 min` for everything new. Records without `submittedAt`
  are never seen by that listener — every result/points/progress record must carry
  `submittedAt: serverTimestamp()` (exercise files do; the teacher's own points writes do
  since 2026-09-30). `taResultsCacheInfo()` in the console shows what's kept.

## Old exercise files (made before a fix)

- `TA_FILE_FIXES` in `js/common.js` lists fixes that need the teacher to recreate files: `at`
  (when the fix reached the site), `types` (regex on the My Exercises type / a set round's
  label / a result's `type`), or `test(html)` (the kept file shows the problem itself —
  `taFileScriptBroken` tries to read each plain `<script>` with `new Function`), and `minor`.
  **When you fix a bug that lives inside exercise files, add an entry here** (with the time
  the fix is merged), so the teacher is told which files to recreate.
- Shown in: My Exercises (a line under the exercise, `taOldFileIssues`), Results (a note when
  results came from a file whose `builtAt` is before a fix, `taOldFileBannerHtml`), and a
  top-right note on entry ("⚠️ Old exercise files", `taOldFileWarnCheck`, 12 s after load;
  "Got it" → `ta_old_file_ack`). Minor fixes only show in My Exercises/Results.
  `tests/old-files.spec.js`.

## Results backup (Settings → Backup)

- "Download backup" (`downloadBackup` in `js/pages/settings.js`) puts the app's data **and**
  `results: [...]` — every record of this teacher's exercise/points codes, with its database id
  as `__id` — into one JSON file (`taResultsForBackup` in firebase.js reads the teacher's codes
  first). Restoring such a file offers two checkboxes: the app data (replaces it, as before)
  and "put back results deleted from the database" (`taRestoreResults`: reads the codes fresh,
  re-creates only missing ids with `setDoc`, `submittedAt: serverTimestamp()` and `restoredAt`;
  skips `ta-reset` markers, `TA_SYNC:*`, and results of codes the teacher deleted on purpose).
- A browser can't save files by itself, so `taBackupReminderIfDue` (common.js) shows
  "💾 Time for a backup" when the last backup from this device is over 7 days old
  (`ta_last_backup_at`; "Remind me tomorrow" → `ta_backup_remind_at`). The tests seed
  `ta_last_backup_at` so the reminder stays out of the way.

## Database lock (Firebase Authentication) — keep this in mind when changing writes

- `firestore.rules` (in the repo, with `__ADMIN_UID__`; CP.html → "🔐 Database lock" shows it
  with the administrator's id filled in, to paste into Firebase). Reads stay open. Students'
  exercise files can create records of the student shape (`code` 6 chars, `name`, `type`, `v`)
  that aren't a teacher's kind. Teacher's kinds — `TA_SYNC:*` (sync, exercise links),
  `POINTS:Bonus`/`DISABLE`/`Removed`, `kind: 'ta-reset'` — and **every delete** need a signed-in
  teacher; `TA_ACCOUNT` and the `accounts` collection only the administrator (by uid). No
  updates. **A new kind of record the teacher's app writes must be added to `teachersKind` in
  the rules, and to the stand-in in `tests/support/fake-firestore.js`.**
- Each teacher's database account (`taCloudIdentity` in `js/accounts.js`, copied in CP.html):
  e-mail `<login>+<tag>@teachers-assistant.app`, tag = first 12 hex of
  sha256(`TA-AUTH-v1|LOGIN|password`), password `TA1|LOGIN|password`. The app signs in at login
  (`taCloudSignIn`, making the account the first time) and saves the e-mail as `ce` in the
  session; on load `taCloudCheck` (common.js) asks for the password once if this browser isn't
  signed in to that account ("🔐 Enter your password once"), and again when a write is refused
  (`permission-denied` → `taCloudRefused`). Logout signs out too.
- CP.html signs in as the administrator at its sign-in, and keeps `accounts/<login>` =
  `{ status, tag }` in step with the teacher accounts (it can work out the tag because it
  keeps the teachers' passwords, encrypted). A new password → a new tag → the old database
  account stops working by itself; turning a teacher off → `status: 'off'`.
- Tests: `tests/support/fake-auth.js` stands in for firebase-auth; `prepare(context, { rules:
  true })` makes the stand-in database refuse teacher's kinds without a sign-in.
  `tests/database-lock.spec.js`. The real rules were checked with the Firestore emulator
  (`firebase-tools` + `@firebase/rules-unit-testing`, needs Java) — do that again when changing them.

## How exercise links work (keep this in mind when changing them)

- `js/firebase.js` → `taPublishPlay` writes an exercise as records `play-<uid>`,
  `play-<uid>-1`, … (300 000 characters each; a Firestore record may hold 1 MB). Fields follow
  the sync record shape (`code: 'TAUSER'`, `type: 'TA_SYNC:PLAY'`) because the security rules
  only allow certain record shapes — a different `type`/`code` is refused (403).
  `title` = `uid␟part␟total`, `score` = characters in that part, `date` = when published.
  **The rules allow creating and deleting records but not changing them** (a PATCH/`setDoc`
  on an existing record is refused, 403) — so re-publishing deletes the old records first.
- **Exception (2026-10-05):** an exercise whose file has "Open in Chrome" (`taOpenChrome` — Pronunciation, or a set
  with a Pronunciation round) goes online as soon as it's made (`taPutOnlineNow` in `pushRecentExercise`, sets `linkAt`),
  or the button led to "This exercise isn't online". In a set, a round's button opens the set's link (`buildAndDownloadHwc`
  rewrites the round's `play.html?x=`). Older such files: press ⋯ → Copy link once and their button works.
- Since 2026-10-03 nothing goes online by itself (before, `pushRecentExercise` published every
  new exercise 5 s after it was made). The first ⋯ → 🔗 Copy link (`copyRecentExerciseLink` in
  `js/pages/my-exercises.js`) publishes it and sets `linkAt` on the My Exercises item; later
  presses copy the same link without publishing; from `linkAt` + 7 days (`taLinkExpired` in
  common.js) it shows "⌛ This link has expired" (`showLinkExpired`) and never renews.
  `taPublishPlayable` records `playAt`/`playParts`/`playBytes`. (The old Share window,
  `shareRecentExercise`, unreachable, still renews.) `tests/links.spec.js`. Exercises merged into a
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
  one stamp, e.g. `v=20261001c`), or browsers keep the old files: run `npm run stamp`
  (`tools/bump-version.js`; date + letter). `tests/housekeeping.spec.js` checks every page
  uses one stamp and that the files exist.
- Sections open without a reload (`taNavigate` → `taLoadPage` fetches the other page's HTML
  and adds its panels and scripts). That fetch uses `cache: 'no-cache'` (GitHub Pages lets
  browsers reuse a page for ~10 min, which mixed a new section with an old one after an
  update — 2026-10-02), and if the other page's `?v=` stamp differs from the open page's,
  it opens with a full page load instead. `tests/pages.spec.js`.
- Speed (2026-10-04): every device except "data saver" loads the other sections in the
  background (`taPreloadSections`). My Exercises used to re-read the whole saved-files store
  (`ta_exercise_html_cache`, several MB) once per card (~1 s with ~60 exercises): it's now read
  once per drawing (`taReadHtmlCache`, cleared after the current task and by every writer via
  `taForgetHtmlCache`). Don't read that key directly in loops — use `getCachedExerciseHtml`.
  The Dashboard (Top 5 + overall %) re-scored every dictation each time (word-by-word diff,
  twice per result, twice per drawing — ~2 s+ with many dictations): `taDictAlign` now compares
  each word pair once, and `taDictDiff` keeps finished answers (`TA_DICT_DIFF_KEPT`; callers must
  not change the returned list). Test: "the Dashboard opens quickly…" in `tests/pages.spec.js`.
- Firebase for the app (js/firebase.js, CP.html) comes from `js/vendor/firebase-10.12.5/`
  (the npm package's browser builds, import of firebase-app pointed at the folder — see its
  README). Exercise files and the downloadable points board still use gstatic.com (they open
  from anywhere). To upgrade: new folder with the new version, change the imports, re-test.
- `sw.js` (offline helper) keeps copies of the site's own files, the Firebase copy included;
  the tests block it (`serviceWorkers: 'block'` in playwright.config.js), or it would hand
  out the real Firebase files instead of the stand-ins.
- Settings → 🩺 Status (`renderStatusPanel` in js/pages/settings.js): database, database
  sign-in, results kept, sync, last backup, links space, browser storage, version. When
  something "doesn't work", ask the teacher for a screenshot of it. Last database error:
  `window.__taLastDbError` (set by `taReportDbError`).
- Text put into an exercise template's `<script>` must be escaped for a JS string
  (`escapeForJsString`); titles use `escapeForTemplateText` (page text and script at once).
  Raw line breaks or quotes there break the whole exercise.
- Exercise templates are stored as JSON strings on one line each in
  `js/exercise-templates.js`; edit them by parsing the string, changing it, and writing it
  back with `JSON.stringify(t).replace(/<\//g, '<\\/')`.
- Accounts: each teacher's `localStorage` is namespaced (`js/accounts.js`); the admin
  `TOXIRJON` uses un-prefixed keys.
- **Top bar (no sidebar since 2026-10-03)**: `taMountTopBar` in common.js builds it on every page
  (`#taTopbar`, fixed, no background of its own — the buttons float over the page): 🧶 loom (emoji only on phones) ·
  5 sections in the middle as emojis in a sticker pill — the name is the tooltip (`TA_TOPBAR_TABS`:
  Dashboard 🏠, Create ✨, My Exercises 📚, Statistics 📊, Students 🧑‍🎓) · 🔍 search, ☀️/🌙 Day/Night (`#themeToggleBtn`,
  `toggleDayNight`; only Day and Night), ⚙️ Settings (no sound button since 2026-10-03), profile picture (red dot when sync needs the teacher, `data-sync`). The section
  you're in sits in a circle of that section's colour drawn as an SVG path; `taMoveTabBlob` animates it like the
  teacher's "Liquid Tab Bar" lottie (front races ahead, back follows, a narrowing neck, then a wobble).
  Results lights up My Exercises. Phones (≤ 860px): the sections float at the bottom (no background; never put
  a backdrop-filter on `#taTopbar` — it would hold the fixed tab bar inside it). Toasts and the
  top-right notes sit below the bar. `tests/pages.spec.js` ("top bar: …", "on a phone …").
- **Results isn't in the top bar or the quick search** (2026-10-03): it opens from My Exercises
  ("📊 View Results" on a card, `results.html?exercise=<uid>`), and has "← Back to My Exercises".
- My Exercises is a grid of cards (`.myex-grid`, 4 in a row): the type's Create-page picture (`myexTypeIconHtml`,
  `MYEX_TYPE_ICONS` typeLabel → `picker-icon-*`; sets show Homework/Class; also small on the type filter chips — as `<i>`, since a
  chip's `<span>` is its count and the class `chip` is taken), title ✎ ⚠️(made before a fix) ⋯,
  🗑 + View Results — both with the teacher's coloured pictures (`myexPicHtml`: `myex/delete.png`, `myex/view-results.png`). ⋯ (since 2026-10-04) starts with what it is — type + group (👥 changes it),
  code · date (no year) (`myexInfoHtml`) — then Use again, Get one exercise (sets), Copy link, Redownload, each with the teacher's line icon (`images/icons/myex/`, `myexIconHtml`, CSS mask in the design's colour). The Share window code (`shareRecentExercise`) is no longer
  reachable from the cards.
- Results → "⚖️ Punish?" / "⚠️ Will be punished" (`taPunishChipHtml` etc. in common.js): per
  exercise/set code + student, kept in `ta_punished` (synced, in the backup); marked rows turn
  red in the results table, a set's student list and "Didn't do it". My Exercises shows
  Homework/Class sets with a coloured edge (their Homework/Class label is at the top of ⋯).

## Students & Points, profile, Settings (2026-10-03)

- **Students & Points** (`students.html`, `js/pages/students.js` + `js/pages/points.js`) is one
  section: groups (with their lesson days/times), students' IDs and points. `points.html` only
  redirects there; `switchTo('points')` opens `students`. A group's lessons are the
  `ta_weekly_schedule` entries with the group's **name** — `openGroupEditor`/`saveGroup` keep them
  in step (rename, ticked days, level; unticked days are archived so "Lessons taught" never
  drops), deleting a group removes them (Undo puts them back). Inside a group each student is a
  row: name ✎ (`renameRosterStudent`: name + group) 🗑 ID-chip, then − 🪙 + (tap 🪙 → `openStudentPoints`).
  Every name gets the longest name's width (`alignStudentNames`, `--sp-name-w`), so ✎ 🗑 ID stand in columns.
  "➕ Add student" opens ID then Name (`studentsAddOpen`). Group level is a list (`GROUP_LEVELS`:
  Beginner … Advanced, IELTS; an old typed level like "A2" stays as a choice).
  New points only update the numbers (`renderPointsBoard` → `[data-pts-for]`/`[data-group-pts]`),
  so the add-student form isn't wiped. `tests/students-points.spec.js`.
- **Top 5 Active Students** (Dashboard, `getTopActiveStudents` in `js/pages/main.js`, 2026-10-05): per group, the average
  over the exercises given to that group (`taAssignedCodesByGroup`: My Exercises items with that `groupId`; a set's rounds
  one by one) plus any others the student did — best try per exercise, **not done = 0%** (the teacher asked: one good
  exercise mustn't beat three good + one bad). Done-but-unscored (unrated Sentences) is left out; IELTS and code-less games
  (Jungle, Bamboozle) don't count; students who did nothing aren't listed. Shows "N of M exercises done".
  `tests/results.spec.js` ("Top 5: …").
- The lesson plan opens from the group's name on an Upcoming Lesson (Dashboard). Lessons in the next
  24 hours stand out there (`.lesson-row.lesson-soon`, tinted in the group's colour `--lesson-c`).
- **Statistics** (`renderDashboard` in `js/pages/statistics.js`, 2026-10-03): one card per exercise
  type with activity in the last 7 days — a line of completions per day (roster students only),
  today vs yesterday (▲/▼), today's piece of the line dashed (`.sc-tail`), dotted 7-day average.
  Types aren't compared with each other any more. `tests/statistics.spec.js`.
- **Profile**: only in the top bar — the picture opens a menu `#tbProfileMenu`: name →
  `taOpenProfile` (name + language), the sync status line, Change profile picture (`taPickAvatar`),
  Log out (`taLogout`). The Dashboard's greeting card has the teacher's "Programming Computer"
  lottie instead (`animations/welcome-computer.json`, `#heroTaskAnim`, `initHeroTaskAnim`; before it
  a "task" lottie) — not on phones, where the greeting + robot stay on one line. **Settings** has only Install, Backup, Status.
- **Can Knockdown** (2026-10-04, tab `canknock`, prefix `ck`, type label "Can Knockdown", icon
  `images/icons/create/canknock.png`): the teacher writes word + translation (Flashcard-style rows, 🌐 fill
  translations, at least 2). `createCanKnockdown` builds on **QUIZ_TEMPLATE with `QUIZ_MODE` "canknock"**
  (items `{word, prompt: translation, options: [translation], answer: 0}`). The student file (`#slide-cans`,
  `ck*` functions in the template) fills the whole screen with the teacher's room photo
  (`images/canknock/room-wide.webp` 2560 px — its baked "Cans left: 6" box blurred out — and `room-tall.webp` 1536 px for
  portrait; pinned to the top so the title on it is never cut; loaded from the site via `APP_URL_FOR_CK` = `__TA_APP_URL__`, a dark-room gradient offline;
  `ckLayout` puts the cans on the photo's table line). Six cans — the teacher's three can pictures, mixed,
  given depth with masked shading/shine and shadows — stand on the table (1 on top · 2 3 · 4 5 6, each on the
  lids below; the numbers only set which falls next); the translation (e.g. Uzbek) is handwritten (Caveat, OFL, from
  `fonts/caveat-700.woff2` on the site, else Google Fonts) on a paper with the teacher's blue scribble
  under it (right; above the cans on phones); the student types
  the English word in the bottom bar and presses Hit/Enter — no voice (`ckAccepts`: "a / b" accepts either; case,
  ʻ ' ’ and one wrong letter in words of 5+ letters don't matter). Right → the teacher's tennis ball
  (`CANKNOCK_IMAGES_CSS` — ball, cans, scribble, ~40 KB — only in these files) knocks the lowest-numbered can down; wrong → miss, the right
  English word shows, the word comes back later in the round; next round only when every can is down.
  Only the first try counts (`answers[i]` 0/1, typed text in `ckTyped` → the result's mistakes). Also in Homework/Class sets, "Use these words in…",
  Use again. `tests/canknock.spec.js`. Spelling/Test files are unchanged (all `ck` code is behind
  `QUIZ_MODE === 'canknock'`).
- **Car Game** (2026-10-04, tab `cargame`, prefix `cg`, type label "Car Game", icon `images/icons/create/cargame.png`): until
  then Flashcard's "Car game" design (Flashcard no longer has a Design choice). `createCarGame` builds `CAR_GAME_TEMPLATE`
  (word + translation rows, at least 4; Seconds to answer, Driving speed) and adds `CARGAME_IMAGES_CSS` (the teacher's two
  buildings `.cg-bld1/.cg-bld2`, the warning sign `.cg-sign`, fence, trees, bush, puddle — webp, ~90 KB — only in these files). The player's car is the
  teacher's "Car on track" lottie car as an inline SVG; warning signs stand in two lanes (no oncoming cars); the buildings stand in the
  far skyline only; by the road: the teacher's trees/bush (`.cg-trees/.cg-bush`), lamps, green grass; the fence (`.cg-fence`, the teacher's
  isometric picture un-skewed into a flat panel) is one straight strip per side standing on the road's edge between path and
  grass (`.fence-wall`, `FENCE_H/FENCE_FROM/FENCE_LEN`, scrolls with `fenceRun`); coloured puddles (`.cg-puddle`) lie flat on the grass
  among the trees (`placeFlat`). Results have `type: 'Car Game'` (old car-design files still say Flashcard). "Use again" on an old
  Flashcard file made with the car design opens the Car Game builder (`carGameFromFlashcard` in my-exercises.js). Headless
  Chromium without GPU doesn't draw the player's car (3D) — screenshots need `--enable-gpu --use-angle=swiftshader`.
  `tests/cargame.spec.js`.
- **Rocket Game** (2026-10-06, tab `rocket`, prefix `rk`, type label "Rocket Game", icon `images/icons/create/rocket.png`, in the
  "Ready to use" group after Car Game, with Pronunciation — both moved there from "In process" on 2026-10-06): until then Pronunciation's "Rocket game" design (Pronunciation no longer has a Design
  choice; it keeps Pass score, no "Tries per word"). Same word + pronunciation + icon rows (`makePronRow(rkRows)`, 🔎 look up);
  Pass score, Accent, Strictness. `createRocketGame` builds `ROCKET_GAME_TEMPLATE` and adds `ROCKETGAME_IMAGES_CSS` (the teacher's
  rocket, Earth, Jupiter (yellow), Mars (red), stars and laser pictures, webp, ~36 KB — only in these files). The teacher's design
  (same day): the whole screen is the game — no box in the middle; the stars stream down while playing (`.sky`, two copies for a seamless loop, Web
  Animations `skyAnim` — `skySpeed(1)` cruising, 9 while flying through a gap, 0 when not playing) but Jupiter, the Earth and
  Mars stay put at the sides, in proportion Jupiter > Earth > Mars — the Earth is **not** under the rocket, the teacher asked); the rocket flies **bottom → top** (`rocketTo('home'|'above'|'below')`); for each word a laser on the
  left and one on the right (`#laserRow`, right one mirrored) with a red sparkling beam between them (`#beam`) and the word above
  it — said right (≥ pass score) → the beam switches off, the rocket flies out of the top and the next one rises from the bottom.
  **3 hearts** (`HEARTS`): a wrong try (not silence) costs one and the laser stays; none left → "💔 Out of hearts", result sent
  (`heartsLeft`). **Press and hold 🎤 while speaking** (teacher, 2026-10-06; the space bar works too): the microphone is
  off otherwise — after the first screen gets the permission it's let go (`rkMicRest`); `micDown` starts the engine and collects
  what's heard (`rkArm`), `micUp` stops it and `holdDone` marks it 0.45 s later (1.5 s if nothing arrived yet — the last words
  come just after letting go); pressing again first checks the waiting try. No pressing while no laser is on, or 1.3 s after a
  wrong try. Results have `type: 'Rocket Game'`. It has "Open in Chrome", so it goes
  online as soon as it's made (like Pronunciation). "Use again" on an old Pronunciation file with `pr-design: 'game'` opens the
  Rocket Game builder (`rocketFromPronunciation` / `builderFormNow` in my-exercises.js, set rounds too). `tests/rocket.spec.js`.
- **Maze** (2026-10-07, tab `maze`, prefix `mz`, type label "Maze", icon `images/icons/create/maze.png` — the teacher's; "Ready to use", after Rocket Game): a quiz in a 3D labyrinth. Builder: questions, each with a
  ✅ right and a ❌ wrong answer (`makeMazeRow`, 3 empty rows to start, at least 2). `createMaze` builds `MAZE_TEMPLATE`
  (questions as `__QUESTIONS_JSON__` `[{q,a,b}]`, `<` written as `\u003c`). The file draws with **three.js r128**, loaded from the
  teacher's site (`js/vendor/three-0.128.0/three.min.js`, MIT) via `APP_URL_FOR_MZ`, else cdnjs/jsdelivr; without it or without
  WebGL the game still works (questions only, `#mzNoGl` note). **three.js is downloaded only after the student's ID**
  (`loadMaze3D` in `startGame`), behind `#mzLoading` with the Homework sets' `animations/sending-answers.json` (lottie from the
  site; a CSS bar when opened as a file — the JSON can't be fetched from file://), at least 2.6 s. `buildMaze(N)` makes a new labyrinth every try: a cell grid
  (centre = the light), the route built backwards from the centre — straight piece, turn, … one T-turn per question, the way
  straight on (backwards) a 1-cell dead end, then straight out to the edge (the entrance); the rest is ordinary maze passages that
  never open onto the route. Seen from above (slow orbit), then `flyToStart` swoops to the entrance;
  the player walks on rails to just before each turn (`goToJunction`, 2.2 before the cell): the question on the wall ahead, the two
  answers on the walls left/right (canvas-text planes) + HTML banner/buttons (`#mzQuestion`, `#mzOptL/R`, ← → keys). Right → turn,
  walk on; wrong → turn into the dead end, "GAME OVER" on its wall → end screen with the right answer and "🔄 Try again — new
  order" (`newOrder` never repeats the last order) or "📤 Stop and send my result". **One result per game** (teacher, 2026-10-07):
  sent when the maze ends — the light reached, Stop pressed, or the time limit (`sendFinal`); nothing after a game over alone (a
  student who closes the page then sends nothing). It holds every try (`tries: [{n, correct, total, won, end, q, chose, right,
  seconds}]`, `attempts`), `score` = 100 if the light was reached, else the best try's %; points only for reaching the light.
  Results → "👁 N attempts" (`viewMazeResult` / `taMazeTriesHtml` in common.js) lists each try. `window.__mzFast` speeds the animations (tests).
  `tests/maze.spec.js` (also checks 16 labyrinths' shape).
- **Phones (2026-10-27)**: the glass design has no blur on phones (`--glass-blur: none`, more solid panes — dozens of blurred
  layers made scrolling lag/flicker); ⟳ in the top bar on phones / the installed app (`taRefreshApp`: sends what's waiting, reloads);
  the installed app opens the section the teacher was on in the last 6 h (`taRememberPage`/`taResumeLastPage`, `ta_last_page`);
  the hero lottie isn't even downloaded on phones; `sw.js` uses a saved `?v=` file as it is (no background re-download — every
  visit re-downloaded ~3 MB); Results rows are cards (`td.res-c-*`), a set's student rows put name + "4/4 · %" on one line; the notice
  stack fits the screen and scrolls; no tap highlight in the top bar; `html, body { overflow-x: clip }`. **Light sync**
  (`listTitles` REST select title → `getByIds` only for items whose newest version ≠ `ta_sync_seen`; other open devices learn of a
  change from small `TA_SYNC:<login>:SIG` records via `listenSig`, own signals skipped, older than 1 h deleted; on any error the old
  full listener runs). `tests/phone.spec.js`, `tests/sync-light.spec.js`.
- **One look for every student exercise (2026-10-27)**: `js/student-theme.js` (`TA_STUDENT_THEME_CSS`, loaded on the Create page)
  is added once to every student exercise file (has `.ta-login-stage`) and every set (`hwcBegin`) by `taApplyStudentTheme` in
  common.js — in `downloadFile`, `pushRecentExercise` and each round of `buildAndDownloadHwc` (`<style id="ta-student-theme">`
  before `</body>`, so it comes last). It styles only what all exercises share: the start card (`.ta-login-form` title/`.headline`,
  one type chip — `.eyebrow` hidden —, 54 px name box, a gradient Start button; `:is(#ta-theme, …)` gives rules an id's weight over
  templates' own `!important` colours; never `display` on `.ta-input-wrap` — a hidden class-code box must stay hidden), the top-bar
  toggles, the finish cards (`.certificate-card`, `.certificate-box`, `#endOverlay .panel-card`, `.ta-cert-box`) and a set's screens
  (light `.ta-screen`, `.ta-btn`, `#hwcBar`, `#hwcReviewBar`). Games' own pictures are untouched; the name tag is hidden on phones.
  Files made before keep the old look. `tests/student-theme.spec.js`.
  **Since 2026-11-02 it uses the app's playful design** (teacher: "make the students' exercise files match the new design"):
  cream/white sticker cards with a 3 px dark outline and a hard shadow (`--tas-shadow`), a yellow tilted type chip, a rainbow
  underline (`.ta-underline`, `.divider-dash`), cream name boxes (also `#dcNameInput`, `#ecNameInput`, `#ilNameInput`, `#irNameInput`,
  `#iwNameInput`), a pink → purple → blue Start button that sinks when pressed, Fredoka (Google Fonts, `@import`; offline: system
  font); slide-deck exercises (Flashcard, Sentences, Spelling, Test…) get the sticker on `.deck-container:has(#slide-welcome.active)`.
  Set screens: plain cream page (no confetti dots since 2026-11-05), 🎉 after the headline.
- **Teacher Studio design (teacher, 2026-11-07: "make loom's design like this" + 2 screenshots; dark only; icons instead of emojis)** —
  a layer at the very end of css/style.css on `body.loom-studio` (added by `applyTheme` on the teacher's pages; skill.html and exercise
  files keep their own look): page `#0E1017`, cards `#161922` with a 1 px border and soft shadow (no stickers, no tilting), indigo
  `#6366F1` buttons, green eyebrow `#34D399`, Plus Jakarta Sans, the playful yellow highlights turned soft indigo (`--c-yellow`).
  **Dark only**: `getTheme()` always 'dark', no ☀️/🌙 button (`toggleDayNight` does nothing). **Icons are Lucide** (ISC, the set the
  teacher liked in WeWeb) — `css/icons.css` made by `node tools/make-icons.js <lucide-static icons folder>` (add a name to its list):
  `<i class="lc lc-<name>">` draws in the text colour; `--ic-<name>` for `::before` masks. Top bar: logo square + "loom / Teacher Studio",
  `TA_TOPBAR_TABS[].icon`; exercise types: `--ti` per `picker-icon-*`; My Exercises: `MYEX_ICON`. Dashboard greeting: date + session line
  (`#heroEyebrow`) and "Next class on schedule" (`renderHeroNext`). Many emojis inside texts/messages remain.
- **Students' course pages dark too (teacher, 2026-11-08: "now change course exercises design")**: skill.html has `id="skBody"`
  + `sk-studio` and loads `css/skill-dark.css`, made by `node tools/make-skill-dark.js` from the "SKILLS COURSE — STUDENT PAGE" rules
  in css/style.css (only colours, borders, shadows and fonts, turned dark; `#skBody` in front outweighs the student theme). **After changing
  those rules, run the tool again.** The word emojis stay (the teacher asked for them). Exercise files (Create page) keep their look.
- **AI robot (2026-11-07, teacher: "AI robot should be AI completely… user should ask any question")**: the robot is a chat (`renderAiRobotChat`,
  `aiRobotAsk` in common.js): a greeting, two of the section's questions as chips, a box + Send. Questions go to `TA_AI_URL` (`https://loom-ai.toxiraxii010.workers.dev`, the teacher's worker, set 2026-11-08) — a
  Cloudflare Worker (`tools/ai-worker.js`; **Google Gemini's free plan since 2026-11-08** — teacher chose free over Claude — model
  `gemini-flash-latest` or the variable `GEMINI_MODEL`, the key kept as its secret `GEMINI_API_KEY`, only the teacher's site allowed,
  8 questions/min per IP; on the free plan Google may use the questions — no students' private details) — with the chat so far, the section, the language, and all the saved questions + answers as
  Loom's notes (`aiRobotKnowledge`). **The saved FAQ stays** (it's the AI's knowledge and the fallback): with no `TA_AI_URL` or when the
  AI fails, the closest saved answer shows (`aiRobotBestFaq`, rare words weigh more). `localStorage.ta_ai_url` overrides the address
  (tests). The chat's text is selectable (the widget is `user-select: none` + grab for dragging; `.ai-robot-bubble` turns it back). `tests/robot.spec.js`.
- **Playful design (teacher, 2026-11-02: "change Loom's design entirely, build it from 0 — colourful, playful,
  satisfying, use emojis")** — replaces the 2026-10-27 glass/black+red look and the line icons. The look lives in the
  "LOOM — PLAYFUL DESIGN" layer at the end of css/style.css (tokens in `:root` = Night, `body.light-theme` = Day); the
  rules above it only place things. Recipe: candy colours (`--c-red/orange/yellow/green/teal/blue/purple/pink`), every
  block is a "sticker" — 2.5 px dark outline `--line` + a hard shadow under it that the block sinks into when pressed
  (`--shadow-md` = `0 5px 0 var(--line)`), bouncy motion (`--bounce`), Fredoka headings + Nunito text, confetti dots on the
  page. **Page background (teacher, 2026-11-05: the confetti dots looked childish): plain cool slate — Day `#EDF0F4`, Night deep navy `#121722`, no dots** (the sign-in screen too); the students' course page (`body.sk-body`, skill.html) keeps cream `#FFF5E1` / plum `#1B1535`, also without dots (teacher, 2026-11-05: "delete background dots in exercises"; new exercise files' set screens too — files made before keep theirs); body class `loom-fun` (no more `glass-ui`). Gradients are
  allowed again. **Icons are emojis**: the top bar's sections (`TA_TOPBAR_TABS` `emoji` + `color` — the moving circle takes
  the section's colour, `--blob-c`), tools 🔍 ☀️/🌙 ⚙️ 🔄, logo 🧶 + "loom" in four colours; every exercise type's
  `picker-icon-<type>` gets an emoji (`--te`) on a sticker of its colour (`--tc`) from one CSS list
  (`:is(.picker-card, .tab-btn, .myex-card, .myex-type-chip):has(.picker-icon-x), .picker-icon-x`) — a new type: add a line
  there. My Exercises' buttons use `MYEX_EMOJI`; emojis that sit inside buttons are drawn from `data-emo` (`::before`) so the
  button's text stays its words. The old pictures are still in `images/icons/` (unused). Exercise files (student side) are
  unchanged. `tests/pages.spec.js` ("top bar: …"), `tests/my-exercises.spec.js`.
- **Skills Course (2026-11-04, teacher: replace the old Course with four skills)**: the old lesson Course (Block 1 lessons, slide
  editor, Teach mode, handouts, exam marks, `audio/course/`, `js/course-data.js`, `js/course-slides.js`, `ta_course_*`) is deleted.
  `course.html` + `js/pages/course.js`, tab `course` 🗺️. **Since 2026-11-05 (teacher) it opens on group cards** (`skCardsHtml`, one per
  Students-page group; none → "Add a group on the Students page"): name (its button covers the card), level chip (`skGroupLevel`: the
  level kept on the group itself (`level` in `ta_student_groups`, saved by `saveGroup` since 2026-11-05), else on its lessons in `ta_weekly_schedule`, "—" if none), 20 squares `.sk-stepbox` in rows of 10 (green done, red outline
  the step the group is on = first ready step not done from its start, grey skipped, dashed coming soon), ⭐ the students' average band,
  🐢 N behind, **▶ Teach STEP N** (`skTeach`; none left → "🎉 All ready steps done", or "🎉 All steps done" once every step is ready and done). **Start** (`skStartNo`): the teacher's choice "Starts at Step N" on the group page (`courseStart` on the group, `skSetStart`, 2026-11-07), else Beginner or no level → Step 1, any other level → Step 11; steps
  before are skipped (grey, still open). One `skResultsMap` for all cards; `skGroupStats(g, ctx)` works out everything per group.
  A card opens the **group page** (`skOpenGroup`, "← All groups", last group in `ta_course_group`) with tabs **🧭 Journey** / **📈 Progress**
  (`skShowTab`). Journey = the path Step 1 → … → Step 20 (`skPathHtml`; a winding snake on computers, straight down on phones ≤ 760 px)
  with **plain dots** (one per part the step has — no 🎧📖✍️🗣️, a step's first part isn't always Listening; the tooltip names the part);
  the step the group is on is singled out (`.sk-row.focus`: bigger node, pulsing ring, "👉 Teach this step"), Teach scrolls to it.
  Progress (`skProgressHtml`): a row per roster student — ⭐ average band (`skOverall` of their per-step Overalls), "N of M steps done"
  (M = ready steps with Listening/Reading/Writing from the start; done = a result in every such part), 20 squares coloured by their
  band in each step (`skBandColour`: b-good/b-mid/b-low); **behind** students first with 🐢 and the reason as tooltip — missed ≥ 2
  parts whose link was first copied for the group at least 2 days ago (`SK_MISSED_AFTER_DAYS`, the entry's `sentAt`; entries without one
  = sent long ago — right after a lesson nobody is behind yet), or average band < 5. A drawing reads `ta_skills_links` once (`ctx.links`
  from `skPathCtx`, passed down — never call `taSkillsLinks()` per dot). **All steps open, nothing locked**; steps without content are greyed "Coming soon". **Each step + skill has its own permanent link** the teacher sends to a group
  (from that group's page). **Steps (2026-11-05, "Level" → "Step" everywhere)**: content in `js/skills-data.js`,
  `TA_SKILLS.steps` = 20 entries `{id, no, stage, theme, emoji, listening?, reading?, writing?, speaking?}` — stable ids `b1…b10`
  (stage 'Beginner', Steps 1–10) then `e1…e10` ('Elementary', Steps 11–20); `no` = position, shown as "Step N". `e1…e8` = the old
  Levels 1–8 (audio unchanged), `e9`, `e10` stubs; `b1` has old Level 1's writing (About me) + speaking (Talk about yourself), `e1` a new
  writing ("An email to a new classmate", 50–70 words, 20 min) + speaking ("A person you met recently", 45 s); **`b1…b10` complete (2026-11-05) — so Steps 1–18 are complete, 19–20 (`e9`, `e10`) "Coming soon"**: very easy listenings
  (~2 min with the writing pauses, 10 one-word/number gaps — names, ages, numbers, colours, prices, days, o'clock times, phone
  numbers —, two spelled names each, `audio/skills/beg-<n>-listening.mp3`, entries 9–18 of `elementary-scripts.json`, so
  `… audio/skills 9` remakes Step 1, `… 14` Step 6), readings: see "Reading Journey" below (the old beginner readings are gone), writing 20–50 words / 10–15 min, Part 2 30–45 s (b1 keeps About me (25–35 words, 12 min, 3 simple points) + Talk about yourself (30 s); b6 Days & times, b7 Food,
  b8 Animals & pets, b9 My room, b10 My friend). A step with no part = "Coming soon". Use the ids, never the number, in links/keys/results. `TA_BETTER_WORDS` for the writing tips. **A dot is done** (`skDotState`) when at least half
  of the group's students (Students list, by ID) have a result for that step + skill (a group with no students: one result); Speaking
  (sends nothing) when the teacher copied its link for the group (`ta_skills_links["<groupId>|speaking|<stepId>"] = { sentAt }`, no My
  Exercises item). Dot tooltips say why ("2 of 3 students done", "Link sent 5 Nov"); a step with all its parts done shows ✓.
  **A step opens its page** (`skStepPageHtml`, `skOpenStep(id)`, "← <group> · Journey", not remembered): the four parts first, then the results table below them (teacher, 2026-11-05), inline
  (`skTableHtml`, ⬇️ Download picture; a ✍️ band opens the writing, `skViewWriting`; an empty state before any result); the parts
  (`.sk-part` — `.sk-card` belongs to the student page) with their done state, ▶️ Try (`skTry`, `&preview=1`, sends nothing) and 🔗 Copy link
  for <group> (`skCopyLink`). **No "View Results"/"Results table" buttons on the Course page** (one exercise's results: My Exercises).
- **Student page** `skill.html` + `js/skill-player.js` (`js/skill-bands.js` shared): link `skill.html?s=<listening|reading|writing|speaking>&st=<step id>&c=<code>`
  (`taSkillLink(skill, stepId, code)` in common.js; an old link's `lv=N` with no `st` opens `e<N>` — `taSkillStepId` turns a number into `e<N>`; speaking has no code, never expires, loads from GitHub Pages not Firebase). Start card (name + ID, any ID
  accepted), the code is checked. Listening: audio + 10 gaps, Submit → ✅/❌, score, 10 useful words, **Analyze >** = transcript with the
  answer lines marked. Reading: text + any number of questions (elementary: 15 — 5 T/F/NG, 5 gaps, 5 a/b/c; types `tfng`, `tf` = True/False for beginner steps, `gap`, `choose`), same flow. Writing: topic + 3 points, timer (submits by
  itself), word counter, Submit → LanguageTool + better words; the text + the clock's start are kept as the student types
(`ta_skill_draft|<code>|<stepId>`, `{text, startedAt, id}`, the page's own key; not in preview; opened from an old `lv=N` link, a draft under the old key `…|<N>` is moved to it) so a reload — phones reload background
tabs — brings them back with the clock going on (time already up → sent at once); cleared once sent. **Speaking is practice only**: topic words, simple questions, a Part 2 card
  with timers — no microphone, nothing sent, no ID screen. One result per Submit: record id from `skResultId`, `setDoc` with timeouts,
  "Send again" on failure; result `type` 'Listening course' / 'Reading course' / 'Writing course' with `code, name, studentId, step, stepNo, skill,
  correct, total, score, band` (writing: `text, words, minWords, mistakes, mistakeList, grammarChecked, band, timeSeconds`), `builtAt`
  (= the Submit time, same as `date`: a page opened before "Delete all results" and sent after it counts), `submittedAt`. Preview sends nothing. Results sent before steps carry `level: n` and no `step`; they belong to the step by their code (kept per step in `ta_skills_links`).
- **Teacher's side**: first Copy link for step + skill + group only keeps a fresh code (`skEnsureCode` in course.js) as `{ code, sentAt }` in
  `ta_skills_links` under "<groupId>|<skill>|<stepId>" (`taSkillLinkKey`) — **no My Exercises item since 2026-11-05** (teacher). Older
  entries have `{uid, code}` and their "… course" items are **hidden** in My Exercises (list, type chips, counts — `taIsSkillCourseItem`;
  not deleted). Old keys ended in the level number ("g1|reading|3"): `taSkillsLinks()` hands them out as "…|e3", `taSaveSkillsLinks`
  writes the new form, and Copy link rewrites old keys (`taSkillsLinksMigrate`); codes never change, so sent links and results stay. When an old
  and a new key hold the same slot with different codes, the new one wins and the old code is kept in its `alsoCodes` (`taSkillsEntryCodes`,
  `skCodesFor`): both codes load (firebase.js also reads the raw stored object) and both count in dots, Progress and the table. `firebase.js` loads the codes
  from `ta_skills_links`; `isExpiredResult` falls back to the date for " course" types; the results table uses `isExpiredResult` too (`skResultsMap`, one
read per drawing; the hidden/preloaded Course panel isn't redrawn). Listening/Reading bands are always worked out from correct/total
(a result's own `band` is ignored); writing bands (estimate and teacher's mark) are kept to 1–9. **Skills course items and results are
left out of Top 5** (`TA_SKILL_COURSE_RE` in main.js: steps are open and sent ahead, unreached ones would count as 0 %). CSV: a
writing's band goes in "Other result". Results for writing: `viewSkillWriting` (text, words,
  time, mistakes, a band box). **The teacher's mark wins everywhere**: `ta_skills_marks` keyed "<code>|<studentId>". Both keys are synced and
  in the backup. **Results table** per step + group, on the step page (`skTableRows`, `skTableHtml`, PNG by `skDrawTablePng`): ranked by Overall (equal places
  share a number, medals), 🎧 📖 ✍️ bands with raw scores, best try per skill, a missing skill "—", footer average.
- **Fairer writing check + one try + forgiving IDs (teacher, 2026-11-09)**: only real mistakes count (`skCountsAsMistake` in
  skill-bands.js — not extra spaces, American/British spelling, or spelling "mistakes" in capitalised words = names; old results
  are filtered the same way when shown, `skWritingMistakes`); each mistake is saved with its position `at` (+ `rule`), and Loom
  finds older ones as whole words (`skFindMistake` — before, "i" was marked inside "pencils"); `skWritingBand(…, maxWords)`: more words
  than asked add half a band (teacher: never lower it for writing more). Old writings keep the band they were sent with (the teacher can Save band). Writing words:
  ~60 at Step 1 → ~200 at Step 18 (±10; minutes ≥ ~7 words a minute). **One try per course exercise**: on Start, `skAlreadyDone`
  checks this device (`ta_skill_done`, set at Submit by `markDone`) and the database (code + studentId, code + name in [typed,
  Capitalised, lower]) → `showAlreadyDone` ("You have already done this …", the result); a failed check lets the student in;
  preview never blocked. Create-page exercise files are unchanged. **IDs**: `taIdKey` (common.js) — case, spaces/dots/dashes,
  a leading "ID"/"№"/"#", leading zeros, full-width digits and Cyrillic look-alikes don't matter; used by `taRosterIndex` /
  `rosterStudentForId` / `rosterStudentForResult` (a swapped name/ID box matches too); it lives in skill-bands.js (the student page uses it).
  **Only the group's students can start (teacher, 2026-11-09)**: every Copy link (not Speaking) also writes `class-<code>` =
  `{ code: 'TAUSER', type: 'TA_SYNC:CLASS', title: code, data: JSON [{h, n}] }` (`taPublishClassList` in firebase.js, delete then
  create; h = `skClassHash(code, id)` = first 24 hex of sha256("<code>|<taIdKey(id)>"), so IDs can't be read from the database;
  names are). On Start, `skCheckStudent` (skill-player.js): the typed ID's hash must be on the list ("This ID is not on your
  teacher's list…") and the typed name must fit that student (`skNameFits`: one word of 3+ letters, or its start — "Mohlaroy" fits
  "Yuldasheva Mohlaroy"; else "This ID belongs to another student…"); the result carries the listed name. No list (links copied
  before 2026-11-09 until Copy link is pressed again; a group with no students) or no internet → let in. `tests/course-fairness.spec.js`.
- **Reading Journey (teacher, 2026-11-09 — replaces all earlier readings)**: 20 readings, source `docs/reading-journey.json` (what the
  teacher approved; `docs/reading-journey.md` is the readable copy with the answer key), put into `js/skills-data.js` by
  `node tools/build-readings.js` (edit the JSON, run the tool — never edit the readings in skills-data.js by hand). Texts grow
  from ~185 words (Step 1, the teacher's "A Day in My Life") to ~600 (Step 20); Steps 1–10: 5 `tf` + 5 `open` (odd steps) or
  5 `tf` + 5 `gap` (even); Steps 11–20: 5 `tfng` (one Not given) + 5 `gap` + 5 `open` = 15. **`open`** = a WH-question with a text
  box, right when the answer has one of its main words (`keys`; `skOpenRight` in skill-bands.js: case/accents/commas in numbers
  don't matter, a key ≥ 3 letters matches the start of a word, short keys/digits the whole word, several words = a phrase).
  Words: the teacher's 10 with `uz` + an emoji + `ex` (the text's sentence, found by the tool). After Submit: the words, Analyze,
  then a **Retelling** reminder card (`retell` + "Try to use at least 5 vocabulary items from the text." — nothing typed or sent).
  `tests/reading-journey.spec.js`.
- **Writing Journey (teacher, 2026-11-09 — replaces all earlier writings)**: 20 tasks, source `docs/writing-journey.json`
  (`docs/writing-journey.md` readable; spec `docs/superpowers/specs/2026-11-09-writing-journey-design.md`), put into
  `js/skills-data.js` by `node tools/build-writings.js` (never edit them by hand): `writing { topic, instruction, words[{w, uz}] (8–10
  asked words — the student must use all; ticked live, `skAskedWords` in skill-bands.js accepts other forms), minWords, maxWords, minutes }`
  (1 My Daily Routine 80–100/15 … 20 My Favourite Season 120–150/25). Steps 19–20 now have Reading + Writing. **AI check after Submit**:
  the text goes to the helper (`tools/ai-worker.js`, job `writing`, 40/min per IP) → JSON `scores {grammar 0–3, vocabulary 0–2, structure
  0–2, task 0–2}`, `mistakes[{wrong,right,why}]`, `better[{word,instead,why}]`, `tips[3]`; Loom's band = `skWritingAiBand` (sum, −0.5 only
  when under the minimum, 1–9, nearest 0.5). Feedback order: score /9 · word count · grammar · better words · asked words · 3 tips.
  Result gets `aiChecked`, `ai`, `asked`. **AI busy/offline** → the old check (LanguageTool + `skWritingBand`), `aiChecked: false`; the
  teacher's writing window then has "🤖 Check with AI" (`skCheckWritingWithAi` in common.js) → the AI's band becomes the teacher's mark
  (`ta_skills_marks`) and its feedback is kept in `ta_skills_ai` (synced, in the backup). **After changing the worker, the teacher must
  paste it into Cloudflare again** (`/status` shows its version). `tests/writing-journey.spec.js`.
- **Listening Journey (teacher, 2026-11-10 — replaces all earlier listenings and their recordings)**: 20 recordings
  `audio/skills/listen-step-<N>.mp3` (2–5 min; Kokoro, made the way below from `audio/skills/listening-journey-scripts.json` — one
  voice per speaker: af_heart, af_bella, af_nicole, am_michael, am_puck, am_fenrir; spelled names slow, "Olivia. That's O, L, …";
  phone numbers digit by digit, twice). The teacher's files: `docs/listening-journey-steps-1-7.md`, `…-8-20.md` (scripts, questions,
  answer key for 8–20; the 1–7 key was worked out from the scripts). `docs/listening-journey-transcripts.json` (by
  `tools/listening-transcripts.py`) + `docs/listening-journey-questions.json` (questions, answers, and a few words of the script that
  hold each answer) → `node tools/build-listenings.js` writes each step's `listening` (never edit it in skills-data.js). Questions
  have types like Reading — `choose` (a–d; matching too), `tf`, `gap` (a spelled name counts letter by letter: `skMark`), `open`
  (keys) — and `sec` = the teacher's heading for the group; counts 10 → 20 (the teacher's plan). No word list after Submit (the
  teacher gave none), Analyze shows the paragraphs with the speaker's name (`who`, `man`). 4 of the teacher's questions had no
  answer in the script and were changed (Step 8 Q4, Q9; Step 10 Q14; Step 14 Q12); Step 11 Q15 asks for one farm animal, Step 18
  Q19 is about Jack only. The scripts keep a few non-English names/words the teacher wrote (plov, Uzbekistan, Layla Karim, Yusuf):
  the "only English" test skips the listenings. The old listenings (beg-/elem- mp3s, `elementary-scripts.json`) were removed;
  where notes below mention them, read `listening-journey-scripts.json` / `listen-step-<N>.mp3`. `tests/listening-journey.spec.js`.
- **Step names (teacher, 2026-11-10: "rename them")**: each step's `theme` + `emoji` = its Speaking Journey topic (1 Daily Routine ⏰ …
  20 Weather & Seasons ☀️), so the map matches the four parts; older names in the notes above ("Hello!", "Meeting people"…) are gone.
  Results sent before keep the old name in their `title`.
- **Speaking Journey (teacher, 2026-11-09)**: **Speaking** follows the teacher's "Speaking Journey" (20 topics: 1 Daily Routine,
  2 Family, 3 Home & Living, 4 Food & Meals, 5 Free Time, 6 Friends, 7 School & Education, 8 Hobbies & Sports, 9 Shopping, 10 Your City,
  11 Holidays, 12 Future Plans, 13 Jobs & Careers, 14 Clothes & Fashion, 15 Transport, 16 Animals & Pets, 17 Health & Lifestyle,
  18 Technology, 19 Movies & Music, 20 Weather & Seasons): `speaking.topic` + `words[{w, uz, emoji, ex}]` — **`uz` = the teacher's
  Uzbek meaning, shown under the word (`.sk-uz`); the teacher asked for it, the only Uzbek in the course** — + 5 questions + a Part 2
  card on the topic (seconds unchanged). **All 20 done** (Steps 11–20 on 2026-11-09: source `docs/speaking-journey-11-20.json`,
  put in by `node tools/build-speaking.js` — keeps each Part 2's seconds, Steps 19–20 got a Speaking part, 90 s; example sentences
  use no Uzbek names). Since the Listening Journey (2026-11-10) all 20 steps have all four parts. `tests/course-fairness.spec.js`.
- **Bands** (`js/skill-bands.js`): Listening/Reading = round(correct/total × 40) → IELTS table (19/20 → 8.5, 16/20 → 7.5, 9/20 → 5.5);
  Writing estimate = 3 + 3×length (words/min below the minimum, else 1; +0.5 when over the maximum) + 3×max(0, 1 − mistakes per 100 words/10), nearest 0.5, 1–9 (grammar check didn't run → last
  part 1.5; **blank writing = band 1**); Overall = average of the present skills, rounded like IELTS; CEFR from Overall.
- **LanguageTool** (`https://api.languagetool.org/v2/check`, `en-GB`, free, no key): about 20 checks a minute per connection. A busy or
  offline check shows "press Check again", the text is still sent, the band then uses only the length.
- **Recordings**: Kokoro voices `af_heart` (woman, also the narrator) and `am_michael` (man), American accent (teacher, 2026-11-04: the British one dropped its r's — "four" sounded like "faw"); spelled names slow and complete (`spell_slow`, teacher 2026-11-04): "That's." said on its own (before a letter it was clipped), ~0.9 s pause, then each letter as the end of its own sentence "The letter T." cut out with the model's timings (the model file gets a `duration` output — `kokoro-timed.onnx`, needs `pip install onnx`; letters inside a list were said in 0.25 s and sounded cut off, "That's S" sounded like F), ~1.3 s per letter; phone numbers digit by digit, longer pause per group (`slow_phone`); 0.25 s between speakers; `tools/make-course-audio.py … audio/skills 1` remakes only level 1; styled on the teacher's sample exam recording (2026-11-04): speed 0.95, the other speaker reads back numbers/phone numbers ("…?" "Yes, that's right."), a 3.5 s pause to write after each answer (3rd item of a script line); `tools/make-course-audio.py <model folder>
  audio/skills/listening-journey-scripts.json audio/skills` makes `audio/skills/elem-<n>-listening.mp3` (needs ffmpeg; `ASR_DIR` = a sherpa-onnx
  Whisper base.en folder checks every line and remakes it until heard right). Spelled names are said "That's T, H, O…" slowly; write full
  sentences (one-word lines garble); phone numbers in Ofcom drama ranges. The checker's false alarms: whose/who's, number words with a capital.
  **To fill a step**: give its entry in `TA_SKILLS.steps` (keep `id`, `no`, `stage`) `theme, emoji, listening {src, title, intro, questions[{q, a[]}], words, transcript[{who, text, answers}]},
  reading {title, text, questions (tfng/tf/gap/choose, `line` = sentence index)}, writing {topic, points, minutes, minWords, maxWords},
  speaking {words, questions[{q, use}], part2}` like e1; add its entry to `elementary-scripts.json`; run the audio command; keep
  `transcript` in step with the script; English names only, no Uzbek (except the Speaking words' `uz` meanings the teacher gave). `tests/skills.spec.js`.
- **🎧 Making course listening audio — do it exactly like this (teacher approved levels 1–5 on 2026-11-04).** When the teacher asks
  for a new level's recording (or to remake one), follow these steps; don't invent a new way. Setup in the scratchpad (not the repo):
  `python3 -m venv venv && ./venv/bin/pip install kokoro-onnx soundfile sherpa-onnx onnx`; download from GitHub releases (Hugging Face
  is blocked here) `kokoro-v1.0.int8.onnx` (save as `kokoro.onnx`) + `voices-v1.0.bin` (as `voices.bin`) from
  `thewh1teagle/kokoro-onnx` release `model-files-v1.0`, and `sherpa-onnx-whisper-base.en.tar.bz2` from `k2-fsa/sherpa-onnx` release
  `asr-models` (unpack). Write the script lines in `audio/skills/listening-journey-scripts.json` (`[voice, text]` or `[voice, text, 3.5]` =
  pause to write after an answer) and the same lines in the level's `transcript` in `js/skills-data.js`. Run
  `ASR_DIR=<whisper folder> ./venv/bin/python tools/make-course-audio.py <kokoro folder> audio/skills/listening-journey-scripts.json audio/skills <level>`
  (the tool adds the timings model `kokoro-timed.onnx` itself). Every spelling must print ✓; "⚠️ line" about digits/"Dr."/"O" for
  "oh" are false alarms. Then bump `?v=` on that level's `src`, `npm run stamp`, run the tests, **send the teacher the mp3
  (SendUserFile) to listen before merging**. What the teacher asked for, all built into the tool — keep it:
  two voices `af_heart` (woman, narrator) + `am_michael` (man), American accent (the British voice dropped its r's); normal speed (0.95),
  the next speaker answers at once (0.25 s); short natural turns; numbers, prices and phone numbers read back by the other speaker
  ("Thirty pounds a month?" "Yes, that's right.") so students hear them twice, then a ~3.5 s pause to write; **spelling slow and
  complete**: a calm pause, a full "That's.", a pause, then every letter said in full ("ess", not "f") with an even ~1.3 s per letter
  — never let letters run together ("tho … m … pso … n") or get cut off; phone numbers digit by digit with a longer pause after each
  group; spelled names and phone numbers in their own lines; full sentences (one-word lines garble). Real human voices/acting can't be
  made with this tool — say so if asked, and never copy a real person's voice.
- **Builders are short (2026-10-04)**: no description or coloured chips under a builder's title (IELTS
  too; the Homework/Class set builder keeps its round guidance), and short labels: Group, Points, Class
  code, Time limit (the hints moved into the placeholders). No "Instructions for Students" box — except
  Sentences (used when there are no words) and Jungle (shown on the board), which are part of the exercise.
- The robot (lottie `AI_ROBOT_ANIM`) has a small "Smile" shape added to the eyes layer (lowered a little, 2026-10-03).
- **Look rules from the design check (teacher, 2026-10-28)**: no font weight above 700 in the app (the Inter 800 import is gone;
  exercise files keep theirs); no text under 12 px; buttons say what they do (no "OK"/"Continue").
  **Tooltips**: buttons/links with a `title` show the app's own label (`#taTip`, end of common.js) after 300 ms under the mouse
  or at once on keyboard focus; the title is lent to it and put back, so i18n and `getByTitle` still work; `data-kbd` adds a key
  (search: Ctrl K / ⌘ K). **Tap areas**: top-bar tools 44 px; small buttons get an invisible 44 × 44 `::before`
  (the `:where(…)` list at the end of css/style.css — add new small buttons there). **The robot** stays in the bottom-right
  corner (`TA_ROBOT_WANDERS = false`; still draggable), 132 px on computers, only its circle takes clicks; pages have
  104 px room at the bottom on computers so nothing stays under it. `tests/pages.spec.js` ("buttons show the app's own tooltip…").
