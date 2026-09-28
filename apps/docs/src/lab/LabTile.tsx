import { Button, Switch, useReducedMotion } from '@ianmiyazato/harbor-react';
import { useId, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import s from './lab.module.css';

export interface LabSpec {
  duration: string;
  kind: 'Easing' | 'Spring';
  easing: string;
  communicates: string;
}

interface LabTileProps {
  id: string;
  index: number;
  title: string;
  spec: LabSpec;
  /** File under apps/docs/src/lab/. */
  source: string;
  onReplay: () => void;
  children: ReactNode;
}

const repo = 'https://github.com/ianmiyazato/harbor-ui/blob/main/apps/docs/src/lab/';

/**
 * A lab tile: the live demo, its motion spec, and controls to replay it, slow it down ×5
 * (a scoped --hb-timescale) or preview it with reduced motion (a scoped data-motion).
 */
export function LabTile({ id, index, title, spec, source, onReplay, children }: LabTileProps) {
  const headingId = useId();
  const osReduced = useReducedMotion();
  const [slow, setSlow] = useState(false);
  const [reduced, setReduced] = useState(false);

  return (
    <section
      className={s.tile}
      data-lab-tile={id}
      data-timescale=""
      data-motion={reduced || osReduced ? 'reduced' : 'full'}
      style={{ '--hb-timescale': slow ? 5 : 1 } as CSSProperties}
      aria-labelledby={headingId}
    >
      <header className={s.head}>
        <span className={s.index} aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        <h2 id={headingId}>{title}</h2>
      </header>
      <div className={s.stage} data-stage="">
        {children}
      </div>
      <dl className={s.spec} data-spec="">
        <div>
          <dt>Duration</dt>
          <dd>{spec.duration}</dd>
        </div>
        <div>
          <dt>{spec.kind}</dt>
          <dd>{spec.easing}</dd>
        </div>
        <div className={s.wide}>
          <dt>Communicates</dt>
          <dd>{spec.communicates}</dd>
        </div>
      </dl>
      <div className={s.controls}>
        <Button size="sm" onClick={onReplay}>
          Replay
        </Button>
        <Switch label="Slow motion ×5" checked={slow} onCheckedChange={setSlow} />
        <Switch
          label="Reduced motion"
          checked={reduced || osReduced}
          disabled={osReduced}
          onCheckedChange={setReduced}
        />
        <a className={s.source} href={repo + source}>
          View source
        </a>
      </div>
    </section>
  );
}
