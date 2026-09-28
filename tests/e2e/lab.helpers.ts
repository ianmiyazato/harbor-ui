import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export const tiles = ['like', 'reorder', 'skeleton', 'toast', 'card', 'pull'] as const;
export type TileId = (typeof tiles)[number];

export const tile = (page: Page, id: TileId) => page.locator(`[data-lab-tile="${id}"]`);

/** Wait until every lab island has hydrated. */
export async function hydrated(page: Page) {
  await page.waitForFunction(() =>
    [...document.querySelectorAll('astro-island')].every((i) => !i.hasAttribute('ssr')),
  );
}

/** Start recording layout shifts whose sources are inside the tile. */
export async function watchShifts(t: Locator) {
  await t.evaluate((el) => {
    const w = window as unknown as { __shifts: number[] };
    w.__shifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as {
        value: number;
        sources: { node: Node | null }[];
      }[]) {
        if (entry.sources.some((s) => s.node && el.contains(s.node))) w.__shifts.push(entry.value);
      }
    }).observe({ type: 'layout-shift' });
  });
}

export async function expectNoShift(page: Page) {
  await page.waitForTimeout(300);
  const shifts = await page.evaluate(() => (window as unknown as { __shifts: number[] }).__shifts);
  expect(
    shifts.reduce((a, b) => a + b, 0),
    'layout shift inside the tile',
  ).toBe(0);
}

/**
 * Motion may only change transform and opacity. Every running CSS animation in the stage and every
 * transition on a [data-motion-part] is checked: any other property must keep one value throughout.
 */
export async function auditMotion(t: Locator) {
  return t.evaluate((el) => {
    const allowed = new Set([
      'transform',
      'opacity',
      'offset',
      'easing',
      'composite',
      'computedOffset',
    ]);
    const problems: string[] = [];
    let count = 0;
    for (const anim of el.getAnimations({ subtree: true })) {
      const target = (anim.effect as KeyframeEffect | null)?.target as Element | null;
      if (!target) continue;
      const isCssAnimation = anim instanceof CSSAnimation;
      const isPart = !!target.closest('[data-motion-part]');
      if (!isCssAnimation && !isPart) continue;
      if (!target.closest('[data-stage]')) continue;
      count++;
      const frames = (anim.effect as KeyframeEffect).getKeyframes();
      const props = new Set(frames.flatMap((f) => Object.keys(f)));
      for (const prop of props) {
        if (allowed.has(prop)) continue;
        const values = new Set(frames.map((f) => String((f as Record<string, unknown>)[prop])));
        if (values.size > 1) problems.push(`${target.tagName}.${target.className}: ${prop}`);
      }
    }
    return { count, problems };
  });
}

export async function expectCompositorOnly(t: Locator, { atLeast = 1 } = {}) {
  const { count, problems } = await auditMotion(t);
  expect(problems, 'non-compositor properties animated').toEqual([]);
  expect(count, 'animations observed').toBeGreaterThanOrEqual(atLeast);
}

/** Toggle the tile's reduced-motion preview and slow motion. */
export async function setReduced(t: Locator, on = true) {
  const sw = t.getByRole('switch', { name: 'Reduced motion' });
  if ((await sw.getAttribute('aria-checked')) !== String(on)) await sw.click();
  await expect(t).toHaveAttribute('data-motion', on ? 'reduced' : 'full');
}

export async function setSlow(t: Locator, on = true) {
  const sw = t.getByRole('switch', { name: 'Slow motion ×5' });
  if ((await sw.getAttribute('aria-checked')) !== String(on)) await sw.click();
}
