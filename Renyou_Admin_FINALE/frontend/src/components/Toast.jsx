import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X, Bell } from 'lucide-react';
import i18n from '../i18n';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  notif: Bell,
};

const COLORS = {
  success: { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)',  icon: '#22c55e', bar: '#22c55e' },
  error:   { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  icon: '#ef4444', bar: '#ef4444' },
  warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: '#f59e0b', bar: '#f59e0b' },
  info:    { bg: 'rgba(82,78,141,0.1)',  border: 'rgba(107,102,181,0.3)',icon: '#6B66B5', bar: '#524E8D' },
  notif:   { bg: 'rgba(107,102,181,0.08)', border: 'rgba(139,134,207,0.3)', icon: '#8B86CF', bar: '#6B66B5' },
};

const translate = (value) => {
  if (!value || typeof value !== 'string') {
    return value;
  }

  return i18n.exists(value)
    ? i18n.t(value)
    : value;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const duration = options.duration ?? 4200;
    setToasts(prev => [
  ...prev.slice(-4),
  {
    id,
    message: translate(message),
    type,
    title: translate(options.title),
    duration
  }
]);
    if (duration > 0) setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    return id;
  }, []);

  const dismiss = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  const toast = {
    show:    (msg, opts) => addToast(msg, 'info', opts),
    success: (msg, opts) => addToast(msg, 'success', opts),
    error:   (msg, opts) => addToast(msg, 'error', opts),
    warning: (msg, opts) => addToast(msg, 'warning', opts),
    info:    (msg, opts) => addToast(msg, 'info', opts),
    notif:   (msg, opts) => addToast(msg, 'notif', opts),
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div style={{ position:'fixed', top:20, right:20, zIndex:99999, display:'flex', flexDirection:'column', gap:10, pointerEvents:'none', maxWidth:360, width:'calc(100vw - 40px)' }}>
        <AnimatePresence mode="popLayout">
          {toasts.map(t => <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />)}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const primary = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary')
  .trim();

const c =
  toast.type === 'info' || toast.type === 'notif'
    ? {
        bg: 'color-mix(in srgb, var(--primary) 12%, transparent)',
        border: 'color-mix(in srgb, var(--primary) 35%, transparent)',
        icon: 'var(--primary)',
        bar: 'var(--primary)',
      }
    : (COLORS[toast.type] || COLORS.info);
  const IconComp = ICONS[toast.type] || Info;
  return (
    <motion.div
      layout
      initial={{ opacity:0, x:70, scale:0.9 }}
      animate={{ opacity:1, x:0, scale:1 }}
      exit={{ opacity:0, x:70, scale:0.88 }}
      transition={{ type:'spring', stiffness:360, damping:32 }}
      style={{
        pointerEvents:'all', background:'var(--bg-card)',
        border:`1px solid ${c.border}`, borderRadius:14,
        padding:'13px 15px', boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
        backdropFilter:'blur(14px)', display:'flex', alignItems:'flex-start',
        gap:11, position:'relative', overflow:'hidden',
        fontFamily:'Inter, sans-serif',
      }}
    >
      {/* Left color bar */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:4, background:
      toast.type === 'info' || toast.type === 'notif'
        ? 'var(--primary)'
        : c.bar, borderRadius:'14px 0 0 14px' }} />
      {/* Progress */}
      {toast.duration > 0 && (
        <motion.div initial={{ scaleX:1 }} animate={{ scaleX:0 }} transition={{ duration:toast.duration/1000, ease:'linear' }}
          style={{
  position:'absolute',
  bottom:0,
  left:0,
  right:0,
  height:2,
  background:c.bar,
  transformOrigin:'left',
  opacity:0.35
}} />
      )}
      {/* Icon */}
      <div style={{ width:32, height:32, borderRadius:9, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', color:c.icon, flexShrink:0, marginLeft:5 }}>
        <IconComp size={16} strokeWidth={2.2} />
      </div>
      {/* Content */}
      <div style={{ flex:1, minWidth:0 }}>
        {toast.title && <div style={{ fontWeight:700, fontSize:13, color:'var(--text-primary)', marginBottom:2 }}>{toast.title}</div>}
        <div style={{ fontSize:12.5, color:'var(--text-secondary)', lineHeight:1.45 }}>{toast.message}</div>
      </div>
      {/* Close */}
      <button onClick={onDismiss} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:3, display:'flex', alignItems:'center', flexShrink:0, borderRadius:6, transition:'color 0.15s' }}
        onMouseEnter={e=>e.currentTarget.style.color='var(--text-primary)'} onMouseLeave={e=>e.currentTarget.style.color='#C4C2D8'}>
        <X size={13} />
      </button>
    </motion.div>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};
