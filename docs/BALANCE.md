# Balance notes

Why the numbers in `src/config.js` are what they are. Update this in the same
PR that changes a value.

## Player
- `speed: 340` — 360 read as twitchy in the Sprint 1 playtest.
- `fireRate: 8` — fast enough to feel automatic, slow enough that the bullet
  pool never runs dry.
- `startHearts: 3`, `invulnSeconds: 1.2` — three clean mistakes; the i-frames
  are long enough to walk out of a cluster.

## Enemies
- `chiikawa` slow tracker is the teaching enemy — always present early.
- `usagi` dash is the spike; first burst is delayed 60% of its interval so it
  never dashes straight out of the spawn.
- `rakko` 3 hp / 300 pts — a deliberate "do I commit three shots?" choice.

## Wave curve (`WAVES`)
- `secondsPerWave: 20` — a 3–5 min run touches ~9–15 waves.
- `intervalFalloff: 0.86` per wave, floored at `SPAWN.minInterval 0.38`.
- `speedPerWave: 0.07`, capped `speedMax: 2.2`.
- `warmupSeconds: 12`, `warmupFactor: 0.78` — playtest round 1: new players died
  before learning the controls. Enemy speed starts at 0.78x and lerps to full
  by 12 s. Does **not** touch spawn rate.
- Weights lerp `[8,3,1,0] → [3,5,4,3]` over 8 waves.

## Combo (`COMBO`)
- Thresholds `[0,4,9,16,25]` kills → x1..x5.
- `decaySeconds: 2.5`, all-or-nothing reset. A step-down was considered and
  rejected as less exciting (Sprint 4 review, PR #30).

## Juice (`JUICE`)
- `shakeOnHit 14px / 0.35s`, `hitStopSeconds 0.08`. Both disabled under
  `prefers-reduced-motion`.
