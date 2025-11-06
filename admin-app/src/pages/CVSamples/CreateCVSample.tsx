import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Switch,
  Upload,
  message,
  Space,
  Divider,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EyeOutlined,
  UploadOutlined,
  CodeOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createCVSample, type CreateCVSamplePayload } from '../../apis/cv-samples.api';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CreateCVSample: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [demoImageUrl, setDemoImageUrl] = useState<string>('');

  const onFinish = async (values: CreateCVSamplePayload) => {
    setSaving(true);
    try {
      const cvSampleData = {
        ...values,
        demoImage: demoImageUrl || values.demoImage,
        isActive: values.isActive ?? true,
      };

      await createCVSample(cvSampleData);
      
      message.success('Tạo mẫu CV thành công!');
      navigate('/cv-samples');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Tạo mẫu CV thất bại!');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate('/cv-samples');

  const handleImageUpload = (info: any) => {
    if (info.file.status === 'uploading') {
      message.loading('Đang upload hình ảnh...', 0);
    } else if (info.file.status === 'done') {
      message.destroy();
      const imageUrl = info.file.response?.secure_url || info.file.response?.url;
      if (imageUrl) {
        setDemoImageUrl(imageUrl);
        form.setFieldValue('demoImage', imageUrl);
        message.success('Upload hình ảnh thành công');
      } else {
        message.error('Không thể lấy URL hình ảnh');
      }
    } else if (info.file.status === 'error') {
      message.destroy();
      message.error('Upload hình ảnh thất bại');
    }
  };

  const renderPreview = () => {
    const html = form.getFieldValue('html') || '';
    const css = form.getFieldValue('css') || '';
    
    return (
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Xem trước mẫu CV:</Text>
        </div>
        <div 
          style={{ 
            border: '1px solid #f0f0f0', 
            borderRadius: 4, 
            padding: 16,
            backgroundColor: '#fff',
            minHeight: 400,
            overflow: 'auto'
          }}
          dangerouslySetInnerHTML={{ 
            __html: `<style>${css}</style>${html}` 
          }}
        />
      </div>
    );
  };

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
              Quay lại
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              Tạo mẫu CV mới
            </Title>
          </Space>
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Ẩn xem trước' : 'Xem trước'}
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={saving}
            >
              Lưu mẫu CV
            </Button>
          </Space>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col span={previewMode ? 12 : 24}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              disabled={saving}
            >
              <Title level={4}>
                <FileImageOutlined style={{ marginRight: 8 }} />
                Thông tin cơ bản
              </Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên mẫu CV"
                    rules={[{ required: true, message: 'Vui lòng nhập tên mẫu CV' }]}
                  >
                    <Input placeholder="VD: CV Mẫu Cơ Bản" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="title"
                    label="Tiêu đề mẫu CV"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề mẫu CV' }]}
                  >
                    <Input placeholder="VD: CV Template - Modern Design" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Mô tả mẫu CV"
              >
                <TextArea
                  rows={3}
                  placeholder="Mô tả ngắn gọn về mẫu CV này..."
                />
              </Form.Item>

              <Form.Item
                name="demoImage"
                label="Hình ảnh demo"
              >
                <Input
                  placeholder="URL hình ảnh demo (hoặc upload bên dưới)"
                  value={demoImageUrl}
                  onChange={(e) => setDemoImageUrl(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Upload hình ảnh demo">
                <Upload
                  name="file"
                  listType="picture-card"
                  showUploadList={false}
                  action={`${import.meta.env.VITE_API_URL}/upload/image`}
                  // headers={{
                  //   'Authorization': `Bearer ${localStorage.getItem('token')}`
                  // }}
                  onChange={handleImageUpload}
                  accept="image/*"
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    if (!isImage) {
                      message.error('Chỉ được upload file hình ảnh!');
                      return false;
                    }
                    const isLt5M = file.size / 1024 / 1024 < 5;
                    if (!isLt5M) {
                      message.error('Hình ảnh phải nhỏ hơn 5MB!');
                      return false;
                    }
                    return true;
                  }}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
                {demoImageUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img 
                      src={demoImageUrl} 
                      alt="Demo" 
                      style={{ 
                        width: 100, 
                        height: 120, 
                        objectFit: 'cover',
                        borderRadius: 4,
                        border: '1px solid #d9d9d9'
                      }} 
                    />
                    <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
                      <Button 
                        type="link" 
                        size="small" 
                        onClick={() => {
                          setDemoImageUrl('');
                          form.setFieldValue('demoImage', '');
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                )}
              </Form.Item>

              <Form.Item
                name="isActive"
                label="Trạng thái hoạt động"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
              </Form.Item>

              <Divider />

              <Title level={4}>
                <CodeOutlined style={{ marginRight: 8 }} />
                Nội dung mẫu CV
              </Title>

              <Alert
                message="Hướng dẫn"
                description="Sử dụng các placeholder như {{fullName}}, {{email}}, {{phone}}, {{summary}}, {{experience}}, {{education}}, {{skills}}, {{certifications}} để tạo mẫu CV động."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Form.Item
                name="html"
                label="HTML Template"
                rules={[{ required: true, message: 'Vui lòng nhập HTML template' }]}
              >
                <TextArea
                  rows={15}
                  placeholder="Nhập HTML template cho mẫu CV..."
                  style={{ fontFamily: 'Monaco, Consolas, monospace' }}
                />
              </Form.Item>

              <Form.Item
                name="css"
                label="CSS Styles"
                rules={[{ required: true, message: 'Vui lòng nhập CSS styles' }]}
              >
                <TextArea
                  rows={15}
                  placeholder="Nhập CSS styles cho mẫu CV..."
                  style={{ fontFamily: 'Monaco, Consolas, monospace' }}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {previewMode && (
          <Col span={12}>
            <Card title="Xem trước mẫu CV">
              {renderPreview()}
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default CreateCVSample;
