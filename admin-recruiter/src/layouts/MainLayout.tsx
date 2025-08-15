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
     <Layout style={{ 
       minHeight: '100vh', 
       background: '#f5f7fa',
       display: 'flex',
       flexDirection: 'column'
     }}>
      {/* Fixed Header */}
      <Header
        style={{
          height: HEADER_HEIGHT,
          background: 'transparent',
          padding: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          width: '100%',
        }}
      >
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />
      </Header>

                    {/* Main layout with normal sidebar and scrollable content */}
       <Layout style={{ 
         background: 'transparent',
         marginTop: HEADER_HEIGHT,
         flex: 1,
       }}>
         {/* Normal Sidebar */}
         <Sider
           width={240}
           collapsible
           collapsed={collapsed}
           onCollapse={setCollapsed}
           trigger={null}
           style={{
             background: '#fff',
             boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
             transition: 'all 0.2s ease',
           }}
         >
           <SidebarMenu collapsed={collapsed} />
         </Sider>

         {/* Content Area */}
         <Content
           style={{
             background: '#f5f7fa',
             padding: 24,
           }}
         >
           {children}
         </Content>
       </Layout>

      {/* Compact admin footer */}
      <Footer
        style={{
          background: '#ffffff',
          color: '#666666',
          padding: '8px 24px',
          position: 'relative',
          width: '100%',
          marginTop: 'auto',
          borderTop: '1px solid #f0f0f0'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            fontSize: 12,
          }}
        >
          <span>© 2024 Job Recruitment Platform — Admin</span>
          <span>v1.0</span>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
