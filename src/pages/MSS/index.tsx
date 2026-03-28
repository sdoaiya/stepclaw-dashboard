import { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Card, Badge, Button, Switch, Space } from 'antd';
import {
  DashboardOutlined,
  ReloadOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useMonitorStore } from '@/stores';
import MetricCard from './components/MetricCard';
import MetricChart from './components/MetricChart';
import AlertList from './components/AlertList';
import ServiceStatusList from './components/ServiceStatusList';
import type { Metric, ServiceStatus } from '@/types';

// Mock data generators
const generateMockMetrics = (): Metric[] => [
  {
    id: 'cpu',
    name: 'CPU 使用率',
    value: 45,
    unit: '%',
    status: 'normal',
    threshold: { warning: 70, critical: 90 },
    history: Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 60000).toISOString(),
      value: 40 + Math.random() * 20,
    })),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'memory',
    name: '内存使用率',
    value: 62,
    unit: '%',
    status: 'normal',
    threshold: { warning: 80, critical: 95 },
    history: Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 60000).toISOString(),
      value: 55 + Math.random() * 15,
    })),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'disk',
    name: '磁盘使用率',
    value: 78,
    unit: '%',
    status: 'warning',
    threshold: { warning: 80, critical: 90 },
    history: Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 60000).toISOString(),
      value: 75 + Math.random() * 5,
    })),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'responseTime',
    name: '响应时间',
    value: 245,
    unit: 'ms',
    status: 'normal',
    threshold: { warning: 500, critical: 1000 },
    history: Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 60000).toISOString(),
      value: 200 + Math.random() * 100,
    })),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'errorRate',
    name: '错误率',
    value: 0.5,
    unit: '%',
    status: 'normal',
    threshold: { warning: 5, critical: 10 },
    history: Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 60000).toISOString(),
      value: Math.random() * 2,
    })),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'requests',
    name: '请求量',
    value: 1250,
    unit: 'req/min',
    status: 'normal',
    history: Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 60000).toISOString(),
      value: 1000 + Math.random() * 500,
    })),
    updatedAt: new Date().toISOString(),
  },
];

const generateMockServices = (): ServiceStatus[] => [
  { id: 'api', name: 'API 服务', status: 'up', uptime: 99.9, responseTime: 45, lastChecked: new Date().toISOString() },
  { id: 'web', name: 'Web 服务', status: 'up', uptime: 99.8, responseTime: 120, lastChecked: new Date().toISOString() },
  { id: 'db', name: '数据库', status: 'up', uptime: 99.99, responseTime: 15, lastChecked: new Date().toISOString() },
  { id: 'cache', name: '缓存服务', status: 'up', uptime: 99.95, responseTime: 5, lastChecked: new Date().toISOString() },
  { id: 'queue', name: '消息队列', status: 'degraded', uptime: 98.5, responseTime: 250, lastChecked: new Date().toISOString() },
];

export default function MSSPage() {
  const {
    metrics,
    setMetrics,
    alerts,
    setAlerts,
    systemStatus,
    setSystemStatus,
    autoRefresh,
    setAutoRefresh,
    getAlertStats,
    getMetricStats,
  } = useMonitorStore();

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const metricsRef = useRef(metrics);

  // Keep metrics ref in sync
  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  // Initialize mock data - only run once
  useEffect(() => {
    if (metrics.length === 0) {
      setMetrics(generateMockMetrics());
      setSystemStatus({
        overall: 'healthy',
        services: generateMockServices(),
        lastUpdated: new Date().toISOString(),
      });
    }
  }, []);

  // Auto refresh - fixed memory leak
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!autoRefresh) return;

    intervalRef.current = setInterval(() => {
      // Use ref to access latest metrics without adding to dependency array
      const currentMetrics = metricsRef.current;
      // Simulate metric updates
      setMetrics(
        currentMetrics.map((m) => ({
          ...m,
          value: Math.max(0, m.value + (Math.random() - 0.5) * 5),
          history: [
            ...m.history.slice(1),
            { timestamp: new Date().toISOString(), value: m.value },
          ],
        }))
      );
      setLastUpdated(new Date());
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, setMetrics]);

  const alertStats = getAlertStats();
  const metricStats = getMetricStats();

  const handleRefresh = useCallback(() => {
    setMetrics(generateMockMetrics());
    setLastUpdated(new Date());
  }, [setMetrics]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">监控面板</h1>
          <p className="text-gray-400 text-sm">Monitoring & Status System</p>
        </div>
        <Space>
          <span className="text-gray-400 text-sm">
            最后更新: {lastUpdated.toLocaleTimeString()}
          </span>
          <Switch
            checked={autoRefresh}
            onChange={setAutoRefresh}
            checkedChildren="自动刷新"
            unCheckedChildren="手动刷新"
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>
        </Space>
      </div>

      {/* System Status */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                systemStatus.overall === 'healthy'
                  ? 'bg-green-100 text-green-500'
                  : systemStatus.overall === 'degraded'
                  ? 'bg-yellow-100 text-yellow-500'
                  : 'bg-red-100 text-red-500'
              }`}
            >
              <DashboardOutlined />
            </div>
            <div>
              <div className="text-lg font-medium">
                系统状态:
                <span
                  className={`ml-2 ${
                    systemStatus.overall === 'healthy'
                      ? 'text-green-500'
                      : systemStatus.overall === 'degraded'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }`}
                >
                  {systemStatus.overall === 'healthy'
                    ? '运行正常'
                    : systemStatus.overall === 'degraded'
                    ? '性能下降'
                    : '系统故障'}
                </span>
              </div>
              <div className="text-gray-400 text-sm">
                {systemStatus.services.filter((s) => s.status === 'up').length} /{' '}
                {systemStatus.services.length} 个服务正常运行
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{metricStats.normal}</div>
              <div className="text-gray-400 text-sm">正常指标</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{metricStats.warning}</div>
              <div className="text-gray-400 text-sm">警告指标</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{metricStats.critical}</div>
              <div className="text-gray-400 text-sm">严重指标</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <Row gutter={[16, 16]} className="mb-6">
        {metrics.map((metric) => (
          <Col xs={24} sm={12} lg={8} key={metric.id}>
            <MetricCard
              metric={metric}
              selected={selectedMetric === metric.id}
              onClick={() => setSelectedMetric(metric.id)}
            />
          </Col>
        ))}
      </Row>

      {/* Charts & Alerts */}
      <Row gutter={[16, 16]}>
        {/* Metric Chart */}
        <Col xs={24} lg={16}>
          <Card
            title="指标趋势"
            className="h-full"
            extra={
              selectedMetric && (
                <Button type="link" onClick={() => setSelectedMetric(null)}>
                  查看全部
                </Button>
              )
            }
          >
            <div className="h-80">
              <MetricChart
                metrics={selectedMetric ? metrics.filter((m) => m.id === selectedMetric) : metrics}
              />
            </div>
          </Card>
        </Col>

        {/* Alerts */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <BellOutlined />
                告警
                {alertStats.active > 0 && (
                  <Badge count={alertStats.active} className="ml-2" />
                )}
              </div>
            }
            className="h-full"
          >
            <AlertList />
          </Card>
        </Col>
      </Row>

      {/* Service Status */}
      <Card title="服务状态" className="mt-6">
        <ServiceStatusList services={systemStatus.services} />
      </Card>
    </div>
  );
}
