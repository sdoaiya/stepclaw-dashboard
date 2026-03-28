import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: ReactNode;
  suffix?: string;
  color?: string;
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  prefix,
  suffix,
  color = '#1890ff',
  loading = false,
}: StatCardProps) {
  return (
    <Card size="small" loading={loading}>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ color }}
      />
    </Card>
  );
}
