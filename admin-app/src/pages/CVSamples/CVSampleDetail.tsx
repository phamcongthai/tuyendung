import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Image,
  Divider,
  Descriptions,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  EyeOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCVSampleById, toggleCVSampleStatus, type CVSampleData } from '../../apis/cv-samples.api';
import { DetailSkeleton } from '../../components/Skeleton';

const { Title, Text, Paragraph } = Typography;

const CVSampleDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [cvSample, setCvSample] = useState<CVSampleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCVSample();
    }
  }, [id]);

  const loadCVSample = async () => {
    try {
      setLoading(true);
      const data = await fetchCVSampleById(id!);
      setCvSample(data);
    } catch (error) {
      console.error('Error loading CV sample:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!cvSample) return;
    
    try {
      await toggleCVSampleStatus(cvSample._id);
      setCvSample(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const renderPreview = () => {
    if (!cvSample) return null;
    
    return (
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: 16 }}>
        <div 
          style={{ 
            border: '1px solid #f0f0f0', 
            borderRadius: 4, 
            padding: 16,
            backgroundColor: '#fff',
            minHeight: 600,
            overflow: 'auto'
          }}
          dangerouslySetInnerHTML={{ 
            __html: `<style>${cvSample.css}</style>${cvSample.html}` 
          }}
        />
      </div>
    );
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!cvSample) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Alert
          message="Không tìm thấy mẫu CV"
          description="Mẫu CV bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
          type="error"
          showIcon
        />
        <Button 
          type="primary" 
          onClick={() => navigate('/cv-samples')}
          style={{ marginTop: 16 }}
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/cv-samples')}>
              Quay lại
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              Chi tiết mẫu CV: {cvSample.name}
            </Title>
          </Space>
          <Space>
            <Button
              icon={<PoweroffOutlined />}
              onClick={handleToggleStatus}
              style={{ color: cvSample.isActive ? '#ff4d4f' : '#52c41a' }}
            >
              {cvSample.isActive ? 'Tạm dừng' : 'Kích hoạt'}
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/cv-samples/edit/${cvSample._id}`)}
            >
              Chỉnh sửa
            </Button>
          </Space>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col span={8}>
          <Card title="Thông tin cơ bản">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {cvSample.demoImage && (
                <div style={{ textAlign: 'center' }}>
                  <Image
                    width={200}
                    height={250}
                    src={cvSample.demoImage}
                    alt={cvSample.name}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                </div>
              )}
              
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tên mẫu">
                  <Text strong>{cvSample.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Tiêu đề">
                  {cvSample.title}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  {cvSample.description || 'Không có mô tả'}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={cvSample.isActive ? 'green' : 'red'}>
                    {cvSample.isActive ? 'Hoạt động' : 'Tạm dừng'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {new Date(cvSample.createdAt).toLocaleString('vi-VN')}
                </Descriptions.Item>
                <Descriptions.Item label="Cập nhật lần cuối">
                  {new Date(cvSample.updatedAt).toLocaleString('vi-VN')}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Card>

          <Card title="Thống kê" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                    {cvSample.html.length}
                  </div>
                  <div style={{ color: '#666' }}>Ký tự HTML</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                    {cvSample.css.length}
                  </div>
                  <div style={{ color: '#666' }}>Ký tự CSS</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={16}>
          <Card 
            title={
              <Space>
                <EyeOutlined />
                <span>Xem trước mẫu CV</span>
              </Space>
            }
          >
            {renderPreview()}
          </Card>

          <Card title="Mã nguồn HTML" style={{ marginTop: 16 }}>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: 16, 
              borderRadius: 4,
              maxHeight: 300,
              overflow: 'auto',
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: 12
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {cvSample.html}
              </pre>
            </div>
          </Card>

          <Card title="Mã nguồn CSS" style={{ marginTop: 16 }}>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: 16, 
              borderRadius: 4,
              maxHeight: 300,
              overflow: 'auto',
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: 12
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {cvSample.css}
              </pre>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CVSampleDetail;
