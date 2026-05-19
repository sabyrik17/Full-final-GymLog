'use client';

import { createContext, useState, useCallback, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';

export const AuthContext = createContext();

const AUTH_LOAD_TIMEOUT_MS = 4000;

const normalizeUser = (userData = {}) => ({
  id: userData.id || userData._id,
  name: userData.name || '',
  email: userData.email || '',
  avatar: userData.avatar,
  weight: userData.weight,
  height: userData.height,
  bio: userData.bio,
  isPublic: Boolean(userData.isPublic),
});

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const readApiError = async (response, fallback) => {
  const error = await response.json().catch(() => null);
  return error?.message || fallback;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const clearStoredAuth = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (isMounted) {
        setToken(null);
        setUser(null);
      }
    };

    const loadAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (!savedToken) {
          return;
        }

        if (isMounted) {
          setToken(savedToken);
        }

        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser?.id || parsedUser?._id) {
              if (isMounted) {
                setUser(normalizeUser(parsedUser));
              }
              return;
            }
          } catch (error) {
            console.warn('Stored user data is invalid, refreshing profile');
          }
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AUTH_LOAD_TIMEOUT_MS);

        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
            signal: controller.signal,
          });

          if (!response.ok) {
            clearStoredAuth();
            return;
          }

          const profile = normalizeUser(await response.json());
          localStorage.setItem('user', JSON.stringify(profile));
          if (isMounted) {
            setUser(profile);
          }
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('Auth loading timed out');
        } else {
          console.error('Auth loading error:', error);
        }
        clearStoredAuth();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizeEmail(email), password }),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response, 'Не получилось войти'));
      }

      const data = await response.json();
      const normalizedUser = normalizeUser(data.user);
      setToken(data.token);
      setUser(normalizedUser);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: normalizeEmail(email), password }),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response, 'Не получилось зарегистрироваться'));
      }
 
      const data = await response.json();
      const normalizedUser = normalizeUser(data.user);
      setToken(data.token);
      setUser(normalizedUser);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const updateUser = useCallback((userData) => {
    const normalizedUser = normalizeUser(userData);
    setUser(normalizedUser);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    return normalizedUser;
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
