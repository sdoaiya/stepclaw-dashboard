import { useMemo } from 'react';
import { Timeline, Tooltip, Badge } from 'antd';
import { getStatusColor, getPriorityColor, formatDate } from '@/utils/helpers';
import type { Task } from '@/types';

interface GanttViewProps {
  tasks: Task[];
}

export default function GanttView({ tasks }: GanttViewProps) {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const dateA = a.startDate || a.createdAt;
      const dateB = b.startDate || b.createdAt;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
  }, [tasks]);

  const getDuration = (task: Task) => {
    if (!task.startDate || !task.dueDate) return null;
    const start = new Date(task.startDate);
    const end = new Date(task.dueDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="h-full overflow-auto p-4">
      <div className="space-y-4">
        {sortedTasks.map((task) => {
          const duration = getDuration(task);
          return (
            <div
              key={task.id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
            >
              {/* Task Info */}
              <div className="w-64 flex-shrink-0">
                <div className="font-medium flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  />
                  {task.title}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {task.assignee?.name || '未分配'}
                </div>
              </div>

              {/* Timeline Bar */}
              <div className="flex-1 relative h-8 bg-gray-100 rounded-full overflow-hidden">
                {task.startDate && task.dueDate && (
                  <Tooltip
                    title={`${formatDate(task.startDate)} - ${formatDate(task.dueDate)}${
                      duration ? ` (${duration}天)` : ''
                    }`}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        backgroundColor: getStatusColor(task.status),
                        opacity: 0.8,
                      }}
                    />
                  </Tooltip>
                )}
                {!task.startDate && !task.dueDate && (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    未设置时间
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="w-24 text-right">
                <Badge
                  color={getStatusColor(task.status)}
                  text={task.status === 'todo' ? '待办' : task.status === 'in_progress' ? '进行中' : task.status === 'review' ? '审核中' : task.status === 'done' ? '已完成' : '已归档'}
                />
              </div>
            </div>
          );
        })}
      </div>

      {sortedTasks.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          暂无任务数据
        </div>
      )}
    </div>
  );
}
