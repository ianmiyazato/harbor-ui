import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { TabsExample, tabsStates } from './Tabs.states';

describe('Tabs a11y', () => {
  it('documents default, hover, focus-visible, active, selected and disabled', () => {
    expect(tabsStates.map((s) => s.name)).toEqual([
      'default',
      'hover',
      'focus-visible',
      'active',
      'selected',
      'disabled',
    ]);
  });

  for (const state of tabsStates) {
    it(`${state.name} has no axe violations`, async () => {
      const { container } = render(<TabsExample {...state.props} preview={state.preview} />);
      await expectNoAxeViolations(container);
    });
  }
});
