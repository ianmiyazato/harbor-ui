/** The shape every Harbor token follows. Tokens are data first; CSS, TS and JSON are emitted from it. */

export const categories = [
  'color',
  'font',
  'space',
  'radius',
  'size',
  'border',
  'elevation',
  'opacity',
  'z',
  'motion',
] as const;
export type Category = (typeof categories)[number];

export const themes = ['light', 'dark', 'hc'] as const;
export type ThemeName = (typeof themes)[number];

/**
 * `primitive` tokens are raw palette values and stay private to this package.
 * `semantic` tokens are the public API that components consume.
 */
export type Tier = 'primitive' | 'semantic';

/** A value per theme. Strings may be literals or `{token.name}` references to primitives. */
export type ThemedValue = Record<ThemeName, string>;

export interface Spring {
  stiffness: number;
  damping: number;
  mass: number;
}

export type TokenValue = string | number | ThemedValue | Spring;

/** How a motion token degrades under `prefers-reduced-motion: reduce`. */
export interface ReducedMotion {
  value: string | number;
  /** `fade`: keep a shorter opacity change. `none`: no movement at all. */
  strategy: 'fade' | 'none';
}

export interface Token {
  /** Dot-separated, lowercase, kebab-case segments: `color.text.muted`. */
  name: string;
  category: Category;
  tier: Tier;
  description: string;
  value: TokenValue;
  /** Unit of numeric values in the source. CSS output may convert (px → rem for type and space). */
  unit?: 'px' | 'ms' | 'em';
  /** Motion tokens only. */
  reduced?: ReducedMotion;
  /** Motion tokens only: what kind of motion value this is. */
  motionType?: 'duration' | 'easing' | 'spring' | 'distance' | 'scale' | 'loop';
}
