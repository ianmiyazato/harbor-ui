import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildContrastReport,
  contrastPairs,
  contrastRatio,
  thresholds,
  themes,
  tokens,
} from '../src/index.ts';

describe('contrastRatio (WCAG 2.x relative luminance)', () => {
  it('matches known reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    // #767676 is the classic lightest gray that passes 4.5:1 on white; #777777 just fails.
    expect(contrastRatio('#767676', '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#777777', '#FFFFFF')).toBeLessThan(4.5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#1F6F5C', '#FAFAF7')).toBeCloseTo(
      contrastRatio('#FAFAF7', '#1F6F5C'),
      10,
    );
  });

  it('rejects colors with alpha, which have no single contrast ratio', () => {
    expect(() => contrastRatio('#12121480', '#FFFFFF')).toThrow(/alpha/);
  });
});

describe('contrast pairs', () => {
  const names = new Set(tokens.map((t) => t.name));

  it('only pairs semantic color tokens that exist', () => {
    for (const pair of contrastPairs) {
      expect(names.has(pair.fg), pair.fg).toBe(true);
      expect(names.has(pair.bg), pair.bg).toBe(true);
      expect(pair.usedBy.length, `${pair.fg} on ${pair.bg} usedBy`).toBeGreaterThan(0);
    }
  });

  it('covers body text, large text and UI boundaries', () => {
    const kinds = new Set(contrastPairs.map((p) => p.kind));
    expect([...kinds].sort()).toEqual(['large-text', 'text', 'ui']);
    expect(thresholds).toEqual({ text: 4.5, 'large-text': 3, ui: 3 });
  });

  it('has no duplicate pairs', () => {
    const keys = contrastPairs.map((p) => `${p.fg}|${p.bg}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('contrast matrix', () => {
  const report = buildContrastReport();

  it('checks every pair in every theme', () => {
    expect(report.results).toHaveLength(contrastPairs.length * themes.length);
    expect(report.summary.checks).toBe(contrastPairs.length * themes.length);
  });

  for (const theme of themes) {
    it(`passes every pair in the ${theme} theme`, () => {
      const failures = report.results
        .filter((r) => r.theme === theme && !r.pass)
        .map((r) => `${r.fg} on ${r.bg}: ${r.ratio}:1 < ${r.required}:1`);
      expect(failures).toEqual([]);
    });
  }

  it('fails a pair below its threshold', () => {
    const failing = buildContrastReport([
      { fg: 'color.border.default', bg: 'color.surface.default', kind: 'text', usedBy: ['test'] },
    ]);
    expect(failing.results.every((r) => r.pass)).toBe(false);
    expect(failing.summary.passed).toBeLessThan(failing.summary.checks);
  });

  it('writes dist/contrast-report.json for the docs site', () => {
    const dir = resolvePath(__dirname, '../dist');
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolvePath(dir, 'contrast-report.json'), JSON.stringify(report, null, 2) + '\n');
    expect(report.summary.passRate).toBe(1);
    expect(report.results[0]).toMatchObject({
      theme: expect.any(String),
      fgHex: expect.stringMatching(/^#[0-9A-F]{6}$/),
      bgHex: expect.stringMatching(/^#[0-9A-F]{6}$/),
      ratio: expect.any(Number),
    });
  });
});
