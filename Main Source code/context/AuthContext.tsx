import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
// FIX: Import register function from apiService.
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  // FIX: Add register to the context type.
  register: (username: string, password: string) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    try {
      const loggedInUser = await apiLogin(username, password);
      setUser(loggedInUser);
      sessionStorage.setItem('user', JSON.stringify(loggedInUser));
      return loggedInUser;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    sessionStorage.removeItem('user');
  };

  // FIX: Implement the register function.
  const register = async (username: string, password: string): Promise<User> => {
    try {
      const registeredUser = await apiRegister(username, password);
      // Automatically log in the user after successful registration
      setUser(registeredUser);
      sessionStorage.setItem('user', JSON.stringify(registeredUser));
      return registeredUser;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  return (
    // FIX: Provide the register function through the context.
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, isSuperAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
