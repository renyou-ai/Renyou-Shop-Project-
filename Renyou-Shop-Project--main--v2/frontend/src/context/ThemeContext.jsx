import { createContext, useContext, useCallback, useMemo } from 'react'
import { useSettings } from '@shared/settings'

export const THEME_COLORS = [
  { id:'violet',  hex:'#7C3AED' },
  { id:'blue',    hex:'#2563EB' },
  { id:'emerald', hex:'#059669' },
  { id:'rose',    hex:'#E11D48' },
  { id:'amber',   hex:'#D97706' },
  { id:'pink',    hex:'#DB2777' },
  { id:'cyan',    hex:'#0891B2' },
  { id:'indigo',  hex:'#4F46E5' },
]

export const LANGUAGES = [
  { code:'en', label:'English',  flag:'🇬🇧' },
  { code:'fr', label:'Français', flag:'🇫🇷' },
  { code:'ar', label:'العربية',  flag:'🇹🇳' },
  { code:'es', label:'Español',  flag:'🇪🇸' },
  { code:'de', label:'Deutsch',  flag:'🇩🇪' },
]

export const CURRENCIES = [
  { code:'USD', label:'US Dollar',        symbol:'$'  },
  { code:'EUR', label:'Euro',             symbol:'€'  },
  { code:'TND', label:'Tunisian Dinar',   symbol:'DT' },
  { code:'GBP', label:'British Pound',    symbol:'£'  },
  { code:'MAD', label:'Moroccan Dirham',  symbol:'DH' },
  { code:'CAD', label:'Canadian Dollar',  symbol:'$'  },
  { code:'AUD', label:'Australian Dollar',symbol:'$'  },
]

const ThemeContext = createContext(null)

/**
 * ThemeProvider — NOTE: this no longer owns any state. It just re-exposes
 * the shared SettingsContext under the old `useTheme()` shape. It must be
 * rendered INSIDE `@shared/settings`'s `SettingsProvider` (already the
 * case in `AppWrapper.jsx`).
 */
export function ThemeProvider({ children }) {
  return children;
}

export const useTheme = () => {
  const { settings, updateSettings } = useSettings();

  // `darkMode` is the backend field name (see Settings.js model);
  // keep exposing it as `dark` for backward compatibility with existing
  // consumers (Settings.jsx uses `dark`/`toggleDark`).
  const dark     = settings.darkMode ?? false;
  const color    = settings.themeColor || '#7C3AED';
  const language = settings.language || 'en';
  const currency = settings.currency || 'USD';

  const update = useCallback((patch) => {
    // Map the old shorthand keys (`dark`, `color`) to the backend's actual
    // field names (`darkMode`, `themeColor`) before persisting.
    const mapped = { ...patch };
    if ('dark' in mapped)  { mapped.darkMode   = mapped.dark;  delete mapped.dark;  }
    if ('color' in mapped) { mapped.themeColor = mapped.color; delete mapped.color; }
    return updateSettings(mapped);
  }, [updateSettings]);

  const toggleDark = useCallback(() => {
    return updateSettings({ darkMode: !dark });
  }, [updateSettings, dark]);

  const currencyInfo = useMemo(
    () => CURRENCIES.find(c => c.code === currency) || CURRENCIES[0],
    [currency]
  );

  return { dark, color, language, currency, update, toggleDark, currencyInfo };
}
