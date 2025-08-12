import React, { useState, useRef, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Row,
  Col,
  Card,
  DatePicker,
  InputNumber,
  Tag,
  Tooltip,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createJob } from '../../apis/jobs.api';
import Swal from 'sweetalert2';
import { FormSkeleton } from '../../components/Skeleton';

const { Title } = Typography;
const { Option } = Select;

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const salaryTypes = [
  { value: 'gross', label: 'Gross' },
  { value: 'net', label: 'Net' },
  { value: 'thỏa thuận', label: 'Thỏa thuận' },
];
const jobTypes = [
  { value: 'fulltime', label: 'Toàn thời gian' },
  { value: 'parttime', label: 'Bán thời gian' },
  { value: 'internship', label: 'Thực tập' },
  { value: 'remote', label: 'Remote' },
  { value: 'contract', label: 'Hợp đồng' },
];

const CreateJob: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputSkill, setInputSkill] = useState('');
  const [inputTag, setInputTag] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFileList(files);
      setImagePreviews(files.map(file => URL.createObjectURL(file)));
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleSkillInputConfirm = () => {
    if (inputSkill && !skills.includes(inputSkill)) {
      setSkills([...skills, inputSkill]);
    }
    setInputSkill('');
  };
  const handleTagInputConfirm = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
    }
    setInputTag('');
  };

  const removeSkill = (removed: string) => {
    setSkills(skills.filter(skill => skill !== removed));
  };
  const removeTag = (removed: string) => {
    setTags(tags.filter(tag => tag !== removed));
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        skills,
        tags,
        salaryMin: values.salaryMin || 0,
        salaryMax: values.salaryMax || 0,
        deadline: values.deadline ? values.deadline.toISOString() : undefined,
        slug: slugify(values.title),
      };
      await createJob(payload, fileList);
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Tạo tin tuyển dụng thành công!',
      });
      form.resetFields();
      setFileList([]);
      setImagePreviews([]);
      setSkills([]);
      setTags([]);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi tạo job!',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FormSkeleton fieldCount={12} />;

  return (
    <Row justify="center" style={{ marginTop: 40 }}>
      <Col xs={24} sm={20} md={16} lg={14} xl={12}>
        <Card
          style={{
            borderRadius: 12,
            boxShadow: '0 2px 8px #f0f1f2',
            padding: 24,
          }}
        >
          <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
            Tạo tin tuyển dụng mới
          </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            initialValues={{ status: 'active', jobType: 'fulltime', salaryType: 'gross' }}
          >
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input
                placeholder="Nhập tiêu đề công việc"
                onChange={e => form.setFieldsValue({ slug: slugify(e.target.value) })}
              />
            </Form.Item>
            <Form.Item name="slug" label="Slug">
              <Input disabled placeholder="Slug tự động sinh" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <Input.TextArea rows={3} placeholder="Nhập mô tả công việc" />
            </Form.Item>
            <Form.Item name="requirements" label="Yêu cầu">
              <Input.TextArea rows={2} placeholder="Nhập yêu cầu công việc" />
            </Form.Item>
            <Form.Item name="benefits" label="Quyền lợi">
              <Input.TextArea rows={2} placeholder="Nhập quyền lợi" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="quantity" label="Số lượng">
                  <InputNumber min={1} style={{ width: '100%' }} placeholder="Số lượng tuyển" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="career" label="Ngành nghề">
                  <Input placeholder="Nhập ngành nghề" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="level" label="Cấp bậc">
                  <Input placeholder="Nhập cấp bậc" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="jobType" label="Loại hình">
                  <Select>
                    {jobTypes.map(j => (
                      <Option key={j.value} value={j.value}>{j.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="salaryMin" label="Lương tối thiểu">
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="Tối thiểu" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="salaryMax" label="Lương tối đa">
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="Tối đa" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="salaryType" label="Loại lương">
                  <Select>
                    {salaryTypes.map(s => (
                      <Option key={s.value} value={s.value}>{s.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="location" label="Tỉnh/Thành phố">
                  <Input placeholder="Nhập tỉnh/thành phố" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="address" label="Địa chỉ cụ thể">
                  <Input placeholder="Nhập địa chỉ cụ thể" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="deadline" label="Hạn nộp hồ sơ">
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="status" label="Trạng thái">
                  <Select>
                    <Option value="active">Đang tuyển</Option>
                    <Option value="inactive">Tạm dừng</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Kỹ năng">
              <div>
                {skills.map(skill => (
                  <Tag
                    closable
                    key={skill}
                    onClose={() => removeSkill(skill)}
                    style={{ marginBottom: 4 }}
                  >
                    {skill}
                  </Tag>
                ))}
                <Input
                  style={{ width: 200, marginTop: 4 }}
                  value={inputSkill}
                  onChange={e => setInputSkill(e.target.value)}
                  onPressEnter={handleSkillInputConfirm}
                  placeholder="Thêm kỹ năng"
                  suffix={
                    <Tooltip title="Thêm">
                      <PlusOutlined onClick={handleSkillInputConfirm} style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  }
                />
              </div>
            </Form.Item>
            <Form.Item label="Tags">
              <div>
                {tags.map(tag => (
                  <Tag
                    closable
                    key={tag}
                    onClose={() => removeTag(tag)}
                    style={{ marginBottom: 4 }}
                  >
                    {tag}
                  </Tag>
                ))}
                <Input
                  style={{ width: 200, marginTop: 4 }}
                  value={inputTag}
                  onChange={e => setInputTag(e.target.value)}
                  onPressEnter={handleTagInputConfirm}
                  placeholder="Thêm tag"
                  suffix={
                    <Tooltip title="Thêm">
                      <PlusOutlined onClick={handleTagInputConfirm} style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  }
                />
              </div>
            </Form.Item>
            <Form.Item label="Hình ảnh (nếu có)">
              <Button
                onClick={handleFileClick}
                style={{ width: '100%' }}
                icon={<PlusOutlined />}
              >
                Chọn ảnh
              </Button>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {imagePreviews.length > 0 && (
                <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                  {imagePreviews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`preview-${idx}`}
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                    />
                  ))}
                </div>
              )}
            </Form.Item>
            <Form.Item style={{ marginTop: 16 }}>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Tạo tin tuyển dụng
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default CreateJob;
