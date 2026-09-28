import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('is a native checkbox named by its label', () => {
    render(<Checkbox label="Email me updates" />);
    const box = screen.getByRole('checkbox', { name: 'Email me updates' });
    expect(box).toHaveAttribute('type', 'checkbox');
    expect(box).not.toBeChecked();
  });

  it('toggles with a click on the label or box and with Space, not Enter', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Updates" onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole('checkbox');
    await user.click(screen.getByText('Updates'));
    expect(box).toBeChecked();
    await user.click(box);
    expect(box).not.toBeChecked();
    await user.keyboard(' ');
    expect(box).toBeChecked();
    await user.keyboard('{Enter}');
    expect(box).toBeChecked();
    expect(onCheckedChange.mock.calls.map((c) => c[0])).toEqual([true, false, true]);
  });

  it('starts from defaultChecked when uncontrolled', () => {
    render(<Checkbox label="Updates" defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('follows the checked prop when controlled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Checkbox label="Updates" checked={false} onCheckedChange={onCheckedChange} />,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    rerender(<Checkbox label="Updates" checked onCheckedChange={onCheckedChange} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('shows a mixed state for "select all" style parents', async () => {
    const user = userEvent.setup();
    function SelectAll() {
      const [state, setState] = useState<boolean | 'indeterminate'>('indeterminate');
      return <Checkbox label="Select all" checked={state} onCheckedChange={setState} />;
    }
    render(<SelectAll />);
    const box = screen.getByRole('checkbox');
    expect(box).toBePartiallyChecked();
    await user.click(box);
    expect(box).not.toBePartiallyChecked();
    expect(box).toBeChecked();
  });

  it('describes itself with its description and error', () => {
    render(
      <Checkbox label="Accept terms" description="Required to continue." error="Please accept." />,
    );
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAccessibleDescription('Required to continue. Please accept.');
    expect(box).toHaveAttribute('aria-invalid', 'true');
  });

  it('cannot be toggled when disabled', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Updates" disabled />);
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('forwards ref and native props to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Updates" ref={ref} name="updates" value="yes" />);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
    expect(ref.current).toHaveAttribute('name', 'updates');
  });

  it('uses the reduced-motion variant when the user prefers reduced motion', () => {
    emulateReducedMotion();
    const { container } = render(<Checkbox label="Updates" />);
    expect(container.firstElementChild).toHaveAttribute('data-motion', 'reduced');
  });
});
