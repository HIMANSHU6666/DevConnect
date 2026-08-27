import axios from 'axios';

const api = axios.create({
  baseURL: 'https://devconnect-backend-2wib.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to append Bearer token if stored in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
