import { Row, Col, Card, Statistic } from 'antd';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useReportStore } from '@/stores';
import { formatDuration } from '@/utils/helpers';

export default function ReportStats() {
  const { reports, getReportStats } = useReportStore();
  const stats = getReportStats();

  // Calculate streak
  const calculateStreak = () => {
    if (reports.length === 0) return 0;
    const sortedDates = reports
      .map((r) => r.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const reportDate = new Date(sortedDates[i]);
      const diffDays = Math.floor(
        (today.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diffDays === i || (i === 0 && diffDays <= 1)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const statItems = [
    {
      title: '总日报数',
      value: stats.totalReports,
      prefix: <FileTextOutlined />,
      color: '#1890ff',
    },
    {
      title: '连续提交',
      value: calculateStreak(),
      suffix: '天',
      prefix: <CalendarOutlined />,
      color: '#52c41a',
    },
    {
      title: '平均任务',
      value: stats.avgTasksCompleted.toFixed(1),
      suffix: '个',
      prefix: <CheckCircleOutlined />,
      color: '#722ed1',
    },
    {
      title: '平均工时',
      value: formatDuration(stats.avgWorkTime),
      prefix: <ClockCircleOutlined />,
      color: '#faad14',
    },
  ];

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {statItems.map((item) => (
        <Col xs={12} sm={6} key={item.title}>
          <Card size="small">
            <Statistic
              title={item.title}
              value={item.value}
              suffix={item.suffix}
              prefix={item.prefix}
              valueStyle={{ color: item.color }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
