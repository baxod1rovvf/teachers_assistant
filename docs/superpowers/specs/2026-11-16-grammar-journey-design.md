# Grammar Journey — design (2026-11-16)

## Why

The teacher wants a grammar course next to the Skills Course. Students do it **at home, on their own**, so every lesson has
to teach without the teacher in the room. The source syllabus is the teacher's
`grammar_journey_beginner_to_intensive.md`: 120 lessons in 7 levels. **Only Beginner (Lessons 1–15) gets content now.**

## What the teacher decided

- A **Grammar Journey** section on the Course page, **below the group cards** (teacher's screenshot, 2026-11-16).
  It shows 7 levels: Beginner, Elementary, Pre-Intermediate, Intermediate, Upper-Intermediate, Advanced, Intensive.
  Only Beginner has lessons, and the other six show "Coming soon".
- Each lesson is **learn → practise → learn → practise … → a 20-question revision test**.
- **No groups on the link.** There is one permanent link per lesson, and the teacher sends the same link to every group.
- **The ID check is exactly like the other course exercises**: type the ID, see "Bu sizmi: <name> — <ID> / Guruh: <group>",
  then Ha / Yo'q.
- **Results** show **only the revision test** (out of 20) and **the total time** for the whole lesson (learning, practice
  and test). The teacher can see all groups together or filter to one group.
- **Students can retake the test as often as they like**, but the results hold only the **first try**.
- The extra ideas the teacher picked: **(4)** a "Not finished" list per group, **(5)** the revision test mixes in questions
  from earlier lessons, **(6)** one short Uzbek line under each rule.

## Goals / non-goals / anti-goals

- Goals: 15 complete Beginner lessons, one link each, that work for every group; the teacher can see who did each lesson,
  their first score and their time, per group; nothing students do is lost on a weak connection (the same safety as the
  course parts).
- Non-goals (now): content for the other 6 levels; lessons in a fixed order (no "do Lesson 2 first" lock); points or awards;
  a results link for students; speaking or writing tasks inside a lesson.
- Anti-goals: a student who isn't on any list gets in; a retake replaces the first score; a lesson needs the teacher in the
  room to make sense; the Skills Course (groups, steps, its links) changes behaviour.

## Approaches

- **A. Grammar as a new kind on the existing course student page (picked).** `skill.html?s=grammar&gl=<lesson id>&c=<code>`,
  played by `js/skill-player.js`. It reuses the ID check, "Bu sizmi?", answers kept on the phone until they're saved, the
  look, and the result shape the database lock already accepts. It makes the course code bigger.
- B. A separate grammar page. It's cleaner, but it repeats the ID check and the unsent-answer safety, which took several
  fixes to get right.
- C. Create-page exercises. Their links die after 7 days, there's no ID check, and there'd be 15 files to keep. Rejected.

## Design

### Content (Claude writes it, the teacher approves it)

- Source: `docs/grammar-journey.json`, with a readable copy `docs/grammar-journey.md` (rules, examples, every question with its
  answer). The teacher reads the .md and approves it before it goes in, the same way as the Reading Journey.
  `node tools/build-grammar.js` writes `js/grammar-data.js` (`TA_GRAMMAR = { levels: [7 × {id, name, lessons: []}] }`).
  Never edit grammar-data.js by hand.
- Lesson `{ id: 'g1'…'g15', no, title, chunks: [{ learn: { title, rule (short, plain), table?, examples[4–6], uz }, practise:
  [5 questions] }] × 2–4, test: [20 questions] }`. Ids are stable and never renumbered.
- Question types (Beginner-easy): `choose` (a–c), `gap` (type a word; several right answers allowed), `order` (tap the words
  into a sentence), `fix` (choose the correct sentence from two or three). Marking reuses `skMark` / `skNorm`.
- Revision test: about 16 questions on the lesson and 4 from earlier lessons. Lesson 1 is all its own. Each question says
  which lesson it comes from (`from`).
- Uzbek: one line per rule (`uz`), in simple Uzbek. Everything else is English. Example sentences use English names only.
- A lesson takes about 20–30 minutes.

### Student page

1. Start card (ID only) → `skCheckStudent` → "Bu sizmi:" with **the student's own group** (see the class list below) → Ha.
2. **Learn** card → "✏️ Practise". Practice is marked one question at a time. A wrong answer shows the rule again with a
   hint, and the student must get it right to go on. Practice is never sent.
3. After the last chunk: "🏁 Revision test", 20 questions on one page, then Submit → ✅/❌ for each with the right answer, and
   the score.
4. The **first** Submit sends one result. "🔁 Try the test again" shuffles the questions and their options, shows the score,
   and sends **nothing**.
5. **Progress is kept on the phone** (`ta_grammar_draft|<code>`: chunk reached, test answers, time so far), so a reload
   continues where the student was. It's cleared once the first result is sent.
6. **Opening the link again after the first result is in the database**: "You've done this lesson — <score>/20" with
   "🔁 Try the test again" (sends nothing) and "📘 Read the lessons again". This uses the same database check as the course
   (`skAlreadyDone`), so "done" is never decided by the phone alone.
7. Unsent answers: the same `keepUnsent` / `skSendKept` / "📤 Send my answers" path as the course parts.
8. Preview (teacher's ▶️ Try): no ID card, nothing sent.

Result: `type: 'Grammar course'`, `code, name, studentId, lesson (id), lessonNo, level ('beginner'), correct, total (20),
score (%), timeSeconds, timeDisplay, answers` (given + right for each question), `date, builtAt, submittedAt`. The record id
comes from `skResultId`. The type ends in " course", so it's already left out of the "students finished" note, and old
results are handled the same way as course results.

### The class list for a lesson (one list for every group)

- Copy link writes `class-<code>` with **all roster students** of every group. Each entry adds its group's name:
  `{h, n, g}`. `skCheckStudent` prefers the entry's `g` over the record's `group`, so the course parts still work as before.
- **It updates by itself**: when the Course page opens and the roster (IDs, names, groups) has changed since a lesson's list
  went online, Loom re-publishes the list for every lesson whose link was copied. It keeps a fingerprint of the roster in
  `ta_grammar_links[<lesson>].rosterSig`. That's 2 writes per lesson, and only when something changed.

### Teacher's side (Course page, below the group cards)

- A **📚 Grammar Journey** heading with 7 level cards. Beginner shows "15 lessons" plus how many have been sent. The other six
  are greyed out with "Coming soon".
- Beginner opens a list of Lessons 1–15. Each row has a title, ▶️ Try, 🔗 Copy link, and "N done".
- A lesson opens its page with a **group filter** (All · Apex · Target · …) and a **results table**: place, name, group,
  first test score /20 (and %), total time, and date. It's sorted by score, then by time. Below the table: **"🚫 Not
  finished — <group>"** (roster students with no result) with "📋 Copy list", shown when one group is picked or per group under
  All. Also "❓ Not on your Students list", like the course has.
- Storage: `ta_grammar_links = { <lesson id>: { code, sentAt, rosterSig } }`. It's synced (js/sync.js list) and in the
  backup (settings.js list). firebase.js loads its codes the same way it loads `ta_skills_links`.

### Things that must stay true

- The database lock: the result is the student shape, and `TA_SYNC:CLASS` is already a teacher's kind. No rules change.
- New CSS/JS → `npm run stamp`. AI robot questions are added only if the teacher says yes. Tests:
  `tests/grammar-journey.spec.js` (ID check with a group, chunk flow, the first try only, retake sends nothing, reload
  resumes, results filter, Not finished, the list updating by itself) and a content test (every lesson has 20 test
  questions, every `choose` answer is among its options, there's an Uzbek line per rule, and no non-English names).

## Left to the builder

The exact look of the cards and table (in the Mountain Air style, like the course), the tie-breaks in the table, how the
build tool validates content, and how the code is split between skill-player.js and a small `js/grammar-player.js` if the
player gets too long.

## Open (teacher)

- **Total time**: count everything from Start to the test (a student who stops for the night shows 14 hours), or only time
  with the page open and in use?
