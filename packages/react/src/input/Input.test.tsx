import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { Input } from './Input';

describe('Input', () => {
  it('is labelled by its visible label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email').tagName).toBe('INPUT');
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('describes the input with its hint', () => {
    render(<Input label="Email" hint="We never share it." />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('We never share it.');
  });

  it('marks the input invalid and describes it with the error, announced politely', () => {
    render(<Input label="Email" hint="Work email." error="Enter a valid email." />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Work email. Enter a valid email.');
    expect(screen.getByText('Enter a valid email.').closest('[aria-live="polite"]')).not.toBeNull();
  });

  it('is not invalid without an error', () => {
    render(<Input label="Email" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  describe('character count', () => {
    it('counts characters while typing (uncontrolled) and describes the limit once', async () => {
      const user = userEvent.setup();
      render(<Input label="Bio" maxLength={10} showCount defaultValue="Hi" />);
      expect(screen.getByText('2/10')).toBeInTheDocument();
      await user.type(screen.getByRole('textbox'), ' there');
      expect(screen.getByText('8/10')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Up to 10 characters.');
    });

    it('follows the value in controlled mode', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = useState('');
        return (
          <Input
            label="Bio"
            maxLength={5}
            showCount
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
          />
        );
      }
      render(<Controlled />);
      await user.type(screen.getByRole('textbox'), 'abc');
      expect(screen.getByRole('textbox')).toHaveValue('ABC');
      expect(screen.getByText('3/5')).toBeInTheDocument();
    });

    it('announces once when the limit is reached', async () => {
      const user = userEvent.setup();
      render(<Input label="Code" maxLength={3} showCount />);
      const status = screen.getByRole('status');
      expect(status).toHaveTextContent('');
      await user.type(screen.getByRole('textbox'), 'abcd');
      expect(screen.getByRole('textbox')).toHaveValue('abc');
      expect(status).toHaveTextContent('Character limit reached.');
    });
  });

  it('calls onChange with the change event', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input label="Name" onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0].target.value).toBe('a');
  });

  it('is skipped by Tab and not editable when disabled', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Input label="Name" disabled />
        <Input label="City" />
      </>,
    );
    await user.tab();
    expect(screen.getByRole('textbox', { name: 'City' })).toHaveFocus();
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeDisabled();
  });

  it('honors a custom id and forwards ref and native props to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Email" id="email" ref={ref} type="email" name="email" required />);
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(ref.current).toHaveAttribute('id', 'email');
    expect(ref.current).toHaveAttribute('type', 'email');
    expect(ref.current).toBeRequired();
  });

  it('uses the reduced-motion variant when the user prefers reduced motion', () => {
    emulateReducedMotion();
    const { container } = render(<Input label="Email" />);
    expect(container.firstElementChild).toHaveAttribute('data-motion', 'reduced');
  });
});
