import React from 'react';
import { Skeleton, Card, Row, Col } from 'antd';

interface FormSkeletonProps {
  fieldCount?: number;
  showTitle?: boolean;
}

const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fieldCount = 8,
  showTitle = true,
}) => {
  const fieldsPerRow = 2;
  const rows = Math.ceil(fieldCount / fieldsPerRow);

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={20} md={16} lg={14} xl={12}>
        <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', padding: 24 }}>
          {/* Title skeleton */}
          {showTitle && (
            <Skeleton.Input 
              active 
              size="large" 
              style={{ width: 300, height: 40, marginBottom: 24, margin: '0 auto 24px auto' }} 
            />
          )}

          {/* Form fields skeleton */}
          <Row gutter={16}>
            {Array.from({ length: fieldCount }).map((_, index) => (
              <Col span={12} key={index} style={{ marginBottom: 16 }}>
                <Skeleton.Input 
                  active 
                  size="large" 
                  style={{ width: '100%', height: 40 }} 
                />
              </Col>
            ))}
          </Row>

          {/* Submit button skeleton */}
          <Skeleton.Button 
            active 
            size="large" 
            style={{ width: '100%', height: 40, marginTop: 16 }} 
          />
        </Card>
      </Col>
    </Row>
  );
};

export default FormSkeleton; 