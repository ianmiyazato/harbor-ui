import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import a11y from '../internal/a11y.module.css';
import { cx } from '../internal/cx';
import { useReducedMotion } from '../internal/useReducedMotion';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual weight. Use one `primary` per view. @default 'secondary' */
  variant?: ButtonVariant;
  /** Control height: 32, 40 or 48px. @default 'md' */
  size?: ButtonSize;
  /** Shows a spinner, keeps the width, stays focusable and ignores activation. @default false */
  loading?: boolean;
  /** Announced to screen readers while loading. @default 'Loading' */
  loadingLabel?: string;
  /** Icon before the label. Decorative: give it `aria-hidden`. */
  iconStart?: ReactNode;
  /** Icon after the label. Decorative: give it `aria-hidden`. */
  iconEnd?: ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  loadingLabel = 'Loading',
  iconStart,
  iconEnd,
  type = 'button',
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const reduced = useReducedMotion();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      type={type}
      className={cx(styles.button, className)}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-motion={reduced ? 'reduced' : undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || rest['aria-disabled'] || undefined}
      onClick={handleClick}
      {...rest}
    >
      <span className={styles.content}>
        {iconStart}
        <span className={styles.label}>{children}</span>
        {iconEnd}
      </span>
      {loading && (
        <>
          <span className={styles.spinner} aria-hidden="true" data-testid="hb-spinner" />
          <span className={a11y.visuallyHidden}> {loadingLabel}</span>
        </>
      )}
    </button>
  );
}
