import React, { createContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../src/api';


export const AppContext = createContext();


export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData.user);
    setIsAuthenticated(true);
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auto-login failed:', error);
        logout();
      }
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <AppContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};