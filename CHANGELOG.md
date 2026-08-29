# Changelog

All notable changes to this project. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/); versions follow SemVer.

## [1.0.0] — 2026-08-28

First complete release. Playable start to finish with a title screen, pause,
score-attack loop, and a saved personal best.

### Added
- **Core loop** — DPI-aware letterboxed canvas, fixed-timestep simulation with
  render interpolation (`#1`, `#2`).
- **Player** — clamp-to-arena movement, i-frames, capped cursor-aimed shooting
  with a bullet pool (`#3`, `#4`).
- **Enemies** — four archetypes: `chiikawa` (homing), `hachiware` (weave),
  `usagi` (dasher), `rakko` (3 hp tank); timer-driven spawner (`#5`, `#10`).
- **Combat** — circle collision, event bus, scoreboard, three hearts, restart
  (`#6`, `#7`, `#8`).
- **HUD** — score, hearts, wave, floating score popups, hit flash (`#9`).
- **Wave director** — difficulty curve: faster spawns, faster enemies, a mix
  that shifts toward tougher types; `WAVE N` banner (`#11`).
- **Juice** — pooled particle bursts, camera shake, hit-stop; all disabled
  under `prefers-reduced-motion` (`#12`).
- **Audio** — WebAudio synth cues, `M` to mute (persisted); no audio files
  shipped (`#13`).
- **Assets** — sprite loader with procedural fallback; five original
  placeholder SVGs (`#14`).
- **Screens** — `menu / playing / paused / gameover` state machine; pause on
  `P` and on focus loss (`#15`).
- **Combo** — ×1–×5 multiplier that decays after 2.5 s or resets on a hit
  (`#16`).
- **Persistence** — namespaced `localStorage`; best score survives reloads
  (`#17`).
- **Touch controls** — drag to move, tap/hold to shoot (`#33`).
- **Accessibility** — focusable canvas, visible focus ring, `aria-label`.
- **Tooling** — ESLint config, headless smoke test, GitHub Actions CI.

### Changed
- Player speed 360 → 340 (playtest).
- Enemy speed eased to 0.78× for the first 12 s so new players survive the
  intro (`#32`).

### Fixed
- Bullets no longer fly to the arena origin if you shoot before moving the
  mouse (`#31`).
- Drags that leave the canvas keep updating aim/movement.

[1.0.0]: https://github.com/NapatzZ/ChikuRu/releases/tag/v1.0.0
