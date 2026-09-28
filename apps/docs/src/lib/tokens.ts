import report from '@ianmiyazato/harbor-tokens/contrast-report.json';
import tokenFile from '@ianmiyazato/harbor-tokens/tokens.json';

export type ThemeName = 'light' | 'dark' | 'hc';
export const themeLabels: Record<ThemeName, string> = {
  light: 'Light',
  dark: 'Dark',
  hc: 'High contrast',
};

export interface TokenEntry {
  name: string;
  category: string;
  tier: 'primitive' | 'semantic';
  description: string;
  value: unknown;
  unit?: string;
  motionType?: string;
  reduced?: { value: string | number; strategy: 'fade' | 'none' };
  cssVar: string;
  css: string | Record<ThemeName, string>;
}

export const tokens = tokenFile.tokens as TokenEntry[];
export const byName = new Map(tokens.map((t) => [t.name, t]));
export const contrast = report;

/** Resolve a token to a literal value for a theme, following `{palette.*}` references. */
export function resolve(name: string, theme: ThemeName = 'light'): string {
  const token = byName.get(name);
  if (!token) throw new Error(`Unknown token ${name}`);
  const raw =
    typeof token.value === 'object' && token.value && 'light' in token.value
      ? (token.value as Record<ThemeName, string>)[theme]
      : String(token.value);
  const ref = /^\{(.+)\}$/.exec(raw);
  return ref ? resolve(ref[1] as string, theme) : raw;
}

/** Black or white, whichever reads better on `hex`. */
export function inkFor(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return l > 0.179 ? '#000000' : '#FFFFFF';
}

export const ofCategory = (category: string) => tokens.filter((t) => t.category === category);
export const semanticCount = tokens.filter((t) => t.tier === 'semantic').length;
