import type { Spring } from './types.ts';

/** Within 0.5% of the target and nearly at rest: the eye reads it as settled. */
const SETTLE_EPSILON = 0.005;
const STEP_MS = 1;

/** Simulate a damped spring from 0 to 1 and return its position every millisecond until it settles. */
function simulate({ stiffness, damping, mass }: Spring): number[] {
  const dt = STEP_MS / 1000;
  let x = 0;
  let v = 0;
  const samples = [0];
  for (let t = 0; t < 5000; t += STEP_MS) {
    const a = (-stiffness * (x - 1) - damping * v) / mass;
    v += a * dt;
    x += v * dt;
    samples.push(x);
    const settled = Math.abs(x - 1) < SETTLE_EPSILON && Math.abs(v) < SETTLE_EPSILON * 10;
    if (settled) break;
  }
  return samples;
}

/** Milliseconds until the spring is visually settled. */
export function springSettleMs(spring: Spring): number {
  return simulate(spring).length - 1;
}

/**
 * Convert a spring into a CSS `linear()` easing plus its duration, so springs can run
 * on the compositor as ordinary transitions instead of a JavaScript animation loop.
 */
export function springToLinear(
  spring: Spring,
  points = 40,
): { easing: string; durationMs: number } {
  const samples = simulate(spring);
  const durationMs = samples.length - 1;
  const stops = Array.from({ length: points + 1 }, (_, i) => {
    if (i === 0) return 0;
    if (i === points) return 1;
    const x = samples[Math.round((i / points) * durationMs)] ?? 1;
    return Math.round(x * 1000) / 1000;
  });
  return { easing: `linear(${stops.join(', ')})`, durationMs };
}
