import { useRef } from 'react';
import { CardDemo } from './CardDemo';
import { LabTile } from './LabTile';
import type { LabSpec } from './LabTile';
import { LikeDemo } from './LikeDemo';
import type { DemoHandle } from './LikeDemo';
import { PullDemo } from './PullDemo';
import { ReorderDemo } from './ReorderDemo';
import { SkeletonDemo } from './SkeletonDemo';
import { ToastDemo } from './ToastDemo';

/**
 * One island per tile, so each hydrates only when it scrolls into view. Specs are built at
 * build time from tokens.json by the page, so no number here is typed by hand.
 */

export function LikeTile({ spec }: { spec: LabSpec }) {
  const demo = useRef<DemoHandle>(null);
  return (
    <LabTile
      id="like"
      index={1}
      title="Optimistic like"
      source="LikeDemo.tsx"
      onReplay={() => demo.current?.replay()}
      spec={spec}
    >
      <LikeDemo ref={demo} />
    </LabTile>
  );
}

export function ReorderTile({ spec }: { spec: LabSpec }) {
  const demo = useRef<DemoHandle>(null);
  return (
    <LabTile
      id="reorder"
      index={2}
      title="Drag to reorder"
      source="ReorderDemo.tsx"
      onReplay={() => demo.current?.replay()}
      spec={spec}
    >
      <ReorderDemo ref={demo} />
    </LabTile>
  );
}

export function SkeletonTile({ spec }: { spec: LabSpec }) {
  const demo = useRef<DemoHandle>(null);
  return (
    <LabTile
      id="skeleton"
      index={3}
      title="Skeleton to content"
      source="SkeletonDemo.tsx"
      onReplay={() => demo.current?.replay()}
      spec={spec}
    >
      <SkeletonDemo ref={demo} />
    </LabTile>
  );
}

export function ToastTile({ spec }: { spec: LabSpec }) {
  const demo = useRef<DemoHandle>(null);
  return (
    <LabTile
      id="toast"
      index={4}
      title="Toast with undo"
      source="ToastDemo.tsx"
      onReplay={() => demo.current?.replay()}
      spec={spec}
    >
      <ToastDemo ref={demo} />
    </LabTile>
  );
}

export function CardTile({ spec }: { spec: LabSpec }) {
  const demo = useRef<DemoHandle>(null);
  return (
    <LabTile
      id="card"
      index={5}
      title="Card to detail"
      source="CardDemo.tsx"
      onReplay={() => demo.current?.replay()}
      spec={spec}
    >
      <CardDemo ref={demo} />
    </LabTile>
  );
}

export function PullTile({ spec }: { spec: LabSpec }) {
  const demo = useRef<DemoHandle>(null);
  return (
    <LabTile
      id="pull"
      index={6}
      title="Pull to refresh"
      source="PullDemo.tsx"
      onReplay={() => demo.current?.replay()}
      spec={spec}
    >
      <PullDemo ref={demo} />
    </LabTile>
  );
}
