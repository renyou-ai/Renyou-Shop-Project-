import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export function useThemeValue() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useThemeValue must be used inside ThemeProvider"
    );
  }

  return context;
}