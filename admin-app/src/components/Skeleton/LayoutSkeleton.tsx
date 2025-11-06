import React from 'react';
import { Layout, Skeleton } from 'antd';
import { SidebarSkeleton } from './index';

const { Content } = Layout;

interface LayoutSkeletonProps {
  children?: React.ReactNode;
}

const LayoutSkeleton: React.FC<LayoutSkeletonProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SidebarSkeleton />
      <Layout style={{ marginLeft: 256, marginTop: 64 }}>
        <Content style={{ background: '#f5f5f5' }}>
          {children || <Skeleton active paragraph={{ rows: 10 }} />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutSkeleton; 