import { useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent, Ref } from 'react';
import type { DemoHandle } from './LikeDemo';
import { isReduced, springTiming } from './motion';
import s from './lab.module.css';

const initial = [
  'Draft outline',
  'Collect references',
  'Write first pass',
  'Edit for clarity',
  'Publish',
];

function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item as T);
  return next;
}

interface Lift {
  name: string;
  from: number;
  /** Order when the item was lifted, for Escape. */
  snapshot: string[];
  pointer?: { startY: number; slot: number; dy: number; over: number };
}

/**
 * Drag to reorder with pointer or keyboard. Every order change runs one FLIP: record where each
 * item is on screen, commit the new order, then animate each item from its old place with the
 * gentle spring (additive, so the lifted item keeps its 8px lift).
 */
export function ReorderDemo({ ref }: { ref?: Ref<DemoHandle> }) {
  const list = useRef<HTMLOListElement>(null);
  const items = useRef(new Map<string, HTMLLIElement>());
  const handles = useRef(new Map<string, HTMLButtonElement>());
  const before = useRef<Map<string, DOMRect> | null>(null);
  /** Moving a DOM node drops its focus; keyboard moves put it back on the moved handle. */
  const refocus = useRef<string | null>(null);
  const [order, setOrder] = useState(initial);
  const [lift, setLift] = useState<Lift | null>(null);
  const [message, setMessage] = useState('');

  const snapshotRects = () =>
    new Map([...items.current].map(([name, el]) => [name, el.getBoundingClientRect()]));

  function commit(next: string[]) {
    before.current = snapshotRects();
    setOrder(next);
  }

  useLayoutEffect(() => {
    const rects = before.current;
    before.current = null;
    if (!rects || !list.current) return;
    if (!isReduced(list.current)) {
      const timing = springTiming(list.current, 'gentle');
      for (const [name, el] of items.current) {
        const old = rects.get(name);
        if (!old) continue;
        const dy = old.top - el.getBoundingClientRect().top;
        if (Math.abs(dy) < 0.5) continue;
        el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0)' }], {
          ...timing,
          composite: 'add',
        });
      }
    }
    if (refocus.current) handles.current.get(refocus.current)?.focus();
    refocus.current = null;
  }, [order]);

  const announce = (text: string) => setMessage(text);

  function drop(name: string, to: number, from: number) {
    announce(
      to === from
        ? `${name} dropped at position ${to + 1}.`
        : `${name} moved to position ${to + 1}.`,
    );
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, name: string) {
    const index = order.indexOf(name);
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!lift) {
        setLift({ name, from: index, snapshot: order });
        announce(
          `${name} lifted, position ${index + 1} of ${order.length}. Arrow keys move, Space drops, Escape cancels.`,
        );
      } else {
        drop(name, index, lift.from);
        setLift(null);
      }
    } else if (lift && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      const to = Math.max(
        0,
        Math.min(order.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)),
      );
      if (to !== index) {
        refocus.current = name;
        commit(move(order, index, to));
      }
    } else if (lift && event.key === 'Escape') {
      event.preventDefault();
      refocus.current = name;
      commit(lift.snapshot);
      announce(`Reorder cancelled. ${name} is back at position ${lift.from + 1}.`);
      setLift(null);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLButtonElement>, name: string) {
    if (event.button !== 0 || lift) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rects = order.map((n) => items.current.get(n)!.getBoundingClientRect());
    const slot = rects.length > 1 ? rects[1]!.top - rects[0]!.top : rects[0]!.height;
    const from = order.indexOf(name);
    setLift({
      name,
      from,
      snapshot: order,
      pointer: { startY: event.clientY, slot, dy: 0, over: from },
    });
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!lift?.pointer) return;
    const dy = event.clientY - lift.pointer.startY;
    const over = Math.max(
      0,
      Math.min(order.length - 1, lift.from + Math.round(dy / lift.pointer.slot)),
    );
    setLift({ ...lift, pointer: { ...lift.pointer, dy, over } });
  }

  function onPointerUp() {
    if (!lift?.pointer) return;
    const { over } = lift.pointer;
    commit(move(order, lift.from, over));
    drop(lift.name, over, lift.from);
    setLift(null);
  }

  function shiftFor(name: string): number {
    const p = lift?.pointer;
    if (!lift || !p) return 0;
    const i = order.indexOf(name);
    if (name === lift.name) return p.dy;
    if (lift.from < p.over && i > lift.from && i <= p.over) return -p.slot;
    if (lift.from > p.over && i < lift.from && i >= p.over) return p.slot;
    return 0;
  }

  useImperativeHandle(ref, () => ({
    replay() {
      const name = order[1]!;
      commit(move(order, 1, 3));
      announce(`${name} moved to position 4.`);
    },
  }));

  return (
    <div className={s.reorder}>
      <ol ref={list} className={s.reorderList} aria-label="Writing checklist">
        {order.map((name, i) => {
          const lifted = lift?.name === name;
          const dragging = lifted && !!lift?.pointer;
          const shift = shiftFor(name);
          const transform = dragging
            ? `translateY(calc(${shift}px - var(--hb-motion-distance-lift)))`
            : shift
              ? `translateY(${shift}px)`
              : undefined;
          return (
            <li
              key={name}
              ref={(el) => {
                if (el) items.current.set(name, el);
                else items.current.delete(name);
              }}
              className={s.reorderItem}
              data-item=""
              data-motion-part=""
              data-lifted={lifted ? '' : undefined}
              data-dragging={dragging ? '' : undefined}
              style={transform ? { transform } : undefined}
            >
              <button
                ref={(el) => {
                  if (el) handles.current.set(name, el);
                  else handles.current.delete(name);
                }}
                type="button"
                className={s.handle}
                aria-label={`Reorder ${name}, position ${i + 1} of ${order.length}`}
                aria-pressed={lifted}
                onKeyDown={(e) => onKeyDown(e, name)}
                onPointerDown={(e) => onPointerDown(e, name)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={() => setLift(null)}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                  <circle cx="6" cy="4" r="1.2" />
                  <circle cx="10" cy="4" r="1.2" />
                  <circle cx="6" cy="8" r="1.2" />
                  <circle cx="10" cy="8" r="1.2" />
                  <circle cx="6" cy="12" r="1.2" />
                  <circle cx="10" cy="12" r="1.2" />
                </svg>
              </button>
              <span>{name}</span>
            </li>
          );
        })}
      </ol>
      <p className={s.announcer} data-announcer="" aria-live="assertive">
        {message}
      </p>
    </div>
  );
}
