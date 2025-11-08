import React from 'react';
import { Menu, Button } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  KeyOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileImageOutlined,
  ReadOutlined,
  SettingOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

interface SidebarMenuProps {
  collapsed: boolean;
}

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: 'Dashboard', path: '/' },
  { key: '/accounts', icon: <TeamOutlined />, label: 'Quản lý tài khoản', path: '/accounts' },
  { key: '/jobs', icon: <FileTextOutlined />, label: 'Tin tuyển dụng', path: '/jobs' },
  { key: '/job-categories', icon: <CalendarOutlined />, label: 'Danh mục công việc', path: '/job-categories' },
  { key: '/cv-samples', icon: <FileImageOutlined />, label: 'Quản lý mẫu CV', path: '/cv-samples' },
  { key: '/blogs', icon: <ReadOutlined />, label: 'Quản lý blog', path: '/blogs' },
  { 
    key: '/holland', 
    icon: <ExperimentOutlined />, 
    label: 'Trắc nghiệm Holland',
    children: [
      { key: '/holland/questions', label: 'Câu hỏi', path: '/holland/questions' },
      { key: '/holland/profiles', label: 'Profiles', path: '/holland/profiles' },
      { key: '/holland/results', label: 'Kết quả', path: '/holland/results' },
    ]
  },
  { key: '/job-packages', icon: <FileTextOutlined />, label: 'Gói đăng tin', path: '/job-packages' },
  { key: '/banner-packages', icon: <FileImageOutlined />, label: 'Gói banner', path: '/banner-packages' },
  { key: '/roles', icon: <KeyOutlined />, label: 'Quản lý quyền', path: '/roles' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Cài đặt', path: '/settings' },
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({ collapsed }) => {
  const location = useLocation();
  // Xác định key đang active
  let selectedKey = '/';
  let openKeys: string[] = [];
  
  if (location.pathname.startsWith('/accounts')) {
    selectedKey = '/accounts';
  } else if (location.pathname.startsWith('/jobs')) {
    selectedKey = '/jobs';
  } else if (location.pathname.startsWith('/job-categories')) {
    selectedKey = '/job-categories';
  } else if (location.pathname.startsWith('/cv-samples')) {
    selectedKey = '/cv-samples';
  } else if (location.pathname.startsWith('/blogs')) {
    selectedKey = '/blogs';
  } else if (location.pathname.startsWith('/holland')) {
    selectedKey = location.pathname;
    openKeys = ['/holland'];
  } else if (location.pathname.startsWith('/roles')) {
    selectedKey = '/roles';
  } else if (location.pathname.startsWith('/job-packages')) {
    selectedKey = '/job-packages';
  } else if (location.pathname.startsWith('/banner-packages')) {
    selectedKey = '/banner-packages';
  } else if (location.pathname.startsWith('/settings')) {
    selectedKey = '/settings';
  } else if (location.pathname === '/') {
    selectedKey = '/';
  }
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      borderRight: '1px solid #f0f0f0',
      overflow: 'hidden'
    }}>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        style={{ 
          flex: 1, 
          borderRight: 0, 
          fontSize: 16,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
        inlineCollapsed={collapsed}
      >
        {menuItems.map(item => {
          if ('children' in item && item.children) {
            return (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map((child: any) => (
                  <Menu.Item key={child.key}>
                    <NavLink to={child.path}>{child.label}</NavLink>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            );
          }
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <NavLink to={(item as any).path}>{collapsed ? null : item.label}</NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
      <div style={{ padding: collapsed ? 8 : 16, borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
        {!collapsed && <div style={{ marginBottom: 8, color: '#888' }}>Cần hỗ trợ? Liên hệ ngay!</div>}
        <Button type="primary" block={!collapsed} size={collapsed ? 'small' : 'middle'}>
          {collapsed ? <span style={{ fontSize: 16 }}>?</span> : 'Liên hệ hỗ trợ'}
        </Button>
      </div>
    </div>
  );
};

export default SidebarMenu; 