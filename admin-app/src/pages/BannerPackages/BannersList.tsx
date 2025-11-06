import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Space, Table, Tag, Typography, message, Image } from 'antd';
import { bannersAPI, type BannerItem } from '../../apis/banners.api';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const BannersList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<BannerItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const navigate = useNavigate();

  const fetchData = async (p = page, l = limit) => {
    try {
      setLoading(true);
      const res = await bannersAPI.list(p, l);
      setItems(res.data || []);
      setTotal(res.total || 0);
    } catch (e: any) {
      console.error('Error fetching banners:', e);
      const errorMsg = e?.response?.data?.message || e?.message || 'Tải danh sách thất bại';
      message.error(errorMsg);
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
      title: 'Xóa banner?',
      content: 'Thao tác này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await bannersAPI.remove(id);
          message.success('Đã xóa');
          fetchData(page, limit);
        } catch (e: any) {
          message.error(e?.message || 'Xóa thất bại');
        }
      },
    });
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await bannersAPI.update(id, { isActive: !currentStatus });
      message.success(`Đã ${!currentStatus ? 'kích hoạt' : 'tắt'} banner`);
      fetchData(page, limit);
    } catch (e: any) {
      message.error(e?.message || 'Cập nhật thất bại');
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={3} style={{ margin: 0 }}>Quản lý Banner</Title>
          <Button onClick={() => navigate('/banner-packages')}>Quay lại</Button>
        </Space>
      </Card>
      <Card>
        <Table
          rowKey={r => r._id}
          loading={loading}
          dataSource={items}
          pagination={{ total, current: page, pageSize: limit, onChange: (cp, ps) => { setPage(cp); setLimit(ps); fetchData(cp, ps); } }}
          columns={[
            { title: 'Tiêu đề', dataIndex: 'title' },
            { title: 'Ảnh', dataIndex: 'imageUrl', render: (v: string) => <Image width={80} src={v} /> },
            { title: 'Vị trí', dataIndex: 'position' },
            { title: 'Link', dataIndex: 'redirectUrl', render: (v: string) => v ? <a href={v} target="_blank" rel="noreferrer">{v}</a> : '-' },
            { title: 'Giá', dataIndex: 'price', render: (v: number) => v?.toLocaleString('vi-VN') + ' VND' },
            { title: 'Duyệt', dataIndex: 'approved', render: (v: boolean) => v ? <Tag color="green">Đã duyệt</Tag> : <Tag color="orange">Chờ duyệt</Tag> },
            { title: 'Hoạt động', dataIndex: 'isActive', render: (v: boolean) => v ? <Tag color="blue">Đang chạy</Tag> : <Tag color="default">Tạm dừng</Tag> },
            { title: 'Lượt xem', dataIndex: 'viewCount', render: (v: number) => v || 0 },
            { title: 'Lượt click', dataIndex: 'clickCount', render: (v: number) => v || 0 },
            {
              title: 'Thao tác',
              render: (_: any, r: BannerItem) => (
                <Space>
                  <Button icon={<EyeOutlined />} onClick={() => handleToggleActive(r._id, r.isActive)}>
                    {r.isActive ? 'Tắt' : 'Bật'}
                  </Button>
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

export default BannersList;

