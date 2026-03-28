import { Modal, Form, Input, Select, DatePicker } from 'antd';
import { useLearningStore } from '@/stores';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddGoalModal({ open, onClose }: AddGoalModalProps) {
  const [form] = Form.useForm();
  const { addGoal, skills } = useLearningStore();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      addGoal({
        ...values,
        deadline: values.deadline?.format('YYYY-MM-DD'),
        progress: 0,
        status: 'active',
      });
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <Modal
      title="添加学习目标"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="添加"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="目标标题"
          rules={[{ required: true, message: '请输入目标标题' }]}
        >
          <Input placeholder="例如: 掌握React高级特性" />
        </Form.Item>

        <Form.Item name="description" label="目标描述">
          <TextArea rows={3} placeholder="描述你的学习目标" />
        </Form.Item>

        <Form.Item
          name="targetSkills"
          label="关联技能"
          rules={[{ required: true, message: '请至少选择一个技能' }]}
        >
          <Select mode="multiple" placeholder="选择相关技能">
            {skills.map((skill) => (
              <Option key={skill.id} value={skill.id}>
                {skill.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="deadline" label="截止日期">
          <DatePicker className="w-full" placeholder="选择截止日期" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
