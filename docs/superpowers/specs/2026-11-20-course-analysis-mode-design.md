# Course Listening/Reading — analysis mode (teacher, 2026-11-20)

## Why
A student who finished a Listening or Reading and left the page could not look at their mistakes again: opening the link
showed only "You have already done this …" and the score. Some students never pressed Analyze the first time.

## What (the teacher's words, playback agreed)
- Opening a finished Listening/Reading link (after the ID check, "Ha") shows **"Bu mashqni allaqachon tugatgansiz"** and the
  same page as right after Submit: the questions with the student's own answers, ✅/❌, the right answers, the score card,
  useful words, **Analyze >** (transcript / highlighted text), Retelling (Reading).
- **Locked**: answers can't be changed, no Submit, **no recording player** (Listening).
- **Nothing is sent** in analysis mode — only the first Submit sends (unchanged).
- Leaving before Submit: nothing was sent, so the link opens the exercise again from the start (unchanged; half-typed answers
  are not kept — not asked for).
- Writing, Grammar, Dictation: unchanged.

## Approaches
1. **Rebuild from the saved result (chosen)** — the result already carries `answers [{q, given, right}]`; the one-try check
   returns the whole record and the page draws the exercise with those answers, then the normal result screen. No new data.
2. Keep a copy of the finished page on the phone — fails on another phone / cleared browser, which is the case the teacher has.
3. A separate "review" link from the teacher — more work for the teacher, and students already have the exercise link.

## Design
- `skAlreadyDone` returns `doc` (the result, or the kept payload) with the existing fields.
- `showAlreadyDone`: for listening/reading with `doc.answers` → analysis mode. The top card keeps class `sk-done-card`,
  heading "Bu mashqni allaqachon tugatgansiz", the English line "You have already done this …", whose answers, "Not you?".
  Kept answers not yet sent keep their "haven't reached your teacher yet" + Send card on top, analysis below.
- The marking at Submit is moved into one function used by both Submit and analysis mode (same look).
- Answers saved for different questions (Listening Steps 8–20 were rewritten 2026-11-13; any later content edit): when the
  saved `q` texts don't match today's questions one by one → a simple list "question · your answer · ✅/❌" + the score, no
  Analyze (the transcript no longer matches). Builder's call.
- A result without `answers` → today's plain "already done" card.
- Test: `tests/course-analysis.spec.js`.
