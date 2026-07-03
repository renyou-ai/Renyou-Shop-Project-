import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [react(), svgr()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

      // Shared folder
      "@shared": path.resolve(__dirname, "../../shared"),
    },
  },

  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});