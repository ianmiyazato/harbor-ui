import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useImperativeHandle } from 'react';
import type { Ref } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { ToastProvider, useToast } from './Toast';
import type { ToastOptions, ToastProviderProps } from './Toast';

type Api = ReturnType<typeof useToast>;
const apiRef = createRef<Api>();
function Capture({ handle }: { handle?: Ref<Api> }) {
  const api = useToast();
  useImperativeHandle(handle, () => api, [api]);
  return <button>Page button</button>;
}

function setup(props: Partial<ToastProviderProps> = {}) {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(
    <ToastProvider {...props}>
      <Capture handle={apiRef} />
    </ToastProvider>,
  );
  return user;
}

const show = (options: ToastOptions) => act(() => void apiRef.current?.toast(options));
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
afterEach(() => {
  vi.useRealTimers();
});

describe('Toast', () => {
  it('throws a helpful error outside a ToastProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Capture />)).toThrow(/ToastProvider/);
  });

  it('shows a toast with title and description in a labelled notifications region', () => {
    setup();
    show({ title: 'Project archived', description: 'Q3 launch moved to Archive.' });
    const region = screen.getByRole('region', { name: /notifications/i });
    const item = within(region).getByRole('listitem');
    expect(item).toHaveTextContent('Project archived');
    expect(item).toHaveTextContent('Q3 launch moved to Archive.');
  });

  it('announces politely through a live region', () => {
    setup();
    show({ title: 'Saved' });
    advance(50); // Radix renders the announcement on the next frame.
    const status = screen
      .getAllByRole('status')
      .find((el) => el.getAttribute('aria-live') === 'polite');
    expect(status).toBeDefined();
    expect(status).toHaveTextContent('Saved');
  });

  it('dismisses itself after 6 seconds by default', () => {
    setup();
    show({ title: 'Saved' });
    advance(5_900);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
    advance(200);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('pauses the timer while hovered, resuming on leave', async () => {
    const user = setup();
    show({ title: 'Saved' });
    advance(3_000);
    await user.hover(screen.getByRole('listitem'));
    advance(10_000);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
    await user.unhover(screen.getByRole('listitem'));
    advance(3_100);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('pauses the timer while focus is inside', () => {
    setup();
    show({ title: 'Saved' });
    act(() => screen.getByRole('button', { name: 'Dismiss notification' }).focus());
    advance(10_000);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('runs the undo action and dismisses the toast', async () => {
    const user = setup();
    const onAction = vi.fn();
    show({
      title: 'Message deleted',
      action: { label: 'Undo', altText: 'Undo delete', onAction },
    });
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('closes from its dismiss button', async () => {
    const user = setup();
    show({ title: 'Saved' });
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('queues toasts beyond the visible limit and shows them as others leave', async () => {
    const user = setup({ max: 3 });
    for (const n of [1, 2, 3, 4, 5]) show({ title: `Toast ${n}` });
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      expect.stringContaining('Toast 1'),
      expect.stringContaining('Toast 2'),
      expect.stringContaining('Toast 3'),
    ]);
    await user.click(screen.getAllByRole('button', { name: 'Dismiss notification' })[0]!);
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      expect.stringContaining('Toast 2'),
      expect.stringContaining('Toast 3'),
      expect.stringContaining('Toast 4'),
    ]);
  });

  it('dismisses programmatically by id', () => {
    setup();
    let id = '';
    act(() => {
      id = apiRef.current?.toast({ title: 'Uploading' }) ?? '';
    });
    act(() => apiRef.current?.dismiss(id));
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('can live inside a container, e.g. a demo tile', () => {
    setup({ position: 'container' });
    show({ title: 'Saved' });
    expect(
      screen.getByRole('region', { name: /notifications/i }).querySelector('ol'),
    ).toHaveAttribute('data-position', 'container');
  });

  it('uses the reduced-motion variant when the user prefers reduced motion', () => {
    emulateReducedMotion();
    setup();
    show({ title: 'Saved' });
    expect(screen.getByRole('listitem')).toHaveAttribute('data-motion', 'reduced');
  });
});
