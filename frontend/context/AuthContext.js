import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../lib/api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const { data } = await apiClient.get('/auth/me');
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    Cookies.set('token', data.token, { expires: 7 });
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, role = 'STUDENT') => {
    const { data } = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      role,
    });
    Cookies.set('token', data.token, { expires: 7 });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('token');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
