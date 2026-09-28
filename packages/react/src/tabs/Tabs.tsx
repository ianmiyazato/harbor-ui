import * as RadixTabs from '@radix-ui/react-tabs';
import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { cx } from '../internal/cx';
import { mergeRefs } from '../internal/mergeRefs';
import { useReducedMotion } from '../internal/useReducedMotion';
import styles from './Tabs.module.css';

const ValueContext = createContext<string | undefined>(undefined);

export interface TabsProps extends Omit<
  ComponentPropsWithRef<typeof RadixTabs.Root>,
  'orientation'
> {
  /** Controlled selected tab. */
  value?: string;
  /** Uncontrolled initial tab. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/** Tabs switch between views of the same context. Arrow keys move and select (automatic activation). */
export function Tabs({ value, defaultValue, onValueChange, className, ...rest }: TabsProps) {
  const reduced = useReducedMotion();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value ?? uncontrolled;

  function handleValueChange(next: string) {
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
  }

  return (
    <ValueContext.Provider value={current}>
      <RadixTabs.Root
        value={current}
        onValueChange={handleValueChange}
        className={cx(styles.tabs, className)}
        data-motion={reduced ? 'reduced' : undefined}
        {...rest}
      />
    </ValueContext.Provider>
  );
}

export type TabListProps = ComponentPropsWithRef<typeof RadixTabs.List>;

/**
 * The row of tabs. Give it an `aria-label`. The active indicator is one element that slides
 * with `transform` only (translateX + scaleX), measured from the active tab.
 */
export function TabList({ className, children, ref, ...rest }: TabListProps) {
  const value = useContext(ValueContext);
  const list = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const place = () => {
      const active = el.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      const width = el.offsetWidth;
      if (!active || !width) return;
      el.style.setProperty('--hb-tab-x', `${active.offsetLeft}px`);
      el.style.setProperty(
        '--hb-tab-scale',
        String(Math.round((active.offsetWidth / width) * 1000) / 1000),
      );
      // Reading layout flushes the first position before transitions are enabled, so it never slides in from 0.
      void el.offsetWidth;
      el.setAttribute('data-indicator-ready', '');
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <RadixTabs.List ref={mergeRefs(list, ref)} className={cx(styles.list, className)} {...rest}>
      {children}
      <span className={styles.indicator} aria-hidden="true" />
    </RadixTabs.List>
  );
}

export type TabProps = ComponentPropsWithRef<typeof RadixTabs.Trigger>;

export function Tab({ className, ...rest }: TabProps) {
  return <RadixTabs.Trigger className={cx(styles.tab, className)} {...rest} />;
}

export type TabPanelProps = ComponentPropsWithRef<typeof RadixTabs.Content>;

export function TabPanel({ className, ...rest }: TabPanelProps) {
  return <RadixTabs.Content className={cx(styles.panel, className)} {...rest} />;
}
