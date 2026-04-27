/**
 * Hash routes used across the public site.
 * Kept backend-agnostic so every module can reference them without pulling
 * a whole content module.
 */
export const ROUTES = {
  home: "#uvod",
  services: "#sluzby",
  about: "#o-nas",
  projects: "#reference",
  contact: "#kontakt",
} as const;

export type RouteKey = keyof typeof ROUTES;
