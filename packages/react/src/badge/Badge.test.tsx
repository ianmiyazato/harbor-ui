import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its text as plain, non-interactive content', () => {
    render(<Badge>Beta</Badge>);
    const badge = screen.getByText('Beta');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).not.toHaveAttribute('role');
    expect(badge).not.toHaveAttribute('tabindex');
  });

  it('defaults to the neutral tone at medium size', () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText('Draft')).toHaveAttribute('data-tone', 'neutral');
    expect(screen.getByText('Draft')).toHaveAttribute('data-size', 'md');
  });

  it.each(['neutral', 'success', 'warning', 'danger', 'info'] as const)(
    'supports the %s tone',
    (tone) => {
      render(<Badge tone={tone}>Status</Badge>);
      expect(screen.getByText('Status')).toHaveAttribute('data-tone', tone);
    },
  );

  it('renders a decorative dot hidden from assistive tech', () => {
    const { container } = render(<Badge dot>Live</Badge>);
    const dot = container.querySelector('[data-dot]');
    expect(dot).not.toBeNull();
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Live')).toHaveTextContent(/^Live$/);
  });

  it('forwards ref, className and native props', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} className="x" title="3 unread">
        3
      </Badge>,
    );
    expect(ref.current).toHaveClass('x');
    expect(ref.current).toHaveAttribute('title', '3 unread');
  });

  it('has no motion, so it renders the same under reduced motion', () => {
    const { container: normal } = render(<Badge tone="success">Paid</Badge>);
    const before = normal.innerHTML;
    emulateReducedMotion();
    const { container: reduced } = render(<Badge tone="success">Paid</Badge>);
    expect(reduced.innerHTML).toBe(before);
  });
});
