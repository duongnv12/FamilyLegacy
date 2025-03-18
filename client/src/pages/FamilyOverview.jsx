import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import FamilyTreeDiagram from '../components/FamilyTreeDiagram';
import FamilyTableView from '../components/FamilyTableView';
import FamilyStats from '../components/FamilyStats';

const FamilyOverview = () => {
  return (
    <div style={{ padding: '8px 24px' }}>
      <h2>Thông tin Gia phả</h2>
      <Button type="primary" style={{ marginBottom: '16px' }}>
        <Link to="/family/add">Thêm thành viên mới</Link>
      </Button>
      <div style={{ marginBottom: '32px' }}>
        <h3>Cây gia phả trực quan</h3>
        <FamilyTreeDiagram />
      </div>
      <div style={{ marginBottom: '32px' }}>
        <h3>Danh sách thành viên</h3>
        <FamilyTableView />
      </div>
      <FamilyStats />
    </div>
  );
};

export default FamilyOverview;
