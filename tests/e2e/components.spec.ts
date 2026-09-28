import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { components } from './components.data';

const report = JSON.parse(readFileSync('packages/tokens/dist/contrast-report.json', 'utf8')) as {
  results: { fg: string; bg: string; ratio: number }[];
};

test('the components index links to all 12 components', async ({ page }) => {
  await page.goto('/components');
  for (const c of components) {
    await expect(page.getByRole('link', { name: new RegExp(`^${c.name}\\b`) })).toBeVisible();
  }
});

for (const c of components) {
  test.describe(c.name, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/components/${c.slug}`);
    });

    test('has a title, a one-line usage rule and a Do / Don’t pair', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1, name: c.name })).toBeVisible();
      await expect(page.locator('[data-usage-rule]')).not.toBeEmpty();
      await expect(page.locator('[data-do]')).toBeVisible();
      await expect(page.locator('[data-dont]')).toBeVisible();
    });

    test('shows a live states row', async ({ page }) => {
      const states = page.locator('[data-state-name]');
      const names = await states.evaluateAll((els) =>
        els.map((e) => e.getAttribute('data-state-name')),
      );
      expect(names).toContain('default');
      if (c.interactive) {
        for (const s of ['hover', 'focus-visible', 'disabled']) expect(names).toContain(s);
      }
      if (c.slug === 'button') expect(names).toContain('loading');
    });

    test('re-themes only its demo with the Light / Dark / High contrast toggle', async ({
      page,
    }) => {
      const demo = page.locator('[data-demo]').first();
      const toggle = page.getByRole('radiogroup', { name: 'Demo theme' });
      await toggle.getByRole('radio', { name: 'Dark' }).check();
      await expect(demo).toHaveAttribute('data-theme', 'dark');
      expect(await demo.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
        'rgb(18, 18, 20)',
      );
      await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
      await toggle.getByRole('radio', { name: 'High contrast' }).check();
      expect(await demo.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
        'rgb(0, 0, 0)',
      );
    });

    test('states three accessibility facts that match the test data', async ({ page }) => {
      const facts = page.locator('[data-fact]');
      await expect(facts).toHaveCount(3);
      const contrast = page.locator('[data-fact="contrast"]');
      const fg = await contrast.getAttribute('data-fg');
      const bg = await contrast.getAttribute('data-bg');
      if (fg && bg) {
        const lowest = Math.min(
          ...report.results.filter((r) => r.fg === fg && r.bg === bg).map((r) => r.ratio),
        );
        await expect(contrast).toContainText(`${lowest.toFixed(2)}:1`);
      }
      const target = page.locator('[data-fact="target"]');
      const selector = await target.getAttribute('data-target-selector');
      const claimed = Number(await target.getAttribute('data-target-px'));
      if (selector) {
        const box = await page.locator(`[data-demo] ${selector}`).first().boundingBox();
        expect(box, 'target element').not.toBeNull();
        expect(Math.round(Math.min(box!.width, box!.height))).toBeGreaterThanOrEqual(claimed);
        expect(claimed).toBeGreaterThanOrEqual(24);
      }
      await expect(page.locator('[data-fact="focus"]')).toContainText('2px');
    });

    test('has a copyable snippet that notes the tokens it uses', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      const snippet = page.locator('[data-snippet]');
      await expect(snippet).toContainText('Tokens used:');
      await expect(snippet).toContainText('--hb-');
      await page.getByRole('button', { name: 'Copy code' }).click();
      await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
      const clipboard = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboard).toContain('@ianmiyazato/harbor-react');
    });

    test('has a props table generated from the TypeScript types', async ({ page }) => {
      const table = page.getByRole('table', { name: /props/i });
      await expect(table.getByRole('rowheader', { name: c.prop, exact: true })).toBeVisible();
    });

    test('every demo control is reachable with the keyboard', async ({ page }) => {
      await expectDemoReachable(page);
    });
  });
}

async function expectDemoReachable(page: Page) {
  // Islands hydrate on visibility; controls may also be disabled while a demo loads.
  await page.waitForFunction(() =>
    [...document.querySelectorAll('[data-demo] astro-island')].every((i) => !i.hasAttribute('ssr')),
  );
  const collect = () =>
    page.evaluate(() => {
      const els = [...document.querySelectorAll<HTMLElement>('[data-demo] *')].filter(
        (el) =>
          el.tabIndex >= 0 &&
          !(el as HTMLButtonElement).disabled &&
          el.matches('a[href], button, input, select, textarea, [tabindex]') &&
          !el.closest('[inert], [aria-hidden="true"]') &&
          el.offsetParent !== null,
      );
      document.querySelectorAll<HTMLElement>('[data-kb]').forEach((el) => delete el.dataset.kb);
      els.forEach((el, i) => (el.dataset.kb = String(i)));
      return els.length;
    });
  // Wait until the set of tab stops settles (widgets assign roving tab stops after hydrating).
  let previous = -1;
  await expect
    .poll(
      async () => {
        const count = await collect();
        const stable = count > 0 && count === previous;
        previous = count;
        return stable;
      },
      { timeout: 5_000, intervals: [200] },
    )
    .toBe(true);
  const total = await collect();
  await page.locator('h1').focus();
  const reached = new Set<string>();
  const trail: string[] = [];
  for (let i = 0; i < total * 3 + 40 && reached.size < total; i++) {
    await page.keyboard.press('Tab');
    // Composite widgets (a Radix tablist) delegate focus to a child, so count the nearest marked ancestor.
    const kb = await page.evaluate(
      () => (document.activeElement?.closest('[data-kb]') as HTMLElement | null)?.dataset.kb,
    );
    if (kb) reached.add(kb);
    trail.push(kb ?? '-');
  }
  const marked = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-kb]')].map(
      (e) => `${e.dataset.kb}:${e.tagName}:${e.getAttribute('role')}`,
    ),
  );
  expect(
    reached.size,
    `reached ${[...reached]} of ${marked.join(' ')} via ${trail.join(' ')}`,
  ).toBe(total);
}

test.describe('Button specifics', () => {
  test('loading keeps the button width, measured in pixels', async ({ page }) => {
    await page.goto('/components/button');
    const button = page.getByTestId('loading-demo');
    const before = await button.evaluate((el) => el.getBoundingClientRect().width);
    await page.getByRole('switch', { name: 'Loading' }).click();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    const after = await button.evaluate((el) => el.getBoundingClientRect().width);
    expect(after).toBe(before);
  });

  test('uses reduced motion tokens when the OS asks for reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/components/button');
    const duration = await page
      .getByTestId('loading-demo')
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(duration).toBe('0.08s');
    await context.close();
  });
});
