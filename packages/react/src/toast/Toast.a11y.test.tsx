import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test/utils';
import { ToastExample, toastStates } from './Toast.states';

describe('Toast a11y', () => {
  it('documents the default toast and one per tone', () => {
    expect(toastStates.map((s) => s.name)).toEqual(['default']);
  });

  for (const tone of ['neutral', 'success', 'danger'] as const) {
    it(`${tone} toast with an undo action has no axe violations`, async () => {
      render(<ToastExample tone={tone} />);
      await screen.findByRole('listitem');
      await expectNoAxeViolations(document.body);
    });
  }
});
