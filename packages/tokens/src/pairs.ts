/**
 * Every foreground/background combination the components actually render.
 * The contrast matrix checks each pair in each theme; the docs site renders the result.
 * `kind` sets the WCAG minimum: body text 4.5:1, large text and UI boundaries 3:1.
 */
export type PairKind = 'text' | 'large-text' | 'ui';

export interface ContrastPair {
  fg: string;
  bg: string;
  kind: PairKind;
  usedBy: string[];
}

const text = (fg: string, bg: string, ...usedBy: string[]): ContrastPair => ({
  fg: `color.${fg}`,
  bg: `color.${bg}`,
  kind: 'text',
  usedBy,
});
const ui = (fg: string, bg: string, ...usedBy: string[]): ContrastPair => ({
  fg: `color.${fg}`,
  bg: `color.${bg}`,
  kind: 'ui',
  usedBy,
});

export const contrastPairs: ContrastPair[] = [
  // Body text on every surface
  text('text.default', 'surface.default', 'Page text', 'Tabs'),
  text('text.default', 'surface.raised', 'Input', 'Select', 'Checkbox', 'Switch'),
  text('text.default', 'surface.sunken', 'Code blocks'),
  text('text.default', 'surface.overlay', 'Dialog', 'Toast', 'Select menu'),
  text('text.muted', 'surface.default', 'Input hint', 'Tabs (inactive)'),
  text('text.muted', 'surface.raised', 'Input character count'),
  text('text.muted', 'surface.overlay', 'Dialog description', 'Toast description'),
  text('text.link', 'surface.default', 'Links'),
  text('text.danger', 'surface.default', 'Input error message'),
  text('text.danger', 'surface.raised', 'Input error message in cards'),
  text('text.inverse', 'surface.inverse', 'Tooltip'),
  // Filled actions, in every interaction state
  text('text.on-action', 'action.primary', 'Button (primary)', 'IconButton (primary)'),
  text('text.on-action', 'action.primary-hover', 'Button (primary, hover)'),
  text('text.on-action', 'action.primary-active', 'Button (primary, active)'),
  text('text.on-action', 'action.danger', 'Button (danger)'),
  text('text.on-action', 'action.danger-hover', 'Button (danger, hover)'),
  text('text.on-action', 'action.danger-active', 'Button (danger, active)'),
  text('text.default', 'action.secondary', 'Button (secondary)'),
  text('text.default', 'action.secondary-hover', 'Button (secondary, hover)'),
  text('text.default', 'action.secondary-active', 'Button (secondary, active)'),
  text(
    'text.default',
    'action.ghost-hover',
    'Button (ghost, hover)',
    'Select option (highlighted)',
  ),
  text('text.default', 'action.ghost-active', 'Button (ghost, active)'),
  // Status
  text('status.success.fg', 'status.success.bg', 'Badge (success)', 'Toast (success)'),
  text('status.warning.fg', 'status.warning.bg', 'Badge (warning)'),
  text('status.danger.fg', 'status.danger.bg', 'Badge (danger)'),
  text('status.info.fg', 'status.info.bg', 'Badge (info)'),
  text('status.neutral.fg', 'status.neutral.bg', 'Badge (neutral)'),
  // Large display text
  {
    fg: 'color.text.accent',
    bg: 'color.surface.default',
    kind: 'large-text',
    usedBy: ['Display headings'],
  },
  // UI boundaries and indicators
  ui('border.strong', 'surface.default', 'Input', 'Checkbox', 'Select'),
  ui('border.strong', 'surface.raised', 'Input in cards'),
  ui('border.focus', 'surface.default', 'Focus ring'),
  ui('border.focus', 'surface.raised', 'Focus ring in cards'),
  ui('border.focus', 'surface.overlay', 'Focus ring in dialogs'),
  ui('border.danger', 'surface.raised', 'Input (error)'),
  ui('action.primary', 'surface.default', 'Button (primary) boundary', 'Tabs indicator'),
  ui('control.track', 'surface.default', 'Switch (off)'),
  ui('control.checked', 'surface.default', 'Switch (on)', 'Checkbox (checked)'),
  ui('control.thumb', 'control.checked', 'Switch thumb (on)', 'Checkbox checkmark'),
  ui('control.thumb', 'control.track', 'Switch thumb (off)'),
];
