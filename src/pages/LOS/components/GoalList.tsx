import { Card, Progress, Tag, Button, List, Empty, Space } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { useLearningStore } from '@/stores';
import type { LearningGoal } from '@/types';

interface GoalListProps {
  goals: LearningGoal[];
}

export default function GoalList({ goals }: GoalListProps) {
  const { updateGoal, deleteGoal } = useLearningStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'paused':
        return <PauseCircleOutlined className="text-orange-500" />;
      default:
        return <ClockCircleOutlined className="text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'paused':
        return 'warning';
      default:
        return 'processing';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'paused':
        return '已暂停';
      default:
        return '进行中';
    }
  };

  return (
    <Card>
      {goals.length > 0 ? (
        <List
          dataSource={goals}
          renderItem={(goal) => (
            <List.Item
              actions={[
                <Button
                  key="edit"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => {
                    // TODO: Open edit modal
                  }}
                />,
                <Button
                  key="delete"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deleteGoal(goal.id)}
                />,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    {getStatusIcon(goal.status)}
                    <span>{goal.title}</span>
                    <Tag color={getStatusColor(goal.status)}>
                      {getStatusLabel(goal.status)}
                    </Tag>
                  </Space>
                }
                description={
                  <div className="mt-2">
                    <div className="text-gray-500 mb-2">{goal.description}</div>
                    <Progress percent={goal.progress} size="small" />
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>目标技能: {goal.targetSkills.length} 个</span>
                      {goal.deadline && <span>截止: {goal.deadline}</span>}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="暂无学习目标" />
      )}
    </Card>
  );
}
