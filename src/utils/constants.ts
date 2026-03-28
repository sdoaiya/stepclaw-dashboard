// ==================== 优先级配置 ====================

export const PRIORITY_OPTIONS = [
  { value: 'low', label: '低', color: '#52c41a' },
  { value: 'medium', label: '中', color: '#faad14' },
  { value: 'high', label: '高', color: '#fa8c16' },
  { value: 'urgent', label: '紧急', color: '#f5222d' },
] as const;

// ==================== 状态配置 ====================

export const STATUS_OPTIONS = [
  { value: 'todo', label: '待办', color: '#d9d9d9' },
  { value: 'in_progress', label: '进行中', color: '#1890ff' },
  { value: 'review', label: '审核中', color: '#722ed1' },
  { value: 'done', label: '已完成', color: '#52c41a' },
  { value: 'archived', label: '已归档', color: '#8c8c8c' },
] as const;

// ==================== 任务看板列配置 ====================

export const TASK_COLUMNS = [
  { id: 'todo', title: '待办', color: '#d9d9d9' },
  { id: 'in_progress', title: '进行中', color: '#1890ff' },
  { id: 'review', title: '审核中', color: '#722ed1' },
  { id: 'done', title: '已完成', color: '#52c41a' },
] as const;

// ==================== 视图模式配置 ====================

export const VIEW_MODES = [
  { value: 'kanban', label: '看板视图', icon: 'AppstoreOutlined' },
  { value: 'list', label: '列表视图', icon: 'UnorderedListOutlined' },
  { value: 'gantt', label: '甘特图', icon: 'ScheduleOutlined' },
  { value: 'calendar', label: '日历视图', icon: 'CalendarOutlined' },
] as const;

// ==================== 技能等级配置 ====================

export const SKILL_LEVELS = [
  { level: 1, label: '入门', color: '#d9d9d9', minExp: 0 },
  { level: 2, label: '初级', color: '#95de64', minExp: 100 },
  { level: 3, label: '中级', color: '#69c0ff', minExp: 300 },
  { level: 4, label: '高级', color: '#ffd666', minExp: 600 },
  { level: 5, label: '专家', color: '#ff7875', minExp: 1000 },
] as const;

// ==================== 监控指标阈值配置 ====================

export const METRIC_THRESHOLDS = {
  cpu: { warning: 70, critical: 90 },
  memory: { warning: 80, critical: 95 },
  disk: { warning: 80, critical: 90 },
  responseTime: { warning: 500, critical: 1000 },
  errorRate: { warning: 5, critical: 10 },
} as const;

// ==================== 日报心情选项 ====================

export const MOOD_OPTIONS = [
  { value: 'great', label: '超棒', emoji: '😄', color: '#52c41a' },
  { value: 'good', label: '不错', emoji: '🙂', color: '#95de64' },
  { value: 'neutral', label: '一般', emoji: '😐', color: '#d9d9d9' },
  { value: 'tired', label: '疲惫', emoji: '😴', color: '#ffd666' },
  { value: 'stressed', label: '压力大', emoji: '😰', color: '#ff7875' },
] as const;

// ==================== 图表颜色配置 ====================

export const CHART_COLORS = [
  '#1890ff',
  '#52c41a',
  '#faad14',
  '#f5222d',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
  '#fa541c',
] as const;

// ==================== 分页配置 ====================

export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

// ==================== 存储键名 ====================

export const STORAGE_KEYS = {
  user: 'lingma_user',
  settings: 'lingma_settings',
  theme: 'lingma_theme',
  recentViews: 'lingma_recent_views',
} as const;

// ==================== 路由配置 ====================

export const ROUTES = {
  home: '/',
  tlc: '/tlc',
  los: '/los',
  mss: '/mss',
  drs: '/drs',
  settings: '/settings',
} as const;

// ==================== API 配置 ====================

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  retryCount: 3,
} as const;

// ==================== 模块信息 ====================

export const MODULES = [
  {
    id: 'tlc',
    name: 'TLC',
    fullName: 'Task Lifecycle Controller',
    description: '任务看板 - 敏捷任务管理',
    icon: 'ProjectOutlined',
    color: '#1890ff',
    path: '/tlc',
  },
  {
    id: 'los',
    name: 'LOS',
    fullName: 'Learning Objective System',
    description: '学习曲线 - 技能成长追踪',
    icon: 'RiseOutlined',
    color: '#52c41a',
    path: '/los',
  },
  {
    id: 'mss',
    name: 'MSS',
    fullName: 'Monitoring & Status System',
    description: '监控面板 - 系统状态监控',
    icon: 'DashboardOutlined',
    color: '#faad14',
    path: '/mss',
  },
  {
    id: 'drs',
    name: 'DRS',
    fullName: 'Daily Report System',
    description: '日报模块 - 工作报告生成',
    icon: 'FileTextOutlined',
    color: '#722ed1',
    path: '/drs',
  },
] as const;
