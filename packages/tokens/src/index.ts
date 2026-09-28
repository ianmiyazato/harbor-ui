import { colors } from './color.ts';
import { elevation } from './elevation.ts';
import { layout } from './layout.ts';
import { emitCss, emitJson, emitModule } from './emit.ts';
import { motion } from './motion.ts';
import { palette } from './palette.ts';
import { createResolver } from './resolve.ts';
import { typography } from './typography.ts';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createContrastReport } from './contrast.ts';
import type { ContrastReport } from './contrast.ts';
import { contrastPairs } from './pairs.ts';
import type { ContrastPair } from './pairs.ts';
import { themes } from './types.ts';
import type { Token } from './types.ts';

export * from './types.ts';
export { cssVarName, isThemed, referencesOf } from './resolve.ts';
export { springSettleMs, springToLinear } from './spring.ts';

/** Every token, primitives first. */
export const tokens: Token[] = [
  ...palette,
  ...colors,
  ...typography,
  ...layout,
  ...elevation,
  ...motion,
];

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

/** Every build artifact as a string, so tests can check them without touching disk. */
export function buildOutputs() {
  const { js, dts } = emitModule(tokens, themes);
  return {
    css: emitCss(tokens),
    json: emitJson(tokens, themes),
    js,
    dts,
    contrastReport: JSON.stringify(buildContrastReport(), null, 2) + '\n',
  };
}

/** Write tokens.css, tokens.json, index.js, index.d.ts and contrast-report.json to `dir`. */
export function writeBuild(dir: string) {
  const out = buildOutputs();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'tokens.css'), out.css);
  writeFileSync(join(dir, 'tokens.json'), out.json);
  writeFileSync(join(dir, 'index.js'), out.js);
  writeFileSync(join(dir, 'index.d.ts'), out.dts);
  writeFileSync(join(dir, 'contrast-report.json'), out.contrastReport);
}
