import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
  const token = localStorage.getItem('renyou_token');

  if (token) {

    api.me()
      .then(user => {
        setUser(user);
      })
      .catch(err => {
        localStorage.removeItem('renyou_token');
      })
      .finally(() => {
  setTimeout(() => {
    setLoading(false);
  }, 2000); // 2 secondes
});
} else {
  setTimeout(() => {
    setLoading(false);
  }, 2000);
}
}, []);

  const login = async (email, password) => {

  const { token, user } = await api.login(email, password);

  localStorage.setItem('renyou_token', token);

  setUser(user);


  return user;
};

  const logout = () => { localStorage.removeItem('renyou_token'); setUser(null); };

  // Expose setUser so Sidebar profile modal can update state
  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
