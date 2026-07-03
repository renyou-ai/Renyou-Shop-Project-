import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X, ShoppingCart } from 'lucide-react'
import { useTheme } from "./ThemeContext";

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
  cart:    ShoppingCart,
}

const STYLES = {
  success: {
    icon: "text-emerald-500",
    bar: "bg-emerald-400",
  },
  error: {
    icon: "text-red-500",
    bar: "bg-red-400",
  },
  warning: {
    icon: "text-amber-500",
    bar: "bg-amber-400",
  },
  info: {
    icon: "text-blue-500",
    bar: "bg-blue-400",
  },
  cart: {
    icon: "text-violet-600",
    bar: "bg-violet-500",
  },
};

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const { dark } = useTheme();
  
  const timers = useRef({})

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const show = useCallback((type, title, message, opts = {}) => {
    const id = ++idCounter
    const duration = opts.duration ?? 3500
    const toast = { id, type, title, message, duration, action: opts.action, image: opts.image }
    setToasts(prev => [...prev, toast].slice(-4)) // max 4 visible
    if (duration > 0) {
      timers.current[id] = setTimeout(() => remove(id), duration)
    }
    return id
  }, [remove])

  const api = {
    success: (title, message, opts) => show('success', title, message, opts),
    error:   (title, message, opts) => show('error',   title, message, opts),
    warning: (title, message, opts) => show('warning', title, message, opts),
    info:    (title, message, opts) => show('info',    title, message, opts),
    cart:    (title, message, opts) => show('cart',    title, message, opts),
    dismiss: remove,
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[99999] flex flex-col gap-2.5 w-[340px] max-w-[calc(100vw-2rem)] pointer-events-none">
          <AnimatePresence>
            {toasts.map(t => {
              const Icon = ICONS[t.type] || Info
              const s = STYLES[t.type] || STYLES.info
              return (
                <motion.div
                  key={t.id}
                  layout
initial={{
  opacity: 0,
  x: 120,
}}

animate={{
  opacity: 1,
  x: 0,
}}

exit={{
  opacity: 0,
  x: 120,
  transition: {
    duration: 0.18,
    ease: "linear",
  },
}}
transition={{
  duration: 0.22,
  ease: "linear",
}}
                  className="pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300"
style={{
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-border)",
  boxShadow: dark
    ? "0 16px 40px rgba(0,0,0,.45)"
    : "0 16px 40px rgba(0,0,0,.12)",
}}
                >
                  <div className="flex items-start gap-3 p-3.5">
                    {t.image ? (
<div
  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border"
  style={{
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-border)",
  }}
>
  <img
    src={t.image}
    alt=""
    className="w-full h-full object-contain p-1"
  />
</div>
                    ) : (
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon size={19} className={s.icon}/>
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pt-0.5">
                      {t.title && <p
  className="text-sm font-semibold leading-tight"
  style={{
    color: "var(--color-text)",
  }}
>
  {t.title}
</p>}
                      {t.message && <p
  className="text-xs mt-0.5 leading-snug"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
  {t.message}
</p>}
                      {t.action && (
<button
  onClick={() => {
    t.action.onClick();
    remove(t.id);
  }}
  className="mt-2 text-xs font-bold transition-colors"
  style={{
    color: "var(--color-primary)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.opacity = "0.8";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.opacity = "1";
  }}
>
  {t.action.label} →
</button>
                      )}
                    </div>
<button
  onClick={() => remove(t.id)}
  className="flex-shrink-0 transition-colors mt-0.5"
  style={{
    color: "var(--color-text-secondary)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = "var(--color-text)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = "var(--color-text-secondary)";
  }}
>
  <X size={14} />
</button>
                  </div>
                  {/* Progress bar */}
                  {t.duration > 0 && (
<motion.div
  initial={{ scaleX: 1 }}
  animate={{ scaleX: 0 }}
  transition={{ duration: t.duration / 1000, ease: "linear" }}
  className={`absolute bottom-0 left-0 right-0 h-[3px] origin-left ${s.bar}`}
  style={{
    opacity: dark ? 0.9 : 1,
  }}
/>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
