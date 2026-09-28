import { Skeleton } from '@ianmiyazato/harbor-react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Ref } from 'react';
import type { DemoHandle } from './LikeDemo';
import { timescale } from './motion';
import s from './lab.module.css';

const LOAD_MS = 1400;

/**
 * Skeleton to content. Both layers share one grid cell and the content defines the size, so the
 * skeleton matches the final layout exactly and the swap is a pure 200ms opacity crossfade.
 */
export function SkeletonDemo({ ref }: { ref?: Ref<DemoHandle> }) {
  const root = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const delay = LOAD_MS * (root.current ? timescale(root.current) : 1);
    const timer = window.setTimeout(() => setLoading(false), delay);
    return () => window.clearTimeout(timer);
  }, [run]);

  useImperativeHandle(ref, () => ({
    replay() {
      setLoading(true);
      setRun((r) => r + 1);
    },
  }));

  return (
    <div ref={root} className={s.skeletonDemo}>
      <article className={s.profileCard} aria-busy={loading} aria-label="Profile">
        <div
          className={s.layer}
          data-motion-part=""
          data-visible={loading ? '' : undefined}
          aria-hidden="true"
        >
          <Skeleton shape="circle" width={48} height={48} />
          <div className={s.lines}>
            <Skeleton shape="text" className={s.skName} />
            <Skeleton shape="text" lines={2} />
            <Skeleton shape="text" className={s.skMeta} />
          </div>
        </div>
        <div
          className={s.layer}
          data-motion-part=""
          data-visible={loading ? undefined : ''}
          inert={loading}
        >
          <span className={s.avatar} aria-hidden="true">
            GH
          </span>
          <div className={s.lines}>
            <p className={s.pName}>Grace Hopper</p>
            <p className={s.pBio}>
              Rear admiral, compiler pioneer, and patient explainer of nanoseconds.
            </p>
            <p className={s.pMeta}>Arlington · 42 talks this year</p>
          </div>
        </div>
      </article>
    </div>
  );
}
