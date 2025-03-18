import React, { useState, useEffect } from 'react';
import { Layout, Button, Dropdown, Menu } from 'antd';
import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, HomeOutlined, TeamOutlined, SettingOutlined, BulbOutlined } from '@ant-design/icons';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AccountManagement from './pages/AccountManagement';
import FamilyOverview from './pages/FamilyOverview';
import AddFamilyMember from './components/AddFamilyMember';
import EditFamilyMember from './components/EditFamilyMember';
import FinancialDashboard from './pages/FinancialDashboard';

const { Header, Content, Footer } = Layout;

function App() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const fullName = localStorage.getItem('username') || "User";
  const isAdmin = true;

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#333' : '#fff';
    document.body.style.color = darkMode ? '#fff' : '#333';
  }, [darkMode]);

  const userMenu = (
    <Menu theme={darkMode ? 'dark' : 'light'}>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#333' }}>
      <Header
        style={{
          background: darkMode ? '#222' : '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px #f0f1f2',
          borderBottom: darkMode ? '1px solid #555' : '1px solid #eee',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated && (
            <>
              <Link to="/" style={{ color: darkMode ? '#fff' : '#333', marginRight: '15px', display: 'flex', alignItems: 'center' }}>
                <HomeOutlined style={{ marginRight: '5px' }} /> Home
              </Link>
              <Link to="/family" style={{ color: darkMode ? '#fff' : '#333', marginRight: '15px', display: 'flex', alignItems: 'center' }}>
                <TeamOutlined style={{ marginRight: '5px' }} /> Gia phả
              </Link>
              <Link to="/financial" style={{ color: darkMode ? '#fff' : '#333', marginRight: '15px', display: 'flex', alignItems: 'center' }}>
                <TeamOutlined style={{ marginRight: '5px' }} /> Tài chính
              </Link>
              {isAdmin && (
                <Link
                  to="/auth/accounts"
                  style={{ color: darkMode ? '#fff' : '#333', marginRight: '15px', display: 'flex', alignItems: 'center' }}
                >
                  <SettingOutlined style={{ marginRight: '5px' }} /> Quản lý Tài khoản
                </Link>
              )}
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated && (
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Button type="text" style={{ color: darkMode ? '#fff' : '#333', display: 'flex', alignItems: 'center' }}>
                <UserOutlined style={{ marginRight: '5px' }} /> Xin chào, {fullName}
              </Button>
            </Dropdown>
          )}
          <Button
            type="text"
            icon={<BulbOutlined />}
            onClick={() => setDarkMode(!darkMode)}
            style={{ color: darkMode ? '#fff' : '#333', marginLeft: '15px' }}
          />
        </div>
      </Header>
      <Content style={{ padding: '24px', margin: '16px', backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#333' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/family" element={isAuthenticated ? <FamilyOverview /> : <Navigate replace to="/login" />} />
          <Route path="/family/add" element={isAuthenticated ? <AddFamilyMember /> : <Navigate replace to="/login" />} />
          <Route path="/family/edit" element={isAuthenticated ? <EditFamilyMember /> : <Navigate replace to="/login" />} />
          {isAuthenticated && isAdmin && (
            <Route path="/auth/accounts" element={<AccountManagement />} />
          )}
          <Route path="/financial" element={isAuthenticated ? <FinancialDashboard /> : <Navigate replace to="/login" />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center', background: darkMode ? '#222' : '#f0f2f5', padding: '24px', color: darkMode ? '#fff' : '#333' }}>
        © {new Date().getFullYear()} FamilyLegacy. All Rights Reserved.
      </Footer>
    </Layout>
  );
}

export default App;