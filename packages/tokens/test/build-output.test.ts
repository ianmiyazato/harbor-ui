import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildOutputs, cssVarName, isThemed, tokens, writeBuild } from '../src/index.ts';

const names = tokens.map((t) => t.name).sort();
const cssNames = tokens.map((t) => cssVarName(t.name)).sort();
const themed = tokens.filter((t) => isThemed(t.value));
const motion = tokens.filter((t) => t.category === 'motion');

/** Return the body of the first block whose header is exactly `selector {`. */
function block(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  expect(start, `missing block: ${selector}`).toBeGreaterThanOrEqual(0);
  let depth = 0;
  for (let i = css.indexOf('{', start); i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}') depth--;
    if (depth === 0) return css.slice(css.indexOf('{', start) + 1, i);
  }
  throw new Error(`unclosed block: ${selector}`);
}

const declared = (css: string) =>
  [...css.matchAll(/(--hb-[a-z0-9-]+)\s*:/g)].map((m) => m[1] as string);

const out = buildOutputs();

describe('build outputs contain the same token set', () => {
  it('CSS declares a variable for every token', () => {
    expect([...new Set(declared(out.css))].sort()).toEqual(cssNames);
  });

  it('JSON lists every token', () => {
    const json = JSON.parse(out.json) as { tokens: { name: string }[] };
    expect(json.tokens.map((t) => t.name).sort()).toEqual(names);
  });

  it('the TS module exports every token, typed by name', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'harbor-tokens-'));
    writeBuild(dir);
    const mod = (await import(pathToFileURL(join(dir, 'index.js')).href)) as {
      tokens: Record<string, unknown>;
      cssVar: (name: string) => string;
    };
    expect(Object.keys(mod.tokens).sort()).toEqual(names);
    expect(mod.cssVar('color.text.muted')).toBe('var(--hb-color-text-muted)');
    for (const name of names) expect(out.dts).toContain(`'${name}'`);
  });
});

describe('CSS output', () => {
  const themeBlocks = {
    light: block(out.css, ":root,\n[data-theme='light']"),
    dark: block(out.css, "[data-theme='dark']"),
    hc: block(out.css, "[data-theme='hc']"),
  };

  it('declares every themed token in every theme block', () => {
    const expected = themed.map((t) => cssVarName(t.name)).sort();
    for (const [theme, body] of Object.entries(themeBlocks)) {
      expect(declared(body).sort(), theme).toEqual(expected);
    }
  });

  it('maps semantic colors to palette variables, never raw hex', () => {
    for (const body of Object.values(themeBlocks)) {
      for (const line of body.split('\n').filter((l) => l.includes('--hb-color-'))) {
        expect(line).toMatch(/: var\(--hb-palette-[a-z0-9-]+\);$/);
      }
    }
  });

  it('follows the OS theme and contrast preferences when no theme is set', () => {
    expect(
      declared(
        block(block(out.css, '@media (prefers-color-scheme: dark)'), ':root:not([data-theme])'),
      ).length,
    ).toBe(themed.length);
    expect(
      declared(block(block(out.css, '@media (prefers-contrast: more)'), ':root:not([data-theme])'))
        .length,
    ).toBe(themed.length);
  });

  it('routes every duration through the slow-motion variable', () => {
    const body = block(out.css, ':root,\n[data-timescale]');
    for (const t of motion.filter((t) =>
      ['duration', 'spring', 'loop'].includes(t.motionType ?? ''),
    )) {
      expect(body).toMatch(
        new RegExp(`${cssVarName(t.name)}: calc\\(\\d+ms \\* var\\(--hb-timescale, 1\\)\\)`),
      );
    }
  });

  it('declares every motion token under prefers-reduced-motion and data-motion="reduced"', () => {
    const expected = motion.map((t) => cssVarName(t.name)).sort();
    const media = block(
      block(out.css, '@media (prefers-reduced-motion: reduce)'),
      ':root,\n  [data-timescale]',
    );
    expect(declared(media).sort()).toEqual(expected);
    const scoped = block(
      out.css,
      "[data-motion='reduced'],\n[data-motion='reduced'] [data-timescale]",
    );
    expect(declared(scoped).sort()).toEqual(expected);
    expect(scoped).toContain('--hb-motion-distance-enter: 0px;');
  });

  it('emits type and space in rem so they follow the user font size', () => {
    expect(out.css).toContain('--hb-font-size-base: 1rem;');
    expect(out.css).toContain('--hb-space-4: 1rem;');
    expect(out.css).toContain('--hb-radius-md: 8px;');
  });
});

describe('writeBuild', () => {
  let dir: string;
  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), 'harbor-tokens-'));
    writeBuild(dir);
  });

  it('writes CSS, JSON, JS, types and the contrast report', () => {
    for (const file of [
      'tokens.css',
      'tokens.json',
      'index.js',
      'index.d.ts',
      'contrast-report.json',
    ]) {
      expect(existsSync(join(dir, file)), file).toBe(true);
    }
    expect(readFileSync(join(dir, 'tokens.css'), 'utf8')).toBe(out.css);
  });
});
