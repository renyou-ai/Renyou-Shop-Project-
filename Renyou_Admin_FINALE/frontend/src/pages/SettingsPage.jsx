import React, { useState, useRef, useEffect } from 'react';
import { UserRound,
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
RefreshCw,
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
Leaf } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarLayout } from '../components/Layouts.jsx';
import Topbar from '../components/Topbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { api } from '../api.js';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from "react-country-flag";
import Select from "react-select";


const PRESET_AVATARS = [
  // Users
  { id: "UserRound", icon: UserRound },
  { id: "CircleUserRound", icon: CircleUserRound },
  { id: "User", icon: User },
  { id: "Shield", icon: Shield },
  { id: "Crown", icon: Crown },

  // Symbols
  { id: "Heart", icon: Heart },
  { id: "Star", icon: Star },
  { id: "Flame", icon: Flame },
  { id: "Sparkles", icon: Sparkles },
  { id: "Ghost", icon: Ghost },

  // Animals
  { id: "Cat", icon: Cat },
  { id: "Dog", icon: Dog },
  { id: "Rabbit", icon: Rabbit },
  { id: "Bird", icon: Bird },
  { id: "Fish", icon: Fish },
  { id: "Bug", icon: Bug },

  // Tech
  { id: "Bot", icon: Bot },
  { id: "Brain", icon: Brain },
  { id: "Rocket", icon: Rocket },
  { id: "Zap", icon: Zap },
  { id: "Gem", icon: Gem },
  { id: "Diamond", icon: Diamond },

  // Lifestyle
  { id: "Camera", icon: Camera },
  { id: "Eye", icon: Eye },
  { id: "Coffee", icon: Coffee },
  { id: "Gamepad2", icon: Gamepad2 },
  { id: "Music", icon: Music },
  { id: "Pizza", icon: Pizza },
  { id: "IceCreamCone", icon: IceCreamCone },

  // Nature
  { id: "Flower2", icon: Flower2 },
  { id: "Leaf", icon: Leaf },
];

const AvatarIcons = {
  Globe,
Lock,
Bell,
Palette,
Save,
RefreshCw,
Upload,
Moon,
Sun,
Check,
User,
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
};

const THEME_COLORS = [
  '#524E8D','#7c3aed','#2563eb','#059669',
  '#d97706','#dc2626','#db2777','#0891b2',
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
const Toggle = ({ value, onChange }) => (
  <div className={`toggle ${value ? 'on' : ''}`} onClick={() => onChange(!value)} style={{ cursor: 'pointer' }} />
);

const Row = ({ label, sub, children }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 0', borderBottom:'1px solid var(--border-light)' }}>
    <div>
      <div style={{ fontSize:13.5, fontWeight:600, color:'var(--text-primary)' }}>{label}</div>
      {sub && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{sub}</div>}
    </div>
    <div style={{ flexShrink:0, marginLeft:16 }}>{children}</div>
  </div>
);

const SectionHead = ({ icon: Icon, title, color = 'var(--primary)' }) => (
  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
    <div style={{ width:36, height:36, borderRadius:10, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', color }}>
      <Icon size={16} />
    </div>
    <div style={{ fontWeight:700, fontSize:14.5, color:'var(--text-primary)' }}>{title}</div>
  </div>
);

// ─────────────────────────────────────────────
// SettingsPage
// ─────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const { dark, toggleDark, primaryColor, setColor, sidebarWidth, setWidth } = useTheme();
  const settingsCtx = useSettings();
  const reloadSettings = settingsCtx?.reloadSettings;
  const [loading, setLoading]   = useState(true);   // loading settings from DB
  const [saving,  setSaving]    = useState(false);   // saving in progress
  const fileRef = useRef(null);
  const { t, i18n } = useTranslation();
  const languageOptions = [
  { value: "en", label: "🇬🇧 English" },
  { value: "fr", label: "🇫🇷 Français" },
  { value: "ar", label: "🇹🇳 العربية" },
  { value: "de", label: "🇩🇪 Deutsch" },
  { value: "es", label: "🇪🇸 Español" },
];

  // ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const TABS = [
  { id: 'general',       label: t('generalSettings'),       icon: Globe   },
  { id: 'profile',       label: t('profile'),       icon: User    },
  { id: 'notifications', label: t('notifications'), icon: Bell    },
  { id: 'security',      label: t('security'),      icon: Lock    },
  { id: 'appearance',    label: t('appearance'),    icon: Palette },
];

  // ── Controlled states (populated from DB fetch) ──
  const [storeName,    setStoreName]    = useState('Renyou Shop');
  const [supportEmail, setSupportEmail] = useState('support@renyou.com');
  const [currency,     setCurrency]     = useState('USD');
  const [language,     setLanguage]     = useState('en');
  const [timezone,     setTimezone]     = useState('UTC');

  const [profileName,   setProfileName]   = useState(user?.name  || '');
  const [profileEmail,  setProfileEmail]  = useState(user?.email || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');

  const [pwdCurrent,  setPwdCurrent]  = useState('');
  const [pwdNew,      setPwdNew]      = useState('');
  const [pwdConfirm,  setPwdConfirm]  = useState('');

  const [notifStock,    setNotifStock]    = useState(true);
  const [notifOrder,    setNotifOrder]    = useState(true);
  const [notifCustomer, setNotifCustomer] = useState(false);
  const [notifPromo,    setNotifPromo]    = useState(true);

  const [sec2FA,      setSec2FA]      = useState(false);
  const [secTimeout,  setSecTimeout]  = useState('8h');
  const [secIP,       setSecIP]       = useState(false);

  // ── Fetch settings from DB on mount ──
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const s = await api.getSettings();
        // General
        if (s.storeName)    setStoreName(s.storeName);
        if (s.supportEmail) setSupportEmail(s.supportEmail);
        if (s.currency)     setCurrency(s.currency);
        if (s.language)     setLanguage(s.language);
        if (s.timezone)     setTimezone(s.timezone);
        // Notifications
        if (s.notifications) {
          setNotifStock(s.notifications.stockAlert   ?? true);
          setNotifOrder(s.notifications.newOrder     ?? true);
          setNotifCustomer(s.notifications.newCustomer  ?? false);
          setNotifPromo(s.notifications.promotionEnd ?? true);
        }
        // Security
        if (s.security) {
          setSec2FA(s.security.twoFactor      ?? false);
          setSecTimeout(s.security.sessionTimeout ?? '8h');
          setSecIP(s.security.ipWhitelist    ?? false);
        }
        // Appearance (also handled by ThemeContext from localStorage)
        // ThemeContext already loads from localStorage on mount
      } catch (e) {
        console.error('Failed to fetch settings:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
  setProfileAvatar(user?.avatar || '');
}, [user?.avatar]);

  const initials = (() => {
    const parts = (user?.name || '').trim().split(/\s+/).filter(Boolean);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (user?.name || 'A').slice(0, 2).toUpperCase();
  })();

  const AvatarIcon = AvatarIcons[profileAvatar];
  const ConnectedAvatarIcon = AvatarIcons[user?.avatar];

  // ─── Save helpers ───
  const save = async (payload, title, successMsg) => {
  setSaving(true);

  try {
    await api.saveSettings(payload);
    await reloadSettings();

    toast.success(successMsg, {
      title
    });
  } catch (e) {
    toast.error(e.message || 'Failed to save', {
      title: '❌ Error'
    });
  } finally {
    setSaving(false);
  }
};

  const saveGeneral = async () => {
  await save(
    {
      storeName,
      supportEmail,
      currency,
      language,
      timezone
    },
    t('generalSettings'),
    `✅ ${t('generalSettingsSaved')}`
  );

  await i18n.changeLanguage(language);

  document.documentElement.dir =
    language === 'ar'
      ? 'rtl'
      : 'ltr';

  localStorage.setItem('language', language);
};

  const saveNotifications = () => save(
  {
    notifications: {
      stockAlert: notifStock,
      newOrder: notifOrder,
      newCustomer: notifCustomer,
      promotionEnd: notifPromo
    }
  },
  t('notificationPreferences'),
  `✅ ${t('notificationPreferencesSaved')}`
);

  const saveSecurity = () => save(
  {
    security: {
      twoFactor: sec2FA,
      sessionTimeout: secTimeout,
      ipWhitelist: secIP
    }
  },
  t('securitySettings'),
  `✅ ${t('securitySettingsSaved')}`
);

  const saveAppearance = async () => {
  await save(
    {
      themeColor: primaryColor,
      sidebarWidth,
      darkMode: dark
    },
    t('appearance'),
    `✅ ${t('appearanceSaved')}`
  );
};

  const saveProfile = async () => {
    if (!profileName || !profileEmail) { toast.warning('Name and email are required'); return; }
    setSaving(true);
    try {
      const updated = await api.updateMe({ name: profileName, email: profileEmail, avatar: profileAvatar });
      setUser(prev => ({ ...prev, name: updated.name, email: updated.email, avatar: updated.avatar, initials: updated.initials }));
      toast.success(`✅ ${t('profileUpdated')}`, { title: ` ${t('profile')}` });
    } catch (e) {
      toast.error(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const changePwd = async () => {
    if (!pwdCurrent)             { toast.warning('Enter your current password'); return; }
    if (pwdNew !== pwdConfirm)   { toast.error('Passwords do not match');        return; }
    if (pwdNew.length < 6)       { toast.error('Minimum 6 characters');          return; }
    setSaving(true);
    try {
      await api.changePassword({ currentPassword: pwdCurrent, newPassword: pwdNew });
      toast.success('Password changed!', { title: '🔐 Security' });
      setPwdCurrent(''); setPwdNew(''); setPwdConfirm('');
    } catch (e) {
      toast.error(e.message || 'Incorrect current password');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await api.uploadAvatar(formData);

    setProfileAvatar(res.avatar);

    if (user && setUser) {
      setUser(prev => ({
  ...prev,
  avatar: res.avatar
}));
    }

    toast.success('Avatar uploaded successfully!', {
      title: '📷 Upload'
    });

  } catch (err) {
    console.error(err);

    toast.error('Failed to upload avatar', {
      title: '❌ Error'
    });
  }
};

  const SaveBtn = ({ onClick, label = t('saveSettings') }) => (
    <div style={{ display:'flex', justifyContent:'flex-end', marginTop:20 }}>
      <motion.button className="btn btn-primary" onClick={onClick} disabled={saving || loading} whileTap={{ scale:0.97 }}>
        {saving
          ? <><RefreshCw size={13} style={{ animation:'spin 0.7s linear infinite' }}/> Saving...</>
          : <><Save size={13}/> {label}</>}
      </motion.button>
    </div>
  );

  if (loading) {
    return (
      <SidebarLayout>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'80vh', color:'var(--text-muted)' }}>
          <RefreshCw size={28} style={{ animation:'spin 1s linear infinite' }}/>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Topbar placeholder={t('searchSettings')}/>
      <div className="page-content">
        <div className="section-header animate-fade">
          <div>
            <div className="section-title">
  {t('settings')}
</div>
            <div className="section-sub">{t('managePlatformConfig')}</div>
          </div>
        </div>

        <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
          {/* ── Sidebar tabs ── */}
          <div className="card animate-fade-d1" style={{ width:190, flexShrink:0, padding:'8px' }}>
            {TABS.map(t => (
              <motion.div key={t.id} whileTap={{ scale:0.97 }} onClick={() => setActiveTab(t.id)}
                style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 12px', borderRadius:9, cursor:'pointer',
                  background: activeTab===t.id ? 'var(--primary-glow)' : 'transparent',
                  color:      activeTab===t.id ? 'var(--primary)'      : 'var(--text-secondary)',
                  fontWeight: activeTab===t.id ? 700 : 500,
                  fontSize:13, transition:'all 0.17s', marginBottom:2,
                  border:`1px solid ${activeTab===t.id ? 'rgba(82,78,141,0.18)' : 'transparent'}` }}>
                <t.icon size={14}/> {t.label}
              </motion.div>
            ))}
          </div>

          {/* ── Content panel ── */}
          <div style={{ flex:1 }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                transition={{ duration:0.22 }}>

                {/* ══ GENERAL ══ */}
                {activeTab === 'general' && (
                  <div className="card">
                    <SectionHead icon={Globe} title={t("generalSettings")}/>
                    <div className="grid-2" style={{ gap:14, marginBottom:20 }}>
                      <div>
                        <label>{t('storeName')}</label>
                        <input className="input-field" value={storeName} onChange={e => setStoreName(e.target.value)}/>
                      </div>
                      <div>
                        <label>{t('supportEmail')}</label>
                        <input className="input-field" type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)}/>
                      </div>
                      <div>
                        <label className="input-label">{t('currency')}</label>
                        <select className="input-field" value={currency} onChange={e => setCurrency(e.target.value)}>
                          <option value="USD">USD ($) — US Dollar</option>
                          <option value="EUR">EUR (€) — Euro</option>
                          <option value="TND">TND (DT) — Tunisian Dinar</option>
                          <option value="GBP">GBP (£) — British Pound</option>
                          <option value="MAD">MAD (DH) — Moroccan Dirham</option>
                          <option value="CAD">CAD ($) — Canadian Dollar</option>
                          <option value="AUD">AUD ($) — Australian Dollar</option>
                        </select>
                      </div>
                      <div>
  <label className="input-label">
    {t('language')}
  </label>

  <Select
  options={languageOptions}
  value={languageOptions.find(o => o.value === language)}
  onChange={(option) => setLanguage(option.value)}
  isSearchable={false}
  styles={{
    control: (provided, state) => ({
      ...provided,
      width: '100%',
      background: 'var(--bg-surface)',
      border: state.isFocused
        ? '1.5px solid var(--primary)'
        : '1.5px solid var(--border)',
      borderRadius: '10px',
      minHeight: '42px',
      boxShadow: state.isFocused
        ? '0 0 0 3px var(--primary-glow)'
        : 'none',
      fontSize: '13.5px',
      cursor: 'pointer',
      transition: 'var(--transition)',
    }),

    valueContainer: (provided) => ({
      ...provided,
      padding: '0 14px',
      color: 'var(--text-primary)',
    }),

    singleValue: (provided) => ({
      ...provided,
      color: 'var(--text-primary)',
    }),

    menu: (provided) => ({
      ...provided,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      overflow: 'hidden',
      zIndex: 9999,
    }),

    option: (provided, state) => ({
      ...provided,
      background: state.isFocused
        ? 'var(--bg-hover)'
        : 'var(--bg-surface)',
      color: 'var(--text-primary)',
      cursor: 'pointer',
      fontSize: '13.5px',
    }),

    indicatorSeparator: () => ({
      display: 'none',
    }),

    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'var(--text-secondary)',
    }),
  }}
/>
</div>
                      <div>
                        <label className="input-label">{t('timezone')}</label>
                        <select className="input-field" value={timezone} onChange={e => setTimezone(e.target.value)}>
                          <option value="UTC">UTC</option>
                          <option value="Europe/Paris">Europe/Paris (CET)</option>
                          <option value="Africa/Tunis">Africa/Gafsa (CET)</option>
                          <option value="America/New_York">America/New York (EST)</option>
                          <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                          <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                          <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        </select>
                      </div>
                    </div>
                    <SaveBtn onClick={saveGeneral}/>
                  </div>
                )}

                {/* ══ PROFILE ══ */}
                {activeTab === 'profile' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    <div className="card">
                      <SectionHead icon={User} title={t("profile")}/>

                      {/* Avatar preview row */}
                      <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:22, padding:16, background:'var(--bg-base)', borderRadius:12 }}>
                        <div style={{ position:'relative' }}>
                          <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,var(--primary),var(--primary-light))', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 6px 20px var(--primary-glow)', flexShrink:0 }}>
                            {profileAvatar ? (
  profileAvatar.startsWith('data:') ||
  profileAvatar.startsWith('http') ||
  profileAvatar.startsWith('/uploads') ? (
    <img
      src={
        profileAvatar.startsWith('/uploads')
          ? `http://localhost:5001${profileAvatar}`
          : profileAvatar
      }
      alt=""
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
) : AvatarIcon ? (
  <AvatarIcon
    size={34}
    color="white"
    strokeWidth={2}
  />
) : (
  <span style={{ fontSize: 36 }}>
    {profileAvatar}
  </span>
)
) : (
  <span
    style={{
      fontSize: 22,
      fontWeight: 800,
      color: 'white'
    }}
  >
    {initials}
  </span>
)}
                          </div>
                          <button onClick={() => fileRef.current?.click()}
                            style={{ position:'absolute', bottom:-4, right:-4, width:26, height:26, borderRadius:'50%', background:'var(--primary)', border:'2px solid var(--bg-card)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'white' }}>
                            <Upload size={12}/>
                          </button>
                          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFileUpload}/>
                        </div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:15, color:'var(--text-primary)' }}>{user?.name}</div>
                          <div style={{ fontSize:12.5, color:'var(--text-muted)' }}>{user?.email}</div>
                          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>{t('clickToUpload')}</div>
                        </div>
                      </div>

                      {/* Emoji avatar picker */}
                      <div style={{ marginBottom:20 }}>
                        <label className="input-label">{t('chooseAvatarEmoji')}</label>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:8 }}>
{PRESET_AVATARS.map(({ id, icon: Icon }) => (
  <motion.div
    key={id}
    whileTap={{ scale: 0.85 }}
    onClick={() => setProfileAvatar(id)}
    style={{
      width: 44,
      height: 44,
      borderRadius: 11,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      position: 'relative',
      border: `2px solid ${
        profileAvatar === id
          ? 'var(--primary)'
          : 'var(--border)'
      }`,
      background:
        profileAvatar === id
          ? 'var(--primary-glow)'
          : 'var(--bg-base)',
      transition: 'all .18s'
    }}
  >
    <Icon
      size={22}
      strokeWidth={2}
color={
  profileAvatar === id
    ? 'var(--primary)'
    : 'var(--text-secondary)'
}
    />

    {profileAvatar === id && (
      <div
        style={{
          position: 'absolute',
          top: -5,
          right: -5,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid var(--bg-card)'
        }}
      >
        <Check
          size={8}
          color="white"
          strokeWidth={3}
        />
      </div>
    )}
  </motion.div>
))}
                          {/* Reset to initials */}
                          <motion.div whileTap={{ scale:0.85 }} onClick={() => setProfileAvatar('')}
                            style={{ width:44, height:44, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, cursor:'pointer',
                              border:`2px solid ${!profileAvatar ? 'var(--primary)' : 'var(--border)'}`,
                              background: !profileAvatar ? 'var(--primary-glow)' : 'var(--bg-base)',
                              color:'var(--primary)', transition:'all 0.18s' }}>
                            {initials}
                          </motion.div>
                        </div>
                      </div>

                      {/* Name & Email */}
                      <div className="grid-2" style={{ gap:14, marginBottom:20 }}>
                        <div>
                          <label className="input-label">{t('fullName')}</label>
                          <input className="input-field" value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="First Last"/>
                        </div>
                        <div>
                          <label className="input-label">{t('email')}</label>
                          <input className="input-field" type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)}/>
                        </div>
                      </div>
                      <SaveBtn onClick={saveProfile} label={t('saveProfile')}/>
                    </div>

                    {/* Change Password card */}
                    <div className="card">
                      <SectionHead icon={Lock} title={t('changePassword')} color="#ef4444"/>
                      <div style={{ display:'flex', flexDirection:'column', gap:13, marginBottom:20 }}>
                        <div>
                          <label className="input-label">{t('currentPassword')}</label>
                          <input className="input-field" type="password" value={pwdCurrent} onChange={e => setPwdCurrent(e.target.value)} placeholder="••••••••"/>
                        </div>
                        <div>
                          <label className="input-label">{t('newPassword')}</label>
                          <input className="input-field" type="password" value={pwdNew} onChange={e => setPwdNew(e.target.value)} placeholder="Min. 6 characters"/>
                        </div>
                        <div>
                          <label className="input-label">{t('confirmPassword')}</label>
                          <input className="input-field" type="password" value={pwdConfirm} onChange={e => setPwdConfirm(e.target.value)} placeholder="Repeat new password"/>
                        </div>
                      </div>
                      <div style={{ display:'flex', justifyContent:'flex-end' }}>
                        <motion.button className="btn btn-danger" onClick={changePwd}
                          disabled={saving || !pwdCurrent || !pwdNew} whileTap={{ scale:0.97 }}>
                          Change Password
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ NOTIFICATIONS ══ */}
                {activeTab === 'notifications' && (
                  <div className="card">
                    <SectionHead icon={Bell} title={t('notificationPreferences')} color="#f59e0b"/>
                    <Row label={t('stockAlerts')} sub={t('stockAlertsSub')}>
                      <Toggle value={notifStock} onChange={setNotifStock}/>
                    </Row>
                    <Row label={t('newOrders')} sub={t('newOrdersSub')}>
                      <Toggle value={notifOrder} onChange={setNotifOrder}/>
                    </Row>
                    <Row label={t('newCustomers')} sub={t('newCustomersSub')}>
                      <Toggle value={notifCustomer} onChange={setNotifCustomer}/>
                    </Row>
                    <Row label={t('promotionEndings')} sub={t('promotionEndingsSub')}>
                      <Toggle value={notifPromo} onChange={setNotifPromo}/>
                    </Row>
                    <SaveBtn onClick={saveNotifications} label={t('saveNotifications')}/>
                  </div>
                )}

                {/* ══ SECURITY ══ */}
                {activeTab === 'security' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    <div className="card">
                      <SectionHead icon={Lock} title={t('securitySettings')} color="#ef4444"/>
                      <Row label={t('twoFactorAuthentication')} sub={t('twoFactorAuthenticationSub')}>
                        <Toggle value={sec2FA} onChange={setSec2FA}/>
                      </Row>
                      <Row label={t('ipWhitelist')} sub={t('ipWhitelistSub')}>
                        <Toggle value={secIP} onChange={setSecIP}/>
                      </Row>
                      <Row label={t('sessionTimeout')} sub={t('sessionTimeoutSub')}>
                        <select className="input-field" style={{ width:130 }} value={secTimeout} onChange={e => setSecTimeout(e.target.value)}>
                          {['1h','4h','8h','24h','7d'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </Row>
                      <SaveBtn onClick={saveSecurity} label={t('saveSecurity')}/>
                    </div>
                    <div className="card">
                      <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:'var(--text-primary)' }}>{t('connectedAccount')}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 16px', background:'var(--bg-base)', borderRadius:12 }}>
                        <div
  style={{
    width: 46,
    height: 46,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,var(--primary),var(--primary-light))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    color: 'white',
    fontWeight: 800,
    fontSize: 16
  }}
>
  {user?.avatar ? (
    user.avatar.startsWith('/uploads') ? (
      <img
        src={`http://localhost:5001${user.avatar}`}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
) : ConnectedAvatarIcon ? (
  <ConnectedAvatarIcon
    size={22}
    color="white"
    strokeWidth={2}
  />
) : (
  <span style={{ fontSize: 22 }}>
    {user.avatar}
  </span>
)
  ) : (
    initials
  )}
</div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)' }}>{user?.name}</div>
                          <div style={{ fontSize:12.5, color:'var(--text-muted)' }}>{user?.email} · {user?.role}</div>
                        </div>
                        <span className="badge badge-active" style={{ marginLeft:'auto' }}>{t('activeSession')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ APPEARANCE ══ */}
                {activeTab === 'appearance' && (
                  <div className="card">
                    <SectionHead icon={Palette} title={t('appearance')} color="#8b5cf6"/>

                    {/* Dark / Light */}
                    <div style={{ marginBottom:24 }}>
                      <label className="input-label" style={{ marginBottom:12 }}>{t('colorMode')}</label>
                      <div style={{ display:'flex', gap:12 }}>
                        {[
                          { id:'light', icon:Sun,  label:t('lightMode'), sub:t('lightModeSub') },
                          { id:'dark',  icon:Moon, label:t('darkMode'),  sub:t('darkModeSub') },
                        ].map(m => {
                          const isActive = (m.id === 'dark') === dark;
                          return (
                            <motion.div key={m.id} whileTap={{ scale:0.97 }}
                              onClick={() => { if (!isActive) toggleDark(); }}
                              style={{ flex:1, padding:'14px 16px', borderRadius:12, cursor:'pointer',
                                border:`2px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                                background: isActive ? 'var(--primary-glow)' : 'var(--bg-base)',
                                transition:'all 0.22s', display:'flex', alignItems:'center', gap:12 }}>
                              <div style={{ width:36, height:36, borderRadius:10,
                                background: isActive ? 'var(--primary)' : 'var(--bg-hover)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                color: isActive ? 'white' : 'var(--text-muted)', transition:'all 0.22s' }}>
                                <m.icon size={16}/>
                              </div>
                              <div>
                                <div style={{ fontWeight:700, fontSize:13, color:'var(--text-primary)' }}>{m.label}</div>
                                <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{m.sub}</div>
                              </div>
                              {isActive && <Check size={16} style={{ marginLeft:'auto', color:'var(--primary)' }}/>}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Theme color */}
                    <div style={{ marginBottom:24 }}>
                      <label className="input-label" style={{ marginBottom:10 }}>{t('themeColor')}</label>
                      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:12 }}>
                        {THEME_COLORS.map(hex => (
                          <motion.div key={hex} whileTap={{ scale:0.85 }}
                            onClick={() => setColor(hex)}
                            style={{ width:38, height:38, borderRadius:'50%', background:hex, cursor:'pointer',
                              border:`3px solid ${primaryColor===hex ? 'var(--text-primary)' : 'transparent'}`,
                              transition:'all 0.18s', boxShadow:'0 2px 8px rgba(0,0,0,0.18)',
                              transform: primaryColor===hex ? 'scale(1.18)' : 'scale(1)',
                              display:'flex', alignItems:'center', justifyContent:'center' }}>
                            {primaryColor===hex && <Check size={14} color="white" strokeWidth={3}/>}
                          </motion.div>
                        ))}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <input type="color" value={primaryColor} onChange={e => setColor(e.target.value)}
                          style={{ width:42, height:36, border:'1.5px solid var(--border)', borderRadius:8, cursor:'pointer', padding:2 }}/>
                        <span style={{ fontSize:12.5, color:'var(--text-muted)' }}>{t('customColor')}</span>
                        <code style={{ fontSize:12, background:'var(--bg-base)', padding:'3px 9px', borderRadius:6, fontFamily:'monospace', border:'1px solid var(--border)' }}>{primaryColor}</code>
                      </div>
                    </div>

                    {/* Sidebar width */}
                    <div style={{ marginBottom:24 }}>
                      <label className="input-label" style={{ marginBottom:10 }}>{t('sidebarWidth')}</label>
                      <div style={{ display:'flex', gap:10 }}>
                        {[{ id:t('compact'), px:'194px' }, { id:t('normal'), px:'224px' }, { id:t('large'), px:'260px' }].map(w => (
                          <motion.div key={w.id} whileTap={{ scale:0.97 }} onClick={() => setWidth(w.id)}
                            style={{ flex:1, padding:'12px', textAlign:'center', borderRadius:10, cursor:'pointer',
                              border:`2px solid ${sidebarWidth===w.id ? 'var(--primary)' : 'var(--border)'}`,
                              background: sidebarWidth===w.id ? 'var(--primary-glow)' : 'transparent',
                              fontWeight: sidebarWidth===w.id ? 700 : 500, fontSize:13,
                              transition:'all 0.2s', color:'var(--text-primary)' }}>
                            <div>{w.id}</div>
                            <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{w.px}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="alert alert-info" style={{ marginBottom:20 }}>
                       {t('appearanceInfo')}
                    </div>
                    <SaveBtn onClick={saveAppearance} label={t('saveAppearance')}/>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
