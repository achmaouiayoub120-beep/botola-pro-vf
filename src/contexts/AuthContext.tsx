import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

// Interface de l'utilisateur
export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'user' | 'admin' | 'agent';
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('botola_token');
      const storedUser = localStorage.getItem('botola_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Vérification silencieuse avec le backend en arrière-plan
          const response = await api.get('/auth/profile');
          setUser(response.data);
          localStorage.setItem('botola_user', JSON.stringify(response.data));
        } catch (error) {
          console.error("Session expirée ou invalide");
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('botola_token', newToken);
    localStorage.setItem('botola_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('botola_token');
    localStorage.removeItem('botola_user');
  };

  const checkAuth = async () => {
    if (!token) return;
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
