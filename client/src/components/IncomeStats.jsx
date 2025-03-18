// src/components/IncomeStats.jsx
import React, { useState } from 'react';
import { Form, Select, Button, Table, message, Row, Col } from 'antd';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const { Option } = Select;

const IncomeStats = () => {
  const [groupBy, setGroupBy] = useState('contributor');
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [baselineStats, setBaselineStats] = useState([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Lấy thống kê giao dịch thu (bao gồm cả mức đóng góp và khoản ủng hộ)
      const incomeResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/financial/income-stats?groupBy=${groupBy}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!incomeResponse.data.stats || incomeResponse.data.stats.length === 0) {
        message.info("Không có dữ liệu giao dịch theo tiêu chí đã chọn");
        setStats([]);
      } else {
        setStats(incomeResponse.data.stats);
      }
      
      // Lấy thống kê định mức đóng góp từ FinancialContribution
      const baselineResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/financial/set-contribution`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!baselineResponse.data.baselineStats || baselineResponse.data.baselineStats.length === 0) {
        message.info("Không có dữ liệu định mức đóng góp");
        setBaselineStats([]);
      } else {
        setBaselineStats(baselineResponse.data.baselineStats);
      }
    } catch (error) {
      console.error("Error fetching income stats:", error);
      message.error("Lỗi khi tải thống kê các khoản thu");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = () => {
    fetchStats();
  };

  // Hàm chuyển đổi giá trị nhóm nếu thống kê theo loại giao dịch
  const renderGroup = (value) => {
    if (groupBy === 'type') {
      if (value === 'income') return "Đóng góp định mức";
      if (value === 'voluntary') return "Ủng hộ";
      if (value === 'donation') return "Khuyến góp";
      return value;
    }
    return value || "Chưa xác định";
  };

  // Các cột hiển thị trong bảng thống kê giao dịch thu
  const tableColumns = [
    {
      title: "Nhóm",
      dataIndex: "_id",
      key: "_id",
      render: (value) => renderGroup(value),
    },
    {
      title: "Tổng tiền (VNĐ)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(amount) + " VND",
    },
    {
      title: "Số lượng giao dịch",
      dataIndex: "count",
      key: "count",
    },
  ];

  // Màu sắc cho biểu đồ tròn
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      <h2>Thống kê và báo cáo các khoản thu</h2>
      <Form layout="inline" onFinish={onFinish} style={{ marginBottom: '16px' }}>
        <Form.Item label="Tiêu chí thống kê">
          <Select
            value={groupBy}
            onChange={(value) => setGroupBy(value)}
            style={{ width: 200 }}
          >
            <Option value="contributor">Theo người đóng góp</Option>
            <Option value="month">Theo tháng</Option>
            <Option value="type">Theo loại giao dịch</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thống kê
          </Button>
        </Form.Item>
      </Form>
      <Row gutter={[16, 16]}>
        {/* Cột biểu đồ cột */}
        <Col xs={24} md={12}>
          <h3>Biểu đồ cột</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tickFormatter={renderGroup} />
              <YAxis tickFormatter={(value) =>
                new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value)
              } />
              <Tooltip 
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value) + " VND"
                }
                labelFormatter={(label) => renderGroup(label)}
              />
              <Legend />
              <Bar dataKey="totalAmount" fill="#8884d8" name="Tổng số tiền" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
        {/* Cột biểu đồ tròn */}
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
      <h3>Bảng thống kê giao dịch thu</h3>
      <Table
        columns={tableColumns}
        dataSource={stats}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
      <h3>Thống kê định mức đóng góp</h3>
      <Table
        columns={[
          {
            title: "Năm",
            dataIndex: "year",
            key: "year",
          },
          {
            title: "Mức đóng góp (VNĐ)",
            dataIndex: "baselineAmount",
            key: "baselineAmount",
            render: (amount) =>
              new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(amount) + " VND",
          },
          {
            title: "Tổng dự kiến (VNĐ)",
            dataIndex: "totalExpected",
            key: "totalExpected",
            render: (amount) =>
              new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(amount) + " VND",
          },
        ]}
        dataSource={baselineStats}
        rowKey={(record) => record.year}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

IncomeStats.propTypes = {};

export default IncomeStats;
