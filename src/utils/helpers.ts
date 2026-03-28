import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Priority, Status } from '@/types';

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

// ==================== 日期工具 ====================

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

export const getRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

export const isOverdue = (dueDate?: string): boolean => {
  if (!dueDate) return false;
  return dayjs(dueDate).isBefore(dayjs(), 'day');
};

export const getDaysRemaining = (dueDate?: string): number => {
  if (!dueDate) return Infinity;
  return dayjs(dueDate).diff(dayjs(), 'day');
};

// ==================== 颜色/样式工具 ====================

export const getPriorityColor = (priority: Priority): string => {
  const colors: Record<Priority, string> = {
    low: '#52c41a',
    medium: '#faad14',
    high: '#fa8c16',
    urgent: '#f5222d',
  };
  return colors[priority];
};

export const getPriorityLabel = (priority: Priority): string => {
  const labels: Record<Priority, string> = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急',
  };
  return labels[priority];
};

export const getStatusColor = (status: Status): string => {
  const colors: Record<Status, string> = {
    todo: '#d9d9d9',
    in_progress: '#1890ff',
    review: '#722ed1',
    done: '#52c41a',
    archived: '#8c8c8c',
  };
  return colors[status];
};

export const getStatusLabel = (status: Status): string => {
  const labels: Record<Status, string> = {
    todo: '待办',
    in_progress: '进行中',
    review: '审核中',
    done: '已完成',
    archived: '已归档',
  };
  return labels[status];
};

// ==================== 数值工具 ====================

export const formatNumber = (num: number, decimals = 0): string => {
  return num.toFixed(decimals);
};

export const formatPercent = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}小时`;
  return `${hours}小时${mins}分钟`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

// ==================== 数组/对象工具 ====================

export const groupBy = <T, K extends keyof any>(arr: T[], key: (item: T) => K): Record<K, T[]> => {
  return arr.reduce((result, item) => {
    const groupKey = key(item);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<K, T[]>);
};

export const sortBy = <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const uniqueBy = <T, K extends keyof T>(arr: T[], key: K): T[] => {
  const seen = new Set<T[K]>();
  return arr.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
};

// ==================== 生成器工具 ====================

export const generateId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// ==================== 验证工具 ====================

export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ==================== 防抖/节流 ====================

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
