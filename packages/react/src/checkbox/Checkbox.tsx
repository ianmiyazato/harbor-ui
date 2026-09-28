import { useId, useLayoutEffect, useRef } from 'react';
import type { ChangeEvent, ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../internal/cx';
import { mergeRefs } from '../internal/mergeRefs';
import { useReducedMotion } from '../internal/useReducedMotion';
import styles from './Checkbox.module.css';

export type CheckedState = boolean | 'indeterminate';

export interface CheckboxProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'checked' | 'defaultChecked'
> {
  /** Visible label. Clicking it toggles the checkbox. */
  label: ReactNode;
  /** Secondary text under the label, linked with aria-describedby. */
  description?: string;
  /** Error message, e.g. for a required consent checkbox. Sets aria-invalid. */
  error?: string;
  /** Controlled state. `'indeterminate'` shows the mixed state of a "select all" parent. */
  checked?: CheckedState;
  /** Uncontrolled initial state. */
  defaultChecked?: CheckedState;
  /** Called with the new checked value. */
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({
  label,
  description,
  error,
  checked,
  defaultChecked,
  onCheckedChange,
  onChange,
  id,
  className,
  ref,
  ...rest
}: CheckboxProps) {
  const reduced = useReducedMotion();
  const inner = useRef<HTMLInputElement>(null);
  const autoId = useId();
  const inputId = id ?? `hb-checkbox-${autoId}`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;
  const controlled = checked !== undefined;

  // `indeterminate` is a DOM property, not an attribute, so it is synced imperatively.
  useLayoutEffect(() => {
    if (inner.current && controlled) inner.current.indeterminate = checked === 'indeterminate';
  }, [checked, controlled]);
  useLayoutEffect(() => {
    if (inner.current && defaultChecked === 'indeterminate') inner.current.indeterminate = true;
    // Uncontrolled: apply the initial mixed state once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
    onCheckedChange?.(event.target.checked);
  }

  const describedBy = [description && descriptionId, error && errorId].filter(Boolean).join(' ');

  return (
    <div
      className={cx(styles.field, className)}
      data-invalid={error ? '' : undefined}
      data-motion={reduced ? 'reduced' : undefined}
    >
      <label className={styles.row} htmlFor={inputId}>
        <span className={styles.control}>
          <input
            ref={mergeRefs(inner, ref)}
            id={inputId}
            type="checkbox"
            className={styles.input}
            {...(controlled
              ? { checked: checked === true }
              : { defaultChecked: defaultChecked === true })}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy || undefined}
            onChange={handleChange}
            {...rest}
          />
          <span className={styles.box} aria-hidden="true">
            <svg className={styles.check} viewBox="0 0 16 16">
              <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
            </svg>
            <svg className={styles.dash} viewBox="0 0 16 16">
              <path d="M4 8h8" />
            </svg>
          </span>
        </span>
        <span className={styles.text}>
          <span className={styles.label}>{label}</span>
          {description && (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          )}
        </span>
      </label>
      {error && (
        <p id={errorId} className={styles.error} aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
