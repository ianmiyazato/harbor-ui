import { Button } from '@ianmiyazato/harbor-react';
import { useImperativeHandle, useRef, useState } from 'react';
import type { Ref } from 'react';
import { flushSync } from 'react-dom';
import type { DemoHandle } from './LikeDemo';
import { isReduced, tokenDuration } from './motion';
import s from './lab.module.css';

interface Photo {
  id: string;
  title: string;
  caption: string;
  sky: string;
  sea: string;
}

const photos: Photo[] = [
  {
    id: 'dawn',
    title: 'Harbor at dawn',
    caption: 'Low sun, still water, the first boats out.',
    sky: 'var(--hb-color-status-warning-bg)',
    sea: 'var(--hb-color-action-primary)',
  },
  {
    id: 'wall',
    title: 'Breakwater',
    caption: 'The long wall that keeps the harbor calm.',
    sky: 'var(--hb-color-status-info-bg)',
    sea: 'var(--hb-color-status-info-fg)',
  },
  {
    id: 'light',
    title: 'Lighthouse',
    caption: 'Two flashes every ten seconds, since 1886.',
    sky: 'var(--hb-color-surface-sunken)',
    sea: 'var(--hb-color-text-accent)',
  },
];

function Scene({ photo }: { photo: Photo }) {
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true" className={s.scene}>
      <rect width="160" height="100" fill={photo.sky} />
      <circle cx="120" cy="38" r="14" fill="var(--hb-color-surface-raised)" />
      <path d="M0 64 Q40 56 80 64 T160 64 V100 H0Z" fill={photo.sea} />
      <path
        d="M0 76 Q40 70 80 76 T160 76"
        fill="none"
        stroke="var(--hb-color-surface-raised)"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

/**
 * Card to detail with the View Transitions API. The image and title keep their size and only move
 * (so the morph is transform and opacity), the rest of the stage crossfades. Without the API it
 * falls back to a crossfade; with reduced motion it swaps instantly.
 */
export function CardDemo({ ref }: { ref?: Ref<DemoHandle> }) {
  const root = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const cards = useRef(new Map<string, HTMLButtonElement>());
  const [open, setOpen] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [fallback, setFallback] = useState(0);

  function go(next: string | null, focus: () => void, instant = false) {
    const el = root.current;
    const doc = document as ViewTransitionDocument;
    const update = () => flushSync(() => setOpen(next));
    if (instant || !el || isReduced(el)) {
      update();
      focus();
      return;
    }
    if (!doc.startViewTransition) {
      update();
      setFallback((k) => k + 1);
      focus();
      return;
    }
    // View-transition pseudo-elements live on the root, outside the tile, so pass its (maybe slowed) duration up.
    document.documentElement.style.setProperty(
      '--lab-vt-duration',
      `${tokenDuration(el, 'motion-duration-slow')}ms`,
    );
    flushSync(() => setActive(next ?? open));
    doc.startViewTransition(update).finished.finally(focus);
  }

  const openCard = (id: string, instant = false) => go(id, () => back.current?.focus(), instant);
  const close = () => {
    const id = open;
    go(null, () => (id ? cards.current.get(id)?.focus() : undefined));
  };

  useImperativeHandle(ref, () => ({
    replay() {
      if (open) flushSync(() => setOpen(null));
      openCard(photos[0]!.id);
    },
  }));

  const photo = photos.find((p) => p.id === open);
  const named = (id: string, part: string) =>
    active === id ? { viewTransitionName: `lab-${part}` } : undefined;

  return (
    <div ref={root} className={s.cardStage}>
      {photo ? (
        <div
          key={`detail-${fallback}`}
          className={s.detail}
          data-detail=""
          data-fallback={fallback ? '' : undefined}
        >
          <div className={s.detailImage} style={named(photo.id, 'photo')}>
            <Scene photo={photo} />
          </div>
          <div className={s.detailText}>
            <h3 className={s.cardTitle} style={named(photo.id, 'title')}>
              {photo.title}
            </h3>
            <p className={s.pMeta}>{photo.caption}</p>
            <Button ref={back} size="sm" onClick={close}>
              Back to all photos
            </Button>
          </div>
        </div>
      ) : (
        <ul className={s.cards}>
          {photos.map((p) => (
            <li key={p.id}>
              <button
                ref={(el) => {
                  if (el) cards.current.set(p.id, el);
                }}
                type="button"
                className={s.card}
                onClick={() => openCard(p.id)}
              >
                <span className={s.cardImage} style={named(p.id, 'photo')}>
                  <Scene photo={p} />
                </span>
                <span className={s.cardTitle} style={named(p.id, 'title')}>
                  {p.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
