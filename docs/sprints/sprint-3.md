# Sprint 3 — Content & feel (Aug 17–22)

**Goal:** more than one enemy, a difficulty curve so a run has an arc, and
enough feedback ("juice") + sound that hits land well.

## Tasks

| Issue | Task | PR | Status |
| --- | --- | --- | --- |
| #10 | Enemy archetypes (hachiware, usagi, rakko) | #25 | ✅ |
| #11 | Wave director + difficulty curve | #26 | ⏳ |
| #12 | Particles + screen shake + hit-stop | #27 | ⏳ |
| #13 | Procedural audio + mute | #28 | ⏳ |
| #14 | Asset loader + sprite fallback | #28 | ⏳ |

## Standup log

- **Aug 17** — Three new archetypes as pure config: `hachiware` (weave),
  `usagi` (dasher), `rakko` (drift, 3 hp, hp pips). Behaviours already existed
  from #5, so this was a one-file diff plus tuning.
- **Aug 18** — Interim weighted-random spawn mix `[6,4,3,1]` so we can playtest
  all four before the curve lands.

## Reference estimate (from Sprint 2 retro)

"M" = ~half a day for one person. `#11` and `#12` are M; `#10` was S; `#13`/`#14`
together are M.

## Demo checkpoint (target)

Difficulty visibly ramps: spawn rate climbs, enemies speed up, the mix shifts
toward tougher types. Kills throw particles, hits shake the screen, and every
event has a distinct sound.
