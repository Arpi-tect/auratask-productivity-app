import axios from 'axios';

// Get baseline API URL dynamically
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject Bearer JWT Token automatically on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Unified Auth API Endpoints
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },
  uploadAvatar: async (formData) => {
    const response = await api.put('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Unified Task API Endpoints
export const taskAPI = {
  getTasks: async (filters = {}) => {
    const { status, priority, category, search, sortBy } = filters;
    let query = '?';
    if (status) query += `status=${status}&`;
    if (priority) query += `priority=${priority}&`;
    if (category) query += `category=${category}&`;
    if (search) query += `search=${search}&`;
    if (sortBy) query += `sortBy=${sortBy}&`;
    
    const response = await api.get(`/tasks${query}`);
    return response.data;
  },
  createTask: async (taskData) => {
    // If files are attached, we might need a multi-part form request.
    // We check if taskData is an instance of FormData
    const config = taskData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post('/tasks', taskData, config);
    return response.data;
  },
  updateTask: async (id, taskData) => {
    const config = taskData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.put(`/tasks/${id}`, taskData, config);
    return response.data;
  },
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
  addComment: async (id, commentText) => {
    const response = await api.post(`/tasks/${id}/comments`, { text: commentText });
    return response.data;
  },
  logPomodoro: async (id) => {
    const response = await api.post(`/tasks/${id}/pomodoro`);
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/tasks/analytics');
    return response.data;
  },
  getAISuggestions: async () => {
    const response = await api.get('/tasks/ai-suggest');
    return response.data;
  },
};

export default api;
