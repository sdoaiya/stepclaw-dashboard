import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { LearningCurveData } from '@/types';

interface LearningChartProps {
  data: LearningCurveData[];
}

export default function LearningChart({ data }: LearningChartProps) {
  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['累计经验', '练习时长'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map((d) => d.date.slice(5)), // MM-DD
        axisLine: {
          lineStyle: {
            color: '#d9d9d9',
          },
        },
        axisLabel: {
          color: '#8c8c8c',
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '经验值',
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#722ed1',
            },
          },
          axisLabel: {
            color: '#8c8c8c',
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
            },
          },
        },
        {
          type: 'value',
          name: '时长(分)',
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#1890ff',
            },
          },
          axisLabel: {
            color: '#8c8c8c',
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '累计经验',
          type: 'line',
          smooth: true,
          data: data.map((d) => d.totalExp),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(114, 46, 209, 0.3)' },
                { offset: 1, color: 'rgba(114, 46, 209, 0.05)' },
              ],
            },
          },
          lineStyle: {
            color: '#722ed1',
            width: 2,
          },
          itemStyle: {
            color: '#722ed1',
          },
        },
        {
          name: '练习时长',
          type: 'bar',
          yAxisIndex: 1,
          data: data.map((d) => d.practiceTime),
          itemStyle: {
            color: '#1890ff',
            borderRadius: [4, 4, 0, 0],
          },
          barWidth: '40%',
        },
      ],
    };
  }, [data]);

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}
