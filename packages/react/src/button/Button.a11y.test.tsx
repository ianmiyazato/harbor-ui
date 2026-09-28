import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { Button } from './Button';
import { buttonStates, buttonVariants } from './Button.states';

describe('Button a11y', () => {
  it('documents default, hover, focus-visible, active, disabled and loading', () => {
    expect(buttonStates.map((s) => s.name)).toEqual([
      'default',
      'hover',
      'focus-visible',
      'active',
      'disabled',
      'loading',
    ]);
  });

  for (const variant of buttonVariants) {
    for (const state of buttonStates) {
      it(`${variant} / ${state.name} has no axe violations`, async () => {
        const { container } = render(
          <Button {...state.props} variant={variant} data-preview={state.preview} />,
        );
        await expectNoAxeViolations(container);
      });
    }
  }
});
