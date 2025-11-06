import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, message, Switch } from 'antd';
import { UploadOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { blogsApi } from '../../apis/blogs.api';

const CreateBlog: React.FC = () => {
  const [form] = Form.useForm<any>();
  const [saving, setSaving] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      const { secure_url } = await blogsApi.uploadImage(file);
      form.setFieldsValue({ coverImageUrl: secure_url });
      message.success('Tải ảnh thành công');
    } catch (e: any) {
      message.error(e?.message || 'Tải ảnh thất bại');
    }
  };

  const toHtmlContent = (blocks: { title?: string; imageUrl?: string; text?: string }[] = []) => {
    const parts: string[] = [];
    const escapeHtml = (s: string) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    blocks.forEach((b) => {
      if (b?.title) {
        parts.push(`<h3>${escapeHtml(b.title)}</h3>`);
      }
      if (b?.imageUrl) {
        parts.push(`<p><img src="${b.imageUrl}" alt="" /></p>`);
      }
      if (b?.text) {
        const escaped = escapeHtml(b.text as string)
          .replace(/\n/g, '<br/>');
        parts.push(`<p>${escaped}</p>`);
      }
    });
    return parts.join('\n');
  };

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      const blocks = (values.blocks as any[]) || [];
      const payload = {
        title: values.title,
        excerpt: values.excerpt || '',
        content: toHtmlContent(blocks),
        coverImageUrl: values.coverImageUrl,
        tags: (values.tags as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        published: Boolean(values.published),
      };
      await blogsApi.create(payload as any);
      message.success('Đã tạo blog');
      form.resetFields();
    } catch (e: any) {
      message.error(e?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Tạo Blog">
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ blocks: [{ title: '', imageUrl: '', text: '' }] }}>
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
        <Form.List name="blocks" rules={[{ validator: async (_, value) => { if (!value || value.length === 0) return Promise.reject(new Error('Thêm ít nhất 1 block nội dung')); } }]}>
          {(fields, { add, remove }, { errors }) => (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Nội dung</div>
              {fields.map((field, index) => (
                <Card key={field.key} size="small" title={`Block #${index + 1}`} style={{ marginBottom: 12 }} extra={<Button danger onClick={() => remove(field.name)}>Xóa block</Button>}>
                  <Form.Item name={[field.name, 'title']} label="Tiêu đề block" rules={[{ required: true, message: 'Nhập tiêu đề cho block' }]}>
                    <Input placeholder="Nhập tiêu đề cho block này" />
                  </Form.Item>
                  <Space align="start" style={{ width: '100%' }}>
                    <Form.Item noStyle shouldUpdate>
                      {() => (
                        <div>
                          <label className="ant-btn" style={{ cursor: 'pointer', marginRight: 12 }}>
                            <UploadOutlined /> <span style={{ marginLeft: 6 }}>Ảnh nội dung</span>
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const { secure_url } = await blogsApi.uploadImage(file);
                                  const current = form.getFieldValue('blocks') || [];
                                  current[index] = { ...(current[index] || {}), imageUrl: secure_url };
                                  form.setFieldsValue({ blocks: current });
                                  message.success('Tải ảnh thành công');
                                } catch (err: any) {
                                  message.error(err?.message || 'Tải ảnh thất bại');
                                } finally {
                                  e.currentTarget.value = '';
                                }
                              } else {
                                e.currentTarget.value = '';
                              }
                            }} />
                          </label>
                          <Form.Item name={[field.name, 'imageUrl']} style={{ display: 'inline-block', marginBottom: 0 }}>
                            <Input placeholder="URL ảnh (tùy chọn)" style={{ width: 320 }} />
                          </Form.Item>
                        </div>
                      )}
                    </Form.Item>
                  </Space>
                  <Form.Item name={[field.name, 'text']} style={{ marginTop: 8 }}>
                    <Input.TextArea rows={6} placeholder="Nội dung cho block này" />
                  </Form.Item>
                </Card>
              ))}
              <Form.ErrorList errors={errors} />
              <Button type="dashed" onClick={() => add({ title: '', imageUrl: '', text: '' })} icon={<PlusOutlined />}>Thêm block</Button>
            </div>
          )}
        </Form.List>
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

export default CreateBlog;


