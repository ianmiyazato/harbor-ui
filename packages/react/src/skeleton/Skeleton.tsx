import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { cx } from '../internal/cx';
import { useReducedMotion } from '../internal/useReducedMotion';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends ComponentPropsWithRef<'span'> {
  /** @default 'text' */
  shape?: 'text' | 'rect' | 'circle';
  /** Final content width (number = px). Match it so the swap to content does not shift layout. */
  width?: CSSProperties['width'];
  /** Final content height (number = px). */
  height?: CSSProperties['height'];
  /** Number of text lines. The last is shorter, like a real paragraph. @default 1 */
  lines?: number;
  /** Shimmer. Always off under reduced motion. @default true */
  animated?: boolean;
}

/**
 * A placeholder shaped like the content that will replace it. Decorative: put `aria-busy`
 * on the region that is loading, not on each skeleton.
 */
export function Skeleton({
  shape = 'text',
  width,
  height,
  lines = 1,
  animated = true,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const reduced = useReducedMotion();
  const shimmer = animated && !reduced;
  const multiline = shape === 'text' && lines > 1;

  return (
    <span
      className={cx(styles.skeleton, multiline && styles.stack, className)}
      data-shape={shape}
      data-animated={shimmer ? '' : undefined}
      data-motion={reduced ? 'reduced' : undefined}
      aria-hidden="true"
      style={{ width, height, ...style }}
      {...rest}
    >
      {multiline &&
        Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={styles.line}
            data-line=""
            data-last={i === lines - 1 ? '' : undefined}
          />
        ))}
    </span>
  );
}
