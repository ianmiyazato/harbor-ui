# Lighthouse, M6 (local production build)

Measured 2026-09-28 against `pnpm build && pnpm preview`: Lighthouse 12.6.1 through its Node API, default mobile emulation and throttling, Chromium from Playwright 1.63 (see D-022). One warm-up run, then three runs per page; the table shows each run and the median. The same three pages run in CI with Lighthouse CI (`lighthouserc.cjs`) on PRs into `main`.

| Page                 | Run | Performance | Accessibility | Best practices | SEO | LCP   | TBT  | CLS |
| -------------------- | --- | ----------- | ------------- | -------------- | --- | ----- | ---- | --- |
| `/`                  | 1   | 100         | 100           | 100            | 100 | 1.5 s | 0 ms | 0   |
| `/`                  | 2   | 100         | 100           | 100            | 100 | 1.5 s | 0 ms | 0   |
| `/`                  | 3   | 100         | 100           | 100            | 100 | 1.5 s | 0 ms | 0   |
| `/components/button` | 1   | 100         | 100           | 100            | 100 | 1.5 s | 0 ms | 0   |
| `/components/button` | 2   | 100         | 100           | 100            | 100 | 1.5 s | 0 ms | 0   |
| `/components/button` | 3   | 100         | 100           | 100            | 100 | 1.5 s | 0 ms | 0   |
| `/lab`               | 1   | 100         | 100           | 100            | 100 | 1.7 s | 0 ms | 0   |
| `/lab`               | 2   | 98          | 100           | 100            | 100 | 2.3 s | 0 ms | 0   |
| `/lab`               | 3   | 99          | 100           | 100            | 100 | 2.1 s | 0 ms | 0   |

**Medians**

| Page                 | Performance | Accessibility | Best practices | SEO |
| -------------------- | ----------- | ------------- | -------------- | --- |
| `/`                  | 100         | 100           | 100            | 100 |
| `/components/button` | 100         | 100           | 100            | 100 |
| `/lab`               | 99          | 100           | 100            | 100 |

The two first-screen font files (Bricolage Grotesque and Geist, latin) are preloaded: without it `/lab` measured CLS 0.031 from text re-wrapping when the web fonts swapped in; with it CLS is 0 on every page, at the cost of a slightly later LCP on some throttled runs.
