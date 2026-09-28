import { describe, expect, it } from 'vitest';
import { createResolver } from '../src/resolve.ts';
import type { Token } from '../src/index.ts';

describe('createResolver', () => {
  it('substitutes references embedded inside a larger value', () => {
    const tokens: Token[] = [
      {
        name: 'palette.base.ink',
        category: 'color',
        tier: 'primitive',
        value: '#121214',
        description: 'Test primitive.',
      },
      {
        name: 'border.test.ring',
        category: 'border',
        tier: 'semantic',
        value: { light: '0 0 0 1px {palette.base.ink}', dark: 'none', hc: 'none' },
        description: 'Test composite value.',
      },
    ];
    const resolve = createResolver(tokens);
    expect(resolve('border.test.ring', 'light')).toBe('0 0 0 1px #121214');
    expect(resolve('border.test.ring', 'dark')).toBe('none');
  });
});
