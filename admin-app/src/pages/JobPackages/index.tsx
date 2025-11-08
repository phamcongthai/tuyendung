import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Space, Table, Tag, Typography, message } from 'antd';
import { jobPackagesAPI, JobPackagePayload } from '../../apis/job-packages.api';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const JobPackagesList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const navigate = useNavigate();

  const fetchData = async (p = page, l = limit) => {
    try {
      setLoading(true);
      const res = await jobPackagesAPI.list(p, l);
      setItems(res.data || []);
      setTotal(res.total || 0);
    } catch (e: any) {
      message.error(e?.message || 'Tải danh sách thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Xóa gói đăng tin?',
      content: 'Thao tác này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await jobPackagesAPI.remove(id);
          message.success('Đã xóa');
          fetchData(page, limit);
        } catch (e: any) {
          message.error(e?.message || 'Xóa thất bại');
        }
      },
    });
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={3} style={{ margin: 0 }}>Gói đăng tin</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/job-packages/create')}>
            Tạo gói
          </Button>
        </Space>
      </Card>
      <Card>
        <Table
          rowKey={r => r._id}
          loading={loading}
          dataSource={items}
          pagination={{ total, current: page, pageSize: limit, onChange: (cp, ps) => { setPage(cp); setLimit(ps); fetchData(cp, ps); } }}
          columns={[
            { title: 'Tên gói', dataIndex: 'packageName' },
            { title: 'Giá (VND)', dataIndex: 'price', render: (v: number) => v?.toLocaleString('vi-VN') },
            { title: 'Thời hạn (ngày)', dataIndex: 'durationDays' },
            { title: 'Giới hạn tin', dataIndex: ['features', 'jobPostLimit'] },
            { title: 'Hỗ trợ', dataIndex: ['features', 'supportLevel'] },
            { title: 'Ưu tiên', dataIndex: 'priorityLevel' },
            { title: 'Trạng thái', dataIndex: 'isActive', render: (v: boolean) => v ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag> },
            {
              title: 'Thao tác',
              render: (_: any, r: any) => (
                <Space>
                  <Button icon={<EditOutlined />} onClick={() => navigate(`/job-packages/edit/${r._id}`)}>Sửa</Button>
                  <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(r._id)}>Xóa</Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default JobPackagesList;








