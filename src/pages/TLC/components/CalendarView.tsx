import { useState, useMemo } from 'react';
import { Calendar, Badge, Card, Tooltip } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { getStatusColor, getPriorityColor } from '@/utils/helpers';
import type { Task } from '@/types';

interface CalendarViewProps {
  tasks: Task[];
  onEdit: (taskId: string) => void;
}

export default function CalendarView({ tasks, onEdit }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((task) => {
      const date = task.dueDate || task.startDate;
      if (date) {
        const key = dayjs(date).format('YYYY-MM-DD');
        if (!map[key]) map[key] = [];
        map[key].push(task);
      }
    });
    return map;
  }, [tasks]);

  const dateCellRender = (value: Dayjs) => {
    const dateKey = value.format('YYYY-MM-DD');
    const dayTasks = tasksByDate[dateKey] || [];

    return (
      <ul className="list-none p-0 m-0">
        {dayTasks.slice(0, 3).map((task) => (
          <li
            key={task.id}
            className="text-xs truncate cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5"
            onClick={() => onEdit(task.id)}
          >
            <Badge
              color={getPriorityColor(task.priority)}
              text={task.title}
              className="text-xs"
            />
          </li>
        ))}
        {dayTasks.length > 3 && (
          <li className="text-xs text-gray-400 px-1">+{dayTasks.length - 3} 更多</li>
        )}
      </ul>
    );
  };

  const selectedDateTasks = tasksByDate[selectedDate.format('YYYY-MM-DD')] || [];

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          cellRender={dateCellRender}
        />
      </div>
      <div className="w-80 flex-shrink-0">
        <Card
          title={`${selectedDate.format('MM月DD日')} 的任务`}
          size="small"
          className="h-full"
        >
          {selectedDateTasks.length > 0 ? (
            <div className="space-y-2">
              {selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onEdit(task.id)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    />
                    <div className="font-medium text-sm truncate">{task.title}</div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {task.assignee?.name || '未分配'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              该日期暂无任务
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
