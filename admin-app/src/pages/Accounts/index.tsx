import { useEffect, useState } from 'react';
import { Button, Table, Tag, Space, Input, Select, message, Typography, Row, Col } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined, BankOutlined, TeamOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { fetchAccounts, deleteAccount, updateAccountStatus, verifyEmail } from '../../apis/accounts.api';
import type { AccountData } from '../../types/accounts.type';

interface AccountsResponse {
  data: AccountData[];
  total: number;
  page: number;
  limit: number;
}
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

export default function AccountsList() {
  const [data, setData] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const navigate = useNavigate();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetchAccounts({
        page,
        limit: 10,
        search,
        status: statusFilter || undefined,
        role: roleFilter || undefined,
      }) as AccountsResponse;
      setData(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error('❌ Lỗi khi fetch accounts:', err);
      setData([]);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể tải danh sách tài khoản',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, search, statusFilter, roleFilter]);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAccount(id);
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Đã xóa tài khoản thành công',
            confirmButtonText: 'OK',
          });
          getData();
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: error?.response?.data?.message || 'Không thể xóa tài khoản',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateAccountStatus(id, currentStatus ? 'false' : 'true');
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

  const handleVerifyEmail = async (id: string) => {
    try {
      await verifyEmail(id);
      message.success('Xác thực email thành công');
      getData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error?.response?.data?.message || 'Không thể xác thực email',
        confirmButtonText: 'OK',
      });
    }
  };

  const getProfileIcon = (account: AccountData) => {
    if (account.profile) {
      if ('company' in account.profile) {
        return <BankOutlined style={{ color: '#1890ff' }} />;
      } else if ('level' in account.profile) {
        return <TeamOutlined style={{ color: '#52c41a' }} />;
      }
    }
    return <UserOutlined style={{ color: '#722ed1' }} />;
  };

  const getProfileType = (account: AccountData) => {
    if (account.profile) {
      if ('company' in account.profile) {
        return 'Nhà tuyển dụng';
      } else if ('level' in account.profile) {
        return 'Admin';
      }
    }
    return 'Người dùng';
  };

  const columns = [
    {
      title: 'Tài khoản',
      key: 'account',
      render: (record: AccountData) => (
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
            {getProfileIcon(record)}
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: 14, color: '#262626' }}>{record.email}</div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>
              {getProfileType(record)}
            </div>
          </div>
        </Space>
      ),
      width: 280,
      ellipsis: true,
    },
    {
      title: 'Vai trò',
      key: 'roles',
      width: 150,
      render: (record: AccountData) => (
        <div>
          {record.roles?.map((role) => (
            <Tag key={role._id} color="blue" style={{ marginBottom: 4, fontFamily: 'Roboto, sans-serif' }}>
              {role.name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
  title: 'Trạng thái',
  key: 'status',
  width: 150,
  render: (record: AccountData) => (
    <Space direction="vertical" size="small">
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
          border: `1px solid ${
            record.status === 'active' ? '#b7eb8f' : '#ffccc7'
          }`,
          cursor: 'pointer',
          fontFamily: 'Roboto, sans-serif',
        }}
        onClick={() =>
          handleToggleStatus(record._id, record.status === 'active')
        }
      >
        {record.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
      </Button>

      <div
        style={{
          fontSize: '12px',
          color: record.isVerified ? '#52c41a' : '#faad14',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        <SafetyCertificateOutlined />{' '}
        {record.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
      </div>
    </Space>
  ),
}
,
    {
      title: 'Lần đăng nhập cuối',
      key: 'lastLoginAt',
      width: 150,
      render: (record: AccountData) => (
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>
          {record.lastLoginAt 
            ? dayjs(record.lastLoginAt).format('DD/MM/YYYY HH:mm')
            : 'Chưa đăng nhập'
          }
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      width: 120,
      render: (record: AccountData) => (
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>
          {dayjs(record.createdAt).format('DD/MM/YYYY')}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (record: AccountData) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/accounts/detail/${record._id}`)}
            title="Xem chi tiết"
          />
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
            onClick={() => navigate(`/accounts/edit/${record._id}`)}
            title="Chỉnh sửa"
          />
          {!record.isVerified && (
            <Button
              type="primary"
              size="small"
              icon={<SafetyCertificateOutlined />}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              onClick={() => handleVerifyEmail(record._id)}
              title="Xác thực email"
            />
          )}
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
          <Title level={3}>Quản lý tài khoản</Title>
          <Button type="primary" onClick={() => navigate('/accounts/create')}>
            Tạo mới
          </Button>
        </Space>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm theo email..."
              allowClear
              enterButton
              style={{ width: '100%' }}
              onSearch={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
          </Col>
          <Col span={8}>
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
              <Option value="true">Hoạt động</Option>
              <Option value="false">Không hoạt động</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Select
              placeholder="Lọc vai trò"
              style={{ width: '100%' }}
              allowClear
              value={roleFilter || undefined}
              onChange={(val) => {
                setRoleFilter(val);
                setPage(1);
              }}
            >
              <Option value="USER">Người dùng</Option>
              <Option value="RECRUITER">Nhà tuyển dụng</Option>
              <Option value="ADMIN">Admin</Option>
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
        <Title level={3}>Quản lý tài khoản</Title>
        <Button type="primary" onClick={() => navigate('/accounts/create')}>
          Tạo mới
        </Button>
      </Space>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Search
            placeholder="Tìm kiếm theo email..."
            allowClear
            enterButton
            style={{ width: '100%' }}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
        </Col>
        <Col span={8}>
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
        <Col span={8}>
          <Select
            placeholder="Lọc vai trò"
            style={{ width: '100%' }}
            allowClear
            value={roleFilter || undefined}
            onChange={(val) => {
              setRoleFilter(val);
              setPage(1);
            }}
          >
            <Option value="USER">Người dùng</Option>
            <Option value="RECRUITER">Nhà tuyển dụng</Option>
            <Option value="ADMIN">Admin</Option>
          </Select>
        </Col>
      </Row>

      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <span>Đã chọn {selectedRowKeys.length} tài khoản</span>
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
        scroll={{ x: 1400 }}
        bordered
        style={{ background: '#fff', borderRadius: 8 }}
      />
    </div>
  );
}
