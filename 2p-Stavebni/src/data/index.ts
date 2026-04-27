import type { SiteContent } from "../types/content";
import { company } from "./company";
import { navigation } from "./navigation";
import { about } from "./pages/home/about";
import { contact } from "./pages/home/contact";
import { diary } from "./pages/home/diary";
import { faq } from "./pages/home/faq";
import { footer } from "./pages/home/footer";
import { hero } from "./pages/home/hero";
import { projects } from "./pages/home/projects";
import { services } from "./pages/home/services";
import { trustBar } from "./pages/home/trust-bar";
import { seo } from "./seo";
import { promotions } from "./shared/promotions";

/**
 * Final, composed SiteContent – assembled from domain-oriented data modules.
 * Consumers (App, components, services) should import `siteContent` from here
 * and never reach into the raw domain modules directly.
 */
export const siteContent: SiteContent = {
  seo,
  company,
  navigation,
  hero,
  trustBar,
  services,
  about,
  projects,
  diary,
  faq,
  contact,
  footer,
  promotions: { items: promotions },
};

// Re-exports for fine-grained imports (analytics, structured data, etc.).
export { company } from "./company";
export { contacts, companyContactLines, officeContactLines, registeredAddressLine } from "./contacts";
export { legal, registrationLine, footerLegalLine } from "./legal";
export { navigation } from "./navigation";
export { seo } from "./seo";
export { socials } from "./socials";
