# Listening Journey, Steps 8–20: fewer names, little spelling, questions in order (design)

Date: 2026-11-13. Agreed with the teacher in chat. Approach chosen: **one step first** (Step 8 complete, the teacher checks it,
then Steps 9–20 the same way).

## Why
The teacher found the listenings "a little weird": Steps 8–20 spell 2–15 words each (Step 19 spells 15, even "THE" in
"The Secret Garden"), have up to 5 named people, ask questions grouped by type so the answers jump back and forth through the
recording, and ask look-alike questions in a row (Step 20: six temperatures; Step 14: six prices). Students get confused and it
turns into a memory test. Their own scripts had a rule "spell every name aloud" — that rule is dropped.

## The teacher's rules (Steps 8–20 only; Steps 1–7 stay as they are)
1. **1–2 spelled words** per listening (spelled letter by letter in the recording). If two: the first is **Question 1**, the
   second is **Question 5 or later** — never next to each other.
2. **1 spelled number** per listening: a number read digit by digit (a phone number), e.g. "oh seven nine four, six two one…".
3. **Every other question is easy**: a simple word, a time, a place, A/B/C — like "Ms Lola's bag colour is ___", "The meeting
   is at ___ PM", "Where does Aziz meet Laylo? A) Park B) Cafe C) Restaurant".
4. **Questions in the order of the recording**, from start to end.
5. **No look-alike answers** (the temperatures table).
6. **Same events, fewer people**: keep each step's story/events, but not the same crowd of named people.
7. **Same number of questions** as now: Step 8: 14, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19,
   18: 19, 19: 20, 20: 20.
8. The teacher reads the questions and listens to every recording **before** it goes live.

## My calls (told to the teacher, open to correction)
- **Names**: at most **2 named people** per listening (normally the speakers); everyone else by role ("my uncle", "the coach",
  "the guide", "her sister"). Names easy to tell apart (not Sophie + Sara). **English names** (the course rule). Pets and shops
  get no names unless one of them is a spelled word.
- **Places**: a place name only when the event needs it (Step 20's cities are its story); else "the park", "the station".
- **Look-alikes, made concrete**: never two answers of the same kind in one listening — at most one price, one clock time,
  one temperature, one date, one "how many", one "how long". No fact is asked twice (today: Step 17 asks the podcast's name twice,
  Step 18 the website's, Step 16 the cat's).
- **Sections in order**: the question list is cut into 3–4 blocks, each block one type (gap / A-B-C / True-False / short answer)
  and each covering the **next part of the recording**, like an IELTS paper — so the order is kept and the headings don't flip
  every question. Block 1 starts with the spelled word (a gap: "Surname: _____").
- **Recordings**: made exactly as in CLAUDE.md "Making course listening audio" (Kokoro, `tools/make-course-audio.py`, Whisper
  check, spelling slow and complete, numbers read back by the other speaker, ~3.5 s pause after each answer). One voice per
  speaker; with ≤ 2 named people most listenings have 2–3 voices. Length stays about as now (2–5 min).
- **Not used by students yet**: the database has Listening answers only for Steps 4–5, so rewriting 8–20 changes no results.
- **A spelled word is one word**: a two-word name ("Willow Creek") is never spelled — that was how Step 19 reached 15.
- **The spelled number** is a phone number (or, where a phone number doesn't fit the story, a ticket/booking number), read
  digit by digit and read back once by the other speaker; it is never right next to a spelled word in the question list.
- **Stories about many people** (Step 12's four students and their dreams, Step 13's three jobs, Step 20's four reporters):
  the others are told apart by role or place ("the reporter in Tokyo", "the student who loves football"), and a matching question
  matches roles, not names.
- **Question types** stay the ones the student page has (gap "ONE word or A NUMBER", A/B/C, True/False, short answer); each
  step's intro line is rewritten for its new speakers.
- **For the teacher's check**: each step's questions with the answers as a readable file, plus the mp3.

## How it is built (fits the current pipeline)
- **Source**: a new file `docs/listening-journey-steps-8-20-v2.md` in the same format as the teacher's
  `docs/listening-journey-steps-8-20.md` (title, format, `## Audio transcript` with `**Name:**` paragraphs, `## Questions`), so
  `tools/listening-transcripts.py` keeps working — it reads v2 instead of the old file for Steps 8–20. The old file stays as
  history.
- `audio/skills/listening-journey-scripts.json` entries 8–20: the new lines (`[voice, text]` / `[voice, text, 3.5]`; spelled words
  as `"T. U. R. N. E. R."` lines; the phone number as words, matched by `PHONE`).
- `docs/listening-journey-questions.json` entries 8–20: the new questions (same shape: sections `{h, t, qs}`; each question ends with
  a few words of the script holding its answer). `node tools/build-listenings.js` writes them into `js/skills-data.js`.
- `audio/skills/listen-step-N.mp3` re-made for 8–20; the `?v=` on each `src` bumped; `npm run stamp`.
- **Automatic check** (a new test, `tests/listening-rules.spec.js`, Steps 8–20):
  - the script has 1–2 spelled-word lines and exactly 1 spelled-number line;
  - Question 1 is the first spelled word; a second spelled word is Question 5 or later;
  - one question asks for the spelled number;
  - questions in recording order (each question's answer is at or after the previous one's in the transcript);
  - at most one answer of each kind (price, clock time, °C, date) — by the answer's/question's form;
  - the question count is the one above.
  The build tool also refuses out-of-order questions.
- Existing tests that name old Step 8–20 content (`tests/listening-journey.spec.js` and others) are updated.

## Order of work
1. **Step 8 complete**: story + questions + recording + the automatic check. Send the teacher the questions (readable) and the
   mp3. Wait for their OK or corrections.
2. Apply what they said to the pattern; **Steps 9–20** the same way. Send all questions + mp3s.
3. Their OK → tests, CLAUDE.md notes (Listening Journey bullet: the new rules, v2 file), merge on "merge it".

## Not doing
- Steps 1–7 (the teacher: only 8–20, since 6 and 7 have no spellings).
- New question types or a new look for the student page.

## Left to the builder
- The exact new names, sentences and questions, within the rules above.
- Which word is spelled (normally a speaker's surname for Question 1; the second, if any, a place or second person).
