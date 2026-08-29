# Sprint 4 — Polish & release (Aug 24–28)

**Goal:** a front door, a pause, a combo system, a saved best score, fixes from
the playtest, and a repo that's ready to demo and grade.

## Tasks

| Issue | Task | PR | Status |
| --- | --- | --- | --- |
| #15 | Menu / pause / game-over + state machine | #29 | ✅ |
| #16 | Combo multiplier x1–x5 | #30 | ✅ |
| #17 | High-score persistence | #30 | ✅ |
| #18 | Playtest round 1 fixes | #34 | ✅ |
| #19 | Release docs + tag | #35 | ✅ |

Playtest bugs filed and fixed in PR #34: #31 (corner shots), #32 (early enemy
speed), #33 (touch controls).

## Standup log

- **Aug 24** — `ui/menu.js` + `ui/screens.js`; `game.js` now has real states
  (`menu → playing ⇄ paused`, `playing → gameover → playing`). `P` pauses,
  window blur pauses, Enter starts/restarts. World keeps rendering behind every
  overlay. Smoke test updated to leave the title screen.
- **Aug 25** — `storage.js` (one JSON namespace, guarded) + `systems/combo.js`
  (kills raise x1→x5, full reset after 2.5 s or on a hit). Scoreboard scores
  each kill at the pre-kill multiplier. Best score persists; `audio.js` mute
  moved onto the same wrapper. Smoke test now checks combo + persistence.
- **Aug 26** — Playtest fixes (#34): aim defaults up until the mouse moves;
  window-drag tracking; touch controls (drag to move, hold to shoot up);
  enemy-speed warm-up to 0.78x for 12 s; focusable canvas + focus ring +
  aria-label. `docs/BALANCE.md` added.

## Playtest (Aug 25, 5 testers) — raw notes → issues

- "Bunnies are unfair in the first 10 seconds" → balance, part of #18
- Two testers on laptops wanted to try on a phone → touch controls, #18
- One got a stuck bullet in the top-left after resizing → #18
- "I didn't know I could pause" → covered by the new menu controls list (#29)
- Nobody found the mute until told → acceptable; it's on the menu now

- **Aug 27** — Release docs: README rewrite, `CHANGELOG.md` (1.0.0),
  `docs/DEMO_SCRIPT.md`, sprint 4 retro, placeholder screenshot. Version
  bumped to 1.0.0.
- **Aug 28** — Review + merge #35; tag `v1.0.0`. Demo rehearsed.

## Demo checkpoint ✅

Title screen → play → pause/resume → die → see best score → restart, all
without a reload. Combo multiplier visibly rewards streaks. `v1.0.0` tagged;
CI green on `main`.
