# Deploy rules (Vercel Hobby, free tier)

- Exactly one project: `harbor-ui`, root directory `apps/docs`, fully static output.
- No functions, image optimization, cron, KV/Blob/Postgres/Edge Config, Analytics or Speed Insights.
- Budget: **5 production deploys total**: M4, M5, M7 plus at most 2 fixes. Previews: 0.

## How a deploy happens (as run)

The Vercel GitHub App is not installed, so pushes do not trigger builds. After the milestone merge,
the deploy is created through the Vercel API (MCP `create_deployment`) with
`gitSource = { type: github, org: ianmiyazato, repo: harbor-ui, ref: main, sha: <merge sha> }`,
`target: production`. Vercel clones the public repo and still runs the ignore step, so the
`[deploy]` marker and the diff check guard these deploys too (deploy #1 logged
`build: [deploy] marker and changes under apps/docs or packages/`). Production domain:
`harbor-ui-docs.vercel.app` (`harbor-ui.vercel.app` belongs to another account). Vercel
Authentication applies to previews only. Verify with `pnpm verify:prod`.

## How a deploy would happen with the Git integration

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
