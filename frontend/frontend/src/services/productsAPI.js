import api from './api';

export const productsAPI = {
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

export const reviewsAPI = {
  getByProduct: (productId) => api.get(`/products/${productId}/reviews`),
  create: (productId, data) => api.post(`/products/${productId}/reviews`, data),
};