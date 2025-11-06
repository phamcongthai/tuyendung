import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, Select, Typography, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../../apis/accounts.api';
import { fetchRoles } from '../../apis/roles.api';
import type { RoleData } from '../../types/roles.type';
import Swal from 'sweetalert2';

const { Title } = Typography;
const { Option } = Select;
const { Password } = Input;

export default function CreateAccount() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleData[]>([]);

  useEffect(() => {
    fetchRolesData();
  }, []);

  const fetchRolesData = async () => {
    try {
      const response = await fetchRoles({
        page: 1,
        limit: 100,
        status: 'active'
      });
      setRoles(response.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // lấy roleId duy nhất
      const accountData = {
        email: values.email,
        password: values.password,
        status: values.status || 'active',
        roleId: values.roleId, // chỉ 1 role
      };

      console.log("📤 Data gửi lên BE:", accountData);

      await createAccount(accountData as any);
      
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã tạo tài khoản thành công',
        confirmButtonText: 'OK',
      });

      navigate('/accounts');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error?.response?.data?.message || 'Không thể tạo tài khoản',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: 'Roboto, sans-serif' }}>
      <Space style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/accounts')}
          type="text"
        >
          Quay lại
        </Button>
        <Title level={3} style={{ margin: 0 }}>Tạo tài khoản mới</Title>
      </Space>

      <Card style={{ maxWidth: 600 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'active',
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                ]}
              >
                <Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="roleId"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select
                  placeholder="Chọn vai trò"
                  showSearch
                  optionFilterProp="children"
                  allowClear
                >
                  {roles.map((role) => (
                    <Option key={role._id} value={role._id}>
                      {role.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
              >
                Tạo tài khoản
              </Button>
              <Button onClick={() => navigate('/accounts')}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
