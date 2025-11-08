import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, Space, message, Popconfirm, Tag, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { hollandAPI } from '../../apis/holland.api';
import type { HollandQuestion } from '../../apis/holland.api';

const { TextArea } = Input;

const CATEGORIES = [
  { value: 'R', label: 'R - Realistic (Thực tế)', color: 'blue' },
  { value: 'I', label: 'I - Investigative (Nghiên cứu)', color: 'green' },
  { value: 'A', label: 'A - Artistic (Nghệ thuật)', color: 'purple' },
  { value: 'S', label: 'S - Social (Xã hội)', color: 'orange' },
  { value: 'E', label: 'E - Enterprising (Kinh doanh)', color: 'red' },
  { value: 'C', label: 'C - Conventional (Truyền thống)', color: 'cyan' },
];

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<HollandQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [counts, setCounts] = useState<Record<string, number>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await hollandAPI.getQuestions();
      setQuestions(data.questions || []);
      setCounts(data.counts || {});
    } catch (error: any) {
      message.error('Lỗi khi tải dữ liệu: ' + error.message);
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
    form.setFieldsValue({
      options: [
        { label: 'Rất không thích', value: 0 },
        { label: 'Không thích', value: 1 },
        { label: 'Bình thường', value: 2 },
        { label: 'Thích', value: 3 },
        { label: 'Rất thích', value: 4 }
      ]
    });
    setModalVisible(true);
  };

  const handleEdit = async (record: HollandQuestion) => {
    setEditingId(record._id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await hollandAPI.deleteQuestion(id);
      message.success('Đã xóa câu hỏi');
      loadData();
    } catch (error: any) {
      message.error('Lỗi khi xóa: ' + error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await hollandAPI.updateQuestion(editingId, values);
        message.success('Đã cập nhật câu hỏi');
      } else {
        await hollandAPI.createQuestion(values);
        message.success('Đã tạo câu hỏi mới');
      }
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error('Lỗi: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a: HollandQuestion, b: HollandQuestion) => a.order - b.order,
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'Nhóm',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat: string) => {
        const item = CATEGORIES.find(c => c.value === cat);
        return <Tag color={item?.color}>{cat}</Tag>;
      },
      filters: CATEGORIES.map(c => ({ text: c.label, value: c.value })),
      onFilter: (value: any, record: HollandQuestion) => record.category === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: HollandQuestion) => (
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
        message="Hướng dẫn tạo câu hỏi Holland Test (RIASEC)"
        description={
          <div>
            <p><strong>Quy tắc tính điểm (đã fix cứng):</strong></p>
            <ul style={{ marginBottom: 8 }}>
              <li>Rất không thích = 0 điểm</li>
              <li>Không thích = 1 điểm</li>
              <li>Bình thường = 2 điểm</li>
              <li>Thích = 3 điểm</li>
              <li>Rất thích = 4 điểm</li>
            </ul>
            <p><strong>Nhóm RIASEC:</strong></p>
            <ul style={{ marginBottom: 0 }}>
              <li><Tag color="blue">R - Realistic</Tag>: Thực tế (thích làm việc với máy móc, công cụ, thủ công)</li>
              <li><Tag color="green">I - Investigative</Tag>: Nghiên cứu (thích tư duy, phân tích, giải quyết vấn đề)</li>
              <li><Tag color="purple">A - Artistic</Tag>: Nghệ thuật (thích sáng tạo, thẩm mỹ, nghệ thuật)</li>
              <li><Tag color="orange">S - Social</Tag>: Xã hội (thích giúp đỡ, dạy dỗ, chăm sóc người khác)</li>
              <li><Tag color="red">E - Enterprising</Tag>: Kinh doanh (thích lãnh đạo, thuyết phục, bán hàng)</li>
              <li><Tag color="cyan">C - Conventional</Tag>: Truyền thống (thích tổ chức, quản lý dữ liệu, làm theo quy trình)</li>
            </ul>
            <p style={{ marginTop: 8 }}><strong>Khuyến nghị:</strong> Nên có 8 câu hỏi cho mỗi nhóm (tổng 48 câu)</p>
          </div>
        }
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        style={{ marginBottom: 16 }}
      />

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Quản lý câu hỏi Holland Test</h2>
          <Space>
            {CATEGORIES.map(cat => (
              <Tag key={cat.value} color={cat.color}>
                {cat.value}: {counts[cat.value] || 0} câu
              </Tag>
            ))}
          </Space>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm câu hỏi
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={questions}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title={editingId ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Alert
          message="Lưu ý"
          description="Thang điểm đã được fix cứng: Rất không thích (0) → Rất thích (4). Bạn chỉ cần nhập nội dung câu hỏi và chọn nhóm."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Form form={form} layout="vertical">
          <Form.Item
            name="order"
            label="Số thứ tự"
            rules={[{ required: true, message: 'Vui lòng nhập số thứ tự' }]}
            tooltip="Thứ tự hiển thị câu hỏi trong bài test"
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="Ví dụ: 1, 2, 3..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung câu hỏi"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
            tooltip="Câu hỏi nên bắt đầu bằng 'Bạn thích...' hoặc 'Bạn có hứng thú với...'"
          >
            <TextArea 
              rows={3} 
              placeholder="Ví dụ: Bạn thích làm việc với máy móc, công cụ và thiết bị" 
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Nhóm RIASEC"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm' }]}
            tooltip="Chọn nhóm tính cách phù hợp với nội dung câu hỏi"
          >
            <Select 
              options={CATEGORIES} 
              placeholder="Chọn nhóm R, I, A, S, E hoặc C"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Questions;
