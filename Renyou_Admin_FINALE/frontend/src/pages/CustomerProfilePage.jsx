import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, RefreshCw } from 'lucide-react';
import { SidebarLayout } from '../components/Layouts.jsx';
import Topbar from '../components/Topbar.jsx';
import { api } from '../api.js';
import { getFlag } from '../utils/flags.js';
import { useSettings } from '../context/SettingsContext.jsx';
import {
  formatCurrency,
  convertCurrency
} from '../utils/currency';
import { useTranslation } from 'react-i18next';

const loyaltyColor = { Bronze:'#cd7f32', Silver:'#9ea3b0', Gold:'#f59e0b', VIP:'#524E8D' };
const statusCls = s => ({PENDING:'badge-pending',PROCESSING:'badge-processing',SHIPPED:'badge-shipped',COMPLETED:'badge-completed',CANCELLED:'badge-cancelled'}[s]||'badge-pending');

function computeAvatar(name) {
  const parts = (name||'').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0]+parts[parts.length-1][0]).toUpperCase();
  return (name||'?').slice(0,2).toUpperCase();
}

export default function CustomerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
  settings,
  rates
} = useSettings();
  const { t } = useTranslation();

  useEffect(() => {
    api.getCustomer(id).then(setData).catch(()=>setData(null)).finally(()=>setLoading(false));
  }, [id]);

  if (loading) return (
    <SidebarLayout><div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'80vh' }}>
      <RefreshCw size={28} style={{ animation:'spin 1s linear infinite', color:'var(--text-muted)' }}/>
    </div></SidebarLayout>
  );
  if (!data) return (
    <SidebarLayout><div style={{ padding:40 }}>
      <div style={{ fontWeight:700, fontSize:18, color:'var(--text-primary)' }}>Customer not found</div>
      <button className="btn btn-ghost btn-sm" onClick={()=>navigate('/customers')} style={{ marginTop:16 }}><ArrowLeft size={14}/> Back</button>
    </div></SidebarLayout>
  );

  const c = data;
  const orders = data.orderHistory||[];
  const avatarText = c.avatar || computeAvatar(c.name);

  return (
    <SidebarLayout>
      <Topbar/>
      <div className="page-content">
        <div className="section-header animate-fade">
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="btn btn-ghost btn-sm" onClick={()=>navigate('/customers')} style={{ padding:'6px 10px' }}><ArrowLeft size={14}/></button>
            <div><div className="section-title">{t('customerProfile')}</div><div className="section-sub">{c.customerId}</div></div>
          </div>
        </div>
        <div className="grid-2 animate-fade-d1" style={{ gridTemplateColumns:'1fr 2fr', alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ textAlign:'center' }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,var(--primary),var(--primary-light))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:'white', margin:'0 auto 12px', boxShadow:'0 6px 20px var(--primary-glow)' }}>{avatarText}</div>
              <div style={{ fontWeight:800, fontSize:16, color:'var(--text-primary)' }}>{c.name}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:10 }}>{c.customerId}</div>
              <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:16, flexWrap:'wrap' }}>
                <span className={`badge ${c.status==='ACTIVE'?'badge-active':'badge-inactive'}`}>{t(c.status)}</span>
                <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:`${loyaltyColor[c.loyalty]||'#ccc'}22`, color:loyaltyColor[c.loyalty]||'#999' }}>⭐ {c.loyalty}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:12.5, textAlign:'left' }}>
                {c.email&&<div style={{ display:'flex', gap:8, alignItems:'center', color:'var(--text-secondary)' }}><Mail size={12}/>{c.email}</div>}
                {c.phone&&<div style={{ display:'flex', gap:8, alignItems:'center', color:'var(--text-secondary)' }}><Phone size={12}/>{c.phone}</div>}
                {(c.city||c.address)&&<div style={{ display:'flex', gap:8, alignItems:'flex-start', color:'var(--text-secondary)' }}>
                  <MapPin size={12} style={{ marginTop:2, flexShrink:0 }}/>
                  <span style={{ fontSize:18 }}>{getFlag(c.country)}</span>
                  {[c.address,c.city,c.country].filter(Boolean).join(', ')}
                </div>}
                {c.createdAt&&<div style={{ display:'flex', gap:8, alignItems:'center', color:'var(--text-secondary)' }}>
                  <Calendar size={12}/> {t('customerSince')} {new Date(c.createdAt).toLocaleDateString('en-US',{month:'long',year:'numeric'})}
                </div>}
              </div>
            </div>
            <div className="card">
              <div style={{ fontWeight:700, fontSize:13, marginBottom:14, color:'var(--text-primary)' }}>{t('stats')}</div>
              {[
                { label:t('totalOrders'), value:c.orders },
                {
  label:t('totalSpent'),
  value: formatCurrency(
  convertCurrency(
    c.spent || 0,
    settings?.baseCurrency || 'USD',
    settings?.currency || 'USD',
    rates
  ),
  settings?.currency || 'USD'
)
},
{
  label:t('avgOrder'),
  value: formatCurrency(
  convertCurrency(
    c.orders ? (c.spent / c.orders) : 0,
    settings?.baseCurrency || 'USD',
    settings?.currency || 'USD',
    rates
  ),
  settings?.currency || 'USD'
)
},
                { label:t('lastPurchase'),value:c.lastPurchase?new Date(c.lastPurchase).toLocaleDateString('en-US'):'—' },
              ].map(stat=>(
                <div key={stat.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border-light)', fontSize:13 }}>
                  <span style={{ color:'var(--text-muted)' }}>{stat.label}</span>
                  <span style={{ fontWeight:700, color:'var(--text-primary)' }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card animate-fade-d2">
              <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:'var(--text-primary)' }}>{t('orderHistory')}</div>
              {orders.length===0 ? <div style={{ textAlign:'center', padding:24, color:'var(--text-muted)', fontSize:13 }}>{t('noOrdersYet')}</div> : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>{t('orderId')}</th><th>{t('date')}</th><th>{t('amount')}</th><th>{t('status')}</th></tr></thead>
                    <tbody>
                      {orders.map(o=>(
                        <tr key={o._id}>
                          <td><span className="font-mono text-xs" style={{ color:'var(--primary-light)' }}>{o.orderId}</span></td>
                          <td className="text-sm text-muted">{new Date(o.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                          <td style={{ fontWeight:700 }}>
  {formatCurrency(
  convertCurrency(
    o.total || 0,
    settings?.baseCurrency || 'USD',
    settings?.currency || 'USD',
    rates
  ),
  settings?.currency || 'USD'
)}
</td>
                          <td><span className={`badge ${statusCls(o.status)}`}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {(data.recommendedProducts || []).length > 0 && (
  <div className="card animate-fade-d3">
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
      <div style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)' }}>
        {t('aiSuggestedProducts')}
      </div>

      <span
        style={{
          padding:'2px 8px',
          background:'linear-gradient(135deg,var(--primary),var(--primary-light))',
          color:'white',
          borderRadius:6,
          fontSize:10,
          fontWeight:700
        }}
      >
        AI
      </span>
    </div>

    {data.recommendedProducts.map((p,i)=>(
      <div
        key={i}
        style={{
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          padding:'10px 13px',
          background:'var(--bg-base)',
          borderRadius:10,
          border:'1px solid var(--border-light)',
          marginBottom:8
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img
            src={p.image}
            alt={p.name}
            style={{
              width:36,
              height:36,
              borderRadius:8,
              objectFit:'cover'
            }}
          />

          <div>
            <div style={{ fontWeight:600, fontSize:13, color:'var(--text-primary)' }}>
              {p.name}
            </div>

            <div style={{ fontSize:11, color:'var(--text-muted)' }}>
              {p.category}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
