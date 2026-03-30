import api from './api';

export const getLogs = async (params) => {
  const { data } = await api.get('/logs', { params });
  return data;
};

export const createLog = async (payload) => {
  const { data } = await api.post('/logs', payload);
  return data;
};

export const updateLog = async (id, payload) => {
  const { data } = await api.put(`/logs/${id}`, payload);
  return data;
};

export const deleteLog = async (id) => {
  const { data } = await api.delete(`/logs/${id}`);
  return data;
};

export const getAnalytics = async (range = 'weekly') => {
  const { data } = await api.get('/logs/analytics', { params: { range } });
  return data;
};
