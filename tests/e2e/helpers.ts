import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/** Collect console errors and uncaught exceptions for the lifetime of the page. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

/** Zero serious or critical axe violations (WCAG 2.2 A/AA rules). */
export async function expectNoSeriousAxeViolations(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
    'wcag22aa',
  ]);
  if (include) builder = builder.include(include);
  const { violations } = await builder.analyze();
  const serious = violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  expect(serious, 'serious/critical axe violations').toEqual([]);
}

/** Every same-origin page reachable by links from `start`. */
export async function crawl(page: Page, start = '/'): Promise<string[]> {
  const seen = new Set<string>([start]);
  const queue = [start];
  while (queue.length) {
    const path = queue.shift() as string;
    await page.goto(path);
    const hrefs = await page.$$eval('a[href]', (links) =>
      links
        .map((a) => new URL((a as HTMLAnchorElement).href))
        .filter((u) => u.origin === location.origin)
        .map((u) => u.pathname),
    );
    for (const href of hrefs) {
      const clean = href.replace(/\/$/, '') || '/';
      if (!seen.has(clean)) {
        seen.add(clean);
        queue.push(clean);
      }
    }
  }
  return [...seen].sort();
}
