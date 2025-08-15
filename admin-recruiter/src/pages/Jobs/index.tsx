import { useEffect, useState } from 'react';
import { Button, Table, Tag, Space, Popconfirm, Input, Select, message, Typography, Card, Row, Col } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, RiseOutlined } from '@ant-design/icons';
import { fetchJobs, deleteJob, toggleJobStatus } from '../../apis/jobs.api';
import type { JobData } from '../../types/jobs.type';
import { JobsStatus } from '../../types/jobs.enum';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useNavigate } from 'react-router-dom';
import { TableSkeleton } from '../../components/Skeleton';
import Swal from 'sweetalert2';
import EmptyBox from '../../components/EmptyBox';

dayjs.locale('vi');
const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

export default function JobList() {
  const [data, setData] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobsStatus | undefined>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const navigate = useNavigate();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetchJobs({
        page,
        limit: 10,
        search,
        status: statusFilter,
      });
      setData(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error('❌ Lỗi khi fetch jobs:', err);
      setData([]);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể tải danh sách công việc',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, search, statusFilter]);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteJob(id);
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Đã xóa công việc thành công',
            confirmButtonText: 'OK',
          });
          getData();
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: error?.response?.data?.message || 'Không thể xóa công việc',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleJobStatus(id);
      message.success('Cập nhật trạng thái thành công');
      getData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error?.response?.data?.message || 'Không thể cập nhật trạng thái',
        confirmButtonText: 'OK',
      });
    }
  };

  const formatSalary = (min?: number, max?: number, type?: string) => {
    if (!min && !max) return 'Thỏa thuận';
    const fmt = (v: number) => v.toLocaleString('vi-VN');
    return `${min ? fmt(min) : ''}${max ? ` - ${fmt(max)}` : ''} ${type || ''}`.trim();
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      render: (text: string, record: JobData) => (
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
            <RiseOutlined style={{ color: '#1890ff', fontSize: 16 }} />
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: 14, color: '#262626' }}>{text}</div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>{record.location || '-'}</div>
          </div>
        </Space>
      ),
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Ngành nghề',
      dataIndex: 'categoryId',
      width: 160,
      ellipsis: true,
      render: (_: any, record: JobData) => (
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>
          {(record as any)?.categoryId?.title || record.career || '-'}
        </span>
      ),
    },
    {
      title: 'Cấp bậc',
      dataIndex: 'level',
      width: 100,
      render: (text: string) => (
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>{text || '-'}</span>
      ),
    },
    {
      title: 'Loại hình',
      dataIndex: 'jobType',
      width: 120,
      render: (text: string) => (
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>{text || '-'}</span>
      ),
    },
    {
      title: 'Lương',
      render: (_: any, record: JobData) => (
        <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '500' }}>
          {formatSalary(record.salaryMin, record.salaryMax, record.salaryType)}
        </span>
      ),
      width: 150,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 90,
      render: (val: number) => (
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>{val ?? '-'}</span>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      width: 90,
      render: (val: number) => (
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>{val ?? '-'}</span>
      ),
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'deadline',
      width: 130,
      render: (date: string) => (
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>
          {date ? dayjs(date).format('DD/MM/YYYY') : '-'}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (status: JobsStatus, record: JobData) => (
        <Button
          type="text"
          size="small"
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: status === JobsStatus.ACTIVE ? '#f6ffed' : '#fff2f0',
            color: status === JobsStatus.ACTIVE ? '#52c41a' : '#ff4d4f',
            border: `1px solid ${status === JobsStatus.ACTIVE ? '#b7eb8f' : '#ffccc7'}`,
            cursor: 'pointer',
            fontFamily: 'Roboto, sans-serif',
          }}
          onClick={() => handleToggleStatus(record._id)}
        >
          {status === JobsStatus.ACTIVE ? 'Hoạt động' : 'Không hoạt động'}
        </Button>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: JobData) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/jobs/detail/${record._id}`)}
            title="Xem chi tiết"
          />
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
            onClick={() => navigate(`/jobs/edit/${record._id}`)}
            title="Chỉnh sửa"
          />
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            title="Xóa"
          />
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
        <Space
          style={{
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <Title level={3}>Danh sách công việc</Title>
          <Button type="primary" onClick={() => navigate('/jobs/create')}>
            Tạo mới
          </Button>
        </Space>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Search
              placeholder="Tìm kiếm theo tiêu đề, ngành nghề..."
              allowClear
              enterButton
              style={{ width: '100%' }}
              onSearch={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
          </Col>
          <Col span={12}>
            <Select
              placeholder="Lọc trạng thái"
              style={{ width: '100%' }}
              allowClear
              value={statusFilter || undefined}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <Option value={JobsStatus.ACTIVE}>Hoạt động</Option>
              <Option value={JobsStatus.INACTIVE}>Không hoạt động</Option>
            </Select>
          </Col>
        </Row>

        <EmptyBox />
      </div>
    );
  }

  return (
    <div style={{ padding: 32, fontFamily: 'Roboto, sans-serif' }}>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Title level={3}>Danh sách công việc</Title>
        <Button type="primary" onClick={() => navigate('/jobs/create')}>
          Tạo mới
        </Button>
      </Space>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Search
            placeholder="Tìm kiếm theo tiêu đề, ngành nghề..."
            allowClear
            enterButton
            style={{ width: '100%' }}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
        </Col>
        <Col span={12}>
          <Select
            placeholder="Lọc trạng thái"
            style={{ width: '100%' }}
            allowClear
            value={statusFilter || undefined}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <Option value={JobsStatus.ACTIVE}>Hoạt động</Option>
            <Option value={JobsStatus.INACTIVE}>Không hoạt động</Option>
          </Select>
        </Col>
      </Row>

      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <span>Đã chọn {selectedRowKeys.length} công việc</span>
        </div>
      )}

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
        }}
        pagination={{
          current: page,
          total,
          pageSize: 10,
          showSizeChanger: false,
          onChange: (p) => setPage(p),
        }}
        scroll={{ x: 1300 }}
        bordered
        style={{ background: '#fff', borderRadius: 8 }}
      />
    </div>
  );
}
