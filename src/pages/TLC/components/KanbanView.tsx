import { useState } from 'react';
import { Card, Badge, Avatar, Tag, Dropdown, Space, Tooltip } from 'antd';
import {
  MoreOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  PaperClipOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useTaskStore } from '@/stores';
import { TASK_COLUMNS } from '@/utils/constants';
import { getPriorityColor, getStatusColor, formatDate, isOverdue } from '@/utils/helpers';
import type { Task, Status } from '@/types';

interface KanbanViewProps {
  tasks: Task[];
  onEdit: (taskId: string) => void;
}

export default function KanbanView({ tasks, onEdit }: KanbanViewProps) {
  const { moveTask, deleteTask, toggleTaskSelection, selectedTaskIds, setDraggingTaskId } =
    useTaskStore();
  const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);

  const tasksByStatus = TASK_COLUMNS.reduce((acc, column) => {
    acc[column.id] = tasks.filter((t) => t.status === column.id);
    return acc;
  }, {} as Record<Status, Task[]>);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggingTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, status);
    }
    setDragOverColumn(null);
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: '低',
      medium: '中',
      high: '高',
      urgent: '紧急',
    };
    return labels[priority] || priority;
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-2">
      {TASK_COLUMNS.map((column) => (
        <div
          key={column.id}
          className={`flex-shrink-0 w-72 flex flex-col rounded-lg transition-colors ${
            dragOverColumn === column.id ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-50'
          }`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDrop={(e) => handleDrop(e, column.id)}
          onDragLeave={() => setDragOverColumn(null)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              <span className="font-medium">{column.title}</span>
              <Badge count={tasksByStatus[column.id]?.length || 0} className="ml-1" />
            </div>
            <Dropdown
              menu={{
                items: [
                  { key: 'add', label: '添加任务' },
                  { key: 'sort', label: '排序' },
                ],
              }}
            >
              <MoreOutlined className="cursor-pointer text-gray-400 hover:text-gray-600" />
            </Dropdown>
          </div>

          {/* Task List */}
          <div className="flex-1 p-2 space-y-2 overflow-y-auto">
            {tasksByStatus[column.id]?.map((task) => (
              <Card
                key={task.id}
                size="small"
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedTaskIds.includes(task.id) ? 'ring-2 ring-blue-400' : ''
                }`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', task.id);
                  handleDragStart(e, task.id);
                }}
                onDragEnd={handleDragEnd}
                onClick={() => onEdit(task.id)}
                bodyStyle={{ padding: 12 }}
              >
                {/* Priority Indicator */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                />

                <div className="pl-2">
                  {/* Title */}
                  <div className="font-medium mb-2 line-clamp-2">{task.title}</div>

                  {/* Tags */}
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.tags.slice(0, 3).map((tag) => (
                        <Tag key={tag} className="text-xs">
                          {tag}
                        </Tag>
                      ))}
                      {task.tags.length > 3 && (
                        <Tag className="text-xs">
                          +{task.tags.length - 3}
                        </Tag>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <Space>
                      {task.dueDate && (
                        <Tooltip title="截止日期">
                          <span className={isOverdue(task.dueDate) ? 'text-red-500' : ''}>
                            <ClockCircleOutlined className="mr-1" />
                            {formatDate(task.dueDate, 'MM-DD')}
                          </span>
                        </Tooltip>
                      )}
                      {task.comments && task.comments.length > 0 && (
                        <span>
                          <MessageOutlined className="mr-1" />
                          {task.comments.length}
                        </span>
                      )}
                      {task.attachments && task.attachments.length > 0 && (
                        <span>
                          <PaperClipOutlined className="mr-1" />
                          {task.attachments.length}
                        </span>
                      )}
                    </Space>

                    <Space>
                      {task.priority === 'urgent' && (
                        <ExclamationCircleOutlined className="text-red-500" />
                      )}
                      {task.assignee ? (
                        <Avatar size="small" src={task.assignee.avatar}>
                          {task.assignee.name[0]}
                        </Avatar>
                      ) : (
                        <Avatar size="small" className="bg-gray-200">
                          ?
                        </Avatar>
                      )}
                    </Space>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
