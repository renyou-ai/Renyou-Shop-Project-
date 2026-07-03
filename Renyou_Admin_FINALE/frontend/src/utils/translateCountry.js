import { countries } from "../locales/countries";
import i18n from "../i18n";

export const translateCountry = (country) => {
  const lang = i18n.language || "en";

  return (
    countries[country]?.[lang] ||
    countries[country]?.en ||
    country
  );
};