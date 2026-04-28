// Centrální typy pro 2P Pekárna

export type CookieConsentState = "unset" | "accepted" | "rejected";

export type Promotion = {
  id: string;
  enabled: boolean;
  badge: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  startsAt?: string; // ISO date YYYY-MM-DD
  endsAt?: string;
};

export type SeoMeta = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
};

export type ContactData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  titleAccent: string;
  desc: string;
  phone: string;
  phoneLabel: string;
  email: string;
  emailLabel: string;
  address: string;
  addressLabel: string;
  mapEmbedUrl?: string;
};

export type HeroData = {
  visible?: boolean;
  subtitle: string;
  title: string;
  titleAccent: string;
  text: string;
  images: string[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
};

export type HomepageData = {
  seo: SeoMeta;
  hero: HeroData;
  contact: ContactData;
};
