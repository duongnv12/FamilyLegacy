// src/pages/Home.jsx (nếu Home vừa được dùng làm dashboard)
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Chào mừng đến với FamilyLegacy Dashboard</h2>
      <p>Quản trị viên có thể truy cập các chức năng quản lý từ đây.</p>
      <div style={{ margin: '20px 0' }}>
        <Link to="/admin/accounts">

        </Link>
        {/* Có thể thêm nút điều hướng khác nếu cần */}
      </div>
    </div>
  );
};

export default Home;
