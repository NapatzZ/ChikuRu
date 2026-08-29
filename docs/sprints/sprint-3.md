# Sprint 3 — Content & feel (Aug 17–22)

**Goal:** more than one enemy, a difficulty curve so a run has an arc, and
enough feedback ("juice") + sound that hits land well.

## Tasks

| Issue | Task | PR | Status |
| --- | --- | --- | --- |
| #10 | Enemy archetypes (hachiware, usagi, rakko) | #25 | ✅ |
| #11 | Wave director + difficulty curve | #26 | ✅ |
| #12 | Particles + screen shake + hit-stop | #27 | ✅ |
| #13 | Procedural audio + mute | #28 | ✅ |
| #14 | Asset loader + sprite fallback | #28 | ✅ |

## Standup log

- **Aug 17** — Three new archetypes as pure config: `hachiware` (weave),
  `usagi` (dasher), `rakko` (drift, 3 hp, hp pips). Behaviours already existed
  from #5, so this was a one-file diff plus tuning.
- **Aug 18** — Interim weighted-random spawn mix `[6,4,3,1]` so we can playtest
  all four before the curve lands.
- **Aug 19** — `waves.js` director: wave every 20 s, interval `*= 0.86`/wave
  (floor 0.38 s), enemy speed `+7%`/wave (cap x2.2), type weights lerp
  `[8,3,1,0] → [3,5,4,3]` over 8 waves. `game.js` reads `speedMul`/`wave`;
  spawner reads `interval`/`pickType`. Big `WAVE N` banner on change.
- **Aug 20** — `entities/particle.js` (pooled burst) + `systems/effects.js`
  (shake + hit-stop). Kills spray the enemy's colour; player hits do a pink
  burst, ~14 px shake, and 80 ms of frozen sim. `util/env.js` reads
  `prefers-reduced-motion` once and both effects no-op when it's set.

## Reference estimate (from Sprint 2 retro)

"M" = ~half a day for one person. `#11` and `#12` are M; `#10` was S; `#13`/`#14`
together are M.

- **Aug 21** — `audio.js` (WebAudio synth, one oscillator + envelope per cue,
  master gain, mute persisted to `localStorage`) and `assetLoader.js` (tries
  `.png` then the committed `.svg`, else `null` → procedural draw). Five
  original placeholder SVGs shipped. `M` toggles mute.
- **Aug 22** — Review fixes + retro. `test/smoke.mjs` added (runs the real
  loop for 30 s under a DOM stub); wired into `npm test` and CI.

## Demo checkpoint ✅

Difficulty visibly ramps: spawn rate climbs, enemies speed up, the mix shifts
toward tougher types. Kills throw particles, hits shake the screen, and every
event has a distinct sound. Placeholder sprites render; dropping PNGs into
`assets/sprites/` swaps them with no code change.
