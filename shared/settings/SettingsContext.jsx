import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import i18n from "i18next";

import defaultSettings from "./defaultSettings";
import { loadSettings, saveSettings as cacheSettings } from "./settingsStorage";
import { fetchUserSettings, saveUserSettings } from "./settingsApi";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...loadSettings(),
  }));
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
const remote = await fetchUserSettings();

const normalized = {
  ...remote,
  color: remote.themeColor ?? remote.color,
  theme: remote.darkMode ? "dark" : "light",
};

const merged = {
  ...defaultSettings,
  ...normalized,
};

if (cancelled) return;

setSettings(merged);
cacheSettings(merged);
setSyncError(null);

      } catch (err) {

        console.error("[SettingsProvider] Failed to load store settings:", err.message);
        setSyncError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language]);

  useEffect(() => {
    document.documentElement.dir = settings.rtl ? "rtl" : "ltr";
    document.documentElement.lang = settings.language;
  }, [settings.rtl, settings.language]);

  useEffect(() => {

    const isDark = typeof settings.darkMode === "boolean"
      ? settings.darkMode
      : settings.theme === "dark";

    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    console.log("SettingsContext =>", document.documentElement.dataset.theme);
    document.documentElement.classList.toggle("dark", isDark);
  }, [settings.theme, settings.darkMode]);

  useEffect(() => {
    if (settings.color) {
      document.documentElement.style.setProperty("--theme-color", settings.color);
    }
  }, [settings.color]);

  useEffect(() => {
    if (settings.themeColor) {
      document.documentElement.style.setProperty("--accent", settings.themeColor);
    }
  }, [settings.themeColor]);

  useEffect(() => {
    if (settings.currency) {
      document.documentElement.dataset.currency = settings.currency;
    }
  }, [settings.currency]);

  useEffect(() => {
    if (settings.rates) {
      window.__RENYOU_RATES__ = settings.rates;
    }
  }, [settings.rates]);

  const update = useCallback(async (values) => {
    const previous = settings;
    const optimistic = { ...settings, ...values };

    setSettings(optimistic);
    cacheSettings(optimistic);

    try {
const persisted = await saveUserSettings(values);

const normalized = {
  ...persisted,
  color: persisted.themeColor ?? persisted.color,
  theme: persisted.darkMode ? "dark" : "light",
};

const merged = {
  ...defaultSettings,
  ...normalized,
};
      setSettings(merged);
      cacheSettings(merged);
      setSyncError(null);
      return merged;
    } catch (err) {

      console.error("[SettingsProvider] Failed to save store settings:", err.message);
      setSettings(previous);
      cacheSettings(previous);
      setSyncError(err.message);
      throw err;
    }
  }, [settings]);

  const reset = useCallback(async () => {
    return update(defaultSettings);
  }, [update]);

  const refresh = useCallback(async () => {
    try {
const remote = await fetchUserSettings();

const normalized = {
  ...remote,
  color: remote.themeColor ?? remote.color,
  theme: remote.darkMode ? "dark" : "light",
};

const merged = {
  ...defaultSettings,
  ...normalized,
};
      setSettings(merged);
      cacheSettings(merged);
      setSyncError(null);
      return merged;
    } catch (err) {
      setSyncError(err.message);
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({
      settings,
      loading,
      syncError,
      updateSettings: update,
      resetSettings: reset,
      refreshSettings: refresh,
    }),
    [settings, loading, syncError, update, reset, refresh]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}
