import type { Token } from './types.ts';

/**
 * Elevation is themed: soft shadows on light, deeper shadows plus a faint top highlight on dark,
 * and hard outlines on high contrast, where shadows carry no information.
 */
type Row = [name: string, description: string, light: string, dark: string, hc: string];

const rows: Row[] = [
  [
    '1',
    'Resting cards and inputs.',
    '0 1px 2px rgb(18 18 20 / 0.06), 0 1px 3px rgb(18 18 20 / 0.08)',
    '0 1px 2px rgb(0 0 0 / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.04)',
    'none',
  ],
  [
    '2',
    'Popovers, menus and toasts.',
    '0 4px 12px rgb(18 18 20 / 0.10), 0 2px 4px rgb(18 18 20 / 0.06)',
    '0 6px 16px rgb(0 0 0 / 0.55), inset 0 1px 0 rgb(255 255 255 / 0.06)',
    '0 0 0 1px #FFFFFF',
  ],
  [
    '3',
    'Modal dialogs, the highest resting layer.',
    '0 16px 40px rgb(18 18 20 / 0.16), 0 4px 12px rgb(18 18 20 / 0.08)',
    '0 20px 48px rgb(0 0 0 / 0.65), inset 0 1px 0 rgb(255 255 255 / 0.06)',
    '0 0 0 2px #FFFFFF',
  ],
  [
    'lift',
    'An item picked up for dragging.',
    '0 12px 28px rgb(18 18 20 / 0.18), 0 2px 6px rgb(18 18 20 / 0.10)',
    '0 14px 32px rgb(0 0 0 / 0.7), inset 0 1px 0 rgb(255 255 255 / 0.08)',
    '0 0 0 2px #FFD23F',
  ],
];

export const elevation: Token[] = rows.map(([name, description, light, dark, hc]) => ({
  name: `elevation.${name}`,
  category: 'elevation',
  tier: 'semantic',
  description,
  value: { light, dark, hc },
}));
