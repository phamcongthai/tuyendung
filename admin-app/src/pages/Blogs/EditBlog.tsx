import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Space, message, Switch } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { blogsApi, Blog } from '../../apis/blogs.api';
import { useParams } from 'react-router-dom';

const EditBlog: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const items = await blogsApi.listAdmin();
        const item = items.find(x => x._id === id);
        if (item) form.setFieldsValue({ ...item, tags: (item.tags || []).join(', ') });
      } catch (e: any) {
        message.error(e?.message || 'Không tải được blog');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id, form]);

  const handleUpload = async (file: File) => {
    try {
      const { secure_url } = await blogsApi.uploadImage(file);
      form.setFieldsValue({ coverImageUrl: secure_url });
      message.success('Tải ảnh thành công');
    } catch (e: any) {
      message.error(e?.message || 'Tải ảnh thất bại');
    }
  };

  const onFinish = async (values: any) => {
    if (!id) return;
    setSaving(true);
    try {
      const payload: Partial<Blog> = {
        title: values.title,
        excerpt: values.excerpt || '',
        content: values.content,
        coverImageUrl: values.coverImageUrl,
        tags: (values.tags as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        published: Boolean(values.published),
      };
      await blogsApi.update(id, payload);
      message.success('Đã lưu blog');
    } catch (e: any) {
      message.error(e?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Sửa Blog" loading={loading}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>
        <Form.Item label="Mô tả ngắn" name="excerpt">
          <Input.TextArea rows={3} placeholder="Mô tả ngắn" />
        </Form.Item>
        <Form.Item label="Ảnh minh họa (bắt buộc)" name="coverImageUrl" rules={[{ required: true, message: 'Tải ảnh minh họa' }]}>
          <Space align="start">
            <label className="ant-btn" style={{ cursor: 'pointer' }}>
              <UploadOutlined /> <span style={{ marginLeft: 6 }}>Chọn ảnh</span>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.currentTarget.value = '';
              }} />
            </label>
            {form.getFieldValue('coverImageUrl') && (
              <img src={form.getFieldValue('coverImageUrl')} alt="cover" style={{ height: 80, objectFit: 'cover', border: '1px solid #f0f0f0', borderRadius: 8, padding: 6, background: '#fff' }} />
            )}
          </Space>
        </Form.Item>
        <Form.Item label="Nội dung" name="content" rules={[{ required: true, message: 'Nhập nội dung' }]}>
          <Input.TextArea rows={12} placeholder="Nội dung blog" />
        </Form.Item>
        <Form.Item label="Tags (phân tách bởi dấu phẩy)" name="tags">
          <Input placeholder="ví dụ: hr, tuyển dụng, cv" />
        </Form.Item>
        <Form.Item label="Xuất bản" name="published" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>Lưu</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditBlog;


