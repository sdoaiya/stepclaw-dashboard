import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Calendar, Badge, List, Tag, Statistic, Empty, Tabs } from 'antd';
import {
  PlusOutlined,
  FileTextOutlined,
  CalendarOutlined,
  PieChartOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useReportStore, useTaskStore } from '@/stores';
import { MOOD_OPTIONS } from '@/utils/constants';
import { formatDate, formatDuration } from '@/utils/helpers';
import ReportEditor from './components/ReportEditor';
import ReportDetail from './components/ReportDetail';
import ReportStats from './components/ReportStats';
import type { DailyReport } from '@/types';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

export default function DRSPage() {
  const navigate = useNavigate();
  const { reports, getReportStats } = useReportStore();
  const { tasks } = useTaskStore();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [activeTab, setActiveTab] = useState('list');

  const stats = getReportStats();

  // Get report for selected date
  const selectedDateReport = reports.find(
    (r) => r.date === selectedDate.format('YYYY-MM-DD')
  );

  // Calendar cell render
  const dateCellRender = (value: dayjs.Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const report = reports.find((r) => r.date === dateStr);

    if (!report) return null;

    return (
      <div className="mt-1">
        <Badge
          status={report.mood === 'great' || report.mood === 'good' ? 'success' : 'default'}
          text={
            <span className="text-xs truncate block">
              {report.completedTasks.length} 完成
            </span>
          }
        />
      </div>
    );
  };

  const handleCreateReport = () => {
    navigate('/drs/new');
  };

  const handleEditReport = (reportId: string) => {
    navigate(`/drs/edit/${reportId}`);
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/drs/view/${reportId}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">日报系统</h1>
          <p className="text-gray-400 text-sm">Daily Report System</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateReport}>
          写日报
        </Button>
      </div>

      {/* Stats */}
      <ReportStats />

      {/* Main Content */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="日报列表" key="list">
          <Row gutter={[16, 16]}>
            {/* Report List */}
            <Col xs={24} lg={16}>
              <Card title="最近日报">
                {reports.length > 0 ? (
                  <List
                    dataSource={reports.slice(0, 10)}
                    renderItem={(report) => (
                      <List.Item
                        actions={[
                          <Button
                            key="view"
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewReport(report.id)}
                          >
                            查看
                          </Button>,
                          <Button
                            key="edit"
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditReport(report.id)}
                          >
                            编辑
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <div className="flex items-center gap-2">
                              <span>{report.date}</span>
                              {report.mood && (
                                <Tag color={MOOD_OPTIONS.find((m) => m.value === report.mood)?.color}>
                                  {MOOD_OPTIONS.find((m) => m.value === report.mood)?.emoji}
                                </Tag>
                              )}
                            </div>
                          }
                          description={
                            <div className="mt-1">
                              <div className="text-gray-500 line-clamp-1">{report.summary}</div>
                              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                <span>完成: {report.completedTasks.length}</span>
                                <span>待办: {report.pendingTasks.length}</span>
                                <span>工时: {formatDuration(report.metrics.totalWorkTime)}</span>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="暂无日报，点击右上角写日报开始记录" />
                )}
              </Card>
            </Col>

            {/* Calendar */}
            <Col xs={24} lg={8}>
              <Card title="日历">
                <Calendar
                  fullscreen={false}
                  value={selectedDate}
                  onSelect={setSelectedDate}
                  dateCellRender={dateCellRender}
                />
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium mb-2">
                    {selectedDate.format('YYYY年MM月DD日')}
                  </div>
                  {selectedDateReport ? (
                    <div>
                      <div className="text-sm text-gray-500 mb-2">
                        {selectedDateReport.summary}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewReport(selectedDateReport.id)}
                        >
                          查看
                        </Button>
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEditReport(selectedDateReport.id)}
                        >
                          编辑
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">
                      该日期暂无日报
                      <Button
                        type="link"
                        size="small"
                        onClick={handleCreateReport}
                      >
                        立即创建
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="统计" key="stats">
          <Card title="日报统计">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="总日报数"
                  value={stats.totalReports}
                  prefix={<FileTextOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="平均完成任务"
                  value={stats.avgTasksCompleted.toFixed(1)}
                  suffix="个"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="总工作时长"
                  value={formatDuration(stats.totalWorkTime)}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="平均工作时长"
                  value={formatDuration(stats.avgWorkTime)}
                />
              </Col>
            </Row>

            {/* Mood Distribution */}
            <div className="mt-6">
              <h4 className="font-medium mb-4">心情分布</h4>
              <div className="flex gap-4 flex-wrap">
                {Object.entries(stats.moodDistribution).map(([mood, count]) => {
                  const moodInfo = MOOD_OPTIONS.find((m) => m.value === mood);
                  return (
                    <div
                      key={mood}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-2xl">{moodInfo?.emoji}</span>
                      <div>
                        <div className="font-medium">{moodInfo?.label}</div>
                        <div className="text-xs text-gray-400">{count} 次</div>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(stats.moodDistribution).length === 0 && (
                  <span className="text-gray-400">暂无心情记录</span>
                )}
              </div>
            </div>
          </Card>
        </TabPane>

        <TabPane tab="模板" key="templates">
          <Card title="报告模板">
            <Empty description="模板管理功能开发中" />
          </Card>
        </TabPane>
      </Tabs>

      {/* Routes for editor and detail */}
      <Routes>
        <Route path="new" element={<ReportEditor />} />
        <Route path="edit/:id" element={<ReportEditor />} />
        <Route path="view/:id" element={<ReportDetail />} />
      </Routes>
    </div>
  );
}
