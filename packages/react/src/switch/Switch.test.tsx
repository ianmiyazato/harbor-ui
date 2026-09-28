import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { Switch } from './Switch';

describe('Switch', () => {
  it('is a switch named by its label and off by default', () => {
    render(<Switch label="Dark mode" />);
    const toggle = screen.getByRole('switch', { name: 'Dark mode' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).toHaveAttribute('type', 'button');
  });

  it('toggles with click, label click, Space and Enter', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Wi-Fi" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByText('Wi-Fi'));
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    toggle.focus();
    await user.keyboard(' ');
    await user.keyboard('{Enter}');
    expect(onCheckedChange.mock.calls.map((c) => c[0])).toEqual([true, false, true, false]);
  });

  it('starts from defaultChecked when uncontrolled', () => {
    render(<Switch label="Wi-Fi" defaultChecked />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('follows the checked prop when controlled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Switch label="Wi-Fi" checked={false} onCheckedChange={onCheckedChange} />,
    );
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    rerender(<Switch label="Wi-Fi" checked onCheckedChange={onCheckedChange} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('is described by its description', () => {
    render(<Switch label="Autosave" description="Saves every 30 seconds." />);
    expect(screen.getByRole('switch')).toHaveAccessibleDescription('Saves every 30 seconds.');
  });

  it('ignores activation when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Wi-Fi" disabled onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('still calls a native onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Switch label="Wi-Fi" onClick={onClick} />);
    await user.click(screen.getByRole('switch'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to the switch button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch label="Wi-Fi" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('switch'));
  });

  it('uses the reduced-motion variant when the user prefers reduced motion', () => {
    emulateReducedMotion();
    const { container } = render(<Switch label="Wi-Fi" />);
    expect(container.firstElementChild).toHaveAttribute('data-motion', 'reduced');
  });
});
