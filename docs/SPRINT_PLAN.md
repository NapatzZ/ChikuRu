# Sprint Plan — ChikuRu

Four one-week sprints after a setup week. Each sprint has a **goal**, a set of
**tasks** (GitHub Issues under a milestone), and a **review/demo** at the end.

| Sprint | Dates (2026) | Goal | Demo checkpoint |
| --- | --- | --- | --- |
| Setup | Jul 27 – Aug 1 | Repo, charter, CI, empty page shell | Repo builds, `index.html` loads |
| Sprint 1 | Aug 3 – Aug 8 | **Core loop**: canvas, fixed timestep, player moves and shoots | Player ship moves and fires bullets |
| Sprint 2 | Aug 10 – Aug 15 | **Combat**: enemies spawn, collisions, score, hearts, game over | Full lose condition works end to end |
| Sprint 3 | Aug 17 – Aug 22 | **Content & feel**: enemy types, waves, particles, sound, assets | Difficulty ramps; hits feel good |
| Sprint 4 | Aug 24 – Aug 28 | **Polish & release**: menus, pause, combo, high score, playtest fixes | v1.0.0 tagged, README demo-ready |

## Backlog (candidate tasks)

Prioritised by the Product Owner at the start of each sprint. Items not pulled
into a sprint stay here.

### Sprint 1 — Core loop
- [ ] Canvas bootstrap + responsive resize (`#1`)
- [ ] Fixed-timestep game loop with interpolation (`#2`)
- [ ] Player entity: clamp-to-arena movement (`#3`)
- [ ] Shooting: bullet pool, fire rate, aim toward cursor (`#4`)

### Sprint 2 — Combat
- [ ] Basic enemy (`chiikawa`) + spawner (`#5`)
- [ ] Collision system: bullet↔enemy, enemy↔player (`#6`)
- [ ] Scoreboard + per-enemy points (`#7`)
- [ ] Hearts / HP + game-over state (`#8`)
- [ ] HUD: score, hearts, wave readout (`#9`)

### Sprint 3 — Content & feel
- [ ] Enemy archetypes: `hachiware`, `usagi`, `rakko` (`#10`)
- [ ] Wave director: spawn weight + difficulty curve (`#11`)
- [ ] Particles + screen shake + hit-stop (`#12`)
- [ ] Procedural audio (WebAudio) + mute (`#13`)
- [ ] Asset loader with procedural sprite fallback (`#14`)

### Sprint 4 — Polish & release
- [ ] Menu / pause / game-over screens + state machine (`#15`)
- [ ] Combo multiplier x1–x5 with decay (`#16`)
- [ ] High-score persistence (localStorage) (`#17`)
- [ ] Playtest round 1 fixes (balance, touch, a11y) (`#18`)
- [ ] Release docs: README, CHANGELOG, retro, demo script (`#19`)

## Ceremonies

- **Sprint planning** (Mon): PO posts the sprint issue with the pulled tasks.
- **Daily standup** (async): reply on the sprint issue.
- **Review/Demo** (Fri): screen-record the checkpoint, link it on the issue.
- **Retro** (Fri): `docs/retrospectives/sprint-N.md` — keep / drop / try.
