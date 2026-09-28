import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { components } from '../e2e/components.data';

/**
 * Visual regression: every component's documented states in every theme, plus the open state of
 * each overlay. Runs only on PRs into main (see ci.yml). Baselines live next to this file.
 */
const themes = [
  ['light', 'Light'],
  ['dark', 'Dark'],
  ['hc', 'High contrast'],
] as const;

test.use({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });

async function open(page: Page, slug: string, theme: string, label: string) {
  await page.addInitScript((t) => localStorage.setItem('hb-theme', t), theme);
  await page.goto(`/components/${slug}`);
  await page
    .getByRole('radiogroup', { name: 'Demo theme' })
    .getByRole('radio', { name: label })
    .check();
  await page.evaluate(() => document.fonts.ready);
}

for (const c of components) {
  for (const [theme, label] of themes) {
    test(`${c.slug} states, ${theme}`, async ({ page }) => {
      await open(page, c.slug, theme, label);
      const states = page.getByRole('list', { name: 'States' });
      await expect(states).toHaveScreenshot(`${c.slug}-states-${theme}.png`);
    });
  }
}

const overlays: Record<string, (page: Page) => Promise<void>> = {
  select: async (page) => {
    await page.locator('[data-demo] [role="combobox"]').first().click();
    await expect(page.getByRole('listbox')).toBeVisible();
  },
  dialog: async (page) => {
    await page
      .locator('[data-demo]')
      .getByRole('button', { name: 'Delete project' })
      .first()
      .click();
    await expect(page.getByRole('dialog')).toBeVisible();
  },
  tooltip: async (page) => {
    await page.locator('[data-demo]').getByRole('button', { name: 'Archive' }).focus();
    await expect(page.getByRole('tooltip')).toBeAttached();
  },
  toast: async (page) => {
    await page.locator('[data-demo]').getByRole('button', { name: 'Archive message' }).click();
    await expect(page.locator('[data-demo]').getByRole('listitem')).toBeVisible();
  },
};

for (const [slug, show] of Object.entries(overlays)) {
  for (const [theme, label] of themes) {
    test(`${slug} open, ${theme}`, async ({ page }) => {
      await open(page, slug, theme, label);
      await show(page);
      await page.waitForTimeout(150);
      await expect(page).toHaveScreenshot(`${slug}-open-${theme}.png`, { fullPage: false });
    });
  }
}
