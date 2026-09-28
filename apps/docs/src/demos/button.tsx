import { Button, Switch } from '@ianmiyazato/harbor-react';
import { useState } from 'react';
import s from './demo.module.css';
import { PlusIcon } from './icons';

export function Playground() {
  const [loading, setLoading] = useState(false);
  return (
    <div className={s.col}>
      <div className={s.row}>
        <Button variant="primary">Publish</Button>
        <Button>Save draft</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </div>
      <div className={s.row}>
        <Button size="sm" iconStart={<PlusIcon />}>
          Small
        </Button>
        <Button iconStart={<PlusIcon />}>Medium</Button>
        <Button size="lg" iconStart={<PlusIcon />}>
          Large
        </Button>
      </div>
      <div className={s.row}>
        <Button
          variant="primary"
          loading={loading}
          loadingLabel="Saving"
          data-testid="loading-demo"
        >
          Save changes
        </Button>
        <Switch label="Loading" checked={loading} onCheckedChange={setLoading} />
      </div>
      <p className={s.caption}>
        Toggle loading: the button keeps its width, stays focusable and ignores clicks.
      </p>
    </div>
  );
}

export const Do = () => (
  <div className={s.row}>
    <Button>Save draft</Button>
    <Button variant="primary">Publish</Button>
  </div>
);

export const Dont = () => (
  <div className={s.row}>
    <Button variant="primary">Save draft</Button>
    <Button variant="primary">Publish</Button>
  </div>
);
