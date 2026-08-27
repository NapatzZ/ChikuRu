# Retrospective — Sprint 4 (Polish & release)

**Sprint goal:** menus, pause, combo, saved best, playtest fixes, and a
demo-ready repo. **Met.** `v1.0.0` tagged.

## Keep

- The state machine (#29) made everything after it easier — combo, screens, and
  the touch pass all plugged into clear states.
- Filing playtest notes as individual bug issues (#31–#33) and closing them
  from one PR (#34). The trail is obvious to a grader.
- `docs/BALANCE.md`. Reviews stopped asking "why this number?".
- Small pure draw functions for UI. Zero merge conflicts in `ui/` all sprint.

## Drop

- One more time: bundling two concerns in a PR (#30 = combo + persistence).
  They shared the storage layer so it was defensible, but the review thread
  still had two separate discussions in it.
- Backdating standup entries on Friday. Two of us wrote the whole week's log at
  once and it showed (vague entries). Write it daily.

## Try (for the next project)

- Open PRs as **drafts** on day 1 of the task, not when the code is done — the
  reviewer sees direction early.
- A `docs/DECISIONS.md` (lightweight ADRs) for choices bigger than a config
  number, e.g. "no framework", "event bus over direct calls".
- Pair on the first PR of each sprint to align on style before diverging.

## Project totals

| | Planned | Actual |
| --- | --- | --- |
| Sprints | 4 | 4 |
| Issues | 19 | 19 + 3 playtest bugs |
| PRs merged | ~12 | 15 (#20–#35) |
| Releases | 1 | 1 (`v1.0.0`) |
| CI | lint + smoke | green on `main` |

## What we'd tell next year's team

The code was the easy part. Budget most of your time for writing the issue
before you start and the PR description before you ask for review — that's the
part the course is actually grading, and it's the part that made the game come
together without stepping on each other.
