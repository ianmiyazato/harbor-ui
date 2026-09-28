import { IconButton } from '../icon-button/IconButton';
import type { DocumentedState } from '../internal/states';
import type { TooltipProps } from './Tooltip';

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
    </svg>
  );
}

const base: TooltipProps = {
  content: 'Copy link',
  children: <IconButton aria-label="Copy link to project" icon={<LinkIcon />} variant="ghost" />,
};

export const tooltipStates: DocumentedState<TooltipProps>[] = [
  { name: 'default', props: base },
  { name: 'open', props: { ...base, defaultOpen: true } },
];
