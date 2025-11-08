import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Select, Space, Switch, Typography, message } from 'antd';
import { bannerPackagesAPI } from '../../apis/banner-packages.api';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;

const EditBannerPackage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await bannerPackagesAPI.detail(id as string);
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        position: data.position,
        previewImage: data.previewImage,
        durationDays: data.durationDays,
        price: data.price,
        maxBannerSlots: data.maxBannerSlots,
        priority: data.priority,
        isActive: data.isActive,
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
        name: values.name,
        description: values.description,
        position: values.position,
        previewImage: values.previewImage,
        durationDays: values.durationDays,
        price: values.price,
        maxBannerSlots: values.maxBannerSlots,
        priority: values.priority,
        isActive: values.isActive,
      };
      await bannerPackagesAPI.update(id as string, payload as any);
      message.success('Đã cập nhật');
      navigate('/banner-packages');
    } catch (e: any) {
      message.error(e?.message || 'Cập nhật thất bại');
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={3} style={{ margin: 0 }}>Sửa gói banner</Title>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </Space>
      </Card>
      <Card loading={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="position" label="Vị trí" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'BELOW_SEARCH_BAR', label: 'BELOW_SEARCH_BAR' },
                { value: 'BELOW_FEATURED_COMPANIES', label: 'BELOW_FEATURED_COMPANIES' },
              ]}
            />
          </Form.Item>
          <Form.Item name="previewImage" label="Ảnh minh họa vị trí">
            <Input />
          </Form.Item>
          <Form.Item name="durationDays" label="Số ngày/đợt" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="price" label="Giá (VND)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="maxBannerSlots" label="Số slot hiển thị" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="priority" label="Ưu tiên">
            <InputNumber min={0} style={{ width: '100%' }} />
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

export default EditBannerPackage;








