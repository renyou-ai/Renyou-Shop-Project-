import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';
import {
  convertCurrency as convertAmount
} from '../utils/currency';
import i18n from '../i18n';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {

const { user, loading } = useAuth();

  const [settings, setSettings] = useState(null);
  const [rates, setRates] = useState({});

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRates = async () => {
    try {
      const res = await fetch(
        'https://open.er-api.com/v6/latest/USD'
      );

      const data = await res.json();

      if (data?.result === 'success' && data?.rates) {
  setRates(data.rates);
}
    } catch (err) {
      console.error('Failed to load exchange rates:', err);
    }
  };

  useEffect(() => {
  loadRates();

  if (!loading && user) {
    loadSettings();
  }
}, [user, loading]);

  useEffect(() => {
  if (settings?.language) {
    i18n.changeLanguage(settings.language);
  }
}, [settings?.language]);

useEffect(() => {
  if (!settings?.language) return;

  i18n.changeLanguage(settings.language);

  document.documentElement.dir =
    settings.language === 'ar'
      ? 'rtl'
      : 'ltr';

}, [settings?.language]);

  const convertCurrency = (amount) => {
  if (amount == null) return 0;

  return convertAmount(
    amount,
    settings?.baseCurrency || 'USD',
    settings?.currency || 'USD',
    rates
  );
};

  return (
    <SettingsContext.Provider
      value={{
        settings,
        rates,
        convertCurrency,
        reloadSettings: loadSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);