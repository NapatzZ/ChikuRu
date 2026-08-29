# Sprint 2 — Combat (Aug 10–15)

**Goal:** enemies spawn and move, bullets and bodies collide, score goes up,
hearts go down, and the run ends at zero hearts.

## Tasks

| Issue | Task | PR | Status |
| --- | --- | --- | --- |
| #5 | Basic enemy (chiikawa) + spawner | #22 | ✅ |
| #6 | Collision system | #23 | ✅ |
| #7 | Scoreboard + points | #23 | ✅ |
| #8 | Hearts / HP + game over | #23 | ✅ |
| #9 | HUD | #24 | ⏳ |

## Standup log

- **Aug 10** — `enemy.js` with a behaviour table (only `homing`/chiikawa wired;
  `weave`/`dasher`/`drift` stubbed for Sprint 3). Pooled, off-bottom cleanup.
- **Aug 11** — `spawner.js` fires on a timer and asks a provider for interval +
  type, so the wave director can slot in later without touching it. Constant
  1.5 s / chiikawa for now.
- **Aug 12** — `events.js` bus + `collision.js`. Systems now communicate by
  event (`enemyKilled`, `enemyHit`, `playerHit`) instead of holding refs.
- **Aug 13** — `scoreboard.js` on the bus; heart loss + `gameover` state with
  Enter/click to restart. Core loop closes end to end. Combo left at x1.

## Demo checkpoint (target)

Chiikawa blobs drift in from the top and steer toward the player. Shooting them
removes them and adds score; touching the player costs a heart; three hits ends
the run with a restartable game-over overlay.

## Notes

- Kept `game.js` growth in check by pushing the spawn-rate/type decision behind
  callbacks. `updateEnemies` takes `speedMul` already so Sprint 3 only has to
  feed it a real number.
