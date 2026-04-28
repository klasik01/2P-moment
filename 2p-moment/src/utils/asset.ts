/**
 * Vrátí absolutní cestu k souboru v `public/` s ohledem na deploy base.
 *
 * Vite nastaví `import.meta.env.BASE_URL` podle `vite.config.ts → base`:
 *   - Netlify / root      → "/"
 *   - GitHub Pages subdir → "/2p-moment/"
 *
 * `asset("/main-banner-01.JPG")` tak vygeneruje správné URL bez ohledu
 * na to, kam je web nasazený. Použít VŽDY, když cesta pochází z data.json
 * nebo z JSX stringu (`<img src="/logo.png" />` apod.).
 *
 * Externí URL (`http…`) a `data:` URI vrátí beze změny.
 */
export function asset(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL || "/";
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${clean}`;
}
