import type { DocumentedState } from '../internal/states';
import type { BadgeProps, BadgeTone } from './Badge';

export const badgeTones: BadgeTone[] = ['neutral', 'success', 'warning', 'danger', 'info'];

export const badgeStates: DocumentedState<BadgeProps>[] = [
  { name: 'default', props: { children: 'In review' } },
];
