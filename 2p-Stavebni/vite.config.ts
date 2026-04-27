import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Build target detection.
 *
 * - `DEPLOY_TARGET=github-pages` (explicit opt-in) → project-site subpath.
 * - Legacy fallback: the old GitHub Pages workflow set only `GITHUB_ACTIONS`.
 * - Everything else (Netlify, local dev, `npm run preview`) → root.
 */
function resolveBase(): string {
  const target = process.env.DEPLOY_TARGET;
  if (target === "github-pages") return "/2p-stavebni-web/";

  if (process.env.GITHUB_ACTIONS && target !== "netlify") {
    return "/2p-stavebni-web/";
  }

  return "/";
}

export default defineConfig(({ mode }) => {
  // Make the resolved target visible to the client via import.meta.env.
  const env = loadEnv(mode, process.cwd(), "");
  const base = resolveBase();

  return {
    base,
    plugins: [react()],
    define: {
      __DEPLOY_TARGET__: JSON.stringify(
        process.env.DEPLOY_TARGET ?? env.DEPLOY_TARGET ?? "local",
      ),
    },
    build: {
      sourcemap: false,
      target: "es2020",
    },
  };
});
