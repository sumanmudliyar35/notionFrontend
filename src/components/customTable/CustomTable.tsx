import React, { useState, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import type { VisibilityState } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Input, Select, DatePicker, Button, Modal, Tooltip } from 'antd';
import * as styled from './style';
import dayjs from 'dayjs';
import DownArrowIcon from '../../assets/icons/downArrowIcon';
import UpArrowIcon from '../../assets/icons/UpArrowIcon';
import CustomSelect from '../customSelect/CustomSelect';
import { EyeOutlined, EyeInvisibleOutlined, MenuUnfoldOutlined, MenuFoldOutlined, DeleteOutlined } from "@ant-design/icons";
import CustomModal from '../customModal/CustomModal';
import { SharedStyledWhiteInput } from '../../style/sharedStyle';
import CustomSearchInput from '../CustomSearchInput/CustomSearchInput';

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
onRowDelete?: (rowIndex: number) => void; // Optional callback for row deletion


}

export function CustomTable<T extends object>(props: EditableTableProps<T>) {



    const [searchText, setSearchText] = useState('');

      const searchInputRef = useRef<HTMLInputElement>(null);

        const newRowRef = useRef<HTMLTableRowElement>(null);

        const addRowTriggeredRef = useRef(false);




        useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 0);
      }
      // Optionally: ESC to close search
      
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
   


  const {
    columns,
    data,
    onDataChange,
    createEmptyRow,
    onRowCreate,
    onRowEdit,
        onRowDelete,
    isWithNewRow,
    columnSizing = {}, // <-- Add default value for columnSizing
    onColumnSizingChange
  } = props;


  


   const filteredData = React.useMemo(() => {
    if (!searchText.trim()) return data;
    const lower = searchText.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(val =>
        (val !== null && val !== undefined && String(val).toLowerCase().includes(lower))
      )
    );
  }, [data, searchText]);

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


    const [actionCollapsed, setActionCollapsed] = useState(true);
  
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
    if (addRowTriggeredRef.current) return;
  addRowTriggeredRef.current = true;
    const newRow = createEmptyRow();
    onDataChange([...data, createEmptyRow()]);
      onRowCreate?.(newRow); // ✅ Notify parent
        setTimeout(() => {
    if (newRowRef.current) {
      newRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    // Open the first editable cell of the new row
    const lastRowIndex = table.getRowModel().rows.length;
    const firstEditableCol = columns.find((col: any) => col.meta?.editable);
if (firstEditableCol) {
  setCurrentlyEditing({
    rowIndex: lastRowIndex,
    columnId: columns[0].id as keyof T, // use the first column's id
  });
}
    // Find the first editable column
   
  }, 0);

   setTimeout(() => {
    addRowTriggeredRef.current = false;
  }, 300);

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
    data: filteredData,
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
          // position: sticky !important;
          // left: 0 !important;
          // z-index: 100 !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Debounce utility
function useDebouncedCallback(callback: (...args: any[]) => void, delay: number) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (...args: any[]) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => callback(...args), delay);
  };
}

const debouncedHandleEdit = useDebouncedCallback(handleEdit, 500);


const handleDeleteRow = (rowIndex: number) => {
    const updated = [...data];
    updated.splice(rowIndex, 1);
    if (onRowDelete) {
      onRowDelete(rowIndex); // Call the optional callback if provided
    }
    onDataChange(updated);
  };



  return (
    <styled.tableMainContainer>

      <styled.tableActionsDiv>
            {renderColumnManager()}

            <CustomSearchInput
              placeholder="Search"
              allowClear
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
          style={{ width: 200}}
        />
        </styled.tableActionsDiv>
    <div style={{ overflowX: 'auto', width: '100%', overflowY: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', position: 'sticky', zIndex: 120, top: 0 }}>
        <thead>
          <tr>
              <th
                style={{
                  width: actionCollapsed ? 30 : 48,
                  minWidth: actionCollapsed ? 30 : 48,
                  maxWidth: actionCollapsed ? 30 : 48,
                  background: '#1a1a1a',
                  border: '3.5px solid rgb(32,32,32)',
                  textAlign: 'center',
                  position: 'sticky',
                  left: 0,
                  zIndex: 102,
                  padding: 0,
                }}
              >
                <span
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                  onClick={() => setActionCollapsed(c => !c)}
                  title={actionCollapsed ? "Expand Actions" : "Collapse Actions"}
                >
                  {actionCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </span>
              </th>

            {table.getHeaderGroups()[0].headers.map((header: any) => (
              <th
                key={header.id}
                style={{
                  border: '3.5px solid rgb(32,32,32)',
                  padding: '8px',
                      width: header.column.getSize(),
                      minWidth: header.column.getSize(),
                      maxWidth: header.column.getSize(),
                      position: header.index === 0 ? 'sticky' : 'relative',
                      left: header.index === 0 ? '30px' : undefined,
                      top: header.index === 0 ? 0 : undefined,

                      background: '#1a1a1a',
                      userSelect: 'none',
                      zIndex: header.column.getIndex() === 0 ? 101 : undefined, // slightly higher than td


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

        </table>
        <table >
        <tbody  style={{
          display: 'block',
          maxHeight: '60vh', // or '500px'
        }}>
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
                 <td
                    style={{
                      width: actionCollapsed ? 30 : 48,
                      minWidth: actionCollapsed ? 30 : 48,
                      maxWidth: actionCollapsed ? 30 : 48,
                      border: 'none',
                      padding: 0,
                      textAlign: 'center',
                      background: '#1a1a1a',
                      verticalAlign: 'middle',
                      position: 'sticky',
                      left: 0,
                      zIndex: 101,
                    }}
                  >
                    {!actionCollapsed && (
                      <Tooltip title="Delete">
                        <DeleteOutlined
                          style={{
                            color: '#ff4757',
                            fontSize: 18,
                            cursor: 'pointer',
                            opacity: hoveredRow === row.index ? 1 : 0.3,
                            transition: 'opacity 0.2s',
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteRow(row.index);
                          }}
                        />
                      </Tooltip>
                    )}
                  </td>
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
                      border: '1px solid rgb(32,32,32)',
                      padding: '8px',
                      cursor: isEditable ? 'pointer' : 'default',
                      width: cell.column.getSize(),
                      minWidth: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                      background: hoveredRow === row.index ? '#23272f' : '#1a1a1a',
                       position: cell.column.getIndex() === 0 ? 'sticky' : 'relative', // <-- make sticky for first column
    left: cell.column.getIndex() === 0 ? '30px' : undefined,              // <-- align with header
    zIndex: cell.column.getIndex() === 0 ? 101 : undefined,          // <-- keep above other cells
                    }}
                    onClick={() => {
                      if (isEditable) {
                        setCurrentlyEditing({ rowIndex: row.index, columnId });
                      }
                    }}
                  >
                    {isEditable && isCurrentlyEditing ? (
  <EditableCell
    value={cell.getValue()}
    editorType={editorType}
    selectOptions={selectOptions}
    onSave={val => handleEdit(row.index, columnId, val)}
    onCancel={() => setCurrentlyEditing(null)}
  />
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
            <tr  ref={newRowRef}
>
              <td colSpan={columns.length + 1} style={{ padding: '8px', position: 'sticky', bottom: 0, zIndex: 2000 }}>
                <SharedStyledWhiteInput
  placeholder="+ New row"
  variant="underlined"
  onFocus={handleAddEmptyRow}
  onClick={handleAddEmptyRow}
  style={{
    width: '100%',
    cursor: 'text',
    background: '#202020',
  }}
/>
              </td>
            </tr>
          )}

        </tbody>
      </table>
    </div>
    </styled.tableMainContainer>
  );
}

function EditableCell({
  value,
  editorType,
  selectOptions,
  onSave,
  onCancel,
}: {
  value: any;
  editorType: string;
  selectOptions?: { label: string; value: string }[];
  onSave: (val: any) => void;
  onCancel: () => void;
}) {
  const [editValue, setEditValue] = React.useState(value ?? '');

  if (editorType === 'input') {
    return (
      <Input.TextArea
        value={editValue}
        autoFocus
        onChange={e => setEditValue(e.target.value)}
        onBlur={() => {
          onSave(editValue);
          onCancel();
        }}
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
            onSave(editValue);
            onCancel();
          }
        }}
      />
    );
  }

  if (editorType === 'date') {
  return (
    <Input
      type="date"
      autoFocus
      value={editValue}
      onChange={e => {
        setEditValue(e.target.value);
        onSave(e.target.value); // Call handleEdit immediately on date select
        onCancel();             // Close the editor
      }}
      onBlur={() => {
        onSave(editValue);
        onCancel();
      }}
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
  );
}

  if (editorType === 'select') {
    return (
      <CustomSelect
        autoFocus
        value={selectOptions?.find(opt => opt.value === editValue) || null}
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
        options={selectOptions || []}
        onChange={option => {
          setEditValue(option ? option.value : '');
          onSave(option ? option.value : '');
                            setTimeout(() => onCancel(), 0);
        }}
        // No need for onBlur here, since we close on select
        placeholder="Select..."
        menuIsOpen
      />
    );
  }

  return null;
}

