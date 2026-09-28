# Deploy rules (Vercel Hobby, free tier)

- Exactly one project: `harbor-ui`, root directory `apps/docs`, fully static output.
- No functions, image optimization, cron, KV/Blob/Postgres/Edge Config, Analytics or Speed Insights.
- Budget: **5 production deploys total**: M4, M5, M7 plus at most 2 fixes. Previews: 0.

## How a deploy happens

1. Verify locally first: `pnpm build && pnpm preview`, then `pnpm test:e2e` and `pnpm lighthouse`.
2. Open the milestone PR `develop -> main`. Merge with a merge commit whose subject contains `[deploy]`:
   `gh pr merge <n> --merge --subject "release: M4 docs site [deploy]"`
3. Vercel's ignore step (`apps/docs/scripts/vercel-ignore.sh`) builds only if:
   - the target is production (branch `main`), and
   - the head commit message contains `[deploy]`, and
   - `git diff HEAD^ HEAD` touches `apps/docs/` or `packages/`.
   Anything else exits 0 and Vercel skips the build.
4. Record the deploy in the AGENTS.md ledger (date, milestone, commit, URL, n/5).
5. Verify the production URL in Chrome: every page loads with zero console errors.

Layers of protection against surprise deploys: `git.deploymentEnabled` (`main` only),
project-level `previewDeploymentsDisabled`, and the ignore script.
