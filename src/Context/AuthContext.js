import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/Api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      // Get the error message from the backend
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      
      // Custom error messages based on status code
      let friendlyMessage = errorMessage;
      
      if (error.response?.status === 400) {
        if (errorMessage.toLowerCase().includes('invalid credentials')) {
          friendlyMessage = '❌ Invalid email or password. Please check your credentials and try again.';
        } else {
          friendlyMessage = '❌ ' + errorMessage;
        }
      } else if (error.response?.status === 404) {
        friendlyMessage = '❌ User not found. Please check your email or register for an account.';
      } else if (error.response?.status === 500) {
        friendlyMessage = '❌ Server error. Please try again later.';
      }
      
      return { success: false, error: friendlyMessage };
    }
  };

  const register = async (name, email, password, role = 'student') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      // Get the error message from the backend
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      
      // Custom error messages based on status code
      let friendlyMessage = errorMessage;
      
      if (error.response?.status === 400) {
        if (errorMessage.toLowerCase().includes('already exists') || errorMessage.toLowerCase().includes('already exist')) {
          friendlyMessage = '❌ This email is already registered. Please use a different email or login instead.';
        } else if (errorMessage.toLowerCase().includes('password')) {
          friendlyMessage = '❌ Password requirements: minimum 6 characters.';
        } else if (errorMessage.toLowerCase().includes('email')) {
          friendlyMessage = '❌ Please enter a valid email address.';
        } else {
          friendlyMessage = '❌ ' + errorMessage;
        }
      } else if (error.response?.status === 409) {
        friendlyMessage = '❌ This email is already registered. Please login instead.';
      } else if (error.response?.status === 500) {
        friendlyMessage = '❌ Server error. Please try again later.';
      }
      
      return { success: false, error: friendlyMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

 const value = {
  user,
  loading,
  login,
  register,
  logout,
  isAuthenticated: !!user,
};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};