import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  root: ".",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/sign-in": "http://localhost:3000",
      "/users": "http://localhost:3000",
      "/employees": "http://localhost:3000",
    },
  },
  build: {
    outDir: "dist",
  },
});
