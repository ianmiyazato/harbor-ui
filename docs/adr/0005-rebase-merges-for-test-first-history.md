# ADR 0005: Rebase merges preserve the test-first history

- Status: accepted (M0)
- Deciders: Ian Miyazato

## Context

Harbor is built test-first: every behavior starts as a failing test committed on its own, followed by
the implementation. That history is part of the evidence; a reviewer should be able to open the log
and see `test(...)` land before `feat(...)`.

## Decision

Feature branches merge into `develop` with rebase merges (`gh pr merge --rebase`), so every commit
survives in order. Squash merging is disabled on the repository. Milestones merge `develop` into
`main` with a regular merge commit, tagged `v0.N.0`; only milestone merges that should deploy carry
`[deploy]` in the subject. Both branches are protected: a PR and a green `check` are required, with
zero approvals because a solo maintainer cannot approve their own PR (D-005).

## Consequences

- `git log --oneline develop` shows the test → feat pairs for every component and lab interaction,
  plus the occasional `fix(...)` when a later test found a real bug (the Checkbox hit target, the
  disabled Switch description).
- History is longer and noisier than with squash; the changelog in `docs/agents/changelog.md`
  gives the one-line-per-PR view.
- Rebase merges rewrite commit hashes on `develop`, so references use PR numbers and tags.
