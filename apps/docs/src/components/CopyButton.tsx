import { Button } from '@ianmiyazato/harbor-react';

/** Static Harbor Button; Snippet.astro's script copies `data-copy` to the clipboard. */
export function CopyButton({ code }: { code: string }) {
  return (
    <Button size="sm" data-copy={code}>
      <span data-copy-label="">Copy code</span>
    </Button>
  );
}
