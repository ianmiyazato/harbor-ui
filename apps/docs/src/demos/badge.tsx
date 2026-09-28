import { Badge, Button } from '@ianmiyazato/harbor-react';
import { useState } from 'react';
import s from './demo.module.css';

export function Playground() {
  const [paid, setPaid] = useState(false);
  return (
    <div className={s.col}>
      <div className={s.row}>
        <Badge>Draft</Badge>
        <Badge tone="info">In review</Badge>
        <Badge tone="success" dot>
          Live
        </Badge>
        <Badge tone="warning">Expires soon</Badge>
        <Badge tone="danger">Overdue</Badge>
        <Badge tone="info" size="sm">
          3 new
        </Badge>
      </div>
      <div className={s.card}>
        <div className={s.row}>
          <span className={s.name}>Invoice #1042</span>
          <Badge tone={paid ? 'success' : 'warning'}>{paid ? 'Paid' : 'Awaiting payment'}</Badge>
        </div>
        <div className={s.row}>
          <Button size="sm" onClick={() => setPaid((p) => !p)}>
            {paid ? 'Mark as unpaid' : 'Mark as paid'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Do = () => (
  <Badge tone="success" dot>
    Paid
  </Badge>
);

export const Dont = () => <span className={s.dotOnly} />;
