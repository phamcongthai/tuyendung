import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Checkbox,
  Row,
  Col,
  Select,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createRole } from '../../apis/roles.api';
import type { CreateRoleData } from '../../types/roles.type';
import Swal from 'sweetalert2';

const { Title } = Typography;
const { Option } = Select;

export default function CreateRole() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const roleData: CreateRoleData = {
        name: values.name,
        permissions: values.permissions || [],
        isActive: values.isActive || 'active',
      };

      console.log('📌 Role data gửi lên:', roleData);

      await createRole(roleData);

      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã tạo vai trò mới thành công',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/roles');
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error?.response?.data?.message || 'Không thể tạo vai trò mới',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  // Các nhóm quyền cho 3 actor: admin, user, recruiter
  const permissionGroups: Record<string, string[]> = {
    'Quản trị hệ thống (Admin)': [
      'admin.access',
      'system.manage',
      'roles.read',
      'roles.write',
      'roles.delete',
      'users.read',
      'users.write',
      'users.delete',
    ],
    'Người dùng (User)': [
      'profile.read',
      'profile.update',
      'jobs.read',
      'applications.create',
      'applications.read',
    ],
    'Nhà tuyển dụng (Recruiter)': [
      'jobs.create',
      'jobs.update',
      'jobs.delete',
      'companies.manage',
      'applications.read',
    ],
  };

  // Label hiển thị
  const getPermissionLabel = (permission: string) => {
    const labels: Record<string, string> = {
      // admin
      'admin.access': 'Truy cập admin',
      'system.manage': 'Quản lý hệ thống',
      'roles.read': 'Xem vai trò',
      'roles.write': 'Tạo/Sửa vai trò',
      'roles.delete': 'Xóa vai trò',
      'users.read': 'Xem người dùng',
      'users.write': 'Tạo/Sửa người dùng',
      'users.delete': 'Xóa người dùng',

      // user
      'profile.read': 'Xem hồ sơ',
      'profile.update': 'Cập nhật hồ sơ',
      'jobs.read': 'Xem công việc',
      'applications.create': 'Nộp đơn ứng tuyển',
      'applications.read': 'Xem đơn ứng tuyển',

      // recruiter
      'jobs.create': 'Đăng công việc',
      'jobs.update': 'Sửa công việc',
      'jobs.delete': 'Xóa công việc',
      'companies.manage': 'Quản lý công ty',
    };

    return labels[permission] || permission;
  };

  return (
    <div style={{ padding: 32, fontFamily: 'Roboto, sans-serif' }}>
      <Space style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/roles')}
          type="text"
        >
          Quay lại
        </Button>
        <Title level={3} style={{ margin: 0 }}>
          Tạo vai trò mới
        </Title>
      </Space>

      <Card style={{ maxWidth: 800 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isActive: 'active',
            permissions: [],
          }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Tên vai trò"
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên vai trò!' },
                  { min: 2, message: 'Tên vai trò phải có ít nhất 2 ký tự!' },
                ]}
              >
                <Input placeholder="Nhập tên vai trò..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Trạng thái"
                name="isActive"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Quyền hạn" name="permissions">
            <Checkbox.Group style={{ width: '100%' }}>
              {Object.entries(permissionGroups).map(
                ([groupName, permissions]) => (
                  <div key={groupName} style={{ marginBottom: 16 }}>
                    <Title
                      level={5}
                      style={{ marginBottom: 8, color: '#1890ff' }}
                    >
                      {groupName}
                    </Title>
                    <Row gutter={[16, 8]}>
                      {permissions.map((permission) => (
                        <Col span={8} key={permission}>
                          <Checkbox value={permission}>
                            {getPermissionLabel(permission)}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ),
              )}
            </Checkbox.Group>
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                Tạo vai trò
              </Button>
              <Button onClick={() => navigate('/roles')}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
