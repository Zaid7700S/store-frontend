import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7185",
        changeOrigin: true,
        secure: false,
      },
      "/chathub": {
        target: "https://localhost:7185",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [tailwindcss(), react()],
});