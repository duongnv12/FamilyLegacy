// src/components/RecordVoluntaryContributionForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, Row, Col, message } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import VoluntaryContributionTable from './VoluntaryContributionTable';

const { Option } = Select;

const RecordVoluntaryContributionForm = ({ onRecordSuccess, onYearChange }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [form] = Form.useForm();

  // Lấy danh sách thành viên có status "Sống"
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/family/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Lọc chỉ thành viên có trạng thái "Sống"
        setMembers(response.data.members.filter(member => member.status === 'Sống'));
      } catch (error) {
        console.error('Error fetching members:', error);
        message.error('Lỗi khi tải danh sách thành viên!');
      }
    };
    fetchMembers();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const payload = {
        contributor: values.contributor,
        amount: values.amount,
        date: values.date.format('YYYY-MM-DD'),
        notes: values.notes,
        contributionType: values.contributionType,
      };
      await axios.post(
        `${process.env.REACT_APP_API_URL}/financial/voluntary-contribution`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Ghi nhận khoản ủng hộ thành công!");
      const yearStr = values.date.format('YYYY');
      setSelectedYear(yearStr);
      if (onRecordSuccess) onRecordSuccess(yearStr);
      if (onYearChange) onYearChange(yearStr);
      setRefreshData(prev => !prev);
      form.resetFields();
    } catch (error) {
      console.error('Error recording voluntary contribution:', error);
      message.error("Lỗi khi ghi nhận khoản ủng hộ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
      <Row gutter={[16, 16]}>
        {/* Left Column: Form nhập liệu */}
        <Col xs={24} md={10}>
          <div style={{ padding: '16px', borderRight: '1px solid rgba(0, 0, 0, 0.1)', minHeight: '100%' }}>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <h2>Ghi nhận khoản ủng hộ</h2>
              <Form.Item
                name="contributionType"
                label="Chọn loại đóng góp"
                rules={[{ required: true, message: "Vui lòng chọn loại đóng góp!" }]}
              >
                <Select placeholder="Chọn loại đóng góp">
                  <Option value="voluntary">Ủng hộ</Option>
                  <Option value="donation">Khuyến góp</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="contributor"
                label="Tên thành viên"
                rules={[{ required: true, message: "Vui lòng chọn thành viên!" }]}
              >
                <Select placeholder="Chọn thành viên">
                  {members.map((member) => (
                    <Option key={member._id} value={member._id}>
                      {member.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="amount"
                label="Số tiền đóng góp (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập số tiền đóng góp!" }]}
              >
                <Input type="number" placeholder="Nhập số tiền đóng góp" />
              </Form.Item>
              <Form.Item
                name="date"
                label="Ngày giao dịch"
                rules={[{ required: true, message: "Vui lòng chọn ngày giao dịch!" }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Chọn ngày (DD-MM-YYYY)"
                  format="DD-MM-YYYY"
                />
              </Form.Item>
              <Form.Item name="notes" label="Ghi chú">
                <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
        {/* Right Column: Bảng giao dịch ủng hộ */}
        <Col xs={24} md={14}>
          <VoluntaryContributionTable selectedYear={selectedYear || dayjs().format('YYYY')} refreshData={refreshData} />
        </Col>
      </Row>
    </div>
  );
};

RecordVoluntaryContributionForm.propTypes = {
  onRecordSuccess: PropTypes.func,
  onYearChange: PropTypes.func,
};

export default RecordVoluntaryContributionForm;
