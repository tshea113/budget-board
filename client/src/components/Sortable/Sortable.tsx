import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import React from "react";

interface SortableProps {
  children: React.ReactNode;
  values: any[];
  onValueChange?: (values: any[]) => void;
  onMove?: (args: { activeIndex: number; overIndex: number }) => void;
}

const Sortable = (props: SortableProps): React.ReactNode => {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = props.values.findIndex(
            (item) => item.id === active.id
          );
          const overIndex = props.values.findIndex(
            (item) => item.id === over.id
          );

          if (props.onMove) {
            props.onMove({ activeIndex, overIndex });
          } else {
            props.onValueChange?.(
              arrayMove(props.values, activeIndex, overIndex)
            );
          }
        }
      }}
    >
      <SortableContext items={props.values}>{props.children}</SortableContext>
    </DndContext>
  );
};

export default Sortable;
