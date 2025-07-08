import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import styled from 'styled-components';

interface DataItem {
  category: string;
  series1: number;
  series2: number;
}

interface CustomBarGraphProps {
  data: DataItem[];
  height?: number;
  width?: string;
  title?: string;
  series1Name?: string;
  series2Name?: string;
  series1Color?: string;
  series2Color?: string;
  horizontal?: boolean;
  stacked?: boolean;
  showValues?: boolean;
  maxBarWidth?: number;
  animation?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
}

const ChartContainer = styled.div`
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }
`;

const ChartTitle = styled.h3`
  color: #f0f0f0;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const CustomBarGraph: React.FC<CustomBarGraphProps> = ({
  data,
  height = 450,
  width = '100%',
  title,
  series1Name = 'Series 1',
  series2Name = 'Series 2',
  series1Color = '#1aebb9', // Bright teal
  series2Color = '#1890ff', // Bright blue
  horizontal = true,
  stacked = false,
  showValues = true,
  maxBarWidth = 30,
  animation = true,
  legendPosition = 'top'
}) => {
  // Transform data for ApexCharts format
  const categories = data.map(item => item.category);
  const series1Data = data.map(item => item.series1);
  const series2Data = data.map(item => item.series2);
  
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: {
        show: false
      },
      animations: {
        enabled: animation,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    colors: [series1Color, series2Color],
    plotOptions: {
      bar: {
        horizontal: horizontal,
        columnWidth: '70%',
        barHeight: '70%',
        borderRadius: 4,
        distributed: false,
        rangeBarOverlap: false,
        rangeBarGroupRows: false,
        dataLabels: {
          position: horizontal ? 'top' : 'center',
          maxItems: 100,
          hideOverflowingLabels: false,
        }
      }
    },
    dataLabels: {
      enabled: showValues,
      style: {
        fontSize: '14px',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        colors: ['#ffffff']
      },
      background: {
        enabled: false
      },
      formatter: function (val) {
        return val.toString();
      },
      offsetX: horizontal ? 0 : 0,
      offsetY: horizontal ? 0 : 0,
    },
    stroke: {
      width: 0,
      colors: ['transparent']
    },
    grid: {
      borderColor: '#333333',
      strokeDashArray: 3,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      row: {
        colors: undefined,
        opacity: 0.1
      },
      column: {
        colors: undefined,
        opacity: 0.1
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: new Array(categories.length).fill('#cccccc'),
          fontSize: '12px',
          fontFamily: 'sans-serif',
          fontWeight: 500,
        },
        trim: false,
      },
      axisBorder: {
        show: true,
        color: '#444444'
      },
      axisTicks: {
        show: true,
        color: '#444444'
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#cccccc'],
          fontSize: '12px',
          fontFamily: 'sans-serif',
          fontWeight: 500,
        }
      },
      axisBorder: {
        show: true,
        color: '#444444'
      },
      axisTicks: {
        show: true,
        color: '#444444'
      },
      min: 0,
    },
    legend: {
      position: legendPosition,
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      fontFamily: 'sans-serif',
      fontWeight: 500,
      formatter: undefined,
      inverseOrder: false,
      width: undefined,
      height: undefined,
      offsetX: 0,
      offsetY: 0,
      labels: {
        colors: '#cccccc',
        useSeriesColors: false
      },
      markers: {
        size: 12,
        strokeWidth: 0,
        offsetX: 0,
        offsetY: 0
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '14px',
        fontFamily: 'sans-serif'
      },
      x: {
        show: true
      },
      y: {
        formatter: function (val) {
          return val.toString();
        }
      },
      marker: {
        show: true,
      },
      fixed: {
        enabled: false,
        position: 'topRight',
        offsetX: 0,
        offsetY: 0,
      },
    },
    states: {
      hover: {
        filter: {
          type: 'lighten'
        }
      },
      active: {
        filter: {
          type: 'darken'
        }
      }
    }
  });
  
  // Update options when props change
  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      colors: [series1Color, series2Color],
      chart: {
        ...prev.chart,
        animations: {
          ...prev.chart?.animations,
          enabled: animation
        }
      },
      plotOptions: {
        ...prev.plotOptions,
        bar: {
          ...prev.plotOptions?.bar,
          horizontal: horizontal,
          distributed: false,
          dataLabels: {
            ...prev.plotOptions?.bar?.dataLabels,
            position: horizontal ? 'top' : 'center',
          }
        }
      },
      xaxis: {
        ...prev.xaxis,
        categories: categories,
        labels: {
          ...prev.xaxis?.labels,
          style: {
            ...prev.xaxis?.labels?.style,
            colors: new Array(categories.length).fill('#cccccc'),
          },
        }
      },
      dataLabels: {
        ...prev.dataLabels,
        enabled: showValues,
      },
      legend: {
        ...prev.legend,
        position: legendPosition,
      }
    }));
  }, [
    data, horizontal, series1Color, series2Color, 
    showValues, legendPosition, animation, categories
  ]);
  
  const series = [
    {
      name: series1Name,
      data: series1Data
    },
    {
      name: series2Name,
      data: series2Data
    }
  ];

  return (
    <ChartContainer style={{ width }}>
      {title && <ChartTitle>{title}</ChartTitle>}
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={height}
        width="100%"
      />
    </ChartContainer>
  );
};

export default CustomBarGraph;