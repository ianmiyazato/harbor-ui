import type { DocumentedState } from '../internal/states';
import type { IconButtonProps } from './IconButton';

/** A plain heart outline, so the states list is self-contained. */
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z" />
    </svg>
  );
}

const base: IconButtonProps = { 'aria-label': 'Like', icon: <HeartIcon /> };

export const iconButtonStates: DocumentedState<IconButtonProps>[] = [
  { name: 'default', props: base },
  { name: 'hover', props: base, preview: 'hover' },
  { name: 'focus-visible', props: base, preview: 'focus-visible' },
  { name: 'active', props: base, preview: 'active' },
  { name: 'disabled', props: { ...base, disabled: true } },
  { name: 'loading', props: { ...base, loading: true } },
];
