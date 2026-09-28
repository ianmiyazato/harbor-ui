import { expect, test } from '@playwright/test';
import { crawl, expectNoSeriousAxeViolations, watchErrors } from './helpers';
import { routes } from './routes';

test('every expected page is linked from the site', async ({ page }) => {
  const found = await crawl(page);
  for (const route of routes) expect(found).toContain(route);
});

test('every page: one visible h1, a title, a skip link, zero console errors and no serious axe violations', async ({
  page,
}) => {
  test.setTimeout(120_000);
  const pages = await crawl(page);
  for (const path of pages) {
    const errors = watchErrors(page);
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole('heading', { level: 1 }), path).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 }), path).toBeVisible();
    await expect(page, path).toHaveTitle(/Harbor/);
    await expect(page.getByRole('main'), path).toBeVisible();
    await expect(page.getByRole('link', { name: 'Skip to content' }), path).toBeAttached();
    await expectNoSeriousAxeViolations(page);
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    expect(errors, path).toEqual([]);
  }
});

test('the skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('no page scrolls sideways on a 390px phone', async ({ browser }) => {
  test.setTimeout(120_000);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const path of await crawl(page)) {
    await page.goto(path);
    const [scroll, client] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(scroll, path).toBeLessThanOrEqual(client);
  }
  await context.close();
});
