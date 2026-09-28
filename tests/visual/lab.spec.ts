import { expect, test } from '@playwright/test';
import { hydrated, tile, tiles } from '../e2e/lab.helpers';

/** Each lab tile at the final frame of its interaction (reduced motion makes the end state immediate). */
test.use({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });

for (const id of tiles) {
  test(`lab ${id}, final frame`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('hb-theme', 'light'));
    await page.goto('/lab');
    await hydrated(page);
    const t = tile(page, id);
    await t.scrollIntoViewIfNeeded();
    await t.getByRole('button', { name: 'Replay' }).click();
    // Let timers that are not motion (simulated latency, refresh, loading) finish.
    await page.waitForTimeout(3500);
    await page.mouse.move(0, 0);
    await expect(t.locator('[data-stage]')).toHaveScreenshot(`lab-${id}.png`, {
      mask: [t.locator('[role="status"]')],
    });
  });
}
