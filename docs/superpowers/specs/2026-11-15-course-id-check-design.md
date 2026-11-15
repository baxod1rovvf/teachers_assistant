# Course links: ID only + "Bu sizmi?" check — short design (2026-11-15)

## Why
Students start course exercises with a wrong ID or someone else's (Muhlisa typed 1415, 2026-11-14): their answers count for
nobody, or for the wrong student. The teacher (2026-11-15): after the ID, show "Bu sizmi: full name — ID, group name", Ha / Yo'q
(boshqa ID kiritish). The teacher chose **ID only** (no name box) and approach **C** (no name box at all, even on old links —
the teacher will press Copy link again on every old link after the update).

## Approaches (picked: C)
- A. Read the class list when the page opens; ID-only card when there is a list, name + ID card otherwise.
- B. Always ID first; ask the name only when there is no list.
- **C. Always ID only, no name box at all (teacher's choice).** Slow internet: the student waits, with a spinning circle.

## What gets built
- **Start card**: one box, "Your ID" (remembered on the phone as before), and Start. No name box.
- **Start** → a spinning circle while the page reads the group's list (`class-<code>`) — as long as it takes, up to a time limit.
  - ID on the list → **"Bu sizmi?" screen** (Uzbek, the teacher's words): "Bu sizmi:" / **<name as on the Students page> — <ID>** /
    "Guruh:" / **<group name>** / buttons **Ha** and **Yo'q (boshqa ID kiritish)**.
    - Ha → the checks that exist today (kept answers sent first, "already done", the part before) → the exercise.
    - Yo'q → back to the start card with the ID box empty (and the remembered ID forgotten).
  - ID not on the list → "This ID is not on your teacher's list. Check your ID and try again." (as today).
  - No list for this link (copied before 2026-11-09 and not copied again) → let in without the screen; the result carries the ID
    and no name (the teacher's page matches results by ID). The teacher will copy old links again.
  - The list can't be read (no internet / too slow, after ~20 s) → "📶 We couldn't check your ID — check the internet and press
    Start again." (never let in on a guess — like the "already done" check).
- **Group name**: Copy link also puts the group's name on the list (`group` on the `class-<code>` record). A list copied before this
  has no group name → the "Guruh:" lines are left out until the teacher copies that link again.
- The result's `name` = the name on the list (as now). "Not you?" on the "already done" screen stays.
- Unchanged: Speaking (no ID screen), ▶️ Try / preview (no start card), Create-page exercise files.

## Left to the builder
Exact spinner look (the page's own colours), the time limit's exact value, tests (stand-in database: list with/without group,
ID on/off the list, no list, slow/failed read, Yo'q, Ha → already done / part before / exercise).
