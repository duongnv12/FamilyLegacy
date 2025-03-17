// src/components/FamilyStats.jsx
import React, { useState } from 'react';
import { Form, Select, Button, message, Table } from 'antd';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const { Option } = Select;

const FamilyStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupBy, setGroupBy] = useState('gender');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/family/stats?groupBy=${groupBy}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi thống kê");
    } finally {
      setLoading(false);
    }
  };

  // Bảng thống kê sử dụng Ant Design Table.
  const columns = [
    {
      title: groupBy.charAt(0).toUpperCase() + groupBy.slice(1),
      dataIndex: '_id',
      key: 'group',
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  // Các màu cho biểu đồ tròn, bạn có thể tùy chỉnh
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#af19ff', '#f259b4'];

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Thống kê thành viên theo tiêu chí</h3>
      <Form layout="inline" style={{ marginBottom: '16px' }}>
        <Form.Item label="Tiêu chí">
          <Select value={groupBy} onChange={(value) => setGroupBy(value)} style={{ width: 150 }}>
            <Option value="gender">Giới tính</Option>
            <Option value="status">Trạng thái sống</Option>
            <Option value="role">Vai trò</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={fetchStats}>
            Thống kê
          </Button>
        </Form.Item>
      </Form>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* Bảng thống kê */}
        <div style={{ flex: 1, minWidth: 300, marginRight: '24px' }}>
          <Table 
            columns={columns} 
            dataSource={stats} 
            rowKey={(record) => record._id} 
            loading={loading} 
            pagination={false}
          />
        </div>

        {/* Biểu đồ tròn thống kê */}
        <div style={{ flex: 1, minWidth: 800, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={stats} 
                dataKey="count" 
                nameKey="_id" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                fill="#8884d8"
                label
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FamilyStats;
