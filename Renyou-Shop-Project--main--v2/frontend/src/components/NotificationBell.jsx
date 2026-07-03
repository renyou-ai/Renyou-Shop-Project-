// PATH: frontend/src/components/NotificationBell.jsx

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Package, Tag, AlertCircle, Heart, CheckCheck, Trash2, BellOff } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext.jsx'

const TYPE_META = {
  order:     { icon: Package,     bg: 'bg-blue-50',   color: 'text-blue-600'   },
  promotion: { icon: Tag,         bg: 'bg-amber-50',  color: 'text-amber-600'  },
  restock:   { icon: Heart,       bg: 'bg-rose-50',   color: 'text-rose-600'   },
  alert:     { icon: AlertCircle, bg: 'bg-red-50',    color: 'text-red-600'    },
  default:   { icon: Bell,        bg: 'bg-violet-50', color: 'text-violet-600' },
}

function timeAgo(date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000
  if (diff < 60)    return 'Just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NotificationBell() {
  const navigate = useNavigate()
  const { notifications, unreadCount, loading, error, markRead, markAllRead, remove } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Close if other dropdowns broadcast a close event (keeps parity with the user menu pattern)
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('closeUserMenu', close)
    window.addEventListener('closeAdminMenu', close)
    return () => {
      window.removeEventListener('closeUserMenu', close)
      window.removeEventListener('closeAdminMenu', close)
    }
  }, [])

  const handleToggle = (e) => {
  e.stopPropagation()
  setOpen(v => !v)
}

  const handleClick = (n) => {
    if (!n.read) markRead(n._id)
    if (n.link) navigate(n.link)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
  onClick={(e) => {
    handleToggle(e)
  }}
  className="relative cursor-pointer transition duration-500 hover:scale-110 hover:opacity-80 active:scale-95 p-1 rounded"
>
        <Bell
  size={26}
  strokeWidth={1.8}
  style={{ color: "var(--color-text)" }}
/>
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center px-0.5 border-2" style={{
  borderColor: "var(--color-surface)",
}}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-3 w-[360px] max-w-[90vw] backdrop-blur-xl rounded-2xl shadow-2xl border overflow-hidden z-[99999]"
style={{
  background: "color-mix(in srgb, var(--color-surface) 95%, transparent)",
  borderColor: "var(--color-border)",
}}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b"
style={{
  background: "var(--color-background)",
  borderColor: "var(--color-border)",
}}>
              <div className="flex items-center gap-2">
                <span
  className="text-sm font-bold"
  style={{ color: "var(--color-text)" }}
>Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </div>
              {notifications.length > 0 && unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
style={{ color: "var(--primary-color)" }}
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {loading && (
                <div className="p-6 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                </div>
              )}

              {!loading && error && (
                <div className="p-8 flex flex-col items-center text-center gap-2">
<BellOff
  size={28}
  style={{ color: "var(--color-border)" }}
/>

<p
  className="text-xs"
  style={{ color: "var(--color-text-secondary)" }}
>Couldn't load notifications</p>
                  <button onClick={() => window.location.reload()} className="text-[11px] text-violet-600 font-semibold hover:underline">
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && notifications.length === 0 && (
                <div className="p-8 flex flex-col items-center text-center gap-2">
                  <Bell
  size={28}
  style={{ color: "var(--color-border)" }}
/>
                  <p
  className="text-sm font-semibold"
  style={{ color: "var(--color-text)" }}
>All caught up !</p>
                  <p
  className="text-xs"
  style={{ color: "var(--color-text-secondary)" }}
>You have no notifications right now.</p>
                </div>
              )}

              {!loading && !error && notifications.map((n) => {
                const meta = TYPE_META[n.type] || TYPE_META.default
                const Icon = meta.icon
                return (
                  <motion.div
                    key={n._id}
                    layout
                    onClick={() => handleClick(n)}
                    className={`relative flex items-start gap-3 px-4 py-3 cursor-pointer border-b
style={{
  borderColor: "var(--color-border)",
}} last:border-0 transition-colors group ${
                      n.read ? 'hover:bg-gray-50' : 'bg-violet-50/40 hover:bg-violet-50/70'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                      <Icon size={15} className={meta.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
  className={`text-sm leading-tight ${
    n.read ? "" : "font-semibold"
  }`}
  style={{
    color: n.read
      ? "var(--color-text-secondary)"
      : "var(--color-text)",
  }}
>{n.title}</p>
                      {n.message && <p
  className="text-xs mt-0.5 leading-snug line-clamp-2"
  style={{ color: "var(--color-text-secondary)" }}
>{n.message}</p>}
                      <p
  className="text-[11px] mt-1"
  style={{ color: "var(--color-text-secondary)" }}
>{timeAgo(n.createdAt || n.date)}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                      {!n.read && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                      <button
                        onClick={(e) => { e.stopPropagation(); remove(n._id) }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
style={{
  color: "var(--color-text-secondary)",
}}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
