// src/components/EventExpenseForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, message, Table, Row, Col } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const EventExpenseForm = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách sự kiện từ phía server
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

  // Lấy danh sách thành viên (lọc chỉ những người có status "Sống")
  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/family/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(response.data.members.filter(member => member.status === 'Sống'));
    } catch (error) {
      console.error("Error fetching members:", error);
      message.error("Lỗi khi tải danh sách thành viên!");
    }
  };

  // Lấy danh sách giao dịch chi cho sự kiện
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/financial/event-expense`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Giả sử API trả về { expenses: [...] }
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error fetching event expenses:", error);
      message.error("Lỗi khi tải danh sách khoản chi cho sự kiện!");
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchMembers();
    fetchExpenses();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const payload = {
        eventId: values.eventId,
        amount: values.amount,
        date: values.date.format('YYYY-MM-DD'),
        description: values.expensePurpose, // Mục chi
        responsiblePerson: values.responsiblePerson,
        notes: values.notes,
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/financial/event-expense`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Ghi nhận khoản chi cho sự kiện thành công!");
      form.resetFields();
      fetchExpenses(); // Làm mới bảng sau khi lưu
    } catch (error) {
      console.error("Error recording event expense:", error);
      message.error("Lỗi khi ghi nhận khoản chi, vui lòng kiểm tra số liệu và thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Các cột cho bảng hiển thị danh sách giao dịch chi
  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên sự kiện",
      dataIndex: "eventId",
      key: "eventId",
      render: (eventObj) => eventObj?.name || '-',
    },
    {
      title: "Ngày chi",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD-MM-YYYY"),
    },
    {
      title: "Số tiền chi (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(amount) + " VND",
    },
    {
      title: "Mục chi",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Người chịu trách nhiệm",
      dataIndex: "responsiblePerson",
      key: "responsiblePerson",
      render: (person) => person?.name || '-',
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
    },
  ];

  return (
    <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '24px' }}>
      <h2>Ghi nhận khoản chi cho sự kiện</h2>
      <Row gutter={[24, 16]}>
        {/* Cột bên trái: Form nhập liệu */}
        <Col xs={24} md={8}>
          <div style={{ padding: '16px', borderRight: '1px solid rgba(0, 0, 0, 0.1)', minHeight: '100%' }}>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                name="eventId"
                label="Tên sự kiện"
                rules={[{ required: true, message: "Vui lòng chọn sự kiện!" }]}
              >
                <Select placeholder="Chọn sự kiện">
                  {events.map(ev => (
                    <Option key={ev._id} value={ev._id}>
                      {ev.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="date"
                label="Ngày chi"
                rules={[{ required: true, message: "Vui lòng chọn ngày chi!" }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD-MM-YYYY"
                  placeholder="Chọn ngày chi"
                />
              </Form.Item>
              <Form.Item
                name="amount"
                label="Số tiền chi (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập số tiền chi!" },
                  {
                    transform: value => Number(value),
                    type: 'number',
                    min: 1,
                    message: "Số tiền phải là số dương!"
                  },
                ]}
              >
                <Input type="number" placeholder="Nhập số tiền chi" />
              </Form.Item>
              <Form.Item
                name="expensePurpose"
                label="Mục chi"
                rules={[{ required: true, message: "Vui lòng nhập mục chi!" }]}
              >
                <Input placeholder="Ví dụ: thuê địa điểm, catering, trang trí, ..." />
              </Form.Item>
              <Form.Item
                name="responsiblePerson"
                label="Người chịu trách nhiệm chi"
                rules={[{ required: true, message: "Vui lòng chọn người chịu trách nhiệm!" }]}
              >
                <Select placeholder="Chọn người chịu trách nhiệm">
                  {members.map(member => (
                    <Option key={member._id} value={member._id}>
                      {member.name}
                    </Option>
                  ))}
                </Select>
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
        {/* Cột bên phải: Bảng hiển thị danh sách giao dịch chi */}
        <Col xs={24} md={16}>
          <h3>Danh sách khoản chi đã ghi nhận</h3>
          <Table
            columns={columns}
            dataSource={expenses}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 5 }}
            // Bảng luôn hiển thị: nếu không có dữ liệu, sẽ hiển thị mặc định thông báo "Không có dữ liệu"
            locale={{ emptyText: "Không có giao dịch nào" }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default EventExpenseForm;
