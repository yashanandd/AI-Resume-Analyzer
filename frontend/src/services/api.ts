import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const DEFAULT_API_URL = isLocalhost
  ? "http://localhost:8000/api/v1"
  : "https://ai-resume-analyzer-backend-i4ac.onrender.com/";

const API_URL = (import.meta.env.VITE_API_URL as string) || DEFAULT_API_URL;

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
