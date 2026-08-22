# Retrospective — Sprint 3 (Content & feel)

**Sprint goal:** enemy variety, a difficulty curve, and enough juice + sound
that hits land. **Met.**

## Keep

- Behaviour table in `enemy.js`. Three archetypes cost one config block plus
  tuning — exactly the payoff we hoped for when we built it in Sprint 2.
- Pushing spawn decisions behind callbacks in Sprint 2 meant the wave director
  slotted in without touching `spawner.js` at all.
- `test/smoke.mjs`. It already caught a typo (`this.wave` vs `this._prevWave`)
  before review.

## Drop

- Doing audio and asset loading in one PR (#28). It was two unrelated things
  and the review thread got tangled. Next time, one concern per PR even if
  they're both "small".

## Try

- A shared `docs/BALANCE.md` note when we change a `config.js` number, so the
  "why 0.86?" context isn't only in a PR description.
- Record the demo GIF during the Friday session, not after — we almost missed
  the checkpoint recording again.

## Metrics

| | Planned | Done |
| --- | --- | --- |
| Issues | 5 | 5 |
| PRs merged | 4 | 4 (#25–#28) |
| Smoke test | – | added, green in CI |
