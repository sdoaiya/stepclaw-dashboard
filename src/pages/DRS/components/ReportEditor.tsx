import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  List,
  Checkbox,
  Tag,
  Space,
  DatePicker,
  Select,
  message,
  Divider,
  Row,
  Col,
  Statistic,
  Empty,
} from 'antd';
import {
  SaveOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useReportStore, useTaskStore } from '@/stores';
import { MOOD_OPTIONS } from '@/utils/constants';
import { formatDuration } from '@/utils/helpers';
import type { DailyReport, ReportTask, ReportMetrics } from '@/types';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

export default function ReportEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { reports, addReport, updateReport } = useReportStore();
  const { tasks } = useTaskStore();

  const isEditing = !!id;
  const editingReport = id ? reports.find((r) => r.id === id) : null;

  // Get today's tasks
  const today = dayjs().format('YYYY-MM-DD');
  const todayTasks = tasks.filter((t) => {
    const taskDate = t.updatedAt?.split('T')[0];
    return taskDate === today || t.status === 'done';
  });

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [pendingTaskIds, setPendingTaskIds] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');

  useEffect(() => {
    if (editingReport) {
      form.setFieldsValue({
        ...editingReport,
        date: dayjs(editingReport.date),
      });
      setCompletedTaskIds(editingReport.completedTasks.map((t) => t.taskId));
      setPendingTaskIds(editingReport.pendingTasks.map((t) => t.taskId));
      setSelectedMood(editingReport.mood || '');
    } else {
      form.setFieldsValue({
        date: dayjs(),
        summary: '',
        blockers: '',
        tomorrowPlan: '',
      });
      // Auto-select completed tasks
      const doneTasks = todayTasks.filter((t) => t.status === 'done').map((t) => t.id);
      setCompletedTaskIds(doneTasks);
    }
  }, [editingReport, form, todayTasks]);

  const handleSubmit = async (values: any) => {
    try {
      const completedTasks: ReportTask[] = tasks
        .filter((t) => completedTaskIds.includes(t.id))
        .map((t) => ({
          taskId: t.id,
          title: t.title,
          status: t.status,
          progress: t.status === 'done' ? 100 : 50,
          timeSpent: t.actualHours || 0,
        }));

      const pendingTasks: ReportTask[] = tasks
        .filter((t) => pendingTaskIds.includes(t.id))
        .map((t) => ({
          taskId: t.id,
          title: t.title,
          status: t.status,
          progress: 0,
          timeSpent: 0,
        }));

      const metrics: ReportMetrics = {
        tasksCompleted: completedTasks.length,
        tasksCreated: todayTasks.filter((t) => t.createdAt.startsWith(today)).length,
        totalWorkTime: completedTasks.reduce((sum, t) => sum + t.timeSpent * 60, 0),
        focusTime: completedTasks.reduce((sum, t) => sum + t.timeSpent * 60 * 0.7, 0),
        meetingTime: 0,
      };

      const reportData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        userId: 'current-user',
        userName: '当前用户',
        completedTasks,
        pendingTasks,
        metrics,
        mood: selectedMood,
      };

      if (isEditing && id) {
        updateReport(id, reportData);
        message.success('日报已更新');
      } else {
        addReport(reportData);
        message.success('日报已创建');
      }

      navigate('/drs');
    } catch (error) {
      message.error('保存失败');
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
          <h1 className="text-2xl font-semibold">
            {isEditing ? '编辑日报' : '写日报'}
          </h1>
        </div>
        <Space>
          <Button icon={<SaveOutlined />}>保存草稿</Button>
          <Button type="primary" icon={<SendOutlined />} onClick={() => form.submit()}>
            提交日报
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[16, 16]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            <Card>
              <Form.Item
                name="date"
                label="日期"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                name="summary"
                label="今日总结"
                rules={[{ required: true, message: '请填写今日总结' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="总结今天的主要工作内容和成果..."
                />
              </Form.Item>

              {/* Completed Tasks */}
              <div className="mb-6">
                <div className="font-medium mb-2">已完成任务</div>
                <Card size="small" className="bg-gray-50">
                  {todayTasks.length > 0 ? (
                    <List
                      size="small"
                      dataSource={todayTasks}
                      renderItem={(task) => (
                        <List.Item
                          actions={[
                            <Checkbox
                              checked={completedTaskIds.includes(task.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCompletedTaskIds([...completedTaskIds, task.id]);
                                } else {
                                  setCompletedTaskIds(
                                    completedTaskIds.filter((id) => id !== task.id)
                                  );
                                }
                              }}
                            >
                              完成
                            </Checkbox>,
                          ]}
                        >
                          <span className={completedTaskIds.includes(task.id) ? 'line-through text-gray-400' : ''}>
                            {task.title}
                          </span>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="今天还没有任务" />
                  )}
                </Card>
              </div>

              {/* Pending Tasks */}
              <div className="mb-6">
                <div className="font-medium mb-2">待办任务</div>
                <Card size="small" className="bg-gray-50">
                  {todayTasks.filter((t) => t.status !== 'done').length > 0 ? (
                    <List
                      size="small"
                      dataSource={todayTasks.filter((t) => t.status !== 'done')}
                      renderItem={(task) => (
                        <List.Item
                          actions={[
                            <Checkbox
                              checked={pendingTaskIds.includes(task.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPendingTaskIds([...pendingTaskIds, task.id]);
                                } else {
                                  setPendingTaskIds(
                                    pendingTaskIds.filter((id) => id !== task.id)
                                  );
                                }
                              }}
                            >
                              待办
                            </Checkbox>,
                          ]}
                        >
                          {task.title}
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="没有待办任务" />
                  )}
                </Card>
              </div>

              <Form.Item name="blockers" label="遇到的问题">
                <TextArea
                  rows={3}
                  placeholder="描述今天遇到的问题或阻碍（可选）..."
                />
              </Form.Item>

              <Form.Item
                name="tomorrowPlan"
                label="明日计划"
                rules={[{ required: true, message: '请填写明日计划' }]}
              >
                <TextArea rows={3} placeholder="计划明天的工作内容..." />
              </Form.Item>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Mood */}
            <Card title="今日心情" className="mb-4">
              <div className="flex gap-2 flex-wrap">
                {MOOD_OPTIONS.map((mood) => (
                  <div
                    key={mood.value}
                    className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all ${
                      selectedMood === mood.value
                        ? 'bg-blue-50 border-2 border-blue-400'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedMood(mood.value)}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs mt-1">{mood.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card title="今日统计">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="完成任务"
                    value={completedTaskIds.length}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="待办任务"
                    value={pendingTaskIds.length}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
