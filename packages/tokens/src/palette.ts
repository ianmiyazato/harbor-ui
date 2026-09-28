import type { Token } from './types.ts';

/**
 * Primitive palette. Private to this package: components never read these directly.
 * Scales were derived in OKLCH (fixed hue, lightness steps 0.975 → 0.215, chroma peaking at 500–600)
 * around the brand anchor teal.600 = #1F6F5C, then committed as literal values so they are reviewable.
 */
// prettier-ignore
const scales = {
  teal: {
    note: 'Brand teal, anchored at 600 = #1F6F5C.',
    steps: ['#F0F9F6', '#E0F2EC', '#BFE2D7', '#96CDBC', '#6FB39F', '#4B9682', '#1F6F5C', '#125D4C', '#07483A', '#033429', '#001F18'],
  },
  neutral: {
    note: 'Warm gray (OKLCH hue 75) for text, borders and light surfaces.',
    steps: ['#F8F6F4', '#EDEBE7', '#DAD7D3', '#C0BDB9', '#A19E99', '#7D7A75', '#63605B', '#4D4A45', '#383531', '#24211E', '#151311'],
  },
  green: {
    note: 'Success status hue.',
    steps: ['#F0FAF2', '#DFF3E2', '#BEE5C4', '#95D0A0', '#6DB77D', '#499A5E', '#1D7339', '#0F602C', '#044A1F', '#023614', '#012009'],
  },
  amber: {
    note: 'Warning status hue.',
    steps: ['#FDF5EE', '#FAEADB', '#F3D3B5', '#E4B588', '#CE965E', '#B27739', '#895105', '#734303', '#593301', '#412301', '#281400'],
  },
  red: {
    note: 'Danger status and destructive action hue.',
    steps: ['#FEF4F3', '#FEE7E3', '#FECBC4', '#FEA499', '#F5786C', '#D9544A', '#AC2724', '#931919', '#740D0E', '#560607', '#380102'],
  },
  blue: {
    note: 'Info status and focus ring hue.',
    steps: ['#F2F7FE', '#E2EEFE', '#C1DCFE', '#94C3FE', '#69A6F2', '#4687D8', '#1D60AD', '#114F94', '#073C76', '#032B57', '#001938'],
  },
} as const;

const stepNames = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/** Cool near-blacks for dark surfaces, anchored at 900 = #121214. */
const ink = {
  950: [
    '#0C0C0E',
    'Deepest dark surface, used for sunken wells and text on light fills in dark mode.',
  ],
  900: ['#121214', 'Dark theme page surface.'],
  850: ['#1A1A1D', 'Dark theme raised surface (cards).'],
  800: ['#222226', 'Dark theme overlay surface (dialogs, popovers, toasts).'],
  700: ['#2E2E33', 'Dark theme secondary action fill and default borders.'],
  600: ['#3C3C42', 'Dark theme secondary action hover.'],
} as const;

const base = {
  white: ['#FFFFFF', 'Pure white: raised light surfaces and text on filled actions.'],
  black: ['#000000', 'Pure black, the high-contrast surface.'],
  paper: ['#FAFAF7', 'Light theme page surface, a barely warm off-white.'],
  signal: ['#FFD23F', 'High-contrast focus yellow.'],
  'scrim-light': ['#1212147A', 'Light theme modal scrim (ink 900 at 48%).'],
  'scrim-dark': ['#000000B3', 'Dark theme modal scrim (black at 70%).'],
  'scrim-hc': ['#000000E6', 'High-contrast modal scrim (black at 90%).'],
} as const;

export const palette: Token[] = [
  ...Object.entries(scales).flatMap(([hue, { note, steps }]) =>
    steps.map((value, i) => ({
      name: `palette.${hue}.${stepNames[i]}`,
      category: 'color' as const,
      tier: 'primitive' as const,
      value,
      description: `${note} Step ${stepNames[i]}.`,
    })),
  ),
  ...Object.entries(ink).map(([step, [value, description]]) => ({
    name: `palette.ink.${step}`,
    category: 'color' as const,
    tier: 'primitive' as const,
    value,
    description,
  })),
  ...Object.entries(base).map(([key, [value, description]]) => ({
    name: `palette.base.${key}`,
    category: 'color' as const,
    tier: 'primitive' as const,
    value,
    description,
  })),
];
