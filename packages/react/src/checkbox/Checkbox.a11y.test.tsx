import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { Checkbox } from './Checkbox';
import { checkboxStates } from './Checkbox.states';

describe('Checkbox a11y', () => {
  it('documents default, hover, focus-visible, active, checked, indeterminate, disabled and error', () => {
    expect(checkboxStates.map((s) => s.name)).toEqual([
      'default',
      'hover',
      'focus-visible',
      'active',
      'checked',
      'indeterminate',
      'disabled',
      'error',
    ]);
  });

  for (const state of checkboxStates) {
    it(`${state.name} has no axe violations`, async () => {
      const { container } = render(<Checkbox {...state.props} data-preview={state.preview} />);
      await expectNoAxeViolations(container);
    });
  }
});
