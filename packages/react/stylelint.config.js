/**
 * Token-only styling for component CSS. Every color, size, duration, easing, weight and layer
 * must come from a semantic `--hb-*` variable, so a theme or motion change is a token swap.
 * Palette primitives (`--hb-palette-*`) are private to the tokens package.
 */
const tokenOnly = ['/^var\\(--hb-(?!palette-)/', 'inherit', 'initial', 'unset'];

/** @type {import('stylelint').Config} */
export default {
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': [
      'rgb',
      'rgba',
      'hsl',
      'hsla',
      'hwb',
      'lab',
      'lch',
      'oklab',
      'oklch',
      'color',
    ],
    'unit-disallowed-list': [
      'px',
      'rem',
      'em',
      'ms',
      's',
      'pt',
      'pc',
      'cm',
      'mm',
      'in',
      'ch',
      'ex',
    ],
    'declaration-property-value-disallowed-list': { '/.*/': ['/--hb-palette-/'] },
    'declaration-property-value-allowed-list': {
      'font-family': tokenOnly,
      'font-size': tokenOnly,
      'font-weight': tokenOnly,
      'line-height': tokenOnly,
      'letter-spacing': tokenOnly,
      'z-index': tokenOnly,
      'border-radius': tokenOnly,
      'box-shadow': [...tokenOnly, 'none'],
      opacity: [...tokenOnly, '0', '1'],
      '/^(transition|animation)-timing-function$/': [...tokenOnly, 'linear', 'steps(1)'],
      '/^(transition|animation)-(duration|delay)$/': [...tokenOnly, '0'],
    },
    // Correctness
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': true,
    'no-duplicate-selectors': true,
    'property-no-unknown': true,
    'unit-no-unknown': true,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
  },
};
