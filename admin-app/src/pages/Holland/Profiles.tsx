import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Tag, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { hollandAPI } from '../../apis/holland.api';
import type { HollandProfile } from '../../apis/holland.api';

const { TextArea } = Input;

const Profiles: React.FC = () => {
  const [profiles, setProfiles] = useState<HollandProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await hollandAPI.getProfiles();
      setProfiles((data as HollandProfile[]) || []);
    } catch (error: any) {
      message.error('Lỗi khi tải dữ liệu: ' + error.message);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = async (record: HollandProfile) => {
    setEditingId(record._id);
    form.setFieldsValue({
      ...record,
      suitableCareers: record.suitableCareers?.join('\n'),
      suggestedSkills: record.suggestedSkills?.join('\n'),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await hollandAPI.deleteProfile(id);
      message.success('Đã xóa profile');
      loadData();
    } catch (error: any) {
      message.error('Lỗi khi xóa: ' + error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        suitableCareers: values.suitableCareers?.split('\n').filter((s: string) => s.trim()),
        suggestedSkills: values.suggestedSkills?.split('\n').filter((s: string) => s.trim()),
      };
      
      if (editingId) {
        await hollandAPI.updateProfile(editingId, data);
        message.success('Đã cập nhật profile');
      } else {
        await hollandAPI.createProfile(data);
        message.success('Đã tạo profile mới');
      }
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error('Lỗi: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Nghề nghiệp',
      dataIndex: 'suitableCareers',
      key: 'suitableCareers',
      render: (careers: string[]) => careers?.length || 0,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: HollandProfile) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Alert
        message="Hướng dẫn tạo Holland Profile"
        description={
          <div>
            <p><strong>Profile là mô tả chi tiết về nhóm tính cách</strong></p>
            <ul style={{ marginBottom: 0 }}>
              <li><strong>Mã (Code):</strong> Top 3 nhóm RIASEC, VD: "A-S-E", "R-I-C", "I-A-S"</li>
              <li><strong>Tiêu đề:</strong> Tên gọi của nhóm tính cách</li>
              <li><strong>Mô tả:</strong> Giải thích đặc điểm của nhóm này</li>
              <li><strong>Nghề nghiệp phù hợp:</strong> Danh sách nghề (mỗi dòng 1 nghề)</li>
              <li><strong>Kỹ năng gợi ý:</strong> Kỹ năng nên phát triển (mỗi dòng 1 kỹ năng)</li>
            </ul>
          </div>
        }
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        style={{ marginBottom: 16 }}
      />

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản lý Holland Profiles</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm Profile
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={profiles}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title={editingId ? 'Sửa Profile' : 'Thêm Profile mới'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Mã (VD: A-S-E)"
            rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
          >
            <Input placeholder="A-S-E" />
          </Form.Item>

          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Người sáng tạo - Xã hội - Kinh doanh" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} placeholder="Mô tả chi tiết về nhóm tính cách này" />
          </Form.Item>

          <Form.Item
            name="suitableCareers"
            label="Nghề nghiệp phù hợp (mỗi dòng 1 nghề)"
          >
            <TextArea rows={5} placeholder="Designer&#10;Marketing Manager&#10;Content Creator" />
          </Form.Item>

          <Form.Item
            name="suggestedSkills"
            label="Kỹ năng gợi ý (mỗi dòng 1 kỹ năng)"
          >
            <TextArea rows={5} placeholder="Sáng tạo&#10;Giao tiếp&#10;Quản lý dự án" />
          </Form.Item>

          <Form.Item name="image" label="URL hình ảnh">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profiles;
