# Grammar Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Grammar Journey to the Course page (7 levels, Beginner Lessons 1–15 with content). Each lesson is learn → practise
chunks, then a 20-question revision test. There's one permanent link per lesson for every group, with the course's ID check.
Results show the first test try and the active time, filtered by group.

**Architecture:** Lesson content goes `docs/grammar-journey.json` → `tools/build-grammar.js` → `js/grammar-data.js`
(`TA_GRAMMAR`). Students use `skill.html?s=grammar&gl=<gN>&c=<code>`: `js/skill-player.js` keeps the start card, the ID check,
the "already done" check and the unsent-answer safety, and hands the lesson itself to a new `js/grammar-player.js`. The teacher's
side is a new `js/pages/grammar.js` that draws a section under the group cards in `#courseWrap` and keeps
`ta_grammar_links`.

**Tech Stack:** Plain HTML/CSS/JS, Firebase Firestore (vendored 10.12.5 in the app, gstatic on skill.html as today), Playwright
tests with the stand-in database (`tests/support/fake-firestore.js`).

**Spec:** `docs/superpowers/specs/2026-11-16-grammar-journey-design.md`

## Global Constraints

- Result `type: 'Grammar course'` (ends in " course"). Record id from `skResultId`; `submittedAt: serverTimestamp()`.
- Only the **first** Submit of the test is sent. Retakes send nothing. "Done" is decided only by the database (`skAlreadyDone`).
- Lesson ids `g1`…`g15` are stable. `TA_GRAMMAR.levels` ids: `beginner, elementary, preintermediate, intermediate,
  upperintermediate, advanced, intensive`. Names exactly: Beginner, Elementary, Pre-Intermediate, Intermediate,
  Upper-Intermediate, Advanced, Intensive.
- Test = exactly 20 questions. Lesson 1 has only its own questions; Lessons 2–15 have 4 from earlier lessons (`from: 'gN'`).
- Each rule has one short Uzbek line (`uz`). Everything else is English, with English names only.
- Active time: counted only while `document.visibilityState === 'visible'` and the last tap/key/scroll was ≤ 5 min ago
  (`GR_IDLE_MS = 300000`). Shown as "26 min" / "1 h 05 min".
- Progress key `ta_grammar_draft|<code>` (the page's own key): `{ v, chunk, step, answers, testAnswers, activeMs }`.
- Teacher storage `ta_grammar_links = { <lessonId>: { code, sentAt, rosterSig } }`. It's synced (js/sync.js SYNC_KEYS) and backed
  up (settings.js TA_BACKUP_KEYS).
- Class list entries `{h, n, g}` (g = group name). `skCheckStudent` uses the entry's `g` before the record's `group`.
- No rules change. No real students' names in the repo. Every CSS/JS change → `npm run stamp`. Run the whole suite before merging.
- Plain words in every on-screen text. Buttons say what they do.

## Review Focus

1. **The test content changes after a student started** (the teacher asks for a fix): an old draft's answers don't fit. Keep
   `v` = the lesson's content version in the draft. If it differs, start over at chunk 1 but **keep `activeMs`**.
2. **The first Submit couldn't be saved and the student retakes**: the retake must not become "the first try". The unsent
   first result stays kept and is sent later; the result-sending state rests on "a first result exists", not on "a send
   succeeded".
3. **A student moved to another group** after their result: the results table uses the student's **current** roster group,
   matched by `taIdKey(studentId)`.
4. **A student who is in no group / was deleted from the roster** but has a result: they appear under "❓ Not on your Students
   list", never in a group's table or Not finished list.
5. **The roster changes while the teacher has the Course page open** (another device syncs): the list refresh must also run on
   the `storage` event for `ta_points_roster` / `ta_student_groups`, not only on page open.

---

### Task 1: Beginner lesson content + build tool (STOP for the teacher's approval after this task)

**Files:**
- Create: `docs/grammar-journey.json`, `docs/grammar-journey.md`, `tools/build-grammar.js`, `js/grammar-data.js` (generated)
- Test: `tests/grammar-content.spec.js`

**Interfaces:**
- Produces: `window.TA_GRAMMAR = { v: 1, levels: [{ id, name, lessons: [Lesson] }] }`.
  `Lesson = { id: 'gN', no: N, title, v (content version, int), chunks: [{ learn: { title, rule, table?: [[...]], examples: [str × 4–6], uz }, practise: [Q × 5] }] (2–4 chunks), test: [Q × 20] }`.
  `Q = { type: 'choose'|'gap'|'order'|'fix', q, options?: [str], a: [accepted str] , words?: [str] (order), hint?, from?: 'gN' }`.
  For `choose`/`fix`, `a[0]` is one of `options`. For `order`, `a[0]` is the sentence the `words` make.
- [ ] **Step 1:** Write `tests/grammar-content.spec.js` (plain Node assertions inside one Playwright test, reading `js/grammar-data.js` the way
  `tests/reading-journey.spec.js` reads skills-data): 7 levels with the exact ids/names; beginner has 15 lessons g1…g15 with the titles from the
  syllabus (Lesson 1 "To Be (am/is/are) + A/An" … 15 "Imperatives and Basic Sentence Structure"); the other levels have `lessons: []`;
  each lesson has 2–4 chunks, 5 practise questions per chunk, and exactly 20 test questions; g1's test has no `from`; g2–g15 each have exactly 4 `from`
  questions, each pointing to an earlier lesson; every `choose`/`fix` answer is in its options; every `order` answer uses exactly its words; every
  learn has non-empty `uz`; no Cyrillic, and no Uzbek letters/names outside `uz` (reuse the "only English" check used by the reading test).
- [ ] **Step 2:** Run `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test tests/grammar-content.spec.js`. Expected: FAIL (no file).
- [ ] **Step 3:** Write the 15 lessons in `docs/grammar-journey.json` (Beginner, easy, homework-ready; Lesson 1 chunks: am/is/are · negatives and
  questions · a/an). Write `tools/build-grammar.js`: it validates the same rules as the test (and exits non-zero on a broken one), then writes
  `js/grammar-data.js` (one header comment "made by tools/build-grammar.js — don't edit") and `docs/grammar-journey.md` (rules,
  examples, Uzbek line, every question with its answer, the earlier-lesson questions marked).
- [ ] **Step 4:** Run `node tools/build-grammar.js`, then the test. Expected: PASS.
- [ ] **Step 5:** Commit and push. **Send `docs/grammar-journey.md` to the teacher (SendUserFile) and wait for approval** before Task 3 is
  merged (Tasks 2–5 may go on meanwhile; fixes go into the JSON and are rebuilt).

### Task 2: One class list for every group (each student's own group)

**Files:**
- Modify: `js/firebase.js` (`taPublishClassList`), `js/skill-player.js` (`skCheckStudent`)
- Test: `tests/course-id-check.spec.js`

**Interfaces:**
- Produces: `taPublishClassList(code, students, prev, group)` — each student may carry `groupName`, which is stored as `g` in the entry.
  `skCheckStudent(id)` → `{ name, group: entry.g || record.group || '', prev }`.
- [ ] **Step 1:** Add a test: "a list whose entries carry their own group → Bu sizmi shows that student's group". The list has Alice (g Apex) and
  Bobur (g Target) and no record `group`; ID 10002 → `.sk-confirm` contains "Target".
- [ ] **Step 2:** Run it. Expected: FAIL (no Guruh shown).
- [ ] **Step 3:** Store `g` (≤ 80 chars) when `st.groupName` is present; read it first in `skCheckStudent`.
- [ ] **Step 4:** Run the whole `course-id-check.spec.js`. Expected: all PASS (the old per-group lists are unchanged).
- [ ] **Step 5:** Commit.

### Task 3: The student's lesson (learn → practise → test, first try only, resume, active time)

**Files:**
- Create: `js/grammar-player.js` (classic script, sets `window.GR`)
- Modify: `js/skill-player.js` (`SKILL_INFO.grammar = { name: 'Grammar', emoji: '📘', type: 'Grammar course' }`; `boot`/`stepData`/
  `headerHtml`/`showStart`/`skBeginChecks`/`showAlreadyDone` branch on `SK.skill === 'grammar'`, with `SK.lesson` from `gl`), `skill.html`
  (load `js/grammar-data.js`, `js/grammar-player.js`), `css/skill-air.css` (lesson cards, practise feedback, order-words chips)
- Test: `tests/grammar-player.spec.js`

**Interfaces:**
- Consumes: `TA_GRAMMAR` (Task 1); `skCheckStudent` (Task 2); `skSendResult`, `keepUnsent`, `forgetUnsent`, `skAlreadyDone`, `skMark`
  from skill-player.js (exposed on `window` for the classic script).
- Produces: `GR.start(lesson, root, ctx)` where `ctx = { preview, code, name, studentId, send(payload) → Promise<'ok'|'failed'>, keep(payload), done }`;
  `GR.activeMs()`; `GR.formatTime(seconds) → '26 min' | '1 h 05 min'`. The result payload is
  `{ v:1, type:'Grammar course', code, name, studentId, skill:'grammar', lesson, lessonNo, level:'beginner', title, correct, total:20, score, timeSeconds, timeDisplay, answers:[{given, right, ok}], date, builtAt }`.
- [ ] **Step 1:** Write the tests (class list as in course-id-check; URL `/skill.html?s=grammar&gl=g1&c=GRM111`; `window.__grFast = true` makes
  the clock and the waits instant):
  - `start → Bu sizmi → Ha → first learn card`: `.gr-learn h2` has chunk 1's title; `.gr-uz` is visible.
  - `a wrong practise answer shows the rule again and blocks Next`: `.gr-hint` visible, `#grNext` disabled until the right answer is given.
  - `the test sends one result with 20 answers and the listed name`: `__fakeDocs` has 1 `Grammar course` doc, `total: 20`, `name: 'Alice Test'`,
    `timeSeconds > 0`, and `answers.length === 20`.
  - `a retake shows a score and sends nothing`: after the first Submit, `#grRetake` → a shuffled test (first question text differs from the first
    try for a fixed `__grSeed`), Submit → still 1 doc.
  - `reload in the middle continues where the student was`: go to chunk 2 practise, reload, Start/Ha → chunk 2 practise is shown and
    `activeMs` hasn't gone back.
  - `a hidden page doesn't add time`: set `__grClock` (a test clock), hide the page via `document.dispatchEvent(new Event('visibilitychange'))` with a
    stubbed `visibilityState='hidden'`, move the clock 10 min → `GR.activeMs()` unchanged; idle 6 min while visible → ≤ 5 min added.
  - `opening the link again after the result is saved → "You've done this lesson — X/20"` with `#grRetake` and `#grReread`; nothing is sent from either.
  - `a first Submit that fails is kept; a retake doesn't replace it`: fake db fails writes (`prepare(..., { failWrites: true })` — use the existing
    option name in tests/support/app.js, or add one) → "📤 Send my answers" shown; retake → kept payload still the first try's answers.
  - `an old draft with another content version starts again but keeps the time` (Review Focus 1).
  - `preview sends nothing and has no ID card`.
- [ ] **Step 2:** Run `npx playwright test tests/grammar-player.spec.js`. Expected: FAIL.
- [ ] **Step 3:** Implement. Notes: practise uses `skMark` for `gap`; `order` = tap chips into a line (tap again to remove), compared with `skNorm`; a
  retake shuffles the questions and the options with a seeded shuffle (`__grSeed` for tests). Save the draft after every answer and every 15 s of
  active time. Clear the draft once the first result is `'ok'`.
- [ ] **Step 4:** Run `grammar-player.spec.js`, then all `course-*.spec.js` and `skills.spec.js`. Expected: all PASS.
- [ ] **Step 5:** Commit.

### Task 4: Teacher's Grammar Journey section, links, results table, Not finished

**Files:**
- Create: `js/pages/grammar.js`
- Modify: `course.html` (load it), `js/pages/course.js` (`renderCourse` appends `grJourneyHtml()` under the group cards when
  `!skView.group`; `skView.grammar` = open lesson/level), `js/firebase.js` (codes from `ta_grammar_links` loaded like `ta_skills_links`),
  `js/sync.js` SYNC_KEYS, `js/pages/settings.js` TA_BACKUP_KEYS (add `ta_grammar_links`), `css/style.css` (end of the Mountain Air layer)
- Test: `tests/grammar-teacher.spec.js`

**Interfaces:**
- Consumes: `TA_GRAMMAR`, `taPublishClassList` (Task 2), `skResultsMap(codes)`, `taRosterIndex()`, `rosterStudentForResult`, `getPointsRoster()`,
  `getStudentGroups()`, `isExpiredResult`.
- Produces: `grLinks()`/`grSaveLinks(v)`; `grRosterSig() → string` (sha-free: a sorted `id|name|group` join); `grClassStudents() → [{id, name, groupName}]`
  (every roster student with a group); `grCopyLink(lessonId)`; `grOpenLevel(id)`, `grOpenLesson(id)`, `grSetFilter(groupId|'all')`;
  `grTableRows(lessonId, groupId) → [{place, name, group, correct, score, timeSeconds, date}]` (the first result per student by `date`, ranked by
  correct desc, then time asc); `grMissingRows(lessonId, groupId)`; `grUnlistedRows(lessonId)`.
- [ ] **Step 1:** Write the tests (roster: Apex [10001 Alice, 10002 Bobur], Target [10003 Dilnoza Test]; results docs seeded):
  - The Course page shows `.gr-journey` **after** `.sk-cards`, with 7 level cards; 6 say "Coming soon".
  - Beginner → 15 lesson rows; 🔗 Copy link on Lesson 1 → the clipboard has `skill.html?s=grammar&gl=g1&c=` + 6 chars; `class-<code>` holds 3 entries
    with `g` Apex/Apex/Target; `ta_grammar_links.g1` has `code, sentAt, rosterSig`.
  - The lesson page table with **All**: Alice (2 results, first 15/20 and later 19/20) shows 15/20; Dilnoza is there with group Target; the order is score,
    then time; the time is shown as "26 min".
  - Filter **Apex**: only Apex rows; "🚫 Not finished — Apex (1)" lists Bobur; "📋 Copy list" copies "Lesson 1 · To Be … / Not finished yet: / 1. Bobur Test".
  - A result with ID 99999 → "❓ Not on your Students list" (Review Focus 4). Moving Alice to Target in the roster → her row says Target (Review Focus 3).
  - ▶️ Try opens `&preview=1`.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement. The code is made like `skEnsureCode` (6 chars, unique). The lesson page has "← Grammar Journey" and the group filter chips
  (All + each group). Not finished under All = one list per group.
- [ ] **Step 4:** Run `grammar-teacher.spec.js`, `course-*.spec.js`, `backup.spec.js`, `sync-light.spec.js`. Expected: PASS.
- [ ] **Step 5:** Commit.

### Task 5: The class list updates by itself when the roster changes

**Files:**
- Modify: `js/pages/grammar.js`
- Test: `tests/grammar-teacher.spec.js`

**Interfaces:**
- Produces: `grRefreshLists()` — for each `ta_grammar_links` entry whose `rosterSig !== grRosterSig()`: `taPublishClassList(code, grClassStudents())`,
  then save the new `rosterSig` only when that resolves true. It's called when the Course page draws (debounced, once per 5 s) and on `storage`
  for `ta_points_roster`/`ta_student_groups`.
- [ ] **Step 1:** Tests: "a student added after Copy link can start": add 10004 to the roster, open the Course page → `class-<code>` has 4 entries;
  "no change → no write": count writes to `class-*` on a second open = 0; "a storage event from sync also refreshes it" (Review Focus 5).
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement `grRefreshLists`.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit.

### Task 6: Finish — stamp, notes, full test run

**Files:**
- Modify: all `*.html` (`npm run stamp`), `CLAUDE.md` (a "Grammar Journey" bullet: files, keys, the first-try rule, active time, the list refresh),
  `tests/README.md` if it lists the spec files
- [ ] **Step 1:** Run `npm run stamp`.
- [ ] **Step 2:** Run `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test`. Expected: all PASS (`housekeeping.spec.js` included).
- [ ] **Step 3:** Take phone and computer screenshots of the lesson flow and the Course section, and send them to the teacher.
- [ ] **Step 4:** Commit and push. Ask the teacher about AI robot questions (CLAUDE.md rule) and about merging.
