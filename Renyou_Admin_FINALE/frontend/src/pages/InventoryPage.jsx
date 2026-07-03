import React, { useState, useEffect, useCallback } from 'react';
import { Download, Plus, X, RefreshCw, FileText, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarLayout } from '../components/Layouts.jsx';
import Topbar from '../components/Topbar.jsx';
import { api, exportCSV } from '../api.js';
import { useToast } from '../components/Toast.jsx';
import { useSettings } from '../context/SettingsContext';
import { formatCurrency,  convertCurrency } from '../utils/currency';
import { formatNumber } from '../utils/formatNumber';

function ProductModal({ onClose, onSaved, categories, brands, product }) {
  const { toast } = useToast();
  const { settings } = useSettings();
  const editing = !!product;
  const [form, setForm] = useState(product ? {
    name:product.name, category:product.category?._id||'', brand:product.brand?._id||'',
    price:formatNumber(product.price), cost:product.cost||'', stock:product.stock, maxStock:product.maxStock,
    sku:product.sku, status:product.status, supplier:product.supplier||'', description:product.description||'',image:product.image||'',
  } : { name:'', category:'', brand:'', price:'', cost:'', stock:'', maxStock:100, sku:'', status:'ACTIVE', supplier:'', description:'', image:'' });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name||!form.category||!form.sku||!form.price) { toast.warning('Fill required fields'); return; }
    setLoading(true);
    try {
      if (editing) await api.updateProduct(product._id, form);
      else await api.createProduct(form);
      toast.success(editing?'Product updated':'Product created', { title:'✅ Success' });
      onSaved(); onClose();
    } catch(e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div className="modal" style={{ maxWidth:600 }}
        initial={{ opacity:0, scale:0.93, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.93 }} transition={{ type:'spring', stiffness:360, damping:28 }}>
        <div className="modal-header">
          <div><div className="modal-title">{editing?'Edit':'Add'} Product</div><div className="modal-sub">Fill in product details.</div></div>
          <div className="modal-close" onClick={onClose}><X size={14}/></div>
        </div>
        <div className="grid-2" style={{ gap:13, marginBottom:20 }}>

          <div style={{ gridColumn:'1/-1' }}><label className="input-label">Product Name *</label><input className="input-field" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Advanced Hydrating Serum"/></div>
          <div><label className="input-label">Category *</label>
            <select className="input-field" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              <option value="">— Select —</option>{categories.map(c=><option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div><label className="input-label">Brand</label>
            <select className="input-field" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}>
              <option value="">— Select —</option>{brands.map(b=><option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}>
  <label className="input-label">Image URL</label>
  <input
    className="input-field"
    type="url"
    value={form.image || ''}
    onChange={e=>setForm({...form,image:e.target.value})}
    placeholder="https://example.com/product.jpg"
  />
</div>
          <div style={{ gridColumn:'1/-1' }}><label className="input-label">Description</label><textarea className="input-field" rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{resize:'vertical'}}/></div>
          <div><label className="input-label">Price ({settings?.currency || 'USD'}) *</label><input className="input-field" type="number" step=".01" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
          <div><label className="input-label">Cost ({settings?.currency || 'USD'})</label><input className="input-field" type="number" step=".01" min="0" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})}/></div>
          <div><label className="input-label">Stock Quantity</label><input className="input-field" type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></div>
          <div><label className="input-label">Max Stock</label><input className="input-field" type="number" min="0" value={form.maxStock} onChange={e=>setForm({...form,maxStock:e.target.value})}/></div>
          <div><label className="input-label">SKU *</label><input className="input-field" placeholder="VIT-C-1000" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/></div>
          <div><label className="input-label">Supplier</label><input className="input-field" value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})}/></div>
          <div><label className="input-label">Status</label>
            <select className="input-field" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="DRAFT">Draft</option>
            </select>
          </div>
          <div><label className="input-label">Image URL</label><input className="input-field" type="url" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://product.com/image.png"/></div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading?'⏳...':editing?'Update':'➕ Add Product'}</button>
        </div>
      </motion.div>
    </div>
  );
}

function StockAlertModal({ alerts, onClose }) {
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div className="modal" style={{ maxWidth:700 }}
        initial={{ opacity:0, scale:0.93, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.93 }} transition={{ type:'spring', stiffness:360, damping:28 }}>
        <div className="modal-header">
          <div><div className="modal-title">Inventory Report — Stock Alerts</div><div className="modal-sub">Generated {new Date().toLocaleDateString('en-US',{day:'2-digit',month:'long',year:'numeric'})}</div></div>
          <div className="modal-close" onClick={onClose}><X size={14}/></div>
        </div>
        <div style={{ display:'flex', gap:12, marginBottom:20 }}>
          {[
            { label:'OUT OF STOCK', count:alerts.filter(a=>a.stockStatus==='OUT_OF_STOCK').length, color:'var(--danger)' },
            { label:'LOW STOCK',    count:alerts.filter(a=>a.stockStatus==='LOW_STOCK').length,    color:'var(--warning)' },
            { label:'TOTAL ALERTS', count:alerts.length,                                            color:'var(--primary-light)' },
          ].map(s=>(
            <div key={s.label} style={{ flex:1, background:'var(--bg-base)', borderRadius:12, padding:'14px 16px', border:`1px solid ${s.color}33` }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:.8 }}>{s.label}</div>
              <div style={{ fontSize:28, fontWeight:800, color:s.color }}>{s.count}</div>
            </div>
          ))}
        </div>
        <div className="table-wrap" style={{ maxHeight:360, overflowY:'auto' }}>
          <table>
            <thead><tr><th>PRODUCT</th><th>SKU</th><th>STOCK</th><th>MAX</th><th>STATUS</th><th>SUPPLIER</th></tr></thead>
            <tbody>
              {alerts.map(item=>(
                <tr key={item._id}>
                  <td><div style={{ display:'flex', alignItems:'center', gap:9 }}>
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
      <div
        style={{
          fontWeight:600,
          fontSize:13
        }}
      >
        {item.name}
      </div>

      <div
        style={{
          fontSize:11,
          color:'var(--text-muted)'
        }}
      >
        {item.category?.name}
      </div>
    </div>

  </div>
</td>
                    <div><div style={{ fontWeight:600, fontSize:13 }}>{item.name}</div><div style={{ fontSize:11, color:'var(--text-muted)' }}>{item.category?.name}</div></div>
                  </div></td>
                  <td><span className="font-mono text-xs">{item.sku}</span></td>
                  <td style={{ fontWeight:800, color:item.stockStatus==='OUT_OF_STOCK'?'var(--danger)':'var(--warning)', fontSize:16 }}>{item.stock}</td>
                  <td className="text-muted text-sm">{item.maxStock}</td>
                  <td>{item.stockStatus==='OUT_OF_STOCK'?<span className="badge badge-out-of-stock">OUT OF STOCK</span>:<span className="badge badge-low-stock">LOW STOCK</span>}</td>
                  <td className="text-sm text-muted">{item.supplier||'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {alerts.length===0 && <div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}><span style={{ fontSize:32 }}>✅</span><div style={{ marginTop:8 }}>No stock alerts !</div></div>}
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:16 }}>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={()=>window.print()}>Print Report</button>
        </div>
      </motion.div>
    </div>
  );
}

const statusBadge = s => s==='IN_STOCK'?<span className="badge badge-in-stock">IN STOCK</span>:s==='LOW_STOCK'?<span className="badge badge-low-stock">LOW STOCK</span>:<span className="badge badge-out-of-stock">OUT OF STOCK</span>;

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const {
  settings,
  rates
} = useSettings();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = { page, limit:15 };
      if (search) p.search = search;
      if (filterStatus) p.stockStatus = filterStatus;
      const [prod, s, a, cats, brnds] = await Promise.all([
        api.getProducts(p), api.getProductStats(), api.getProductAlerts(),
        api.getCategories(), api.getBrands(),
      ]);

      setProducts(prod.products); setTotalPages(prod.pages||1);
      setStats(s); setAlerts(a); setCategories(cats); setBrands(brnds);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, filterStatus, page]);

  useEffect(() => { setPage(1); }, [search, filterStatus]);
  useEffect(() => { load(); }, [load]);

  const del = async id => {
    if (!confirm('Delete this product?')) return;
    try { await api.deleteProduct(id); toast.success('Product deleted'); load(); }
    catch(e) { toast.error(e.message); }
  };

  const handleExport = async () => {
    try {
      const all = await api.getProducts({ limit:1000 });
      exportCSV('products.csv', all.products, ['name','sku','price','cost','stock','maxStock','stockStatus','status','supplier']);
      toast.success('CSV exported', { title:'📥 Export' });
    } catch(e) { toast.error(e.message); }
  };

  const stockPct = item => item.maxStock>0 ? Math.round((item.stock/item.maxStock)*100) : 0;
  const fillColor = item => item.stockStatus==='OUT_OF_STOCK'?'var(--danger)':item.stockStatus==='LOW_STOCK'?'var(--warning)':'var(--success)';

  return (
    <SidebarLayout>
      <Topbar placeholder="Search inventory, SKUs, suppliers..." onSearch={v=>{setSearch(v);setPage(1);}}/>
      <div className="page-content">
        <div className="section-header animate-fade">
          <div><div className="section-title">Inventory</div><div className="section-sub">Real-time stock overview and movements.</div></div>
          <div style={{ display:'flex', gap:9, flexWrap:'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleExport}><Download size={13}/> Export CSV</button>
            <button className="btn btn-secondary btn-sm" onClick={()=>setShowAlerts(true)}>
              <FileText size={13}/> Inventory Report
              {alerts.length>0 && <span style={{ background:'var(--danger)', color:'white', borderRadius:10, padding:'1px 6px', fontSize:10, fontWeight:700, marginLeft:2 }}>{alerts.length}</span>}
            </button>
            <button className="btn btn-primary btn-sm" onClick={()=>{setEditProduct(null);setShowModal(true);}}><Plus size={13}/> Add Product</button>
          </div>
        </div>

        <div className="grid-4 mb-5 animate-fade-d1">
          {[
            {
  label:'TOTAL VALUE',
  value:
    formatCurrency(
  convertCurrency(
    stats.totalValue || 0,
    settings?.baseCurrency || 'USD',
    settings?.currency || 'USD',
    rates
  ),
  settings?.currency || 'USD'
)
},
            { label:'LOW STOCK',    value:stats.lowStock||0,    color:'var(--warning)' },
            { label:'OUT OF STOCK', value:stats.outOfStock||0,  color:'var(--danger)' },
            { label:'IN STOCK',     value:stats.inStock||0,     color:'var(--success)' },
          ].map(s=>(
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color:s.color||'var(--text-primary)' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="card mb-4 animate-fade-d1" style={{ padding:'11px 15px' }}>
          <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
            {[{v:'',l:'All'},{v:'IN_STOCK',l:'In Stock'},{v:'LOW_STOCK',l:'Low Stock'},{v:'OUT_OF_STOCK',l:'Out of Stock'}].map(s=>(
              <button key={s.v} className={`btn btn-sm ${filterStatus===s.v?'btn-primary':'btn-ghost'}`} onClick={()=>setFilterStatus(s.v)}>{s.l}</button>
            ))}
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
                  <thead><tr><th>PRODUCT</th><th>SKU</th><th>STOCK LEVEL</th><th>STATUS</th><th>SUPPLIER</th><th>PRICE</th><th></th></tr></thead>
                  <tbody>
                    {products.map(item=>(
                      <tr key={item._id}>
                        <td><div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div
  style={{
    width:32,
    height:32,
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
                          <div><div style={{ fontWeight:600, fontSize:13 }}>{item.name}</div><div style={{ fontSize:11, color:'var(--text-muted)' }}>{item.category?.name}</div></div>
                        </div></td>
                        <td><span className="font-mono text-xs">{item.sku}</span></td>
                        <td style={{ minWidth:140 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ fontWeight:700, fontSize:13, minWidth:28, color:'var(--text-primary)' }}>{item.stock}</span>
                            <div style={{ flex:1, height:5, background:'var(--border)', borderRadius:3, overflow:'hidden' }}>
                              <motion.div initial={{ width:0 }} animate={{ width:`${stockPct(item)}%` }} transition={{ duration:0.6, ease:'easeOut' }}
                                style={{ height:'100%', background:fillColor(item), borderRadius:3 }}/>
                            </div>
                            <span style={{ fontSize:10.5, color:'var(--text-muted)' }}>{stockPct(item)}%</span>
                          </div>
                        </td>
                        <td>{statusBadge(item.stockStatus)}</td>
                        <td className="text-sm text-muted">{item.supplier||'—'}</td>
                        <td style={{ fontWeight:700, color:'var(--text-primary)' }}>
  {formatCurrency(
    convertCurrency(
      item.price || 0,
      settings?.baseCurrency || 'USD',
      settings?.currency || 'USD',
      rates
    ),
    settings?.currency || 'USD'
  )}
</td>
                        <td><div style={{ display:'flex', gap:5 }}>
                          <button className="btn btn-ghost btn-xs" onClick={()=>{setEditProduct(item);setShowModal(true);}}><Edit2 size={11}/></button>
                          <button className="btn btn-ghost btn-xs" style={{ color:'var(--danger)' }} onClick={()=>del(item._id)}><Trash2 size={11}/></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length===0 && <div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No products found</div>}
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
      <AnimatePresence>
        {showModal && <ProductModal categories={categories} brands={brands} product={editProduct} onClose={()=>setShowModal(false)} onSaved={load}/>}
        {showAlerts && <StockAlertModal alerts={alerts} onClose={()=>setShowAlerts(false)}/>}
      </AnimatePresence>
    </SidebarLayout>
  );
}
