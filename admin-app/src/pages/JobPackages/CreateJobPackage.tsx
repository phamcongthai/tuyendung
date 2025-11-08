import React from 'react';
import { Button, Card, Form, Input, InputNumber, Select, Space, Switch, Typography, message } from 'antd';
import { jobPackagesAPI } from '../../apis/job-packages.api';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const CreateJobPackage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const payload = {
        packageName: values.packageName,
        price: values.price ?? 0,
        durationDays: values.durationDays ?? 30,
        priorityLevel: values.priorityLevel ?? 1,
        isActive: values.isActive ?? true,
        features: {
          jobPostLimit: values.jobPostLimit ?? 1,
          autoApprove: values.autoApprove ?? false,
          highlight: values.highlight ?? false,
          showOnHomepage: values.showOnHomepage ?? false,
          analyticsAccess: values.analyticsAccess ?? false,
          supportLevel: values.supportLevel ?? 'none',
        },
      };
      await jobPackagesAPI.create(payload as any);
      message.success('Đã tạo gói');
      navigate('/job-packages');
    } catch (e: any) {
      message.error(e?.message || 'Tạo thất bại');
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={3} style={{ margin: 0 }}>Tạo gói đăng tin nổi bật</Title>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </Space>
      </Card>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ price: 0, durationDays: 30, priorityLevel: 1, isActive: true }}>
          <Form.Item name="packageName" label="Tên gói (nổi bật)" rules={[{ required: true, message: 'Nhập tên gói' }]}>
            <Input placeholder="VD: Gói Nổi Bật 7 ngày" />
          </Form.Item>
          <Form.Item name="price" label="Giá (VND)">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="durationDays" label="Thời hạn hiển thị (ngày)">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => navigate(-1)}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateJobPackage;








