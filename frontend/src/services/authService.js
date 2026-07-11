import api, { tokenStorage } from './api';

export const login = (credentials) => api.post('/auth/login/', credentials);
export const register = (data) => api.post('/auth/register/', data);
export const getProfile = () => api.get('/auth/profile/');
export const updateProfile = (data) => api.patch('/auth/profile/', data);
export const changePassword = (data) => api.post('/auth/password/change/', data);
export const requestPasswordReset = (email) => api.post('/auth/password/reset/', { email });

export const logout = async () => {
  try {
    await api.post('/auth/logout/');
  } finally {
    tokenStorage.clearTokens();
  }
};
