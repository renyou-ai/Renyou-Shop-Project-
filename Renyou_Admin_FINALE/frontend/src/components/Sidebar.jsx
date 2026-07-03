import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Tag,
  Percent,
  Award,
  UserCog,
  Settings,
  LogOut,
  User,
  Shield,
  ChevronRight,
  Grid,
  Moon,
  Sun,

  UserRound,
  CircleUserRound,
  Crown,

  Heart,
  Star,
  Flame,
  Sparkles,
  Ghost,

  Cat,
  Dog,
  Rabbit,
  Bird,
  Fish,
  Bug,

  Bot,
  Brain,
  Rocket,
  Zap,
  Gem,
  Diamond,

  Camera,
  Eye,
  Coffee,
  Gamepad2,
  Music,
  Pizza,
  IceCreamCone,

  Flower2,
  Leaf,
} from "lucide-react";
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from './Toast.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useTranslation } from 'react-i18next';

const navGroups = [
  { label:'principal', items:[
    { icon:LayoutDashboard, label:'dashboard', id:'dashboard' },
    { icon:Users,           label:'customers',   id:'customers'  },
    { icon:Package,         label:'products',    id:'inventory'  },
    { icon:ShoppingCart,    label:'orders',      id:'orders'     },
  ]},
  { label:'marketing', items:[
    { icon:Tag,     label:'promotions',  id:'promotions'  },
    { icon:Percent, label:'coupons',     id:'coupons'     },
    { icon:Award,   label:'brands',      id:'brands'      },
    { icon:Grid,    label:'categories',  id:'categories'  },
  ]},
  { label:'administration', items:[
    { icon:UserCog, label:'users', id:'users' },
  ]},
];

const AvatarIcons = {
  UserRound,
CircleUserRound,
User,
Shield,
Crown,
Heart,
Star,
Flame,
Sparkles,
Ghost,
Cat,
Dog,

  Rabbit,
  Bird,
  Fish,
  Bug,

  Bot,
  Brain,
  Rocket,
  Zap,
  Gem,
  Diamond,

  Camera,
  Eye,
  Coffee,
  Gamepad2,
  Music,
  Pizza,
  IceCreamCone,

  Flower2,
  Leaf,
};

export default function Sidebar({ active, onNavigate, onLogout }) {
  const [openDropup, setOpenDropup] = useState(false);
  const userRef = useRef(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { dark, toggleDark } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const h = e => { if (userRef.current && !userRef.current.contains(e.target)) setOpenDropup(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const initials = (() => {
    const name = user?.name || 'Admin';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return parts.length >= 2 ? (parts[0][0]+parts[parts.length-1][0]).toUpperCase() : name.slice(0,2).toUpperCase();
  })();

  const handleLogout = () => {
    setOpenDropup(false);
    toast.info(t('goodbye'), {
  title: `${t('logout')}`
});
    setTimeout(onLogout, 800);
  };

  const avatar = user?.avatar;

  const AvatarIcon = AvatarIcons[avatar];

  const DropupAvatarIcon = AvatarIcons[user?.avatar];

  return (
    <aside className="sidebar">
{/* Logo */}

  <div className="sidebar-logo">
  <img
  className="renyou-logo"
  src="/assets/dashboard/Side Navbar/RenyouLogo.svg"
  alt="Renyou Logo"
/>
</div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navGroups.map((group, gi) => (
          <React.Fragment key={group.label}>
            <span className="nav-label" style={{ marginTop:gi===0?4:14 }}>{t(group.label)}</span>
            {group.items.map(({ icon:Icon, label, id }) => (
              <motion.div key={id} whileHover={{ x:3 }} whileTap={{ scale:0.97 }}
                className={`nav-item ${active===id?'active':''}`}
                onClick={() => { setOpenDropup(false); onNavigate(id); }}>
                <Icon size={15} strokeWidth={active===id?2.2:1.8}/>
                <span>{t(label)}</span>
              </motion.div>
            ))}
          </React.Fragment>
        ))}

        {/* Separator before Settings */}
        <div className="nav-separator" />

        <motion.div whileHover={{ x:3 }} whileTap={{ scale:0.97 }}
          className={`nav-item ${active==='settings'?'active':''}`}
          onClick={() => onNavigate('settings')}>
          <Settings size={15} strokeWidth={active==='settings'?2.2:1.8}/>
          <span>{t('settings')}</span>
        </motion.div>
      </nav>

      {/* User */}
      <div className="sidebar-user-container" ref={userRef}>
        <motion.div className="sidebar-user" onClick={() => setOpenDropup(!openDropup)} whileTap={{ scale:0.98 }}>
          <div className="user-avatar">
  {avatar ? (
    avatar.startsWith('/uploads') ||
    avatar.startsWith('http') ? (
      <img
        src={
          avatar.startsWith('/uploads')
            ? `http://localhost:5001${avatar}`
            : avatar
        }
        alt={user?.name}
      />
) : AvatarIcon ? (
  <AvatarIcon
    size={24}
    color="white"
    strokeWidth={2}
  />
) : (
  <span style={{ fontSize: 24 }}>
    {avatar}
  </span>
)
  ) : (
    <span style={{ fontSize: initials.length === 1 ? 15 : 10.5 }}>
      {initials}
    </span>
  )}
</div>
          <div className="user-info">
            <div className="user-name">{user?.name||'Admin'}</div>
            <div className="user-role" style={{ display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#4ade80', display:'inline-block' }}/>
              {user?.role||'Admin'}
            </div>
          </div>
          <motion.div animate={{ rotate:openDropup?-90:0 }} transition={{ duration:0.2 }}>
            <ChevronRight size={13} style={{ color:'rgba(255,255,255,0.45)', flexShrink:0 }}/>
          </motion.div>
        </motion.div>

        {/* Premium Dropup */}
        <AnimatePresence>
          {openDropup && (
            <motion.div
              initial={{ opacity:0, y:14, scale:0.92 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:14, scale:0.92 }}
              transition={{ type:'spring', stiffness:380, damping:30 }}
              style={{
                position:'absolute', bottom:'calc(100% + 8px)', left:8, right:8,
                background:'var(--bg-card)', border:'1px solid var(--border)',
                borderRadius:16, overflow:'hidden',
                boxShadow:'0 -4px 40px rgba(82,78,141,0.22), 0 8px 24px rgba(0,0,0,0.1)', zIndex:999
              }}>
              {/* Header */}
              <div style={{ background:'linear-gradient(135deg,var(--primary) 0%,var(--primary-light) 100%)', padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
                <div
  style={{
    width:40,
    height:40,
    borderRadius:'50%',
    background:'rgba(255,255,255,0.22)',
    border:'2px solid rgba(255,255,255,0.35)',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    fontSize:14,
    fontWeight:800,
    color:'white',
    flexShrink:0,
    overflow:'hidden'
  }}
>
  {user?.avatar ? (
  user.avatar.startsWith('/uploads') ||
  user.avatar.startsWith('http') ? (
    <img
      src={
        user.avatar.startsWith('/uploads')
          ? `http://localhost:5001${user.avatar}`
          : user.avatar
      }
      alt={user?.name}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '50%'
      }}
    />
) : DropupAvatarIcon ? (
  <DropupAvatarIcon
    size={22}
    color="white"
    strokeWidth={2}
  />
) : (
  <span style={{ fontSize: 22 }}>
    {user.avatar}
  </span>
)
) : (
  initials
)}
</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', display:'flex', alignItems:'center', gap:4 }}><Shield size={9}/>{t(user?.role)}</div>
                </div>
                {/* Dark mode toggle inside dropup */}
                <button onClick={e=>{e.stopPropagation();toggleDark();}} style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'white', flexShrink:0, transition:'all 0.2s' }}
                  title={dark?'Mode clair':'Mode sombre'}>
                  {dark ? <Sun size={14}/> : <Moon size={14}/>}
                </button>
              </div>

              {/* Items */}
              <div style={{ padding:'8px 8px 4px' }}>
                {[
                  { icon:User,     label:t('myProfile'),   sub:t('viewEdit'),    color:'var(--primary)', action:()=>{ setOpenDropup(false); onNavigate('settings'); } },
                  { icon:Settings, label:t('settings'),   sub:t('configurations'),     color:'#6b7280',        action:()=>{ setOpenDropup(false); onNavigate('settings'); } },
                ].map((item,i) => (
                  <motion.div key={i} whileHover={{ x:3, backgroundColor:'var(--bg-hover)' }}
                    onClick={item.action}
                    style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 10px', borderRadius:10, cursor:'pointer', transition:'all 0.15s' }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:`${item.color}18`, display:'flex', alignItems:'center', justifyContent:'center', color:item.color, flexShrink:0 }}>
                      <item.icon size={15}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text-primary)' }}>{item.label}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{item.sub}</div>
                    </div>
                    <ChevronRight size={12} style={{ color:'var(--border)' }}/>
                  </motion.div>
                ))}
                <div style={{ height:1, background:'var(--border)', margin:'6px 4px' }}/>
                <motion.div whileHover={{ x:3, backgroundColor:'rgba(239,68,68,0.05)' }}
                  onClick={handleLogout}
                  style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 10px', borderRadius:10, cursor:'pointer', marginBottom:4, transition:'all 0.15s' }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#ef4444', flexShrink:0 }}>
                    <LogOut size={15}/>
                  </div>
                  <div>
                    <div style={{ fontSize:12.5, fontWeight:600, color:'#ef4444' }}>{t('logout')}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>{t('closeSession')}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
