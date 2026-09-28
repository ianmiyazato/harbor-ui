import type { Token } from './types.ts';

const px = (
  name: string,
  category: Token['category'],
  value: number,
  description: string,
): Token => ({ name, category, tier: 'semantic', value, unit: 'px', description });

/** 4px base. Steps are named by multiples of 4 so `space.6` is always 24px. */
const space = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((n) =>
  px(`space.${n}`, 'space', n * 4, `${n * 4}px (${n} × 4px base).`),
);

export const layout: Token[] = [
  ...space,
  px('radius.sm', 'radius', 6, 'Badges, checkboxes and small chips.'),
  px('radius.md', 'radius', 8, 'Buttons, inputs, selects.'),
  px('radius.lg', 'radius', 12, 'Cards, popovers and toasts.'),
  px('radius.xl', 'radius', 16, 'Dialogs and large surfaces.'),
  px('radius.full', 'radius', 9999, 'Pills, switches and avatars.'),
  px('size.control.sm', 'size', 32, 'Compact control height.'),
  px('size.control.md', 'size', 40, 'Default control height.'),
  px('size.control.lg', 'size', 48, 'Large control height, touch-first layouts.'),
  px('size.icon.sm', 'size', 16, 'Icons inside compact controls and badges.'),
  px('size.icon.md', 'size', 20, 'Default icon size.'),
  px('size.icon.lg', 'size', 24, 'Standalone icons.'),
  px('size.target.min', 'size', 24, 'Minimum pointer target (WCAG 2.2 SC 2.5.8).'),
  px('border.width.thin', 'border', 1, 'Hairline borders and dividers.'),
  px('border.width.thick', 'border', 2, 'Emphasized borders: selected tabs, error inputs.'),
  px('border.focus.width', 'border', 2, 'Focus ring thickness.'),
  px('border.focus.offset', 'border', 2, 'Gap between a control and its focus ring.'),
  {
    name: 'opacity.disabled',
    category: 'opacity',
    tier: 'semantic',
    value: 0.45,
    description: 'Opacity of disabled controls (exempt from contrast minimums).',
  },
  {
    name: 'z.popover',
    category: 'z',
    tier: 'semantic',
    value: 100,
    description: 'Select menus and popovers.',
  },
  {
    name: 'z.overlay',
    category: 'z',
    tier: 'semantic',
    value: 200,
    description: 'Modal dialogs and their scrim.',
  },
  {
    name: 'z.toast',
    category: 'z',
    tier: 'semantic',
    value: 300,
    description: 'Toast viewport, above dialogs.',
  },
  {
    name: 'z.tooltip',
    category: 'z',
    tier: 'semantic',
    value: 400,
    description: 'Tooltips, above everything.',
  },
];
