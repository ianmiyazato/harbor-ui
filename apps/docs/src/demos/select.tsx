import { Select } from '@ianmiyazato/harbor-react';
import { useState } from 'react';
import s from './demo.module.css';

const offices = [
  { value: 'ams', label: 'Amsterdam' },
  { value: 'ber', label: 'Berlin' },
  { value: 'lis', label: 'Lisbon' },
  { value: 'sao', label: 'São Paulo' },
  { value: 'tyo', label: 'Tokyo' },
  { value: 'yvr', label: 'Vancouver', disabled: true },
];

export function Playground() {
  const [office, setOffice] = useState<string>();
  return (
    <div className={s.grid}>
      <Select
        label="Office"
        placeholder="Choose an office"
        hint="Vancouver opens next year."
        options={offices}
        value={office}
        onValueChange={setOffice}
      />
      <p className={s.caption} aria-live="polite">
        {office
          ? `You picked ${offices.find((o) => o.value === office)?.label}.`
          : 'Nothing picked yet. Try typing a letter to jump.'}
      </p>
    </div>
  );
}

export const Do = () => <Select label="Office" placeholder="Choose an office" options={offices} />;

export const Dont = () => (
  <Select
    label="Newsletter"
    placeholder="Yes or no"
    options={[
      { value: 'y', label: 'Yes' },
      { value: 'n', label: 'No' },
    ]}
  />
);
