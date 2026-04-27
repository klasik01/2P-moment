/**
 * Company identity (name, logos, brand colors if needed).
 * Single source of truth used across the site.
 *
 * Logo paths are prefixed with Vite's `BASE_URL` so they resolve correctly
 * under both:
 *   - Netlify / custom domain → BASE_URL === "/"
 *   - GitHub Pages project site → BASE_URL === "/2p-stavebni-web/"
 *
 * Files are served from `public/assets/images/`.
 */
const BASE = import.meta.env.BASE_URL;

export const company = {
  name: "2P Stavební",
  legalName: "2P Stavební s.r.o.",
  logos: {
    /** Light-on-dark variant – used in navbar, hero, footer. */
    light: `${BASE}assets/images/logo-01.png`,
    /** Full-color variant – used on light backgrounds (loading screen). */
    color: `${BASE}assets/images/logo-02.png`,
  },
} as const;
