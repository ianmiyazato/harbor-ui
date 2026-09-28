import type { DocumentedState } from '../internal/states';
import type { CheckboxProps } from './Checkbox';

const base: CheckboxProps = {
  label: 'Email me product updates',
  description: 'About once a month.',
};

export const checkboxStates: DocumentedState<CheckboxProps>[] = [
  { name: 'default', props: base },
  { name: 'hover', props: base, preview: 'hover' },
  { name: 'focus-visible', props: base, preview: 'focus-visible' },
  { name: 'active', props: base, preview: 'active' },
  { name: 'checked', props: { ...base, defaultChecked: true } },
  {
    name: 'indeterminate',
    props: { ...base, label: 'Select all', defaultChecked: 'indeterminate' },
  },
  { name: 'disabled', props: { ...base, disabled: true } },
  {
    name: 'error',
    props: { label: 'I accept the terms', error: 'Accept the terms to continue.' },
  },
];
