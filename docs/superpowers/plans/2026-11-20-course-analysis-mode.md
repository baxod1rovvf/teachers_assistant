# Course analysis mode — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use `- [ ]`.

**Goal:** a finished Listening/Reading link shows the after-Submit page, locked, with "Bu mashqni allaqachon tugatgansiz".
**Architecture:** `skAlreadyDone` hands back the saved record; `showAlreadyDone` redraws the exercise from it with the marking
shared with `submit`. **Tech:** plain JS (`js/skill-player.js`), Playwright. **Spec:** `docs/superpowers/specs/2026-11-20-course-analysis-mode-design.md`

## Global Constraints
- Heading text exactly "Bu mashqni allaqachon tugatgansiz"; keep class `sk-done-card` and "You have already done this <skill>".
- Nothing written to the database in analysis mode; no `<audio>` element; inputs/options disabled; no `#skSubmit`.
- `npm run stamp` after the JS/CSS change.

## Review Focus
- Saved answers for questions that changed since → simple list, no crash (test in Task 1).
- Result with no `answers` → plain card as before (existing tests cover it).
- Kept-but-unsent answers → Send card on top, analysis below (test in Task 1).
- A wrong answer in a choice question shows the right option (`is-answer`) (test in Task 1).

### Task 1: analysis mode
**Files:** modify `js/skill-player.js` (`skAlreadyDone`, `showAlreadyDone`, `submit`, `showExercise`), `css/style.css` + `css/skill-air.css`
(small styles), create `tests/course-analysis.spec.js`.
**Interfaces:** `skAlreadyDone` → adds `doc`; `markQuestions(content, givenList) -> answers[{q,given,right}]` (fills and locks
`.sk-q` items, writes `.sk-fix`); `resultScreenHtml`-style helpers reused by submit and analysis.
- [ ] Tests: reading (choose wrong → `is-answer` shown, inputs disabled, Analyze highlights), listening (no `audio`, transcript on Analyze,
  no new doc written), changed questions → `.sk-old-answers` list, unsent → Send card + `.sk-q` present.
- [ ] Run → fail. Implement. Run the new spec + course-*.spec.js → pass. Full `npx playwright test` → pass. Stamp, commit.
