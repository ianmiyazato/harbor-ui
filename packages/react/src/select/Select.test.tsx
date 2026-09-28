import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { Select } from './Select';

const options = [
  { value: 'ams', label: 'Amsterdam' },
  { value: 'ber', label: 'Berlin' },
  { value: 'lis', label: 'Lisbon', disabled: true },
  { value: 'tyo', label: 'Tokyo' },
];

describe('Select', () => {
  it('is a combobox named by its label, showing the placeholder', () => {
    render(<Select label="Office" placeholder="Choose an office" options={options} />);
    const trigger = screen.getByRole('combobox', { name: 'Office' });
    expect(trigger).toHaveTextContent('Choose an office');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a listbox on click and selects an option with the pointer', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select label="Office" options={options} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getAllByRole('option')).toHaveLength(4);
    await user.click(screen.getByRole('option', { name: 'Berlin' }));
    expect(onValueChange).toHaveBeenCalledWith('ber');
    expect(screen.getByRole('combobox')).toHaveTextContent('Berlin');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('works with the keyboard: open, move, select, and focus returns to the trigger', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select label="Office" options={options} onValueChange={onValueChange} />);
    await user.tab();
    expect(screen.getByRole('combobox')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('ber');
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('skips disabled options', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select label="Office" options={options} defaultValue="ber" onValueChange={onValueChange} />,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Berlin');
    screen.getByRole('combobox').focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('option', { name: 'Lisbon' })).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('tyo');
  });

  it('closes on Escape without changing the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select label="Office" options={options} defaultValue="ams" onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveTextContent('Amsterdam');
  });

  it('follows the value prop when controlled', () => {
    const { rerender } = render(<Select label="Office" options={options} value="ams" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Amsterdam');
    rerender(<Select label="Office" options={options} value="tyo" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Tokyo');
  });

  it('describes the trigger with hint and error', () => {
    render(
      <Select
        label="Office"
        options={options}
        hint="Where you work most days."
        error="Pick an office."
      />,
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAccessibleDescription('Where you work most days. Pick an office.');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  it('cannot be opened when disabled', async () => {
    const user = userEvent.setup();
    render(<Select label="Office" options={options} disabled />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('forwards ref to the trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Select label="Office" options={options} ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('combobox'));
  });

  it('uses the reduced-motion variant when the user prefers reduced motion', () => {
    emulateReducedMotion();
    const { container } = render(<Select label="Office" options={options} />);
    expect(container.firstElementChild).toHaveAttribute('data-motion', 'reduced');
  });
});
