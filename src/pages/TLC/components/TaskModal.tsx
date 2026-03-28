import { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Tag, Space, Avatar, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTaskStore } from '@/stores';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/utils/constants';
import type { Task } from '@/types';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface TaskModalProps {
  open: boolean;
  taskId: string | null;
  onClose: () => void;
}

// Mock users for assignee selection
const mockUsers = [
  { id: '1', name: '张三', avatar: '' },
  { id: '2', name: '李四', avatar: '' },
  { id: '3', name: '王五', avatar: '' },
];

export default function TaskModal({ open, taskId, onClose }: TaskModalProps) {
  const [form] = Form.useForm();
  const { tasks, addTask, updateTask } = useTaskStore();

  const isEditing = !!taskId;
  const editingTask = taskId ? tasks.find((t) => t.id === taskId) : null;

  useEffect(() => {
    if (open && editingTask) {
      form.setFieldsValue({
        ...editingTask,
        startDate: editingTask.startDate ? dayjs(editingTask.startDate) : null,
        dueDate: editingTask.dueDate ? dayjs(editingTask.dueDate) : null,
        assignee: editingTask.assignee?.id,
      });
    } else if (open) {
      form.resetFields();
      form.setFieldsValue({
        status: 'todo',
        priority: 'medium',
        tags: [],
      });
    }
  }, [open, editingTask, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const taskData = {
        ...values,
        startDate: values.startDate?.format('YYYY-MM-DD'),
        dueDate: values.dueDate?.format('YYYY-MM-DD'),
        assignee: mockUsers.find((u) => u.id === values.assignee),
      };

      if (isEditing && taskId) {
        updateTask(taskId, taskData);
      } else {
        addTask(taskData as any);
      }
      onClose();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const tagOptions = ['前端', '后端', '设计', '测试', '文档', '紧急', '优化'];

  return (
    <Modal
      title={isEditing ? '编辑任务' : '新建任务'}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      width={600}
      okText={isEditing ? '保存' : '创建'}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'todo',
          priority: 'medium',
        }}
      >
        <Form.Item
          name="title"
          label="任务标题"
          rules={[{ required: true, message: '请输入任务标题' }]}
        >
          <Input placeholder="输入任务标题" />
        </Form.Item>

        <Form.Item name="description" label="任务描述">
          <TextArea rows={3} placeholder="输入任务描述（可选）" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true }]}
          >
            <Select placeholder="选择状态">
              {STATUS_OPTIONS.map((s) => (
                <Option key={s.value} value={s.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true }]}
          >
            <Select placeholder="选择优先级">
              {PRIORITY_OPTIONS.map((p) => (
                <Option key={p.value} value={p.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    {p.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="startDate" label="开始日期">
            <DatePicker className="w-full" placeholder="选择开始日期" />
          </Form.Item>

          <Form.Item name="dueDate" label="截止日期">
            <DatePicker className="w-full" placeholder="选择截止日期" />
          </Form.Item>
        </div>

        <Form.Item name="assignee" label="负责人">
          <Select placeholder="选择负责人" allowClear>
            {mockUsers.map((user) => (
              <Option key={user.id} value={user.id}>
                <Space>
                  <Avatar size="small">{user.name[0]}</Avatar>
                  {user.name}
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="tags" label="标签">
          <Select
            mode="tags"
            placeholder="添加标签"
            allowClear
            options={tagOptions.map((tag) => ({ value: tag, label: tag }))}
          />
        </Form.Item>

        <Form.Item name="estimatedHours" label="预估工时">
          <Input type="number" placeholder="预估工时（小时）" suffix="小时" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
