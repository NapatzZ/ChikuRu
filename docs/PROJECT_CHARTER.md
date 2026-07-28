# Project Charter — ChikuRu

**Course:** ENG COMMU (English for Communication)
**Deliverable:** A working web game + a repository that demonstrates
English-language collaboration inside a shared codebase.
**Duration:** 27 Jul 2026 – 28 Aug 2026 (4 sprints × 1 week + setup week)

## 1. Purpose

The team practises the written communication that happens in a real software
project: writing clear task descriptions, negotiating scope in pull requests,
giving and responding to review feedback, and reporting progress in standups
and retrospectives — all in English.

The *product* is a small arcade shooter. It is intentionally scoped so the
communication artefacts (issues, PR discussions, notes) are the hard part, not
the code.

## 2. Product vision

> For players who enjoy a 3–5 minute score-attack break, **ChikuRu** is a
> browser arcade game where waves of cute blob enemies charge your character.
> Unlike an idle clicker, it rewards precise aim and nerve: every enemy you let
> through costs a heart.

## 3. In scope

- Single HTML page, no backend, no build tooling beyond a static server.
- Keyboard + mouse controls, with a basic touch fallback.
- Score, combo multiplier, three hearts, escalating waves, local high score.
- Several enemy archetypes with distinct movement.
- Procedurally generated sound; original placeholder sprites.

## 4. Out of scope

- Online leaderboards / accounts / networking.
- Real *Chiikawa* artwork or audio in the repository.
- Mobile-first layout, native packaging, monetisation.

## 5. Roles

Roles rotate each sprint so everyone practises each kind of writing. The
*names below are placeholders* — fill in real teammates.

| Role | Responsibility | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 |
| --- | --- | --- | --- | --- | --- |
| Product Owner | Writes/prioritises issues, accepts work | A | B | C | D |
| Scrum Master | Runs standup, keeps notes, unblocks | B | C | D | A |
| Dev — Systems | Game loop, physics, spawning | C | D | A | B |
| Dev — Content/UI | Entities, HUD, screens, art hookup | D | A | B | C |
| QA / Reviewer | Playtests, files bugs, reviews PRs | rotates — every PR needs one non-author approval |

## 6. Communication norms

- **Language:** All issues, PRs, commit messages, and code comments in English.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`).
- **Branches:** `feat/<slug>`, `fix/<slug>`, `docs/<slug>` off `main`.
- **PRs:** Use the template. Link the issue with `Closes #N`. At least one
  approving review from someone who is not the author before merge.
- **Standup:** Async comment on the sprint issue — *yesterday / today /
  blockers*.
- **Definition of Done:** see [`DEFINITION_OF_DONE.md`](DEFINITION_OF_DONE.md).

## 7. Risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| Scope creep on "game feel" | High | Time-box juice work to Sprint 3; park extras in a backlog issue |
| Uneven contribution | Medium | Rotating roles; standup log on every sprint issue |
| Merge conflicts on `game.js` | Medium | Keep `game.js` a thin orchestrator; systems live in their own files |
| Asset licensing | Low | Ship only original placeholder art; document swap procedure |
