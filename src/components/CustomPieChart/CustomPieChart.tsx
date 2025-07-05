import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import type {ApexOptions}  from 'apexcharts';
import styled from 'styled-components';

interface CustomPieChartProps {
  series: number[];
  labels: string[];
  title?: string;
  colors?: string[];
  height?: number;
  width?: string;
  donut?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  enableDataLabels?: boolean;
}

const ChartContainer = styled.div`
  background-color: #1f1f1f;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  color: #e0e0e0;
  margin-top: 0;
  margin-bottom: 16px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
`;

const CustomPieChart: React.FC<CustomPieChartProps> = ({
  series,
  labels,
  title,
  colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#4CAF50', '#00BCD4'],
  height = 350,
  width = '100%',
  donut = false,
  legendPosition = 'bottom',
  enableDataLabels = true,
}) => {
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: 'pie',
      background: 'transparent',
      foreColor: '#e0e0e0',
    },
    labels: labels,
    colors: colors,
    legend: {
      position: legendPosition,
      horizontalAlign: 'center',
      labels: {
        colors: '#e0e0e0',
      },
      markers: {
        size: 12,
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 5
      },
    },
    dataLabels: {
      enabled: enableDataLabels,
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
      },
      dropShadow: {
        enabled: false,
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: donut ? '50%' : '0%',
          labels: {
            show: donut,
            name: {
              show: true,
              fontSize: '16px',
              color: '#e0e0e0',
            },
            value: {
              show: true,
              fontSize: '20px',
              color: '#e0e0e0',
            },
            total: {
              show: true,
              label: 'Total',
              color: '#e0e0e0',
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 320
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function(value) {
          return value.toString();
        }
      }
    }
  });
  
  // Update chart options when props change
  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      labels,
      colors,
      legend: {
        ...prev.legend,
        position: legendPosition,
      },
      dataLabels: {
        ...prev.dataLabels,
        enabled: enableDataLabels
      },
      plotOptions: {
        ...prev.plotOptions,
        pie: {
          donut: {
            ...prev.plotOptions?.pie?.donut,
            size: donut ? '50%' : '0%',
            labels: {
              ...prev.plotOptions?.pie?.donut?.labels,
              show: donut
            }
          }
        }
      }
    }));
  }, [labels, colors, legendPosition, enableDataLabels, donut]);

  return (
    <ChartContainer style={{ width }}>
      {title && <ChartTitle>{title}</ChartTitle>}
      <ReactApexChart 
        options={options} 
        series={series} 
        type={donut ? 'donut' : 'pie'} 
        height={height} 
      />
    </ChartContainer>
  );
};

export default CustomPieChart;