import { memo } from 'react';
import { Card } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { Metric } from '@/types';

interface MetricCardProps {
  metric: Metric;
  selected?: boolean;
  onClick?: () => void;
}

function MetricCard({ metric, selected, onClick }: MetricCardProps) {
  const getStatusIcon = () => {
    switch (metric.status) {
      case 'normal':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'warning':
        return <WarningOutlined className="text-yellow-500" />;
      case 'critical':
        return <ExclamationCircleOutlined className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (metric.status) {
      case 'normal':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'critical':
        return 'border-red-200 bg-red-50';
      default:
        return '';
    }
  };

  // Calculate trend
  const history = metric.history;
  const trend =
    history.length >= 2
      ? history[history.length - 1].value - history[history.length - 2].value
      : 0;

  const getTrendIcon = () => {
    if (trend > 0) return <ArrowUpOutlined className="text-red-500" />;
    if (trend < 0) return <ArrowDownOutlined className="text-green-500" />;
    return <MinusOutlined className="text-gray-400" />;
  };

  return (
    <Card
      size="small"
      className={`cursor-pointer transition-all ${selected ? 'ring-2 ring-blue-400' : ''} ${getStatusColor()}`}
      onClick={onClick}
      hoverable
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-gray-500 text-sm mb-1">{metric.name}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{Math.round(metric.value * 10) / 10}</span>
            <span className="text-gray-400 text-sm">{metric.unit}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          {getStatusIcon()}
        </div>
      </div>

      {/* Mini chart */}
      <div className="mt-3 h-8 flex items-end gap-0.5">
        {metric.history.slice(-20).map((point, i) => {
          const max = Math.max(...metric.history.slice(-20).map((p) => p.value));
          const min = Math.min(...metric.history.slice(-20).map((p) => p.value));
          const range = max - min || 1;
          const height = ((point.value - min) / range) * 100;
          return (
            <div
              key={i}
              className="flex-1 bg-current rounded-t"
              style={{
                height: `${Math.max(10, height)}%`,
                opacity: 0.3 + (i / 20) * 0.7,
              }}
            />
          );
        })}
      </div>

      {metric.threshold && (
        <div className="mt-2 text-xs text-gray-400">
          阈值: 警告 {metric.threshold.warning}{metric.unit} / 严重 {metric.threshold.critical}{metric.unit}
        </div>
      )}
    </Card>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(MetricCard);
