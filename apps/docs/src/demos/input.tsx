import { Input } from '@ianmiyazato/harbor-react';
import { useState } from 'react';
import s from './demo.module.css';

export function Playground() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const invalid = touched && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  return (
    <div className={s.grid}>
      <Input
        label="Work email"
        hint="Leave the field to validate it."
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        error={invalid ? 'Enter a full email address, like ada@example.com.' : undefined}
        placeholder="ada@example.com"
      />
      <Input label="Short bio" hint="Shown on your profile." maxLength={80} showCount />
      <Input label="Workspace" defaultValue="harbor-ui" disabled />
    </div>
  );
}

export const Do = () => (
  <Input label="Work email" hint="We only use it for sign-in." placeholder="ada@example.com" />
);

export const Dont = () => <span className={s.fakeInput}>Work email</span>;
