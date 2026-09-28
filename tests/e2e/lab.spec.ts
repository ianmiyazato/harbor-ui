import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
  auditMotion,
  expectCompositorOnly,
  expectNoShift,
  hydrated,
  setReduced,
  setSlow,
  tile,
  tiles,
  watchShifts,
} from './lab.helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/lab');
  await hydrated(page);
});

test('the lab has six interaction tiles', async ({ page }) => {
  await expect(page.locator('[data-lab-tile]')).toHaveCount(6);
});

for (const id of tiles) {
  test.describe(`${id} tile`, () => {
    test('has a spec panel, Replay, slow motion, reduced motion and a source link', async ({
      page,
    }) => {
      const t = tile(page, id);
      const spec = t.locator('[data-spec]');
      await expect(spec.locator('dt')).toHaveText([
        'Duration',
        /^(Easing|Spring)$/,
        'Communicates',
      ]);
      await expect(t.getByRole('button', { name: 'Replay' })).toBeVisible();
      await expect(t.getByRole('switch', { name: 'Slow motion ×5' })).toBeVisible();
      await expect(t.getByRole('switch', { name: 'Reduced motion' })).toBeVisible();
      await expect(t.getByRole('link', { name: /source/i })).toHaveAttribute(
        'href',
        /github\.com\/ianmiyazato\/harbor-ui\/blob\/main\/apps\/docs\/src\/lab\//,
      );
    });

    test('slow motion multiplies the duration tokens by five', async ({ page }) => {
      const t = tile(page, id);
      await setSlow(t);
      const base = await t.evaluate((el) =>
        getComputedStyle(el).getPropertyValue('--hb-motion-duration-base').trim(),
      );
      // Browsers may normalise `calc(240ms * 5)` to `calc(.24s * 5)`; compare the resolved time.
      const m = /calc\(\s*([\d.]+)(ms|s)\s*\*\s*([\d.]+)\s*\)/.exec(base);
      expect(m, base).not.toBeNull();
      expect(Number(m![1]) * (m![2] === 's' ? 1000 : 1) * Number(m![3])).toBeCloseTo(1200, 5);
    });

    test('Replay animates only transform and opacity, without layout shift', async ({ page }) => {
      const t = tile(page, id);
      await setSlow(t);
      await watchShifts(t);
      await t.getByRole('button', { name: 'Replay' }).click();
      await page.waitForTimeout(150);
      if (id === 'card') {
        const problems = await page.evaluate(() =>
          document
            .getAnimations()
            .filter((a) =>
              (a.effect as KeyframeEffect).pseudoElement?.startsWith('::view-transition'),
            )
            .flatMap((a) => {
              const frames = (a.effect as KeyframeEffect).getKeyframes();
              return [...new Set(frames.flatMap((f) => Object.keys(f)))].filter(
                (p) =>
                  ![
                    'transform',
                    'opacity',
                    'offset',
                    'easing',
                    'composite',
                    'computedOffset',
                  ].includes(p) &&
                  new Set(frames.map((f) => String((f as Record<string, unknown>)[p]))).size > 1,
              );
            }),
        );
        expect(problems).toEqual([]);
      } else {
        await expectCompositorOnly(t);
      }
      await page.waitForTimeout(id === 'skeleton' || id === 'pull' ? 9000 : 2500);
      await expectNoShift(page);
    });

    test('the reduced-motion preview removes movement', async ({ page }) => {
      const t = tile(page, id);
      await setReduced(t);
      await t.getByRole('button', { name: 'Replay' }).click();
      await page.waitForTimeout(100);
      const { problems } = await auditMotion(t);
      expect(problems).toEqual([]);
      const moving = await t.evaluate(
        (el) =>
          el.getAnimations({ subtree: true }).filter((a) => {
            const target = (a.effect as KeyframeEffect).target as Element | null;
            if (!target?.closest('[data-motion-part]')) return false;
            const frames = (a.effect as KeyframeEffect).getKeyframes();
            const transforms = new Set(frames.map((f) => String(f.transform ?? 'none')));
            return transforms.size > 1;
          }).length,
      );
      expect(moving, 'transform animations under reduced motion').toBe(0);
    });
  });
}

test.describe('1 optimistic like', () => {
  test('counts instantly with a pop, by pointer and by keyboard', async ({ page }) => {
    const t = tile(page, 'like');
    const like = t.getByRole('button', { name: /^Like/ });
    const count = t.locator('[data-count]');
    const before = Number(await count.textContent());
    await like.click();
    await expect(count).toHaveText(String(before + 1));
    await expect(like).toHaveAttribute('aria-pressed', 'true');
    await expectCompositorOnly(t);
    await page.waitForTimeout(900);
    await like.focus();
    await page.keyboard.press('Space');
    await expect(count).toHaveText(String(before));
    await expect(like).toHaveAttribute('aria-pressed', 'false');
  });

  test('rolls back with a shake and an inline retry when the request fails', async ({ page }) => {
    const t = tile(page, 'like');
    await t.getByRole('checkbox', { name: 'Next request fails' }).check();
    const count = t.locator('[data-count]');
    const before = Number(await count.textContent());
    await t.getByRole('button', { name: /^Like/ }).click();
    await expect(count).toHaveText(String(before + 1));
    await expect(t.getByText('Couldn’t save — retry')).toBeVisible();
    await expect(count).toHaveText(String(before));
    await t.getByRole('button', { name: 'Retry' }).click();
    await expect(count).toHaveText(String(before + 1));
    await expect(t.getByText('Couldn’t save — retry')).toBeHidden({ timeout: 3000 });
  });

  test('under reduced motion it only changes color and count', async ({ page }) => {
    const t = tile(page, 'like');
    await setReduced(t);
    await t.getByRole('button', { name: /^Like/ }).click();
    const running = await t.evaluate(
      (el) => el.getAnimations({ subtree: true }).filter((a) => a instanceof CSSAnimation).length,
    );
    expect(running).toBe(0);
  });
});

test.describe('2 drag to reorder', () => {
  const order = (page: Page) => tile(page, 'reorder').locator('[data-item]').allTextContents();

  test('reorders with the keyboard: Space lifts, arrows move, Space drops, and it is announced', async ({
    page,
  }) => {
    const t = tile(page, 'reorder');
    const first = (await order(page))[1]!;
    const handle = t.getByRole('button', { name: new RegExp(`^Reorder ${first}`) });
    await handle.focus();
    await page.keyboard.press('Space');
    await expect(t.locator('[data-lifted]')).toHaveCount(1);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    expect((await order(page))[3]).toContain(first);
    await expect(t.locator('[data-announcer]')).toHaveText(`${first} moved to position 4.`);
    await expect(handle).toBeFocused();
  });

  test('Escape cancels a keyboard move', async ({ page }) => {
    const t = tile(page, 'reorder');
    const initial = await order(page);
    const handle = t.getByRole('button', { name: new RegExp(`^Reorder ${initial[0]}`) });
    await handle.focus();
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    expect(await order(page)).toEqual(initial);
    await expect(t.locator('[data-announcer]')).toContainText('cancelled');
  });

  test('reorders by dragging the handle with the pointer', async ({ page }) => {
    const t = tile(page, 'reorder');
    const initial = await order(page);
    const handle = t.getByRole('button', { name: new RegExp(`^Reorder ${initial[0]}`) });
    await handle.scrollIntoViewIfNeeded();
    const box = (await handle.boundingBox())!;
    const slot =
      (await t.locator('[data-item]').nth(1).boundingBox())!.y -
      (await t.locator('[data-item]').nth(0).boundingBox())!.y;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await expect(t.locator('[data-lifted]')).toHaveCount(1);
    for (let i = 1; i <= 10; i++)
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + (slot * 2 * i) / 10);
    await page.mouse.up();
    await expect.poll(() => order(page)).not.toEqual(initial);
    expect((await order(page))[2]).toContain(initial[0]!);
    await expect(t.locator('[data-announcer]')).toHaveText(`${initial[0]} moved to position 3.`);
  });
});

test.describe('3 skeleton to content', () => {
  test('swaps a layout-matched skeleton for content without moving anything', async ({ page }) => {
    const t = tile(page, 'skeleton');
    await watchShifts(t);
    const region = t.locator('[aria-busy]');
    await t.getByRole('button', { name: 'Replay' }).click();
    await expect(region).toHaveAttribute('aria-busy', 'true');
    const loading = (await region.boundingBox())!;
    await expect(region).toHaveAttribute('aria-busy', 'false', { timeout: 5000 });
    const loaded = (await region.boundingBox())!;
    expect(loaded.height).toBe(loading.height);
    await expectNoShift(page);
  });
});

test.describe('4 toast with undo', () => {
  test('slides a toast 16px in 240ms, undo restores and announces politely', async ({ page }) => {
    const t = tile(page, 'toast');
    await t.getByRole('button', { name: 'Archive' }).click();
    const toast = t.getByRole('listitem');
    await expect(toast).toBeVisible();
    const enter = await toast.evaluate((el) => {
      const a = el.getAnimations().find((x) => x instanceof CSSAnimation);
      const frames = (a?.effect as KeyframeEffect).getKeyframes();
      return {
        duration: (a?.effect as KeyframeEffect).getComputedTiming().duration,
        from: frames[0]?.transform,
      };
    });
    expect(enter.duration).toBe(240);
    expect(enter.from).toContain('16px');
    await expect(t.getByText('Archived')).toBeVisible();
    await t.getByRole('button', { name: 'Undo' }).click();
    await expect(t.locator('[data-announcer]')).toHaveText('Message restored.');
    await expect(t.getByRole('button', { name: 'Archive' })).toBeVisible();
  });

  test('the timer pauses while the toast is hovered', async ({ page }) => {
    test.setTimeout(30_000);
    const t = tile(page, 'toast');
    await t.getByRole('button', { name: 'Archive' }).click();
    await t.getByRole('listitem').hover();
    await page.waitForTimeout(7000);
    await expect(t.getByRole('listitem')).toBeVisible();
  });
});

test.describe('5 card to detail', () => {
  test('opens a card as a detail view with a view transition, and Back returns focus', async ({
    page,
  }) => {
    const t = tile(page, 'card');
    const card = t.getByRole('button', { name: /Harbor at dawn/ });
    await card.click();
    await expect(t.getByRole('heading', { name: 'Harbor at dawn' })).toBeVisible();
    await expect(t.getByRole('button', { name: 'Back to all photos' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(card).toBeFocused();
  });

  test('falls back to a crossfade without the View Transitions API', async ({ page }) => {
    await page.addInitScript(() => {
      delete (Document.prototype as unknown as { startViewTransition?: unknown })
        .startViewTransition;
    });
    await page.goto('/lab');
    await hydrated(page);
    const t = tile(page, 'card');
    await t.getByRole('button', { name: /Harbor at dawn/ }).click();
    const fade = await t
      .locator('[data-detail]')
      .evaluate((el) =>
        el
          .getAnimations()
          .map((a) => Object.keys((a.effect as KeyframeEffect).getKeyframes()[0] ?? {})),
      );
    expect(fade.flat()).toContain('opacity');
  });
});

test.describe('6 pull to refresh', () => {
  test('rubber-bands at half the drag, snaps past the threshold and refreshes', async ({
    page,
  }) => {
    const t = tile(page, 'pull');
    const panel = t.locator('[data-pull-panel]');
    await panel.scrollIntoViewIfNeeded();
    const content = t.locator('[data-pull-content]');
    const box = (await panel.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 20);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) await page.mouse.move(box.x + box.width / 2, box.y + 20 + 16 * i);
    const offset = await content.evaluate(
      (el) => new DOMMatrix(getComputedStyle(el).transform).m42,
    );
    expect(offset).toBeCloseTo(80, 0);
    await page.mouse.up();
    await expect(t.getByRole('status')).toHaveText('Refreshing…');
    await expect(t.getByRole('status')).toHaveText(/Updated/, { timeout: 5000 });
  });

  test('a short pull snaps back without refreshing', async ({ page }) => {
    const t = tile(page, 'pull');
    await t.locator('[data-pull-panel]').scrollIntoViewIfNeeded();
    const box = (await t.locator('[data-pull-panel]').boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + 60, { steps: 5 });
    await page.mouse.up();
    await expect(t.getByRole('status')).not.toHaveText('Refreshing…');
  });

  test('the Refresh button is the keyboard and assistive-tech equivalent', async ({ page }) => {
    const t = tile(page, 'pull');
    await t.getByRole('button', { name: 'Refresh' }).focus();
    await page.keyboard.press('Enter');
    await expect(t.getByRole('status')).toHaveText('Refreshing…');
    await expect(t.getByRole('status')).toHaveText(/Updated/, { timeout: 5000 });
  });
});
