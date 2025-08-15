import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Button, Space, Typography, Row, Col, Divider, Avatar, Statistic, Skeleton } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  DollarOutlined, 
  EnvironmentOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  TeamOutlined,
  RiseOutlined,
  FileTextOutlined,
  TrophyOutlined,
  TagsOutlined,
  PictureOutlined
} from '@ant-design/icons';
import Swal from 'sweetalert2';
import { fetchJobById, deleteJob } from '../../apis/jobs.api';
import { JobsStatus } from '../../types/jobs.enum';
import { DetailSkeleton } from '../../components/Skeleton';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

const { Title, Text } = Typography;

dayjs.locale('vi');

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchJobDetail();
    }
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const data = await fetchJobById(id!);
      setJobData(data);
    } catch (error) {
      console.error('❌ Lỗi khi fetch job detail:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể tải thông tin công việc',
        confirmButtonText: 'OK',
      });
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteJob(id!);
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Đã xóa tin tuyển dụng thành công',
            confirmButtonText: 'OK',
          });
          navigate('/jobs');
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: error?.response?.data?.message || 'Không thể xóa tin tuyển dụng',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  const formatSalary = (min?: number, max?: number, type?: string, negotiable?: boolean) => {
    if (negotiable || (!min && !max)) return 'Thỏa thuận';
    const fmt = (v: number) => v.toLocaleString('vi-VN');
    return `${min ? fmt(min) : ''}${max ? ` - ${fmt(max)}` : ''} ${type || ''}`.trim();
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  const getJobTypeText = (type?: string) => {
    if (!type) return '-';
    switch (type.toLowerCase()) {
      case 'fulltime': return 'Toàn thời gian';
      case 'parttime': return 'Bán thời gian';
      case 'contract': return 'Hợp đồng';
      case 'internship': return 'Thực tập';
      default: return type;
    }
  };

  const getStatusText = (status: JobsStatus) => {
    return status === JobsStatus.ACTIVE ? 'Hoạt động' : 'Không hoạt động';
  };

  const getStatusColor = (status: JobsStatus) => {
    return status === JobsStatus.ACTIVE ? '#52c41a' : '#ff4d4f';
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!jobData) {
    return (
      <div style={{ padding: 32, textAlign: 'center', fontFamily: 'Roboto, sans-serif' }}>
        <Title level={4}>Không tìm thấy thông tin công việc</Title>
        <Button type="primary" onClick={() => navigate('/jobs')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 32, background: '#f5f5f5', minHeight: '100vh', fontFamily: 'Roboto, sans-serif' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/jobs')}
              style={{ marginRight: 16 }}
            >
              Quay lại
            </Button>
            <Title level={3} style={{ margin: 0 }}>Chi tiết công việc</Title>
          </Space>
          
          <Space>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => navigate(`/jobs/edit/${jobData._id}`)}
            >
              Chỉnh sửa
            </Button>
            <Button 
              danger 
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </Space>
        </Row>
      </Card>

      {/* Job Title and Basic Info */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#e6f7ff',
              border: '2px solid #1890ff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 16px',
            }}
          >
                         <RiseOutlined style={{ fontSize: 32, color: '#1890ff' }} />
          </div>
          <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
            {jobData.title}
          </Title>
          <Text style={{ fontSize: 16, color: '#666' }}>
            {jobData.location || 'Chưa cập nhật địa điểm'}
          </Text>
        </div>

        {/* Statistics */}
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Lượt xem"
                value={jobData.views || 0}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Số lượng"
                value={jobData.quantity || 0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Trạng thái"
                value={getStatusText(jobData.status)}
                valueStyle={{ 
                  color: getStatusColor(jobData.status),
                  fontSize: '14px'
                }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Hạn nộp"
                value={formatDate(jobData.deadline)}
                prefix={<CalendarOutlined />}
                valueStyle={{ fontSize: '14px' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col span={16}>
          {/* Basic Information */}
          <Card 
            title={
              <Space>
                <FileTextOutlined />
                Thông tin cơ bản
              </Space>
            } 
            style={{ marginBottom: 24, borderRadius: 12 }}
          >
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tiêu đề" span={2}>
                <Text strong>{jobData.title}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Slug">
                <Text code>{jobData.slug}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng">
                {jobData.quantity || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Mức lương">
                <DollarOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                {formatSalary(jobData.salaryMin, jobData.salaryMax, jobData.salaryType, (jobData as any).salaryNegotiable)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngành nghề">
                {jobData.categoryId && (jobData as any).categoryId?.title
                  ? (jobData as any).categoryId.title
                  : jobData.career || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Cấp bậc">
                {jobData.level || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Loại hình">
                <Tag color="blue">{getJobTypeText(jobData.jobType)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm">
                <EnvironmentOutlined style={{ marginRight: 4 }} />
                {jobData.location || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ chi tiết" span={2}>
                {jobData.address || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {formatDate(jobData.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Hạn nộp">
                <CalendarOutlined style={{ marginRight: 4 }} />
                {formatDate(jobData.deadline)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={jobData.status === JobsStatus.ACTIVE ? 'green' : 'red'}>
                  {getStatusText(jobData.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Đang hoạt động">
                <Tag color={jobData.isActive ? 'green' : 'red'}>
                  {jobData.isActive ? 'Có' : 'Không'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Description */}
          {jobData.description && (
            <Card 
              title={
                <Space>
                  <FileTextOutlined />
                  Mô tả công việc
                </Space>
              } 
              style={{ marginBottom: 24, borderRadius: 12 }}
            >
              <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {jobData.description}
              </div>
            </Card>
          )}

          {/* Requirements */}
          {jobData.requirements && (
            <Card 
              title={
                <Space>
                  <TrophyOutlined />
                  Yêu cầu công việc
                </Space>
              } 
              style={{ marginBottom: 24, borderRadius: 12 }}
            >
              <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {jobData.requirements}
              </div>
            </Card>
          )}

          {/* Benefits */}
          {jobData.benefits && (
            <Card 
              title={
                <Space>
                  <TrophyOutlined />
                  Quyền lợi
                </Space>
              } 
              style={{ marginBottom: 24, borderRadius: 12 }}
            >
              <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {jobData.benefits}
              </div>
            </Card>
          )}

          {/* Images */}
          {jobData.images && jobData.images.length > 0 && (
            <Card 
              title={
                <Space>
                  <PictureOutlined />
                  Hình ảnh
                </Space>
              } 
              style={{ marginBottom: 24, borderRadius: 12 }}
            >
              <Row gutter={16}>
                {jobData.images.map((image: string, index: number) => (
                  <Col span={8} key={index}>
                    <img
                      src={image}
                      alt={`Job image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </Col>

        <Col span={8}>
          {/* Skills */}
          {jobData.skills && jobData.skills.length > 0 && (
            <Card 
              title={
                <Space>
                  <TagsOutlined />
                  Kỹ năng yêu cầu
                </Space>
              } 
              style={{ marginBottom: 24, borderRadius: 12 }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {jobData.skills.map((skill: string, index: number) => (
                  <Tag key={index} color="geekblue">
                    {skill}
                  </Tag>
                ))}
              </div>
            </Card>
          )}

          {/* Tags */}
          {jobData.tags && jobData.tags.length > 0 && (
            <Card 
              title={
                <Space>
                  <TagsOutlined />
                  Tags
                </Space>
              } 
              style={{ marginBottom: 24, borderRadius: 12 }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {jobData.tags.map((tag: string, index: number) => (
                  <Tag key={index} color="orange">
                    {tag}
                  </Tag>
                ))}
              </div>
            </Card>
          )}

          {/* Additional Info */}
          <Card 
            title="Thông tin bổ sung" 
            style={{ borderRadius: 12 }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Lý do từ chối">
                {jobData.reasonReject || 'Không có'}
              </Descriptions.Item>
              <Descriptions.Item label="Đã xóa">
                <Tag color={jobData.deleted ? 'red' : 'green'}>
                  {jobData.deleted ? 'Có' : 'Không'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {formatDate(jobData.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default JobDetail; 