import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Card, message, Space, Checkbox, Spin } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, KeyOutlined } from '@ant-design/icons';
import { fetchAccountWithRoles, updateAccount, fetchRoles } from '../../apis/accounts.api';
import type { UpdateAccountData } from '../../types/accounts.type';
import type { RoleData } from '../../types/roles.type';

const { Option } = Select;

interface AccountWithRoles {
  _id: string;
  email: string;
  status: string;
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  roleIds: string[];
}

const EditAccount: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [account, setAccount] = useState<AccountWithRoles | null>(null);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [resetPassword, setResetPassword] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setInitialLoading(true);
      await Promise.all([loadAccountData(), loadRoles()]);
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setInitialLoading(false);
    }
  };

  const loadAccountData = async () => {
    try {
      const accountData = await fetchAccountWithRoles(id!);
      setAccount(accountData as AccountWithRoles);
      
      // Set form values
      form.setFieldsValue({
        email: accountData.email,
        status: accountData.status,
        isVerified: accountData.isVerified,
        roleIds: accountData.roleIds || [],
      });
    } catch (error) {
      console.error('Error loading account:', error);
      throw new Error('Không thể tải thông tin tài khoản');
    }
  };

  const loadRoles = async () => {
    try {
      const rolesData = await fetchRoles();
      setRoles((rolesData as any).data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
      throw new Error('Không thể tải danh sách vai trò');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const updateData: UpdateAccountData = {
        email: values.email,
        roleIds: values.roleIds,
      };

      // Map status to backend field
      if (values.status === 'active') {
        (updateData as any).status = 'active';
      } else if (values.status === 'inactive') {
        (updateData as any).status = 'inactive';
      }

      // Add isVerified if changed
      if (values.isVerified !== undefined) {
        (updateData as any).isVerified = values.isVerified;
      }

      // Add password if reset is requested
      if (resetPassword && values.password) {
        (updateData as any).password = values.password;
      }

      console.log('📤 Updating account with data:', updateData);
      
      await updateAccount(id!, updateData);
      message.success('Cập nhật tài khoản thành công!');
      navigate('/accounts');
    } catch (error: any) {
      console.error('Error updating account:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/accounts');
  };

  if (initialLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!account) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Card>
          <div>Không tìm thấy tài khoản</div>
          <Button onClick={handleBack} style={{ marginTop: '16px' }}>
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              type="text"
            />
            <span>Chỉnh sửa tài khoản</span>
          </Space>
        }
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'active',
            isVerified: false,
          }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="Nhập email" size="large" />
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={resetPassword}
              onChange={(e) => setResetPassword(e.target.checked)}
            >
              <KeyOutlined /> Đặt lại mật khẩu
            </Checkbox>
          </Form.Item>

          {resetPassword && (
            <Form.Item
              label="Mật khẩu mới"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" size="large" />
            </Form.Item>
          )}

          <Form.Item
            label="Vai trò"
            name="roleIds"
            rules={[
              { required: true, message: 'Vui lòng chọn ít nhất một vai trò!' },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn vai trò"
              size="large"
              showSearch
              allowClear
              filterOption={(input, option) => {
                const label = (option?.children as unknown as string) ?? '';
                return label.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {roles.map((role) => (
                <Option key={role._id} value={role._id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái" size="large">
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item name="isVerified" valuePropName="checked">
            <Checkbox>Đã xác thực email</Checkbox>
          </Form.Item>

          <Form.Item style={{ marginTop: '32px' }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                size="large"
              >
                Cập nhật tài khoản
              </Button>
              <Button size="large" onClick={handleBack}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Account Info Display */}
      <Card 
        title="Thông tin tài khoản" 
        style={{ maxWidth: 800, margin: '24px auto 0' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <strong>ID:</strong> {account._id}
          </div>
          <div>
            <strong>Ngày tạo:</strong> {new Date(account.createdAt).toLocaleString('vi-VN')}
          </div>
          <div>
            <strong>Cập nhật lần cuối:</strong> {new Date(account.updatedAt).toLocaleString('vi-VN')}
          </div>
          <div>
            <strong>Đăng nhập lần cuối:</strong> {
              account.lastLoginAt 
                ? new Date(account.lastLoginAt).toLocaleString('vi-VN')
                : 'Chưa đăng nhập'
            }
          </div>
          <div>
            <strong>Trạng thái hiện tại:</strong> {
              account.status === 'active' ? 'Hoạt động' : 'Không hoạt động'
            }
          </div>
          <div>
            <strong>Xác thực email:</strong> {
              account.isVerified ? 'Đã xác thực' : 'Chưa xác thực'
            }
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EditAccount;