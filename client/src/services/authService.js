import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const register = (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

const login = (credentials) => {
  return axios.post(`${API_URL}/auth/login`, credentials);
};

const getAccounts = (token) => {
  return axios.get(`${API_URL}/auth/accounts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const updateAccount = (id, updateData, token) => {
  return axios.put(`${API_URL}/auth/accounts/${id}`, updateData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export default {
  register,
  login,
  getAccounts,
  updateAccount,
};
