import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Space, Button, Typography, Image, Tag, message } from 'antd';
import { bannerOrdersAPI, type BannerOrderItem } from '../../apis/banner-orders.api';

const { Title } = Typography;

const PendingOrders: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<BannerOrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const fetchData = async (p = page, l = limit) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await bannerOrdersAPI.list({ page: p, limit: l, packageId: id, status: 'PAID' });
      const pending = (res.data || []).filter(o => !o.bannerId);
      setItems(pending);
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
  }, [id]);

  const handleApprove = async (orderId: string) => {
    try {
      await bannerOrdersAPI.approve(orderId);
      message.success('Đã duyệt và tạo banner');
      fetchData(page, limit);
    } catch (e: any) {
      message.error(e?.message || 'Duyệt thất bại');
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={3} style={{ margin: 0 }}>Đơn chờ duyệt của gói</Title>
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
            { title: 'Link', dataIndex: 'redirectUrl' },
            { title: 'Số tiền', dataIndex: 'amount', render: (v: number) => v?.toLocaleString('vi-VN') },
            { title: 'Trạng thái', dataIndex: 'status', render: (v: string) => <Tag color={v === 'PAID' ? 'green' : 'orange'}>{v}</Tag> },
            {
              title: 'Thao tác',
              render: (_: any, r: BannerOrderItem) => (
                <Space>
                  <Button type="primary" onClick={() => handleApprove(r._id)} disabled={!!r.bannerId || r.status !== 'PAID'}>
                    Duyệt & tạo banner
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default PendingOrders;


