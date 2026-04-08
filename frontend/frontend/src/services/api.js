import axios from 'axios';
import { mockAuthAPI, mockProductsAPI } from './mockApi';

const USE_MOCK = true;

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let authAPI;
let productsAPI;

if (USE_MOCK) {
  authAPI = mockAuthAPI;
  productsAPI = mockProductsAPI;
} else {
  authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/users/me'),
  };
  
  productsAPI = {
    getAll: (params) => {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.order) queryParams.append('order', params.order);
      const query = queryParams.toString();
      return api.get(`/products${query ? `?${query}` : ''}`);
    },
    getById: (id) => api.get(`/products/${id}`),
    getMyProducts: () => api.get('/products/my'),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
  };
}

export { authAPI, productsAPI };

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
};

export default api;