import { describe, expect, it } from 'vitest';
import { springSettleMs, springToLinear, tokens } from '../src/index.ts';
import type { Spring, Token } from '../src/index.ts';

const motion = tokens.filter((t) => t.category === 'motion');
const ofType = (type: Token['motionType']) => motion.filter((t) => t.motionType === type);
const value = (name: string) => motion.find((t) => t.name === name)?.value;

function bezier(v: string) {
  const m = /^cubic-bezier\(([^)]+)\)$/.exec(v);
  expect(m, v).not.toBeNull();
  return (m?.[1] ?? '').split(',').map(Number) as [number, number, number, number];
}

describe('motion tokens', () => {
  it('names the five spec durations plus the content crossfade', () => {
    expect(
      Object.fromEntries(ofType('duration').map((t) => [t.name.split('.')[2], t.value])),
    ).toEqual({ instant: 80, fast: 160, base: 240, slow: 320, deliberate: 480, crossfade: 200 });
  });

  it('keeps every duration between 80 and 600 ms', () => {
    for (const t of ofType('duration')) {
      expect(t.unit, t.name).toBe('ms');
      expect(Number(t.value), t.name).toBeGreaterThanOrEqual(80);
      expect(Number(t.value), t.name).toBeLessThanOrEqual(600);
    }
  });

  it('defines standard, emphasized and exit easings as valid cubic-beziers', () => {
    expect(ofType('easing').map((t) => t.name)).toEqual([
      'motion.easing.standard',
      'motion.easing.emphasized',
      'motion.easing.exit',
    ]);
    for (const t of ofType('easing')) {
      const [x1, , x2] = bezier(String(t.value));
      expect(x1).toBeGreaterThanOrEqual(0);
      expect(x1).toBeLessThanOrEqual(1);
      expect(x2).toBeGreaterThanOrEqual(0);
      expect(x2).toBeLessThanOrEqual(1);
    }
  });

  it('defines snappy, gentle and bouncy springs as stiffness/damping/mass', () => {
    expect(ofType('spring').map((t) => t.name)).toEqual([
      'motion.spring.snappy',
      'motion.spring.gentle',
      'motion.spring.bouncy',
    ]);
    for (const t of ofType('spring')) {
      const s = t.value as Spring;
      expect(s.stiffness, t.name).toBeGreaterThan(0);
      expect(s.damping, t.name).toBeGreaterThan(0);
      expect(s.mass, t.name).toBeGreaterThan(0);
    }
  });

  it('keeps every spring settle time between 80 and 600 ms', () => {
    for (const t of ofType('spring')) {
      const ms = springSettleMs(t.value as Spring);
      expect(ms, t.name).toBeGreaterThanOrEqual(80);
      expect(ms, t.name).toBeLessThanOrEqual(600);
    }
  });

  it('makes every duration and easing a named token (no loose numbers)', () => {
    for (const t of motion) {
      expect(t.motionType, `${t.name} motionType`).toBeDefined();
      expect(t.name.startsWith(`motion.${t.motionType}.`), t.name).toBe(true);
    }
  });
});

describe('springToLinear', () => {
  it('produces a CSS linear() easing that starts at 0 and ends at 1', () => {
    const { easing, durationMs } = springToLinear(value('motion.spring.snappy') as Spring);
    expect(easing).toMatch(/^linear\(0, .+, 1\)$/);
    expect(durationMs).toBe(springSettleMs(value('motion.spring.snappy') as Spring));
  });

  it('overshoots for bouncy and settles without visible overshoot for gentle', () => {
    const peak = (s: Spring) =>
      Math.max(...springToLinear(s).easing.slice(7, -1).split(', ').map(Number));
    expect(peak(value('motion.spring.bouncy') as Spring)).toBeGreaterThan(1.1);
    expect(peak(value('motion.spring.gentle') as Spring)).toBeLessThanOrEqual(1.01);
  });
});

describe('reduced motion', () => {
  it('gives every motion token a reduced-motion counterpart', () => {
    for (const t of motion) {
      expect(t.reduced, `${t.name} reduced`).toBeDefined();
      expect(['fade', 'none'], t.name).toContain(t.reduced?.strategy);
    }
  });

  it('shortens durations to a fade or removes them', () => {
    for (const t of [...ofType('duration'), ...ofType('loop')]) {
      expect(Number(t.reduced?.value), t.name).toBeLessThan(Number(t.value));
      if (t.reduced?.strategy === 'none') expect(t.reduced.value, t.name).toBe(0);
    }
  });

  it('removes movement: distances become 0 and scales become 1', () => {
    for (const t of ofType('distance')) expect(t.reduced).toEqual({ value: 0, strategy: 'none' });
    for (const t of ofType('scale')) expect(t.reduced).toEqual({ value: 1, strategy: 'none' });
  });

  it('never overshoots in reduced easings', () => {
    for (const t of ofType('easing')) {
      const [, y1, , y2] = bezier(String(t.reduced?.value));
      expect(y1, t.name).toBeGreaterThanOrEqual(0);
      expect(y2, t.name).toBeLessThanOrEqual(1);
    }
  });

  it('turns springs into no motion at all', () => {
    for (const t of ofType('spring')) expect(t.reduced?.strategy, t.name).toBe('none');
  });
});
