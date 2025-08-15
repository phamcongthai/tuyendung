import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Card, Typography, Row, Col } from 'antd';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { editJobCategory, fetchJobCategoryById } from '../../apis/job-categories.api';

const { Title } = Typography;

const EditJobCategory: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJobCategoryById(id!);
        form.setFieldsValue(data);
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Không thể tải dữ liệu' });
        navigate('/job-categories');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      await editJobCategory(id!, values);
      Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Cập nhật danh mục thành công' });
      navigate('/job-categories');
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Không thể cập nhật' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={20} md={16} lg={14} xl={12}>
        <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', padding: 24 }} loading={loading}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Chỉnh sửa danh mục</Title>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }] }>
              <Select options={[{ value: 'active', label: 'Hoạt động' }, { value: 'inactive', label: 'Không hoạt động' }]} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={saving} block>
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default EditJobCategory;


