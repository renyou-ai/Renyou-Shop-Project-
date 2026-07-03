import { useSettings } from "./SettingsContext";

export default function useSettingsValue() {
  const {
    settings,
    updateSettings,
    resetSettings,
  } = useSettings();

  return {
    ...settings,
    updateSettings,
    resetSettings,
  };
}