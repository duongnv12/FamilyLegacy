// src/components/ExpenseApproval.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Form, Input, Space } from 'antd';
import axios from 'axios';

const ExpenseApproval = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Fetch danh sách đề xuất chi tiêu
  const fetchProposals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/financial/expense-proposals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProposals(response.data.proposals);
    } catch (error) {
      console.error("Error fetching expense proposals:", error);
      message.error("Lỗi khi tải danh sách đề xuất chi tiêu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  // Khi người dùng nhấn nút Duyệt hoặc Từ chối, mở modal và lưu trạng thái đề xuất cần xử lý
  const handleAction = (proposal, decision) => {
    // Sửa trạng thái đề xuất: "approved" hoặc "rejected"
    setSelectedProposal({ ...proposal, decision });
    form.resetFields();
    setModalVisible(true);
  };

  // Xử lý send data đưa lên server (PUT update expense proposal)
  const handleSubmitApproval = async (values) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const payload = {
        status: selectedProposal.decision,
        notes: values.notes || "",
      };
      await axios.put(`${process.env.REACT_APP_API_URL}/financial/expense-proposals/${selectedProposal._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Cập nhật đề xuất chi tiêu thành công");
      setModalVisible(false);
      fetchProposals();
    } catch (error) {
      console.error("Error updating expense proposal:", error);
      message.error("Lỗi khi cập nhật đề xuất, vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Nội dung chi tiêu",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số tiền dự kiến (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(amount) + " VND",
    },
    {
      title: "Người đề xuất",
      dataIndex: "proposer",
      key: "proposer",
      render: (proposer) => proposer?.name || "-",
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => status || "Pending",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, proposal) => (
        <Space>
          <Button type="primary" onClick={() => handleAction(proposal, 'approved')}>Duyệt</Button>
          <Button type="danger" onClick={() => handleAction(proposal, 'rejected')}>Từ chối</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '24px' }}>
      <h2>Duyệt và Phê duyệt đề xuất chi tiêu</h2>
      <Table
        columns={columns}
        dataSource={proposals}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        visible={modalVisible}
        title={selectedProposal?.decision === 'approved' ? "Duyệt đề xuất" : "Từ chối đề xuất"}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmitApproval} layout="vertical">
          <Form.Item name="notes" label="Ghi chú bổ sung (nếu có)">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú nếu cần" />
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Xác nhận
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpenseApproval;
