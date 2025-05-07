// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { authenticate } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const defaultAdminUser = {
    benutzerID: 1,
    benutzername: 'admin',
    name: 'Administrator',
    rolle: 'ADMIN',
    arztID: 1
  };

  const [user, setUser] = useState(defaultAdminUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Beim ersten Laden prüfen, ob ein Token im localStorage ist
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);
  
  const login = async (username, password) => {
    try {
      const response = await authenticate(username, password);
      const { token, user } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
