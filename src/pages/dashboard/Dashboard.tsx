import React, { useMemo } from 'react';
import { useGetChartDataByReference } from '../../api/get/getChartDataByReference';
import CustomPieChart from '../../components/CustomPieChart/CustomPieChart';
import styled from 'styled-components';
import DashboardTable from './components/customTable/DashboardTable';
import { Card, Row, Col, Spin } from 'antd';
import StatsCard from './components/StatsCard/StatsCard';
import { CheckCircleOutlined, PercentageOutlined, UserOutlined } from '@ant-design/icons';

const DashboardContainer = styled.div`
  padding: 24px;
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
              <Col xs={24} lg={10}>
                <ChartWrapper>
                  <CustomPieChart
                    series={inquiredLeadsPieData.series}
                    labels={inquiredLeadsPieData.labels}
                    colors={colors}
                    donut={true}
                    height={350}
                    title="Lead Distribution by Source"
                  />
                </ChartWrapper>
              </Col>
              
              <Col xs={24} lg={14}>
                <DashboardTable
                  data={referenceData?.analytics?.referenceAnalytics || []}
                  height={350}
                />
              </Col>
            </Row>
          </StyledCard>
        </Col>
      </Row>
      
      {/* You can add more rows with cards below */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={12} xl={8}>
          <StyledCard title="Lead Status">
            {/* Add another chart or component here */}
          </StyledCard>
        </Col>
        
        <Col xs={24} md={12} xl={8}>
          <StyledCard title="Monthly Performance">
            {/* Add another chart or component here */}
          </StyledCard>
        </Col>
        
        <Col xs={24} xl={8}>
          <StyledCard title="Recent Activities">
            {/* Add recent activities or notifications here */}
          </StyledCard>
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default Dashboard;