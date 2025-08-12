import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Layout } from 'antd';
import SidebarMenu from '../components/SidebarMenu';
import AdminHeader from '../components/Header';

const { Sider, Content, Footer, Header } = Layout;
const HEADER_HEIGHT = 64;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header (bình thường, không cố định) */}
      <Header
        style={{
          height: HEADER_HEIGHT,
          background: 'transparent',
          padding: 0,
          zIndex: 1, // có thể giữ hoặc bỏ
        }}
      >
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />
      </Header>

      {/* Main layout với sidebar + content */}
      <Layout style={{ background: 'transparent' }}>
        <Sider
          width={240}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          style={{
            background: '#fff',
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px - 56px)`, // trừ header + footer
          }}
        >
          <SidebarMenu collapsed={collapsed} />
        </Sider>

        <Content
          style={{
            background: '#f5f7fa',
            minHeight: 360,
            overflow: 'auto',
            boxSizing: 'border-box',
            flex: 1,
          }}
        >
          {children}
        </Content>
      </Layout>

      {/* Footer */}
      <Footer
        style={{
          textAlign: 'center',
          background: '#111',
          color: '#fff',
          fontWeight: 500,
          letterSpacing: 1,
          height: 56,
          fontSize: 16,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
        }}
      >
        Copyright by ThaiPC
      </Footer>
    </Layout>
  );
};

export default MainLayout;
