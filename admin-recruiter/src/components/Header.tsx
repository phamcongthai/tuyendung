import React from 'react';
import { Layout, Input, Avatar, Badge, Space, Typography } from 'antd';
import { BellOutlined, MailOutlined, MenuOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, setCollapsed }) => (
  <Header
    style={{
      background: '#fff',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid #f0f0f0',
      height: 64,
      fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
      boxShadow: '0 2px 8px #f0f1f2',
      zIndex: 100,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
    }}
  >
    {/* Menu icon + logo */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 220 }}>
      <MenuOutlined
        style={{ fontSize: 22, color: '#1677ff', marginRight: 8, cursor: 'pointer', transition: 'transform 0.2s', transform: collapsed ? 'rotate(180deg)' : 'none' }}
        onClick={() => setCollapsed(!collapsed)}
      />
      <Text strong style={{ fontSize: 22, color: '#1677ff', fontFamily: 'inherit', letterSpacing: 1 }}>
        Admin
      </Text>
    </div>
    {/* Search box */}
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <Input
        placeholder="Search"
        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        style={{ width: 320, borderRadius: 6, background: '#f5f7fa', border: 'none' }}
        allowClear
      />
    </div>
    {/* Notification, user */}
    <Space size={24} style={{ marginLeft: 24 }}>
      <Badge count={4} size="small">
        <BellOutlined style={{ fontSize: 20, color: '#444' }} />
      </Badge>
      <Badge count={3} size="small">
        <MailOutlined style={{ fontSize: 20, color: '#444' }} />
      </Badge>
      <Space size={8}>
        <Avatar size={36} src={undefined} icon={<UserOutlined />} style={{ background: '#1677ff' }} />
        <Text style={{ fontWeight: 500, color: '#222', fontFamily: 'inherit' }}>K. Anderson</Text>
      </Space>
    </Space>
  </Header>
);

export default AdminHeader; 