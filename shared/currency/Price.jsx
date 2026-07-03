import { useSettings } from "@shared/settings";
import { convertCurrency } from "./convertCurrency";

export default function Price({
  value = 0,
  className = "",
  fallback = "-",
  as: Component = "span",
  hideZero = false,
  raw = false,
}) {
  const { settings } = useSettings();

  if (value === null || value === undefined || value === "") {
    return <Component className={className}>{fallback}</Component>;
  }

  const amount = Number(value);
  if (hideZero && amount === 0) {
  return null;
}

  if (Number.isNaN(amount)) {
    return <Component className={className}>{fallback}</Component>;
  }

  const { formatted, amount: convertedAmount } = convertCurrency(amount, settings);

const displayValue = raw
  ? convertedAmount.toFixed(2)
  : formatted;

  return (
    <Component className={className}>
      {displayValue}
    </Component>
  );
}