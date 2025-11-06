import React, { useEffect, useState, useRef } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Divider,
  message,
} from 'antd';
import Swal from 'sweetalert2';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

import {
  fetchRecruiterById,
  editRecruiter,
  uploadAvatar,
} from '../../apis/recruiter.api';
import { FormSkeleton } from '../../components/Skeleton';
import type { RecruiterData } from '../../types/recruiter.type';

const { Title } = Typography;

const EditRecruiter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) fetchRecruiterData();
  }, [id]);

  const fetchRecruiterData = async () => {
    try {
      const data = await fetchRecruiterById(id!);
      setAvatarUrl(data.avatar || '');
      form.setFieldsValue(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể tải thông tin nhà tuyển dụng',
      });
      navigate('/recruiters');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file instanceof File) {
      try {
        setUploading(true);
        const res = await uploadAvatar(id!, file);
        setUploading(false);
        if (res?.avatar) {
          setAvatarUrl(res.avatar);
          setAvatarFile(file);
        }
      } catch {
        setUploading(false);
        message.error('Tải ảnh lên thất bại');
      }
    } else {
      message.warning('File không hợp lệ!');
    }
  };

  const onFinish = async () => {
    setSaving(true);
    try {
      const currentValues = form.getFieldsValue() as Omit<RecruiterData, '_id'>;
      await editRecruiter(id!, {
        ...currentValues,
        avatar: avatarUrl,
      });
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Cập nhật thành công',
      });
      navigate('/recruiters');
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Cập nhật thất bại!',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate('/recruiters');

  if (loading) return <FormSkeleton fieldCount={10} />;

  return (
    <div style={{ padding: 32, background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleCancel} style={{ marginRight: 16 }}>
              Quay lại
            </Button>
            <Title level={3}>Chỉnh sửa nhà tuyển dụng</Title>
          </Space>
        </Row>
      </Card>

      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={14} xl={12}>
          <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              disabled={saving}
            >
              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: '#e6f7ff',
                    border: '1px solid #d9d9d9',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    margin: '0 auto',
                    cursor: 'pointer',
                  }}
                  onClick={handleAvatarClick}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              </div>

              <Divider />

              <Title level={4}>
                <UserOutlined style={{ marginRight: 8 }} />
                Thông tin cơ bản
              </Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}> 
                    <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}> 
                    <Select
                      options={[
                        { value: 'male', label: 'Nam' },
                        { value: 'female', label: 'Nữ' },
                        { value: 'other', label: 'Khác' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}> 
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}> 
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}> 
                <Select
                  options={[
                    { value: 'active', label: 'Hoạt động' },
                    { value: 'inactive', label: 'Không hoạt động' },
                  ]}
                />
              </Form.Item>

              <Divider />

              <Title level={4}>
                <BankOutlined style={{ marginRight: 8 }} />
                Thông tin công ty
              </Title>

              <Form.Item name="company" label="Tên công ty" rules={[{ required: true }]}> 
                <Input prefix={<BankOutlined />} />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="province" label="Tỉnh/Thành phố">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="district" label="Quận/Huyện">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginTop: 32 }}>
                <Space style={{ justifyContent: 'center', width: '100%' }}>
                  <Button size="large" onClick={handleCancel} disabled={saving}>
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={saving}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EditRecruiter;
