import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const cssVar = (page: Page, name: string) =>
  page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);
const bodyBackground = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test.describe('theme switcher', () => {
  test('switches the semantic CSS variables for light, dark and high contrast', async ({
    page,
  }) => {
    await page.goto('/');
    const theme = page.getByRole('banner').getByRole('radiogroup', { name: 'Theme', exact: true });

    await theme.getByRole('radio', { name: 'Dark' }).check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await cssVar(page, '--hb-color-surface-default')).toBe('#121214');
    expect(await bodyBackground(page)).toBe('rgb(18, 18, 20)');

    await theme.getByRole('radio', { name: 'High contrast' }).check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'hc');
    expect(await cssVar(page, '--hb-color-surface-default')).toBe('#000000');
    expect(await cssVar(page, '--hb-color-border-focus')).toBe('#FFD23F');

    await theme.getByRole('radio', { name: 'Light' }).check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(await cssVar(page, '--hb-color-surface-default')).toBe('#FAFAF7');
    expect(await bodyBackground(page)).toBe('rgb(250, 250, 247)');
  });

  test('is operable with arrow keys like any radio group', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByRole('radio', { name: 'Light' }).check();
    await page.getByRole('banner').getByRole('radio', { name: 'Light' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('banner').getByRole('radio', { name: 'Dark' })).toBeChecked();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('remembers the choice and applies it before first paint', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByRole('radio', { name: 'Dark' }).check();
    await page.reload();
    // The inline head script sets the theme before any stylesheet paints, so there is no flash.
    const themeAtParse = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(themeAtParse).toBe('dark');
    await expect(page.getByRole('banner').getByRole('radio', { name: 'Dark' })).toBeChecked();
  });

  test('follows the OS setting until the user chooses', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme');
    expect(await bodyBackground(page)).toBe('rgb(18, 18, 20)');
    await expect(page.getByRole('banner').getByRole('radio', { name: 'Dark' })).toBeChecked();
    await context.close();
  });
});
