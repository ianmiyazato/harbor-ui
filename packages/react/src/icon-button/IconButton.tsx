import type { ReactNode } from 'react';
import { Button } from '../button/Button';
import type { ButtonProps } from '../button/Button';
import { cx } from '../internal/cx';
import styles from './IconButton.module.css';

export interface IconButtonProps extends Omit<
  ButtonProps,
  'children' | 'iconStart' | 'iconEnd' | 'aria-label'
> {
  /** Required: an icon-only button has no visible text, so this is its only name. */
  'aria-label': string;
  /** The icon. It is hidden from assistive tech; the label carries the meaning. */
  icon: ReactNode;
  children?: never;
}

/** A square Button with an icon and a required accessible name. */
export function IconButton({ icon, className, ...rest }: IconButtonProps) {
  return (
    <Button className={cx(styles.iconButton, className)} data-icon-only="" {...rest}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </Button>
  );
}
