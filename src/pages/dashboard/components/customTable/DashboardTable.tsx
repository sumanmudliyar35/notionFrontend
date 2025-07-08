import React from 'react';
import styled from 'styled-components';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface TableProps {
  data: any[];
  title?: string;
  height?: number | string;
  columns?: ColumnsType<any>;
}

const TableContainer = styled.div`
  background-color: #1f1f1f;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const TableTitle = styled.h3`
  color: #e0e0e0;
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 500;
`;

// Custom styling for the Ant Design table
const StyledTable = styled(Table)`
  .ant-table {
    background-color: transparent;
  }
  
  .ant-table-thead > tr > th {
    background-color: #2a2a2a;
    color: #e0e0e0;
    border-bottom: 1px solid #303030;
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #303030;
    color: rgb(247, 240, 240);
  }
  
  /* Fix hover styles */
  .ant-table-tbody > tr:hover > td {
    background-color: transparent !important;
    color: rgb(247, 240, 240) !important;
  }
  
  /* Fix sorted row styles */
  .ant-table-tbody tr.ant-table-row-selected > td {
    background-color: transparent !important;
    color: rgb(247, 240, 240) !important;
  }
  
  /* Fix table cell background when sorting */
  .ant-table-column-sort {
    background-color: transparent !important;
    color: rgb(247, 240, 240) !important;
  }
  
  /* Fix table when a column is sorted */
  .ant-table-tbody > tr > td.ant-table-column-sort {
    background-color: rgba(45, 45, 45, 0.7) !important;
    color: rgb(247, 240, 240) !important;
  }
  
  /* Fix table header when sorted */
  .ant-table-thead > tr > th.ant-table-column-sort {
    background-color: #2a2a2a !important;
    color: #e0e0e0 !important;
  }
  
  .ant-pagination-item-active {
    border-color: #1890ff;
    a {
      color: #1890ff;
    }
  }
  
  .ant-pagination-item a {
    color: #e0e0e0;
  }
  
  .ant-table-column-sorter-up.active, 
  .ant-table-column-sorter-down.active {
    color: #1890ff;
  }
  
  /* Additional fixes for sorting and selection */
  .ant-table-cell-fix-left,
  .ant-table-cell-fix-right {
    background-color: #2a2a2a !important;
  }
  
  /* Ensure background stays consistent in all states */
  .ant-table-tbody > tr.ant-table-row:nth-child(odd) > td,
  .ant-table-tbody > tr.ant-table-row:nth-child(even) > td {
    background-color: transparent !important;
  }
`;

const DashboardTable: React.FC<TableProps> = ({ data, title, height = 'auto', columns }) => {


 

  return (
    <TableContainer>
      {title && <TableTitle>{title}</TableTitle>}
      <StyledTable 
        columns={columns} 
        dataSource={data.map(item => ({ ...item, key: item.id || item.name }))} 
        pagination={{ pageSize: 10 }}
        scroll={{ y: typeof height === 'number' ? height : undefined }}
        size="middle"
      />
    </TableContainer>
  );
};

export default DashboardTable;