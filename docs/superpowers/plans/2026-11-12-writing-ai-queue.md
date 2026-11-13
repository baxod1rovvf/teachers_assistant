# Writings Checked Later by the AI + Results Link — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Writings are no longer checked at Submit; the teacher's Cloudflare helper checks every one later from a waiting
list (never dropped), and the teacher shares a step's results as a link where any writing band opens its AI feedback.

**Architecture:** The worker (`tools/ai-worker.js`) gets a KV-backed queue (`q:<id>` → `f:<id>`) filled by the student
page and by Loom's safety net, drained 5 at a time by a Cron Trigger. Loom keeps fetched feedback in `ta_skills_ai` (by
result id) and shows ⏳ for waiting writings. "🔗 Share results link" writes a `TA_SYNC:SHARE` record; a new static page
`results-link.html` draws it and reads writing feedback live from the worker.

**Tech Stack:** plain HTML/CSS/JS (no build), Cloudflare Worker (ES module, KV, Cron), Firestore (REST + SDK), Playwright tests.

**Spec:** `docs/superpowers/specs/2026-11-12-writing-ai-queue-design.md`

## Global Constraints

- Worker version string: `2026-11-12q`. KV binding name: `LOOM_KV`. Cron: `*/5 * * * *`. Up to **5** writings per timer run.
- Ids accepted by the worker: `^sk_[A-Za-z0-9_-]{1,140}$`. Text ≤ 6 000 characters. Per IP per minute: queue 30, feedback 60, check 10 (chat 8, writing 40 unchanged).
- Only `https://baxod1rovvf.github.io` may call the jobs (as now); `/status` stays open to anyone.
- Band = `skWritingAiBand(scores, words, minWords)` rule: sum of grammar 0–3, vocabulary 0–2, structure 0–2, task 0–2, −0.5 only when words < minWords, kept to 1–9, nearest 0.5.
- The teacher's mark (`ta_skills_marks`, key `skMarkKey(r)`) always wins over the AI's band.
- Student-facing copy, exact: **"✅ Your writing was sent. Your teacher will share your results."**; waiting band: **"⏳ Checking…"**; link not found: **"This results link doesn't exist — ask your teacher for it again."**; offline: **"Couldn't load the results — check the internet and open the link again."**
- New synced + backed-up key: `ta_skills_shares` (`"<groupId>|<stepId>"` → 16-hex token). Link: `<app base>results-link.html?r=<token>`; record id `share-<token>`, `code 'TAUSER'`, `type 'TA_SYNC:SHARE'`.
- Every changed page uses the shared `?v=` stamp (`npm run stamp`); `results-link.html` must use it too (housekeeping test).
- Tests run with `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test`; no real students' names in tests.

## Review Focus

1. **A writing whose page failed to hand it over** (offline at Submit) → Loom's safety net must queue it the next time Loom loads — test in Task 3 (`unknown` → `queue` sent).
2. **Google's limit hit mid-run** (429) → the run stops, the writing keeps `tries+1` and stays waiting; nothing is lost — test in Task 1.
3. **A teacher's mark on a writing that's still waiting** → the mark shows (no ⏳) in Loom and on the link — tests in Tasks 3 and 4.
4. **An old writing (sent before) with a band but no AI feedback** → keeps its old band, gets queued, and the AI band replaces it once done — test in Task 3.
5. **The AI's "wrong" sentence not found in the text** (it rephrased it) → the link page lists the mistake without underlining and doesn't break — test in Task 4.

---

### Task 1: The worker's queue, feedback, check jobs and timer

**Files:**
- Modify: `tools/ai-worker.js` (split `writing()` into `checkWriting()` + reply; add jobs, `runQueue`, `scheduled`, status fields)
- Test: `tests/ai-queue.spec.js` (create — runs the worker module in Node; no browser)

**Interfaces:**
- Produces (named exports + default):
  - `aiBand(scores, words, minWords) → number`
  - `checkWriting(q, env) → Promise<{ result } | { error: string, status: number }>` — `result` = today's shape `{ scores, mistakes, better, tips }` plus `words` (count of `text.trim().split(/\s+/)`) and `band` (`aiBand`)
  - `runQueue(env, max = 5) → Promise<{ checked: number, failed: number, stopped: boolean }>`
  - `default.fetch(request, env)`; `default.scheduled(event, env, ctx)` → `ctx.waitUntil(runQueue(env))`
- HTTP jobs (POST JSON): `queue {id, text, topic, instruction, minWords, maxWords, words}` → `{queued:true}` | `{done:true}`; `feedback {ids}` (≤ 60) → `{ states: { <id>: {state:'done', result} | {state:'waiting', tries, lastError} | {state:'unknown'} } }`; `check {…as queue}` → `{result}` | `{error}`.
- KV: `q:<id>` value = the queue JSON + `{ at: ISO, tries: n, lastError: '' }`, put with `metadata: { at, tries }`; `f:<id>` value = result JSON + `checkedAt`. No LOOM_KV → `{ error: 'The helper has no LOOM_KV storage yet' }`, 500.
- `/status` → `{ running, version: '2026-11-12q', keySaved, kv, waiting, jobs: ['chat','writing','queue','feedback','check'] }` (`waiting` from one `list({prefix:'q:'})`, only when kv).

- [ ] **Step 1: Write the failing tests** in `tests/ai-queue.spec.js` with a stand-in KV (`Map` + metadata; `get(k,'json')`, `put(k,v,{metadata})`, `delete`, `list({prefix,limit,cursor})` → `{keys:[{name, metadata}], list_complete:true}`) and a stubbed `globalThis.fetch` for Gemini (returns `{candidates:[{content:{parts:[{text: JSON.stringify(AI)}]}}]}` or a chosen status). Import with `await import(require('url').pathToFileURL(path).href)`. Tests:
  - `queue saves a waiting writing; a checked one answers done; bad ids, long texts and a missing KV are refused` — `q:sk_ABC123_10001_1` has `metadata.tries === 0`; after `f:` exists → `{done:true}`; id `../x` → 400; 6 001 chars → 400; `env` without `LOOM_KV` → 500 with the exact error text.
  - `the timer checks the 5 oldest of 7, saves feedback with words and band, removes them from the list; the next run checks the rest` — first run `{checked:5}`; `f:` for the 5 smallest `at`; result `band === aiBand(AI.scores, words, minWords)`; second run `{checked:2}`; no `q:` left.
  - `a failed check keeps the writing (tries + 1, the reason); Google's limit (429) stops the run` — 503 → `q:` kept, `tries:1`, `lastError` non-empty; 429 on the first of 3 → `{checked:0, failed:1, stopped:true}`, the other 2 untouched (`tries:0`).
  - `feedback tells done / waiting / unknown; check checks one at once` — states for three ids; `check` → `{result}` and `f:` saved, `q:` deleted.
  - `aiBand: −0.5 only when too short, kept to 1–9` — `aiBand({grammar:3,vocabulary:2,structure:2,task:2},90,80) === 9`, `(…,70,80) === 8.5`, `({grammar:0,vocabulary:0,structure:0,task:0},10,80) === 1`.
- [ ] **Step 2: Run** `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test tests/ai-queue.spec.js` → FAIL (no exports).
- [ ] **Step 3: Implement** in `tools/ai-worker.js`. `runQueue`: one `list({prefix:'q:', limit: 1000})`, sort keys by `metadata.at`, take `max`, check one after another; on `status === 429` stop. `fetch` routes `queue`/`feedback`/`check`/`writing`/`chat` (default `chat`); `tooMany` limits per job as in Global Constraints. Bump `VERSION`.
- [ ] **Step 4: Run** the test file → PASS.
- [ ] **Step 5: Commit** `git add tools/ai-worker.js tests/ai-queue.spec.js && git commit -m "AI helper: a waiting list for writings, checked 5 at a time by a timer"` (with the attribution lines).

### Task 2: The student page sends the writing to the waiting list, and the free check is gone

**Files:**
- Modify: `js/skill-player.js` (`submitWriting`, `doneSummary`; delete `LT_URL`, `skCheckGrammar`, `checkedTextHtml`, `grammarHtml`, `betterHtml`, `wireCheckAgain`, `skAiCheckWriting`, `aiScoreHtml`, `aiFeedbackHtml`, `skBetterWords` and the `SK_BETTER_SKIP` table if nothing else uses them)
- Modify: `js/skill-bands.js` (delete `skBasicGrammar`, `skMergeMatches` and their tables; delete `skWritingBand` only if no caller is left — `skWritingAiBand`, `skCountsAsMistake` stay)
- Modify: `css/style.css` only for the new `.sk-sent-card`; then `node tools/make-skill-dark.js`
- Test: rewrite `tests/writing-journey.spec.js` student tests; delete the LanguageTool tests in `tests/skills.spec.js` (`writing: counter, check, better words, band`, `…45-word text gives the band…`, `writing: grammar checker down`), `tests/course-fairness.spec.js` (`writing rules: …` if `skWritingBand` is gone) and `tests/course-order.spec.js` (`writing: Loom's own rules…`)

**Interfaces:**
- Produces: `skQueueWriting(payload, W) → Promise<boolean>` (POST `{job:'queue', id: payload.__id, text, topic: W.topic, instruction: W.instruction, minWords, maxWords, words: W.words.map(w => w.w)}` to `skAiUrl()`, 15 s timeout, true on `queued` or `done`).
- The saved `Writing course` result: as now but **without** `band`, `mistakes`, `mistakeList`, `grammarChecked`, `ai`, `aiChecked`, `aiError`; **with** `asked` (`skAskedWords`) and `aiQueued` (boolean). Its `__id` is `skResultId(payload)` (unchanged).

- [ ] **Step 1: Write the failing tests** (`tests/writing-journey.spec.js`):
  - `student: Submit sends the writing to the AI's waiting list and shows only "sent"` — route `https://loom-ai.test/**` capturing bodies and a route counting `**/api.languagetool.org/**` calls; after Submit: `.sk-sent-card` has the exact copy; `.sk-band`, `.sk-ai-mistakes`, `#skGrammar` count 0; the queue body `toMatchObject({ job:'queue', id: rec.__id, topic:'My Daily Routine', minWords:80, maxWords:100 })`; the record has no `band`, `aiQueued: true`, `asked.missing: []`; LanguageTool calls `0`.
  - `student: the helper down → the writing is still sent (aiQueued false)` — helper route 502 → `.sk-send` "Saved ✅", record `aiQueued: false`.
  - `"already done" for a writing shows the words, no band` — seed `ta_skill_done` / a record → `.sk-done-score` has `46 words` and not `band`.
- [ ] **Step 2: Run** them → FAIL.
- [ ] **Step 3: Implement** `submitWriting` (save, `skQueueWriting`, the sent card + send status), `doneSummary` (writing: words only), the deletions above; `npm run stamp`.
- [ ] **Step 4: Run** `tests/writing-journey.spec.js tests/skills.spec.js tests/course-fairness.spec.js tests/course-order.spec.js` → PASS (delete/adjust only the tests listed in Files).
- [ ] **Step 5: Commit** `"Student page: writings go to the AI's waiting list; the free check is removed"`.

### Task 3: Loom keeps the AI feedback, never leaves a writing unchecked, and shows ⏳

**Files:**
- Modify: `js/common.js` (`skAiFor`, `skWritingBandFor`, new `skWritingPending`, `taWritingAiSync`, `skCheckWritingNow` replacing `skCheckWritingWithAi`, `skWritingViewHtml`)
- Modify: `js/firebase.js` (after results change, call `window.taWritingAiSyncSoon && window.taWritingAiSyncSoon()` where `taCompletionsChanged` is called)
- Modify: `js/pages/course.js` (`skTableRows` keeps a waiting writing as `{ band: null, pending: true, raw }`; `skTableHtml` shows `⏳` in that cell; averages/Overall skip `null`)
- Test: `tests/writing-queue.spec.js` (create); update `tests/writing-journey.spec.js` teacher test and `tests/skills.spec.js` `writing results: …` / `a fake writing result…` where they relied on `skCheckWritingWithAi` or the page's band

**Interfaces:**
- Consumes: Task 1 jobs `feedback`, `queue`, `check` at `taAiUrl()`.
- Produces:
  - `skAiFor(r) → result|null` — `r.ai` (old) → `ta_skills_ai[r.__id]` → `ta_skills_ai[skMarkKey(r)]` (old key).
  - `skWritingBandFor(r) → number|null` — mark → `skWritingAiBand(ai.scores, words, minWords)` → `skClampWritingBand(r.band)` (old) → `null`.
  - `skWritingPending(r) → boolean` — a `Writing course` result with text, no mark, no AI feedback, no old band.
  - `taWritingAiSync() → Promise<{ done: number, queued: number }>` — course writings with `__id` + text and no `skAiFor`, each asked at most once per 10 min (in-memory); `feedback` in batches of 60; `done` → `ta_skills_ai[__id] = result`; `unknown` → `queue` (topic/instruction from `TA_SKILLS` by `r.step` when loaded, else `r.title`); after any change `taCourseResultsChanged()`. `taWritingAiSyncSoon()` = debounced 5 s.
  - `skCheckWritingNow(btn)` — `check` job; success → `ta_skills_ai[__id]`, redraw the window; failure → toast with the reason.

- [ ] **Step 1: Write the failing tests** (`tests/writing-queue.spec.js`, stand-in helper at `https://loom-ai.test/` via `ta_ai_url`):
  - `Loom asks the helper about unchecked writings: checked ones get their band, unknown ones go on the waiting list` — 2 writings (`w1` done, `w2` unknown, ids `sk_WRT555_10001_1`, `sk_WRT555_10002_2`); after load: `ta_skills_ai['sk_WRT555_10001_1'].scores` set; a `queue` body with `id: 'sk_WRT555_10002_2'`; the step's table shows `w1`'s band and `⏳` for `w2`.
  - `an old writing keeps its old band until the AI's arrives` — record with `band: 5`, no ai; feedback `waiting` → cell `5`; then feedback `done` (band 7.5) after `taWritingAiSync()` → `7.5`.
  - `the teacher's mark wins over ⏳ and over the AI` — `ta_skills_marks` set for `w2` → cell shows the mark, not ⏳.
  - `the writing window: waiting → "⏳ Waiting for the AI check" with tries and reason; Check now → the AI's feedback` — `.sk-wv-wait` text; click `🤖 Check now` → `.sk-wv-parts` contains `Grammar 2.5/3`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the Interfaces above; `npm run stamp`.
- [ ] **Step 4: Run** `tests/writing-queue.spec.js tests/writing-journey.spec.js tests/skills.spec.js tests/course-fairness.spec.js tests/course-order.spec.js` → PASS.
- [ ] **Step 5: Commit** `"Loom: AI feedback by writing, a safety net that queues unchecked writings, ⏳ while waiting"`.

### Task 4: Share results as a link

**Files:**
- Modify: `js/firebase.js` (new `window.taPublishShare(token, data) → Promise<boolean>`: delete then `setDoc(results/share-<token>, { v:1, code:'TAUSER', builtAt:'', type:'TA_SYNC:SHARE', title: token, name:'', data: JSON.stringify(data), score: rows, warnings:0, timeSeconds:0, timeDisplay:'00:00', date })`)
- Modify: `js/pages/course.js` (button `🔗 Share results link` next to `⬇️ Download picture` → `skShareResults()`; `skShareData(step, g) → object`)
- Modify: `js/sync.js`, `js/pages/settings.js` (add `'ta_skills_shares'` to the synced and backup key lists)
- Create: `results-link.html`, `js/results-link.js` (loads `css/style.css`, `css/skill-dark.css`, `js/skill-bands.js` with the shared stamp; body `id="skBody" class="sk-body sk-studio"`)
- Modify: `tools/bump-version.js` only if it doesn't already stamp every `*.html`
- Test: `tests/results-link.spec.js` (create)

**Interfaces:**
- Consumes: Task 3 `skWritingBandFor`, `skAiFor`, `skTeacherMark`; Task 1 `feedback` job.
- Produces: `skShareData(step, g)` → `{ group, step, stepNo, theme, sharedAt, rows: [{ name, listening: {band, raw}|null, reading: {band, raw}|null, writing: { id, raw, text, words, minWords, maxWords, asked, mark|null, band|null }|null }] }` (places, Overall and CEFR are worked out on the page with `skOverall`/`skCefr` so a late band moves them).
- `results-link.js`: reads `…/documents/results/share-<token>?key=…` (REST, the same base and key as `play.html`); writing feedback via POST `feedback` to `localStorage.ta_ai_url || 'https://loom-ai.toxiraxii010.workers.dev'`; polls every `window.__rlPollMs || 60000` ms while any writing is waiting.

- [ ] **Step 1: Write the failing tests** (`tests/results-link.spec.js`):
  - `Share results link puts the step's table online and copies a link that stays the same` — on the step page click `🔗 Share results link` → clipboard `…/results-link.html?r=<16 hex>`; the `share-<token>` record's `data` rows include `Alice Test` with `writing.id`; pressing again copies the same link and the record is rewritten (one record).
  - `the link page: the table, ⏳ for a waiting writing, then its band; tapping a band shows the feedback` — route the REST record and the helper (`waiting` then `done`, `__rlPollMs = 300`): `⏳ Checking…` then `7.5`; tap → modal has `Grammar 2.5/3`, the mistake `I go to school at eight.`, `excellent`, 3 tips, asked words; a mistake whose `wrong` isn't in the text is listed, not underlined.
  - `a teacher's mark shows on the link even while the AI is still waiting` — row `writing.mark: 6` → `6`, no ⏳.
  - `a missing link and no internet show plain messages` — 404 → exact not-found copy; aborted → exact offline copy.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**; `npm run stamp`.
- [ ] **Step 4: Run** `tests/results-link.spec.js tests/housekeeping.spec.js tests/skills.spec.js` → PASS.
- [ ] **Step 5: Commit** `"Results as a link: each writing band opens its AI feedback"`.

### Task 5: Notes, risks and the whole suite

**Files:**
- Modify: `CLAUDE.md` — a "Writings checked later (2026-11-12)" bullet (queue, timer, safety net, link, `ta_skills_shares`, Cloudflare setup, `/status` fields); mark the free check / `skBasicGrammar` / Submit-time AI notes as replaced; risk 21 (LanguageTool) replaced by "the AI helper down or Google's daily limit → writings wait, links show ⏳"; KV free-plan limits.
- Modify: `docs/superpowers/specs/2026-11-12-writing-ai-queue-design.md` only if the build changed a decision.

- [ ] **Step 1: Run** the full suite `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test` → all pass (no stray `http.server` running).
- [ ] **Step 2: Commit and push** `"Notes for the writing queue and results link"`; push to `claude/eager-johnson-4rf131`.
- [ ] **Step 3: Send the teacher** the new `tools/ai-worker.js` and the Cloudflare steps (KV `loom-writings` → binding `LOOM_KV`; Cron `*/5 * * * *`; paste + Deploy; `/status` shows `2026-11-12q`, `kv: true`); ask about an AI-robot question for "Share results link"; wait for "merge it".
