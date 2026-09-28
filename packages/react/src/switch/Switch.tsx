import { useId, useState } from 'react';
import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import { cx } from '../internal/cx';
import { useReducedMotion } from '../internal/useReducedMotion';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'value' | 'defaultValue' | 'children'
> {
  /** Visible label. Clicking it toggles the switch. */
  label: ReactNode;
  /** Secondary text under the label, linked with aria-describedby. */
  description?: string;
  /** Controlled state. */
  checked?: boolean;
  /** Uncontrolled initial state. @default false */
  defaultChecked?: boolean;
  /** Called with the new state. Switches apply immediately: no submit button needed. */
  onCheckedChange?: (checked: boolean) => void;
}

/** An on/off setting that takes effect immediately. For choices submitted with a form, use Checkbox. */
export function Switch({
  label,
  description,
  checked,
  defaultChecked = false,
  onCheckedChange,
  onClick,
  id,
  className,
  ...rest
}: SwitchProps) {
  const reduced = useReducedMotion();
  const autoId = useId();
  const switchId = id ?? `hb-switch-${autoId}`;
  const descriptionId = `${switchId}-description`;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const controlled = checked !== undefined;
  const on = controlled ? checked : uncontrolled;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (!controlled) setUncontrolled(!on);
    onCheckedChange?.(!on);
  }

  return (
    <div className={cx(styles.field, className)} data-motion={reduced ? 'reduced' : undefined}>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={on}
        aria-describedby={description ? descriptionId : undefined}
        className={styles.track}
        data-state={on ? 'on' : 'off'}
        onClick={handleClick}
        {...rest}
      >
        <span className={styles.thumb} aria-hidden="true" />
      </button>
      <span className={styles.text}>
        <label className={styles.label} htmlFor={switchId}>
          {label}
        </label>
        {description && (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
