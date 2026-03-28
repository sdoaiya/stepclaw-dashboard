import { List, Button, Tag, Empty, Space } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useMonitorStore } from '@/stores';
import { formatDateTime } from '@/utils/helpers';
import type { Alert } from '@/types';

export default function AlertList() {
  const { alerts, acknowledgeAlert, resolveAlert } = useMonitorStore();

  // Mock alerts for demo
  const mockAlerts: Alert[] = [
    {
      id: '1',
      metricId: 'disk',
      metricName: '磁盘使用率',
      severity: 'warning',
      message: '磁盘使用率超过 75%',
      value: 78,
      threshold: 80,
      status: 'active',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      metricId: 'queue',
      metricName: '消息队列',
      severity: 'warning',
      message: '消息队列响应时间超过阈值',
      value: 250,
      threshold: 200,
      status: 'acknowledged',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      acknowledgedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationCircleOutlined className="text-red-500" />;
      case 'warning':
        return <WarningOutlined className="text-yellow-500" />;
      default:
        return <CheckCircleOutlined className="text-blue-500" />;
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="red">未处理</Tag>;
      case 'acknowledged':
        return <Tag color="orange">已确认</Tag>;
      case 'resolved':
        return <Tag color="green">已解决</Tag>;
      default:
        return null;
    }
  };

  return (
    <div className="h-80 overflow-auto">
      {displayAlerts.length > 0 ? (
        <List
          dataSource={displayAlerts}
          renderItem={(alert) => (
            <List.Item
              className="border-b border-gray-100 py-3"
              actions={
                alert.status === 'active'
                  ? [
                      <Button
                        key="ack"
                        size="small"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        确认
                      </Button>,
                      <Button
                        key="resolve"
                        size="small"
                        type="primary"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        解决
                      </Button>,
                    ]
                  : alert.status === 'acknowledged'
                  ? [
                      <Button
                        key="resolve"
                        size="small"
                        type="primary"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        解决
                      </Button>,
                    ]
                  : undefined
              }
            >
              <List.Item.Meta
                avatar={getSeverityIcon(alert.severity)}
                title={
                  <Space>
                    <span>{alert.metricName}</span>
                    {getStatusTag(alert.status)}
                  </Space>
                }
                description={
                  <div>
                    <div className="text-sm">{alert.message}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      <ClockCircleOutlined className="mr-1" />
                      {formatDateTime(alert.createdAt)}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="暂无告警" className="mt-8" />
      )}
    </div>
  );
}
