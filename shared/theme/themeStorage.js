import { DEFAULT_THEME } from "./defaultTheme";
import { THEME_KEYS } from "./themeKeys";

export const loadTheme = () => {
  return {
    mode:
      localStorage.getItem(THEME_KEYS.MODE) ??
      DEFAULT_THEME.mode,

    primaryColor:
      localStorage.getItem(THEME_KEYS.PRIMARY_COLOR) ??
      DEFAULT_THEME.primaryColor,

    accentColor:
      localStorage.getItem(THEME_KEYS.ACCENT_COLOR) ??
      DEFAULT_THEME.accentColor,

    font:
      localStorage.getItem(THEME_KEYS.FONT) ??
      DEFAULT_THEME.font,
  };
};

export const saveTheme = (theme) => {
  localStorage.setItem(THEME_KEYS.MODE, theme.mode);
  localStorage.setItem(
    THEME_KEYS.PRIMARY_COLOR,
    theme.primaryColor
  );
  localStorage.setItem(
    THEME_KEYS.ACCENT_COLOR,
    theme.accentColor
  );
  localStorage.setItem(THEME_KEYS.FONT, theme.font);
};