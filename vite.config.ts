import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1000 },
  server: {
    proxy: {
      "/api": {
        // target: "http://testserver.ua/",
        target: "http://localhost:8000/",
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true,
        secure: false, // для самоподписанных сертификатов или HTTP
      },
    },
  },
});
