import { create } from 'zustand';
import type { Metric, Alert, SystemStatus, ServiceStatus } from '@/types';
import { generateId } from '@/utils/helpers';

interface MonitorState {
  // 指标数据
  metrics: Metric[];
  setMetrics: (metrics: Metric[]) => void;
  updateMetric: (id: string, updates: Partial<Metric>) => void;
  addMetricPoint: (metricId: string, value: number) => void;

  // 告警数据
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => Alert;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  clearResolvedAlerts: () => void;

  // 系统状态
  systemStatus: SystemStatus;
  setSystemStatus: (status: SystemStatus) => void;
  updateServiceStatus: (serviceId: string, updates: Partial<ServiceStatus>) => void;

  // 自动刷新
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;

  // 选中的指标
  selectedMetricIds: string[];
  setSelectedMetricIds: (ids: string[]) => void;
  toggleMetricSelection: (id: string) => void;

  // 统计
  getAlertStats: () => AlertStats;
  getMetricStats: () => MetricStats;
}

interface AlertStats {
  total: number;
  active: number;
  warning: number;
  critical: number;
  acknowledged: number;
  resolved: number;
}

interface MetricStats {
  total: number;
  normal: number;
  warning: number;
  critical: number;
}

export const useMonitorStore = create<MonitorState>((set, get) => ({
  metrics: [],
  setMetrics: (metrics) => set({ metrics }),
  updateMetric: (id, updates) =>
    set((state) => ({
      metrics: state.metrics.map((metric) =>
        metric.id === id ? { ...metric, ...updates, updatedAt: new Date().toISOString() } : metric
      ),
    })),
  addMetricPoint: (metricId, value) =>
    set((state) => ({
      metrics: state.metrics.map((metric) => {
        if (metric.id !== metricId) return metric;
        const newPoint = { timestamp: new Date().toISOString(), value };
        const newHistory = [...metric.history, newPoint].slice(-100); // 保留最近100个点
        
        // 自动判断状态
        let newStatus = metric.status;
        if (metric.threshold) {
          if (value >= metric.threshold.critical) newStatus = 'critical';
          else if (value >= metric.threshold.warning) newStatus = 'warning';
          else newStatus = 'normal';
        }
        
        return {
          ...metric,
          value,
          status: newStatus,
          history: newHistory,
          updatedAt: new Date().toISOString(),
        };
      }),
    })),

  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alertData) => {
    const newAlert: Alert = {
      ...alertData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ alerts: [newAlert, ...state.alerts] }));
    return newAlert;
  },
  acknowledgeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id
          ? { ...alert, status: 'acknowledged', acknowledgedAt: new Date().toISOString() }
          : alert
      ),
    })),
  resolveAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id
          ? { ...alert, status: 'resolved', resolvedAt: new Date().toISOString() }
          : alert
      ),
    })),
  clearResolvedAlerts: () =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.status !== 'resolved'),
    })),

  systemStatus: {
    overall: 'healthy',
    services: [],
    lastUpdated: new Date().toISOString(),
  },
  setSystemStatus: (status) => set({ systemStatus: status }),
  updateServiceStatus: (serviceId, updates) =>
    set((state) => ({
      systemStatus: {
        ...state.systemStatus,
        services: state.systemStatus.services.map((service) =>
          service.id === serviceId ? { ...service, ...updates } : service
        ),
        lastUpdated: new Date().toISOString(),
      },
    })),

  autoRefresh: true,
  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
  refreshInterval: 5000,
  setRefreshInterval: (interval) => set({ refreshInterval: interval }),

  selectedMetricIds: [],
  setSelectedMetricIds: (ids) => set({ selectedMetricIds: ids }),
  toggleMetricSelection: (id) =>
    set((state) => ({
      selectedMetricIds: state.selectedMetricIds.includes(id)
        ? state.selectedMetricIds.filter((mid) => mid !== id)
        : [...state.selectedMetricIds, id],
    })),

  getAlertStats: () => {
    const { alerts } = get();
    return {
      total: alerts.length,
      active: alerts.filter((a) => a.status === 'active').length,
      warning: alerts.filter((a) => a.severity === 'warning').length,
      critical: alerts.filter((a) => a.severity === 'critical').length,
      acknowledged: alerts.filter((a) => a.status === 'acknowledged').length,
      resolved: alerts.filter((a) => a.status === 'resolved').length,
    };
  },

  getMetricStats: () => {
    const { metrics } = get();
    return {
      total: metrics.length,
      normal: metrics.filter((m) => m.status === 'normal').length,
      warning: metrics.filter((m) => m.status === 'warning').length,
      critical: metrics.filter((m) => m.status === 'critical').length,
    };
  },
}));
