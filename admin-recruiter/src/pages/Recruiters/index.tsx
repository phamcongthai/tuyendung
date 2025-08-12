import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Typography, Select, Row, Col } from 'antd';
import { fetchRecruiters, deleteRecruiter, toggleRecruiterStatus } from '../../apis/recruiter.api';
import { useNavigate } from 'react-router-dom';
import { TableSkeleton } from '../../components/Skeleton';
import Swal from 'sweetalert2';
import { UserOutlined } from '@ant-design/icons';
import EmptyBox from '../../components/EmptyBox';

const { Title } = Typography;
const { Option } = Select;

const RecruiterList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | ''>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const navigate = useNavigate();

  const getData = async (pageNum = 1, searchText = '', status = '') => {
    setLoading(true);
    try {
      const res = await fetchRecruiters({
        page: pageNum,
        limit: 10,
        search: searchText,
        status: (status as 'active' | 'inactive') || undefined,
      }) as { data: any[]; total: number };

      setData(res.data || []);
      setTotal(res.total || 0);
    } catch (e) {
      console.error('❌ Lỗi khi fetch recruiters:', e);
      setData([]);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể tải danh sách',
        confirmButtonText: 'OK',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getData(page, search, statusFilter);
  }, [page, search, statusFilter]);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn có chắc chắn muốn xóa nhà tuyển dụng này? Hành động này không thể hoàn tác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRecruiter(id);
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Đã xóa nhà tuyển dụng thành công',
            confirmButtonText: 'OK',
          });
          getData(page, search, statusFilter);
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: error?.response?.data?.message || 'Không thể xóa nhà tuyển dụng',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const statusText = newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa';

    Swal.fire({
      title: 'Xác nhận thay đổi trạng thái',
      text: `Bạn có chắc chắn muốn ${statusText} nhà tuyển dụng này?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Có, thay đổi!',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await toggleRecruiterStatus(id);
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: `Đã ${statusText} nhà tuyển dụng thành công`,
            confirmButtonText: 'OK',
          });
          getData(page, search, statusFilter);
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: error?.response?.data?.message || 'Không thể thay đổi trạng thái',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  const columns = [
    {
      title: 'Họ tên',
      key: 'fullName',
      render: (_: any, record: any) => (
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
            {record.avatar ? (
              <img
                src={record.avatar}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <UserOutlined style={{ color: '#1890ff', fontSize: 16 }} />
            )}
          </div>
          <span style={{ fontFamily: 'Roboto, sans-serif' }}>{record.fullName}</span>
        </Space>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Công ty', dataIndex: 'company', key: 'company' },
    { title: 'Tỉnh/TP', dataIndex: 'province', key: 'province' },
    { title: 'Quận/Huyện', dataIndex: 'district', key: 'district' },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: any) => (
        <Button
          type="text"
          size="small"
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: record.status === 'active' ? '#f6ffed' : '#fff2f0',
            color: record.status === 'active' ? '#52c41a' : '#ff4d4f',
            border: `1px solid ${record.status === 'active' ? '#b7eb8f' : '#ffccc7'}`,
            cursor: 'pointer',
            fontFamily: 'Roboto, sans-serif',
          }}
          onClick={() => handleToggleStatus(record._id, record.status)}
        >
          {record.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Button>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" onClick={() => navigate(`/recruiters/detail/${record._id}`)}>
            Chi tiết
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
            onClick={() => navigate(`/recruiters/edit/${record._id}`)}
          >
            Sửa
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record._id)}>
            Xoá
          </Button>
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
          <Title level={3}>Danh sách nhà tuyển dụng</Title>
          <Button type="primary" onClick={() => navigate('/recruiters/create')}>
            Tạo mới
          </Button>
        </Space>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Input.Search
              placeholder="Tìm kiếm theo tên, email, công ty..."
              allowClear
              enterButton
              style={{ width: '100%' }}
              onSearch={(val) => {
                setPage(1);
                setSearch(val);
              }}
            />
          </Col>
          <Col span={12}>
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              style={{ width: '100%' }}
              value={statusFilter || undefined}
              onChange={(value) => {
                setPage(1);
                setStatusFilter(value as 'active' | 'inactive' | '');
              }}
            >
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
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Title level={3}>Danh sách nhà tuyển dụng</Title>
        <Button type="primary" onClick={() => navigate('/recruiters/create')}>
          Tạo mới
        </Button>
      </Space>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input.Search
            placeholder="Tìm kiếm theo tên, email, công ty..."
            allowClear
            enterButton
            style={{ width: '100%' }}
            onSearch={(val) => {
              setPage(1);
              setSearch(val);
            }}
          />
        </Col>
        <Col span={12}>
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: '100%' }}
            value={statusFilter || undefined}
            onChange={(value) => {
              setPage(1);
              setStatusFilter(value as 'active' | 'inactive' | '');
            }}
          >
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
        </Col>
      </Row>

      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <span>Đã chọn {selectedRowKeys.length} nhà tuyển dụng</span>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="_id"
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
        }}
        pagination={{
          current: page,
          pageSize: 10,
          total,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
        bordered
        style={{ background: '#fff', borderRadius: 8 }}
      />
    </div>
  );
};

export default RecruiterList;
