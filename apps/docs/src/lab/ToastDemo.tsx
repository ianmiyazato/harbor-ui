import { Badge, Button, ToastProvider, useToast } from '@ianmiyazato/harbor-react';
import { useImperativeHandle, useState } from 'react';
import type { Ref } from 'react';
import type { DemoHandle } from './LikeDemo';
import s from './lab.module.css';

function Inbox({ handle }: { handle?: Ref<DemoHandle> }) {
  const { toast } = useToast();
  const [archived, setArchived] = useState(false);
  const [message, setMessage] = useState('');

  function archive() {
    setArchived(true);
    setMessage('');
    toast({
      title: 'Moved to Archive',
      description: '“Launch notes” left your inbox.',
      action: {
        label: 'Undo',
        altText: 'Undo archiving “Launch notes”',
        onAction: () => {
          setArchived(false);
          setMessage('Message restored.');
        },
      },
    });
  }

  useImperativeHandle(handle, () => ({
    replay() {
      setArchived(false);
      queueMicrotask(archive);
    },
  }));

  return (
    <div className={s.toastDemo}>
      <div className={s.mail}>
        {archived ? (
          <p className={s.mailArchived}>
            <Badge size="sm">Archived</Badge> One message moved to Archive.
          </p>
        ) : (
          <>
            <div className={s.mailText}>
              <p className={s.pName}>Ada · Launch notes</p>
              <p className={s.pMeta}>Contrast report is green in all three themes.</p>
            </div>
            <Button size="sm" onClick={archive}>
              Archive
            </Button>
          </>
        )}
      </div>
      <p className={s.announcer} data-announcer="" aria-live="polite">
        {message}
      </p>
    </div>
  );
}

/** Toast with undo, built on the Harbor Toast: slides 16px in 240ms, stays 6s, pauses on hover and focus. */
export function ToastDemo({ ref }: { ref?: Ref<DemoHandle> }) {
  return (
    <ToastProvider position="container" duration={6000}>
      <Inbox handle={ref} />
    </ToastProvider>
  );
}
