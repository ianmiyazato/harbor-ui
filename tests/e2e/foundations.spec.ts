import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const report = JSON.parse(readFileSync('packages/tokens/dist/contrast-report.json', 'utf8')) as {
  summary: { pairs: number; checks: number; passed: number };
  results: { theme: string; fg: string; bg: string; ratio: number }[];
};
const tokenFile = JSON.parse(readFileSync('packages/tokens/dist/tokens.json', 'utf8')) as {
  tokens: { name: string; motionType?: string; value: unknown; reduced?: { value: unknown } }[];
};

test('the foundations index links to color, type and space, and motion', async ({ page }) => {
  await page.goto('/foundations');
  for (const name of ['Color', 'Type and space', 'Motion']) {
    await expect(page.getByRole('link', { name: new RegExp(name) })).toBeVisible();
  }
});

test.describe('color', () => {
  test('shows every palette step with its hex value', async ({ page }) => {
    await page.goto('/foundations/color');
    const teal = page.getByRole('list', { name: 'teal scale' });
    await expect(teal.getByRole('listitem')).toHaveCount(11);
    await expect(teal).toContainText('600');
    await expect(teal).toContainText('#1F6F5C');
  });

  test('renders the contrast report from contrast-report.json, not hand-typed numbers', async ({
    page,
  }) => {
    await page.goto('/foundations/color');
    const summary = page.getByTestId('contrast-summary');
    await expect(summary).toContainText(`${report.summary.pairs} pairs`);
    await expect(summary).toContainText(`${report.summary.checks} checks`);
    await expect(summary).toContainText(`${report.summary.passed} passed`);
    const rows = page.locator('[data-contrast-row]');
    await expect(rows).toHaveCount(report.results.length);
    for (const r of report.results.filter((_, i) => i % 13 === 0)) {
      const row = page.locator(
        `[data-contrast-row][data-theme-name="${r.theme}"][data-fg="${r.fg}"][data-bg="${r.bg}"]`,
      );
      await expect(row).toContainText(r.ratio.toFixed(2));
    }
  });
});

test('type and space shows the full type scale, spacing and radius', async ({ page }) => {
  await page.goto('/foundations/type-and-space');
  await expect(page.locator('[data-type-step]')).toHaveCount(9);
  await expect(page.locator('[data-type-step]').first()).toContainText('12/16');
  await expect(page.locator('[data-space-step]')).toHaveCount(10);
  await expect(page.locator('[data-radius-step]')).toHaveCount(5);
});

test.describe('motion', () => {
  const durations = tokenFile.tokens.filter((t) => t.motionType === 'duration');

  test('has a bar, a Play button and a reduced alternative for every duration token', async ({
    page,
  }) => {
    await page.goto('/foundations/motion');
    for (const t of durations) {
      const row = page.locator(`[data-motion-token="${t.name}"]`);
      await expect(row).toContainText(`${t.value}ms`);
      await expect(row).toContainText(`${t.reduced?.value}ms`);
      await expect(row.getByRole('button', { name: /play/i })).toBeVisible();
    }
  });

  test('plots every easing and spring as a curve', async ({ page }) => {
    await page.goto('/foundations/motion');
    await expect(page.locator('[data-curve]')).toHaveCount(6);
  });

  test('Play runs the animation with the token duration', async ({ page }) => {
    await page.goto('/foundations/motion');
    const row = page.locator('[data-motion-token="motion.duration.deliberate"]');
    await row.getByRole('button', { name: /play/i }).click();
    await expect(row).toHaveAttribute('data-playing', '');
    const duration = await row
      .locator('[data-lane="full"] [data-dot]')
      .evaluate((el) => getComputedStyle(el).animationDuration);
    expect(duration).toBe('0.48s');
  });

  test('uses the reduced durations when the OS asks for reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/foundations/motion');
    const row = page.locator('[data-motion-token="motion.duration.deliberate"]');
    await row.getByRole('button', { name: /play/i }).click();
    const [duration, name] = await row
      .locator('[data-lane="full"] [data-dot]')
      .evaluate((el) => [
        getComputedStyle(el).animationDuration,
        getComputedStyle(el).animationName,
      ]);
    expect(duration).toBe('0.2s');
    expect(name).toContain('fade');
    await context.close();
  });
});
