import { Checkbox } from '@ianmiyazato/harbor-react';
import { useState } from 'react';
import s from './demo.module.css';

const topics = ['Product updates', 'Security notices', 'Event invitations'];

export function Playground() {
  const [picked, setPicked] = useState<string[]>(['Security notices']);
  const all = picked.length === topics.length;
  const some = picked.length > 0 && !all;
  return (
    <div className={s.card}>
      <Checkbox
        label="All email topics"
        checked={some ? 'indeterminate' : all}
        onCheckedChange={(next) => setPicked(next ? topics : [])}
      />
      <ul className={s.list} style={{ paddingInlineStart: 'var(--hb-space-6)' }}>
        {topics.map((topic) => (
          <li key={topic}>
            <Checkbox
              label={topic}
              checked={picked.includes(topic)}
              onCheckedChange={(on) =>
                setPicked((p) => (on ? [...p, topic] : p.filter((t) => t !== topic)))
              }
            />
          </li>
        ))}
      </ul>
      <p className={s.caption}>
        {picked.length} of {topics.length} selected. The parent shows a mixed state.
      </p>
    </div>
  );
}

export const Do = () => (
  <div className={s.col}>
    <Checkbox label="Product updates" defaultChecked />
    <Checkbox label="Event invitations" />
  </div>
);

export const Dont = () => <Checkbox label="Dark mode (applies instantly)" defaultChecked />;
