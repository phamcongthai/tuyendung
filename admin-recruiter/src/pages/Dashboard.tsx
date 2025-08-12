import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { DashboardSkeleton } from '../components/Skeleton';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div style={{ padding: 32 }}>
      <Title level={3} style={{ marginBottom: 24 }}>Dashboard</Title>
      
      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng nhà tuyển dụng"
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Công ty đang hoạt động"
              value={89}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tin tuyển dụng"
              value={234}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ứng viên đã tuyển"
              value={567}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Thống kê tuyển dụng theo tháng">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              Biểu đồ thống kê sẽ được hiển thị ở đây
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top công ty tuyển dụng">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              Danh sách top công ty sẽ được hiển thị ở đây
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Card title="Hoạt động gần đây">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 500 }}>Công ty ABC đã đăng tin tuyển dụng mới</div>
            <div style={{ color: '#999', fontSize: 12 }}>2 giờ trước</div>
          </div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 500 }}>Nhà tuyển dụng XYZ đã cập nhật thông tin</div>
            <div style={{ color: '#999', fontSize: 12 }}>4 giờ trước</div>
          </div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 500 }}>Tin tuyển dụng mới từ công ty DEF</div>
            <div style={{ color: '#999', fontSize: 12 }}>6 giờ trước</div>
          </div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 500 }}>Ứng viên mới đăng ký tài khoản</div>
            <div style={{ color: '#999', fontSize: 12 }}>8 giờ trước</div>
          </div>
          <div style={{ padding: '12px 0' }}>
            <div style={{ fontWeight: 500 }}>Cập nhật hệ thống hoàn tất</div>
            <div style={{ color: '#999', fontSize: 12 }}>1 ngày trước</div>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard; 