import React from 'react';
import { DndContext, closestCenter, useSensor,PointerSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy , useSortable} from '@dnd-kit/sortable';
import { EyeInvisibleOutlined, EyeOutlined, MenuOutlined } from '@ant-design/icons';
import { CSS } from '@dnd-kit/utilities';
import CustomModal from '../../../../components/customModal/CustomModal';


interface ManageColumnProps {
  isOpen: boolean;
  onClose: () => void;
  handleColumnManagerDragEnd: (event: any) => void;
  columnManagerOrder: string[];
  table: any;
}

const ManageColumn: React.FC<ManageColumnProps> = ({
  isOpen,
  onClose,
  handleColumnManagerDragEnd,
  columnManagerOrder,
  table,
}) => {

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
    

    function SortableColumnRow({ column }: { column: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  });
  const visible = column.getIsVisible();
  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
        {column.columnDef.header as string}
      </span>
      <span
        style={{ cursor: "pointer", fontSize: 18 }}
        onClick={() => column.toggleVisibility()}
        title={visible ? "Hide" : "Show"}
      >
        {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
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
        onDragEnd={handleColumnManagerDragEnd}
      >
        <SortableContext
          items={columnManagerOrder}
          strategy={verticalListSortingStrategy}
        >
          {columnManagerOrder.map((colId) => {
            const column = table.getAllLeafColumns().find((col: any) => col.id === colId);
            if (!column) return null;
            return <SortableColumnRow key={colId} column={column} />;
          })}
        </SortableContext>
      </DndContext>
    </CustomModal>
  );
};

export default ManageColumn;