// Centrální typy pro 2P Pekárna

export type CookieConsentState = "unset" | "accepted" | "rejected";

/** Typ dotazu v kontaktním formuláři — odpovídá zadání klienta. */
export type InquiryType =
  | "ubytovani"
  | "sklad"
  | "vyroba"
  | "kancelar"
  | "ostatni";

/** Payload poptávky odesílaný na 2p-api (POST /pekarna/inquiry). */
export type InquiryInput = {
  name: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  message: string;
  /** Honeypot — skryté pole, které vyplní jen bot. Vždy prázdné. */
  website: string;
};

export type SeoMeta = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
};

export type CtaLink = {
  label: string;
  href: string;
};

// --- Hero ---------------------------------------------------------------
export type HeroStat = {
  value: string;
  label: string;
};

export type HeroData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  titleAccent: string;
  titleSuffix?: string;
  text: string;
  image: string;
  imageAlt: string;
  pills?: string[];
  stats: HeroStat[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

// --- Obecná obsahová sekce -----------------------------------------------
/**
 * Univerzální textová sekce — nadpis, text, volitelné odrážky, obrázek a CTA.
 * Pokrývá většinu sekcí ze zadání (představení, ubytování, pro koho,
 * komerční prostory, historie), takže se nemusí psát komponenta na každou.
 */
export type ContentSectionData = {
  visible?: boolean;
  /** Kotva pro odkazy v menu a CTA. */
  anchor?: string;
  eyebrow?: string;
  title: string;
  /** Odstavce přesně tak, jak je dodal klient v zadání. */
  paragraphs: string[];
  bullets?: string[];
  image?: string;
  imageAlt?: string;
  /** Na které straně stojí obrázek na desktopu. Default "right". */
  imageSide?: "left" | "right";
  cta?: CtaLink;
  ctaSecondary?: CtaLink;
};

// --- Byty ----------------------------------------------------------------
export type UnitSpec = {
  icon: string; // jméno ikony v Icon komponentě
  label: string;
};

export type UnitItem = {
  id: string;
  badge: string;
  /** Volitelné — zadání popisy jednotlivých bytů neuvádí. */
  name?: string;
  description?: string;
  image: string;
  imageAlt: string;
  specs?: UnitSpec[];
};

export type UnitsData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  desc: string;
  items: UnitItem[];
};

// --- Galerie -------------------------------------------------------------
export type GalleryImage = {
  src: string;
  alt: string;
};

export type GalleryData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  images: GalleryImage[];
};

// --- Kontakt -------------------------------------------------------------
/**
 * Pouze popisky a nadpisy — samotné hodnoty (telefon, e-mail, adresa,
 * provozovatel) žijí v data/pekarna.json, aby byly na jednom místě
 * pro patičku i kontaktní stránku.
 */
export type ContactData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  desc: string;
  phoneLabel: string;
  emailLabel: string;
  addressLabel: string;
  operatorLabel: string;
  /** Embed URL mapy. Prázdné = mapa se nevykreslí (čeká se na adresu). */
  mapEmbedUrl?: string;
};

// --- Kontaktní formulář ---------------------------------------------------
export type InquiryTypeOption = {
  value: InquiryType;
  label: string;
};

export type InquiryFormData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  desc: string;
  note: string;
  /** Potvrzovací hláška ze zadání klienta. */
  successLabel: string;
  fields: {
    name: string;
    phone: string;
    email: string;
    message: string;
    messagePlaceholder: string;
    inquiryType: string;
  };
  inquiryTypes: InquiryTypeOption[];
};

// --- Rezervace ------------------------------------------------------------
export type ReservationData = {
  seo: SeoMeta;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  /**
   * URL rezervačního systému Previo. Dokud je prázdné, vykreslí se
   * náhradní blok s kontaktem místo iframe.
   */
  previoUrl?: string;
  fallbackTitle: string;
  fallbackText: string;
  ctaPhoneLabel: string;
  ctaEmailLabel: string;
};

// --- Patička --------------------------------------------------------------
export type FooterNavLink = {
  href: string;
  label: string;
};

export type FooterData = {
  brandHeading: string;
  brandText: string;
  contactHeading: string;
  navHeading: string;
  navLinks: FooterNavLink[];
};

// --- Kořeny stránek --------------------------------------------------------
export type HomepageData = {
  seo: SeoMeta;
  hero: HeroData;
  intro: ContentSectionData;
  accommodation: ContentSectionData;
  audience: ContentSectionData;
  commercial: ContentSectionData;
  history: ContentSectionData;
  contactCta: ContentSectionData;
  footer: FooterData;
};

export type AccommodationPageData = {
  seo: SeoMeta;
  intro: ContentSectionData;
  units: UnitsData;
  gallery: GalleryData;
  reservationCta: ContentSectionData;
};

export type CommercialPageData = {
  seo: SeoMeta;
  intro: ContentSectionData;
  contactCta: ContentSectionData;
};

export type AboutPageData = {
  seo: SeoMeta;
  intro: ContentSectionData;
};

export type ContactPageData = {
  seo: SeoMeta;
  contact: ContactData;
  inquiry: InquiryFormData;
};
