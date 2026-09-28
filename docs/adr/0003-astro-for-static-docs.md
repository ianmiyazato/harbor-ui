# ADR 0003: Astro for a static docs site

- Status: accepted (M0, confirmed in M4)
- Deciders: Ian Miyazato

## Context

The docs site is the portfolio's front door. It must be fully static (Vercel Hobby: no functions),
score 95+ in Lighthouse, keep content pages under 30 kB of JavaScript, and still run live React demos
of the real components.

## Decision

Use Astro 5 with MDX and React islands. Pages render to static HTML; only live demos hydrate, with
`client:visible`. States rows, home tiles and do/don't examples render the real React components to
static HTML with no hydration. Content pages use a few lines of vanilla script for the theme switcher,
replay buttons and copy buttons. Astro 5 was chosen over the newer 7 because the plan was reviewed
against it (D-006).

## Consequences

- Content pages ship almost no JavaScript (e2e budget test: under 30 kB gzip, measured per page).
  Component pages hydrate exactly one island (tested).
- Lighthouse on the local production build: performance 99–100, accessibility, best practices and SEO
  100 on every page measured (docs/perf/lighthouse-m4.md).
- Any page with a live demo pays the shared React runtime, measured at 65.9 kB gzip for React 19 plus
  the Astro client (D-016, D-024).
- Props tables are generated at build time from the TypeScript source with react-docgen-typescript,
  and each snippet's token list is read from the component's CSS module.
