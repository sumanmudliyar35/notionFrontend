import React, { useMemo } from 'react';
import { useGetChartDataByReference } from '../../api/get/getChartDataByReference';
import CustomPieChart from '../../components/CustomPieChart/CustomPieChart';
import styled from 'styled-components';
import DashboardTable from './components/customTable/DashboardTable';
import { Card, Row, Col, Spin } from 'antd';
import StatsCard from './components/StatsCard/StatsCard';
import { CheckCircleOutlined, PercentageOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';


const DashboardContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledCard = styled(Card)`
  background-color: #1f1f1f;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: none;
  overflow: hidden;
  
  .ant-card-head {
    background-color: #252525;
    border-bottom: 1px solid #303030;
    padding: 0 24px;
    
    .ant-card-head-title {
      color: #f0f0f0;
      font-size: 18px;
      font-weight: 500;
    }
  }
  
  .ant-card-body {
    padding: 20px;
  }
`;

const SectionTitle = styled.h1`
  color: #f0f0f0;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
`;

const ChartWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  width: 100%;
  
  .ant-spin {
    .ant-spin-dot-item {
      background-color: #1890ff;
    }
  }
`;

const Dashboard = () => {
  const {data: referenceData, isLoading} = useGetChartDataByReference('all');


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
    // {
    //   title: 'Total Revenue',
    //   dataIndex: 'totalRevenue',
    //   key: 'totalRevenue',
    //   render: (value) => `₹${value?.toLocaleString() || 0}`,
    //   sorter: (a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0),
    // }
  ];


  const revenueColumns: ColumnsType<any> = [
  {
    title: 'Source',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },

 
 
  {
    title: 'Revenue',
    dataIndex: 'revenue',
    key: 'revenue',
    render: (_, record) => `₹${record.revenue?.total?.toLocaleString() || 0}`,
    sorter: (a, b) => (a.revenue?.total || 0) - (b.revenue?.total || 0),
  },
  {
    title: 'Revenue %',
    dataIndex: 'revenuePercentage',
    key: 'revenuePercentage',
    render: (_, record) => record.revenue?.percentage || '0.00%',
    sorter: (a, b) => (a.revenue?.percentageValue || 0) - (b.revenue?.percentageValue || 0),
  }
];


// First, add this useMemo to transform the potential revenue data
const potentialRevenuePieData = useMemo(() => {
  if (!referenceData?.analytics?.potentialRevenue) return { series: [], labels: [] };
  
  // Filter out items with 0 potential revenue to keep chart clean
  const filteredSources = referenceData.analytics.potentialRevenue.filter(
    (source: any) => source.count > 0 || parseFloat(source.potentialRevenue?.total) > 0
  );
  
  const series = filteredSources.map((source: any) => source.count);
  const labels = filteredSources.map((source: any) => source.name);
  
  return { series, labels };
}, [referenceData?.analytics?.potentialRevenue]);

// Then, add columns definition for the potential revenue table
const potentialRevenueColumns: ColumnsType<any> = [
  {
    title: 'Source',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Lead Count',
    dataIndex: 'count',
    key: 'count',
    sorter: (a, b) => a.count - b.count,
  },
  // {
  //   title: 'Distribution %',
  //   dataIndex: 'percentage',
  //   key: 'percentage',
  //   render: (text) => text || '0%',
  //   sorter: (a, b) => {
  //     const rateA = parseFloat(a.percentageValue || 0);
  //     const rateB = parseFloat(b.percentageValue || 0);
  //     return rateA - rateB;
  //   },
  // },
  {
    title: 'Potential Revenue',
    dataIndex: 'potentialRevenue',
    key: 'potentialRevenue',
    render: (_, record) => `₹${record.potentialRevenue?.total?.toLocaleString() || 0}`,
    sorter: (a, b) => (a.potentialRevenue?.total || 0) - (b.potentialRevenue?.total || 0),
  },
  {
    title: 'Potential Revenue %',
    dataIndex: 'potentialRevenuePercentage',
    key: 'potentialRevenuePercentage',
    render: (_, record) => record.potentialRevenue?.percentage || '0%',
    sorter: (a, b) => (a.potentialRevenue?.percentageValue || 0) - (b.potentialRevenue?.percentageValue || 0),
  }
];
  
  // Transform the data for the pie chart
  const inquiredLeadsPieData = useMemo(() => {
    if (!referenceData?.analytics?.inquiredLeads) return { series: [], labels: [] };
    
    // Filter out any items with 0.00 count to keep the chart clean
    const filteredLeads = referenceData.analytics?.inquiredLeads.filter(
      (lead: any) => parseFloat(lead.count) > 0
    );
    
    const series = filteredLeads.map((lead: any) => parseFloat(lead.count));
    const labels = filteredLeads.map((lead: any) => lead.name);
    
    return { series, labels };
  }, [referenceData?.analytics?.inquiredLeads]);
  


  // Transform the data for the pie chart
const inquiredLeadsConversionPieData = useMemo(() => {
  if (!referenceData?.analytics?.convertedLeadsByReference) return { series: [], labels: [] };
  
  // Filter out any items with 0 count to keep the chart clean
  const filteredLeads = referenceData?.analytics?.convertedLeadsByReference.filter(
    (lead: any) => parseFloat(lead.percentageValue) > 0
  );
  
  // Parse the percentageValue string to a number
  const series = filteredLeads.map((lead: any) => parseFloat(lead.percentageValue));
  const labels = filteredLeads.map((lead: any) => lead.name);
  
  return { series, labels };
}, [referenceData?.analytics?.convertedLeadsByReference]);
  // Transform the data for the revenue pie chart
  const revenuePieData = useMemo(() => {
    if (!referenceData?.analytics?.convertedLeadsByReference) return { series: [], labels: [] };
    
    // Filter out any items with 0.00 revenue to keep the chart clean
    const filteredRevenue = referenceData?.analytics?.convertedLeadsByReference.filter(
      (item: any) => parseFloat(item.revenue?.total) > 0
    );

    const series = filteredRevenue.map((item: any) => parseFloat(item.revenue?.percentageValue));
    const labels = filteredRevenue.map((item: any) => item.name);
    
    return { series, labels };
  }, [referenceData?.analytics?.convertedLeadsByReference]);
  
  // Custom colors for the pie chart
  const colors = [
    '#1890FF', // Blue
    '#52C41A', // Green
    '#FA8C16', // Orange
    '#F5222D', // Red
    '#722ED1', // Purple
    '#13C2C2', // Cyan
    '#EB2F96', // Pink
    '#FAAD14', // Yellow
    '#8C8C8C'  // Gray (for Unknown)
  ];



  if (isLoading) {
    return (
      <LoadingContainer>
        <Spin size="large" tip="Loading dashboard data..." />
      </LoadingContainer>
    );
  }

  return (
    <DashboardContainer>
      <SectionTitle>Marketing Dashboard</SectionTitle>


       <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <StatsCard 
            title="Total Leads" 
            value={referenceData?.analytics?.overallStats?.totalLeads}
            icon={<UserOutlined />}
            color="#1890ff" // Blue
            tooltip="Total number of leads generated"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard
            title="Converted Leads" 
            value={referenceData?.analytics?.overallStats?.totalConvertedLeads}
            icon={<CheckCircleOutlined />}
            color="#52c41a" // Green
            tooltip="Total number of leads converted to clients"
          />
        </Col>
         <Col xs={24} sm={8}>
          <StatsCard 
            title="Conversion Rate" 
            value={referenceData?.analytics?.overallStats?.overallConversionRate}
            icon={<PercentageOutlined />}
            color="#fa8c16" // Orange
            tooltip="Percentage of leads converted to clients"
          />
        </Col>
      </Row>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={24} lg={24} xl={24}>
          <StyledCard title="Lead Source Performance Analytics">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <ChartWrapper>
                  <CustomPieChart
                    series={inquiredLeadsPieData.series}
                    labels={inquiredLeadsPieData.labels}
                    colors={colors}
                    donut={false}
                    height={350}
                    title="Lead Distribution by Source"
                  />
                </ChartWrapper>
              </Col>
              
              <Col xs={24} lg={8}>
                <ChartWrapper>
                  <CustomPieChart
                    series={inquiredLeadsConversionPieData.series}
                    labels={inquiredLeadsConversionPieData.labels}
                    colors={colors}
                    donut={false}
                    height={350}
                    title="Lead Conversion by Source"
                  />
                </ChartWrapper>
              </Col>
              
              <Col xs={24} lg={8}>
                <DashboardTable
                  data={referenceData?.analytics?.referenceAnalytics || []}
                  height={350}
                  columns={columns}
                />
              </Col>
            </Row>
          </StyledCard>
        </Col>
      </Row>

       <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={24} lg={24} xl={24}>
          <StyledCard title="Revenue Analytics by Lead Source">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={10}>
                <ChartWrapper>
                  <CustomPieChart
                    series={revenuePieData.series}
                    labels={revenuePieData.labels}
                    colors={colors}
                    donut={false}
                    height={350}
 title="Revenue Distribution by Source"
  gradientEnabled={true}
  animation={true}
  showTotal={true}
  legendPosition="bottom"                  />
                </ChartWrapper>
              </Col>
              
              <Col xs={24} lg={14}>
                <DashboardTable
                  data={referenceData?.analytics?.convertedLeadsByReference || []}
                  height={350}
                  columns={revenueColumns}
                />
              </Col>
            </Row>
          </StyledCard>
        </Col>
      </Row> 
      

<Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
  <Col xs={24} md={24} lg={24} xl={24}>
    <StyledCard title="Potential Revenue by Lead Source(Excited)">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          <ChartWrapper>
            <CustomPieChart
              series={potentialRevenuePieData.series}
              labels={potentialRevenuePieData.labels}
              colors={colors}
              donut={false}
              height={350}
              title="Potential Revenue Distribution"
              gradientEnabled={true}
              animation={true}
              showTotal={true}
              legendPosition="bottom"
            />
          </ChartWrapper>
        </Col>
        
        <Col xs={24} lg={14}>
          <DashboardTable
            data={referenceData?.analytics?.potentialRevenue || []}
            height={350}
            columns={potentialRevenueColumns}
          />
        </Col>
      </Row>
    </StyledCard>
  </Col>
</Row> 
    







    </DashboardContainer>
  );
};

export default Dashboard;