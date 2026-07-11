import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authService from '../services/authService';
import { tokenStorage } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if we already hold a token, fetch the current profile
  // so a page refresh doesn't silently log the user out.
  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getProfile()
      .then(({ data }) => setUser(data))
      .catch(() => tokenStorage.clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    tokenStorage.setTokens(data.access_token, data.refresh_token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authService.register(payload);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await authService.getProfile();
    setUser(data);
    return data;
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthContext;
