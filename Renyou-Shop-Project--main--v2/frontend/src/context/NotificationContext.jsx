// PATH: frontend/src/context/NotificationContext.jsx
// Client-facing notification system — separate from the admin one.
// Polls /api/notifications/mine (scoped to the logged-in customer).

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext.jsx'
import { api } from '../services/api.js'

const NotificationContext = createContext(null)

const POLL_INTERVAL = 45000 // 45s

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const isLoggedIn = !!user
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const firstLoad = useRef(true)

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) { setNotifications([]); return }
    if (firstLoad.current) setLoading(true)
    try {
      const data = await api.getMyNotifications()
      setNotifications(Array.isArray(data) ? data : data.notifications || [])
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      firstLoad.current = false
    }
  }, [isLoggedIn])

  useEffect(() => {
    firstLoad.current = true
    fetchNotifications()
    if (!isLoggedIn) return
    const interval = setInterval(fetchNotifications, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchNotifications, isLoggedIn])

  const markRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
    try { await api.markMyNotifRead(id) } catch {}
  }, [])

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    try { await api.markAllMyNotifRead() } catch {}
  }, [])

  const remove = useCallback(async (id) => {
    setNotifications(prev => prev.filter(n => n._id !== id))
    try { await api.deleteMyNotification(id) } catch {}
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      notifications, loading, error, unreadCount,
      refresh: fetchNotifications, markRead, markAllRead, remove,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider')
  return ctx
}
