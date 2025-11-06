import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Descriptions, Space, Button, Tag, Spin, Typography, Popconfirm, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchAccountWithRoles, deleteAccount } from '../../apis/accounts.api';

const { Title, Text } = Typography;

interface AccountDetailData {
  _id: string;
  email: string;
  status: 'active' | 'inactive';
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  roleIds: string[];
}

const AccountDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<AccountDetailData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchAccountWithRoles(id!);
        setAccount(res);
      } catch (error: any) {
        message.error(error?.response?.data?.message || 'Không thể tải chi tiết tài khoản');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteAccount(id!);
      message.success('Đã xóa tài khoản');
      navigate('/accounts');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Xóa thất bại');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!account) {
    return (
      <div style={{ padding: 32 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/accounts')}>Quay lại</Button>
            <Title level={4} style={{ margin: 0 }}>Không tìm thấy tài khoản</Title>
          </Space>
        </Space>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/accounts')}>Quay lại</Button>
          <Title level={3} style={{ margin: 0 }}>Chi tiết tài khoản</Title>
        </Space>
        <Space>
          <Button icon={<EditOutlined />} type="primary" onClick={() => navigate(`/accounts/edit/${account._id}`)}>
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn chắc chắn muốn xóa tài khoản này?"
            okText="Xóa"
            okButtonProps={{ danger: true }}
            cancelText="Hủy"
            onConfirm={handleDelete}
          >
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      </Space>

      <Card style={{ maxWidth: 900 }}>
        <Descriptions column={2} bordered labelStyle={{ width: 220 }}>
          <Descriptions.Item label="ID">{account._id}</Descriptions.Item>
          <Descriptions.Item label="Email">{account.email}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={account.status === 'active' ? 'green' : 'red'}>
              {account.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Xác thực">
            <Tag color={account.isVerified ? 'blue' : 'orange'}>
              {account.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò (IDs)" span={2}>
            {account.roleIds?.length ? (
              <Space wrap>
                {account.roleIds.map(rid => (
                  <Tag key={rid}>{rid}</Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">Chưa gán vai trò</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Đăng nhập cuối">
            {account.lastLoginAt ? new Date(account.lastLoginAt).toLocaleString('vi-VN') : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {account.createdAt ? new Date(account.createdAt).toLocaleString('vi-VN') : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật cuối">
            {account.updatedAt ? new Date(account.updatedAt).toLocaleString('vi-VN') : '—'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default AccountDetail;


