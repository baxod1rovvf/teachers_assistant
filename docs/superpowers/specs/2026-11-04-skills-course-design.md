# Skills Course (Listening · Reading · Writing · Speaking) — design

Date: 2026-11-04. Agreed with the teacher in chat, step by step.

## Goal

Replace everything in the Course section with four skill courses. Students do levels from a link the
teacher sends to a group, and the teacher sees the results and a ranked results table per level.
The first stage is **Elementary: 10 levels**, each with a Listening, a Reading, a Writing and a Speaking part.

## What the teacher said (decisions)

- Delete everything in the current Course: Block 1 lessons, review, exam, slide editor, Teach mode,
  handouts, exam marks and the 21 recordings.
- Used by **both**: students, through a link with their ID, and the teacher, who can try every level in Loom.
- **Nothing is locked.** Every level is open; the teacher sends any level's link to any group.
- **Each skill of each level has its own link.** For example, Level 1 Listening + Reading one day, and
  Level 1 Writing + Speaking the next.
- Each level has **one theme** across its four skills.
- **Writing check:** the free LanguageTool grammar checker, plus Loom's own "better words" list. No paid AI, no server.
- **Speaking is practice only:** no microphone, nothing recorded, nothing sent, no score, no name/ID screen.
- **Results table** per level and group (like the teacher's "Sunday exam #1" picture), with a downloadable picture.
- **Writing band:** Loom estimates it; the teacher can change it, and the teacher's mark wins everywhere.
- Course content rules still apply: English names and places only, no Uzbek; spelled names in
  recordings are said slowly and clearly.

## Student experience

### Every Listening / Reading / Writing level
- `skill.html?s=<listening|reading|writing|speaking>&lv=<1…10>&c=<6-character code>`, a page on the site. It never
  expires, and its page, data and audio download from GitHub Pages, not Firebase. The code belongs to one level + skill +
  group (made at the teacher's first Copy link), so results land under that group. Speaking links have no code.
- It opens with a start card in the Loom student theme (name + ID; any ID is accepted, and Results matches it
  against the Students list as for exercises).
- One result per Submit goes to Firestore `results`, in the student-record shape exercises already use
  (6-character `code`, `name`, `studentId`, `type`, `v`, `score`, `correct`, `total`, `submittedAt: serverTimestamp()`),
  so the database lock lets it through and Results/Statistics/Top 5 see it.
- **Preview** (the teacher's ▶️ Try, `&preview=1`) works the same but sends nothing.

### 🎧 Listening
- An audio player (play / pause; plays as often as the student wants).
- 10 gap-fill questions (spelled names and streets, phone numbers, places, times, prices).
- **Submit** → each box turns ✅ green or ❌ red with the right answer, plus a score "7 / 10".
  Marking ignores case, extra spaces and a final full stop; numbers accept digits or words where sensible;
  each question may list several accepted answers.
- Then **10 useful words** from the recording (word + short English meaning + example).
- **Analyze >** shows the transcript (who speaks: woman / man); lines holding an answer are highlighted
  with the question number.
- Voices: a kind, soft woman (Kokoro `af_heart`) and a kind, soft man (Kokoro `bm_george`); the narrator line
  at the start uses the woman. Each recording is a conversation of about 1.5–2 minutes, made with
  `tools/make-course-audio.py` and every line checked by the speech recogniser.

### 📖 Reading
- One text (about 150 words at level 1, growing to about 300 at level 10) and 15 questions:
  5 True / False / Not given, 5 gap-fill (words from the text), 5 choose a / b / c.
- Submit → ✅ / ❌ + score "11 / 15" → 10 useful words → **Analyze >** highlights the sentence that holds each
  answer, with the question number.

### ✍️ Writing
- A topic with 3 bullet points to cover, a timer (15 minutes at level 1 → 25 at level 10), and a live word counter
  against a target ("42 / 40–60 words"; the target grows from 40–60 to 80–100).
- When the time runs out, it submits by itself.
- Submit → the text goes to LanguageTool (`https://api.languagetool.org/v2/check`, `language=en-GB`):
  mistakes are underlined, each with the explanation and the fix. **Better words** come from a list in Loom
  (e.g. good → great / excellent, very big → huge, nice → lovely), shown for the words the student used.
- If LanguageTool is busy, refuses or there's no internet: the better-words tips still show, the text is still
  sent, and a note says "The grammar check couldn't run this time — press Check again." The band estimate then
  uses only the length.
- The result holds the full text, word count, time used, the mistakes found (count + list) and the estimated band.

### 🗣️ Speaking (practice only)
1. **Topic words:** 8–10 words with emoji and an example; 🔊 reads a word aloud (the browser's voice) if wanted.
2. **Simple questions:** 4–5, one at a time with **Next →**; a small "words you can use" line under each.
3. **Part 2 card:** a topic with 3 hints, an optional 30-second "get ready" timer, then a speaking timer the student
   starts themselves (45 s for levels 1–3, 1 min for 4–7, 1 min 30 for 8–10).
- No name/ID, no microphone, nothing recorded or sent.

## Teacher's side (Loom)

- The **Course tab** (🗺️) shows four big cards: 🎧 Listening · 📖 Reading · ✍️ Writing · 🗣️ Speaking.
  A card → **Elementary** → 10 level tiles ("Level 3 · My home"), all open.
- Group chips at the top (as now). Each tile has:
  - **▶️ Try**: opens the level as students see it (preview, nothing sent).
  - **🔗 Copy link for <group>**: copies the permanent link.
  - **📊 View Results**: Listening, Reading, Writing only.
- The first Copy link for a level + skill + group adds a **My Exercises** item (type "Listening course",
  "Reading course" or "Writing course", that group, a fresh 6-character code), so Results, Statistics and Top 5 work.
  Later presses copy the same link.
- **Results** for a writing item show each student's text, word count, time and mistakes, and a band box the teacher can change.
  The teacher's marks are kept in `ta_skills_marks` (synced, in the backup).
- **Results table** per level + group (a 📊 button on the level tile, shown once any result exists):
  - "Level 1 · Meeting people · <group> · <date>", Loom's own colours (no other branding).
  - Students ranked by Overall, with equal places sharing a number (1, 2, 2, 2, 5…) and a medal for the top places.
  - Columns: 🎧 Listening · 📖 Reading · ✍️ Writing · Overall. Each shows the band (big) and the raw score
    (small: "8 / 10", "13 / 15", "54 words"); Overall shows its CEFR too.
  - Each student's best try per skill counts. A missing skill shows "—" and Overall uses the skills that exist.
  - Colours: green ≥ 6.5, yellow 5.5–6.0, red ≤ 5.0.
  - Footer: group average and the number of students.
  - **⬇️ Download picture** saves a PNG (drawn on a canvas in the browser, no outside library).

### Band rules
- **Listening and Reading:** the raw score is scaled to 40 (`round(correct / total × 40)`), then the IELTS listening
  table: 39–40 = 9, 37–38 = 8.5, 35–36 = 8, 32–34 = 7.5, 30–31 = 7, 26–29 = 6.5, 23–25 = 6, 18–22 = 5.5,
  16–17 = 5, 13–15 = 4.5, 10–12 = 4, 8–9 = 3.5, 6–7 = 3, 4–5 = 2.5, 1–3 = 2 (rounded down to 1 below that), 0 = 0.
  This matches the teacher's picture (19/20 → 8.5, 16/20 → 7.5, 9/20 → 5.5, 7/20 → 4.5, 3/20 → 3).
- **Writing estimate:** `3 + 3 × min(1, words / minimum words) + 3 × max(0, 1 − mistakes per 100 words / 10)`,
  rounded to the nearest 0.5 and kept within 1–9. If the grammar check didn't run, the last part counts as 1.5.
  The teacher's mark replaces it.
- **Overall:** the average of the skills present, rounded like IELTS (x.25 → x.5, x.75 → next whole band).
- **CEFR from Overall:** 8.5–9 C2 · 7–8 C1 · 5.5–6.5 B2 · 4–5 B1 · 3–3.5 A2 · below A1.

## Content: Elementary, 10 levels

| Level | Theme | Listening (10 gaps) | Reading (15 q.) | Writing (words · minutes) | Part 2 talk |
|---|---|---|---|---|---|
| 1 | Meeting people | Hotel check-in: name spelled, room, phone | A pen-friend's profile | About me (40–60 · 15) | Yourself (45 s) |
| 2 | Family & friends | Joining a sports club: names, ages, phone | Emma's family | My family (40–60 · 15) | A family member (45 s) |
| 3 | My home | Renting a room: address, street spelled, rent | Two homes | My home (40–60 · 15) | Your home (45 s) |
| 4 | My day | Booking a doctor's appointment: days, times | A nurse's day | My weekday (50–70 · 20) | Your favourite day (1 min) |
| 5 | Food & cafés | Ordering for a party: dishes, prices, phone | A café menu & review | My favourite meal (50–70 · 20) | Food you like (1 min) |
| 6 | Shopping | A lost bag at a shop: colour, things inside, name | Shopping in London | A shopping trip (50–70 · 20) | A shop you like (1 min) |
| 7 | My town | Tourist office: places, opening times | A town guide | My town (60–80 · 20) | A place in your town (1 min) |
| 8 | Free time | Signing up for a course: course name, day, price | Hobby club adverts | My free time (60–80 · 25) | A hobby (1 min 30) |
| 9 | Travel | Buying train tickets: station, platform, times | A trip to Edinburgh | A trip I took (80–100 · 25) | A trip (1 min 30) |
| 10 | Weather & holidays | Booking a holiday: dates, hotel spelled, price | A holiday blog | My dream holiday (80–100 · 25) | A holiday you'd like (1 min 30) |

Every listening has 2–3 spelled names or streets, a phone number and places. All names and places are English.

## Files

- `skill.html` + `js/skill-player.js`: the student page (start card, the four skill views, marking, Analyze,
  writing check, sending results, preview).
- `js/skills-data.js`: `TA_SKILLS = { elementary: { levels: [ { no, theme, emoji, listening: { src, questions[{q, a[]}],
  words[{w, m, ex}], transcript[{who, text, answers[]}] }, reading: { title, text, questions[{type, q, opts?, a[], line}],
  words }, writing: { topic, points[], minWords, maxWords, minutes }, speaking: { words[{w, emoji, ex}], questions[],
  part2: { topic, hints[], seconds } } } ] } }`, plus the better-words list `TA_BETTER_WORDS`.
- `js/skill-bands.js`: the band, writing-estimate, overall and CEFR rules (shared by the page and Loom).
- `course.html` + `js/pages/course.js`: rebuilt (cards → levels → tiles, Copy link, Results table, PNG download).
- `audio/skills/elem-<n>-listening.mp3` + `audio/skills/elementary-scripts.json`.
- **Removed:** `js/course-data.js`, `js/course-slides.js`, `audio/course/`, the slide editor / Teach mode CSS, the
  `ta_course_*` keys from sync and backup, and the robot questions about the old Course (none exist now).
- `CLAUDE.md`: the Course notes replaced with this design.

## Errors and edge cases
- Audio can't load → a note "The recording couldn't load — check the internet and press ▶️ again"; the questions
  still show.
- Firestore refuses or is offline → the result is retried (3 tries); the student sees "Saved ✅" or "Not sent yet — press
  Send again", and the answers stay on the screen.
- A link with an unknown level → "This level doesn't exist", plus a link back.
- The teacher's own Try never writes to the database.
- LanguageTool down → see Writing.

## Tests (Playwright, stand-in database)
- The Course page shows 4 cards and 10 levels each; Try opens the right level in preview and sends nothing.
- Copy link gives the permanent link and adds one My Exercises item per level + skill + group.
- Listening: Submit marks ✅ / ❌ correctly (case, spaces, alternatives), shows 10 words, and Analyze highlights the
  answer lines; one result is sent with the right code.
- Reading: the same with 15 questions.
- Writing: the word counter, auto-submit at time 0, LanguageTool mocked (mistakes shown; the down case still sends),
  better words shown, and the estimated band.
- Speaking: three steps, Next, timers; nothing is sent; no ID screen.
- Bands: the IELTS table examples from the teacher's picture, the overall rounding and CEFR; the teacher's mark replaces the estimate.
- Results table: ranking with ties, "—" for a missing skill, colours, and the PNG download.
- Content checks: 10 levels × 4 skills, 10 listening / 15 reading questions, 10 words each, every answer
  appears in its transcript / text, no Uzbek, every audio file exists.

## Risks to tell the teacher
- I can't listen to the recordings myself, so the teacher should play each once.
- LanguageTool's free service allows about 20 checks a minute from one internet connection: a whole class on the
  school Wi-Fi pressing Submit at once may need to press Check again.
- Student ID typos mean results don't match the class list (risk 16).
- Speech in 🔊 uses the browser's own voice (needs a voice installed; otherwise the button does nothing).
- Building order: Level 1 (all four skills) first for the teacher to judge, then levels 2–10.
