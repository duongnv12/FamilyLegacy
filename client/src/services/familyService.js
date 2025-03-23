import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; 

// Lấy danh sách thành viên
export const getFamilyMembers = (token) => {
  return axios.get(`${API_URL}/family`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Thêm thành viên mới
export const createFamilyMember = (memberData, token) => {
  return axios.post(`${API_URL}/family`, memberData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Cập nhật thông tin thành viên
export const updateFamilyMember = (memberId, memberData, token) => {
  return axios.put(`${API_URL}/family/${memberId}`, memberData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};



// Lấy thống kê thành viên theo tiêu chí
export const getFamilyMemberStats = (groupBy, token) => {
  return axios.get(`${API_URL}/family/stats?groupBy=${groupBy}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
