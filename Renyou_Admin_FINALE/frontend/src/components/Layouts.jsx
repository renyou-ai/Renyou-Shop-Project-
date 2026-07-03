import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from './Toast.jsx';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { toast } = useToast();

  const { i18n } = useTranslation();

useEffect(() => {
  document.documentElement.dir =
    i18n.language === 'ar' ? 'rtl' : 'ltr';

  document.documentElement.lang = i18n.language;
}, [i18n.language]);

  const getActive = () => {
    const p = location.pathname.split('/')[1] || 'dashboard';
    return p;
  };

  const handleLogout = () => {
  logout();

  window.location.replace('http://localhost:5173/login');
};

  return (
    <div className="app-layout">
      <Sidebar active={getActive()} onNavigate={page => navigate(`/${page}`)} onLogout={handleLogout} />
      <div className="main-content">{children}</div>
    </div>
  );
}

export function SidebarLayout({ children }) { return <Layout>{children}</Layout>; }
export function DashboardLayout({ children }) { return <Layout>{children}</Layout>; }
