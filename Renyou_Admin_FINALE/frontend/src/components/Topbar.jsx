import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Bell, X, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifs } from '../context/NotifContext.jsx';
import { useNavigate } from 'react-router-dom';

const typeColor = { info:'#6B66B5', warning:'#f59e0b', danger:'#ef4444', success:'#22c55e' };

export default function Topbar({ placeholder='Search orders, products, or customers...', onSearch }) {
  const [val, setVal] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { notifications=[], unreadCount=0, markRead, markAllRead, deleteNotif } = useNotifs()||{};

  // Close on outside click
  useEffect(() => {
    const h = e => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!onSearch) return;
    const t = setTimeout(() => onSearch(val), 280);
    return () => clearTimeout(t);
  }, [val, onSearch]);

  const clear = () => { setVal(''); onSearch?.(''); inputRef.current?.focus(); };

  const handleNotifClick = async n => {
    if (!n.read) await markRead(n._id);
    if (n.link) { navigate(n.link); setShowNotifs(false); }
  };

  return (
    <div className="topbar">
      {/* Search */}
      <div className="search-box">
        <Search size={14} className="search-icon"/>
        <input
          ref={inputRef}
          placeholder={placeholder}
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key==='Escape' && clear()}
        />
        <AnimatePresence>
          {val && (
            <motion.button
              initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.7 }}
              onClick={clear}
              style={{ position:'absolute', right:10, background:'var(--bg-hover)', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center', justifyContent:'center', width:18, height:18, borderRadius:'50%', padding:0 }}>
              <X size={11}/>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="topbar-actions">
        {/* Notifications */}
        <div ref={notifRef} style={{ position:'relative' }}>
          <motion.div className="icon-btn" onClick={() => setShowNotifs(!showNotifs)} whileTap={{ scale:0.93 }}>
            <Bell size={15}/>
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                  style={{ position:'absolute', top:3, right:3, minWidth:15, height:15, background:'var(--danger)', borderRadius:10, fontSize:9, fontWeight:800, color:'white', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px', border:'1.5px solid var(--bg-surface)' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity:0, y:8, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:8, scale:0.95 }}
                transition={{ type:'spring', stiffness:380, damping:30 }}
                onClick={e=>e.stopPropagation()}
                style={{ position:'absolute', top:'calc(100%+10px)', right:0, marginTop:8, width:340, maxHeight:440, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, boxShadow:'0 12px 48px rgba(82,78,141,0.18)', zIndex:9999, display:'flex', flexDirection:'column', overflow:'hidden' }}>

                <div style={{ padding:'13px 16px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text-primary)' }}>Notifications</div>
                    {unreadCount>0 && <div style={{ fontSize:11, color:'var(--text-muted)' }}>{unreadCount} non lue{unreadCount>1?'s':''}</div>}
                  </div>
                  {unreadCount>0 && (
                    <button onClick={markAllRead} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--primary-light)', fontSize:12, display:'flex', alignItems:'center', gap:4, fontWeight:600 }}>
                      <CheckCheck size={13}/> Tout lire
                    </button>
                  )}
                </div>

                <div style={{ overflowY:'auto', flex:1 }}>
                  {notifications.length===0 ? (
                    <div style={{ padding:32, textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>
                      <Bell size={28} style={{ opacity:0.25, display:'block', margin:'0 auto 8px' }}/> Aucune notification
                    </div>
                  ) : notifications.map(n => (
                    <motion.div key={n._id}
                      whileHover={{ backgroundColor:'var(--bg-hover)' }}
                      onClick={() => handleNotifClick(n)}
                      style={{ padding:'11px 15px', borderBottom:'1px solid var(--border-light)', cursor:n.link?'pointer':'default', background:n.read?'transparent':'var(--primary-glow)', display:'flex', gap:10, alignItems:'flex-start', transition:'background 0.15s' }}>
                      <div style={{ width:32, height:32, borderRadius:9, background:`${typeColor[n.type]||'#6B66B5'}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{n.icon||'🔔'}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:n.read?500:700, fontSize:12.5, marginBottom:2, color:'var(--text-primary)' }}>{n.title}</div>
                        <div style={{ fontSize:11.5, color:'var(--text-muted)', lineHeight:1.4 }}>{n.message}</div>
                        <div style={{ fontSize:10.5, color:'var(--text-muted)', marginTop:4, opacity:0.7 }}>
                          {new Date(n.createdAt).toLocaleString('en-US',{month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'})}
                        </div>
                      </div>
                      <button onClick={e=>{e.stopPropagation();deleteNotif(n._id);}} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:3, borderRadius:5, display:'flex' }}>
                        <X size={12}/>
                      </button>
                      {!n.read && <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--primary)', flexShrink:0, marginTop:4 }}/>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
