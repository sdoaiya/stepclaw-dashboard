import { Card } from 'antd';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  extra?: ReactNode;
  height?: number | string;
}

export default function ChartCard({ title, children, extra, height = 300 }: ChartCardProps) {
  return (
    <Card title={title} extra={extra}>
      <div style={{ height }}>{children}</div>
    </Card>
  );
}
