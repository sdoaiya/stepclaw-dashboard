import { Typography, Space } from 'antd';

const { Title, Text } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, extra }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <Title level={3} className="!mb-1">{title}</Title>
        {subtitle && <Text type="secondary">{subtitle}</Text>}
      </div>
      {extra && <Space>{extra}</Space>}
    </div>
  );
}
