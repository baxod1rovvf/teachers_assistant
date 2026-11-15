# Course ID Check Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Course links ask only for the ID, then show "Bu sizmi?" (name, ID, group) with Ha / Yo'q before the exercise.

**Architecture:** The start card in `js/skill-player.js` (`showStart`) loses its name box; Start reads the class list through
`skCheckStudent` (now also returning `group`) behind a spinner, then a new `showConfirm` screen; Ha runs today's checks
(kept answers, `skAlreadyDone`, `skPrevDone`). `taPublishClassList` in `js/firebase.js` stores the group's name on `class-<code>`.

**Tech Stack:** plain JS, Firebase Firestore (stand-in in tests), Playwright.

**Spec:** `docs/superpowers/specs/2026-11-15-course-id-check-design.md`

## Global Constraints

- Screen text, exactly: "Bu sizmi:" · "<name> — <ID>" · "Guruh:" · "<group>" · buttons "Ha" and "Yo'q (boshqa ID kiritish)".
- No name box anywhere on the start card (approach C). The phone still remembers the last ID (`ta_skill_student` → `{ id }`).
- Can't read the list (offline / slow) → after ~20 s: "📶 We couldn't check your ID — check the internet and press Start again." Never let in.
- No list for the link → let in without the screen; `name` on the result is `''`.
- Speaking, preview (`&preview=1`) and Create-page exercise files unchanged. `npm run stamp`; `node tools/make-skill-dark.js` if student-page CSS changes.

## Review Focus

1. A remembered ID from another student on a shared phone → "Bu sizmi" shows the other name; Yo'q empties the box and forgets it.
2. A list copied before the update (no `group`) → screen without the "Guruh:" lines.
3. Ha on a student who already did it → "already done" (with "Not you?"), not the exercise.
4. Ha when the part before isn't done → the Uzbek "Oldingi …" warning on the start card.
5. Double-pressing Start / Ha → one check, one screen.

---

### Task 1: ID-only start card, "Bu sizmi?" screen, group name on the list

**Files:**
- Modify: `js/skill-player.js` (`showStart`, `skCheckStudent`, new `showConfirm`, `skNotMe`)
- Modify: `js/firebase.js` (`taPublishClassList(code, students, prev, group)`)
- Modify: `js/pages/course.js` (`skPutClassOnline` passes `g.name` as `group`, both calls)
- Modify: `css/style.css` (spinner + confirm card in the "SKILLS COURSE — STUDENT PAGE" rules), then `node tools/make-skill-dark.js`
- Test: `tests/course-id-check.spec.js` (new); update tests that fill `#studentNameInput` (course-unsent, course-fairness, course-order,
  course-done-check, skills, writing-journey, listening-rules, reading-journey…) to fill only `#skIdInput` and press Ha where a list exists.

**Interfaces:**
- `skCheckStudent(id) → { name, group, prev } | { refuse, field: 'id' } | { open: true } (no list) | { offline: true }` — no name argument;
  `offline` when the read fails or exceeds 20 s (`window.__skCheckTimeoutMs || 20000`).
- `showConfirm(level, content, who, id)` → the "Bu sizmi" card (`.sk-confirm`), buttons `#skYes` (Ha), `#skNo` (Yo'q).
- `taPublishClassList(code, students, prev, group)` → record gains `group: String(group).slice(0, 80)` when given.

- [ ] **Step 1: Write the failing tests** in `tests/course-id-check.spec.js` (class doc helper like course-unsent's, with `group: 'Apex'`):
  - `the start card asks only for the ID` — `#studentNameInput` count 0, `#skIdInput` visible.
  - `ID on the list → "Bu sizmi" with name, ID and group; Ha starts the exercise; the result carries the listed name` — `.sk-confirm`
    contains "Bu sizmi:", "Alice Test — 10001", "Guruh:", "Apex"; click Ha → `#skSubmit` visible; submit → record `{ name: 'Alice Test', studentId: '10001' }`.
  - `Yo'q → back to an empty ID box, the remembered ID forgotten` — `#skIdInput` value '' and `ta_skill_student` null.
  - `a list without a group → no "Guruh:" lines`.
  - `ID not on the list → "This ID is not on your teacher's list"`.
  - `no list → straight to the exercise, the result has the ID and no name`.
  - `the list can't be read → spinner, then "📶 We couldn't check your ID…", no exercise` (`__failReads`/route abort; `__skCheckTimeoutMs = 1500`).
  - `Ha when already done → "already done"`; `Ha when the part before isn't done → "Oldingi"`.
  - Firebase side: `Copy link puts the group's name on the list` — in a course-page test, `class-<code>` doc has `group: 'Target'`.
- [ ] **Step 2: Run** `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test tests/course-id-check.spec.js` — expect FAIL.
- [ ] **Step 3: Implement** the interfaces above; Start disables itself and shows the spinner (`.sk-spin` inside the button) until the
  check ends; `SK.name = who.name || ''`. Keep "Not you?" (`skNotMe`) on "already done".
- [ ] **Step 4: Update the other specs** that fill a name; run them all — expect PASS.
- [ ] **Step 5: Notes** — CLAUDE.md student-page bullet ("Start card (ID only, 2026-11-15) … Bu sizmi"); `npm run stamp`; full suite
  `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test` — all pass.
- [ ] **Step 6: Commit + push** on `claude/eager-johnson-4rf131`.
