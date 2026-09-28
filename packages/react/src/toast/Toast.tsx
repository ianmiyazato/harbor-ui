import * as RadixToast from '@radix-ui/react-toast';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../button/Button';
import { CloseIcon } from '../internal/icons';
import { useReducedMotion } from '../internal/useReducedMotion';
import styles from './Toast.module.css';

export interface ToastOptions {
  title: string;
  description?: string;
  /** @default 'neutral' */
  tone?: 'neutral' | 'success' | 'danger';
  /** One follow-up action, typically Undo. `altText` tells screen-reader users how to reach it. */
  action?: { label: string; altText: string; onAction: () => void };
  /** Override the provider's duration for this toast, in ms. */
  duration?: number;
}

interface ToastRecord extends ToastOptions {
  id: string;
  open: boolean;
}

interface ToastApi {
  /** Show a toast; returns its id. */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** How long a toast stays, in ms. Paused while hovered or focused. @default 6000 */
  duration?: number;
  /** Most toasts visible at once; the rest wait in a queue. @default 3 */
  max?: number;
  /** Name of the notifications region. @default 'Notifications' */
  label?: string;
  /** `viewport`: fixed to the window corner. `container`: inside the nearest positioned ancestor. @default 'viewport' */
  position?: 'viewport' | 'container';
}

/**
 * Hosts toasts for everything inside it. Toasts announce politely, pause while hovered or
 * focused (Radix pauses the whole region), queue beyond `max`, and swipe right to dismiss.
 */
export function ToastProvider({
  children,
  duration = 6000,
  max = 3,
  label = 'Notifications',
  position = 'viewport',
}: ToastProviderProps) {
  const reduced = useReducedMotion();
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const counter = useRef(0);

  const toast = useCallback((options: ToastOptions) => {
    counter.current += 1;
    const id = `hb-toast-${counter.current}`;
    // Closed toasts have finished leaving by the time a new one arrives; drop them then.
    setToasts((current) => [...current.filter((t) => t.open), { ...options, id, open: true }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.map((t) => (t.id === id ? { ...t, open: false } : t)));
  }, []);

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  // Closing toasts stay mounted for their exit animation; only open ones count toward `max`.
  let openCount = 0;
  const rendered = toasts.filter((t) => !t.open || openCount++ < max);

  return (
    <ToastContext.Provider value={api}>
      <RadixToast.Provider duration={duration} label={label} swipeDirection="right">
        {children}
        {rendered.map((t) => (
          <RadixToast.Root
            key={t.id}
            type="background"
            open={t.open}
            duration={t.duration}
            onOpenChange={(open) => !open && dismiss(t.id)}
            className={styles.toast}
            data-tone={t.tone ?? 'neutral'}
            data-motion={reduced ? 'reduced' : undefined}
          >
            <div className={styles.text}>
              <RadixToast.Title className={styles.title}>{t.title}</RadixToast.Title>
              {t.description && (
                <RadixToast.Description className={styles.description}>
                  {t.description}
                </RadixToast.Description>
              )}
            </div>
            {t.action && (
              <RadixToast.Action altText={t.action.altText} asChild>
                <Button size="sm" onClick={t.action.onAction}>
                  {t.action.label}
                </Button>
              </RadixToast.Action>
            )}
            <RadixToast.Close className={styles.close} aria-label="Dismiss notification">
              <CloseIcon />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport
          className={styles.viewport}
          data-position={position}
          data-motion={reduced ? 'reduced' : undefined}
        />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

/** `const { toast, dismiss } = useToast()` inside a ToastProvider. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside a <ToastProvider>.');
  return api;
}
