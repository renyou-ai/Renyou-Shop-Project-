import { useMemo } from "react";
import { useSettings } from "../settings";
import { convertCurrency } from "./convertCurrency";

export function useCurrency() {
  const { settings } = useSettings();

  const value = useMemo(
    () => ({
      currency: settings.currency,
      rates: settings.rates,
      convert: (amount) => convertCurrency(amount, settings),
    }),
    [settings]
  );

  return value;
}