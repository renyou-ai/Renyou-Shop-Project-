import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useState, useRef, useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";

/* ═══════════════════════════════════════════
   TOAST SYSTEM — fixed: no stacking, proper dismiss
═══════════════════════════════════════════ */

const TOAST_DURATION = 3500;

const TOAST_COLORS = {
  success: { border: "#10b981", icon: "#10b981", bar: "#10b981" },
  error:   { border: "#ef4444", icon: "#ef4444", bar: "#ef4444" },
  info:    { border: "#8b5cf6", icon: "#8b5cf6", bar: "#8b5cf6" },
  loading: { border: "#8b5cf6", icon: "#8b5cf6", bar: "#8b5cf6" },
};

const TOAST_ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><circle cx="12" cy="8" r="0.5" fill="currentColor"/>
    </svg>
  ),
  loading: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="toast-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
};

function ToastItem({ toast, onDismiss }) {
  const c = TOAST_COLORS[toast.type] || TOAST_COLORS.info;
  const isLoading = toast.type === "loading";

  return (
    <div
      className="toast-enter"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--color-surface)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: `1px solid ${c.border}40`,
        borderLeft: `3px solid ${c.border}`,
        borderRadius: 10,
        padding: "11px 13px",
        boxShadow: "var(--shadow-lg)",
        position: "relative",
        overflow: "hidden",
        cursor: isLoading ? "default" : "pointer",
        pointerEvents: "all",
        minWidth: 0,
      }}
      onClick={isLoading ? undefined : () => onDismiss(toast.id)}
    >
      {/* Icon */}
      <div style={{
        color: c.icon,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28, height: 28,
        background: `${c.icon}14`,
        borderRadius: 7,
      }}>
        {TOAST_ICONS[toast.type]}
      </div>

      {/* Message */}
      <p style={{
        margin: 0, flex: 1,
        color: "var(--color-text)",
        fontSize: 13,
        fontWeight: 450,
        lineHeight: 1.4,
        fontFamily: "system-ui, -apple-system, sans-serif",
        letterSpacing: "0.01em",
      }}>
        {toast.message}
      </p>

      {/* Dismiss X — only for non-loading */}
      {!isLoading && (
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(toast.id); }}
          style={{
            background: "none", border: "none",
            color: "var(--color-text-secondary)",
            cursor: "pointer", padding: "0 2px",
            fontSize: 17, lineHeight: 1, flexShrink: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
  e.target.style.color = "var(--color-text)";
}}
          onMouseLeave={(e) => {
  e.target.style.color = "var(--color-text-secondary)";
}}
        >×</button>
      )}

      {/* Progress bar — only for non-loading */}
      {!isLoading && (
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          height: 2, background: c.bar,
          width: "100%",
          animation: `toastProgress ${TOAST_DURATION}ms linear forwards`,
          transformOrigin: "left",
        }}/>
      )}
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(calc(100% + 24px)); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastProgress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
        @keyframes toastSpin {
          to { transform: rotate(360deg); }
        }
        .toast-enter {
          animation: toastSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .toast-spin {
          animation: toastSpin 0.9s linear infinite;
        }
      `}</style>
      <div style={{
        position: "fixed",
        top: 20, right: 20,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: 320,
        maxWidth: "calc(100vw - 40px)",
        pointerEvents: "none",
      }}>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </div>
    </>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Show a toast — returns its id so you can dismiss it manually (useful for loading)
  const show = useCallback((message, type = "success") => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);

    // loading toasts don't auto-dismiss — caller must dismiss manually
    if (type !== "loading") {
      timers.current[id] = setTimeout(() => dismiss(id), TOAST_DURATION);
    }
    return id;
  }, [dismiss]);

  return { toasts, show, dismiss };
}

/* ═══════════════════════════════════════════
   MAIN LOGIN COMPONENT
═══════════════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();
  const { toasts, show, dismiss } = useToast();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused]   = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  /* ── NORMAL LOGIN ── */
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      show("Please fill in all fields.", "error");
      return;
    }
    if (loading) return;
    setLoading(true);

    const loadingId = show("Signing you in…", "loading");

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      console.log("LOGIN USER =", res.data.user);

localStorage.setItem("renyou_token", res.data.token);

localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));
login(res.data.user);
console.log("TOKEN =", localStorage.getItem("token"));
console.log("USER =", localStorage.getItem("user"));

localStorage.setItem("renyou_token", res.data.token);
localStorage.setItem("renyou_user", JSON.stringify(res.data.user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      window.dispatchEvent(new Event("storage"));

      if (rememberMe) localStorage.setItem("rememberEmail", email);
      else localStorage.removeItem("rememberEmail");

      dismiss(loadingId);
      show(`Welcome back !`, "success");

      setTimeout(() => {

  const role = res.data.user?.role;

  if (
    ["admin", "Admin", "Super Admin"].includes(role)
  ) {
    window.location.href = "http://localhost:5174/dashboard";
  } else {
    navigate("/products-list");
  }

}, 1000);

    } catch (err) {
      console.error(err);
      dismiss(loadingId);
      const msg = err?.response?.data?.message || "Invalid email or password.";
      show(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── GOOGLE LOGIN ── */
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (loading) return;
      setLoading(true);

      const loadingId = show("Connecting with Google…", "loading");

      try {
        // 1. Fetch user info from Google
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        if (!userInfoRes.ok) throw new Error("Failed to fetch Google user info");

        const userData = await userInfoRes.json();

        // 2. Send to your backend
        const backendRes = await fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email:   userData.email,
            name:    userData.name,
            picture: userData.picture,
          }),
        });

        // 3. Parse JSON — note: fetch returns Response, NOT axios. Use .json() not .data
        const data = await backendRes.json();

        if (!data?.token) throw new Error(data?.message || "Authentication failed");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        window.dispatchEvent(new Event("storage"));

        dismiss(loadingId);
        show(`Welcome, ${data.user?.name?.split(" ")[0] || "there"} !`, "success");

        setTimeout(() => {
  const role = data.user?.role;

  if (
    role === "admin" ||
    role === "Admin" ||
    role === "Super Admin"
  ) {
    window.location.href = "http://localhost:5174/dashboard";
  } else {
    navigate("/products-list");
  }
}, 1000);

      } catch (err) {
        console.error("Google login error:", err);
        dismiss(loadingId);
        show(err.message || "Google sign-in failed. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      show("Google sign-in was cancelled.", "info");
    },
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  /* ── RENDER ── */
  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <div
          className="relative w-full h-screen flex flex-col items-center justify-start overflow-hidden"
  style={{
    background: "var(--color-background)",
    color: "var(--color-text)",
  }}
        onKeyDown={handleKeyDown}
      >
        {/* Background */}
        <img
          src="/assets/LoginPage/LoginBackground.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Logo */}
        <div className="relative mt-3 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="transition duration-300 hover:scale-110 active:scale-95"
          >
            <img src="/assets/LoginPage/LogoSection.svg" alt="Logo" className="w-[300px]" />
          </button>
        </div>

        {/* Card */}
        <div
  className="relative mt-3 rounded-lg p-6 w-[420px] flex flex-col items-center animate-popIn"
  style={{
    background: "var(--color-surface)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
    boxShadow: "var(--shadow-lg)",
  }}
>

          {/* Title */}
          <div className="self-start mb-4">
            <img src="/assets/LoginPage/Container.svg" alt="Login" className="w-[280px] h-auto" />
          </div>

<form autoComplete="off">

          {/* Email */}
          <img src="/assets/LoginPage/LabelEmail.svg" className="w-full h-auto mb-1 self-start" alt="" />
          <div className="relative w-full mb-4">
<input
  type="email"
  name="fake-email"
  autoComplete="new-email"
  value={email}
  onFocus={(e) => {
    setEmailFocused(true);
    e.target.style.background = "var(--color-surface)";
  }}
  onBlur={(e) => {
    setEmailFocused(false);
    e.target.style.background = "var(--color-input-bg)";
  }}
  onChange={(e) => setEmail(e.target.value)}
  disabled={loading}
  placeholder=" "
  className="peer w-full h-[40px] border px-3 rounded transition-colors duration-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-60"
  style={{
    background: "var(--color-input-bg)",
    color: "var(--color-text)",
    borderColor: "var(--color-border)",
  }}
/>
            <label
  className={`absolute left-3 flex items-center gap-2 pointer-events-none top-1/2 -translate-y-1/2 transition-all duration-200 ${
    (emailFocused || email) ? "opacity-0" : "opacity-100"
  }`}
  style={{
    color: "var(--color-text-secondary)",
  }}
>
              <img src="/assets/LoginPage/envelope.svg" className="w-[14px] h-5" alt="" />
              <span>admin@parapharmacy.com</span>
            </label>
          </div>
          </form>

          {/* Password */}
          <img src="/assets/LoginPage/PassLabel.svg" alt="" className="w-[320px] h-auto mb-1 self-start" />
          <div className="relative w-full mb-4">
            {!passFocused && password === "" && (
              <div
  className="absolute inset-0 flex items-center px-3 pointer-events-none shadow-inner rounded"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
                <img src="/assets/LoginPage/lock.svg" alt="" className="w-[15px] h-5 mr-2" />
                <img src="/assets/LoginPage/les8points.svg" alt="" className="h-4" />
              </div>
            )}
<input
  type={showPassword ? "text" : "password"}
  value={password}
  onFocus={(e) => {
    setPassFocused(true);
    e.target.style.background = "var(--color-surface)";
  }}
  onBlur={(e) => {
    setPassFocused(false);
    e.target.style.background = "var(--color-input-bg)";
  }}
  onChange={(e) => setPassword(e.target.value)}
  disabled={loading}
  className="w-full h-[40px] border px-3 rounded transition-colors duration-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-60"
  style={{
    background: "var(--color-input-bg)",
    color: "var(--color-text)",
    borderColor: "var(--color-border)",
  }}
/>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
style={{
  color: "var(--color-text-secondary)",
}}
            >
              <img
                src={showPassword ? "/assets/LoginPage/crossed-eye.svg" : "/assets/LoginPage/eye.svg"}
                alt={showPassword ? "Hide" : "Show"}
                className="w-[16px] h-5"
              />
            </button>
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center w-full mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-3.5 accent-violet-500"
              />
              <img src="/assets/LoginPage/RememberMe.svg" alt="Remember me" className="h-[20px] object-contain" />
            </label>
            <button
              onClick={() => navigate("/forgot-password")}
              className="group flex flex-col items-center focus:outline-none transition duration-300 hover:scale-105 active:scale-95"
            >
              <img src="/assets/LoginPage/ForgotPass.svg" alt="Forgot Password" className="h-[20px] object-contain" />
              <div className="w-0 h-[2px] bg-violet-500 transition-all duration-300 group-hover:w-full" />
            </button>
          </div>

          {/* Sign In */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mb-4 focus:outline-none transition duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <img src="/assets/LoginPage/SignInButton.svg" alt="Sign In" className="w-[300px] h-[45px] object-contain" />
          </button>

          {/* Sign Up */}
          <button
            onClick={() => navigate("/register")}
            disabled={loading}
            className="mb-4 focus:outline-none transition duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <img src="/assets/LoginPage/SignUpButton.svg" alt="Sign Up" className="w-[300px] h-[45px] object-contain" />
          </button>

          {/* Divider */}
          <img src="/assets/LoginPage/Divider.svg" alt="" className="w-full h-auto mb-[-8px]" />

          {/* Google */}
          <button
            onClick={() => !loading && loginGoogle()}
            disabled={loading}
            className="mb-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src="/assets/LoginPage/SignGoogle.svg"
              alt="Sign in with Google"
              className="w-[350px] h-[45px] object-contain relative top-[10px] transition duration-300 hover:scale-105 active:scale-95"
            />
          </button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 flex justify-center gap-6">
          <button onClick={() => show("Technical Support — coming soon", "success")}>
            <img src="/assets/LoginPage/TechSuppFooter.svg" alt="Technical Support" className="h-[18px] cursor-pointer transition duration-300 hover:scale-105 active:scale-95" />
          </button>
          <button onClick={() => show("Privacy Policy — coming soon", "success")}>
            <img src="/assets/LoginPage/PrivacyPolicyFooter.svg" alt="Privacy Policy" className="h-[18px] cursor-pointer transition duration-300 hover:scale-105 active:scale-95" />
          </button>
        </div>
      </div>
    </>
  );
}