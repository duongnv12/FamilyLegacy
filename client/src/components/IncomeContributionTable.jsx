import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const IncomeContributionTable = ({ selectedYear, refreshData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContributions = async (year) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch income contributions for the selected year
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/financial/income-transactions?year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data.transactions);
    } catch (error) {
      console.error("Error fetching income transactions:", error);
      message.error("Lỗi khi tải danh sách giao dịch thu");
    } finally {
      setLoading(false);
    }
  };

  // Fetch contributions whenever `selectedYear` or `refreshData` changes
  useEffect(() => {
    if (selectedYear) {
      fetchContributions(selectedYear);
    }
  }, [selectedYear, refreshData]);

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
      title: "Số tiền (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        `${new Intl.NumberFormat("vi-VN", {
          maximumFractionDigits: 0,
        }).format(amount)} VND`,
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD-MM-YYYY"),
    },
    {
      title: "Loại giao dịch",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) =>
        type === "definited" ? "Đóng góp định mức" : "Ủng hộ ngoài định mức",
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
    },
  ];

  return (
    <div style={{ marginTop: "24px" }}>
      <h3>Danh sách giao dịch thu năm {selectedYear}</h3>
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

// PropTypes validation
IncomeContributionTable.propTypes = {
  selectedYear: PropTypes.string.isRequired, // Prop bắt buộc
  refreshData: PropTypes.bool, // Prop không bắt buộc
};

export default IncomeContributionTable;
