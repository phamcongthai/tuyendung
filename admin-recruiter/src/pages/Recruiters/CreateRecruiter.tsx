import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Row,
  Col,
  Card,
  message,
} from 'antd';
import { createRecruiterWithAvatar } from '../../apis/recruiter.api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FormSkeleton } from '../../components/Skeleton';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CreateRecruiter: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const onFinish = async (values: any) => {
    try {
      await createRecruiterWithAvatar(values, avatarFile || undefined);
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Tạo mới nhà tuyển dụng thành công!',
      });
      navigate('/recruiters');
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Tạo mới thất bại!',
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file instanceof File) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    } else {
      message.warning('File không hợp lệ!');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) return <FormSkeleton fieldCount={9} />;

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={20} md={16} lg={14} xl={12}>
        <Card
          style={{
            borderRadius: 12,
            boxShadow: '0 2px 8px #f0f1f2',
            padding: 24,
          }}
        >
          <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
            Tạo mới nhà tuyển dụng
          </Title>

          <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
            {/* Avatar Upload */}
            <Form.Item label="Ảnh đại diện">
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
                  cursor: 'pointer',
                }}
                onClick={handleAvatarClick}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
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
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="fullName"
                  label="Họ tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[{ required: true, message: 'Chọn giới tính' }]}
                >
                  <Select
                    options={[
                      { value: 'male', label: 'Nam' },
                      { value: 'female', label: 'Nữ' },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, type: 'email', message: 'Nhập email hợp lệ' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ required: true, message: 'Nhập mật khẩu' }]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Nhập số điện thoại' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label="Công ty"
                  rules={[{ required: true, message: 'Nhập tên công ty' }]}
                >
                  <Input />
                </Form.Item>
              </Col>

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

              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: 'Chọn trạng thái' }]}
                >
                  <Select
                    options={[
                      { value: 'active', label: 'Hoạt động' },
                      { value: 'inactive', label: 'Không hoạt động' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginTop: 16 }}>
              <Button type="primary" htmlType="submit" block>
                Tạo mới
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default CreateRecruiter;
