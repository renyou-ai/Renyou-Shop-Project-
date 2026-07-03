  import React, { useState, useEffect, useCallback } from 'react';
  import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
  import { TrendingUp, ShoppingCart, Package, Brain, RefreshCw, ArrowRight, AlertTriangle, AlertCircle, DollarSign, FileText, X } from 'lucide-react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { DashboardLayout } from '../components/Layouts.jsx';
  import Topbar from '../components/Topbar.jsx';
  import { api } from '../api.js';
  import { useNavigate } from 'react-router-dom';
  import { useMemo } from 'react';
  import { useSettings } from '../context/SettingsContext';
  import {
  formatCurrency,
  convertCurrency
} from '../utils/currency';
import { useTranslation } from 'react-i18next';
import { useThemeValue } from "@shared/theme";

  const BAR_COLORS = ['#524E8D','#6B66B5','#7C78C0','#8B86CF','#9D99D8','#524E8D','#6B66B5'];
  const PERIODS = [
    { key:'7j',  label:'7D'  },
    { key:'30j', label:'30D' },
    { key:'90j', label:'90D' },
    { key:'6m',  label:'6M'  },
    { key:'1an', label:'1Y'  },
  ];

  const getBarSize = (len) => {
    if (len <= 3) return 40;
    if (len <= 6) return 28;
    if (len <= 10) return 18;
    return 12;
  };

const AreaTooltip = ({
  active,
  payload,
  label,
  currency,
  baseCurrency,
  rates
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background:'var(--bg-card)',
        border:'1px solid var(--border)',
        borderRadius:10,
        padding:'10px 14px',
        fontSize:12.5,
        boxShadow:'0 4px 16px rgba(0,0,0,0.12)'
      }}
    >
      <div
        style={{
          color:'var(--text-muted)',
          marginBottom:4,
          fontWeight:600,
          fontSize:11
        }}
      >
        {label}
      </div>

      <div
        style={{
          color:'var(--primary)',
          fontWeight:800,
          fontSize:14
        }}
      >
        {formatCurrency(
  Number(payload[0]?.value || 0),
  currency || 'USD'
)}
      </div>
    </div>
  );
};

  const BarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 14px', fontSize:12.5, boxShadow:'0 4px 16px rgba(0,0,0,0.12)' }}>
        <div style={{ color:'var(--text-muted)', marginBottom:4, fontWeight:600, fontSize:11 }}>{label}</div>
        <div style={{ color:'var(--primary)', fontWeight:800 }}>{payload[0]?.value||0}%</div>
      </div>
    );
  };

  const PeriodSelector = ({ value, onChange, t }) => (
    <div style={{ display:'flex', gap:2, background:'var(--bg-base)', borderRadius:8, padding:2, border:'1px solid var(--border)' }}>
      {PERIODS.map(p => (
        <div key={p.key} onClick={() => onChange(p.key)}
          style={{ padding:'4px 10px', borderRadius:6, fontSize:11.5, fontWeight:600, cursor:'pointer', transition:'all 0.18s', background:value===p.key?'var(--primary)':'transparent', color:value===p.key?'white':'var(--text-muted)', userSelect:'none' }}>
          {t(p.label)}
        </div>
      ))}
    </div>
  );


  function StockAlertModal({ alerts, onClose, t }) {
    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div className="modal" style={{ maxWidth:700 }}
          initial={{ opacity:0, scale:0.93, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
          exit={{ opacity:0, scale:0.93 }} transition={{ type:'spring', stiffness:360, damping:28 }}>
          <div className="modal-header">
            <div>
              <div className="modal-title">{t('inventoryReport')} — {t('stockAlerts')}</div>
              <div className="modal-sub">{t('generated')} {new Date().toLocaleDateString('en-US',{day:'2-digit',month:'long',year:'numeric'})}</div>
            </div>
            <div className="modal-close" onClick={onClose}><X size={14}/></div>
          </div>
          <div style={{ display:'flex', gap:12, marginBottom:20 }}>
            {[
              { label:t('outOfStock'), count:alerts.filter(a=>a.stockStatus==='OUT_OF_STOCK').length, color:'var(--danger)' },
              { label:t('lowStock'),    count:alerts.filter(a=>a.stockStatus==='LOW_STOCK').length,    color:'var(--warning)' },
              { label:t('totalAlerts'), count:alerts.length,                                            color:'var(--primary-light)' },
            ].map(s=>(
              <div key={s.label} style={{ flex:1, background:'var(--bg-base)', borderRadius:12, padding:'14px 16px', border:`1px solid ${s.color}33` }}>
                <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:.8 }}>{s.label}</div>
                <div style={{ fontSize:28, fontWeight:800, color:s.color }}>{s.count}</div>
              </div>
            ))}
          </div>
          <div className="table-wrap" style={{ maxHeight:360, overflowY:'auto' }}>
            <table>
              <thead><tr><th>{t('product')}</th><th>{t('sku')}</th><th>{t('stock')}</th><th>{t('maxStock')}</th><th>{t('status')}</th><th>{t('supplier')}</th></tr></thead>
              <tbody>
                {alerts.map(item=>(
                  <tr key={item._id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
  <div
    style={{
      width:42,
      height:42,
      borderRadius:8,
      overflow:'hidden',
      border:'1px solid var(--border)',
      background:'white',
      flexShrink:0
    }}
  >
    {item.image ? (
      <img
        src={item.image}
        alt={item.name}
        style={{
          width:'100%',
          height:'100%',
          objectFit:'cover'
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
        {item.category?.icon || '📦'}
      </div>
    )}
  </div>
                        <div>
                          <div style={{ fontWeight:600, fontSize:13 }}>{item.name}</div>
                          <div style={{ fontSize:11, color:'var(--text-muted)' }}>{item.category?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="font-mono text-xs">{item.sku}</span></td>
                    <td style={{ fontWeight:800, color:item.stockStatus==='OUT_OF_STOCK'?'var(--danger)':'var(--warning)', fontSize:16 }}>{item.stock}</td>
                    <td className="text-muted text-sm">{item.maxStock}</td>
                    <td>
                      {item.stockStatus==='OUT_OF_STOCK'
                        ? <span className="badge badge-out-of-stock">{t('outOfStock')}</span>
                        : <span className="badge badge-low-stock">{t('lowStock')}</span>}
                    </td>
                    <td className="text-sm text-muted">{item.supplier||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {alerts.length===0 && (
              <div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>
                <span style={{ fontSize:32 }}>✅</span>
                <div style={{ marginTop:8 }}>{t('noStockAlerts')}</div>
              </div>
            )}
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:16 }}>
            <button className="btn btn-ghost" onClick={onClose}>{t('close')}</button>
            <button className="btn btn-primary" onClick={()=>window.print()}>{t('printReport')}</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const statusCls = s => ({PENDING:'badge-pending',PROCESSING:'badge-processing',SHIPPED:'badge-shipped',COMPLETED:'badge-completed',CANCELLED:'badge-cancelled'}[s]||'badge-pending');

  export default function DashboardPage() {
    const navigate = useNavigate();
    const {
  settings,
  rates
} = useSettings();
    const [stats, setStats] = useState({ revenue:0, orders:0, products:0, aiAnalyses:89 });
    const [revenueData, setRevenueData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [stockAlerts, setStockAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [revPeriod, setRevPeriod] = useState('7j');
    const [catPeriod, setCatPeriod] = useState('7j');
    const [showAlertModal, setShowAlertModal] = useState(false);
    const { t, i18n } = useTranslation();
    
const { theme, setAppTheme, restoreTheme } = useThemeValue();

console.log("Admin Theme:", theme);

    const isRTL = i18n.language === 'ar';

    const barSize = useMemo(() => {
    const len = categoryData?.length || 0;
    if (len <= 3) return 40;
    if (len <= 6) return 28;
    if (len <= 10) return 18;
    return 12;
  }, [categoryData]);

    const load = useCallback(async (animated = false) => {
      if (animated) setRefreshKey(k => k+1);
      setLoading(true);
      try {
        const [s, rev, cat, orders, alerts] = await Promise.all([
          api.dashboardStats(),
          api.revenueChart(revPeriod),
          api.categorySales(catPeriod),
          api.recentOrders(),
          api.stockAlerts(),
        ]);
        console.log('PERIOD:', revPeriod);
        console.log('REVENUE RAW:', rev);
        setStats({ ...s, aiAnalyses:89 });

const monthMap = {
  Jan: t('january'),
  Feb: t('february'),
  Mar: t('march'),
  Apr: t('april'),
  May: t('may'),
  Jun: t('june')
};

        setRevenueData(
  rev.map(item => {
    let formattedDay = item.day;

    if (
      item.day &&
      item.day.includes('/') &&
      !item.day.startsWith('W')
    ) {
      const [day, month] = item.day.split('/');

      formattedDay = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
    }

    return {
      ...item,

      day: item.day?.startsWith('W')
        ? `${t('week')} ${item.day.replace('W', '')}`
        : monthMap[item.day] || formattedDay,

      revenue: convertCurrency(
        item.revenue || 0,
        settings?.baseCurrency || 'USD',
        settings?.currency || 'USD',
        rates
    )
  }
  })
);

setCategoryData(
  cat.map(item => ({
    ...item,
    name: t(item.name.toLowerCase())
  }))
);

        setRecentOrders(orders);
        setStockAlerts(alerts);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }, [revPeriod, catPeriod, settings?.baseCurrency, settings?.currency, rates]);

    useEffect(() => { load(); }, [load]);

    const statCards = [
      { label:t('totalRevenue'),    value: formatCurrency(
  convertCurrency(
    stats.revenue || 0,
    settings?.baseCurrency || 'USD',
    settings?.currency || 'USD',
    rates
  ),
  settings?.currency || 'USD'
), icon:DollarSign, change:'+12.5%', up:true,    iconBg:'rgba(82,78,141,0.12)',   iconColor:'var(--primary-light)' },
      { label:t('totalOrders'),     value:(stats.orders||0).toLocaleString('en-US'),                                   icon:ShoppingCart, change:'+2.1%', up:true,  iconBg:'rgba(59,130,246,0.1)',   iconColor:'#3b82f6'               },
      { label:t('activeProducts'),  value:(stats.products||0).toLocaleString('en-US'),                                 icon:Package, change:'-1.2%', up:false,       iconBg:'rgba(245,158,11,0.1)',   iconColor:'#f59e0b'               },
      { label:t('aiAnalyses'), value:(stats.aiAnalyses||89).toLocaleString('en-US'),                              icon:Brain, change:'+5.7%', up:true,           iconBg:'rgba(168,85,247,0.1)',  iconColor:'#9333ea'               },
    ];

    return (
      <DashboardLayout>
        <Topbar placeholder={t('searchTopbar')} />
        <div className="page-content">
          <div className="section-header animate-fade">
            <div>
              <div className="section-title">{t('dashboard')}</div>
              <div className="section-sub">{t('dashboardWelcome')}</div>
            </div>
            <motion.button className="btn btn-secondary btn-sm" onClick={() => load(true)} disabled={loading} whileTap={{ scale:0.95 }}>
              <motion.div animate={{ rotate: loading ? 360 : 0 }} transition={{ duration:0.7, repeat: loading ? Infinity : 0, ease:'linear' }}>
                <RefreshCw size={13}/>
              </motion.div>
              {t('refresh')}
            </motion.button>
          </div>

          {/* Stat cards */}
          <AnimatePresence mode="wait">
            <motion.div key={refreshKey} className="grid-4 mb-5"
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
              {statCards.map(({ label, value, icon:Icon, change, up, iconBg, iconColor }, i) => (
                <motion.div key={label} className="stat-card"
                  initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{ flex:1 }}>
                      <div className="stat-label">{label}</div>
                      <div className="stat-value">
                        {loading
                          ? <motion.span animate={{ opacity:[1,0.3,1] }} transition={{ duration:1, repeat:Infinity }}>···</motion.span>
                          : value}
                      </div>
                      <div className={`stat-change ${up?'up':change.includes('-')?'down':'neutral'}`}>
                        <TrendingUp size={11} style={{ transform:!up?'rotate(180deg)':'none' }}/> {change} {t('thisMonth')}
                      </div>
                    </div>
                    <div style={{ width:42, height:42, borderRadius:12, background:iconBg, display:'flex', alignItems:'center', justifyContent:'center', color:iconColor, flexShrink:0 }}>
                      <Icon size={20} strokeWidth={1.8}/>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Charts row */}
          <div className="grid-2 mb-5" style={{ gridTemplateColumns:'2.5fr 2fr' }}>
            {/* Revenue Trends */}
            <div className="card animate-fade-d2">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18, flexWrap:'wrap', gap:10 }}>
                <div className="chart-title">{t('revenueTrends')}</div>
                <PeriodSelector value={revPeriod} onChange={setRevPeriod} t={t} />
              </div>
              <ResponsiveContainer width="100%" height={265}>
                <AreaChart
  data={isRTL ? [...revenueData].reverse() : revenueData}
  margin={{ left:17, right:21, top:4, bottom:-2 }}
>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#524E8D" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#524E8D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false}/>
  <XAxis
    dataKey="day"

    interval={revPeriod === "30j" ? 1 : 0}

    tick={{
      fill:'var(--text-muted)',
      fontSize:11,
      fontWeight:600
    }}

    axisLine={false}
    tickLine={false}
  />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip
  content={
    <AreaTooltip
  currency={settings?.currency}
  baseCurrency={settings?.baseCurrency}
  rates={rates}
/>}/>
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5}
                    fill="url(#revGrad)"
                    dot={{ fill:'var(--primary)', strokeWidth:0, r:4 }}
                    activeDot={{ r:6, fill:'var(--primary-light)', stroke:'white', strokeWidth:2 }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sales by Category */}
            <div className="card animate-fade-d3">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, flexWrap:'wrap', gap:8 }}>
                <div className="chart-title">{t('salesByCategory')}</div>
                <PeriodSelector value={catPeriod} onChange={setCatPeriod} t={t} />
              </div>
              <ResponsiveContainer
    width="100%"
    height={Math.max(220, categoryData.length * 45)}
  >
  <BarChart
  data={isRTL ? [...categoryData].reverse() : categoryData}
    margin={{ left: 0, right: 0, top: 4, bottom: 0 }}
    barSize={barSize}
  >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false}/>
  <XAxis
  dataKey="name"
  interval={0}
  reversed={isRTL}
  height={22}
  tick={(props) => {
    const { x, y, payload } = props
    const words = payload.value.split(' ')

    let line1 = payload.value
    let line2 = ''

    if (words.length >= 3) {
      const middle = Math.ceil(words.length / 2)
      line1 = words.slice(0, middle).join(' ')
      line2 = words.slice(middle).join(' ')
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize={10}
          fontWeight={600}
        >
          <tspan x="0" dy="3">
            {line1}
          </tspan>
          {line2 && (
            <tspan x="0" dy="9">
              {line2}
            </tspan>
          )}
        </text>
      </g>
    )
  }}
  axisLine={false}
  tickLine={false}
/>
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip
    content={<BarTooltip/>}
    cursor={false}
  />
  <Bar
    dataKey="value"
    radius={[6,6,0,0]}
    name="Sales %"
    isAnimationActive={true}
    animationDuration={800}
    animationEasing="ease-out"
  >
    <LabelList
      dataKey="value"
      position="top"
      formatter={(value) => `${Math.round(value)}%`}
      style={{
        fill: 'var(--text)',
        fontSize: 11,
        fontWeight: 600
      }}
    />
    
                    {categoryData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stock Alerts + Recent Orders */}
          <div className="grid-2" style={{ gridTemplateColumns:'2.5fr 2fr' }}>

            {/* Recent Orders */}
            <div className="card animate-fade-d5">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <div>
                  <div className="chart-title">{t('recentOrders')}</div>
                  <div className="chart-sub">{t('latestOrdersPlaced')}</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/orders')}>
                  {t('viewAll')} <ArrowRight size={12}/>
                </button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>{t('orderId')}</th><th>{t('customer')}</th><th>{t('amount')}</th><th>{t('status')}</th><th>{t('date')}</th></tr></thead>
                  <tbody>
                    {recentOrders.slice(0,5).map(o => (
                      <tr key={o._id}>
                        <td><span className="font-mono text-xs" style={{ color:'var(--primary-light)' }}>{o.orderId}</span></td>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div className="avatar">
  {o.customerAvatar ? (
    <img
      src={o.customerAvatar}
      alt={o.customerName}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  ) : (
    o.customerName
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  )}
</div>
                            <span style={{ fontSize:13 }}>{o.customerName}</span>
                          </div>
                        </td>
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
                        <td className="text-muted text-sm">{new Date(o.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recentOrders.length===0 && (
                  <div style={{ textAlign:'center', padding:24, color:'var(--text-muted)', fontSize:13 }}>{t('noOrdersYet')}</div>
                )}
              </div>
            </div>

            {/* Stock Alerts card with Inventory Report button */}
            <div className="card animate-fade-d4">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <div>
                  <div className="chart-title" style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <AlertTriangle size={15} style={{ color:'var(--warning)' }}/> {t('stockAlerts')}
                  </div>
                  <div className="chart-sub">{t('stockAlertsSub')}</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/inventory')}>
                  {t('viewAll')} <ArrowRight size={12}/>
                </button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {stockAlerts.length === 0 ? (
                  <div style={{ textAlign:'center', padding:20, color:'var(--text-muted)', fontSize:13 }}>
                    <span style={{ fontSize:28, display:'block', marginBottom:6 }}>✅</span>
                    {t('allStockIsHealthy')}
                  </div>
                ) : stockAlerts.slice(0,5).map(item => (
                  <div key={item._id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:'var(--bg-base)', borderRadius:10, border:`1px solid ${item.stockStatus==='OUT_OF_STOCK'?'rgba(239,68,68,0.2)':'rgba(245,158,11,0.2)'}` }}>
                    <div
  style={{
    width:40,
    height:40,
    borderRadius:8,
    overflow:'hidden',
    border:'1px solid var(--border)',
    background:'white',
    flexShrink:0
  }}
>
  {item.image ? (
    <img
      src={item.image}
      alt={item.name}
      style={{
        width:'100%',
        height:'100%',
        objectFit:'cover'
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
      {item.category?.icon || '📦'}
    </div>
  )}
</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:12.5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{item.sku}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontWeight:800, fontSize:15, color:item.stockStatus==='OUT_OF_STOCK'?'var(--danger)':'var(--warning)' }}>{item.stock}</div>
                      <div style={{ fontSize:10, color:'var(--text-muted)' }}>/{item.maxStock}</div>
                    </div>
                    {item.stockStatus==='OUT_OF_STOCK'
                      ? <AlertCircle size={14} style={{ color:'var(--danger)', flexShrink:0 }}/>
                      : <AlertTriangle size={14} style={{ color:'var(--warning)', flexShrink:0 }}/>}
                  </div>
                ))}
              </div>

              {/* Inventory Report button */}
              <button
                className="btn btn-secondary btn-sm"
                style={{ width:'100%', justifyContent:'center', marginTop:14 }}
                onClick={() => setShowAlertModal(true)}>
                <FileText size={13}/> {t('inventoryReport')}
                {stockAlerts.length > 0 && (
                  <span style={{ background:'var(--danger)', color:'white', borderRadius:10, padding:'1px 6px', fontSize:10, fontWeight:700, marginLeft:4 }}>
                    {stockAlerts.length}
                  </span>
                )}
              </button>
            </div>


          </div>
        </div>

        {/* Inventory Report Modal */}
        <AnimatePresence>
          {showAlertModal && <StockAlertModal alerts={stockAlerts} onClose={() => setShowAlertModal(false)} t={t}/>}
        </AnimatePresence>
      </DashboardLayout>
    );
  }
