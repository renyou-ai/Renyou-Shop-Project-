import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, User, Palette, Globe, Bell, Shield, Camera, Check,
  Sun, Moon, Lock, Eye, EyeOff, ChevronRight, LogOut,
  Smile, Cat, Dog, Bird, Fish, Rabbit, Star, Gem, Flame, MoonStar,
  Flower2, Leaf, Ghost, Bot, Heart, Crown, Sparkles, Zap,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSettings } from "@shared/settings";
import { useThemeValue } from "@shared/theme";
import { THEME_COLORS, LANGUAGES, CURRENCIES } from "../../context/ThemeContext.jsx";
import { api } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.jsx'

const TABS = [
  { id:'profile',     label:'Profile',      icon:User    },
  { id:'appearance',  label:'Appearance',   icon:Palette },
  { id:'preferences', label:'Preferences',  icon:Globe   },
  { id:'notifications', label:'Notifications', icon:Bell  },
  { id:'security',    label:'Security',     icon:Shield  },
]

const AVATARS = [
  'smile', 'ghost', 'bot', 'crown',
  'cat', 'dog', 'bird', 'fish', 'rabbit',
  'flower', 'leaf', 'star', 'gem', 'flame', 'moon', 'heart', 'sparkles', 'zap',
]

const AVATAR_ICONS = {
  smile: Smile, ghost: Ghost, bot: Bot, crown: Crown,
  cat: Cat, dog: Dog, bird: Bird, fish: Fish, rabbit: Rabbit,
  flower: Flower2, leaf: Leaf, star: Star, gem: Gem, flame: Flame,
  moon: MoonStar, heart: Heart, sparkles: Sparkles, zap: Zap,
}

function PasswordInput({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder = "••••••••",
  dark,
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-theme-secondary mb-1.5">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            color: dark ? "#fff" : "#111827",
            backgroundColor: dark ? "#1f2937" : "#fff",
          }}
          className="
            w-full
            pl-10 pr-10
            py-2.5
            border border-theme
            rounded-xl
            text-sm
            focus:outline-none
            focus:border-violet-500
            focus:ring-2
            focus:ring-violet-100
            transition-all
          "
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-theme-secondary"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate()
  const { user, login, logout } = useAuth()
  const { theme, setAppTheme } = useThemeValue();
  const { settings, updateSettings } = useSettings();

  const dark = theme.mode === "dark";
  const color = theme.primaryColor;

  const language = settings.language;
  const currency = settings.currency;
  const toast = useToast()
  const fileRef = useRef(null)

  const [tab,    setTab]    = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState('')
  const [error,  setError]  = useState('')
  const [showPwd, setShowPwd] = useState({ current:false, new:false, confirm:false })

  const [profile, setProfile] = useState({
    username: user?.username || '',
    email:    user?.email    || '',
    phone:    user?.phone    || '',
    avatar:   user?.avatar   || '',
  })

  useEffect(() => {
  if (!user) return;

  setProfile({
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    avatar: user.avatar || "",
  });
}, [user]);

  const [pwd, setPwd] = useState({ current:'', new:'', confirm:'' })
  const [notif, setNotif] = useState(() => {
    try { return JSON.parse(localStorage.getItem('renyou_notif_prefs')) || {
      orderUpdates: true, promotions: true, newsletter: false, restock: true, reviews: false,
    } } catch { return { orderUpdates:true, promotions:true, newsletter:false, restock:true, reviews:false } }
  })

  const initials = (() => {
    const n = user?.username || user?.email || 'U'
    const parts = n.trim().split(/\s+/)
    return parts.length >= 2 ? (parts[0][0]+parts[parts.length-1][0]).toUpperCase() : n.slice(0,2).toUpperCase()
  })()

  const flash = (msg) => { setSaved(msg); toast.success(msg, null, { duration: 2000 }); setTimeout(() => setSaved(''), 2200) }

  const handleFileUpload = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setProfile(p => ({ ...p, avatar: ev.target.result }))
    reader.readAsDataURL(file)
  }

const saveProfile = async () => {
  setSaving(true)
  setError('')

  try {
    console.log("==================================");
    console.log("PROFILE BEFORE SAVE =", profile);
    console.log("USER FROM AUTH =", user);
    console.log("==================================");

    const updated = await api.updateMe(profile);

    console.log("==================================");
    console.log("UPDATED USER =", updated);
    console.log("TOKEN =", localStorage.getItem("token"));
    console.log("==================================");

    login(updated);
    flash("Profile updated successfully !");
  } catch (e) {
    console.error(e);
    setError(e.message || "Failed to save");
  } finally {
    setSaving(false);
  }
};

  const changePwd = async () => {
    if (!pwd.current)            { setError('Enter your current password'); return }
    if (pwd.new !== pwd.confirm) { setError('Passwords do not match'); return }
    if (pwd.new.length < 6)      { setError('Minimum 6 characters'); return }
    setSaving(true); setError('')
    try {
      await api.changePassword({ currentPassword: pwd.current, newPassword: pwd.new })
      setPwd({ current:'', new:'', confirm:'' })
      flash('Password updated !')
    } catch (e) { setError(e.message || 'Incorrect current password') }
    finally { setSaving(false) }
  }

  const saveNotif = (key, val) => {
    const next = { ...notif, [key]: val }
    setNotif(next)
    localStorage.setItem('renyou_notif_prefs', JSON.stringify(next))
    flash('Preferences saved !')
  }

const Toggle = ({ checked, onChange }) => (
<button
  onClick={onChange}
  className="w-11 h-6 rounded-full relative flex-shrink-0 transition-all duration-300"
  style={{
    background: checked
      ? "var(--primary-color)"
      : "var(--color-border)",
    boxShadow: checked
      ? "0 0 12px color-mix(in srgb, var(--primary-color) 40%, transparent)"
      : "none",
  }}
>
    <motion.div
      layout
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className={`absolute top-0.5 w-5 h-5 rounded-full shadow ${
        checked ? "left-[22px]" : "left-0.5"
      }`}
style={{
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
}}
    />
  </button>
)

const Row = ({ label, sub, children }) => (
<div
  className="settings-row flex items-center justify-between py-4 border-b transition-all duration-300"
  style={{
    borderColor: "var(--color-border)",
  }}
>
    <div>
      <h3
        style={{
          color: "var(--color-text)",
        }}
      >
        {label}
      </h3>

      <p
        style={{
          color: "var(--color-text-secondary)",
        }}
      >
        {sub}
      </p>
    </div>

    {children}
  </div>
);

  return (
    <div className="min-h-screen bg-theme">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl border border-theme surface-theme flex items-center justify-center hover:border-violet-400 transition-all">
            <ArrowLeft size={16} className="text-theme-secondary"/>
          </button>
          <div>
            <h1 className="text-2xl font-urbanist font-bold text-theme">Settings</h1>
            <p className="text-sm text-theme-secondary">Manage your account preferences</p>
          </div>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
              <Check size={14}/> {saved}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6 items-start flex-col sm:flex-row">

          {/* Tabs nav */}
          <div className="w-full sm:w-52 flex-shrink-0 surface-theme rounded-2xl border border-theme shadow-sm p-2 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible scrollbar-hide">
            {TABS.map(t => (
<motion.button
  key={t.id}
  onClick={() => {
    setTab(t.id)
    setError("")
  }}
  whileHover={
    tab !== t.id
      ? {
          x: 4,
          scale: 1.02,
        }
      : {}
  }
  whileTap={{ scale: 0.98 }}
  transition={{
    type: "spring",
    stiffness: 450,
    damping: 28,
  }}
  className={`
    group
    relative
    flex items-center gap-2.5
    px-3.5 py-2.5
    rounded-xl
    text-sm font-medium
    whitespace-nowrap
    flex-shrink-0
    border border-transparent
    transition-colors duration-300
    ${
      tab === t.id
        ? "shadow-lg shadow-violet-500/20"
        : ""
    }
  `}
  style={{
    background:
      tab === t.id
        ? "var(--primary-color)"
        : "transparent",

    color:
      tab === t.id
        ? "#fff"
        : "var(--color-text)",

    boxShadow:
      tab === t.id
        ? "0 10px 28px rgba(124,58,237,.25)"
        : "none",
  }}
>
  <t.icon
    size={15}
    className="transition-transform duration-300 group-hover:scale-110"
  />

  <span>{t.label}</span>
</motion.button>
            ))}
            <div className="hidden sm:block border-t border-theme mt-2 pt-2">
              <button onClick={() => { logout(); navigate('/login') }}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 transition-all w-full"
style={{
  background: "transparent",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background = "rgba(239,68,68,.10)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background = "transparent";
}}>
                <LogOut size={15}/> Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 surface-theme rounded-2xl border border-theme shadow-sm p-6 min-w-0 w-full">
            <AnimatePresence mode="wait">

              {/* ── PROFILE ── */}
              {tab === 'profile' && (
                <motion.div key="profile" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="space-y-5">
                  <h2 className="text-base font-bold text-theme">Profile Information</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        {profile.avatar
                          ? (profile.avatar.startsWith('data:') || profile.avatar.startsWith('http')
                              ? <img src={profile.avatar} alt="" className="w-full h-full object-cover"/>
                              : (() => {
                                  const AvatarIcon = AVATAR_ICONS[profile.avatar]
                                  return AvatarIcon
                                    ? <AvatarIcon size={36} className="text-white" strokeWidth={1.6}/>
                                    : <span className="text-2xl font-bold text-white">{initials}</span>
                                })())
                          : <span className="text-2xl font-bold text-white">{initials}</span>}
                      </div>
                      <button onClick={() => fileRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-7 h-7 surface-theme rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-all border border-theme">
                        <Camera size={12} className="text-violet-600"/>
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload}/>
                    </div>
                    <div>
<p
  className="text-sm font-semibold"
  style={{ color: "var(--color-text)" }}
>
  {user?.username}
</p>

<p
  className="text-xs"
  style={{ color: "var(--color-text-secondary)" }}
>
  {user?.email}
</p>
                    </div>
                  </div>

                  {/* Avatar presets */}
<div>
  <label className="text-xs font-semibold text-theme-secondary mb-2 block">
    Choose an avatar
  </label>

  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
    <button
      onClick={() => setProfile(p => ({ ...p, avatar: "" }))}
      className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
        !profile.avatar ? "ring-2 ring-violet-500" : ""
      }`}
      style={{
        background: !profile.avatar
          ? "rgba(var(--color-primary-rgb),0.12)"
          : "var(--color-surface)",
        color: !profile.avatar
          ? "var(--color-primary)"
          : "var(--color-text-secondary)",
      }}
    >
      {initials}
    </button>

{AVATARS.map(a => {
  const AvatarIcon = AVATAR_ICONS[a]

  return (
    <button
      key={a}
      onClick={() => setProfile(p => ({ ...p, avatar: a }))}
      className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
        profile.avatar === a ? "ring-2 ring-violet-500" : ""
      }`}
      style={{
        background:
          profile.avatar === a
            ? "rgba(var(--color-primary-rgb),0.12)"
            : "var(--color-surface)",
        color:
          profile.avatar === a
            ? "var(--color-primary)"
            : "var(--color-text-secondary)",
      }}
    >
      <AvatarIcon size={18} strokeWidth={1.8} />
    </button>
  )
})}
  </div>
</div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-theme-secondary mb-1.5">Username</label>
                      <input value={profile.username} onChange={e=>setProfile(p=>({...p,username:e.target.value}))}
style={{
  color: dark ? "#fff" : "#111827",
  backgroundColor: dark ? "#1f2937" : "#fff",
  fontWeight: 500,
  letterSpacing: "0.01em",
}}
className="
  w-full px-3.5 py-2.5
  border border-theme
  rounded-xl
  text-sm
  font-medium
  placeholder:text-gray-400
  focus:outline-none
  focus:border-violet-500
  focus:ring-2
  focus:ring-violet-100
"
/>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-theme-secondary mb-1.5">Email</label>
                      <input type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))}
                        style={{
    color: dark ? "#fff" : "#111827",
    backgroundColor: dark ? "#1f2937" : "#fff",
  }}
  className="
    w-full px-3.5 py-2.5
    border border-theme
    rounded-xl
    text-sm
    focus:outline-none
    focus:border-violet-500
    focus:ring-2
    focus:ring-violet-100
  "
/>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-theme-secondary mb-1.5">Phone Number</label>
                      <input type="tel" value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))}
                        placeholder="+216 XX XXX XXX"
                        style={{
    color: dark ? "#fff" : "#111827",
    backgroundColor: dark ? "#1f2937" : "#fff",
  }}
  className="
    w-full px-3.5 py-2.5
    border border-theme
    rounded-xl
    text-sm
    focus:outline-none
    focus:border-violet-500
    focus:ring-2
    focus:ring-violet-100
  "
/>
                    </div>
                  </div>

                  <motion.button whileTap={{ scale:0.97 }} onClick={saveProfile} disabled={saving}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all text-sm flex items-center gap-2 disabled:opacity-60">
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Check size={15}/>}
                    Save Changes
                  </motion.button>
                </motion.div>
              )}

              {/* ── APPEARANCE ── */}
              {tab === 'appearance' && (
                <motion.div key="appearance" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="space-y-6">
                  <h2 className="text-base font-bold text-theme">Appearance</h2>

                  {/* Mode */}
                  <div>
                    <label className="text-xs font-semibold text-theme-secondary mb-3 block">Display Mode</label>
                    <div className="grid grid-cols-2 gap-3">
<motion.button
  whileHover={{
    y: -4,
    scale: 1.03,
  }}
  whileTap={{
    scale: 0.98,
  }}
  transition={{
    type: "spring",
    stiffness: 450,
    damping: 28,
  }}
  onClick={async () => {
    if (!dark) return
    try {
      setAppTheme({ mode: "light" })
    } catch (e) {
      toast.error(e.message || "Failed to update display mode")
    }
  }}
  className={`group relative overflow-hidden flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
    !dark ? "border-violet-500" : "border-theme"
  }`}
  style={{
    background: !dark
      ? "rgba(var(--color-primary-rgb),0.12)"
      : "var(--color-surface)",
    boxShadow: !dark
      ? "0 10px 25px rgba(124,58,237,.18)"
      : "var(--shadow-sm)",
  }}
>
  <Sun
    size={24}
    className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
    style={{
      color: !dark
        ? "var(--color-primary)"
        : "var(--color-text-secondary)",
    }}
  />

  <span
    className="text-sm font-semibold transition-all duration-300 group-hover:tracking-wide"
    style={{
      color: !dark
        ? "var(--color-primary)"
        : "var(--color-text-secondary)",
    }}
  >
    Light
  </span>
</motion.button>
<motion.button
  whileHover={{
    y: -4,
    scale: 1.03,
  }}
  whileTap={{
    scale: 0.98,
  }}
  transition={{
    type: "spring",
    stiffness: 450,
    damping: 28,
  }}
  onClick={async () => {
    if (dark) return
    try {
      setAppTheme({ mode: "dark" })
    } catch (e) {
      toast.error(e.message || "Failed to update display mode")
    }
  }}
  className={`group relative overflow-hidden flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
    dark ? "border-violet-500" : "border-theme"
  }`}
  style={{
    background: dark
      ? "rgba(var(--color-primary-rgb),0.12)"
      : "var(--color-surface)",
    boxShadow: dark
      ? "0 10px 25px rgba(124,58,237,.18)"
      : "var(--shadow-sm)",
  }}
>
  <Moon
    size={24}
    className="transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6"
    style={{
      color: dark
        ? "var(--color-primary)"
        : "var(--color-text-secondary)",
    }}
  />

  <span
    className="text-sm font-semibold transition-all duration-300 group-hover:tracking-wide"
    style={{
      color: dark
        ? "var(--color-primary)"
        : "var(--color-text-secondary)",
    }}
  >
    Dark
  </span>
</motion.button>
                    </div>
                  </div>

                  {/* Theme color */}
                  <div>
                    <label className="text-xs font-semibold text-theme-secondary mb-3 block">Theme Color</label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                      {THEME_COLORS.map(c => (
                        <button key={c.id} onClick={async () => {
                          try { setAppTheme({
  primaryColor: c.hex,
}); }
                          catch (e) { toast.error(e.message || 'Failed to update theme color') }
                        }}
                          className="relative aspect-square rounded-2xl transition-all hover:scale-105"
                          style={{ backgroundColor: c.hex }}>
                          {color === c.hex && (
                            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full surface-theme/30 flex items-center justify-center">
                                <Check size={14} className="text-white" strokeWidth={3}/>
                              </div>
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Accent color used across buttons and highlights.</p>
                  </div>

                  {/* Preview */}
<div
  className="p-4 rounded-2xl border border-theme"
  style={{
    background: "var(--color-surface)",
  }}
>
  <p
    className="text-xs font-semibold mb-3"
    style={{ color: "var(--color-text-secondary)" }}
  >
    Preview
  </p>

  <div className="flex items-center gap-3 flex-wrap">
    <button
      className="px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-sm"
      style={{ backgroundColor: color }}
    >
      Primary Button
    </button>

    <span
      className="text-sm font-semibold"
      style={{ color }}
    >
      Accent Text
    </span>

    <div
      className="w-8 h-8 rounded-full"
      style={{ backgroundColor: color }}
    />
  </div>
</div>
                </motion.div>
              )}

              {/* ── PREFERENCES ── */}
              {tab === 'preferences' && (
                <motion.div key="preferences" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="space-y-6">



                  {/* Currency */}
                  <div>
                    <label
  className="text-base font-bold mb-3 block"
  style={{
    color: "var(--color-text)",
  }}
>
  Currency
</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CURRENCIES.map(c => (

<button
  key={c.code}
onClick={async () => {
  try {
    await updateSettings({
      currency: c.code,
    });

    flash("Currency updated !");
  } catch (e) {
    toast.error(e.message || "Failed to update currency");
  }
}}
className={`flex items-center justify-between px-3.5 py-3 rounded-xl border-2 transition-all ${
  currency === c.code
    ? "border-violet-500"
    : "border-theme"
}`}
style={{
  background:
    currency === c.code
      ? "rgba(var(--color-primary-rgb),0.12)"
      : "var(--color-surface)",
}}>
                          <div className="flex items-center gap-2.5">
                            <span
  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
  style={{
    background: "var(--color-background)",
    color: "var(--color-text-secondary)",
  }}
>
  {c.symbol}
</span>
                            <div className="text-left">
<div
  className="text-sm font-semibold"
  style={{
    color:
      currency === c.code
        ? "var(--color-primary)"
        : "var(--color-text)",
  }}
>
  {c.code}
</div>

<div
  className="text-[11px]"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
  {c.label}
</div>
                            </div>
                          </div>
                          {currency === c.code && (
  <Check
    size={14}
    style={{ color: "var(--color-primary)" }}
  />
)}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── NOTIFICATIONS ── */}
              {tab === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
<h2
  className="text-base font-bold mb-2"
  style={{
    color: "var(--color-text)",
  }}
>
  Notification Preferences
</h2>

<p
  className="text-xs mb-4"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
  Choose what updates you'd like to receive.
</p>
                  <div>
                    <Row label="Order Updates" sub="Shipping, delivery & order status changes">
                      <Toggle checked={notif.orderUpdates} onChange={() => saveNotif('orderUpdates', !notif.orderUpdates)}/>
                    </Row>
                    <Row label="Promotions & Offers" sub="Discounts, sales and special deals">
                      <Toggle checked={notif.promotions} onChange={() => saveNotif('promotions', !notif.promotions)}/>
                    </Row>
                    <Row label="Restock Alerts" sub="Notify when wishlist items are back in stock">
                      <Toggle checked={notif.restock} onChange={() => saveNotif('restock', !notif.restock)}/>
                    </Row>
                    <Row label="Product Reviews" sub="Reminders to review purchased items">
                      <Toggle checked={notif.reviews} onChange={() => saveNotif('reviews', !notif.reviews)}/>
                    </Row>
                    <Row label="Newsletter" sub="Tips, new arrivals & skincare guides">
                      <Toggle checked={notif.newsletter} onChange={() => saveNotif('newsletter', !notif.newsletter)}/>
                    </Row>
                  </div>
                </motion.div>
              )}

              {/* ── SECURITY ── */}
              {tab === 'security' && (
                <motion.div key="security" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="space-y-5">
                  <h2 className="text-base font-bold text-theme">Security</h2>
                  <div className="space-y-4">
{[
  { key: "current", label: "Current Password" },
  { key: "new", label: "New Password" },
  { key: "confirm", label: "Confirm New Password" },
].map((f) => (
  <PasswordInput
    key={f.key}
    label={f.label}
    value={pwd[f.key]}
    onChange={(e) =>
      setPwd((p) => ({
        ...p,
        [f.key]: e.target.value,
      }))
    }
    show={showPwd[f.key]}
    onToggle={() =>
      setShowPwd((p) => ({
        ...p,
        [f.key]: !p[f.key],
      }))
    }
    dark={dark}
  />
))}
                  </div>
                  <motion.button whileTap={{ scale:0.97 }} onClick={changePwd} disabled={saving}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all text-sm flex items-center gap-2 disabled:opacity-60">
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Lock size={15}/>}
                    Update Password
                  </motion.button>

                  <div className="pt-5 border-t border-theme sm:hidden">
                    <button onClick={() => { logout(); navigate('/login') }}
                      className="w-full py-2.5 border border-red-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-all text-sm flex items-center justify-center gap-2">
                      <LogOut size={14}/> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}