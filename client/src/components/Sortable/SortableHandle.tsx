import React from "react";
import { useSortableItem } from "./SortableItem";

interface SortableHandleProps {
  children?: React.ReactNode;
  [x: string]: any;
}

const SortableHandle = ({
  children,
  ...props
}: SortableHandleProps): React.ReactNode => {
  const { attributes, listeners, isDragging } = useSortableItem();

  return (
    <div
      data-state={isDragging ? "dragging" : undefined}
      {...attributes}
      {...listeners}
      {...props}
    >
      {children}
    </div>
  );
};

export default SortableHandle;
