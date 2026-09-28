import { Button } from '@ianmiyazato/harbor-react';

/** A Harbor Button rendered to static HTML; the page script makes it replay an animation. */
export function PlayButton({ label }: { label: string }) {
  return (
    <Button
      size="sm"
      data-play=""
      aria-label={label}
      iconStart={
        <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
          <path d="M5 3.5v9l7-4.5z" />
        </svg>
      }
    >
      Play
    </Button>
  );
}
