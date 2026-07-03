import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Trash2, Edit2, Award, Globe, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarLayout } from '../components/Layouts.jsx';
import Topbar from '../components/Topbar.jsx';
import { api } from '../api.js';
import { useToast } from '../components/Toast.jsx';
import { COUNTRY_NAMES, getFlag } from '../utils/flags.js';

function BrandModal({ brand, onClose, onSaved }) {
  const editing = !!brand;
  const [form, setForm] = useState(brand
    ? { name:brand.name, description:brand.description||'', country:brand.country||'', website:brand.website||'', logo:brand.logo||'', status:brand.status, featured:brand.featured||false }
    : { name:'', description:'', country:'', website:'', logo:'', status:'ACTIVE', featured:false });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async () => {
    if (!form.name) { toast.warning('Brand name required'); return; }
    setLoading(true);
    try {
      if (editing) await api.updateBrand(brand._id, form);
      else await api.createBrand(form);
      toast.success(editing ? 'Brand updated' : 'Brand created', { title: 'Success' });
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
          <div><div className="modal-title">{editing?'Edit':'Add'} Brand</div><div className="modal-sub">Fill in brand information.</div></div>
          <div className="modal-close" onClick={onClose}><X size={14}/></div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:13, marginBottom:20 }}>
          <div><label className="input-label">Brand Name *</label><input className="input-field" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="BioSkin Solutions"/></div>
          <div>
            <label className="input-label">Country of Origin</label>
            <select className="input-field" value={form.country} onChange={e=>setForm({...form,country:e.target.value})}>
              <option value="">— Select Country —</option>
              {COUNTRY_NAMES.map(c=><option key={c} value={c}>{getFlag(c)} {c}</option>)}
            </select>
          </div>
          <div><label className="input-label">Website</label><input className="input-field" type="url" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} placeholder="https://example.com"/><div>
  <div style={{ marginTop: 11 }}></div>
  <label className="input-label">Logo URL</label>

  <input
    className="input-field"
    type="url"
    value={form.logo || ''}
    onChange={e =>
      setForm({
        ...form,
        logo: e.target.value
      })
    }
    placeholder="https://brand.com/logo.png" 
  />
</div></div>
          <div><label className="input-label">Description</label><textarea className="input-field" rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{resize:'vertical'}}/></div>
          <div><label className="input-label">Status</label>
            <select className="input-field" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:'var(--bg-base)', borderRadius:10, marginBottom:20, border:'1px solid var(--border)' }}>
          <div><div style={{ fontSize:13.5, fontWeight:600, color:'var(--text-primary)' }}>⭐ Featured Brand</div><div style={{ fontSize:12, color:'var(--text-muted)' }}>Show prominently on storefront</div></div>
          <div className={`toggle ${form.featured?'on':''}`} onClick={()=>setForm({...form,featured:!form.featured})}/>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading?'⏳...':editing?'Update':'➕ Add Brand'}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try { setBrands(await api.getBrands(search?{search}:{})); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const del = async id => {
    if (!confirm('Delete this brand?')) return;
    try { await api.deleteBrand(id); toast.success('Brand deleted'); load(); }
    catch(e) { toast.error(e.message); }
  };

  const toggleFeatured = async b => {
    try { await api.updateBrand(b._id, { featured:!b.featured }); load(); }
    catch(e) { toast.error(e.message); }
  };

  const stats = [
    { label:'TOTAL BRANDS', value:brands.length },
    { label:'ACTIVE',       value:brands.filter(b=>b.status==='ACTIVE').length,  color:'var(--success)' },
    { label:'FEATURED',     value:brands.filter(b=>b.featured).length,           color:'var(--warning)' },
    { label:'COUNTRIES',    value:[...new Set(brands.map(b=>b.country).filter(Boolean))].length, color:'var(--info)' },
  ];

  return (
    <SidebarLayout>
      <Topbar placeholder="Search brands..." onSearch={setSearch}/>
      <div className="page-content">
        <div className="section-header animate-fade">
          <div><div className="section-title">Brands</div><div className="section-sub">Manage your product brands.</div></div>
          <button className="btn btn-primary btn-sm" onClick={()=>{setEditBrand(null);setShowModal(true);}}><Plus size={13}/> Add Brand</button>
        </div>
        <div className="grid-4 mb-5 animate-fade-d1">
          {stats.map(s=>(
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
          <div className="animate-fade-d2" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:16 }}>
            <AnimatePresence>
              {brands.map(b => (
                <motion.div key={b._id} layout initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                  className="card" style={{ position:'relative' }}>
                  {b.featured && <div style={{ position:'absolute', top:12, right:12 }}><span style={{ padding:'2px 8px', background:'linear-gradient(135deg,#f59e0b,#f97316)', color:'white', borderRadius:20, fontSize:10, fontWeight:700 }}>⭐ FEATURED</span></div>}
                  <div style={{ display:'flex', alignItems:'center', gap:13, marginBottom:14 }}>
                    <div
  style={{
    width:50,
    height:50,
    borderRadius:13,
    overflow:'hidden',
    border:'1px solid var(--border)',
    background:'white',
    flexShrink:0
  }}
>
  {b.logo ? (
    <img
      src={b.logo}
      alt={b.name}
      style={{
        width:'100%',
        height:'100%',
        objectFit:'contain'
      }}
    />
  ) : (
    <div
      style={{
        width:'100%',
        height:'100%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
      }}
    >
      <Award
        size={22}
        style={{ color:'var(--primary-light)' }}
      />
    </div>
  )}
</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:'var(--text-primary)' }}>{b.name}</div>
                      {b.country && <div style={{ fontSize:12.5, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4 }}>
                        <span style={{ fontSize:16 }}>{getFlag(b.country)}</span> {b.country}
                      </div>}
                    </div>
                  </div>
                  {b.description && <div style={{ fontSize:12.5, color:'var(--text-secondary)', marginBottom:12, lineHeight:1.5 }}>{b.description}</div>}
                  <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:12 }}>
                    <span className={`badge ${b.status==='ACTIVE'?'badge-active':'badge-inactive'}`}>{b.status}</span>
                    <span style={{ fontSize:11.5, color:'var(--text-muted)' }}><strong style={{ color:'var(--text-primary)' }}>{b.productCount||0}</strong> products</span>
                  </div>
                  {b.website && <a href={b.website} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--primary-light)', textDecoration:'none', marginBottom:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}><Globe size={11}/>{b.website}</a>}
                  <div style={{ display:'flex', gap:6, borderTop:'1px solid var(--border-light)', paddingTop:12 }}>
                    <button className="btn btn-ghost btn-sm" style={{ flex:1 }} onClick={()=>toggleFeatured(b)}>{b.featured?'★ Unfeature':'☆ Feature'}</button>
                    <button className="btn btn-ghost btn-sm" style={{ padding:'6px 10px' }} onClick={()=>{setEditBrand(b);setShowModal(true);}}><Edit2 size={12}/></button>
                    <button className="btn btn-ghost btn-sm" style={{ padding:'6px 10px', color:'var(--danger)' }} onClick={()=>del(b._id)}><Trash2 size={12}/></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {brands.length===0 && <div style={{ gridColumn:'1/-1', textAlign:'center', padding:48, color:'var(--text-muted)' }}><Award size={36} style={{ opacity:0.25, display:'block', margin:'0 auto 10px' }}/> No brands found</div>}
          </div>
        )}
      </div>
      <AnimatePresence>{showModal && <BrandModal brand={editBrand} onClose={()=>setShowModal(false)} onSaved={load}/>}</AnimatePresence>
    </SidebarLayout>
  );
}
