import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/** Gzipped bytes of every script a page loads (the preview server does not compress). */
async function gzippedJs(page: Page, path: string) {
  const bodies: Promise<Buffer>[] = [];
  page.on('response', (res) => {
    if (res.request().resourceType() === 'script') bodies.push(res.body());
  });
  await page.goto(path, { waitUntil: 'networkidle' });
  await page.mouse.wheel(0, 20_000);
  await page.waitForLoadState('networkidle');
  const all = await Promise.all(bodies);
  return all.reduce((sum, body) => sum + gzipSync(body, { level: 9 }).length, 0);
}

const contentPages = [
  '/',
  '/foundations',
  '/foundations/color',
  '/foundations/type-and-space',
  '/foundations/motion',
  '/components',
  '/principles',
];

for (const path of contentPages) {
  test(`content page ${path} ships under 30 kB of JS (gzip)`, async ({ page }) => {
    const bytes = await gzippedJs(page, path);
    test.info().annotations.push({ type: 'js-gzip-bytes', description: String(bytes) });
    expect(bytes).toBeLessThan(30 * 1024);
  });
}

test('component pages hydrate only their demo', async ({ page }) => {
  await page.goto('/components/button');
  await expect(page.locator('astro-island')).toHaveCount(1);
  await expect(page.locator('[data-demo] astro-island')).toHaveCount(1);
});
