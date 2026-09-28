import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { Tooltip } from './Tooltip';
import { tooltipStates } from './Tooltip.states';

describe('Tooltip a11y', () => {
  it('documents closed and open', () => {
    expect(tooltipStates.map((s) => s.name)).toEqual(['default', 'open']);
  });

  for (const state of tooltipStates) {
    it(`${state.name} has no axe violations`, async () => {
      render(<Tooltip {...state.props} />);
      await expectNoAxeViolations(document.body);
    });
  }
});
