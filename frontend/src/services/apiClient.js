import axios from 'axios';

import { tokenStore } from './tokenStore.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const refreshClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.request.use((config) => {
  const { accessToken } = tokenStore.getState();
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error?.response?.status === 401 &&
      !original?._retry &&
      !String(original?.url || '').includes('/auth/refresh') &&
      !String(original?.url || '').includes('/auth/login') &&
      !String(original?.url || '').includes('/auth/register')
    ) {
      original._retry = true;
      try {
        const { data } = await refreshClient.post('/auth/refresh');
        tokenStore.setState({ accessToken: data.accessToken, user: data.user });
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return client(original);
      } catch (refreshError) {
        tokenStore.setState({ accessToken: null, user: null });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;

