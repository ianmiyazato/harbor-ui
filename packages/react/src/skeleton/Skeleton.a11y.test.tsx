import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { Skeleton } from './Skeleton';
import { skeletonStates } from './Skeleton.states';

describe('Skeleton a11y', () => {
  it('documents a single default state: skeletons are not interactive', () => {
    expect(skeletonStates.map((s) => s.name)).toEqual(['default']);
  });

  it('a busy region with skeletons has no axe violations', async () => {
    const { container } = render(
      <section aria-busy="true" aria-label="Profile">
        <Skeleton shape="circle" width={48} height={48} />
        <Skeleton {...skeletonStates[0]?.props} />
      </section>,
    );
    await expectNoAxeViolations(container);
  });
});
