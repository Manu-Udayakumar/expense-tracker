// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, rememberMe: boolean) => void;
  logout: () => void;
  checkTokenValidity: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        const isValid = await checkTokenValidity(token);
        setIsAuthenticated(isValid);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const login = (token: string, rememberMe: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const checkTokenValidity = async (token?: string): Promise<boolean> => {
    const currentToken = token || localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!currentToken) {
      logout();
      return false;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/validate-token', {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (!response.ok) {
        logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, checkTokenValidity }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };