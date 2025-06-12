import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config/environment';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add Authorization header if token exists
    const token = localStorage.getItem('authToken');
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
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Handle 401 errors by clearing token
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Only redirect to login if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Don't show toast for certain endpoints (like auth check)
    const silentEndpoints = ['/auth/me'];
    const shouldShowToast = !silentEndpoints.some(endpoint => 
      error.config?.url?.includes(endpoint)
    );

    if (shouldShowToast && error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  register: (userData) => api.post('/auth/register', userData),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Users API
export const usersAPI = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  activateUser: (id) => api.put(`/users/${id}/activate`),
  getUserStats: () => api.get('/users/stats/overview'),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  activateProduct: (id) => api.put(`/products/${id}/activate`),
  getCategories: () => api.get('/products/categories/list'),
  getBrands: () => api.get('/products/brands/list'),
  getLowStockProducts: (threshold = 10) => api.get('/products/low-stock', { params: { threshold } }),
  getPopularProducts: (limit = 10) => api.get('/products/popular', { params: { limit } }),
  getProductStats: () => api.get('/products/stats/overview'),
};

// Analytics API
export const analyticsAPI = {
  getDashboardData: () => api.get('/analytics/dashboard'),
  getSalesTrends: (period = '6months') => api.get('/analytics/sales-trends', { params: { period } }),
  getUserGrowth: (period = '12months') => api.get('/analytics/user-growth', { params: { period } }),
  getCategoryDistribution: () => api.get('/analytics/category-distribution'),
  getTopProducts: (params = {}) => api.get('/analytics/top-products', { params }),
  getRecentActivities: (limit = 20) => api.get('/analytics/recent-activities', { params: { limit } }),
  getPerformanceMetrics: () => api.get('/analytics/performance-metrics'),
};

// Generic API helper functions
export const apiHelpers = {
  // Handle API errors consistently
  handleError: (error, defaultMessage = 'An error occurred') => {
    const message = error.response?.data?.message || defaultMessage;
    toast.error(message);
    return message;
  },

  // Success message helper
  showSuccess: (message) => {
    toast.success(message);
  },

  // Format API response data
  formatResponse: (response) => {
    return response.data;
  },

  // Build query string from params
  buildQueryString: (params) => {
    const filteredParams = Object.entries(params)
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    return new URLSearchParams(filteredParams).toString();
  },
};

export default api; 