// Centrální typy pro Hive House

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

export type BreadcrumbItem = {
  /** Zobrazované jméno v drobečkové navigaci. */
  name: string;
  /** Absolutní URL (https://…) nebo relativní (/rezervace). Pokud chybí, je to poslední/aktuální stránka. */
  url?: string;
};

export type SeoMeta = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  /**
   * Drobečková navigace — převede se na JSON-LD BreadcrumbList schema
   * v <head>. Homepage nemá breadcrumby (pro schema.org je v pořádku
   * je vynechat na úvodní stránce).
   */
  breadcrumbs?: BreadcrumbItem[];
};

export type OfferingCard = {
  id: string;
  /** Zobrazit kartu na webu? (default true) */
  visible?: boolean;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  linkHref: string;
  image: string;
  /** Obsah článku pro modal (kliknutí na kartu otevře dialog). */
  article?: OfferingArticle;
};

export type OfferingArticleHighlight = {
  /** Klíč z <Icon />: shield, leaf, sparkles, heartbeat, bee, moon, trees… */
  icon: string;
  text: string;
};

export type OfferingArticle = {
  image: string;
  eyebrow: string;
  title: string;
  lead: string;
  paragraphs: string[];
  highlights?: OfferingArticleHighlight[];
  ctaLabel?: string;
  ctaHref?: string;
};

export type VideoCard = {
  id: string;
  /** Zobrazit kartu na webu? (default true) */
  visible?: boolean;
  title: string;
  eyebrow: string;
  /** YouTube / Vimeo / vlastní MP4. Pokud MP4, komponenta použije <video>. */
  videoUrl: string;
  /** Náhledový obrázek před rozbalením. */
  poster?: string;
};

export type HeroData = {
  /** Zobrazit sekci na webu? (default true) */
  visible?: boolean;
  subtitle: string;
  title: string;
  titleAccent: string;
  text: string;
  images: string[];
  /** Volitelné: URL intro videa (YouTube/Vimeo embed nebo MP4).
   * Pokud vyplněno, logo v hero se chová jako play tlačítko. */
  introVideoUrl?: string;
  introVideoLabel?: string;
  ctaReserveLabel: string;
  ctaReserveHref: string;
  ctaVoucherLabel: string;
};

export type OfferingsData = {
  /** Zobrazit sekci na webu? (default true) */
  visible?: boolean;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionTitleAccent: string;
  sectionDesc: string;
  cards: OfferingCard[];
};

export type VideoSectionData = {
  /** Zobrazit sekci na webu? (default true) */
  visible?: boolean;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionTitleAccent: string;
  sectionDesc: string;
  cards: VideoCard[];
};

export type ApitherapyBenefit = {
  id: string;
  icon: string;
  text: string;
};

export type ApitherapyData = {
  /** Zobrazit sekci na webu? (default true) */
  visible?: boolean;
  eyebrow: string;
  title: string;
  titleAccent: string;
  text1: string;
  text2: string;
  benefits: ApitherapyBenefit[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  imageMain: string;
  imageSmall1?: string;
  imageSmall2?: string;
};

export type ContactData = {
  /** Zobrazit sekci na webu? (default true) */
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

export type HowItWorksStep = {
  id: string;
  number: string;
  icon: string;
  title: string;
  text: string;
};

export type HowItWorksData = {
  /** Zobrazit sekci na webu? (default true) */
  visible?: boolean;
  eyebrow: string;
  title: string;
  titleAccent: string;
  desc: string;
  steps: HowItWorksStep[];
};

export type AboutBlock = {
  id: string;
  icon: string;
  question: string;
  answer: string;
};

export type AboutData = {
  /** Zobrazit sekci na webu? (default true) */
  visible?: boolean;
  eyebrow: string;
  title: string;
  titleAccent: string;
  lead: string;
  blocks: AboutBlock[];
};

export type FishingCtaData = {
  /** Zobrazit sekci na webu? (default true) */
  visible?: boolean;
  eyebrow: string;
  title: string;
  desc: string;
};

export type ReservationData = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  text: string;
  image: string;
  imageAlt: string;
  /** Raw HTML / embed snippet z rezervační služby (iframe, script widget apod.). */
  embedHtml: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export type GalleryData = {
  /** Zobrazit sekci na webu? (default true) */
  visible?: boolean;
  eyebrow: string;
  title: string;
  titleAccent: string;
  desc?: string;
  images: GalleryImage[];
};

export type HomepageData = {
  seo: SeoMeta;
  hero: HeroData;
  howItWorks: HowItWorksData;
  about: AboutData;
  offerings: OfferingsData;
  apitherapy: ApitherapyData;
  videoSection: VideoSectionData;
  gallery: GalleryData;
  fishingCta: FishingCtaData;
  reservation: ReservationData;
  contact: ContactData;
};
