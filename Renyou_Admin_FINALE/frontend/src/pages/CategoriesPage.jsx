import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  X,
  Trash2,
  Edit2,
  Grid,
  RefreshCw,

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

// Categories
Baby,
HeartPulse,
Smartphone,
Scissors,
Pill,
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarLayout } from '../components/Layouts.jsx';
import Topbar from '../components/Topbar.jsx';
import { api } from '../api.js';
import { useToast } from '../components/Toast.jsx';

const PRESET_AVATARS = [
  { id: "UserRound", icon: UserRound },
  { id: "CircleUserRound", icon: CircleUserRound },
  { id: "User", icon: User },
  { id: "Shield", icon: Shield },
  { id: "Crown", icon: Crown },

  { id: "Heart", icon: Heart },
  { id: "Star", icon: Star },
  { id: "Flame", icon: Flame },
  { id: "Sparkles", icon: Sparkles },
  { id: "Ghost", icon: Ghost },

  { id: "Cat", icon: Cat },
  { id: "Dog", icon: Dog },
  { id: "Rabbit", icon: Rabbit },
  { id: "Bird", icon: Bird },
  { id: "Fish", icon: Fish },
  { id: "Bug", icon: Bug },

  { id: "Bot", icon: Bot },
  { id: "Brain", icon: Brain },
  { id: "Rocket", icon: Rocket },
  { id: "Zap", icon: Zap },
  { id: "Gem", icon: Gem },
  { id: "Diamond", icon: Diamond },

  { id: "Camera", icon: Camera },
  { id: "Eye", icon: Eye },
  { id: "Coffee", icon: Coffee },
  { id: "Gamepad2", icon: Gamepad2 },
  { id: "Music", icon: Music },
  { id: "Pizza", icon: Pizza },
  { id: "IceCreamCone", icon: IceCreamCone },

  { id: "Flower2", icon: Flower2 },
  { id: "Leaf", icon: Leaf },
  // Categories
{ id: "Baby", icon: Baby },
{ id: "HeartPulse", icon: HeartPulse },
{ id: "Smartphone", icon: Smartphone },
{ id: "Scissors", icon: Scissors },
{ id: "Pill", icon: Pill },
];
const COLORS = ['#524E8D','#6B66B5','#22c55e','#3b82f6','#f59e0b','#ec4899','#06b6d4','#ef4444','#8b5cf6','#10b981'];
const CategoryIcons = Object.fromEntries(
  PRESET_AVATARS.map(item => [item.id, item.icon])
);
const DEFAULT_CATEGORY_ICONS = {
  Baby: 'Baby',
  Bodycare: 'HeartPulse',
  Devices: 'Smartphone',
  Haircare: 'Scissors',
  Skincare: 'Sparkles',
  Supplements: 'Pill',
};

function CategoryModal({ cat, onClose, onSaved }) {
  const editing = !!cat;
  const [form, setForm] = useState(cat
    ? { name:cat.name, description:cat.description||'', icon: cat.icon || 'Sparkles', color:cat.color||'#524E8D', status:cat.status }
    : { name:'', description:'', icon: 'Sparkles', color:'#524E8D', status:'ACTIVE' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async () => {
    if (!form.name) { toast.warning('Category name required'); return; }
    setLoading(true);
    try {
      if (editing) await api.updateCategory(cat._id, form);
      else await api.createCategory(form);
      toast.success(editing?'Category updated':'Category created', { title:'Success' });
      onSaved(); onClose();
    } catch(e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div className="modal" style={{ maxWidth:480 }}
        initial={{ opacity:0, scale:0.93, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.93 }} transition={{ type:'spring', stiffness:360, damping:28 }}>
        <div className="modal-header">
          <div><div className="modal-title">{editing?'Edit':'New'} Category</div><div className="modal-sub">Configure category details.</div></div>
          <div className="modal-close" onClick={onClose}><X size={14}/></div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
          <div><label className="input-label">Name *</label><input className="input-field" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Skincare"/></div>
          <div><label className="input-label">Description</label><textarea className="input-field" rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{resize:'vertical'}}/></div>
          <div>
            <label className="input-label">Icon</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
              {PRESET_AVATARS.map(({ id, icon: Icon }) => (<motion.div
  key={id}
  whileTap={{ scale: 0.85 }}
  onClick={() => setForm({ ...form, icon: id })}
  style={{
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: `2px solid ${
      form.icon === id ? "var(--primary)" : "var(--border)"
    }`,
    background:
      form.icon === id
        ? "var(--primary-glow)"
        : "var(--bg-base)",
  }}
>
  <Icon size={20} />
</motion.div>
))}
            </div>
          </div>
          <div>
            <label className="input-label">Color</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:4 }}>
              {COLORS.map(c=>(
                <motion.div key={c} whileTap={{ scale:0.85 }} onClick={()=>setForm({...form,color:c})}
                  style={{ width:30, height:30, borderRadius:'50%', background:c, cursor:'pointer',
                    border:`3px solid ${form.color===c?'var(--text-primary)':'transparent'}`,
                    transition:'all 0.15s', boxShadow:'0 2px 6px rgba(0,0,0,0.15)',
                    transform:form.color===c?'scale(1.15)':'scale(1)' }}/>
              ))}
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
          <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading?'⏳...':editing?'Update':'➕ Create'}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CategoriesPage() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try { setCats(await api.getCategories(search?{search}:{})); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const del = async id => {
    if (!confirm('Delete this category?')) return;
    try { await api.deleteCategory(id); toast.success('Category deleted'); load(); }
    catch(e) { toast.error(e.message); }
  };

  const totalProducts = cats.reduce((a,c)=>a+(c.productCount||0),0);

  return (
    <SidebarLayout>
      <Topbar placeholder="Search categories..." onSearch={setSearch}/>
      <div className="page-content">
        <div className="section-header animate-fade">
          <div><div className="section-title">Categories</div><div className="section-sub">Manage product categories.</div></div>
          <button className="btn btn-primary btn-sm" onClick={()=>{setEditCat(null);setShowModal(true);}}><Plus size={13}/> New Category</button>
        </div>

        <div className="grid-4 mb-5 animate-fade-d1">
          {[
            { label:'TOTAL',    value:cats.length },
            { label:'ACTIVE',   value:cats.filter(c=>c.status==='ACTIVE').length,   color:'var(--success)' },
            { label:'INACTIVE', value:cats.filter(c=>c.status==='INACTIVE').length, color:'var(--text-muted)' },
            { label:'PRODUCTS', value:totalProducts },
          ].map(s=>(
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color:s.color||'var(--text-primary)' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}>
            <RefreshCw size={28} style={{ animation:'spin 1s linear infinite', display:'block', margin:'0 auto 10px' }}/>
          </div>
        ) : (
          <div className="animate-fade-d2" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
            <AnimatePresence>
              {cats.map(c=>(
                <motion.div key={c._id} layout initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                  className="card" style={{ borderLeft:`4px solid ${c.color||'#524E8D'}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                    <div
  style={{
    width:48,
    height:48,
    borderRadius:13,
    background:`${c.color||'#524E8D'}18`,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    flexShrink:0,
    color:c.color || '#524E8D'
  }}
>
{(() => {
  const iconName =
    c.icon ||
    DEFAULT_CATEGORY_ICONS[c.name] ||
    'Grid';

  const IconComponent =
    CategoryIcons[iconName] || Grid;

  return <IconComponent size={24} />;
})()}
</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:'var(--text-primary)' }}>{c.name}</div>
                      <span className={`badge ${c.status==='ACTIVE'?'badge-active':'badge-inactive'}`}>{c.status}</span>
                    </div>
                  </div>
                  {c.description && <div style={{ fontSize:12.5, color:'var(--text-muted)', marginBottom:12, lineHeight:1.5 }}>{c.description}</div>}
                  <div style={{ fontSize:12.5, color:'var(--text-muted)', marginBottom:14 }}>
                    <strong style={{ color:'var(--text-primary)' }}>{c.productCount||0}</strong> active products
                  </div>
                  <div style={{ display:'flex', gap:6, borderTop:'1px solid var(--border-light)', paddingTop:12 }}>
                    <button className="btn btn-ghost btn-sm" style={{ flex:1 }} onClick={()=>{setEditCat(c);setShowModal(true);}}><Edit2 size={12}/> Edit</button>
                    <button className="btn btn-ghost btn-sm" style={{ padding:'6px 10px', color:'var(--danger)' }} onClick={()=>del(c._id)}><Trash2 size={12}/></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {cats.length===0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:48, color:'var(--text-muted)' }}>
                <Grid size={36} style={{ opacity:0.25, display:'block', margin:'0 auto 10px' }}/> No categories found
              </div>
            )}
          </div>
        )}
      </div>
      <AnimatePresence>{showModal && <CategoryModal cat={editCat} onClose={()=>setShowModal(false)} onSaved={load}/>}</AnimatePresence>
    </SidebarLayout>
  );
}
