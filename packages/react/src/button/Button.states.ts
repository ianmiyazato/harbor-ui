import type { DocumentedState } from '../internal/states';
import type { ButtonProps, ButtonVariant } from './Button';

export const buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger'];

const label = { children: 'Save changes' };

export const buttonStates: DocumentedState<ButtonProps>[] = [
  { name: 'default', props: label },
  { name: 'hover', props: label, preview: 'hover' },
  { name: 'focus-visible', props: label, preview: 'focus-visible' },
  { name: 'active', props: label, preview: 'active' },
  { name: 'disabled', props: { ...label, disabled: true } },
  { name: 'loading', props: { ...label, loading: true } },
];
