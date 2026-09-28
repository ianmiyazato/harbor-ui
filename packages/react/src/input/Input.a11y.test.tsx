import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { Input } from './Input';
import { inputStates } from './Input.states';

describe('Input a11y', () => {
  it('documents default, hover, focus-visible, disabled and error', () => {
    expect(inputStates.map((s) => s.name)).toEqual([
      'default',
      'hover',
      'focus-visible',
      'disabled',
      'error',
    ]);
  });

  for (const state of inputStates) {
    it(`${state.name} has no axe violations`, async () => {
      const { container } = render(<Input {...state.props} data-preview={state.preview} />);
      await expectNoAxeViolations(container);
    });
  }
});
