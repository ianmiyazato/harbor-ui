# ADR 0001: Radix primitives for complex widgets

- Status: accepted (M0, revisited in M3)
- Deciders: Ian Miyazato

## Context

Harbor ships five widgets whose accessibility is mostly behavior, not styling: Select, Tabs, Dialog,
Tooltip and Toast. Each needs focus management, roving tab stops or focus traps, typeahead, dismissal
rules and screen-reader announcements that vary across browsers and assistive tech. Getting these
right by hand is weeks of work and a steady source of regressions.

## Decision

Build these five on Radix primitives (`@radix-ui/react-*`). Harbor owns the API surface, the tokens,
every visual state, motion and the documentation; Radix owns the behavior. Simple controls (Button,
Input, Checkbox, Switch, Badge, Skeleton) stay native elements with no dependency.

## Consequences

- Focus traps, typeahead, `aria-*` wiring and dismissal come from a library with years of AT testing.
  Harbor's tests assert the behavior anyway (keyboard, focus return, scroll lock, polite toasts).
- Size: the full package is 45.1 kB gzip with Radix included, over the 35 kB target (D-020). Radix
  Select alone is 31.4 kB (floating-ui, react-remove-scroll, focus scope). CI enforces per-usage
  budgets instead, and a single Button stays at 0.64 kB.
- Portalled content escapes local themes, so Harbor copies `data-theme`, `data-motion` and the
  slow-motion timescale from the anchor onto the portal (D-019).
- Replacing a primitive later is contained: each widget is one wrapper file with its own tests.
