// API client configuration and endpoints
import axios from 'axios';
import { API_CONFIG } from '@/utils/constants';

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const tasksApi = {
  getAll: () => apiClient.get('/tasks'),
  getById: (id: string) => apiClient.get(`/tasks/${id}`),
  create: (data: any) => apiClient.post('/tasks', data),
  update: (id: string, data: any) => apiClient.patch(`/tasks/${id}`, data),
  delete: (id: string) => apiClient.delete(`/tasks/${id}`),
};

export const skillsApi = {
  getAll: () => apiClient.get('/skills'),
  create: (data: any) => apiClient.post('/skills', data),
  update: (id: string, data: any) => apiClient.patch(`/skills/${id}`, data),
  addRecord: (data: any) => apiClient.post('/learning-records', data),
};

export const reportsApi = {
  getAll: () => apiClient.get('/reports'),
  getById: (id: string) => apiClient.get(`/reports/${id}`),
  create: (data: any) => apiClient.post('/reports', data),
  update: (id: string, data: any) => apiClient.patch(`/reports/${id}`, data),
  delete: (id: string) => apiClient.delete(`/reports/${id}`),
};

export const metricsApi = {
  getAll: () => apiClient.get('/metrics'),
  getHistory: (id: string, range: string) => apiClient.get(`/metrics/${id}/history?range=${range}`),
};

export default apiClient;
