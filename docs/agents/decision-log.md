# Decision log

Format: `D-NNN — decision. Why. (milestone)`. Newest last.

- **D-001** — Bootstrap in the existing `harbor-ui` working directory instead of `mkdir harbor-ui`. The folder already existed and was empty. (M0)
- **D-002** — pnpm 10 is installed into the agent session's scratch directory because the sandbox mounts `~/.local` and the Node prefix read-only. The repo pins `packageManager` so CI uses the same major. (M0)
- **D-003** — Vercel is driven through the Vercel MCP (team `miyazato`): the local Vercel CLI token is invalid and its config dir is read-only in the sandbox. (M0)
- **D-004** — Chrome DevTools MCP is not connected in this session. Fallback: Playwright's bundled Chromium for console checks and CDP performance traces, and Lighthouse via `CHROME_PATH` pointing at the same binary. (M0)
- **D-005** — Branch protection on `main` and `develop` requires a PR and a green `check` status with **0 approvals**. A solo owner cannot approve their own PR, so a required review would block every merge. (M0)
- **D-006** — Stack: Astro 5 for docs (static by default, JS only for demos; spec asks for 5 even though 7 exists, and 5 is the line the plan was reviewed against), Radix primitives for Select/Tabs/Dialog/Tooltip/Toast (proven a11y; the value is tokens, states and craft), CSS Modules + CSS variables (zero runtime; themes are a variable swap). (M0)
- **D-007** — TypeScript 5.9 rather than 7.x (native port): typescript-eslint and react-docgen-typescript still need the JS compiler API. (M0)
- **D-008** — Production deploys are opt-in. `git.deploymentEnabled` allows only `main`, preview deployments are disabled on the project, and the ignore step builds only when the `main` merge commit contains `[deploy]` **and** `apps/docs` or `packages/` changed. Pure diff-based skipping would have deployed at M1–M3 and M6, spending the 5-deploy budget on milestones the plan says not to deploy. (M0)
- **D-009** — `turbo.json` sets `agentGuidance: false`. Turbo 2.11 injects a generic "read the bundled docs" block into AGENTS.md when it detects an agent; the index has a 150-line budget and the turbo config here is four tasks. (M0)
