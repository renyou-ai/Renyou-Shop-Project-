import React, { useState, useEffect, useCallback } from 'react';
import { X, MapPin, Mail, Download, RefreshCw, Printer,
 Plus, Trash2, Edit2, UserCog, UserRound,
CircleUserRound,
User,
Shield,
Crown,
Heart,
Star,
Flame,
Sparkles,
Ghost,

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
Leaf  
 } from 'lucide-react';
import { DashboardLayout } from '../components/Layouts.jsx';
import Topbar from '../components/Topbar.jsx';
import { api, exportCSV } from '../api.js';
import { useToast } from '../components/Toast.jsx';
import {
  formatCurrency,
  convertCurrency
} from '../utils/currency';
import { useSettings } from '../context/SettingsContext.jsx';

const statusTabs = ['Toutes','PENDING','PROCESSING','SHIPPED','COMPLETED','CANCELLED'];
const statusCls = s => ({PENDING:'badge-pending',PROCESSING:'badge-processing',SHIPPED:'badge-shipped',COMPLETED:'badge-completed',CANCELLED:'badge-cancelled',RETURNED:'badge-inactive'}[s]||'badge-pending');

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
  Leaf,
};

function DetailPanel({
  order,
  onClose,
  onStatusChange,
  currency,
  closing
}) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { settings, rates } = useSettings();

  const save = async () => {
    setSaving(true);
    try { await api.updateOrder(order._id, { status:newStatus }); toast.success(`Statut mis à jour: ${newStatus}`, { title:order.orderId }); onStatusChange(); }
    catch(e){ toast.error(e.message); }
    finally { setSaving(false); }
  };

  const printInvoice = () => {
    const w = window.open('','_blank');
    w.document.write(`
      <html><head><title>Facture ${order.orderId}</title>
      <style>body{font-family:Inter,sans-serif;padding:40px;color:#1F1B3A;max-width:600px;margin:0 auto}h1{font-size:22px;margin-bottom:4px}h2{font-size:14px;color:#8B87A8;font-weight:500;margin-bottom:28px}table{width:100%;border-collapse:collapse;margin:20px 0}th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#8B87A8;padding:8px 0;border-bottom:1px solid #eee}td{padding:10px 0;border-bottom:1px solid #f5f5f5;font-size:13.5px}.total{font-size:17px;font-weight:800;color:#524E8D}.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(34,197,94,0.12);color:#16a34a}</style>
      </head><body>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px">
        <div><h1>💜 Renyou Shop</h1><div style="font-size:12px;color:#8B87A8">Facture Officielle</div></div>
        <div style="text-align:right"><div style="font-size:20px;font-weight:800;color:#524E8D">${order.orderId}</div><div style="font-size:12px;color:#8B87A8">${new Date(order.date).toLocaleDateString('fr-FR')}</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px">
        <div><div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#8B87A8;margin-bottom:6px">FACTURÉ À</div><div style="font-weight:600">${order.customerName}</div><div style="font-size:13px;color:#5E5A86">${order.customerEmail||''}</div>${order.shippingAddress?`<div style="font-size:12px;color:#8B87A8;margin-top:4px">${order.shippingAddress}</div>`:''}</div>
        <div><div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#8B87A8;margin-bottom:6px">STATUT</div><span class="badge">${order.status}</span><div style="font-size:12px;color:#8B87A8;margin-top:8px">Paiement: ${order.paymentMethod||'Carte'}</div></div>
      </div>
      <table><thead><tr><th>PRODUIT</th><th>QTÉ</th><th>PRIX UNIT.</th><th>TOTAL</th></tr></thead><tbody>
      ${(order.items||[]).map(item=>`<tr><td>${item.productName}</td><td>${item.quantity}</td><td>${item.price?.toFixed(2)}</td><td><strong>${(item.price*item.quantity).toFixed(2)}</strong></td></tr>`).join('')}
      </tbody></table>
      <div style="display:flex;justify-content:flex-end"><div style="width:240px"><div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13.5px"><span style="color:#8B87A8">Sous-total</span><span>
  ${formatCurrency(order.total || 0, currency)}
</span></div><div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13.5px"><span style="color:#8B87A8">Livraison</span><span style="color:#22c55e">Gratuit</span></div><div style="display:flex;justify-content:space-between;padding:12px 0;border-top:2px solid #eee;font-size:17px;font-weight:800"><span>TOTAL</span><span class="total">
  ${formatCurrency(order.total || 0, currency)}
</span></div></div></div>
      <div style="text-align:center;margin-top:40px;font-size:12px;color:#8B87A8">Merci pour votre commande — support@renyou.com</div>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
  <div
    className={`order-detail-panel ${closing ? 'closing' : ''}`}
    style={{
      width:420,
      position:'fixed',
      right:0,
      top:0,
      bottom:0,
      zIndex:1000,
      flexShrink:0,
      display:'flex',
      flexDirection:'column',
      overflow:'auto'
    }}
  >
      <div style={{ padding:'15px 17px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(135deg,#524E8D,#6B66B5)' }}>
        <div>
          <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:.5 }}>Détails Commande</div>
          <div style={{ fontWeight:800, fontSize:15, color:'white' }}>{order.orderId}</div>
        </div>
        <div onClick={onClose} style={{ cursor:'pointer', color:'rgba(255,255,255,0.7)', width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={14}/></div>
      </div>

      <div style={{ padding:17, flex:1, display:'flex', flexDirection:'column', gap:17 }}>
        <div>
          <div style={{ fontSize:10.5, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:.5, marginBottom:10 }}>CLIENT</div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
<div className="avatar">
  {(() => {
    if (!order.customerAvatar) {
      return (
        order.customerName
          ?.split(' ')
          .map(n => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || '?'
      );
    }

    if (
      order.customerAvatar.startsWith('/uploads') ||
      order.customerAvatar.startsWith('http')
    ) {
      return (
        <img
          src={
            order.customerAvatar.startsWith('/uploads')
              ? `http://localhost:5001${order.customerAvatar}`
              : order.customerAvatar
          }
          alt={order.customerName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      );
    }

    const Icon = AvatarIcons[order.customerAvatar];

    if (Icon) {
      return <Icon size={22} />;
    }

    return order.customerAvatar;
  })()}
</div>
            <div><div style={{ fontWeight:700, fontSize:13.5 }}>{order.customerName}</div></div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:5, fontSize:12 }}>
            {order.customerEmail && <div style={{ display:'flex', gap:7, alignItems:'center', color:'var(--text-secondary)' }}><Mail size={11}/>{order.customerEmail}</div>}
            {order.shippingAddress && <div style={{ display:'flex', gap:7, alignItems:'flex-start', color:'var(--text-secondary)' }}><MapPin size={11} style={{marginTop:2,flexShrink:0}}/>{order.shippingAddress}</div>}
          </div>
        </div>

        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ fontSize:10.5, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:.5 }}>ARTICLES</div>
            <span className="badge badge-active" style={{ fontSize:10 }}>{order.items?.length||0} items</span>
          </div>
          {order.items?.map((item,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border-light)', fontSize:12.5 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:7, background:'var(--primary-glow)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🧴</div>
                <div><div style={{ fontWeight:600 }}>{item.productName}</div><div style={{ fontSize:11, color:'var(--text-muted)' }}>x{item.quantity}</div></div>
              </div>
              <span style={{ fontWeight:700 }}>
  {formatCurrency(
    item.price * item.quantity,
    currency
  )}
</span>
            </div>
          ))}
        </div>

        <div style={{ background:'var(--bg-base)', borderRadius:10, padding:13 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5, marginBottom:6 }}><span style={{ color:'var(--text-muted)' }}>Sous-total</span><span>
  {formatCurrency(order.total || 0, currency)}
</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5, marginBottom:10 }}><span style={{ color:'var(--text-muted)' }}>Livraison</span><span style={{ color:'var(--success)' }}>Gratuit</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:15.5, paddingTop:10, borderTop:'1px solid var(--border)' }}><span>Total</span><span style={{ color:'var(--primary)' }}>
  {formatCurrency(order.total || 0, currency)}
</span></div>
        </div>

        <div>
          <label className="input-label">Mettre à jour le statut</label>
          <div style={{ display:'flex', gap:8 }}>
            <select className="input-field" value={newStatus} onChange={e=>setNewStatus(e.target.value)} style={{ flex:1 }}>
              {['PENDING','PROCESSING','SHIPPED','COMPLETED','CANCELLED'].map(s=><option key={s}>{s}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving||newStatus===order.status}>{saving?'⏳':'✓'}</button>
          </div>
        </div>

        <button className="btn btn-secondary" style={{ width:'100%', justifyContent:'center' }} onClick={printInvoice}><Printer size={13}/> Imprimer Facture</button>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Toutes');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { settings, rates } = useSettings();
  const { toast } = useToast();
  const [closing, setClosing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = { page, limit:15 };
      if (search) p.search = search;
      if (activeTab !== 'Toutes') p.status = activeTab;
      const [o, s] = await Promise.all([api.getOrders(p), api.getOrderStats()]);
      setOrders(o.orders); setTotalPages(o.pages||1); setStats(s);
      if (selectedOrder) {
        const upd = o.orders.find(x=>x._id===selectedOrder._id);
        if (upd) setSelectedOrder(upd);
      }
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }, [search, activeTab, page]);

  useEffect(() => { setPage(1); }, [search, activeTab]);
  useEffect(() => { load(); }, [load]);

  const handleExport = async () => {
    try {
      const all = await api.getOrders({ limit:1000 });
      exportCSV('orders.csv', all.orders, ['orderId','customerName','customerEmail','total','status','date']);
      toast.success('Export CSV téléchargé', { title:'📥 Export' });
    } catch(e){ toast.error(e.message); }
  };

  const handleClose = () => {
  setClosing(true);

  setTimeout(() => {
    setSelectedOrder(null);
    setClosing(false);
  }, 280);
};

  return (
    <DashboardLayout>
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <Topbar placeholder="Search orders, customers..." onSearch={v=>{setSearch(v);setPage(1);}}/>
        <div style={{ flex:1, overflow:'hidden', display:'flex' }}>
          <div className="page-content" style={{ flex:1, overflow:'auto' }}>
            <div className="section-header animate-fade">
              <div><div className="section-title">Orders</div><div className="section-sub">Consultez et gérez les commandes.</div></div>
              <button className="btn btn-secondary btn-sm" onClick={handleExport}><Download size={13}/> Export CSV</button>
            </div>

            <div className="grid-4 mb-5 animate-fade-d1">
              {[
                { label:'TOTAL',         value:stats.total||0 },
                { label:'EN ATTENTE',    value:stats.pending||0,      color:'var(--warning)' },
                { label:'EN TRAITEMENT', value:stats.processing||0,   color:'var(--info)' },
                { label:'REVENU 30J',    value: formatCurrency(
  convertCurrency(
    stats.revenue30d || 0,
    'USD',
    settings?.currency || 'USD',
    rates
  ),
  settings?.currency || 'USD',
  settings?.locale || 'en-US'
), color:'var(--success)' },
              ].map(s=>(
                <div key={s.label} className="stat-card">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ color:s.color||'var(--text-primary)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="card animate-fade-d2">
              <div style={{ display:'flex', gap:4, marginBottom:18, borderBottom:'1px solid var(--border)', paddingBottom:14, flexWrap:'wrap' }}>
                {statusTabs.map(t=>(
                  <button key={t} className={`btn btn-sm ${activeTab===t?'btn-primary':'btn-ghost'}`} style={{ border:'none' }} onClick={()=>setActiveTab(t)}>{t}</button>
                ))}
              </div>

              {loading ? (
                <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}><RefreshCw size={24} style={{ animation:'spin 1s linear infinite', display:'block', margin:'0 auto 8px' }}/> Loading...</div>
              ) : (
                <>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>ID</th><th>CLIENT</th><th>ARTICLES</th><th>TOTAL</th><th>STATUT</th><th>DATE</th></tr></thead>
                    <tbody>
                      {orders.map(o=>(
                        console.log("ITEM 0 =", o.items?.[0]),
                        <tr key={o._id} style={{ cursor:'pointer', background:selectedOrder?._id===o._id?'var(--bg-hover)':'' }} onClick={() => {
  if (selectedOrder?._id === o._id) {
    handleClose();
  } else {
    setSelectedOrder(o);
  }
}}>
                          <td><span className="font-mono text-xs" style={{ color:'var(--primary-light)' }}>{o.orderId}</span></td>
                          <td><div style={{ display:'flex', alignItems:'center', gap:9 }}><div className="avatar">
  {(() => {
    if (!o.customerAvatar) {
      return (
        o.customerName
          ?.split(' ')
          .map(n => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || '?'
      );
    }

    if (
      o.customerAvatar.startsWith('/uploads') ||
      o.customerAvatar.startsWith('http')
    ) {
      return (
        <img
          src={
            o.customerAvatar.startsWith('/uploads')
              ? `http://localhost:5001${o.customerAvatar}`
              : o.customerAvatar
          }
          alt={o.customerName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      );
    }

    const Icon = AvatarIcons[o.customerAvatar];

    if (Icon) {
      return <Icon size={22} />;
    }

    return o.customerAvatar;
  })()}
</div><div><div style={{ fontWeight:600, fontSize:13 }}>{o.customerName}</div><div style={{ fontSize:11, color:'var(--text-muted)' }}>{o.customerEmail}</div></div></div></td>
                          <td className="text-sm text-muted">{(o.items||[]).map(i=>i.productName).slice(0,2).join(', ')}{(o.items||[]).length>2?'…':''}</td>
                          <td style={{ fontWeight:700 }}>
  {formatCurrency(
  convertCurrency(
    o.total || 0,
    'USD',
    settings?.currency || 'USD',
    rates
  ),
  settings?.currency || 'USD',
  settings?.locale || 'en-US'
)}
</td>
                          <td><span className={`badge ${statusCls(o.status)}`}>{o.status}</span></td>
                          <td className="text-sm text-muted">{new Date(o.date).toLocaleDateString('fr-FR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length===0 && <div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>Aucune commande trouvée</div>}
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
          {selectedOrder && (
  <>
    <div
      className="order-detail-backdrop"
      onClick={handleClose}
    />

    <DetailPanel
      order={selectedOrder}
      onClose={handleClose}
      onStatusChange={load}
      currency={settings?.currency || 'USD'}
      closing={closing}
    />
  </>
)}
        </div>
      </div>
    </DashboardLayout>
  );
}
