# Test-first workflow

Every behavior starts as a failing test committed on its own, before the code that makes it pass.

1. `git switch develop && git pull && git switch -c feat/<area>-<desc>`
2. Write the failing tests. Run them and check the failure is the *right* failure
   (missing export / wrong value), not a typo or config error.
   `git commit -m "test(<scope>): <behavior>"`
3. Implement the minimum to go green. `git commit -m "feat(<scope>): <behavior>"`
4. Refactor with tests green. `git commit -m "refactor(<scope>): ..."` (only if something changed)
5. `pnpm check`
6. Update AGENTS.md: changelog line, checklist, decision log (and `docs/agents/*.md`).
7. Push, `gh pr create --base develop --fill`, wait for CI, `gh pr merge --rebase --delete-branch`.

Why rebase merges: squash would collapse the `test(...)` then `feat(...)` pairs into one commit
and erase the evidence that tests came first.

## Milestones

`gh pr create --base main --head develop`, merge with a **merge commit**, tag `v0.N.0`.
Only M4, M5 and M7 merge commits carry `[deploy]` (see `deploy.md`).
