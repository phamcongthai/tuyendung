import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Select, Space, Switch, Typography, message } from 'antd';
import { jobPackagesAPI } from '../../apis/job-packages.api';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;

const EditJobPackage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await jobPackagesAPI.detail(id as string);
      form.setFieldsValue({
        packageName: data.packageName,
        price: data.price,
        durationDays: data.durationDays,
        priorityLevel: data.priorityLevel,
        isActive: data.isActive,
        jobPostLimit: data?.features?.jobPostLimit,
        autoApprove: data?.features?.autoApprove,
        highlight: data?.features?.highlight,
        showOnHomepage: data?.features?.showOnHomepage,
        analyticsAccess: data?.features?.analyticsAccess,
        supportLevel: data?.features?.supportLevel,
      });
    } catch (e: any) {
      message.error(e?.message || 'Tải dữ liệu thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        packageName: values.packageName,
        price: values.price,
        durationDays: values.durationDays,
        priorityLevel: values.priorityLevel,
        isActive: values.isActive,
        features: {
          jobPostLimit: values.jobPostLimit,
          autoApprove: values.autoApprove,
          highlight: values.highlight,
          showOnHomepage: values.showOnHomepage,
          analyticsAccess: values.analyticsAccess,
          supportLevel: values.supportLevel,
        },
      };
      await jobPackagesAPI.update(id as string, payload as any);
      message.success('Đã cập nhật');
      navigate('/job-packages');
    } catch (e: any) {
      message.error(e?.message || 'Cập nhật thất bại');
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={3} style={{ margin: 0 }}>Sửa gói đăng tin</Title>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </Space>
      </Card>
      <Card loading={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="packageName" label="Tên gói (nổi bật)" rules={[{ required: true, message: 'Nhập tên gói' }]}>
            <Input />
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

export default EditJobPackage;








