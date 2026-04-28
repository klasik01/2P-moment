// Centrální typy pro 2P Moment

export type CookieConsentState = "unset" | "accepted" | "rejected";

export type Promotion = {
  id: string;
  enabled: boolean;
  badge: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  startsAt?: string;
  endsAt?: string;
};

export type SeoMeta = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
};
