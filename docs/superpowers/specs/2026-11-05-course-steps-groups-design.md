# Course: groups first, Journey + Progress, 20 steps (beginner steps 1–10) — design + plan

Date: 2026-11-05. Agreed with the teacher in chat; the teacher then said "build it yourself, I won't be here".

## What the teacher asked
1. The dots on the path must not carry 🎧📖✍️🗣️ icons (a step's first part isn't always listening) — plain dots.
2. Copy link must no longer add the part to My Exercises.
3. Course opens on **group cards** (Apex, Target, Nexus…): group name; its level (Beginner, Elementary… — the group's level from the Students page); a row of small squares, one per step (green done, red the step the group is on, grey skipped, empty not yet); the group's overall score (⭐ band); the students not studying well (🐢 N behind); a big **▶ Teach STEP N** button.
4. Inside a group: two tabs at the top — **Journey** and **Progress**.
5. **Teach STEP N** opens the Journey scrolled to step N, which is singled out (bigger, highlighted) so the teacher sees what to teach.
6. **Progress** (option A): one row per student — name, average band, "12 of 18 steps done", then a row of small squares, one per step, coloured by that student's best band in the step (green ≥ 6.5, yellow 5.5–6, red ≤ 5, empty not done); students behind first, marked 🐢.
7. **Behind** (option C): missed 2 or more parts already sent to the group (Listening/Reading/Writing whose link was copied for the group), **or** average band below 5.
8. "Level" becomes **"Step"** everywhere (Course page and student page).
9. Today's levels 1–8 become **steps 11–18**; ten new, very easy **beginner steps 1–10** come first (10 short questions: names, ages, numbers; harder little by little). Steps 19–20 = "Coming soon" (old 9–10 themes).
10. Old Level 1's Writing ("About me") and Speaking ("Talk about yourself") move to **step 1**; step 11 gets new elementary Writing ("An email to a new classmate", 50–70 words, 20 min) and Speaking ("A person you met recently", 45 s) — option A.

## Decisions made while the teacher was away
- **Stable step ids.** Each step in `TA_SKILLS` gets an `id`: beginner `b1`…`b10`, elementary `e1`…`e10` (old levels 1–10 = `e1`…`e10`). The shown number is the position (b1–b10 → 1–10, e1–e10 → 11–20). Data: `TA_SKILLS.steps = [ {id, no, stage: 'Beginner'|'Elementary', theme, emoji, listening?, reading?, writing?, speaking?}, … ]` (20 entries).
- **Links:** new links `skill.html?s=<skill>&st=<id>&c=<code>`. **Old links** (`lv=N`, no `st`) open `e<N>` — links already sent keep working. `ta_skills_links` keys become `"<groupId>|<skill>|<id>"`; an old numeric key `"<g>|<skill>|<n>"` is read as `e<n>` (and rewritten on the next save). Results carry `step: <id>` (and the old `level` number stays on old results; `level: n` without `step` = `e<n>`). Codes are unchanged, so old results stay with their parts.
- **My Exercises:** Copy link records `{uid?, code}` in `ta_skills_links` only (no `pushRecentExercise`). Items of type "… course" already in My Exercises are **hidden** from its list (not deleted). Results still load because `firebase.js` reads codes from `ta_skills_links`.
- **Where a group starts:** group level Beginner (or empty) → step 1; any other level → step 11; steps before the start are "skipped" (grey squares, greyed on the path, still openable).
- **A step is done** when all its dots are done (dot rule unchanged: half the group did that part; Speaking when its link was copied). The group is **on** the first step at or after its start that isn't done.
- **Overall score** on the card: average of the students' Overall bands across all steps they did (skOverall rounding); "—" before any result.
- Beginner content: listening ~1–1.5 min, slower and shorter, 10 gaps with one-word/number answers; reading 40→120 words with 10 questions (True/False and choose a/b/c — no "Not given"); writing 20–50 words, 10–15 min; Part 2 talk 30–45 s. Same voices/spelling recipe as CLAUDE.md. Reading "type" `tf` (True/False) is new — the student page and band rules must handle 10 reading questions.

## Plan (tasks run in order; each ends with the full test suite passing)
1. **Step data + links** — restructure `js/skills-data.js` to `TA_SKILLS.steps` (ids, b-stubs for 1–10, e1–e10 = old levels), move e1's W/S to b1 and write e1's new W/S; student page reads `st`/old `lv`, says "Step N", supports `tf` and 10-question readings; `taSkillLink`, `ta_skills_links` keys with migration, results' `step`; Copy link no longer makes My Exercises items, "… course" items hidden there; tests.
2. **Course UI** — group cards → group page with Journey / Progress tabs, plain dots, Teach STEP N, Progress rows with squares, behind rule; "Step" wording; tests; CLAUDE.md.
3. **Beginner steps 1–5** content + recordings (b1 gets only listening/reading new; its W/S came from old level 1).
4. **Beginner steps 6–10** content + recordings.
5. Final review, full tests, screenshots for the teacher. **No merge** until the teacher says "merge it".
