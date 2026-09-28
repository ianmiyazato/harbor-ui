import { Button } from '../button/Button';
import type { DocumentedState } from '../internal/states';
import { DialogClose } from './Dialog';
import type { DialogProps } from './Dialog';

const base: DialogProps = {
  title: 'Delete “Q3 launch”?',
  description: 'This removes the project and its 12 files for everyone. You can’t undo it.',
  trigger: <Button variant="danger">Delete project</Button>,
  footer: (
    <>
      <DialogClose asChild>
        <Button>Cancel</Button>
      </DialogClose>
      <Button variant="danger">Delete project</Button>
    </>
  ),
};

/** The trigger's own states are Button's; the dialog documents closed and open. */
export const dialogStates: DocumentedState<DialogProps>[] = [
  { name: 'default', props: base },
  { name: 'open', props: { ...base, defaultOpen: true } },
];
