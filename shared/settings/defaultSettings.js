const defaultSettings = {

  language: "en",
  currency: "USD",
  theme: "light",
  color: "blue",
  rtl: false,

  rates: {
    USD: 1,
    EUR: 0.92,
    TND: 3.1,
  },

  storeName: "Renyou Shop",
  supportEmail: "support@renyou.com",
  baseCurrency: "USD",
  timezone: "UTC",
  themeColor: "#524E8D",
  sidebarWidth: "Normal",
  darkMode: false,

  notifications: {
    stockAlert: true,
    newOrder: true,
    newCustomer: false,
    promotionEnd: true,
  },

  security: {
    twoFactor: false,
    sessionTimeout: "8h",
    ipWhitelist: false,
  },
};

export default defaultSettings;
