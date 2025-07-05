import React from 'react';
import styled from 'styled-components';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface TableProps {
  data: any[];
  title?: string;
  height?: number | string;
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
    //  color: #e0e0e0;
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
  
  /* Remove the hover effect */
  .ant-table-tbody > tr:hover > td {
    background-color: transparent !important; /* Use !important to override Ant Design's default styles */
  }
  
  .ant-pagination-item-active {
    border-color: #1890ff;
    a {
      color: #1890ff;
    }
  }
  
  .ant-pagination-item a {
    // color: #e0e0e0;
  }
  
  .ant-table-column-sorter-up.active, 
  .ant-table-column-sorter-down.active {
    color: #1890ff;
  }
`;

const DashboardTable: React.FC<TableProps> = ({ data, title, height = 'auto' }) => {


  console.log('DashboardTable Data:', data);
  const columns: ColumnsType<any> = [
    {
      title: 'Source',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Total Leads',
      dataIndex: 'totalLeads',
      key: 'totalLeads',
      sorter: (a, b) => a.totalLeads - b.totalLeads,
    },
    {
      title: 'Converted Leads',
      dataIndex: 'convertedLeads',
      key: 'convertedLeads',
      sorter: (a, b) => a.convertedLeads - b.convertedLeads,
    },
    {
      title: 'Conversion Rate',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      render: (text) => text || '0%',
      sorter: (a, b) => {
        const rateA = parseFloat(a.conversionRateValue || 0);
        const rateB = parseFloat(b.conversionRateValue || 0);
        return rateA - rateB;
      },
    },
    {
      title: 'Total Revenue',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (value) => `₹${value?.toLocaleString() || 0}`,
      sorter: (a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0),
    }
  ];

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