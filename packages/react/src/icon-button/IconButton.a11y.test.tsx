import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { buttonVariants } from '../button/Button.states';
import { IconButton } from './IconButton';
import { iconButtonStates } from './IconButton.states';

describe('IconButton a11y', () => {
  it('documents the same interactive states as Button', () => {
    expect(iconButtonStates.map((s) => s.name)).toEqual([
      'default',
      'hover',
      'focus-visible',
      'active',
      'disabled',
      'loading',
    ]);
  });

  for (const variant of buttonVariants) {
    for (const state of iconButtonStates) {
      it(`${variant} / ${state.name} has no axe violations`, async () => {
        const { container } = render(
          <IconButton {...state.props} variant={variant} data-preview={state.preview} />,
        );
        await expectNoAxeViolations(container);
      });
    }
  }
});
