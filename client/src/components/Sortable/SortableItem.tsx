import { DraggableSyntheticListeners, UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface SortableItemContextProps {
  attributes: React.HTMLAttributes<HTMLElement>;
  listeners: DraggableSyntheticListeners | undefined;
  isDragging?: boolean;
}

const SortableItemContext = React.createContext<SortableItemContextProps>({
  attributes: {},
  listeners: undefined,
  isDragging: false,
});

export function useSortableItem() {
  const context = React.useContext(SortableItemContext);

  if (!context) {
    throw new Error("useSortableItem must be used within a SortableItem");
  }

  return context;
}

interface SortableItemProps {
  children: React.ReactNode;
  value: UniqueIdentifier;
}

const SortableItem = (props: SortableItemProps): React.ReactNode => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.value });

  const context = React.useMemo<SortableItemContextProps>(
    () => ({
      attributes,
      listeners,
      isDragging,
    }),
    [attributes, listeners, isDragging]
  );

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <div
        data-state={isDragging ? "dragging" : undefined}
        ref={setNodeRef}
        style={style}
      >
        {props.children}
      </div>
    </SortableItemContext.Provider>
  );
};

export default SortableItem;
