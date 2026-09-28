import { Button, Dialog, DialogClose, Input } from '@ianmiyazato/harbor-react';
import { useState } from 'react';
import s from './demo.module.css';

export function Playground() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [deleted, setDeleted] = useState(false);
  return (
    <div className={s.col}>
      <div className={s.row}>
        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (next) setName('');
          }}
          title="Delete “Q3 launch”?"
          description="This removes the project and its 12 files for everyone. You can’t undo it."
          trigger={<Button variant="danger">Delete project</Button>}
          footer={
            <>
              <DialogClose asChild>
                <Button>Cancel</Button>
              </DialogClose>
              <Button
                variant="danger"
                disabled={name !== 'Q3 launch'}
                onClick={() => {
                  setDeleted(true);
                  setOpen(false);
                }}
              >
                Delete project
              </Button>
            </>
          }
        >
          <Input
            label="Type “Q3 launch” to confirm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Dialog>
      </div>
      <p className={s.caption} aria-live="polite">
        {deleted
          ? 'Deleted (not really, it’s a demo). Focus went back to the trigger.'
          : 'Open it, press Tab to see focus stay inside, then Escape to leave.'}
      </p>
    </div>
  );
}

export const Do = () => (
  <div className={s.card} style={{ maxWidth: '20rem' }}>
    <p className={s.name}>Delete “Q3 launch”?</p>
    <p className={s.caption}>This removes it for everyone.</p>
    <div className={s.row}>
      <Button size="sm">Cancel</Button>
      <Button size="sm" variant="danger">
        Delete
      </Button>
    </div>
  </div>
);

export const Dont = () => (
  <div className={s.card} style={{ maxWidth: '20rem' }}>
    <p className={s.name}>Tip of the day</p>
    <p className={s.caption}>You can drag files onto the page.</p>
    <div className={s.row}>
      <Button size="sm" variant="primary">
        OK
      </Button>
    </div>
  </div>
);
