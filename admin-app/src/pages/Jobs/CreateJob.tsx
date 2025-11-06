import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Divider,
  message,
  DatePicker,
  InputNumber,
  Tag,
  Switch,
} from 'antd';
import Swal from 'sweetalert2';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  RiseOutlined,
  FileTextOutlined,
  TagsOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

import { createJob } from '../../apis/jobs.api';
import { fetchJobCategories } from '../../apis/job-categories.api';
import type { JobCategoryData } from '../../types/job-categories.type';
import type { CreateJobPayload } from '../../types/jobs.type';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

dayjs.locale('vi');

const CreateJob: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [categories, setCategories] = useState<JobCategoryData[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetchJobCategories({ page: 1, limit: 1000, status: 'active' });
        setCategories(res.data || []);
      } catch (err) {
        message.error('Không thể tải danh sách danh mục công việc');
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);
      
      const jobData: CreateJobPayload = {
        ...values,
        skills,
        deadline: values.deadline ? dayjs(values.deadline).toISOString() : undefined,
        isActive: values.isActive ?? true,
        currency: values.currency || 'VND',
      };

      await createJob(jobData);
      
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã tạo công việc thành công',
        confirmButtonText: 'OK',
      });
      
      navigate('/jobs');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error?.response?.data?.message || 'Không thể tạo công việc',
        confirmButtonText: 'OK',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: 'Roboto, sans-serif' }}>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/jobs')}
            style={{ marginRight: 16 }}
          >
            Quay lại
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            Tạo công việc mới
          </Title>
        </Space>
      </Space>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isActive: true,
          currency: 'VND',
        }}
      >
        <Row gutter={24}>
          <Col span={16}>
            <Card title="Thông tin cơ bản" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="title"
                    label="Tiêu đề công việc"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề công việc' }]}
                  >
                    <Input placeholder="VD: Backend Developer" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="Địa điểm làm việc"
                  >
                    <Input placeholder="VD: Hà Nội, TP.HCM" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="jobType"
                    label="Loại công việc"
                    rules={[{ required: true, message: 'Vui lòng chọn loại công việc' }]}
                  >
                    <Select placeholder="Chọn loại công việc">
                      <Option value="fulltime">Full-time</Option>
                      <Option value="parttime">Part-time</Option>
                      <Option value="internship">Internship</Option>
                      <Option value="contract">Contract</Option>
                      <Option value="freelance">Freelance</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="workingMode"
                    label="Hình thức làm việc"
                    rules={[{ required: true, message: 'Vui lòng chọn hình thức làm việc' }]}
                  >
                    <Select placeholder="Chọn hình thức làm việc">
                      <Option value="onsite">On-site</Option>
                      <Option value="remote">Remote</Option>
                      <Option value="hybrid">Hybrid</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="jobCategoryId"
                    label="Danh mục công việc"
                  >
                    <Select
                      placeholder="Chọn danh mục"
                      loading={loadingCategories}
                      showSearch
                      optionFilterProp="children"
                      allowClear
                    >
                      {categories.map((category) => (
                        <Option key={category._id} value={category._id}>
                          {category.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Mô tả công việc"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc' }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Mô tả chi tiết về công việc, trách nhiệm, yêu cầu..."
                />
              </Form.Item>

              <Form.Item
                name="requirements"
                label="Yêu cầu ứng viên"
              >
                <TextArea
                  rows={4}
                  placeholder="Các yêu cầu về kinh nghiệm, kỹ năng, bằng cấp..."
                />
              </Form.Item>

              <Form.Item
                name="benefits"
                label="Quyền lợi"
              >
                <TextArea
                  rows={4}
                  placeholder="Các quyền lợi, phúc lợi mà ứng viên sẽ nhận được..."
                />
              </Form.Item>
            </Card>

            <Card title="Kỹ năng cần thiết" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Input
                    placeholder="Nhập kỹ năng"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onPressEnter={addSkill}
                    style={{ width: 300 }}
                  />
                  <Button type="primary" onClick={addSkill} icon={<PlusOutlined />}>
                    Thêm
                  </Button>
                </Space>
                <div>
                  {skills.map((skill, index) => (
                    <Tag
                      key={index}
                      closable
                      onClose={() => removeSkill(skill)}
                      style={{ margin: '4px 8px 4px 0' }}
                    >
                      {skill}
                    </Tag>
                  ))}
                </div>
              </Space>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Thông tin lương" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="salaryMin" label="Lương tối thiểu">
                    <InputNumber
                      placeholder="0"
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="salaryMax" label="Lương tối đa">
                    <InputNumber
                      placeholder="0"
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="currency" label="Đơn vị tiền tệ">
                <Select>
                  <Option value="VND">VND</Option>
                  <Option value="USD">USD</Option>
                </Select>
              </Form.Item>
            </Card>

            <Card title="Thông tin khác" style={{ marginBottom: 24 }}>
              <Form.Item name="deadline" label="Hạn nộp hồ sơ">
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Chọn ngày"
                  format="DD/MM/YYYY"
                />
              </Form.Item>

              <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
              </Form.Item>
            </Card>

            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={saving}
                  style={{ width: '100%' }}
                  size="large"
                >
                  Tạo công việc
                </Button>
                <Button
                  onClick={() => navigate('/jobs')}
                  style={{ width: '100%' }}
                  size="large"
                >
                  Hủy
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateJob;
