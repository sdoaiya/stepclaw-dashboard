import { useMemo, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsInstance } from 'echarts-for-react';
import type { Metric } from '@/types';
import { CHART_COLORS } from '@/utils/constants';

interface MetricChartProps {
  metrics: Metric[];
}

export default function MetricChart({ metrics }: MetricChartProps) {
  const chartRef = useRef<EChartsInstance | null>(null);

  // Cleanup ECharts instance on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, []);

  const option = useMemo(() => {
    const series = metrics.map((metric, index) => ({
      name: metric.name,
      type: 'line',
      smooth: true,
      data: metric.history.map((h) => h.value),
      lineStyle: {
        color: CHART_COLORS[index % CHART_COLORS.length],
        width: 2,
      },
      itemStyle: {
        color: CHART_COLORS[index % CHART_COLORS.length],
      },
      areaStyle: {
        opacity: 0.1,
        color: CHART_COLORS[index % CHART_COLORS.length],
      },
      markLine: metric.threshold
        ? {
            silent: true,
            data: [
              {
                yAxis: metric.threshold.warning,
                lineStyle: { color: '#faad14', type: 'dashed' },
                label: { formatter: '警告' },
              },
              {
                yAxis: metric.threshold.critical,
                lineStyle: { color: '#f5222d', type: 'dashed' },
                label: { formatter: '严重' },
              },
            ],
          }
        : undefined,
    }));

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: metrics.map((m) => m.name),
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: metrics[0]?.history.map((_, i) => `${i}m`) || [],
        axisLine: {
          lineStyle: {
            color: '#d9d9d9',
          },
        },
        axisLabel: {
          color: '#8c8c8c',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d9d9d9',
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
      series,
    };
  }, [metrics]);

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      onChartReady={(instance) => {
        chartRef.current = instance;
      }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
