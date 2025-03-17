import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [form] = Form.useForm();

  // Hàm lấy danh sách tài khoản
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/accounts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAccounts(response.data.accounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      message.error('Lỗi khi tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const onEdit = (account) => {
    setEditingAccount(account);
    form.setFieldsValue({
      email: account.email,
      role: account.role,
    });
  };

  const onUpdate = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/accounts/${editingAccount._id}`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success('Cập nhật tài khoản thành công');
      fetchAccounts();
      setEditingAccount(null);
    } catch (error) {
      console.error(error);
      message.error('Cập nhật tài khoản thất bại');
    }
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => onEdit(record)}>
          Chỉnh sửa
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>Quản lý Tài khoản</h2>
      <Table
        columns={columns}
        dataSource={accounts}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
      {editingAccount && (
        <div style={{ marginTop: '24px', padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <h3>Chỉnh sửa tài khoản: {editingAccount.username}</h3>
          <Form form={form} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Email không được để trống' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            >
              <Select placeholder="Chọn vai trò">
                <Option value="Hội đồng gia tộc">Hội đồng gia tộc</Option>
                <Option value="Hội đồng tài chính">Hội đồng tài chính</Option>
                <Option value="Thành viên dòng họ">Thành viên dòng họ</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={onUpdate}>
                Lưu thay đổi
              </Button>
              <Button onClick={() => setEditingAccount(null)} style={{ marginLeft: '8px' }}>
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
