import React from 'react';
import { Menu, Button } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  BankOutlined,
  SolutionOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  MessageOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

interface SidebarMenuProps {
  collapsed: boolean;
}

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: 'Dashboard', path: '/' },
  { key: '/recruiters', icon: <BankOutlined />, label: 'Nhà tuyển dụng', path: '/recruiters' },
  { key: '/jobs', icon: <FileTextOutlined />, label: 'Tin tuyển dụng', path: '/jobs' },
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({ collapsed }) => {
  const location = useLocation();
  // Xác định key đang active
  let selectedKey = '/';
  if (location.pathname.startsWith('/recruiters')) {
    selectedKey = '/recruiters';
  } else if (location.pathname.startsWith('/jobs')) {
    selectedKey = '/jobs';
  } else if (location.pathname === '/') {
    selectedKey = '/';
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid #f0f0f0' }}>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[selectedKey]}
        style={{ flex: 1, borderRight: 0, fontSize: 16 }}
        inlineCollapsed={collapsed}
      >
        {menuItems.map(item => (
          <Menu.Item key={item.key} icon={item.icon}>
            <NavLink to={item.path}>{collapsed ? null : item.label}</NavLink>
          </Menu.Item>
        ))}
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