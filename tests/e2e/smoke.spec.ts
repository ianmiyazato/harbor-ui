import { expect, test } from '@playwright/test';

test('the docs build serves a home page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
