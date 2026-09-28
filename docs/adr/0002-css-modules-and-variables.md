# ADR 0002: CSS Modules and CSS variables over CSS-in-JS

- Status: accepted (M0)
- Deciders: Ian Miyazato

## Context

Harbor needs three themes, a reduced-motion mapping and a scoped slow-motion mode, with zero runtime
cost in a static docs site. Runtime CSS-in-JS would add JavaScript to every page, serialize styles
during render and make server rendering of the states rows more complex.

## Decision

Style components with CSS Modules that read only semantic CSS variables (`--hb-*`) from
`@ianmiyazato/harbor-tokens/tokens.css`. A theme is a `[data-theme]` block that re-declares the
semantic variables; reduced motion is a `@media` block plus `[data-motion='reduced']`; slow motion is
`[data-timescale]` multiplying every duration by `--hb-timescale`. Stylelint forbids raw colors, sizes,
durations, weights, z-indexes and palette primitives in component CSS.

## Consequences

- No styling runtime: Button costs 0.64 kB gzip of JavaScript; all styles ship as one 4.4 kB gzip
  stylesheet.
- Switching a theme or motion preference changes no component code and no class names, and it can be
  scoped to any subtree (the docs' per-demo theme toggle, the lab's per-tile controls).
- Pseudo-class states cannot be forced from props, so component CSS also matches
  `[data-preview='hover' | 'focus-visible' | 'active']` for docs, tests and screenshots (D-017).
- Custom properties resolve `var()` where declared, so scoped slow motion needs the durations
  re-declared under `[data-timescale]` (D-015). Browsers may serialize `calc(240ms * 5)` as
  `calc(.24s * 5)`; JavaScript that reads tokens parses either form.
