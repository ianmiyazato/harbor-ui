import type { Token } from './types.ts';

const families: [string, string, string][] = [
  [
    'display',
    "'Bricolage Grotesque Variable', 'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif",
    'Display headings: characterful, used sparingly at 32px and above.',
  ],
  [
    'ui',
    "'Geist Variable', 'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
    'Interface and body text.',
  ],
  [
    'code',
    "'Geist Mono Variable', 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    'Code, token names and tabular numbers.',
  ],
];

/** [step, size px, line height px, usage] — line heights tighten as size grows. */
const scale: [string, number, number, string][] = [
  ['xs', 12, 16, 'Badges, character counts, fine print.'],
  ['sm', 13, 18, 'Hints, captions, tooltips.'],
  ['md', 14, 20, 'Default control text: buttons, inputs, tabs.'],
  ['base', 16, 24, 'Body copy.'],
  ['lg', 20, 28, 'Lead paragraphs and card titles.'],
  ['xl', 24, 32, 'Section headings.'],
  ['2xl', 32, 40, 'Page headings.'],
  ['3xl', 40, 48, 'Hero headings on content pages.'],
  ['4xl', 56, 60, 'The home page pitch. One per site.'],
];

const weights: [string, number][] = [
  ['regular', 400],
  ['medium', 500],
  ['semibold', 600],
  ['bold', 700],
];

export const typography: Token[] = [
  ...families.map(([name, value, description]): Token => ({
    name: `font.family.${name}`,
    category: 'font',
    tier: 'semantic',
    value,
    description,
  })),
  ...scale.map(([step, size, , usage]): Token => ({
    name: `font.size.${step}`,
    category: 'font',
    tier: 'semantic',
    value: size,
    unit: 'px',
    description: `${size}px. ${usage}`,
  })),
  ...scale.map(([step, size, leading]): Token => ({
    name: `font.leading.${step}`,
    category: 'font',
    tier: 'semantic',
    value: leading,
    unit: 'px',
    description: `Line height paired with font.size.${step} (${size}/${leading}).`,
  })),
  ...weights.map(([name, value]): Token => ({
    name: `font.weight.${name}`,
    category: 'font',
    tier: 'semantic',
    value,
    description: `Font weight ${value}.`,
  })),
  {
    name: 'font.tracking.tight',
    category: 'font',
    tier: 'semantic',
    value: -0.02,
    unit: 'em',
    description: 'Letter spacing for display sizes (24px and up).',
  },
  {
    name: 'font.tracking.normal',
    category: 'font',
    tier: 'semantic',
    value: 0,
    unit: 'em',
    description: 'Default letter spacing.',
  },
  {
    name: 'font.tracking.wide',
    category: 'font',
    tier: 'semantic',
    value: 0.04,
    unit: 'em',
    description: 'Uppercase labels and overlines.',
  },
];
