import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import axios from 'axios';
import ContributionStatusTable from './ContributionStatusTable';

const SetContributionForm = () => {
  const [loading, setLoading] = useState(false);
  // selectedYear sẽ được dùng để hiển thị bảng trạng thái đóng góp (theo năm được thiết lập)
  const [selectedYear, setSelectedYear] = useState(null);
  // Dùng để chọn năm hiển thị riêng trong bảng (có thể khác với năm vừa thiết lập)
  const [yearForStatus, setYearForStatus] = useState(null);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const payload = {
        amount: values.amount,
        year: values.year.format('YYYY'),
        notes: values.notes,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/financial/set-contribution`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message || "Thiết lập mức đóng góp thành công!");
      const yearStr = values.year.format('YYYY');
      // Sau khi thiết lập, lưu lại năm
      setSelectedYear(yearStr);
      setYearForStatus(yearStr);
    } catch (error) {
      console.error("Error setting contribution:", error);
      message.error("Lỗi khi thiết lập mức đóng góp!");
    } finally {
      setLoading(false);
    }
  };

  const onStatusYearChange = (date, dateString) => {
    setYearForStatus(dateString);
  };

  const onShowStatus = () => {
    if (!yearForStatus) {
      message.error("Vui lòng chọn năm để hiển thị trạng thái.");
      return;
    }
    setSelectedYear(yearForStatus);
  };

  return (
    <div style={{ maxWidth: '1500px', margin: '0 auto', display: 'flex', gap: '16px' }}>
      {/* Left Column: Form thiết lập mức đóng góp */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: '16px' }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <h2>Thiết lập mức đóng góp tài chính hàng năm</h2>
          <Form.Item
            name="amount"
            label="Mức đóng góp (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập mức đóng góp!" }]}
          >
            <Input type="number" placeholder="Nhập số tiền (VNĐ)" />
          </Form.Item>
          <Form.Item
            name="year"
            label="Năm áp dụng"
            rules={[{ required: true, message: "Vui lòng chọn năm áp dụng!" }]}
          >
            <DatePicker picker="year" style={{ width: '100%' }} />
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
      </div>
      {/* Right Column: Ô chọn năm để thay đổi và hiển thị bảng trạng thái đóng góp */}
      <div style={{ flex: 1}}>
        <Form layout="inline" style={{ marginBottom: "16px" }}>
          <Form.Item label="Chọn năm">
            <DatePicker picker="year" onChange={onStatusYearChange} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={onShowStatus}>
              Hiển thị
            </Button>
          </Form.Item>
        </Form>
        {selectedYear ? (
          <ContributionStatusTable selectedYear={selectedYear} />
        ) : (
          <div>Vui lòng thiết lập mức đóng góp hoặc chọn năm để hiển thị bảng trạng thái.</div>
        )}
      </div>
    </div>
  );
};

export default SetContributionForm;
