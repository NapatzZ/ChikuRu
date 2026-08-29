# Sprint 4 — Polish & release (Aug 24–28)

**Goal:** a front door, a pause, a combo system, a saved best score, fixes from
the playtest, and a repo that's ready to demo and grade.

## Tasks

| Issue | Task | PR | Status |
| --- | --- | --- | --- |
| #15 | Menu / pause / game-over + state machine | #29 | ✅ |
| #16 | Combo multiplier x1–x5 | #30 | ⏳ |
| #17 | High-score persistence | #30 | ⏳ |
| #18 | Playtest round 1 fixes | #31 | ⏳ |
| #19 | Release docs + tag | #32 | ⏳ |

## Standup log

- **Aug 24** — `ui/menu.js` + `ui/screens.js`; `game.js` now has real states
  (`menu → playing ⇄ paused`, `playing → gameover → playing`). `P` pauses,
  window blur pauses, Enter starts/restarts. World keeps rendering behind every
  overlay. Smoke test updated to leave the title screen.

## Playtest (Aug 25, 5 testers) — raw notes → issues

- "Bunnies are unfair in the first 10 seconds" → balance, part of #18
- Two testers on laptops wanted to try on a phone → touch controls, #18
- One got a stuck bullet in the top-left after resizing → #18
- "I didn't know I could pause" → covered by the new menu controls list (#29)
- Nobody found the mute until told → acceptable; it's on the menu now

## Demo checkpoint (target)

Title screen → play → pause/resume → die → see best score → restart, all
without a reload. Combo multiplier visibly rewards streaks. `v1.0.0` tagged.
