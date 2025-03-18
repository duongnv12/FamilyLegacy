import React, { useState, useEffect } from 'react';
import { Table, Button, message, Space } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';

const ContributionStatusTable = ({ selectedYear }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm fetch trạng thái đóng góp dựa trên năm được chọn
  const fetchStatus = async (year) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Giả sử endpoint: GET /financial/contribution-status?year=<selectedYear>
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/financial/contribution-status?year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data.statuses);
    } catch (error) {
      console.error("Error fetching contribution status:", error);
      message.error("Lỗi khi tải dữ liệu đóng góp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      fetchStatus(selectedYear);
    }
  }, [selectedYear]);

  // Xử lý cập nhật trạng thái đã đóng cho một bản ghi
  const markAsPaid = async (record) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/financial/contribution-status/${record._id}`,
        { isPaid: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Đã đánh dấu 'đã đóng'");
      fetchStatus(selectedYear);
    } catch (error) {
      console.error("Error updating contribution status:", error);
      message.error("Lỗi khi cập nhật trạng thái đóng góp");
    }
  };

  // Format tiền theo kiểu Việt Nam
  const formatCurrency = (value) =>
    `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value)} VND`;

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Tên thành viên",
      dataIndex: "memberName",
      key: "memberName",
    },
    {
      title: "Số tiền đóng góp (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Trạng thái",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (isPaid) =>
        isPaid ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Đã đóng</span>
        ) : (
          <span style={{ color: "red" }}>Chưa đóng</span>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        !record.isPaid ? (
          <Space size="middle">
            <Button type="link" onClick={() => markAsPaid(record)}>
              Đánh dấu đã đóng
            </Button>
          </Space>
        ) : (
          <span>—</span>
        ),
    },
  ];

  return (
    <div style={{ marginTop: "24px" }}>
      <h2>Trạng thái đóng góp năm {selectedYear}</h2>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

ContributionStatusTable.propTypes = {
  selectedYear: PropTypes.string.isRequired,
};

export default ContributionStatusTable;
