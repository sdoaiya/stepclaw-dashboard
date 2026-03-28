import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Statistic, Typography, Badge, Progress } from 'antd';
import {
  ProjectOutlined,
  RiseOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useTaskStore, useLearningStore, useMonitorStore } from '@/stores';
import { MODULES } from '@/utils/constants';

const { Title, Text } = Typography;

export default function HomePage() {
  const navigate = useNavigate();
  const taskStats = useTaskStore((state) => state.getTaskStats());
  const learningStats = useLearningStore((state) => state.getLearningStats());
  const alertStats = useMonitorStore((state) => state.getAlertStats());
  const metricStats = useMonitorStore((state) => state.getMetricStats());

  const moduleCards = [
    {
      ...MODULES[0],
      stats: `${taskStats.total} 个任务`,
      trend: `${taskStats.completedToday} 今日完成`,
    },
    {
      ...MODULES[1],
      stats: `${learningStats.totalSkills} 项技能`,
      trend: `${learningStats.todayPracticeTime} 分钟今日学习`,
    },
    {
      ...MODULES[2],
      stats: `${metricStats.normal}/${metricStats.total} 正常`,
      trend: alertStats.critical > 0 ? `${alertStats.critical} 个严重告警` : '系统正常',
    },
    {
      ...MODULES[3],
      stats: '今日未提交',
      trend: '点击创建日报',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <Title level={3}>欢迎回来 👋</Title>
        <Text type="secondary">这里是灵笼看板 v3.0，您的效率工作中心</Text>
      </div>

      {/* Module Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        {moduleCards.map((module) => (
          <Col xs={24} sm={12} lg={6} key={module.id}>
            <Card
              className="module-card h-full cursor-pointer"
              onClick={() => navigate(module.path)}
              bodyStyle={{ padding: 20 }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${module.color}15`, color: module.color }}
                >
                  {module.id === 'tlc' && <ProjectOutlined />}
                  {module.id === 'los' && <RiseOutlined />}
                  {module.id === 'mss' && <DashboardOutlined />}
                  {module.id === 'drs' && <FileTextOutlined />}
                </div>
                <ArrowRightOutlined className="text-gray-300" />
              </div>
              <div className="mt-4">
                <div className="text-lg font-semibold">{module.name}</div>
                <div className="text-xs text-gray-400 mb-2">{module.fullName}</div>
                <div className="flex items-center justify-between">
                  <Text type="secondary" className="text-sm">
                    {module.stats}
                  </Text>
                  <Text type="secondary" className="text-xs">
                    {module.trend}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Statistics Overview */}
      <Row gutter={[16, 16]}>
        {/* Task Overview */}
        <Col xs={24} lg={12}>
          <Card title="任务概览" extra={<a onClick={() => navigate('/tlc')}>查看全部</a>}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="总任务"
                  value={taskStats.total}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="进行中"
                  value={taskStats.byStatus.in_progress}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="已完成"
                  value={taskStats.byStatus.done}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
            </Row>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>完成进度</span>
                <span>
                  {taskStats.total > 0
                    ? Math.round((taskStats.byStatus.done / taskStats.total) * 100)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                percent={
                  taskStats.total > 0
                    ? Math.round((taskStats.byStatus.done / taskStats.total) * 100)
                    : 0
                }
                strokeColor="#52c41a"
                showInfo={false}
              />
            </div>
            {taskStats.overdue > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center gap-2 text-red-500">
                <WarningOutlined />
                <span>有 {taskStats.overdue} 个任务已逾期</span>
              </div>
            )}
          </Card>
        </Col>

        {/* Learning Progress */}
        <Col xs={24} lg={12}>
          <Card title="学习进度" extra={<a onClick={() => navigate('/los')}>查看全部</a>}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="技能总数"
                  value={learningStats.totalSkills}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="满级技能"
                  value={learningStats.maxLevelSkills}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="今日学习"
                  value={learningStats.todayPracticeTime}
                  suffix="分钟"
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
            </Row>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>目标完成度</span>
                <span>
                  {learningStats.totalGoals > 0
                    ? Math.round(
                        (learningStats.completedGoals / learningStats.totalGoals) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <Progress
                percent={
                  learningStats.totalGoals > 0
                    ? Math.round(
                        (learningStats.completedGoals / learningStats.totalGoals) * 100
                      )
                    : 0
                }
                strokeColor="#722ed1"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>

        {/* System Status */}
        <Col xs={24} lg={12}>
          <Card title="系统状态" extra={<a onClick={() => navigate('/mss')}>查看全部</a>}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="正常指标"
                  value={metricStats.normal}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="警告指标"
                  value={metricStats.warning}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="严重告警"
                  value={alertStats.critical}
                  valueStyle={{ color: alertStats.critical > 0 ? '#f5222d' : '#52c41a' }}
                  prefix={alertStats.critical > 0 ? <WarningOutlined /> : <CheckCircleOutlined />}
                />
              </Col>
            </Row>
            <div className="mt-4 flex items-center gap-4">
              <Badge
                status={alertStats.critical > 0 ? 'error' : 'success'}
                text={alertStats.critical > 0 ? '需要关注' : '系统运行正常'}
              />
              <Text type="secondary" className="text-sm">
                共 {metricStats.total} 个监控指标
              </Text>
            </div>
          </Card>
        </Col>

        {/* Daily Report */}
        <Col xs={24} lg={12}>
          <Card title="今日日报" extra={<a onClick={() => navigate('/drs')}>查看全部</a>}>
            <div className="text-center py-8">
              <FileTextOutlined className="text-4xl text-gray-300 mb-4" />
              <div className="text-gray-500 mb-4">今日日报尚未创建</div>
              <a onClick={() => navigate('/drs/new')}>立即创建日报 →</a>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
