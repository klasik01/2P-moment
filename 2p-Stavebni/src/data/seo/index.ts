import { pagesSeo } from "./pages";

/**
 * Backwards-compatible basic SEO shape (title/description) used in
 * SiteContent.seo. Pulled from the home page config so every consumer gets
 * the same canonical values.
 */
export const seo = {
  title: pagesSeo.home.title,
  description: pagesSeo.home.description,
} as const;

export {
  DEFAULT_LANGUAGE,
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_CARD,
  SITE_AUTHOR,
  SITE_URL,
  CONTACT_PHONE_RAW,
} from "./defaults";
export { pagesSeo, canonicalUrl } from "./pages";
export type { PageSeo } from "./pages";
export { faq } from "./faq";
export type { FaqEntry } from "./faq";
export {
  breadcrumbSchema,
  faqSchema,
  homeJsonLdBlocks,
  localBusinessSchema,
  organizationSchema,
  speakableSchema,
  websiteSchema,
} from "./structured-data";
