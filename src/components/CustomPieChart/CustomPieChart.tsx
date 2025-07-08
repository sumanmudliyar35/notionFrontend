import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
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
  showTotal?: boolean;
  animation?: boolean;
  gradientEnabled?: boolean;
}

const ChartContainer = styled.div`
  background-color: #1f1f1f;
  border-radius: 12px;
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
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const ChartLegendContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const CustomPieChart: React.FC<CustomPieChartProps> = ({
  series,
  labels,
  title,
  colors = ['#3f8cff', '#53d86a', '#ffc233', '#ff5c8d', '#a58eff', '#22d3ee', '#10b981', '#f97066'],
  height = 350,
  width = '100%',
  donut = false,
  legendPosition = 'bottom',
  enableDataLabels = true,
  showTotal = true,
  animation = true,
  gradientEnabled = true,
}) => {
  // Create gradient colors for more vibrant look
  const getGradientColors = () => {
    if (!gradientEnabled) return colors;
    
    return colors.map((color) => {
      // Return a string instead of an array
      const lighterShade = colorLuminance(color, 0.2);
      // ApexCharts expects a string for colors, not an array
      return color;
    });
  };
  
  // Function to adjust color luminance
  const colorLuminance = (hex: string, lum: number) => {
    // Validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // Convert to decimal and adjust luminance
    let rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }

    return rgb;
  };

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: donut ? 'donut' : 'pie',
      background: 'transparent',
      foreColor: '#e0e0e0',
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
      },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        opacity: 0.2
      }
    },
    labels: labels,
    colors: colors, // Just use regular colors, not arrays
    fill: {
      type: gradientEnabled ? 'gradient' : 'solid',
      gradient: {
        shade: 'light',
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: gradientEnabled ? colors.map(color => colorLuminance(color, 0.2)) : undefined,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100]
      }
    },
    legend: {
      position: legendPosition,
      horizontalAlign: 'center',
      fontWeight: 500,
      fontSize: '14px',
      labels: {
        colors: '#f0f0f0',
      },
      markers: {
        size: 8,
        strokeWidth: 0,
        offsetX: 0
      },
      itemMargin: {
        horizontal: 12,
        vertical: 6
      },
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      }
    },
    dataLabels: {
      enabled: enableDataLabels,
      style: {
        fontSize: '14px',
        fontFamily: 'sans-serif',  // Changed to sans-serif
        fontWeight: 'bold',
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        color: 'rgba(0, 0, 0, 0.35)',
        opacity: 0.45
      },
      formatter: function(val: number) {
        return val.toFixed(1) + '%';
      }
    },
    stroke: {
      width: 2,
      colors: ['#1f1f1f']
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        // donut: {
        //   size: donut ? '55%' : '0%',
        //   background: 'transparent',
        //   labels: {
        //     show: donut,
        //     name: {
        //       show: true,
        //       fontSize: '14px',
        //       fontFamily: 'sans-serif',  // Changed to sans-serif
        //       fontWeight: 600,
        //       color: '#f0f0f0',
        //       offsetY: -10
        //     },
        //     value: {
        //       show: true,
        //       fontSize: '18px',
        //       fontFamily: 'sans-serif',  // Changed to sans-serif
        //       color: '#f0f0f0',
        //       fontWeight: 600,
        //       formatter: function(val: string) {
        //         return val;
        //       }
        //     },
        //     total: {
        //       show: showTotal,
        //       showAlways: false,
        //       label: 'Total',
        //       fontSize: '14px',
        //       fontFamily: 'sans-serif',  // Changed to sans-serif
        //       fontWeight: 600,
        //       color: '#f0f0f0',
        //       formatter: function(w: any) {
        //         return w.globals.seriesTotals
        //           .reduce((a: number, b: number) => a + b, 0)
        //           .toLocaleString();
        //       }
        //     }
        //   }
        // }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '100%'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    tooltip: {
      enabled: true,
      theme: 'dark',
      fillSeriesColor: false,
      style: {
        fontSize: '14px',
        fontFamily: 'sans-serif',  // Changed to sans-serif
      },
      y: {
        formatter: function(value, { seriesIndex, dataPointIndex, w }: any) {
          const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
          const percentage = (value * 100 / total).toFixed(1);
          return `${value.toLocaleString()} (${percentage}%)`;
        }
      }
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
  
  // Update chart options when props change
  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      chart: {
        ...prev.chart,
        type: donut ? 'donut' : 'pie',
        animations: {
          ...prev.chart?.animations,
          enabled: animation
        }
      },
      labels,
      colors: colors, // Just use regular colors, not arrays
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
          ...prev.plotOptions?.pie,
          donut: {
            ...prev.plotOptions?.pie?.donut,
            size: donut ? '55%' : '0%',
            labels: {
              ...prev.plotOptions?.pie?.donut?.labels,
              show: donut,
              total: {
                ...prev.plotOptions?.pie?.donut?.labels?.total,
                show: showTotal
              }
            }
          }
        }
      }
    }));
  }, [labels, colors, legendPosition, enableDataLabels, donut, showTotal, animation, gradientEnabled]);

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