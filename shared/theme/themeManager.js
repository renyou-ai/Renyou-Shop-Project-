import {
  DEFAULT_THEME,
  LIGHT_COLORS,
  DARK_COLORS,
} from "./defaultTheme";
import { loadTheme, saveTheme } from "./themeStorage";

export const getTheme = () => {
  const savedTheme = loadTheme();

  const theme = {
    ...DEFAULT_THEME,
    ...savedTheme,
  };

  theme.colors =
    theme.mode === "dark"
      ? DARK_COLORS
      : LIGHT_COLORS;

  return theme;
};

export const updateTheme = (updates) => {
  const currentTheme = getTheme();

  const newTheme = {
    ...currentTheme,
    ...updates,
  };

  newTheme.colors =
    newTheme.mode === "dark"
      ? DARK_COLORS
      : LIGHT_COLORS;

  saveTheme(newTheme);

  return newTheme;
};

export const resetTheme = () => {
  saveTheme(DEFAULT_THEME);

  return DEFAULT_THEME;
};