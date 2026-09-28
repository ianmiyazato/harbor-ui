import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  it('is false when the user has no motion preference', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('is true when prefers-reduced-motion: reduce matches', () => {
    emulateReducedMotion();
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});
