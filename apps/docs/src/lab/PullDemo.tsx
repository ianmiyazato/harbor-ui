import { Button } from '@ianmiyazato/harbor-react';
import { useImperativeHandle, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent, Ref } from 'react';
import type { DemoHandle } from './LikeDemo';
import { isReduced, timescale } from './motion';
import s from './lab.module.css';

/** Rubber-band resistance: content follows the pointer at half speed. */
const RESISTANCE = 0.5;
const THRESHOLD = 56;
const MAX_PULL = 120;
const REFRESH_MS = 1200;

type Phase = 'idle' | 'pulling' | 'refreshing' | 'settling';

const messages = [
  'Harbor pilot boarding at 06:10',
  'Tide high at 07:42',
  'Ferry 3 departs on time',
];

/**
 * Pull to refresh. Drag down: the list follows at half the pointer distance. Past the threshold it
 * snaps, a spinner runs, then it settles back on a spring. Refresh is the keyboard and
 * assistive-tech equivalent. Only transform moves: nothing reflows.
 */
export function PullDemo({ ref }: { ref?: Ref<DemoHandle> }) {
  const root = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [pull, setPull] = useState(0);
  const [updated, setUpdated] = useState('Updated 2 minutes ago');

  function refresh() {
    const el = root.current;
    const reduced = !el || isReduced(el);
    setPhase('refreshing');
    setPull(reduced ? 0 : THRESHOLD);
    window.setTimeout(
      () => {
        setPhase('settling');
        setPull(0);
        setUpdated(
          `Updated just now · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        );
        window.setTimeout(() => setPhase('idle'), 600 * (el ? timescale(el) : 1));
      },
      REFRESH_MS * (el ? timescale(el) : 1),
    );
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (phase !== 'idle' || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = event.clientY;
    setPhase('pulling');
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (phase !== 'pulling' || start.current === null) return;
    setPull(Math.min(MAX_PULL, Math.max(0, event.clientY - start.current) * RESISTANCE));
  }

  function onPointerUp() {
    if (phase !== 'pulling') return;
    start.current = null;
    if (pull >= THRESHOLD) refresh();
    else {
      setPhase('idle');
      setPull(0);
    }
  }

  useImperativeHandle(ref, () => ({
    replay() {
      if (phase === 'idle') refresh();
    },
  }));

  const progress = Math.min(1, pull / THRESHOLD);

  return (
    <div ref={root} className={s.pullDemo}>
      <div
        className={s.pullPanel}
        data-pull-panel=""
        data-phase={phase}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className={s.pullIndicator}
          data-motion-part=""
          aria-hidden="true"
          style={
            { '--pull-progress': progress, opacity: phase === 'idle' ? 0 : 1 } as CSSProperties
          }
        >
          {phase === 'refreshing' ? (
            <span className={s.pullSpinner} />
          ) : (
            <span className={s.pullArrow}>↓</span>
          )}
        </div>
        <ul
          className={s.pullContent}
          data-pull-content=""
          data-motion-part=""
          style={{ transform: `translateY(${pull}px)` }}
        >
          {messages.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
      <div className={s.pullFooter}>
        <p role="status" className={s.pMeta}>
          {phase === 'refreshing' ? 'Refreshing…' : updated}
        </p>
        <Button size="sm" onClick={refresh} disabled={phase !== 'idle'}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
