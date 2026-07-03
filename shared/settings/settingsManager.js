import { loadSettings, saveSettings } from "./settingsStorage";

export function getSettings() {
  return loadSettings();
}

export function updateSettings(newValues) {
  const current = loadSettings();

  const updated = {
    ...current,
    ...newValues,
  };

  saveSettings(updated);

  return updated;
}

export function resetSettings(defaultSettings) {
  saveSettings(defaultSettings);
  return defaultSettings;
}