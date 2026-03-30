import api from './api';

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

export const refreshSession = async () => {
  const { data } = await api.post('/auth/refresh');
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

const authService = {
  register: registerUser,
  login: loginUser,
  logout: logoutUser,
  refresh: refreshSession
};

export default authService;
