import type { ComponentPropsWithRef } from 'react';
import { cx } from '../internal/cx';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  /** Meaning of the badge. Each tone is a text/background pair checked at 4.5:1 in every theme. @default 'neutral' */
  tone?: BadgeTone;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** A small leading dot, for statuses like "Live". Decorative. @default false */
  dot?: boolean;
}

/** A short, non-interactive status label. Color is never the only signal: the text carries the meaning. */
export function Badge({
  tone = 'neutral',
  size = 'md',
  dot = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cx(styles.badge, className)} data-tone={tone} data-size={size} {...rest}>
      {dot && <span className={styles.dot} aria-hidden="true" data-dot="" />}
      {children}
    </span>
  );
}
