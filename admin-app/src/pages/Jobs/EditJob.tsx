import React, { useEffect, useState, useRef } from 'react';
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
  Upload,
  Image,
  Switch,
} from 'antd';
import Swal from 'sweetalert2';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  RiseOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  FileTextOutlined,
  TrophyOutlined,
  TagsOutlined,
  PictureOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

import { fetchJobById, updateJob } from '../../apis/jobs.api';
import { fetchJobCategories } from '../../apis/job-categories.api';
import type { JobCategoryData } from '../../types/job-categories.type';
import { FormSkeleton } from '../../components/Skeleton';
import { JobsStatus } from '../../types/jobs.enum';
import type { JobData } from '../../types/jobs.type';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

dayjs.locale('vi');

const EditJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<JobCategoryData[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const salaryNegotiable = Form.useWatch('salaryNegotiable', form);

  useEffect(() => {
    if (id) fetchJobData();
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetchJobCategories({ page: 1, limit: 1000, status: 'active' });
        setCategories(res.data || []);
      } catch (err) {
        message.error('Không thể tải danh sách ngành nghề');
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, [id]);

  const fetchJobData = async () => {
    try {
      const data = await fetchJobById(id!);
      setExistingImages(data.images || []);
      setSkills(data.skills || []);
      setTags(data.tags || []);
      
      // Format data for form
      const formData = {
        ...data,
        // Nếu backend populate categoryId thành object, map về _id để Select nhận đúng value
        categoryId: (data as any)?.categoryId?._id || (data as any)?.categoryId || undefined,
        deadline: data.deadline ? dayjs(data.deadline) : undefined,
      };
      
      form.setFieldsValue(formData);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể tải thông tin công việc',
      });
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const onFinish = async () => {
    setSaving(true);
    try {
      const currentValues = form.getFieldsValue();
      
      // Prepare job data
      const jobData = {
        ...currentValues,
        deadline: currentValues.deadline?.toISOString(),
        skills,
        tags,
        images: existingImages,
      };

      // Remove undefined values
      Object.keys(jobData).forEach(key => {
        if (jobData[key] === undefined || jobData[key] === null) {
          delete jobData[key];
        }
      });

      // If salary negotiable, clear numeric salary fields before submit
      if (jobData.salaryNegotiable) {
        delete jobData.salaryMin;
        delete jobData.salaryMax;
        delete jobData.salaryType;
      }

      await updateJob(id!, jobData, newImages.length > 0 ? newImages : undefined);
      
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Cập nhật công việc thành công',
      });
      navigate('/jobs');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error?.response?.data?.message || 'Cập nhật thất bại!',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate('/jobs');

  if (loading) return <FormSkeleton fieldCount={15} />;

  return (
    <div style={{ padding: 32, background: '#f5f5f5', minHeight: '100vh', fontFamily: 'Roboto, sans-serif' }}>
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleCancel} style={{ marginRight: 16 }}>
              Quay lại
            </Button>
            <Title level={3}>Chỉnh sửa công việc</Title>
          </Space>
        </Row>
      </Card>

      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              disabled={saving}
            >
              <Title level={4}>
                <RiseOutlined style={{ marginRight: 8 }} />
                Thông tin cơ bản
              </Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="title" label="Tiêu đề công việc" rules={[{ required: true }]}>
                    <Input placeholder="Nhập tiêu đề công việc" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="quantity" label="Số lượng tuyển">
                    <InputNumber
                      min={1}
                      placeholder="Số lượng"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="categoryId" label="Ngành nghề">
                    <Select
                      placeholder="Chọn ngành nghề"
                      loading={loadingCategories}
                      showSearch
                      optionFilterProp="children"
                      allowClear
                    >
                      {categories.map((c) => (
                        <Option key={c._id} value={c._id}>{c.title}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="level" label="Cấp bậc">
                    <Select placeholder="Chọn cấp bậc">
                      <Option value="intern">Thực tập</Option>
                      <Option value="fresher">Mới tốt nghiệp</Option>
                      <Option value="junior">Junior</Option>
                      <Option value="middle">Middle</Option>
                      <Option value="senior">Senior</Option>
                      <Option value="lead">Lead</Option>
                      <Option value="manager">Manager</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="jobType" label="Loại hình">
                    <Select placeholder="Chọn loại hình">
                      <Option value="fulltime">Toàn thời gian</Option>
                      <Option value="parttime">Bán thời gian</Option>
                      <Option value="contract">Hợp đồng</Option>
                      <Option value="internship">Thực tập</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="experienceYears" label="Năm kinh nghiệm">
                    <Select placeholder="Chọn năm kinh nghiệm">
                      <Option value="Không yêu cầu">Không yêu cầu</Option>
                      <Option value="Dưới 1 năm">Dưới 1 năm</Option>
                      <Option value="1-2 năm">1-2 năm</Option>
                      <Option value="2-3 năm">2-3 năm</Option>
                      <Option value="3-5 năm">3-5 năm</Option>
                      <Option value="5-7 năm">5-7 năm</Option>
                      <Option value="7-10 năm">7-10 năm</Option>
                      <Option value="Trên 10 năm">Trên 10 năm</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="workingHours" label="Giờ làm việc">
                    <Select placeholder="Chọn giờ làm việc">
                      <Option value="Thứ 2 - Thứ 6 (8h-17h)">Thứ 2 - Thứ 6 (8h-17h)</Option>
                      <Option value="Thứ 2 - Thứ 6 (9h-18h)">Thứ 2 - Thứ 6 (9h-18h)</Option>
                      <Option value="Thứ 2 - Thứ 7 (8h-17h)">Thứ 2 - Thứ 7 (8h-17h)</Option>
                      <Option value="Thứ 2 - Thứ 7 (9h-18h)">Thứ 2 - Thứ 7 (9h-18h)</Option>
                      <Option value="Linh hoạt">Linh hoạt</Option>
                      <Option value="Remote">Remote</Option>
                      <Option value="Hybrid">Hybrid</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="education" label="Học vấn">
                    <Select placeholder="Chọn học vấn">
                      <Option value="Không yêu cầu">Không yêu cầu</Option>
                      <Option value="Trung cấp">Trung cấp</Option>
                      <Option value="Cao đẳng">Cao đẳng</Option>
                      <Option value="Đại học">Đại học</Option>
                      <Option value="Thạc sĩ">Thạc sĩ</Option>
                      <Option value="Tiến sĩ">Tiến sĩ</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="salaryNegotiable" label="Lương thỏa thuận" valuePropName="checked" initialValue={false}>
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="salaryMin" label="Lương tối thiểu">
                    <InputNumber
                      min={0}
                      placeholder="Lương tối thiểu"
                      style={{ width: '100%' }}
                      disabled={salaryNegotiable}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="salaryMax" label="Lương tối đa">
                    <InputNumber
                      min={0}
                      placeholder="Lương tối đa"
                      style={{ width: '100%' }}
                      disabled={salaryNegotiable}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="salaryType" label="Đơn vị lương">
                    <Select placeholder="Chọn đơn vị" disabled={salaryNegotiable}>
                      <Option value="VND">VND</Option>
                      <Option value="USD">USD</Option>
                      <Option value="EUR">EUR</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="location" label="Địa điểm">
                    <Input placeholder="Ví dụ: TP. Hồ Chí Minh" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="deadline" label="Hạn nộp hồ sơ">
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="Chọn ngày"
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="address" label="Địa chỉ chi tiết">
                <Input placeholder="Nhập địa chỉ chi tiết" />
              </Form.Item>

              <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                <Select>
                  <Option value={JobsStatus.ACTIVE}>Hoạt động</Option>
                  <Option value={JobsStatus.INACTIVE}>Không hoạt động</Option>
                </Select>
              </Form.Item>

              <Divider />

              <Title level={4}>
                <FileTextOutlined style={{ marginRight: 8 }} />
                Mô tả công việc
              </Title>

              <Form.Item name="description" label="Mô tả công việc">
                <TextArea
                  rows={6}
                  placeholder="Mô tả chi tiết về công việc, môi trường làm việc..."
                />
              </Form.Item>

              <Form.Item name="requirements" label="Yêu cầu công việc">
                <TextArea
                  rows={4}
                  placeholder="Liệt kê các yêu cầu về kỹ năng, kinh nghiệm..."
                />
              </Form.Item>

              <Form.Item name="benefits" label="Quyền lợi">
                <TextArea
                  rows={4}
                  placeholder="Mô tả các quyền lợi, đãi ngộ..."
                />
              </Form.Item>

              <Divider />

              <Title level={4}>
                <TagsOutlined style={{ marginRight: 8 }} />
                Kỹ năng & Tags
              </Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Kỹ năng yêu cầu">
                    <div style={{ marginBottom: 8 }}>
                      <Space>
                        <Input
                          placeholder="Thêm kỹ năng"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onPressEnter={addSkill}
                          style={{ width: 200 }}
                        />
                        <Button type="primary" onClick={addSkill} icon={<PlusOutlined />}>
                          Thêm
                        </Button>
                      </Space>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {skills.map((skill, index) => (
                        <Tag
                          key={index}
                          closable
                          onClose={() => removeSkill(skill)}
                          color="geekblue"
                        >
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tags">
                    <div style={{ marginBottom: 8 }}>
                      <Space>
                        <Input
                          placeholder="Thêm tag"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onPressEnter={addTag}
                          style={{ width: 200 }}
                        />
                        <Button type="primary" onClick={addTag} icon={<PlusOutlined />}>
                          Thêm
                        </Button>
                      </Space>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {tags.map((tag, index) => (
                        <Tag
                          key={index}
                          closable
                          onClose={() => removeTag(tag)}
                          color="orange"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Title level={4}>
                <PictureOutlined style={{ marginRight: 8 }} />
                Hình ảnh
              </Title>

              <Form.Item label="Hình ảnh hiện tại">
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    {existingImages.map((image, index) => (
                      <Col span={6} key={index}>
                        <div style={{ position: 'relative' }}>
                          <Image
                            src={image}
                            alt={`Image ${index + 1}`}
                            style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                          />
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              background: 'rgba(255, 255, 255, 0.9)',
                            }}
                            onClick={() => removeExistingImage(index)}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Form.Item>

              <Form.Item label="Thêm hình ảnh mới">
                <div style={{ marginBottom: 16 }}>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={handleImageClick}
                    style={{ width: '100%', height: 120 }}
                  >
                    Thêm hình ảnh
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                </div>
                {newImages.length > 0 && (
                  <Row gutter={16}>
                    {newImages.map((file, index) => (
                      <Col span={6} key={index}>
                        <div style={{ position: 'relative' }}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New image ${index + 1}`}
                            style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                          />
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              background: 'rgba(255, 255, 255, 0.9)',
                            }}
                            onClick={() => removeNewImage(index)}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Form.Item>

              <Form.Item style={{ marginTop: 32 }}>
                <Space style={{ justifyContent: 'center', width: '100%' }}>
                  <Button size="large" onClick={handleCancel} disabled={saving}>
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={saving}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EditJob;
