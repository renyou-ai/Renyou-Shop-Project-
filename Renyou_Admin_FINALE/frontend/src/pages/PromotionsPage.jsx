import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Zap, Trash2, Edit2, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../components/Layouts.jsx';
import Topbar from '../components/Topbar.jsx';
import { api } from '../api.js';
import { useToast } from '../components/Toast.jsx';
import {
  formatCurrency,
  convertAndFormatCurrency
} from '../utils/currency';
import { useSettings } from '../context/SettingsContext';

const statusCls = s => ({ ACTIVE:'badge-active', SCHEDULED:'badge-processing', ENDED:'badge-inactive', DRAFT:'badge-pending' }[s]||'badge-pending');

function PromoModal({ promo, onClose, onSaved }) {
  const { toast } = useToast();
  const editing = !!promo;
  const [form, setForm] = useState(promo ? {
    name:promo.name, type:promo.type, description:promo.description||'',
    targetCategory:promo.targetCategory||'All Categories', status:promo.status,
    startDate:promo.startDate?promo.startDate.slice(0,10):'',
    endDate:promo.endDate?promo.endDate.slice(0,10):'', flashSale:promo.flashSale||false,
  } : { name:'', type:'Discount Code', description:'', targetCategory:'All Categories', status:'DRAFT', startDate:'', endDate:'', flashSale:false });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name) { toast.warning('Promotion name required'); return; }
    setLoading(true);
    try {
      if (editing) await api.updatePromotion(promo._id, form);
      else await api.createPromotion(form);
      toast.success(editing ? 'Promotion updated' : 'Promotion launched !', { title:'Success' });
      onSaved(); onClose();
    } catch(e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div className="modal" initial={{ opacity:0, scale:0.93, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.93 }} transition={{ type:'spring', stiffness:360, damping:28 }}>
        <div className="modal-header">
          <div><div className="modal-title">{editing?'Edit':'Create'} Promotion</div><div className="modal-sub">Configure your marketing campaign.</div></div>
          <div className="modal-close" onClick={onClose}><X size={14}/></div>
        </div>
        <div className="grid-2" style={{ gap:13, marginBottom:20 }}>
          <div style={{ gridColumn:'1/-1' }}><label className="input-label">Promotion Name *</label><input className="input-field" placeholder="e.g. Summer Health Fest" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div><label className="input-label">Campaign Type</label>
            <select className="input-field" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              {['Discount Code','BOGO','Banner','Flash Sale'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="input-label">Target Category</label>
            <select className="input-field" value={form.targetCategory} onChange={e=>setForm({...form,targetCategory:e.target.value})}>
              {['All Categories','Skincare','Supplements','Devices','Hair','Baby','Hygiene'].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}><label className="input-label">Description</label><textarea className="input-field" rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{resize:'vertical'}}/></div>
          <div><label className="input-label">Start Date</label><input className="input-field" type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}/></div>
          <div><label className="input-label">End Date</label><input className="input-field" type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}/></div>
          <div><label className="input-label">Status</label>
            <select className="input-field" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              {['DRAFT','ACTIVE','SCHEDULED','ENDED'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:'var(--bg-base)', borderRadius:10, marginBottom:20, border:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Zap size={14} style={{ color:'#f59e0b' }}/>
            <div><div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>Flash Sale</div><div style={{ fontSize:11.5, color:'var(--text-muted)' }}>Highlight on homepage</div></div>
          </div>
          <div className={`toggle ${form.flashSale?'on':''}`} onClick={()=>setForm({...form,flashSale:!form.flashSale})}/>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading?'⏳...':editing?'Update':'Launch'}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPromo, setEditPromo] = useState(null);
  const [search, setSearch] = useState('');
  const { settings } = useSettings();
  const { toast } = useToast();


  const load = useCallback(async () => {
    setLoading(true);
    try { setPromotions(await api.getPromotions(search?{search}:{})); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const del = async (id) => {
  if (!confirm('Delete this promotion?')) return;

  try {
    await api.deletePromotion(id);

    toast.success('Promotion deleted');

    await load();
  } catch (e) {
    toast.error(e.message || 'Delete failed');
    console.error(e);
  }
};

  const convData = promotions.filter(p=>p.conversions>0).map(p=>({ name:p.name.slice(0,14), conversions:p.conversions }));
  const stats = [
    { label:'ACTIVE', value:promotions.filter(p=>p.status==='ACTIVE').length },
    {
  label:'REVENUE',
  value: convertAndFormatCurrency({
    amount: promotions.reduce((a,p)=>a+(p.revenue||0),0),
    fromCurrency: 'USD',
    toCurrency: settings?.currency || 'USD',
    rates: settings?.exchangeRates || settings?.rates || {},
  }),
  color:'var(--success)'
},
    { label:'CONVERSIONS', value:promotions.reduce((a,p)=>a+(p.conversions||0),0) },
    { label:'FLASH SALES', value:promotions.filter(p=>p.flashSale).length, color:'var(--warning)' },
  ];

  return (
    <DashboardLayout>
      <Topbar placeholder="Search promotions..." onSearch={setSearch}/>
      <div className="page-content">
        <div className="section-header animate-fade">
          <div><div className="section-title">Promotions</div><div className="section-sub">Create and monitor marketing campaigns.</div></div>
          <button className="btn btn-primary btn-sm" onClick={()=>{setEditPromo(null);setShowModal(true);}}><Plus size={13}/> Create Promotion</button>
        </div>
        <div className="grid-4 mb-5 animate-fade-d1">
          {stats.map(s=><div key={s.label} className="stat-card"><div className="stat-label">{s.label}</div><div className="stat-value" style={{ color:s.color||'var(--text-primary)' }}>{s.value}</div></div>)}
        </div>
        <div
  className="grid-2 animate-fade-d2"
  style={{
    gridTemplateColumns:'3fr 2fr',
    alignItems:'stretch'
  }}
>
          <div className="card">
            <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:'var(--text-primary)' }}>Campaigns</div>
            {loading ? <div style={{ textAlign:'center', padding:32 }}><RefreshCw size={22} style={{ animation:'spin 1s linear infinite', color:'var(--text-muted)' }}/></div> : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>NAME</th><th>TYPE</th><th>STATUS</th><th>REVENUE</th><th>CONV.</th><th>ENDS</th><th></th></tr></thead>
                  <tbody>
                    {promotions.map(p=>(
                      <tr key={p._id}>
                        <td><div style={{ fontWeight:600, fontSize:13 }}>{p.name}</div>{p.flashSale&&<div style={{ fontSize:10, color:'var(--warning)', fontWeight:700 }}>⚡ FLASH</div>}</td>
                        <td className="text-sm text-muted">{p.type}</td>
                        <td><span className={`badge ${statusCls(p.status)}`}>{p.status}</span></td>
                        <td style={{ fontWeight:700 }}>
  {p.revenue
    ? convertAndFormatCurrency({
        amount: p.revenue,
        fromCurrency: 'USD',
        toCurrency: settings?.currency || 'USD',
        rates: settings?.exchangeRates || settings?.rates || {},
      })
    : '—'}
</td>
                        <td style={{ fontWeight:600 }}>{p.conversions||0}</td>
                        <td className="text-sm text-muted">{p.endDate?new Date(p.endDate).toLocaleDateString('en-US',{month:'short',day:'numeric'}):'—'}</td>
                        <td><div style={{ display:'flex', gap:4 }}>
                          <button className="btn btn-ghost btn-xs" onClick={()=>{setEditPromo(p);setShowModal(true);}}><Edit2 size={11}/></button>
                          <button className="btn btn-ghost btn-xs" style={{ color:'var(--danger)' }} onClick={()=>del(p._id)}><Trash2 size={11}/></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {promotions.length===0&&<div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No promotions found</div>}
              </div>
            )}
          </div>
          <div className="card">
            <div style={{ fontWeight:700, fontSize:14, marginBottom:16, color:'var(--text-primary)' }}>Performance</div>
            {convData.length>0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={convData} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)"/>
                  <XAxis dataKey="name" tick={{ fill:'var(--text-muted)', fontSize:10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:'var(--text-muted)', fontSize:10 }} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:9, fontSize:12 }}/>
                  <Bar dataKey="conversions" radius={[5,5,0,0]} name="Conversions">
                    {convData.map((_,i)=><Cell key={i} fill={i%2===0?'#524E8D':'#6B66B5'}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)', fontSize:13 }}>No data yet</div>}
          </div>
        </div>
      </div>
      <AnimatePresence>{showModal && <PromoModal promo={editPromo} onClose={()=>setShowModal(false)} onSaved={load}/>}</AnimatePresence>
    </DashboardLayout>
  );
}
