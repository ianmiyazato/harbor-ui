import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { emulateReducedMotion } from '../../test/utils';
import { Button } from '../button/Button';
import { Dialog, DialogClose } from './Dialog';
import type { DialogProps } from './Dialog';

function Example(props: Partial<DialogProps>) {
  return (
    <>
      <Dialog
        trigger={<Button>Delete project</Button>}
        title="Delete project?"
        description="This removes 12 files. You can't undo it."
        footer={
          <>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <Button variant="danger">Delete</Button>
          </>
        }
        {...props}
      >
        <p>Type the project name to confirm.</p>
        <input aria-label="Project name" />
      </Dialog>
      <button>Outside</button>
    </>
  );
}

describe('Dialog', () => {
  it('opens from its trigger as a modal dialog named by its title and described by its description', async () => {
    const user = userEvent.setup();
    render(<Example />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete project?' });
    expect(dialog).toHaveAccessibleDescription("This removes 12 files. You can't undo it.");
  });

  it('moves focus inside and traps Tab within the dialog', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    for (let i = 0; i < 6; i++) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('hides the rest of the page from assistive tech while open', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    expect(screen.queryByRole('button', { name: 'Outside' })).not.toBeInTheDocument();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Delete project' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes from the close button and DialogClose, returning focus', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Delete project' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('locks page scroll while open and releases it on close', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    expect(document.body).toHaveAttribute('data-scroll-locked');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(document.body).not.toHaveAttribute('data-scroll-locked'));
  });

  it('follows open when controlled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<Example open={false} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender(<Example open onOpenChange={onOpenChange} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('inherits the local theme of its trigger, even though it renders in a portal', async () => {
    const user = userEvent.setup();
    render(
      <div data-theme="dark">
        <Example />
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-theme', 'dark');
  });

  it('renders no empty body or footer, defaults to the medium size and has no dangling description', () => {
    render(<Dialog title="Rename" defaultOpen />);
    const dialog = screen.getByRole('dialog', { name: 'Rename' });
    expect(dialog).toHaveAttribute('data-size', 'md');
    expect(dialog).not.toHaveAttribute('aria-describedby');
    // Title and close button only.
    expect(dialog.children).toHaveLength(2);
  });

  it('requires a title at the type level', () => {
    const typeOnly = () => (
      // @ts-expect-error every dialog needs an accessible title
      <Dialog trigger={<Button>Open</Button>}>Body</Dialog>
    );
    expect(typeof typeOnly).toBe('function');
  });

  it('uses the reduced-motion variant when the user prefers reduced motion', async () => {
    emulateReducedMotion();
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-motion', 'reduced');
  });
});
