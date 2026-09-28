import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { Badge } from './Badge';
import { badgeStates, badgeTones } from './Badge.states';

describe('Badge a11y', () => {
  it('documents a single default state: badges are not interactive', () => {
    expect(badgeStates.map((s) => s.name)).toEqual(['default']);
  });

  for (const tone of badgeTones) {
    it(`${tone} has no axe violations`, async () => {
      const { container } = render(<Badge {...badgeStates[0]?.props} tone={tone} dot />);
      await expectNoAxeViolations(container);
    });
  }
});
