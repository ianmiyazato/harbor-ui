import * as RadixTooltip from '@radix-ui/react-tooltip';
import { useCallback, useRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { applyInheritedContext } from '../internal/inheritedContext';
import { useReducedMotion } from '../internal/useReducedMotion';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  /** Short, non-interactive text. Never put the only copy of important information here. */
  content: ReactNode;
  /** The element it describes. Must be focusable (a Button or IconButton). */
  children: ReactElement;
  /** @default 'top' */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Hover delay in ms. Keyboard focus shows it immediately. @default 400 */
  delay?: number;
  /** Uncontrolled initial state (docs previews). */
  defaultOpen?: boolean;
}

/** Wrap an app once to share hover delays between neighbouring tooltips. */
export const TooltipProvider = RadixTooltip.Provider;

/**
 * A label or hint for a focusable element, shown on hover and focus, dismissible with Escape
 * (WCAG 1.4.13). It describes the trigger via aria-describedby; it does not name it.
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 400,
  defaultOpen,
}: TooltipProps) {
  const reduced = useReducedMotion();
  const trigger = useRef<HTMLButtonElement>(null);
  const inherit = useCallback((node: HTMLElement | null) => {
    if (node) applyInheritedContext(node, trigger.current);
  }, []);

  return (
    <RadixTooltip.Provider delayDuration={delay}>
      <RadixTooltip.Root defaultOpen={defaultOpen}>
        <RadixTooltip.Trigger asChild ref={trigger}>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            ref={inherit}
            side={side}
            sideOffset={6 /* between space.1 and space.2: clears the focus ring */}
            className={styles.tooltip}
            data-hb-tooltip=""
            data-motion={reduced ? 'reduced' : undefined}
          >
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
