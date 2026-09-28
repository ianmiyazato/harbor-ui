import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { IconButton } from './IconButton';

const Heart = () => <svg data-testid="icon" viewBox="0 0 16 16" />;

describe('IconButton', () => {
  it('is named by its required aria-label, and the icon is hidden from assistive tech', () => {
    render(<IconButton aria-label="Like" icon={<Heart />} />);
    const button = screen.getByRole('button', { name: 'Like' });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('icon').closest('[aria-hidden="true"]')).not.toBeNull();
    expect(button).toHaveAttribute('data-icon-only');
  });

  it('requires aria-label and rejects children at the type level', () => {
    // These never run; `pnpm typecheck` fails if the @ts-expect-error lines stop erroring.
    const typeOnly = () => [
      // @ts-expect-error aria-label is required
      <IconButton key="a" icon={<Heart />} />,
      // @ts-expect-error icon-only buttons take `icon`, not children
      <IconButton key="b" aria-label="Like" icon={<Heart />}>
        Like
      </IconButton>,
    ];
    expect(typeof typeOnly).toBe('function');
  });

  it('activates with click, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton aria-label="Like" icon={<Heart />} onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter} ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('inherits Button variants, sizes, disabled and loading behavior', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton
        aria-label="Refresh"
        icon={<Heart />}
        variant="primary"
        size="sm"
        loading
        onClick={onClick}
      />,
    );
    const button = screen.getByRole('button', { name: 'Refresh' });
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'sm');
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} aria-label="Like" icon={<Heart />} />);
    expect(ref.current).toBe(screen.getByRole('button'));
  });

  it('uses the reduced-motion variant when the user prefers reduced motion', () => {
    emulateReducedMotion();
    render(<IconButton aria-label="Like" icon={<Heart />} />);
    expect(screen.getByRole('button')).toHaveAttribute('data-motion', 'reduced');
  });
});
