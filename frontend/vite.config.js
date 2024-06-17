import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://midterm-website-for-padn-v4-backend.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
