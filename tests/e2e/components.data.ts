/** The 12 component pages and one prop each that the generated props table must list. */
export const components = [
  { slug: 'button', name: 'Button', prop: 'variant', interactive: true },
  { slug: 'icon-button', name: 'IconButton', prop: 'aria-label', interactive: true },
  { slug: 'input', name: 'Input', prop: 'hint', interactive: true },
  { slug: 'checkbox', name: 'Checkbox', prop: 'onCheckedChange', interactive: true },
  { slug: 'switch', name: 'Switch', prop: 'defaultChecked', interactive: true },
  { slug: 'badge', name: 'Badge', prop: 'tone', interactive: false },
  { slug: 'skeleton', name: 'Skeleton', prop: 'shape', interactive: false },
  { slug: 'select', name: 'Select', prop: 'options', interactive: true },
  { slug: 'tabs', name: 'Tabs', prop: 'onValueChange', interactive: true },
  { slug: 'dialog', name: 'Dialog', prop: 'title', interactive: false },
  { slug: 'tooltip', name: 'Tooltip', prop: 'content', interactive: false },
  { slug: 'toast', name: 'Toast', prop: 'duration', interactive: false },
] as const;
