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
- [ ] M4 Docs site: Home, Foundations, Components, Principles — deploy #1
- [ ] M5 Micro-interaction lab (6 interactions) — deploy #2
- [ ] M6 Visual regression, coverage, Lighthouse, ADRs
- [ ] M7 v1.0.0 release, README, `docs/CALL-BRIEF.md` — deploy #3

## Deploy ledger (budget: 5 production deploys, 0 previews, 1 project, no functions)

| # | Date | Milestone | Commit | URL |
|---|---|---|---|---|
| — | — | — | — | — |

Built production deploys: **0 / 5**. Rules: [`docs/agents/deploy.md`](docs/agents/deploy.md).

## Decision log (latest; full log in [`docs/agents/decision-log.md`](docs/agents/decision-log.md))

- D-021 States row = static inert specimens; live demo is the island; facts computed and measured in e2e.
- D-020 Full package 45.1 kB gz (Radix) > 35 kB target; kept Radix, CI enforces per-usage budgets; Button 0.64 kB.
- D-019 Portalled content copies local theme/motion/timescale from its anchor when opening.
- D-018 Loading-width: unit test asserts the mechanism; the pixel width assertion runs in Playwright (jsdom has no layout).
- D-017 One states registry per component drives axe tests, docs and screenshots; `[data-preview]` shows pseudo-states live.
- D-016 React 19.3 runtime = 68.6 kB gz (measured) > 60 kB lab budget; kept React, report runtime + lab code separately.

## Changelog (latest; full log in [`docs/agents/changelog.md`](docs/agents/changelog.md))

- M4 #30 docs: home (pitch, stats from data, 3 live tiles), principles (5, each with repo evidence), JS budget + 390px overflow e2e checks.
- M4 #29 docs: components index + 12 pages (live island, static states row, scoped theme toggle, 3 measured a11y facts, generated props, snippet with extracted token list, do/don't); fix: disabled descriptions stay readable.
- M4 #28 docs: Foundations (Color with generated contrast report, Type and space, Motion with replayable durations/curves and reduced lanes); zero React JS.
- M4 #27 docs: layout shell, skip link, Light/Dark/High-contrast switcher (native radios, no-flash inline script, follows OS until chosen).
- M4 #26 docs: Astro 5 static scaffold (React + MDX integrations), Playwright e2e against `astro preview`, CI runs e2e.
- M3 #24 ci: size-limit gzip budgets per usage pattern in CI (Button 0.64 kB, full 45.1 kB). M3 complete.

## Known gaps

- **Full-package size 45.1 kB gz vs 35 kB target** (D-020). Per-usage budgets are enforced instead; Button alone is 0.64 kB.
- **Lab JS budget** (D-016): React 19.3's runtime alone is 68.6 kB gz, above the 60 kB lab page target.
- **`.pnpm-store` in early history.** A sandbox-local pnpm store was committed by mistake in the M0 `ci:` commit
  and deleted in `chore: check formatting in lint and ignore local pnpm store`. The files no longer exist in the tree,
  but they remain in git history (~55 MB pack). Rewriting published history was not done autonomously; owner decision.
- **Vercel Git link missing.** The Vercel GitHub App is not installed on `ianmiyazato/harbor-ui`, so
  `main` merges cannot trigger builds. Fix: install https://github.com/apps/vercel for this repo, then
  Vercel → harbor-ui → Settings → Git → Connect `ianmiyazato/harbor-ui`. Until then deploys use the fallback
  in [`docs/agents/deploy.md`](docs/agents/deploy.md).
