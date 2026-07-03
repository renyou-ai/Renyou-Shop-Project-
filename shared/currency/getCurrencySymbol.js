const symbols = {
  USD: "$",
  EUR: "€",
  TND: "DT",
};

export function getCurrencySymbol(currency) {
  return symbols[currency] || currency;
}