import { colors } from './color.ts';
import { elevation } from './elevation.ts';
import { layout } from './layout.ts';
import { palette } from './palette.ts';
import { createResolver } from './resolve.ts';
import { typography } from './typography.ts';
import { createContrastReport } from './contrast.ts';
import type { ContrastReport } from './contrast.ts';
import { contrastPairs } from './pairs.ts';
import type { ContrastPair } from './pairs.ts';
import { themes } from './types.ts';
import type { Token } from './types.ts';

export * from './types.ts';
export { cssVarName, isThemed, referencesOf } from './resolve.ts';

/** Every token, primitives first. */
export const tokens: Token[] = [...palette, ...colors, ...typography, ...layout, ...elevation];

/** Resolve a token to its literal value for a theme, following `{palette.*}` references. */
export const resolve = createResolver(tokens);

export { contrastPairs };
export type { ContrastPair, PairKind } from './pairs.ts';
export { contrastRatio, thresholds } from './contrast.ts';
export type { ContrastReport, ContrastResult } from './contrast.ts';

/** The contrast matrix for the given pairs (default: every pair the components use) in every theme. */
export function buildContrastReport(pairs: ContrastPair[] = contrastPairs): ContrastReport {
  return createContrastReport(pairs, themes, resolve);
}
