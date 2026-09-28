import axe from 'axe-core';
import { expect, vi } from 'vitest';

/** Make `(prefers-reduced-motion: reduce)` match, like the OS setting. */
export function emulateReducedMotion() {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}

/**
 * Run axe on a rendered container and fail with readable messages.
 * Color contrast is checked by the token contrast matrix and the Playwright suite;
 * jsdom has no layout or computed colors, so that rule is off here.
 */
export async function expectNoAxeViolations(container: Element) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  const messages = results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`,
  );
  expect(messages).toEqual([]);
}
