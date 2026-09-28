import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { IconButton } from '../icon-button/IconButton';
import { Tooltip } from './Tooltip';

function Example({ delay = 0 }: { delay?: number }) {
  return (
    <>
      <Tooltip content="Copy link" delay={delay}>
        <IconButton aria-label="Copy" icon={<svg />} />
      </Tooltip>
      <button>Next</button>
    </>
  );
}

describe('Tooltip', () => {
  it('is hidden until needed', () => {
    render(<Example />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows on keyboard focus and describes its trigger', async () => {
    const user = userEvent.setup();
    render(<Example delay={10_000} />);
    await user.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Copy link');
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveAccessibleDescription('Copy link');
  });

  it('shows on hover and hides when the pointer leaves', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.hover(screen.getByRole('button', { name: 'Copy' }));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    await user.unhover(screen.getByRole('button', { name: 'Copy' }));
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('dismisses with Escape without moving focus (WCAG 1.4.13)', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await screen.findByRole('tooltip');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveFocus();
  });

  it('hides when focus moves on', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await screen.findByRole('tooltip');
    await user.tab();
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('uses the reduced-motion variant when the user prefers reduced motion', async () => {
    emulateReducedMotion();
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await screen.findByRole('tooltip');
    expect(document.querySelector('[data-hb-tooltip]')).toHaveAttribute('data-motion', 'reduced');
  });
});
