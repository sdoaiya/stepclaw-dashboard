import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { useLearningStore } from '@/stores';

const { TextArea } = Input;
const { Option } = Select;

interface AddSkillModalProps {
  open: boolean;
  onClose: () => void;
}

const categories = ['编程语言', '框架/库', '工具', '软技能', '领域知识', '其他'];

export default function AddSkillModal({ open, onClose }: AddSkillModalProps) {
  const [form] = Form.useForm();
  const { addSkill } = useLearningStore();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      addSkill({
        ...values,
        level: 1,
        currentExp: 0,
        requiredExp: 100,
        practiceCount: 0,
      });
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <Modal
      title="添加新技能"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="添加"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="技能名称"
          rules={[{ required: true, message: '请输入技能名称' }]}
        >
          <Input placeholder="例如: React, Python, 项目管理" />
        </Form.Item>

        <Form.Item
          name="category"
          label="分类"
          rules={[{ required: true }]}
        >
          <Select placeholder="选择分类">
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="description" label="描述">
          <TextArea rows={3} placeholder="技能描述（可选）" />
        </Form.Item>

        <Form.Item
          name="maxLevel"
          label="最高等级"
          initialValue={5}
        >
          <InputNumber min={1} max={10} className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
