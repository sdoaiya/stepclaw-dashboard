import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppStore } from '@/stores';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout
        style={{
          marginLeft: sidebarCollapsed ? 80 : 220,
          transition: 'all 0.2s',
        }}
      >
        <Header />
        <Content className="m-6 p-6 bg-white rounded-lg min-h-[calc(100vh-140px)]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
