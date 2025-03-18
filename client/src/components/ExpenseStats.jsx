// src/components/ExpenseStats.jsx
import React, { useState } from 'react';
import { Form, Select, Button, Table, message, Row, Col } from 'antd';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const { Option } = Select;

const ExpenseStats = () => {
  const [groupBy, setGroupBy] = useState('event'); // Có thể giá trị: event, purpose, month
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/financial/expense-stats?groupBy=${groupBy}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.data.stats || response.data.stats.length === 0) {
        message.info("Không có dữ liệu khoản chi theo tiêu chí");
        setStats([]);
      } else {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching expense stats:", error);
      message.error("Lỗi khi tải thống kê các khoản chi");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = () => {
    fetchStats();
  };

  // Hàm chuyển đổi giá trị nhóm theo tiêu chí thống kê
  const renderGroup = (value) => {
    if (groupBy === 'event') {
      return value || "Chưa xác định";
    }
    if (groupBy === 'purpose') {
      return value || "Chưa xác định";
    }
    if (groupBy === 'month') {
      // Giá trị value giả định là số từ 1 đến 12
      const monthNames = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
      ];
      return monthNames[value - 1] || value;
    }
    return value;
  };

  const tableColumns = [
    {
      title: "Nhóm",
      dataIndex: "_id",
      key: "_id",
      render: (value) => renderGroup(value),
    },
    {
      title: "Tổng chi (VNĐ)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(amount) + " VND",
    },
    {
      title: "Số giao dịch",
      dataIndex: "count",
      key: "count",
    },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h2>Thống kê và báo cáo các khoản chi</h2>
      <Form layout="inline" onFinish={onFinish} style={{ marginBottom: '16px' }}>
        <Form.Item label="Tiêu chí thống kê">
          <Select
            value={groupBy}
            onChange={(value) => setGroupBy(value)}
            style={{ width: 200 }}
          >
            <Option value="event">Theo sự kiện</Option>
            <Option value="purpose">Theo mục chi</Option>
            <Option value="month">Theo tháng</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thống kê
          </Button>
        </Form.Item>
      </Form>
      <Row gutter={[16, 16]}>
        {/* Biểu đồ cột */}
        <Col xs={24} md={12}>
          <h3>Biểu đồ cột</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tickFormatter={renderGroup} />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value)
                }
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value) + " VND"
                }
                labelFormatter={renderGroup}
              />
              <Legend />
              <Bar dataKey="totalAmount" fill="#8884d8" name="Tổng chi" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
        {/* Biểu đồ tròn */}
        <Col xs={24} md={12}>
          <h3>Biểu đồ tròn</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={stats}
                dataKey="totalAmount"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value) + " VND"
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Col>
      </Row>
      <h3>Bảng thống kê giao dịch chi</h3>
      <Table
        columns={tableColumns}
        dataSource={stats}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "Không có dữ liệu khoản chi theo tiêu chí" }}
      />
    </div>
  );
};

export default ExpenseStats;
