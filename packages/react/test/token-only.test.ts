import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import stylelint from 'stylelint';
import { describe, expect, it } from 'vitest';

const configFile = resolve(__dirname, '../stylelint.config.js');
const srcDir = resolve(__dirname, '../src');

async function lint(code: string) {
  const { results } = await stylelint.lint({
    code,
    configFile,
    codeFilename: 'Fixture.module.css',
  });
  return (results[0]?.warnings ?? []).map((w) => w.rule);
}

describe('token-only styling (stylelint)', () => {
  it.each([
    ['hex colors', '.a { color: #1f6f5c; }', 'color-no-hex'],
    ['named colors', '.a { color: red; }', 'color-named'],
    ['color functions', '.a { background: rgb(0 0 0 / 0.5); }', 'function-disallowed-list'],
    ['px sizes', '.a { padding: 12px; }', 'unit-disallowed-list'],
    ['rem sizes', '.a { gap: 0.5rem; }', 'unit-disallowed-list'],
    ['raw durations', '.a { transition: opacity 200ms ease; }', 'unit-disallowed-list'],
    ['raw seconds', '.a { animation-duration: 1s; }', 'unit-disallowed-list'],
    [
      'palette primitives',
      '.a { color: var(--hb-palette-teal-600); }',
      'declaration-property-value-disallowed-list',
    ],
    ['raw font weights', '.a { font-weight: 600; }', 'declaration-property-value-allowed-list'],
    ['raw z-index', '.a { z-index: 10; }', 'declaration-property-value-allowed-list'],
    [
      'raw easing',
      '.a { transition-timing-function: ease-in-out; }',
      'declaration-property-value-allowed-list',
    ],
  ])('rejects %s', async (_, code, rule) => {
    expect(await lint(code)).toContain(rule);
  });

  it('accepts semantic tokens, calc() over tokens, percentages and unitless numbers', async () => {
    const code = `
      .a {
        color: var(--hb-color-text-default);
        padding: var(--hb-space-2) var(--hb-space-4);
        border: var(--hb-border-width-thin) solid var(--hb-color-border-strong);
        font-weight: var(--hb-font-weight-semibold);
        transition: transform var(--hb-motion-duration-fast) var(--hb-motion-easing-standard);
        transform: translateY(calc(var(--hb-motion-distance-enter) * -1)) scale(1);
        width: 100%;
        opacity: 0;
        z-index: var(--hb-z-overlay);
      }
    `;
    expect(await lint(code)).toEqual([]);
  });

  it('finds no raw values in any component stylesheet', async () => {
    const files = readdirSync(srcDir, { recursive: true, encoding: 'utf8' })
      .filter((f) => f.endsWith('.css'))
      .map((f) => join(srcDir, f));
    const { results } = await stylelint.lint({ files, configFile, allowEmptyInput: true });
    const problems = results.flatMap((r) =>
      r.warnings.map((w) => `${r.source}:${w.line} ${w.text}`),
    );
    expect(problems).toEqual([]);
  });
});
