# Writing Journey — 20 writing tasks with an AI check (design)

Date: 2026-11-09. Agreed with the teacher in chat ("yes").

## Content (replaces the course's Writing part, Steps 1–20)
Each step: **asked words** (8–10, with Uzbek meanings — the student must use all), **one topic** with a short instruction
(not a list of questions), and the teacher's **word limit + minutes** (exactly as the roadmap: 1 Daily Routine 80–100/15 …
20 My Favourite Season 120–150/25). A1+–A2, practical words, difficulty rising. No sample answers.
Source: `docs/writing-journey.json` (+ readable `docs/writing-journey.md`), put into `js/skills-data.js` by a tool, like the
Reading Journey.

## The AI check (after Submit)
The writing goes to the teacher's Cloudflare helper (Gemini), new job `writing`: the helper sends the text, the step's
topic, instruction, limits and asked words, and asks for JSON only: `scores {grammar 0–3, vocabulary 0–2, structure 0–2,
task 0–2}`, `mistakes [{wrong, right, why}]` (whole sentences; simple English; never correct natural English),
`better [{word, instead, why}]` (optional, not mistakes), `tips [3]`. Loom works out itself (exact, no AI): the word count,
the asked-words checklist (other forms accepted: use → used, child → children), and the final score = sum of the four
parts − 0.5 if under the minimum (never for writing more), kept to 1–9, rounded to 0.5.
Feedback order on the page (teacher's): 1 final score /9 · 2 words / required · 3 grammar mistakes · 4 better words ·
5 asked-words checklist · 6 three tips. Encouraging, simple English.

**When the AI can't answer** (busy, limit reached, no internet): the student still gets the word count, the checklist
and the free LanguageTool grammar list; the result is sent marked `aiChecked: false`; the band is the old estimate.
The teacher can run the AI check later from the writing's window ("🤖 Check with AI"), which saves the AI feedback as the
teacher's mark for that writing. The helper's per-connection limit is raised for writing checks (a class shares one
Wi-Fi). The teacher redeploys the helper once.

## The teacher's side
Results / the course table show the band (AI score, or the teacher's own mark — that still wins) and the writing's
window shows the same feedback. Unchanged: one try per exercise, the class-list check, the timer and the saved draft,
old writings and their bands.

## Order of work
1. Write the 20 tasks (document for the teacher). 2. After approval: data + tool, helper job `writing`, student page,
teacher's window, tests, CLAUDE.md. 3. Full tests, screenshots; merge only on "merge it".
