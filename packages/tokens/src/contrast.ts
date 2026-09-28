import type { ContrastPair, PairKind } from './pairs.ts';
import type { ThemeName } from './types.ts';

export const thresholds: Record<PairKind, number> = { text: 4.5, 'large-text': 3, ui: 3 };

function channel(hex: string, offset: number): number {
  const c = parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  if (h.length !== 6) throw new Error(`Contrast needs opaque #RRGGBB colors; ${hex} has alpha`);
  return 0.2126 * channel(h, 0) + 0.7152 * channel(h, 2) + 0.0722 * channel(h, 4);
}

/** WCAG 2.x contrast ratio between two opaque hex colors (1 to 21). */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

export interface ContrastResult extends ContrastPair {
  theme: ThemeName;
  fgHex: string;
  bgHex: string;
  ratio: number;
  required: number;
  pass: boolean;
}

export interface ContrastReport {
  thresholds: typeof thresholds;
  themes: readonly ThemeName[];
  summary: { pairs: number; checks: number; passed: number; passRate: number };
  byTheme: Record<ThemeName, { checks: number; passed: number; minRatio: number }>;
  results: ContrastResult[];
}

export function createContrastReport(
  pairs: ContrastPair[],
  themeNames: readonly ThemeName[],
  resolve: (name: string, theme: ThemeName) => string | number,
): ContrastReport {
  const results = themeNames.flatMap((theme) =>
    pairs.map((pair): ContrastResult => {
      const fgHex = String(resolve(pair.fg, theme));
      const bgHex = String(resolve(pair.bg, theme));
      // Round down so a displayed 4.50 is never a rounded-up 4.497.
      const ratio = Math.floor(contrastRatio(fgHex, bgHex) * 100) / 100;
      const required = thresholds[pair.kind];
      return { ...pair, theme, fgHex, bgHex, ratio, required, pass: ratio >= required };
    }),
  );
  const tally = (rs: ContrastResult[]) => ({
    checks: rs.length,
    passed: rs.filter((r) => r.pass).length,
    minRatio: Math.min(...rs.map((r) => r.ratio)),
  });
  const passed = results.filter((r) => r.pass).length;
  return {
    thresholds,
    themes: themeNames,
    summary: {
      pairs: pairs.length,
      checks: results.length,
      passed,
      passRate: results.length ? passed / results.length : 0,
    },
    byTheme: Object.fromEntries(
      themeNames.map((t) => [t, tally(results.filter((r) => r.theme === t))]),
    ) as ContrastReport['byTheme'],
    results,
  };
}
