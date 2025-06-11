import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import type { VisibilityState } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Input, Select, DatePicker, Button, Modal } from 'antd';
import * as styled from './style';
import dayjs from 'dayjs';
import DownArrowIcon from '../../assets/icons/downArrowIcon';
import UpArrowIcon from '../../assets/icons/UpArrowIcon';
import CustomSelect from '../customSelect/CustomSelect';
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import CustomModal from '../customModal/CustomModal';
import React from 'react';

interface CustomColumnMeta {
  editable?: boolean;
   editorType?: 'input' | 'select' | 'date';
  selectOptions?: { label: string; value: string }[];
  

}

interface EditableTableProps<T> {

columns: ColumnDef<T>[];
  isWithNewRow?: boolean;

  data: T[]; // controlled data from parent
  onDataChange: (newData: T[]) => void; // callback to update parent state
  createEmptyRow: () => T;
  onRowCreate?: (newRow: T) => void; // ✅ New prop
    onRowEdit?: (updatedRow: T, rowIndex: number) => void; // ✅ new
    columnSizing?: Record<string, number>;
  onColumnSizingChange?: (newSizing: Record<string, number>, columnId: string) => void;


}

export function CustomTable<T extends object>(props: EditableTableProps<T>) {




  const {
    columns,
    data,
    onDataChange,
    createEmptyRow,
    onRowCreate,
    onRowEdit,
    isWithNewRow,
    columnSizing = {}, // <-- Add default value for columnSizing
    onColumnSizingChange
  } = props;

  const [hasAdded, setHasAdded] = useState(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<{
    rowIndex: number;
    columnId: keyof T;
  } | null>(null);

  const [sorting, setSorting] = useState<any[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  // Add state for column visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [menuOpenCell, setMenuOpenCell] = useState<{ rowIndex: number; columnId: keyof T } | null>(null);

  const handleEdit = (rowIndex: number, columnId: keyof T, value: any) => {

    console.log('Editing row:', rowIndex, 'column:', columnId, 'value:', value);
  const updated = [...data];
  updated[rowIndex] = {
    ...updated[rowIndex],
    [columnId]: value,
  };
  onDataChange(updated);
  onRowEdit?.(updated[rowIndex], rowIndex);
};


  const handleAddEmptyRow = () => {
    const newRow = createEmptyRow();
    onDataChange([...data, createEmptyRow()]);
      onRowCreate?.(newRow); // ✅ Notify parent

    setHasAdded(true);
  };

  // const table = useReactTable({
  //   data,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   state: { sorting, columnVisibility }, // <-- add columnVisibility
  //   onSortingChange: setSorting,
  //   onColumnVisibilityChange: setColumnVisibility, // <-- add handler
  //   columnResizeMode: 'onChange', // Optional: useful for resizable support later

  // });

  const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  state: { sorting, columnVisibility, columnSizing }, // <-- use destructured columnSizing
  onSortingChange: setSorting,
  onColumnVisibilityChange: setColumnVisibility,
  columnResizeMode: 'onChange',
  onColumnSizingChange: (updater) => {
    // updater can be a function or an object
    const newSizing = typeof updater === 'function' ? updater(columnSizing || {}) : updater;
    // Find the changed column
    const changed = Object.keys(newSizing).find(
      key => !columnSizing || columnSizing[key] !== newSizing[key]
    );
    onColumnSizingChange?.(newSizing, changed || '');
  },
});

  // UI for toggling columns (now as a modal)
  const renderColumnManager = () => (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 8 }}
        onClick={() => setIsColumnModalOpen(true)}
      >
        Manage Columns
      </Button>
      <CustomModal
        open={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        footer={null}
        title="Show/Hide Columns"
      >
        {table.getAllLeafColumns().map((column) => {
          const visible = column.getIsVisible();
          return (
            <div
              key={column.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #222",
              }}
            >
              <span>{column.columnDef.header as string}</span>
              <span
                style={{ cursor: "pointer", fontSize: 18 }}
                onClick={() => column.toggleVisibility()}
                title={visible ? "Hide" : "Show"}
              >
                {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            </div>
          );
        })}
      </CustomModal>
    </>
  );

  // Add a CSS media query for sticky/relative columns
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 600px) {
        .custom-table-sticky-col {
          position: relative !important;
          left: unset !important;
          z-index: unset !important;
        }
      }
      @media (min-width: 601px) {
        .custom-table-sticky-col {
          position: sticky !important;
          left: 0 !important;
          z-index: 100 !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{ overflowX: 'auto', width: '100%', overflowY: 'auto' }}>
      {renderColumnManager()}
      <table style={{ minWidth: '1000px', width: '100%', borderCollapse: 'collapse', maxHeight: 500, overflowY: 'auto' }}>
        <thead>
          <tr>
            {table.getHeaderGroups()[0].headers.map((header: any) => (
              <th
                key={header.id}
                className={header.index === 0 ? 'custom-table-sticky-col' : ''}
                style={{
                  border: '3px solid rgb(32,32,32)',
                  padding: '8px',
                      width: header.column.getSize(),
                      minWidth: header.column.getSize(),
                      maxWidth: header.column.getSize(),
                      position: header.index === 0 ? 'sticky' : undefined,
                      left: header.index === 0 ? 0 : undefined,
                  background: '#1a1a1a',
                  userSelect: 'none',

                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {header.isPlaceholder ? null : header.column.columnDef.header}
                  {/* Resizer handle */}
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      style={{
                        cursor: 'col-resize',
                        userSelect: 'none',
                        width: '6px',
                        height: '100%',
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        zIndex: 10,
                        background: 'rgb(25, 25, 25)',
                      }}
                      onDoubleClick={() => {
                        const colId = header.column.id;
                        const current = header.getSize();
                        const min = header.column.columnDef.minSize ?? 40;
                        const max = header.column.columnDef.maxSize ?? 600;
                        const newSize = current < max ? max : min;
                        const newSizing = { ...table.getState().columnSizing, [colId]: newSize };
                        if (typeof onColumnSizingChange === 'function') {
                          onColumnSizingChange(newSizing, colId);
                        }
                      }}
                      title="Double click to maximize/minimize"
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onMouseEnter={() => setHoveredRow(row.index)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                background: hoveredRow === row.index ? 'white' : undefined,
                transition: 'background 0.2s',
              }}
            >
              {row.getVisibleCells().map((cell: any) => {
                const columnId = cell.column.id as keyof T;
                const meta = cell.column.columnDef.meta as CustomColumnMeta | undefined;
                const isEditable = meta?.editable === true;
                const editorType = meta?.editorType || 'input';
                const selectOptions = meta?.selectOptions || [];
                const isCurrentlyEditing =
                  currentlyEditing?.rowIndex === row.index &&
                  currentlyEditing?.columnId === columnId;

                return (
                  <td
                    key={cell.id}
                    className={cell.column.getIndex() === 0 ? 'custom-table-sticky-col' : ''}
                    style={{
                      border: '3px solid rgb(32,32,32)',
                      padding: '8px',
                      cursor: isEditable ? 'pointer' : 'default',
                      width: cell.column.getSize(),
                      minWidth: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                      background: hoveredRow === row.index ? '#23272f' : '#1a1a1a',
                      position: 'relative', // <-- Add this line to fix input positioning
                    }}
                    onClick={() => {
                      if (isEditable) {
                        setCurrentlyEditing({ rowIndex: row.index, columnId });
                      }
                    }}
                  >
                    {isEditable && isCurrentlyEditing ? (
                      // ...editor rendering...
                      editorType === 'date' ? (
                        <Input
                          type="date"
                          autoFocus
                          value={
                            cell.getValue()
                              ? dayjs(cell.getValue() as string | number | Date).format("YYYY-MM-DD")
                              : ''
                          }
                          onChange={(e) => {
                            handleEdit(row.index, columnId, e.target.value);
                            setCurrentlyEditing(null);
                          }}
                          onBlur={() => setCurrentlyEditing(null)}
                          style={{
                            width: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 2,
                            background: '#202020',
                            color: 'white',
                          }}
                          onFocus={e => {
                            e.target.showPicker && e.target.showPicker();
                          }}
                        />
                      ) : editorType === 'select' ? (
                        <CustomSelect
                          autoFocus
                          value={selectOptions.find(opt => opt.value === cell.getValue()) || null}
                          style={{
                            width: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 9999,
                            borderColor: 'transparent',
                            boxShadow: 'none',
                            background: 'rgb(37, 37, 37)',
                          }}
                          options={selectOptions}
                          onChange={(option: any) => {
                            handleEdit(row.index, columnId, option ? option.value : '');
                            setTimeout(() => setCurrentlyEditing(null), 0);
                          }}
                          onBlur={() => {
                            setCurrentlyEditing(null);
                          }}
                          placeholder="Select..."
                          menuIsOpen={isEditable && isCurrentlyEditing}
                        />
                      ) : (
                        <Input.TextArea
                          value={cell.getValue() as string}
                          autoFocus
                          onChange={(val: any) => {
                            handleEdit(row.index, columnId, val.target.value);
                          }}
                          onBlur={() => setCurrentlyEditing(null)}
                          style={{
                            width: '100%',
                            opacity: 1,
                            pointerEvents: 'auto',
                            position: 'absolute',
                            background: '#202020',
                            color: 'white',
                            top: 0,
                            left: 0,
                            transition: 'opacity 0.2s',
                            zIndex: 2,
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              setCurrentlyEditing(null); // Save and exit edit mode
                            }
                          }}
                        />
                      )
                    ) : (
                      editorType === 'select'
                        ? (selectOptions.find(opt => opt.value === cell.getValue())?.label || '')
                        : flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {isWithNewRow && (
            <tr>
              <td colSpan={columns.length} style={{ padding: '8px', position: 'sticky' }}>
                <Input
                  placeholder="+ New row"
                  variant="underlined"
                  onFocus={handleAddEmptyRow}
                  onClick={handleAddEmptyRow}
                  style={{ width: '100%', cursor: 'text' }}
                />
              </td>
            </tr>
          )}

        </tbody>
      </table>
    </div>
  );
}

