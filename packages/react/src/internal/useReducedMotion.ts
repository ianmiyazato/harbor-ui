import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

const getSnapshot = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(QUERY).matches;

/**
 * True when the user asks for reduced motion. Components put `data-motion="reduced"` on their root;
 * tokens.css re-declares every motion token under that attribute, so the reduced variant is a
 * token swap rather than a second stylesheet.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
