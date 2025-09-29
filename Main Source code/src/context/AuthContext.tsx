import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
// FIX: import register as apiRegister from '../services/apiService
import { login as apiLogin, logout as apiLogout, checkSession, register as apiRegister } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean; // Add a loading state for session checking
  // FIX: Add register to the context type.
  register: (username: string, password: string) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to check session

  useEffect(() => {
    // Check for an active session when the app loads
    const verifySession = async () => {
      try {
        const sessionUser = await checkSession();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    try {
      const loggedInUser = await apiLogin(username, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    // Redirect to home on logout, ensuring a clean state
    window.location.hash = '/'; 
    window.location.reload(); // Reload to clear any other state
  };

  // FIX: Implement the register function.
  const register = async (username: string, password: string): Promise<User> => {
    try {
      const registeredUser = await apiRegister(username, password);
      // After registration, the backend should create a session.
      // We set the user in the context to log them in automatically.
      setUser(registeredUser);
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
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, isSuperAdmin, login, logout, isLoading, register }}>
      {/* Don't render children until session check is complete to avoid UI flashes */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
