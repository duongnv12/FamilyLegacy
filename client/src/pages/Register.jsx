import React, { useState } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      setErrorMsg("Mật khẩu không khớp!");
      return;
    }
    try {
      await authService.register({
        username: values.username,
        email: values.email,
        password: values.password,
        role: "Thành viên dòng họ", // Role mặc định cho người đăng ký
      });
      message.success('Đăng ký thành công!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      setErrorMsg(
        (error.response && error.response.data.message) ||
        'Đăng ký thất bại, vui lòng thử lại!'
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '24px' }}>
      <h2>Đăng ký</h2>
      {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form name="register" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
      <p style={{ textAlign: 'center' }}>
        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
      </p>
    </div>
  );
};

export default Register;
