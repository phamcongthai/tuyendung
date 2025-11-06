import { useEffect, useState } from 'react';
import { Card, Typography, Space, Button, Tag, Row, Col, Descriptions, Spin } from 'antd';
import { ArrowLeftOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRoleById } from '../../apis/roles.api';
import type { RoleData } from '../../types/roles.type';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Swal from 'sweetalert2';

dayjs.locale('vi');
const { Title } = Typography;

export default function RoleDetail() {
  const [role, setRole] = useState<RoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchRoleData(id);
    }
  }, [id]);

  const fetchRoleData = async (roleId: string) => {
    setLoading(true);
    try {
      const data = await fetchRoleById(roleId);
      setRole(data);
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
      setLoading(false);
    }
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

  const getPermissionColor = (permission: string) => {
    if (permission.includes('delete')) return 'red';
    if (permission.includes('write')) return 'orange';
    if (permission.includes('read')) return 'blue';
    if (permission.includes('admin') || permission.includes('system')) return 'purple';
    return 'default';
  };

  if (loading) {
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
        <Title level={3} style={{ margin: 0 }}>Chi tiết vai trò</Title>
      </Space>

      <Row gutter={24}>
        <Col span={16}>
          <Card title="Thông tin cơ bản" style={{ marginBottom: 24 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tên vai trò">
                <Space>
                  <KeyOutlined style={{ color: '#722ed1' }} />
                  <strong>{role.name}</strong>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={role.isActive === 'active' ? 'green' : 'red'}>
                  {role.isActive === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dayjs(role.createdAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {dayjs(role.updatedAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title={`Quyền hạn (${role.permissions.length})`}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {role.permissions.map((permission, index) => (
                <Tag 
                  key={index} 
                  color={getPermissionColor(permission)}
                  style={{ marginBottom: 8, fontSize: 12 }}
                >
                  {getPermissionLabel(permission)}
                </Tag>
              ))}
              {role.permissions.length === 0 && (
                <div style={{ color: '#8c8c8c', fontStyle: 'italic' }}>
                  Chưa có quyền nào được gán
                </div>
              )}
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Hành động">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => navigate(`/roles/edit/${role._id}`)}
                block
              >
                Chỉnh sửa vai trò
              </Button>
              <Button 
                onClick={() => navigate('/roles')}
                block
              >
                Quay lại danh sách
              </Button>
            </Space>
          </Card>

          <Card title="Thống kê" style={{ marginTop: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tổng quyền">
                {role.permissions.length}
              </Descriptions.Item>
              <Descriptions.Item label="Quyền đọc">
                {role.permissions.filter(p => p.includes('read')).length}
              </Descriptions.Item>
              <Descriptions.Item label="Quyền ghi">
                {role.permissions.filter(p => p.includes('write')).length}
              </Descriptions.Item>
              <Descriptions.Item label="Quyền xóa">
                {role.permissions.filter(p => p.includes('delete')).length}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
