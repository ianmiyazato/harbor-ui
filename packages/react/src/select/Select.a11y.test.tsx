import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { Select } from './Select';
import { selectStates } from './Select.states';

describe('Select a11y', () => {
  it('documents default, hover, focus-visible, disabled and error', () => {
    expect(selectStates.map((s) => s.name)).toEqual([
      'default',
      'hover',
      'focus-visible',
      'disabled',
      'error',
    ]);
  });

  for (const state of selectStates) {
    it(`${state.name} has no axe violations`, async () => {
      const { container } = render(<Select {...state.props} data-preview={state.preview} />);
      await expectNoAxeViolations(container);
    });
  }

  it('the open listbox has no axe violations', async () => {
    const user = userEvent.setup();
    render(<Select {...selectStates[0]!.props} />);
    await user.click(screen.getByRole('combobox'));
    await expectNoAxeViolations(document.body);
  });
});
