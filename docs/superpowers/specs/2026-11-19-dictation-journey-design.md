# Dictation Journey — design (2026-11-19)

## Why
The teacher wants students to practise dictation at home, one sentence at a time, the way sites like their screenshot do it:
listen, type, see the mistakes, fix them, go on. The teacher sends one link per dictation to every group and sees what each
student wrote, how many sentences they skipped and how long they spent. In class the teacher can also play the full audio and show
the transcript.

Source: the teacher's `100_English_Dictation_Transcripts.md` (100 passages, 5 levels of 20: Beginner 1–20, Elementary 21–40,
Pre-intermediate 41–60, Intermediate 61–80, Upper-intermediate/Advanced 81–100). The text is used as the teacher wrote it
(including their names and places: Aziz, Malika, so'm, Andijan, Tashkent, Samarkand…).

## What the teacher decided
- A **Dictation Journey** on the Course page, **next to (under) the Grammar Journey**, with the 100 dictations in 5 levels.
- Teacher's screen, per dictation: **🔗 Copy link** (one permanent link for every group), **▶ the full audio**, **📄 the transcript**,
  and its results.
- Student: hears **one sentence at a time**, can replay it, types it, presses Check, sees the mistakes, and **must fix them before
  moving on (or press Skip)** — teacher's answer "A".
- **"Right" = the words** — spelling must be exact; capital letters and punctuation are pointed out but never block — for all 100
  (teacher's answer "A").
- Results: **what they wrote**, **how many skips**, **how many minutes**.
- **Phones: everything in the top 60 % of the screen** (the keyboard takes the bottom).
- Audio made with **OmniVoice** (github.com/k2-fsa/OmniVoice). Dictation 1's audio was approved by the teacher (2026-11-19: "i like
  it" — Energetic Male, speed 0.9, 1.2 s between sentences); the other 99 are made the same way (`tools/make-dictation-audio.py`;
  numbers said in words by its `spoken()`). 416 sentences in all.

## Goals / non-goals / anti-goals
- Goals: all 100 passages with per-sentence audio; a calm, phone-first sentence screen; fair checking; teacher results per group.
- Non-goals (now): points, a results link for students, recording speech, a teacher-made dictation editor (Create already has one).
- Anti-goals: a correct sentence refused (numbers, contractions, curly apostrophes, "Mrs"/"Mrs."); the phone keyboard covering the
  sentence, the buttons or the mistakes; a student losing their work on a reload or weak internet.

## Approaches
- **A. A new kind on the course student page (picked)** — `skill.html?s=dictation&dl=<dN>&c=<code>`, like Grammar
  (`js/grammar-player.js` → a new `js/dictation-player.js`): reuses the ID check + "Bu sizmi", kept/unsent answers, "already done"
  from the database, the resume draft, active time, the Mountain Air look. Teacher side like `js/pages/grammar.js`.
- B. A Create-page Dictation per passage — links die after 7 days, audio inside each file (heavy), no ID check. Rejected.
- C. A separate page — duplicates the ID check and answer safety. Rejected.

## Design

### Content
- Source `docs/dictation-journey.md` (the teacher's file as given) → `tools/build-dictations.js` → `js/dictation-data.js`
  (`TA_DICTATION = { levels: [5 × { id, name, items: [{ id: 'd1'…'d100', no, title, text, sentences: [..] }] }] }`).
  Sentences are split on . ! ? (keeping "Mrs", "Dr", "a.m./p.m.", times "7:20", "AZ 418" etc. intact; a quoted speech line may
  hold several sentences — the tool keeps a sentence list that's checked by hand for the first level).
- Never edit `dictation-data.js` by hand.

### Audio
- One MP3 per sentence: `audio/dictation/d<N>-s<k>.mp3`, plus the full passage `audio/dictation/d<N>.mp3` (the sentences
  joined with ~1.2 s pauses) for the teacher. Kept on the website (GitHub Pages), never in Firebase.
- Made by a script like `tools/make-omnivoice-audio.py` with the same "Energetic Male" voice as Listening Steps 9–20 (the teacher
  can ask for a woman's voice), checked by Whisper, mono 22 kHz, ~48–64 kbps. Natural speed, a little slower than the listening
  recordings. Licence of the model weights: CC-BY-NC (risk 22).

### Student screen (phones: top 60 %)
- Start card (ID only) → "Bu sizmi" → the dictation title and "Sentence 1 / N".
- A sentence plays by itself; **▶ Play again** as often as wanted; a 0.75× slower play (my call).
- Text box (no autocorrect/capitalise on phones: `autocapitalize="off" autocorrect="off" spellcheck="false"`) → **Check**.
- Wrong: the wrong / missing words are marked (the existing word-by-word aligner `taDictAlign`), "Fix the marked words" — the box
  keeps their text; they fix and Check again. A small note for capitals/punctuation that differ (doesn't block).
- Right: ✅, the sentence shown, the next one plays.
- **Skip**: shows the right sentence, counts a skip, goes on.
- The layout keeps the box, the buttons and the mistakes inside the visible part above the keyboard (`visualViewport`), max 60 vh.
- End: score, minutes, skips; result sent once (first time only, like Grammar); "Do it again" for practice sends nothing.

### Checking ("right")
Words compared after: lower case, curly → straight apostrophes, punctuation removed, hyphens = spaces, "Mrs"/"Mrs." the same.
**Numbers count in digits or words** (teacher's "A" + my call): "12" = "twelve", "7:20" = "seven twenty", "1987" = "nineteen
eighty-seven", "14 August" = "14th August" = "the fourteenth of August" = "fourteenth of August", "9 a.m." = "9am" = "nine a m",
"AZ 418" = "AZ418"; British/American spellings stay strict (it's a spelling exercise). Contractions must match the passage
("I'm" ≠ "I am") — they're what the voice says. Capitals and punctuation differences are listed as a gentle note, never blocking.

### Result
`type: 'Dictation course'`, `code, name, studentId, skill 'dictation', dictation (dN), dictationNo, level, title, sentences:
[{ first (first try text), tries, skipped, ok }], total, correctFirst, score (%), skips, timeSeconds, timeDisplay, date, builtAt`.
Only the first full run is sent; active time only (like Grammar).

### Teacher side
Under Grammar Journey: 5 level cards → 20 dictations (title, ▶ audio, 📄 transcript, 🔗 Copy link, N done) → a dictation page: group
filter, table (name, group, score, skips, minutes, date; a row opens what they wrote, sentence by sentence, with tries and skips),
"🚫 Not finished", "❓ Not on your Students list". `ta_dictation_links` (synced, in the backup), class lists refreshed by themselves
like Grammar.

## Left to the builder
Exact visuals, the sentence-splitting edge cases (checked by test), and code layout.
