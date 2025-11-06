import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Space, Table, Tag, Typography, message } from 'antd';
import { bannerPackagesAPI } from '../../apis/banner-packages.api';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const BannerPackagesList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const navigate = useNavigate();

  const fetchData = async (p = page, l = limit) => {
    try {
      setLoading(true);
      const res = await bannerPackagesAPI.list(p, l);
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
      title: 'Xóa gói banner?',
      content: 'Thao tác này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await bannerPackagesAPI.remove(id);
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
          <Title level={3} style={{ margin: 0 }}>Gói Banner</Title>
          <Space>
            <Button onClick={() => navigate('/banner-packages/banners')}>Quản lý Banner</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/banner-packages/create')}>
              Tạo gói
            </Button>
          </Space>
        </Space>
      </Card>
      <Card>
        <Table
          rowKey={r => r._id}
          loading={loading}
          dataSource={items}
          pagination={{ total, current: page, pageSize: limit, onChange: (cp, ps) => { setPage(cp); setLimit(ps); fetchData(cp, ps); } }}
          columns={[
            { title: 'Tên', dataIndex: 'name' },
            { title: 'Vị trí', dataIndex: 'position' },
            { title: 'Giá (VND)', dataIndex: 'price', render: (v: number) => v?.toLocaleString('vi-VN') },
            { title: 'Ngày/đợt', dataIndex: 'durationDays' },
            { title: 'Slots', dataIndex: 'maxBannerSlots' },
            { title: 'Ưu tiên', dataIndex: 'priority' },
            { title: 'Trạng thái', dataIndex: 'isActive', render: (v: boolean) => v ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag> },
            {
              title: 'Thao tác',
              render: (_: any, r: any) => (
                <Space>
                  <Button onClick={() => navigate(`/banner-packages/${r._id}/pending-orders`)}>Đơn chờ duyệt</Button>
                  <Button icon={<EditOutlined />} onClick={() => navigate(`/banner-packages/edit/${r._id}`)}>Sửa</Button>
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

export default BannerPackagesList;



