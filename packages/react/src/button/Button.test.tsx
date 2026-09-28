import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders a native button labelled by its content, type="button" by default', () => {
    render(<Button>Save changes</Button>);
    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('defaults to the secondary variant at medium size (one primary per view is opt-in)', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'secondary');
    expect(button).toHaveAttribute('data-size', 'md');
  });

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
    'supports the %s variant',
    (variant) => {
      render(<Button variant={variant}>Go</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
    },
  );

  it('activates on click, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('is skipped by Tab and ignores clicks when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <Button disabled onClick={onClick}>
          Save
        </Button>
        <Button>Next</Button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is not busy, disabled or loading while idle', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).not.toHaveAttribute('aria-busy');
    expect(button).not.toHaveAttribute('aria-disabled');
    expect(button).not.toHaveAttribute('data-loading');
  });

  it('works without an onClick handler', async () => {
    const user = userEvent.setup();
    render(<Button>Save</Button>);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  describe('loading', () => {
    it('does not submit its form while loading', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Button type="submit" loading>
            Save
          </Button>
        </form>,
      );
      await user.click(screen.getByRole('button'));
      expect(onSubmit).not.toHaveBeenCalled();
      expect(screen.getByRole('button')).toHaveAttribute('data-loading');
    });

    it('announces “Loading” by default', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByRole('button')).toHaveAccessibleName('Save Loading');
    });

    it('stays focusable but is busy and ignores activation', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).not.toBeDisabled();
      await user.tab();
      expect(button).toHaveFocus();
      await user.keyboard('{Enter}');
      await user.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('keeps the label in place so the width does not change', () => {
      const { rerender } = render(<Button>Save changes</Button>);
      const label = screen.getByText('Save changes');
      rerender(<Button loading>Save changes</Button>);
      // Same node, still rendered: the label keeps sizing the button while the spinner overlays it.
      expect(screen.getByText('Save changes')).toBe(label);
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    it('announces a loading label and hides the decorative spinner', () => {
      render(
        <Button loading loadingLabel="Saving">
          Save
        </Button>,
      );
      expect(screen.getByRole('button')).toHaveAccessibleName('Save Saving');
      expect(screen.getByTestId('hb-spinner')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('renders start and end icons', () => {
    render(
      <Button iconStart={<svg data-testid="start" />} iconEnd={<svg data-testid="end" />}>
        Save
      </Button>,
    );
    expect(screen.getByTestId('start')).toBeInTheDocument();
    expect(screen.getByTestId('end')).toBeInTheDocument();
  });

  it('forwards ref, className and native props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="custom" type="submit" data-testid="b">
        Save
      </Button>,
    );
    expect(ref.current).toBe(screen.getByTestId('b'));
    expect(ref.current).toHaveClass('custom');
    expect(ref.current).toHaveAttribute('type', 'submit');
  });

  it('uses the reduced-motion variant when the user prefers reduced motion', () => {
    const { unmount } = render(<Button>Save</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-motion');
    unmount();
    emulateReducedMotion();
    render(<Button>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-motion', 'reduced');
  });
});
