import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Trash2, Edit2, Copy, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarLayout } from '../components/Layouts.jsx';
import Topbar from '../components/Topbar.jsx';
import { api } from '../api.js';
import { useToast } from '../components/Toast.jsx';
import {
  formatCurrency
} from '../utils/currency';
import { useSettings } from '../context/SettingsContext';

const statusCls = s => ({ ACTIVE:'badge-active', INACTIVE:'badge-inactive', EXPIRED:'badge-out-of-stock' }[s]||'badge-pending');

function CouponModal({ coupon, onClose, onSaved }) {
  const editing = !!coupon;
  const [discountType, setDiscountType] = useState(coupon?.discountType||'percentage');
  const [minPurchase, setMinPurchase] = useState(coupon?.minPurchase||0);
  const [form, setForm] = useState(coupon ? {
    code:coupon.code, discountValue:coupon.discountValue, usageLimit:coupon.usageLimit||'',
    usageLimitPerCustomer:coupon.usageLimitPerCustomer||1, status:coupon.status,
    expiresAt:coupon.expiresAt?coupon.expiresAt.slice(0,10):'',
  } : { code:'', discountValue:'', usageLimit:'', usageLimitPerCustomer:1, status:'ACTIVE', expiresAt:'' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const {
  settings,
  convertCurrency
} = useSettings();

  const generateCode = () => {
    const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    setForm({ ...form, code:Array.from({length:8},()=>chars[Math.floor(Math.random()*chars.length)]).join('') });
  };

  const submit = async () => {
    if (!form.code||!form.discountValue) { toast.warning('Code and value required'); return; }
    setLoading(true);
    try {
      const data = { ...form, discountType, minPurchase };
      if (editing) await api.updateCoupon(coupon._id, data);
      else await api.createCoupon(data);
      toast.success(editing?'Coupon updated':'Coupon created !', { title:'Success' });
      onSaved(); onClose();
    } catch(e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div className="modal" initial={{ opacity:0, scale:0.93, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.93 }} transition={{ type:'spring', stiffness:360, damping:28 }}>
        <div className="modal-header">
          <div><div className="modal-title">{editing?'Edit':'Create'} Coupon</div><div className="modal-sub">Discount code for your customers.</div></div>
          <div className="modal-close" onClick={onClose}><X size={14}/></div>
        </div>
        <div className="grid-2" style={{ gap:13, marginBottom:16 }}>
          <div>
            <label className="input-label">Promo Code *</label>
            <div style={{ display:'flex', gap:8 }}>
              <input className="input-field" placeholder="SUMMER24" value={form.code}
                onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})}
                style={{ flex:1, fontFamily:'monospace', letterSpacing:2, fontWeight:700 }}/>
              <button className="btn btn-secondary btn-sm" onClick={generateCode}>AUTO</button>
            </div>
          </div>
          <div><label className="input-label">Status</label>
            <select className="input-field" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label className="input-label">Discount Type</label>
          <div style={{ display:'flex', background:'var(--bg-base)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', marginBottom:12 }}>
            {['percentage','fixed'].map(t=>(
              <div key={t} onClick={()=>setDiscountType(t)} style={{ flex:1, padding:'10px 0', textAlign:'center', cursor:'pointer', fontSize:13, fontWeight:600, background:discountType===t?'var(--primary)':'transparent', color:discountType===t?'white':'var(--text-secondary)', transition:'all 0.2s' }}>
                {t==='percentage'
  ? 'Percentage (%)'
  : `Fixed Amount (${settings?.currency || 'USD'})`}
              </div>
            ))}
          </div>
          <div className="grid-2" style={{ gap:12 }}>
            <div><label className="input-label">
  Value {
    discountType === 'percentage'
      ? '(%)'
      : `(${settings?.currency || 'USD'})`
  } *
</label><input className="input-field" type="number" min="0" step={discountType==='percentage'?'1':'.01'} value={form.discountValue} onChange={e=>setForm({...form,discountValue:e.target.value})}/></div>
            <div><label className="input-label">Expiry Date *</label><input className="input-field" type="date" value={form.expiresAt} onChange={e=>setForm({...form,expiresAt:e.target.value})}/></div>
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <label className="input-label" style={{ margin:0 }}>Minimum Purchase</label>
            <span style={{ fontSize:13, fontWeight:700, color:'var(--primary-light)' }}>
  {formatCurrency(
    convertCurrency(minPurchase),
    settings?.currency || 'USD'
  )}
</span>
          </div>
          <input type="range" min={0} max={500} value={minPurchase} onChange={e=>setMinPurchase(+e.target.value)} style={{ width:'100%', accentColor:'var(--primary)' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-muted)', marginTop:4 }}>
            {[0,100,200,300,400,500].map(v=>(
  <span key={v}>
    {formatCurrency(
      convertCurrency(v),
      settings?.currency || 'USD'
    )}
  </span>
))}
          </div>
        </div>
        <div className="grid-2 mb-4" style={{ gap:12 }}>
          <div><label className="input-label">Total Usage Limit</label><input className="input-field" placeholder="Unlimited" type="number" min="0" value={form.usageLimit} onChange={e=>setForm({...form,usageLimit:e.target.value})}/></div>
          <div><label className="input-label">Limit per Customer</label><input className="input-field" type="number" min="1" value={form.usageLimitPerCustomer} onChange={e=>setForm({...form,usageLimitPerCustomer:e.target.value})}/></div>
        </div>
        <div className="alert alert-info mb-4"><Zap size={13}/><span><strong>Pro Tip:</strong> Coupons limited to 1 per customer have higher conversion rates.</span></div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading?'⏳...':editing?'Update':'Create Coupon'}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');
  const { toast } = useToast();
  const {
  settings,
  convertCurrency
} = useSettings();

  const load = useCallback(async () => {
    setLoading(true);
    try { setCoupons(await api.getCoupons(search?{search}:{})); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const del = async id => {
    if (!confirm('Delete this coupon?')) return;
    try { await api.deleteCoupon(id); toast.success('Coupon deleted'); load(); }
    catch(e) { toast.error(e.message); }
  };

  const copyCode = code => {
    navigator.clipboard.writeText(code);
    setCopied(code); setTimeout(()=>setCopied(''), 2000);
    toast.info(`Copied: ${code}`, { title:'📋 Copied', duration:2000 });
  };

  const stats = [
    { label:'ACTIVE COUPONS', value:coupons.filter(c=>c.status==='ACTIVE').length },
    {
  label:'TOTAL REVENUE',
  value: formatCurrency(
  convertCurrency(
    coupons.reduce(
      (a, c) => a + (c.revenue || 0),
      0
    )
  ),
  settings?.currency || 'USD'
),
  color:'var(--success)'
},
    { label:'TOTAL USED',     value:coupons.reduce((a,c)=>a+(c.usedCount||0),0) },
    { label:'EXPIRED',        value:coupons.filter(c=>c.status==='EXPIRED').length, color:'var(--danger)' },
  ];

  return (
    <SidebarLayout>
      <Topbar placeholder="Search promo codes..." onSearch={setSearch}/>
      <div className="page-content">
        <div className="section-header animate-fade">
          <div><div className="section-title">Coupons & Promo Codes</div><div className="section-sub">Manage all your discount codes.</div></div>
          <button className="btn btn-primary btn-sm" onClick={()=>{setEditCoupon(null);setShowModal(true);}}><Plus size={13}/> New Coupon</button>
        </div>
        <div className="grid-4 mb-5 animate-fade-d1">
          {stats.map(s=><div key={s.label} className="stat-card"><div className="stat-label">{s.label}</div><div className="stat-value" style={{ color:s.color||'var(--text-primary)' }}>{s.value}</div></div>)}
        </div>
        <div className="card animate-fade-d2">
          {loading ? <div style={{ textAlign:'center', padding:40 }}><RefreshCw size={22} style={{ animation:'spin 1s linear infinite', color:'var(--text-muted)' }}/></div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>CODE</th><th>TYPE</th><th>VALUE</th><th>MIN. PURCHASE</th><th>USED</th><th>REVENUE</th><th>EXPIRY</th><th>STATUS</th><th></th></tr></thead>
                <tbody>
                  {coupons.map(c=>(
                    <tr key={c._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <span className="font-mono" style={{ fontWeight:700, fontSize:13, color:'var(--primary-light)', letterSpacing:1.5 }}>{c.code}</span>
                          <motion.button whileTap={{ scale:0.85 }} onClick={()=>copyCode(c.code)}
                            style={{ background:'none', border:'none', cursor:'pointer', color:copied===c.code?'var(--success)':'var(--text-muted)', padding:2, display:'flex', alignItems:'center', transition:'color 0.2s' }}>
                            <Copy size={12}/>
                          </motion.button>
                          {copied===c.code && <span style={{ fontSize:10, color:'var(--success)', fontWeight:600 }}>Copied!</span>}
                        </div>
                      </td>
                      <td className="text-sm text-muted">{c.discountType==='percentage'?'%':'Fixed'}</td>
                      <td style={{ fontWeight:700, color:'var(--success)' }}>
  {c.discountType === 'percentage'
    ? `${c.discountValue}%`
    : formatCurrency(
  convertCurrency(
    Number(c.discountValue || 0)
  ),
  settings?.currency || 'USD'
)}
</td>
                      <td className="text-sm">
  {c.minPurchase > 0
    ? formatCurrency(
        convertCurrency(c.minPurchase),
        settings?.currency || 'USD'
      )
    : '—'}
</td>
                      <td style={{ fontWeight:600 }}>{c.usedCount}{c.usageLimit?`/${c.usageLimit}`:''}</td>
                      <td style={{ fontWeight:700 }}>
  {c.revenue
    ? formatCurrency(
        convertCurrency(c.revenue),
        settings?.currency || 'USD'
      )
    : '—'}
</td>
                      <td className="text-sm text-muted">{c.expiresAt?new Date(c.expiresAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'—'}</td>
                      <td><span className={`badge ${statusCls(c.status)}`}>{c.status}</span></td>
                      <td><div style={{ display:'flex', gap:4 }}>
                        <button className="btn btn-ghost btn-xs" onClick={()=>{setEditCoupon(c);setShowModal(true);}}><Edit2 size={11}/></button>
                        <button className="btn btn-ghost btn-xs" style={{ color:'var(--danger)' }} onClick={()=>del(c._id)}><Trash2 size={11}/></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {coupons.length===0&&<div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No coupons found</div>}
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>{showModal && <CouponModal coupon={editCoupon} onClose={()=>setShowModal(false)} onSaved={load}/>}</AnimatePresence>
    </SidebarLayout>
  );
}
