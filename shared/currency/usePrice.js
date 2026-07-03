import { useCurrency } from "./useCurrency";

export function usePrice(amount) {
  const { convert } = useCurrency();

  return convert(amount);
}