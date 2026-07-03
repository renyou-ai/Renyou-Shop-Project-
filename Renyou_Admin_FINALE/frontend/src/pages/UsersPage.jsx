import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Trash2, Edit2, UserCog, RefreshCw, UserRound,
CircleUserRound,
User,
Shield,
Crown,
Heart,
Star,
Flame,
Sparkles,
Ghost,
MoonStar,
Smile,

Globe,
Lock,
Bell,
Palette,
Save,
Upload,
Moon,
Sun,
Check,

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
Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarLayout } from '../components/Layouts.jsx';
import Topbar from '../components/Topbar.jsx';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { useTranslation } from 'react-i18next';

const roleColor = { 'Super Admin':'#ef4444','Pharmacist':'#524E8D','Marketing':'#22c55e','Support':'#3b82f6' };
const roleIcon  = { 'Super Admin':'','Pharmacist':'','Marketing':'','Support':'' };

function computeInitials(name) {
  const parts = (name||'').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  return (name||'U').slice(0,2).toUpperCase();
}

const AvatarIcons = {
  // ===== Admin avatars =====
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

  // ===== Normal user avatars =====
  smile: Smile,
  ghost: Ghost,
  moon: MoonStar,
  bot: Bot,
  crown: Crown,
  cat: Cat,
  dog: Dog,
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit,
  flower: Flower2,
  leaf: Leaf,
  star: Star,
  gem: Gem,
  flame: Flame,
  moon: Moon,
  heart: Heart,
  sparkles: Sparkles,
  zap: Zap,
};

function UserModal({ user, onClose, onSaved }) {
  const editing = !!user;
  const [form, setForm] = useState(user
    ? { name:user.name, email:user.email, role:user.role, department:user.department||'', status:user.status }
    : { name:'', email:'', password:'', role:'Support', department:'', status:'ACTIVE' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async () => {
    if (!form.name||!form.email) { toast.warning('Name and email required'); return; }
    if (!editing&&!form.password) { toast.warning('Password required'); return; }
    setLoading(true);
    try {
      if (editing) await api.updateUser(user._id, form);
      else await api.createUser(form);
      toast.success(editing?'User updated':'User invited!', { title:'✅ Success' });
      onSaved(); onClose();
    } catch(e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div className="modal" style={{ maxWidth:460 }}
        initial={{ opacity:0, scale:0.93, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.93 }} transition={{ type:'spring', stiffness:360, damping:28 }}>
        <div className="modal-header">
          <div><div className="modal-title">{editing?'Edit':'Invite'} Admin User</div><div className="modal-sub">Manage platform access.</div></div>
          <div className="modal-close" onClick={onClose}><X size={14}/></div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:13, marginBottom:20 }}>
          <div><label className="input-label">Full Name * <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:400 }}>(initials auto-computed)</span></label>
            <input className="input-field" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Firstname Lastname"/>
            {form.name && <div style={{ marginTop:6, fontSize:12, color:'var(--text-muted)' }}>Initials: <strong style={{ color:'var(--primary)' }}>{computeInitials(form.name)}</strong></div>}
          </div>
          <div><label className="input-label">Email *</label><input className="input-field" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="user@renyou.com"/></div>
          {!editing && <div><label className="input-label">Password *</label><input className="input-field" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min. 6 characters"/></div>}
          <div className="grid-2" style={{ gap:12 }}>
            <div><label className="input-label">Role</label>
              <select className="input-field" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                {['Super Admin','Pharmacist','Marketing','Support'].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div><label className="input-label">Department</label>
              <select className="input-field" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>
                <option value="">— Select —</option>
                {['Management','Skincare','Supplements','Operations','Marketing','Support'].map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div><label className="input-label">Status</label>
            <select className="input-field" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading?'⏳...':editing?'Update':'📨 Invite'}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const { user:currentUser } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const roleLabels = {
  'Super Admin': t('superAdmin'),
  'Pharmacist': t('pharmacist'),
  'Marketing': t('marketing'),
  'Support': t('support'),
};

  const load = useCallback(async () => {
  setLoading(true);

  try {
    const p = {};
    if (search) p.search = search;
    if (filterRole) p.role = filterRole;

    const data = await api.getUsers(p);

    console.log(
  "ALL USERS =",
  JSON.stringify(data, null, 2)
);

    setUsers(data);
  }
  catch(e) {
    console.error(e);
  }
  finally {
    setLoading(false);
  }
}, [search, filterRole]);

  useEffect(() => { load(); }, [load]);

  const del = async id => {
    if (id===currentUser?.id) { toast.error('Cannot delete your own account'); return; }
    if (!confirm('Delete this user?')) return;
    try { await api.deleteUser(id); toast.success('User deleted'); load(); }
    catch(e) { toast.error(e.message); }
  };

  const toggleStatus = async u => {
    try {
      await api.updateUser(u._id, { status:u.status==='ACTIVE'?'INACTIVE':'ACTIVE' });
      toast.info(`Account ${u.status==='ACTIVE'?'deactivated':'activated'}`, { title:u.name });
      load();
    } catch(e) { toast.error(e.message); }
  };

  // Fix: count from actual API result
  const stats = [
    { label:t('totalUsers'),   value:users.length },
    { label:t('active'),        value:users.filter(u=>u.status==='ACTIVE').length,    color:'var(--success)' },
    { label:t('superAdmins'),  value:users.filter(u=>u.role==='Super Admin').length,  color:'var(--danger)'  },
    { label:t('inactive'),      value:users.filter(u=>u.status==='INACTIVE').length,   color:'var(--text-muted)' },
  ];

  return (
    <SidebarLayout>
      <Topbar placeholder="Search users, emails..." onSearch={setSearch}/>
      <div className="page-content">
        <div className="section-header animate-fade">
          <div><div className="section-title">{t('usersAdmins')}</div><div className="section-sub">{t('manageUsersAdmins')}</div></div>
          <button className="btn btn-primary btn-sm" onClick={()=>{setEditUser(null);setShowModal(true);}}><Plus size={13}/> Invite Admin</button>
        </div>

        <div className="grid-4 mb-5 animate-fade-d1">
          {stats.map(s=>(
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color:s.color||'var(--text-primary)' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="card mb-4 animate-fade-d1" style={{ padding:'11px 15px' }}>
          <div style={{ display:'flex', gap:7, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600 }}>ROLE :</span>
            {['', 'Super Admin', 'Pharmacist', 'Marketing', 'Support'].map(r => (
  <button
    key={r}
    className={`btn btn-sm ${filterRole === r ? 'btn-primary' : 'btn-ghost'}`}
    onClick={() => setFilterRole(r)}
  >
    {r ? `${roleIcon[r]} ${roleLabels[r]}` : t('all')}
  </button>
))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:60 }}>
            <RefreshCw size={28} style={{ animation:'spin 1s linear infinite', color:'var(--text-muted)', display:'block', margin:'0 auto 10px' }}/>
          </div>
        ) : (
          <div className="animate-fade-d2" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:16 }}>
            <AnimatePresence>
              {users.map(u => {
                console.log(
  "USER:",
  u.name,
  "AVATAR:",
  u.avatar
);
                const isMe = u._id===currentUser?.id;
                const initials = computeInitials(u.name);
const AvatarIcon = AvatarIcons[u.avatar];
                return (
                  <motion.div key={u._id} layout initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }}
                    className="card" style={{ position:'relative', border:isMe?'1.5px solid var(--primary)':'1px solid var(--border)' }}>
                    {isMe && <div style={{ position:'absolute', top:12, right:12 }}><span style={{ padding:'2px 8px', background:'var(--primary)', color:'white', borderRadius:20, fontSize:10, fontWeight:700 }}>YOU</span></div>}
                    <div style={{ display:'flex', alignItems:'center', gap:13, marginBottom:13 }}>
                      <div
  style={{
    width:50,
    height:50,
    borderRadius:'50%',
    overflow:'hidden',
    flexShrink:0
  }}
>
  {u.avatar ? (
  u.avatar.startsWith('/uploads') ||
  u.avatar.startsWith('http') ? (
    <img
      src={
        u.avatar.startsWith('/uploads')
          ? `http://localhost:5001${u.avatar}`
          : u.avatar
      }
      alt={u.name}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
) : AvatarIcon ? (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `${roleColor[u.role] || '#524E8D'}18`,
      color: roleColor[u.role] || '#524E8D',
    }}
  >
    <AvatarIcon
      size={24}
      strokeWidth={2}
    />
  </div>
) : (
  <div
    style={{
      width:'100%',
      height:'100%',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      fontSize:'24px'
    }}
  >
    {u.avatar}
  </div>
)
) : (
  <div
    style={{
      width:'100%',
      height:'100%',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      background:`${roleColor[u.role]||'#524E8D'}18`,
      color:roleColor[u.role]||'#524E8D',
      fontWeight:800
    }}
  >
    {initials}
  </div>
)}
</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:14 }}>{u.name}</div>
                        <div style={{ fontSize:11.5, color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:12 }}>
                      <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:`${roleColor[u.role]||'#524E8D'}18`, color:roleColor[u.role]||'#524E8D' }}>{roleIcon[u.role]} {u.role}</span>
                      {u.department && <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:'var(--bg-base)', color:'var(--text-secondary)', border:'1px solid var(--border)' }}>{u.department}</span>}
                      <span className={`badge ${u.status==='ACTIVE'?'badge-active':'badge-inactive'}`}>{u.status}</span>
                    </div>
                    <div style={{ fontSize:11.5, color:'var(--text-muted)', marginBottom:14 }}>
                      Last active: {u.lastActive?new Date(u.lastActive).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'—'}
                    </div>
                    <div style={{ display:'flex', gap:6, borderTop:'1px solid var(--border-light)', paddingTop:12 }}>
                      <button className="btn btn-ghost btn-sm" style={{ flex:1 }} onClick={()=>toggleStatus(u)}>{u.status==='ACTIVE'?'🔒 Deactivate':'🔓 Activate'}</button>
                      <button className="btn btn-ghost btn-sm" style={{ padding:'6px 10px' }} onClick={()=>{setEditUser(u);setShowModal(true);}}><Edit2 size={12}/></button>
                      {!isMe && <button className="btn btn-ghost btn-sm" style={{ padding:'6px 10px', color:'var(--danger)' }} onClick={()=>del(u._id)}><Trash2 size={12}/></button>}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {users.length===0 && <div style={{ gridColumn:'1/-1', textAlign:'center', padding:48, color:'var(--text-muted)' }}><UserCog size={36} style={{ opacity:0.25, display:'block', margin:'0 auto 10px' }}/> No users found</div>}
          </div>
        )}
      </div>
      <AnimatePresence>{showModal && <UserModal user={editUser} onClose={()=>setShowModal(false)} onSaved={load}/>}</AnimatePresence>
    </SidebarLayout>
  );
}
