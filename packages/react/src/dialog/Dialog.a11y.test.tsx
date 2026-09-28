import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { Dialog } from './Dialog';
import { dialogStates } from './Dialog.states';

describe('Dialog a11y', () => {
  it('documents the closed trigger and the open dialog', () => {
    expect(dialogStates.map((s) => s.name)).toEqual(['default', 'open']);
  });

  for (const state of dialogStates) {
    it(`${state.name} has no axe violations`, async () => {
      render(<Dialog {...state.props} />);
      await expectNoAxeViolations(document.body);
    });
  }
});
