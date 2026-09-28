import { Button, ToastProvider, useToast } from '@ianmiyazato/harbor-react';
import { useState } from 'react';
import s from './demo.module.css';

function Inbox() {
  const { toast } = useToast();
  const [archived, setArchived] = useState(0);
  return (
    <div className={s.col}>
      <div className={s.row}>
        <Button
          onClick={() => {
            setArchived((n) => n + 1);
            toast({
              title: 'Message archived',
              description: 'Moved out of your inbox.',
              action: {
                label: 'Undo',
                altText: 'Undo archive',
                onAction: () => setArchived((n) => n - 1),
              },
            });
          }}
        >
          Archive message
        </Button>
        <Button
          variant="primary"
          onClick={() => toast({ title: 'Changes saved', tone: 'success' })}
        >
          Save
        </Button>
      </div>
      <p className={s.caption} aria-live="polite">
        {archived} archived. Hover a toast to pause its 6-second timer; Undo restores the message.
      </p>
    </div>
  );
}

export function Playground() {
  return (
    <ToastProvider position="container">
      <Inbox />
    </ToastProvider>
  );
}

export const Do = () => (
  <div className={s.card} style={{ maxWidth: '20rem' }}>
    <p className={s.name}>Message archived</p>
    <div className={s.row}>
      <Button size="sm">Undo</Button>
    </div>
  </div>
);

export const Dont = () => (
  <div className={s.card} style={{ maxWidth: '20rem' }}>
    <p className={s.name}>Payment failed: card declined</p>
    <p className={s.caption}>Disappears in 6 seconds.</p>
  </div>
);
