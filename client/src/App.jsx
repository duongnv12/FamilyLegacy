import React from 'react';
import { Layout, Button, Menu } from 'antd';
import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, HomeOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AccountManagement from './pages/AccountManagement';
import FamilyOverview from './pages/FamilyOverview';
import AddFamilyMember from './components/AddFamilyMember';
import EditFamilyMember from './components/EditFamilyMember';
import FinancialDashboard from './pages/FinancialDashboard';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const fullName = localStorage.getItem('username') || "User";
  const isAdmin = true;

  const navigationMenu = (
    <Menu mode="inline">
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="family" icon={<TeamOutlined />}>
        <Link to="/family">Gia phả</Link>
      </Menu.Item>
      <Menu.Item key="financial" icon={<TeamOutlined />}>
        <Link to="/financial">Tài chính</Link>
      </Menu.Item>
      {isAdmin && (
        <Menu.Item key="account-management" icon={<SettingOutlined />}>
          <Link to="/auth/accounts">Quản lý Tài khoản</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sider
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
          FamilyLegacy
        </div>
        {navigationMenu}
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserOutlined style={{ fontSize: '18px', marginRight: '5px' }} />
                <span>Xin chào, {fullName}</span>
              </div>
            )}
          </div>
          {isAuthenticated && (
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
              style={{
                backgroundColor: '#ff4d4f',
                borderColor: '#ff4d4f',
                color: '#fff',
              }}
            >
              Đăng xuất
            </Button>
          )}
        </Header>
        <Content style={{ padding: '24px', margin: '16px', backgroundColor: '#fff' }}>
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
        <Footer style={{ textAlign: 'center', background: '#f0f2f5', padding: '24px' }}>
          © {new Date().getFullYear()} FamilyLegacy. All Rights Reserved.
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;
