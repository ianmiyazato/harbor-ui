import type { Token } from './types.ts';

/**
 * Semantic colors: the public color API. Each is a mapping per theme to a palette reference.
 * Light, dark and high contrast share the same names, so a theme is a variable swap, never a fork.
 */
type Row = [name: string, description: string, light: string, dark: string, hc: string];

// prettier-ignore
const rows: Row[] = [
  // Surfaces
  ['surface.default', 'Page background.', 'base.paper', 'ink.900', 'base.black'],
  ['surface.raised', 'Cards and inputs that sit on the page.', 'base.white', 'ink.850', 'base.black'],
  ['surface.sunken', 'Wells, code blocks and tracks set into the page.', 'neutral.50', 'ink.950', 'base.black'],
  ['surface.overlay', 'Dialogs, popovers, menus and toasts.', 'base.white', 'ink.800', 'base.black'],
  ['surface.inverse', 'Tooltips: the opposite of the page.', 'neutral.900', 'neutral.100', 'base.white'],
  ['surface.scrim', 'Backdrop behind modal dialogs.', 'base.scrim-light', 'base.scrim-dark', 'base.scrim-hc'],
  // Text
  ['text.default', 'Body text and headings.', 'neutral.900', 'neutral.100', 'base.white'],
  ['text.muted', 'Secondary text: hints, captions, metadata.', 'neutral.600', 'neutral.400', 'neutral.100'],
  ['text.inverse', 'Text on the inverse surface.', 'neutral.50', 'neutral.900', 'base.black'],
  ['text.on-action', 'Text and icons on filled primary and danger actions.', 'base.white', 'ink.950', 'base.black'],
  ['text.accent', 'Brand-colored display text.', 'teal.700', 'teal.300', 'teal.200'],
  ['text.link', 'Inline links.', 'teal.700', 'teal.300', 'teal.200'],
  ['text.danger', 'Error messages.', 'red.700', 'red.300', 'red.300'],
  ['text.disabled', 'Disabled labels (exempt from contrast minimums).', 'neutral.400', 'neutral.600', 'neutral.400'],
  // Actions
  ['action.primary', 'Primary action fill. Use one primary per view.', 'teal.600', 'teal.400', 'base.white'],
  ['action.primary-hover', 'Primary action fill on hover.', 'teal.700', 'teal.300', 'neutral.200'],
  ['action.primary-active', 'Primary action fill while pressed.', 'teal.800', 'teal.200', 'neutral.300'],
  ['action.secondary', 'Secondary action fill.', 'neutral.100', 'ink.700', 'base.black'],
  ['action.secondary-hover', 'Secondary action fill on hover.', 'neutral.200', 'ink.600', 'ink.800'],
  ['action.secondary-active', 'Secondary action fill while pressed.', 'neutral.300', 'ink.700', 'ink.700'],
  ['action.ghost-hover', 'Ghost action background on hover.', 'neutral.100', 'ink.800', 'ink.800'],
  ['action.ghost-active', 'Ghost action background while pressed.', 'neutral.200', 'ink.700', 'ink.700'],
  ['action.danger', 'Destructive action fill.', 'red.600', 'red.400', 'red.300'],
  ['action.danger-hover', 'Destructive action fill on hover.', 'red.700', 'red.300', 'red.200'],
  ['action.danger-active', 'Destructive action fill while pressed.', 'red.800', 'red.200', 'red.100'],
  // Borders
  ['border.default', 'Decorative dividers and card outlines (no contrast minimum).', 'neutral.200', 'ink.700', 'base.white'],
  ['border.strong', 'Boundaries of interactive controls such as inputs (3:1).', 'neutral.500', 'neutral.500', 'base.white'],
  ['border.focus', 'Focus ring. Blue, so focus is never confused with selection.', 'blue.600', 'blue.300', 'base.signal'],
  ['border.danger', 'Boundary of a control in the error state.', 'red.600', 'red.400', 'red.300'],
  // Controls
  ['control.track', 'Unchecked switch track.', 'neutral.500', 'neutral.500', 'neutral.400'],
  ['control.checked', 'Checked checkbox and switch fill.', 'teal.600', 'teal.500', 'base.white'],
  ['control.thumb', 'Switch thumb and checkmark on a checked control.', 'base.white', 'base.white', 'base.black'],
  // Status
  ['status.success.bg', 'Success badge and banner background.', 'green.100', 'green.950', 'base.black'],
  ['status.success.fg', 'Success badge text and icon.', 'green.800', 'green.300', 'green.300'],
  ['status.warning.bg', 'Warning badge and banner background.', 'amber.100', 'amber.950', 'base.black'],
  ['status.warning.fg', 'Warning badge text and icon.', 'amber.800', 'amber.300', 'amber.300'],
  ['status.danger.bg', 'Danger badge and banner background.', 'red.100', 'red.950', 'base.black'],
  ['status.danger.fg', 'Danger badge text and icon.', 'red.800', 'red.300', 'red.300'],
  ['status.info.bg', 'Info badge and banner background.', 'blue.100', 'blue.950', 'base.black'],
  ['status.info.fg', 'Info badge text and icon.', 'blue.800', 'blue.300', 'blue.300'],
  ['status.neutral.bg', 'Neutral badge background.', 'neutral.100', 'ink.700', 'base.black'],
  ['status.neutral.fg', 'Neutral badge text.', 'neutral.800', 'neutral.200', 'base.white'],
  // Loading
  ['skeleton.base', 'Skeleton placeholder fill (decorative).', 'neutral.100', 'ink.800', 'ink.800'],
  ['skeleton.highlight', 'Skeleton shimmer highlight (decorative).', 'neutral.50', 'ink.700', 'ink.700'],
];

const ref = (name: string) => `{palette.${name}}`;

export const colors: Token[] = rows.map(([name, description, light, dark, hc]) => ({
  name: `color.${name}`,
  category: 'color',
  tier: 'semantic',
  description,
  value: { light: ref(light), dark: ref(dark), hc: ref(hc) },
}));
