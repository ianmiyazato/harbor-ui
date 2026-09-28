# Token rules

- Primitive tokens hold raw values (`teal.600 = #1F6F5C`). Nothing outside `packages/tokens` reads them.
- Semantic tokens (`color.text.muted`, `color.action.primary`, `color.border.focus`) are the public API.
- A theme is a mapping `semantic -> primitive`. Light, dark and high contrast share the same semantic names.
- Reduced motion is also a mapping: every duration, offset and scale token has a reduced value.
- Component CSS may only use `var(--hb-*)` semantic variables. Stylelint rejects hex/rgb/hsl colors,
  named colors and `px`/`rem`/`em`/`ms`/`s` literals in `packages/react/src/**/*.module.css`.
