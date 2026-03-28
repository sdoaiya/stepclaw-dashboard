import { useState } from 'react';
import { Row, Col, Card, Button, Progress, Tabs, List, Avatar, Badge, Tag, Statistic } from 'antd';
import {
  PlusOutlined,
  RiseOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  BookOutlined,
  FlagOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { useLearningStore } from '@/stores';
import { SKILL_LEVELS } from '@/utils/constants';
import { formatDuration } from '@/utils/helpers';
import LearningChart from './components/LearningChart';
import SkillTree from './components/SkillTree';
import GoalList from './components/GoalList';
import AddSkillModal from './components/AddSkillModal';
import AddGoalModal from './components/AddGoalModal';
import AddRecordModal from './components/AddRecordModal';
import type { Skill, LearningGoal } from '@/types';

const { TabPane } = Tabs;

export default function LOSPage() {
  const { skills, goals, records, getLearningStats, getLearningCurveData, selectedSkillId, setSelectedSkillId } =
    useLearningStore();
  const stats = getLearningStats();
  const curveData = getLearningCurveData(30);

  const [activeTab, setActiveTab] = useState('overview');
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const selectedSkill = selectedSkillId ? skills.find((s) => s.id === selectedSkillId) : null;

  const getLevelInfo = (level: number) => {
    return SKILL_LEVELS.find((l) => l.level === level) || SKILL_LEVELS[0];
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">学习曲线</h1>
          <p className="text-gray-400 text-sm">Learning Objective System</p>
        </div>
        <div className="flex gap-2">
          <Button icon={<RiseOutlined />} onClick={() => setIsRecordModalOpen(true)}>
            记录学习
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsSkillModalOpen(true)}>
            添加技能
          </Button>
        </div>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="技能总数"
              value={stats.totalSkills}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="满级技能"
              value={stats.maxLevelSkills}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="进行中目标"
              value={stats.totalGoals - stats.completedGoals}
              prefix={<FlagOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="今日学习"
              value={formatDuration(stats.todayPracticeTime)}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="概览" key="overview">
          <Row gutter={[16, 16]}>
            {/* Learning Curve Chart */}
            <Col xs={24} lg={16}>
              <Card title="学习曲线" className="h-full">
                <div className="h-80">
                  <LearningChart data={curveData} />
                </div>
              </Card>
            </Col>

            {/* Recent Skills */}
            <Col xs={24} lg={8}>
              <Card
                title="最近学习技能"
                extra={<a onClick={() => setActiveTab('skills')}>查看全部</a>}
                className="h-full"
              >
                <List
                  dataSource={skills.slice(0, 5)}
                  renderItem={(skill) => {
                    const levelInfo = getLevelInfo(skill.level);
                    return (
                      <List.Item
                        className="cursor-pointer hover:bg-gray-50 rounded px-2"
                        onClick={() => setSelectedSkillId(skill.id)}
                      >
                        <List.Item.Meta
                          title={skill.name}
                          description={
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>等级 {skill.level}</span>
                                <span style={{ color: levelInfo.color }}>{levelInfo.label}</span>
                              </div>
                              <Progress
                                percent={Math.round((skill.currentExp / skill.requiredExp) * 100)}
                                size="small"
                                strokeColor={levelInfo.color}
                                showInfo={false}
                              />
                            </div>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </Card>
            </Col>

            {/* Learning Goals */}
            <Col xs={24}>
              <Card
                title="学习目标"
                extra={
                  <Button type="link" onClick={() => setIsGoalModalOpen(true)}>
                    添加目标
                  </Button>
                }
              >
                <Row gutter={[16, 16]}>
                  {goals.slice(0, 4).map((goal) => (
                    <Col xs={24} sm={12} lg={6} key={goal.id}>
                      <Card size="small" className="bg-gray-50">
                        <div className="font-medium mb-2">{goal.title}</div>
                        <div className="text-xs text-gray-400 mb-3">{goal.description}</div>
                        <Progress percent={goal.progress} size="small" />
                        <div className="flex justify-between mt-2 text-xs">
                          <Tag color={goal.status === 'completed' ? 'success' : 'processing'}>
                            {goal.status === 'completed' ? '已完成' : '进行中'}
                          </Tag>
                          {goal.deadline && (
                            <span className="text-gray-400">截止: {goal.deadline}</span>
                          )}
                        </div>
                      </Card>
                    </Col>
                  ))}
                  {goals.length === 0 && (
                    <Col xs={24}>
                      <div className="text-center py-8 text-gray-400">
                        暂无学习目标，点击"添加目标"开始规划
                      </div>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="技能树" key="skills">
          <SkillTree
            skills={skills}
            selectedSkillId={selectedSkillId}
            onSelect={setSelectedSkillId}
          />
        </TabPane>

        <TabPane tab="目标" key="goals">
          <GoalList goals={goals} />
        </TabPane>

        <TabPane tab="记录" key="records">
          <Card title="学习记录">
            <List
              dataSource={records.slice(0, 20)}
              renderItem={(record) => (
                <List.Item
                  actions={[
                    <span key="time">{formatDuration(record.duration)}</span>,
                    <span key="date">{record.date}</span>,
                  ]}
                >
                  <List.Item.Meta
                    title={record.skillName}
                    description={record.notes}
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Modals */}
      <AddSkillModal open={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} />
      <AddGoalModal open={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} />
      <AddRecordModal open={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} />
    </div>
  );
}
