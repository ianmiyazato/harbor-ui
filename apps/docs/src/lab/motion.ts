/**
 * Read motion tokens from the live CSS of an element. JavaScript-driven motion (FLIP, view
 * transitions, timers) then follows the same slow-motion timescale and reduced-motion mapping as
 * the CSS: a tile at 5× slows its WAAPI animations too, and reduced motion zeroes them.
 */
function raw(el: Element, token: string) {
  return getComputedStyle(el).getPropertyValue(`--hb-${token}`).trim();
}

const time = (n: string, unit: string) => Number(n) * (unit === 's' ? 1000 : 1);

/**
 * Milliseconds from a duration token's computed value. Browsers normalise units, so
 * `calc(240ms * 5)` may read back as `calc(.24s * 5)`: accept ms or s, with or without calc.
 */
export function durationOf(value: string): number {
  const scaled = /calc\(\s*([\d.]+)(ms|s)\s*\*\s*([\d.]+)\s*\)/.exec(value);
  if (scaled) return time(scaled[1]!, scaled[2]!) * Number(scaled[3]);
  const plain = /^\s*([\d.]+)(ms|s)\b/.exec(value);
  return plain ? time(plain[1]!, plain[2]!) : 0;
}

export function tokenDuration(el: Element, token: string): number {
  return durationOf(raw(el, token));
}

/** A spring token as WAAPI timing: `{ duration, easing }`. */
export function springTiming(el: Element, name: 'snappy' | 'gentle' | 'bouncy') {
  const value = raw(el, `motion-spring-${name}`);
  const easing = /(linear\(.*\))\s*$/.exec(value)?.[1] ?? 'linear';
  return { duration: durationOf(value), easing };
}

export function tokenPx(el: Element, token: string): number {
  return parseFloat(raw(el, token)) || 0;
}

export function timescale(el: Element): number {
  return parseFloat(getComputedStyle(el).getPropertyValue('--hb-timescale')) || 1;
}

/** Reduced motion from the OS or from the nearest `[data-motion="reduced"]` preview. */
export function isReduced(el: Element): boolean {
  return (
    !!el.closest('[data-motion="reduced"]') ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
