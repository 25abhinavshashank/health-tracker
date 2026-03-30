import { createContext, useEffect, useMemo, useState } from 'react';

import api from '../services/api';
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser
} from '../services/authService';
import { getProfile } from '../services/profileService';

export const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = 'health_tracker_access_token';
const THEME_KEY = 'health_tracker_theme';

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem(THEME_KEY) || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    api.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Prefer refreshing via the refresh-token cookie when we already have a session.
        if (!accessToken) {
          const refreshResponse = await refreshSession();
          localStorage.setItem(ACCESS_TOKEN_KEY, refreshResponse.accessToken);
          setAccessToken(refreshResponse.accessToken);
          setUser(refreshResponse.user);
        } else {
          const profileResponse = await getProfile();
          setUser(profileResponse.user);
        }
      } catch (_error) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  const persistSession = (payload) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken);
    setAccessToken(payload.accessToken);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const payload = await loginUser(credentials);
    persistSession(payload);
    return payload;
  };

  const register = async (formData) => {
    const payload = await registerUser(formData);
    persistSession(payload);
    return payload;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      setAccessToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const profileResponse = await getProfile();
    setUser(profileResponse.user);
    return profileResponse.user;
  };

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isBootstrapping,
      login,
      logout,
      refreshUser,
      register,
      setAccessToken,
      setUser,
      theme,
      toggleTheme: () =>
        setTheme((currentTheme) =>
          currentTheme === 'dark' ? 'light' : 'dark'
        ),
      user
    }),
    [accessToken, isBootstrapping, theme, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
