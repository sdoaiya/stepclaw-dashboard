import { Modal, Form, Select, InputNumber, DatePicker, Input } from 'antd';
import { useLearningStore } from '@/stores';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface AddRecordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddRecordModal({ open, onClose }: AddRecordModalProps) {
  const [form] = Form.useForm();
  const { addRecord, skills } = useLearningStore();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const skill = skills.find((s) => s.id === values.skillId);
      if (skill) {
        addRecord({
          skillId: values.skillId,
          skillName: skill.name,
          duration: values.duration,
          date: values.date.format('YYYY-MM-DD'),
          notes: values.notes,
          score: values.score,
        });
      }
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <Modal
      title="记录学习"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="记录"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          date: dayjs(),
          duration: 30,
        }}
      >
        <Form.Item
          name="skillId"
          label="学习技能"
          rules={[{ required: true, message: '请选择技能' }]}
        >
          <Select placeholder="选择学习的技能">
            {skills.map((skill) => (
              <Option key={skill.id} value={skill.id}>
                {skill.name} (Lv.{skill.level})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="学习日期"
          rules={[{ required: true }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="duration"
          label="学习时长（分钟）"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={480} className="w-full" />
        </Form.Item>

        <Form.Item name="score" label="自评分数（1-10）">
          <InputNumber min={1} max={10} className="w-full" />
        </Form.Item>

        <Form.Item name="notes" label="学习笔记">
          <TextArea rows={3} placeholder="记录今天的学习内容" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
