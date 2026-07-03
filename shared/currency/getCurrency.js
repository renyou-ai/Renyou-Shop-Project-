import { currencies } from "./currencies";

export function getCurrency(code) {
  return currencies.find((currency) => currency.code === code) || null;
}