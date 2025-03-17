import React, { useState } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const onFinish = async (values) => {
    try {
      const res = await authService.login(values);
      localStorage.setItem('token', res.data.token);
      message.success('Đăng nhập thành công!');
      navigate('/'); // Điều hướng đến trang chủ (Dashboard)
    } catch (error) {
      console.error(error);
      setErrorMsg(
        (error.response && error.response.data.message) ||
        'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!'
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '24px' }}>
      <h2>Đăng nhập</h2>
      {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      <p style={{ textAlign: 'center' }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </div>
  );
};

export default Login;
