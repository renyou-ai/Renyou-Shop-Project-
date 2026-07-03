import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('renyou_dark') === 'true');
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('renyou_primary') || '#524E8D');
  const [sidebarWidth, setSidebarWidth] = useState(() => localStorage.getItem('renyou_sidebar') || 'Normal');

  const applyTheme = (isDark, color, sw) => {
    const root = document.documentElement;
    // Primary color
    const hex = color || primaryColor;
    root.style.setProperty('--primary', hex);
    // Derive light/dark variants
    root.style.setProperty('--primary-light', adjustColor(hex, 20));
    root.style.setProperty('--primary-dark', adjustColor(hex, -20));
    root.style.setProperty('--primary-glow', hexToRgba(hex, 0.18));
    root.style.setProperty('--primary-glow-hover', hexToRgba(hex, 0.28));

    // Dark/Light mode
    const d = isDark ?? dark;
    if (d) {
      root.style.setProperty('--bg-base', '#0F0D1A');
      root.style.setProperty('--bg-surface', '#1A1728');
      root.style.setProperty('--bg-card', '#1E1B2E');
      root.style.setProperty('--bg-hover', '#2A2640');
      root.style.setProperty('--border', 'rgba(139,134,207,0.15)');
      root.style.setProperty('--border-light', 'rgba(139,134,207,0.08)');
      root.style.setProperty('--text-primary', '#F0EEFF');
      root.style.setProperty('--text-secondary', '#A9A6C8');
      root.style.setProperty('--text-muted', '#6B6890');
    } else {
      root.style.setProperty('--bg-base', '#F5F3FF');
      root.style.setProperty('--bg-surface', '#FFFFFF');
      root.style.setProperty('--bg-card', '#FFFFFF');
      root.style.setProperty('--bg-hover', '#EEEAFE');
      root.style.setProperty('--border', 'rgba(82,78,141,0.12)');
      root.style.setProperty('--border-light', 'rgba(82,78,141,0.07)');
      root.style.setProperty('--text-primary', '#1F1B3A');
      root.style.setProperty('--text-secondary', '#5E5A86');
      root.style.setProperty('--text-muted', '#8B87A8');
    }
    // Sidebar width
    const widths = { Compact: '194px', Normal: '224px', Large: '260px' };
    root.style.setProperty('--sidebar-w', widths[sw || sidebarWidth] || '224px');
  };

  useEffect(() => { applyTheme(dark, primaryColor, sidebarWidth); }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('renyou_dark', next);
    applyTheme(next, primaryColor, sidebarWidth);
  };

  const setColor = (c) => {
    setPrimaryColor(c);
    localStorage.setItem('renyou_primary', c);
    applyTheme(dark, c, sidebarWidth);
  };

  const setWidth = (w) => {
    setSidebarWidth(w);
    localStorage.setItem('renyou_sidebar', w);
    applyTheme(dark, primaryColor, w);
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleDark, primaryColor, setColor, sidebarWidth, setWidth }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function adjustColor(hex, amount) {
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(1,3),16)+amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(3,5),16)+amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(5,7),16)+amount));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}
