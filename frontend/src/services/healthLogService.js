import api from './api';

const healthLogService = {
  async createLog(payload) {
    const { data } = await api.post('/logs', payload);
    return data;
  },
  async getLogs(params) {
    const { data } = await api.get('/logs', { params });
    return data;
  },
  async updateLog(id, payload) {
    const { data } = await api.put(`/logs/${id}`, payload);
    return data;
  },
  async deleteLog(id) {
    const { data } = await api.delete(`/logs/${id}`);
    return data;
  },
  async getAnalytics(range = 'weekly') {
    const { data } = await api.get('/logs/analytics', {
      params: { range }
    });
    return data;
  }
};

export default healthLogService;

