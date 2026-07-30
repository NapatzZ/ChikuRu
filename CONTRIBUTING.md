# Contributing

This repo is a class project, but it follows a real workflow.

## Workflow

1. Pick an issue from the current sprint milestone and assign yourself.
2. Branch off `main`: `git switch -c feat/<slug>`.
3. Commit in small steps using [Conventional Commits](https://www.conventionalcommits.org/).
4. Open a PR early as a **draft**; fill in the template; link `Closes #N`.
5. Request review. Every PR needs one approving review from a non-author.
6. Address feedback with follow-up commits (don't force-push during review).
7. Squash or rebase-merge once approved and CI is green.

## Commit message format

```
<type>(<optional scope>): <imperative summary>

<optional body: what & why>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`.

## Code style

- ES modules, no framework, no bundler.
- 2-space indent, semicolons, single quotes (enforced by ESLint).
- Gameplay constants go in `src/config.js`.
- `src/game.js` orchestrates; behaviour lives in `src/entities/` and `src/systems/`.

## Running locally

```bash
npm install       # dev tooling only (eslint)
npm run lint
npm start          # static server on :8080
```
