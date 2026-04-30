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

// --- Hero ---------------------------------------------------------------
export type HeroStat = {
  value: string;
  label: string;
};

export type HeroData = {
  visible?: boolean;
  eyebrow: string;
  subtitle: string;
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

// --- About ---------------------------------------------------------------
export type AboutData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  features: string[];
};

// --- Apartments ----------------------------------------------------------
export type ApartmentSpec = {
  icon: string; // jméno ikony v Icon komponentě
  label: string;
};

export type ApartmentItem = {
  id: string;
  badge: string;       // "Apartmán 01"
  name: string;        // "První patro vlevo"
  description: string;
  image: string;
  imageAlt: string;
  specs: ApartmentSpec[];
};

export type CommercialBlock = {
  visible?: boolean;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

export type ApartmentsData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  desc: string;
  items: ApartmentItem[];
  commercial: CommercialBlock;
};

// --- Gallery -------------------------------------------------------------
export type GalleryImage = {
  src: string;
  alt: string;
};

export type GalleryData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  desc: string;
  images: GalleryImage[];
};

// --- Nearby --------------------------------------------------------------
export type NearbyItem = {
  icon: string;
  title: string;
  text: string;
  distance: string;
};

export type NearbyData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  desc: string;
  items: NearbyItem[];
};

// --- Inquiry form --------------------------------------------------------
export type InquiryFormData = {
  visible?: boolean;
  eyebrow: string;
  title: string;
  desc: string;
  note: string;
  submitLabel: string;
  successLabel: string;
  fields: {
    name: string;
    email: string;
    phone: string;
    people: string;
    dateFrom: string;
    dateTo: string;
    rentalType: string;
    rentalShort: string;
    rentalLong: string;
    message: string;
    messagePlaceholder: string;
  };
};

// --- Footer --------------------------------------------------------------
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

// --- Page root ------------------------------------------------------------
export type HomepageData = {
  seo: SeoMeta;
  hero: HeroData;
  about: AboutData;
  apartments: ApartmentsData;
  gallery: GalleryData;
  nearby: NearbyData;
  inquiry: InquiryFormData;
  footer: FooterData;
  contact: ContactData;
};
