// src/pages/Recruiters/RecruiterDetail.tsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Tag,
  Descriptions,
  Avatar,
  Divider,
  Tabs,
} from 'antd';
import Swal from 'sweetalert2';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  BankOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailSkeleton } from '../../components/Skeleton';
import { fetchRecruiterById } from '../../apis/recruiter.api';

const { Title, Text } = Typography;

const { TabPane } = Tabs;

interface RecruiterData {
  _id: string;
  fullName?: string;
  gender?: string;
  email?: string;
  phone?: string;
  company?: string;
  province?: string;
  district?: string;
  status?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

const RecruiterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  console.log('RecruiterDetail rendered with ID:', id, 'Current pathname:', window.location.pathname);

  const [loading, setLoading] = useState<boolean>(true);
  const [recruiter, setRecruiter] = useState<RecruiterData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  const fetchData = async (id: string) => {
    try {
      setLoading(true);
      console.log('Fetching recruiter with ID:', id);
      const data = await fetchRecruiterById(id);
      console.log('Recruiter data:', data);
      // Ép kiểu an toàn nếu fetch trả về unknown
      setRecruiter(data as RecruiterData);
    } catch (error) {
      console.error('Error fetching recruiter:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể tải dữ liệu nhà tuyển dụng.',
        confirmButtonText: 'OK'
      });
      navigate('/recruiters');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn có chắc chắn muốn xóa nhà tuyển dụng này? Hành động này không thể hoàn tác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          // TODO: Gọi API xoá ở đây
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Đã xóa nhà tuyển dụng thành công',
            confirmButtonText: 'OK'
          });
          navigate('/recruiters');
        } catch {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Xóa thất bại',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  };

  const getGenderText = (gender?: string) => {
    switch (gender?.toLowerCase()) {
      case 'male':
      case 'nam':
        return 'Nam';
      case 'female':
      case 'nữ':
        return 'Nữ';
      default:
        return 'Khác';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return 'Chưa xác định';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      default:
        return 'default';
    }
  };

  const formatText = (value?: string) => value || 'Chưa có dữ liệu';

  const formatDate = (value?: string) =>
    value
      ? new Date(value).toLocaleString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Chưa có dữ liệu';

  if (loading) return <DetailSkeleton />;
  if (!recruiter) return null;

  return (
    <div style={{ padding: 32, background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/recruiters')}>
              Quay lại
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              Chi tiết nhà tuyển dụng
            </Title>
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/recruiters/edit/${id}`)}
            >
              Chỉnh sửa
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
              Xóa
            </Button>
          </Space>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Tổng quan" key="overview">
              <Card style={{ borderRadius: 12 }}>
                <Row gutter={24}>
                  <Col>
                    <Avatar 
                      size={120} 
                      src={recruiter.avatar} 
                      icon={<UserOutlined />} 
                      style={{ background: '#1677ff' }} 
                    />
                  </Col>
                  <Col flex={1}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                      <div>
                        <Title level={2} style={{ marginBottom: 8 }}>
                          {formatText(recruiter.fullName)}
                        </Title>
                        <Space>
                          <Tag color="blue">{getGenderText(recruiter.gender)}</Tag>
                          <Tag color={getStatusColor(recruiter.status)}>
                            {getStatusText(recruiter.status)}
                          </Tag>
                        </Space>
                      </div>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Space>
                            <MailOutlined />
                            <Text>{formatText(recruiter.email)}</Text>
                          </Space>
                        </Col>
                        <Col span={12}>
                          <Space>
                            <PhoneOutlined />
                            <Text>{formatText(recruiter.phone)}</Text>
                          </Space>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Space>
                            <BankOutlined />
                            <Text>{formatText(recruiter.company)}</Text>
                          </Space>
                        </Col>
                        <Col span={12}>
                          <Space>
                            <EnvironmentOutlined />
                            <Text>
                              {formatText(recruiter.district)}, {formatText(recruiter.province)}
                            </Text>
                          </Space>
                        </Col>
                      </Row>
                    </Space>
                  </Col>
                </Row>
              </Card>

              <Card title="Thống kê" style={{ marginTop: 24, borderRadius: 12 }}>
                <div style={{ textAlign: 'center', color: '#999' }}>
                  <Text>Chưa có dữ liệu thống kê</Text>
                </div>
              </Card>

              <Card title="Hoạt động gần đây" style={{ marginTop: 24, borderRadius: 12 }}>
                <div style={{ textAlign: 'center', color: '#999' }}>
                  <Text>Chưa có dữ liệu hoạt động</Text>
                </div>
              </Card>
            </TabPane>

            <TabPane tab="Thông tin chi tiết" key="details">
              <Card style={{ borderRadius: 12 }}>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Họ và tên">{formatText(recruiter.fullName)}</Descriptions.Item>
                  <Descriptions.Item label="Giới tính">{getGenderText(recruiter.gender)}</Descriptions.Item>
                  <Descriptions.Item label="Email">{formatText(recruiter.email)}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{formatText(recruiter.phone)}</Descriptions.Item>
                  <Descriptions.Item label="Công ty">{formatText(recruiter.company)}</Descriptions.Item>
                  <Descriptions.Item label="Tỉnh/Thành phố">{formatText(recruiter.province)}</Descriptions.Item>
                  <Descriptions.Item label="Quận/Huyện">{formatText(recruiter.district)}</Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(recruiter.status)}>
                      {getStatusText(recruiter.status)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo tài khoản">{formatDate(recruiter.createdAt)}</Descriptions.Item>
                  <Descriptions.Item label="Cập nhật lần cuối">{formatDate(recruiter.updatedAt)}</Descriptions.Item>
                </Descriptions>

                <Divider />
                <div style={{ textAlign: 'center', color: '#999' }}>
                  <Text>Chưa có thông tin giới thiệu</Text>
                </div>
              </Card>
            </TabPane>

            <TabPane tab="Lịch sử hoạt động" key="history">
              <Card style={{ borderRadius: 12 }}>
                <div style={{ textAlign: 'center', color: '#999' }}>
                  <Text>Chưa có dữ liệu lịch sử</Text>
                </div>
              </Card>
            </TabPane>
          </Tabs>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Thông tin liên hệ" style={{ marginBottom: 24, borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Email:</Text>
                <br />
                <Text copyable>{formatText(recruiter.email)}</Text>
              </div>
              <Divider />
              <div>
                <Text type="secondary">Số điện thoại:</Text>
                <br />
                <Text copyable>{formatText(recruiter.phone)}</Text>
              </div>
              <Divider />
              <div>
                <Text type="secondary">Địa chỉ:</Text>
                <br />
                <Text>{`${formatText(recruiter.district)}, ${formatText(recruiter.province)}`}</Text>
              </div>
              <Divider />
              <div>
                <Text type="secondary">Trạng thái:</Text>
                <br />
                <Tag color={getStatusColor(recruiter.status)}>
                  {getStatusText(recruiter.status)}
                </Tag>
              </div>
            </Space>
          </Card>

          <Card title="Hành động nhanh" style={{ borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                block
                icon={<EditOutlined />}
                onClick={() => navigate(`/recruiters/edit/${id}`)}
              >
                Chỉnh sửa thông tin
              </Button>
              <Button block icon={<CalendarOutlined />} disabled>
                Xem tin tuyển dụng (Chưa implement)
              </Button>
              <Button block icon={<UserOutlined />} disabled>
                Xem ứng viên (Chưa implement)
              </Button>
              <Button danger block icon={<DeleteOutlined />} onClick={handleDelete}>
                Xóa nhà tuyển dụng
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RecruiterDetail;
