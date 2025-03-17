import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, Checkbox, message } from 'antd';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const { Option } = Select;

const AddFamilyMember = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [parentOptions, setParentOptions] = useState([]);
  const [showMarriageFields, setShowMarriageFields] = useState(false);
  const [showDeceasedFields, setShowDeceasedFields] = useState(false);
  
  // Kiểm tra nếu có dữ liệu được truyền qua location.state
  const editingMember = location.state?.member || null;

  // Khi trong chế độ cập nhật, tự điền giá trị vào form
  useEffect(() => {
    if (editingMember) {
      form.setFieldsValue({
        name: editingMember.name,
        birthDate: editingMember.birthDate ? DatePicker.moment(editingMember.birthDate) : null,
        gender: editingMember.gender,
        placeOfBirth: editingMember.placeOfBirth,
        additionalInfo: editingMember.additionalInfo,
        role: editingMember.role,
        parentId: editingMember.parentId,
        // Nếu có marriedInfo hoặc deceasedInfo thì bạn có thể đặt trạng thái hiển thị checkbox
      });
      if (editingMember.marriedInfo) setShowMarriageFields(true);
      if (editingMember.deceasedInfo) setShowDeceasedFields(true);
    }
  }, [editingMember, form]);

  // Lấy danh sách thành viên cho dropdown "Chọn cha/mẹ"
  useEffect(() => {
    const fetchParentOptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/family/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParentOptions(response.data.members);
      } catch (error) {
        console.error('Error fetching parent options:', error);
      }
    };
    fetchParentOptions();
  }, []);

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const memberData = {
        name: values.name,
        birthDate: values.birthDate.format('YYYY-MM-DD'),
        gender: values.gender,
        placeOfBirth: values.placeOfBirth,
        additionalInfo: values.additionalInfo,
        role: values.role || 'Member',
        parentId: values.parentId || null,
      };

      if (showMarriageFields) {
        memberData.marriedInfo = {
          date: values.marriedDate ? values.marriedDate.format('YYYY-MM-DD') : null,
          location: values.marriedLocation || '',
          notes: values.marriedNotes || '',
        };
      }
      if (showDeceasedFields) {
        memberData.deceasedInfo = {
          date: values.deceasedDate ? values.deceasedDate.format('YYYY-MM-DD') : null,
          location: values.deceasedLocation || '',
          reason: values.deceasedReason || '',
          notes: values.deceasedNotes || '',
        };
      }

      if (editingMember) {
        // Nếu đang ở chế độ cập nhật, gửi PUT request
        await axios.put(
          `${process.env.REACT_APP_API_URL}/family/members/${editingMember._id}`,
          memberData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        message.success('Cập nhật thành viên thành công');
      } else {
        // Nếu là thêm mới, gửi POST request
        await axios.post(
          `${process.env.REACT_APP_API_URL}/family/create`,
          memberData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        message.success('Thêm thành viên thành công');
      }
      navigate('/family');  // Sau khi thành công, điều hướng về trang danh sách gia phả
    } catch (error) {
      console.error(error);
      message.error('Thao tác thất bại, vui lòng thử lại!');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      <h2>{editingMember ? "Cập nhật Thành viên" : "Thêm Thành viên Mới"}</h2>
      <Form form={form} name="addFamilyMember" onFinish={onFinish} layout="vertical">
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
            {parentOptions.map((parent) => (
              <Option key={parent._id} value={parent._id}>
                {parent.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Checkbox
            checked={showMarriageFields}
            onChange={(e) => setShowMarriageFields(e.target.checked)}
          >
            Cập nhật thông tin hôn nhân
          </Checkbox>
        </Form.Item>
        {showMarriageFields && (
          <>
            <Form.Item
              label="Ngày kết hôn"
              name="marriedDate"
              rules={[{ required: true, message: 'Vui lòng chọn ngày kết hôn!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Địa điểm kết hôn"
              name="marriedLocation"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm kết hôn!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Ghi chú hôn nhân" name="marriedNotes">
              <Input.TextArea rows={2} />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Checkbox
            checked={showDeceasedFields}
            onChange={(e) => setShowDeceasedFields(e.target.checked)}
          >
            Cập nhật thông tin mất (nếu có)
          </Checkbox>
        </Form.Item>
        {showDeceasedFields && (
          <>
            <Form.Item
              label="Ngày mất"
              name="deceasedDate"
              rules={[{ required: true, message: 'Vui lòng chọn ngày mất!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Địa điểm mất"
              name="deceasedLocation"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm mất!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Lý do mất"
              name="deceasedReason"
              rules={[{ required: true, message: 'Vui lòng nhập lý do mất!' }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item label="Ghi chú về mất" name="deceasedNotes">
              <Input.TextArea rows={2} />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editingMember ? "Cập nhật thành viên" : "Thêm thành viên"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddFamilyMember;
