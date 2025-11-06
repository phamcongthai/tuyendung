import React from 'react';
import { Skeleton, Card, Space } from 'antd';

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  showHeader?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rowCount = 5,
  columnCount = 6,
  showHeader = true,
  showSearch = true,
  showActions = true,
}) => {
  return (
    <div style={{ padding: 32 }}>
      {/* Header skeleton */}
      {showHeader && (
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
          <Skeleton.Input active size="large" style={{ width: 250, height: 32 }} />
          <Skeleton.Button active size="large" style={{ width: 100, height: 32 }} />
        </Space>
      )}

      {/* Search skeleton */}
      {showSearch && (
        <Skeleton.Input 
          active 
          size="large" 
          style={{ width: 320, height: 40, marginBottom: 16 }} 
        />
      )}

      {/* Table skeleton */}
      <Card style={{ background: '#fff', borderRadius: 8 }}>
        <Skeleton active paragraph={{ rows: rowCount }} />
      </Card>
    </div>
  );
};

export default TableSkeleton; 