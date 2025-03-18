// src/components/EventBudgetForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Table, Row, Col } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const EventBudgetForm = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách sự kiện từ API GET /api/events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
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
  }, []);

  // Lấy danh sách ngân sách sự kiện từ API GET /api/financial/event-budget
  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/financial/event-budget`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Giả sử response trả về { eventBudgets: [...] }
      setBudgets(response.data.eventBudgets);
    } catch (error) {
      console.error("Error fetching event budgets:", error);
      message.error("Lỗi khi tải danh sách ngân sách sự kiện!");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Handler submit form để thiết lập ngân sách sự kiện
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
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
      fetchBudgets(); // làm mới bảng sau khi lưu
    } catch (error) {
      console.error("Error setting event budget:", error);
      message.error("Lỗi khi xác định ngân sách, vui lòng kiểm tra số liệu và thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Bảng hiển thị ngân sách sự kiện
  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
    },
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
      render: (budget) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(budget) + " VND",
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

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <h2>Xác định ngân sách cho sự kiện</h2>
      <Row gutter={[24, 24]}>
        {/* Form nhập liệu được đặt ở cột bên trái */}
        <Col xs={24} md={8}>
          <div style={{ padding: "16px", borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
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
                  { 
                    type: 'number', 
                    min: 1, 
                    transform: value => Number(value),
                    message: "Số tiền phải là số dương!" 
                  }
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
        {/* Bảng hiển thị danh sách ngân sách, đặt ở cột bên phải */}
        <Col xs={24} md={16}>
          <h3>Danh sách ngân sách sự kiện</h3>
          <Table
            columns={columns}
            dataSource={budgets}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 5 }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default EventBudgetForm;
