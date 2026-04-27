import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Pro GitHub Pages nastav VITE_BASE (např. "/2p-hive-house/"), pro Netlify/root "/" (default).
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
