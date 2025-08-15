import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, useSensor, PointerSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { MenuOutlined } from '@ant-design/icons';
import { CSS } from '@dnd-kit/utilities';
import CustomModal from '../customModal/CustomModal';

interface ColumnOrderData {
  id: string | number;
  name: string;
  orderId: number;
}

interface ManageTaskOrderProps {
  isOpen: boolean;
  onClose: () => void;
  columnManagerOrder: (string | number)[];
  table: any[]; // <-- now an array of tasks
  onOrderChange: (newOrder: ColumnOrderData[]) => void;
}

const ManageTaskOrder: React.FC<ManageTaskOrderProps> = ({
  isOpen,
  onClose,
  columnManagerOrder,
  table,
  onOrderChange,
}) => {
  // Store the full task objects in order state
  const [order, setOrder] = useState<any[]>([]);

  useEffect(() => {
    setOrder(columnManagerOrder);
  }, [columnManagerOrder]);

  console.log('Initial order:', order, columnManagerOrder);

  console.log("table", table);

  // React.useEffect(() => {
  //   setOrder(columnManagerOrder.map((id) => table.find((task) => task.id === id)).filter(Boolean));
  // }, [columnManagerOrder, table]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = order.findIndex(task => task.id === active.id);
      const newIndex = order.findIndex(task => task.id === over.id);
      console.log('Dragging from', oldIndex, 'to', newIndex);
      const newOrder = arrayMove(order, oldIndex, newIndex);
      setOrder(newOrder);

      // Map to only id, name, orderId for each task, updating orderId to match new order
      const mappedOrder = newOrder.map((task: any, idx: number) => ({
        id: task.id,
        name: task.name ?? '',
        orderId: idx + 1, // assign new orderId based on position
      }));

      onOrderChange(mappedOrder);
    }
  }

  function SortableTaskRow({ task }: { task: any }) {
    if (!task) return null;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: task.id,
    });

    return (
      <div
        ref={setNodeRef}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "8px 0",
          borderBottom: "1px solid #222",
          background: isDragging ? "#222" : undefined,
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
          cursor: "grab",
        }}
        {...attributes}
        {...listeners}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MenuOutlined style={{ cursor: 'grab', color: '#888' }} />
          {task.name}
        </span>
      </div>
    );
  }

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      footer={null}
      title="Show/Hide Columns"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={order.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {order.map((task: any) => (
            <SortableTaskRow
              key={task.id}
              task={task}
            />
          ))}
        </SortableContext>
      </DndContext>
    </CustomModal>
  );
};

export default ManageTaskOrder;