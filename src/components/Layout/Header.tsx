import { useState } from 'react';
import { Layout, Badge, Button, Dropdown, Avatar, Input, Tooltip, theme } from 'antd';
import {
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useAppStore } from '@/stores';

const { Header: AntHeader } = Layout;
const { useToken } = theme;

export default function Header() {
  const { token } = useToken();
  const { currentUser, theme: appTheme, setTheme, notifications } = useAppStore();
  const [searchVisible, setSearchVisible] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const notificationItems = notifications.slice(0, 5).map((n) => ({
    key: n.id,
    label: (
      <div className="max-w-xs">
        <div className="font-medium">{n.message}</div>
        {n.description && (
          <div className="text-gray-400 text-sm mt-1">{n.description}</div>
        )}
      </div>
    ),
  }));

  return (
    <AntHeader
      className="bg-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm"
      style={{ height: 64 }}
    >
      {/* Left: Breadcrumb or Title */}
      <div className="flex items-center">
        {searchVisible ? (
          <Input
            autoFocus
            placeholder="全局搜索..."
            prefix={<SearchOutlined />}
            className="w-64"
            onBlur={() => setSearchVisible(false)}
          />
        ) : (
          <Tooltip title="搜索">
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={() => setSearchVisible(true)}
            />
          </Tooltip>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Tooltip title={appTheme === 'dark' ? '切换亮色' : '切换暗色'}>
          <Button
            type="text"
            icon={appTheme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            onClick={() => setTheme(appTheme === 'dark' ? 'light' : 'dark')}
          />
        </Tooltip>

        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          arrow
        >
          <Badge count={unreadCount} size="small">
            <Button type="text" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>

        {/* User */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-lg transition-colors">
            <Avatar
              src={currentUser?.avatar}
              icon={<UserOutlined />}
              size="small"
            />
            <span className="hidden sm:inline">{currentUser?.name || '用户'}</span>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
}
