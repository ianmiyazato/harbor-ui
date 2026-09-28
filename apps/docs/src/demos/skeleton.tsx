import { Button, Skeleton } from '@ianmiyazato/harbor-react';
import { useEffect, useState } from 'react';
import s from './demo.module.css';

export function Playground() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, [loading]);
  return (
    <div className={s.col}>
      <section className={s.profile} aria-busy={loading} aria-label="Profile">
        {loading ? (
          <>
            <Skeleton shape="circle" width={48} height={48} />
            <Skeleton shape="text" lines={3} />
          </>
        ) : (
          <>
            <span className={`${s.avatar} ${s.fadeIn}`} aria-hidden="true">
              AL
            </span>
            <div className={s.fadeIn}>
              <p className={s.name}>Ada Lovelace</p>
              <p>Designs the notation. Writes the first program.</p>
              <p className={s.caption}>London · joined 1843</p>
            </div>
          </>
        )}
      </section>
      <div className={s.row}>
        <Button size="sm" onClick={() => setLoading(true)} disabled={loading}>
          Reload profile
        </Button>
      </div>
    </div>
  );
}

export const Do = () => (
  <div className={s.profile}>
    <Skeleton shape="circle" width={48} height={48} animated={false} />
    <Skeleton shape="text" lines={3} animated={false} />
  </div>
);

export const Dont = () => <Skeleton shape="rect" width={240} height={120} animated={false} />;
