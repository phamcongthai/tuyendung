import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { TeamOutlined, FileTextOutlined, UserOutlined, AppstoreOutlined } from '@ant-design/icons';
import { DashboardSkeleton } from '../components/Skeleton';
import { fetchJobs } from '../apis/jobs.api';
import { fetchJobCategories } from '../apis/job-categories.api';
import { fetchAccounts } from '../apis/accounts.api';
import { fetchRoles } from '../apis/roles.api';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    jobs: 0,
    categories: 0,
    accounts: 0,
    roles: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsRes, catsRes, accRes, rolesRes] = await Promise.all([
          fetchJobs({ page: 1, limit: 1 }),
          fetchJobCategories({ page: 1, limit: 1 }),
          fetchAccounts({ page: 1, limit: 1 }),
          fetchRoles({ page: 1, limit: 1 }),
        ]);

        const jobsTotal = (jobsRes as any)?.total ?? 0;
        const catsTotal = (catsRes as any)?.total ?? 0;
        const accTotal = (accRes as any)?.total ?? ((accRes as any)?.data?.length ?? 0);
        const rolesTotal = (rolesRes as any)?.total ?? 0;

        setStats({ jobs: jobsTotal, categories: catsTotal, accounts: accTotal, roles: rolesTotal });
      } catch (e) {
        setStats({ jobs: 0, categories: 0, accounts: 0, roles: 0 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div style={{ padding: 32 }}>
      <Title level={3} style={{ marginBottom: 24 }}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tin tuyển dụng"
              value={stats.jobs}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Danh mục công việc"
              value={stats.categories}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tài khoản"
              value={stats.accounts}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Vai trò"
              value={stats.roles}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 