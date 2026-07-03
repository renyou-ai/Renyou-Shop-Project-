import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Download, RefreshCw, Edit2, Trash2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SidebarLayout } from '../components/Layouts.jsx';
import Topbar from '../components/Topbar.jsx';
import { api, exportCSV } from '../api.js';
import { useToast } from '../components/Toast.jsx';
import { COUNTRY_NAMES, getFlag } from '../utils/flags.js';
import { useSettings } from '../context/SettingsContext.jsx';
import {
  formatCurrency,
  convertCurrency
} from '../utils/currency';
import { useTranslation } from 'react-i18next';
import { translateCountry } from "../utils/translateCountry";

const loyaltyColor = { Bronze:'#cd7f32', Silver:'#9ea3b0', Gold:'#f59e0b', VIP:'#524E8D' };

function computeAvatar(name) {
  const parts = (name||'').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0]+parts[parts.length-1][0]).toUpperCase();
  return (name||'?').slice(0,2).toUpperCase();
}

function CustomerModal({ customer, onClose, onSaved }) {
  const editing = !!customer;
  const [form, setForm] = useState(customer ? {
    name:customer.name, email:customer.email, phone:customer.phone||'',
    address:customer.address||'', city:customer.city||'', country:customer.country||'Tunisia',
    status:customer.status, loyalty:customer.loyalty, notes:customer.notes||''
  } : { name:'', email:'', phone:'', address:'', city:'', country:'Tunisia', status:'ACTIVE', loyalty:'Bronze', notes:'' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const {
  settings,
  rates
} = useSettings();
const { t } = useTranslation();

  const submit = async () => {
    if (!form.name||!form.email) { toast.warning('Name and email required'); return; }
    setLoading(true);
    try {
      if (editing) await api.updateCustomer(customer._id, form);
      else await api.createCustomer(form);
      toast.success(editing?'Customer updated':'Customer added!', { title:'Success' });
      onSaved(); onClose();
    } catch(e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  // Show preview avatar as name changes
  const previewAvatar = computeAvatar(form.name);

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div className="modal" style={{ maxWidth:520 }}
        initial={{ opacity:0, scale:0.93, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.93 }} transition={{ type:'spring', stiffness:360, damping:28 }}>
        <div className="modal-header">
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,var(--primary),var(--primary-light))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'white' }}>
              {previewAvatar}
            </div>
            <div><div className="modal-title">{editing?'Edit':t('addCustomer')}</div><div className="modal-sub">{t('AvatarAutoSyncsWithName')}</div></div>
          </div>
          <div className="modal-close" onClick={onClose}><X size={14}/></div>
        </div>
        <div className="grid-2" style={{ gap:13, marginBottom:20 }}>
          <div><label className="input-label">{t('full_name')} *</label><input className="input-field" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="First Last"/></div>
          <div><label className="input-label">{t('email')} *</label><input className="input-field" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div><label className="input-label">{t('phone')}</label><input className="input-field" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
          <div><label className="input-label">{t('city')}</label><input className="input-field" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></div>
          <div style={{ gridColumn:'1/-1' }}><label className="input-label">{t('address')}</label><input className="input-field" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div>
          <div>
            <label className="input-label">{t('country')}</label>

<select
  className="input-field"
  value={form.country}
  onChange={e => setForm({ ...form, country: e.target.value })}
>
  {COUNTRY_NAMES.map(c => (
    <option key={c} value={c}>
      {getFlag(c)} {translateCountry(c, t)}
    </option>
  ))}
</select>
          </div>
          <div><label className="input-label">{t('loyalty')}</label>
            <select className="input-field" value={form.loyalty} onChange={e=>setForm({...form,loyalty:e.target.value})}>
              {[t('bronze'),t('silver'),t('gold'),t('vip')].map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
          <div><label className="input-label">{t('status')}</label>
            <select className="input-field" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              <option value="ACTIVE">{t('active')}</option>
              <option value="INACTIVE">{t('inactive')}</option>
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}><label className="input-label">{t('notes')}</label><textarea className="input-field" rows={2} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} style={{resize:'vertical'}}/></div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading?'⏳...':editing?'Update':'➕ Add'}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLoyalty, setFilterLoyalty] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
  settings,
  rates
} = useSettings();
  const { t } = useTranslation();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = { page, limit:12 };
      if (search) p.search = search;
      if (filterStatus) p.status = filterStatus;
      if (filterLoyalty) p.loyalty = filterLoyalty;
      const [c, s] = await Promise.all([api.getCustomers(p), api.getCustomerStats()]);
      setCustomers(c.customers); setTotalPages(c.pages||1); setStats(s);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, filterStatus, filterLoyalty, page]);

  useEffect(() => { setPage(1); }, [search, filterStatus, filterLoyalty]);
  useEffect(() => { load(); }, [load]);

  const del = async id => {
    if (!confirm('Delete this customer?')) return;
    try { await api.deleteCustomer(id); toast.success('Customer deleted'); load(); }
    catch(e) { toast.error(e.message); }
  };

  const handleExport = async () => {
    try {
      const all = await api.getCustomers({ limit:1000 });
      exportCSV('customers.csv', all.customers, ['customerId','name','email','phone','city','country','orders','spent','loyalty','status']);
      toast.success('CSV exported', { title:'📥 Export' });
    } catch(e) { toast.error(e.message); }
  };

  return (
    <SidebarLayout>
      <Topbar
  placeholder={t('searchCustomersPlaceholder')}
  onSearch={v=>{setSearch(v);setPage(1);}}
/>
      <div className="page-content">
        <div className="section-header animate-fade">
          <div><div className="section-title">{t('customersTitle')}</div><div className="section-sub">{t('customersSub')}</div></div>
          <div style={{ display:'flex', gap:9 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleExport}><Download size={13}/> {t('exportCsv')}</button>
            <button className="btn btn-primary btn-sm" onClick={()=>{setEditCustomer(null);setShowModal(true);}}><Plus size={13}/> {t('addCustomer')}</button>
          </div>
        </div>

        <div className="grid-4 mb-5 animate-fade-d1">
          {[
            { label:t('total'),    value:stats.total||0 },
            { label:t('active'),   value:stats.active||0, color:'var(--success)' },
            { label:t('vip'),      value:stats.vip||0,    color:'var(--primary-light)' },
            {
  label:t('avgSpend'),
  value: formatCurrency(
  convertCurrency(
    stats.avgSpent || 0,
    settings?.baseCurrency || 'USD',
    settings?.currency || 'USD',
    rates
  ),
  settings?.currency || 'USD',
  settings?.locale || 'en-US'
),
  color:'var(--info)'
},
          ].map(s=>(
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color:s.color||'var(--text-primary)' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="card mb-4 animate-fade-d1" style={{ padding:'11px 15px' }}>
          <div style={{ display:'flex', gap:7, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600 }}>{t('status')}:</span>
            {[t(''),t('active'),t('inactive')].map(s=><button key={s} className={`btn btn-sm ${filterStatus===s?'btn-primary':'btn-ghost'}`} onClick={()=>setFilterStatus(s)}>{s||t('all')}</button>)}
            <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, marginLeft:8 }}>{t('loyalty')}:</span>
            {['',t('bronze'),t('silver'),t('gold'),t('vip')].map(l=><button key={l} className={`btn btn-sm ${filterLoyalty===l?'btn-primary':'btn-ghost'}`} onClick={()=>setFilterLoyalty(l)}>{l||t('all')}</button>)}
          </div>
        </div>

        <div className="card animate-fade-d2">
          {loading ? (
            <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>
              <RefreshCw size={24} style={{ animation:'spin 1s linear infinite', display:'block', margin:'0 auto 8px' }}/>
            </div>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>{t('customer')}</th><th>{t('customerId')}</th><th>{t('orders')}</th><th>{t('spent')}</th><th>{t('country')}</th><th>{t('loyalty')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c._id}>
<td>
  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
    <div
      style={{
        width:36,
        height:36,
        borderRadius:'50%',
        background:'linear-gradient(135deg,var(--primary),var(--primary-light))',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        color:'white',
        fontWeight:700
      }}
    >
      {computeAvatar(c.name)}
    </div>

    <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  }}
>
  <div style={{ fontWeight: 700 }}>
    {c.name}
  </div>

  <div
    style={{
      fontSize: 12,
      color: 'var(--text-muted)'
    }}
  >
    {c.email}
  </div>
</div>
  </div>
</td>
                        <td><span className="font-mono text-xs" style={{ color:'var(--primary-light)' }}>{c.customerId}</span></td>
                        <td style={{ fontWeight:700 }}>{c.orders}</td>
                        <td style={{ fontWeight:700 }}>
  {formatCurrency(
  convertCurrency(
    c.spent || 0,
    settings?.baseCurrency || 'USD',
    settings?.currency || 'USD',
    rates
  ),
  settings?.currency || 'USD',
  settings?.locale || 'en-US'
)}
</td>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13 }}>
                            <span style={{ fontSize:18 }}>{getFlag(c.country)}</span>
                            <span style={{ fontSize:12, color:'var(--text-muted)' }}>{translateCountry(c.country, t)}</span>
                          </div>
                        </td>
                        <td><span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:`${loyaltyColor[c.loyalty]}22`, color:loyaltyColor[c.loyalty] }}>{c.loyalty}</span></td>
                        <td><span className={`badge ${c.status==='ACTIVE'?'badge-active':'badge-inactive'}`}>{c.status}</span></td>
                        <td>
                          <div style={{ display:'flex', gap:4 }}>
                            <button className="btn btn-ghost btn-xs" onClick={()=>navigate(`/customers/${c._id}`)}><Eye size={11}/></button>
                            <button className="btn btn-ghost btn-xs" onClick={()=>{setEditCustomer(c);setShowModal(true);}}><Edit2 size={11}/></button>
                            <button className="btn btn-ghost btn-xs" style={{ color:'var(--danger)' }} onClick={()=>del(c._id)}><Trash2 size={11}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {customers.length===0 && <div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No customers found</div>}
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>‹</button>
                  {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1).map((p,i,arr)=>(
                    <React.Fragment key={p}>
                      {i>0&&arr[i-1]!==p-1&&<span style={{ padding:'0 4px', color:'var(--text-muted)' }}>…</span>}
                      <button className={`page-btn ${p===page?'active':''}`} onClick={()=>setPage(p)}>{p}</button>
                    </React.Fragment>
                  ))}
                  <button className="page-btn" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>›</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <AnimatePresence>{showModal && <CustomerModal customer={editCustomer} onClose={()=>setShowModal(false)} onSaved={load}/>}</AnimatePresence>
    </SidebarLayout>
  );
}
