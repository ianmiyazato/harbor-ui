import { useId, useState } from 'react';
import type { ChangeEvent, ComponentPropsWithRef } from 'react';
import a11y from '../internal/a11y.module.css';
import { cx } from '../internal/cx';
import { useReducedMotion } from '../internal/useReducedMotion';
import styles from './Input.module.css';

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  /** Visible label. Required: placeholders are not labels. */
  label: string;
  /** Helper text under the field, linked with aria-describedby. */
  hint?: string;
  /** Error message. When set, the input is aria-invalid and the message is announced politely. */
  error?: string;
  /** Show a `n/max` counter. Needs `maxLength`. @default false */
  showCount?: boolean;
}

export function Input({
  label,
  hint,
  error,
  showCount = false,
  id,
  className,
  value,
  defaultValue,
  maxLength,
  onChange,
  disabled,
  ...rest
}: InputProps) {
  const reduced = useReducedMotion();
  const autoId = useId();
  const inputId = id ?? `hb-input-${autoId}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const limitId = `${inputId}-limit`;

  const controlled = value !== undefined;
  const [uncontrolledLength, setUncontrolledLength] = useState(String(defaultValue ?? '').length);
  const length = controlled ? String(value).length : uncontrolledLength;
  const counting = showCount && maxLength !== undefined;
  const atLimit = counting && length >= maxLength;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!controlled) setUncontrolledLength(event.target.value.length);
    onChange?.(event);
  }

  const describedBy =
    [hint && hintId, error && errorId, counting && limitId].filter(Boolean).join(' ') || undefined;

  return (
    <div
      className={cx(styles.field, className)}
      data-invalid={error ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-motion={reduced ? 'reduced' : undefined}
    >
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={styles.input}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={handleChange}
        {...rest}
      />
      {(hint || counting) && (
        <div className={styles.meta}>
          {hint && (
            <p id={hintId} className={styles.hint}>
              {hint}
            </p>
          )}
          {counting && (
            <>
              <span
                className={styles.count}
                data-at-limit={atLimit ? '' : undefined}
                aria-hidden="true"
              >
                {length}/{maxLength}
              </span>
              <span id={limitId} className={a11y.visuallyHidden}>
                Up to {maxLength} characters.
              </span>
              <span role="status" className={a11y.visuallyHidden}>
                {atLimit ? 'Character limit reached.' : ''}
              </span>
            </>
          )}
        </div>
      )}
      <div aria-live="polite" className={styles.errorRegion}>
        {error && (
          <p id={errorId} className={styles.error}>
            <svg className={styles.errorIcon} viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M8 4.5v4.25M8 11v.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
