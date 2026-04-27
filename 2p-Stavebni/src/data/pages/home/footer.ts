import type { FooterContent } from "../../../types/content";
import { contacts, registeredAddressLine } from "../../contacts";
import { footerLegalLine } from "../../legal";
import { socials } from "../../socials";

/**
 * Datum poslední obsahové/SEO aktualizace webu. Držíme ho v konfiguraci
 * (ne v buildu), abychom uměli rozlišit "aktualizaci textů" od "nasazení
 * nové verze aplikace". Formát YYYY-MM-DD se shoduje se sitemap.xml
 * `lastmod` a je přímo konzumovatelný v <time datetime="…"> HTML prvku.
 */
export const SITE_LAST_UPDATED = "2026-04-17";

export const footer: FooterContent = {
  description:
    "Stavíme s vášní a zodpovědností. Přinášíme inovativní řešení, která překračují očekávání investorů.",
  phone: contacts.phone,
  email: contacts.email,
  address: registeredAddressLine,
  copyright: "© 2026 2P Stavební s.r.o. Všechna práva vyhrazena.",
  legal: footerLegalLine,
  lastUpdated: SITE_LAST_UPDATED,
  socials: [...socials],
};
