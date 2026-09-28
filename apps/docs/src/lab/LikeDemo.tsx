import { Button, Checkbox, IconButton } from '@ianmiyazato/harbor-react';
import { useImperativeHandle, useRef, useState } from 'react';
import type { Ref } from 'react';
import { timescale } from './motion';
import s from './lab.module.css';

export interface DemoHandle {
  replay: () => void;
}

const LATENCY_MS = 700;

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z" />
    </svg>
  );
}

/**
 * Optimistic like: the count changes before the server answers. One request in five fails
 * (or the next one, on demand); the UI then rolls back with a short shake and offers a retry.
 */
export function LikeDemo({ ref }: { ref?: Ref<DemoHandle> }) {
  const root = useRef<HTMLDivElement>(null);
  const requests = useRef(0);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(128);
  const [failNext, setFailNext] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pop, setPop] = useState(0);
  const [shake, setShake] = useState(0);

  function send(next: boolean) {
    requests.current += 1;
    const fails = failNext || requests.current % 5 === 0;
    if (failNext) setFailNext(false);
    const delay = LATENCY_MS * (root.current ? timescale(root.current) : 1);
    window.setTimeout(() => {
      if (!fails) return;
      setLiked(!next);
      setCount((c) => c + (next ? -1 : 1));
      setShake((k) => k + 1);
      setFailed(true);
    }, delay);
  }

  function toggle(next = !liked) {
    setFailed(false);
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    if (next) setPop((k) => k + 1);
    send(next);
  }

  useImperativeHandle(ref, () => ({
    replay() {
      // Reset quietly, then like again so the pop plays.
      if (liked) {
        setLiked(false);
        setCount((c) => c - 1);
      }
      setFailed(false);
      setLiked(true);
      setCount((c) => c + 1);
      setPop((k) => k + 1);
    },
  }));

  return (
    <div ref={root} className={s.likeDemo}>
      <div className={s.likeRow}>
        <IconButton
          aria-label={`Like, ${count} likes`}
          aria-pressed={liked}
          variant="ghost"
          size="lg"
          className={s.likeButton}
          data-liked={liked ? '' : undefined}
          onClick={() => toggle()}
          icon={
            <span
              key={`${pop}-${shake}`}
              className={s.heart}
              data-motion-part=""
              data-anim={shake && failed ? 'shake' : pop ? 'pop' : undefined}
            >
              <Heart filled={liked} />
            </span>
          }
        />
        <span className={s.count} data-count="" aria-hidden="true">
          {count}
        </span>
      </div>
      <p className={s.likeError} aria-live="polite">
        {failed && (
          <>
            <span>Couldn’t save — retry</span>
            <Button size="sm" onClick={() => toggle(true)}>
              Retry
            </Button>
          </>
        )}
      </p>
      <Checkbox label="Next request fails" checked={failNext} onCheckedChange={setFailNext} />
    </div>
  );
}
