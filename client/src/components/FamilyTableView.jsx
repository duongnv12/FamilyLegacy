import React, { useEffect, useState } from 'react';
import { Table, Button, message, Space } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const FamilyTableView = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/family/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(response.data.members);
    } catch (error) {
      console.error('Error fetching members:', error);
      message.error('Lỗi khi tải danh sách thành viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Chuyển hướng sang trang edit với state chứa dữ liệu thành viên
  const onEdit = (record) => {
    navigate('/family/edit', { state: { member: record } });
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Nơi sinh',
      dataIndex: 'placeOfBirth',
      key: 'placeOfBirth',
    },
    {
      title: 'Trạng thái sống',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Hôn nhân',
      key: 'marriedInfo',
      render: (record) => {
        if (record.marriedInfo && record.marriedInfo.date) {
          return `${dayjs(record.marriedInfo.date).format('DD-MM-YYYY')} tại ${record.marriedInfo.location || '-'}`;
        }
        return '-';
      },
    },
    {
      title: 'Mất',
      key: 'deceasedInfo',
      render: (record) => {
        if (record.deceasedInfo && record.deceasedInfo.date) {
          return `${dayjs(record.deceasedInfo.date).format('DD-MM-YYYY')} tại ${record.deceasedInfo.location || '-'}`;
        }
        return '-';
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => onEdit(record)}>Sửa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={fetchMembers} style={{ marginBottom: '16px' }}>
        Tải lại danh sách
      </Button>
      <Table
        columns={columns}
        dataSource={members}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default FamilyTableView;
