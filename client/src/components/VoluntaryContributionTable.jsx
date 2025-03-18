// src/components/VoluntaryContributionTable.jsx
import React, { useState, useEffect } from 'react';
import { Table, DatePicker, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const VoluntaryContributionTable = ({ defaultYear, refreshData }) => {
  // Nếu không truyền defaultYear từ ngoài, mặc định lấy năm hiện tại
  const [selectedYear, setSelectedYear] = useState(defaultYear || dayjs().format('YYYY'));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm fetch dữ liệu giao dịch dựa trên năm được chọn
  const fetchContributions = async (year) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/financial/voluntary-contributions?year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data.transactions);
    } catch (error) {
      console.error("Error fetching voluntary contributions:", error);
      message.error("Lỗi khi tải danh sách khoản ủng hộ!");
    } finally {
      setLoading(false);
    }
  };

  // Khi selectedYear hoặc refreshData thay đổi thì tải lại dữ liệu
  useEffect(() => {
    if (selectedYear) {
      fetchContributions(selectedYear);
    }
  }, [selectedYear, refreshData]);

  // Xử lý khi người dùng chọn năm mới
  const onYearChange = (date, dateString) => {
    setSelectedYear(dateString);
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Tên thành viên",
      dataIndex: ["contributor", "name"],
      key: "memberName",
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(amount) + " VND",
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD-MM-YYYY"),
    },
    {
      title: "Loại đóng góp",
      dataIndex: "type", // Chúng ta lấy giá trị từ trường "type" (voluntary / donation)
      key: "type",
      render: (type) => {
        if (type === "voluntary") return "Ủng hộ";
        if (type === "donation") return "Khuyến góp";
        return type ? type : "—";
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
    },
  ];

  return (
    <div >
      {/* Phần chọn năm */}
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
        <DatePicker
          picker="year"
          onChange={onYearChange}
          value={dayjs(selectedYear, 'YYYY')}
          format="YYYY"
          style={{ marginRight: "16px" }}
        /> 
      </div>
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

VoluntaryContributionTable.propTypes = {
  defaultYear: PropTypes.string,
  refreshData: PropTypes.bool,
};

export default VoluntaryContributionTable;
