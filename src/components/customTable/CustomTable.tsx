import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import type { VisibilityState } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Input, Select, DatePicker } from 'antd';
import * as styled from './style';
import dayjs from 'dayjs';
import DownArrowIcon from '../../assets/icons/downArrowIcon';
import UpArrowIcon from '../../assets/icons/UpArrowIcon';
import CustomSelect from '../customSelect/CustomSelect';

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


}

export function CustomTable<T extends object>({
  columns,
  data,
  onDataChange,
  createEmptyRow,
  onRowCreate,
  onRowEdit,
  isWithNewRow
}: EditableTableProps<T>) {


  const [hasAdded, setHasAdded] = useState(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<{
    rowIndex: number;
    columnId: keyof T;
  } | null>(null);

  const [sorting, setSorting] = useState<any[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Add state for column visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [menuOpenCell, setMenuOpenCell] = useState<{ rowIndex: number; columnId: keyof T } | null>(null);

  const handleEdit = (rowIndex: number, columnId: keyof T, value: any) => {
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, columnVisibility }, // <-- add columnVisibility
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility, // <-- add handler
    columnResizeMode: 'onChange', // Optional: useful for resizable support later

  });

  // UI for toggling columns
  const renderColumnToggles = () => (
    <div style={{ marginBottom: 8 }}>
      {table.getAllLeafColumns().map((column) => (
        <label key={column.id} style={{ marginRight: 12 }}>
          <input
            type="checkbox"
            checked={column.getIsVisible()}
            onChange={() => column.toggleVisibility()}
          />{' '}
          {column.columnDef.header as string}
        </label>
      ))}
    </div>
  );

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      {renderColumnToggles()}
      <table style={{ minWidth: '1000px', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) =>
                header.isPlaceholder ? null : (
                  <th
                    key={header.id}
                    style={{
                      border: '3px solid rgb(32,32,32)',
                      padding: '8px',
                      width: header.column.getSize(),
                      minWidth: header.column.getSize(),
                      maxWidth: header.column.getSize(),
                      position: header.index === 0 ? 'sticky' : undefined,
                      left: header.index === 0 ? 0 : undefined,
                      background: '#1a1a1a',
                      zIndex: header.index === 0 ? 3 : undefined,
                      cursor: header.column.getCanSort() ? 'pointer' : undefined,
                      textAlign: 'left', // <-- Add this line to left-align header text
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span style={{ marginLeft: 4 }}>
                        {header.column.getIsSorted() === 'asc' &&  <UpArrowIcon/>}

                        {header.column.getIsSorted() === 'desc' && <DownArrowIcon/>}
                      </span>
                    )}
                  </th>
                )
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onMouseEnter={() => setHoveredRow(row.index)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                background: hoveredRow === row.index ? 'white' : undefined, // <-- Row hover color
                transition: 'background 0.2s',
              }}
            >
              {row.getVisibleCells().map((cell) => {
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
                    style={{
                      border: '3px solid rgb(32,32,32)',
                      padding: '8px',
                      cursor: isEditable ? 'pointer' : 'default',
                      width: cell.column.getSize(),
                      minWidth: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                      position: cell.column.getIndex() === 0 ? 'sticky' : 'relative',
                      left: cell.column.getIndex() === 0 ? 0 : undefined,
                      background: hoveredRow === row.index ? '#23272f' : '#1a1a1a',
                      zIndex: cell.column.getIndex() === 0 ? 100 : undefined,
                    }}
                    onClick={() => {
                      if (isEditable) {
                        setCurrentlyEditing({ rowIndex: row.index, columnId });
                        if (editorType === 'select') {
                          setMenuOpenCell({ rowIndex: row.index, columnId });
                        }
                      }
                    }}
                  >
                    {isEditable && isCurrentlyEditing ? (
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
                            zIndex: 2,
                            borderColor: 'transparent',
                            boxShadow: 'none',
                            background: 'rgb(37, 37, 37)',
                          }}
                          options={selectOptions}
                          onChange={(option: any) => {
                            setCurrentlyEditing(null);
                            setMenuOpenCell(null);
                            handleEdit(row.index, columnId, option ? option.value : '');
                          }}
                          onBlur={() => {
                            setCurrentlyEditing(null);
                            setMenuOpenCell(null);
                          }}
                          placeholder="Select..."
                          menuIsOpen={
                            !!menuOpenCell &&
                            menuOpenCell.rowIndex === row.index &&
                            menuOpenCell.columnId === columnId
                          }
                           
                        />
                      ) : (
                        <Input
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
                        />
                      )
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {isWithNewRow && (

            <tr>
              <td colSpan={columns.length} style={{ padding: '8px', position:'sticky' }}>
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

