/**
 * The documented states of a component. One list drives the docs states row,
 * the axe tests and the visual regression screenshots, so they can never drift apart.
 */
export type StateName =
  | 'default'
  | 'hover'
  | 'focus-visible'
  | 'active'
  | 'disabled'
  | 'loading'
  | 'error'
  | 'checked'
  | 'indeterminate'
  | 'open'
  | 'selected';

/**
 * Pseudo-class states cannot be triggered from props, so component CSS also matches
 * `[data-preview='hover' | 'focus-visible' | 'active']`. Only docs and tests set it.
 */
export type PreviewState = 'hover' | 'focus-visible' | 'active';

export interface DocumentedState<P> {
  name: StateName;
  props: P;
  preview?: PreviewState;
}
