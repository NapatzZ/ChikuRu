# ChikuRu 🎯

A browser arcade shooter built as the **term project for ENG COMMU**. The
repository doubles as a *simulation of professional collaboration*: work is
broken into weekly **sprints**, tasks are handed out as **GitHub Issues**, and
every change lands through a reviewed **Pull Request**.

> Gameplay in one line: cute blob enemies rush your character from the top of
> the screen — **shoot them for points**, but if one reaches you it costs a
> **heart**. Lose all three hearts and it's game over.

## Status

🚧 Early development — see [`docs/SPRINT_PLAN.md`](docs/SPRINT_PLAN.md) for the
roadmap and [`docs/PROJECT_CHARTER.md`](docs/PROJECT_CHARTER.md) for scope,
roles, and communication norms.

## Quick start

The game is plain HTML + ES modules, so it needs to be served over HTTP:

```bash
# any one of these
npx serve .
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Repository layout

| Path | Purpose |
| --- | --- |
| `src/` | Game source (ES modules) |
| `assets/` | Sprites and audio (placeholder art only — see `assets/CREDITS.md`) |
| `styles/` | Page and HUD styling |
| `docs/` | Charter, sprint plans, meeting notes, retrospectives |
| `.github/` | Issue / PR templates and CI workflow |

## Assets & licensing

No official *Chiikawa* artwork ships in this repo. Everything under
`assets/sprites/` is original placeholder art. See
[`assets/CREDITS.md`](assets/CREDITS.md) for how to drop in your own images
locally.
