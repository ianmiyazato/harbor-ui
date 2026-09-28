# Changelog (one line per PR)

- M0 bootstrap: repository, license, AGENTS.md.
- M0 #1 workspace (pnpm, turbo, TS, ESLint, Vitest), CI `check` job, Vercel config + tested ignore step.
- M0 #2 close M0: toolchain record, Vercel project, known gaps.
- M1 #5 tokens: palette (OKLCH scales), 44 semantic colors × 3 themes, type, space, radius, size, elevation; schema tests.
- M1 #6 tokens: contrast matrix, 39 pairs × 3 themes = 117 checks, all passing; writes dist/contrast-report.json.
- M1 #7 tokens: motion (6 durations, 3 easings, 3 springs → CSS linear(), distances, scales, shimmer loop), each with a reduced counterpart.
- M1 #8 tokens: build emits tokens.css (themes, OS prefs, timescale, reduced motion), tokens.json, typed index.js/d.ts, contrast report; 205 tokens.
- M2 #9 react: package scaffold (Vite lib, preserveModules, CSS Modules, jsdom tests), useReducedMotion.
- M2 #10 react: stylelint token-only rules (no hex/rgb/named colors, px/rem/ms/s, palette vars, raw weights/z/easing), tested with fixtures.
- M2 #11 button: 4 variants × 3 sizes, loading without layout shift, reduced-motion spinner, states registry (`@ianmiyazato/harbor-react/states`), axe on 24 variant×state combos.
- M2 #12 icon-button: square Button, `aria-label` required at the type level (proven by @ts-expect-error in typecheck), axe on 24 combos.
- M2 #13 input: label, hint, polite error region, character count (visual n/max + one status at the limit), controlled/uncontrolled.
- M2 #14 checkbox: native input over a token-styled box, checked/indeterminate/controlled/uncontrolled, description + error, 24px row target.
- M2 #15 switch: button role=switch with <label>, spring thumb (CSS linear()), controlled/uncontrolled, 42×24 target.
- M2 #16 badge: 5 tones (each fg/bg pair in the contrast matrix), sm/md, decorative dot, outlined in high contrast.
