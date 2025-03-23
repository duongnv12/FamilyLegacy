// client/src/components/EventBudgetForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Table, Row, Col, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const EventBudgetForm = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [confirmForm] = Form.useForm();
  const [currentEventId, setCurrentEventId] = useState(null); // Sự kiện đang được chọn để thiết lập ngân sách
  
  const token = localStorage.getItem('token');

  // Lấy danh sách sự kiện
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
        message.error("Lỗi khi tải danh sách sự kiện!");
      }
    };
    fetchEvents();
  }, [token]);

  // Lấy ngân sách sự kiện
  const fetchBudgets = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/financial/event-budget`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(response.data.eventBudgets);
    } catch (error) {
      console.error("Error fetching event budgets:", error);
      message.error("Lỗi khi tải danh sách ngân sách sự kiện!");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [token]);

  // Lấy danh sách thành viên (chỉ những người chưa mất)
  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/family/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(response.data.members.filter(member => member.status === 'Sống'));
    } catch (error) {
      console.error("Error fetching members:", error);
      message.error("Lỗi khi tải danh sách thành viên!");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [token]);

  // Handler submit form để thiết lập ngân sách cho sự kiện
  const onFinish = async (values) => {
    try {
      setLoading(true);
      setCurrentEventId(values.eventId);
      const payload = {
        eventId: values.eventId,
        budget: values.budget,
        notes: values.notes,
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/financial/event-budget`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success("Xác định ngân sách cho sự kiện thành công!");
      form.resetFields();
      fetchBudgets();
    } catch (error) {
      console.error("Error setting event budget:", error);
      message.error("Lỗi khi xác định ngân sách, vui lòng kiểm tra số liệu và thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Cột bảng ngân sách sự kiện
  const budgetColumns = [
    { title: "STT", key: "index", render: (_text, _record, index) => index + 1 },
    {
      title: "Tên sự kiện",
      dataIndex: "eventId",
      key: "eventId",
      render: (event) => event?.name || '-',
    },
    {
      title: "Ngân sách (VNĐ)",
      dataIndex: "budget",
      key: "budget",
      render: (budget) =>
        new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(budget) + " VND",
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD-MM-YYYY"),
    },
  ];

  // Cột bảng danh sách thành viên để xác nhận sự kiện
  const memberColumns = [
    { title: "STT", key: "index", render: (_text, _record, index) => index + 1 },
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "Ngày sinh", dataIndex: "birthDate", key: "birthDate", render: date => new Date(date).toLocaleDateString() },
    { title: "Giới tính", dataIndex: "gender", key: "gender" },
    {
      title: "Hành động",
      key: "action",
      render: (_text, record) => (
        <Button
          type="link"
          onClick={() => { setSelectedMember(record); setConfirmModalVisible(true); }}
          disabled={!currentEventId}
        >
          Xác nhận
        </Button>
      ),
    },
  ];

  // Handler cho form xác nhận đóng góp của thành viên trong modal
  const onConfirmFinish = async (values) => {
    if (!currentEventId) {
      message.error("Vui lòng chọn sự kiện để xác nhận tham gia.");
      return;
    }
    try {
      const payload = {
        eventId: currentEventId,
        contribution: values.contribution,
      };
      await axios.put(`${process.env.REACT_APP_API_URL}/events/confirm-participation/${selectedMember._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Xác nhận tham gia sự kiện thành công.");
      setConfirmModalVisible(false);
    } catch (error) {
      console.error("Error confirming participation:", error);
      message.error("Lỗi khi xác nhận, vui lòng thử lại.");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <h2>Xác định ngân sách cho sự kiện</h2>
      <Row gutter={[24, 24]}>
        {/* Cột bên trái: Form nhập vào ngân sách của sự kiện */}
        <Col xs={24} md={8}>
          <div style={{ padding: "16px", borderRight: "1px solid rgba(0,0,0,0.1)" }}>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                name="eventId"
                label="Tên sự kiện"
                rules={[{ required: true, message: "Vui lòng chọn sự kiện!" }]}
              >
                <Select placeholder="Chọn sự kiện">
                  {events.map(event => (
                    <Option key={event._id} value={event._id}>
                      {event.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="budget"
                label="Số tiền ngân sách dự kiến (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập số tiền ngân sách dự kiến!" },
                  { type: 'number', min: 1, transform: value => Number(value), message: "Số tiền phải là số dương!" }
                ]}
              >
                <Input type="number" placeholder="Nhập số tiền ngân sách" />
              </Form.Item>
              <Form.Item name="notes" label="Ghi chú">
                <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        {/* Cột bên phải: Hiển thị 2 bảng */}
        <Col xs={24} md={16}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <h3>Danh sách ngân sách sự kiện</h3>
              <Table
                columns={budgetColumns}
                dataSource={budgets}
                rowKey={(record) => record._id}
                pagination={{ pageSize: 5 }}
              />
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
            <Col span={24}>
              <h3>Danh sách thành viên để xác nhận tham gia</h3>
              <Table
                columns={memberColumns}
                dataSource={members}
                rowKey={(record) => record._id}
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: "Không có thành viên khả dụng." }}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Modal xác nhận tham gia sự kiện */}
      <Modal
        visible={confirmModalVisible}
        title={`Xác nhận tham gia cho ${selectedMember ? selectedMember.name : ""}`}
        onCancel={() => setConfirmModalVisible(false)}
        footer={null}
      >
        <Form form={confirmForm} layout="vertical" onFinish={onConfirmFinish}>
          <Form.Item
            name="contribution"
            label="Số tiền đóng góp (VNĐ)"
            rules={[
              { required: true, message: "Vui lòng nhập số tiền đóng góp!" },
              { type: 'number', min: 0, transform: value => Number(value), message: "Số tiền phải là số không âm!" }
            ]}
          >
            <Input type="number" placeholder="Nhập số tiền đóng góp" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventBudgetForm;
