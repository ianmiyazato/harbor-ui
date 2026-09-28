import { colors } from './color.ts';
import { elevation } from './elevation.ts';
import { layout } from './layout.ts';
import { palette } from './palette.ts';
import { createResolver } from './resolve.ts';
import { typography } from './typography.ts';
import type { Token } from './types.ts';

export * from './types.ts';
export { cssVarName, isThemed, referencesOf } from './resolve.ts';

/** Every token, primitives first. */
export const tokens: Token[] = [...palette, ...colors, ...typography, ...layout, ...elevation];

/** Resolve a token to its literal value for a theme, following `{palette.*}` references. */
export const resolve = createResolver(tokens);
