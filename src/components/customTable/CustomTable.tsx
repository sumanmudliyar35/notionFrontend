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
import { EyeOutlined, EyeInvisibleOutlined, MenuUnfoldOutlined, MenuFoldOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import CustomModal from '../customModal/CustomModal';
import { SharedStyledWhiteInput } from '../../style/sharedStyle';
import CustomSearchInput from '../CustomSearchInput/CustomSearchInput';
import { date } from 'yup';
import MuiInputWithDate from '../MuiDatePicker/MuiInputWithDate';
import Mui2InputWithDate from '../Mui2InputWithDate/Mui2InputWithDate';
import MuiInputWithDateTime from '../MuiDateTimePicker/MuiDateTimePicker';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuOutlined } from '@ant-design/icons';
import ManageColumn from '../../pages/leads/components/ManageColumn/ManageColumn';
import { DownloadOutlined } from '@ant-design/icons';
import DateInput from '../CustomDateInput/CustomDateInput';


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
onColumnOrderChange?: (newOrder: string[]) => void;
downloadData?: () => void; // Optional callback for downloading data
isDownloadable?: boolean; // Optional prop to control download button visibility
handleColumnVisibilityChange?: (columnId: string, visible: boolean) => void; // Optional prop for column visibility changes
onSelectionChange?: (selectedIds: any[]) => void;
onOffsetChange?: (newOffset: number) => void; // New prop for offset change
}

export function CustomTable<T extends object>(props: EditableTableProps<T>) {
  // ✅ ALL HOOKS FIRST - NO CONDITIONS
  const [searchText, setSearchText] = useState('');
  const [selectMenuOpen, setSelectMenuOpen] = useState(true);
  const [hasAdded, setHasAdded] = useState(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<{
    rowIndex: number;
    columnId: keyof T;
  } | null>(null);
  const [sorting, setSorting] = useState<any[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [offset, setOffset] = useState(0); // State for offset

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [menuOpenCell, setMenuOpenCell] = useState<{ rowIndex: number; columnId: keyof T } | null>(null);
  const [actionCollapsed, setActionCollapsed] = useState(true);
  const [columnManagerOrder, setColumnManagerOrder] = useState<string[]>([]);

  // ✅ ALL REFS
  const searchInputRef = useRef<HTMLInputElement>(null);
  const newRowRef = useRef<HTMLTableRowElement>(null);
  const addRowTriggeredRef = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ DESTRUCTURE PROPS AFTER HOOKS
  const {
    columns,
    data,
    onDataChange,
    createEmptyRow,
    onRowCreate,
    onRowEdit,
    onRowDelete,
    isWithNewRow,
    columnSizing = {},
    onColumnSizingChange,
    onColumnOrderChange,
    downloadData,
    isDownloadable = true, // Default to true if not provided
    handleColumnVisibilityChange,
    onSelectionChange,
  } = props;



  // ✅ ALL EFFECTS AFTER STATE/REFS
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.ctrlKey &&  e.key.toLowerCase() === 'f') {
  //       e.preventDefault();
  //       setTimeout(() => {
  //         searchInputRef.current?.focus();
  //       }, 0);
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => window.removeEventListener('keydown', handleKeyDown);
  // }, []);


  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only trigger on Ctrl+F (not Ctrl+Shift+F or Ctrl+Alt+F)
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);

  // Initialize column manager order
  useEffect(() => {
    if (columns.length > 0) {
      setColumnManagerOrder(columns.map((col: any) => col.id || col.accessorKey));
    }
  }, [columns]);

  // Reset order when modal opens
  useEffect(() => {
    if (isColumnModalOpen && columns.length > 0) {
      setColumnManagerOrder(columns.map((col: any) => col.id || col.accessorKey));
    }
  }, [isColumnModalOpen, columns]);

  // CSS injection effect
  useEffect(() => {
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

  // ✅ MEMOIZED VALUES
  const filteredData = React.useMemo(() => {
    if (!searchText) return data;
    const lower = searchText.toLowerCase();

    return data.filter(row => {
      return Object.values(row).some(val => {
        if (typeof val === 'string' || typeof val === 'number') {
          return val.toString().toLowerCase().includes(lower);
        }
        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && val[0] !== null) {
          return val.some(obj =>
            Object.values(obj).some(innerVal =>
              innerVal && innerVal.toString().toLowerCase().includes(lower)
            )
          );
        }
        if (Array.isArray(val)) {
          return val.some(item =>
            item && item.toString().toLowerCase().includes(lower)
          );
        }
        if (typeof val === 'object' && val !== null) {
          return Object.values(val).some(innerVal =>
            innerVal && innerVal.toString().toLowerCase().includes(lower)
          );
        }
        return false;
      });
    });
  }, [data, searchText]);

  useEffect(() => {
  // Build visibility state from columns' isVisible
  const visibility: VisibilityState = {};
  columns.forEach((col: any) => {
    const id = col.id || col.accessorKey;
    if (id) {
      visibility[id] = col.isVisible !== false;
    }
  });
  setColumnVisibility(visibility);
}, [columns]);

  const sortedColumns = React.useMemo(() => {
  // If all columns have orderId, sort by it; otherwise, keep original order
  if (columns.every((col: any) => typeof col.orderId === 'number')) {
    return [...columns].sort((a: any, b: any) => a.orderId - b.orderId);
  }
  return columns;
}, [columns]);

  const orderedColumns = React.useMemo(() => {
  if (!columnManagerOrder.length) return columns;
  // Map for quick lookup
  const colMap = columns.reduce((acc, col) => {
    const id = (col as any).id || (col as any).accessorKey;
    acc[id] = col;
    return acc;
  }, {} as Record<string, ColumnDef<T>>);

  // Order as per columnManagerOrder, filter out missing, then add any columns not in order at the end
  const ordered = columnManagerOrder
    .map(id => colMap[id])
    .filter(Boolean);

  // Add any columns not present in columnManagerOrder (e.g. new columns)
  const remaining = columns.filter(
    col => !columnManagerOrder.includes((col as any).id || (col as any).accessorKey)
  );

  return [...ordered, ...remaining];
}, [sortedColumns, columnManagerOrder]);






  // ✅ TABLE INSTANCE
  const table = useReactTable({
    data: filteredData,
    columns : orderedColumns,
    // columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, columnVisibility, columnSizing },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    columnResizeMode: 'onChange',
    onColumnSizingChange: (updater) => {
      const newSizing = typeof updater === 'function' ? updater(columnSizing || {}) : updater;
      const changed = Object.keys(newSizing).find(
        key => !columnSizing || columnSizing[key] !== newSizing[key]
      );
      onColumnSizingChange?.(newSizing, changed || '');

    },
    
  });

  // ✅ CALLBACK FUNCTIONS
  // const debouncedHandleEdit = React.useCallback(
  //   (...args: any[]) => {
  //     if (timeout.current) clearTimeout(timeout.current);
  //     timeout.current = setTimeout(() => handleEdit(...args), 500);
  //   },
  //   []
  // );

  const handleEdit = React.useCallback((rowIndex: any, row: any, columnId: keyof T, value: any) => {
    // const updated = [...data];

    
    // updated[row.rowIndex] = {
    //   ...updated[row.rowIndex],
    //   [columnId]: value,
    // };
    // onDataChange(updated);
    // onRowEdit?.(updated[row.id], row.id);

    const index = data.findIndex((d: any) => d.id === row.id);

if (index !== -1) {
  const updated = [...data];
  updated[index] = {
    ...updated[index],
    [columnId]: value,
  };
  onDataChange(updated);
  onRowEdit?.(updated[index], index);

};




  }, [data, onDataChange, onRowEdit]);

  const handleAddEmptyRow = React.useCallback(() => {
    if (addRowTriggeredRef.current) return;
    addRowTriggeredRef.current = true;
    const newRow = createEmptyRow();
    onDataChange([...data, newRow]);
    onRowCreate?.(newRow);
    
    setTimeout(() => {
      if (newRowRef.current) {
        newRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      const lastRowIndex = table.getRowModel().rows.length;
      const firstEditableCol = columns.find((col: any) => col.meta?.editable);
      // if (firstEditableCol) {
      //   console.log('First editable column:', table.getHeaderGroups()[0].headers[0].id
      
      // );
      //   setCurrentlyEditing({
      //     rowIndex: lastRowIndex,
      //     columnId: table.getHeaderGroups()[0].headers[0].id as keyof T,
      //   });
      // } else {
      //   console.log('No editable column found');
      // }
    }, 0);

    setTimeout(() => {
      addRowTriggeredRef.current = false;
    }, 300);

    setHasAdded(true);
  }, [data, createEmptyRow, onDataChange, onRowCreate, table, columns]);


  const prevRowCount = useRef(data.length);
useEffect(() => {
  // Only run if not initial mount and a row was added
  if (prevRowCount.current !== 0 && data.length > prevRowCount.current) {
    const lastRowIndex = table.getRowModel().rows.length - 1;
    const firstEditableCol = columns.find((col: any) => col.meta?.editable);
    if (firstEditableCol) {
      setCurrentlyEditing({
        rowIndex: lastRowIndex,
        columnId: table.getHeaderGroups()[0].headers[0].id as keyof T,
      });
    }
  }
  prevRowCount.current = data.length;
}, [data.length, columns, table]);

  const handleDeleteRow = React.useCallback((rowIndex: number) => {
    const updated = [...data];
    updated.splice(rowIndex, 1);
    if (onRowDelete) {
      onRowDelete(rowIndex);
    }
    onDataChange(updated);
  }, [data, onRowDelete, onDataChange]);

  const handleColumnManagerDragEnd = React.useCallback((event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columnManagerOrder.indexOf(active.id);
      const newIndex = columnManagerOrder.indexOf(over.id);
      const newOrder = arrayMove(columnManagerOrder, oldIndex, newIndex);
      setColumnManagerOrder(newOrder);
      onColumnOrderChange && onColumnOrderChange(newOrder);
    }
  }, [columnManagerOrder, onColumnOrderChange]);

  // ✅ COMPONENT FUNCTIONS
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

  const handleCheckboxChange = (rowId: any, checked: boolean) => {
  setSelectedIds(prev => {
    const newSelected = checked
      ? [...prev, rowId]
      : prev.filter(id => id !== rowId);
    // Pass to parent if callback exists
    // if (props.onSelectionChange) props.onSelectionChange(newSelected);
    return newSelected;
  });
};

  const renderColumnManager = () => (
    <>
      <Button
        type="primary"
        onClick={() => setIsColumnModalOpen(true)}
      >
        Manage Columns
      </Button>
      <ManageColumn
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        table={table}
        handleColumnManagerDragEnd={handleColumnManagerDragEnd}
        columnManagerOrder={columnManagerOrder}
          onVisibilityChange={(columnId, visible) => {
           handleColumnVisibilityChange && handleColumnVisibilityChange(columnId, visible);
          }}
      />
    </>
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (!currentlyEditing) return;

  function handleClickOutside(event: MouseEvent) {
    if (
      tableContainerRef.current &&
      !tableContainerRef.current.contains(event.target as Node)
    ) {
      setCurrentlyEditing(null);
    }
  }

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [currentlyEditing]);


useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);

 const handleBulkDelete = () => {
    if (props.onSelectionChange) props.onSelectionChange(selectedIds);
      setSelectedIds([]); // Clear the selection after bulk delete


  };


// const handleDownload = () => {
//     const dataStr = JSON.stringify(data, null, 2);
//     const blob = new Blob([dataStr], { type: "application/json" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "table-data.json";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

  // Detect 3rd last row hover
  const lastOffsetTrigger = useRef<number | null>(null);

useEffect(() => {

  if (table.getRowModel().rows.length < 3) return;
  const lastVisibleIndex = table.getRowModel().rows.length - 1;
  if (
    hoveredRow === lastVisibleIndex - 2 &&
    lastOffsetTrigger.current !== table.getRowModel().rows.length
  ) {
    setOffset(prev => {
      const newOffset = prev + 10;
      if (props.onOffsetChange) props.onOffsetChange(newOffset);
      return newOffset;
    });
    lastOffsetTrigger.current = table.getRowModel().rows.length;
  }
}, [hoveredRow, table.getRowModel().rows.length, props]);



// First, add a separate ref for the scrollable table body
const tableBodyRef = useRef<HTMLTableSectionElement>(null);

// Then modify your useEffect to target both containers
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Handle Home key press - use Home key instead of ArrowLeft
    if (e.key === 'Home' && !e.ctrlKey && !e.altKey && !e.metaKey) {
      // Only trigger if no modifiers are pressed and we're not in an input field
      const activeElement = document.activeElement;
      const isInput = activeElement instanceof HTMLInputElement || 
                      activeElement instanceof HTMLTextAreaElement ||
                      activeElement instanceof HTMLSelectElement;
                      
      if (!isInput) {
        e.preventDefault();
        scrollToTableTop();
      }
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);



const scrollToTableTop = () => {
  // Try all possible scroll containers
  const possibleScrollContainers = [
    tableContainerRef.current,
    document.querySelector('.ant-table-body'),
    document.querySelector('.ant-table-content'),
    document.querySelector('tbody'),
    tableContainerRef.current?.parentElement,
    tableContainerRef.current?.querySelector('div[style*="overflow"]')
  ];
  
  // Log each attempt
  possibleScrollContainers.forEach((container, index) => {
    if (container) {
      console.log(`Attempting to scroll container #${index}`);
      
      // Try both methods
      try {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        console.log(`scrollTo failed on container #${index}:`, e);
      }
      
      try {
        if (container instanceof HTMLElement) {
          container.scrollTop = 0;
        }
      } catch (e) {
        console.log(`scrollTop failed on container #${index}:`, e);
      }
    }
  });
  
  // Also try to scroll window as a last resort
  window.scrollTo(0, 0);
  
  // Reset pagination
  setOffset(0);
  if (props.onOffsetChange) props.onOffsetChange(0);
  
  // Focus the first row
  if (table.getRowModel().rows.length > 0) {
    setHoveredRow(0);
  }
};






  // ✅ RENDER - All hooks are guaranteed to be called before this point
  return (
    <styled.tableMainContainer   ref={tableContainerRef}
>
      <styled.tableActionsDiv>

            {selectedIds.length > 0 && (
          <Tooltip title="Delete selected">
            <Button
              icon={<DeleteOutlined style={{ color: "#ff4757" }} />}
              style={{ marginLeft: 8, background: "#23272f", border: "none" }}
              onClick={handleBulkDelete}
            />
          </Tooltip>
        )}
        {renderColumnManager()}
        <CustomSearchInput
          placeholder="Search"
          allowClear
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 200}}
            ref={searchInputRef}

        />
      
      {isDownloadable && (
         <Button
          icon={<DownloadOutlined />}
          onClick={downloadData ? () => downloadData() : undefined}
          style={{ marginLeft: 8 }}
        >
          Download
        </Button>
      )}

   
      </styled.tableActionsDiv>
      
      <div style={{ overflow: 'auto', width: '100%',
      scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none',
        
       }}>
        <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', position: 'sticky', zIndex: 120, top: 0 }}>
          <thead>
            <tr>
              <th
                style={{
                  width: actionCollapsed ? 30 : 48,
                  minWidth: actionCollapsed ? 30 : 48,
                  maxWidth: actionCollapsed ? 30 : 48,
                  background: '#1a1a1a',
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

              {table.getHeaderGroups()[0].headers.map((header: any) => {
                const canSort = header.column.getCanSort?.();
                const isSorted = header.column.getIsSorted?.();
                return (
                  <th
                    key={header.id}
                    style={{
                      border: '1px solid rgb(32,32,32)',
                      borderRight: '2px solid rgb(32,32,32)',
                      padding: '8px',
                      width: header.column.getSize(),
                      minWidth: header.column.getSize(),
                      maxWidth: header.column.getSize(),
                      position: header.index === 0 ? 'sticky' : 'relative',
                      left: header.index === 0 ? actionCollapsed ? 30 : 40 : undefined,
                      top: header.index === 0 ? 0 : undefined,
                      background: '#1a1a1a',
                      userSelect: 'none',
                      zIndex: header.column.getIndex() === 0 ? 101 : undefined,
                      cursor: canSort ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (canSort) header.column.toggleSorting?.();
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 6 }}>
                      {header.isPlaceholder ? null : header.column.columnDef.header}
                      {canSort && (
                        <span>
                          {isSorted === 'asc' && <ArrowUpOutlined style={{ color: '#faad14' }} />}
                          {isSorted === 'desc' && <ArrowDownOutlined style={{ color: '#faad14' }} />}
                          {isSorted === false && (
                            <ArrowUpOutlined style={{ color: '#444', opacity: 0.5 }} />
                          )}
                        </span>
                      )}
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
                );
              })}
            </tr>
          </thead>
        </table>
        
        <table  style={{borderSpacing: 0}}  >
          <tbody   ref={tableBodyRef}
 style={{
            

          //  overflowY: 'auto',
            maxHeight: 'calc(100vh - 260px)',

            // maxHeight: '60vh',
            display: 'block'
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

                {/* Action column for delete button   */}
                {/* <td
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
                </td> */}


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


                 <input
    type="checkbox"
    checked={selectedIds.includes(row)}
    onChange={e => handleCheckboxChange(row, e.target.checked)}
    style={{ marginBottom: 6 }}
  />
  {/* Delete icon */}
  {/* {!actionCollapsed && (
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
  )} */}
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
                        position: cell.column.getIndex() === 0 ? 'sticky' : 'relative',
                        left: cell.column.getIndex() === 0 ? (actionCollapsed ? 30 : 40) : undefined,
                        zIndex: cell.column.getIndex() === 0 ? 101 : undefined,
                      }}
                      onClick={() => {
                        if (columnId !== 'description' && isEditable) {
                          setCurrentlyEditing({ rowIndex: row.index, columnId });
                        }
                      }}
                    >
                      {isEditable && isCurrentlyEditing ? (
                        <EditableCell
                          value={cell.getValue()}
                          editorType={editorType}
                          selectOptions={selectOptions}
                          onSave={val => handleEdit(row.index, row.original, columnId, val)}
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
              <tr ref={newRowRef}>
                <td colSpan={columns.length + 1} style={{ padding: '8px', position: 'sticky', bottom: 0, zIndex: 200 }}>
                  <Button
                    name="+ New row"
                    onFocus={handleAddEmptyRow}
                    onClick={handleAddEmptyRow}
                    style={{
                      width: '100%',
                      background: '#202020',
                      display: 'flex',
                      justifyContent:'flex-start',
                      color: 'white',
                      border: 'none',
                    }}
                  >
                    New row</Button>

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

    const inputRef = useRef<any>(null);

    if(editorType === 'date' && value) {    
      console.log('EditableCell value:', value);  

    }

 useEffect(() => {
  if (editorType === 'input' && inputRef.current) {
    // For AntD Input.TextArea, get the real textarea element
    const textarea = inputRef.current?.resizableTextArea?.textArea;
    if (textarea) {
      textarea.focus();
      const val = textarea.value ?? '';
      const length = val.length;
      textarea.setSelectionRange(length, length);
    }
  }
}, [editorType]);


  if (editorType === 'input') {
    return (
      <Input.TextArea
        value={editValue}
        ref={inputRef}
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

//   if (editorType === 'date') {
//   return (
//     <Input
//       type="date"
//       autoFocus
//       value={editValue}
//       onChange={e => {
//         setEditValue(e.target.value);
//         onSave(e.target.value); // Call handleEdit immediately on date select
//         onCancel();             // Close the editor
//       }}
//       onBlur={() => {
//         onSave(editValue);
//         onCancel();
//       }}
      
//       onFocus={e => {
//         e.target.showPicker && e.target.showPicker();
//       }}
//     />
//   );
// }


if (editorType === 'date') {
    return (
      <DatePicker
        autoFocus
        value={editValue ? dayjs(editValue) : undefined}
        onChange={(date, dateString) => {


          
          // Store the formatted date
          if (date) {
            const formattedDate = date.format('YYYY-MM-DD');
            setEditValue(formattedDate);
            onSave(formattedDate);
          } else {
            setEditValue(null);
            onSave(null);
          }
        }}
        format="DD-MM-YYYY"
        style={{
          width: '100%',
           borderRadius: 4,
          backgroundColor: 'rgb(25, 25, 25)',
          color: 'white',
        }}
        placeholder="Select date"
        onBlur={() => onCancel()}
        // popupClassName="dark-theme-datepicker"
        // dropdownStyle={{ backgroundColor: '#1f1f1f' }}
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


