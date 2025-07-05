import React from 'react';
import styled from 'styled-components';
import { Card, Statistic, Row, Col, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: string;
  tooltip?: string;
  size?: 'default' | 'small' | 'large';
}

const StyledCard = styled(Card)<{ $cardColor?: string }>`
  background-color: ${props => props.$cardColor || '#1f1f1f'};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  
  .ant-card-body {
    padding: 20px;
  }
`;

const Title = styled.div`
  color: #e0e0e0;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledStatistic = styled(Statistic)`
  .ant-statistic-title {
    color: #b0b0b0;
    font-size: 14px;
  }
  
  .ant-statistic-content {
    color: #f0f0f0;
    font-size: 28px;
    font-weight: 600;
  }
`;

const IconWrapper = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${props => props.$color ? `${props.$color}20` : '#1890ff20'};
  margin-bottom: 16px;
  
  svg {
    font-size: 24px;
    color: ${props => props.$color || '#1890ff'};
  }
`;

const TrendInfo = styled.div<{ $positive?: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.$positive ? '#52c41a' : '#f5222d'};
  font-size: 14px;
  margin-top: 8px;
  
  svg {
    margin-right: 4px;
  }
`;

const StatsCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  prefix,
  suffix,
  icon,
  trend,
  trendLabel,
  color = '#1890ff',
  tooltip,
  size = 'default',
}) => {
  const valueSize = size === 'small' ? 24 : size === 'large' ? 36 : 28;
  const titleSize = size === 'small' ? 14 : size === 'large' ? 18 : 16;
  
  return (
    <StyledCard $cardColor={color === '#1890ff' ? undefined : `${color}10`}>
      <Row gutter={16} align="middle">
        {icon && (
          <Col>
            <IconWrapper $color={color}>{icon}</IconWrapper>
          </Col>
        )}
        <Col flex="auto">
          <Title style={{ fontSize: titleSize }}>
            {title}
            {tooltip && (
              <Tooltip title={tooltip}>
                <InfoCircleOutlined style={{ color: '#8c8c8c', marginLeft: 8 }} />
              </Tooltip>
            )}
          </Title>
          <StyledStatistic 
            value={value} 
            prefix={prefix}
            suffix={suffix}
            valueStyle={{ fontSize: valueSize }}
          />
          {trend !== undefined && (
            <TrendInfo $positive={trend >= 0}>
              {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {Math.abs(trend)}% {trendLabel || 'vs. last period'}
            </TrendInfo>
          )}
          {description && (
            <div style={{ color: '#b0b0b0', fontSize: '14px', marginTop: 8 }}>
              {description}
            </div>
          )}
        </Col>
      </Row>
    </StyledCard>
  );
};

export default StatsCard;