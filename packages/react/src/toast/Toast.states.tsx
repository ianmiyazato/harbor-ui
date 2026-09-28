import { useEffect } from 'react';
import type { DocumentedState } from '../internal/states';
import { ToastProvider, useToast } from './Toast';
import type { ToastOptions } from './Toast';

export interface ToastExampleProps {
  tone?: ToastOptions['tone'];
}

function ShowOnMount({ tone }: ToastExampleProps) {
  const { toast } = useToast();
  useEffect(() => {
    toast({
      title: 'Message deleted',
      description: 'It stays in Trash for 30 days.',
      tone,
      action: { label: 'Undo', altText: 'Undo delete from the message list', onAction: () => {} },
      duration: 60_000,
    });
  }, [toast, tone]);
  return null;
}

/** A contained provider showing one toast, for docs, a11y tests and screenshots. */
export function ToastExample({ tone = 'neutral' }: ToastExampleProps) {
  return (
    <ToastProvider position="container">
      <ShowOnMount tone={tone} />
    </ToastProvider>
  );
}

export const toastStates: DocumentedState<ToastExampleProps>[] = [{ name: 'default', props: {} }];
