# Writings checked later by the AI, and results as a link (design)

Date: 2026-11-12. Agreed with the teacher in chat ("yes"). Choices: the checking runs **in Cloudflare by itself**; on the
results link **anyone with the link** can open any writing.

## Why
At Submit the AI check often didn't run (a class submitting at once, the free plan's limits), so writings fell back to the
free check, which missed mistakes like "I playing". The teacher: don't check at Submit; let the AI check every writing
later, never leave one unchecked; share results as a link where each student taps their writing band to see the feedback;
delete the free check.

## 1. The queue in Cloudflare (`tools/ai-worker.js`)
- Storage: a **KV namespace** bound to the worker as `LOOM_KV` (free plan: ~1 000 writes, 100 000 reads a day).
  - `q:<resultId>` = a waiting writing `{ id, text, topic, instruction, minWords, maxWords, words, at, tries, lastError }`
  - `f:<resultId>` = its feedback `{ scores {grammar, vocabulary, structure, task}, mistakes [{wrong, right, why}],
    better [{word, instead, why}], tips [3], words, band, checkedAt }` — the same shape as today's AI answer + `band`
    (worked out like `skWritingAiBand`: the four parts − 0.5 when under the minimum, 1–9, nearest 0.5) and `words`.
  - `resultId` = the result's database id (`sk_<code>_<student>_<time>`, `skResultId`); only `^sk_[A-Za-z0-9_-]{1,140}$`.
- Jobs (POST, only from the teacher's site, as now):
  - `queue` `{ id, text, topic, instruction, minWords, maxWords, words }` → saved as `q:<id>` unless `f:<id>` exists;
    text ≤ 6 000 characters; one visitor (IP) may queue at most 30 a minute (no total cap: counting the waiting list
    costs a KV list, and the free plan allows ~1 000 lists a day — the timer already uses 288). Answer `{ queued: true }` / `{ done: true }`.
  - `feedback` `{ ids: [≤ 60] }` → `{ <id>: { state: 'done', result } | { state: 'waiting', tries, lastError } | { state: 'unknown' } }`.
  - `check` `{ id, … same as queue }` → checks it **now** (the teacher's "🤖 Check now"), saves `f:<id>`, removes `q:<id>`,
    answers `{ result }` or `{ error }` (the writing then stays waiting).
  - `chat` and `writing` stay as they are (the robot; `writing` is kept for old pages still open in a browser).
- **Timer** (a Cloudflare Cron Trigger, `*/5 * * * *` → the worker's `scheduled`): lists `q:` (oldest first) and checks up
  to **5** writings one after another. Success → put `f:`, delete `q:`. Failure → `tries + 1`, `lastError`, saved back.
  Google's "daily limit reached" stops the run at once (no more tries that run). A writing is never dropped.
- `/status` also shows: `kv: true/false`, waiting count, version.

## 2. The student page (`skill.html`, `js/skill-player.js`)
- Submit: the writing is saved as now (`Writing course` result, without `band`), and at the same time the page sends
  `queue` to the helper — the save never waits for the helper (a failure is fine — the safety net below adds it).
- What the student sees: **"✅ Your writing was sent. Your teacher will share your results."** — no band, no mistakes,
  no word list. "Already done" for a writing shows no band.
- **Deleted:** the free check (LanguageTool, `skCheckGrammar`, "Check again"), Loom's own rules (`skBasicGrammar`,
  `skMergeMatches`), the estimate at Submit, the grammar/better-words cards after Submit, the AI call at Submit.

## 3. The teacher's side (Loom)
- **Safety net, whenever Loom is open:** for the course writings it holds (`Writing course`) without feedback on this
  device, Loom asks `feedback` (60 ids a time, at most once every 10 minutes per writing); `done` → kept in `ta_skills_ai`
  (synced, in the backup; now keyed by the result id — entries keyed the old way, "<code>|<studentId>", still read); `unknown` → Loom sends `queue` for it. So writings whose page failed
  to hand them over, and **all older writings the AI never checked**, get checked too.
- **Bands:** the teacher's mark (`ta_skills_marks`) wins; else the AI's band; a writing still waiting shows **⏳** in the
  step's results table, Progress and the step-card average leave it out; writings sent before keep their old band until
  the AI's band arrives.
- **The writing window:** the AI feedback when it's there; else "⏳ Waiting for the AI check" (+ tries and the last
  reason) with **🤖 Check now** (`check` job). The old saved mistake list of an older writing shows until the AI's arrives.
- **🔗 Share results link** on a step's page, next to "⬇️ Download picture": puts the table online as one record
  `share-<token>` (`code 'TAUSER'`, `type 'TA_SYNC:SHARE'` — a teacher's kind the rules already allow; delete + create on
  every press) with `data` = JSON `{ group, step, stepNo, theme, rows: [{ place, medal, name, listening {band, raw},
  reading {band, raw}, writing {id, text, words, minWords, maxWords, asked, mark?} | null, overall }], sharedAt }`.
  The token is random, kept per group + step in `ta_skills_shares` (synced, in the backup), so the link stays the same.
  Link: `results-link.html?r=<token>`.

## 4. The results link page (`results-link.html` + `js/results-link.js`)
- Reads `results/share-<token>` (REST, like `play.html` — no Firebase SDK), draws the table in the students' dark look
  (step, group, places + medals, 🎧 📖 ✍️ bands with raw scores, Overall + CEFR).
- Writing bands come **live** from the helper (`feedback` for the table's writing ids): the teacher's mark if the record
  has one, else the AI's band, else **⏳ Checking…** — so a band appears by itself once checked (the page asks again
  every minute while any is waiting).
- Tapping a writing band opens that writing: the text with each AI mistake's sentence underlined, wrong → right + why,
  better words, asked words (✅/❌), the 3 tips, score /9 with its parts. Anyone with the link can open any writing.
- Not found / no internet → a plain message ("This results link doesn't exist" / "Check the internet").

## 5. Setup the teacher does once (steps with pictures in chat)
Cloudflare → Workers & Pages → loom-ai: (1) Storage → KV → create `loom-writings`; (2) loom-ai → Settings → Bindings →
add KV namespace, variable name `LOOM_KV`; (3) Settings → Triggers → Cron Triggers → every 5 minutes; (4) paste the new
code, Deploy; (5) `/status` shows the new version with `kv: true`.

## Limits and risks (told to the teacher)
- Google's free daily limit: on a very busy day some writings wait until the next day — they are never lost.
- Cloudflare KV free writes (~1 000/day ≈ 300 writings/day) — far above use.
- The results link and the helper's feedback can be read by anyone who has the link / a writing's id (the database is
  readable anyway). No private details in writings.
- Risk 21 (LanguageTool's limit) goes away; a new one: if the helper is down, writings wait and links show ⏳.

## Tests
- `tests/ai-queue.spec.js`: the worker in Node with a stand-in KV and Gemini — queue / feedback / check / the timer (5 per
  run, retries keep the writing, daily-limit stop, never dropped), id and size checks.
- The student page: Submit → saved + `queue` sent, the "sent" message, no band; no LanguageTool request.
- Loom: the safety net queues unknown writings and keeps done ones; ⏳ in the table; the writing window; Share link record.
- The results link page: table, ⏳ then the band, tapping a band shows the feedback; a missing link.
- Existing writing tests updated (the AI at Submit and the free check are gone).

## Order of work
1. Worker (queue, feedback, check, timer) + its tests. 2. Student page. 3. Loom's safety net, bands, writing window.
4. Share link + results link page. 5. CLAUDE.md, risks, full tests. 6. Teacher sets up Cloudflare; merge on "merge it".
