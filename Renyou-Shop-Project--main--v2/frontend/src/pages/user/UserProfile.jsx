import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Camera, Check, Package, Heart, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { api } from '../../services/api.js'
import { useEffect } from "react";
import {
  Smile,
  Ghost,
  Bot,
  Crown,
  Cat,
  Dog,
  Bird,
  Fish,
  Rabbit,
  Flower2,
  Leaf,
  Star,
  Gem,
  Flame,
  MoonStar,
  Sparkles,
  Zap,
  ShoppingCart
} from "lucide-react";

const TABS = [
  { id:'profile',  label:'Profile',  icon:User    },
  { id:'security', label:'Security', icon:Lock    },
]

const AVATAR_ICONS = {
  smile: Smile,
  ghost: Ghost,
  bot: Bot,
  crown: Crown,
  cat: Cat,
  dog: Dog,
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit,
  flower: Flower2,
  leaf: Leaf,
  star: Star,
  gem: Gem,
  flame: Flame,
  moon: MoonStar,
  heart: Heart,
  sparkles: Sparkles,
  zap: Zap,
};

export default function UserProfile() {
  const navigate  = useNavigate()
  const { user, login, logout } = useAuth()
  console.log("USER =", user)
console.log("AVATAR =", user?.avatar)
  const { count: cartCount }    = useCart()
  const { count: wishCount }    = useWishlist()

  const [tab,      setTab]      = useState('profile')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState('')
  const [showPwd,  setShowPwd]  = useState({ current:false, new:false, confirm:false })
  const fileRef = useRef(null)

  const [profile, setProfile] = useState({
    username: user?.username || '',
    email:    user?.email    || '',
    phone:    user?.phone    || '',
    avatar:   user?.avatar   || '',
  })
  console.log(profile.avatar)

  const [pwd, setPwd] = useState({ current:'', new:'', confirm:'' })

  const initials = (() => {
    const n = user?.username || user?.email || 'U'
    const parts = n.trim().split(/\s+/)
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length-1][0]).toUpperCase()
      : n.slice(0,2).toUpperCase()
  })()

  const AvatarIcon =
  AVATAR_ICONS[profile.avatar] || null;

  const handleFileUpload = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setProfile(p => ({...p, avatar: ev.target.result}))
    reader.readAsDataURL(file)
  }

  const saveProfile = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const updated = await api.updateProfile(profile)
      login(updated, localStorage.getItem('token'))
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) { setError(e.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  useEffect(() => {
  if (!user) return;

  setProfile({
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    avatar: user.avatar || "",
  });
}, [user]);

  const changePwd = async () => {
    if (!pwd.current)               { setError('Enter your current password'); return }
    if (pwd.new !== pwd.confirm)    { setError('Passwords do not match'); return }
    if (pwd.new.length < 6)         { setError('Minimum 6 characters'); return }
    setSaving(true); setError(''); setSaved(false)
    try {
      await api.changePassword({ currentPassword: pwd.current, newPassword: pwd.new })
      setSaved(true)
      setPwd({ current:'', new:'', confirm:'' })
      setTimeout(() => setSaved(false), 2500)
    } catch (e) { setError(e.message || 'Incorrect current password') }
    finally { setSaving(false) }
  }

  const InputField = ({ label, type='text', value, onChange, placeholder, right }) => (
    <div>
      <label
  className="block text-xs font-semibold mb-1.5"
  style={{ color: "var(--color-text-secondary)" }}
>{label}</label>
      <div className="relative">
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20"
style={{
  background: "var(--color-input-bg)",
  color: "var(--color-text)",
  border: "1px solid var(--color-border)",
}}
onFocus={(e) => {
  e.target.style.background = "var(--color-surface)";
  e.target.style.borderColor = "var(--accent)";
  e.target.style.boxShadow =
    "0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent)";
}}

onBlur={(e) => {
  e.target.style.background = "var(--color-input-bg)";
  e.target.style.borderColor = "var(--color-border)";
  e.target.style.boxShadow = "none";
}}
/>
        {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  )

  return (
<div
  className="min-h-screen relative overflow-hidden"
  style={{
    background: "var(--color-background)",
    color: "var(--color-text)",
  }}
>
  {/* Background Blobs */}
  <div
    className="pointer-events-none absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full"
    style={{
      background:
        "radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent) 0%, transparent 70%)",
      filter: "blur(60px)",
    }}
  />

  <div
    className="pointer-events-none absolute bottom-[-160px] right-[-120px] w-[380px] h-[380px] rounded-full"
    style={{
      background:
        "radial-gradient(circle, color-mix(in srgb, #8b5cf6 16%, transparent) 0%, transparent 70%)",
      filter: "blur(80px)",
    }}
  />

  <div className="relative z-10">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
<button
  onClick={() => navigate(-1)}
  className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
  style={{
    background: "var(--color-surface)",
    borderColor: "var(--color-border)",
    color: "var(--color-text)",
  }}
>
  <ArrowLeft size={16} />
</button>
<h1
  className="text-2xl font-urbanist font-bold"
  style={{ color: "var(--color-text)" }}
>
  My Account
</h1>
        </div>

        {/* Profile hero */}
<div
  className="rounded-3xl p-6 mb-6 relative overflow-hidden"
  style={{
    background:
      "linear-gradient(135deg, color-mix(in srgb, var(--accent) 14%, var(--color-surface)) 0%, var(--color-surface) 45%, color-mix(in srgb, var(--accent) 8%, var(--color-surface)) 100%)",
    border: "1px solid color-mix(in srgb, var(--accent) 18%, var(--color-border))",
    color: "var(--color-text)",
    boxShadow: "0 12px 40px rgba(124,58,237,.10)",
  }}
>
  <div
  className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl pointer-events-none"
  style={{
    background:
      "color-mix(in srgb, var(--accent) 22%, transparent)",
  }}
/>

<div
  className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full blur-3xl pointer-events-none"
  style={{
    background:
      "color-mix(in srgb, #ffffff 12%, transparent)",
  }}
/>
          <div className="flex items-center gap-5">
            <div className="relative">
<div
  className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
  style={{
    background: "var(--color-surface-secondary)",
    border: "2px solid var(--color-border)",
  }}
>

  {profile.avatar?.startsWith("data:") ||
   profile.avatar?.startsWith("http") ? (

    <img
      src={profile.avatar}
      alt=""
      className="w-full h-full object-cover"
    />

  ) : AvatarIcon ? (

<AvatarIcon
  size={42}
  strokeWidth={2.1}
  style={{ color: "var(--color-text)" }}
  className="transition-all duration-300"
/>

  ) : (

    <span
  className="text-2xl font-bold"
  style={{ color: "var(--color-text)" }}
>
      {initials}
    </span>

  )}

</div>
<button
  onClick={() => fileRef.current?.click()}
  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
  style={{
    background:
      "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
    color: "#fff",
    border: "2px solid var(--color-surface)",
    boxShadow: "0 8px 20px rgba(124,58,237,.25)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.12)";
    e.currentTarget.style.boxShadow =
      "0 12px 28px rgba(124,58,237,.35)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow =
      "0 8px 20px rgba(124,58,237,.25)";
  }}
>
  <Camera size={14} />
</button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload}/>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-urbanist font-bold truncate">{user?.username || 'User'}</h2>
              <p
  className="text-sm truncate"
  style={{ color: "var(--color-text-secondary)" }}
>{user?.email}</p>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <button onClick={() => navigate('/cart')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-all">
                  <Package size={12}/> {cartCount} in cart
                </button>
                <button onClick={() => navigate('/wishlist')} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-all">
                  <Heart size={12}/> {wishCount} saved
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}

<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
  {[
    {
      icon: Package,
      label: "My Orders",
      action: () => navigate("/user/orders"),
    },
    {
      icon: Heart,
      label: "Wishlist",
      action: () => navigate("/user/wishlist"),
    },
    {
      icon: ShoppingCart,
      label: "Cart",
      action: () => navigate("/user/cart"),
    },
  ].map((a) => (
    <button
      key={a.label}
      onClick={a.action}
className="
  flex items-center gap-3 p-4
  rounded-2xl
  transition-all duration-300
  group text-left
"
style={{
  background:
    "linear-gradient(180deg, var(--color-surface) 0%, color-mix(in srgb, var(--accent) 3%, var(--color-surface)) 100%)",
  border:
    "1px solid color-mix(in srgb, var(--accent) 10%, var(--color-border))",
  boxShadow: "0 8px 24px rgba(124,58,237,.05)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.borderColor = "var(--accent)";
  e.currentTarget.style.transform = "translateY(-3px)";
  e.currentTarget.style.boxShadow = "0 16px 35px rgba(124,58,237,.15)";
}}

onMouseLeave={(e) => {
  e.currentTarget.style.borderColor =
    "color-mix(in srgb, var(--accent) 10%, var(--color-border))";
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,58,237,.05)";
}}
    >
      <div
className="
  w-11 h-11
  rounded-xl
  flex items-center justify-center
  transition-all duration-300
  group-hover:scale-105
"
style={{
  background: "color-mix(in srgb, var(--accent) 12%, transparent)",
  border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
}}
      >
        <a.icon
          size={20}
className="
  transition-all duration-300
  group-hover:scale-110
"
style={{
  color: "var(--accent)",
}}
        />
      </div>

      <span
className="text-sm font-semibold transition-colors duration-300"
style={{
  color: "var(--color-text)",
}}
      >
        {a.label}
      </span>
    </button>
  ))}
</div>

        {/* Tabs */}
<div
  className="rounded-3xl overflow-hidden"
  style={{
    background:
      "linear-gradient(180deg, var(--color-surface) 0%, color-mix(in srgb, var(--accent) 2%, var(--color-surface)) 100%)",
    border:
      "1px solid color-mix(in srgb, var(--accent) 10%, var(--color-border))",
    boxShadow: "0 14px 35px rgba(124,58,237,.08)",
  }}
>
<div
  className="flex gap-3 p-2 rounded-2xl"
  style={{
    background:
      "color-mix(in srgb, var(--accent) 8%, var(--color-surface))",
    border: "1px solid color-mix(in srgb, var(--accent) 18%, var(--color-border))",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,.05)",
  }}
>
            {TABS.map(t => (
<button
  key={t.id}
  onClick={() => {
    setTab(t.id);
    setError("");
    setSaved(false);
  }}
  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all duration-300"
  style={{
background:
  tab === t.id
    ? "linear-gradient(135deg,#FDBA74 0%, #FED7AA 100%)"
    : "transparent",

    color:
      tab === t.id
        ? "#fff"
        : "var(--color-text-secondary)",

border:
  tab === t.id
    ? "1px solid rgba(251,191,36,.45)"
    : "1px solid transparent",

boxShadow:
  tab === t.id
    ? "0 12px 30px rgba(251,146,60,.25)"
    : "none",

    transform:
      tab === t.id
        ? "translateY(-1px)"
        : "translateY(0)",
  }}
  onMouseEnter={(e) => {
    if (tab !== t.id) {
e.currentTarget.style.background =
  "rgba(251,191,36,.10)";
      e.currentTarget.style.color = "#F59E0B";
    }
  }}
  onMouseLeave={(e) => {
    if (tab !== t.id) {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "var(--color-text-secondary)";
    }
  }}
>
  <t.icon
    size={18}
    style={{
      color: tab === t.id ? "#fff" : "currentColor",
    }}
  />

  <span className="font-semibold text-[15px]">
    {t.label}
  </span>
</button>
            ))}
          </div>

          <div className="p-6">
            {error && (
  <div
    className="mb-4 p-3 text-sm rounded-xl"
    style={{
      background: "color-mix(in srgb, #ef4444 12%, var(--color-surface))",
      border: "1px solid color-mix(in srgb, #ef4444 35%, transparent)",
      color: "#ef4444",
    }}
  >
    {error}
  </div>
)}
            {saved && (
  <div
    className="mb-4 p-3 text-sm rounded-xl flex items-center gap-2"
    style={{
      background: "color-mix(in srgb, #10b981 12%, var(--color-surface))",
      border: "1px solid color-mix(in srgb, #10b981 35%, transparent)",
      color: "#10b981",
    }}
  >
    <Check size={14} />
    Saved successfully!
  </div>
)}

            {/* Profile tab */}
            {tab === 'profile' && (
              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="space-y-4">
                <InputField label="Username" value={profile.username} onChange={e => setProfile(p=>({...p,username:e.target.value}))} placeholder="Your name"/>
                <InputField label="Email" type="email" value={profile.email} onChange={e => setProfile(p=>({...p,email:e.target.value}))} placeholder="you@example.com"/>
                <InputField label="Phone" type="tel" value={profile.phone} onChange={e => setProfile(p=>({...p,phone:e.target.value}))} placeholder="+216 XX XXX XXX"/>
                <motion.button whileTap={{ scale:0.97 }} onClick={saveProfile} disabled={saving}
                  className="w-full py-3 text-white font-bold rounded-2xl transition-all duration-300 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
style={{
  background:
    "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 45%, #6366f1 100%)",
  boxShadow: "0 10px 28px rgba(124,58,237,.25)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow =
    "0 18px 40px rgba(124,58,237,.35)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow =
    "0 10px 28px rgba(124,58,237,.25)";
}}>
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Check size={15}/> Save Profile</>}
                </motion.button>
              </motion.div>
            )}

            {/* Security tab */}
            {tab === 'security' && (
              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="space-y-4">
                {[
                  { key:'current', label:'Current Password'  },
                  { key:'new',     label:'New Password'      },
                  { key:'confirm', label:'Confirm Password'  },
                ].map(f => (
                  <div key={f.key}>
                    <label
  className="block text-xs font-semibold mb-1.5"
  style={{ color: "var(--color-text-secondary)" }}
>{f.label}</label>
                    <div className="relative">
                      <Lock
  size={14}
  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
  style={{ color: "var(--color-text-secondary)" }}
/>
                      <input
                        type={showPwd[f.key] ? 'text' : 'password'}
                        value={pwd[f.key]}
                        onChange={e => setPwd(p=>({...p,[f.key]:e.target.value}))}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none"
style={{
  background: "var(--color-input-bg)",
  color: "var(--color-text)",
  border: "1px solid var(--color-border)",
}}
onFocus={(e) => {
  e.target.style.background = "var(--color-surface)";
  e.target.style.borderColor = "var(--accent)";
  e.target.style.boxShadow =
    "0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent)";
}}

onBlur={(e) => {
  e.target.style.background = "var(--color-input-bg)";
  e.target.style.borderColor = "var(--color-border)";
  e.target.style.boxShadow = "none";
}}
                      />
                      <button type="button" onClick={() => setShowPwd(p=>({...p,[f.key]:!p[f.key]}))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
style={{
  color: "var(--color-text-secondary)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.color = "var(--accent)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.color = "var(--color-text-secondary)";
}}>
                        {showPwd[f.key] ? <EyeOff size={14}/> : <Eye size={14}/>}
                      </button>
                    </div>
                  </div>
                ))}
                <motion.button whileTap={{ scale:0.97 }} onClick={changePwd} disabled={saving}
                  className="w-full py-3 text-white font-bold rounded-2xl transition-all duration-300 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
style={{
  background:
    "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 45%, #6366f1 100%)",
  boxShadow: "0 10px 28px rgba(124,58,237,.25)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow =
    "0 18px 40px rgba(124,58,237,.35)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow =
    "0 10px 28px rgba(124,58,237,.25)";
}}>
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Lock size={15}/> Update Password</>}
                </motion.button>
                <div
  className="pt-4"
  style={{
    borderTop: "1px solid var(--color-border)",
  }}
>
                  <button onClick={() => { logout(); navigate('/login') }}
                    className="w-full py-2.5 font-semibold rounded-xl transition-all text-sm"
style={{
  border: "1px solid color-mix(in srgb, #ef4444 30%, var(--color-border))",
  color: "#ef4444",
  background:
    "linear-gradient(180deg, transparent, color-mix(in srgb, #ef4444 3%, transparent))",
  boxShadow: "0 6px 18px rgba(239,68,68,.06)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background =
    "color-mix(in srgb, #ef4444 10%, var(--color-surface))";
  e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow = "0 12px 30px rgba(239,68,68,.15)";
}}

onMouseLeave={(e) => {
  e.currentTarget.style.background =
    "linear-gradient(180deg, transparent, color-mix(in srgb, #ef4444 3%, transparent))";
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 6px 18px rgba(239,68,68,.06)";
}}>
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
          </div>
  )
}
