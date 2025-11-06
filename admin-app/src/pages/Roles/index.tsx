import { useEffect, useState } from 'react';
import { Button, Table, Tag, Space, Input, Select, Typography, Row, Col } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';
import { fetchRoles, deleteRole } from '../../apis/roles.api';
import type { RoleData } from '../../types/roles.type';
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

interface RolesResponse {
  data: RoleData[];
  total: number;
  page: number;
  limit: number;
}

export default function RolesList() {
  const [data, setData] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const navigate = useNavigate();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetchRoles({
        page,
        limit: 10,
        search,
        status: statusFilter || undefined,
      }) as RolesResponse;
      setData(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error('❌ Lỗi khi fetch roles:', err);
      setData([]);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể tải danh sách vai trò',
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
      text: 'Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRole(id);
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Đã xóa vai trò thành công',
            confirmButtonText: 'OK',
          });
          getData();
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: error?.response?.data?.message || 'Không thể xóa vai trò',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'green' : 'red';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Hoạt động' : 'Không hoạt động';
  };

  const columns = [
    {
      title: 'Tên vai trò',
      key: 'name',
      render: (record: RoleData) => (
        <Space>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#722ed122',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KeyOutlined style={{ color: '#722ed1' }} />
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: 14, color: '#262626' }}>{record.name}</div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>
              {record.permissions.length} quyền
            </div>
          </div>
        </Space>
      ),
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Quyền hạn',
      key: 'permissions',
      width: 300,
      render: (record: RoleData) => (
        <div>
          {record.permissions.slice(0, 3).map((permission, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: 4, fontFamily: 'Roboto, sans-serif' }}>
              {permission}
            </Tag>
          ))}
          {record.permissions.length > 3 && (
            <Tag color="default" style={{ marginBottom: 4, fontFamily: 'Roboto, sans-serif' }}>
              +{record.permissions.length - 3} quyền khác
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (record: RoleData) => (
        <Tag 
          color={getStatusColor(record.isActive)} 
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          {getStatusText(record.isActive)}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      width: 120,
      render: (record: RoleData) => (
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>
          {dayjs(record.createdAt).format('DD/MM/YYYY')}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (record: RoleData) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/roles/detail/${record._id}`)}
            title="Xem chi tiết"
          />
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
            onClick={() => navigate(`/roles/edit/${record._id}`)}
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
          <Title level={3}>Quản lý quyền</Title>
          <Button type="primary" onClick={() => navigate('/roles/create')}>
            Tạo mới
          </Button>
        </Space>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Search
              placeholder="Tìm kiếm theo tên vai trò..."
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
        <Title level={3}>Quản lý quyền</Title>
        <Button type="primary" onClick={() => navigate('/roles/create')}>
          Tạo mới
        </Button>
      </Space>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Search
            placeholder="Tìm kiếm theo tên vai trò..."
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
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
        </Col>
      </Row>

      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <span>Đã chọn {selectedRowKeys.length} vai trò</span>
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
        scroll={{ x: 1200 }}
        bordered
        style={{ background: '#fff', borderRadius: 8 }}
      />
    </div>
  );
}
