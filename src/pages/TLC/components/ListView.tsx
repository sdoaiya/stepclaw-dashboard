import { Table, Badge, Avatar, Tag, Space, Dropdown, Button } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTaskStore } from '@/stores';
import { getPriorityColor, getStatusColor, getPriorityLabel, getStatusLabel, formatDate } from '@/utils/helpers';
import type { Task } from '@/types';

interface ListViewProps {
  tasks: Task[];
  onEdit: (taskId: string) => void;
}

export default function ListView({ tasks, onEdit }: ListViewProps) {
  const { deleteTask, toggleTaskSelection, selectedTaskIds } = useTaskStore();

  const columns = [
    {
      title: '任务',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Task) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.description && (
            <div className="text-gray-400 text-xs line-clamp-1">{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Badge
          color={getStatusColor(status as any)}
          text={getStatusLabel(status as any)}
        />
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => (
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getPriorityColor(priority as any) }}
          />
          <span className="text-xs">{getPriorityLabel(priority as any)}</span>
        </div>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 120,
      render: (assignee: Task['assignee']) =>
        assignee ? (
          <Space>
            <Avatar size="small" src={assignee.avatar}>
              {assignee.name[0]}
            </Avatar>
            <span className="text-sm">{assignee.name}</span>
          </Space>
        ) : (
          <span className="text-gray-400">未分配</span>
        ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <Space size="small" wrap>
          {tags.slice(0, 3).map((tag) => (
            <Tag key={tag}>
              {tag}
            </Tag>
          ))}
          {tags.length > 3 && <Tag>+{tags.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (date: string) =>
        date ? (
          <span className={new Date(date) < new Date() ? 'text-red-500' : ''}>
            {formatDate(date)}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: Task) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: '编辑',
                onClick: () => onEdit(record.id),
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: '删除',
                danger: true,
                onClick: () => deleteTask(record.id),
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Table
      dataSource={tasks}
      columns={columns}
      rowKey="id"
      rowSelection={{
        selectedRowKeys: selectedTaskIds,
        onChange: (keys) => {
          keys.forEach((key) => toggleTaskSelection(key as string));
        },
      }}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      scroll={{ x: 1000 }}
    />
  );
}
