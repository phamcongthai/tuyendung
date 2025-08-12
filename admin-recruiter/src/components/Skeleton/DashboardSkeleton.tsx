import React from 'react';
import { Skeleton, Card, Row, Col, Statistic } from 'antd';

const DashboardSkeleton: React.FC = () => {
  return (
    <div style={{ padding: 32 }}>
      {/* Header skeleton */}
      <Skeleton.Input 
        active 
        size="large" 
        style={{ width: 300, height: 40, marginBottom: 24 }} 
      />
      
      {/* Stats cards skeleton */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[1, 2, 3, 4].map((item) => (
          <Col xs={24} sm={12} lg={6} key={item}>
            <Card>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts section skeleton */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title={<Skeleton.Input active size="small" style={{ width: 150 }} />}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<Skeleton.Input active size="small" style={{ width: 120 }} />}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        </Col>
      </Row>

      {/* Recent activities skeleton */}
      <Card title={<Skeleton.Input active size="small" style={{ width: 180 }} />}>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} style={{ marginBottom: 16 }}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default DashboardSkeleton; 