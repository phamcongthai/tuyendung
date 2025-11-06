import { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Checkbox, Row, Col, Select, Spin } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRoleById, updateRole } from '../../apis/roles.api';
import type { RoleData, UpdateRoleData } from '../../types/roles.type';
import Swal from 'sweetalert2';

const { Title } = Typography;
const { Option } = Select;

export default function EditRole() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [role, setRole] = useState<RoleData | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchRoleData(id);
    }
  }, [id]);

  const fetchRoleData = async (roleId: string) => {
    setDataLoading(true);
    try {
      const data = await fetchRoleById(roleId);
      setRole(data);
      form.setFieldsValue({
        name: data.name,
        isActive: data.isActive,
        permissions: data.permissions
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error?.response?.data?.message || 'Không thể tải thông tin vai trò',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/roles');
      });
    } finally {
      setDataLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const roleData: UpdateRoleData = {
        name: values.name,
        permissions: values.permissions || [],
        isActive: values.isActive,
      };

      await updateRole(id, roleData);
      
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã cập nhật vai trò thành công',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/roles');
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error?.response?.data?.message || 'Không thể cập nhật vai trò',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const permissionGroups = {
    'Người dùng': ['users.read', 'users.write', 'users.delete'],
    'Vai trò': ['roles.read', 'roles.write', 'roles.delete'],
    'Công việc': ['jobs.read', 'jobs.write', 'jobs.delete'],
    'Công ty': ['companies.read', 'companies.write', 'companies.delete'],
    'Ứng tuyển': ['applications.read', 'applications.write', 'applications.delete'],
    'Hệ thống': ['admin.access', 'system.manage']
  };

  const getPermissionLabel = (permission: string) => {
    const labels: { [key: string]: string } = {
      'users.read': 'Xem người dùng',
      'users.write': 'Tạo/Sửa người dùng',
      'users.delete': 'Xóa người dùng',
      'roles.read': 'Xem vai trò',
      'roles.write': 'Tạo/Sửa vai trò',
      'roles.delete': 'Xóa vai trò',
      'jobs.read': 'Xem công việc',
      'jobs.write': 'Tạo/Sửa công việc',
      'jobs.delete': 'Xóa công việc',
      'companies.read': 'Xem công ty',
      'companies.write': 'Tạo/Sửa công ty',
      'companies.delete': 'Xóa công ty',
      'applications.read': 'Xem ứng tuyển',
      'applications.write': 'Tạo/Sửa ứng tuyển',
      'applications.delete': 'Xóa ứng tuyển',
      'admin.access': 'Truy cập admin',
      'system.manage': 'Quản lý hệ thống'
    };
    return labels[permission] || permission;
  };

  if (dataLoading) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!role) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <Title level={4}>Không tìm thấy vai trò</Title>
        <Button onClick={() => navigate('/roles')}>Quay lại danh sách</Button>
      </div>
    );
  }

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
        <Title level={3} style={{ margin: 0 }}>Chỉnh sửa vai trò: {role.name}</Title>
      </Space>

      <Card style={{ maxWidth: 800 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Tên vai trò"
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên vai trò!' },
                  { min: 2, message: 'Tên vai trò phải có ít nhất 2 ký tự!' }
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

          <Form.Item
            label="Quyền hạn"
            name="permissions"
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: 16 }}>
                {Object.entries(permissionGroups).map(([groupName, permissions]) => (
                  <div key={groupName} style={{ marginBottom: 16 }}>
                    <Title level={5} style={{ marginBottom: 8, color: '#1890ff' }}>
                      {groupName}
                    </Title>
                    <Row gutter={[16, 8]}>
                      {permissions.map(permission => (
                        <Col span={8} key={permission}>
                          <Checkbox value={permission}>
                            {getPermissionLabel(permission)}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ))}
              </div>
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
                Cập nhật vai trò
              </Button>
              <Button onClick={() => navigate('/roles')}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
