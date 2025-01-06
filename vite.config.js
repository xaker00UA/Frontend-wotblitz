import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  build: { chunkSizeWarningLimit: 1000 },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/websocket": {
        target: "ws://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/websocket/, ""),
      },
    },
  },
});
