import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Pro GitHub Pages nastav VITE_BASE (např. "/2p-pekarna/"), pro Netlify/root "/" (default).
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base,
  envDir: resolve(__dirname, ".."),
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
