import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { Switch } from './Switch';
import { switchStates } from './Switch.states';

describe('Switch a11y', () => {
  it('documents default, hover, focus-visible, active, checked and disabled', () => {
    expect(switchStates.map((s) => s.name)).toEqual([
      'default',
      'hover',
      'focus-visible',
      'active',
      'checked',
      'disabled',
    ]);
  });

  for (const state of switchStates) {
    it(`${state.name} has no axe violations`, async () => {
      const { container } = render(<Switch {...state.props} data-preview={state.preview} />);
      await expectNoAxeViolations(container);
    });
  }
});
