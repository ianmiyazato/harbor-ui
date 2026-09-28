import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('is decorative: hidden from assistive tech (the loading region carries aria-busy)', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['text', 'rect', 'circle'] as const)('supports the %s shape', (shape) => {
    const { container } = render(<Skeleton shape={shape} />);
    expect(container.firstElementChild).toHaveAttribute('data-shape', shape);
  });

  it('takes the final layout size so content can replace it without shifting', () => {
    const { container } = render(<Skeleton shape="rect" width={320} height="10rem" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe('320px');
    expect(el.style.height).toBe('10rem');
  });

  it('renders several text lines, the last one shorter like real paragraphs', () => {
    const { container } = render(<Skeleton shape="text" lines={3} />);
    const lines = container.querySelectorAll('[data-line]');
    expect(lines).toHaveLength(3);
    expect(lines[2]).toHaveAttribute('data-last');
  });

  it('shimmers by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute('data-animated');
    expect(container.firstElementChild).not.toHaveAttribute('data-motion');
  });

  it('is static under reduced motion', () => {
    emulateReducedMotion();
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute('data-motion', 'reduced');
    expect(container.firstElementChild).not.toHaveAttribute('data-animated');
  });

  it('can be made static on purpose', () => {
    const { container } = render(<Skeleton animated={false} />);
    expect(container.firstElementChild).not.toHaveAttribute('data-animated');
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Skeleton ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
