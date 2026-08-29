# Decision records

Lightweight ADRs for choices bigger than a single `config.js` number. One entry
per decision: context, the call, and what we traded away. Newest first. This
was a Sprint 3 retro "try" item — kept it short on purpose.

---

## ADR-0005 — CI is a required status check on `main`

- **Date:** 2026-08-29 (post `v1.0.0`)
- **Status:** accepted
- **Context:** Sprints 1–4 merged PRs on human review alone. The CI **lint**
  job had a config bug (`URLSearchParams` missing from ESLint globals) and went
  unnoticed until after the release because no check was required.
- **Decision:** enable branch protection on `main` requiring the `Lint` and
  `Static page check` jobs to pass, with "branch must be up to date". No
  required human reviewers (solo-capable repo); reviews stay a team norm.
- **Consequence:** red CI now blocks merge. Admins can still override in an
  emergency (`enforce_admins` is off).

## ADR-0004 — Ship only original placeholder sprites; no Chiikawa artwork

- **Date:** 2026-08-21
- **Status:** accepted
- **Context:** the game's theme references *Chiikawa* (Nagano IP). A public
  repo can't redistribute that art.
- **Decision:** ship five original SVG blobs. The asset loader tries
  `assets/sprites/<name>.png` first so anyone can drop in their own images
  locally; `.png` is gitignored and CI rejects `official`/`nagano` filenames.
- **Consequence:** the default build looks generic. Documented in
  `assets/CREDITS.md`.

## ADR-0003 — Synthesise all audio at runtime

- **Date:** 2026-08-21
- **Status:** accepted
- **Context:** we wanted sound without adding binary assets or a licensing
  question.
- **Decision:** one WebAudio oscillator + gain envelope per cue in `audio.js`.
- **Consequence:** no audio files to manage; cues are simple by nature, which
  suits the arcade tone. `AudioContext` must be resumed on a user gesture.

## ADR-0002 — Systems communicate over an event bus

- **Date:** 2026-08-12
- **Status:** accepted
- **Context:** `collision.js` needed to affect score, HUD, particles, and
  audio. Direct references would make it depend on all of them.
- **Decision:** a tiny synchronous bus (`util/events.js`). Collision emits
  `enemyKilled` / `enemyHit` / `playerHit`; other systems subscribe.
- **Consequence:** adding a listener (scoreboard, HUD popups, sfx, combo) never
  touches collision. Ordering matters in one place — the scoreboard subscribes
  before the combo system so a kill is scored at the pre-kill multiplier.

## ADR-0001 — No framework, no bundler

- **Date:** 2026-08-01
- **Status:** accepted
- **Context:** the course grades communication, not build tooling. The team's
  JS experience varies.
- **Decision:** plain ES modules served statically. `game.js` stays a thin
  orchestrator; behaviour lives in `entities/` and `systems/`.
- **Consequence:** zero install to run the game; `npm` is dev-only (ESLint +
  the smoke test). No tree-shaking or TypeScript.
