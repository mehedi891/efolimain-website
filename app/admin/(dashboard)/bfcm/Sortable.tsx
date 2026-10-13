"use client";

import type { ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const GRIP = (
  <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor" aria-hidden="true">
    <circle cx="3" cy="3" r="1.6" />
    <circle cx="9" cy="3" r="1.6" />
    <circle cx="3" cy="9" r="1.6" />
    <circle cx="9" cy="9" r="1.6" />
    <circle cx="3" cy="15" r="1.6" />
    <circle cx="9" cy="15" r="1.6" />
  </svg>
);

function SortableItem({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: (handle: ReactNode, dragging: boolean) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  // The handle is the only drag activator, so buttons/switches in the row keep working.
  // Keyboard: focus it, Space/Enter to lift, arrows to move, Space/Enter to drop.
  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label={label}
      className="grid h-9 w-7 shrink-0 cursor-grab touch-none place-items-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing"
    >
      {GRIP}
    </button>
  );
  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
        zIndex: isDragging ? 10 : undefined,
      }}
    >
      {children(handle, isDragging)}
    </li>
  );
}

/** Vertical drag-and-drop list (mouse, touch, keyboard). `onReorder` gets the new array. */
export function SortableList<T extends { id: string }>({
  dndId,
  items,
  onReorder,
  itemLabel,
  renderItem,
  className,
}: {
  /** Stable id — keeps dnd-kit's accessibility ids identical on server and client. */
  dndId: string;
  items: T[];
  onReorder: (next: T[]) => void;
  /** Accessible name for each row's drag handle. */
  itemLabel: (item: T) => string;
  renderItem: (item: T, index: number, handle: ReactNode, dragging: boolean) => ReactNode;
  className?: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    if (from < 0 || to < 0) return;
    onReorder(arrayMove(items, from, to));
  }

  return (
    <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ul className={className}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id} label={itemLabel(item)}>
              {(handle, dragging) => renderItem(item, index, handle, dragging)}
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

/** Accessible on/off switch. */
export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-50 cursor-pointer ${
        checked ? "bg-[#0D99FF]" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}
