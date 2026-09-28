# Lighthouse, M4 (local production build)

Measured 2026-09-28 against `pnpm build && pnpm preview` with Lighthouse 12.6.1 (default mobile emulation and throttling), Chromium from Playwright 1.63. Home was re-run warm: its first run in a cold browser scored 88 (TBT 470 ms); three warm runs scored 100.

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 | 1.5 s | 0 ms | 0 |
| `/foundations` | 100 | 100 | 100 | 100 | 1.5 s | 0 ms | 0 |
| `/foundations/color` | 100 | 100 | 100 | 100 | 1.5 s | 0 ms | 0 |
| `/foundations/type-and-space` | 100 | 100 | 100 | 100 | 1.5 s | 0 ms | 0 |
| `/foundations/motion` | 99 | 100 | 100 | 100 | 1.7 s | 0 ms | 0 |
| `/components` | 100 | 100 | 100 | 100 | 1.5 s | 0 ms | 0 |
| `/components/button` | 99 | 100 | 100 | 100 | 1.7 s | 0 ms | 0 |
| `/components/select` | 99 | 100 | 100 | 100 | 1.7 s | 0 ms | 0 |
| `/components/dialog` | 99 | 100 | 100 | 100 | 1.7 s | 0 ms | 0 |
| `/components/toast` | 99 | 100 | 100 | 100 | 1.7 s | 0 ms | 0 |
| `/principles` | 100 | 100 | 100 | 100 | 1.5 s | 0 ms | 0.001 |
