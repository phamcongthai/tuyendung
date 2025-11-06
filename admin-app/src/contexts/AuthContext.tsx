import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'admin_auth_session';
const DEFAULT_ADMIN_EMAIL = 'admin@gmail.com';
const DEFAULT_ADMIN_PASSWORD = '12345678';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { email: string };
        if (parsed?.email === DEFAULT_ADMIN_EMAIL) {
          setIsAuthenticated(true);
          setUserEmail(parsed.email);
        }
      }
    } catch {}
  }, []);

  const login = async (email: string, password: string) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (normalizedEmail === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setUserEmail(DEFAULT_ADMIN_EMAIL);
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ email: DEFAULT_ADMIN_EMAIL, loggedInAt: Date.now() })
      );
      return;
    }
    throw new Error('Email hoặc mật khẩu không đúng');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({ isAuthenticated, userEmail, login, logout }),
    [isAuthenticated, userEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


