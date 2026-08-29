# Demo script — 3 minutes

For the ENG COMMU class presentation. One person drives, one narrates. Practice
once so it fits in 3 minutes.

## 0:00 — Frame it (20 s)

> "ChikuRu is a small browser arcade game, but the point of the project was
> practising collaboration in English. We ran it as four one-week sprints. Every
> task was a GitHub Issue, every change was a Pull Request with a review."

Show the repo: Issues tab (milestones = sprints), then the Pull Requests tab
(all merged, each with a review thread).

## 0:20 — The workflow (40 s)

Open one PR, e.g. **#23 "collisions, scoring, hearts and game over"**.

- Point at the description: *What & why*, *How to test*, `Closes #6 #7 #8`.
- Scroll to the review comment: a teammate playtested, found an edge case,
  asked for a change; the author replied.
- "This is the English we practised — task briefs, review feedback, and
  written answers, not just code."

## 1:00 — Play it (80 s)

`npm start`, open the page.

1. Title screen → press Enter.
2. Move (WASD), aim + shoot (mouse). Kill a few — call out the floating `+100`.
3. Build a combo — "chain kills and the multiplier climbs to ×5; take a hit and
   it resets, so there's a risk/reward."
4. Let one enemy through — heart lost, screen shake.
5. Survive to **WAVE 2** — "spawns and speed ramp on a curve; the first 12
   seconds are eased so new players aren't overwhelmed — that came out of a
   playtest."
6. Die → game-over screen with score and best. Restart once.

## 2:20 — Under the hood (25 s)

Show `src/` in the editor.

> "No framework. `game.js` just wires things together; each system is its own
> module talking over an event bus. Sound is synthesised — no audio files. The
> sprites are original placeholders; there's no Chiikawa artwork in the repo
> for licensing reasons."

Show `npm test` going green.

## 2:45 — Close (15 s)

> "Four sprints, 19 planned tasks, ~15 merged PRs, one tagged release. The game
> works, but the deliverable we care about is the paper trail of how we talked
> to each other to get there."

## Fallback

If live play fails: `docs/screenshot.png` + walk the CHANGELOG.
