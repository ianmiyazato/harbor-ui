# ADR 0004: Semantic tokens are the public API

- Status: accepted (M1)
- Deciders: Ian Miyazato

## Context

A small team needs to restyle several products and markets safely. If components reference palette
values directly, every theme becomes a fork and every brand change touches component code.

## Decision

Two tiers. Primitives (`palette.*`) hold raw values and are private to the tokens package. Semantic
tokens (`color.action.primary`, `color.text.muted`, `motion.duration.base`, …) are the only API
components may read. Each theme maps semantic names to primitives; reduced motion maps motion tokens to
their reduced counterparts. One source (`packages/tokens/src`) emits CSS variables, a typed JS module
and JSON, and tests prove the three carry the same set.

## Consequences

- 127 semantic tokens, 3 themes, one set of names. Restyling means editing mappings, never components.
- Accessibility is checkable at the token level: the contrast matrix computes 39 foreground/background
  pairs the components render, in every theme, 117 checks, and fails CI below 4.5:1 (text) or 3:1
  (large text, UI boundaries).
- Every motion value has a named token and a reduced counterpart; springs compile to CSS `linear()`.
- Adding a semantic token is a reviewed decision with a description, category and per-theme mapping,
  enforced by the schema test. That friction is intentional.
