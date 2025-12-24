import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { store } from '../store/store';
import { refreshAccessToken, clearCredentials } from '../store/slices/authSlice';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const state = store.getState();
      const refreshToken = state.auth.refreshToken;

      if (refreshToken) {
        try {
          // Attempt to refresh the token
          await store.dispatch(refreshAccessToken(refreshToken));

          // Retry the original request with new token
          const newState = store.getState();
          const newToken = newState.auth.accessToken;

          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear credentials and redirect to login
          store.dispatch(clearCredentials());
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, clear credentials and redirect to login
        store.dispatch(clearCredentials());
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => api.post('/auth/register', userData),

  login: (credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => api.post('/auth/login', credentials),

  logout: () => api.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh-token', { refreshToken }),

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (profileData: any) =>
    api.put('/auth/profile', profileData),

  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => api.put('/auth/change-password', passwordData),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (resetData: {
    token: string;
    password: string;
  }) => api.post('/auth/reset-password', resetData),

  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email/${token}`),

  resendVerification: (email: string) =>
    api.post('/auth/resend-verification', { email }),
};

export const productAPI = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    rating?: number;
    gender?: string;
  }) => api.get('/products', { params }),

  getProduct: (id: string) => api.get(`/products/${id}`),

  getProductBySlug: (slug: string) => api.get(`/products/slug/${slug}`),

  getFeaturedProducts: () => api.get('/products/featured'),

  getRelatedProducts: (id: string) => api.get(`/products/${id}/related`),

  searchProducts: (query: string) => api.get(`/products/search?q=${query}`),
};

export const categoryAPI = {
  getCategories: () => api.get('/categories'),

  getCategory: (id: string) => api.get(`/categories/${id}`),

  getCategoryTree: () => api.get('/categories/tree'),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),

  addToCart: (productId: string, quantity: number, variant?: any) =>
    api.post('/cart/add', { productId, quantity, variant }),

  updateCartItem: (itemId: string, quantity: number) =>
    api.put(`/cart/items/${itemId}`, { quantity }),

  removeFromCart: (itemId: string) =>
    api.delete(`/cart/items/${itemId}`),

  clearCart: () => api.delete('/cart'),

  applyCoupon: (code: string) =>
    api.post('/cart/coupon', { code }),

  removeCoupon: () => api.delete('/cart/coupon'),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),

  addToWishlist: (productId: string) =>
    api.post('/wishlist/add', { productId }),

  removeFromWishlist: (productId: string) =>
    api.delete(`/wishlist/${productId}`),

  clearWishlist: () => api.delete('/wishlist'),
};

export const orderAPI = {
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => api.get('/orders', { params }),

  getOrder: (id: string) => api.get(`/orders/${id}`),

  createOrder: (orderData: any) => api.post('/orders', orderData),

  updateOrderStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),

  cancelOrder: (id: string, reason?: string) =>
    api.put(`/orders/${id}/cancel`, { reason }),

  trackOrder: (orderNumber: string) =>
    api.get(`/orders/track/${orderNumber}`),
};

export const reviewAPI = {
  getProductReviews: (productId: string, params?: {
    page?: number;
    limit?: number;
    rating?: number;
  }) => api.get(`/reviews/product/${productId}`, { params }),

  createReview: (reviewData: {
    product: string;
    rating: number;
    title: string;
    comment: string;
  }) => api.post('/reviews', reviewData),

  updateReview: (id: string, reviewData: any) =>
    api.put(`/reviews/${id}`, reviewData),

  deleteReview: (id: string) => api.delete(`/reviews/${id}`),

  getUserReviews: () => api.get('/reviews/user'),
};

export const paymentAPI = {
  createPaymentIntent: (amount: number, currency: string = 'usd') =>
    api.post('/payment/create-intent', { amount, currency }),

  confirmPayment: (paymentIntentId: string) =>
    api.post('/payment/confirm', { paymentIntentId }),

  getPaymentMethods: () => api.get('/payment/methods'),

  addPaymentMethod: (paymentMethodData: any) =>
    api.post('/payment/methods', paymentMethodData),

  deletePaymentMethod: (id: string) =>
    api.delete(`/payment/methods/${id}`),
};

export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  // Users
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, userData: any) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  // Products
  createProduct: (productData: any) => api.post('/admin/products', productData),
  updateProduct: (id: string, productData: any) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),

  // Categories
  createCategory: (categoryData: any) => api.post('/admin/categories', categoryData),
  updateCategory: (id: string, categoryData: any) => api.put(`/admin/categories/${id}`, categoryData),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),

  // Orders
  getAdminOrders: (params?: any) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id: string, status: string, note?: string) =>
    api.put(`/admin/orders/${id}/status`, { status, note }),

  // Analytics
  getSalesReport: (params?: any) => api.get('/admin/analytics/sales', { params }),
  getRevenueReport: (params?: any) => api.get('/admin/analytics/revenue', { params }),
  getTopProducts: (params?: any) => api.get('/admin/analytics/top-products', { params }),
};

export default api;