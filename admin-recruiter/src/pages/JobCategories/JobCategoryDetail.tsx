import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Space, Button, Tag, Descriptions } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchJobCategoryById } from '../../apis/job-categories.api';
import { DetailSkeleton } from '../../components/Skeleton';
import Swal from 'sweetalert2';
import { ArrowLeftOutlined, EditOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const JobCategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchJobCategoryById(id!);
        setData(res);
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Không thể tải dữ liệu' });
        navigate('/job-categories');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (!data) return null;

  const statusColor = data.status === 'active' ? 'green' : 'red';

  return (
    <div style={{ padding: 32, background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/job-categories')}>Quay lại</Button>
            <Title level={3} style={{ margin: 0 }}>Chi tiết danh mục</Title>
          </Space>
          <Space>
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/job-categories/edit/${id}`)}>Chỉnh sửa</Button>
          </Space>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#e6f7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AppstoreOutlined style={{ color: '#1677ff', fontSize: 24 }} />
                </div>
                <div>
                  <Title level={3} style={{ margin: 0 }}>{data.title}</Title>
                  <Text type="secondary">Slug: {data.slug}</Text>
                </div>
              </Space>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Mô tả">{data.description || 'Chưa có dữ liệu'}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={statusColor}>{data.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Lượt xem">{data.views ?? 0}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">{data.createdAt ? new Date(data.createdAt).toLocaleString('vi-VN') : '-'}</Descriptions.Item>
                <Descriptions.Item label="Cập nhật">{data.updatedAt ? new Date(data.updatedAt).toLocaleString('vi-VN') : '-'}</Descriptions.Item>
              </Descriptions>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default JobCategoryDetail;


