import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./AppContent";
import ScrollToTop from "./components/ScrollToTop";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider, configureSettingsApi } from "@shared/settings";
import { ThemeProvider } from "@shared/theme";

configureSettingsApi({
  baseUrl: "http://localhost:5000/api",
  getToken: () => localStorage.getItem("token"),
});

export default function AppWrapper() {
  return (
    <Router>
      <SettingsProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <ScrollToTop />
              <AppContent />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </SettingsProvider>
    </Router>
  );
}
