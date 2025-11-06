import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Input, Select, Typography, Row, Col } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { TableSkeleton } from '../../components/Skeleton';
import Swal from 'sweetalert2';
import EmptyBox from '../../components/EmptyBox';
import { fetchJobCategories, deleteJobCategory, toggleJobCategoryStatus } from '../../apis/job-categories.api';
import type { JobCategoryData } from '../../types/job-categories.type';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const JobCategoriesList: React.FC = () => {
  const [data, setData] = useState<JobCategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | ''>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const navigate = useNavigate();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetchJobCategories({ page, limit: 10, search, status: statusFilter || undefined });
      setData(res.data || []);
      setTotal(res.total || 0);
    } catch (e) {
      setData([]);
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Không thể tải danh sách danh mục' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, search, statusFilter]);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Hành động này không thể hoàn tác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteJobCategory(id);
          Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Đã xóa danh mục' });
          getData();
        } catch (error: any) {
          Swal.fire({ icon: 'error', title: 'Lỗi!', text: error?.response?.data?.message || 'Không thể xóa' });
        }
      }
    });
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleJobCategoryStatus(id);
      getData();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: error?.response?.data?.message || 'Không thể cập nhật trạng thái' });
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      render: (text: string) => (
        <Space>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#1890ff22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppstoreOutlined style={{ color: '#1890ff', fontSize: 16 }} />
          </div>
          <span style={{ fontFamily: 'Roboto, sans-serif' }}>{text}</span>
        </Space>
      ),
    },
    { title: 'Mô tả', dataIndex: 'description', ellipsis: true },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string, record: JobCategoryData) => (
        <Button
          type="text"
          size="small"
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: status === 'active' ? '#f6ffed' : '#fff2f0',
            color: status === 'active' ? '#52c41a' : '#ff4d4f',
            border: `1px solid ${status === 'active' ? '#b7eb8f' : '#ffccc7'}`,
            cursor: 'pointer',
            fontFamily: 'Roboto, sans-serif',
          }}
          onClick={() => handleToggleStatus(record._id)}
        >
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Button>
      ),
      width: 150,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 160,
      render: (_: any, record: JobCategoryData) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/job-categories/detail/${record._id}`)} />
          <Button type="primary" size="small" icon={<EditOutlined />} style={{ backgroundColor: '#faad14', borderColor: '#faad14' }} onClick={() => navigate(`/job-categories/edit/${record._id}`)} />
          <Button type="primary" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
        </Space>
      ),
    },
  ];

  if (loading && data.length === 0) {
    return <TableSkeleton rowCount={8} />;
  }

  if (!loading && data.length === 0) {
    return (
      <div style={{ padding: 32, fontFamily: 'Roboto, sans-serif' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
          <Title level={3}>Danh mục công việc</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/job-categories/create')}>Tạo mới</Button>
        </Space>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Search placeholder="Tìm kiếm theo tên danh mục..." allowClear enterButton style={{ width: '100%' }} onSearch={(value) => { setSearch(value); setPage(1); }} />
          </Col>
          <Col span={12}>
            <Select placeholder="Lọc trạng thái" allowClear style={{ width: '100%' }} value={statusFilter || undefined} onChange={(v) => { setStatusFilter((v as any) || ''); setPage(1); }}>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Col>
        </Row>

        <EmptyBox />
      </div>
    );
  }

  return (
    <div style={{ padding: 32, fontFamily: 'Roboto, sans-serif' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={3}>Danh mục công việc</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/job-categories/create')}>Tạo mới</Button>
      </Space>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Search placeholder="Tìm kiếm theo tên danh mục..." allowClear enterButton style={{ width: '100%' }} onSearch={(value) => { setSearch(value); setPage(1); }} />
        </Col>
        <Col span={12}>
          <Select placeholder="Lọc trạng thái" allowClear style={{ width: '100%' }} value={statusFilter || undefined} onChange={(v) => { setStatusFilter((v as any) || ''); setPage(1); }}>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
        </Col>
      </Row>

      <Table
        rowKey="_id"
        columns={columns as any}
        dataSource={data}
        loading={loading}
        rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
        pagination={{ current: page, pageSize: 10, total, onChange: (p) => setPage(p), showSizeChanger: false }}
        bordered
        style={{ background: '#fff', borderRadius: 8 }}
      />
    </div>
  );
};

export default JobCategoriesList;


