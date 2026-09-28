import { describe, expect, it } from 'vitest';
import { durationOf } from '../../apps/docs/src/lab/motion';

describe('lab durationOf', () => {
  it.each([
    ['calc(240ms * 5)', 1200],
    ['calc(.24s * 5)', 1200],
    ['calc(0.356s * 1) linear(0, 1)', 356],
    ['calc(583ms * var(--x, 1))', 0],
    ['0ms linear', 0],
    ['0s', 0],
    ['80ms', 80],
    ['', 0],
  ])('%s → %d ms', (value, ms) => {
    expect(durationOf(value)).toBeCloseTo(ms, 5);
  });
});
