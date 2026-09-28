import * as RadixDialog from '@radix-ui/react-dialog';
import { useCallback, useRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { cx } from '../internal/cx';
import { CloseIcon } from '../internal/icons';
import { applyInheritedContext } from '../internal/inheritedContext';
import { useReducedMotion } from '../internal/useReducedMotion';
import styles from './Dialog.module.css';

export interface DialogProps {
  /** Required: the dialog's accessible name and visible heading. */
  title: string;
  /** Short explanation under the title; becomes the accessible description. */
  description?: string;
  /** Element that opens the dialog, e.g. a Button. Focus returns here on close. */
  trigger?: ReactElement;
  /** Dialog body. */
  children?: ReactNode;
  /** Actions, right-aligned. Wrap dismissive actions in `DialogClose asChild`. */
  footer?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial state. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Max width: 384, 512 or 704px (6, 8 or 11 × space.16). @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name of the corner close button. @default 'Close' */
  closeLabel?: string;
  className?: string;
}

/**
 * A modal dialog on Radix Dialog: focus moves in and is trapped, Escape and the close button
 * dismiss it, focus returns to the trigger, the page behind is inert and its scroll is locked.
 */
export function Dialog({
  title,
  description,
  trigger,
  children,
  footer,
  open,
  defaultOpen,
  onOpenChange,
  size = 'md',
  closeLabel = 'Close',
  className,
}: DialogProps) {
  const reduced = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inherit = useCallback((node: HTMLElement | null) => {
    if (node) applyInheritedContext(node, triggerRef.current);
  }, []);
  const motion = reduced ? 'reduced' : undefined;

  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && (
        <RadixDialog.Trigger asChild ref={triggerRef}>
          {trigger}
        </RadixDialog.Trigger>
      )}
      <RadixDialog.Portal>
        <RadixDialog.Overlay ref={inherit} className={styles.overlay} data-motion={motion} />
        <RadixDialog.Content
          ref={inherit}
          className={cx(styles.content, className)}
          data-size={size}
          data-motion={motion}
          {...(description ? {} : { 'aria-describedby': undefined })}
        >
          <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
          {description && (
            <RadixDialog.Description className={styles.description}>
              {description}
            </RadixDialog.Description>
          )}
          {children && <div className={styles.body}>{children}</div>}
          {footer && <div className={styles.footer}>{footer}</div>}
          <RadixDialog.Close className={styles.close} aria-label={closeLabel}>
            <CloseIcon />
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

/** Closes the surrounding Dialog. Use `asChild` to wrap a Button. */
export const DialogClose = RadixDialog.Close;
