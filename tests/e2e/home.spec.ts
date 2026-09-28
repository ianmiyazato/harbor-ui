import { expect, test } from '@playwright/test';

test.describe('home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('leads with the one-line pitch', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Harbor is a small, accessible, token-driven design system.',
    );
  });

  test('has three live tiles: a component, a theme switch and a motion demo', async ({ page }) => {
    await expect(page.locator('[data-tile]')).toHaveCount(3);
    await expect(page.locator('[data-tile="component"]').getByRole('button').first()).toBeVisible();

    const themeTile = page.locator('[data-tile="theme"]');
    await themeTile.getByRole('radio', { name: 'Dark' }).check();
    await expect(themeTile.locator('[data-theme-target]')).toHaveAttribute('data-theme', 'dark');
    await themeTile.getByRole('radio', { name: 'High contrast' }).check();
    await expect(themeTile.locator('[data-theme-target]')).toHaveAttribute('data-theme', 'hc');

    const motionTile = page.locator('[data-tile="motion"]');
    await motionTile.getByRole('button', { name: /replay/i }).click();
    await expect(motionTile.locator('[data-stage]')).toHaveAttribute('data-playing', '');
  });

  test('links to Foundations, Components and Principles', async ({ page }) => {
    const main = page.getByRole('main');
    for (const name of ['Foundations', 'Components', 'Principles']) {
      await expect(main.getByRole('link', { name: new RegExp(name) }).first()).toBeVisible();
    }
  });
});

test('principles: five principles, each tied to a real decision in the repo', async ({ page }) => {
  await page.goto('/principles');
  const names = [
    'States before variants',
    'Tokens are the API',
    'Accessibility is measured, not claimed',
    'Motion explains change',
    'Small surface, deep quality',
  ];
  const headings = page.getByRole('heading', { level: 2 });
  await expect(headings).toHaveText(names);
  const evidence = page.locator(
    '[data-evidence] a[href^="https://github.com/ianmiyazato/harbor-ui/"]',
  );
  expect(await evidence.count()).toBeGreaterThanOrEqual(5);
});
