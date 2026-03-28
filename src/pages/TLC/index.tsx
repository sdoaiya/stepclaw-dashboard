import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button, Input, Select, Badge, Tabs, Dropdown, Space, Tooltip } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ScheduleOutlined,
  CalendarOutlined,
  MoreOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import { useTaskStore } from '@/stores';
import { TASK_COLUMNS, VIEW_MODES, PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/utils/constants';
import { getStatusColor, getPriorityColor } from '@/utils/helpers';
import type { ViewMode, Status, TaskFilter } from '@/types';
import KanbanView from './components/KanbanView';
import ListView from './components/ListView';
import GanttView from './components/GanttView';
import CalendarView from './components/CalendarView';
import TaskModal from './components/TaskModal';
import TaskStats from './components/TaskStats';

const { Search } = Input;

export default function TLCPage() {
  const navigate = useNavigate();
  const {
    tasks,
    viewMode,
    setViewMode,
    filter,
    setFilter,
    clearFilter,
    searchQuery,
    setSearchQuery,
    selectedTaskIds,
    clearSelection,
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  // 过滤任务
  const filteredTasks = tasks.filter((task) => {
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchSearch =
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags.some((tag) => tag.toLowerCase().includes(query));
      if (!matchSearch) return false;
    }

    // 状态过滤
    if (filter.status?.length && !filter.status.includes(task.status)) return false;

    // 优先级过滤
    if (filter.priority?.length && !filter.priority.includes(task.priority)) return false;

    // 负责人过滤
    if (filter.assignee?.length && !filter.assignee.includes(task.assignee?.id || ''))
      return false;

    // 标签过滤
    if (filter.tags?.length && !filter.tags.some((tag) => task.tags.includes(tag))) return false;

    // 日期范围过滤
    if (filter.dateRange) {
      const [start, end] = filter.dateRange;
      if (task.dueDate && (task.dueDate < start || task.dueDate > end)) return false;
    }

    return true;
  });

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTask(taskId);
    setIsModalOpen(true);
  };

  const viewModeIcons = {
    kanban: <AppstoreOutlined />,
    list: <UnorderedListOutlined />,
    gantt: <ScheduleOutlined />,
    calendar: <CalendarOutlined />,
  };

  const hasActiveFilter =
    filter.status?.length ||
    filter.priority?.length ||
    filter.assignee?.length ||
    filter.tags?.length ||
    filter.dateRange;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">任务看板</h1>
          <p className="text-gray-400 text-sm">Task Lifecycle Controller</p>
        </div>
        <Space>
          <Button icon={<SortAscendingOutlined />}>排序</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTask}>
            新建任务
          </Button>
        </Space>
      </div>

      {/* Stats */}
      <TaskStats />

      {/* Toolbar */}
      <div className="flex items-center justify-between my-4 py-4 border-y border-gray-100">
        <Space>
          <Search
            placeholder="搜索任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <Dropdown
            menu={{
              items: STATUS_OPTIONS.map((s) => ({
                key: s.value,
                label: (
                  <div className="flex items-center gap-2">
                    <Badge color={s.color} />
                    {s.label}
                  </div>
                ),
                onClick: () => {
                  const current = filter.status || [];
                  const updated = current.includes(s.value as Status)
                    ? current.filter((x) => x !== s.value)
                    : [...current, s.value as Status];
                  setFilter({ ...filter, status: updated });
                },
              })),
            }}
          >
            <Button icon={<FilterOutlined />}>
              状态
              {filter.status && filter.status.length > 0 && (
                <Badge count={filter.status.length} className="ml-1" />
              )}
            </Button>
          </Dropdown>
          <Dropdown
            menu={{
              items: PRIORITY_OPTIONS.map((p) => ({
                key: p.value,
                label: (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    {p.label}
                  </div>
                ),
                onClick: () => {
                  const current = filter.priority || [];
                  const updated = current.includes(p.value as any)
                    ? current.filter((x) => x !== p.value)
                    : [...current, p.value as any];
                  setFilter({ ...filter, priority: updated });
                },
              })),
            }}
          >
            <Button>
              优先级
              {filter.priority && filter.priority.length > 0 && (
                <Badge count={filter.priority.length} className="ml-1" />
              )}
            </Button>
          </Dropdown>
          {hasActiveFilter && (
            <Button type="link" onClick={clearFilter}>
              清除筛选
            </Button>
          )}
        </Space>

        <Space>
          {selectedTaskIds.length > 0 && (
            <span className="text-gray-500">已选择 {selectedTaskIds.length} 项</span>
          )}
          <Select
            value={viewMode}
            onChange={(v) => setViewMode(v as ViewMode)}
            options={VIEW_MODES.map((v) => ({
              value: v.value,
              label: (
                <Space>
                  {v.value === 'kanban' && <AppstoreOutlined />}
                  {v.value === 'list' && <UnorderedListOutlined />}
                  {v.value === 'gantt' && <ScheduleOutlined />}
                  {v.value === 'calendar' && <CalendarOutlined />}
                  {v.label}
                </Space>
              ),
            }))}
            style={{ width: 140 }}
          />
        </Space>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'kanban' && (
          <KanbanView tasks={filteredTasks} onEdit={handleEditTask} />
        )}
        {viewMode === 'list' && <ListView tasks={filteredTasks} onEdit={handleEditTask} />}
        {viewMode === 'gantt' && <GanttView tasks={filteredTasks} />}
        {viewMode === 'calendar' && <CalendarView tasks={filteredTasks} onEdit={handleEditTask} />}
      </div>

      {/* Task Modal */}
      <TaskModal
        open={isModalOpen}
        taskId={editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
      />
    </div>
  );
}
