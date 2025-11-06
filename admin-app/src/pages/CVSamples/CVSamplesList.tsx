import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Row,
  Col,
  Input,
  Select,
  Typography,
  Image,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  fetchCVSamples,
  deleteCVSample,
  hardDeleteCVSample,
  toggleCVSampleStatus,
  type CVSampleData,
} from '../../apis/cv-samples.api';
import { TableSkeleton } from '../../components/Skeleton';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const CVSamplesList: React.FC = () => {
  const navigate = useNavigate();
  const [cvSamples, setCvSamples] = useState<CVSampleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    loadCVSamples();
  }, [currentPage, pageSize, isActiveFilter]);

  const loadCVSamples = async () => {
    try {
      setLoading(true);
      const response = await fetchCVSamples({
        page: currentPage,
        limit: pageSize,
        isActive: isActiveFilter,
      });
      setCvSamples(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error('Không thể tải danh sách mẫu CV');
      console.error('Error loading CV samples:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, isHardDelete = false) => {
    try {
      if (isHardDelete) {
        await hardDeleteCVSample(id);
        message.success('Xóa vĩnh viễn mẫu CV thành công');
      } else {
        await deleteCVSample(id);
        message.success('Xóa mẫu CV thành công');
      }
      loadCVSamples();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Xóa mẫu CV thất bại');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleCVSampleStatus(id);
      message.success('Cập nhật trạng thái thành công');
      loadCVSamples();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const confirmDelete = (id: string, name: string) => {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: `Bạn có chắc chắn muốn xóa mẫu CV "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const confirmHardDelete = (id: string, name: string) => {
    Swal.fire({
      title: 'Xác nhận xóa vĩnh viễn',
      text: `Bạn có chắc chắn muốn xóa vĩnh viễn mẫu CV "${name}"? Hành động này không thể hoàn tác!`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa vĩnh viễn',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id, true);
      }
    });
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'demoImage',
      key: 'demoImage',
      width: 100,
      render: (image: string, record: CVSampleData) => (
        <Image
          width={60}
          height={80}
          src={image || '/placeholder-cv.png'}
          alt={record.name}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="/placeholder-cv.png"
        />
      ),
    },
    {
      title: 'Tên mẫu',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: CVSampleData) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.title}</div>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text || 'Không có mô tả'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_: any, record: CVSampleData) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/cv-samples/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/cv-samples/edit/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title={record.isActive ? 'Tạm dừng' : 'Kích hoạt'}>
            <Button
              type="text"
              icon={<PoweroffOutlined />}
              onClick={() => handleToggleStatus(record._id)}
              style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa mẫu CV"
              description="Bạn có chắc chắn muốn xóa mẫu CV này?"
              onConfirm={() => confirmDelete(record._id, record.name)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading && cvSamples.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Quản lý mẫu CV
            </Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadCVSamples}
                loading={loading}
              >
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/cv-samples/create')}
              >
                Tạo mẫu CV mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm mẫu CV..."
              allowClear
              onSearch={(value) => {
                // TODO: Implement search functionality
                console.log('Search:', value);
              }}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: '100%' }}
              value={isActiveFilter}
              onChange={setIsActiveFilter}
            >
              <Option value={true}>Hoạt động</Option>
              <Option value={false}>Tạm dừng</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={cvSamples}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} mẫu CV`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default CVSamplesList;
