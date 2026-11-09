# Reading Journey — 20 new course readings (design)

Date: 2026-11-09. Agreed with the teacher in chat.

## What the teacher asked
A 20-step English Reading Journey for A1+–A2 students that **replaces the course's Reading part** (Steps 1–20).
Every step: a reading text (150–200 words), exactly 10 words/phrases with Uzbek meanings, exactly 5 True/False
statements, exactly 5 WH-questions, and a retelling instruction with the challenge "Try to use at least 5 vocabulary
items from the text."

Step 1 is the teacher's own ("A Day in My Life" — Daniel, 17; its 5 T/F, 5 questions and 10 words as given). Steps 2–20
are written by Claude on the teacher's roadmap, in this order: My Family · My Dream House · Traditional Food Around the
World · How People Spend Their Free Time · A True Friendship · A Day at School · The Benefits of Having a Hobby · A
Shopping Day · My Hometown · My First Big Trip · My Dreams for the Future · Different Jobs Around Us · What People Wear
Around the World · How Do People Travel? · Amazing Animals · Simple Habits for a Healthy Life · How Technology Helps Us ·
The Story Behind a Famous Movie · Four Seasons of the Year.

Writing rules (the teacher's): clear everyday English; mostly Present Simple, Past Simple, Present Continuous; no
repetitive openings ("My name is…", "Today I want to talk about…"); varied styles (descriptions, stories, experiences,
informative articles, explanations); difficulty rises — Steps 2–5 everyday descriptions, 6–10 short stories, 11–15 more
detailed stories / informative texts, 16–20 facts and explanations; reuse some earlier vocabulary, each step adds new
useful words; vocabulary practical (not "book/table/good", not advanced); T/F statements based on the text, a mix of
true and false, not copied sentences; questions simple WH (What/Where/When/Why/Who/How), answerable from the text, no
opinions, not too similar to the T/F statements. Names and places stay English (the course's rule); the only Uzbek is
the words' meanings.

## How it works in Loom (student page, skill.html?s=reading)
1. The text (title + paragraphs).
2. **Part 1 — True or False**: 5 statements (type `tf`, marked automatically).
3. **Part 2 — Answer the questions**: 5 WH-questions, a short text box each (new type `open`).
   **Marking (teacher):** an answer is right when it contains one of the question's **main words** (`keys`, one or more
   alternatives, a key may be a phrase). Case, punctuation and simple endings (-s, -es, -ed, -ing, -'s) don't matter;
   "dream" matches "dreams", "play" matches "played".
4. Submit → score out of 10 (5 + 5) → band as now (`skBand(correct, total)`); one result per Submit, one try per
   exercise and the class-list check stay as they are. The result keeps the typed answers (`answers`).
5. After Submit: the 10 words with their Uzbek meaning (`uz`), an emoji, and the sentence from the text where the word
   appears (found automatically); **Analyze >** marks each question's sentence in the text (`line`).
6. Last: a **Retelling** reminder card with the step's instruction + "Try to use at least 5 vocabulary items from the
   text." Nothing typed or sent (teacher: "students are just reminded to do retelling; they do it themselves").

Data per step: `reading: { title, text, words: [{w, uz, emoji}], questions: [5 × {type:'tf', q, a:['True'|'False'], line},
5 × {type:'open', q, keys:[…], line}], retell }`.

## Unchanged
Listening, Writing, Speaking; links already sent (same codes); the one-try rule and the class-list check; past results
keep their scores (old readings had 10/14/15/20 questions — a result carries its own correct/total). The doubled
readings and the extra questions of 2026-11-09 are replaced. Steps 19–20 get a Reading part (their other parts stay
"Coming soon").

## Order of work
1. Write the 20 readings as a document for the teacher to check (text, words, T/F, questions with main words, retelling).
2. After the teacher approves the texts: build them into `js/skills-data.js`, the `open` question type and the retelling
   card in `js/skill-player.js`, update tests (`tests/skills.spec.js`, `tests/course-fairness.spec.js`), CLAUDE.md.
3. Full test run, screenshots, send to the teacher; merge only on "merge it".
