# Sprint 1 — Core loop (Aug 3–8)

**Goal:** a canvas that renders a fixed logical arena, driven by a
frame-rate-independent loop, with a player that moves and shoots.

## Tasks

| Issue | Task | PR | Status |
| --- | --- | --- | --- |
| #1 | Canvas bootstrap + responsive resize | #20 | ✅ |
| #2 | Fixed-timestep loop | #20 | ✅ |
| #3 | Player movement | #21 | ✅ |
| #4 | Shooting / bullet pool | #21 | ✅ |

## Standup log

- **Aug 3** — Set up `viewport.js` (DPI + letterbox) and `loop.js`
  (accumulator). Blocker: none.
- **Aug 4** — `Game` class wired to the loop; arena backdrop + `?debug`
  overlay showing fps and steps/frame. Next: player.
- **Aug 5** — `input.js` (keyboard + pointer) and `Player` with normalised
  diagonal movement, clamped to the arena.
- **Aug 6** — Bullet `Pool` + cursor-aimed shooting at a capped 8 shots/s.
- **Aug 7** — Playtest: 360 px/s felt twitchy, dropped to 340. Sprint goal
  met — demo recorded.

## Demo checkpoint

Player circle moves with WASD/arrows and fires bullets toward the mouse; frame
counter holds at 60 fps with 2 steps/frame on a 60 Hz display.

## Notes

- Kept `game.js` deliberately thin — it only owns state and calls into
  systems. This should keep merge conflicts down as more systems land.
