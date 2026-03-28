import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskFilter, Status, ViewMode } from '@/types';
import { generateId } from '@/utils/helpers';

interface TaskState {
  // 任务数据
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Status) => void;

  // 筛选和搜索
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  clearFilter: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // 视图模式
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // 选中任务
  selectedTaskIds: string[];
  setSelectedTaskIds: (ids: string[]) => void;
  toggleTaskSelection: (id: string) => void;
  clearSelection: () => void;

  // 统计
  getTaskStats: () => TaskStats;

  // 拖拽状态
  draggingTaskId: string | null;
  setDraggingTaskId: (id: string | null) => void;
}

interface TaskStats {
  total: number;
  byStatus: Record<Status, number>;
  overdue: number;
  completedToday: number;
}

const initialFilter: TaskFilter = {};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        return newTask;
      },
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      moveTask: (taskId, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: newStatus,
                  completedDate: newStatus === 'done' ? new Date().toISOString() : task.completedDate,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      filter: initialFilter,
      setFilter: (filter) => set({ filter }),
      clearFilter: () => set({ filter: initialFilter, searchQuery: '' }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      viewMode: 'kanban',
      setViewMode: (mode) => set({ viewMode: mode }),

      selectedTaskIds: [],
      setSelectedTaskIds: (ids) => set({ selectedTaskIds: ids }),
      toggleTaskSelection: (id) =>
        set((state) => ({
          selectedTaskIds: state.selectedTaskIds.includes(id)
            ? state.selectedTaskIds.filter((taskId) => taskId !== id)
            : [...state.selectedTaskIds, id],
        })),
      clearSelection: () => set({ selectedTaskIds: [] }),

      getTaskStats: () => {
        const { tasks } = get();
        const today = new Date().toDateString();
        return {
          total: tasks.length,
          byStatus: {
            todo: tasks.filter((t) => t.status === 'todo').length,
            in_progress: tasks.filter((t) => t.status === 'in_progress').length,
            review: tasks.filter((t) => t.status === 'review').length,
            done: tasks.filter((t) => t.status === 'done').length,
            archived: tasks.filter((t) => t.status === 'archived').length,
          },
          overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length,
          completedToday: tasks.filter(
            (t) => t.completedDate && new Date(t.completedDate).toDateString() === today
          ).length,
        };
      },

      draggingTaskId: null,
      setDraggingTaskId: (id) => set({ draggingTaskId: id }),
    }),
    {
      name: 'lingma-task-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        viewMode: state.viewMode,
        filter: state.filter,
      }),
    }
  )
);
