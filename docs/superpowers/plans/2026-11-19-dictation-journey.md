# Dictation Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Dictation Journey under the Grammar Journey on the Course page: 100 dictations in 5 levels; students hear one sentence at
a time, type it, fix the marked words (or Skip), and the teacher sees what they wrote, their skips and their minutes.

**Architecture:** Content `docs/dictation-journey.md` → `tools/build-dictations.js` → `js/dictation-data.js` (`TA_DICTATION`).
Audio `audio/dictation/d<N>-s<k>.mp3` + `d<N>.mp3` (made by `tools/make-dictation-audio.py`, already written). Checking in a shared
`js/dictation-check.js` (student page + teacher page). Student: `skill.html?s=dictation&dl=d<N>&c=<code>` → new `js/dictation-player.js`
(like `js/grammar-player.js`, same ID check / kept answers / already-done / active time). Teacher: new `js/pages/dictation.js` (like
`js/pages/grammar.js`).

**Tech Stack:** Plain HTML/CSS/JS, Firebase Firestore, Playwright with the stand-in database.

**Spec:** `docs/superpowers/specs/2026-11-19-dictation-journey-design.md`

## Global Constraints

- Ids `d1`…`d100` (stable). Levels: `beginner` "Beginner" (1–20), `elementary` "Elementary" (21–40), `preintermediate`
  "Pre-intermediate" (41–60), `intermediate` "Intermediate" (61–80), `advanced` "Upper-intermediate & Advanced" (81–100).
- Sentences: split exactly like `dictation_sentences()` in tools/make-dictation-audio.py (ends at . ! ? before a space + capital/digit/quote;
  never after Mr/Mrs/Ms/Dr/St/e.g./i.e./vs; "a.m."/"p.m." can end one) — 416 sentences; sentence k of dN plays `audio/dictation/dN-s<k>.mp3`.
- "Right" = the words: spelling exact; case, punctuation, curly/straight apostrophes, hyphen vs space ignored; numbers in digits or words
  (see spec "Checking"); capitals/punctuation differences shown as a note, never blocking. Contractions must match.
- Wrong → marked words; the student fixes and checks again, or presses **Skip** (shows the right sentence, counts a skip).
- Result `type: 'Dictation course'`, fields `code, name, studentId, skill: 'dictation', dictation, dictationNo, level, title, sentences:
  [{ first, tries, skipped, ok }], total, correctFirst, score, skips, timeSeconds, timeDisplay, date, builtAt` (+ `submittedAt` by
  skSendResult). Only the first full run is sent; a "Do it again" run sends nothing. Active time like Grammar (visible + touched ≤ 5 min).
- Phones (≤ 760 px): sentence controls, box, buttons and mistakes stay inside the top 60 % of the screen / above the keyboard
  (`window.visualViewport`); the box has `autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false"`.
- Teacher storage `ta_dictation_links = { dN: { code, sentAt, rosterSig } }`: synced (js/sync.js) + backup (settings.js); firebase.js
  loads its codes. Class lists `{h, n, g}` with old IDs (taClassListEntries), refreshed by themselves like Grammar (wait for sync).
- `npm run stamp` after CSS/JS changes; no real student names in tests; plain words; buttons say what they do.

## Review Focus

1. A student types a number another way ("twelve" for "12", "7.20"/"seven twenty" for "7:20", "14th August") → accepted.
2. On a phone the keyboard opens → the sentence, ▶, the box, Check/Skip and the marked words stay visible (no scrolling needed).
3. The audio can't load (offline, slow) → a clear "📶 The audio didn't load — check the internet and press ▶" and Check still works.
4. A long sentence (Advanced, 35+ words) → the box grows, nothing is cut off, the marked words wrap.
5. Reload in the middle → the same sentence, the earlier answers and the time are kept; a finished-but-unsent result is sent later.

---

### Task 1: Content — data, build tool, sentence split

**Files:** Create `tools/build-dictations.js`, `js/dictation-data.js` (generated), `tests/dictation-content.spec.js`.

**Interfaces — Produces:** `window.TA_DICTATION = { levels: [{ id, name, items: [{ id: 'dN', no, title, text, sentences: [string] }] }] }`.

- [ ] Step 1: test — 5 levels with the ids/names above, 20 items each, d1…d100 in order with the titles from the md; total sentences 416;
  d1's 7 sentences exactly ["Hello!", "My name is Daniel.", …, "My favourite colour is blue."]; d29 sentence 1 ends "6 p.m." and
  sentence 2 is "Visitors must speak quietly and turn off their mobile phones."; d34 sentence 1 is "Dear Mr Wilson, your reservation is
  confirmed."; d26 first "“Hi, Emma." last "Thanks!”"; for every item whose `audio/dictation/dN.mp3` exists, every `dN-s<k>.mp3` for
  k = 1…sentences.length exists and `dN-s<k+1>.mp3` doesn't. Also run the python splitter (`python3 -c` importing nothing but re, exec
  of the ABBR…passages block, like the controller did) and assert the same sentence lists.
- [ ] Step 2: run → FAIL. Step 3: implement the tool (validates, writes the data file with a "made by the tool — don't edit" header).
- [ ] Step 4: `node tools/build-dictations.js`; test → PASS. Step 5: commit.

### Task 2: The checker

**Files:** Create `js/dictation-check.js` (classic script, no DOM), `tests/dictation-check.spec.js`; load it in `skill.html` and
`course.html` (current `?v=`).

**Interfaces — Produces:** `dcCheck(expected: string, typed: string) → { ok: boolean, parts: [{ text, state: 'ok'|'wrong'|'missing'|'extra', want? }],
note: '' | 'Check the capital letters.' | 'Check the punctuation.' | 'Check the capital letters and punctuation.' }` and
`dcWordKeys(s) → [string]` (the normalised words, numbers as digits).

- [ ] Step 1: tests (page.evaluate on skill.html): ok for "hello" vs "Hello!"; "my favourite colour is blue" ok, note about capitals;
  "my favorite colour is blue" not ok, `favorite` wrong want `favourite`; missing word → a 'missing' part; extra word → 'extra';
  numbers: "I am waiting for the number twelve bus" ok for "…number 12 bus."; "left at seven twenty" and "7.20" ok for "7:20";
  "from 14th August to 17th August", "from the fourteenth of August …", "14 august" ok; "between 9am and 6pm" ok for "9 a.m. and 6 p.m.";
  "Flight AZ418" ok; "1987" vs "nineteen eighty-seven" ok; "Mrs Brown"/"Mrs. Brown" ok; curly vs straight apostrophe ok; "I am" for
  "I'm" not ok; "check in" for "Check-in" ok.
- [ ] Step 2: FAIL. Step 3: implement (tokenise → normalise → numbers to digit tokens incl. ordinals/years/times/"a m" → align with an
  LCS/edit-distance word alignment so each typed word maps to ok/wrong/extra and each unmatched expected word to missing). Step 4: PASS.
  Step 5: commit.

### Task 3: The student's dictation

**Files:** Create `js/dictation-player.js` (sets `window.DC`); modify `js/skill-player.js` (`SKILL_INFO.dictation = { name: 'Dictation',
emoji: '✍️', type: 'Dictation course' }`, `dl` param, boot/start/already-done/kept-answers branches the way grammar does), `skill.html`
(load dictation-data.js, dictation-check.js, dictation-player.js), `css/skill-air.css`; Test `tests/dictation-player.spec.js`.

**Interfaces — Consumes:** TA_DICTATION, dcCheck, skSendResult/keepUnsent/forgetUnsent/skAlreadyDone/skCheckStudent (window).
**Produces:** `DC.start(item, root, ctx)` (ctx like GR's: preview, code, name, studentId, levelId, header, send, keep), the result payload above.

- [ ] Step 1: tests (stand-in db, a class list like tests/grammar-player.spec.js; `window.__dcNoAudio = true` makes play a no-op that
  records calls in `window.__dcPlayed`):
  - Bu sizmi → Ha → "Sentence 1 / 7", sentence 1 played once by itself; ▶ plays it again (2 calls).
  - wrong typing → `.dc-word.wrong` marked, box keeps the text, still sentence 1; fixed → ✅ and sentence 2 plays.
  - Skip → the right sentence shown, skips = 1, moves on.
  - all 7 done → one result: total 7, sentences[0] = { first: <first typed>, tries: 2, skipped: false, ok: false }, skips, timeSeconds > 0
    (with the `__grClock`-like clock `window.__dcClock`), level 'beginner', dictation 'd1'.
  - reload mid-way → same sentence and earlier answers back; a retake ("Do it again") sends nothing; opening again after the result →
    "You've done this dictation" with the summary.
  - audio error (`window.__dcAudioFails = true`) → the 📶 note shows and Check still works.
  - at 375×667 with the box focused and `visualViewport` height 360 (emulate via `page.setViewportSize({width:375,height:360})`):
    ▶, the box, Check, Skip and the marked words are all inside the viewport; nothing scrolls sideways.
  - a 40-word sentence (stub a long item via `window.TA_DICTATION`) wraps without overflow.
- [ ] Step 2: FAIL. Step 3: implement. Audio `new Audio('audio/dictation/dN-s<k>.mp3?v=<stamp>')` (relative URL, works on Pages);
  preview (▶️ Try) sends nothing. Step 4: PASS + `course-*.spec.js` + `grammar-player.spec.js`. Step 5: commit.

### Task 4: The teacher's Dictation Journey

**Files:** Create `js/pages/dictation.js`; modify `course.html`, `js/pages/course.js` (render under the Grammar section; view state like
`skView.grammar` → `skView.dictation`), `js/firebase.js` (codes), `js/sync.js` + `js/pages/settings.js` (keys), `js/common.js` (call the
dictation refresher wherever `grRefreshLists` is called), `css/style.css` (scoped under `#courseWrap`); Test `tests/dictation-teacher.spec.js`.

**Interfaces — Produces:** `dcLinks()/dcSaveLinks(v)`, `dcCopyLink(id)`, `dcRefreshLists()` (same rules as grRefreshLists: debounce, single
flight, retry, wait for sync, never an empty list over a full one), `dcTableRows(id, groupId)`.

- [ ] Step 1: tests:
  - Course page shows "✍️ Dictation Journey" after the Grammar Journey; 5 level cards ("20 dictations · N sent").
  - a level → 20 rows, each with ▶ (plays `audio/dictation/dN.mp3`), 📄 Transcript (a window with the full text), 🔗 Copy link
    (→ `skill.html?s=dictation&dl=dN&c=<6>`, class list online with every roster student, `ta_dictation_links.dN` saved), ▶️ Try.
  - a dictation page: group filter; table name, group, score (first-try right / total), skips, minutes, date; a row opens what the student
    wrote, sentence by sentence (first try, tries, skipped), next to the right sentence with the marked words (dcCheck).
  - "🚫 Not finished — <group>" + 📋 Copy list; "❓ Not on your Students list"; first run only per student; a moved student shows the
    current group; a roster change re-publishes the list by itself (after sync is ready).
- [ ] Step 2: FAIL. Step 3: implement (reuse grammar.js patterns; share helpers instead of copying where it's simple). Step 4: PASS +
  grammar-teacher, course-*, students-points, sync-light, backup specs. Step 5: commit.

### Task 5: Finish

- [ ] All 100 dictations' audio present (Task 1's test covers it once recording ends); a test that every `dN.mp3` exists for N = 1…100.
- [ ] `npm run stamp`; CLAUDE.md bullet "Dictation Journey (teacher, 2026-11-19)" (files, keys, checking rule, audio tool + voice + how
  numbers are said, licence); full suite green; phone screenshots (375 px, keyboard height simulated) + teacher page for the teacher.
