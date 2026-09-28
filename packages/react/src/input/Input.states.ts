import type { DocumentedState } from '../internal/states';
import type { InputProps } from './Input';

const base: InputProps = {
  label: 'Work email',
  hint: 'We only use it for sign-in.',
  placeholder: 'ada@example.com',
};

/** Text inputs have no meaningful pressed state, so `active` is not documented. */
export const inputStates: DocumentedState<InputProps>[] = [
  { name: 'default', props: base },
  { name: 'hover', props: base, preview: 'hover' },
  { name: 'focus-visible', props: base, preview: 'focus-visible' },
  { name: 'disabled', props: { ...base, disabled: true } },
  { name: 'error', props: { ...base, defaultValue: 'ada@', error: 'Enter a full email address.' } },
];
