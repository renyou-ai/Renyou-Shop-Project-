import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async () => {

  if (!email || !password) {
    toast.warning(t('pleaseFillInAllFields'));
    return;
  }

  setLoading(true);

  try {
  await login(email, password);

  console.log(
  "AFTER LOGIN TOKEN =",
  localStorage.getItem('renyou_token')
);


  navigate('/dashboard');


} catch (e) {

    console.log("LOGIN ERROR =", e);

    toast.error(
      t('loginFailed'),
      e.message || t('invalidCredentials')
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-base)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', padding:20 }}>
      {/* Background glow */}
      <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translateX(-50%)', width:600, height:600, background:'radial-gradient(circle, rgba(82,78,141,0.15) 0%, transparent 65%)', pointerEvents:'none' }}/>

      <motion.div style={{ width:'100%', maxWidth:390 }} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, ease:'easeOut' }}>
{/* Logo */}
<div style={{ textAlign:'center', marginBottom:32 }}>
  <motion.div
    initial={{ scale:0.8, opacity:0 }}
    animate={{ scale:1.5, opacity:1 }}
    transition={{ delay:0.1, type:'spring', stiffness:300 }}
    style={{
      width:64,
      height:64,
      borderRadius:20,
      background:'transparent',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      margin:'0 auto 16px',
      boxShadow:'0 10px 30px rgba(82,78,141,0.4)',
      overflow:'hidden'
    }}
  >
    <img
      src="/assets/dashboard/Side Navbar/RenyouLOGO+.svg"
      alt="Renyou Logo"
      style={{
        width: "90%",
        height: "70%",
        objectFit: "contain"
      }}
    />
  </motion.div>
          <img
  src="/assets/dashboard/Side Navbar/RENYOU.svg"
  alt="RENYOU"
  style={{
    width: 220,      // taille
    height: 'auto',

    position: 'relative',

    top: 10,          // ↑↓
    left: 40,         // ←→

    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,

    transform: 'translateX(0px) translateY(0px)',

    userSelect: 'none',
    pointerEvents: 'none',
    display: 'block',
  }}
/>
          <div
  style={{
    fontSize: 13,
    color: 'var(--text-muted)',

    position: 'relative',

    top: 20,      // ↑↓
    left: 0,     // ←→

    marginTop: 5,

    transform: 'translateX(0px) translateY(0px)',
  }}
>
  {t('adminDashboardSecureAccess')}
</div>
        </div>

        {/* Card */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
          style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:20, padding:28, boxShadow:'0 8px 40px rgba(82,78,141,0.1)' }}>

          <div style={{ marginBottom:16 }}>
            <label className="input-label">{t('emailAddress')}</label>

            <div style={{ position:'relative' }}>
              <Mail size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
              <input className="input-field" style={{ paddingLeft:38 }} type="email" placeholder="admin@renyou.com"
                value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()}/>
            </div>
          </div>

          <div style={{ marginBottom:24 }}>
            <label className="input-label">{t('password')}</label>
            <div style={{ position:'relative' }}>
              <Lock size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
              <input className="input-field" style={{ paddingLeft:38, paddingRight:42 }} type={showPwd?'text':'password'}
                placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()}/>
              <button onClick={()=>setShowPwd(!showPwd)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', padding:0 }}>
                {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>

          <motion.button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'12px', fontSize:14, borderRadius:12 }}
            onClick={handleSubmit} disabled={loading} whileTap={{ scale:0.98 }}>
            {loading ? (
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.6s linear infinite', display:'inline-block' }}/>
                {t('signingIn')}
              </span>
            ) : (
              <><span>{t('signIn')}</span><ArrowRight size={15}/></>
            )}
          </motion.button>

          <div style={{ textAlign:'center', marginTop:16, padding:'10px 14px', background:'var(--bg-base)', borderRadius:10, fontSize:12, color:'var(--text-muted)', border:'1px solid var(--border-light)' }}>
            Demo: <strong style={{ color:'var(--primary)' }}>admin@renyou.com</strong> / <strong style={{ color:'var(--primary)' }}>admin123@</strong>
          </div>
        </motion.div>

        <div style={{ textAlign:'center', marginTop:20, fontSize:11.5, color:'var(--text-muted)' }}>
          {t('copyrightNotice')}
        </div>
      </motion.div>
    </div>
  );
}
