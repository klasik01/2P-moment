import { ROUTES } from "../config/routes";
import type { NavItem } from "../types/content";

/**
 * Top-level navigation. Labels live here; hrefs are shared with ROUTES so
 * there's one source of truth for anchor targets.
 */
export const navigation: NavItem[] = [
  { label: "Úvod", href: ROUTES.home },
  { label: "Služby", href: ROUTES.services },
  { label: "O nás", href: ROUTES.about },
  { label: "Reference", href: ROUTES.projects },
  { label: "Kontakt", href: ROUTES.contact, isButton: true },
];
