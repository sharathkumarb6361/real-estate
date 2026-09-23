import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  requestPasswordReset: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

export const propertyAPI = {
  getProperties: (params) => api.get('/properties', { params }),
  getPropertyById: (id) => api.get(`/properties/${id}`),
  createProperty: (data) => api.post('/properties', data),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/properties/images/upload', formData);
  },
  removeImage: (id, imageUrl) => api.delete(`/properties/${id}/images`, { data: { imageUrl } })
};

export const unitAPI = {
  getUnits: (params) => api.get('/units', { params }),
  createUnit: (data) => api.post('/units', data),
  updateUnit: (id, data) => api.put(`/units/${id}`, data),
  deleteUnit: (id) => api.delete(`/units/${id}`)
};

export const enquiryAPI = {
  getEnquiries: (params) => api.get('/enquiries', { params }),
  getEnquiryById: (id) => api.get(`/enquiries/${id}`),
  createEnquiry: (data) => api.post('/enquiries', data),
  updateEnquiry: (id, data) => api.put(`/enquiries/${id}`, data),
  deleteEnquiry: (id) => api.delete(`/enquiries/${id}`)
};

export const visitAPI = {
  getVisits: () => api.get('/visits'),
  createVisit: (data) => api.post('/visits', data),
  updateVisit: (id, data) => api.put(`/visits/${id}`, data)
};

export const bookingAPI = {
  getBookings: () => api.get('/bookings'),
  createBooking: (data) => api.post('/bookings', data),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data)
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (data) => api.post('/wishlist', data),
  removeFromWishlist: (propertyId) => api.delete(`/wishlist/${propertyId}`)
};

export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAnalytics: () => api.get('/dashboard/analytics')
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: () => api.put('/notifications/read'),
  markNotificationAsRead: (id) => api.put(`/notifications/${id}/read`),
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
};

export const amenityAPI = {
  getAmenities: () => api.get('/amenities'),
  createAmenity: (data) => api.post('/amenities', data),
  updateAmenity: (id, data) => api.put(`/amenities/${id}`, data),
  deleteAmenity: (id) => api.delete(`/amenities/${id}`)
};

export default api;
