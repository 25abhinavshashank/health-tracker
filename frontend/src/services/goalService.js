import api from './api';

export const getGoals = async () => {
  const { data } = await api.get('/goals');
  return data;
};

export const createGoal = async (payload) => {
  const { data } = await api.post('/goals', payload);
  return data;
};

export const updateGoal = async (id, payload) => {
  const { data } = await api.put(`/goals/${id}`, payload);
  return data;
};

export const deleteGoal = async (id) => {
  const { data } = await api.delete(`/goals/${id}`);
  return data;
};

const goalService = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal
};

export default goalService;
