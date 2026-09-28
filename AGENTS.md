# AGENTS.md — Harbor UI

Index for humans and agents working in this repo. Details live in [`docs/agents/`](docs/agents).

## Purpose and content rules

Harbor is a small, accessible, token-driven design system plus a micro-interaction lab,
built as public portfolio evidence of design sensibility, frontend engineering and product judgment.

- Public and non-confidential: no client names, no private data, no secrets in the repo.
- Every number in the README, docs or call brief comes from a real run. Never estimate.
- Nothing is built to look busy: if it isn't demoed, tested or documented, it doesn't ship.

## Toolchain (recorded at M0, 2026-09-28)

Node 24.11 local / 22 in CI (`.nvmrc`), pnpm 10.34, gh authed (`ianmiyazato`), Vercel via MCP
(team `miyazato`, project `harbor-ui` = `prj_rpoTbkRGlfjr02wL76jwxA4iRlou`; CLI token invalid),
Chrome DevTools MCP not connected (Playwright Chromium fallback). See D-002..D-004.

## Architecture map

```
packages/tokens   source of truth → dist/tokens.css, dist/index.js (+ .d.ts), dist/tokens.json, contrast report
packages/react    12 components (React 19, TS strict, CSS Modules on tokens, Radix for complex widgets)
apps/docs         Astro 5 + MDX, static output, React islands only for live demos; /lab
tests/            Playwright e2e, a11y and visual specs against the local production build
docs/adr          architecture decision records   docs/agents  workflow, decision log, changelog
```

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | docs site dev server (builds packages first) |
| `pnpm build` | build tokens → react → docs (static) |
| `pnpm preview` | serve the docs production build locally on :4321 |
| `pnpm check` | lint + typecheck + unit + a11y + build (run before every PR) |
| `pnpm test` / `test:unit` / `test:a11y` | Vitest suites (a11y = axe on every documented state) |
| `pnpm test:e2e` / `test:visual` | Playwright against the local production build |
| `pnpm size` | size-limit budgets for `packages/react` |
| `pnpm lighthouse` | Lighthouse CI against the local production build |
| `pnpm deploy:prod` | manual fallback only; normal deploys come from `main` merges (see Deploy) |

## Token rules

- Components use **semantic** tokens only (`--hb-color-text-muted`), never primitives (`--hb-teal-600`).
- No raw values in component CSS: no hex/rgb/hsl, no `px`/`rem`/`ms`/`s` literals. Enforced by stylelint.
- Themes (light, dark, high contrast) and reduced motion are mappings, never forks.
- Details: [`docs/agents/tokens.md`](docs/agents/tokens.md).

## Test-first workflow (every micro-task)

1. Branch from `develop`: `feat/<area>-<desc>`, `test/…`, `fix/…`, `docs/…`, `chore/…`.
2. Write failing tests; confirm they fail for the right reason; commit `test(<scope>): <behavior>`.
3. Minimum code to pass; commit `feat(<scope>): <behavior>`. Refactor green; `refactor(<scope>): …`.
4. `pnpm check`, update this file (changelog, checklist, decisions), push.
5. `gh pr create --base develop --fill`, wait for green CI, `gh pr merge --rebase --delete-branch`.

Rebase merges keep the test → feat commit pairs visible. Details: [`docs/agents/workflow.md`](docs/agents/workflow.md).

## Branches and commits

- `main` = production, `develop` = integration. Both protected: PR + green `check` required, 0 approvals.
- Conventional Commits with scopes (`tokens`, `button`, `dialog`, `docs`, `lab`, `ci`…). One logical change per commit.
- Milestones: `develop → main` via PR with a regular merge commit, then tag `v0.x.0`.

## Milestone checklist

- [x] M0 Repo, branches, protection, CI, AGENTS.md, Vercel project configured (not deployed)
- [x] M1 Tokens: schema, contrast matrix, motion and build-output tests
- [x] M2 Button, IconButton, Input, Checkbox, Switch, Badge, Skeleton
- [x] M3 Select, Tabs, Dialog, Tooltip, Toast, size-limit
- [x] M4 Docs site: Home, Foundations, Components, Principles — deploy #1
- [x] M5 Micro-interaction lab (6 interactions) — deploy #2
- [ ] M6 Visual regression, coverage, Lighthouse, ADRs
- [ ] M7 v1.0.0 release, README, `docs/CALL-BRIEF.md` — deploy #3

## Deploy ledger (budget: 5 production deploys, 0 previews, 1 project, no functions)

| # | Date | Milestone | Commit | URL |
|---|---|---|---|---|
| 1 | 2026-09-28 | M4 docs site (`v0.4.0`) | `8102715` | https://harbor-ui-docs.vercel.app |

Built production deploys: **1 / 5** · previews: 0 · projects: 1 · functions: 0. Rules: [`docs/agents/deploy.md`](docs/agents/deploy.md).

## Decision log (latest; full log in [`docs/agents/decision-log.md`](docs/agents/decision-log.md))

- D-024 Lab JS 95.4 kB gz (65.9 runtime + 29.5 lab); 0 long frames unthrottled, 1 at 4× (VT capture).
- D-023 Deploys via Vercel API gitSource (public repo); domain harbor-ui-docs.vercel.app; protection = previews only.
- D-022 Lighthouse via Node API + Playwright Chromium (chrome-launcher can't run under WSL sandbox).
- D-021 States row = static inert specimens; live demo is the island; facts computed and measured in e2e.
- D-020 Full package 45.1 kB gz (Radix) > 35 kB target; kept Radix, CI enforces per-usage budgets; Button 0.64 kB.
- D-019 Portalled content copies local theme/motion/timescale from its anchor when opening.

## Changelog (latest; full log in [`docs/agents/changelog.md`](docs/agents/changelog.md))

- M5 #33 lab: 6 interactions (like, reorder, skeleton, toast, card→detail, pull) with spec/replay/×5/reduced; compositor-only + CLS 0 verified in e2e; frame timing in docs/perf/lab.md; fix(checkbox) hit target.
- M4 deploy #1: https://harbor-ui-docs.vercel.app (v0.4.0, 8102715); `pnpm verify:prod` passes on production (19 pages, 0 console errors, 0 serious axe).
- M4 #31 close: Lighthouse on 11 pages (perf 99–100, a11y/BP/SEO 100) recorded in docs/perf/lighthouse-m4.md. M4 complete.
- M4 #30 docs: home (pitch, stats from data, 3 live tiles), principles (5, each with repo evidence), JS budget + 390px overflow e2e checks.
- M4 #29 docs: components index + 12 pages (live island, static states row, scoped theme toggle, 3 measured a11y facts, generated props, snippet with extracted token list, do/don't); fix: disabled descriptions stay readable.
- M4 #28 docs: Foundations (Color with generated contrast report, Type and space, Motion with replayable durations/curves and reduced lanes); zero React JS.

## Known gaps

- **Full-package size 45.1 kB gz vs 35 kB target** (D-020). Per-usage budgets are enforced instead; Button alone is 0.64 kB.
- **Lab JS budget** (D-016, D-024): `/lab` loads 95.4 kB gz (65.9 kB shared React/Astro runtime + 29.5 kB lab code) vs a 60 kB target.
- **One 66.7 ms frame at 4× CPU throttling** (card view-transition capture); 0 long frames unthrottled. See docs/perf/lab.md.
- **`.pnpm-store` in early history.** A sandbox-local pnpm store was committed by mistake in the M0 `ci:` commit
  and deleted in `chore: check formatting in lint and ignore local pnpm store`. The files no longer exist in the tree,
  but they remain in git history (~55 MB pack). Rewriting published history was not done autonomously; owner decision.
- **Vercel Git link missing.** The Vercel GitHub App is not installed on `ianmiyazato/harbor-ui`, so
  `main` merges do not auto-deploy; each milestone deploy is triggered through the Vercel API from the
  public repo (see [`docs/agents/deploy.md`](docs/agents/deploy.md)). Optional fix: install
  https://github.com/apps/vercel for this repo and connect it in Vercel → harbor-ui → Settings → Git.
