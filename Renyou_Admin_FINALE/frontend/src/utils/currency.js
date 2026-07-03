import i18n from '../i18n';
import { formatNumber } from './formatNumber';

export const convertCurrency = (
  amount,
  fromCurrency,
  toCurrency,
  rates = {}
) => {
  if (!amount) return 0;

  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  if (!fromRate || !toRate) {
    return amount;
  }

  const usdAmount = amount / fromRate;

  return usdAmount * toRate;
};

export const formatCurrency = (
  amount,
  currency = 'USD',
  locale = 'en-US'
) => {
  const value = Number(amount || 0);
  const formatted = formatNumber(value.toFixed(3));

  if (currency === 'TND') {
    return i18n.language === 'ar'
      ? `${formatted} د.ت.`
      : `${formatted} DT`;
  }

  if (currency === 'MAD') {
    return i18n.language === 'ar'
      ? `${formatted} د.م.`
      : `${formatted} DH`;
  }

  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ',
    SAR: 'ر.س',
    QAR: 'ر.ق',
    KWD: 'د.ك',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
  };

  const symbol = symbols[currency] || currency;

  return i18n.language === 'ar'
    ? `${formatted} ${symbol}`
    : `${formatted} ${symbol}`;
};

export const formatCurrencyWithIntl = (
  amount,
  currency = 'USD',
  locale = 'en-US'
) => {

  return new Intl.NumberFormat(
    i18n.language === 'ar' ? 'ar-TN' : locale,
    {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }
  ).format(value);
};

export const convertAndFormatCurrency = ({
  amount,
  fromCurrency = 'USD',
  toCurrency = 'USD',
  rates = {},
  locale = 'en-US',
}) => {
  const converted = convertCurrency(
    amount,
    fromCurrency,
    toCurrency,
    rates
  );

  return formatCurrency(
    converted,
    toCurrency,
    locale
  );
};