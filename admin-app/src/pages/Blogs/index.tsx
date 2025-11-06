import React, { useEffect, useState } from 'react';
import { Button, Card, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { blogsApi, Blog } from '../../apis/blogs.api';

const BlogsList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const items = await blogsApi.listAdmin();
        setData(items);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <Card title="Blogs" extra={<Button type="primary" onClick={() => navigate('/blogs/create')}>Tạo blog</Button>}>
      <Table
        rowKey={(r) => r._id as string}
        loading={loading}
        dataSource={data}
        columns={[
          { title: 'Tiêu đề', dataIndex: 'title' },
          { title: 'Slug', dataIndex: 'slug' },
          { title: 'Tags', dataIndex: 'tags', render: (tags?: string[]) => (tags || []).map(t => <Tag key={t}>{t}</Tag>) },
          { title: 'Xuất bản', dataIndex: 'published', render: (v: boolean) => v ? <Tag color="green">Đã xuất bản</Tag> : <Tag color="orange">Nháp</Tag> },
          { title: 'Ngày xuất bản', dataIndex: 'publishedAt' },
          { title: 'Cập nhật', dataIndex: 'updatedAt' },
          { title: 'Hành động', render: (_, r) => <Button onClick={() => navigate(`/blogs/edit/${r._id}`)}>Sửa</Button> },
        ]}
      />
    </Card>
  );
};

export default BlogsList;


