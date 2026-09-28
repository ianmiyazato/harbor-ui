import type { ReducedMotion, Spring, Token } from './types.ts';

/**
 * Motion is a system: every duration, easing, spring, distance and scale is a named token,
 * and every one has a reduced-motion counterpart. Reduced motion is a mapping, like a theme:
 * movement is removed (distances → 0, scales → 1, springs → none) and fades get shorter.
 */
const noMotion = (value: string | number): ReducedMotion => ({ value, strategy: 'none' });
const fade = (value: string | number): ReducedMotion => ({ value, strategy: 'fade' });

const calm = 'cubic-bezier(0.2, 0, 0, 1)';

type Row = [name: string, value: Token['value'], reduced: ReducedMotion, description: string];

const durations: Row[] = [
  ['instant', 80, noMotion(0), 'State feedback that should feel immediate: press, toggle, check.'],
  ['fast', 160, fade(80), 'Small elements changing state: hover fills, focus rings, tooltips.'],
  ['base', 240, fade(120), 'The default for elements entering: toasts, menus, tab indicators.'],
  ['slow', 320, fade(160), 'Larger surfaces entering: dialogs, drawers.'],
  [
    'deliberate',
    480,
    fade(200),
    'Rare, guided transitions where the user should follow the change.',
  ],
  ['crossfade', 200, noMotion(0), 'Content replacing a placeholder (skeleton to content).'],
];

const easings: Row[] = [
  ['standard', calm, fade(calm), 'Most transitions: quick start, soft landing.'],
  [
    'emphasized',
    'cubic-bezier(0.34, 1.3, 0.64, 1)',
    fade(calm),
    'Entrances that deserve a slight overshoot.',
  ],
  [
    'exit',
    'cubic-bezier(0.4, 0, 1, 1)',
    fade('cubic-bezier(0.4, 0, 1, 1)'),
    'Elements leaving: accelerate away, no landing.',
  ],
];

const springs: [string, Spring, string][] = [
  [
    'snappy',
    { stiffness: 500, damping: 30, mass: 1 },
    'Direct manipulation feedback: likes, toggles, drops.',
  ],
  [
    'gentle',
    { stiffness: 170, damping: 26, mass: 1 },
    'Layout shifting to make room, without overshoot (FLIP reorder).',
  ],
  [
    'bouncy',
    { stiffness: 400, damping: 20, mass: 1 },
    'Playful confirmation that something snapped into place.',
  ],
];

const distances: Row[] = [
  ['lift', 8, noMotion(0), 'How far a picked-up item rises when dragged.'],
  ['enter', 16, noMotion(0), 'How far toasts and popovers travel when entering.'],
  ['shake', 6, noMotion(0), 'Horizontal travel of the error shake.'],
];

const scales: Row[] = [
  ['pop', 1.2, noMotion(1), 'Peak scale of a confirmation pop (0 → 1.2 → 1).'],
  ['enter', 0.96, noMotion(1), 'Starting scale of dialogs as they enter.'],
  ['press', 0.97, noMotion(1), 'Scale of a pressed button.'],
];

const make =
  (motionType: NonNullable<Token['motionType']>, unit?: Token['unit']) =>
  ([name, value, reduced, description]: Row): Token => ({
    name: `motion.${motionType}.${name}`,
    category: 'motion',
    tier: 'semantic',
    motionType,
    value,
    reduced,
    description,
    ...(unit ? { unit } : {}),
  });

export const motion: Token[] = [
  ...durations.map(make('duration', 'ms')),
  ...easings.map(make('easing')),
  ...springs.map(([name, value, description]) =>
    make('spring')([name, value, noMotion('0ms linear'), description]),
  ),
  ...distances.map(make('distance', 'px')),
  ...scales.map(make('scale')),
  make(
    'loop',
    'ms',
  )([
    'shimmer',
    1400,
    noMotion(0),
    'One sweep of the skeleton shimmer. A loop period, not a transition, so it sits outside the 80–600 ms range.',
  ]),
  make(
    'loop',
    'ms',
  )([
    'spin',
    900,
    noMotion(0),
    'One turn of the loading spinner. Under reduced motion the spinner stops and shows a static dotted ring.',
  ]),
];
