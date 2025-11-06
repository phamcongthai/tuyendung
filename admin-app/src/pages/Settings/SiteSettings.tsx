import React, { useEffect, useState } from 'react';
import { Card, Form, Upload, Button, Space, message, Typography, Divider, Switch, Input, Row, Col } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { settingsApi, SiteSettings } from '../../apis/settings.api';

const { Title, Text } = Typography;

const SiteSettingsPage: React.FC = () => {
  const [form] = Form.useForm<SiteSettings & { noticeEnabled?: boolean; noticeMessage?: string; noticeColor?: string; clientSiteName?: string; recruiterSiteName?: string }>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await settingsApi.getPublic();
        form.setFieldsValue(data as any);
      } catch (e: any) {
        message.error(e?.message || 'Không tải được cấu hình');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [form]);

  const handleUpload = async (field: keyof SiteSettings, file: File) => {
    try {
      const { secure_url } = await settingsApi.uploadImage(file);
      form.setFieldsValue({ [field]: secure_url } as any);
      message.success('Tải ảnh thành công');
    } catch (e: any) {
      message.error(e?.message || 'Tải ảnh thất bại');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = form.getFieldsValue();
      await settingsApi.updateAdmin(values as any);
      message.success('Đã lưu cấu hình');
    } catch (e: any) {
      message.error(e?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: 16 }}>
      <Title level={3}>Cài đặt giao diện</Title>
      <Text type="secondary">Quản trị phần hiển thị cho Client và Recruiter</Text>
      <Divider />

      <Card loading={loading}>
        <Form form={form} layout="vertical">
          <Divider orientation="left">Client</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Tên trang (Client)" name="clientSiteName">
                <Input placeholder="Tên thương hiệu cho trang client" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Logo (PNG/SVG)" name="logoUrl">
                <Space align="start">
                  <Upload
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleUpload('logoUrl', file);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Tải logo</Button>
                  </Upload>
                  {form.getFieldValue('logoUrl') && (
                    <img src={form.getFieldValue('logoUrl')} alt="logo" style={{ height: 48, objectFit: 'contain', border: '1px solid #f0f0f0', borderRadius: 8, padding: 6, background: '#fff' }} />
                  )}
                </Space>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Tiêu đề trang (Client)" name="clientTitle">
                <Input placeholder="Tiêu đề hiển thị trên thẻ trình duyệt cho Client" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Favicon (PNG/ICO)" name="faviconUrl">
                <Space align="start">
                  <Upload
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleUpload('faviconUrl', file);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Tải favicon</Button>
                  </Upload>
                  {form.getFieldValue('faviconUrl') && (
                    <img src={form.getFieldValue('faviconUrl')} alt="favicon" style={{ height: 32, width: 32, objectFit: 'contain', border: '1px solid #f0f0f0', borderRadius: 8, padding: 4, background: '#fff' }} />
                  )}
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Recruiter</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Tên trang (Recruiter)" name="recruiterSiteName">
                <Input placeholder="Tên thương hiệu cho trang nhà tuyển dụng" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Tiêu đề trang (Recruiter)" name="recruiterTitle">
                <Input placeholder="Tiêu đề hiển thị trên thẻ trình duyệt cho Recruiter" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Thông báo toàn site</Divider>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Bật thông báo" name="noticeEnabled" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item label="Nội dung" name="noticeMessage">
                <Input placeholder="Nội dung sẽ hiển thị trên client & recruiter" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Màu nền" name="noticeColor">
                <Input type="color" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SiteSettingsPage;
