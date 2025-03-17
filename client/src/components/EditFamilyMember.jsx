import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';

const { Option } = Select;

const EditFamilyView = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { state } = useLocation();
  const editingMember = state?.member;

  useEffect(() => {
    if (!editingMember) {
      message.error('Không có dữ liệu để chỉnh sửa');
      navigate('/family');
      return;
    }
    // Pre-fill dữ liệu, chuyển đổi ngày dùng dayjs
    form.setFieldsValue({
      name: editingMember.name,
      birthDate: editingMember.birthDate ? dayjs(editingMember.birthDate, 'DD-MM-YYYY') : null,
      gender: editingMember.gender,
      placeOfBirth: editingMember.placeOfBirth,
      additionalInfo: editingMember.additionalInfo,
      role: editingMember.role,
      parentId: editingMember.parentId,
      marriedDate: editingMember.marriedInfo?.date ? dayjs(editingMember.marriedInfo.date, 'DD-MM-YYYY') : null,
      marriedLocation: editingMember.marriedInfo?.location,
      marriedNotes: editingMember.marriedInfo?.notes,
      spouseName: editingMember.marriedInfo?.spouse?.name,
      deceasedDate: editingMember.deceasedInfo?.date ? dayjs(editingMember.deceasedInfo.date, 'DD-MM-YYYY') : null,
      deceasedLocation: editingMember.deceasedInfo?.location,
      deceasedReason: editingMember.deceasedInfo?.reason,
      deceasedNotes: editingMember.deceasedInfo?.notes,
    });
  }, [editingMember, form, navigate]);

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const memberData = {
        name: values.name,
        birthDate: values.birthDate.format('DD-MM-YYYY'),
        gender: values.gender,
        placeOfBirth: values.placeOfBirth,
        additionalInfo: values.additionalInfo,
        role: values.role || 'Member',
        parentId: values.parentId || null,
      };

      if (values.marriedDate) {
        memberData.marriedInfo = {
          date: values.marriedDate.format('DD-MM-YYYY'),
          location: values.marriedLocation || '',
          notes: values.marriedNotes || '',
          spouse: {
            name: values.spouseName || '',
            birthDate: null,
            gender: null,
          }
        };
      }
      if (values.deceasedDate) {
        memberData.deceasedInfo = {
          date: values.deceasedDate.format('DD-MM-YYYY'),
          location: values.deceasedLocation || '',
          reason: values.deceasedReason || '',
          notes: values.deceasedNotes || '',
        };
      }
      await axios.put(
        `${process.env.REACT_APP_API_URL}/family/members/${editingMember._id}`,
        memberData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Cập nhật thành viên thành công');
      navigate('/family');
    } catch (error) {
      console.error(error);
      message.error('Cập nhật thất bại, vui lòng thử lại!');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      <h2>Cập nhật Thành viên</h2>
      <Form form={form} name="editFamilyMember" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Họ tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="birthDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value="Male">Nam</Option>
            <Option value="Female">Nữ</Option>
            <Option value="Other">Khác</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Nơi sinh" name="placeOfBirth">
          <Input />
        </Form.Item>
        <Form.Item label="Thông tin bổ sung" name="additionalInfo">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Vai trò" name="role" initialValue="Member">
          <Select>
            <Option value="Member">Thành viên</Option>
            <Option value="Founder">Ông tổ</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Chọn cha/mẹ" name="parentId">
          <Select placeholder="Chọn cha/mẹ (nếu có)">
            <Option key="null" value={null}>
              Không chọn (Nếu là gốc - Founder)
            </Option>
            {/* Thêm logic để hiển thị danh sách cha/mẹ từ parentOptions nếu cần */}
          </Select>
        </Form.Item>
        <Form.Item label="Ngày kết hôn" name="marriedDate">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Địa điểm kết hôn" name="marriedLocation">
          <Input />
        </Form.Item>
        <Form.Item label="Tên vợ/chồng" name="spouseName">
          <Input />
        </Form.Item>
        <Form.Item label="Ghi chú hôn nhân" name="marriedNotes">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Ngày mất" name="deceasedDate">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Địa điểm mất" name="deceasedLocation">
          <Input />
        </Form.Item>
        <Form.Item label="Lý do mất" name="deceasedReason">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Ghi chú về mất" name="deceasedNotes">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Cập nhật thành viên
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditFamilyView;
