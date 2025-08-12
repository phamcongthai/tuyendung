import React from 'react';
import { Skeleton, Layout } from 'antd';

const { Sider } = Layout;

const SidebarSkeleton: React.FC = () => {
  return (
    <Sider
      width={256}
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 64,
        zIndex: 99,
      }}
    >
      <div style={{ padding: 16 }}>
        {/* Menu items skeleton */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} style={{ marginBottom: 8 }}>
            <Skeleton.Input 
              active 
              size="small" 
              style={{ width: '100%', height: 40 }} 
            />
          </div>
        ))}
      </div>
    </Sider>
  );
};

export default SidebarSkeleton; 