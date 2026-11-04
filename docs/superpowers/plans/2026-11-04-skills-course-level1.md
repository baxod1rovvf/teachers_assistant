# Skills Course — Stage 1 (Level 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old Course with the four skill courses (Listening, Reading, Writing, Speaking) and build Elementary Level 1 end to end, with links, results, the writing check and the results table.

**Architecture:** A student page on the site (`skill.html` + `js/skill-player.js`) reads level content from `js/skills-data.js` and band rules from `js/skill-bands.js`, and sends one result per Submit to Firestore `results` (student-record shape). The teacher's Course page (`course.html` + `js/pages/course.js`, rebuilt) lists skills → levels, makes a My Exercises item + permanent link per level+skill+group, and draws the results table from `__allResults`.

**Tech Stack:** Plain HTML/CSS/JS (no build), Firebase Firestore 10.12.5 from `js/vendor/firebase-10.12.5/`, LanguageTool public API, Kokoro TTS + Whisper check via `tools/make-course-audio.py`, Playwright tests.

**Spec:** `docs/superpowers/specs/2026-11-04-skills-course-design.md`

## Global Constraints

- English names and places only; no Uzbek words or names anywhere in content or audio scripts.
- Spelled names in recordings are written `"E. double M. A."` in the scripts (the audio tool says them slowly).
- Voices: woman `af_heart`, man `bm_george`; the first (narrator) line is the woman.
- Result records: `v: 1`, 6-character `code`, `name` (< 100 chars), `type`, `studentId`, `submittedAt: serverTimestamp()`.
- Result `type` values: `'Listening course'`, `'Reading course'`, `'Writing course'` (also the My Exercises `typeLabel`).
- Link: `skill.html?s=<listening|reading|writing|speaking>&lv=<1..10>&c=<code>`; `&preview=1` sends nothing; speaking links have no `c`.
- Bands: the IELTS listening table on a 40 scale, x.25 → x.5 rounding, CEFR mapping — exactly as in the spec.
- Writing estimate: `3 + 3·min(1, words/minWords) + 3·max(0, 1 − mistakesPer100/10)`, round to 0.5, clamp 1–9; grammar check not run → last part = 1.5.
- No font weight above 700, no text under 12 px, buttons say what they do (CLAUDE.md look rules).
- After CSS/JS changes run `npm run stamp`; the new page `skill.html` carries the same `?v=` stamp.
- Tests: `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test`; made-up names only.

## Review Focus

1. A student types an answer with different case, extra spaces, a full stop, or a number as digits instead of words → still marked right (test in Task 3).
2. Firestore refuses/offline on Submit → "Not sent yet — press Send again", answers stay, a second press sends once (test in Task 3).
3. LanguageTool returns 429/500/network error → better words still shown, result still sent with `grammarChecked: false` (test in Task 4).
4. Writing timer reaches 0 with an empty text → submits once with 0 words, band from the formula (≥ 1) (test in Task 4).
5. A link with `lv=99` or `s=dance` → "This level doesn't exist" with a link back, nothing sent (test in Task 3).

---

### Task 1: Band rules

**Files:**
- Create: `js/skill-bands.js`
- Test: `tests/skills.spec.js` (new file; this task adds the `describe('bands')` block)

**Interfaces:**
- Produces (globals, plain functions):
  - `skBand(correct: number, total: number) -> number` (0–9, step 0.5)
  - `skWritingBand(words: number, minWords: number, mistakes: number, checked: boolean) -> number`
  - `skOverall(bands: number[]) -> number|null` (ignores null/undefined; null if none)
  - `skCefr(band: number) -> 'C2'|'C1'|'B2'|'B1'|'A2'|'A1'`
  - `skBandColour(band: number) -> 'good'|'mid'|'low'` (≥ 6.5 good, 5.5–6 mid, ≤ 5 low)

- [ ] **Step 1: Write the failing test** — load `/skill.html?s=listening&lv=1&preview=1` and evaluate:
  - `skBand(19,20)=8.5, skBand(16,20)=7.5, skBand(9,20)=5.5, skBand(7,20)=4.5, skBand(3,20)=3, skBand(0,20)=0, skBand(10,10)=9, skBand(37,40)=8.5, skBand(11,40)=4`
  - `skOverall([8.5,8.5,9,9])=9, skOverall([7.5,9,9,8.5])=8.5, skOverall([7,null])=7, skOverall([])=null`
  - `skCefr(9)='C2', skCefr(8)='C1', skCefr(6.5)='B2', skCefr(4)='B1', skCefr(3)='A2', skCefr(2)='A1'`
  - `skWritingBand(50,40,0,true)=9, skWritingBand(20,40,0,true)=7.5, skWritingBand(100,40,5,true)=7.5, skWritingBand(50,40,5,true)=6, skWritingBand(0,40,0,false)=4.5, skWritingBand(40,40,0,false)=7.5`
  - `skOverall([7,7.5])=7.5` (7.25 rounds up to 7.5)
- [ ] **Step 2: Run, expect FAIL** (`skBand is not defined` / page 404).
- [ ] **Step 3: Implement** the five functions in `js/skill-bands.js` (scale: `n = Math.round(correct/total*40)`, then the spec's table; overall mean → `Math.round(mean*2)/2` with x.25 → up: use `Math.floor(mean*2 + 0.5)/2`). Create a minimal `skill.html` that loads it (full page comes in Task 3).
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** `Skills course: band rules`.

### Task 2: Level 1 content + recording

**Files:**
- Create: `js/skills-data.js`, `audio/skills/elementary-scripts.json`, `audio/skills/elem-1-listening.mp3`
- Test: `tests/skills.spec.js` (`describe('content')`)

**Interfaces:**
- Produces: `TA_SKILLS.elementary.levels[0]` with the shape in the spec's Files section:
  `{ no: 1, theme: 'Meeting people', emoji: '👋', listening: { src: 'audio/skills/elem-1-listening.mp3', title, questions: [{ q, a: [accepted…] }]×10, words: [{ w, m, ex }]×10, transcript: [{ who: 'Woman'|'Man', text, answers: [question numbers] }] }, reading: { title, text, questions: [{ type: 'tfng'|'gap'|'choose', q, opts?: [a,b,c], a: [accepted…], line: sentence index }]×15 (5 of each), words ×10 }, writing: { topic, points: [3], minWords: 40, maxWords: 60, minutes: 15 }, speaking: { words: [{ w, emoji, ex }]×8–10, questions: [4–5], part2: { topic, hints: [3], seconds: 45 } } }`
  - `TA_SKILLS.elementary.levels` also lists levels 2–10 as `{ no, theme, emoji }` only (themes from the spec table) so the Course page shows all 10 tiles; skills without content show "Coming soon".
  - `TA_BETTER_WORDS: { [plainWord]: [better, …] }` (≥ 30 entries: good, nice, big, small, very happy, bad, like, …).
- Content: Level 1 listening = a hotel check-in (woman receptionist, man guest): spelled surname, first name spelled, room number, phone number, home town, nights, breakfast time, a street, a nearby place, checkout time — 10 gaps. Reading = "A pen-friend's profile" (~150 words). Writing topic "About me". Speaking topic "Talk about yourself".

- [ ] **Step 1: Write the failing test** — load the page and assert for every level with content: 10 listening questions, 10 words; 15 reading questions (5 tfng, 5 gap, 5 choose), 10 words; every listening answer's first accepted form appears (case-insensitive, digits normalised) in its transcript line(s) listed in `answers`; every reading `line` index exists and the gap answers appear in that sentence; 8–10 speaking words, 4–5 questions; the levels list has 10 entries with themes `['Meeting people','Family & friends','My home','My day','Food & cafés','Shopping','My town','Free time','Travel','Weather & holidays']`; `GET /` + `listening.src` is 200 and > 100 000 bytes; the file text of `js/skills-data.js` and `audio/skills/elementary-scripts.json` has no match for the Uzbek regex already used in `tests/course.spec.js`.
- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Write the content** in `js/skills-data.js` and the conversation in `audio/skills/elementary-scripts.json` (`[{ label, src, lines: [[voice, text], …] }]`, full sentences, spellings as `"T. H. O. M. P. S. O. N."`).
- [ ] **Step 4: Make the recording:** `ASR_DIR=<whisper dir> <venv>/python tools/make-course-audio.py <kokoro dir> audio/skills/elementary-scripts.json audio/skills`; every line must end ✓ (reword any ⚠️ line that isn't a known false alarm — colour/color, digits vs words, whose/who's — and remake).
- [ ] **Step 5: Run, expect PASS. Commit** `Skills course: Elementary level 1 content and recording`.

### Task 3: Student page — start card, Listening, Reading, sending

**Files:**
- Create: `skill.html` (full), `js/skill-player.js`, CSS section "SKILLS COURSE — STUDENT PAGE" at the end of `css/style.css`
- Test: `tests/skills.spec.js` (`describe('student page')`)

**Interfaces:**
- Consumes: Task 1 functions, Task 2 data.
- Produces: `skMark(answer: string, accepted: string[]) -> boolean`; `skSendResult(payload) -> Promise<'ok'|'failed'>` (`addDoc` to `results`, 3 tries, never in preview); `window.SK` state `{ skill, level, code, preview, name, studentId }`.
- Result payload (listening/reading): `{ v: 1, code, type, title: 'Level 1 · Meeting people — Listening', level: 1, skill, name, studentId, correct, total, score: round(correct/total*100), band: skBand(correct,total), answers: [{ q, given, right: bool }], timeSeconds, timeDisplay, date }`.

- [ ] **Step 1: Write the failing tests:**
  - `listening: Submit marks each box, shows 10 words, Analyze highlights the answer lines, one result is sent` — open `skill.html?s=listening&lv=1&c=ABC123`, fill name "Test Student" + ID "10001", Start; fill 7 right (one typed in capitals with a trailing full stop, one phone number with spaces), 3 wrong; Submit → 7 `.sk-q.right`, 3 `.sk-q.wrong` each showing its right answer, text "7 / 10"; `.sk-words li` count 10; click "Analyze >" → `.sk-line.hl` count equals the number of transcript lines with answers, each with its question number badge; `window.__writes` has exactly one record with `code: 'ABC123', type: 'Listening course', correct: 7, total: 10, band: 6.5`.
  - `reading: the same with 15 questions` (one T/F/NG answered by a button, one choose by a button, gaps typed): score text "N / 15", `.sk-sent.hl` highlights in the text after Analyze, one record of `type: 'Reading course'`.
  - `preview sends nothing` — `&preview=1`, no `c`: no start card name required ("👀 Preview" badge), Submit marks, `__writes` empty.
  - `sending fails → Send again` — make the stand-in database refuse (`window.__failWrites = true` before Submit, as the existing fake supports, or route the write to throw): shows "Not sent yet — press Send again"; clear the failure, press it → one record.
  - `unknown level` — `?s=dance&lv=99` → "This level doesn't exist" and a link to `index.html`.
- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement** `skill.html` (loads `js/student-theme.js` CSS the same way exercise files do — insert `TA_STUDENT_THEME_CSS` in a `<style id="ta-student-theme">` — then `js/skill-bands.js`, `js/skills-data.js`, `js/skill-player.js` as a module that imports Firestore from `js/vendor/firebase-10.12.5/` with the app's `firebaseConfig`), the start card (`.ta-login-stage` markup so the student theme styles it), listening and reading views, `skMark` (lower-case, trim, collapse spaces, strip final `.`, digits-only compare when the accepted answer is digits after removing spaces/dashes), Analyze, and sending.
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** `Skills course: student page with Listening and Reading`.

### Task 4: Student page — Writing

**Files:**
- Modify: `js/skill-player.js`, the CSS section from Task 3
- Test: `tests/skills.spec.js` (`describe('writing')`)

**Interfaces:**
- Produces: `skCheckGrammar(text) -> Promise<{ ok: boolean, matches: [{ offset, length, message, replacements: string[] }] }>` (POST `https://api.languagetool.org/v2/check`, form body `text`, `language=en-GB`; any error/non-200 → `{ ok: false, matches: [] }`); `skBetterWords(text) -> [{ word, better: [] }]` from `TA_BETTER_WORDS`.
- Result payload: `{ v: 1, code, type: 'Writing course', title, level, skill: 'writing', name, studentId, text, words, minWords, maxWords, mistakes: matches.length, mistakeList: [{ bad, fix, message }], grammarChecked, band: skWritingBand(...), timeSeconds, timeDisplay, date }` (no `score` field, so Results shows "—" for %).

- [ ] **Step 1: Write the failing tests** (route `**/api.languagetool.org/**` after `prepare`):
  - `writing: counter, check, better words, band` — mock returns 2 matches; type 45 words containing "good" and "very big"; counter shows "45 / 40–60 words"; Submit → 2 `.sk-mistake` items with message + fix, `.sk-better` lists good → great…, one record with `mistakes: 2, grammarChecked: true, band: skWritingBand(45,40,2,true)`.
  - `writing: grammar checker down` — mock 429 → note "The grammar check couldn't run this time", better words shown, record with `grammarChecked: false`.
  - `writing: time runs out` — `window.__skFast = 1` makes a minute 1 second; with an empty box the timer ends → exactly one record with `words: 0`, `band ≥ 1`.
- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement** the writing view (topic, 3 points, timer, live counter, Submit, results panel with highlighted mistakes, better words, "Check again" button that re-runs only the grammar check when it failed).
- [ ] **Step 4: Run, expect PASS. Commit** `Skills course: Writing with the grammar check`.

### Task 5: Student page — Speaking

**Files:**
- Modify: `js/skill-player.js`, CSS section
- Test: `tests/skills.spec.js` (`describe('speaking')`)

- [ ] **Step 1: Write the failing test** `speaking: words → questions → Part 2, nothing sent, no ID` — open `skill.html?s=speaking&lv=1` (no `c`): no name box; step 1 shows 8–10 `.sk-word` cards; "Next →" → one question at a time with a "Words you can use" line, through all questions; then the Part 2 card with topic, 3 hints, "Get ready (30 s)" and "Start speaking" buttons; with `__skFast`, Start → timer counts to 0:45 and says "Well done! 🎉"; `__writes` empty.
- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement** (🔊 on a word uses `speechSynthesis` en-GB if available, otherwise the button is hidden).
- [ ] **Step 4: Run, expect PASS. Commit** `Skills course: Speaking practice`.

### Task 6: Remove the old Course; the new Course page

**Files:**
- Delete: `js/course-data.js`, `js/course-slides.js`, `audio/course/`, `tests/course.spec.js`
- Modify: `course.html` (drop the two script tags, panel markup), `js/pages/course.js` (rewrite), `css/style.css` (remove the course/slide-editor/Teach rules: selectors starting `.course-`, `#sl`, `.sl-`, `.sle-`, `.slt-`, and `body:has(#slEditor, #slTeach)`; add "SKILLS COURSE — TEACHER" rules), `js/sync.js:20` and `js/pages/settings.js:28` (replace the four `ta_course_*` keys with `'ta_skills_links', 'ta_skills_marks'`), `js/firebase.js` (keep calling `window.taCourseResultsChanged` if defined), `index.html`/other pages only if they load course-data/course-slides (check with grep)
- Test: `tests/skills.spec.js` (`describe('course page')`)

**Interfaces:**
- Produces: `ta_skills_links` = `{ "<groupId>|<skill>|<level>": uid }`; `skLinkFor(skill, level, group) -> string` (absolute when `TA_APP_URL` is https, else relative); `skEnsureItem(skill, level, group) -> recentExerciseItem` (first call `pushRecentExercise({ title: 'Level 1 · Meeting people — Listening (<group>)', typeLabel: 'Listening course', code: generateClassCode(), uid: generateExerciseUid(), groupId, contentSummary: 'Level 1 · Listening' })`, no html; later calls return the same item).
- Page: four `.sk-skill-card` (Listening, Reading, Writing, Speaking) → `.sk-level-tile` ×10 for the chosen skill (`Level N · theme`, "Coming soon" when no content); group chips like before (`ta_course_group` key kept for the chosen group); per tile: "▶️ Try" (opens `skill.html?…&preview=1` in a new tab), "🔗 Copy link for <group>", "📊 View Results" (after a link exists; opens `results.html?exercise=<uid>`; not for Speaking).

- [ ] **Step 1: Write the failing tests:**
  - `the Course page: four skills, 10 levels each, Try opens a preview` — 4 cards; open Listening → 10 tiles, Level 1 has Try, Levels 2–10 say "Coming soon"; Try opens a popup whose URL has `s=listening&lv=1&preview=1`.
  - `Copy link makes one My Exercises item per level + skill + group` — with `PRETEND_HTTPS`, press twice → clipboard `…/skill.html?s=listening&lv=1&c=<code>` both times, exactly one new item with `typeLabel 'Listening course'`, the group's id; nothing written to `TA_SYNC:PLAY`.
  - `old Course data is gone` — `typeof COURSE_BEGINNER === 'undefined'`, `typeof courseTeach === 'undefined'`; `audio/course/` returns 404.
- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement** the deletions and the page; `grep -rn "course-data\|course-slides\|COURSE_BEGINNER\|courseTeach" --exclude-dir=node_modules .` must print nothing except the spec/plan docs and CLAUDE.md history.
- [ ] **Step 4: Run all tests** (`npx playwright test`) — the rest of the suite still passes (fix `tests/housekeeping.spec.js` expectations if they list course files).
- [ ] **Step 5: Commit** `Course: replaced by the four skill courses`.

### Task 7: Results — writing view, teacher's band, results table

**Files:**
- Modify: `js/pages/results.js` (a `'Writing course'` view button), `js/common.js` (`viewSkillWriting(idx)` modal next to `viewNotesResult`; `MYEX_TYPE_ICONS` + the CSS emoji list for the three new type labels: 🎧 📖 ✍️), `js/pages/course.js` (results table), CSS
- Test: `tests/skills.spec.js` (`describe('results')`)

**Interfaces:**
- Consumes: `__allResults`, `ta_skills_links`, Task 1 functions.
- Produces: `ta_skills_marks` = `{ "<code>|<studentId>": band }`; `skWritingBandFor(result) -> number` (teacher's mark if set, else `result.band`); `skTableRows(level, groupId) -> [{ name, studentId, listening: {band, raw}|null, reading, writing, overall, cefr, place }]`; `skDrawTablePng(rows, meta) -> Promise<Blob>`.

- [ ] **Step 1: Write the failing tests:**
  - `writing results: the text, mistakes and a band the teacher can change` — seed `__allResults` with a Writing course result for the item's code; Results shows "👁 View"; the modal shows the text, "54 words", the mistakes and a band input with the estimate; type 6 → saved in `ta_skills_marks`, and `skWritingBandFor` returns 6.
  - `results table: ranking with ties, missing skills, colours, picture` — seed three made-up students for level 1 of one group: A (L 10/10, R 15/15, W band 7), B (L 8/10, R 12/15, no writing), C (L 8/10, R 12/15, W 6 by the teacher). Table: A place 1 with a medal; B and C ordered by overall with ties sharing a place; B's writing cell "—"; cells carry `good|mid|low` classes per `skBandColour`; overall shows CEFR; footer "Group average" + "3 students". "⬇️ Download picture" triggers a download named `level-1-<group>.png` (non-empty).
- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement** (best try per skill = highest band; overall via `skOverall`; table opened from a "🏆 Results table" button in the Course page header for the chosen group and level; PNG drawn on a `<canvas>` with the same rows and colours, Fredoka/Nunito if loaded).
- [ ] **Step 4: Run, expect PASS. Commit** `Skills course: writing marks and the results table`.

### Task 8: Docs, stamp, full run

**Files:**
- Modify: `CLAUDE.md` (replace the whole "Course (2026-11-02…" bullet with a short "Skills Course" bullet: files, link format, result types, bands, `ta_skills_links`/`ta_skills_marks`, LanguageTool and its limit, voices, how to add a level), all `*.html` stamps
- [ ] **Step 1:** `npm run stamp`; check `skill.html` got the stamp (add it to `tools/bump-version.js`'s page list if it didn't).
- [ ] **Step 2:** `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test` → all pass.
- [ ] **Step 3:** Screenshot Level 1 of each skill (desktop 1600×950 and phone 390×800) and look at them; fix layout overflows.
- [ ] **Step 4: Commit and push** `claude/eager-johnson-4rf131` — no merge until the teacher says "merge it".
