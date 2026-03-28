import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, List, Divider, Space, message } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { useReportStore } from '@/stores';
import { MOOD_OPTIONS, STATUS_OPTIONS } from '@/utils/constants';
import { getStatusColor, formatDuration } from '@/utils/helpers';
import type { DailyReport } from '@/types';

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reports, exportReport } = useReportStore();

  const report = id ? reports.find((r) => r.id === id) : null;

  if (!report) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">日报不存在</div>
        <Button type="primary" className="mt-4" onClick={() => navigate('/drs')}>
          返回列表
        </Button>
      </div>
    );
  }

  const moodInfo = MOOD_OPTIONS.find((m) => m.value === report.mood);

  const handleExport = (format: 'markdown' | 'pdf' | 'html') => {
    if (id) {
      const content = exportReport(id, format);
      if (content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `日报-${report.date}.${format === 'markdown' ? 'md' : format}`;
        a.click();
        URL.revokeObjectURL(url);
        message.success('导出成功');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/drs')}>
            返回
          </Button>
          <h1 className="text-2xl font-semibold">日报详情</h1>
        </div>
        <Space>
          <Button icon={<PrinterOutlined />}>打印</Button>
          <Button icon={<DownloadOutlined />} onClick={() => handleExport('markdown')}>
            导出
          </Button>
          <Button icon={<ShareAltOutlined />}>分享</Button>
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/drs/edit/${id}`)}>
            编辑
          </Button>
        </Space>
      </div>

      {/* Report Content */}
      <Card>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold mb-2">{report.userName}的工作日报</h2>
          <div className="text-gray-400">{report.date}</div>
          {moodInfo && (
            <Tag color={moodInfo.color} className="mt-2">
              <span className="mr-1">{moodInfo.emoji}</span>
              {moodInfo.label}
            </Tag>
          )}
        </div>

        {/* Summary */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-gray-700">今日总结</h3>
          <div className="bg-gray-50 p-4 rounded-lg">{report.summary}</div>
        </div>

        {/* Completed Tasks */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-gray-700">
            已完成任务 ({report.completedTasks.length})
          </h3>
          {report.completedTasks.length > 0 ? (
            <List
              size="small"
              dataSource={report.completedTasks}
              renderItem={(task) => (
                <List.Item>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    />
                    <span className="line-through text-gray-500">{task.title}</span>
                    {task.timeSpent > 0 && (
                      <Tag>{formatDuration(task.timeSpent * 60)}</Tag>
                    )}
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div className="text-gray-400 text-sm">无</div>
          )}
        </div>

        {/* Pending Tasks */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-gray-700">
            待办任务 ({report.pendingTasks.length})
          </h3>
          {report.pendingTasks.length > 0 ? (
            <List
              size="small"
              dataSource={report.pendingTasks}
              renderItem={(task) => (
                <List.Item>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    />
                    <span>{task.title}</span>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div className="text-gray-400 text-sm">无</div>
          )}
        </div>

        {/* Blockers */}
        {report.blockers && (
          <div className="mb-6">
            <h3 className="font-medium mb-2 text-gray-700">遇到的问题</h3>
            <div className="bg-red-50 p-4 rounded-lg text-red-700">{report.blockers}</div>
          </div>
        )}

        {/* Tomorrow Plan */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-gray-700">明日计划</h3>
          <div className="bg-blue-50 p-4 rounded-lg">{report.tomorrowPlan}</div>
        </div>

        <Divider />

        {/* Metrics */}
        <div>
          <h3 className="font-medium mb-4 text-gray-700">工作统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">
                {report.metrics.tasksCompleted}
              </div>
              <div className="text-xs text-gray-400">完成任务</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">
                {formatDuration(report.metrics.totalWorkTime)}
              </div>
              <div className="text-xs text-gray-400">总工时</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-500">
                {formatDuration(report.metrics.focusTime)}
              </div>
              <div className="text-xs text-gray-400">专注时间</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-500">
                {formatDuration(report.metrics.meetingTime)}
              </div>
              <div className="text-xs text-gray-400">会议时间</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
