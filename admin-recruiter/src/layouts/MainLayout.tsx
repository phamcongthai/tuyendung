import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Layout, Space, Typography, Divider } from 'antd';
import { 
  HeartOutlined, 
  GithubOutlined, 
  LinkedinOutlined, 
  TwitterOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import SidebarMenu from '../components/SidebarMenu';
import AdminHeader from '../components/Header';

const { Sider, Content, Footer, Header } = Layout;
const { Text, Title } = Typography;
const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 200;

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

       {/* Professional Footer - Full Width (At the very bottom) */}
       <Footer
         style={{
           background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
           color: '#fff',
           padding: '40px 0 20px',
           position: 'relative',
           width: '100%',
           marginTop: 'auto',
           zIndex: 1000,
         }}
       >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {/* Main Footer Content */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40, marginBottom: 30 }}>
            
            {/* Company Info */}
            <div>
              <Title level={4} style={{ color: '#fff', marginBottom: 16, fontSize: 20 }}>
                Job Recruitment Platform
              </Title>
              <Text style={{ color: '#e6f7ff', lineHeight: 1.6, fontSize: 14 }}>
                Nền tảng tuyển dụng việc làm hàng đầu, kết nối doanh nghiệp với ứng viên tài năng.
                Chúng tôi cam kết mang đến trải nghiệm tuyển dụng hiệu quả và chuyên nghiệp.
              </Text>
              <div style={{ marginTop: 16 }}>
                <Space size={16}>
                  <a href="#" style={{ color: '#fff', fontSize: 20 }}>
                    <GithubOutlined />
                  </a>
                  <a href="#" style={{ color: '#fff', fontSize: 20 }}>
                    <LinkedinOutlined />
                  </a>
                  <a href="#" style={{ color: '#fff', fontSize: 20 }}>
                    <TwitterOutlined />
                  </a>
                </Space>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <Title level={4} style={{ color: '#fff', marginBottom: 16, fontSize: 18 }}>
                Liên kết nhanh
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                  Trang chủ
                </a>
                <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                  Tìm việc làm
                </a>
                <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                  Đăng tin tuyển dụng
                </a>
                <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                  Về chúng tôi
                </a>
                <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                  Liên hệ
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <Title level={4} style={{ color: '#fff', marginBottom: 16, fontSize: 18 }}>
                Dịch vụ
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                  Tuyển dụng nhân sự
                </a>
                <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                  Tìm việc làm
                </a>
                <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                  Tư vấn nghề nghiệp
                </a>
                <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                  Đào tạo kỹ năng
                </a>
                <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                  Hỗ trợ doanh nghiệp
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <Title level={4} style={{ color: '#fff', marginBottom: 16, fontSize: 18 }}>
                Liên hệ
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MailOutlined style={{ color: '#91d5ff' }} />
                  <Text style={{ color: '#e6f7ff', fontSize: 14 }}>
                    contact@jobrecruitment.com
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PhoneOutlined style={{ color: '#91d5ff' }} />
                  <Text style={{ color: '#e6f7ff', fontSize: 14 }}>
                    +84 123 456 789
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <EnvironmentOutlined style={{ color: '#91d5ff' }} />
                  <Text style={{ color: '#e6f7ff', fontSize: 14 }}>
                    TP. Hồ Chí Minh, Việt Nam
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '24px 0' }} />

          {/* Bottom Footer */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: '#e6f7ff', fontSize: 14 }}>
                © 2024 Job Recruitment Platform. Made with
              </Text>
              <HeartOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
              <Text style={{ color: '#e6f7ff', fontSize: 14 }}>
                by ThaiPC
              </Text>
            </div>
            
            <div style={{ display: 'flex', gap: 24 }}>
              <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                Chính sách bảo mật
              </a>
              <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                Điều khoản sử dụng
              </a>
              <a href="#" style={{ color: '#e6f7ff', textDecoration: 'none', fontSize: 14 }}>
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
