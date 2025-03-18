import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EventTransactionForm = () => {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const eventsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const membersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/family/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(eventsResponse.data.events);
        setMembers(membersResponse.data.members);
      } catch (error) {
        console.error('Error fetching events or members:', error);
        message.error('Lỗi khi tải dữ liệu sự kiện hoặc thành viên');
      }
    };
    fetchData();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const payload = {
        eventId: values.eventId,
        amount: values.amount,
        date: values.date.format('YYYY-MM-DD'),
        description: values.description,
        responsiblePerson: values.responsiblePerson,
        notes: values.notes,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/financial/event-expense`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message || 'Ghi nhận khoản chi thành công.');
    } catch (error) {
      console.error('Error recording expense:', error);
      message.error('Lỗi khi ghi nhận khoản chi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Ghi nhận khoản chi cho sự kiện</h2>
      <Form.Item
        name="eventId"
        label="Tên sự kiện"
        rules={[{ required: true, message: 'Vui lòng chọn sự kiện!' }]}
      >
        <Select placeholder="Chọn sự kiện">
          {events.map((event) => (
            <Option key={event._id} value={event._id}>
              {event.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="responsiblePerson"
        label="Người chịu trách nhiệm chi"
        rules={[{ required: true, message: 'Vui lòng chọn người chịu trách nhiệm!' }]}
      >
        <Select placeholder="Chọn người chịu trách nhiệm">
          {members.map((member) => (
            <Option key={member._id} value={member._id}>
              {member.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="amount"
        label="Số tiền chi (VNĐ)"
        rules={[{ required: true, message: 'Vui lòng nhập số tiền chi!' }]}
      >
        <Input type="number" placeholder="Nhập số tiền chi" />
      </Form.Item>
      <Form.Item
        name="date"
        label="Ngày chi"
        rules={[{ required: true, message: 'Vui lòng chọn ngày chi!' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="description"
        label="Mục chi"
        rules={[{ required: true, message: 'Vui lòng nhập mục chi!' }]}
      >
        <Input placeholder="Ví dụ: thuê địa điểm, catering, trang trí, ..." />
      </Form.Item>
      <Form.Item name="notes" label="Ghi chú">
        <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu cần)" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EventTransactionForm;
