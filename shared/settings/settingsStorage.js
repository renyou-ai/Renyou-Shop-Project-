import defaultSettings from "./defaultSettings";
import { SETTINGS_STORAGE_KEY } from "./settingsKeys";

export function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!saved) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...JSON.parse(saved),
    };
  } catch (error) {
    console.error("Failed to load settings:", error);
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}