import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import twemoji from 'twemoji';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotifProvider } from './context/NotifContext.jsx';
import { ToastProvider } from './components/Toast.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';

import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import CustomerProfilePage from './pages/CustomerProfilePage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import PromotionsPage from './pages/PromotionsPage.jsx';
import CouponsPage from './pages/CouponsPage.jsx';
import BrandsPage from './pages/BrandsPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import PageLoader from "./components/PageLoader";
import RouteLoader from "./components/RouteLoader";
import {
  configureSettingsApi,
} from "@shared/settings";

function Spinner() {
  return (
    <div style={{
      minHeight:'100vh',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      background:'var(--bg-base)'
    }}>
      <div style={{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        gap:14
      }}>
        <div
          style={{
            width:36,
            height:36,
            border:'3px solid rgba(82,78,141,0.2)',
            borderTopColor:'var(--primary)',
            borderRadius:'50%',
            animation:'spin 0.7s linear infinite'
          }}
        />
        <div style={{
          fontSize:13,
          color:'var(--text-muted)',
          fontWeight:500
        }}>
          Loading...
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader loading={true} />;

  return user ? children : <Navigate to="/" replace />;
}
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
      <Route path="/customers/:id" element={<ProtectedRoute><CustomerProfilePage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/promotions" element={<ProtectedRoute><PromotionsPage /></ProtectedRoute>} />
      <Route path="/coupons" element={<ProtectedRoute><CouponsPage /></ProtectedRoute>} />
      <Route path="/brands" element={<ProtectedRoute><BrandsPage /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

configureSettingsApi({
  baseUrl: "/api",
  getToken: () => localStorage.getItem("renyou_token"),
});
export default function App() {

  useEffect(() => {
    const parseEmojis = () => {
      twemoji.parse(document.body, {
        folder: 'svg',
        ext: '.svg'
      });
    };

    parseEmojis();

    const observer = new MutationObserver(parseEmojis);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return (
      <>
    <BrowserRouter>    
      <ThemeProvider>
       <RouteLoader />
        <ToastProvider>
          <AuthProvider>
            <NotifProvider>
              <SettingsProvider>
                <AppRoutes />
              </SettingsProvider>
            </NotifProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
      </>
  );
}