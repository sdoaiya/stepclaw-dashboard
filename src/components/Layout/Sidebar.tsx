import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Typography } from 'antd';
import {
  ProjectOutlined,
  RiseOutlined,
  DashboardOutlined,
  FileTextOutlined,
  HomeOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAppStore } from '@/stores';
import { MODULES } from '@/utils/constants';

const { Sider } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/tlc', icon: <ProjectOutlined />, label: '任务看板', module: 'tlc' },
  { key: '/los', icon: <RiseOutlined />, label: '学习曲线', module: 'los' },
  { key: '/mss', icon: <DashboardOutlined />, label: '监控面板', module: 'mss' },
  { key: '/drs', icon: <FileTextOutlined />, label: '日报', module: 'drs' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, currentUser } = useAppStore();

  const selectedKey = menuItems.find((item) =>
    location.pathname.startsWith(item.key)
  )?.key || '/';

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={sidebarCollapsed}
      width={220}
      className="fixed left-0 top-0 h-screen z-50 shadow-lg"
      style={{ background: '#fff' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-100">
        {sidebarCollapsed ? (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">灵</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">灵</span>
            </div>
            <div>
              <Text strong className="text-lg">灵笼看板</Text>
              <div className="text-xs text-gray-400">v3.0</div>
            </div>
          </div>
        )}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="border-r-0 mt-4"
      />

      {/* Collapse Button */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center border-t border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleSidebar}
      >
        {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </Sider>
  );
}
