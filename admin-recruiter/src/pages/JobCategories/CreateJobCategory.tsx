import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, Typography, Row, Col } from 'antd';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { createJobCategory } from '../../apis/job-categories.api';

const { Title } = Typography;

const CreateJobCategory: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      await createJobCategory(values);
      Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Tạo danh mục thành công' });
      navigate('/job-categories');
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Không thể tạo danh mục' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={20} md={16} lg={14} xl={12}>
        <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', padding: 24 }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Tạo danh mục công việc</Title>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
              <Input placeholder="VD: Lập trình, Thiết kế" />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={4} placeholder="Mô tả ngắn về danh mục" />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" initialValue="active" rules={[{ required: true }] }>
              <Select options={[{ value: 'active', label: 'Hoạt động' }, { value: 'inactive', label: 'Không hoạt động' }]} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting} block>
                Tạo mới
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default CreateJobCategory;


