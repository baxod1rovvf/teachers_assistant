# Listening Journey Steps 8–20 Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the Listening of Steps 8–20 (stories, questions, recordings) to the teacher's rules, Step 8 first for the teacher's check.

**Architecture:** Keep the existing pipeline (`docs/*.md` script → `tools/listening-transcripts.py` → transcripts JSON; questions
JSON → `tools/build-listenings.js` → `js/skills-data.js`; scripts JSON → `tools/make-course-audio.py` → mp3). New scripts live in
a new file `docs/listening-journey-steps-8-20-v2.md`; a step listed there replaces the old one. A new test enforces the rules for
the rewritten steps (`NEW` list, grows from `[8]` to 8–20).

**Tech Stack:** plain JS, Playwright tests, Python + Kokoro (voices) + sherpa-onnx Whisper (check), ffmpeg.

**Spec:** `docs/superpowers/specs/2026-11-13-listening-journey-8-20-rewrite-design.md`

## Global Constraints

- Steps 8–20 only; Steps 1–7 unchanged.
- Per listening: 1–2 spelled words (one word each, never a two-word name); first spelled word = Question 1; a second = Question 5 or later.
- Exactly 1 spelled number per listening: a phone number (or ticket/booking number) said digit by digit, read back once by the other speaker; its question is never right next to a spelled-word question.
- Questions in recording order; 3–4 blocks, each one type, each covering the next part of the recording.
- At most one answer of each kind per listening: price, clock time, °C temperature, date. No fact asked twice.
- At most 2 named people per listening (English names, easy to tell apart); others by role. Place names only when the event needs them.
- Question counts: Step 8: 14, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 19, 19: 20, 20: 20.
- Recordings exactly as CLAUDE.md "Making course listening audio" (venv + models in the scratchpad `tts/`, `ASR_DIR` Whisper check, every spelling ✓).
- The teacher hears every mp3 and reads every question list before merge; never merge without "merge it".
- No real students' names in the repository.

## Review Focus

1. A student types the spelled word letter by letter ("T-U-R-N-E-R") → right (skMark already does; Task 1's test fills Q1 that way).
2. A student types the phone number with or without spaces ("0794621830" / "0794 621 830") → right (Task 1's test fills it without spaces).
3. A time answer written "7:30", "7.30" or "half past seven" → each accepted (every time gap lists these variants; Task 1's test checks a time gap's `a` has ≥ 2 forms).
4. "Analyze >" highlights the paragraph of each answer → one paragraph per question (existing test in `tests/listening-journey.spec.js`).
5. A rewritten step whose question references a name not said in the recording → the build tool throws (every question's `at` must be in the script — existing check).

---

### Task 1: The rules check and Step 8

**Files:**
- Create: `docs/listening-journey-steps-8-20-v2.md` (Step 8 section only; header without the old spelling convention)
- Modify: `tools/listening-transcripts.py` (read v2 after the old files; a step in v2 replaces the old one)
- Modify: `tools/build-listenings.js` (a step with `"inOrder": true` must have each question's `at` at or after the previous one's: same paragraph → later position; throw `step N QK: out of order`)
- Modify: `docs/listening-journey-questions.json` (entry `no: 8` replaced; `"inOrder": true`, `"names": [...]` ≤ 2)
- Modify: `audio/skills/listening-journey-scripts.json` (entry 8 replaced), `audio/skills/listen-step-8.mp3` (re-made), `docs/listening-journey-transcripts.json` (re-made), `js/skills-data.js` (re-built; `src` `?v=2`)
- Create: `tests/listening-rules.spec.js`
- Modify: `tests/listening-journey.spec.js` only if a check names old Step 8 content

**Interfaces:**
- Produces: `NEW` (array of rewritten step numbers) at the top of `tests/listening-rules.spec.js`; Tasks 2–4 extend it.
- Produces: questions JSON fields `inOrder: true` and `names: string[]` on rewritten steps.

- [ ] **Step 1: Write `tests/listening-rules.spec.js`** with `const NEW = [8]` and one test per step in `NEW`, reading `TA_SKILLS` in the page and `audio/skills/listening-journey-scripts.json` with `fs`:
  - spelled lines (`/^\s*(?:(?:double )?[A-Z]\.\s*)+$/`) count 1–2; each spells one word; Q1's `a[0]` (letters only, lower case) equals the first spelled word; if two, the second's question index ≥ 5 (1-based);
  - exactly one script line matches the PHONE pattern of `tools/make-course-audio.py`; exactly one question's answer digits equal its digits; that question isn't next to a spelled-word question;
  - transcript paragraph of question k ≤ that of question k+1 (from `transcript[].answers`);
  - kinds (by the question text / answer form): price (`$` or "cost"), clock time (`/^\d{1,2}[:.]\d{2}$/` or "a.m."/"p.m."), temperature ("°C"), date (ordinal or month name) — each at most once; no two questions with the same answer `a[0]`;
  - question count = the Global Constraints count; `names.length ≤ 2` (from `docs/listening-journey-questions.json`);
  - Review Focus 1–3: in preview, fill Q1 as letters with dashes, the phone gap without spaces, everything else right → full marks; every clock-time gap has ≥ 2 accepted forms.
- [ ] **Step 2: Run it** — `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test tests/listening-rules.spec.js` — expect FAIL on today's Step 8 (8 spelled words).
- [ ] **Step 3: Write Step 8** (same events: a radio interview about hobbies — photography in a park, baking with grandmother, a photo competition with a deadline and results date; ~14 answers; 1–2 named people) in the v2 md (paragraphs `**Name:**`/`**Presenter:**`), the scripts JSON entry (`[voice, text, pause]`, spelled lines `"G. R. E. E. N."`, the phone number as digit words), and the questions JSON entry (blocks in order, `inOrder`, `names`, intro naming the speaker).
- [ ] **Step 4: Add the order check to `tools/build-listenings.js`; update `tools/listening-transcripts.py`; run** `python3 tools/listening-transcripts.py && node tools/build-listenings.js` — expect the step list printed, no throw.
- [ ] **Step 5: Record** — `ASR_DIR=<scratchpad>/tts/sherpa-onnx-whisper-base.en ./venv/bin/python tools/make-course-audio.py <scratchpad>/tts audio/skills/listening-journey-scripts.json audio/skills 8` — every spelling ✓; set `src` `?v=2` (build tool), `npm run stamp`.
- [ ] **Step 6: Run** `tests/listening-rules.spec.js tests/listening-journey.spec.js tests/skills.spec.js` — expect PASS.
- [ ] **Step 7: Commit + push**; send the teacher a readable list (`docs/listening-step-8-review.md`: script, questions, answers) and `listen-step-8.mp3`. **Stop until the teacher answers.**

### Task 2: Steps 9–12

**Files:** v2 md (+ sections 9–12), scripts JSON entries 9–12, questions JSON entries 9–12, mp3s 9–12, rebuilt transcripts + skills-data; `NEW` extended to `[8, 9, 10, 11, 12]`.

- [ ] **Step 1:** Extend `NEW`; run the rules test — expect FAIL for 9–12.
- [ ] **Step 2:** Write Steps 9–12 the same way as the approved Step 8 (with the teacher's corrections), same events (9 shopping centre, 10 city tour, 11 a holiday, 12 future dreams — the classmates told apart by role).
- [ ] **Step 3:** Rebuild, record 9–12 (`… audio/skills 9`, `10`, `11`, `12`), `?v=2`, stamp.
- [ ] **Step 4:** Run the three spec files — expect PASS. Commit + push.

### Task 3: Steps 13–16

Same as Task 2 for 13 (jobs — by role), 14 (clothes shop — one price only), 15 (train journey — one time only), 16 (animal story); `NEW` to 16.

### Task 4: Steps 17–20, notes, full suite

- [ ] Same as Task 2 for 17 (healthy habits podcast), 18 (technology), 19 (behind a film), 20 (world weather — one temperature only; reporters by city); `NEW` = 8–20.
- [ ] CLAUDE.md "Listening Journey" bullet: the new rules, the v2 file, `inOrder`/`names`, `tests/listening-rules.spec.js`; "only English" test note if names change.
- [ ] Full suite `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test` — expect all pass. Commit + push.
- [ ] Send the teacher the 12 review lists + mp3s (9–20). Merge only on "merge it".
