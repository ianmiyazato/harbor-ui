import type { DocumentedState } from '../internal/states';
import type { SwitchProps } from './Switch';

const base: SwitchProps = { label: 'Autosave drafts', description: 'Saves every 30 seconds.' };

export const switchStates: DocumentedState<SwitchProps>[] = [
  { name: 'default', props: base },
  { name: 'hover', props: base, preview: 'hover' },
  { name: 'focus-visible', props: base, preview: 'focus-visible' },
  { name: 'active', props: base, preview: 'active' },
  { name: 'checked', props: { ...base, defaultChecked: true } },
  { name: 'disabled', props: { ...base, disabled: true } },
];
