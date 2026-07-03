const symbols = {
  USD: "$",
  EUR: "€",
  TND: "DT",
};

export function convertCurrency(amount, settings) {
  const currency = settings?.currency || "USD";
  const rates = settings?.rates || { USD: 1 };

  const rate = rates[currency] || 1;
  const converted = Number(amount) * rate;

  const formatted = new Intl.NumberFormat(
    settings?.language || "en",
    {
      style: "currency",
      currency,
    }
  ).format(converted);

  return {
    amount: converted,
    formatted,
    currency,
    symbol: symbols[currency] || "",
  };
  
}