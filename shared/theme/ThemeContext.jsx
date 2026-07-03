import { useEffect, createContext, useMemo, useState } from "react";
import { getTheme, updateTheme, resetTheme } from "./themeManager";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getTheme());

useEffect(() => {
  // set data-theme attribute
  document.documentElement.setAttribute("data-theme", theme.mode);
  
console.log("ThemeContext =>", theme.mode);
console.log("Applying colors:", theme.colors);

  // sync with Tailwind darkMode
  if (theme.mode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // CSS variables
  const root = document.documentElement;
root.style.setProperty("--color-background", theme.colors.background);
root.style.setProperty("--color-surface", theme.colors.surface);
root.style.setProperty("--color-text", theme.colors.text);
root.style.setProperty("--color-text-secondary", theme.colors.textSecondary);
root.style.setProperty("--color-border", theme.colors.border);

root.style.setProperty("--color-surface-hover", theme.colors.surfaceHover);
root.style.setProperty("--color-surface-secondary", theme.colors.surfaceSecondary);

root.style.setProperty("--primary-color", theme.primaryColor);
root.style.setProperty("--accent-color", theme.accentColor);
}, [theme]);


  useEffect(() => {
  document.documentElement.setAttribute(
    "data-theme",
    theme.mode
  );
}, [theme.mode]);

  const setAppTheme = (updates) => {
    const newTheme = updateTheme(updates);
    setTheme(newTheme);
  };

  const restoreTheme = () => {
    const defaultTheme = resetTheme();
    setTheme(defaultTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      setAppTheme,
      restoreTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}