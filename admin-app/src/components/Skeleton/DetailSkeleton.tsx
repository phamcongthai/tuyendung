import React from 'react';
import { Skeleton, Card, Row, Col, Space } from 'antd';

interface DetailSkeletonProps {
  showActions?: boolean;
}

const DetailSkeleton: React.FC<DetailSkeletonProps> = ({ showActions = true }) => {
  return (
    <div style={{ padding: 32 }}>
      {/* Header skeleton */}
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
        <Skeleton.Input active size="large" style={{ width: 300, height: 32 }} />
        {showActions && (
          <Space>
            <Skeleton.Button active size="large" style={{ width: 80, height: 32 }} />
            <Skeleton.Button active size="large" style={{ width: 80, height: 32 }} />
          </Space>
        )}
      </Space>

      {/* Content skeleton */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title={<Skeleton.Input active size="small" style={{ width: 200 }} />}>
            <Row gutter={[16, 16]}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Col span={12} key={index}>
                  <Skeleton.Input active size="large" style={{ width: '100%', height: 40 }} />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<Skeleton.Input active size="small" style={{ width: 150 }} />}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DetailSkeleton; 