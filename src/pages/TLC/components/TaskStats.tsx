import { Row, Col, Card, Statistic, Progress } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { useTaskStore } from '@/stores';
import { getStatusColor } from '@/utils/helpers';

export default function TaskStats() {
  const stats = useTaskStore((state) => state.getTaskStats());

  const statItems = [
    {
      title: '总任务',
      value: stats.total,
      icon: <FileOutlined />,
      color: '#1890ff',
    },
    {
      title: '进行中',
      value: stats.byStatus.in_progress,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
    },
    {
      title: '已完成',
      value: stats.byStatus.done,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
    },
    {
      title: '已逾期',
      value: stats.overdue,
      icon: <WarningOutlined />,
      color: '#f5222d',
    },
  ];

  const completionRate = stats.total > 0 ? Math.round((stats.byStatus.done / stats.total) * 100) : 0;

  return (
    <Row gutter={[16, 16]} className="mb-4">
      {statItems.map((item) => (
        <Col xs={12} sm={6} key={item.title}>
          <Card size="small" className="stat-card">
            <Statistic
              title={item.title}
              value={item.value}
              valueStyle={{ color: item.color }}
              prefix={item.icon}
            />
          </Card>
        </Col>
      ))}
      <Col xs={24} sm={12}>
        <Card size="small">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500">完成进度</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <Progress
            percent={completionRate}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            showInfo={false}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>今日完成: {stats.completedToday}</span>
            <span>待办: {stats.byStatus.todo}</span>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
