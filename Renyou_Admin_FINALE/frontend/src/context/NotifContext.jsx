import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api.js';
import { useAuth } from './AuthContext.jsx';

const NotifContext = createContext(null);

export function NotifProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifs = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {}
  }, [user]);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  const markRead = async (id) => {
    await api.markRead(id);
    setNotifications(prev => prev.map(n => n._id===id ? { ...n, read:true } : n));
    setUnreadCount(prev => Math.max(0, prev-1));
  };

  const markAllRead = async () => {
    await api.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read:true })));
    setUnreadCount(0);
  };

  const deleteNotif = async (id) => {
    const n = notifications.find(n => n._id===id);
    await api.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n._id!==id));
    if (n && !n.read) setUnreadCount(prev => Math.max(0, prev-1));
  };

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, deleteNotif, refresh:fetchNotifs }}>
      {children}
    </NotifContext.Provider>
  );
}

export const useNotifs = () => useContext(NotifContext);
