// ============================================================
// Centrální typy.
//
// Fotky se odkazují přes `MediaId` / `AlbumId` — nikdy cestou
// k souboru. Rozlišení řeší services/media, aby se dalo bez
// zásahu do dat přepnout na API.
// ============================================================

import type { AlbumId, MediaId } from "../services/media";

export type CookieConsentState = "unset" | "accepted" | "rejected";

/** Typ dotazu v kontaktním formuláři — podle zadání klienta. */
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
  ogImageId?: MediaId;
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
  imageId: MediaId;
  stats: HeroStat[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

// --- Obecná obsahová sekce -----------------------------------------------
/**
 * Univerzální textová sekce — nadpis, odstavce, odrážky, obrázek a CTA.
 * Pokrývá většinu sekcí ze zadání, takže se nemusí psát komponenta
 * na každou.
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
  imageId?: MediaId;
  /** Na které straně stojí obrázek na desktopu. Default "right". */
  imageSide?: "left" | "right";
  cta?: CtaLink;
  ctaSecondary?: CtaLink;
};

// --- Byty / prostory -----------------------------------------------------
export type UnitSpec = {
  /** Jméno ikony v komponentě Icon. */
  icon: string;
  label: string;
};

export type UnitItem = {
  id: string;
  badge: string;
  /** Volitelné — zadání popisy jednotlivých bytů neuvádí. */
  name?: string;
  description?: string;
  imageId: MediaId;
  /** Album pro galerii v detailu. */
  albumId?: AlbumId;
  /** Vybavení. Prázdné, dokud ho klient nedodá. */
  equipment?: UnitSpec[];
};

export type UnitsData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  desc: string;
  items: UnitItem[];
};

// --- Galerie -------------------------------------------------------------
export type GallerySectionData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  albumId: AlbumId;
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
  /** Popisek odkazu „otevřít v mapách“ pod mapou. */
  mapLinkLabel: string;
  /**
   * Ruční override embed URL mapy. Prázdné = mapa se odvodí z adresy
   * v pekarna.json. Když není ani adresa, mapa se nevykreslí.
   */
  mapEmbedUrl?: string;
};

// --- Poptávka e-mailem ----------------------------------------------------
export type InquiryTypeOption = {
  value: InquiryType;
  label: string;
};

/**
 * Dokud neběží backend (GCP + relay), poptávka se neposílá formulářem,
 * ale otevře e-mailový program uživatele přes mailto s předvyplněným
 * příjemcem, předmětem a tělem. Adresát je e-mail z pekarna.json.
 */
export type InquiryEmailData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  desc: string;
  note: string;
  buttonLabel: string;
  callLabel: string;
  /** Základ předmětu; k němu se podle ?typ= připojí druh poptávky. */
  subjectBase: string;
  /** Šablona těla s placeholderem {typ}. */
  bodyTemplate: string;
  /** Popisky druhů poptávky — pro odvození předmětu a těla z ?typ=. */
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
  gallery: GallerySectionData;
  reservationCta: ContentSectionData;
};

export type CommercialPageData = {
  seo: SeoMeta;
  intro: ContentSectionData;
  gallery: GallerySectionData;
  contactCta: ContentSectionData;
};

export type AboutPageData = {
  seo: SeoMeta;
  intro: ContentSectionData;
};

export type ContactPageData = {
  seo: SeoMeta;
  contact: ContactData;
  inquiry: InquiryEmailData;
};
