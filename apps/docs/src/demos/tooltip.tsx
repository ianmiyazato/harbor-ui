import { Button, IconButton, Tooltip } from '@ianmiyazato/harbor-react';
import s from './demo.module.css';
import { ArchiveIcon, LinkIcon, ShareIcon, TrashIcon } from './icons';

export function Playground() {
  return (
    <div className={s.col}>
      <div className={s.row} role="toolbar" aria-label="Message actions">
        <Tooltip content="Archive">
          <IconButton aria-label="Archive" icon={<ArchiveIcon />} variant="ghost" />
        </Tooltip>
        <Tooltip content="Share" side="bottom">
          <IconButton aria-label="Share" icon={<ShareIcon />} variant="ghost" />
        </Tooltip>
        <Tooltip content="Copy link" side="right">
          <IconButton aria-label="Copy link" icon={<LinkIcon />} variant="ghost" />
        </Tooltip>
        <Tooltip content="Moves to Trash for 30 days">
          <IconButton aria-label="Delete" icon={<TrashIcon />} variant="ghost" />
        </Tooltip>
      </div>
      <p className={s.caption}>
        Hover, or Tab to a button: focus shows the tooltip at once. Escape hides it.
      </p>
    </div>
  );
}

export const Do = () => (
  <Tooltip content="Copy link">
    <IconButton aria-label="Copy link" icon={<LinkIcon />} />
  </Tooltip>
);

export const Dont = () => (
  <div className={s.card} style={{ maxWidth: '16rem' }}>
    <p className={s.caption}>Password must be 12+ characters</p>
    <Button size="sm">Learn more</Button>
  </div>
);
