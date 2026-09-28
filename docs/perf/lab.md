# Lab frame timing

Measured 2026-09-28 with `scripts/perf-lab.mjs` against the local production build
(`pnpm build && pnpm preview`), Chromium from Playwright, 1280 × 900 viewport. Chrome DevTools MCP was not
connected, so frames are recorded in-page: every `requestAnimationFrame` delta while the interaction runs, plus
Long Animation Frame entries. Each interaction ran unthrottled and with 4× CPU throttling (CDP
`Emulation.setCPUThrottlingRate`). Target: no frame longer than 50 ms.

| Interaction | CPU | Frames | Median ms | p95 ms | Max ms | Frames > 50 ms | LoAF > 50 ms |
| ----------- | --- | ------ | --------- | ------ | ------ | -------------- | ------------ |
| like        | 1×  | 93     | 16.7      | 16.8   | 16.8   | 0              | 0            |
| reorder     | 1×  | 92     | 16.7      | 16.8   | 16.8   | 0              | 0            |
| skeleton    | 1×  | 157    | 16.7      | 16.7   | 16.8   | 0              | 0            |
| toast       | 1×  | 93     | 16.7      | 16.8   | 16.8   | 0              | 0            |
| card        | 1×  | 92     | 16.7      | 16.8   | 33.4   | 0              | 0            |
| pull        | 1×  | 177    | 16.7      | 16.7   | 16.8   | 0              | 0            |
| like        | 4×  | 94     | 16.7      | 16.8   | 16.8   | 0              | 0            |
| reorder     | 4×  | 94     | 16.7      | 16.7   | 16.8   | 0              | 0            |
| skeleton    | 4×  | 160    | 16.7      | 16.8   | 16.8   | 0              | 0            |
| toast       | 4×  | 95     | 16.7      | 16.8   | 33.4   | 0              | 4            |
| card        | 4×  | 93     | 16.7      | 16.7   | 66.7   | 1              | 5            |
| pull        | 4×  | 178    | 16.7      | 16.7   | 33.4   | 0              | 6            |

Worst frame across all runs: **66.7 ms**. Frames over 50 ms: **1**.

## Reading the numbers

- Unthrottled, every interaction holds a steady 16.7 ms cadence (60 Hz) with no frame over 50 ms.
- At 4× CPU throttling one frame of 66.7 ms appears in **card to detail**: it is the frame where the
  View Transitions API captures the old and new states (React commits the detail with `flushSync` inside
  the transition callback). Every other interaction stays under 50 ms per frame; the LoAF entries over 50 ms
  at 4× are long _tasks_ around the click and the toast/refresh state changes, not dropped animation frames.
- All animated properties are transform and opacity (checked by the e2e suite), so the motion itself runs
  on the compositor; the long frames are main-thread work at the start of an interaction.
