import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import ScrollToTop from "./components/ScrollToTop";
import UserLayout from "./layouts/UserLayout";
import { WishlistProvider } from "./context/WishlistContext";
import { NotificationProvider } from "./context/NotificationContext";
import { CartProvider } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeValue } from "@shared/theme";
import PageLoader from "./components/PageLoader";

// Components
import Navbar from "./components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import AIPopup, { AiBubble } from "./components/AIPopup";

// Hook + utils
import { useAiChat } from "./hooks/useAiChat";

// Pages — public
import Home               from "./pages/Home";
import Products           from "./pages/Products";
import Login              from "./pages/Login";
import Register           from "./pages/RegisterPage";
import ForgotPasswordRequest from "./pages/ForgotPasswordRequest";
import PasswordResetForm  from "./pages/ResetPassword";
import Routine            from "./pages/Routine";
import ProductsMatch      from "./pages/ProductsMatch";
import AllProducts        from "./pages/AllProducts";
import ProductsList       from "@/pages/ProductsList";
import AgreementsPage     from "./pages/AgreementsPage";
import OffersPage         from "./pages/OffersPage";
import BrandsPage         from "@/pages/BrandsPage";
import BundleDetails      from "./pages/BundleDetails";

// Pages — diagnostics
import Diagnostics from "@/pages/diagnostics/Diagnostics";

// Pages — user
import ProductDetail from "@/pages/user/ProductDetail";
import Orders        from "@/pages/user/UserOrders";
import Settings      from "@/pages/user/Settings";
import CheckoutPage  from "@/pages/user/CheckoutPage";
import UserProfile   from "@/pages/user/UserProfile";
import WishlistPage  from "@/pages/user/WishlistPage";
import OrderDetails  from "@/pages/user/OrderDetails";
import Cart          from "./pages/user/CartPage";

/* ─────────────────────────────────────────────────────────
   AppInner — all logic + AI system
───────────────────────────────────────────────────────── */
function AppInner() {
  const location    = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const { user }    = useAuth();
  const { theme } = useThemeValue();
  const [pageLoading, setPageLoading] = useState(false);

  // ── AI window state (same as original) ──────────────
  const [aiOpen,      setAiOpen]      = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMobile,    setIsMobile]    = useState(false);
  const [dragging,    setDragging]    = useState(false);
  const [position,    setPosition]    = useState({ x: 20, y: 120 });
  const [popupPosition, setPopupPosition] = useState({ x: 20, y: 120 });

  // Kept for Navbar compatibility (Navbar sets popupPosition on AI button click)
  // FIX: was two separate states doing the same thing — unified to popupPosition only
  const finalPosition = isMaximized || isMobile ? { x: 0, y: 0 } : popupPosition;

  // ── Chat logic — delegated to hook ──────────────────
  const chat = useAiChat({ user });

  // ── Responsive ──────────────────────────────────────
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  // Auto-maximize on mobile when AI opens
  useEffect(() => {
    if (isMobile && aiOpen) setIsMaximized(true);
    else if (!isMobile)     setIsMaximized(false);
  }, [isMobile, aiOpen]);

  // ESC closes popup
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setAiOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Drag system (same as original, cleaned) ──────────
  const dragRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging) return;
      setPopupPosition((prev) => ({
        x: Math.max(10, Math.min(prev.x + e.movementX, window.innerWidth  - 420)),
        y: Math.max(10, Math.min(prev.y + e.movementY, window.innerHeight - 590)),
      }));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [dragging]);

  // ── Minimize handler (same animation as original) ────
  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
    setIsMaximized(false);
  }, []);

  const handleToggleMaximize = useCallback(() => {
    setIsMaximized(v => !v);
    setIsMinimized(false);
  }, []);

  const handleDragStart = useCallback(() => {
    if (!isMobile) setDragging(true);
  }, [isMobile]);

useEffect(() => {
  setPageLoading(true);

  requestAnimationFrame(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  });
}, [location.key]);

  // ── Open AI from Navbar ──────────────────────────────
  const handleAiOpen = useCallback((pos) => {
    if (pos) setPopupPosition(pos);
    setIsMinimized(false);
    setAiOpen(true);
  }, []);

  return (
    <>
    <div
      style={{
        background: theme.colors.background,
        color: theme.colors.text,
        minHeight: "100vh",
        transition: "all .35s ease",
      }}
    >
      <ScrollToTop />
        <PageLoader loading={pageLoading} />

      {/* ── Navbar ── */}
      {!isDashboard && (
        <Navbar
          setAiOpen={setAiOpen}
          setPopupPosition={setPopupPosition}
          setIsMinimized={setIsMinimized}
          setIsMaximized={setIsMaximized}
          aiOpen={aiOpen}
        />
      )}

      {/* ── Routes ── */}
      <Routes>
        {/* Public */}
        <Route path="/"                  element={<Home />} />
        <Route path="/home"              element={<Home />} />
        <Route path="/products"          element={<Products />} />
        <Route path="/products/:id"      element={<ProductDetail />} />
        <Route path="/cart"              element={<Cart />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/forgot-password"   element={<ForgotPasswordRequest />} />
        <Route path="/reset-password"    element={<PasswordResetForm />} />
        <Route path="/products-match"    element={<ProductsMatch />} />
        <Route path="/all-products"      element={<AllProducts />} />
        <Route path="/products-list"     element={<ProductsList />} />
        <Route path="/brands"            element={<BrandsPage />} />
        <Route path="/agreements"        element={<AgreementsPage />} />
        <Route path="/offers"            element={<OffersPage />} />
        <Route path="/bundles/:id"       element={<BundleDetails />} />

        {/* Protected diagnostics */}
        <Route path="/diagnostics" element={<ProtectedRoute><Diagnostics /></ProtectedRoute>} />
        <Route path="/routine"     element={<ProtectedRoute><Routine /></ProtectedRoute>} />

        {/* User nested routes */}
        <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
          <Route path="profile"       element={<UserProfile />} />
          <Route path="wishlist"      element={<WishlistPage />} />
          <Route path="products"      element={<ProductsList />} />
          <Route path="products/:id"  element={<ProductDetail />} />
          <Route path="orders"        element={<Orders />} />
          <Route path="orders/:id"    element={<OrderDetails />} />
          <Route path="settings"      element={<Settings />} />
          <Route path="cart"          element={<Cart />} />
          <Route path="checkout"      element={<CheckoutPage />} />
        </Route>

        {/* Dashboard nested routes */}



        <Route path="*" element={<Home />} />
      </Routes>

      {/* ── AI Popup Premium ── */}
      <AIPopup
        aiOpen={aiOpen}
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        isMobile={isMobile}
        position={finalPosition}
        dragging={dragging}
        setAiOpen={setAiOpen}
        onMinimize={handleMinimize}
        onToggleMaximize={handleToggleMaximize}
        onDragStart={handleDragStart}
        // Chat props from hook
        messages={chat.messages}
        inputValue={chat.inputValue}
        setInputValue={chat.setInputValue}
        isTyping={chat.isTyping}
        isGenerating={chat.isGenerating}
        displayedText={chat.displayedText}
        copiedIndex={chat.copiedIndex}
        messagesEndRef={chat.messagesEndRef}
        containerRef={chat.containerRef}
        onSend={chat.handleSendMessage}
        onStop={chat.handleStop}
        onClear={chat.handleClearChat}
        onCopy={chat.handleCopy}
      />

      {/* ── Bubble (minimized state) ── */}
      <AnimatePresence>
        {aiOpen && isMinimized && (
          <AiBubble
            onClick={() => {
              setIsMinimized(false);
              setAiOpen(true);
            }}
          />
        )}
      </AnimatePresence>
      </div>
    </>
  );
}

export default function AppContent() {
  return (
    <CartProvider>
      <WishlistProvider>
        <NotificationProvider>
          <GoogleOAuthProvider clientId="363340741902-q9pp9pbobqh8tjg1o5hunbk0jkdrfq9u.apps.googleusercontent.com">
            <AppInner />
          </GoogleOAuthProvider>
        </NotificationProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
