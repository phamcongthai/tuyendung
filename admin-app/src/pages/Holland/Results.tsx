import React, { useEffect, useState } from 'react';
import { Table, Tag, Space } from 'antd';
import { hollandAPI } from '../../apis/holland.api';
import type { HollandResult } from '../../apis/holland.api';

const Results: React.FC = () => {
  const [results, setResults] = useState<HollandResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const loadData = async (p = 1) => {
    setLoading(true);
    try {
      const data = await hollandAPI.getResults(p, 20) as { data: HollandResult[]; total: number };
      setResults(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error(error);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: ['accountId', 'fullName'],
      key: 'user',
      render: (_: any, record: HollandResult) => 
        record.accountId?.fullName || record.accountId?.email || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: ['accountId', 'email'],
      key: 'email',
    },
    {
      title: 'Mã Holland',
      dataIndex: 'topCode',
      key: 'topCode',
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Điểm số',
      key: 'scores',
      render: (_: any, record: HollandResult) => (
        <Space>
          {Object.entries(record.scores).map(([key, value]) => (
            <Tag key={key} color="green">{key}: {value}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Ngày làm test',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Kết quả Holland Test của người dùng</h2>
      <Table
        columns={columns}
        dataSource={results}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: 20,
          total,
          onChange: (p) => setPage(p),
        }}
      />
    </div>
  );
};

export default Results;
