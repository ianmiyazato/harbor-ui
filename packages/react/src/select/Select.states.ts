import type { DocumentedState } from '../internal/states';
import type { SelectProps } from './Select';

const base: SelectProps = {
  label: 'Office',
  placeholder: 'Choose an office',
  hint: 'Where you work most days.',
  options: [
    { value: 'ams', label: 'Amsterdam' },
    { value: 'ber', label: 'Berlin' },
    { value: 'lis', label: 'Lisbon' },
    { value: 'tyo', label: 'Tokyo' },
  ],
};

/** Pressing a select opens it, so `active` is covered by the open listbox, tested separately. */
export const selectStates: DocumentedState<SelectProps>[] = [
  { name: 'default', props: base },
  { name: 'hover', props: base, preview: 'hover' },
  { name: 'focus-visible', props: base, preview: 'focus-visible' },
  { name: 'disabled', props: { ...base, disabled: true } },
  { name: 'error', props: { ...base, error: 'Choose an office to continue.' } },
];
