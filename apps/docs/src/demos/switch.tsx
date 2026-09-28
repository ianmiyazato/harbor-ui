import { Button, Switch } from '@ianmiyazato/harbor-react';
import { useState } from 'react';
import s from './demo.module.css';

export function Playground() {
  const [autosave, setAutosave] = useState(true);
  return (
    <div className={s.card}>
      <Switch
        label="Autosave drafts"
        description="Saves every 30 seconds."
        checked={autosave}
        onCheckedChange={setAutosave}
      />
      <Switch label="Show line numbers" defaultChecked />
      <Switch label="Sync across devices" description="Requires a signed-in account." disabled />
      <p className={s.caption} aria-live="polite">
        Autosave is {autosave ? 'on' : 'off'}. The change applied instantly: no Save button.
      </p>
    </div>
  );
}

export const Do = () => <Switch label="Autosave drafts" defaultChecked />;

export const Dont = () => (
  <div className={s.col}>
    <Switch label="Autosave drafts" defaultChecked />
    <Button variant="primary">Save settings</Button>
  </div>
);
