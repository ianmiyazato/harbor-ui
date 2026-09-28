import type { CSSProperties } from 'react';

export interface InheritedContext {
  'data-theme'?: string;
  'data-motion'?: string;
  'data-timescale'?: string;
  style?: CSSProperties;
}

/**
 * Portalled content (menus, dialogs, tooltips, toasts) renders under <body>, outside the element
 * that set a local theme, reduced motion or slow motion. Read those settings from the nearest
 * ancestors of the anchor so a demo themed "dark" inside a light page still gets a dark menu.
 */
export function readInheritedContext(node: Element | null): InheritedContext {
  if (!node) return {};
  const context: InheritedContext = {};
  const theme = node.closest('[data-theme]')?.getAttribute('data-theme');
  if (theme) context['data-theme'] = theme;
  const motion = node.closest('[data-motion]')?.getAttribute('data-motion');
  if (motion) context['data-motion'] = motion;
  const scaled = node.closest('[data-timescale]');
  if (scaled) {
    const value = getComputedStyle(scaled).getPropertyValue('--hb-timescale').trim() || '1';
    context['data-timescale'] = '';
    context.style = { ['--hb-timescale' as string]: value };
  }
  return context;
}
