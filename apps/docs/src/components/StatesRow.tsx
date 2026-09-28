import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Input,
  Select,
  Skeleton,
  Switch,
  Tooltip,
} from '@ianmiyazato/harbor-react';
import {
  TabsExample,
  badgeStates,
  buttonStates,
  checkboxStates,
  dialogStates,
  iconButtonStates,
  inputStates,
  selectStates,
  skeletonStates,
  switchStates,
  tabsStates,
  tooltipStates,
} from '@ianmiyazato/harbor-react/states';
import type { ReactNode } from 'react';

interface Cell {
  name: string;
  node: ReactNode;
}

/** Trigger states for overlays: their open state lives in the live demo (and in visual tests). */
const closedOnly = (node: ReactNode): Cell[] => [{ name: 'default', node }];

function cells(slug: string): Cell[] {
  switch (slug) {
    case 'button':
      return buttonStates.map((s) => ({
        name: s.name,
        node: <Button {...s.props} variant="primary" data-preview={s.preview} />,
      }));
    case 'icon-button':
      return iconButtonStates.map((s) => ({
        name: s.name,
        node: <IconButton {...s.props} variant="secondary" data-preview={s.preview} />,
      }));
    case 'input':
      return inputStates.map((s) => ({
        name: s.name,
        node: <Input {...s.props} data-preview={s.preview} />,
      }));
    case 'checkbox':
      return checkboxStates.map((s) => ({
        name: s.name,
        node: <Checkbox {...s.props} data-preview={s.preview} />,
      }));
    case 'switch':
      return switchStates.map((s) => ({
        name: s.name,
        node: <Switch {...s.props} data-preview={s.preview} />,
      }));
    case 'badge':
      return badgeStates.map((s) => ({
        name: s.name,
        node: (
          <span style={{ display: 'flex', gap: 'var(--hb-space-2)', flexWrap: 'wrap' }}>
            {(['neutral', 'success', 'warning', 'danger', 'info'] as const).map((tone) => (
              <Badge key={tone} {...s.props} tone={tone}>
                {tone}
              </Badge>
            ))}
          </span>
        ),
      }));
    case 'skeleton':
      return skeletonStates.map((s) => ({ name: s.name, node: <Skeleton {...s.props} /> }));
    case 'select':
      return selectStates.map((s) => ({
        name: s.name,
        node: <Select {...s.props} data-preview={s.preview} />,
      }));
    case 'tabs':
      return tabsStates.map((s) => ({
        name: s.name,
        node: <TabsExample {...s.props} preview={s.preview} />,
      }));
    case 'dialog':
      return closedOnly(<Dialog {...dialogStates[0]!.props} />);
    case 'tooltip':
      return closedOnly(<Tooltip {...tooltipStates[0]!.props} />);
    case 'toast':
      return closedOnly(
        <p className="state-note">
          Toasts appear on demand: use the live demo above to raise one.
        </p>,
      );
    default:
      return [];
  }
}

const labels: Record<string, string> = { 'focus-visible': 'focus' };

/**
 * Every documented state, rendered to static HTML: real components and real CSS, no screenshots,
 * no JS. The specimens are inert (not focusable, not announced as dead controls); the live demo
 * above them is the interactive part. State names stay readable.
 */
export function StatesRow({ slug }: { slug: string }) {
  return (
    <ul className="states-row" aria-label="States">
      {cells(slug).map((cell) => (
        <li key={cell.name} className="state" data-state-name={cell.name}>
          <span className="state-label">{labels[cell.name] ?? cell.name}</span>
          <div className="state-cell" inert>
            {cell.node}
          </div>
        </li>
      ))}
    </ul>
  );
}
