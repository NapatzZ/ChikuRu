# Retrospective — Sprint 2 (Combat)

**Sprint goal:** close the core loop (enemies, collisions, score, hearts, game
over). **Met.**

## Keep

- The event bus. Adding the scoreboard and HUD needed zero changes to
  `collision.js`. This is paying off already.
- Small PRs mapped to issues. Reviews stayed under 15 minutes each.
- Writing the "How to test" section first — it caught two missing acceptance
  criteria before code review.

## Drop

- Estimating in S/M/L without a reference. "M" meant 1 hour for one person and
  half a day for another. Next sprint: agree on one reference task.
- Pasting long stack traces into PR comments. Link a gist or attach a file.

## Try

- A 10-minute "PR desk-check" by the author before requesting review (run
  lint + play one full run). PR #23 shipped with the placeholder HUD text
  still on screen behind the real overlay for one commit.
- Rotate the reviewer role by a coin flip at standup so it's not always the
  same person.

## Metrics

| | Planned | Done |
| --- | --- | --- |
| Issues | 5 | 5 |
| PRs merged | 3 | 3 (#22, #23, #24) |
| Bugs found in playtest | – | 1 (fixed in #23 review) |
