// ==================== 通用类型 ====================

export type ViewMode = 'kanban' | 'list' | 'gantt' | 'calendar';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Status = 'todo' | 'in_progress' | 'review' | 'done' | 'archived';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  role: string;
  department?: string;
}

// ==================== TLC - 任务看板类型 ====================

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  assignee?: User;
  creator: User;
  tags: string[];
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  parentId?: string;
  subtasks?: Task[];
  attachments?: Attachment[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskColumn {
  id: Status;
  title: string;
  tasks: Task[];
}

export interface TaskFilter {
  status?: Status[];
  priority?: Priority[];
  assignee?: string[];
  tags?: string[];
  dateRange?: [string, string];
  search?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt?: string;
}

// ==================== LOS - 学习曲线类型 ====================

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 1-5
  maxLevel: number;
  currentExp: number;
  requiredExp: number;
  description?: string;
  prerequisites?: string[];
  children?: Skill[];
  learnedAt?: string;
  lastPracticedAt?: string;
  practiceCount: number;
}

export interface LearningGoal {
  id: string;
  title: string;
  description?: string;
  targetSkills: string[];
  deadline?: string;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface LearningRecord {
  id: string;
  skillId: string;
  skillName: string;
  duration: number; // 分钟
  date: string;
  notes?: string;
  score?: number;
}

export interface LearningCurveData {
  date: string;
  totalExp: number;
  newSkills: number;
  practiceTime: number;
}

// ==================== MSS - 监控面板类型 ====================

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  threshold?: {
    warning: number;
    critical: number;
  };
  history: MetricPoint[];
  updatedAt: string;
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface Alert {
  id: string;
  metricId: string;
  metricName: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  value: number;
  threshold: number;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface SystemStatus {
  overall: 'healthy' | 'degraded' | 'down';
  services: ServiceStatus[];
  lastUpdated: string;
}

export interface ServiceStatus {
  id: string;
  name: string;
  status: 'up' | 'down' | 'degraded';
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

// ==================== DRS - 日报类型 ====================

export interface DailyReport {
  id: string;
  date: string;
  userId: string;
  userName: string;
  summary: string;
  completedTasks: ReportTask[];
  pendingTasks: ReportTask[];
  blockers?: string;
  tomorrowPlan: string;
  metrics: ReportMetrics;
  mood?: 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
  createdAt: string;
  updatedAt?: string;
}

export interface ReportTask {
  taskId: string;
  title: string;
  status: Status;
  progress: number;
  timeSpent: number;
}

export interface ReportMetrics {
  tasksCompleted: number;
  tasksCreated: number;
  totalWorkTime: number; // 分钟
  focusTime: number;
  meetingTime: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  sections: ReportSection[];
  isDefault: boolean;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'text' | 'list' | 'tasks' | 'metrics';
  required: boolean;
  order: number;
}

// ==================== 图表类型 ====================

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  color?: string;
}

// ==================== API 响应类型 ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
