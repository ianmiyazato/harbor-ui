/**
 * Frame timing for each lab interaction, against the local production build.
 * Usage: pnpm build && pnpm preview (in another shell) && node scripts/perf-lab.mjs
 * Records requestAnimationFrame deltas and Long Animation Frames (LoAF) while each tile's
 * interaction runs, unthrottled and with 4× CPU throttling, and writes docs/perf/lab.md.
 */
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4321';
const tiles = {
  like: async (t) => t.getByRole('button', { name: /^Like/ }).click(),
  reorder: async (t) => t.getByRole('button', { name: 'Replay' }).click(),
  skeleton: async (t) => t.getByRole('button', { name: 'Replay' }).click(),
  toast: async (t) => t.getByRole('button', { name: 'Replay' }).click(),
  card: async (t) => t.getByRole('button', { name: 'Replay' }).click(),
  pull: async (t, page) => {
    const box = await t.locator('[data-pull-panel]').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + 180, { steps: 20 });
    await page.mouse.up();
  },
};

async function measure(page, id, run, rate) {
  const t = page.locator(`[data-lab-tile="${id}"]`);
  await t.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const w = window;
    w.__frames = [];
    w.__loaf = [];
    w.__recording = true;
    let last = performance.now();
    const tick = (now) => {
      if (!w.__recording) return;
      w.__frames.push(now - last);
      last = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) w.__loaf.push(e.duration);
    }).observe({ type: 'long-animation-frame' });
  });
  await run(t, page);
  await page.waitForTimeout(id === 'skeleton' || id === 'pull' ? 2600 : 1500);
  const { frames, loaf } = await page.evaluate(() => {
    window.__recording = false;
    return { frames: window.__frames.slice(1), loaf: window.__loaf };
  });
  const sorted = [...frames].sort((a, b) => a - b);
  const p = (q) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] ?? 0;
  return {
    id,
    rate,
    frames: frames.length,
    median: p(0.5),
    p95: p(0.95),
    max: sorted.at(-1) ?? 0,
    over50: frames.filter((f) => f > 50).length,
    loafOver50: loaf.filter((d) => d > 50).length,
  };
}

const browser = await chromium.launch();
const rows = [];
for (const rate of [1, 4]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const cdp = await page.context().newCDPSession(page);
  await page.goto(`${base}/lab`, { waitUntil: 'networkidle' });
  for (const island of await page.locator('astro-island').all())
    await island.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  for (const [id, run] of Object.entries(tiles)) rows.push(await measure(page, id, run, rate));
  await page.close();
}
await browser.close();

const f = (n) => n.toFixed(1);
const table = rows
  .map(
    (r) =>
      `| ${r.id} | ${r.rate}× | ${r.frames} | ${f(r.median)} | ${f(r.p95)} | ${f(r.max)} | ${r.over50} | ${r.loafOver50} |`,
  )
  .join('\n');
const worst = Math.max(...rows.map((r) => r.max));
const md = `# Lab frame timing

Measured ${new Date().toISOString().slice(0, 10)} with \`scripts/perf-lab.mjs\` against the local production build
(\`pnpm build && pnpm preview\`), Chromium from Playwright, 1280 × 900 viewport. Chrome DevTools MCP was not
connected, so frames are recorded in-page: every \`requestAnimationFrame\` delta while the interaction runs, plus
Long Animation Frame entries. Each interaction ran unthrottled and with 4× CPU throttling (CDP
\`Emulation.setCPUThrottlingRate\`). Target: no frame longer than 50 ms.

| Interaction | CPU | Frames | Median ms | p95 ms | Max ms | Frames > 50 ms | LoAF > 50 ms |
|---|---|---|---|---|---|---|---|
${table}

Worst frame across all runs: **${f(worst)} ms**. Frames over 50 ms: **${rows.reduce((a, r) => a + r.over50, 0)}**.
`;
writeFileSync(new URL('../docs/perf/lab.md', import.meta.url), md);
console.log(md);
