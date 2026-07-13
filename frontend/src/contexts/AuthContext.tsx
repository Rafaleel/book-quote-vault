import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../services/api';
import { AuthResponse } from '../types';

export interface UserContextData {
  email: string;
}

export interface AuthContextType {
  user: UserContextData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  loginWithToken: (token: string) => void;
  register: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserContextData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    if (token && email) {
      setUser({ email });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    const { token, email: userEmail } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userEmail);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ email: userEmail });
    return response.data;
  };

  const loginWithToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      const userEmail = payload.sub;
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', userEmail);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ email: userEmail });
    } catch (e) {
      console.error("Invalid token received from OAuth2", e);
    }
  };

  const register = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { email, password });
    const { token, email: userEmail } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userEmail);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ email: userEmail });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithToken, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => useContext(AuthContext);
