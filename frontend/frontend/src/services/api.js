import axios from 'axios';
import { mockAuthAPI, mockProductsAPI } from './mockApi';

const STATIC_BASE_URL = 'https://localhost:7202';
const USE_MOCK = false;

const api = axios.create({
  baseURL: 'https://localhost:7202/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let authAPI = {};
let productsAPI = {};
let reviewsAPI = {};
let cartAPI = {};

if (USE_MOCK) {
  authAPI = {
    register: mockAuthAPI.register,
    login: mockAuthAPI.login,
    getMe: mockAuthAPI.getMe,
    logout: mockAuthAPI.logout,
    updateProfile: mockAuthAPI.updateProfile,
    changePassword: mockAuthAPI.changePassword,
    getAddresses: mockAuthAPI.getAddresses,
    createAddress: mockAuthAPI.createAddress,
    updateAddress: mockAuthAPI.updateAddress,
    deleteAddress: mockAuthAPI.deleteAddress,
  };
  
  productsAPI = {
    getAll: mockProductsAPI.getAll,
    getById: mockProductsAPI.getById,
    getMyProducts: mockProductsAPI.getMyProducts,
    create: mockProductsAPI.create,
    update: mockProductsAPI.update,
    delete: mockProductsAPI.delete,
    getReviews: mockProductsAPI.getReviews,
    createReview: mockProductsAPI.createReview,
    createOrder: mockProductsAPI.createOrder,
    getMyOrders: mockProductsAPI.getMyOrders,
    getOrderById: mockProductsAPI.getOrderById,
    updateOrderStatus: mockProductsAPI.updateOrderStatus,
    requestReturn: mockProductsAPI.requestReturn,
    getUserById: mockProductsAPI.getUserById,
  };
  
  reviewsAPI = {
    getByProduct: (productId) => mockProductsAPI.getReviews(productId),
    create: (productId, data) => mockProductsAPI.createReview(productId, data),
  };
  
  cartAPI = {
    getCart: () => mockProductsAPI.getCart(),
    addToCart: (productId, quantity) => mockProductsAPI.addToCart(productId, quantity),
    updateCartItem: (itemId, quantity) => mockProductsAPI.updateCartItem(itemId, quantity),
    removeFromCart: (itemId) => mockProductsAPI.removeFromCart(itemId),
    clearCart: () => mockProductsAPI.clearCart(),
  };
} else {
  authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/users/me'),
    updateProfile: (data) => api.put('/users/me', data),
    changePassword: (data) => api.post('/users/me/change-password', data),
    getAddresses: () => api.get('/delivery-addresses'),
    createAddress: (data) => api.post('/delivery-addresses', data),
    updateAddress: (id, data) => api.put(`/delivery-addresses/${id}`, data),
    deleteAddress: (id) => api.delete(`/delivery-addresses/${id}`),
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
    createOrder: (addressId, items) => api.post('/orders', { deliveryAddressId: addressId, items }),
    getMyOrders: () => api.get('/orders/my'),
    getOrderById: (id) => api.get(`/orders/${id}`),
    updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
    requestReturn: (orderId, itemId, reason) => api.post('/returns', { orderId: orderId, itemId: itemId, reason }),
    getUserById: (id) => api.get(`/users/${id}`),
  };
  
  reviewsAPI = {
    getByProduct: (productId) => api.get(`/products/${productId}/reviews`),
    create: (productId, data) => api.post(`/products/${productId}/reviews`, data),
  };
  
  cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (productId, quantity) => api.post('/cart/items', { productId: productId, quantity }),
    updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
    removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
    clearCart: () => api.delete('/cart'),
  };
}

export { authAPI, productsAPI, reviewsAPI, cartAPI };

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
};

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return '/placeholder.jpg';
  }
  
  if (imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('/')) {
    return `${STATIC_BASE_URL}${imageUrl}`;
  }

  return `${STATIC_BASE_URL}/${imageUrl}`;
};

export default api;