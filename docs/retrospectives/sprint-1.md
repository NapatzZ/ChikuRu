# Retrospective — Sprint 1 (Core loop)

**Sprint goal:** canvas + fixed-timestep loop + player that moves and shoots.
**Met.**

## Keep

- Deciding up front that `game.js` stays a thin orchestrator. Two PRs in and it
  is still readable.
- `?debug` overlay from day one — made "is the timestep actually fixed?"
  answerable instead of a guess.

## Drop

- Branch names without a type prefix (had one `player-stuff` branch early).
  Standardised on `feat/…`, `fix/…`, `docs/…`.

## Try

- Put constants in `config.js` *as they are written*, not in a cleanup pass.
  We already had two magic numbers sneak into `player.js`.

## Metrics

| | Planned | Done |
| --- | --- | --- |
| Issues | 4 | 4 |
| PRs merged | 2 | 2 (#20, #21) |
