import * as RadixSelect from '@radix-ui/react-select';
import { useId, useRef, useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { cx } from '../internal/cx';
import { CheckIcon, ChevronDownIcon } from '../internal/icons';
import { mergeRefs } from '../internal/mergeRefs';
import { readInheritedContext } from '../internal/inheritedContext';
import type { InheritedContext } from '../internal/inheritedContext';
import { useReducedMotion } from '../internal/useReducedMotion';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'value' | 'defaultValue' | 'onChange' | 'dir' | 'children'
> {
  /** Visible label. */
  label: string;
  options: SelectOption[];
  /** Shown until a value is chosen. */
  placeholder?: string;
  /** Helper text, linked with aria-describedby. */
  hint?: string;
  /** Error message. Sets aria-invalid and is announced politely. */
  error?: string;
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Form field name: a hidden native select is rendered for form submission. */
  name?: string;
  required?: boolean;
}

/** A single-choice menu built on Radix Select: typeahead, keyboard and screen-reader support included. */
export function Select({
  label,
  options,
  placeholder = 'Select…',
  hint,
  error,
  value,
  defaultValue,
  onValueChange,
  name,
  required,
  disabled,
  id,
  className,
  ref,
  ...rest
}: SelectProps) {
  const reduced = useReducedMotion();
  const autoId = useId();
  const triggerId = id ?? `hb-select-${autoId}`;
  const hintId = `${triggerId}-hint`;
  const errorId = `${triggerId}-error`;
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [inherited, setInherited] = useState<InheritedContext>({});

  function handleOpenChange(next: boolean) {
    if (next) setInherited(readInheritedContext(trigger.current));
    setOpen(next);
  }
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div
      className={cx(styles.field, className)}
      data-invalid={error ? '' : undefined}
      data-motion={reduced ? 'reduced' : undefined}
    >
      <label className={styles.label} htmlFor={triggerId}>
        {label}
      </label>
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        open={open}
        onOpenChange={handleOpenChange}
        name={name}
        required={required}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          ref={mergeRefs(trigger, ref)}
          id={triggerId}
          className={styles.trigger}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          {...rest}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className={styles.icon}>
            <ChevronDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            className={styles.content}
            position="popper"
            sideOffset={4 /* space.1 */}
            {...inherited}
            data-motion={reduced ? 'reduced' : inherited['data-motion']}
          >
            <RadixSelect.Viewport className={styles.viewport}>
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={styles.item}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className={styles.indicator}>
                    <CheckIcon />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <div aria-live="polite" className={styles.errorRegion}>
        {error && (
          <p id={errorId} className={styles.error}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
