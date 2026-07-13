import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
