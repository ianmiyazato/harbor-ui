import type { DocumentedState } from '../internal/states';
import type { SkeletonProps } from './Skeleton';

export const skeletonStates: DocumentedState<SkeletonProps>[] = [
  { name: 'default', props: { shape: 'text', lines: 3 } },
];
