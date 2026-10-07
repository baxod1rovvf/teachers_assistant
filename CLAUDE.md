# Teacher's Assistant — notes for Claude

A teacher's web app (static site on GitHub Pages: `https://baxod1rovvf.github.io/teachers_assistant/`,
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
  (`#taTopbar`, fixed, no background of its own — the buttons float over the page): logo + "Teacher's
  Assistant" (logo only on phones) · 5 sections in the middle, icons only — the name is the tooltip (`TA_TOPBAR_TABS`:
  Dashboard, Create, My Exercises, Statistics, Students; icons in `images/icons/nav/`, shown with a CSS
  mask so they take the design's colours) · 🔍 search, design (the teacher's three-coloured-circles icon,
  `nav/design.png`, in its own colours; picking a design also picks day/night — no day/night switch since 2026-10-04),
  ⚙️ Settings (sliders icon `nav/settings.png`; no sound button since 2026-10-03), profile picture (red dot when sync needs the teacher, `data-sync`). The section
  you're in sits in a `var(--brand)` circle drawn as an SVG path; `taMoveTabBlob` animates it like the
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
- **Maze** (2026-10-07, tab `maze`, prefix `mz`, type label "Maze", icon `images/icons/create/maze.png` — drawn by Claude, the
  teacher may send their own; "Ready to use", after Rocket Game): a quiz in a 3D labyrinth. Builder: questions, each with a
  ✅ right and a ❌ wrong answer (`makeMazeRow`, 3 empty rows to start, at least 2). `createMaze` builds `MAZE_TEMPLATE`
  (questions as `__QUESTIONS_JSON__` `[{q,a,b}]`, `<` written as `\u003c`). The file draws with **three.js r128**, loaded from the
  teacher's site (`js/vendor/three-0.128.0/three.min.js`, MIT) via `APP_URL_FOR_MZ`, else cdnjs/jsdelivr; without it or without
  WebGL the game still works (questions only, `#mzNoGl` note). `buildMaze(N)` makes a new labyrinth every try: a cell grid
  (centre = the light), the route built backwards from the centre — straight piece, turn, … one T-turn per question, the way
  straight on (backwards) a 1-cell dead end, then straight out to the edge (the entrance); the rest is ordinary maze passages that
  never open onto the route. Seen from above (slow orbit, also behind the start screen), then `flyToStart` swoops to the entrance;
  the player walks on rails to just before each turn (`goToJunction`, 2.2 before the cell): the question on the wall ahead, the two
  answers on the walls left/right (canvas-text planes) + HTML banner/buttons (`#mzQuestion`, `#mzOptL/R`, ← → keys). Right → turn,
  walk on; wrong → turn into the dead end, "GAME OVER" on its wall → end screen with the right answer and "🔄 Try again — new
  order" (`newOrder` never repeats the last order). Every finished try sends a result (`type: 'Maze'`, `score` = right answers ÷
  questions, `won`, `attempt`, `mistakes`); points only for a win. `window.__mzFast` speeds the animations (tests).
  `tests/maze.spec.js` (also checks 16 labyrinths' shape).
- **Builders are short (2026-10-04)**: no description or coloured chips under a builder's title (IELTS
  too; the Homework/Class set builder keeps its round guidance), and short labels: Group, Points, Class
  code, Time limit (the hints moved into the placeholders). No "Instructions for Students" box — except
  Sentences (used when there are no words) and Jungle (shown on the board), which are part of the exercise.
- The robot (lottie `AI_ROBOT_ANIM`) has a small "Smile" shape added to the eyes layer (lowered a little, 2026-10-03).
