import { Button, IconButton, Tooltip } from '@ianmiyazato/harbor-react';
import s from './demo.module.css';
import { HeartIcon, LinkIcon, ShareIcon, SparkIcon, TrashIcon } from './icons';

export function Playground() {
  return (
    <div className={s.col}>
      <div className={s.row}>
        <Tooltip content="Like">
          <IconButton aria-label="Like" icon={<HeartIcon />} variant="primary" />
        </Tooltip>
        <Tooltip content="Share">
          <IconButton aria-label="Share" icon={<ShareIcon />} />
        </Tooltip>
        <Tooltip content="Copy link">
          <IconButton aria-label="Copy link" icon={<LinkIcon />} variant="ghost" />
        </Tooltip>
        <Tooltip content="Delete">
          <IconButton aria-label="Delete" icon={<TrashIcon />} variant="danger" />
        </Tooltip>
      </div>
      <div className={s.row}>
        <IconButton aria-label="Share, small" icon={<ShareIcon />} size="sm" />
        <IconButton aria-label="Share, medium" icon={<ShareIcon />} />
        <IconButton aria-label="Share, large" icon={<ShareIcon />} size="lg" />
      </div>
      <p className={s.caption}>
        Hover or focus the first row: each icon has a tooltip that repeats its name.
      </p>
    </div>
  );
}

export const Do = () => (
  <div className={s.row}>
    <IconButton aria-label="Copy link" icon={<LinkIcon />} />
    <Button variant="danger" iconStart={<TrashIcon />}>
      Delete project
    </Button>
  </div>
);

export const Dont = () => (
  <div className={s.row}>
    <IconButton aria-label="Magic" icon={<SparkIcon />} />
    <IconButton aria-label="Delete project" icon={<TrashIcon />} variant="danger" />
  </div>
);
