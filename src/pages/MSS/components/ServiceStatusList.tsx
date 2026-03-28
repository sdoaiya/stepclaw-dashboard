import { List, Badge, Progress, Space } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ServiceStatus } from '@/types';

interface ServiceStatusListProps {
  services: ServiceStatus[];
}

export default function ServiceStatusList({ services }: ServiceStatusListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircleOutlined className="text-green-500 text-lg" />;
      case 'degraded':
        return <WarningOutlined className="text-yellow-500 text-lg" />;
      case 'down':
        return <CloseCircleOutlined className="text-red-500 text-lg" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'up':
        return <Badge status="success" text="正常" />;
      case 'degraded':
        return <Badge status="warning" text="降级" />;
      case 'down':
        return <Badge status="error" text="故障" />;
      default:
        return null;
    }
  };

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
      dataSource={services}
      renderItem={(service) => (
        <List.Item>
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Space>
                {getStatusIcon(service.status)}
                <span className="font-medium">{service.name}</span>
              </Space>
              {getStatusBadge(service.status)}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">可用性</span>
                <span className="font-medium">{service.uptime}%</span>
              </div>
              <Progress
                percent={service.uptime}
                size="small"
                strokeColor={service.status === 'up' ? '#52c41a' : service.status === 'degraded' ? '#faad14' : '#f5222d'}
                showInfo={false}
              />

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">响应时间</span>
                <span className="font-medium">{service.responseTime}ms</span>
              </div>

              <div className="text-xs text-gray-400">
                <ClockCircleOutlined className="mr-1" />
                最后检查: {new Date(service.lastChecked).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}
